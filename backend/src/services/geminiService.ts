import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is not set. Add it in Render → Environment Variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});
    const result = await model.generateContent(message);

    if (result && typeof (result as any).response?.text === "function") {
      return (result as any).response.text();
    }

    return JSON.stringify(result);
  } catch (err: any) {
    console.error("Gemini API ERROR:", err);
    return "⚠️ Gemini API failed. Check GEMINI_API_KEY.";
  }
}
