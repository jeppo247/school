import { Router } from "express";
import { db } from "../db/client.js";
import {
  students, learningSessions, questionResponses, questions,
  studentSkillStates, skillNodes, skillPrerequisites, coinTransactions,
} from "../db/schema.js";
import { eq, and, sql, desc, lte, inArray, asc } from "drizzle-orm";
import { selectSessionQuestion } from "../engine/question-selector.js";
import { calculateXP } from "../engine/difficulty-adjuster.js";
import { updateKnowledgeState } from "../engine/knowledge-state.js";
import { planSession } from "../engine/session-planner.js";
import { detectFrontierGaps } from "../engine/gap-detector.js";
import { estimatePracticeTheta, getRollingAccuracy } from "../engine/session-adaptation.js";
import { AppError } from "../middleware/error-handler.js";
import { updateDomainStates } from "../services/domain-service.js";
import { recordMisconceptionIfPresent } from "../services/misconception-service.js";
import { calculateSessionRewards, awardCoins } from "../services/coin-service.js";
import {
  XP_PER_CORRECT, XP_DIFFICULTY_MULTIPLIER, XP_PER_LEVEL,
  STREAK_GRACE_DAYS,
} from "@upwise/shared";
import { validate } from "../middleware/validate.js";
import { submitAnswerSchema } from "../schemas/validation.js";

export const sessionRoutes = Router();

