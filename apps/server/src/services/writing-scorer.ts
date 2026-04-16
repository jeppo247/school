import { claude } from "../lib/claude.js";
import { db } from "../db/client.js";
import { writingScores } from "../db/schema.js";
import { logger } from "../lib/logger.js";
import { WRITING_RUBRIC_CRITERIA, type WritingRubricCriterion } from "@upwise/shared";

interface WritingScore {
  criterion: WritingRubricCriterion;
  score: number;
  maxScore: number;
  feedback: string;
  confidence: number;
}

interface WritingScoringResult {
  scores: WritingScore[];
  totalScore: number;
  maxTotalScore: number;
  overallFeedback: string;
}

/**
 * Scores a student's writing response against the NAPLAN 10-criterion rubric
 * using Claude. Always labelled as practice feedback, never as an official score.
 *
 * The 10 criteria (matching NAPLAN's analytic rubric):
 * 1. Audience
 * 2. Text structure
 * 3. Ideas
 * 4. Character and setting (narrative) / Persuasive devices (persuasive)
 * 5. Vocabulary
 * 6. Cohesion
 * 7. Paragraphing
 * 8. Sentence structure
 * 9. Punctuation
 * 10. Spelling
 */
export async function scoreWriting(
  studentText: string,
  genre: "narrative" | "persuasive",
  promptText: string,
  yearLevel: number,
): Promise<WritingScoringResult> {
  if (!claude) {
    throw new Error("Claude API client not configured — set ANTHROPIC_API_KEY");
  }

  const criteriaDescriptions = genre === "narrative"
    ? `1. Audience: awareness of reader, appropriate voice and tone
2. Text structure: orientation, complication, resolution (clear beginning, middle, end)
3. Ideas: relevance, development, elaboration of ideas
4. Character and setting: creation of character and setting through description
5. Vocabulary: range, precision, and effectiveness of word choices
6. Cohesion: logical connections between ideas, use of connectives and referencing
7. Paragraphing: organisation into paragraphs, paragraph structure
8. Sentence structure: variety, correctness, and complexity of sentences
9. Punctuation: correct use of full stops, commas, speech marks, apostrophes
10. Spelling: accuracy of spelling including common and topic-specific words`
    : `1. Audience: awareness of reader, persuasive voice and tone
2. Text structure: introduction with position, body with arguments, conclusion
3. Ideas: strength and relevance of arguments, use of evidence
4. Persuasive devices: rhetorical questions, emotive language, expert opinions
5. Vocabulary: range, precision, and persuasive word choices
6. Cohesion: logical argument flow, use of connectives and linking
7. Paragraphing: organisation into paragraphs, one argument per paragraph
8. Sentence structure: variety, correctness, and complexity of sentences
9. Punctuation: correct use of full stops, commas, colons, apostrophes
10. Spelling: accuracy of spelling including common and topic-specific words`;

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are a writing assessor for Australian primary students. Score this Year ${yearLevel} student's ${genre} writing against each criterion below.

PROMPT: "${promptText}"

STUDENT'S WRITING:
"""
${studentText}
"""

SCORING CRITERIA (score each 0-6):
${criteriaDescriptions}

For each criterion, provide:
- A score from 0 (not demonstrated) to 6 (outstanding for year level)
- Brief, encouraging feedback (1-2 sentences) written for a parent to understand
- A confidence level (0.0-1.0) indicating how certain you are of the score

Also provide a brief overall summary (2-3 sentences) of the writing's strengths and one area to focus on next.

Use Australian English. Be encouraging but honest. This is practice feedback, not an official assessment.

Respond in JSON:
{
  "scores": [
    { "criterion": "audience", "score": 4, "maxScore": 6, "feedback": "...", "confidence": 0.85 },
    ...all 10 criteria...
  ],
  "overallFeedback": "..."
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text) as {
      scores: WritingScore[];
      overallFeedback: string;
    };

    const totalScore = parsed.scores.reduce((sum, s) => sum + s.score, 0);
    const maxTotalScore = parsed.scores.reduce((sum, s) => sum + s.maxScore, 0);

    return {
      scores: parsed.scores,
      totalScore,
      maxTotalScore,
      overallFeedback: parsed.overallFeedback,
    };
  } catch {
    logger.error("Failed to parse writing score response", { text });
    throw new Error("Failed to generate writing feedback");
  }
}

/**
 * Stores writing scores in the database.
 */
export async function persistWritingScores(
  attemptId: string,
  result: WritingScoringResult,
): Promise<void> {
  for (const score of result.scores) {
    await db.insert(writingScores).values({
      attemptId,
      criterion: score.criterion,
      score: score.score,
      maxScore: score.maxScore,
      raterType: "ai",
      confidence: score.confidence,
      feedback: score.feedback,
    });
  }

  logger.info("Writing scores persisted", {
    attemptId,
    totalScore: result.totalScore,
    maxTotal: result.maxTotalScore,
  });
}
