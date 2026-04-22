import { z } from "zod";

export const createFamilySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
});

export const addParentSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  clerkUserId: z.string().optional(),
});

export const addChildSchema = z.object({
  name: z.string().min(1).max(100),
  yearLevel: z.number().int().min(0).max(7),
  dateOfBirth: z.string().optional(),
  themeId: z.string().optional(),
});

export const submitAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.union([z.string(), z.number()]),
  timeTakenMs: z.number().int().min(0).optional(),
  hintUsed: z.boolean().optional(),
});

export const purchaseItemSchema = z.object({
  itemId: z.string().uuid(),
});

export const updateInterestsSchema = z.object({
  interests: z.array(z.string().max(50)).max(20),
});
