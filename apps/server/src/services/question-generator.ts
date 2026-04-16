import { db } from "../db/client.js";
import { questions, skillNodes, questionTemplates } from "../db/schema.js";
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
 * Each question is validated before being stored.
 */
export async function generateQuestionBatch(
  params: GenerateBatchParams,
): Promise<GenerationResult> {
  const { skillId, count, themeId, questionType = "multiple_choice" } = params;

  // Get skill details
  const [skill] = await db
    .select()
    .from(skillNodes)
    .where(eq(skillNodes.id, skillId));

  if (!skill) {
    throw new Error(`Skill node ${skillId} not found`);
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
        difficulty,
        questionType,
        themeId,
      });

      // Validate the generated content
      const validation = validateQuestionContent(content, questionType);
      if (!validation.valid) {
        logger.warn("Question validation failed", {
          skillId,
          reason: validation.reason,
        });
        failed++;
        continue;
      }

      // Store the question
      const [stored] = await db
        .insert(questions)
        .values({
          skillId,
          themeId: themeId ?? null,
          content,
          difficultyParam,
          questionType,
          isValidated: false, // Admin must manually validate
        })
        .returning();

      questionIds.push(stored.id);
    } catch (err) {
      logger.error("Question generation failed", {
        skillId,
        error: err instanceof Error ? err.message : String(err),
      });
      failed++;
    }
  }

  logger.info("Question batch generated", {
    skillId,
    skillName: skill.name,
    requested: count,
    generated: questionIds.length,
    failed,
  });

  return {
    generated: questionIds.length,
    failed,
    questionIds,
  };
}

/**
 * Generates questions for all skills that have fewer than the minimum threshold.
 */
export async function generateQuestionsForGaps(
  minQuestionsPerSkill: number = 20,
  batchSize: number = 5,
): Promise<{ skillsProcessed: number; totalGenerated: number }> {
  // Find skills with insufficient questions
  const skills = await db.select().from(skillNodes).where(eq(skillNodes.isActive, true));

  let skillsProcessed = 0;
  let totalGenerated = 0;

  for (const skill of skills) {
    const existingQuestions = await db
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.skillId, skill.id));

    const deficit = minQuestionsPerSkill - existingQuestions.length;

    if (deficit > 0) {
      const toGenerate = Math.min(deficit, batchSize);
      const result = await generateQuestionBatch({
        skillId: skill.id,
        count: toGenerate,
      });
      totalGenerated += result.generated;
      skillsProcessed++;
    }
  }

  return { skillsProcessed, totalGenerated };
}

/**
 * Validates generated question content for correctness and completeness.
 */
function validateQuestionContent(
  content: Record<string, unknown>,
  questionType: string,
): { valid: boolean; reason?: string } {
  // Must have a stem
  if (!content.stem || typeof content.stem !== "string" || content.stem.length < 5) {
    return { valid: false, reason: "Missing or too short question stem" };
  }

  // Must have an answer
  if (content.answer === undefined || content.answer === null) {
    return { valid: false, reason: "Missing answer" };
  }

  // Multiple choice must have options
  if (questionType === "multiple_choice") {
    if (!Array.isArray(content.options) || content.options.length !== 4) {
      return { valid: false, reason: "Multiple choice must have exactly 4 options" };
    }
    // Answer must be in options
    const answer = String(content.answer);
    const options = content.options.map(String);
    if (!options.includes(answer)) {
      return { valid: false, reason: "Correct answer not found in options" };
    }
    // Options must be unique
    if (new Set(options).size !== options.length) {
      return { valid: false, reason: "Options must be unique" };
    }
  }

  // Numeric input answer must be a number
  if (questionType === "numeric_input") {
    if (typeof content.answer !== "number" && isNaN(Number(content.answer))) {
      return { valid: false, reason: "Numeric input answer must be a valid number" };
    }
  }

  // Must have explanation
  if (!content.explanation || typeof content.explanation !== "string") {
    return { valid: false, reason: "Missing explanation" };
  }

  // Must have hint
  if (!content.hint || typeof content.hint !== "string") {
    return { valid: false, reason: "Missing hint" };
  }

  return { valid: true };
}
