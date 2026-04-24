"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { AppIcon, IconBadge, type AppIconName } from "@/components/ui/AppIcon";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Types                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

interface DomainProficiency {
  domain: string;
  proficiency?: number;
  status?: string;
  projectedProficiency?: string;
  theta?: number;
  thetaSe?: number;
}

interface ChildSummary {
  id: string;
  name: string;
  yearLevel: number;
  currentStreak: number;
  xpTotal: number;
  coinBalance: number;
  diagnosticCompleted: boolean;
  rewardsMode: "full" | "feedback_only" | "off";
  domainProficiencies: DomainProficiency[];
  topMisconceptions: { misconceptionCode: string; description: string; count: number }[];
  ownedItemsCount: number;
  masteredSkillsCount: number;
  recentAccuracy: number | null;
  sessionsThisWeek: number;
}

interface DailyTrend {
  date: string;
  avgAccuracy: number;
  sessionCount: number;
  totalQuestions: number;
  totalCorrect: number;
  totalXp: number;
  domainAccuracy?: Record<string, number>;
}

interface DomainState {
  domain: string;
  theta: number;
  projectedProficiency: string;
}

interface TrendsData {
  dailyTrends: DailyTrend[];
  domainStates: DomainState[];
}

interface FocusSkill {
  id: string;
  name: string;
  status: string;
}

interface BriefingData {
  studentId: string;
  briefingDate: string;
  content: {
    summary: string;
    tips: string[];
    conversationScript: string;
    estimatedDifficulty: "easy" | "moderate" | "challenging";
    focusSkills?: FocusSkill[];
  };
  wasRead: boolean;
}

interface WeeklyReportContent {
  skillsMasteredThisWeek: { id: string; name: string }[];
  activeGaps: { id: string; name: string; progress: number }[];
  sessionsCompleted: number;
  totalTimeMinutes: number;
  averageAccuracy: number;
  accuracyTrend: number[];
  streakDays: number;
  recommendedActivities: string[];
  yearLevelComparison: { current: number; expected: number; label: string };
}

