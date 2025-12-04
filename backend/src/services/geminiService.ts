import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function sendMessageToGemini(message: string) {
  try {
    // Correct model for new SDK
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
    });

    // Correct request format
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    return result.response.text();

  } catch (err) {
    console.error("Gemini API ERROR:", err);
    throw new Error("GEMINI_FAILED");
  }
}
