import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function sendMessageToGemini(message: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    return result.response.text();

  } catch (err: any) {
    console.error("Gemini API ERROR:", err);
    return "⚠️ Gemini API failed. Check your API key.";
  }
}
