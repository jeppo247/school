"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { QuestionCard } from "@/components/student/QuestionCard";
import { Celebration } from "@/components/student/Celebration";

export default function DiagnosticPage() {
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [complete, setComplete] = useState(false);

  // Mock — will be replaced with API calls
  const totalEstimated = 25;

  if (!started) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.span
            className="text-8xl block mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🦉
          </motion.span>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
            Let&apos;s find out what you know!
          </h1>
          <p className="text-gray-500 mb-2">
            We&apos;re going to play some learning games together.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            There are no wrong answers — this helps us find the best starting point for you.
          </p>
          <motion.button
            onClick={() => { setStarted(true); setQuestionNumber(1); }}
            className="bg-[var(--theme-primary)] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg shadow-blue-200/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let&apos;s Start!
          </motion.button>
          <p className="text-xs text-gray-400 mt-4">About 15 minutes</p>
        </motion.div>
      </main>
    );
  }

  if (complete) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.span
            className="text-8xl block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.8 }}
          >
            🎉
          </motion.span>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
            You did it!
          </h1>
          <p className="text-gray-500 mb-8">
            We know exactly where to start your learning adventure now.
          </p>
          <motion.a
            href="/dashboard"
            className="inline-block bg-[var(--theme-primary)] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Let&apos;s Go!
          </motion.a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] pb-8">
      {/* Progress bar — soft, no numbers shown to child */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--theme-primary)] rounded-full"
              animate={{ width: `${(questionNumber / totalEstimated) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Mascot encouragement every 5-7 questions */}
          {questionNumber > 0 && questionNumber % 6 === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-400 mt-3 font-display"
            >
              🦉 You&apos;re doing great! Keep going!
            </motion.p>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6">
        <QuestionCard
          question={{
            stem: "What is 47 + 38?",
            options: ["75", "85", "95", "815"],
            type: "multiple_choice",
            hint: "Try adding the ones first: 7 + 8 = ?",
          }}
          onAnswer={(answer) => {
            const isCorrect = String(answer) === "85";
            setFeedback({ isCorrect, explanation: isCorrect ? "47 + 38 = 85. Nice!" : "Not quite — try again!" });
            if (isCorrect) setShowCelebration(true);

            setTimeout(() => {
              setFeedback(null);
              setShowCelebration(false);
              if (questionNumber >= totalEstimated) {
                setComplete(true);
              } else {
                setQuestionNumber((prev) => prev + 1);
              }
            }, 2000);
          }}
          disabled={feedback !== null}
          feedback={feedback}
        />
      </div>

      <Celebration
        trigger={showCelebration}
        type="correct"
        onComplete={() => setShowCelebration(false)}
      />
    </main>
  );
}
