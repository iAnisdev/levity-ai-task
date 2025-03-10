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

import { Connection, Client } from "@temporalio/client";
import { freightNotificationWorkflow } from "./src/workflows/freightNotification";

async function main() {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  // Execute the workflow
  await client.workflow.start(freightNotificationWorkflow, {
    taskQueue: "freight-notifications",
    workflowId: `freight-notification-${Date.now()}`,
    args: ["Dublin", "Limerick", 15, true, "email", { email: "recipient@example.com" }],
  });

  // Execute the workflow with different parameters
  await client.workflow.start(freightNotificationWorkflow, {
    taskQueue: "freight-notifications",
    workflowId: `freight-notification-${Date.now()}`,
    args: ["Dublin", "Galway", 15, true, "sms", { phone: "+3531234567" }],
  });

  console.log("Freight delay workflow started!");
}

main().catch((err) => {
  console.error("Workflow execution failed:", err);
});
