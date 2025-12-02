import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import chatRoute from "./routes/chat";

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

const app = express();
app.use(cors());
app.use(express.json());

// ADD THIS HEALTH ROUTE
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Chat route
app.use("/api/chat", chatRoute);

const PORT = Number(process.env.PORT) || 7000;

console.log("🔍 Loaded GEMINI_API_KEY =", process.env.GEMINI_API_KEY);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
