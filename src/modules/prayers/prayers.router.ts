import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createMonthSchedule,
  getMonthSchedules,
  getMonthScheduleById,
  getActiveMonthSchedule,
  setActiveSchedule,
  bulkCreateDays,
  getTodayPrayers,
  createJumuah,
  getJumuahSchedules,
  getActiveJumuah,
} from "./prayers.controller.js";

const router = Router();

// ── Public (Flutter app) ──────────────────────────────────────────────────────
router.get("/:mosqueId/today",    getTodayPrayers);
router.get("/:mosqueId/active",   getActiveMonthSchedule);
router.get("/:mosqueId/schedules", getMonthSchedules);
router.get("/schedule/:scheduleId", getMonthScheduleById);
router.get("/:mosqueId/jumuah",   getJumuahSchedules);
router.get("/:mosqueId/jumuah/active", getActiveJumuah);

// ── Protected (admin only) ────────────────────────────────────────────────────
router.post("/schedule",                        authMiddleware, createMonthSchedule);
router.post("/schedule/:scheduleId/days",       authMiddleware, bulkCreateDays);
router.patch("/schedule/:scheduleId/activate",  authMiddleware, setActiveSchedule);
router.post("/jumuah",                          authMiddleware, createJumuah);

export default router;