import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyA7l6lrLCHEejfuhhjfikpC2rUO2gOXYRY";

/**
 * Send a message to Gemini using the given character's system instruction.
 *
 * @param {object}   character          – Character object from characters.js
 * @param {Array<{role:string,content:string}>} history – Conversation history
 *        (roles should be 'user' or 'assistant'; greeting is the first assistant msg)
 * @returns {Promise<string>} The model's text response.
 */
export async function sendMessage(character, history) {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
        throw new Error(
            'Gemini API key is not configured. Add your key to the .env file as VITE_GEMINI_API_KEY.'
        );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        systemInstruction: character.systemInstruction,
    });

    // Convert our chat history to the Gemini SDK format.
    // Gemini uses 'user' and 'model' roles.
    const contents = history
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

    const result = await model.generateContent({ contents });
    const response = result.response;
    return response.text();
}
