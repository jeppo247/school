"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { QuestionCard, type AnswerMetadata } from "@/components/student/QuestionCard";
import { Celebration } from "@/components/student/Celebration";
import { AdventureBackground } from "@/components/student/AdventureBackground";
import { AskAdultButton, AskAdultModal } from "@/components/student/AskAdultModal";
import { BrandMark, IconBadge, type AppIconName } from "@/components/ui/AppIcon";
import { api } from "@/lib/api";

type SessionPhase = "warmup" | "focus_1" | "brain_break" | "focus_2" | "wrapup";

const PHASE_CONFIG: Record<SessionPhase, { label: string; icon: AppIconName }> = {
  warmup: { label: "Warm Up", icon: "sun" },
  focus_1: { label: "Focus Time", icon: "target" },
  brain_break: { label: "Brain Break!", icon: "brain" },
  focus_2: { label: "Focus Time", icon: "dumbbell" },
  wrapup: { label: "Great Job!", icon: "star" },
};

interface QuestionPayload {
  id: string;
  type: "multiple_choice" | "numeric_input" | "true_false";
  content: {
    stem: string;
    answer: string | number;
    options?: string[];
    passage?: string;
    hint?: string;
    hints?: string[];
    explanation?: string;
  };
}

interface NextQuestionResponse {
  complete: boolean;
  questionNumber?: number;
  phase?: SessionPhase;
  question?: QuestionPayload;
  sessionProgress?: { questionsAnswered: number; accuracy: number };
  sessionTiming?: SessionTiming;
}

interface AnswerResponse {
  isCorrect: boolean;
  correctAnswer: string | number;
  explanation?: string;
  xpEarned: number;
  misconception: string | null;
  masteryUpdate: {
    skillId: string;
    newStatus: string;
    newProbability: number;
  };
}

interface SessionStartResponse {
  sessionId: string;
  plan: {
    phases: { phase: string; durationMinutes: number; questionCount: number }[];
    estimatedDurationMinutes: number;
    focusSkills: { name: string; yearLevel: number }[];
    reviewCount: number;
  };
}

interface SessionTiming {
  elapsedSeconds: number;
  baselineSeconds: number;
  baselineMinutes: number;
  baselineReached: boolean;
  shouldForceComplete: boolean;
}

