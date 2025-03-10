import axios from "axios";
import { formatMinutes } from "./utils";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL =  process.env.OPENAI_API_URL

/**
 * Generate a friendly delay message using OpenAI's GPT-4o-mini model.
 * @param {number} delayMinutes - The estimated delay time in minutes.
 * @returns {Promise<string>} - A friendly customer notification message.
 */
export async function generateAIMessage(delayMinutes: number): Promise<string> {
    try {
        // Check if OpenAI API key and URL are provided
        if (!OPENAI_API_KEY || !OPENAI_API_URL) {
            throw new Error("OpenAI API key or url is missing.");
        }

        // Generate a prompt for the AI model to act as a customer service assistant notifying a customer about a traffic delay with a given delay time.
        const prompt = `You are a customer service assistant. Generate a professional, friendly message to notify a customer about a traffic delay of ${formatMinutes(delayMinutes)} minutes. Keep it polite, empathetic and informative, start with "Dear Valuable customer" and end with "Thank you for your understanding!, Best Regards". No need to add any information after this.`;

        // Call the OpenAI API to generate a message based on the prompt
        const response = await axios.post(
            `${OPENAI_API_URL}/v1/chat/completions`,
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
        // Check if the response contains choices and return the generated message
        if (response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content.trim();
        } else {
            console.error("OpenAI API Error: No response received.");
            // Return a default message if no response is received
            return "We're experiencing a delay in your delivery. Thank you for your patience!";
        }
    } catch (error) {
        console.error("Error generating AI message:", error);
        // Return a default message if an error occurs
        return "We're currently facing some traffic delays. We appreciate your understanding!";
    }
}
