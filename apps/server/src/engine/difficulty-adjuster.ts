import {
  TARGET_ACCURACY,
  ACCURACY_FLOOR,
  ACCURACY_CEILING,
  DIFFICULTY_STEP,
  ROLLING_WINDOW_SIZE,
} from "@upwise/shared";

interface DifficultyState {
  /** Recent responses (true = correct) */
  recentResponses: boolean[];
  /** Current difficulty target (IRT b-parameter) */
  currentDifficulty: number;
}

export interface DifficultyAdjustment {
  newDifficulty: number;
  rollingAccuracy: number;
  shouldStepBack: boolean;
  action: "increase" | "decrease" | "maintain" | "step_back";
}

/**
 * Adjusts difficulty to maintain ~80% win rate.
 *
 * Uses a sliding window of recent responses to calculate rolling accuracy,
 * then adjusts the difficulty target accordingly.
 */
export function adjustDifficulty(state: DifficultyState): DifficultyAdjustment {
  const window = state.recentResponses.slice(-ROLLING_WINDOW_SIZE);

  if (window.length === 0) {
    return {
      newDifficulty: state.currentDifficulty,
      rollingAccuracy: TARGET_ACCURACY,
      shouldStepBack: false,
      action: "maintain",
    };
  }

  const correctCount = window.filter(Boolean).length;
  const rollingAccuracy = correctCount / window.length;

  // Too easy: increase difficulty
  if (rollingAccuracy > ACCURACY_CEILING) {
    return {
      newDifficulty: state.currentDifficulty + DIFFICULTY_STEP,
      rollingAccuracy,
      shouldStepBack: false,
      action: "increase",
    };
  }

  // Struggling badly: step back to prerequisites
  if (rollingAccuracy < 0.50 && window.length >= 5) {
    return {
      newDifficulty: state.currentDifficulty - DIFFICULTY_STEP * 2,
      rollingAccuracy,
      shouldStepBack: true,
      action: "step_back",
    };
  }

  // Too hard: decrease difficulty
  if (rollingAccuracy < ACCURACY_FLOOR) {
    return {
      newDifficulty: state.currentDifficulty - DIFFICULTY_STEP,
      rollingAccuracy,
      shouldStepBack: false,
      action: "decrease",
    };
  }

  // In the sweet spot (70-90%): maintain
  return {
    newDifficulty: state.currentDifficulty,
    rollingAccuracy,
    shouldStepBack: false,
    action: "maintain",
  };
}

/**
 * Calculates XP earned for a correct answer based on difficulty.
 * Harder questions earn more XP.
 */
export function calculateXP(
  difficulty: number,
  baseXP: number,
  difficultyMultiplier: number,
): number {
  const bonus = Math.max(0, Math.round(difficulty * difficultyMultiplier));
  return baseXP + bonus;
}
