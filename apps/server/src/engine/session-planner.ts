import type { SessionPlan, PhasePlan, FrontierGap } from "./types.js";
import {
  DAILY_SESSION_BASELINE_MINUTES,
  SESSION_WARMUP_MINUTES,
} from "@upwise/shared";

interface ReviewSkill {
  skillId: string;
  nextReview: Date;
}

/**
 * Plans a daily learning session structure.
 *
 * A daily session is planned around a 20-minute baseline.
 * Children can continue after the baseline, but the UI should prompt for a break.
 *
 * Structure:
 * - Optional warmup review
 * - Primary frontier gap practice for the remaining baseline time
 */
export function planSession(
  studentId: string,
  reviewSkills: ReviewSkill[],
  frontierGaps: FrontierGap[],
  currentTheta: number,
  now = new Date(),
): SessionPlan {
  const phases: PhasePlan[] = [];

  // Due review skills
  const dueReviews = reviewSkills
    .filter((s) => s.nextReview <= now)
    .map((s) => s.skillId);

  const warmupMinutes = dueReviews.length > 0 ? SESSION_WARMUP_MINUTES : 0;
  const focus1Minutes = DAILY_SESSION_BASELINE_MINUTES - warmupMinutes;

  // Warmup: spaced repetition review
  if (warmupMinutes > 0) {
    phases.push({
      phase: "warmup",
      targetSkills: dueReviews.slice(0, 3),
      questionCount: Math.min(5, dueReviews.length * 2),
      durationMinutes: warmupMinutes,
      difficultyTarget: currentTheta - 0.5,
    });
  }

  // Focus block: primary frontier gap (fills the remaining baseline)
  const primaryGap = frontierGaps[0];
  const focusSkills1 = primaryGap ? [primaryGap.skillId] : [];

  phases.push({
    phase: "focus_1",
    targetSkills: focusSkills1,
    questionCount: Math.round(focus1Minutes * 1.2),
    durationMinutes: focus1Minutes,
    difficultyTarget: currentTheta,
  });

  const allFocusSkills = [...new Set(focusSkills1)];

  return {
    studentId,
    phases,
    reviewSkills: dueReviews,
    focusSkills: allFocusSkills,
    estimatedDurationMinutes: DAILY_SESSION_BASELINE_MINUTES,
  };
}
