"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface DomainScore {
  domain: string;
  correct: number;
  total: number;
  accuracy: number;
  proficiency: string;
}

interface DiagnosticResults {
  childName: string;
  yearLevel: number;
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  domainScores: DomainScore[];
  completedAt: string;
}

const PROFICIENCY_COLORS: Record<string, { bg: string; text: string; label: string; bar: string }> = {
  exceeding: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Exceeding", bar: "bg-emerald-400" },
  strong: { bg: "bg-blue-100", text: "text-blue-700", label: "Strong", bar: "bg-blue-400" },
  developing: { bg: "bg-amber-100", text: "text-amber-700", label: "Developing", bar: "bg-amber-400" },
  needs_additional_support: { bg: "bg-red-100", text: "text-red-700", label: "Needs Support", bar: "bg-red-300" },
};

interface ChildSummary {
  id: string; name: string; yearLevel: number; currentStreak: number;
  xpTotal: number; coinBalance: number; diagnosticCompleted: boolean;
  rewardsMode: string;
  sessionsThisWeek: number; ownedItemsCount: number; masteredSkillsCount: number;
  domainProficiencies: { domain: string; proficiency: number; status: string }[];
}

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
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [rewardsMode, setRewardsMode] = useState("full");
  const [childData, setChildData] = useState<ChildSummary | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("upwise_diagnostic_results");
    if (stored) {
      try { setResults(JSON.parse(stored)); } catch { /* ignore */ }
    }
    const familyId = sessionStorage.getItem("upwise_family_id");
    if (familyId) {
      api.get<{ children: ChildSummary[] }>(`/parent/dashboard?familyId=${familyId}`)
        .then((data) => {
          if (data.children.length > 0) {
            setChildData(data.children[0]);
            setRewardsMode(data.children[0].rewardsMode ?? "full");
          }
        })
        .catch(() => {});
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!results) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <span className="text-6xl block mb-4">📊</span>
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">No diagnostic results yet</h1>
          <p className="text-gray-500 mb-6">
            Complete the free diagnostic first to see your child&apos;s results here.
          </p>
          <Link
            href="/start"
            className="inline-block bg-[#4F8CF7] text-white font-semibold px-8 py-3 rounded-xl"
          >
            Start Free Diagnostic
          </Link>
        </div>
      </main>
    );
  }

  const { childName, yearLevel, totalAnswered, totalCorrect, overallAccuracy, domainScores, completedAt } = results;
  const completedDate = new Date(completedAt).toLocaleDateString("en-AU", {
    day: "numeric", month: "long", year: "numeric",
  });

  const gaps = domainScores.filter((d) => d.total > 0 && (d.proficiency === "developing" || d.proficiency === "needs_additional_support"));
  const strengths = domainScores.filter((d) => d.total > 0 && (d.proficiency === "exceeding" || d.proficiency === "strong"));
  const untested = domainScores.filter((d) => d.total === 0);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-[#4F8CF7]">Upwise</Link>
          <span className="text-sm md:text-base border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">
            {childName} (Year {yearLevel})
          </span>
        </div>
      </nav>

      <div className="max-w-5xl lg:max-w-6xl mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl md:text-3xl font-semibold text-[#1A1A2E] mb-2"
        >
          {childName}&apos;s Dashboard
        </motion.h1>
        <p className="text-sm text-gray-400 mb-6">Diagnostic completed {completedDate}</p>

        {/* Top stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Questions", value: String(totalAnswered), sub: "completed", color: "text-[#4F8CF7]" },
            { label: "Accuracy", value: `${overallAccuracy}%`, sub: "overall", color: overallAccuracy >= 70 ? "text-emerald-600" : "text-amber-600" },
            { label: "Correct", value: String(totalCorrect), sub: `of ${totalAnswered}`, color: "text-[#4F8CF7]" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-xl p-5 lg:p-6 border border-[#E8E2D8] shadow-clay"
            >
              <p className="text-xs text-gray-400 font-medium mb-1">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Domain proficiencies */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-[#1A1A2E]">NAPLAN Domain Projections</h2>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              Unofficial practice estimate
            </span>
          </div>

          <div className="space-y-3">
            {domainScores.map((domain) => {
              const prof = PROFICIENCY_COLORS[domain.proficiency] ?? PROFICIENCY_COLORS.developing;
              const hasData = domain.total > 0;

              return (
                <div key={domain.domain} className="flex items-center justify-between py-2">
                  <div className="w-full sm:w-48">
                    <span className="text-sm md:text-base font-medium text-gray-700">
                      {DOMAIN_LABELS[domain.domain] ?? domain.domain}
                    </span>
                    {hasData && (
                      <span className="text-xs text-gray-400 ml-2">
                        {domain.correct}/{domain.total}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      {hasData ? (
                        <motion.div
                          className={`h-full rounded-full ${prof.bar}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${domain.accuracy}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      ) : (
                        <div className="h-full rounded-full bg-gray-200" style={{ width: "5%" }} />
                      )}
                    </div>
                  </div>
                  <span className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full ${
                    hasData ? `${prof.bg} ${prof.text}` : "bg-gray-100 text-gray-400"
                  }`}>
                    {hasData ? prof.label : "Not tested"}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 lg:p-8 border border-[#E8E2D8] shadow-clay"
          >
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">💪 Strengths</h2>
            {strengths.length > 0 ? (
              <div className="space-y-3">
                {strengths.map((s) => (
                  <div key={s.domain} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-500">{s.accuracy}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{DOMAIN_LABELS[s.domain]}</p>
                      <p className="text-xs text-gray-400">{s.correct} of {s.total} correct</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Keep practising to build strengths!</p>
            )}
          </motion.div>

          {/* Areas to focus on */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 lg:p-8 border border-[#E8E2D8] shadow-clay"
          >
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">🎯 Areas to Focus On</h2>
            {gaps.length > 0 || untested.length > 0 ? (
              <div className="space-y-3">
                {gaps.map((g) => (
                  <div key={g.domain} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-amber-500">{g.accuracy}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{DOMAIN_LABELS[g.domain]}</p>
                      <p className="text-xs text-gray-400">{g.correct} of {g.total} correct — targeted practice recommended</p>
                    </div>
                  </div>
                ))}
                {untested.map((u) => (
                  <div key={u.domain} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400">—</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{DOMAIN_LABELS[u.domain]}</p>
                      <p className="text-xs text-gray-400">Not yet assessed — will be covered in daily sessions</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Great work — no major gaps detected!</p>
            )}
          </motion.div>
        </div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 lg:p-8 border border-blue-100/50 mb-6"
        >
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3">📋 What happens next?</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              Based on the diagnostic, Upwise has built a personalised learning path for {childName}.
              Daily sessions will target the specific gaps identified, starting with the highest-priority skills.
            </p>
            {gaps.length > 0 && (
              <p>
                <strong>Priority areas:</strong>{" "}
                {gaps.map((g) => DOMAIN_LABELS[g.domain]).join(", ")}.
                These will receive focused attention in the first few weeks.
              </p>
            )}
            <p>
              Each session is 10–20 minutes. {childName} will work through adaptive questions
              that stay in the optimal difficulty zone — challenging enough to learn, easy enough to stay confident.
            </p>
          </div>
        </motion.div>

        {/* Rewards & Coins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 lg:p-8 border border-[#E8E2D8] shadow-clay mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">🪙 Rewards & Coins</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rewards</span>
              <button
                onClick={() => {
                  const next = rewardsMode === "full" ? "feedback_only" : rewardsMode === "feedback_only" ? "off" : "full";
                  setRewardsMode(next);
                  if (childData?.id) {
                    api.put(`/students/${childData.id}/rewards-mode`, { rewardsMode: next }).catch(() => {
                      setRewardsMode(rewardsMode);
                    });
                  }
                }}
                className={`relative w-20 h-7 rounded-full transition-colors ${
                  rewardsMode === "full" ? "bg-emerald-400" : rewardsMode === "feedback_only" ? "bg-amber-400" : "bg-gray-300"
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
                  {rewardsMode === "full" ? "Full" : rewardsMode === "feedback_only" ? "Feedback" : "Off"}
                </span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{childData?.coinBalance ?? "—"}</p>
              <p className="text-xs text-amber-500 mt-1">Coin balance</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{childData?.ownedItemsCount ?? "—"}</p>
              <p className="text-xs text-blue-500 mt-1">Items owned</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{childData?.masteredSkillsCount ?? "—"}</p>
              <p className="text-xs text-emerald-500 mt-1">Skills mastered</p>
            </div>
          </div>

          <div className="text-xs text-gray-400 space-y-1">
            <p>Coins are earned only for mastering skills, closing gaps, and passing reviews — never for just showing up.</p>
            <p>
              <strong>Rewards mode:</strong>{" "}
              {rewardsMode === "full" && "Full — coins, shop, and celebrations visible to your child."}
              {rewardsMode === "feedback_only" && "Feedback only — celebrations shown, coins and shop hidden."}
              {rewardsMode === "off" && "Off — all reward UI hidden. Learning continues without gamification."}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#4F8CF7] text-white font-semibold py-4 lg:py-5 lg:text-lg rounded-xl text-center hover:bg-[#3A6CD4] transition-all"
          >
            Start {childName}&apos;s First Session
          </Link>
          <Link
            href="/start"
            className="bg-white text-gray-600 font-semibold py-4 lg:py-5 lg:text-lg px-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Add Another Child
          </Link>
        </div>
      </div>
    </main>
  );
}
