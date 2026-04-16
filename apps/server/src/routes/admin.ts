import { Router } from "express";
import { db } from "../db/client.js";
import {
  skillNodes,
  skillPrerequisites,
  questionTemplates,
  questions,
  families,
  students,
  learningSessions,
  feedback,
} from "../db/schema.js";
import { eq, sql, desc, and, count } from "drizzle-orm";
import { AppError } from "../middleware/error-handler.js";
import { generateQuestionBatch, generateQuestionsForGaps } from "../services/question-generator.js";

export const adminRoutes = Router();

// ============================================================
// KNOWLEDGE GRAPH — SKILL NODES
// ============================================================

// GET /admin/skill-nodes — List all skill nodes (filterable)
adminRoutes.get("/skill-nodes", async (req, res, next) => {
  try {
    const { yearLevel, strand, subStrand, active } = req.query;

    let query = db.select().from(skillNodes).$dynamic();

    const conditions = [];
    if (yearLevel) conditions.push(eq(skillNodes.yearLevel, Number(yearLevel)));
    if (strand) conditions.push(eq(skillNodes.strand, strand as string));
    if (subStrand) conditions.push(eq(skillNodes.subStrand, subStrand as string));
    if (active !== undefined) conditions.push(eq(skillNodes.isActive, active === "true"));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const nodes = await query.orderBy(skillNodes.yearLevel, skillNodes.displayOrder);
    res.json({ nodes, count: nodes.length });
  } catch (err) {
    next(err);
  }
});

// POST /admin/skill-nodes — Create a skill node
adminRoutes.post("/skill-nodes", async (req, res, next) => {
  try {
    const {
      code, name, description, yearLevel, strand, subStrand,
      acaraCode, acaraDescription, dokLevel, difficultyBand, displayOrder,
    } = req.body;

    if (!code || !name || !yearLevel || !strand) {
      throw new AppError(400, "VALIDATION_ERROR", "code, name, yearLevel, and strand are required");
    }

    const [node] = await db
      .insert(skillNodes)
      .values({
        code, name, description, yearLevel, strand, subStrand,
        acaraCode, acaraDescription,
        dokLevel: dokLevel ?? 1,
        difficultyBand: difficultyBand ?? "on_level",
        displayOrder: displayOrder ?? 0,
      })
      .returning();

    res.status(201).json(node);
  } catch (err) {
    next(err);
  }
});

