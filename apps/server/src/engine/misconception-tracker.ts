import type { DistractorMap } from "@upwise/shared";

export interface MisconceptionEvent {
  studentId: string;
  skillId: string;
  misconceptionCode: string;
  itemId: string;
  sessionId: string;
}

export interface MisconceptionPattern {
  misconceptionCode: string;
  skillId: string;
  count: number;
  needsReteach: boolean;
}

const RETEACH_THRESHOLD = 3;

/**
 * Extracts a misconception code from a wrong answer using the distractor map.
 * Returns null if no misconception is identified.
 */
export function detectMisconception(
  studentAnswer: string | number,
  distractorMap: DistractorMap | null | undefined,
): string | null {
  if (!distractorMap) return null;

  const answerKey = String(studentAnswer);
  const code = distractorMap[answerKey];

  if (!code || code === "correct") return null;
  return code;
}

/**
 * Analyses a student's misconception history and identifies patterns
 * that warrant targeted reteaching.
 */
export function analyseMisconceptionPatterns(
  events: { misconceptionCode: string; skillId: string }[],
): MisconceptionPattern[] {
  const counts = new Map<string, { skillId: string; count: number }>();

  for (const event of events) {
    const key = `${event.skillId}::${event.misconceptionCode}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, { skillId: event.skillId, count: 1 });
    }
  }

  return Array.from(counts.entries())
    .map(([key, data]) => ({
      misconceptionCode: key.split("::")[1],
      skillId: data.skillId,
      count: data.count,
      needsReteach: data.count >= RETEACH_THRESHOLD,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generates a parent-friendly description of a misconception pattern.
 */
export function describeMisconception(code: string): string {
  const descriptions: Record<string, string> = {
    // Numeracy misconceptions
    adds_numerators_and_denominators: "Adding the top and bottom numbers of fractions separately instead of finding a common denominator",
    treats_denominators_as_wholes_only: "Treating the bottom number of a fraction as a whole number",
    chooses_visual_not_numeric_match: "Matching based on how a picture looks rather than the actual number",
    forgets_regrouping: "Forgetting to carry or borrow when adding or subtracting",
    reverses_subtraction_order: "Subtracting the smaller digit from the larger in each column regardless of position",
    misplaces_decimal: "Putting the decimal point in the wrong position",
    multiplies_by_adding: "Confusing multiplication with repeated addition incorrectly",
    confuses_area_perimeter: "Mixing up area (space inside) and perimeter (distance around)",

    // Reading misconceptions
    selects_literal_over_inferential: "Choosing the answer stated directly in the text when the question asks to infer",
    confuses_main_idea_with_detail: "Identifying a supporting detail as the main idea",
    misidentifies_author_purpose: "Confusing what the author is trying to do (inform vs persuade vs entertain)",

    // Spelling misconceptions
    phonetic_not_conventional: "Spelling words the way they sound rather than the correct spelling",
    omits_silent_letters: "Leaving out silent letters in words",
    wrong_homophone: "Using the wrong spelling of a word that sounds the same (e.g., their/there)",

    // Grammar misconceptions
    comma_splice: "Joining two complete sentences with only a comma instead of a conjunction or full stop",
    tense_shift: "Switching between past and present tense within the same paragraph",
    pronoun_ambiguity: "Using a pronoun when it's unclear which noun it refers to",
  };

  return descriptions[code] ?? `Recurring error pattern: ${code.replace(/_/g, " ")}`;
}
