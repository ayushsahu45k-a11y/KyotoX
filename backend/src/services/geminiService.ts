/**
 * Minimal wrapper around @google/generative-ai client.
 * Adapt as needed for your actual client usage.
 *
 * This file intentionally catches common API errors (403 leaked key, 404 model missing).
 */

import dotenv from "dotenv";
dotenv.config();

import { GenerativeAI } from "@google/generative-ai"; // adjust import to actual package path if different

// NOTE: adjust this function to your installed library's API if names differ.
// The errors in your logs came from @google/generative-ai vX so adjust accordingly.

const client = new GenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function sendMessageToGemini(prompt: string, opts: any = {}) {
  try {
    // Example usage - adapt to the exact API call your dependency expects.
    // Replace `client.generateText(...)` below with the actual function from your library.
    const response = await client.generateText({
      model: "models/gemini-1.5-mini", // use a model that exists for your API key/version
      prompt,
      // other parameters...
    });

    // If response shape differs, adjust extraction accordingly:
    const text = response?.outputText ?? response?.text ?? (response?.candidates?.[0]?.content ?? null);
    if (!text) throw new Error("Empty response from Gemini");

    return text;
  } catch (err: any) {
    const message = (err?.message ?? String(err)).toLowerCase();
    console.error("Gemini API ERROR:", err?.stack ?? err);

    // Known leaked-key error detected in your logs:
    if (message.includes("reported as leaked") || message.includes("leaked")) {
      // Log friendly message and throw sentinel for route to map to 502/403
      console.error("Gemini API key appears to be leaked/invalid. Regenerate the key and update GEMINI_API_KEY.");
      throw "GEMINI_FAILED";
    }

    // Model not found or version mismatch
    if (message.includes("not found") || message.includes("model") && message.includes("not")) {
      console.error("Gemini model not found or incompatible API version.");
      throw "GEMINI_FAILED";
    }

    // Fallback
    throw err;
  }
}
