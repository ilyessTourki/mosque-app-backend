import { z } from "zod";

const timeSchema = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Time must use HH:MM format");

export const lessonTypeSchema = z.enum([
  "TAHFIZ",
  "ARABIC",
  "ISLAMIC_STUDIES",
  "GENERAL",
]);

export const dayOfWeekSchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

const optionalText = z.string().trim().min(1).max(500).optional();

const lessonFields = {
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().min(1).max(2_000).optional(),
  type: lessonTypeSchema,
  dayOfWeek: dayOfWeekSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  location: optionalText,
  teacher: optionalText,
  audience: optionalText,
  active: z.boolean().optional(),
};

function hasValidTimeRange(
  value: { startTime?: string; endTime?: string },
): boolean {
  if (!value.startTime || !value.endTime) {
    return true;
  }

  return value.endTime > value.startTime;
}

export const createLessonSchema = z
  .object(lessonFields)
  .refine(hasValidTimeRange, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateLessonSchema = z
  .object(lessonFields)
  .partial()
  .refine(hasValidTimeRange, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;