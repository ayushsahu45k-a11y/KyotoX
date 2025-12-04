import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is not set in environment");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function sendMessageToGemini(userMessage: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(userMessage);

    return result.response.text();
  } catch (err) {
    console.error("Gemini API ERROR:", err);
    throw new Error("GEMINI_FAILED");
  }
}
