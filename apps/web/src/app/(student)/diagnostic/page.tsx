"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { QuestionCard } from "@/components/student/QuestionCard";
import { Celebration } from "@/components/student/Celebration";
import { api } from "@/lib/api";

interface QuestionData {
  id: string;
  type: string;
  content: {
    stem: string;
    answer: string | number;
    options?: string[];
    hint?: string;
    explanation?: string;
  };
}

export default function DiagnosticPage() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [childName, setChildName] = useState("Mate");
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Load session info from sessionStorage
  useEffect(() => {
    const sid = sessionStorage.getItem("upwise_student_id");
    const sessId = sessionStorage.getItem("upwise_session_id");
    const name = sessionStorage.getItem("upwise_child_name");
    if (sid) setStudentId(sid);
    if (sessId) setSessionId(sessId);
    if (name) setChildName(name);
    if (sid && sessId) setStarted(true);
  }, []);

  // Fetch next question when started or after answering
  const fetchNextQuestion = useCallback(async () => {
    if (!studentId || !sessionId) return;
    setLoading(true);
    try {
      const result = await api.get<{
        complete: boolean;
        questionNumber?: number;
        question?: QuestionData;
        message?: string;
      }>(`/diagnostic/${studentId}/next-question?sessionId=${sessionId}`);

      if (result.complete) {
        // Complete the diagnostic
        await api.post(`/diagnostic/${studentId}/complete`, { sessionId });
        setComplete(true);
      } else if (result.question) {
        setCurrentQuestion(result.question);
        setQuestionNumber(result.questionNumber ?? questionNumber + 1);
      }
    } catch (err) {
      console.error("Failed to fetch question:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionId, questionNumber]);

  useEffect(() => {
    if (started && studentId && sessionId && !currentQuestion && !complete) {
      fetchNextQuestion();
    }
  }, [started, studentId, sessionId, currentQuestion, complete, fetchNextQuestion]);

  async function handleAnswer(answer: string | number) {
    if (!studentId || !sessionId || !currentQuestion) return;

    try {
      const result = await api.post<{
        isCorrect: boolean;
        correctAnswer: string | number;
        explanation?: string;
      }>(`/diagnostic/${studentId}/respond`, {
        sessionId,
        questionId: currentQuestion.id,
        answer,
        timeTakenMs: 0,
      });

      setTotalAnswered((prev) => prev + 1);
      if (result.isCorrect) {
        setTotalCorrect((prev) => prev + 1);
        setShowCelebration(true);
      }

      setFeedback({
        isCorrect: result.isCorrect,
        explanation: result.explanation,
      });

      // Move to next question after delay
      setTimeout(() => {
        setFeedback(null);
        setShowCelebration(false);
        setCurrentQuestion(null); // triggers fetchNextQuestion via useEffect
      }, 2000);
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  }

  // Not started yet — show intro (fallback if accessed directly)
  if (!started || !studentId) {
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
            Let&apos;s get started!
          </h1>
          <p className="text-gray-500 mb-8">
            Head to the start page to set up your profile first.
          </p>
          <a
            href="/start"
            className="bg-[var(--theme-primary)] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg"
          >
            Go to Start
          </a>
        </motion.div>
      </main>
    );
  }

  // Diagnostic complete
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
            Amazing work, {childName}!
          </h1>
          <p className="text-gray-500 mb-2">
            You answered {totalAnswered} questions and got {totalCorrect} correct!
          </p>
          <p className="text-gray-400 text-sm mb-8">
            We now know exactly where to start your learning adventure.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <p className="text-xs font-medium text-gray-400 mb-3">👨‍👩‍👧 For parents:</p>
            <p className="text-sm text-gray-600">
              {childName}&apos;s diagnostic is complete. Their personalised gap map and
              learning path are ready. Visit the parent dashboard to see the full results
              and domain proficiency projections.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="/dashboard"
              className="flex-1 bg-[var(--theme-primary)] text-white font-display font-bold text-lg py-4 rounded-2xl shadow-lg text-center"
            >
              Start Learning!
            </a>
            <a
              href="/parent-dashboard"
              className="flex-1 bg-white text-gray-700 font-semibold text-lg py-4 rounded-2xl border border-gray-200 text-center"
            >
              Parent View
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  // Loading state
  if (loading && !currentQuestion) {
    return (
      <main className="min-h-screen bg-[var(--theme-bg)] flex flex-col items-center justify-center">
        <motion.span
          className="text-6xl"
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🦉
        </motion.span>
        <p className="text-gray-400 mt-4 font-display">
          Finding the perfect question for you...
        </p>
      </main>
    );
  }

  // Active diagnostic
  return (
    <main className="min-h-screen bg-[var(--theme-bg)] pb-8">
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--theme-primary)] rounded-full"
              animate={{ width: `${Math.min((questionNumber / 25) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {questionNumber > 0 && questionNumber % 6 === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-400 mt-3 font-display"
            >
              🦉 You&apos;re doing great, {childName}! Keep going!
            </motion.p>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto px-6">
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={{
              stem: currentQuestion.content.stem,
              options: currentQuestion.content.options,
              type: currentQuestion.type as "multiple_choice" | "numeric_input" | "true_false",
              hint: currentQuestion.content.hint,
            }}
            onAnswer={handleAnswer}
            disabled={feedback !== null}
            feedback={feedback}
          />
        )}
      </div>

      <Celebration
        trigger={showCelebration}
        type="correct"
        onComplete={() => setShowCelebration(false)}
      />
    </main>
  );
}
