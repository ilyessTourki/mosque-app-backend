import { prisma } from "../../config/prisma.js";
import type { CreateNewsInput, UpdateNewsInput, NewsQueryInput } from "./news.schema.js";

export const newsService = {
  async getAll(mosqueId: string, query: NewsQueryInput) {
    const { page, limit, category, isImportant, isPublished } = query;
    const skip = (page - 1) * limit;

    const where = {
      mosqueId,
      ...(category && { category }),
      ...(isImportant !== undefined && { isImportant }),
      ...(isPublished !== undefined && { isPublished }),
    };

    const [total, items] = await Promise.all([
      prisma.newsPost.count({ where }),
      prisma.newsPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { media: { orderBy: { order: "asc" } } },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const news = await prisma.newsPost.findUnique({
      where: { id },
      include: { media: { orderBy: { order: "asc" } } },
    });

    if (!news) {
      throw Object.assign(new Error("News post not found"), { statusCode: 404 });
    }

    return news;
  },

  async create(mosqueId: string, input: CreateNewsInput) {
    const { media, publishedAt, ...rest } = input;

    return prisma.newsPost.create({
      data: {
        mosqueId,
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        media: media
          ? { create: media }
          : undefined,
      },
      include: { media: { orderBy: { order: "asc" } } },
    });
  },

  async update(id: string, mosqueId: string, input: UpdateNewsInput) {
    const existing = await prisma.newsPost.findUnique({ where: { id } });

    if (!existing) {
      throw Object.assign(new Error("News post not found"), { statusCode: 404 });
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    const { media, publishedAt, ...rest } = input;

    return prisma.newsPost.update({
      where: { id },
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        ...(media && {
          media: {
            deleteMany: {},
            create: media,
          },
        }),
      },
      include: { media: { orderBy: { order: "asc" } } },
    });
  },

  async delete(id: string, mosqueId: string) {
    const existing = await prisma.newsPost.findUnique({ where: { id } });

    if (!existing) {
      throw Object.assign(new Error("News post not found"), { statusCode: 404 });
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    await prisma.newsPost.delete({ where: { id } });
    return { deleted: true };
  },
};