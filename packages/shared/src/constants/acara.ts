/** ACARA year levels supported (Prep = 0, Year 1–7) */
export const SUPPORTED_YEAR_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
export type SupportedYearLevel = (typeof SUPPORTED_YEAR_LEVELS)[number];

/** Strands within the Mathematics learning area */
export const MATHS_STRANDS = {
  number_algebra: "Number and Algebra",
  measurement_geometry: "Measurement and Geometry",
  statistics_probability: "Statistics and Probability",
} as const;

/** Sub-strands for Number and Algebra (MVP focus) */
export const NUMBER_ALGEBRA_SUB_STRANDS = {
  number_place_value: "Number and place value",
  fractions_decimals: "Fractions and decimals",
  money_financial: "Money and financial mathematics",
  patterns_algebra: "Patterns and algebra",
} as const;

/** Depth of Knowledge levels (Webb's DOK) */
export const DOK_LEVELS = {
  1: "Recall and Reproduction",
  2: "Skills and Concepts",
  3: "Strategic Thinking",
  4: "Extended Thinking",
} as const;
