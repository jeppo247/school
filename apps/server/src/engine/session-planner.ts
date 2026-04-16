import type { SessionPlan, PhasePlan, FrontierGap } from "./types.js";

interface ReviewSkill {
  skillId: string;
  nextReview: Date;
}

/**
 * Plans a daily learning session structure.
 *
 * Structure:
 * - Warmup (3-5 min, ~5 questions): Spaced repetition review
 * - Focus Block 1 (10 min, ~8-12 questions): Primary frontier gap
 * - Brain Break (2-3 min): Fun activity
 * - Focus Block 2 (10 min, ~8-12 questions): Secondary gap or continuation
 * - Wrap-up (3-5 min): Review and celebration
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

  // Warmup: spaced repetition review
  phases.push({
    phase: "warmup",
    targetSkills: dueReviews.slice(0, 3),
    questionCount: Math.min(5, dueReviews.length * 2),
    durationMinutes: 4,
    difficultyTarget: currentTheta - 0.5, // Slightly easier for warmup
  });

  // Focus Block 1: primary frontier gap
  const primaryGap = frontierGaps[0];
  const focusSkills1 = primaryGap ? [primaryGap.skillId] : [];

  phases.push({
    phase: "focus_1",
    targetSkills: focusSkills1,
    questionCount: 10,
    durationMinutes: 10,
    difficultyTarget: currentTheta,
  });

  // Brain break
  phases.push({
    phase: "brain_break",
    targetSkills: [],
    questionCount: 0,
    durationMinutes: 3,
    difficultyTarget: 0,
  });

  // Focus Block 2: secondary gap or different skill
  const secondaryGap = frontierGaps[1] ?? frontierGaps[0];
  const focusSkills2 = secondaryGap ? [secondaryGap.skillId] : focusSkills1;

  phases.push({
    phase: "focus_2",
    targetSkills: focusSkills2,
    questionCount: 10,
    durationMinutes: 10,
    difficultyTarget: currentTheta,
  });

  // Wrap-up
  phases.push({
    phase: "wrapup",
    targetSkills: [],
    questionCount: 0,
    durationMinutes: 3,
    difficultyTarget: 0,
  });

  const allFocusSkills = [...new Set([...focusSkills1, ...focusSkills2])];

  return {
    studentId,
    phases,
    reviewSkills: dueReviews,
    focusSkills: allFocusSkills,
    estimatedDurationMinutes: 30,
  };
}
