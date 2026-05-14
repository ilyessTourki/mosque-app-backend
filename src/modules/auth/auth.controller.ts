import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    sendError(res, "Validation failed", 400, result.error.message);
    return;
  }
  const data = await authService.login(result.data);
  sendSuccess(res, data, "Login successful");
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    sendError(res, "Validation failed", 400, result.error.message);
    return;
  }
  const data = await authService.register(result.data);
  sendSuccess(res, data, "Admin registered successfully", 201);
});