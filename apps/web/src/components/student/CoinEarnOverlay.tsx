"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { CoinReward } from "@upwise/shared";

interface CoinEarnOverlayProps {
  rewards: CoinReward[];
  onComplete?: () => void;
}

export function CoinEarnOverlay({ rewards, onComplete }: CoinEarnOverlayProps) {
  const [visible, setVisible] = useState(rewards.length > 0);
  const totalCoins = rewards.reduce((sum, r) => sum + r.amount, 0);

  useEffect(() => {
    if (rewards.length === 0) return;
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [rewards, onComplete]);

  if (totalCoins === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Gold particles */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                scale: [0, 1.5, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.3,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Spinning coin */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotateY: 0 }}
            animate={{ scale: [0, 1.3, 1], rotateY: [0, 720] }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-2xl border-4 border-yellow-500">
              <span className="text-4xl font-bold text-yellow-800">$</span>
            </div>
          </motion.div>

          {/* Total coins earned */}
          <motion.div
            className="absolute mt-36 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-display text-3xl font-bold text-amber-600 drop-shadow-lg">
              +{totalCoins} coins!
            </p>

            {/* Reward breakdown */}
            <div className="mt-2 space-y-1">
              {rewards.map((reward, i) => (
                <motion.p
                  key={i}
                  className="text-sm text-amber-500 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                >
                  {reward.label} +{reward.amount}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
