import {
  IRT_THETA_MIN,
  IRT_THETA_MAX,
  IRT_THETA_STEP,
} from "@upwise/shared";
import type { ItemParams, AbilityEstimate, AdaptiveResponse } from "./types.js";

/** Discretized theta grid for EAP estimation */
const THETA_GRID: number[] = [];
for (let t = IRT_THETA_MIN; t <= IRT_THETA_MAX; t += IRT_THETA_STEP) {
  THETA_GRID.push(Math.round(t * 10) / 10);
}

/**
 * 3-Parameter Logistic (3PL) IRT model.
 * P(correct | theta, a, b, c) = c + (1 - c) / (1 + exp(-a * (theta - b)))
 */
export function probability3PL(theta: number, item: ItemParams): number {
  const { a, b, c } = item;
  return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

/**
 * 2-Parameter Logistic (2PL) IRT model — 3PL with c = 0.
 */
export function probability2PL(theta: number, a: number, b: number): number {
  return 1 / (1 + Math.exp(-a * (theta - b)));
}

/**
 * Fisher information function for an item at a given theta.
 * I(theta) = a^2 * P * Q for 2PL
 * For 3PL: I(theta) = a^2 * [(P - c)^2 / ((1 - c)^2 * P)] * Q
 */
export function itemInformation(theta: number, item: ItemParams): number {
  const p = probability3PL(theta, item);
  const q = 1 - p;
  const { a, c } = item;

  if (c === 0) {
    return a * a * p * q;
  }

  const numerator = (p - c) * (p - c);
  const denominator = (1 - c) * (1 - c) * p;

  if (denominator === 0) return 0;

  return a * a * (numerator / denominator) * q;
}

/**
 * Normal PDF for the prior distribution.
 */
function normalPdf(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

/**
 * Expected A Posteriori (EAP) ability estimation.
 * Uses a discretized grid with a normal prior.
 */
export function estimateAbilityEAP(
  responses: AdaptiveResponse[],
  priorMean = 0,
  priorSD = 1,
): AbilityEstimate {
  // Initialize prior probabilities
  const logPosterior = THETA_GRID.map((theta) =>
    Math.log(normalPdf(theta, priorMean, priorSD)),
  );

  // Update with each response
  for (const response of responses) {
    for (let i = 0; i < THETA_GRID.length; i++) {
      const p = probability3PL(THETA_GRID[i], response.itemParams);
      const likelihood = response.isCorrect ? p : 1 - p;
      logPosterior[i] += Math.log(Math.max(likelihood, 1e-10));
    }
  }

  // Convert from log space and normalize
  const maxLog = Math.max(...logPosterior);
  const posterior = logPosterior.map((lp) => Math.exp(lp - maxLog));
  const sum = posterior.reduce((a, b) => a + b, 0);
  const normalized = posterior.map((p) => p / sum);

  // Compute EAP (weighted mean)
  let theta = 0;
  for (let i = 0; i < THETA_GRID.length; i++) {
    theta += THETA_GRID[i] * normalized[i];
  }

  // Compute standard error (weighted SD)
  let variance = 0;
  for (let i = 0; i < THETA_GRID.length; i++) {
    const diff = THETA_GRID[i] - theta;
    variance += diff * diff * normalized[i];
  }
  const standardError = Math.sqrt(variance);

  return {
    theta,
    standardError,
    responseCount: responses.length,
  };
}

/**
 * Select the next question for maximum information at current theta estimate.
 * Used in Computerized Adaptive Testing (CAT) for diagnostic mode.
 */
export function selectMaxInfoItem(
  theta: number,
  availableItems: { id: string; params: ItemParams }[],
): string | null {
  if (availableItems.length === 0) return null;

  let bestId = availableItems[0].id;
  let bestInfo = -Infinity;

  for (const item of availableItems) {
    const info = itemInformation(theta, item.params);
    if (info > bestInfo) {
      bestInfo = info;
      bestId = item.id;
    }
  }

  return bestId;
}

/**
 * Find the difficulty (b) parameter that gives target accuracy at a given theta.
 * For 2PL: b = theta - ln((1/P - 1)) / a
 */
export function difficultyForTargetAccuracy(
  theta: number,
  targetAccuracy: number,
  discrimination = 1,
): number {
  const odds = targetAccuracy / (1 - targetAccuracy);
  return theta - Math.log(odds) / discrimination;
}
