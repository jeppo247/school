"use client";

import { motion } from "framer-motion";
import { AppIcon } from "@/components/ui/AppIcon";

interface StreakCounterProps {
  count: number;
}

export function StreakCounter({ count }: StreakCounterProps) {
  const intensity = Math.min(count / 10, 1);
  const flameScale = 1 + intensity * 0.3;

  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF8E1] border border-amber-200"
      animate={{
        scale: count > 0 ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      <motion.span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600"
        animate={{
          scale: [flameScale, flameScale * 1.1, flameScale],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AppIcon name="flame" className="h-4 w-4" />
      </motion.span>
      <div>
        <p className="font-display font-bold text-orange-600 text-lg md:text-xl leading-tight">
          {count}
        </p>
        <p className="text-xs text-orange-400">
          {count === 1 ? "day" : "days"} streak
        </p>
      </div>
    </motion.div>
  );
}