export default function SessionPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("warmup");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionPayload | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<"correct" | "streak" | "levelUp" | "mastery">("correct");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer?: string | number;
    explanation?: string;
  } | null>(null);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showAskAdult, setShowAskAdult] = useState(false);
  const [sessionTiming, setSessionTiming] = useState<SessionTiming | null>(null);
  const [showTimePrompt, setShowTimePrompt] = useState(false);
  const [timePromptAcknowledged, setTimePromptAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phaseConfig = PHASE_CONFIG[phase];

  // Start session on mount
  useEffect(() => {
    const sid = sessionStorage.getItem("upwise_student_id");
    if (!sid) {
      setError("No student session found. Please go back to the dashboard.");
      return;
    }
    setStudentId(sid);

    async function startSession() {
      setLoading(true);
      try {
        const result = await api.post<SessionStartResponse>(`/sessions/${sid}/start`);
        setSessionId(result.sessionId);
      } catch {
        setError("Could not start session. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    startSession();
  }, []);

  const completeSession = useCallback(async () => {
    if (!studentId || !sessionId) return;

    try {
      await api.post(`/sessions/${studentId}/complete`, { sessionId });
      setFeedback(null);
      setShowCelebration(false);
      setShowTimePrompt(false);
      setCurrentQuestion(null);
      setSessionComplete(true);
    } catch {
      setError("Could not finish the session. Please try again.");
    }
  }, [studentId, sessionId]);

  // Fetch next question when session starts or after answering
  const fetchNextQuestion = useCallback(async () => {
    if (!studentId || !sessionId) return;
    setLoading(true);
    try {
      const result = await api.get<NextQuestionResponse>(
        `/sessions/${studentId}/next-question?sessionId=${sessionId}`,
      );

      if (result.sessionTiming) {
        setSessionTiming(result.sessionTiming);
        if (result.sessionTiming.baselineReached && !timePromptAcknowledged) {
          setShowTimePrompt(true);
        }
      }

      if (result.complete) {
        await completeSession();
      } else {
        if (result.question) setCurrentQuestion(result.question);
        if (result.questionNumber) setQuestionNumber(result.questionNumber);
        if (result.phase) setPhase(result.phase as SessionPhase);
      }
    } catch {
      setError("Could not load question. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionId, timePromptAcknowledged, completeSession]);

  // Trigger first question fetch once sessionId is set
  useEffect(() => {
    if (sessionId && !currentQuestion && !sessionComplete) {
      fetchNextQuestion();
    }
  }, [sessionId, currentQuestion, sessionComplete, fetchNextQuestion]);

  const handleAnswer = useCallback(async (
    answer: string | number,
    metadata: AnswerMetadata,
  ) => {
    if (!studentId || !sessionId || !currentQuestion) return;

    try {
      const result = await api.post<AnswerResponse>(`/sessions/${studentId}/respond`, {
        sessionId,
        questionId: currentQuestion.id,
        answer,
        timeTakenMs: 0,
        hintUsed: metadata.hintUsed,
      });

      setFeedback({
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
      });

      setTotalAnswered((prev) => prev + 1);
      setTotalXp((prev) => prev + result.xpEarned);

      if (result.isCorrect) {
        setTotalCorrect((prev) => prev + 1);
        const newStreak = correctInARow + 1;
        setCorrectInARow(newStreak);

        if (result.masteryUpdate.newStatus === "mastered") {
          setCelebrationType("mastery");
        } else if (newStreak >= 5) {
          setCelebrationType("streak");
        } else {
          setCelebrationType("correct");
        }
        setShowCelebration(true);
      } else {
        setCorrectInARow(0);
      }
    } catch {
      setError("Could not submit answer. Please try again.");
    }
  }, [studentId, sessionId, currentQuestion, correctInARow]);

  const handleContinue = useCallback(() => {
    setFeedback(null);
    setShowCelebration(false);
    setCurrentQuestion(null); // triggers fetchNextQuestion via useEffect
  }, []);

  const handleKeepPracticing = useCallback(() => {
    setTimePromptAcknowledged(true);
    setShowTimePrompt(false);
  }, []);

  const handleTakeBreak = useCallback(() => {
    setTimePromptAcknowledged(true);
    setShowTimePrompt(false);
    setPhase("brain_break");
  }, []);

  // Trigger fetch when currentQuestion is cleared after answering
  useEffect(() => {
    if (sessionId && !currentQuestion && !sessionComplete && !loading && !error && !feedback && studentId) {
      fetchNextQuestion();
    }
  }, [currentQuestion, sessionId, sessionComplete, loading, error, feedback, studentId, fetchNextQuestion]);

  // Error state
  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <IconBadge name="alert" className="mb-4 h-16 w-16 bg-red-50 text-red-500" iconClassName="h-8 w-8" />
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-3">{error}</h1>
          <a
            href="/dashboard"
            className="inline-block bg-[var(--theme-primary)] text-white font-display font-bold text-lg px-8 py-3 rounded-2xl mt-4"
          >
            Back to Dashboard
          </a>
        </motion.div>
      </main>
    );
  }

  // Loading (initial)
  if (loading && !currentQuestion) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <AdventureBackground calm />
        <motion.span
          className="block"
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <BrandMark className="h-16 w-16" />
        </motion.span>
        <p className="text-gray-400 mt-4 font-display">Getting your questions ready...</p>
      </main>
    );
  }

  if (phase === "brain_break") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <IconBadge name="brain" className="h-24 w-24 bg-teal-50 text-teal-600" iconClassName="h-12 w-12" />
          </motion.div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-teal-700 mb-4">
            Time for a Break
          </h1>
          <p className="text-teal-600 mb-8 text-lg">
            Rest your eyes, stretch, or grab some water.
          </p>
          <motion.button
            onClick={() => {
              setPhase("focus_2");
            }}
            className="bg-teal-500 text-white font-display font-bold text-xl px-10 py-4 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            I&apos;m Ready!
          </motion.button>
        </motion.div>
      </main>
    );
  }

  if (phase === "wrapup" || sessionComplete) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md lg:max-w-lg"
        >
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6 }}
          >
            <IconBadge name="star" className="h-24 w-24 bg-blue-50 text-[var(--theme-primary)]" iconClassName="h-12 w-12" />
          </motion.div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Amazing Work!
          </h1>
          <p className="text-gray-500 mb-8">You did a great job today!</p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Questions</span>
              <span className="font-display font-bold text-gray-800">{totalAnswered}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Correct</span>
              <span className="font-display font-bold text-emerald-600">{totalCorrect}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">XP Earned</span>
              <span className="font-display font-bold text-[var(--theme-primary)]">+{totalXp}</span>
            </div>
          </div>

          <motion.a
            href="/dashboard"
            className="inline-block bg-[var(--theme-primary)] text-white font-display font-bold text-lg px-10 py-4 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Home
          </motion.a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col pb-8">
      <AdventureBackground calm />
      {/* Session header */}
      <header className="px-6 py-4">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto">
          {/* Phase indicator */}
          <div className="flex items-center gap-2 mb-3">
            {(["warmup", "focus_1", "brain_break", "focus_2", "wrapup"] as SessionPhase[]).map((p) => (
              <div
                key={p}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  p === phase
                    ? "bg-[var(--theme-primary)]"
                    : (["warmup", "focus_1", "brain_break", "focus_2", "wrapup"].indexOf(p) <
                       ["warmup", "focus_1", "brain_break", "focus_2", "wrapup"].indexOf(phase))
                      ? "bg-[var(--theme-primary)]/30"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconBadge name={phaseConfig.icon} className="h-8 w-8 rounded-lg" iconClassName="h-4 w-4" />
              <span className="font-display font-semibold text-gray-700 text-sm md:text-base">
                {phaseConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AskAdultButton onClick={() => setShowAskAdult(true)} />
              <span className="text-xs text-gray-400 font-medium">
                Q{questionNumber}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Question area */}
      <div className="flex w-full flex-1 items-center justify-center px-6 pb-24 pt-4">
        <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-5xl">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={{
                stem: currentQuestion.content.stem,
                passage: currentQuestion.content.passage,
                options: currentQuestion.content.options,
                type: currentQuestion.type,
                hint: currentQuestion.content.hint,
                hints: currentQuestion.content.hints,
              }}
              onAnswer={handleAnswer}
              onContinue={handleContinue}
              disabled={feedback !== null}
              feedback={feedback}
            />
          )}
        </AnimatePresence>
        <p className="text-center text-[10px] text-gray-300 mt-6">Powered by AI</p>
        </div>
      </div>

      {/* Celebrations */}
      <Celebration
        trigger={showCelebration}
        type={celebrationType}
        onComplete={() => setShowCelebration(false)}
      />

      <AnimatePresence>
        {showTimePrompt && sessionTiming && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/25 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-time-title"
          >
            <motion.div
              className="w-full max-w-md rounded-[2rem] border border-blue-100 bg-white p-6 text-center shadow-xl"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
            >
              <IconBadge name="clock" className="mx-auto mb-4 h-16 w-16 bg-blue-50 text-[var(--theme-primary)]" iconClassName="h-8 w-8" />
              <h2 id="session-time-title" className="font-display text-2xl font-bold text-gray-800">
                {sessionTiming.baselineMinutes} minutes is up
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600">
                Nice effort today. You can take a break now, or do a little more.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleTakeBreak}
                  className="rounded-2xl bg-teal-50 px-5 py-3 font-display font-bold text-teal-700 transition-colors hover:bg-teal-100"
                >
                  Take a break
                </button>
                <button
                  type="button"
                  onClick={handleKeepPracticing}
                  className="rounded-2xl bg-[var(--theme-primary)] px-5 py-3 font-display font-bold text-white shadow-sm transition-transform active:scale-[0.98]"
                >
                  A little more
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AskAdultModal
        open={showAskAdult}
        onClose={() => setShowAskAdult(false)}
        onExit={() => { window.location.href = "/"; }}
      />
    </main>
  );
}
