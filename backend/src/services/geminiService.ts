

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set. Set it in your environment before starting the server.");
}

// Initialize client
const genAI = new GoogleGenerativeAI(API_KEY);

export async function sendMessageToGemini(message: string) {
  try {
    // Use the model you want; adjust if you have a different model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // `generateContent` expects richer params in some SDK versions;
    // we provide a plain prompt string which worked in your prior code.
    const result = await model.generateContent(message);

    // result.response.text() or result.output[0].content[0].text() depending on SDK version
    // we'll try the safer approach with checks:
    if (result && typeof (result as any).response?.text === "function") {
      return (result as any).response.text();
    }

    // fallback attempt at common shape
    if ((result as any).output?.length) {
      const out = (result as any).output;
      // try to find a text piece
      for (const item of out) {
        if (item?.content?.length) {
          for (const c of item.content) {
            if (typeof c.text === "string") return c.text;
          }
        }
      }
    }

    // as ultimate fallback, stringify the full result
    return JSON.stringify(result);

  } catch (err: any) {
    console.error("Gemini API ERROR:", err);
    return "⚠️ Gemini API failed. Check your GEMINI_API_KEY and SDK usage.";
  }
}
