"use client";

import { motion } from "framer-motion";

interface StreakCounterProps {
  count: number;
}

export function StreakCounter({ count }: StreakCounterProps) {
  const intensity = Math.min(count / 10, 1);
  const flameScale = 1 + intensity * 0.3;

  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200"
      animate={{
        scale: count > 0 ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <motion.span
        className="text-2xl"
        animate={{
          scale: [flameScale, flameScale * 1.1, flameScale],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🔥
      </motion.span>
      <div>
        <p className="font-display font-bold text-orange-600 text-lg leading-tight">
          {count}
        </p>
        <p className="text-xs text-orange-400">
          {count === 1 ? "day" : "days"} streak
        </p>
      </div>
    </motion.div>
  );
}
