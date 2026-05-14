import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { mosqueService } from "./mosque.service.js";
import { updateMosqueSchema } from "./mosque.schema.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { param } from "../../utils/params.js";

export const getMosque = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const mosqueId = param(req.params["mosqueId"]) ?? req.admin!.mosqueId;
    const data = await mosqueService.getById(mosqueId);
    sendSuccess(res, data, "Mosque fetched successfully");
  }
);

export const updateMosque = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = updateMosqueSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await mosqueService.update(req.admin!.mosqueId, result.data);
    sendSuccess(res, data, "Mosque updated successfully");
  }
);