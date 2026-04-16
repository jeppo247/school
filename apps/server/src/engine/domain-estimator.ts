import type { NaplanDomain, NaplanProficiency } from "@upwise/shared";
import {
  projectProficiency,
  thetaToNaplanScale,
  getNaplanYearTarget,
} from "@upwise/shared";

/**
 * A single skill's mastery state, used as input to domain estimation.
 */
interface SkillMasteryInput {
  skillId: string;
  masteryProbability: number;
  totalAttempts: number;
  correctAttempts: number;
  masteryStatus: string;
}

/**
 * The output of a domain-level estimation.
 */
export interface DomainEstimate {
  domain: NaplanDomain;
  /** Latent ability on internal scale (-3 to +3) */
  theta: number;
  /** Standard error of the theta estimate */
  thetaSe: number;
  /** Approximate NAPLAN scale score */
  naplanScaleScore: number;
  /** Projected proficiency band */
  projectedProficiency: NaplanProficiency;
  /** Which NAPLAN year level this projection targets */
  naplanYearTarget: number;
  /** How many skills had evidence (attempts > 0) */
  skillsWithEvidence: number;
  /** Total skills in this domain */
  totalSkills: number;
  /** Overall mastery percentage across the domain */
  masteryPercentage: number;
}

/**
 * Estimates a student's domain-level latent ability from their skill mastery states.
 *
 * The approach:
 * 1. Filter to skills within the target domain that have evidence (attempts > 0)
 * 2. Convert each skill's mastery probability to a theta contribution using a logit transform
 * 3. Weight each skill by its evidence strength (more attempts = higher weight, capped)
 * 4. Compute the weighted mean theta and standard error
 * 5. Map theta to the NAPLAN scale and project a proficiency band
 *
 * This is a simplified approach suitable for formative use. A full operational
 * system would use marginal maximum likelihood or MCMC estimation. For a
 * practice platform, this weighted-logit approach gives reasonable projections
 * that improve as the student answers more questions.
 *
 * The research report recommends Rasch/2PL for the domain layer. This logit
 * transform on mastery probabilities approximates that — each skill's mastery
 * probability is effectively a posterior from the BKT model, and the logit
 * maps it to a continuous scale compatible with IRT theta.
 */
export function estimateDomainTheta(
  domain: NaplanDomain,
  studentYearLevel: number,
  skillStates: SkillMasteryInput[],
): DomainEstimate {
  const naplanYearTarget = getNaplanYearTarget(studentYearLevel);

  // Filter to skills with evidence
  const withEvidence = skillStates.filter((s) => s.totalAttempts > 0);
  const totalSkills = skillStates.length;
  const skillsWithEvidence = withEvidence.length;

  // If no evidence at all, return a default "developing" estimate
  if (skillsWithEvidence === 0) {
    return {
      domain,
      theta: 0,
      thetaSe: 1.5,
      naplanScaleScore: thetaToNaplanScale(0, domain, naplanYearTarget),
      projectedProficiency: "developing",
      naplanYearTarget,
      skillsWithEvidence: 0,
      totalSkills,
      masteryPercentage: 0,
    };
  }

  // Convert mastery probabilities to theta contributions using logit transform
  // logit(p) = ln(p / (1-p)), which maps [0,1] to (-inf, +inf)
  // We clamp p to [0.05, 0.95] to avoid extreme values
  let weightedThetaSum = 0;
  let totalWeight = 0;
  let masteredCount = 0;

  for (const skill of withEvidence) {
    const p = Math.max(0.05, Math.min(0.95, skill.masteryProbability));
    const skillTheta = Math.log(p / (1 - p)); // logit transform

    // Weight by evidence strength: more attempts = more reliable
    // Cap at 20 to prevent a single heavily-practised skill from dominating
    const evidenceWeight = Math.min(skill.totalAttempts, 20);

    // Bonus weight for skills that have reached mastery (more confident estimate)
    const masteryBonus = skill.masteryStatus === "mastered" || skill.masteryStatus === "review" ? 1.5 : 1.0;

    const weight = evidenceWeight * masteryBonus;
    weightedThetaSum += skillTheta * weight;
    totalWeight += weight;

    if (skill.masteryStatus === "mastered" || skill.masteryStatus === "review") {
      masteredCount++;
    }
  }

  // Weighted mean theta
  const theta = totalWeight > 0 ? weightedThetaSum / totalWeight : 0;

  // Standard error: decreases with more evidence and more skills assessed
  // Base SE of 1.5 reduced by sqrt(skills assessed) and evidence density
  const coverageRatio = skillsWithEvidence / Math.max(totalSkills, 1);
  const avgEvidence = totalWeight / skillsWithEvidence;
  const thetaSe = 1.5 / Math.sqrt(skillsWithEvidence * Math.min(avgEvidence / 5, 1)) *
    (1 - coverageRatio * 0.3); // Coverage bonus: more skills assessed = tighter SE

  // Clamp theta to reasonable range
  const clampedTheta = Math.max(-3, Math.min(3, theta));

  // Map to NAPLAN scale and proficiency
  const naplanScaleScore = thetaToNaplanScale(clampedTheta, domain, naplanYearTarget);
  const projectedProficiency = projectProficiency(domain, naplanYearTarget, clampedTheta);
  const masteryPercentage = totalSkills > 0 ? (masteredCount / totalSkills) * 100 : 0;

  return {
    domain,
    theta: Math.round(clampedTheta * 100) / 100, // Round to 2dp
    thetaSe: Math.round(thetaSe * 100) / 100,
    naplanScaleScore: Math.round(naplanScaleScore),
    projectedProficiency,
    naplanYearTarget,
    skillsWithEvidence,
    totalSkills,
    masteryPercentage: Math.round(masteryPercentage),
  };
}

/**
 * Estimates domain states for all 5 NAPLAN domains at once.
 *
 * Takes the student's full set of skill states and groups them by domain,
 * then estimates each domain independently. Returns an array of 5 estimates.
 *
 * This is the function you'd call after a session completes to update
 * the student's domain_states table.
 */
export function estimateAllDomains(
  studentYearLevel: number,
  allSkillStates: (SkillMasteryInput & { domain: NaplanDomain })[],
): DomainEstimate[] {
  const domains: NaplanDomain[] = [
    "reading",
    "writing",
    "spelling",
    "grammar_punctuation",
    "numeracy",
  ];

  return domains.map((domain) => {
    const domainSkills = allSkillStates.filter((s) => s.domain === domain);
    return estimateDomainTheta(domain, studentYearLevel, domainSkills);
  });
}

/**
 * Determines the confidence level of a domain estimate.
 *
 * Used to decide whether to show the projection to parents or flag it
 * as "not enough data yet". We don't want to show a proficiency forecast
 * based on 2 questions — that would be misleading.
 */
export function estimateConfidence(estimate: DomainEstimate): "high" | "moderate" | "low" | "insufficient" {
  if (estimate.skillsWithEvidence === 0) return "insufficient";
  if (estimate.skillsWithEvidence < 3 || estimate.thetaSe > 1.2) return "low";
  if (estimate.skillsWithEvidence < 8 || estimate.thetaSe > 0.8) return "moderate";
  return "high";
}
