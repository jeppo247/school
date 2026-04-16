"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface QuestionCardProps {
  question: {
    stem: string;
    options?: string[];
    type: "multiple_choice" | "numeric_input" | "true_false";
    hint?: string;
    imageUrl?: string;
  };
  onAnswer: (answer: string | number) => void;
  disabled?: boolean;
  feedback?: {
    isCorrect: boolean;
    explanation?: string;
  } | null;
}

export function QuestionCard({
  question,
  onAnswer,
  disabled = false,
  feedback,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [numericInput, setNumericInput] = useState("");
  const [showHint, setShowHint] = useState(false);

  function handleOptionClick(option: string) {
    if (disabled) return;
    setSelected(option);
    onAnswer(option);
  }

  function handleNumericSubmit() {
    if (disabled || !numericInput) return;
    onAnswer(Number(numericInput));
  }

  return (
    <motion.div
      className="card max-w-2xl mx-auto"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      {/* Question stem */}
      <h2 className="font-display text-xl font-semibold text-gray-800 mb-6 text-center">
        {question.stem}
      </h2>

      {/* Image if present */}
      {question.imageUrl && (
        <div className="flex justify-center mb-6">
          <img
            src={question.imageUrl}
            alt="Question illustration"
            className="max-h-48 rounded-xl"
          />
        </div>
      )}

      {/* Answer options */}
      {question.type === "multiple_choice" && question.options && (
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selected === option;
            const showResult = feedback && isSelected;

            return (
              <motion.button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={disabled}
                className={`
                  p-4 rounded-xl text-lg font-medium text-center transition-all
                  ${
                    showResult
                      ? feedback.isCorrect
                        ? "bg-green-100 border-2 border-green-500 text-green-700"
                        : "bg-red-100 border-2 border-red-500 text-red-700"
                      : isSelected
                        ? "bg-[var(--theme-primary)] text-white border-2 border-[var(--theme-primary)]"
                        : "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-[var(--theme-primary)] hover:bg-blue-50"
                  }
                  ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-95"}
                `}
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Numeric input */}
      {question.type === "numeric_input" && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="number"
            value={numericInput}
            onChange={(e) => setNumericInput(e.target.value)}
            disabled={disabled}
            className="w-48 text-center text-3xl font-display font-bold p-4 rounded-xl border-2 border-gray-200 focus:border-[var(--theme-primary)] focus:outline-none"
            placeholder="?"
            onKeyDown={(e) => e.key === "Enter" && handleNumericSubmit()}
          />
          <motion.button
            onClick={handleNumericSubmit}
            disabled={disabled || !numericInput}
            className="btn-primary disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Answer
          </motion.button>
        </div>
      )}

      {/* True/False */}
      {question.type === "true_false" && (
        <div className="flex gap-4 justify-center">
          {["True", "False"].map((option) => {
            const isSelected = selected === option;
            const showResult = feedback && isSelected;

            return (
              <motion.button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={disabled}
                className={`
                  px-12 py-4 rounded-xl text-xl font-bold transition-all
                  ${
                    showResult
                      ? feedback.isCorrect
                        ? "bg-green-100 border-2 border-green-500 text-green-700"
                        : "bg-red-100 border-2 border-red-500 text-red-700"
                      : isSelected
                        ? "bg-[var(--theme-primary)] text-white border-2 border-[var(--theme-primary)]"
                        : "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-[var(--theme-primary)]"
                  }
                  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                whileHover={!disabled ? { scale: 1.05 } : undefined}
                whileTap={!disabled ? { scale: 0.95 } : undefined}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-4 rounded-xl text-center ${
              feedback.isCorrect
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <p className="font-display font-semibold">
              {feedback.isCorrect ? "Correct! ✓" : "Not quite — keep trying!"}
            </p>
            {feedback.explanation && (
              <p className="text-sm mt-1">{feedback.explanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {question.hint && !feedback && (
        <div className="mt-4 text-center">
          {showHint ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg"
            >
              💡 {question.hint}
            </motion.p>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-[var(--theme-primary)] hover:underline"
            >
              Need a hint?
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
