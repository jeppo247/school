import { Router } from "express";
import { db } from "../db/client.js";
import { feedback } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { AppError } from "../middleware/error-handler.js";

export const feedbackRoutes = Router();

// POST /feedback — Submit feedback
feedbackRoutes.post("/", async (req, res, next) => {
  try {
    const { familyId, parentId, category, subject, body } = req.body;

    if (!familyId || !parentId || !subject || !body) {
      throw new AppError(400, "VALIDATION_ERROR", "familyId, parentId, subject, and body are required");
    }

    const [entry] = await db
      .insert(feedback)
      .values({
        familyId,
        parentId,
        category: category ?? "general",
        subject,
        body,
      })
      .returning();

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

// GET /feedback?familyId=xxx — List family's feedback
feedbackRoutes.get("/", async (req, res, next) => {
  try {
    const { familyId } = req.query;

    if (!familyId) {
      throw new AppError(400, "VALIDATION_ERROR", "familyId query parameter is required");
    }

    const entries = await db
      .select()
      .from(feedback)
      .where(eq(feedback.familyId, familyId as string))
      .orderBy(desc(feedback.createdAt));

    res.json({ feedback: entries });
  } catch (err) {
    next(err);
  }
});

// GET /feedback/:id — Single feedback item
feedbackRoutes.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [entry] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, id));

    if (!entry) {
      throw new AppError(404, "NOT_FOUND", "Feedback not found");
    }

    res.json(entry);
  } catch (err) {
    next(err);
  }
});
