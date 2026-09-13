import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { param } from "../../utils/params.js";
import { sendError, sendSuccess } from "../../utils/response.js";
import {
  createLessonSchema,
  updateLessonSchema,
} from "./lessons.schema.js";
import { lessonsService } from "./lessons.service.js";

export const getActiveLessons = asyncHandler(
  async (req: Request, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]!);
    const data = await lessonsService.getActiveByMosque(mosqueId);

    sendSuccess(res, data, "Active lessons fetched successfully");
  },
);

export const getAdminLessons = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await lessonsService.getAllForAdmin(req.admin!.mosqueId);

    sendSuccess(res, data, "Lessons fetched successfully");
  },
);

export const createLesson = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = createLessonSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }

    const data = await lessonsService.create(
      req.admin!.mosqueId,
      result.data,
    );

    sendSuccess(res, data, "Lesson created", 201);
  },
);

export const updateLesson = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = updateLessonSchema.safeParse(req.body);

    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }

    const data = await lessonsService.update(
      param(req.params["id"]!),
      req.admin!.mosqueId,
      result.data,
    );

    sendSuccess(res, data, "Lesson updated");
  },
);

export const setLessonActive = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const active = req.body?.active;

    if (typeof active !== "boolean") {
      sendError(res, "Validation failed", 400, "active must be a boolean");
      return;
    }

    const data = await lessonsService.setActive(
      param(req.params["id"]!),
      req.admin!.mosqueId,
      active,
    );

    sendSuccess(
      res,
      data,
      active ? "Lesson activated" : "Lesson deactivated",
    );
  },
);

export const deleteLesson = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await lessonsService.delete(
      param(req.params["id"]!),
      req.admin!.mosqueId,
    );

    sendSuccess(res, data, "Lesson deleted");
  },
);