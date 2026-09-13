import { prisma } from "../../config/prisma.js";
import type {
  CreateLessonInput,
  UpdateLessonInput,
} from "./lessons.schema.js";

function ensureValidTimeRange(startTime: string, endTime: string): void {
  if (endTime <= startTime) {
    throw Object.assign(
      new Error("End time must be after start time"),
      { statusCode: 400 },
    );
  }
}

export const lessonsService = {
  async getActiveByMosque(mosqueId: string) {
    return prisma.mosqueLesson.findMany({
      where: {
        mosqueId,
        active: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });
  },

  async getAllForAdmin(mosqueId: string) {
    return prisma.mosqueLesson.findMany({
      where: { mosqueId },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });
  },

  async create(mosqueId: string, input: CreateLessonInput) {
    ensureValidTimeRange(input.startTime, input.endTime);

    return prisma.mosqueLesson.create({
      data: {
        mosqueId,
        ...input,
      },
    });
  },

  async update(id: string, mosqueId: string, input: UpdateLessonInput) {
    const existing = await prisma.mosqueLesson.findUnique({
      where: { id },
    });

    if (!existing) {
      throw Object.assign(
        new Error("Lesson not found"),
        { statusCode: 404 },
      );
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    const startTime = input.startTime ?? existing.startTime;
    const endTime = input.endTime ?? existing.endTime;

    ensureValidTimeRange(startTime, endTime);

    return prisma.mosqueLesson.update({
      where: { id },
      data: input,
    });
  },

  async setActive(id: string, mosqueId: string, active: boolean) {
    const existing = await prisma.mosqueLesson.findUnique({
      where: { id },
    });

    if (!existing) {
      throw Object.assign(
        new Error("Lesson not found"),
        { statusCode: 404 },
      );
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    return prisma.mosqueLesson.update({
      where: { id },
      data: { active },
    });
  },

  async delete(id: string, mosqueId: string) {
    const existing = await prisma.mosqueLesson.findUnique({
      where: { id },
    });

    if (!existing) {
      throw Object.assign(
        new Error("Lesson not found"),
        { statusCode: 404 },
      );
    }

    if (existing.mosqueId !== mosqueId) {
      throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
    }

    await prisma.mosqueLesson.delete({
      where: { id },
    });

    return { deleted: true };
  },
};