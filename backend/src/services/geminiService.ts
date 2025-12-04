import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure GEMINI_API_KEY is set
const API_KEY = process.env.AIzaSyDX2jtMbd_bx6u1BHGORPuDi4pFWQ_rYXE;

if (!API_KEY) {
  throw new Error(
    "❌ GEMINI_API_KEY is not set. Set it in your environment before starting the server."
  );
}

// Initialize client (SDK expects the API key)
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Sends the user's message to Gemini and returns a plain text reply.
 */
export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);

    console.debug("Gemini raw result:", JSON.stringify(result, null, 2));

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
        if (item?.content?.length) {
          for (const c of item.content) {
            if (typeof c.text === "string" && c.text.trim().length > 0) {
              return c.text;
            }
            if (typeof c === "string" && c.trim().length > 0) return c;
          }
        }
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

    // 4) fallback: stringify small result
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
