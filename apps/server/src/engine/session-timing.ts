import { DAILY_SESSION_BASELINE_MINUTES } from "@upwise/shared";

const SECONDS_PER_MINUTE = 60;

export interface SessionTiming {
  elapsedSeconds: number;
  baselineSeconds: number;
  baselineMinutes: number;
  baselineReached: boolean;
  shouldForceComplete: boolean;
}

export function getSessionTiming(startedAt: Date | string, now = new Date()): SessionTiming {
  const startedAtDate = startedAt instanceof Date ? startedAt : new Date(startedAt);
  const elapsedSeconds = Math.max(
    0,
    Math.floor((now.getTime() - startedAtDate.getTime()) / 1000),
  );
  const baselineSeconds = DAILY_SESSION_BASELINE_MINUTES * SECONDS_PER_MINUTE;

  return {
    elapsedSeconds,
    baselineSeconds,
    baselineMinutes: DAILY_SESSION_BASELINE_MINUTES,
    baselineReached: elapsedSeconds >= baselineSeconds,
    shouldForceComplete: false,
  };
}
