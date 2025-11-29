import { GoogleGenAI, Chat } from "@google/genai";
import { APP_DATASET } from '../constants';

const API_KEY = process.env.API_KEY;

// Construct the system instruction from the dataset
// explicitly allowing for general conversation.
const SYSTEM_INSTRUCTION = `
You are a highly intelligent and versatile AI assistant embedded within the "${APP_DATASET.productName}".

PRIMARY DIRECTIVE:
1. **Dataset Knowledge**: You have access to the specific dataset below regarding the system/product you are running on. Use this to answer technical questions, troubleshoot, or provide stats accurately.
2. **General Conversation**: You are NOT limited to the dataset. You can engage in any topic of conversation, including general knowledge, coding, creative writing, science, history, and small talk. Be helpful, witty, and conversational.

DATASET (Context):
${JSON.stringify(APP_DATASET, null, 2)}

TONE:
Helpful, confident, and adaptive. 
When discussing the dataset, be precise.
When discussing general topics, be open and engaging.
`;

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeChat = () => {
  if (!API_KEY) {
    console.error("API_KEY is missing");
    return;
  }
  
  try {
    genAI = new GoogleGenAI({ apiKey: API_KEY });
    chatSession = genAI.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  } catch (error) {
    console.error("Failed to initialize KyotoX chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) {
      return "Error: Chat session could not be initialized. Please check your API key.";
    }
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending message to Ayush(higher authority):", error);
    return "I encountered a communication error. Please try again.";
  }
};
