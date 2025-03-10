import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "../activities";
import {Recipient} from "../../recipient";
import {formatMinutes} from "../utils";

/**
 * Proxy activities from the activities module.
 */
const { fetchTrafficDelay, generateAIMessage, sendNotification } = proxyActivities<typeof activities>({
  startToCloseTimeout: "10s",
});

/**
 * Temporal workflow for monitoring freight delay and sending notifications.
 * @param {string} origin - The origin location.
 * @param {string} destination - The destination location.
 * @param {number} threshold - The threshold value in minutes to check the delay and generate an AI message if exceeded.
 * @param {boolean} notify - Whether to notify the recipient.
 * @param {string} [recipientType] - The type of recipient notification ("email" or "sms").
 * @param {Recipient} recipient - The recipient's information (email or phone).
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
export const freightNotificationWorkflow = async (
  origin: string,
  destination: string,
  threshold: number,
  notify: boolean,
  recipientType?: string,
  recipient?: Recipient
) => {
  // Step 1: Fetch traffic delay
  const delay = await fetchTrafficDelay(origin, destination);

  // Step 2: Check if delay exceeds threshold
  if (delay < threshold) {
    console.log(`Freight delay for ${origin} to ${destination} is less than ${threshold} minutes threshold mins `)
    return;
  }

  console.log(`Significant delay for ${origin} to ${destination} detected: ${formatMinutes(delay)} minutes. Generating notification...`);

  // Step 3: Generate AI delay message
  const message = await generateAIMessage(delay);

  // Step 4: Send notification via Email or SMS
    if (delay > threshold && notify && recipientType && recipient) {
    await sendNotification(recipientType, recipient, `Freight Delay Notification: ${origin} to ${destination}`, message);
    console.log(`Notification sent successfully via ${recipientType}.`);
  } else {
    console.log(` Notifications are disabled. Skipping.`);
  }
}
