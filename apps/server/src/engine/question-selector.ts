import { selectMaxInfoItem, difficultyForTargetAccuracy } from "./irt.js";
import { TARGET_ACCURACY } from "@upwise/shared";
import type { ItemParams } from "./types.js";

interface AvailableQuestion {
  id: string;
  skillId: string;
  difficultyParam: number;
  discriminationParam: number;
  guessingParam: number;
}

/**
 * Selects the next question for a diagnostic assessment using CAT.
 * Maximises information at the current ability estimate.
 */
export function selectDiagnosticQuestion(
  theta: number,
  available: AvailableQuestion[],
  alreadyAsked: Set<string>,
): string | null {
  const candidates = available
    .filter((q) => !alreadyAsked.has(q.id))
    .map((q) => ({
      id: q.id,
      params: {
        a: q.discriminationParam,
        b: q.difficultyParam,
        c: q.guessingParam,
      } satisfies ItemParams,
    }));

  return selectMaxInfoItem(theta, candidates);
}

/**
 * Selects the next question for a daily learning session.
 * Targets the student's frontier gaps at ~80% accuracy.
 */
export function selectSessionQuestion(
  theta: number,
  targetSkillIds: string[],
  available: AvailableQuestion[],
  alreadyAsked: Set<string>,
): string | null {
  // Filter to target skills that haven't been asked yet
  const candidates = available.filter(
    (q) => targetSkillIds.includes(q.skillId) && !alreadyAsked.has(q.id),
  );

  if (candidates.length === 0) return null;

  // Find the question closest to the target difficulty for 80% accuracy
  const targetDifficulty = difficultyForTargetAccuracy(theta, TARGET_ACCURACY);

  let bestId = candidates[0].id;
  let bestDistance = Infinity;

  for (const q of candidates) {
    const distance = Math.abs(q.difficultyParam - targetDifficulty);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = q.id;
    }
  }

  return bestId;
}

/**
 * Selects review questions for spaced repetition warmup.
 * Picks easier questions from mastered skills due for review.
 */
export function selectReviewQuestion(
  theta: number,
  reviewSkillIds: string[],
  available: AvailableQuestion[],
  alreadyAsked: Set<string>,
): string | null {
  const candidates = available.filter(
    (q) => reviewSkillIds.includes(q.skillId) && !alreadyAsked.has(q.id),
  );

  if (candidates.length === 0) return null;

  // For review, pick slightly easier questions (90% target accuracy)
  const targetDifficulty = difficultyForTargetAccuracy(theta, 0.9);

  let bestId = candidates[0].id;
  let bestDistance = Infinity;

  for (const q of candidates) {
    const distance = Math.abs(q.difficultyParam - targetDifficulty);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = q.id;
    }
  }

  return bestId;
}
