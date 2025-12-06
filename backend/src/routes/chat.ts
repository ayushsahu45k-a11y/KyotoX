import { Router } from "express";
import { sendMessageToGemini } from "../services/geminiService.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const reply = await sendMessageToGemini(message, { sessionId });

    return res.json({ reply });
  } catch (err: any) {
    // Map known internal errors to client friendly statuses
    if (err === "GEMINI_FAILED") {
      console.error("CHAT ROUTE ERROR = GEMINI_FAILED");
      return res.status(502).json({ error: "Upstream model error (Gemini). Check logs." });
    }
    next(err);
  }
});

export default router;
