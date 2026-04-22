"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { QuestionCard } from "@/components/student/QuestionCard";
import { Celebration } from "@/components/student/Celebration";
import { AdventureBackground } from "@/components/student/AdventureBackground";
import { AskAdultButton, AskAdultModal } from "@/components/student/AskAdultModal";
import { api } from "@/lib/api";

type SessionPhase = "warmup" | "focus_1" | "brain_break" | "focus_2" | "wrapup";

const PHASE_CONFIG: Record<SessionPhase, { label: string; emoji: string }> = {
  warmup: { label: "Warm Up", emoji: "☀️" },
  focus_1: { label: "Focus Time", emoji: "🎯" },
  brain_break: { label: "Brain Break!", emoji: "🧠" },
  focus_2: { label: "Focus Time", emoji: "💪" },
  wrapup: { label: "Great Job!", emoji: "🌟" },
};

interface QuestionPayload {
  id: string;
  type: "multiple_choice" | "numeric_input" | "true_false";
  content: {
    stem: string;
    answer: string | number;
    options?: string[];
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

export default function SessionPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("warmup");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionPayload | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<"correct" | "streak" | "levelUp" | "mastery">("correct");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showAskAdult, setShowAskAdult] = useState(false);
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

  // Fetch next question when session starts or after answering
  const fetchNextQuestion = useCallback(async () => {
    if (!studentId || !sessionId) return;
    setLoading(true);
    try {
      const result = await api.get<NextQuestionResponse>(
        `/sessions/${studentId}/next-question?sessionId=${sessionId}`,
      );

      if (result.complete) {
        await api.post(`/sessions/${studentId}/complete`, { sessionId });
        setSessionComplete(true);
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
  }, [studentId, sessionId]);

  // Trigger first question fetch once sessionId is set
  useEffect(() => {
    if (sessionId && !currentQuestion && !sessionComplete) {
      fetchNextQuestion();
    }
  }, [sessionId, currentQuestion, sessionComplete, fetchNextQuestion]);

  const handleAnswer = useCallback(async (answer: string | number) => {
    if (!studentId || !sessionId || !currentQuestion) return;

    try {
      const result = await api.post<AnswerResponse>(`/sessions/${studentId}/respond`, {
        sessionId,
        questionId: currentQuestion.id,
        answer,
        timeTakenMs: 0,
      });

      setFeedback({
        isCorrect: result.isCorrect,
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

      // Advance to next question after delay
      setTimeout(() => {
        setFeedback(null);
        setShowCelebration(false);
        setCurrentQuestion(null); // triggers fetchNextQuestion via useEffect
      }, 2500);
    } catch {
      setError("Could not submit answer. Please try again.");
    }
  }, [studentId, sessionId, currentQuestion, correctInARow]);

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
          <span className="text-6xl block mb-4">😕</span>
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
          className="text-6xl"
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🦉
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
          <motion.span
            className="text-8xl lg:text-9xl block mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-teal-700 mb-4">
            Brain Break!
          </h1>
          <p className="text-teal-600 mb-8 text-lg">
            Time for a quick rest. Do 10 star jumps! ⭐
          </p>
          <motion.button
            onClick={() => {
              setPhase("focus_2");
              setCurrentQuestion(null); // fetch next question for focus_2
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
          <motion.span
            className="text-8xl lg:text-9xl block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6 }}
          >
            🌟
          </motion.span>
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
    <main className="min-h-screen pb-8">
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
              <span className="text-xl md:text-2xl">{phaseConfig.emoji}</span>
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
      <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto px-6 pt-4">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={{
                stem: currentQuestion.content.stem,
                options: currentQuestion.content.options,
                type: currentQuestion.type,
                hint: currentQuestion.content.hint,
                hints: currentQuestion.content.hints,
              }}
              onAnswer={handleAnswer}
              disabled={feedback !== null}
              feedback={feedback}
            />
          )}
        </AnimatePresence>
        <p className="text-center text-[10px] text-gray-300 mt-6">Powered by AI</p>
      </div>

      {/* Celebrations */}
      <Celebration
        trigger={showCelebration}
        type={celebrationType}
        onComplete={() => setShowCelebration(false)}
      />

      <AskAdultModal
        open={showAskAdult}
        onClose={() => setShowAskAdult(false)}
        onExit={() => { window.location.href = "/"; }}
      />
    </main>
  );
}
