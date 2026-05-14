import type { Response, Request } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { newsService } from "./news.service.js";
import {
  createNewsSchema,
  updateNewsSchema,
  newsQuerySchema,
} from "./news.schema.js";
import { sendSuccess, sendError } from "../../utils/response.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllNews = asyncHandler(async (req: Request, res: Response) => {
  const mosqueId = req.params["mosqueId"]!;
  const query = newsQuerySchema.parse(req.query);
  const data = await newsService.getAll(mosqueId, query);
  sendSuccess(res, data, "News fetched successfully");
});

export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const data = await newsService.getById(req.params["id"]!);
  sendSuccess(res, data, "News post fetched");
});

export const createNews = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = createNewsSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await newsService.create(req.admin!.mosqueId, result.data);
    sendSuccess(res, data, "News post created", 201);
  }
);

export const updateNews = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const result = updateNewsSchema.safeParse(req.body);
    if (!result.success) {
      sendError(res, "Validation failed", 400, result.error.message);
      return;
    }
    const data = await newsService.update(
      req.params["id"]!,
      req.admin!.mosqueId,
      result.data
    );
    sendSuccess(res, data, "News post updated");
  }
);

export const deleteNews = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await newsService.delete(
      req.params["id"]!,
      req.admin!.mosqueId
    );
    sendSuccess(res, data, "News post deleted");
  }
);