"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
}

export function XPBar({ currentXP, levelXP, level }: XPBarProps) {
  const progress = (currentXP / levelXP) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--theme-primary)] text-white font-display font-bold text-sm">
        {level}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="font-medium">{currentXP} XP</span>
          <span>{levelXP} XP</span>
        </div>
        <div className="h-2.5 bg-[#E0E7F4] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
