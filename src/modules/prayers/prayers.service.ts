import { prisma } from "../../config/prisma.js";
import type {
  CreateMonthScheduleInput,
  BulkDayScheduleInput,
  CreateJumuahInput,
} from "./prayers.schema.js";

export const prayersService = {
  // ── Month Schedule ────────────────────────────────────────────────────────

  async createMonthSchedule(mosqueId: string, input: CreateMonthScheduleInput) {
    return prisma.prayerMonthSchedule.create({
      data: { mosqueId, ...input, startDate: new Date(input.startDate), endDate: new Date(input.endDate) },
    });
  },

  async getMonthSchedules(mosqueId: string) {
    return prisma.prayerMonthSchedule.findMany({
      where: { mosqueId },
      orderBy: [{ gregorianYear: "desc" }, { gregorianMonth: "desc" }],
      select: {
        id: true,
        hijriMonthName: true,
        hijriYear: true,
        gregorianMonth: true,
        gregorianYear: true,
        startDate: true,
        endDate: true,
        isActive: true,
      },
    });
  },

  async getActiveMonthSchedule(mosqueId: string) {
    const schedule = await prisma.prayerMonthSchedule.findFirst({
      where: { mosqueId, isActive: true },
      include: { days: { orderBy: { gregorianDate: "asc" } } },
    });

    if (!schedule) {
      throw Object.assign(new Error("No active prayer schedule found"), {
        statusCode: 404,
      });
    }

    return schedule;
  },

  async getMonthScheduleById(scheduleId: string) {
    const schedule = await prisma.prayerMonthSchedule.findUnique({
      where: { id: scheduleId },
      include: { days: { orderBy: { gregorianDate: "asc" } } },
    });

    if (!schedule) {
      throw Object.assign(new Error("Schedule not found"), { statusCode: 404 });
    }

    return schedule;
  },

  async setActiveSchedule(mosqueId: string, scheduleId: string) {
    // Deactivate all, then activate the selected one
    await prisma.prayerMonthSchedule.updateMany({
      where: { mosqueId },
      data: { isActive: false },
    });

    return prisma.prayerMonthSchedule.update({
      where: { id: scheduleId },
      data: { isActive: true },
    });
  },

  // ── Day Schedules (bulk insert) ───────────────────────────────────────────

  async bulkCreateDays(scheduleId: string, input: BulkDayScheduleInput) {
    const data = input.days.map((day) => ({
      monthScheduleId: scheduleId,
      ...day,
      gregorianDate: new Date(day.gregorianDate),
    }));

    return prisma.prayerDaySchedule.createMany({ data, skipDuplicates: true });
  },

  // ── Today's Prayer Times ──────────────────────────────────────────────────

  async getTodayPrayers(mosqueId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeSchedule = await prisma.prayerMonthSchedule.findFirst({
      where: { mosqueId, isActive: true },
    });

    if (!activeSchedule) {
      throw Object.assign(new Error("No active prayer schedule found"), {
        statusCode: 404,
      });
    }

    const day = await prisma.prayerDaySchedule.findFirst({
      where: {
        monthScheduleId: activeSchedule.id,
        gregorianDate: { gte: today, lt: tomorrow },
      },
    });

    if (!day) {
      throw Object.assign(
        new Error("No prayer times found for today"),
        { statusCode: 404 }
      );
    }

    // Get active Jumuah if today is Friday
    const isFriday = today.getDay() === 5;
    const jumuah = isFriday
      ? await prisma.jumuahSchedule.findFirst({
          where: {
            mosqueId,
            isActive: true,
            validFrom: { lte: today },
            OR: [{ validTo: null }, { validTo: { gte: today } }],
          },
        })
      : null;

    return { day, jumuah };
  },

  // ── Jumuah ────────────────────────────────────────────────────────────────

  async createJumuah(mosqueId: string, input: CreateJumuahInput) {
    return prisma.jumuahSchedule.create({
      data: {
        mosqueId,
        ...input,
        validFrom: new Date(input.validFrom),
        validTo: input.validTo ? new Date(input.validTo) : null,
      },
    });
  },

  async getJumuahSchedules(mosqueId: string) {
    return prisma.jumuahSchedule.findMany({
      where: { mosqueId },
      orderBy: { validFrom: "desc" },
    });
  },

  async getActiveJumuah(mosqueId: string) {
    const today = new Date();
    return prisma.jumuahSchedule.findFirst({
      where: {
        mosqueId,
        isActive: true,
        validFrom: { lte: today },
        OR: [{ validTo: null }, { validTo: { gte: today } }],
      },
    });
  },
};