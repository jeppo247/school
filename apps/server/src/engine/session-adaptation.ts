import { ROLLING_WINDOW_SIZE, TARGET_ACCURACY } from "@upwise/shared";
import { estimateAbilityEAP } from "./irt.js";
import type { AdaptiveResponse } from "./types.js";

export interface PracticeResponse {
  questionId?: string | null;
  skillId?: string | null;
  isCorrect: boolean;
  difficultyAtTime?: number | null;
  timeTakenMs?: number | null;
}

function recentResponses(responses: PracticeResponse[]): PracticeResponse[] {
  return responses.slice(-ROLLING_WINDOW_SIZE);
}

export function getRollingAccuracy(responses: PracticeResponse[]): number {
  const recent = recentResponses(responses);
  if (recent.length === 0) return TARGET_ACCURACY;

  return recent.filter((response) => response.isCorrect).length / recent.length;
}

export function estimatePracticeTheta(
  responses: PracticeResponse[],
  fallbackTheta = 0,
): number {
  const recent = recentResponses(responses);
  if (recent.length === 0) return fallbackTheta;

  const adaptiveResponses: AdaptiveResponse[] = recent.map((response, index) => ({
    questionId: response.questionId ?? `practice-response-${index}`,
    skillId: response.skillId ?? "",
    isCorrect: response.isCorrect,
    itemParams: {
      a: 1,
      b: response.difficultyAtTime ?? fallbackTheta,
      c: 0.25,
    },
    timeTakenMs: response.timeTakenMs ?? 0,
  }));

  return estimateAbilityEAP(adaptiveResponses, fallbackTheta).theta;
}
