import { db } from "../db/client.js";
import { questions, skillNodes } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { generateQuestion } from "./content-generator.js";
import { logger } from "../lib/logger.js";

interface GenerateBatchParams {
  skillId: string;
  count: number;
  themeId?: string;
  questionType?: "multiple_choice" | "numeric_input" | "true_false";
}

interface GenerationResult {
  generated: number;
  failed: number;
  questionIds: string[];
}

/**
 * Generates a batch of questions for a skill node using Claude API.
 * Detects the domain from the skill node and uses the appropriate prompt.
 */
export async function generateQuestionBatch(
  params: GenerateBatchParams,
): Promise<GenerationResult> {
  const { skillId, count, themeId, questionType = "multiple_choice" } = params;

  const [skill] = await db
    .select()
    .from(skillNodes)
    .where(eq(skillNodes.id, skillId));

  if (!skill) {
    throw new Error(`Skill node ${skillId} not found`);
  }

  // Skip writing domain — uses rubric scoring, not MCQ generation
  if (skill.domain === "writing") {
    logger.info("Skipping writing domain — uses rubric scoring", { skillId });
    return { generated: 0, failed: 0, questionIds: [] };
  }

  const difficulties: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];
  const questionIds: string[] = [];
  let failed = 0;

  for (let i = 0; i < count; i++) {
    const difficulty = difficulties[i % difficulties.length];
    const difficultyParam = difficulty === "easy" ? -1 : difficulty === "medium" ? 0 : 1;

    try {
      const content = await generateQuestion({
        skillName: skill.name,
        skillDescription: skill.description ?? skill.name,
        yearLevel: skill.yearLevel,
        domain: skill.domain as "numeracy" | "reading" | "spelling" | "grammar_punctuation",
        difficulty,
        questionType,
        themeId,
      });

      const validation = validateQuestionContent(
        content as unknown as Record<string, unknown>,
        questionType,
        skill.domain,
      );

      if (!validation.valid) {
        logger.warn("Question validation failed", { skillId, domain: skill.domain, reason: validation.reason });
        failed++;
        continue;
      }

      const [stored] = await db
        .insert(questions)
        .values({
          skillId,
          themeId: themeId ?? null,
          content,
          difficultyParam,
          questionType,
          isValidated: false,
        })
        .returning();

      questionIds.push(stored.id);
    } catch (err) {
      logger.error("Question generation failed", {
        skillId,
        domain: skill.domain,
        error: err instanceof Error ? err.message : String(err),
      });
      failed++;
    }
  }

  logger.info("Question batch generated", {
    skillId,
    skillName: skill.name,
    domain: skill.domain,
    requested: count,
    generated: questionIds.length,
    failed,
  });

  return { generated: questionIds.length, failed, questionIds };
}

/**
 * Generates questions for all skills that have fewer than the minimum threshold.
 * Skips writing domain (uses rubric scoring).
 */
export async function generateQuestionsForGaps(
  minQuestionsPerSkill: number = 20,
  batchSize: number = 5,
): Promise<{ skillsProcessed: number; totalGenerated: number; skipped: number }> {
  const skills = await db.select().from(skillNodes).where(eq(skillNodes.isActive, true));

  let skillsProcessed = 0;
  let totalGenerated = 0;
  let skipped = 0;

  for (const skill of skills) {
    // Skip writing — uses rubric scoring
    if (skill.domain === "writing") {
      skipped++;
      continue;
    }

    const existingQuestions = await db
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.skillId, skill.id));

    const deficit = minQuestionsPerSkill - existingQuestions.length;

    if (deficit > 0) {
      const toGenerate = Math.min(deficit, batchSize);

      logger.info(`Generating ${toGenerate} questions for ${skill.name} (${skill.domain}, Y${skill.yearLevel})`, {
        skillId: skill.id,
        existing: existingQuestions.length,
        deficit,
      });

      const result = await generateQuestionBatch({
        skillId: skill.id,
        count: toGenerate,
      });

      totalGenerated += result.generated;
      skillsProcessed++;
    }
  }

  logger.info("Gap generation complete", { skillsProcessed, totalGenerated, skipped });
  return { skillsProcessed, totalGenerated, skipped };
}

/**
 * Validates generated question content.
 */
function validateQuestionContent(
  content: Record<string, unknown>,
  questionType: string,
  domain?: string,
): { valid: boolean; reason?: string } {
  if (!content.stem || typeof content.stem !== "string" || content.stem.length < 5) {
    return { valid: false, reason: "Missing or too short question stem" };
  }

  if (content.answer === undefined || content.answer === null) {
    return { valid: false, reason: "Missing answer" };
  }

  if (questionType === "multiple_choice") {
    if (!Array.isArray(content.options) || content.options.length < 3 || content.options.length > 5) {
      return { valid: false, reason: "Multiple choice must have 3-5 options" };
    }
    const answer = String(content.answer);
    const options = content.options.map(String);
    if (!options.includes(answer)) {
      return { valid: false, reason: "Correct answer not found in options" };
    }
    if (new Set(options).size !== options.length) {
      return { valid: false, reason: "Options must be unique" };
    }
  }

  if (questionType === "numeric_input") {
    if (typeof content.answer !== "number" && isNaN(Number(content.answer))) {
      return { valid: false, reason: "Numeric input answer must be a valid number" };
    }
  }

  if (!content.explanation || typeof content.explanation !== "string") {
    return { valid: false, reason: "Missing explanation" };
  }

  if (!content.hint || typeof content.hint !== "string") {
    return { valid: false, reason: "Missing hint" };
  }

  // Domain-specific validation
  if (domain === "reading") {
    if (typeof content.stem === "string" && content.stem.length < 50) {
      return { valid: false, reason: "Reading question stem too short — must include a passage" };
    }
  }

  return { valid: true };
}
