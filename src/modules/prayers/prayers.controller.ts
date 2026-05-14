import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { prayersService } from "./prayers.service.js";
import {
  createMonthScheduleSchema,
  bulkDayScheduleSchema,
  createJumuahSchema,
} from "./prayers.schema.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { param } from "../../utils/params.js";

// ── Month Schedule ────────────────────────────────────────────────────────────

export const createMonthSchedule = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = createMonthScheduleSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await prayersService.createMonthSchedule(
      req.admin!.mosqueId,
      result.data
    );
    sendSuccess(res, data, "Month schedule created", 201);
  }
);

export const getMonthSchedules = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]!);
    const data = await prayersService.getMonthSchedules(mosqueId);
    sendSuccess(res, data, "Month schedules fetched");
  }
);

export const getMonthScheduleById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await prayersService.getMonthScheduleById(param(req.params["scheduleId"]!));
    sendSuccess(res, data, "Schedule fetched");
  }
);

export const getActiveMonthSchedule = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]!);
    const data = await prayersService.getActiveMonthSchedule(mosqueId);
    sendSuccess(res, data, "Active schedule fetched");
  }
);

export const setActiveSchedule = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await prayersService.setActiveSchedule(
      req.admin!.mosqueId,
      param(req.params["scheduleId"]!)
    );
    sendSuccess(res, data, "Active schedule updated");
  }
);

export const bulkCreateDays = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = bulkDayScheduleSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await prayersService.bulkCreateDays(
      param(req.params["scheduleId"]!),
      result.data
    );
    sendSuccess(res, data, `${data.count} days inserted`, 201);
  }
);

export const getTodayPrayers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]!);
    const data = await prayersService.getTodayPrayers(mosqueId);
    sendSuccess(res, data, "Today's prayers fetched");
  }
);

// ── Jumuah ────────────────────────────────────────────────────────────────────

export const createJumuah = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = createJumuahSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await prayersService.createJumuah(
      req.admin!.mosqueId,
      result.data
    );
    sendSuccess(res, data, "Jumuah schedule created", 201);
  }
);

export const getJumuahSchedules = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]!);
    const data = await prayersService.getJumuahSchedules(mosqueId);
    sendSuccess(res, data, "Jumuah schedules fetched");
  }
);

export const getActiveJumuah = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]!);
    const data = await prayersService.getActiveJumuah(mosqueId);
    sendSuccess(res, data, "Active Jumuah fetched");
  }
);