import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function sendMessageToGemini(message: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent(message);
    return result.response.text();

  } catch (err: any) {
    console.error("Gemini API ERROR:", err);
    throw new Error("GEMINI_FAILED");
  }
}
