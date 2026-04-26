import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DAILY_SESSION_BASELINE_MINUTES } from "@upwise/shared";
import { getSessionTiming } from "./session-timing.js";

describe("getSessionTiming", () => {
  it("does not mark the baseline as reached before 20 minutes", () => {
    const timing = getSessionTiming(
      new Date("2026-04-26T09:00:00.000Z"),
      new Date("2026-04-26T09:19:59.000Z"),
    );

    assert.equal(timing.baselineMinutes, DAILY_SESSION_BASELINE_MINUTES);
    assert.equal(timing.baselineReached, false);
  });

  it("marks the baseline as reached at 20 minutes without forcing completion", () => {
    const timing = getSessionTiming(
      new Date("2026-04-26T09:00:00.000Z"),
      new Date("2026-04-26T09:20:00.000Z"),
    );

    assert.equal(timing.baselineReached, true);
    assert.equal(timing.shouldForceComplete, false);
  });
});
