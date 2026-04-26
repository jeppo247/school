import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TARGET_ACCURACY } from "@upwise/shared";
import { selectSessionQuestion } from "./question-selector.js";
import { estimatePracticeTheta, getRollingAccuracy } from "./session-adaptation.js";

const correctResponses = Array.from({ length: 8 }, (_, index) => ({
  questionId: `correct-${index}`,
  isCorrect: true,
  difficultyAtTime: 0,
}));

const incorrectResponses = Array.from({ length: 8 }, (_, index) => ({
  questionId: `incorrect-${index}`,
  isCorrect: false,
  difficultyAtTime: 0,
}));

describe("session adaptation", () => {
  it("raises the practice ability estimate after strong recent accuracy", () => {
    const theta = estimatePracticeTheta(correctResponses);

    assert.ok(theta > 1, `expected theta above 1 after strong accuracy, got ${theta}`);
  });

  it("lowers the practice ability estimate after weak recent accuracy", () => {
    const theta = estimatePracticeTheta(incorrectResponses);

    assert.ok(theta < -1, `expected theta below -1 after weak accuracy, got ${theta}`);
  });

  it("uses the target accuracy before the child has answered", () => {
    assert.equal(getRollingAccuracy([]), TARGET_ACCURACY);
  });

  it("bases rolling accuracy on the recent response window", () => {
    const oldIncorrect = Array.from({ length: 6 }, (_, index) => ({
      questionId: `old-${index}`,
      isCorrect: false,
      difficultyAtTime: 0,
    }));
    const recentCorrect = Array.from({ length: 10 }, (_, index) => ({
      questionId: `recent-${index}`,
      isCorrect: true,
      difficultyAtTime: 0,
    }));

    assert.equal(getRollingAccuracy([...oldIncorrect, ...recentCorrect]), 1);
  });

  it("drives easier or harder question selection from recent performance", () => {
    const availableQuestions = [
      { id: "easier", skillId: "skill-1", difficultyParam: -3.2, discriminationParam: 1, guessingParam: 0.25 },
      { id: "steady", skillId: "skill-1", difficultyParam: -1.5, discriminationParam: 1, guessingParam: 0.25 },
      { id: "harder", skillId: "skill-1", difficultyParam: 0.3, discriminationParam: 1, guessingParam: 0.25 },
    ];

    const lowTheta = estimatePracticeTheta(incorrectResponses);
    const highTheta = estimatePracticeTheta(correctResponses);

    assert.equal(
      selectSessionQuestion(lowTheta, ["skill-1"], availableQuestions, new Set()),
      "easier",
    );
    assert.equal(
      selectSessionQuestion(highTheta, ["skill-1"], availableQuestions, new Set()),
      "harder",
    );
  });
});
