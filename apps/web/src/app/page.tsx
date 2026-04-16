"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-2xl"
      >
        <motion.h1
          className="font-display text-6xl font-bold text-[var(--theme-primary)] mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upwise
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-2 font-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Learn Smarter. Fill the Gaps.
        </motion.p>

        <motion.p
          className="text-base text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          AI-powered adaptive learning for Australian primary students.
          <br />
          Aligned to the Australian Curriculum. Guided by parents.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/sign-up" className="btn-primary text-lg">
            Get Started
          </Link>
          <Link href="/sign-in" className="btn-secondary text-lg">
            Sign In
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
