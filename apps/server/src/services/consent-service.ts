import { db } from "../db/client.js";
import { consentRecords, students, studentSkillStates, learningSessions,
  questionResponses, coinTransactions, studentPurchases, misconceptionEvents,
  dailyBriefings, parentNudges, weeklyReports, domainStates,
} from "../db/schema.js";
import { eq } from "drizzle-orm";
import { recordAudit } from "../middleware/audit.js";
import { logger } from "../lib/logger.js";

type ConsentType = "data_collection" | "ai_processing" | "sharing_with_school";

/**
 * Records a consent grant from a parent for a student.
 */
export async function grantConsent(
  studentId: string,
  parentId: string,
  consentType: ConsentType,
  expiresAt?: Date,
): Promise<void> {
  await db.insert(consentRecords).values({
    studentId,
    consentType,
    grantedBy: parentId,
    expiresAt,
  });

  await recordAudit(parentId, "consent", studentId, "grant", { consentType });
  logger.info("Consent granted", { studentId, parentId, consentType });
}

/**
 * Revokes a previously granted consent.
 */
export async function revokeConsent(
  studentId: string,
  parentId: string,
  consentType: ConsentType,
): Promise<void> {
  await db
    .update(consentRecords)
    .set({ revokedAt: new Date() })
    .where(eq(consentRecords.studentId, studentId));

  await recordAudit(parentId, "consent", studentId, "revoke", { consentType });
  logger.info("Consent revoked", { studentId, parentId, consentType });
}

/**
 * Checks if a specific consent type is currently active for a student.
 */
export async function hasActiveConsent(
  studentId: string,
  consentType: ConsentType,
): Promise<boolean> {
  const records = await db
    .select()
    .from(consentRecords)
    .where(eq(consentRecords.studentId, studentId));

  return records.some(
    (r) =>
      r.consentType === consentType &&
      !r.revokedAt &&
      (!r.expiresAt || new Date(r.expiresAt) > new Date()),
  );
}

/**
 * Processes a data deletion request for a student.
 * Deletes all student data while maintaining an audit trail.
 *
 * This is a destructive operation and should be confirmed by the parent.
 */
export async function deleteStudentData(
  studentId: string,
  requestedBy: string,
): Promise<{ deleted: boolean; tablesAffected: string[] }> {
  const tablesAffected: string[] = [];

  await recordAudit(requestedBy, "student", studentId, "deletion_requested");

  // Delete in dependency order (children first)
  // These cascade from student, but we do explicitly for audit clarity
  await db.delete(misconceptionEvents).where(eq(misconceptionEvents.studentId, studentId));
  tablesAffected.push("misconception_events");

  await db.delete(coinTransactions).where(eq(coinTransactions.studentId, studentId));
  tablesAffected.push("coin_transactions");

  await db.delete(studentPurchases).where(eq(studentPurchases.studentId, studentId));
  tablesAffected.push("student_purchases");

  await db.delete(domainStates).where(eq(domainStates.studentId, studentId));
  tablesAffected.push("domain_states");

  await db.delete(studentSkillStates).where(eq(studentSkillStates.studentId, studentId));
  tablesAffected.push("student_skill_states");

  await db.delete(dailyBriefings).where(eq(dailyBriefings.studentId, studentId));
  tablesAffected.push("daily_briefings");

  await db.delete(parentNudges).where(eq(parentNudges.studentId, studentId));
  tablesAffected.push("parent_nudges");

  await db.delete(weeklyReports).where(eq(weeklyReports.studentId, studentId));
  tablesAffected.push("weekly_reports");

  // Delete sessions (cascades to question_responses)
  await db.delete(learningSessions).where(eq(learningSessions.studentId, studentId));
  tablesAffected.push("learning_sessions", "question_responses");

  // Delete the student record itself
  await db.delete(students).where(eq(students.id, studentId));
  tablesAffected.push("students");

  await recordAudit(requestedBy, "student", studentId, "deletion_completed", { tablesAffected });
  logger.info("Student data deleted", { studentId, requestedBy, tablesAffected });

  return { deleted: true, tablesAffected };
}
