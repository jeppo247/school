import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEMO_QUESTIONS,
  SUPPORTED_DEMO_YEARS,
  getDemoQuestionsForYear,
} from "./demo-questions";

describe("diagnostic demo question targeting", () => {
  it("does not show Prep questions to Year 7 learners", () => {
    const questions = getDemoQuestionsForYear(7);
    const ids = questions.map((question) => question.id);

    assert.equal(ids.includes("d5"), false);
    assert.ok(questions.every((question) => question.yearLevels.includes(7)));
  });

  it("has age-targeted demo questions for every supported year", () => {
    for (const yearLevel of SUPPORTED_DEMO_YEARS) {
      const questions = getDemoQuestionsForYear(yearLevel);

      assert.ok(
        questions.length >= 4,
        `Expected at least 4 demo questions for Year ${yearLevel}, got ${questions.length}`,
      );
      assert.ok(
        questions.every((question) => question.yearLevels.includes(yearLevel)),
        `Year ${yearLevel} received an out-of-band demo question`,
      );
    }
  });

  it("keeps every demo question mapped to at least one supported year", () => {
    for (const question of DEMO_QUESTIONS) {
      assert.ok(question.yearLevels.length > 0, `${question.id} has no year mapping`);
      assert.ok(
        question.yearLevels.every((yearLevel) => SUPPORTED_DEMO_YEARS.includes(yearLevel)),
        `${question.id} has an unsupported year mapping`,
      );
    }
  });
});
