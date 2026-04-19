import { Router } from "express";
import { db } from "../db/client.js";
import {
  students, learningSessions, questionResponses, questions,
  studentSkillStates, skillNodes,
} from "../db/schema.js";
import { eq, and, sql } from "drizzle-orm";
import { estimateAbilityEAP, selectMaxInfoItem } from "../engine/irt.js";
import { updateKnowledgeState } from "../engine/knowledge-state.js";
import { AppError } from "../middleware/error-handler.js";
import { updateDomainStates } from "../services/domain-service.js";
import type { AdaptiveResponse } from "../engine/types.js";

export const diagnosticRoutes = Router();

// POST /diagnostic/:studentId/start — Begin diagnostic assessment
diagnosticRoutes.post("/:studentId/start", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { domain } = req.body; // optional: filter to specific domain

    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    // Create a diagnostic session
    const [session] = await db
      .insert(learningSessions)
      .values({
        studentId,
        sessionType: "diagnostic",
        status: "in_progress",
        phase: "focus_1",
        metadata: { domain: domain ?? "all" },
      })
      .returning();

    res.status(201).json({
      sessionId: session.id,
      message: "Diagnostic started. Call /next-question to begin.",
    });
  } catch (err) {
    next(err);
  }
});

// GET /diagnostic/:studentId/next-question — Get next adaptive question
diagnosticRoutes.get("/:studentId/next-question", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const sessionId = req.query.sessionId as string;
    if (!sessionId) throw new AppError(400, "VALIDATION_ERROR", "sessionId query parameter required");

    // Get student for year level filtering
    const [student] = await db.select().from(students).where(eq(students.id, studentId));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    // Get session
    const [session] = await db
      .select()
      .from(learningSessions)
      .where(and(eq(learningSessions.id, sessionId), eq(learningSessions.studentId, studentId)));

    if (!session) throw new AppError(404, "NOT_FOUND", "Session not found");
    if (session.status !== "in_progress") {
      return res.json({ complete: true, message: "Diagnostic is already complete" });
    }

    // Get previous responses in this session to build ability estimate
    const responses = await db
      .select({
        questionId: questionResponses.questionId,
        isCorrect: questionResponses.isCorrect,
        difficultyAtTime: questionResponses.difficultyAtTime,
      })
      .from(questionResponses)
      .where(eq(questionResponses.sessionId, sessionId));

    const askedIds = new Set(responses.map((r) => r.questionId));

    // Check termination: 25+ questions or SE < 0.3
    const adaptiveResponses: AdaptiveResponse[] = responses.map((r) => ({
      questionId: r.questionId,
      skillId: "",
      isCorrect: r.isCorrect,
      itemParams: { a: 1, b: r.difficultyAtTime ?? 0, c: 0.25 },
      timeTakenMs: 0,
    }));

    const abilityEstimate = adaptiveResponses.length > 0
      ? estimateAbilityEAP(adaptiveResponses)
      : { theta: 0, standardError: 1.5, responseCount: 0 };

    if (responses.length >= 25 && abilityEstimate.standardError < 0.3) {
      return res.json({ complete: true, message: "Diagnostic complete — sufficient precision" });
    }
    if (responses.length >= 35) {
      return res.json({ complete: true, message: "Diagnostic complete — maximum questions reached" });
    }

    // Get available questions — ONLY at the student's year level for diagnostic
    const available = await db
      .select({
        id: questions.id,
        skillId: questions.skillId,
        difficultyParam: questions.difficultyParam,
        content: questions.content,
        questionType: questions.questionType,
      })
      .from(questions)
      .innerJoin(skillNodes, eq(questions.skillId, skillNodes.id))
      .where(
        and(
          eq(questions.isValidated, true),
          eq(skillNodes.yearLevel, student.yearLevel),
        ),
      );

    // Filter out already-asked questions
    const candidates = available.filter((q) => !askedIds.has(q.id));

    if (candidates.length === 0) {
      return res.json({ complete: true, message: "No more questions available" });
    }

    // Use CAT to select the most informative question
    const bestId = selectMaxInfoItem(
      abilityEstimate.theta,
      candidates.map((q) => ({
        id: q.id,
        params: { a: 1, b: q.difficultyParam, c: 0.25 },
      })),
    );

    const selectedQuestion = candidates.find((q) => q.id === bestId) ?? candidates[0];

    res.json({
      complete: false,
      questionNumber: responses.length + 1,
      question: {
        id: selectedQuestion.id,
        type: selectedQuestion.questionType,
        content: selectedQuestion.content,
      },
      progress: {
        questionsAnswered: responses.length,
        estimatedRemaining: Math.max(0, 25 - responses.length),
        confidence: 1 - abilityEstimate.standardError,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /diagnostic/:studentId/respond — Submit answer and get feedback
diagnosticRoutes.post("/:studentId/respond", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { sessionId, questionId, answer, timeTakenMs } = req.body;

    if (!sessionId || !questionId || answer === undefined) {
      throw new AppError(400, "VALIDATION_ERROR", "sessionId, questionId, and answer are required");
    }

    // Get the question
    const [question] = await db.select().from(questions).where(eq(questions.id, questionId));
    if (!question) throw new AppError(404, "NOT_FOUND", "Question not found");

    const content = question.content as { answer: string | number; explanation?: string };
    const isCorrect = String(answer) === String(content.answer);

    // Count existing responses for sequence number
    const existingResponses = await db
      .select({ id: questionResponses.id })
      .from(questionResponses)
      .where(eq(questionResponses.sessionId, sessionId));

    // Record the response
    await db.insert(questionResponses).values({
      sessionId,
      questionId,
      skillId: question.skillId,
      studentAnswer: answer,
      correctAnswer: content.answer,
      isCorrect,
      timeTakenMs,
      hintUsed: false,
      difficultyAtTime: question.difficultyParam,
      abilityEstimateAtTime: 0,
      sequenceNumber: existingResponses.length + 1,
    });

    // Update skill mastery state
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

    // Update session stats
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
    });
  } catch (err) {
    next(err);
  }
});

// POST /diagnostic/:studentId/complete — Complete the diagnostic
diagnosticRoutes.post("/:studentId/complete", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { sessionId } = req.body;

    // Mark session complete
    const [session] = await db
      .update(learningSessions)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(and(eq(learningSessions.id, sessionId), eq(learningSessions.studentId, studentId)))
      .returning();

    if (!session) throw new AppError(404, "NOT_FOUND", "Session not found");

    // Mark student as diagnostic completed
    await db
      .update(students)
      .set({ diagnosticCompleted: true, updatedAt: new Date() })
      .where(eq(students.id, studentId));

    // Update domain states
    await updateDomainStates(studentId);

    // Calculate accuracy
    const accuracy = session.totalQuestions > 0
      ? session.correctAnswers / session.totalQuestions
      : 0;

    res.json({
      complete: true,
      summary: {
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        accuracy: Math.round(accuracy * 100),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /diagnostic/:studentId/result — Get gap map from diagnostic
diagnosticRoutes.get("/:studentId/result", async (req, res, next) => {
  try {
    const { studentId } = req.params;
    // Reuse the knowledge-graph gap-map endpoint logic
    const { getDomainStates } = await import("../services/domain-service.js");
    const domainStates = await getDomainStates(studentId);

    res.json({ domainStates });
  } catch (err) {
    next(err);
  }
});
