import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { detectFrontierGaps } from "./gap-detector";

describe("detectFrontierGaps", () => {
  it("prioritises age-near unknown skills before far-below unknown skills", () => {
    const gaps = detectFrontierGaps(
      [
        {
          id: "prep-counting",
          code: "YF-NA-PV-001",
          name: "Count to 10",
          yearLevel: 0,
          masteryStatus: "unknown",
          masteryProbability: 0.5,
          prerequisites: [],
          dependents: [],
        },
        {
          id: "year-seven-algebra",
          code: "Y7-NA-ALG-001",
          name: "Simplify algebraic expressions",
          yearLevel: 7,
          masteryStatus: "unknown",
          masteryProbability: 0.5,
          prerequisites: [],
          dependents: [],
        },
      ],
      7,
    );

    assert.equal(gaps[0].skillId, "year-seven-algebra");
  });
});
