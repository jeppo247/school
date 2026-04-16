"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProgressRing } from "@/components/student/ProgressRing";
import { StreakCounter } from "@/components/student/StreakCounter";
import { XPBar } from "@/components/student/XPBar";
import { CoinCounter } from "@/components/student/CoinCounter";

// Mock data — will be replaced with API calls
const mockStudent = {
  name: "Indigo",
  level: 5,
  xpInLevel: 120,
  xpForLevel: 200,
  currentStreak: 7,
  coinBalance: 142,
  themeId: "default",
  diagnosticCompleted: true,
  weeklySessionsCompleted: 3,
  weeklySessionsTarget: 5,
};

export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-[var(--theme-bg)] pb-24">
      {/* Header bar */}
      <header className="sticky top-0 z-30 bg-[var(--theme-surface)]/90 backdrop-blur-md border-b border-gray-100 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--theme-primary)]/10 flex items-center justify-center">
              <span className="text-lg">🦉</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-800 text-sm">
                Hi, {mockStudent.name}!
              </p>
              <XPBar
                currentXP={mockStudent.xpInLevel}
                levelXP={mockStudent.xpForLevel}
                level={mockStudent.level}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreakCounter count={mockStudent.currentStreak} />
            <CoinCounter balance={mockStudent.coinBalance} />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 pt-8">
        {/* Mascot + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--theme-surface)] rounded-3xl p-8 shadow-sm border border-gray-100 text-center mb-8"
        >
          {/* Mascot */}
          <motion.div
            className="text-7xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🦉
          </motion.div>

          <h1 className="font-display text-2xl font-bold text-gray-800 mb-2">
            Ready for today&apos;s adventure?
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {mockStudent.diagnosticCompleted
              ? "Your learning path is ready. Let's go!"
              : "Let's find out what you already know!"}
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={mockStudent.diagnosticCompleted ? "/session" : "/diagnostic"}
              className="inline-flex items-center gap-3 bg-[var(--theme-primary)] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg shadow-[var(--theme-primary)]/20 hover:opacity-95 transition-all"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {mockStudent.diagnosticCompleted ? "Start Today's Session" : "Start Diagnostic"}
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--theme-surface)] rounded-2xl p-4 border border-gray-100 flex flex-col items-center"
          >
            <ProgressRing
              progress={(mockStudent.weeklySessionsCompleted / mockStudent.weeklySessionsTarget) * 100}
              size={80}
              strokeWidth={8}
              label="This week"
              color="var(--theme-primary)"
            />
          </motion.div>

          <Link href="/profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--theme-surface)] rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer h-full"
            >
              <span className="text-3xl">🏆</span>
              <span className="text-xs font-medium text-gray-500">Rewards</span>
            </motion.div>
          </Link>

          <Link href="/profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--theme-surface)] rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow cursor-pointer h-full"
            >
              <span className="text-3xl">🎨</span>
              <span className="text-xs font-medium text-gray-500">Theme</span>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--theme-surface)] border-t border-gray-100 px-6 py-3 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: true },
            { icon: "🗺️", label: "My Map", href: "/dashboard", active: false },
            { icon: "🏆", label: "Rewards", href: "/profile", active: false },
            { icon: "👤", label: "Me", href: "/profile", active: false },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                tab.active
                  ? "text-[var(--theme-primary)]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
