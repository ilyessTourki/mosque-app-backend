import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeString = z.string().regex(timeRegex, "Time must be in HH:MM format");

export const createMonthScheduleSchema = z.object({
  hijriMonthName: z.string().min(1),
  hijriYear: z.number().int().positive(),
  gregorianMonth: z.number().int().min(1).max(12),
  gregorianYear: z.number().int().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const createDayScheduleSchema = z.object({
  gregorianDate: z.string().datetime(),
  hijriDay: z.number().int().min(1).max(30),
  hijriMonthName: z.string().min(1),
  hijriYear: z.number().int().positive(),
  fajrAdhan: timeString,
  fajrIqama: timeString.optional(),
  sunrise: timeString,
  dhuhrAdhan: timeString,
  dhuhrIqama: timeString.optional(),
  asrAdhan: timeString,
  asrIqama: timeString.optional(),
  maghribAdhan: timeString,
  maghribIqama: timeString.optional(),
  ishaAdhan: timeString,
  ishaIqama: timeString.optional(),
});

export const bulkDayScheduleSchema = z.object({
  days: z.array(createDayScheduleSchema).min(1),
});

export const createJumuahSchema = z.object({
  title: z.string().min(1),
  adhanTime: timeString,
  iqamaTime: timeString,
  validFrom: z.string().datetime(),
  validTo: z.string().datetime().optional(),
});

export type CreateMonthScheduleInput = z.infer<typeof createMonthScheduleSchema>;
export type CreateDayScheduleInput = z.infer<typeof createDayScheduleSchema>;
export type BulkDayScheduleInput = z.infer<typeof bulkDayScheduleSchema>;
export type CreateJumuahInput = z.infer<typeof createJumuahSchema>;