import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.router.js";
import mosqueRouter from "./modules/mosque/mosque.router.js";
import prayersRouter from "./modules/prayers/prayers.router.js";
import newsRouter from "./modules/news/news.router.js";
import imamRouter from "./modules/imam/imam.router.js";

const app = express();

// ─── Global Middlewares ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Mosque API is running 🕌" });
});

// ─── Routes (we'll add these next) ───────────────────────────────────────────
 app.use("/api/auth",    authRouter);
 app.use("/api/mosque",  mosqueRouter);
 app.use("/api/prayers", prayersRouter);
 app.use("/api/news",    newsRouter);
 app.use("/api/imam",    imamRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`🕌 Mosque API running on http://localhost:${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
});

export default app;