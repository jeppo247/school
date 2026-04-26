import { Router } from "express";
import { db } from "../db/client.js";
import { students, families, studentSkillStates, learningSessions } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { AppError } from "../middleware/error-handler.js";
import { validate } from "../middleware/validate.js";
import { updateInterestsSchema } from "../schemas/validation.js";
import { XP_PER_LEVEL } from "@upwise/shared";

export const studentRoutes = Router();

// GET /students/:id — Get student profile
studentRoutes.get("/:id", async (req, res, next) => {
  try {
    const studentId = req.params.id as string;
    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    const level = Math.floor(student.xpTotal / XP_PER_LEVEL);
    const xpInLevel = student.xpTotal % XP_PER_LEVEL;

    // Count mastery stats
    const [masteryStats] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        mastered: sql<number>`COUNT(*) FILTER (WHERE ${studentSkillStates.masteryStatus} IN ('mastered', 'review'))`,
      })
      .from(studentSkillStates)
      .where(eq(studentSkillStates.studentId, student.id));

    // Count completed sessions in the last 7 days
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const [sessionCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(learningSessions)
      .where(
        and(
          eq(learningSessions.studentId, student.id),
          eq(learningSessions.status, "completed"),
          sql`${learningSessions.completedAt} >= ${weekAgo.toISOString()}`,
        ),
      );

    res.json({
      ...student,
      level,
      xpForNextLevel: XP_PER_LEVEL,
      xpInCurrentLevel: xpInLevel,
      masteryPercentage: masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0,
      totalSkillsAssessed: masteryStats.total,
      sessionsThisWeek: sessionCount.count,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /students/:id — Update student profile
studentRoutes.put("/:id", async (req, res, next) => {
  try {
    const { name, yearLevel, dateOfBirth, avatarUrl, interests } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updates.name = name;
    if (yearLevel !== undefined) updates.yearLevel = yearLevel;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
    if (interests) updates.interests = interests;

    const [updated] = await db
      .update(students)
      .set(updates)
      .where(eq(students.id, req.params.id as string))
      .returning();

    if (!updated) throw new AppError(404, "NOT_FOUND", "Student not found");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PUT /students/:id/theme — Set theme preference
studentRoutes.put("/:id/theme", async (req, res, next) => {
  try {
    const { themeId } = req.body;
    if (!themeId) throw new AppError(400, "VALIDATION_ERROR", "themeId required");

    const [updated] = await db
      .update(students)
      .set({ themeId, updatedAt: new Date() })
      .where(eq(students.id, req.params.id as string))
      .returning();

    if (!updated) throw new AppError(404, "NOT_FOUND", "Student not found");
    res.json({ themeId: updated.themeId });
  } catch (err) {
    next(err);
  }
});

// PUT /students/:id/rewards-mode — Set rewards mode (parent control)
studentRoutes.put("/:id/rewards-mode", async (req, res, next) => {
  try {
    const { rewardsMode } = req.body;
    if (!["full", "feedback_only", "off"].includes(rewardsMode)) {
      throw new AppError(400, "VALIDATION_ERROR", "rewardsMode must be 'full', 'feedback_only', or 'off'");
    }

    const [updated] = await db
      .update(students)
      .set({ rewardsMode, updatedAt: new Date() })
      .where(eq(students.id, req.params.id as string))
      .returning();

    if (!updated) throw new AppError(404, "NOT_FOUND", "Student not found");
    res.json({ rewardsMode: updated.rewardsMode });
  } catch (err) {
    next(err);
  }
});

// PUT /students/:id/interests — Update interests
studentRoutes.put("/:id/interests", validate(updateInterestsSchema), async (req, res, next) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests)) throw new AppError(400, "VALIDATION_ERROR", "interests must be an array");

    const [updated] = await db
      .update(students)
      .set({ interests, updatedAt: new Date() })
      .where(eq(students.id, req.params.id as string))
      .returning();

    if (!updated) throw new AppError(404, "NOT_FOUND", "Student not found");
    res.json({ interests: updated.interests });
  } catch (err) {
    next(err);
  }
});
