import { db } from "../db/client.js";
import { students, studentSkillStates, skillNodes, domainStates } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { estimateAllDomains, estimateConfidence } from "../engine/domain-estimator.js";
import { logger } from "../lib/logger.js";
import type { NaplanDomain } from "@upwise/shared";

/**
 * Recalculates and persists domain-level theta estimates for a student.
 *
 * This should be called:
 * - After a session completes
 * - After a diagnostic finishes
 * - On demand from the parent dashboard
 *
 * It reads all the student's skill states, groups them by domain,
 * runs the domain estimator, and upserts the results into domain_states.
 */
export async function updateDomainStates(studentId: string): Promise<void> {
  // Get student's year level
  const [student] = await db
    .select({ yearLevel: students.yearLevel })
    .from(students)
    .where(eq(students.id, studentId));

  if (!student) {
    logger.warn("Student not found for domain state update", { studentId });
    return;
  }

  // Get all skill states for this student, joined with skill info for domain
  const states = await db
    .select({
      skillId: studentSkillStates.skillId,
      masteryProbability: studentSkillStates.masteryProbability,
      totalAttempts: studentSkillStates.totalAttempts,
      correctAttempts: studentSkillStates.correctAttempts,
      masteryStatus: studentSkillStates.masteryStatus,
      domain: skillNodes.domain,
    })
    .from(studentSkillStates)
    .innerJoin(skillNodes, eq(studentSkillStates.skillId, skillNodes.id))
    .where(eq(studentSkillStates.studentId, studentId));

  // Run the domain estimator across all 5 domains
  const estimates = estimateAllDomains(
    student.yearLevel,
    states.map((s) => ({
      skillId: s.skillId,
      masteryProbability: s.masteryProbability,
      totalAttempts: s.totalAttempts,
      correctAttempts: s.correctAttempts,
      masteryStatus: s.masteryStatus,
      domain: s.domain as NaplanDomain,
    })),
  );

  // Upsert each domain estimate
  for (const estimate of estimates) {
    const confidence = estimateConfidence(estimate);

    await db
      .insert(domainStates)
      .values({
        studentId,
        domain: estimate.domain,
        theta: estimate.theta,
        thetaSe: estimate.thetaSe,
        projectedProficiency: estimate.projectedProficiency,
        naplanYearTarget: estimate.naplanYearTarget,
      })
      .onConflictDoUpdate({
        target: [domainStates.studentId, domainStates.domain],
        set: {
          theta: estimate.theta,
          thetaSe: estimate.thetaSe,
          projectedProficiency: estimate.projectedProficiency,
          naplanYearTarget: estimate.naplanYearTarget,
          updatedAt: new Date(),
        },
      });

    logger.info("Domain state updated", {
      studentId,
      domain: estimate.domain,
      theta: estimate.theta,
      proficiency: estimate.projectedProficiency,
      confidence,
      skillsCovered: `${estimate.skillsWithEvidence}/${estimate.totalSkills}`,
    });
  }
}

/**
 * Gets all domain states for a student.
 * Returns the proficiency projections for the parent dashboard.
 */
export async function getDomainStates(studentId: string) {
  return db
    .select()
    .from(domainStates)
    .where(eq(domainStates.studentId, studentId));
}

/**
 * Gets a single domain state.
 */
export async function getDomainState(studentId: string, domain: NaplanDomain) {
  const [state] = await db
    .select()
    .from(domainStates)
    .where(
      and(
        eq(domainStates.studentId, studentId),
        eq(domainStates.domain, domain),
      ),
    );

  return state ?? null;
}
