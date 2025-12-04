import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function sendMessageToGemini(userMessage) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ]
    });

    return result.response.text();
  } catch (err) {
    console.error("Gemini API ERROR", err);
    throw new Error("GEMINI_FAILED");
  }
}
