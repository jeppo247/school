"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { IconBadge } from "@/components/ui/AppIcon";

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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        ?? (typeof window !== "undefined" && !window.location.hostname.includes("localhost")
          ? "https://upwiseserver-production.up.railway.app/api/v1"
          : "http://localhost:4000/api/v1");

      const res = await fetch(`${apiUrl}/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          source,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(`${res.status}: ${data.error?.message ?? res.statusText} [${apiUrl}]`);
      }

      setModalState("success");
    } catch (err) {
      setModalState("error");
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`${msg}`);
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
              <div className="text-center py-10 relative">
                {/* Full-screen confetti explosion */}
                <div className="fixed inset-0 pointer-events-none z-[200]">
                  {Array.from({ length: 80 }, (_, i) => (
                    <motion.span
                      key={i}
                      className="absolute h-3 w-3 rounded-full"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: `${30 + Math.random() * 30}%`,
                        backgroundColor: ["#4F8CF7", "#34D399", "#FBBF24", "#A78BFA", "#FB923C"][i % 5],
                      }}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [1, 1, 1, 0],
                        scale: [0, 1.5, 1],
                        x: (Math.cos((i / 80) * Math.PI * 2 + Math.random() * 2) * (200 + Math.random() * 300)),
                        y: (Math.sin((i / 80) * Math.PI * 2 + Math.random() * 2) * (200 + Math.random() * 300)),
                        rotate: [0, Math.random() * 720 - 360],
                      }}
                      transition={{
                        duration: 2.5,
                        delay: i * 0.015,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  className="mb-6 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.6, 1] }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                >
                  <IconBadge name="party" className="h-24 w-24 bg-blue-50 text-[#4F8CF7]" iconClassName="h-12 w-12" />
                </motion.div>
                <motion.h2
                  className="font-display text-3xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Thank you!
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-500 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  We will be in contact shortly when your free trial is available.
                </motion.p>
                <motion.button
                  onClick={onClose}
                  className="mt-8 bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.98] text-white font-semibold px-10 py-3.5 rounded-xl transition-all text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Close
                </motion.button>
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
