"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Mock data — replaced by API
const mockChild = {
  id: "1",
  name: "Indigo",
  yearLevel: 3,
  currentStreak: 7,
  sessionsThisWeek: 4,
  recentAccuracy: 81,
  coinBalance: 142,
  diagnosticCompleted: true,
  domainProficiencies: [
    { domain: "numeracy", projectedProficiency: "strong", theta: 0.8, thetaSe: 0.4 },
    { domain: "reading", projectedProficiency: "developing", theta: -0.2, thetaSe: 0.6 },
    { domain: "spelling", projectedProficiency: "strong", theta: 0.5, thetaSe: 0.5 },
    { domain: "grammar_punctuation", projectedProficiency: "developing", theta: 0.1, thetaSe: 0.7 },
    { domain: "writing", projectedProficiency: "developing", theta: -0.1, thetaSe: 0.8 },
  ],
  topMisconceptions: [
    { misconceptionCode: "forgets_regrouping", description: "Forgetting to carry or borrow when adding or subtracting", count: 5 },
    { misconceptionCode: "comma_splice", description: "Joining two complete sentences with only a comma", count: 3 },
  ],
};

const PROFICIENCY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  exceeding: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Exceeding" },
  strong: { bg: "bg-blue-100", text: "text-blue-700", label: "Strong" },
  developing: { bg: "bg-amber-100", text: "text-amber-700", label: "Developing" },
  needs_additional_support: { bg: "bg-red-100", text: "text-red-700", label: "Needs Support" },
};

const DOMAIN_LABELS: Record<string, string> = {
  numeracy: "Numeracy",
  reading: "Reading",
  spelling: "Spelling",
  grammar_punctuation: "Grammar & Punctuation",
  writing: "Writing",
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

export default function ParentDashboard() {
  const child = mockChild;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-bold text-[#4F8CF7]">Upwise</span>
          <div className="flex items-center gap-4">
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">
              <option>{child.name} (Year {child.yearLevel})</option>
            </select>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
              P
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-[#1A1A2E] mb-6"
        >
          {child.name}&apos;s Dashboard
        </motion.h1>

        {/* Top stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "This Week", value: `${child.sessionsThisWeek}/5`, sub: "sessions", color: "text-[#4F8CF7]" },
            { label: "Accuracy", value: `${child.recentAccuracy}%`, sub: "last 7 days", color: "text-emerald-600" },
            { label: "Streak", value: `🔥 ${child.currentStreak}`, sub: "days", color: "text-orange-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-xl p-5 border border-gray-100"
            >
              <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Domain proficiencies */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-100 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">NAPLAN Domain Projections</h2>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              Unofficial practice estimate
            </span>
          </div>

          <div className="space-y-3">
            {child.domainProficiencies.map((domain) => {
              const prof = PROFICIENCY_COLORS[domain.projectedProficiency] ?? PROFICIENCY_COLORS.developing;
              return (
                <div key={domain.domain} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700 w-48">
                    {DOMAIN_LABELS[domain.domain]}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          domain.projectedProficiency === "exceeding" ? "bg-emerald-400" :
                          domain.projectedProficiency === "strong" ? "bg-blue-400" :
                          domain.projectedProficiency === "developing" ? "bg-amber-400" : "bg-red-300"
                        }`}
                        style={{ width: `${Math.max(10, ((domain.theta + 3) / 6) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${prof.bg} ${prof.text}`}>
                    {prof.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Briefing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <span>📋</span>
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Today&apos;s Briefing</h2>
              <span className="text-[10px] text-[#4F8CF7] bg-blue-50 px-2 py-0.5 rounded-full font-medium ml-auto">
                New
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Today <strong>{child.name}</strong> is working on <strong>3-digit subtraction with regrouping</strong>.
              She&apos;s been getting about 72% correct, so the system will start with simpler problems to rebuild confidence.
            </p>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <p className="text-xs font-medium text-amber-700 mb-1">💡 If she gets stuck:</p>
              <p className="text-xs text-amber-600 italic">
                &quot;Can you show me what 342 minus 178 looks like using the blocks? Which column should we start with?&quot;
              </p>
            </div>
          </motion.div>

          {/* Misconceptions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
              🔍 Common Mistakes
            </h2>
            {child.topMisconceptions.length > 0 ? (
              <div className="space-y-3">
                {child.topMisconceptions.map((m) => (
                  <div key={m.misconceptionCode} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-400">{m.count}x</span>
                    </div>
                    <p className="text-sm text-gray-600">{m.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No recurring patterns detected yet.</p>
            )}
          </motion.div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Gap Map", href: "#", icon: "🗺️" },
            { label: "Session History", href: "#", icon: "📊" },
            { label: "Weekly Report", href: "#", icon: "📋" },
            { label: "Give Feedback", href: "#", icon: "💬" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="bg-white rounded-xl p-4 border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-2xl block mb-2">{link.icon}</span>
              <span className="text-xs font-medium text-gray-600">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
