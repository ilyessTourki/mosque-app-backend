import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "./news.controller.js";

const router = Router();

// ── Public (Flutter app) ──────────────────────────────────────────────────────
router.get("/:mosqueId",     getAllNews);
router.get("/post/:id",      getNewsById);

// ── Protected (admin only) ────────────────────────────────────────────────────
router.post("/",             authMiddleware, createNews);
router.put("/:id",           authMiddleware, updateNews);
router.delete("/:id",        authMiddleware, deleteNews);

export default router;