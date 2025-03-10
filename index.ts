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
    - SENDGRID_API_KEY
    - SENDGRID_FROM_EMAIL
    - TWILIO_ACCOUNT_SID
    - TWILIO_AUTH_TOKEN
    - TWILIO_PHONE_NUMBER
*/

dotenv.config();

import { fetchTrafficDelay } from "./src/fetchTrafficInfo";
import { generateAIMessage } from "./src/generateAIMessage";
import { sendNotification } from "./src/sendNotifications";
import {Recipient} from "./recipient";


/**
 * Function to check freight delay between two locations and generate AI message if the delay is greater than the threshold.
 * @param {string} origin - The origin location.
 * @param {string} destination - The destination location.
 * @param {number} threshold - The threshold value in minutes to check the delay and generate an AI message if exceeded.
 * @param {boolean} notify - Whether to notify the recipient.
 * @param {string} [recipientType] - The type of recipient notification ("email" or "sms").
 * @param {Recipient} recipient - The recipient's information (email or phone).
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */

async function checkFreightDelay(
    origin: string,
    destination: string,
    threshold: number,
    notify: boolean,
    recipientType?: string,
    recipient?: Recipient
): Promise<void> {

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
    if (delay > threshold && notify && recipientType && recipient) {
        console.log(`Freight delay is greater than ${threshold} minutes.`);
        console.log('Generating AI message...');
        let message = await generateAIMessage(delay);
        await sendNotification(recipientType, recipient, `Freight Delay Notification: ${origin} to ${destination}`, message);
    } else {
        console.log(`Freight delay is less than ${threshold} minutes.`);
    }
    console.log('--------------------------------------------------');
}

async function main() {
    /**
     * Recipient information for email or SMS notification.
     * Update the recipient information with the email or phone number to receive notifications.
     * Phone number must be registered with Twilio for SMS notifications.
     * If you do not want to receive notifications, pass notify as false.
     */
    let recipient: Recipient = {email: "" , phone: ""};
    // Check freight delay for different locations with different thresholds
    await checkFreightDelay("Dublin", "Limerick" , 15 , true , "email" , {email: recipient.email});
    await checkFreightDelay("New York", "Los Angeles" , 30 , true , "sms" , {phone: recipient.phone});
    await checkFreightDelay("London", "Paris" , 20 , true , "email" ,  {email: recipient.email});
    await checkFreightDelay("Sydney", "Melbourne" , 25 , true , "sms" , {phone: recipient.phone});
    await checkFreightDelay("Tokyo", "Osaka" , 10 , true , "email" ,  {email: recipient.email});
    await checkFreightDelay("Beijing", "Shanghai" , 20 , false);
}

main();