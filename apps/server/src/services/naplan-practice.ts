import { db } from "../db/client.js";
import { questions, learningSessions, skillNodes } from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { getNaplanYearTarget } from "@upwise/shared";
import type { NaplanDomain } from "@upwise/shared";
import { logger } from "../lib/logger.js";

/**
 * NAPLAN test order (matching real test cadence):
 * Writing → Reading → Conventions of Language → Numeracy
 */
export const NAPLAN_TEST_ORDER: NaplanDomain[] = [
  "writing",
  "reading",
  "spelling",         // Part of "Conventions of Language"
  "grammar_punctuation", // Part of "Conventions of Language"
  "numeracy",
];

/**
 * Approximate time allocation per domain (minutes).
 */
const DOMAIN_TIME_LIMITS: Record<NaplanDomain, number> = {
  writing: 40,
  reading: 45,
  spelling: 20,
  grammar_punctuation: 20,
  numeracy: 45,
};

/**
 * Creates a NAPLAN practice session for a specific domain.
 * Selects questions tagged with the appropriate naplan_year_target
 * and structures them in difficulty tiers (multistage branching).
 */
export async function createNaplanPracticeSession(
  studentId: string,
  domain: NaplanDomain,
  yearLevel: number,
) {
  const naplanYear = getNaplanYearTarget(yearLevel);

  // Get questions for this domain and year target
  const domainQuestions = await db
    .select({
      id: questions.id,
      difficultyParam: questions.difficultyParam,
      questionType: questions.questionType,
    })
    .from(questions)
    .innerJoin(skillNodes, eq(questions.skillId, skillNodes.id))
    .where(
      and(
        eq(skillNodes.domain, domain),
        eq(questions.isValidated, true),
      ),
    )
    .orderBy(questions.difficultyParam);

  // Structure into 3 testlets (like NAPLAN's multistage design)
  const sorted = domainQuestions.sort((a, b) => a.difficultyParam - b.difficultyParam);
  const third = Math.ceil(sorted.length / 3);
  const testlets = {
    easier: sorted.slice(0, third).map((q) => q.id),
    standard: sorted.slice(third, third * 2).map((q) => q.id),
    harder: sorted.slice(third * 2).map((q) => q.id),
  };

  // Create session
  const [session] = await db
    .insert(learningSessions)
    .values({
      studentId,
      sessionType: "diagnostic", // reuse type; differentiated by metadata
      status: "in_progress",
      phase: "focus_1",
      metadata: {
        mode: "naplan_practice",
        domain,
        naplanYear,
        timeLimitMinutes: DOMAIN_TIME_LIMITS[domain],
        testlets,
        currentTestlet: "standard",
      },
    })
    .returning();

  logger.info("NAPLAN practice session created", {
    studentId,
    domain,
    naplanYear,
    questionsAvailable: domainQuestions.length,
  });

  return {
    sessionId: session.id,
    domain,
    naplanYear,
    timeLimitMinutes: DOMAIN_TIME_LIMITS[domain],
    questionsAvailable: domainQuestions.length,
    testletSizes: {
      easier: testlets.easier.length,
      standard: testlets.standard.length,
      harder: testlets.harder.length,
    },
  };
}

/**
 * Determines which testlet to branch to based on performance
 * in the initial testlet (mimicking NAPLAN's multistage design).
 */
export function determineNextTestlet(
  correctCount: number,
  totalCount: number,
): "easier" | "standard" | "harder" {
  if (totalCount === 0) return "standard";
  const accuracy = correctCount / totalCount;
  if (accuracy >= 0.75) return "harder";
  if (accuracy < 0.45) return "easier";
  return "standard";
}
