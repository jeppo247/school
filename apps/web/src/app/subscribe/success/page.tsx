"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SubscribeSuccess() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.span
          className="text-7xl block mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.6 }}
        >
          🎉
        </motion.span>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
          You&apos;re all set!
        </h1>
        <p className="text-gray-500 mb-8">
          Your subscription is active. Your child&apos;s personalised learning
          path is ready to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#4F8CF7] text-white font-semibold py-4 rounded-xl text-center hover:bg-[#3A6CD4] transition-all"
          >
            Start Learning
          </Link>
          <Link
            href="/parent-dashboard"
            className="flex-1 bg-white text-gray-700 font-semibold py-4 rounded-xl border border-gray-200 text-center hover:bg-gray-50 transition-all"
          >
            Parent Dashboard
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
