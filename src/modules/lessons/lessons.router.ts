import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getActiveLessons,
  getAdminLessons,
  createLesson,
  updateLesson,
  setLessonActive,
  deleteLesson,
} from "./lessons.controller.js";

const router = Router();

// ── Public (Flutter app) ──────────────────────────────────────────────────────
router.get("/admin/all", authMiddleware, getAdminLessons);
router.get("/:mosqueId", getActiveLessons);

// ── Protected (admin only) ────────────────────────────────────────────────────
router.post("/", authMiddleware, createLesson);
router.put("/:id", authMiddleware, updateLesson);
router.patch("/:id/active", authMiddleware, setLessonActive);
router.delete("/:id", authMiddleware, deleteLesson);

export default router;