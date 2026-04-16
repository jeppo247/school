import { db } from "../db/client.js";
import { misconceptionEvents, questions } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { detectMisconception, analyseMisconceptionPatterns, describeMisconception } from "../engine/misconception-tracker.js";
import { logger } from "../lib/logger.js";

/**
 * Records a misconception event when a student answers incorrectly.
 * Looks up the distractor map on the question to identify which
 * specific misconception the student demonstrated.
 */
export async function recordMisconceptionIfPresent(
  studentId: string,
  questionId: string,
  skillId: string,
  sessionId: string,
  studentAnswer: string | number,
): Promise<string | null> {
  const [question] = await db
    .select({ distractorMap: questions.distractorMap })
    .from(questions)
    .where(eq(questions.id, questionId));

  if (!question?.distractorMap) return null;

  const code = detectMisconception(
    studentAnswer,
    question.distractorMap as Record<string, string>,
  );

  if (!code) return null;

  await db.insert(misconceptionEvents).values({
    studentId,
    skillId,
    misconceptionCode: code,
    itemId: questionId,
    sessionId,
  });

  logger.info("Misconception recorded", { studentId, skillId, code });
  return code;
}

/**
 * Gets misconception patterns for a student, optionally filtered by skill.
 * Returns patterns sorted by frequency with reteach recommendations.
 */
export async function getStudentMisconceptions(
  studentId: string,
  skillId?: string,
) {
  const conditions = [eq(misconceptionEvents.studentId, studentId)];
  if (skillId) conditions.push(eq(misconceptionEvents.skillId, skillId));

  const events = await db
    .select({
      misconceptionCode: misconceptionEvents.misconceptionCode,
      skillId: misconceptionEvents.skillId,
    })
    .from(misconceptionEvents)
    .where(and(...conditions));

  const patterns = analyseMisconceptionPatterns(events);

  return patterns.map((p) => ({
    ...p,
    description: describeMisconception(p.misconceptionCode),
  }));
}

/**
 * Gets misconception summary for the parent dashboard.
 * Returns the top recurring misconceptions with human-readable descriptions.
 */
export async function getMisconceptionSummary(studentId: string, limit = 5) {
  const patterns = await getStudentMisconceptions(studentId);
  return patterns.slice(0, limit).filter((p) => p.count >= 2);
}
