imp// src/server.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import chatRoutes from "./routes/chatRoutes"; // your routes

const app = express();

// Basic middleware
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// Allow CORS - restrict this in production to your frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
app.use(cors({
  origin: FRONTEND_URL,
}));

// Mount routes
app.use("/api/chat", chatRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Render provides PORT
const PORT = Number(process.env.PORT || 7000);
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
