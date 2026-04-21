"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { QuestionCard } from "@/components/student/QuestionCard";
import { Celebration } from "@/components/student/Celebration";
import { CoinEarnOverlay } from "@/components/student/CoinEarnOverlay";
import { AdventureBackground } from "@/components/student/AdventureBackground";

type SessionPhase = "warmup" | "focus_1" | "brain_break" | "focus_2" | "wrapup";

const PHASE_CONFIG: Record<SessionPhase, { label: string; emoji: string; bg: string }> = {
  warmup: { label: "Warm Up", emoji: "☀️", bg: "from-amber-50 to-orange-50" },
  focus_1: { label: "Focus Time", emoji: "🎯", bg: "from-blue-50 to-indigo-50" },
  brain_break: { label: "Brain Break!", emoji: "🧠", bg: "from-teal-50 to-emerald-50" },
  focus_2: { label: "Focus Time", emoji: "💪", bg: "from-purple-50 to-pink-50" },
  wrapup: { label: "Great Job!", emoji: "🌟", bg: "from-amber-50 to-yellow-50" },
};

// Mock question — will be replaced with API
const mockQuestion = {
  stem: "A farmer has 342 sheep. He sells 178 sheep at the market. How many sheep does the farmer have left?",
  options: ["164", "174", "236", "264"],
  type: "multiple_choice" as const,
  hint: "Try starting from the ones column: 2 minus 8. You'll need to borrow from the tens.",
};

export default function SessionPage() {
  const [phase, setPhase] = useState<SessionPhase>("warmup");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<"correct" | "streak" | "levelUp" | "mastery">("correct");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const phaseConfig = PHASE_CONFIG[phase];

  const handleAnswer = useCallback((answer: string | number) => {
    const isCorrect = String(answer) === "164";

    setFeedback({
      isCorrect,
      explanation: isCorrect
        ? "342 - 178 = 164. Great work!"
        : "Not quite. Try borrowing from the tens column: 12 - 8 = 4, then 3 - 7 needs borrowing too.",
    });

    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      const newStreak = correctInARow + 1;
      setCorrectInARow(newStreak);

      if (newStreak >= 5) {
        setCelebrationType("streak");
      } else {
        setCelebrationType("correct");
      }
      setShowCelebration(true);
    } else {
      setCorrectInARow(0);
    }

    // Auto-advance after delay
    setTimeout(() => {
      setFeedback(null);
      setShowCelebration(false);
      setQuestionNumber((prev) => prev + 1);
    }, 2500);
  }, [correctInARow]);

  if (phase === "brain_break") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground />
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
            onClick={() => setPhase("focus_2")}
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
        <AdventureBackground />
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
              <span className="font-display font-bold text-[var(--theme-primary)]">+{totalCorrect * 12}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Coins Earned</span>
              <span className="font-display font-bold text-amber-600">+5</span>
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
      <AdventureBackground />
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
            <span className="text-xs text-gray-400 font-medium">
              Question {questionNumber}
            </span>
          </div>
        </div>
      </header>

      {/* Question area */}
      <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto px-6 pt-4">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={questionNumber}
            question={mockQuestion}
            onAnswer={handleAnswer}
            disabled={feedback !== null}
            feedback={feedback}
          />
        </AnimatePresence>
      </div>

      {/* Celebrations */}
      <Celebration
        trigger={showCelebration}
        type={celebrationType}
        onComplete={() => setShowCelebration(false)}
      />
    </main>
  );
}
