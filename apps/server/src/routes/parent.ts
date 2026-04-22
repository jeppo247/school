import { Router } from "express";
import { db } from "../db/client.js";
import {
  dailyBriefings, parentNudges, weeklyReports,
  learningSessions, students, domainStates,
  studentPurchases, studentSkillStates,
} from "../db/schema.js";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { getDomainStates } from "../services/domain-service.js";
import { getMisconceptionSummary } from "../services/misconception-service.js";
import { generateDailyBriefing } from "../services/content-generator.js";
import { AppError } from "../middleware/error-handler.js";

export const parentRoutes = Router();

// GET /parent/dashboard — Parent overview for all children
parentRoutes.get("/dashboard", async (req, res, next) => {
  try {
    const familyId = req.query.familyId as string;
    if (!familyId) throw new AppError(400, "VALIDATION_ERROR", "familyId required");

    const children = await db.select().from(students).where(eq(students.familyId, familyId));

    const childSummaries = await Promise.all(
      children.map(async (child) => {
        const domains = await getDomainStates(child.id);
        const misconceptions = await getMisconceptionSummary(child.id, 3);

        // Recent sessions
        const recentSessions = await db
          .select({
            accuracy: learningSessions.accuracy,
            completedAt: learningSessions.completedAt,
          })
          .from(learningSessions)
          .where(and(
            eq(learningSessions.studentId, child.id),
            eq(learningSessions.status, "completed"),
          ))
          .orderBy(desc(learningSessions.completedAt))
          .limit(7);

        // Count owned items (purchases)
        const [ownedItems] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(studentPurchases)
          .where(eq(studentPurchases.studentId, child.id));

        // Count mastered skills
        const [masteredCount] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(studentSkillStates)
          .where(
            and(
              eq(studentSkillStates.studentId, child.id),
              sql`${studentSkillStates.masteryStatus} IN ('mastered', 'review')`,
            ),
          );

        return {
          id: child.id,
          name: child.name,
          yearLevel: child.yearLevel,
          currentStreak: child.currentStreak,
          xpTotal: child.xpTotal,
          coinBalance: child.coinBalance,
          diagnosticCompleted: child.diagnosticCompleted,
          rewardsMode: child.rewardsMode,
          domainProficiencies: domains,
          topMisconceptions: misconceptions,
          ownedItemsCount: ownedItems?.count ?? 0,
          masteredSkillsCount: masteredCount.count,
          recentAccuracy: recentSessions.length > 0
            ? Math.round(
                (recentSessions.reduce((sum, s) => sum + (s.accuracy ?? 0), 0) / recentSessions.length) * 100,
              )
            : null,
          sessionsThisWeek: recentSessions.filter((s) => {
            if (!s.completedAt) return false;
            const weekAgo = new Date(Date.now() - 7 * 86400000);
            return new Date(s.completedAt) >= weekAgo;
          }).length,
        };
      }),
    );

    res.json({ children: childSummaries });
  } catch (err) {
    next(err);
  }
});

// GET /parent/briefing/:studentId/today — Today's daily briefing
parentRoutes.get("/briefing/:studentId/today", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    // Check if briefing already exists for today
    const [existing] = await db
      .select()
      .from(dailyBriefings)
      .where(and(
        eq(dailyBriefings.studentId, studentId),
        eq(dailyBriefings.briefingDate, today),
      ));

    if (existing) {
      res.json(existing);
      return;
    }

    // No briefing yet — return a placeholder
    res.json({
      studentId,
      briefingDate: today,
      content: {
        summary: "Start a session to generate today's briefing.",
        tips: [],
        conversationScript: "",
        estimatedDifficulty: "moderate",
      },
      wasRead: false,
    });
  } catch (err) {
    next(err);
  }
});

// GET /parent/briefing/:studentId/history — Past briefings
parentRoutes.get("/briefing/:studentId/history", async (req, res, next) => {
  try {
    const briefings = await db
      .select()
      .from(dailyBriefings)
      .where(eq(dailyBriefings.studentId, req.params.studentId))
      .orderBy(desc(dailyBriefings.briefingDate))
      .limit(14);

    res.json({ briefings });
  } catch (err) {
    next(err);
  }
});

// GET /parent/reports/:studentId/weekly — Weekly reports
parentRoutes.get("/reports/:studentId/weekly", async (req, res, next) => {
  try {
    const reports = await db
      .select()
      .from(weeklyReports)
      .where(eq(weeklyReports.studentId, req.params.studentId))
      .orderBy(desc(weeklyReports.reportWeek))
      .limit(8);

    res.json({ reports });
  } catch (err) {
    next(err);
  }
});

// GET /parent/reports/:studentId/trends — Historical trend data
parentRoutes.get("/reports/:studentId/trends", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const days = Number(req.query.days) || 30;
    const since = new Date(Date.now() - days * 86400000);

    const sessions = await db
      .select({
        date: sql<string>`DATE(${learningSessions.completedAt})`,
        avgAccuracy: sql<number>`AVG(${learningSessions.accuracy})`,
        sessionCount: sql<number>`COUNT(*)`,
        totalQuestions: sql<number>`SUM(${learningSessions.totalQuestions})`,
        totalCorrect: sql<number>`SUM(${learningSessions.correctAnswers})`,
        totalXp: sql<number>`SUM(${learningSessions.xpEarned})`,
      })
      .from(learningSessions)
      .where(and(
        eq(learningSessions.studentId, studentId),
        eq(learningSessions.status, "completed"),
        gte(learningSessions.completedAt, since),
      ))
      .groupBy(sql`DATE(${learningSessions.completedAt})`)
      .orderBy(sql`DATE(${learningSessions.completedAt})`);

    const domains = await getDomainStates(studentId);

    res.json({ dailyTrends: sessions, domainStates: domains });
  } catch (err) {
    next(err);
  }
});

// GET /parent/:studentId/misconceptions — Misconception patterns for parent view
parentRoutes.get("/:studentId/misconceptions", async (req, res, next) => {
  try {
    const misconceptions = await getMisconceptionSummary(req.params.studentId, 10);
    res.json({ misconceptions });
  } catch (err) {
    next(err);
  }
});
