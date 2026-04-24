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
import { themes, shopItems } from "../db/schema.js";
import { logger } from "../lib/logger.js";

// Seed data imports
import { allSkillNodes, prerequisites } from "../db/seed/skill-nodes.js";
import {
  readingNodes, spellingNodes, grammarPunctuationNodes, writingNodes,
  readingPrerequisites, spellingPrerequisites, grammarPunctuationPrerequisites, writingPrerequisites,
} from "../db/seed/english-skill-nodes.js";
import { precursorNodes, precursorPrerequisites } from "../db/seed/precursor-nodes.js";
import { starterQuestions } from "../db/seed/starter-questions.js";

export const adminRoutes = Router();

// ============================================================
// ONE-TIME SETUP — Push schema + seed data
// ============================================================

// GET /admin/setup — One-time database setup (visit in browser)
adminRoutes.get("/setup", async (_req, res) => {
  try {
    logger.info("Starting database setup...");
    const results: string[] = [];

    // Push schema using raw SQL for each table
    // Drizzle push is not available at runtime, so we create tables via raw SQL
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS themes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color_primary TEXT NOT NULL,
        color_secondary TEXT NOT NULL,
        color_accent TEXT NOT NULL,
        icon_set TEXT,
        sound_set TEXT,
        bg_pattern TEXT,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS families (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_org_id TEXT UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        stripe_customer_id TEXT,
        subscription_tier TEXT DEFAULT 'trial' NOT NULL,
        subscription_status TEXT DEFAULT 'active' NOT NULL,
        trial_ends_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS parents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        clerk_user_id TEXT UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        notification_prefs JSONB DEFAULT '{"daily_briefing": true, "nudges": true, "weekly_report": true}' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        year_level INTEGER NOT NULL,
        date_of_birth DATE,
        avatar_url TEXT,
        theme_id TEXT DEFAULT 'default' NOT NULL,
        interests TEXT[] DEFAULT '{}' NOT NULL,
        xp_total INTEGER DEFAULT 0 NOT NULL,
        coin_balance INTEGER DEFAULT 0 NOT NULL,
        current_streak INTEGER DEFAULT 0 NOT NULL,
        longest_streak INTEGER DEFAULT 0 NOT NULL,
        last_session_date DATE,
        rewards_mode TEXT DEFAULT 'full' NOT NULL,
        diagnostic_completed BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`ALTER TABLE parents ALTER COLUMN clerk_user_id DROP NOT NULL`);
    await db.execute(sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS rewards_mode TEXT DEFAULT 'full' NOT NULL`);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS skill_nodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        year_level INTEGER NOT NULL,
        domain TEXT DEFAULT 'numeracy' NOT NULL,
        learning_area TEXT DEFAULT 'mathematics' NOT NULL,
        strand TEXT NOT NULL,
        sub_strand TEXT,
        acara_code TEXT,
        acara_description TEXT,
        dok_level INTEGER DEFAULT 1 NOT NULL,
        difficulty_band TEXT DEFAULT 'on_level' NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS skill_prerequisites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        skill_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
        prerequisite_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
        strength TEXT DEFAULT 'required' NOT NULL,
        UNIQUE(skill_id, prerequisite_id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS student_skill_states (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        skill_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
        mastery_probability REAL DEFAULT 0.5 NOT NULL,
        total_attempts INTEGER DEFAULT 0 NOT NULL,
        correct_attempts INTEGER DEFAULT 0 NOT NULL,
        mastery_status TEXT DEFAULT 'unknown' NOT NULL,
        last_assessed TIMESTAMPTZ,
        next_review TIMESTAMPTZ,
        review_interval_days INTEGER DEFAULT 1 NOT NULL,
        ease_factor REAL DEFAULT 2.5 NOT NULL,
        sessions_assessed INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE(student_id, skill_id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS question_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        skill_id UUID NOT NULL REFERENCES skill_nodes(id),
        template_type TEXT NOT NULL,
        structure JSONB NOT NULL,
        difficulty_param REAL DEFAULT 0 NOT NULL,
        discrimination_param REAL DEFAULT 1 NOT NULL,
        guessing_param REAL DEFAULT 0.25 NOT NULL,
        dok_level INTEGER DEFAULT 1 NOT NULL,
        naplan_year_target INTEGER,
        cognitive_process TEXT,
        stimulus_type TEXT,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        usage_count INTEGER DEFAULT 0 NOT NULL,
        avg_accuracy REAL,
        created_by TEXT DEFAULT 'system' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        template_id UUID REFERENCES question_templates(id),
        skill_id UUID NOT NULL REFERENCES skill_nodes(id),
        theme_id TEXT,
        content JSONB NOT NULL,
        difficulty_param REAL DEFAULT 0 NOT NULL,
        question_type TEXT NOT NULL,
        naplan_year_target INTEGER,
        cognitive_process TEXT,
        stimulus_type TEXT,
        misconception_code TEXT,
        distractor_map JSONB,
        time_expected_sec INTEGER,
        provenance JSONB,
        is_validated BOOLEAN DEFAULT FALSE NOT NULL,
        validation_notes TEXT,
        times_served INTEGER DEFAULT 0 NOT NULL,
        times_correct INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS learning_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id),
        session_type TEXT NOT NULL,
        status TEXT DEFAULT 'in_progress' NOT NULL,
        phase TEXT DEFAULT 'warmup' NOT NULL,
        started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        completed_at TIMESTAMPTZ,
        duration_seconds INTEGER,
        total_questions INTEGER DEFAULT 0 NOT NULL,
        correct_answers INTEGER DEFAULT 0 NOT NULL,
        accuracy REAL,
        xp_earned INTEGER DEFAULT 0 NOT NULL,
        coins_earned INTEGER DEFAULT 0 NOT NULL,
        skills_targeted UUID[] DEFAULT '{}' NOT NULL,
        parent_involved BOOLEAN DEFAULT FALSE NOT NULL,
        metadata JSONB DEFAULT '{}' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS question_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES questions(id),
        skill_id UUID NOT NULL REFERENCES skill_nodes(id),
        student_answer JSONB,
        correct_answer JSONB,
        is_correct BOOLEAN NOT NULL,
        time_taken_ms INTEGER,
        hint_used BOOLEAN DEFAULT FALSE NOT NULL,
        difficulty_at_time REAL,
        ability_estimate_at_time REAL,
        sequence_number INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coin_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        reference_id TEXT,
        balance_after INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS shop_items (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT,
        preview_data JSONB,
        prerequisite JSONB,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        is_limited BOOLEAN DEFAULT FALSE NOT NULL,
        available_from TIMESTAMPTZ,
        available_until TIMESTAMPTZ,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS student_purchases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        item_id TEXT NOT NULL REFERENCES shop_items(id),
        transaction_id UUID REFERENCES coin_transactions(id),
        purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE(student_id, item_id)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS domain_states (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        domain TEXT NOT NULL,
        theta REAL DEFAULT 0 NOT NULL,
        theta_se REAL DEFAULT 1 NOT NULL,
        projected_proficiency TEXT DEFAULT 'developing' NOT NULL,
        naplan_year_target INTEGER NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE(student_id, domain)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS daily_briefings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id),
        parent_id UUID NOT NULL REFERENCES parents(id),
        briefing_date DATE NOT NULL,
        content JSONB NOT NULL,
        was_read BOOLEAN DEFAULT FALSE NOT NULL,
        read_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE(student_id, briefing_date)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS parent_nudges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id),
        parent_id UUID NOT NULL REFERENCES parents(id),
        session_id UUID REFERENCES learning_sessions(id),
        nudge_type TEXT NOT NULL,
        content TEXT NOT NULL,
        was_sent BOOLEAN DEFAULT FALSE NOT NULL,
        sent_at TIMESTAMPTZ,
        was_read BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS weekly_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id),
        family_id UUID NOT NULL REFERENCES families(id),
        report_week DATE NOT NULL,
        content JSONB NOT NULL,
        share_token TEXT UNIQUE,
        pdf_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        UNIQUE(student_id, report_week)
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS misconception_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        skill_id UUID NOT NULL REFERENCES skill_nodes(id),
        misconception_code TEXT NOT NULL,
        item_id UUID REFERENCES questions(id),
        session_id UUID REFERENCES learning_sessions(id),
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS writing_prompts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        genre TEXT NOT NULL,
        title TEXT NOT NULL,
        prompt_text TEXT NOT NULL,
        year_level_min INTEGER NOT NULL,
        year_level_max INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS writing_scores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID NOT NULL REFERENCES question_responses(id) ON DELETE CASCADE,
        criterion TEXT NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        rater_type TEXT NOT NULL,
        rater_id TEXT,
        confidence REAL,
        feedback TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS consent_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        consent_type TEXT NOT NULL,
        granted_by UUID NOT NULL REFERENCES parents(id),
        granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        expires_at TIMESTAMPTZ,
        revoked_at TIMESTAMPTZ
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID NOT NULL REFERENCES families(id),
        parent_id UUID NOT NULL REFERENCES parents(id),
        category TEXT DEFAULT 'general' NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        status TEXT DEFAULT 'open' NOT NULL,
        admin_response TEXT,
        responded_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID NOT NULL REFERENCES families(id),
        stripe_subscription_id TEXT UNIQUE,
        tier TEXT DEFAULT 'free' NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        current_period_start TIMESTAMPTZ,
        current_period_end TIMESTAMPTZ,
        cancel_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        name TEXT,
        source TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS audit_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id TEXT,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);

    results.push("Schema created");

    // Seed themes
    const themeData = [
      { id: "default", name: "Upwise Blue", description: "The classic look", colorPrimary: "#4F8CF7", colorSecondary: "#A78BFA", colorAccent: "#34D399", isActive: true, displayOrder: 0 },
      { id: "afl", name: "AFL Footy", description: "Kick goals!", colorPrimary: "#002B5C", colorSecondary: "#E31937", colorAccent: "#FFD700", isActive: true, displayOrder: 1 },
      { id: "bluey", name: "Bluey", description: "Learn like Bluey!", colorPrimary: "#5B9BD5", colorSecondary: "#FF8C42", colorAccent: "#7EC8E3", isActive: true, displayOrder: 2 },
      { id: "superheroes", name: "Superheroes", description: "Be a hero!", colorPrimary: "#DC2626", colorSecondary: "#1D4ED8", colorAccent: "#FACC15", isActive: true, displayOrder: 3 },
      { id: "space", name: "Space Explorer", description: "Explore the universe!", colorPrimary: "#6366F1", colorSecondary: "#06B6D4", colorAccent: "#F59E0B", isActive: true, displayOrder: 4 },
      { id: "animals", name: "Animal Kingdom", description: "Learn with animals!", colorPrimary: "#16A34A", colorSecondary: "#92400E", colorAccent: "#F97316", isActive: true, displayOrder: 5 },
      { id: "golf", name: "Golf Pro", description: "Ace it!", colorPrimary: "#15803D", colorSecondary: "#FBBF24", colorAccent: "#ECFDF5", isActive: true, displayOrder: 6 },
    ];
    for (const t of themeData) {
      await db.insert(themes).values(t).onConflictDoNothing();
    }
    results.push(`Themes seeded: ${themeData.length}`);

    // Seed skill nodes (all domains)
    const allNodes = [...allSkillNodes, ...readingNodes, ...spellingNodes, ...grammarPunctuationNodes, ...writingNodes, ...precursorNodes];
    let nodesSeeded = 0;
    for (const node of allNodes) {
      try {
        await db.insert(skillNodes).values({
          code: node.code,
          name: node.name,
          description: node.description,
          yearLevel: node.yearLevel,
          domain: node.domain,
          learningArea: node.learningArea,
          strand: node.strand,
          subStrand: node.subStrand,
          acaraCode: node.acaraCode,
          dokLevel: node.dokLevel,
          difficultyBand: node.difficultyBand,
          displayOrder: node.displayOrder,
        }).onConflictDoNothing();
        nodesSeeded++;
      } catch { /* skip duplicates */ }
    }
    results.push(`Skill nodes seeded: ${nodesSeeded}`);

    // Seed prerequisites
    const allPrereqs = [...prerequisites, ...readingPrerequisites, ...spellingPrerequisites, ...grammarPunctuationPrerequisites, ...writingPrerequisites, ...precursorPrerequisites];
    let prereqsSeeded = 0;
    for (const prereq of allPrereqs) {
      try {
        const [skill] = await db.select({ id: skillNodes.id }).from(skillNodes).where(eq(skillNodes.code, prereq.skillCode));
        const [pre] = await db.select({ id: skillNodes.id }).from(skillNodes).where(eq(skillNodes.code, prereq.prerequisiteCode));
        if (skill && pre) {
          await db.insert(skillPrerequisites).values({
            skillId: skill.id,
            prerequisiteId: pre.id,
            strength: prereq.strength,
          }).onConflictDoNothing();
          prereqsSeeded++;
        }
      } catch { /* skip */ }
    }
    results.push(`Prerequisites seeded: ${prereqsSeeded}`);

    // Seed starter questions
    let questionsSeeded = 0;
    for (const q of starterQuestions) {
      try {
        const [skill] = await db.select({ id: skillNodes.id }).from(skillNodes).where(eq(skillNodes.code, q.skillCode));
        if (skill) {
          await db.insert(questions).values({
            skillId: skill.id,
            content: q.content,
            difficultyParam: q.difficultyParam,
            questionType: q.questionType,
            isValidated: true,
          });
          questionsSeeded++;
        }
      } catch { /* skip */ }
    }
    results.push(`Starter questions seeded: ${questionsSeeded}`);

    logger.info("Setup complete", { results });

    res.json({
      success: true,
      results,
      next: "Database is ready. You can now use the diagnostic and generate more questions via POST /admin/questions/generate-gaps",
    });
  } catch (err) {
    logger.error("Setup failed", { error: err instanceof Error ? err.message : String(err) });
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Setup failed",
    });
  }
});

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
