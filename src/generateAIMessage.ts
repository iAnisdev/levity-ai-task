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
        if (!OPENAI_API_KEY || !OPENAI_API_URL) {
            throw new Error("OpenAI API key or url is missing.");
        }

        const prompt = `You are a customer service assistant. Generate a professional, friendly message to notify a customer about a traffic delay of ${formatMinutes(delayMinutes)} minutes. Keep it polite, empathetic and informative, start with "Dear Valuable customer" and end with "Thank you for your understanding!, Best Regards". No need to add any information after this.`;

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

        if (response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content.trim();
        } else {
            console.error("❌ OpenAI API Error: No response received.");
            return "We're experiencing a delay in your delivery. Thank you for your patience!";
        }
    } catch (error) {
        console.error("❌ Error generating AI message:", error);
        return "We're currently facing some traffic delays. We appreciate your understanding!";
    }
}
