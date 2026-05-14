import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";
import { env } from "../config/env.js";

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  console.error(`[ERROR] ${statusCode} — ${message}`);

  sendError(
    res,
    message,
    statusCode,
    env.NODE_ENV === "development" ? err.stack : undefined
  );
};