"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

type ModalState = "form" | "loading" | "success" | "error";

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [modalState, setModalState] = useState<ModalState>("form");
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = useCallback(() => {
    setEmail("");
    setName("");
    setModalState("form");
    setErrorMessage("");
  }, []);

  useEffect(() => {
    if (!open) {
      // Delay reset so exit animation completes
      const timeout = setTimeout(resetForm, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, resetForm]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setModalState("loading");
    setErrorMessage("");

    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("ref") ?? undefined;

      await api.post("/waitlist", {
        email: email.trim(),
        name: name.trim() || undefined,
        source,
      });

      setModalState("success");
    } catch (err) {
      setModalState("error");
      setErrorMessage("Something went wrong. Please try again shortly.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-clay border border-[#E8E2D8] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {modalState === "success" ? (
              <div className="text-center py-6 relative overflow-hidden">
                {/* Confetti explosion */}
                {Array.from({ length: 40 }, (_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl pointer-events-none"
                    style={{ left: "50%", top: "40%" }}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [1, 1, 0],
                      scale: [0, 1.2, 0.8],
                      x: (Math.cos((i / 40) * Math.PI * 2 + Math.random()) * (120 + Math.random() * 80)),
                      y: (Math.sin((i / 40) * Math.PI * 2 + Math.random()) * (100 + Math.random() * 60)),
                      rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.02,
                      ease: "easeOut",
                    }}
                  >
                    {["🎉", "🎊", "✨", "⭐", "🌟", "💫", "🥳", "🎈"][i % 8]}
                  </motion.span>
                ))}

                <motion.span
                  className="text-7xl block mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  🎉
                </motion.span>
                <motion.h2
                  className="font-display text-2xl font-bold text-gray-900 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Thank you!
                </motion.h2>
                <motion.p
                  className="text-gray-500 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  We will be in contact shortly when your free trial is available.
                </motion.p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                  Join the waitlist
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Be first to know when Upwise launches. We&apos;ll send you a
                  free trial link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CF7]/30 focus:border-[#4F8CF7] transition-all"
                      disabled={modalState === "loading"}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CF7]/30 focus:border-[#4F8CF7] transition-all"
                      disabled={modalState === "loading"}
                    />
                  </div>

                  {modalState === "error" && errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={modalState === "loading"}
                    className="w-full bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {modalState === "loading" ? (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
