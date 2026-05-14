import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  submitQuestion,
  getPublicAnswered,
  getAllQuestions,
  answerQuestion,
  archiveQuestion,
} from "./imam.controller.js";

const router = Router();

// ── Public (Flutter app) ──────────────────────────────────────────────────────
router.post("/:mosqueId/ask",          submitQuestion);
router.get("/:mosqueId/answered",      getPublicAnswered);

// ── Protected (admin only) ────────────────────────────────────────────────────
router.get("/",                        authMiddleware, getAllQuestions);
router.patch("/:id/answer",            authMiddleware, answerQuestion);
router.patch("/:id/archive",           authMiddleware, archiveQuestion);

export default router;