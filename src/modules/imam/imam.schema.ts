import { z } from "zod";

export const createQuestionSchema = z.object({
  name: z.string().optional(),
  question: z.string().min(10, "Question must be at least 10 characters"),
});

export const answerQuestionSchema = z.object({
  answer: z.string().min(1, "Answer cannot be empty"),
});

export const questionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(["pending", "answered", "archived"]).optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;
export type QuestionQueryInput = z.infer<typeof questionQuerySchema>;