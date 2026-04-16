import {
  BKT_P_CORRECT_GIVEN_MASTERED,
  BKT_P_CORRECT_GIVEN_UNMASTERED,
  MASTERY_THRESHOLD,
  MASTERY_ACCURACY,
  MASTERY_MIN_ATTEMPTS,
  MASTERY_MIN_SESSIONS,
} from "@upwise/shared";
import type { MasteryStatus } from "@upwise/shared";

interface SkillState {
  masteryProbability: number;
  totalAttempts: number;
  correctAttempts: number;
  sessionsAssessed: number;
}

interface BKTUpdate {
  newProbability: number;
  newMasteryStatus: MasteryStatus;
}

/**
 * Bayesian Knowledge Tracing (BKT) update.
 *
 * Updates the mastery probability based on whether the student
 * answered correctly or incorrectly.
 */
export function updateKnowledgeState(
  currentState: SkillState,
  isCorrect: boolean,
  isNewSession: boolean,
): BKTUpdate {
  const pMastered = currentState.masteryProbability;
  const pSlip = 1 - BKT_P_CORRECT_GIVEN_MASTERED; // 0.05
  const pGuess = BKT_P_CORRECT_GIVEN_UNMASTERED; // 0.25

  let newProbability: number;

  if (isCorrect) {
    // P(mastered | correct) = P(correct | mastered) * P(mastered) / P(correct)
    const pCorrect =
      BKT_P_CORRECT_GIVEN_MASTERED * pMastered +
      pGuess * (1 - pMastered);
    newProbability = (BKT_P_CORRECT_GIVEN_MASTERED * pMastered) / pCorrect;
  } else {
    // P(mastered | incorrect) = P(incorrect | mastered) * P(mastered) / P(incorrect)
    const pIncorrect =
      pSlip * pMastered + (1 - pGuess) * (1 - pMastered);
    newProbability = (pSlip * pMastered) / pIncorrect;
  }

  // Clamp to [0.01, 0.99] to avoid certainty
  newProbability = Math.max(0.01, Math.min(0.99, newProbability));

  // Determine new mastery status
  const totalAttempts = currentState.totalAttempts + 1;
  const correctAttempts = currentState.correctAttempts + (isCorrect ? 1 : 0);
  const sessions = currentState.sessionsAssessed + (isNewSession ? 1 : 0);
  const accuracy = correctAttempts / totalAttempts;

  const newMasteryStatus = determineMasteryStatus(
    newProbability,
    totalAttempts,
    accuracy,
    sessions,
  );

  return {
    newProbability,
    newMasteryStatus,
  };
}

/**
 * Determines mastery status based on probability, attempts, accuracy, and sessions.
 */
export function determineMasteryStatus(
  probability: number,
  totalAttempts: number,
  accuracy: number,
  sessionsAssessed: number,
): MasteryStatus {
  if (totalAttempts === 0) return "unknown";

  // Full mastery requires multiple criteria
  if (
    probability >= MASTERY_THRESHOLD &&
    accuracy >= MASTERY_ACCURACY &&
    totalAttempts >= MASTERY_MIN_ATTEMPTS &&
    sessionsAssessed >= MASTERY_MIN_SESSIONS
  ) {
    return "mastered";
  }

  if (probability >= 0.6) return "almost";
  if (totalAttempts > 0) return "learning";

  return "unknown";
}
