/** ACARA year levels supported (Prep = 0, Year 1–7) */
export const SUPPORTED_YEAR_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
export type SupportedYearLevel = (typeof SUPPORTED_YEAR_LEVELS)[number];

/** NAPLAN test year levels */
export const NAPLAN_YEAR_LEVELS = [3, 5, 7] as const;
export type NaplanYearLevel = (typeof NAPLAN_YEAR_LEVELS)[number];

/** Learning areas */
export const LEARNING_AREAS = {
  english: "English",
  mathematics: "Mathematics",
} as const;

/** NAPLAN domains */
export const NAPLAN_DOMAINS = {
  reading: "Reading",
  writing: "Writing",
  spelling: "Spelling",
  grammar_punctuation: "Grammar and Punctuation",
  numeracy: "Numeracy",
} as const;

/** Strands within the Mathematics learning area */
export const MATHS_STRANDS = {
  number_algebra: "Number and Algebra",
  measurement_geometry: "Measurement and Geometry",
  statistics_probability: "Statistics and Probability",
} as const;

/** Strands within the English learning area */
export const ENGLISH_STRANDS = {
  literacy: "Literacy",
  language: "Language",
  literature: "Literature",
} as const;

/** Sub-strands for Number and Algebra */
export const NUMBER_ALGEBRA_SUB_STRANDS = {
  number_place_value: "Number and place value",
  fractions_decimals: "Fractions and decimals",
  money_financial: "Money and financial mathematics",
  patterns_algebra: "Patterns and algebra",
} as const;

/** Sub-strands for English Literacy */
export const ENGLISH_LITERACY_SUB_STRANDS = {
  reading_comprehension: "Reading comprehension",
  writing_creation: "Creating texts",
  spelling_patterns: "Spelling",
  grammar_knowledge: "Grammar knowledge",
  punctuation: "Punctuation",
} as const;

/** NAPLAN proficiency levels (2023 onward) */
export const NAPLAN_PROFICIENCY_LEVELS = {
  exceeding: "Exceeding",
  strong: "Strong",
  developing: "Developing",
  needs_additional_support: "Needs Additional Support",
} as const;

/** Depth of Knowledge levels (Webb's DOK) */
export const DOK_LEVELS = {
  1: "Recall and Reproduction",
  2: "Skills and Concepts",
  3: "Strategic Thinking",
  4: "Extended Thinking",
} as const;

/** NAPLAN writing rubric criteria */
export const WRITING_RUBRIC_CRITERIA = [
  "audience",
  "text_structure",
  "ideas",
  "character_setting",
  "vocabulary",
  "cohesion",
  "paragraphing",
  "sentence_structure",
  "punctuation",
  "spelling",
] as const;

export type WritingRubricCriterion = (typeof WRITING_RUBRIC_CRITERIA)[number];
