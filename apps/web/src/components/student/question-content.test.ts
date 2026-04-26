import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeQuestionContent } from "./question-content";

describe("normalizeQuestionContent", () => {
  it("uses an explicit passage and keeps the stem as the prompt", () => {
    const result = normalizeQuestionContent({
      stem: "What did Kobi do first?",
      passage: "Kobi climbed a big tree.\nHe ate some leaves.",
    });

    assert.equal(result.prompt, "What did Kobi do first?");
    assert.equal(result.passage, "Kobi climbed a big tree.\nHe ate some leaves.");
  });

  it("splits legacy reading stems on blank lines", () => {
    const result = normalizeQuestionContent({
      stem: "Kobi climbed a big tree.\n\nHe ate some leaves.\n\nWhat did Kobi do first?",
    });

    assert.equal(result.prompt, "What did Kobi do first?");
    assert.equal(result.passage, "Kobi climbed a big tree.\n\nHe ate some leaves.");
  });

  it("leaves short non-reading stems as a prompt only", () => {
    const result = normalizeQuestionContent({
      stem: "What is 3 + 5?",
    });

    assert.equal(result.prompt, "What is 3 + 5?");
    assert.equal(result.passage, undefined);
  });
});
