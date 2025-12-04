import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import chatRoute from "./routes/chat";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

// Allow frontend origin(s) to be provided via env var (Render / Vercel)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://kyoto-x-20.vercel.app";

const corsOptions = {
  origin: (origin: any, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g. curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow exact FRONTEND_ORIGIN or any .vercel.app host
    try {
      if (origin === FRONTEND_ORIGIN || /\.vercel\.app$/.test(origin) || origin.startsWith("http://localhost")) {
        return callback(null, true);
      }
    } catch (e) {
      // fall through to deny
    }
    console.warn("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Chat route
app.use("/api/chat", chatRoute);

const PORT = Number(process.env.PORT) || 10000;

console.log("🔍 Loaded GEMINI_API_KEY =", !!process.env.GEMINI_API_KEY ? "SET" : "NOT SET");
console.log("🔍 FRONTEND_ORIGIN =", process.env.FRONTEND_ORIGIN || "default (not set)");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