// PUT /admin/skill-nodes/:id — Update a skill node
adminRoutes.put("/skill-nodes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(skillNodes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(skillNodes.id, id))
      .returning();

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Skill node not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/skill-nodes/:id — Deactivate a skill node (soft delete)
adminRoutes.delete("/skill-nodes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [updated] = await db
      .update(skillNodes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(skillNodes.id, id))
      .returning();

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Skill node not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// KNOWLEDGE GRAPH — PREREQUISITES
// ============================================================

// GET /admin/skill-prerequisites — List all prerequisite edges
adminRoutes.get("/skill-prerequisites", async (req, res, next) => {
  try {
    const edges = await db.select().from(skillPrerequisites);
    res.json({ edges, count: edges.length });
  } catch (err) {
    next(err);
  }
});

// POST /admin/skill-prerequisites — Add a prerequisite edge
adminRoutes.post("/skill-prerequisites", async (req, res, next) => {
  try {
    const { skillId, prerequisiteId, strength } = req.body;

    if (!skillId || !prerequisiteId) {
      throw new AppError(400, "VALIDATION_ERROR", "skillId and prerequisiteId are required");
    }

    if (skillId === prerequisiteId) {
      throw new AppError(400, "VALIDATION_ERROR", "A skill cannot be its own prerequisite");
    }

    const [edge] = await db
      .insert(skillPrerequisites)
      .values({ skillId, prerequisiteId, strength: strength ?? "required" })
      .returning();

    res.status(201).json(edge);
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/skill-prerequisites/:id — Remove a prerequisite edge
adminRoutes.delete("/skill-prerequisites/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const [deleted] = await db
      .delete(skillPrerequisites)
      .where(eq(skillPrerequisites.id, id))
      .returning();

    if (!deleted) {
      throw new AppError(404, "NOT_FOUND", "Prerequisite edge not found");
    }

    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// QUESTION TEMPLATES
// ============================================================

// GET /admin/question-templates — List templates (filterable by skill)
adminRoutes.get("/question-templates", async (req, res, next) => {
  try {
    const { skillId, active } = req.query;

    const conditions = [];
    if (skillId) conditions.push(eq(questionTemplates.skillId, skillId as string));
    if (active !== undefined) conditions.push(eq(questionTemplates.isActive, active === "true"));

    let query = db.select().from(questionTemplates).$dynamic();
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const templates = await query.orderBy(questionTemplates.createdAt);
    res.json({ templates, count: templates.length });
  } catch (err) {
    next(err);
  }
});

// POST /admin/question-templates — Create a template
adminRoutes.post("/question-templates", async (req, res, next) => {
  try {
    const {
      skillId, templateType, structure, difficultyParam,
      discriminationParam, guessingParam, dokLevel,
    } = req.body;

    if (!skillId || !templateType || !structure) {
      throw new AppError(400, "VALIDATION_ERROR", "skillId, templateType, and structure are required");
    }

    const [template] = await db
      .insert(questionTemplates)
      .values({
        skillId,
        templateType,
        structure,
        difficultyParam: difficultyParam ?? 0,
        discriminationParam: discriminationParam ?? 1,
        guessingParam: guessingParam ?? 0.25,
        dokLevel: dokLevel ?? 1,
        createdBy: "admin",
      })
      .returning();

    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
});

// PUT /admin/question-templates/:id — Update a template
adminRoutes.put("/question-templates/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(questionTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(questionTemplates.id, id))
      .returning();

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Template not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// QUESTIONS
// ============================================================

// GET /admin/questions — List questions (filterable)
adminRoutes.get("/questions", async (req, res, next) => {
  try {
    const { skillId, themeId, validated } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (skillId) conditions.push(eq(questions.skillId, skillId as string));
    if (themeId) conditions.push(eq(questions.themeId, themeId as string));
    if (validated !== undefined) conditions.push(eq(questions.isValidated, validated === "true"));

    let query = db.select().from(questions).$dynamic();
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(desc(questions.createdAt)).limit(limit).offset(offset);
    res.json({ questions: result, limit, offset });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/questions/:id — Update a question (validate, edit content)
adminRoutes.put("/questions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(questions)
      .set(updates)
      .where(eq(questions.id, id))
      .returning();

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Question not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /admin/questions/generate — Trigger AI question generation for a skill
adminRoutes.post("/questions/generate", async (req, res, next) => {
  try {
    const { skillId, count, themeId, questionType } = req.body;

    if (!skillId) {
      throw new AppError(400, "VALIDATION_ERROR", "skillId is required");
    }

    const result = await generateQuestionBatch({
      skillId,
      count: Math.min(count ?? 5, 20),
      themeId,
      questionType,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /admin/questions/generate-gaps — Fill question gaps across all skills
adminRoutes.post("/questions/generate-gaps", async (req, res, next) => {
  try {
    const { minPerSkill, batchSize } = req.body;
    const result = await generateQuestionsForGaps(minPerSkill ?? 20, batchSize ?? 5);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /admin/questions/quality — Content quality metrics
adminRoutes.get("/questions/quality", async (req, res, next) => {
  try {
    const metrics = await db
      .select({
        skillId: questions.skillId,
        totalQuestions: count(),
        avgDifficulty: sql<number>`AVG(${questions.difficultyParam})`,
        avgAccuracy: sql<number>`CASE WHEN SUM(${questions.timesServed}) > 0 THEN SUM(${questions.timesCorrect})::float / SUM(${questions.timesServed}) ELSE NULL END`,
        validatedCount: sql<number>`COUNT(*) FILTER (WHERE ${questions.isValidated} = true)`,
        unvalidatedCount: sql<number>`COUNT(*) FILTER (WHERE ${questions.isValidated} = false)`,
      })
      .from(questions)
      .groupBy(questions.skillId);

    res.json({ metrics });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// SYSTEM ANALYTICS
// ============================================================

// GET /admin/analytics — System-wide stats
adminRoutes.get("/analytics", async (req, res, next) => {
  try {
    const [familyCount] = await db.select({ count: count() }).from(families);
    const [studentCount] = await db.select({ count: count() }).from(students);
    const [sessionCount] = await db.select({ count: count() }).from(learningSessions);
    const [questionCount] = await db.select({ count: count() }).from(questions);
    const [skillCount] = await db.select({ count: count() }).from(skillNodes);
    const [feedbackCount] = await db
      .select({ count: count() })
      .from(feedback)
      .where(eq(feedback.status, "open"));

    res.json({
      families: familyCount.count,
      students: studentCount.count,
      sessions: sessionCount.count,
      questions: questionCount.count,
      skillNodes: skillCount.count,
      openFeedback: feedbackCount.count,
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// FEEDBACK MANAGEMENT
// ============================================================

// GET /admin/feedback — All feedback (filterable)
adminRoutes.get("/feedback", async (req, res, next) => {
  try {
    const { status } = req.query;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;

    let query = db.select().from(feedback).$dynamic();
    if (status) {
      query = query.where(eq(feedback.status, status as string));
    }

    const result = await query.orderBy(desc(feedback.createdAt)).limit(limit).offset(offset);
    res.json({ feedback: result, limit, offset });
  } catch (err) {
    next(err);
  }
});

// PUT /admin/feedback/:id — Update feedback status, add response
adminRoutes.put("/feedback/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (adminResponse) {
      updates.adminResponse = adminResponse;
      updates.respondedAt = new Date();
    }

    const [updated] = await db
      .update(feedback)
      .set(updates)
      .where(eq(feedback.id, id))
      .returning();

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Feedback not found");
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});
