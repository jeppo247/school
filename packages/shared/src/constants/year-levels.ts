import { SUPPORTED_YEAR_LEVELS, type SupportedYearLevel } from "./acara";

export { SUPPORTED_YEAR_LEVELS, type SupportedYearLevel };

const SUPPORTED_YEAR_SET = new Set<number>(SUPPORTED_YEAR_LEVELS);

/**
 * Year 6 does not have a NAPLAN test year, so diagnostics use the closest
 * lower practice bank instead of jumping learners into Year 7 content.
 */
const DIAGNOSTIC_QUESTION_YEARS: Record<SupportedYearLevel, SupportedYearLevel[]> = {
  0: [0],
  1: [1],
  2: [2],
  3: [3],
  4: [4],
  5: [5],
  6: [5],
  7: [7],
};

export function isSupportedYearLevel(yearLevel: number): yearLevel is SupportedYearLevel {
  return SUPPORTED_YEAR_SET.has(yearLevel);
}

export function getDiagnosticQuestionYearLevels(yearLevel: number): SupportedYearLevel[] {
  if (isSupportedYearLevel(yearLevel)) {
    return DIAGNOSTIC_QUESTION_YEARS[yearLevel];
  }

  if (yearLevel < 0) return DIAGNOSTIC_QUESTION_YEARS[0];
  return DIAGNOSTIC_QUESTION_YEARS[7];
}
