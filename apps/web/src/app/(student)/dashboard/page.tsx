"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ProgressRing } from "@/components/student/ProgressRing";
import { StreakCounter } from "@/components/student/StreakCounter";
import { XPBar } from "@/components/student/XPBar";
import { CoinCounter } from "@/components/student/CoinCounter";
import { AdventureBackground } from "@/components/student/AdventureBackground";
import { AppIcon, BrandMark, IconBadge, type AppIconName } from "@/components/ui/AppIcon";
import { api } from "@/lib/api";

interface StudentData {
  id: string;
  name: string;
  yearLevel: number;
  level: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  currentStreak: number;
  coinBalance: number;
  themeId: string;
  diagnosticCompleted: boolean;
  rewardsMode: string;
  sessionsThisWeek: number;
  masteryPercentage: number;
}

const NAV_ITEMS: { icon: AppIconName; label: string; href: string; active: boolean }[] = [
  { icon: "home", label: "Home", href: "/dashboard", active: true },
  { icon: "map", label: "My Map", href: "/dashboard", active: false },
  { icon: "trophy", label: "Rewards", href: "/profile", active: false },
  { icon: "user", label: "Me", href: "/profile", active: false },
];

export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewardsMode, setRewardsMode] = useState("full");

  useEffect(() => {
    const studentId = sessionStorage.getItem("upwise_student_id");
    if (!studentId) {
      setError("No student session found.");
      setLoading(false);
      return;
    }
    api.get<StudentData>(`/students/${studentId}`)
      .then((data) => {
        setStudent(data);
        setRewardsMode(data.rewardsMode ?? "full");
      })
      .catch(() => setError("Could not load your data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const showCoins = rewardsMode === "full";

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <AdventureBackground calm />
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <BrandMark className="h-16 w-16" />
        </motion.div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <IconBadge name="alert" className="mb-4 h-16 w-16 bg-red-50 text-red-500" iconClassName="h-8 w-8" />
        <p className="font-display text-xl text-gray-700 mb-4">{error ?? "Something went wrong."}</p>
        <a href="/start" className="inline-block bg-[var(--theme-primary)] text-white font-display font-bold px-8 py-3 rounded-2xl">Start Again</a>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 md:ml-[220px]">
      <AdventureBackground />
      {/* Header bar */}
      <header className="sticky top-0 z-30 bg-[#F5F7FF]/95 backdrop-blur-md border-b border-[var(--border-warm)] px-6 py-3" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)" }}>
        <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <div>
              <p className="font-display font-bold text-gray-800 text-sm md:text-base">
                Hi, {student.name}!
              </p>
              <XPBar
                currentXP={student.xpInCurrentLevel}
                levelXP={student.xpForNextLevel}
                level={student.level}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreakCounter count={student.currentStreak} />
            {showCoins && <CoinCounter balance={student.coinBalance} />}
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
            className="mb-4 flex justify-center"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <BrandMark className="h-24 w-24 lg:h-32 lg:w-32" />
          </motion.div>

          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Ready for today&apos;s adventure?
          </h1>
          <p className="text-gray-500 text-base mb-6">
            {student.diagnosticCompleted
              ? "Your learning path is ready. Let's go!"
              : "Let's find out what you already know!"}
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={student.diagnosticCompleted ? "/session" : "/diagnostic"}
              className="inline-flex items-center gap-3 bg-[var(--theme-primary)] text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-lg shadow-[var(--theme-primary)]/20 hover:opacity-95 transition-all lg:w-full lg:py-6 lg:text-2xl lg:justify-center"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {student.diagnosticCompleted ? "Start Today's Session" : "Start Diagnostic"}
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
              progress={(student.sessionsThisWeek / 5) * 100}
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
              <IconBadge name="trophy" className="h-14 w-14 lg:h-16 lg:w-16" iconClassName="h-7 w-7 lg:h-8 lg:w-8" />
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
              <IconBadge name="palette" className="h-14 w-14 lg:h-16 lg:w-16" iconClassName="h-7 w-7 lg:h-8 lg:w-8" />
              <span className="text-xs font-medium text-gray-500">Theme</span>
            </motion.div>
          </Link>
        </div>
        </div>{/* end desktop two-column grid */}
      </div>

      {/* Sidebar nav — visible md+ */}
      <aside className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:w-[220px] md:h-full border-r border-[var(--border-warm)] py-8 px-4 z-40" style={{ background: "linear-gradient(180deg, rgba(245,247,255,0.95) 0%, rgba(240,243,255,0.95) 100%)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "2px 0 8px rgba(0,0,0,0.06), 1px 0 2px rgba(0,0,0,0.03)" }}>
        <div className="mb-8">
          <span className="font-display font-bold text-lg text-gray-800">Upwise</span>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                item.active
                  ? "text-[var(--theme-primary)] bg-[var(--theme-primary)]/10"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <AppIcon name={item.icon} className="h-5 w-5" />
              <span className="text-sm font-medium font-display">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--theme-surface)]/95 backdrop-blur-md border-t border-[var(--border-warm-light)] px-6 py-3 z-30 md:hidden" style={{ boxShadow: "0 -1px 3px rgba(0,0,0,0.03)" }}>
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {NAV_ITEMS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                tab.active
                  ? "text-[var(--theme-primary)]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <AppIcon name={tab.icon} className="h-6 w-6" />
              <span className="text-[10px] font-medium font-display">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
