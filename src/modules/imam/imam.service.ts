import { prisma } from "../../config/prisma.js";
import type {
  CreateQuestionInput,
  AnswerQuestionInput,
  QuestionQueryInput,
} from "./imam.schema.js";

export const imamService = {
  async submitQuestion(mosqueId: string, input: CreateQuestionInput) {
    return prisma.imamQuestion.create({
      data: { mosqueId, ...input },
    });
  },

  async getAll(mosqueId: string, query: QuestionQueryInput) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      mosqueId,
      ...(status && { status }),
    };

    const [total, items] = await Promise.all([
      prisma.imamQuestion.count({ where }),
      prisma.imamQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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

  async getPublicAnswered(mosqueId: string, query: QuestionQueryInput) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const where = { mosqueId, status: "answered" as const };

    const [total, items] = await Promise.all([
      prisma.imamQuestion.count({ where }),
      prisma.imamQuestion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { answeredAt: "desc" },
        select: {
          id: true,
          name: true,
          question: true,
          answer: true,
          answeredAt: true,
        },
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

  async answerQuestion(id: string, mosqueId: string, input: AnswerQuestionInput) {
    const existing = await prisma.imamQuestion.findUnique({ where: { id } });

    if (!existing) {
      throw Object.assign(new Error("Question not found"), { statusCode: 404 });
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    return prisma.imamQuestion.update({
      where: { id },
      data: {
        answer: input.answer,
        status: "answered",
        answeredAt: new Date(),
      },
    });
  },

  async archiveQuestion(id: string, mosqueId: string) {
    const existing = await prisma.imamQuestion.findUnique({ where: { id } });

    if (!existing) {
      throw Object.assign(new Error("Question not found"), { statusCode: 404 });
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    return prisma.imamQuestion.update({
      where: { id },
      data: { status: "archived" },
    });
  },
};