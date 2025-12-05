import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import chatRoute from "./routes/chat";
import dotenv from "dotenv";

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// ------------ CORS FIX (100% WORKING) ------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

// Add FRONTEND_ORIGIN from .env if exists
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

// Final CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server

      const vercelRegex = /\.vercel\.app$/;

      if (allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked CORS Origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// -----------------------------------------------

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API route
app.use("/api/chat", chatRoute);

// PORT
const PORT = Number(process.env.PORT) || 10000;

console.log("🔍 Loaded GEMINI_API_KEY =", process.env.GEMINI_API_KEY ? "SET" : "NOT SET");
console.log("🔍 FRONTEND_ORIGIN =", process.env.FRONTEND_ORIGIN || "NONE (wildcard vercel enabled)");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
