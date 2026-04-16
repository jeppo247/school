import type { SessionPlan, PhasePlan, FrontierGap } from "./types.js";
import {
  MAX_BLOCK_DURATION_MINUTES,
  BRAIN_BREAK_DURATION_MINUTES,
} from "@upwise/shared";

interface ReviewSkill {
  skillId: string;
  nextReview: Date;
}

/**
 * Plans a daily learning session structure.
 *
 * Hard rule: max 20 minutes of learning before a mandatory break.
 *
 * Structure:
 * - Focus Block 1 (up to 20 min): Warmup review + primary frontier gap
 * - Brain Break (3 min): Mandatory rest
 * - Focus Block 2 (up to 20 min): Secondary gap or continuation
 * - Wrap-up (3 min): Review and celebration
 */
export function planSession(
  studentId: string,
  reviewSkills: ReviewSkill[],
  frontierGaps: FrontierGap[],
  currentTheta: number,
): SessionPlan {
  const phases: PhasePlan[] = [];

  // Due review skills
  const now = new Date();
  const dueReviews = reviewSkills
    .filter((s) => s.nextReview <= now)
    .map((s) => s.skillId);

  // Block 1: warmup review (5 min) + primary gap focus (15 min) = 20 min max
  const warmupMinutes = Math.min(5, dueReviews.length > 0 ? 5 : 0);
  const focus1Minutes = MAX_BLOCK_DURATION_MINUTES - warmupMinutes;

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

  // Focus Block 1: primary frontier gap (fills remainder of 20 min block)
  const primaryGap = frontierGaps[0];
  const focusSkills1 = primaryGap ? [primaryGap.skillId] : [];

  phases.push({
    phase: "focus_1",
    targetSkills: focusSkills1,
    questionCount: Math.round(focus1Minutes * 1.2),
    durationMinutes: focus1Minutes,
    difficultyTarget: currentTheta,
  });

  // Mandatory brain break after 20 min block
  phases.push({
    phase: "brain_break",
    targetSkills: [],
    questionCount: 0,
    durationMinutes: BRAIN_BREAK_DURATION_MINUTES,
    difficultyTarget: 0,
  });

  // Focus Block 2: secondary gap (up to 20 min max)
  const secondaryGap = frontierGaps[1] ?? frontierGaps[0];
  const focusSkills2 = secondaryGap ? [secondaryGap.skillId] : focusSkills1;

  phases.push({
    phase: "focus_2",
    targetSkills: focusSkills2,
    questionCount: Math.round(MAX_BLOCK_DURATION_MINUTES * 1.2),
    durationMinutes: MAX_BLOCK_DURATION_MINUTES,
    difficultyTarget: currentTheta,
  });

  // Wrap-up
  phases.push({
    phase: "wrapup",
    targetSkills: [],
    questionCount: 0,
    durationMinutes: BRAIN_BREAK_DURATION_MINUTES,
    difficultyTarget: 0,
  });

  const allFocusSkills = [...new Set([...focusSkills1, ...focusSkills2])];
  const totalMinutes =
    warmupMinutes +
    focus1Minutes +
    BRAIN_BREAK_DURATION_MINUTES +
    MAX_BLOCK_DURATION_MINUTES +
    BRAIN_BREAK_DURATION_MINUTES;

  return {
    studentId,
    phases,
    reviewSkills: dueReviews,
    focusSkills: allFocusSkills,
    estimatedDurationMinutes: totalMinutes,
  };
}
