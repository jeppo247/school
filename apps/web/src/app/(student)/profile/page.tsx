"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { THEMES } from "@/lib/themes";
import { XPBar } from "@/components/student/XPBar";
import { StreakCounter } from "@/components/student/StreakCounter";
import { CoinCounter } from "@/components/student/CoinCounter";

export default function ProfilePage() {
  const [selectedTheme, setSelectedTheme] = useState("default");

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] pb-24 md:ml-[220px]">
      <header className="px-6 py-6">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
        </div>
      </header>

      <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto px-6 space-y-6">
        {/* Avatar + Stats */}
        <div className="bg-[var(--theme-surface)] rounded-3xl p-6 border border-gray-100 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--theme-primary)]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl lg:text-6xl">🦉</span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800 mb-1">Indigo</h2>
          <p className="text-base text-gray-400 mb-4">Year 3</p>

          <div className="flex justify-center gap-6">
            <StreakCounter count={7} />
            <CoinCounter balance={142} />
          </div>

          <div className="mt-4 max-w-xs mx-auto">
            <XPBar currentXP={120} levelXP={200} level={5} />
          </div>
        </div>

        {/* Theme Picker */}
        <div className="bg-[var(--theme-surface)] rounded-3xl p-6 border border-gray-100">
          <h3 className="font-display text-lg font-bold text-gray-800 mb-4">Choose Your Theme</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.values(THEMES).map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedTheme === theme.id
                    ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/5"
                    : "border-gray-100 hover:border-gray-200"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-lg">{theme.emoji}</span>
                </div>
                <p className="font-display font-semibold text-base text-gray-800">
                  {theme.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{theme.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-[var(--theme-surface)] rounded-3xl p-6 border border-gray-100">
          <h3 className="font-display text-lg font-bold text-gray-800 mb-4">My Interests</h3>
          <div className="flex flex-wrap gap-2">
            {["AFL", "Animals", "Space", "Cooking", "Music", "Art", "Gaming", "Nature"].map((interest) => (
              <button
                key={interest}
                className="px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gray-100 text-sm md:text-base font-medium text-gray-600 hover:bg-[var(--theme-primary)]/10 hover:text-[var(--theme-primary)] transition-colors"
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--theme-surface)] border-t border-gray-100 px-6 py-3 z-30 md:hidden">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto flex items-center justify-around">
          {[
            { icon: "🏠", label: "Home", href: "/dashboard", active: false },
            { icon: "🗺️", label: "My Map", href: "/dashboard", active: false },
            { icon: "🏆", label: "Rewards", href: "/profile", active: false },
            { icon: "👤", label: "Me", href: "/profile", active: true },
          ].map((tab) => (
            <a
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl ${
                tab.active ? "text-[var(--theme-primary)]" : "text-gray-400"
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="text-[10px] font-medium font-display">{tab.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}
