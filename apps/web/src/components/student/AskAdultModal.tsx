"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AskAdultModalProps {
  open: boolean;
  onClose: () => void;
  onSaveForLater?: () => void;
  onExit?: () => void;
}

export function AskAdultButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      aria-label="Ask an adult for help"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span className="hidden sm:inline">Ask an adult</span>
    </button>
  );
}

export function AskAdultModal({ open, onClose, onSaveForLater, onExit }: AskAdultModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-[var(--border-warm)]"
            style={{ boxShadow: "var(--shadow-clay)" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="text-5xl mb-4">
              <svg className="w-16 h-16 mx-auto text-[var(--theme-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <h2 className="font-display text-xl font-bold text-gray-800 mb-2">
              Show this to your parent or carer
            </h2>
            <p className="text-base text-gray-500 mb-6">
              It&apos;s okay to ask for help! Your progress has been saved.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="btn-primary w-full text-base"
              >
                Continue learning
              </button>

              {onSaveForLater && (
                <button
                  onClick={onSaveForLater}
                  className="btn-secondary w-full text-base"
                >
                  Save for later
                </button>
              )}

              {onExit && (
                <button
                  onClick={onExit}
                  className="w-full py-3 px-6 rounded-2xl text-base font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Go home
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
