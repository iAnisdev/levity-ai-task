import dotenv from "dotenv";
/* 
    Load the environment variables from the .env file
    if the file is not found, it will not throw an error
    but will silently ignore it.

    Expected environment variables:
    - MAPBOX_ACCESS_TOKEN
    - MAPBOX_URL
    - OPENAI_API_KEY
    - OPENAI_API_URL
*/

dotenv.config();


import { fetchTrafficDelay } from "./src/fetchTrafficInfo";
import { generateAIMessage } from "./src/generateAIMessage";

/**
 * function to check freight delay  between two locations and generate AI message if delay is greater than threshold
 * @param {string} origin - The origin location.
 * @param {string} destination - The destination location.
 * @param {number} threshold - The threshold value in minutes to check the delay and generate AI message if delay is greater than threshold.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */

async function checkFreightDelay(origin: string, destination: string , threshold: number) : Promise<void> {
    // Check if origin and destination are provided
    if (!origin || !destination) {
        console.error("Missing origin or destination.");
        return;
    }
    console.log("--------------------------------------------------");
    console.log(`Fetching traffic data for ${origin} to ${destination}...`);
    // Fetch the traffic delay
    const delay = await fetchTrafficDelay(origin, destination);
    // check if delay is greater than threshold
    if (delay > threshold) {
        console.log(`Freight delay is greater than ${threshold} minutes.`);
        console.log('Generating AI message...');
        let message = await generateAIMessage(delay);
        console.log(`AI message: ${message}`);
    }
    console.log('--------------------------------------------------');
}

async function main() {
    // Check freight delay for different locations with different thresholds
    await checkFreightDelay("Dublin", "Limerick" , 15);
    await checkFreightDelay("New York", "Los Angeles" , 30);
    await checkFreightDelay("London", "Paris" , 20);
    await checkFreightDelay("Sydney", "Melbourne" , 25);
    await checkFreightDelay("Tokyo", "Osaka" , 10);
    await checkFreightDelay("Beijing", "Shanghai" , 20);
}

main();