import type { NaplanDomain, NaplanProficiency } from "../types/knowledge-graph";

/**
 * NAPLAN proficiency cut-points (established 2023, retained for subsequent years).
 * Source: NAPLAN 2025 Technical Report.
 *
 * Structure: domain → year → boundary thresholds
 * NAS = Needs Additional Support
 */
export const NAPLAN_CUT_POINTS: Record<
  NaplanDomain,
  Record<number, { nasToDevloping: number; developingToStrong: number; strongToExceeding: number }>
> = {
  numeracy: {
    3: { nasToDevloping: 311, developingToStrong: 378, strongToExceeding: 493 },
    5: { nasToDevloping: 386, developingToStrong: 451, strongToExceeding: 577 },
    7: { nasToDevloping: 431, developingToStrong: 500, strongToExceeding: 632 },
  },
  reading: {
    3: { nasToDevloping: 282, developingToStrong: 368, strongToExceeding: 481 },
    5: { nasToDevloping: 377, developingToStrong: 448, strongToExceeding: 555 },
    7: { nasToDevloping: 430, developingToStrong: 500, strongToExceeding: 603 },
  },
  writing: {
    3: { nasToDevloping: 296, developingToStrong: 370, strongToExceeding: 503 },
    5: { nasToDevloping: 385, developingToStrong: 455, strongToExceeding: 570 },
    7: { nasToDevloping: 439, developingToStrong: 511, strongToExceeding: 614 },
  },
  spelling: {
    3: { nasToDevloping: 294, developingToStrong: 380, strongToExceeding: 489 },
    5: { nasToDevloping: 378, developingToStrong: 451, strongToExceeding: 553 },
    7: { nasToDevloping: 430, developingToStrong: 497, strongToExceeding: 595 },
  },
  grammar_punctuation: {
    3: { nasToDevloping: 312, developingToStrong: 404, strongToExceeding: 523 },
    5: { nasToDevloping: 397, developingToStrong: 470, strongToExceeding: 582 },
    7: { nasToDevloping: 444, developingToStrong: 513, strongToExceeding: 620 },
  },
};

/**
 * Maps an internal theta estimate to a NAPLAN proficiency level.
 *
 * The internal theta scale (-3 to +3) is mapped linearly to the NAPLAN
 * scale for the relevant domain and year. This is an approximate projection
 * and should always be labelled as "Unofficial practice estimate".
 */
export function projectProficiency(
  domain: NaplanDomain,
  naplanYear: number,
  theta: number,
): NaplanProficiency {
  const cuts = NAPLAN_CUT_POINTS[domain]?.[naplanYear];
  if (!cuts) return "developing";

  // Map theta (-3 to +3) to NAPLAN scale
  // Using a linear mapping where theta 0 ≈ developing/strong boundary
  const naplanScore = thetaToNaplanScale(theta, domain, naplanYear);

  if (naplanScore >= cuts.strongToExceeding) return "exceeding";
  if (naplanScore >= cuts.developingToStrong) return "strong";
  if (naplanScore >= cuts.nasToDevloping) return "developing";
  return "needs_additional_support";
}

/**
 * Converts an internal theta (-3 to +3) to the NAPLAN reporting scale.
 *
 * The mapping centres theta=0 at the developing→strong boundary and
 * scales based on the domain/year range. This is approximate and should
 * be calibrated with real data over time.
 */
export function thetaToNaplanScale(
  theta: number,
  domain: NaplanDomain,
  naplanYear: number,
): number {
  const cuts = NAPLAN_CUT_POINTS[domain]?.[naplanYear];
  if (!cuts) return 400;

  // Centre: theta 0 maps to the developing→strong boundary
  const centre = cuts.developingToStrong;
  // Scale: theta range of 6 (-3 to +3) spans roughly 2x the strong band width
  const strongBandWidth = cuts.strongToExceeding - cuts.developingToStrong;
  const scale = strongBandWidth / 1.5; // 1.5 theta units ≈ 1 strong band

  return centre + theta * scale;
}

/**
 * Gets the nearest NAPLAN test year for a student's year level.
 * Used to determine which cut-points to apply.
 */
export function getNaplanYearTarget(yearLevel: number): number {
  if (yearLevel <= 3) return 3;
  if (yearLevel <= 5) return 5;
  return 7;
}
