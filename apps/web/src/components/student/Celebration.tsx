"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

const CELEBRATION_COLORS = [
  "#4F8CF7",
  "#34D399",
  "#FBBF24",
  "#A78BFA",
  "#FB923C",
  "#F87171",
  "#38BDF8",
];

const COIN_COLORS = [
  "#FCD34D",
  "#F59E0B",
  "#D97706",
  "#FBBF24",
  "#FDE68A",
];

interface CelebrationProps {
  trigger: boolean;
  type?: "correct" | "streak" | "levelUp" | "mastery" | "coinEarn";
  onComplete?: () => void;
}

export function Celebration({
  trigger,
  type = "correct",
  onComplete,
}: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [message, setMessage] = useState<string>("");

  const generateParticles = useCallback((count: number, colors: string[] = CELEBRATION_COLORS): Particle[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 4,
      rotation: Math.random() * 360,
    }));
  }, []);

  useEffect(() => {
    if (!trigger) return;

    const messages: Record<string, string[]> = {
      correct: ["Nice one!", "Awesome!", "You got it!", "Brilliant!", "Spot on!"],
      streak: ["On fire!", "Unstoppable!", "Keep going!", "Legend!"],
      levelUp: ["LEVEL UP!", "You're amazing!", "New level unlocked!"],
      mastery: ["MASTERED!", "You nailed it!", "Skill complete!"],
      coinEarn: ["Ka-ching!", "Coins earned!", "Nice haul!", "Cha-ching!"],
    };

    const particleCounts: Record<string, number> = {
      correct: 15,
      streak: 25,
      levelUp: 40,
      mastery: 40,
      coinEarn: 30,
    };
    const particleCount = particleCounts[type] ?? 15;
    const colors = type === "coinEarn" ? COIN_COLORS : CELEBRATION_COLORS;
    setParticles(generateParticles(particleCount, colors));

    const msgs = messages[type];
    setMessage(msgs[Math.floor(Math.random() * msgs.length)]);

    const timer = setTimeout(() => {
      setParticles([]);
      setMessage("");
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [trigger, type, onComplete, generateParticles]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
              }}
              initial={{
                top: "50%",
                opacity: 1,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                top: `${particle.y}%`,
                opacity: 0,
                scale: [0, 1.5, 1],
                rotate: particle.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Message */}
          {message && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "backOut" }}
            >
              <span className="font-display text-4xl font-bold text-[var(--theme-primary)] drop-shadow-lg">
                {message}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
