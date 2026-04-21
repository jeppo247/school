"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProgressRing } from "@/components/student/ProgressRing";
import { StreakCounter } from "@/components/student/StreakCounter";
import { XPBar } from "@/components/student/XPBar";
import { CoinCounter } from "@/components/student/CoinCounter";
import { AdventureBackground } from "@/components/student/AdventureBackground";

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
    <main className="min-h-screen pb-24 md:ml-[220px]">
      <AdventureBackground />
      {/* Header bar */}
      <header className="sticky top-0 z-30 bg-[#F5F7FF]/90 backdrop-blur-md border-b border-[#E0E7EF] px-6 py-3">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--theme-primary)]/10 flex items-center justify-center">
              <span className="text-lg">🦉</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-800 text-sm md:text-base">
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

      <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto px-6 pt-8 lg:pt-12">
        {/* Desktop two-column grid wrapper */}
        <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-8 lg:mb-12">
        {/* Mascot + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 lg:p-12 border border-[#E8E2D8] text-center mb-8 lg:mb-0"
          style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%)", boxShadow: "rgba(0,0,0,0.1) 0px 2px 4px, rgba(0,0,0,0.04) 0px -1px 1px inset, 0 8px 32px rgba(79, 140, 247, 0.1)" }}
        >
          {/* Mascot */}
          <motion.div
            className="text-7xl lg:text-9xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🦉
          </motion.div>

          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
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
              className="inline-flex items-center gap-3 bg-[var(--theme-primary)] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg shadow-[var(--theme-primary)]/20 hover:opacity-95 transition-all lg:w-full lg:py-6 lg:text-2xl lg:justify-center"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {mockStudent.diagnosticCompleted ? "Start Today's Session" : "Start Diagnostic"}
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 mb-8 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#EFF6FF] rounded-3xl p-4 lg:p-6 border border-[#E8E2D8] flex flex-col items-center min-h-[160px] justify-center shadow-clay"
          >
            <ProgressRing
              progress={(mockStudent.weeklySessionsCompleted / mockStudent.weeklySessionsTarget) * 100}
              size={100}
              strokeWidth={10}
              label="This week"
              color="var(--theme-primary)"
            />
          </motion.div>

          <Link href="/profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-4 lg:p-6 border border-[#E8E2D8] flex flex-col items-center justify-center gap-2 shadow-clay hover:shadow-clay-hover hover:-rotate-2 hover:-translate-y-0.5 transition-all cursor-pointer h-full"
            >
              <span className="text-3xl lg:text-5xl">🏆</span>
              <span className="text-xs font-medium text-gray-500">Rewards</span>
            </motion.div>
          </Link>

          <Link href="/profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-4 lg:p-6 border border-[#E8E2D8] flex flex-col items-center justify-center gap-2 shadow-clay hover:shadow-clay-hover hover:-rotate-2 hover:-translate-y-0.5 transition-all cursor-pointer h-full"
            >
              <span className="text-3xl">🎨</span>
              <span className="text-xs font-medium text-gray-500">Theme</span>
            </motion.div>
          </Link>
        </div>
        </div>{/* end desktop two-column grid */}
      </div>

      {/* Sidebar nav — visible md+ */}
      <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:w-[220px] md:h-full border-r border-[#E0E7EF] py-8 px-4 z-40" style={{ background: "linear-gradient(180deg, #EEF2FF 0%, #F5F7FF 100%)" }}>
        <div className="mb-8">
          <span className="font-display font-bold text-lg text-gray-800">Upwise</span>
        </div>
        <nav className="flex flex-col gap-2">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: true },
            { icon: "🗺️", label: "My Map", href: "/dashboard", active: false },
            { icon: "🏆", label: "Rewards", href: "/profile", active: false },
            { icon: "👤", label: "Me", href: "/profile", active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                item.active
                  ? "text-[var(--theme-primary)] bg-[var(--theme-primary)]/10"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--theme-surface)] border-t border-gray-100 px-6 py-3 z-30 md:hidden">
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
