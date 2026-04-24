"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── SVG Charts ─────────────────────────────────────────────────────────── */

function MasteryLineChart() {
  // 8-week mastery trend — realistic upward curve with a dip in week 4
  const points = [
    { week: 1, pct: 12 },
    { week: 2, pct: 22 },
    { week: 3, pct: 34 },
    { week: 4, pct: 30 },
    { week: 5, pct: 42 },
    { week: 6, pct: 55 },
    { week: 7, pct: 64 },
    { week: 8, pct: 73 },
  ];

  const w = 360;
  const h = 180;
  const padX = 40;
  const padY = 24;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const toX = (i: number) => padX + (i / (points.length - 1)) * innerW;
  const toY = (pct: number) => padY + innerH - (pct / 100) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(p.pct).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${toX(points.length - 1).toFixed(1)},${(h - padY).toFixed(1)} L${padX},${(h - padY).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-label="Mastery progress over 8 weeks">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct) => (
        <g key={pct}>
          <line x1={padX} y1={toY(pct)} x2={w - padX} y2={toY(pct)} stroke="#E5E7EB" strokeWidth={1} />
          <text x={padX - 6} y={toY(pct) + 4} textAnchor="end" className="fill-gray-400" fontSize={10}>
            {pct}%
          </text>
        </g>
      ))}
      {/* Area fill */}
      <path d={areaPath} fill="url(#blueGrad)" opacity={0.15} />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#4F8CF7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={toX(i)} cy={toY(p.pct)} r={4} fill="#4F8CF7" stroke="#fff" strokeWidth={2} />
      ))}
      {/* Week labels */}
      {points.map((p, i) => (
        <text key={i} x={toX(i)} y={h - 6} textAnchor="middle" className="fill-gray-400" fontSize={10}>
          W{p.week}
        </text>
      ))}
      {/* Gradient def */}
      <defs>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F8CF7" />
          <stop offset="100%" stopColor="#4F8CF7" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DomainBarChart() {
  const domains = [
    { label: "Numeracy", pct: 78, color: "#4F8CF7" },
    { label: "Reading", pct: 65, color: "#22C55E" },
    { label: "Spelling", pct: 82, color: "#FF8C42" },
    { label: "Grammar", pct: 58, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-3">
      {domains.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-gray-700">{d.label}</span>
            <span className="text-gray-400">{d.pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${d.pct}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AccuracyTrendLine() {
  // Small sparkline for weekly report
  const pts = [62, 58, 65, 68, 72, 71, 78, 82];
  const w = 160;
  const h = 40;
  const pad = 4;
  const min = Math.min(...pts) - 5;
  const max = Math.max(...pts) + 5;
  const toX = (i: number) => pad + (i / (pts.length - 1)) * (w - pad * 2);
  const toY = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);

  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-[160px]" aria-label="Accuracy trend">
      <path d={path} fill="none" stroke="#22C55E" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={toX(pts.length - 1)} cy={toY(pts[pts.length - 1])} r={3} fill="#22C55E" />
    </svg>
  );
}

/* ── Section Components ─────────────────────────────────────────────────── */

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-12">
      <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3">
        {label}
      </motion.p>
      <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
        {title}
      </motion.h2>
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */

export default function ForParentsClientPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <main className="overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#F8FAFF]/80 border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/for-parents" className="text-sm font-semibold text-[#4F8CF7] px-4 py-2 hidden sm:inline-block">
              For Parents
            </Link>
            <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-[#4F8CF7] transition-colors px-4 py-2 hidden sm:inline-block">
              FAQ
            </Link>
            <button
              onClick={() => setShowWaitlist(true)}
              className="text-sm font-semibold text-white bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.97] px-5 py-2.5 rounded-full transition-all"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 bg-[#F8FAFF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-4"
          >
            For Parents
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1]"
          >
            You&apos;re the guide.
            <br />
            <span className="text-[#4F8CF7]">We give you the map.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Research shows children learn significantly faster with a personal guide.
            Upwise gives you daily briefings, real-time nudges, progress tracking, and
            conversation scripts — so you always know what&apos;s happening and how to help.
          </motion.p>
        </div>
      </section>

      {/* ── Section 1: Progress Tracking ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Progress Tracking" title="Watch the gaps close, week by week" />

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Line chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-clay border border-[#E8E2D8]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Skills Mastered</p>
                  <p className="font-display text-2xl font-bold text-gray-900">73%</p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% this week</span>
              </div>
              <MasteryLineChart />
            </motion.div>

            {/* Domain bars */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-clay border border-[#E8E2D8]"
            >
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Domain Proficiency</p>
                <p className="text-sm text-gray-500">Mia — Year 3</p>
              </div>
              <DomainBarChart />
              <p className="text-[11px] text-gray-400 mt-4">
                Proficiency based on mastered skills vs total skills per domain
              </p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-10 max-w-xl mx-auto"
          >
            See exactly where your child stands across every NAPLAN domain — not just a score,
            but which skills they&apos;ve mastered and which still need work.
          </motion.p>
        </div>
      </section>

      {/* ── Section 2: Daily Briefing ────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Daily Briefing" title="Know what they're learning before they start" />

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
              <motion.p variants={fadeUp} custom={0} className="text-lg text-gray-500 leading-relaxed mb-6">
                Every day, you get a quick briefing: what your child is working on, how
                confident they are, and what to do if they get stuck. No teaching degree needed.
              </motion.p>
              <motion.div variants={fadeUp} custom={1} className="space-y-4">
                {[
                  "Today's focus skills and difficulty level",
                  "Tips tailored to what your child finds hard",
                  "Conversation scripts if they ask for help",
                  "How their session connects to the bigger picture",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-[#4F8CF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{item}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Briefing card */}
              <div className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8]">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <span className="text-base">📋</span>
                  <span className="font-medium">Today&apos;s Briefing</span>
                  <span className="ml-auto text-xs bg-blue-50 text-[#4F8CF7] px-2 py-0.5 rounded-full font-medium">New</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Today <strong>Mia</strong> is working on <strong>3-digit subtraction with regrouping</strong>.
                  She&apos;s been getting about 72% correct, so the system will start with simpler problems
                  to rebuild confidence before progressing.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs bg-blue-50 text-[#4F8CF7] px-2 py-1 rounded-full">Numeracy</span>
                  <span className="text-xs bg-orange-50 text-[#FF8C42] px-2 py-1 rounded-full">Moderate</span>
                </div>
              </div>

              {/* Conversation script card */}
              <div className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8]">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span className="text-base">💡</span>
                  <span className="font-medium">If she gets stuck</span>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  &quot;Can you show me what 342 minus 178 looks like using the blocks?
                  Which column should we start with?&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 3: NAPLAN Projections ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="NAPLAN Projections" title="See where they're tracking before test day" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-clay border border-[#E8E2D8]"
          >
            <div className="mb-6">
              <p className="text-sm text-gray-500">Mia — Year 3 — Projected NAPLAN Proficiency</p>
            </div>
            <div className="space-y-5">
              {[
                { domain: "Numeracy", band: "Strong", color: "#22C55E", position: 68 },
                { domain: "Reading", band: "Developing", color: "#FF8C42", position: 45 },
                { domain: "Spelling", band: "Strong", color: "#22C55E", position: 72 },
                { domain: "Grammar", band: "Developing", color: "#FF8C42", position: 40 },
              ].map((d) => (
                <div key={d.domain}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{d.domain}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${d.color}15`, color: d.color }}>
                      {d.band}
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    {/* Band boundaries */}
                    <div className="absolute inset-0 flex">
                      <div className="w-[30%] border-r border-gray-200" title="Needs Support" />
                      <div className="w-[25%] border-r border-gray-200" title="Developing" />
                      <div className="w-[25%] border-r border-gray-200" title="Strong" />
                      <div className="w-[20%]" title="Exceeding" />
                    </div>
                    {/* Indicator */}
                    <div
                      className="absolute top-0 h-full w-2 rounded-full transition-all"
                      style={{ left: `${d.position}%`, backgroundColor: d.color }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-1">
                    <span>Needs Support</span>
                    <span>Developing</span>
                    <span>Strong</span>
                    <span>Exceeding</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-6">
              Projections based on mastered skills and adaptive assessment data.
              Unofficial practice estimate — not an official NAPLAN result.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-8 max-w-xl mx-auto"
          >
            Projected NAPLAN bands update as your child masters more skills — so you
            can see the trajectory, not just a single test result.
          </motion.p>
        </div>
      </section>

      {/* ── Section 4: Weekly Report ─────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Weekly Report" title="Every Friday, a clear picture of the week" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-clay border border-[#E8E2D8]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Weekly Report</p>
                <p className="text-sm text-gray-500">Mia — Week of 14 April</p>
              </div>
              <span className="text-xs bg-blue-50 text-[#4F8CF7] px-3 py-1 rounded-full font-medium">Share with teacher</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Skills Mastered", value: "8", icon: "🎯" },
                { label: "Sessions", value: "5", icon: "📚" },
                { label: "Streak", value: "12 days", icon: "🔥" },
                { label: "Time", value: "1h 42m", icon: "⏱" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">{stat.icon}</span>
                  <p className="font-display text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-[11px] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Accuracy trend */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Accuracy Trend</p>
                <div className="flex items-end gap-3">
                  <AccuracyTrendLine />
                  <span className="text-lg font-bold text-gray-900">82%</span>
                </div>
              </div>

              {/* Skills this week */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Mastered This Week</p>
                <div className="space-y-1.5">
                  {["3-digit addition with carrying", "Identifying main idea", "Spelling: -tion words", "Subject-verb agreement"].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-[#4F8CF7] font-semibold mb-1">Recommended This Week</p>
              <p className="text-sm text-gray-600">
                Mia is close to mastering 2-digit multiplication. Encourage her to talk through
                her working — saying the steps out loud helps lock them into long-term memory.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 5: Smart Nudges ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Smart Nudges" title="Know when to step in — and when to step back" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {
                type: "Stuck",
                icon: "🤔",
                color: "#FF8C42",
                bg: "#FFF7ED",
                message: "Mia has been on the same question for 2 minutes. She might need a nudge.",
                tip: "Try asking: \"What do you know about this so far?\"",
              },
              {
                type: "Celebration",
                icon: "🎉",
                color: "#22C55E",
                bg: "#F0FDF4",
                message: "Mia just mastered 3-digit subtraction! That was a tough one.",
                tip: "Tell her you noticed — specific praise builds confidence.",
              },
              {
                type: "Break Needed",
                icon: "☕",
                color: "#8B5CF6",
                bg: "#F5F3FF",
                message: "Mia's accuracy has dropped in the last few questions. A short break might help.",
                tip: "Even 5 minutes of movement resets focus.",
              },
              {
                type: "Session Complete",
                icon: "✅",
                color: "#4F8CF7",
                bg: "#EFF6FF",
                message: "Great session! Mia answered 18 questions with 83% accuracy.",
                tip: "Ask her to teach you one thing she learned today.",
              },
            ].map((nudge) => (
              <motion.div
                key={nudge.type}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 shadow-clay border border-[#E8E2D8] flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{nudge.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: nudge.color }}>
                    {nudge.type}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3 flex-1">{nudge.message}</p>
                <div className="p-3 rounded-lg text-xs text-gray-600 italic" style={{ backgroundColor: nudge.bg }}>
                  {nudge.tip}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-10 max-w-xl mx-auto"
          >
            You don&apos;t need to hover. We&apos;ll tell you when your attention matters most.
          </motion.p>
        </div>
      </section>

      {/* ── Section 6: Gap Detection ─────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Gap Detection" title="Find the root cause, not just the symptom" />

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
              <motion.p variants={fadeUp} custom={0} className="text-lg text-gray-500 leading-relaxed mb-6">
                Most tools tell you what your child got wrong. Upwise traces errors
                back to the prerequisite skill that&apos;s actually missing — so practice targets
                the real gap, not the surface mistake.
              </motion.p>
              <motion.div variants={fadeUp} custom={1} className="space-y-4">
                {[
                  "167 micro-skills mapped with prerequisite chains",
                  "Diagnostic pinpoints exact gaps, not just topic areas",
                  "Root-cause targeting means faster progress",
                  "Strengths are celebrated, not just weaknesses flagged",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-[#4F8CF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{item}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Strengths */}
              <div className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8]">
                <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-3">Strengths</p>
                <div className="space-y-2">
                  {["Place value to 1000", "Addition without carrying", "Sight word recognition", "Sentence structure"].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps */}
              <div className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8]">
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-3">Areas to Focus On</p>
                <div className="space-y-3">
                  {[
                    { skill: "Subtraction with regrouping", prereq: "Needs: place value understanding" },
                    { skill: "Reading comprehension — inference", prereq: "Needs: identifying main idea" },
                    { skill: "Using connectives in sentences", prereq: "Needs: sentence structure basics" },
                  ].map((g) => (
                    <div key={g.skill}>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        {g.skill}
                      </div>
                      <p className="text-xs text-gray-400 ml-4 mt-0.5">{g.prereq}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Rewards Control ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Your Rules" title="You control the rewards" />

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
              <motion.p variants={fadeUp} custom={0} className="text-lg text-gray-500 leading-relaxed mb-6">
                Every family is different. Some children thrive on coins and streaks.
                Others do best with just encouragement. You choose what works.
              </motion.p>
              <motion.p variants={fadeUp} custom={1} className="text-gray-500 leading-relaxed">
                Switch between modes anytime from your parent dashboard. The learning
                experience stays exactly the same — only the reward visibility changes.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8]"
            >
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">Rewards Mode</p>
              <div className="space-y-3">
                {[
                  {
                    mode: "Full",
                    desc: "Coins, shop, streaks, and celebrations all visible",
                    active: true,
                  },
                  {
                    mode: "Feedback Only",
                    desc: "Celebrations shown, coins and shop hidden",
                    active: false,
                  },
                  {
                    mode: "Off",
                    desc: "All reward UI hidden — pure learning focus",
                    active: false,
                  },
                ].map((opt) => (
                  <div
                    key={opt.mode}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      opt.active
                        ? "border-[#4F8CF7] bg-blue-50/50"
                        : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          opt.active ? "border-[#4F8CF7]" : "border-gray-300"
                        }`}
                      >
                        {opt.active && <div className="w-2 h-2 rounded-full bg-[#4F8CF7]" />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${opt.active ? "text-[#4F8CF7]" : "text-gray-700"}`}>
                          {opt.mode}
                        </p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFF]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Ready to guide your child&apos;s learning?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 mb-8 max-w-xl mx-auto"
          >
            Join the waitlist and be the first to access daily briefings,
            progress tracking, and everything you need to support your child.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowWaitlist(true)}
            className="inline-flex items-center justify-center text-lg font-semibold text-white bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.98] px-8 py-4 rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            Join the Waitlist
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            <div>
              <Link href="/" className="font-display text-2xl font-bold text-white">
                Upwise
              </Link>
              <p className="text-sm mt-3 leading-relaxed">
                Personalised learning that helps children build strong foundations in maths and English.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Product</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/for-parents" className="hover:text-white transition-colors">For Parents</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">&copy; {new Date().getFullYear()} Techne AI Pty Ltd. All rights reserved.</p>
            <p className="text-xs">Australian owned and operated</p>
          </div>
        </div>
      </footer>

      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </main>
  );
}
