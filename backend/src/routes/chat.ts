import express from "express";
import { sendMessageToGemini } from "../services/geminiService";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message required (string)" });
    }

    console.info("CHAT: received message:", message.slice(0, 300));

    const reply = await sendMessageToGemini(message);

    console.info("CHAT: reply (truncated):", (reply || "").slice(0, 500));

    return res.json({ reply });
  } catch (error: any) {
    console.error("CHAT ROUTE ERROR =", error);
    return res.status(500).json({ error: "Gemini or server error" });
  }
});

export default router;
