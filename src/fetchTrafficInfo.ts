import axios from "axios";
import {formatMinutes} from "./utils";

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const MAPBOX_URL = process.env.MAPBOX_URL || "https://api.mapbox.com";

/**
 * Convert a city name to latitude and longitude using Mapbox Geocoding API.
 * @param {string} city - The name of the city (e.g., "Dublin, Ireland").
 * @returns {Promise<string | null>} - Returns "longitude,latitude" as it will be used to fetch traffic info or null if failed.
 */

async function getCoordinates(city: string): Promise<string | null> {
    try {
        // Construct the URL for the Mapbox Geocoding API with the city name
        const url = `${MAPBOX_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
        // Fetch the data from the URL
        const response = await axios.get(url);
        // Extract the data from the response
        const data = response.data;

        // Check if features are found
        if (!data.features || data.features.length === 0) {
            console.error(`Geocoding failed for: ${city}`);
            return null;
        }
        // Extract the longitude and latitude from the first feature
        const [longitude, latitude] = data.features[0].center;
        return `${longitude},${latitude}`;
    } catch (error) {
        console.error(`Error fetching coordinates for ${city}:`, error);
        return null;
    }
}

/**
 * Fetch real-time traffic data and calculate delay time in minutes.
 * @param {string} origin - Name of the origin location.
 * @param {string} destination - Name of the destination location.
 * @returns {Promise<number>} - Estimated delay in minutes.
 */

export async function fetchTrafficDelay(origin: string, destination: string): Promise<number> {
    try {
        // Check if Mapbox API key is set
        if (!MAPBOX_ACCESS_TOKEN) {
            console.error("Mapbox API key is missing.");
            return 0;
        }
        // Fetch coordinates for origin and destination
        const start = await getCoordinates(origin);
        const end = await getCoordinates(destination);

        // Check if coordinates are found for both locations
        if (!start || !end) {
            console.error("Could not fetch coordinates for one or both locations.");
            return 0;
        }

        // Construct the URL for the Mapbox using profile "driving-traffic" to get real-time traffic conditions
        const url = `${MAPBOX_URL}/directions/v5/mapbox/driving-traffic/${start};${end}?access_token=${MAPBOX_ACCESS_TOKEN}&annotations=duration,congestion_numeric`;
        // Fetch the data from the URL
        const response = await axios.get(url);
        // Extract the data from the response
        const data = response.data;

        // Check if routes are found
        if (!data.routes || data.routes.length === 0) {
            console.error("Mapbox API Error: No routes found.");
            return 0;
        }

        // Extract normal and traffic-adjusted travel times
        const route = data.routes[0];
        // Duration is in seconds, convert to minutes
        const normalTravelTime = route.duration / 60; 
        console.log(`Travel Time for ${origin} to ${destination}: ${formatMinutes(normalTravelTime)} mins `);

        // Extract congestion data (values from 0 to 100, higher means more traffic)
        const congestionLevels = route.legs[0]?.annotation?.congestion_numeric || [];
        /* 
        Calculate the average congestion level for the entire route as mapbox returns congestion levels for each segment.
        This is a simple average of all congestion levels along the route.
        */
        const avgCongestion = congestionLevels.length
            ? congestionLevels.reduce((sum: number, val: number) => sum + val, 0) / congestionLevels.length
            : 0;

        // Estimate delay based on congestion level (higher congestion means more delay)
        const delayMinutes = Math.max(0, (avgCongestion / 100) * normalTravelTime);

        return delayMinutes;

    } catch (error) {
        console.error("Error fetching traffic data:", error);
        return 0;
    }
}
