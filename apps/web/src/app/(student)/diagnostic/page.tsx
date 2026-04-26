"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { QuestionCard } from "@/components/student/QuestionCard";
import { AdventureBackground } from "@/components/student/AdventureBackground";
import { AskAdultButton, AskAdultModal } from "@/components/student/AskAdultModal";
import { AppIcon, BrandMark, IconBadge } from "@/components/ui/AppIcon";
import { api } from "@/lib/api";
import { getDemoQuestionsForYear, type QuestionData } from "./demo-questions";

type NaplanDomain = QuestionData["domain"];

interface DomainScore {
  domain: NaplanDomain;
  correct: number;
  total: number;
  accuracy: number;
  proficiency: string;
}

function calculateProficiency(accuracy: number): string {
  if (accuracy >= 0.85) return "exceeding";
  if (accuracy >= 0.65) return "strong";
  if (accuracy >= 0.40) return "developing";
  return "needs_additional_support";
}

export default function DiagnosticPage() {
  const [childName, setChildName] = useState("Mate");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [showAskAdult, setShowAskAdult] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  // Per-domain tracking — silently scored, shown on parent dashboard
  const [domainResults, setDomainResults] = useState<Record<NaplanDomain, { correct: number; total: number }>>({
    numeracy: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
    spelling: { correct: 0, total: 0 },
    grammar_punctuation: { correct: 0, total: 0 },
    writing: { correct: 0, total: 0 },
  });

  const [demoQuestions, setDemoQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    const sid = sessionStorage.getItem("upwise_student_id");
    const sessId = sessionStorage.getItem("upwise_session_id");
    const name = sessionStorage.getItem("upwise_child_name");
    const yearStr = sessionStorage.getItem("upwise_year_level");
    const yearLevel = yearStr ? Number(yearStr) : 3;
    if (name) setChildName(name);

    // Check for saved progress to resume
    const savedRaw = sessionStorage.getItem("upwise_diagnostic_progress");
    if (savedRaw && name) {
      try {
        const saved = JSON.parse(savedRaw);
        // Filter demo questions for restoration
        const filtered = getDemoQuestionsForYear(yearLevel);
        setDemoQuestions(filtered);
        setDemoMode(true);
        // Restore saved state
        setQuestionIndex(saved.questionIndex ?? 0);
        setTotalAnswered(saved.totalAnswered ?? 0);
        setTotalCorrect(saved.totalCorrect ?? 0);
        if (saved.domainResults) setDomainResults(saved.domainResults);
        setCurrentQuestion(filtered[saved.questionIndex ?? 0] ?? null);
        setStarted(true);
        setShowResume(true);
        // Clear the saved progress so it doesn't keep showing
        sessionStorage.removeItem("upwise_diagnostic_progress");
        return;
      } catch {
        sessionStorage.removeItem("upwise_diagnostic_progress");
      }
    }

    if (sid && sessId) {
      setStudentId(sid);
      setSessionId(sessId);
      setStarted(true);
    } else if (name) {
      const filtered = getDemoQuestionsForYear(yearLevel);
      setDemoQuestions(filtered);
      setDemoMode(true);
      setStarted(true);
      setCurrentQuestion(filtered[0] ?? null);
    }
  }, []);

  // Fetch next question from API (live mode)
  const fetchNextQuestion = useCallback(async () => {
    if (!studentId || !sessionId) return;
    setLoading(true);
    try {
      const result = await api.get<{
        complete: boolean;
        questionNumber?: number;
        question?: QuestionData;
      }>(`/diagnostic/${studentId}/next-question?sessionId=${sessionId}`);

      if (result.complete) {
        await api.post(`/diagnostic/${studentId}/complete`, { sessionId });
        setComplete(true);
      } else if (result.question) {
        setCurrentQuestion(result.question);
        setQuestionIndex((prev) => prev + 1);
      }
    } catch {
      // API failed — switch to demo mode
      const yearLevel = Number(sessionStorage.getItem("upwise_year_level") ?? 3);
      const fallbackQuestions = demoQuestions.length > 0
        ? demoQuestions
        : getDemoQuestionsForYear(yearLevel);
      setDemoQuestions(fallbackQuestions);
      setDemoMode(true);
      setCurrentQuestion(fallbackQuestions[questionIndex] ?? fallbackQuestions[0] ?? null);
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionId, questionIndex, demoQuestions]);

  useEffect(() => {
    if (started && !demoMode && studentId && sessionId && !currentQuestion && !complete) {
      fetchNextQuestion();
    }
  }, [started, demoMode, studentId, sessionId, currentQuestion, complete, fetchNextQuestion]);

  // Save results to sessionStorage when diagnostic completes
  useEffect(() => {
    if (!complete) return;

    const domains: NaplanDomain[] = ["numeracy", "reading", "spelling", "grammar_punctuation", "writing"];
    const domainScores: DomainScore[] = domains.map((domain) => {
      const r = domainResults[domain];
      const accuracy = r.total > 0 ? r.correct / r.total : 0;
      return {
        domain,
        correct: r.correct,
        total: r.total,
        accuracy: Math.round(accuracy * 100),
        proficiency: calculateProficiency(accuracy),
      };
    });

    const results = {
      childName,
      yearLevel: Number(sessionStorage.getItem("upwise_year_level") ?? 3),
      totalAnswered,
      totalCorrect,
      overallAccuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      domainScores,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("upwise_diagnostic_results", JSON.stringify(results));
  }, [complete, domainResults, childName, totalAnswered, totalCorrect]);

  function advanceToNextQuestion() {
    const nextIndex = questionIndex + 1;
    if (demoMode) {
      if (nextIndex >= demoQuestions.length) {
        setComplete(true);
      } else {
        setQuestionIndex(nextIndex);
        setCurrentQuestion(demoQuestions[nextIndex]);
      }
    } else {
      setCurrentQuestion(null); // triggers API fetch via useEffect
      setQuestionIndex(nextIndex);
    }
  }

  async function handleAnswer(answer: string | number) {
    if (!currentQuestion || answerLocked) return;
    setAnswerLocked(true);

    // Score silently — child never sees right/wrong
    const isCorrect = demoMode
      ? String(answer) === String(currentQuestion.content.answer)
      : await (async () => {
          try {
            const result = await api.post<{ isCorrect: boolean }>(`/diagnostic/${studentId}/respond`, {
              sessionId,
              questionId: currentQuestion.id,
              answer,
              timeTakenMs: 0,
            });
            return result.isCorrect;
          } catch {
            return String(answer) === String(currentQuestion.content.answer);
          }
        })();

    setTotalAnswered((prev) => prev + 1);
    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
    }

    // Track per-domain results
    if (demoMode && currentQuestion) {
      const domain = currentQuestion.domain;
      setDomainResults((prev) => ({
        ...prev,
        [domain]: {
          correct: prev[domain].correct + (isCorrect ? 1 : 0),
          total: prev[domain].total + 1,
        },
      }));
    }

    // Show calm transition animation (same for right or wrong)
    setShowTransition(true);

    setTimeout(() => {
      setShowTransition(false);
      setAnswerLocked(false);
      advanceToNextQuestion();
    }, 900);
  }

  // Fallback: no name in sessionStorage at all
  if (!started) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BrandMark className="h-20 w-20" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
            Let&apos;s get started!
          </h1>
          <p className="text-gray-500 mb-8">
            Set up your profile first, then we&apos;ll begin the diagnostic.
          </p>
          <a
            href="/start"
            className="inline-block bg-[#4F8CF7] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg"
          >
            Go to Start
          </a>
        </motion.div>
      </main>
    );
  }

  // Diagnostic complete
  if (complete) {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md lg:max-w-lg"
        >
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.8 }}
          >
            <IconBadge name="party" className="h-24 w-24 bg-blue-50 text-[var(--theme-primary)]" iconClassName="h-12 w-12" />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Amazing work, {childName}!
          </h1>
          <p className="text-gray-500 mb-6">
            You finished all {totalAnswered} questions — well done!
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
              <AppIcon name="users" className="h-4 w-4" />
              For parents:
            </p>
            <p className="text-sm text-gray-600 mb-3">
              {childName}&apos;s diagnostic is complete. Based on {totalAnswered} questions across
              numeracy, reading, and spelling, we&apos;ve identified their strengths and learning gaps.
            </p>
            <p className="text-sm text-gray-600">
              {accuracy >= 80
                ? `${childName} showed strong performance! We'll focus on extending their skills and filling any remaining gaps.`
                : accuracy >= 60
                  ? `${childName} has a solid foundation with some gaps to close. Our adaptive system will target these specifically.`
                  : `We've identified several key areas where ${childName} needs support. The personalised learning path will focus on building these foundations.`}
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="/dashboard"
              className="flex-1 bg-[#4F8CF7] text-white font-display font-bold text-lg py-4 rounded-2xl shadow-lg text-center"
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

  // Loading
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
        <p className="text-gray-400 mt-4 font-display">
          Finding the perfect question for you...
        </p>
      </main>
    );
  }

  // Active diagnostic
  const totalQuestions = demoMode ? Math.max(demoQuestions.length, 1) : 25;
  const progress = Math.min((questionIndex / totalQuestions) * 100, 100);

  function handleStartAgain() {
    setQuestionIndex(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setDomainResults({
      numeracy: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      spelling: { correct: 0, total: 0 },
      grammar_punctuation: { correct: 0, total: 0 },
      writing: { correct: 0, total: 0 },
    });
    if (demoMode && demoQuestions.length > 0) {
      setCurrentQuestion(demoQuestions[0]);
    }
  }

  function handleFinishEarly() {
    setComplete(true);
  }

  function handleSaveForLater() {
    // Save current progress to sessionStorage
    sessionStorage.setItem("upwise_diagnostic_progress", JSON.stringify({
      questionIndex,
      totalAnswered,
      totalCorrect,
      domainResults,
      childName,
    }));
    window.location.href = "/";
  }

  return (
    <main className="flex min-h-screen flex-col pb-8">
      <AdventureBackground calm />

      {/* Header bar with Upwise logo + controls */}
      <header className="relative z-20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/" className="font-display text-xl md:text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </a>
          <span className="hidden rounded-full bg-white/55 px-2 py-1 text-[10px] font-semibold text-slate-700 sm:inline">
            Powered by AI
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <AskAdultButton onClick={() => setShowAskAdult(true)} />
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg bg-white/40 p-2 text-slate-600 transition-colors hover:bg-white/70 hover:text-slate-900"
              aria-label="More options"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="4" r="2" />
                <circle cx="10" cy="10" r="2" />
                <circle cx="10" cy="16" r="2" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-40 bg-white rounded-xl border border-[var(--border-warm)] py-1 min-w-[140px]" style={{ boxShadow: "var(--shadow-clay)" }}>
                  <button onClick={() => { setShowMenu(false); handleSaveForLater(); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Save for later
                  </button>
                  <button onClick={() => { setShowMenu(false); handleFinishEarly(); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Finish early
                  </button>
                  <button onClick={() => { setShowMenu(false); handleStartAgain(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors">
                    Start again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Resume banner */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 px-6 pb-2"
          >
            <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-blue-600 font-medium">Welcome back! Picking up where you left off.</p>
                <button onClick={() => setShowResume(false)} className="text-blue-400 hover:text-blue-600 ml-2">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="relative z-10 px-6 pb-4">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto">
          <div className="h-2 bg-white/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--theme-primary)] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mx-auto mt-2 w-fit rounded-full bg-white/55 px-3 py-1 text-center text-sm font-semibold text-slate-700">
            Question {questionIndex + 1}{demoMode ? ` of ${demoQuestions.length}` : ""}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-6 pb-24 pt-4">
        <div className="w-full max-w-2xl lg:max-w-3xl">
        <AnimatePresence mode="wait">
          {currentQuestion && !showTransition && (
            <QuestionCard
              key={currentQuestion.id}
              question={{
                stem: currentQuestion.content.stem,
                passage: currentQuestion.content.passage,
                options: currentQuestion.content.options,
                type: (currentQuestion.type as "multiple_choice" | "numeric_input" | "true_false"),
                hint: currentQuestion.content.hint,
              }}
              onAnswer={handleAnswer}
              disabled={answerLocked}
              feedback={null}
            />
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Neutral transition during assessment */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="rounded-3xl border border-[var(--border-warm)] bg-white/95 px-8 py-6 text-center shadow-lg"
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8, transition: { duration: 0 } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <IconBadge
                name="check"
                className="mx-auto mb-3 h-12 w-12 bg-blue-50 text-[var(--theme-primary)]"
                iconClassName="h-6 w-6"
              />
              <p className="font-display text-xl font-bold text-gray-800">
                Answer saved
              </p>
              <p className="mt-1 text-base text-gray-500">
                Next question
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AskAdultModal
        open={showAskAdult}
        onClose={() => setShowAskAdult(false)}
        onSaveForLater={() => { setShowAskAdult(false); handleSaveForLater(); }}
        onExit={() => { window.location.href = "/"; }}
      />
    </main>
  );
}
