import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chat";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoute);

// Convert PORT (string) → number
const PORT = Number(process.env.PORT) || 7000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
