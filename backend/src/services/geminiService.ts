import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateReply(message: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return "⚠️ Missing GEMINI_API_KEY in backend.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    return result.response.text();

  } catch (err) {
    console.error("Gemini API error:", err);
    return "⚠️ Gemini API failed. Check backend logs.";
  }
}
