import sgMail from "@sendgrid/mail";
import twilio from "twilio";
import {Recipient} from "../recipient";

// Load API keys
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/** 
 * Send a notification to a recipient using the specified type.
 * @param {string} recipientType - The type of notification (email or sms).
 * @param {Recipient} recipient - The recipient's information.
 * @param {string} subject - The notification subject.
 * @param {string} message - The notification message.
 */

export async function sendNotification(recipientType: string, recipient: Recipient, subject: string,  message: string) {
    if (recipientType === "email") {
        if (recipient.email) {
            await sendEmailNotification(recipient.email,subject, message);
        } else {
            console.error("Email address is missing.");
        }
    } else if (recipientType === "sms") {
        if (recipient.phone) {
            await sendSmsNotification(recipient.phone, message);
        } else {
            console.error("Phone number is missing.");
        }
    } else {
        console.error("Invalid notification type.");
    }
}

/**
 * Send an email notification using SendGrid.
 * @param {string} to - Recipient's email.
 * @param {string} subject - Email subject.
 * @param {string} message - Email content.
 */

export async function sendEmailNotification(to: string, subject: string, message: string) {
    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
        console.error("SendGrid API key or sender email is missing.");
        return;
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    const email = {
        to,
        from: SENDGRID_FROM_EMAIL,
        subject,
        text: message,
    };

    try {
        await sgMail.send(email);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error sending email:", (error as any).response?.body || error.message);
        } else {
            console.error("Error sending email:", error);
        }
    }
}

/**
 * Send an SMS notification using Twilio.
 * @param {string} to - Recipient's phone number.
 * @param {string} message - SMS content.
 */

export async function sendSmsNotification(to: string, message: string) {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.error("Twilio API credentials are missing.");
        return;
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to,
        });
        console.log(`SMS sent to ${to}`);
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}
