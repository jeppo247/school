import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getDiagnosticQuestionYearLevels,
  isSupportedYearLevel,
} from "./year-levels";

describe("year-level question targeting", () => {
  it("keeps Prep to Year 5 diagnostics on the child's own year level", () => {
    assert.deepEqual(getDiagnosticQuestionYearLevels(0), [0]);
    assert.deepEqual(getDiagnosticQuestionYearLevels(1), [1]);
    assert.deepEqual(getDiagnosticQuestionYearLevels(2), [2]);
    assert.deepEqual(getDiagnosticQuestionYearLevels(3), [3]);
    assert.deepEqual(getDiagnosticQuestionYearLevels(4), [4]);
    assert.deepEqual(getDiagnosticQuestionYearLevels(5), [5]);
  });

  it("uses the closest lower NAPLAN practice bank for Year 6", () => {
    assert.deepEqual(getDiagnosticQuestionYearLevels(6), [5]);
  });

  it("uses Year 7 questions for Year 7 learners", () => {
    assert.deepEqual(getDiagnosticQuestionYearLevels(7), [7]);
  });

  it("identifies supported Prep to Year 7 values", () => {
    assert.equal(isSupportedYearLevel(0), true);
    assert.equal(isSupportedYearLevel(7), true);
    assert.equal(isSupportedYearLevel(-1), false);
    assert.equal(isSupportedYearLevel(8), false);
  });
});
