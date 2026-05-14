import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  isImportant: z.boolean().default(false),
  place: z.string().optional(),
  mediaType: z.enum(["images", "video", "youtube", "none"]).default("none"),
  videoUrl: z.string().url().optional(),
  youtubeId: z.string().optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  media: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "videoThumbnail"]).default("image"),
        order: z.number().int().default(0),
      })
    )
    .optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export const newsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  category: z.string().optional(),
  isImportant: z.coerce.boolean().optional(),
  isPublished: z.coerce.boolean().optional(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type NewsQueryInput = z.infer<typeof newsQuerySchema>;