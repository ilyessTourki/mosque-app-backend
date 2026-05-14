import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendError } from "../utils/response.js";

export interface AuthPayload {
  adminId: string;
  mosqueId: string;
  email: string;
}

export interface AuthRequest extends Request {
  admin?: AuthPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Unauthorized — no token provided", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    sendError(res, "Unauthorized — malformed token", 401);
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.admin = payload;
    next();
  } catch {
    sendError(res, "Unauthorized — invalid or expired token", 401);
  }
};