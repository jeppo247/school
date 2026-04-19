"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { QuestionCard } from "@/components/student/QuestionCard";
import { AdventureBackground } from "@/components/student/AdventureBackground";
import { api } from "@/lib/api";

type NaplanDomain = "numeracy" | "reading" | "spelling" | "grammar_punctuation" | "writing";

interface QuestionData {
  id: string;
  type: string;
  domain: NaplanDomain;
  /** Maximum year level this question is appropriate for */
  maxYear: number;
  content: {
    stem: string;
    answer: string | number;
    options?: string[];
    hint?: string;
    explanation?: string;
  };
}

/**
 * Demo question bank — tagged by domain AND year level appropriateness.
 * Questions are filtered by the child's year level so Prep kids
 * only see Prep-appropriate questions.
 */
const ALL_DEMO_QUESTIONS: QuestionData[] = [
  // PREP / YEAR 1 — Numbers to 10, counting, simple addition
  { id: "d1", type: "multiple_choice", domain: "numeracy", maxYear: 0, content: { stem: "How many stars are there? ⭐⭐⭐", answer: "3", options: ["2", "3", "4", "5"], explanation: "Count them: 1, 2, 3!", hint: "Point to each star and count." } },
  { id: "d2", type: "multiple_choice", domain: "numeracy", maxYear: 0, content: { stem: "What number comes after 4?", answer: "5", options: ["3", "4", "5", "6"], explanation: "When we count: 3, 4, 5 — so 5 comes after 4.", hint: "Try counting: 1, 2, 3, 4, ..." } },
  { id: "d3", type: "multiple_choice", domain: "numeracy", maxYear: 0, content: { stem: "Which group has more? Group A: 🍎🍎🍎 Group B: 🍎🍎🍎🍎🍎", answer: "Group B", options: ["Group A", "Group B", "They are the same", "I don't know"], explanation: "Group B has 5 apples, Group A has 3. 5 is more than 3.", hint: "Count the apples in each group." } },
  { id: "d4", type: "multiple_choice", domain: "numeracy", maxYear: 0, content: { stem: "What comes next? 🔵🔴🔵🔴🔵___", answer: "🔴", options: ["🔵", "🔴", "🟢", "🟡"], explanation: "The pattern goes blue, red, blue, red — so red comes next!", hint: "Look at the pattern: blue, red, blue, red..." } },
  { id: "d5", type: "multiple_choice", domain: "reading", maxYear: 0, content: { stem: "Kobi the koala climbed a big tree. He ate some leaves. Then he had a nap.\n\nWhat did Kobi do first?", answer: "Climbed a tree", options: ["Had a nap", "Climbed a tree", "Ate some leaves", "Went home"], explanation: "The story says Kobi climbed a tree first.", hint: "What happened at the very start?" } },
  { id: "d6", type: "multiple_choice", domain: "grammar_punctuation", maxYear: 0, content: { stem: "Which one starts with a capital letter?", answer: "The dog is big.", options: ["the dog is big.", "The dog is big.", "the Dog is big.", "THE DOG IS BIG."], explanation: "Sentences start with ONE capital letter: 'The dog is big.'", hint: "Only the first letter should be big." } },

  // YEAR 1 — Addition/subtraction to 10, counting to 20
  { id: "d7", type: "multiple_choice", domain: "numeracy", maxYear: 1, content: { stem: "What number comes after 7?", answer: "8", options: ["6", "7", "8", "9"], explanation: "The next number is 8.", hint: "Try counting: 5, 6, 7, ..." } },
  { id: "d8", type: "multiple_choice", domain: "numeracy", maxYear: 1, content: { stem: "What is 3 + 5?", answer: "8", options: ["7", "8", "9", "10"], explanation: "3 + 5 = 8.", hint: "Start at 3 and count on 5 more." } },
  { id: "d9", type: "multiple_choice", domain: "numeracy", maxYear: 1, content: { stem: "What is 9 - 4?", answer: "5", options: ["3", "4", "5", "6"], explanation: "9 - 4 = 5.", hint: "Start at 9 and count back 4." } },
  { id: "d10", type: "multiple_choice", domain: "numeracy", maxYear: 1, content: { stem: "Which two numbers make 10?", answer: "3 and 7", options: ["3 and 7", "4 and 5", "2 and 9", "6 and 3"], explanation: "3 + 7 = 10!", hint: "Think about pairs that add up to 10." } },
  { id: "d11", type: "multiple_choice", domain: "spelling", maxYear: 1, content: { stem: "Which word is 'cat'?", answer: "cat", options: ["kat", "cat", "cet", "kat"], explanation: "'Cat' starts with c-a-t.", hint: "Sound it out: c-a-t." } },

  // YEAR 2 — Numbers to 100, place value, simple multiplication concept
  { id: "d12", type: "multiple_choice", domain: "numeracy", maxYear: 2, content: { stem: "What is the value of the 4 in the number 47?", answer: "40", options: ["4", "40", "47", "7"], explanation: "The 4 is in the tens place, so it means 40.", hint: "The 4 is in the tens column." } },
  { id: "d13", type: "multiple_choice", domain: "numeracy", maxYear: 2, content: { stem: "There are 3 bags with 4 apples in each bag. How many apples altogether?", answer: "12", options: ["7", "10", "12", "14"], explanation: "3 groups of 4 = 12.", hint: "Count by fours: 4, 8, ..." } },
  { id: "d14", type: "multiple_choice", domain: "reading", maxYear: 2, content: { stem: "'The koala sat in the tall eucalyptus tree, munching on leaves.' Where was the koala?", answer: "In a eucalyptus tree", options: ["On the ground", "In a eucalyptus tree", "In a cave", "On a rock"], explanation: "The text says 'in the tall eucalyptus tree'.", hint: "Look for the words that tell you where." } },
  { id: "d15", type: "multiple_choice", domain: "spelling", maxYear: 2, content: { stem: "Which spelling is correct?", answer: "because", options: ["becuz", "becaus", "because", "becouse"], explanation: "'Because' is the correct spelling.", hint: "Sound it out: be-cause." } },
  { id: "d16", type: "multiple_choice", domain: "grammar_punctuation", maxYear: 2, content: { stem: "Which sentence uses capital letters and full stops correctly?", answer: "The cat sat on the mat.", options: ["the cat sat on the mat.", "The cat sat on the mat", "The cat sat on the mat.", "the Cat sat on the Mat."], explanation: "Start with a capital, end with a full stop.", hint: "Look for capital at start AND full stop at end." } },

  // YEAR 3 — Numbers to 1000, times tables, regrouping
  { id: "d17", type: "multiple_choice", domain: "numeracy", maxYear: 3, content: { stem: "What is 365 written in expanded form?", answer: "300 + 60 + 5", options: ["300 + 60 + 5", "3 + 6 + 5", "360 + 5", "30 + 65"], explanation: "365 = 300 + 60 + 5.", hint: "Break it into hundreds, tens, and ones." } },
  { id: "d18", type: "multiple_choice", domain: "numeracy", maxYear: 3, content: { stem: "What is 6 × 5?", answer: "30", options: ["25", "30", "35", "36"], explanation: "6 × 5 = 30.", hint: "Count by 5s six times." } },
  { id: "d19", type: "multiple_choice", domain: "reading", maxYear: 3, content: { stem: "'Lily looked at her empty lunchbox and sighed.' How was Lily feeling?", answer: "Disappointed or sad", options: ["Happy and excited", "Disappointed or sad", "Angry and annoyed", "Scared and worried"], explanation: "Sighing at an empty lunchbox suggests disappointment.", hint: "What would make someone sigh at an empty lunchbox?" } },
  { id: "d20", type: "multiple_choice", domain: "reading", maxYear: 3, content: { stem: "'The enormous waves crashed onto the shore.' What does 'enormous' mean?", answer: "Very big", options: ["Very small", "Very big", "Very fast", "Very quiet"], explanation: "'Enormous' means very big or huge.", hint: "Waves that crash are usually what size?" } },
  { id: "d21", type: "multiple_choice", domain: "spelling", maxYear: 3, content: { stem: "What is the correct way to add -ing to 'run'?", answer: "running", options: ["runing", "running", "runeing", "runnning"], explanation: "Double the consonant before -ing: running.", hint: "Do you need to double the last letter?" } },
  { id: "d22", type: "multiple_choice", domain: "grammar_punctuation", maxYear: 3, content: { stem: "Choose the correct past tense: 'Yesterday, I ___ to the park.'", answer: "walked", options: ["walk", "walked", "walking", "walks"], explanation: "'Yesterday' means past tense: walked.", hint: "'Yesterday' is a clue — it already happened." } },

  // YEAR 4+ — Larger numbers, fractions, multiplication
  { id: "d23", type: "multiple_choice", domain: "numeracy", maxYear: 4, content: { stem: "A farmer has 342 sheep. He sells 178. How many are left?", answer: "164", options: ["164", "174", "236", "264"], explanation: "342 - 178 = 164.", hint: "Start with the ones column: 2 - 8. You'll need to borrow." } },
  { id: "d24", type: "multiple_choice", domain: "numeracy", maxYear: 4, content: { stem: "What is 7 × 8?", answer: "56", options: ["48", "54", "56", "63"], explanation: "7 × 8 = 56.", hint: "Think: 7 × 8 is the same as 8 × 7." } },
  { id: "d25", type: "multiple_choice", domain: "numeracy", maxYear: 4, content: { stem: "Which fraction is the same as 1/2?", answer: "2/4", options: ["1/4", "2/4", "2/3", "3/4"], explanation: "1/2 = 2/4.", hint: "Try doubling the top and bottom of 1/2." } },
  { id: "d26", type: "multiple_choice", domain: "numeracy", maxYear: 7, content: { stem: "A school has 4 classes with 28 students each. How many students altogether?", answer: "112", options: ["96", "102", "112", "128"], explanation: "4 × 28 = 112.", hint: "Break it: 4 × 20 = 80, 4 × 8 = 32, then add." } },
  { id: "d27", type: "multiple_choice", domain: "spelling", maxYear: 4, content: { stem: "What is the plural of 'baby'?", answer: "babies", options: ["babys", "babyes", "babies", "babiez"], explanation: "Change y to i and add -es: babies.", hint: "What happens to the 'y' at the end?" } },
];

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

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
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

    if (sid && sessId) {
      setStudentId(sid);
      setSessionId(sessId);
      setStarted(true);
    } else if (name) {
      // Filter demo questions to the child's year level
      const filtered = ALL_DEMO_QUESTIONS.filter((q) => q.maxYear === yearLevel);
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
      setDemoMode(true);
      setCurrentQuestion(DEMO_QUESTIONS[questionIndex] ?? null);
    } finally {
      setLoading(false);
    }
  }, [studentId, sessionId, questionIndex]);

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
      setCorrectStreak((prev) => prev + 1);
    } else {
      setCorrectStreak(0);
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
    }, 1200);
  }

  // Fallback: no name in sessionStorage at all
  if (!started) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.span
            className="text-7xl block mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🦉
          </motion.span>
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
        <AdventureBackground />
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
          <p className="text-gray-500 mb-6">
            You finished all {totalAnswered} questions — well done!
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-left">
            <p className="text-xs font-medium text-gray-400 mb-3">👨‍👩‍👧 For parents:</p>
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
        <AdventureBackground />
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
  const totalQuestions = demoMode ? demoQuestions.length : 25;
  const progress = Math.min((questionIndex / totalQuestions) * 100, 100);

  return (
    <main className="min-h-screen pb-8">
      <AdventureBackground />
      {/* Progress bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--theme-primary)] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {questionIndex > 0 && questionIndex % 6 === 0 && (
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
        <AnimatePresence mode="wait">
          {currentQuestion && !showTransition && (
            <QuestionCard
              key={currentQuestion.id}
              question={{
                stem: currentQuestion.content.stem,
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

      {/* Calm transition animation — same for every answer, no right/wrong */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Gentle floating stars */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  x: (Math.cos((i / 8) * Math.PI * 2)) * 100,
                  y: (Math.sin((i / 8) * Math.PI * 2)) * 100 - 30,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.8],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Mascot reaction */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-6xl block"
                animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.6 }}
              >
                🦉
              </motion.span>
              <motion.p
                className="font-display text-lg font-semibold text-[var(--theme-primary)] mt-2 drop-shadow-sm"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {["Nice!", "Let's keep going!", "Awesome!", "You're doing great!", "Good one!", "Keep it up!"][questionIndex % 6]}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
