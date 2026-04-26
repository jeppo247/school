import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DAILY_SESSION_BASELINE_MINUTES } from "@upwise/shared";
import { planSession } from "./session-planner.js";
import type { FrontierGap } from "./types.js";

const frontierGap: FrontierGap = {
  skillId: "skill-1",
  skillCode: "Y4-NA-001",
  skillName: "Use place value",
  yearLevel: 4,
  masteryProbability: 0.4,
  priorityScore: 3,
  downstreamImpact: 1,
  yearLevelDistance: 0,
  prerequisitesMet: true,
};

describe("planSession", () => {
  it("keeps the planned daily session at the 20 minute baseline", () => {
    const plan = planSession(
      "student-1",
      [{ skillId: "review-1", nextReview: new Date("2026-04-26T00:00:00.000Z") }],
      [frontierGap],
      0,
      new Date("2026-04-26T00:01:00.000Z"),
    );

    const phaseMinutes = plan.phases.reduce((total, phase) => total + phase.durationMinutes, 0);

    assert.equal(plan.estimatedDurationMinutes, DAILY_SESSION_BASELINE_MINUTES);
    assert.equal(phaseMinutes, DAILY_SESSION_BASELINE_MINUTES);
  });

  it("uses the full baseline for focus practice when no review is due", () => {
    const plan = planSession("student-1", [], [frontierGap], 0);

    assert.deepEqual(
      plan.phases.map((phase) => [phase.phase, phase.durationMinutes]),
      [["focus_1", DAILY_SESSION_BASELINE_MINUTES]],
    );
  });
});
