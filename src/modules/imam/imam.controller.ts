import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { imamService } from "./imam.service.js";
import {
  createQuestionSchema,
  answerQuestionSchema,
  questionQuerySchema,
} from "./imam.schema.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const submitQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const mosqueId = req.params["mosqueId"]!;
    const result = createQuestionSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await imamService.submitQuestion(mosqueId, result.data);
    sendSuccess(res, data, "Question submitted successfully", 201);
  }
);

export const getPublicAnswered = asyncHandler(
  async (req: Request, res: Response) => {
    const mosqueId = req.params["mosqueId"]!;
    const query = questionQuerySchema.parse(req.query);
    const data = await imamService.getPublicAnswered(mosqueId, query);
    sendSuccess(res, data, "Answered questions fetched");
  }
);

export const getAllQuestions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const query = questionQuerySchema.parse(req.query);
    const data = await imamService.getAll(req.admin!.mosqueId, query);
    sendSuccess(res, data, "Questions fetched");
  }
);

export const answerQuestion = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = answerQuestionSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await imamService.answerQuestion(
      req.params["id"]!,
      req.admin!.mosqueId,
      result.data
    );
    sendSuccess(res, data, "Question answered successfully");
  }
);

export const archiveQuestion = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await imamService.archiveQuestion(
      req.params["id"]!,
      req.admin!.mosqueId
    );
    sendSuccess(res, data, "Question archived");
  }
);