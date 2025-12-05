import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.js";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const corsOptions: cors.CorsOptions = {
  origin: FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/chat", chatRouter);

// Generic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err?.stack ?? err);
  const code = err?.statusCode || 500;
  res.status(code).json({
    error: {
      message: err?.message ?? "Internal server error",
      code,
    },
  });
});

const PORT = Number(process.env.PORT || 10000);
app.listen(PORT, () => {
  console.log("🔍 Loaded GEMINI_API_KEY =", process.env.GEMINI_API_KEY ? "SET" : "NOT SET");
  console.log("🔍 FRONTEND_ORIGIN =", process.env.FRONTEND_ORIGIN || FRONTEND_ORIGIN);
  console.log(`🚀 Backend running on port ${PORT}`);
});