// POST /sessions/:studentId/start — Start a daily learning session
sessionRoutes.post("/:studentId/start", async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;

    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    // Get student's skill states with skill info for gap detection
    const states = await db
      .select({
        skillId: studentSkillStates.skillId,
        masteryProbability: studentSkillStates.masteryProbability,
        masteryStatus: studentSkillStates.masteryStatus,
        nextReview: studentSkillStates.nextReview,
      })
      .from(studentSkillStates)
      .where(eq(studentSkillStates.studentId, studentId));

    // Get skill graph info for gap detection
    const allSkills = await db
      .select({
        id: skillNodes.id,
        code: skillNodes.code,
        name: skillNodes.name,
        yearLevel: skillNodes.yearLevel,
      })
      .from(skillNodes)
      .where(eq(skillNodes.isActive, true));

    const allEdges = await db.select().from(skillPrerequisites);

    // Build skill graph nodes for gap detector
    const stateMap = new Map(states.map((s) => [s.skillId, s]));
    const graphNodes = allSkills.map((skill) => {
      const state = stateMap.get(skill.id);
      const prereqs = allEdges.filter((e) => e.skillId === skill.id).map((e) => e.prerequisiteId);
      const deps = allEdges.filter((e) => e.prerequisiteId === skill.id).map((e) => e.skillId);
      return {
        id: skill.id,
        code: skill.code,
        name: skill.name,
        yearLevel: skill.yearLevel,
        masteryStatus: (state?.masteryStatus ?? "unknown") as "unknown" | "learning" | "almost" | "mastered" | "review",
        masteryProbability: state?.masteryProbability ?? 0.5,
        prerequisites: prereqs,
        dependents: deps,
      };
    });

    const frontierGaps = detectFrontierGaps(graphNodes, student.yearLevel);

    // Get review skills
    const now = new Date();
    const reviewSkills = states
      .filter((s) => s.masteryStatus === "review" && s.nextReview && new Date(s.nextReview) <= now)
      .map((s) => ({ skillId: s.skillId, nextReview: new Date(s.nextReview!) }));

    // Plan the session
    const sessionPlan = planSession(studentId, reviewSkills, frontierGaps, 0);

    // Create session
    const [session] = await db
      .insert(learningSessions)
      .values({
        studentId,
        sessionType: "daily",
        status: "in_progress",
        phase: "warmup",
        skillsTargeted: sessionPlan.focusSkills,
        metadata: { plan: sessionPlan },
      })
      .returning();

    res.status(201).json({
      sessionId: session.id,
      plan: {
        phases: sessionPlan.phases.map((p) => ({
          phase: p.phase,
          durationMinutes: p.durationMinutes,
          questionCount: p.questionCount,
        })),
        estimatedDurationMinutes: sessionPlan.estimatedDurationMinutes,
        focusSkills: frontierGaps.slice(0, 3).map((g) => ({
          name: g.skillName,
          yearLevel: g.yearLevel,
        })),
        reviewCount: reviewSkills.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /sessions/:studentId/next-question — Get next question in session
sessionRoutes.get("/:studentId/next-question", async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw new AppError(400, "VALIDATION_ERROR", "sessionId required");

    const [session] = await db
      .select()
      .from(learningSessions)
      .where(and(eq(learningSessions.id, sessionId), eq(learningSessions.studentId, studentId)));

    if (!session || session.status !== "in_progress") {
      return res.json({ complete: true });
    }

    // Get responses so far
    const responses = await db
      .select()
      .from(questionResponses)
      .where(eq(questionResponses.sessionId, sessionId))
      .orderBy(asc(questionResponses.sequenceNumber));

    const askedIds = new Set(responses.map((r) => r.questionId));

    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    // Get available questions — only at or below the student's year level
    const available = await db
      .select({
        id: questions.id,
        skillId: questions.skillId,
        difficultyParam: questions.difficultyParam,
        discriminationParam: sql<number>`1`,
        guessingParam: sql<number>`0.25`,
        content: questions.content,
        questionType: questions.questionType,
      })
      .from(questions)
      .innerJoin(skillNodes, eq(questions.skillId, skillNodes.id))
      .where(
        and(
          eq(questions.isValidated, true),
          lte(skillNodes.yearLevel, student.yearLevel),
        ),
      );

    const plan = session.metadata as { plan?: { focusSkills: string[] } } | null;
    const targetSkills = plan?.plan?.focusSkills ?? session.skillsTargeted ?? [];

    // Select question based on current phase
    const practiceTheta = estimatePracticeTheta(responses);
    const rollingAccuracy = getRollingAccuracy(responses);

    const selectedId = selectSessionQuestion(
      practiceTheta,
      targetSkills,
      available.filter((q) => !askedIds.has(q.id)).map((q) => ({
        id: q.id,
        skillId: q.skillId,
        difficultyParam: q.difficultyParam,
        discriminationParam: 1,
        guessingParam: 0.25,
      })),
      askedIds,
    );

    if (!selectedId) {
      return res.json({ complete: true, message: "No more questions available for this session" });
    }

    const selectedQuestion = available.find((q) => q.id === selectedId);
    if (!selectedQuestion) {
      return res.json({ complete: true });
    }

    res.json({
      complete: false,
      questionNumber: responses.length + 1,
      phase: session.phase,
      question: {
        id: selectedQuestion.id,
        type: selectedQuestion.questionType,
        content: selectedQuestion.content,
      },
      sessionProgress: {
        questionsAnswered: responses.length,
        accuracy: Math.round(rollingAccuracy * 100),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /sessions/:studentId/respond — Submit answer
sessionRoutes.post("/:studentId/respond", validate(submitAnswerSchema), async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const { sessionId, questionId, answer, timeTakenMs, hintUsed } = req.body;

    if (!sessionId || !questionId || answer === undefined) {
      throw new AppError(400, "VALIDATION_ERROR", "sessionId, questionId, and answer required");
    }

    const [session] = await db
      .select()
      .from(learningSessions)
      .where(and(eq(learningSessions.id, sessionId), eq(learningSessions.studentId, studentId)));

    if (!session) throw new AppError(404, "NOT_FOUND", "Session not found");
    if (session.sessionType !== "daily") {
      throw new AppError(400, "VALIDATION_ERROR", "Session is not a daily learning session");
    }
    if (session.status !== "in_progress") {
      throw new AppError(409, "SESSION_NOT_IN_PROGRESS", "Session is not in progress");
    }

    const [question] = await db.select().from(questions).where(eq(questions.id, questionId));
    if (!question) throw new AppError(404, "NOT_FOUND", "Question not found");

    const content = question.content as { answer: string | number; explanation?: string; hint?: string };
    const isCorrect = String(answer) === String(content.answer);

    // Count existing responses
    const existing = await db
      .select({
        id: questionResponses.id,
        questionId: questionResponses.questionId,
        skillId: questionResponses.skillId,
        isCorrect: questionResponses.isCorrect,
        difficultyAtTime: questionResponses.difficultyAtTime,
        timeTakenMs: questionResponses.timeTakenMs,
      })
      .from(questionResponses)
      .where(eq(questionResponses.sessionId, sessionId))
      .orderBy(asc(questionResponses.sequenceNumber));

    if (existing.some((response) => response.questionId === questionId)) {
      throw new AppError(409, "QUESTION_ALREADY_ANSWERED", "Question already answered in this session");
    }

    // Record response
    await db.insert(questionResponses).values({
      sessionId,
      questionId,
      skillId: question.skillId,
      studentAnswer: answer,
      correctAnswer: content.answer,
      isCorrect,
      timeTakenMs,
      hintUsed: hintUsed ?? false,
      difficultyAtTime: question.difficultyParam,
      abilityEstimateAtTime: estimatePracticeTheta(existing),
      sequenceNumber: existing.length + 1,
    });

    // Update skill mastery
    const [existingState] = await db
      .select()
      .from(studentSkillStates)
      .where(
        and(
          eq(studentSkillStates.studentId, studentId),
          eq(studentSkillStates.skillId, question.skillId),
        ),
      );

    const currentState = existingState ?? {
      masteryProbability: 0.5,
      totalAttempts: 0,
      correctAttempts: 0,
      sessionsAssessed: 0,
    };

    const update = updateKnowledgeState(
      {
        masteryProbability: currentState.masteryProbability,
        totalAttempts: currentState.totalAttempts,
        correctAttempts: currentState.correctAttempts,
        sessionsAssessed: currentState.sessionsAssessed,
      },
      isCorrect,
      !existingState,
    );

    if (existingState) {
      await db
        .update(studentSkillStates)
        .set({
          masteryProbability: update.newProbability,
          totalAttempts: currentState.totalAttempts + 1,
          correctAttempts: currentState.correctAttempts + (isCorrect ? 1 : 0),
          masteryStatus: update.newMasteryStatus,
          lastAssessed: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(studentSkillStates.id, existingState.id));
    } else {
      await db.insert(studentSkillStates).values({
        studentId,
        skillId: question.skillId,
        masteryProbability: update.newProbability,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
        masteryStatus: update.newMasteryStatus,
        lastAssessed: new Date(),
        sessionsAssessed: 1,
      });
    }

    // Track misconception if wrong
    let misconception: string | null = null;
    if (!isCorrect) {
      misconception = await recordMisconceptionIfPresent(
        studentId, questionId, question.skillId, sessionId, answer,
      );
    }

    // Calculate XP for correct answer
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = calculateXP(question.difficultyParam, XP_PER_CORRECT, XP_DIFFICULTY_MULTIPLIER);
      await db
        .update(learningSessions)
        .set({ xpEarned: sql`${learningSessions.xpEarned} + ${xpEarned}` })
        .where(eq(learningSessions.id, sessionId));
    }

    // Update session counters
    await db
      .update(learningSessions)
      .set({
        totalQuestions: sql`${learningSessions.totalQuestions} + 1`,
        correctAnswers: isCorrect
          ? sql`${learningSessions.correctAnswers} + 1`
          : learningSessions.correctAnswers,
      })
      .where(eq(learningSessions.id, sessionId));

    res.json({
      isCorrect,
      correctAnswer: content.answer,
      explanation: content.explanation,
      xpEarned,
      misconception,
      masteryUpdate: {
        skillId: question.skillId,
        newStatus: update.newMasteryStatus,
        newProbability: Math.round(update.newProbability * 100),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /sessions/:studentId/complete — End the session
sessionRoutes.post("/:studentId/complete", async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const { sessionId } = req.body;

    const [session] = await db
      .select()
      .from(learningSessions)
      .where(and(eq(learningSessions.id, sessionId), eq(learningSessions.studentId, studentId)));

    if (!session) throw new AppError(404, "NOT_FOUND", "Session not found");

    const startedAt = new Date(session.startedAt);
    const durationSeconds = Math.round((Date.now() - startedAt.getTime()) / 1000);
    const accuracy = session.totalQuestions > 0 ? session.correctAnswers / session.totalQuestions : 0;

    // Get student for streak/XP calculations
    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    // Update streak (3-day grace period — research: no loss-aversion pressure)
    const today = new Date().toISOString().split("T")[0];
    const lastSession = student.lastSessionDate;
    const previousStreak = student.currentStreak;

    let newStreak: number;
    if (lastSession === today) {
      newStreak = student.currentStreak; // Already did a session today
    } else if (lastSession) {
      const daysSinceLastSession = Math.floor(
        (new Date(today).getTime() - new Date(lastSession).getTime()) / 86400000
      );
      if (daysSinceLastSession <= STREAK_GRACE_DAYS) {
        newStreak = student.currentStreak + 1; // Within grace period
      } else {
        newStreak = 1; // Grace period exceeded
      }
    } else {
      newStreak = 1; // First session ever
    }

    // Calculate level
    const previousLevel = Math.floor(student.xpTotal / XP_PER_LEVEL);
    const newXpTotal = student.xpTotal + session.xpEarned;
    const newLevel = Math.floor(newXpTotal / XP_PER_LEVEL);

    // Detect skills mastered in this session by checking which skills
    // transitioned to "mastered" status during this session's responses
    const sessionResponses = await db
      .select({
        skillId: questionResponses.skillId,
        hintUsed: questionResponses.hintUsed,
      })
      .from(questionResponses)
      .where(eq(questionResponses.sessionId, sessionId));

    // Get unique skills touched in this session with hint counts
    const skillHintCounts = new Map<string, number>();
    for (const r of sessionResponses) {
      const prev = skillHintCounts.get(r.skillId) ?? 0;
      skillHintCounts.set(r.skillId, prev + (r.hintUsed ? 1 : 0));
    }

    const touchedSkillIds = [...skillHintCounts.keys()];
    const skillsMastered: { skillId: string; hintsUsed: number; wasGapClosure: boolean }[] = [];
    let dueReviewsSucceeded = 0;

    if (touchedSkillIds.length > 0) {
      // Get current mastery status for all touched skills
      const currentStates = await db
        .select({
          skillId: studentSkillStates.skillId,
          masteryStatus: studentSkillStates.masteryStatus,
          nextReview: studentSkillStates.nextReview,
        })
        .from(studentSkillStates)
        .where(
          and(
            eq(studentSkillStates.studentId, studentId),
            inArray(studentSkillStates.skillId, touchedSkillIds),
          ),
        );

      // Check which skills are now mastered and weren't previously rewarded
      for (const state of currentStates) {
        if (state.masteryStatus === "mastered") {
          // Check if we already awarded skill_mastery or gap_closure for this skill
          const [alreadyAwarded] = await db
            .select({ id: coinTransactions.id })
            .from(coinTransactions)
            .where(
              and(
                eq(coinTransactions.studentId, studentId),
                eq(coinTransactions.referenceId, state.skillId),
                sql`${coinTransactions.reason} IN ('skill_mastery', 'gap_closure')`,
              ),
            )
            .limit(1);

          if (!alreadyAwarded) {
            // Check if this was a gap closure (skill had attempts before this session
            // but wasn't mastered — meaning the child struggled and now closed the gap)
            const [priorAttempts] = await db
              .select({ count: sql<number>`count(*)` })
              .from(questionResponses)
              .where(
                and(
                  eq(questionResponses.skillId, state.skillId),
                  sql`${questionResponses.sessionId} != ${sessionId}`,
                  sql`${questionResponses.sessionId} IN (
                    SELECT id FROM learning_sessions WHERE student_id = ${studentId}
                  )`,
                ),
              );

            const wasGapClosure = (priorAttempts?.count ?? 0) > 0;

            skillsMastered.push({
              skillId: state.skillId,
              hintsUsed: skillHintCounts.get(state.skillId) ?? 0,
              wasGapClosure,
            });
          }
        }

        // Count successful due reviews (skill was already mastered and review was due)
        if (
          state.masteryStatus === "mastered" &&
          state.nextReview &&
          new Date(state.nextReview) <= new Date()
        ) {
          dueReviewsSucceeded++;
        }
      }
    }

    // Calculate coin rewards (mastery-only, with daily cap)
    const coinRewards = await calculateSessionRewards(
      studentId, sessionId, session.sessionType,
      skillsMastered, dueReviewsSucceeded,
      previousLevel, newLevel,
    );

    const totalCoins = coinRewards.reduce((sum, r) => sum + r.amount, 0);

    // Award coins
    if (totalCoins > 0) {
      for (const reward of coinRewards) {
        await awardCoins(studentId, reward.amount, reward.reason, reward.referenceId);
      }
    }

    // Update session
    await db
      .update(learningSessions)
      .set({
        status: "completed",
        completedAt: new Date(),
        durationSeconds,
        accuracy,
        coinsEarned: totalCoins,
      })
      .where(eq(learningSessions.id, sessionId));

    // Update student
    await db
      .update(students)
      .set({
        xpTotal: newXpTotal,
        currentStreak: newStreak,
        longestStreak: Math.max(student.longestStreak, newStreak),
        lastSessionDate: today,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    // Update domain states
    await updateDomainStates(studentId);

    res.json({
      summary: {
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        accuracy: Math.round(accuracy * 100),
        xpEarned: session.xpEarned,
        coinsEarned: totalCoins,
        coinRewards,
        streakDays: newStreak,
        leveledUp: newLevel > previousLevel,
        newLevel,
        durationMinutes: Math.round(durationSeconds / 60),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /sessions/:studentId/history — Session history
sessionRoutes.get("/:studentId/history", async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const offset = Number(req.query.offset) || 0;

    const sessions = await db
      .select()
      .from(learningSessions)
      .where(eq(learningSessions.studentId, studentId))
      .orderBy(desc(learningSessions.startedAt))
      .limit(limit)
      .offset(offset);

    res.json({ sessions, limit, offset });
  } catch (err) {
    next(err);
  }
});