interface WeeklyReport {
  id: string;
  reportWeek: string;
  content: WeeklyReportContent;
  shareToken?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Constants                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

const PROFICIENCY_COLORS: Record<string, { bg: string; text: string; label: string; bar: string }> = {
  exceeding: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Exceeding", bar: "bg-emerald-400" },
  strong: { bg: "bg-blue-100", text: "text-blue-700", label: "Strong", bar: "bg-blue-400" },
  developing: { bg: "bg-amber-100", text: "text-amber-700", label: "Developing", bar: "bg-amber-400" },
  needs_additional_support: { bg: "bg-red-100", text: "text-red-700", label: "Needs Support", bar: "bg-red-300" },
};

const DOMAIN_LABELS: Record<string, string> = {
  numeracy: "Numeracy",
  reading: "Reading",
  spelling: "Spelling",
  grammar_punctuation: "Grammar & Punctuation",
};

const ACTIVE_DOMAINS = ["numeracy", "reading", "spelling", "grammar_punctuation"] as const;

/* ─────────────────────────────────────────────────────────────────────────── */
/* Demo / Mock Data                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

const MOCK_CHILD: ChildSummary = {
  id: "demo-mia",
  name: "Mia",
  yearLevel: 3,
  currentStreak: 12,
  xpTotal: 1840,
  coinBalance: 320,
  diagnosticCompleted: true,
  rewardsMode: "full",
  domainProficiencies: [
    { domain: "numeracy", proficiency: 78, status: "strong", theta: 0.8, thetaSe: 0.3 },
    { domain: "reading", proficiency: 65, status: "developing", theta: 0.3, thetaSe: 0.4 },
    { domain: "spelling", proficiency: 82, status: "strong", theta: 1.0, thetaSe: 0.25 },
    { domain: "grammar_punctuation", proficiency: 58, status: "developing", theta: 0.1, thetaSe: 0.35 },
  ],
  topMisconceptions: [
    { misconceptionCode: "NUM_REGROUP", description: "Forgetting to regroup when subtracting across place values", count: 7 },
    { misconceptionCode: "READ_INFER", description: "Confusing literal details with inferred meaning", count: 5 },
    { misconceptionCode: "GRAM_SVA", description: "Subject-verb agreement errors with collective nouns", count: 3 },
  ],
  ownedItemsCount: 4,
  masteredSkillsCount: 23,
  recentAccuracy: 76,
  sessionsThisWeek: 4,
};

function generateMockTrends(): TrendsData {
  const trends: DailyTrend[] = [];
  const now = Date.now();
  // Base starting points per domain — wide spread to show differentiation
  const domainBases = { numeracy: 55, reading: 38, spelling: 62, grammar_punctuation: 30 };
  const domainGrowth = { numeracy: 0.8, reading: 0.9, spelling: 0.5, grammar_punctuation: 1.1 };
  for (let i = 29; i >= 0; i--) {
    if (Math.random() > 0.35) {
      const d = new Date(now - i * 86400000);
      const day = 29 - i;
      const domainAccuracy: Record<string, number> = {};
      for (const [domain, base] of Object.entries(domainBases)) {
        const growth = domainGrowth[domain as keyof typeof domainGrowth];
        domainAccuracy[domain] = Math.min(100, Math.round(base + day * growth + (Math.random() * 12 - 6)));
      }
      const overall = Math.round(Object.values(domainAccuracy).reduce((a, b) => a + b, 0) / 4);
      trends.push({
        date: d.toISOString().split("T")[0],
        avgAccuracy: overall,
        sessionCount: Math.random() > 0.3 ? 1 : 2,
        totalQuestions: 15 + Math.floor(Math.random() * 10),
        totalCorrect: 10 + Math.floor(Math.random() * 10),
        totalXp: 40 + Math.floor(Math.random() * 30),
        domainAccuracy,
      });
    }
  }
  return {
    dailyTrends: trends,
    domainStates: [
      { domain: "numeracy", theta: 0.8, projectedProficiency: "strong" },
      { domain: "reading", theta: 0.3, projectedProficiency: "developing" },
      { domain: "spelling", theta: 1.0, projectedProficiency: "strong" },
      { domain: "grammar_punctuation", theta: 0.1, projectedProficiency: "developing" },
    ],
  };
}

const MOCK_BRIEFING: BriefingData = {
  studentId: "demo-mia",
  briefingDate: new Date().toISOString().split("T")[0],
  content: {
    summary: "Today Mia is working on 3-digit subtraction with regrouping. She's been getting about 72% correct, so the system will start with simpler problems to rebuild confidence before progressing.",
    tips: [
      "Encourage her to check her answer by adding back",
      "Use physical objects or drawings if she gets stuck on regrouping",
      "Praise the process, not just the answer",
    ],
    conversationScript: "Can you show me what 342 minus 178 looks like? Which column should we start with?",
    estimatedDifficulty: "moderate",
    focusSkills: [
      { id: "s1", name: "3-digit subtraction with regrouping", status: "learning" },
      { id: "s2", name: "Place value to 1000", status: "almost" },
    ],
  },
  wasRead: false,
};

const MOCK_REPORTS: WeeklyReport[] = [
  {
    id: "wr1",
    reportWeek: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
    content: {
      skillsMasteredThisWeek: [
        { id: "s1", name: "3-digit addition with carrying" },
        { id: "s2", name: "Identifying main idea" },
        { id: "s3", name: "Spelling: -tion words" },
        { id: "s4", name: "Subject-verb agreement" },
      ],
      activeGaps: [
        { id: "g1", name: "Subtraction with regrouping", progress: 65 },
        { id: "g2", name: "Reading inference", progress: 40 },
      ],
      sessionsCompleted: 5,
      totalTimeMinutes: 102,
      averageAccuracy: 78,
      accuracyTrend: [62, 58, 65, 68, 72, 71, 78, 82],
      streakDays: 12,
      recommendedActivities: [
        "Mia is close to mastering 2-digit multiplication. Encourage her to talk through her working.",
        "Try reading a short passage together and asking 'What do you think the author meant by that?'",
      ],
      yearLevelComparison: { current: 3.2, expected: 3.0, label: "On track" },
    },
    shareToken: "demo-share-token",
  },
  {
    id: "wr2",
    reportWeek: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
    content: {
      skillsMasteredThisWeek: [
        { id: "s5", name: "2-digit addition" },
        { id: "s6", name: "Sight word recognition" },
        { id: "s7", name: "Sentence structure" },
      ],
      activeGaps: [
        { id: "g3", name: "3-digit addition with carrying", progress: 80 },
        { id: "g4", name: "Identifying main idea", progress: 55 },
      ],
      sessionsCompleted: 4,
      totalTimeMinutes: 78,
      averageAccuracy: 72,
      accuracyTrend: [55, 60, 64, 68, 70, 72, 75, 72],
      streakDays: 7,
      recommendedActivities: [
        "Focus on 3-digit addition this week — she's almost there.",
      ],
      yearLevelComparison: { current: 3.0, expected: 3.0, label: "On track" },
    },
  },
];

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  easy: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Easy" },
  moderate: { bg: "bg-amber-50", text: "text-amber-700", label: "Moderate" },
  challenging: { bg: "bg-red-50", text: "text-red-700", label: "Challenging" },
};

const PROFICIENCY_SCORES: Record<string, number> = {
  exceeding: 92,
  strong: 76,
  developing: 56,
  needs_additional_support: 34,
};

function normalisePercent(value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return Math.round(value <= 1 ? value * 100 : value);
}

function getDomainStatus(domain: DomainProficiency | DomainState): string {
  if ("status" in domain && domain.status) return domain.status;
  if ("projectedProficiency" in domain && domain.projectedProficiency) {
    return domain.projectedProficiency;
  }
  return "developing";
}

function getDomainScore(domain: DomainProficiency | DomainState): number {
  if ("proficiency" in domain) {
    const score = normalisePercent(domain.proficiency);
    if (score !== null) return Math.min(100, Math.max(0, score));
  }

  return PROFICIENCY_SCORES[getDomainStatus(domain)] ?? PROFICIENCY_SCORES.developing;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Animation variants                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08 },
  }),
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* SVG Charts                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

const DOMAIN_LINE_COLORS: Record<string, string> = {
  numeracy: "#4F8CF7",
  reading: "#22C55E",
  spelling: "#FF8C42",
  grammar_punctuation: "#8B5CF6",
};

function AccuracyLineChart({ trends }: { trends: DailyTrend[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hiddenDomains, setHiddenDomains] = useState<Set<string>>(new Set());

  if (trends.length === 0) {
    return (
      <div className="flex items-center justify-center h-44 text-sm text-gray-400">
        No session data yet — complete some sessions to see accuracy trends.
      </div>
    );
  }

  const w = 460;
  const h = 220;
  const padX = 44;
  const padY = 20;
  const legendH = 30;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2 - 20 - legendH;

  // Auto-scale Y-axis to the data range with padding
  const allVals: number[] = trends.map((t) => t.avgAccuracy);
  for (const t of trends) {
    if (t.domainAccuracy) {
      for (const [d, v] of Object.entries(t.domainAccuracy)) {
        if (!hiddenDomains.has(d)) allVals.push(v);
      }
    }
  }
  const dataMin = Math.min(...allVals);
  const dataMax = Math.max(...allVals);
  // Round down/up to nearest 10 with padding
  const minVal = Math.max(0, Math.floor((dataMin - 5) / 10) * 10);
  const maxVal = Math.min(100, Math.ceil((dataMax + 5) / 10) * 10);

  const toX = (i: number) =>
    padX + (trends.length === 1 ? innerW / 2 : (i / (trends.length - 1)) * innerW);
  const toY = (v: number) =>
    padY + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const buildPath = (values: (number | undefined)[]) =>
    values
      .map((v, i) => (v !== undefined ? `${i === 0 || values[i - 1] === undefined ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}` : ""))
      .filter(Boolean)
      .join(" ");

  const overallPath = buildPath(trends.map((t) => t.avgAccuracy));
  const overallArea = `${overallPath} L${toX(trends.length - 1).toFixed(1)},${(padY + innerH).toFixed(1)} L${padX},${(padY + innerH).toFixed(1)} Z`;

  const hasDomainData = trends.some((t) => t.domainAccuracy && Object.keys(t.domainAccuracy).length > 0);
  const domainPaths = hasDomainData
    ? ACTIVE_DOMAINS.filter((d) => !hiddenDomains.has(d)).map((domain) => ({
        domain,
        color: DOMAIN_LINE_COLORS[domain] ?? "#999",
        path: buildPath(trends.map((t) => t.domainAccuracy?.[domain])),
      }))
    : [];

  const labelStep = Math.max(1, Math.ceil(trends.length / 6));
  // Dynamic grid lines every 10% within the visible range
  const gridLevels: number[] = [];
  for (let v = minVal; v <= maxVal; v += 10) gridLevels.push(v);

  const toggleDomain = (domain: string) => {
    setHiddenDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  };

  // Find closest data point index from mouse position
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * w;
    let closest = 0;
    let closestDist = Infinity;
    for (let i = 0; i < trends.length; i++) {
      const dist = Math.abs(toX(i) - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    setHoverIdx(closest);
  };

  const hoveredTrend = hoverIdx !== null ? trends[hoverIdx] : null;

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full cursor-crosshair"
        aria-label="Progress by domain over time"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A1A2E" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#1A1A2E" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {gridLevels.map((pct) => (
          <g key={pct}>
            <line x1={padX} y1={toY(pct)} x2={w - padX} y2={toY(pct)} stroke="#E5E7EB" strokeWidth={1} />
            <text x={padX - 6} y={toY(pct) + 4} textAnchor="end" fill="#9CA3AF" fontSize={9}>
              {pct}%
            </text>
          </g>
        ))}
        {/* Overall area fill */}
        <path d={overallArea} fill="url(#overallGrad)" />
        {/* Domain lines (thin, dashed) */}
        {domainPaths.map((dp) => (
          <path
            key={dp.domain}
            d={dp.path}
            fill="none"
            stroke={dp.color}
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 3"
            opacity={0.6}
          />
        ))}
        {/* Overall line (thick, solid) */}
        <path d={overallPath} fill="none" stroke="#1A1A2E" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover crosshair + dots */}
        {hoverIdx !== null && hoveredTrend && (
          <g>
            {/* Vertical guide line */}
            <line
              x1={toX(hoverIdx)}
              y1={padY}
              x2={toX(hoverIdx)}
              y2={padY + innerH}
              stroke="#CBD5E1"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {/* Domain dots at hover */}
            {domainPaths.map((dp) => {
              const val = hoveredTrend.domainAccuracy?.[dp.domain];
              if (val === undefined) return null;
              return (
                <circle key={dp.domain} cx={toX(hoverIdx)} cy={toY(val)} r={4} fill={dp.color} stroke="#fff" strokeWidth={2} />
              );
            })}
            {/* Overall dot at hover */}
            <circle cx={toX(hoverIdx)} cy={toY(hoveredTrend.avgAccuracy)} r={5} fill="#1A1A2E" stroke="#fff" strokeWidth={2} />
          </g>
        )}

        {/* Date labels */}
        {trends.map((t, i) => {
          if (i % labelStep !== 0 && i !== trends.length - 1) return null;
          const label = new Date(t.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
          return (
            <text key={i} x={toX(i)} y={h - legendH - 4} textAnchor="middle" fill="#9CA3AF" fontSize={9}>
              {label}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredTrend && (
        <div className="flex justify-center mt-2">
          <div className="inline-flex items-center gap-3 bg-[#1A1A2E] text-white rounded-full px-5 py-2 text-xs shadow-lg">
            <span className="font-medium text-gray-300">
              {new Date(hoveredTrend.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
            </span>
            <span className="w-px h-3 bg-gray-600" />
            <span className="font-bold">{hoveredTrend.avgAccuracy}%</span>
            {ACTIVE_DOMAINS.filter((d) => !hiddenDomains.has(d)).map((domain) => {
              const val = hoveredTrend.domainAccuracy?.[domain];
              if (val === undefined) return null;
              return (
                <span key={domain} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DOMAIN_LINE_COLORS[domain] }} />
                  <span className="text-gray-300">{val}%</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend (clickable to toggle) */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 rounded-full bg-[#1A1A2E]" style={{ height: 3 }} />
          <span className="text-[11px] text-gray-600 font-medium">Overall</span>
        </div>
        {ACTIVE_DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => toggleDomain(d)}
            className={`flex items-center gap-1.5 transition-opacity ${hiddenDomains.has(d) ? "opacity-30" : "opacity-100"}`}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DOMAIN_LINE_COLORS[d] }} />
            <span className="text-[11px] text-gray-400">{DOMAIN_LABELS[d]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  const w = 80;
  const h = 28;
  const pad = 3;
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 2;
  const toX = (i: number) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const toY = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="inline-block"
      style={{ width: w, height: h }}
      aria-label="Accuracy sparkline"
    >
      <path
        d={path}
        fill="none"
        stroke="#22C55E"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={toX(values.length - 1)}
        cy={toY(values[values.length - 1])}
        r={2.5}
        fill="#22C55E"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Small reusable UI pieces                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  sub,
  color,
  index,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="bg-white rounded-xl p-5 border border-[#E8E2D8] shadow-clay"
    >
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function SectionLoading() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-6 h-6 rounded-full border-2 border-[#4F8CF7] border-t-transparent animate-spin" />
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Tab: Overview                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

function OverviewTab({
  child,
  trends,
  trendsLoading,
  trendsError,
  rewardsMode,
  onRewardsModeChange,
}: {
  child: ChildSummary;
  trends: TrendsData | null;
  trendsLoading: boolean;
  trendsError: string | null;
  rewardsMode: "full" | "feedback_only" | "off";
  onRewardsModeChange: (mode: "full" | "feedback_only" | "off") => void;
}) {
  const activeDomainProfs = ACTIVE_DOMAINS.map((d) =>
    child.domainProficiencies.find((p) => p.domain === d)
  ).filter((p): p is DomainProficiency => p !== undefined);

  const proficiencyPosition = (status: string): number => {
    const map: Record<string, number> = {
      exceeding: 82,
      strong: 60,
      developing: 40,
      needs_additional_support: 15,
    };
    return map[status] ?? 40;
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <StatCard
          label="Skills Mastered"
          value={String(child.masteredSkillsCount)}
          sub="total skills"
          color="text-emerald-600"
          index={0}
        />
        <StatCard
          label="Day Streak"
          value={child.currentStreak > 0 ? `${child.currentStreak}d` : "0"}
          sub={child.currentStreak > 0 ? "keep it up!" : "start today"}
          color="text-[#FF8C42]"
          index={1}
        />
        <StatCard
          label="Sessions This Week"
          value={String(child.sessionsThisWeek)}
          sub="this week"
          color="text-[#4F8CF7]"
          index={2}
        />
        <StatCard
          label="Recent Accuracy"
          value={child.recentAccuracy !== null ? `${Math.round(child.recentAccuracy)}%` : "—"}
          sub="last session"
          color={
            child.recentAccuracy === null
              ? "text-gray-400"
              : child.recentAccuracy >= 70
              ? "text-emerald-600"
              : "text-amber-600"
          }
          index={3}
        />
      </motion.div>

      {/* Accuracy line chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
      >
        <h3 className="text-base font-semibold text-[#1A1A2E] mb-4">Progress by Domain</h3>
        {trendsLoading ? (
          <SectionLoading />
        ) : trendsError ? (
          <SectionError message={trendsError} />
        ) : (
          <AccuracyLineChart trends={trends?.dailyTrends ?? []} />
        )}
      </motion.div>

      {/* Domain proficiency bars */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
      >
        <h3 className="text-base font-semibold text-[#1A1A2E] mb-4">Domain Proficiency</h3>
        {activeDomainProfs.length === 0 ? (
          <p className="text-sm text-gray-400">
            Complete the diagnostic to see domain proficiency.
          </p>
        ) : (
          <div className="space-y-4">
            {activeDomainProfs.map((dp) => {
              const prof =
                PROFICIENCY_COLORS[getDomainStatus(dp)] ?? PROFICIENCY_COLORS.developing;
              return (
                <div key={dp.domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">
                      {DOMAIN_LABELS[dp.domain] ?? dp.domain}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${prof.bg} ${prof.text}`}
                    >
                      {prof.label}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${prof.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getDomainScore(dp)}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* NAPLAN projected bands */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#1A1A2E]">NAPLAN Projected Bands</h3>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            Practice estimate only
          </span>
        </div>
        {trendsLoading ? (
          <SectionLoading />
        ) : trendsError || !trends?.domainStates.length ? (
          <p className="text-sm text-gray-400">
            {trendsError ?? "Complete more sessions to see projected bands."}
          </p>
        ) : (
          <div className="space-y-5">
            {ACTIVE_DOMAINS.map((domain) => {
              const state = trends.domainStates.find((s) => s.domain === domain);
              if (!state) return null;
              const status = getDomainStatus(state);
              const prof =
                PROFICIENCY_COLORS[status] ?? PROFICIENCY_COLORS.developing;
              const position = proficiencyPosition(status);
              return (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">
                      {DOMAIN_LABELS[domain]}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${prof.bg} ${prof.text}`}>
                      {prof.label}
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    {/* Band zones */}
                    <div className="absolute inset-0 flex">
                      <div className="w-[30%] border-r border-white/60" />
                      <div className="w-[25%] border-r border-white/60" />
                      <div className="w-[25%] border-r border-white/60" />
                      <div className="w-[20%]" />
                    </div>
                    {/* Indicator dot */}
                    <motion.div
                      className="absolute top-0.5 h-2 w-2 rounded-full"
                      style={{ backgroundColor: prof.bar.replace("bg-", "") }}
                      initial={{ left: "0%" }}
                      animate={{ left: `calc(${position}% - 4px)` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className={`w-full h-full rounded-full ${prof.bar}`} />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-0.5">
                    <span>Needs Support</span>
                    <span>Developing</span>
                    <span>Strong</span>
                    <span>Exceeding</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Top misconceptions */}
      {child.topMisconceptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
        >
          <h3 className="text-base font-semibold text-[#1A1A2E] mb-4">Common Misconceptions</h3>
          <div className="space-y-3">
            {child.topMisconceptions.map((m) => (
              <div
                key={m.misconceptionCode}
                className="flex items-start justify-between gap-4 py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-400 mb-0.5">{m.misconceptionCode}</p>
                  <p className="text-sm text-gray-700">{m.description}</p>
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                  ×{m.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Rewards section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#1A1A2E]">Rewards &amp; Coins</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Mode</span>
            <button
              onClick={() => {
                const next: Record<string, "full" | "feedback_only" | "off"> = {
                  full: "feedback_only",
                  feedback_only: "off",
                  off: "full",
                };
                onRewardsModeChange(next[rewardsMode]);
              }}
              className={`relative w-24 h-7 rounded-full transition-colors text-[10px] font-semibold text-white ${
                rewardsMode === "full"
                  ? "bg-emerald-400"
                  : rewardsMode === "feedback_only"
                  ? "bg-amber-400"
                  : "bg-gray-300"
              }`}
            >
              {rewardsMode === "full" ? "Full" : rewardsMode === "feedback_only" ? "Feedback" : "Off"}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{child.coinBalance}</p>
            <p className="text-xs text-amber-500 mt-1">Coins</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{child.ownedItemsCount}</p>
            <p className="text-xs text-blue-500 mt-1">Items owned</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{child.masteredSkillsCount}</p>
            <p className="text-xs text-emerald-500 mt-1">Skills mastered</p>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          {rewardsMode === "full" &&
            "Full mode — coins, shop, and celebrations are visible to your child."}
          {rewardsMode === "feedback_only" &&
            "Feedback only — celebrations shown, coins and shop hidden."}
          {rewardsMode === "off" &&
            "Off — all reward UI is hidden. Learning continues without gamification."}
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Tab: Today                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function TodayTab({
  briefing,
  loading,
  error,
}: {
  briefing: BriefingData | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <SectionLoading />;
  if (error) return <SectionError message={error} />;

  if (!briefing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <IconBadge name="clipboard" className="mb-4 h-16 w-16" iconClassName="h-8 w-8" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No briefing yet today</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          Start a session to generate today&apos;s briefing.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block bg-[#4F8CF7] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#3A6CD4] transition-colors"
        >
          Start a session
        </Link>
      </motion.div>
    );
  }

  const { content } = briefing;
  const diff = DIFFICULTY_COLORS[content.estimatedDifficulty] ?? DIFFICULTY_COLORS.moderate;
  const formattedDate = new Date(briefing.briefingDate).toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-4">
      {/* Briefing header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
              Daily Briefing
            </p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>
              {diff.label}
            </span>
            {!briefing.wasRead && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-[#4F8CF7]">
                New
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">{content.summary}</p>

        {content.focusSkills && content.focusSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Focus Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {content.focusSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-xs bg-blue-50 text-[#4F8CF7] px-2.5 py-1 rounded-full font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Tips */}
      {content.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
        >
          <h3 className="text-base font-semibold text-[#1A1A2E] mb-3">Tips for today</h3>
          <ul className="space-y-2.5">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-[#4F8CF7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">{tip}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Conversation script */}
      {content.conversationScript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
        >
          <div className="flex items-center gap-2 mb-3">
            <AppIcon name="message" className="h-4 w-4 text-[#4F8CF7]" />
            <h3 className="text-base font-semibold text-[#1A1A2E]">Conversation script</h3>
          </div>
          <p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
            &ldquo;{content.conversationScript}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Tab: Reports                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

function ReportsTab({
  reports,
  loading,
  error,
}: {
  reports: WeeklyReport[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <SectionLoading />;
  if (error) return <SectionError message={error} />;

  if (reports.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <IconBadge name="barChart" className="mb-4 h-16 w-16" iconClassName="h-8 w-8" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No reports yet</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          Weekly reports appear after your first week of sessions.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report, i) => {
        const weekLabel = new Date(report.reportWeek).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const { content } = report;
        const hours = Math.floor(content.totalTimeMinutes / 60);
        const mins = content.totalTimeMinutes % 60;
        const timeLabel =
          hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
          >
            {/* Report header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                  Weekly Report
                </p>
                <p className="text-sm font-semibold text-gray-700">Week of {weekLabel}</p>
              </div>
              {report.shareToken && (
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/share/report/${report.shareToken}`;
                    navigator.clipboard?.writeText(url).catch(() => {});
                  }}
                  className="text-xs font-medium text-[#4F8CF7] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
                >
                  Copy share link
                </button>
              )}
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-gray-800">{content.sessionsCompleted}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Sessions</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-gray-800">{timeLabel}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Time</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">
                  {Math.round(content.averageAccuracy)}%
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Accuracy</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-[#FF8C42]">{content.streakDays}d</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Streak</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Accuracy sparkline */}
              {content.accuracyTrend.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Accuracy Trend
                  </p>
                  <div className="flex items-center gap-3">
                    <Sparkline values={content.accuracyTrend} />
                    <span className="text-base font-bold text-gray-800">
                      {Math.round(content.averageAccuracy)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Skills mastered */}
              {content.skillsMasteredThisWeek.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Mastered This Week
                  </p>
                  <ul className="space-y-1.5">
                    {content.skillsMasteredThisWeek.slice(0, 4).map((skill) => (
                      <li key={skill.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <svg
                          className="w-3 h-3 text-emerald-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {skill.name}
                      </li>
                    ))}
                    {content.skillsMasteredThisWeek.length > 4 && (
                      <li className="text-xs text-gray-400 ml-5">
                        +{content.skillsMasteredThisWeek.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {content.recommendedActivities.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-[#4F8CF7] font-semibold uppercase tracking-wider mb-1.5">
                  Recommended this week
                </p>
                <ul className="space-y-1">
                  {content.recommendedActivities.map((activity, j) => (
                    <li key={j} className="text-sm text-gray-600">
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Tab: Risk                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

type RiskSeverity = "high" | "medium" | "low";

interface RiskSignal {
  id: string;
  title: string;
  area: string;
  severity: RiskSeverity;
  evidence: string;
  nextStep: string;
  icon: AppIconName;
}

const RISK_STYLES: Record<RiskSeverity, {
  label: string;
  badge: string;
  card: string;
  icon: string;
  bar: string;
}> = {
  high: {
    label: "High",
    badge: "bg-red-50 text-red-700 border-red-100",
    card: "border-red-100 bg-red-50/60",
    icon: "bg-red-100 text-red-600",
    bar: "bg-red-500",
  },
  medium: {
    label: "Watch",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    card: "border-amber-100 bg-amber-50/60",
    icon: "bg-amber-100 text-amber-600",
    bar: "bg-amber-400",
  },
  low: {
    label: "Low",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    card: "border-blue-100 bg-blue-50/60",
    icon: "bg-blue-100 text-blue-600",
    bar: "bg-blue-400",
  },
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildRiskSignals(
  child: ChildSummary,
  trends: TrendsData | null,
  reports: WeeklyReport[],
): RiskSignal[] {
  const signals: RiskSignal[] = [];

  if (!child.diagnosticCompleted) {
    signals.push({
      id: "diagnostic-missing",
      title: "Diagnostic not completed",
      area: "Starting point",
      severity: "high",
      evidence: "Upwise has not mapped the starting skill gaps yet.",
      nextStep: "Run the diagnostic before relying on progress or risk signals.",
      icon: "clipboard",
    });
  }

  if (child.sessionsThisWeek === 0) {
    signals.push({
      id: "no-sessions",
      title: "No sessions this week",
      area: "Practice rhythm",
      severity: "high",
      evidence: "There are no completed sessions in the last 7 days.",
      nextStep: "Aim for one short session today, then rebuild the weekly rhythm.",
      icon: "clock",
    });
  } else if (child.sessionsThisWeek < 3) {
    signals.push({
      id: "low-sessions",
      title: "Practice is light this week",
      area: "Practice rhythm",
      severity: "medium",
      evidence: `${child.sessionsThisWeek} session${child.sessionsThisWeek === 1 ? "" : "s"} completed this week.`,
      nextStep: "Add two short sessions before the end of the week.",
      icon: "clock",
    });
  }

  const recentAccuracy = normalisePercent(child.recentAccuracy);
  if (recentAccuracy !== null && recentAccuracy < 60) {
    signals.push({
      id: "low-accuracy",
      title: "Recent accuracy is low",
      area: "Confidence",
      severity: "high",
      evidence: `Recent accuracy is ${recentAccuracy}%.`,
      nextStep: "Use today's briefing and encourage slower working before adding difficulty.",
      icon: "target",
    });
  } else if (recentAccuracy !== null && recentAccuracy < 70) {
    signals.push({
      id: "soft-accuracy",
      title: "Accuracy needs watching",
      area: "Confidence",
      severity: "medium",
      evidence: `Recent accuracy is ${recentAccuracy}%.`,
      nextStep: "Keep the next session short and review any missed examples together.",
      icon: "target",
    });
  }

  for (const domain of ACTIVE_DOMAINS) {
    const proficiency = child.domainProficiencies.find((p) => p.domain === domain);
    if (!proficiency) continue;

    const status = getDomainStatus(proficiency);
    const score = getDomainScore(proficiency);
    const label = DOMAIN_LABELS[domain] ?? domain;

    if (status === "needs_additional_support" || score < 45) {
      signals.push({
        id: `domain-${domain}-high`,
        title: `${label} needs support`,
        area: "Domain mastery",
        severity: "high",
        evidence: `${label} is tracking at ${score}%.`,
        nextStep: `Prioritise the next ${label.toLowerCase()} focus skill before extension work.`,
        icon: "alert",
      });
    } else if (status === "developing" || score < 65) {
      signals.push({
        id: `domain-${domain}-medium`,
        title: `${label} is still developing`,
        area: "Domain mastery",
        severity: "medium",
        evidence: `${label} is tracking at ${score}%.`,
        nextStep: `Keep ${label.toLowerCase()} in the weekly practice mix.`,
        icon: "barChart",
      });
    }
  }

  const accuracyValues = (trends?.dailyTrends ?? [])
    .map((trend) => normalisePercent(trend.avgAccuracy))
    .filter((value): value is number => value !== null);

  if (accuracyValues.length >= 6) {
    const previous = average(accuracyValues.slice(-6, -3));
    const latest = average(accuracyValues.slice(-3));
    if (previous !== null && latest !== null) {
      const drop = Math.round(previous - latest);
      if (drop >= 10) {
        signals.push({
          id: "trend-drop-high",
          title: "Accuracy has dropped",
          area: "Trend",
          severity: "high",
          evidence: `The last 3 sessions are down ${drop} points against the previous 3.`,
          nextStep: "Reduce difficulty for one session and check the recurring misconception.",
          icon: "barChart",
        });
      } else if (drop >= 5) {
        signals.push({
          id: "trend-drop-medium",
          title: "Progress has softened",
          area: "Trend",
          severity: "medium",
          evidence: `The last 3 sessions are down ${drop} points against the previous 3.`,
          nextStep: "Watch the next session before changing the plan.",
          icon: "barChart",
        });
      }
    }
  }

  for (const misconception of child.topMisconceptions.slice(0, 2)) {
    if (misconception.count >= 5) {
      signals.push({
        id: `misconception-${misconception.misconceptionCode}`,
        title: "Repeated misconception",
        area: "Error pattern",
        severity: "high",
        evidence: `${misconception.description} has appeared ${misconception.count} times.`,
        nextStep: "Use concrete examples and ask your child to explain the step before answering.",
        icon: "brain",
      });
    } else if (misconception.count >= 3) {
      signals.push({
        id: `misconception-${misconception.misconceptionCode}`,
        title: "Misconception emerging",
        area: "Error pattern",
        severity: "medium",
        evidence: `${misconception.description} has appeared ${misconception.count} times.`,
        nextStep: "Bring this into the next parent conversation script.",
        icon: "brain",
      });
    }
  }

  const latestReport = reports[0];
  for (const gap of latestReport?.content.activeGaps.slice(0, 3) ?? []) {
    const progress = normalisePercent(gap.progress) ?? gap.progress;
    if (progress < 50) {
      signals.push({
        id: `gap-${gap.id}`,
        title: `${gap.name} is an active gap`,
        area: "Skill gap",
        severity: "medium",
        evidence: `${Math.round(progress)}% progress on this gap in the latest report.`,
        nextStep: "Keep this gap in the next two sessions before moving to harder work.",
        icon: "map",
      });
    }
  }

  return signals;
}

function RiskTab({
  child,
  trends,
  reports,
  trendsLoading,
  reportsLoading,
  trendsError,
  reportsError,
}: {
  child: ChildSummary;
  trends: TrendsData | null;
  reports: WeeklyReport[];
  trendsLoading: boolean;
  reportsLoading: boolean;
  trendsError: string | null;
  reportsError: string | null;
}) {
  const signals = buildRiskSignals(child, trends, reports);
  const highCount = signals.filter((signal) => signal.severity === "high").length;
  const watchCount = signals.filter((signal) => signal.severity === "medium").length;
  const riskScore = Math.min(100, highCount * 32 + watchCount * 14);
  const overallSeverity: RiskSeverity =
    highCount > 0 ? "high" : watchCount > 0 ? "medium" : "low";
  const overallStyle = RISK_STYLES[overallSeverity];
  const overallLabel =
    overallSeverity === "high"
      ? "Needs attention"
      : overallSeverity === "medium"
      ? "Worth watching"
      : "On track";
  const isRefreshing = trendsLoading || reportsLoading;
  const hasPartialError = trendsError || reportsError;

  const prioritySignals = signals
    .slice()
    .sort((a, b) => {
      const rank = { high: 0, medium: 1, low: 2 };
      return rank[a.severity] - rank[b.severity];
    });

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-clay"
      >
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div className="flex items-start gap-4">
            <span className={`h-12 w-12 rounded-xl inline-flex items-center justify-center ${overallStyle.icon}`}>
              <AppIcon name="shield" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Learning Risk
              </p>
              <h3 className="text-xl font-semibold text-[#1A1A2E]">{overallLabel}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {highCount} high priority, {watchCount} watch signal{watchCount === 1 ? "" : "s"}.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Risk score</span>
              <span className="font-semibold text-gray-700">{riskScore}/100</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${overallStyle.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${riskScore}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            {isRefreshing && (
              <p className="text-xs text-gray-400 mt-2">Refreshing signals...</p>
            )}
          </div>
        </div>
      </motion.div>

      {hasPartialError && (
        <SectionError message="Some trend or report data could not load, so this scan may be incomplete." />
      )}

      {prioritySignals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-[#E8E2D8] shadow-clay text-center"
        >
          <IconBadge name="check" className="mx-auto mb-4 h-16 w-16 bg-emerald-50 text-emerald-600" iconClassName="h-8 w-8" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No major risk signals</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Practice rhythm, recent accuracy, and domain progress are all within the expected range.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {prioritySignals.map((signal, index) => {
            const style = RISK_STYLES[signal.severity];
            return (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`rounded-xl p-5 border ${style.card}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <span className={`h-11 w-11 rounded-xl inline-flex items-center justify-center flex-shrink-0 ${style.icon}`}>
                    <AppIcon name={signal.icon} className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>
                        {style.label}
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        {signal.area}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-[#1A1A2E] mb-2">{signal.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{signal.evidence}</p>
                    <div className="rounded-lg bg-white/70 border border-white p-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Next step
                      </p>
                      <p className="text-sm text-gray-700">{signal.nextStep}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Page                                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

type Tab = "overview" | "risk" | "today" | "reports";

export default function ParentDashboard() {
  // — Dashboard / child state
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError] = useState<string | null>(null);

  // — Tab state
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // — Per-tab data
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);

  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // — Rewards mode is derived from selected child but tracked locally for optimistic UI
  const [rewardsMode, setRewardsMode] = useState<"full" | "feedback_only" | "off">("full");

  const selectedChild = children.find((c) => c.id === selectedChildId) ?? null;

  /* ── Load dashboard on mount ─────────────────────────────────────────────── */
  useEffect(() => {
    const familyId = sessionStorage.getItem("upwise_family_id");
    if (!familyId) {
      // Demo mode — show mock data so the dashboard is always viewable
      setChildren([MOCK_CHILD]);
      setSelectedChildId(MOCK_CHILD.id);
      setRewardsMode(MOCK_CHILD.rewardsMode);
      setTrends(generateMockTrends());
      setBriefing(MOCK_BRIEFING);
      setReports(MOCK_REPORTS);
      setDashboardLoading(false);
      return;
    }

    api
      .get<{ children: ChildSummary[] }>(`/parent/dashboard?familyId=${familyId}`)
      .then((data) => {
        setChildren(data.children);
        if (data.children.length > 0) {
          setSelectedChildId(data.children[0].id);
          setRewardsMode(data.children[0].rewardsMode ?? "full");
        }
      })
      .catch(() => {
        // Fallback to demo mode on API error too
        setChildren([MOCK_CHILD]);
        setSelectedChildId(MOCK_CHILD.id);
        setRewardsMode(MOCK_CHILD.rewardsMode);
        setTrends(generateMockTrends());
        setBriefing(MOCK_BRIEFING);
        setReports(MOCK_REPORTS);
      })
      .finally(() => {
        setDashboardLoading(false);
      });
  }, []);

  /* ── Fetch child-specific data when selected child changes ──────────────── */
  const fetchChildData = useCallback(
    (childId: string) => {
      // Trends
      setTrendsLoading(true);
      setTrendsError(null);
      api
        .get<TrendsData>(`/parent/reports/${childId}/trends?days=30`)
        .then(setTrends)
        .catch(() => setTrendsError("Unable to load trend data."))
        .finally(() => setTrendsLoading(false));

      // Briefing
      setBriefingLoading(true);
      setBriefingError(null);
      api
        .get<BriefingData>(`/parent/briefing/${childId}/today`)
        .then(setBriefing)
        .catch((err) => {
          // 404 means no briefing today — show empty state, not an error
          if (err?.status === 404) {
            setBriefing(null);
          } else {
            setBriefingError("Unable to load today's briefing.");
          }
        })
        .finally(() => setBriefingLoading(false));

      // Weekly reports
      setReportsLoading(true);
      setReportsError(null);
      api
        .get<{ reports: WeeklyReport[] }>(`/parent/reports/${childId}/weekly`)
        .then((data) => setReports(data.reports))
        .catch(() => setReportsError("Unable to load weekly reports."))
        .finally(() => setReportsLoading(false));
    },
    []
  );

  useEffect(() => {
    if (!selectedChildId || selectedChildId.startsWith("demo-")) return;
    fetchChildData(selectedChildId);
  }, [selectedChildId, fetchChildData]);

  /* ── Rewards mode toggle ────────────────────────────────────────────────── */
  const handleRewardsModeChange = useCallback(
    (mode: "full" | "feedback_only" | "off") => {
      const previous = rewardsMode;
      setRewardsMode(mode);
      if (!selectedChildId) return;
      api
        .put(`/students/${selectedChildId}/rewards-mode`, { rewardsMode: mode })
        .catch(() => {
          // Roll back on failure
          setRewardsMode(previous);
        });
    },
    [rewardsMode, selectedChildId]
  );

  /* ── Loading state ──────────────────────────────────────────────────────── */
  if (dashboardLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#4F8CF7] border-t-transparent animate-spin" />
      </main>
    );
  }

  /* ── Error / no family ──────────────────────────────────────────────────── */
  if (dashboardError || children.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <IconBadge name="barChart" className="mx-auto mb-4 h-16 w-16" iconClassName="h-8 w-8" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            {dashboardError ?? "No children found"}
          </h1>
          <p className="text-gray-500 mb-6">
            Complete the free diagnostic first to see your dashboard here.
          </p>
          <Link
            href="/start"
            className="inline-block bg-[#4F8CF7] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#3A6CD4] transition-colors"
          >
            Start Free Diagnostic
          </Link>
        </div>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "risk", label: "Risk" },
    { key: "today", label: "Today" },
    { key: "reports", label: "Reports" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl font-bold text-[#4F8CF7] flex-shrink-0">
            Upwise
          </Link>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/for-parents"
              className="text-sm text-gray-500 hover:text-[#4F8CF7] transition-colors hidden sm:inline"
            >
              For Parents
            </Link>
            {selectedChild && (
              <span className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">
                {selectedChild.name} (Year {selectedChild.yearLevel})
              </span>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl lg:max-w-6xl mx-auto px-6 py-8">
        {/* Child selector — only shown for multi-child families */}
        {children.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  setSelectedChildId(child.id);
                  setRewardsMode(child.rewardsMode);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedChildId === child.id
                    ? "bg-[#4F8CF7] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#4F8CF7] hover:text-[#4F8CF7]"
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        {/* Page title */}
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A2E]">
              {selectedChild.name}&apos;s Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">Year {selectedChild.yearLevel}</p>
          </motion.div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
                activeTab === tab.key
                  ? "text-[#4F8CF7]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F8CF7] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {selectedChild && (
          <>
            {activeTab === "overview" && (
              <OverviewTab
                child={selectedChild}
                trends={trends}
                trendsLoading={trendsLoading}
                trendsError={trendsError}
                rewardsMode={rewardsMode}
                onRewardsModeChange={handleRewardsModeChange}
              />
            )}
            {activeTab === "risk" && (
              <RiskTab
                child={selectedChild}
                trends={trends}
                reports={reports}
                trendsLoading={trendsLoading}
                reportsLoading={reportsLoading}
                trendsError={trendsError}
                reportsError={reportsError}
              />
            )}
            {activeTab === "today" && (
              <TodayTab
                briefing={briefing}
                loading={briefingLoading}
                error={briefingError}
              />
            )}
            {activeTab === "reports" && (
              <ReportsTab
                reports={reports}
                loading={reportsLoading}
                error={reportsError}
              />
            )}
          </>
        )}

        {/* Start session CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#4F8CF7] text-white font-semibold py-4 rounded-xl text-center hover:bg-[#3A6CD4] transition-colors text-sm"
          >
            {selectedChild ? `Start ${selectedChild.name}\u2019s Session` : "Start Session"}
          </Link>
          <Link
            href="/start"
            className="bg-white text-gray-600 font-semibold py-4 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-center"
          >
            Add Another Child
          </Link>
        </div>
      </div>
    </main>
  );
}
