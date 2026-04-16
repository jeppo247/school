import {
  SR_INITIAL_INTERVAL,
  SR_DEFAULT_EASE,
  SR_MIN_EASE,
  SR_MAX_EASE,
  SR_EASE_BONUS,
  SR_EASE_PENALTY,
  MASTERY_ACCURACY,
} from "@upwise/shared";

export interface ReviewSchedule {
  nextReviewDate: Date;
  newIntervalDays: number;
  newEaseFactor: number;
  shouldReenterLearning: boolean;
}

/**
 * SM-2 inspired spaced repetition scheduler.
 *
 * When a skill is mastered, it enters the review cycle.
 * Successful reviews increase the interval exponentially.
 * Failed reviews reset the skill to active learning.
 *
 * Schedule progression: 1d → 2.5d → 6d → 15d → 38d
 */
export function scheduleReview(
  reviewAccuracy: number,
  currentIntervalDays: number,
  currentEaseFactor: number,
): ReviewSchedule {
  const now = new Date();

  // Failed review: reset to learning
  if (reviewAccuracy < MASTERY_ACCURACY) {
    return {
      nextReviewDate: new Date(now.getTime() + SR_INITIAL_INTERVAL * 86400000),
      newIntervalDays: SR_INITIAL_INTERVAL,
      newEaseFactor: Math.max(SR_MIN_EASE, currentEaseFactor - SR_EASE_PENALTY),
      shouldReenterLearning: true,
    };
  }

  // Successful review: extend interval
  const newEaseFactor = Math.min(SR_MAX_EASE, currentEaseFactor + SR_EASE_BONUS);
  const newInterval = Math.round(currentIntervalDays * newEaseFactor);

  return {
    nextReviewDate: new Date(now.getTime() + newInterval * 86400000),
    newIntervalDays: newInterval,
    newEaseFactor,
    shouldReenterLearning: false,
  };
}

/**
 * Initialize spaced repetition for a newly mastered skill.
 */
export function initializeReview(): {
  nextReviewDate: Date;
  intervalDays: number;
  easeFactor: number;
} {
  const now = new Date();
  return {
    nextReviewDate: new Date(now.getTime() + SR_INITIAL_INTERVAL * 86400000),
    intervalDays: SR_INITIAL_INTERVAL,
    easeFactor: SR_DEFAULT_EASE,
  };
}

/**
 * Get all skills due for review (next_review <= now).
 */
export function isDueForReview(nextReview: Date | null): boolean {
  if (!nextReview) return false;
  return new Date() >= nextReview;
}
