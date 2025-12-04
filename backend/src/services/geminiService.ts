

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set. Set it in your environment before starting the server.");
}

// Initialize client (SDK expects the API key)
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Sends the user's message to Gemini and returns a plain text reply.
 * Attempts multiple result shapes (SDKs differ by version).
 */
export async function sendMessageToGemini(message: string): Promise<string> {
  // If API key is missing, don't attempt call — return explicit error string to frontend
  if (!API_KEY) {
    return "⚠️ Server misconfigured: GEMINI_API_KEY missing. Check backend environment.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Pass the user prompt as content. If your SDK requires a different method adjust here.
    const result = await model.generateContent(message);

    // DEBUG: print the raw shape to logs so you can inspect when something is off
    console.debug("Gemini raw result:", JSON.stringify(result, null, 2));

    // Common SDK return patterns — try them in order:

    // 1) result.response.text() — some SDKs wrap a response object with text() helper
    if (result && typeof (result as any).response?.text === "function") {
      try {
        return (result as any).response.text();
      } catch (e) {
        console.warn("response.text() failed:", e);
      }
    }

    // 2) result.output -> array with content pieces
    if ((result as any).output?.length) {
      for (const item of (result as any).output) {
        // content may be an array of pieces
        if (item?.content?.length) {
          for (const c of item.content) {
            if (typeof c.text === "string" && c.text.trim().length > 0) {
              return c.text;
            }
            // sometimes content has "message" or "structured" fields
            if (typeof c === "string" && c.trim().length > 0) return c;
          }
        }
        // also accept item.text
        if (typeof item.text === "string" && item.text.trim().length > 0) {
          return item.text;
        }
      }
    }

    // 3) result.candidates or result[0].text shapes
    if ((result as any).candidates?.length) {
      for (const cand of (result as any).candidates) {
        if (typeof cand.text === "string" && cand.text.trim().length > 0) {
          return cand.text;
        }
      }
    }

    // 4) lastly, try to find any string inside the object (avoid huge outputs)
    const asString = JSON.stringify(result);
    if (asString && asString.length < 2000) {
      return asString;
    }

    return "⚠️ Gemini returned an unexpected shape. Check server logs for raw output.";
  } catch (err: any) {
    console.error("Gemini API ERROR:", err);
    return "⚠️ Gemini API failed. Check GEMINI_API_KEY and backend logs.";
  }
}
