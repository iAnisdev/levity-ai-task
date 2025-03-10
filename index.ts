import dotenv from "dotenv";
/* 
    Load the environment variables from the .env file
    if the file is not found, it will not throw an error
    but will silently ignore it.

    Expected environment variables:
    - GOOGLE_MAPS_API_URL
    - GOOGLE_MAPS_API_KEY
*/

dotenv.config();


import { fetchTrafficDelay } from "./src/fetchTrafficInfo";
import { formatMinutes } from "./src/utils";

/**
 * function to check freight delay.
 */
async function checkFreightDelay(origin: string, destination: string) : Promise<void> {
    // Check if origin and destination are provided
    if (!origin || !destination) {
        console.error("Missing origin or destination.");
        return;
    }
    console.log(`Fetching traffic data for ${origin} to ${destination}...`);
    // Fetch the traffic delay
    const delay = await fetchTrafficDelay(origin, destination);
    console.log(`Estimated delay: ${formatMinutes(delay)} minutes.`);
}

async function main() {
    // Check freight delay for different locations
    await checkFreightDelay("Dublin", "Limerick");
    await checkFreightDelay("New York", "Los Angeles");
    await checkFreightDelay("London", "Paris");
}

main();