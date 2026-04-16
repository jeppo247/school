"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface CoinCounterProps {
  balance: number;
  onOpenShop?: () => void;
}

export function CoinCounter({ balance, onOpenShop }: CoinCounterProps) {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    if (balance !== displayBalance) {
      const diff = balance - displayBalance;
      setDelta(diff);

      // Animate counting up/down
      const steps = 15;
      const increment = diff / steps;
      let current = displayBalance;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current += increment;
        setDisplayBalance(step === steps ? balance : Math.round(current));
        if (step >= steps) {
          clearInterval(interval);
          setTimeout(() => setDelta(null), 1000);
        }
      }, 40);

      return () => clearInterval(interval);
    }
  }, [balance, displayBalance]);

  return (
    <motion.button
      onClick={onOpenShop}
      className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Gold coin icon */}
      <motion.div
        className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-sm border border-yellow-500"
        animate={delta && delta > 0 ? { rotate: [0, 360] } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs font-bold text-yellow-800">$</span>
      </motion.div>

      {/* Balance */}
      <span className="font-display font-bold text-amber-700 text-lg tabular-nums">
        {displayBalance}
      </span>

      {/* Floating delta */}
      <AnimatePresence>
        {delta !== null && delta !== 0 && (
          <motion.span
            className={`absolute -top-4 right-0 font-display font-bold text-sm ${
              delta > 0 ? "text-green-500" : "text-red-400"
            }`}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {delta > 0 ? "+" : ""}{delta}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
