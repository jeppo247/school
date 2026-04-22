"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { AdventureBackground } from "@/components/student/AdventureBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};


function GapsExplainer() {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="mt-10 bg-white rounded-2xl p-8 border border-[#E8E2D8] shadow-clay"
    >
      <h3 className="font-display text-lg font-bold text-gray-800 mb-2">
        Why gaps get bigger over time
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Gaps start small. The class moves on. Schools don&apos;t have time to go back. And suddenly, a child falls behind.
      </p>

      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-sm font-medium text-[#4F8CF7] hover:underline mt-3 inline-flex items-center gap-1"
        >
          Read more
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              In a traditional classroom, if your child doesn&apos;t fully understand a concept, the class moves on anyway.
              That gap becomes the foundation for the next topic. Each new lesson builds on something they didn&apos;t
              master, and the deficit compounds. By the end of the year, what started as a small misunderstanding
              can become a major barrier.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              Mastery learning works differently. Your child doesn&apos;t move on until they&apos;ve genuinely understood
              the basics. Once those foundations are solid, everything built on top is stronger. Gaps are closed
              at the source, so learning accelerates instead of slowing down.
            </p>
            <button
              onClick={() => setExpanded(false)}
              className="text-sm font-medium text-[#4F8CF7] hover:underline mt-3 inline-flex items-center gap-1"
            >
              Show less
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#F8FAFF]/80 border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-600 hover:text-[#4F8CF7] transition-colors px-4 py-2 hidden sm:inline-block"
            >
              FAQ
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-[#4F8CF7] transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/start"
              className="text-sm font-semibold text-white bg-[#4F8CF7] hover:bg-[#3A6CD4] px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 pb-16"
      >
        <AdventureBackground />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center bg-white/70 backdrop-blur-sm rounded-3xl py-12"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              <span className="text-gray-900">A </span>
              <span className="relative inline-block">
                <span className="relative z-10 text-[#4F8CF7]">smarter alternative</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-[#4F8CF7]/10 rounded-full -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                />
              </span>
              <br />
              <span className="text-gray-900">to traditional tutoring</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
            >
              Every child can build strong foundations. Personalised, evidence-based, outcome-led.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link
                href="/start"
                className="group inline-flex items-center justify-center gap-2 text-lg font-semibold text-white bg-[#4F8CF7] hover:bg-[#3A6CD4] px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-200/50 active:scale-[0.98]"
              >
                Start Now
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 px-8 py-4 rounded-2xl border border-gray-200 transition-all hover:shadow-md active:scale-[0.98]"
              >
                See How It Works
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              custom={4}
              className="text-sm text-gray-400 pt-2"
            >
              Free diagnostic included. No credit card required.
            </motion.p>
          </motion.div>

        </motion.div>
      </section>

      {/* Mastery vs Traditional Comparison */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #F0F0FF 50%, #E8E8F8 100%)" }}
      >
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F8CF7' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3"
            >
              The Difference
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl font-bold text-gray-900"
            >
              Mastery learning vs classroom learning
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-gray-200 overflow-hidden shadow-clay bg-white"
          >
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-500 px-4 sm:px-6 py-4 w-[40%]"></th>
                  <th className="text-center text-sm font-bold text-[#4F8CF7] px-4 sm:px-6 py-4 w-[30%]">
                    Mastery Learning
                  </th>
                  <th className="text-center text-sm font-semibold text-gray-600 px-6 py-4 w-[30%]">
                    Traditional Classroom
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    feature: "Eliminates knowledge gaps",
                    mastery: "Can't progress until they truly understand, so no gaps stack up",
                    traditional: "Class moves on regardless. Missed concepts compound over time",
                  },
                  {
                    feature: "Matches pace to the individual",
                    mastery: "Progress based on competence. Every child in their optimal zone",
                    traditional: "Progress based on group timing. Top students bored, struggling students fall behind",
                  },
                  {
                    feature: "Tight feedback loops",
                    mastery: "Instant feedback, targeted practice on weak areas. Faster learning cycles",
                    traditional: "Delayed feedback, broad correction. Errors become embedded habits",
                  },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{row.mastery}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-gray-100">
              {[
                { feature: "Eliminates knowledge gaps", mastery: "Can't progress until they truly understand, so no gaps stack up", traditional: "Class moves on regardless. Missed concepts compound over time" },
                { feature: "Matches pace to the individual", mastery: "Progress based on competence. Every child in their optimal zone", traditional: "Progress based on group timing. Top students bored, struggling students fall behind" },
                { feature: "Tight feedback loops", mastery: "Instant feedback, targeted practice on weak areas. Faster learning cycles", traditional: "Delayed feedback, broad correction. Errors become embedded habits" },
              ].map((row) => (
                <div key={row.feature} className="p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">{row.feature}</p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-[#4F8CF7] mb-1">Mastery Learning</p>
                    <p className="text-xs text-gray-700">{row.mastery}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Traditional</p>
                    <p className="text-xs text-gray-600">{row.traditional}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">
                Mastery learning aligns with how humans actually learn: fix gaps before progressing, learn at the right pace, iterate quickly with feedback.
              </p>
            </div>
          </motion.div>

          {/* Compounding gaps */}
          <GapsExplainer />

          {/* Research citations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 bg-white rounded-2xl p-8 border border-[#E8E2D8] shadow-clay"
          >
            <h3 className="font-display text-lg font-bold text-gray-800 mb-4">
              Backed by decades of research
            </h3>
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div>
                <a href="https://en.wikipedia.org/wiki/Bloom%27s_2_sigma_problem" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#4F8CF7] hover:underline mb-1 inline-block">
                  Bloom&apos;s 2 Sigma Problem (1984) &rarr;
                </a>
                <p className="text-gray-500 text-xs leading-relaxed">
                  The landmark study that proved 1:1 mastery-based tutoring produces 2 standard deviations
                  of improvement, equivalent to outperforming 98% of classroom-taught peers. Bloom concluded
                  the bottleneck was the delivery model, not student ability.
                </p>
              </div>
              <div>
                <a href="https://www.cambridge.org/core/journals/journal-of-educational-research/article/effectiveness-of-mastery-learning-programs/abs" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#4F8CF7] hover:underline mb-1 inline-block">
                  Kulik Meta-Analysis (1990) &rarr;
                </a>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Meta-analysis across subjects and age groups confirmed consistent positive effects of mastery
                  learning on achievement, retention, and student confidence. Published by Cambridge University Press.
                </p>
              </div>
              <div>
                <a href="https://arxiv.org/abs/2303.04634" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#4F8CF7] hover:underline mb-1 inline-block">
                  Carnegie Cognitive Tutor Trials &rarr;
                </a>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Randomised controlled trials showed AI-based cognitive tutors produced measurable gains
                  in maths outcomes. Strongest when paired with mastery progression and human support.
                </p>
              </div>
              <div>
                <a href="https://nhsjs.com/2024/a-literature-review-of-ai-based-tutoring-systems/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#4F8CF7] hover:underline mb-1 inline-block">
                  AI Tutoring Literature Review (48 studies) &rarr;
                </a>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Comprehensive review found AI tutoring systems often outperform traditional teaching,
                  with strongest gains when AI is paired with human guidance, the exact model Upwise uses.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-5">
              Upwise builds on these foundations: mastery learning (proven over 40 years), personalised practice at scale, and the parent as guide. The human layer research shows is essential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl font-bold text-gray-900"
            >
              Three steps to close the gaps
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "1",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="12" stroke="#4F8CF7" strokeWidth="2" />
                    <circle cx="16" cy="16" r="6" stroke="#4F8CF7" strokeWidth="2" />
                    <circle cx="16" cy="16" r="2" fill="#4F8CF7" />
                  </svg>
                ),
                title: "Diagnose",
                description:
                  "Your child completes a short assessment. We pinpoint exactly which skills they've mastered and where the gaps are, so learning starts in the right place.",
                color: "#4F8CF7",
                bg: "#EEF4FF",
              },
              {
                step: "2",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <path d="M8 24V14M16 24V8M24 24V18" stroke="#FF8C42" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ),
                title: "Learn",
                description:
                  "Daily 20-minute sessions adapt in real time to your child's level. Questions stay in the sweet spot: challenging enough to grow, easy enough to stay confident.",
                color: "#FF8C42",
                bg: "#FFF4EC",
              },
              {
                step: "3",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16l6 6L24 10" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Master",
                description:
                  "Skills are only marked complete after proven mastery across multiple sessions. Spaced repetition locks knowledge into long-term memory.",
                color: "#22C55E",
                bg: "#ECFDF5",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={scaleIn}
                custom={i}
                className="relative bg-white rounded-3xl p-8 shadow-clay border border-[#E8E2D8] hover:shadow-clay-hover hover:-rotate-1 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.icon}
                </div>
                <div
                  className="absolute top-8 right-8 font-display text-6xl font-bold opacity-[0.06]"
                  style={{ color: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Guide Feature */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3"
              >
                The Parent Layer
              </motion.p>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
              >
                You&apos;re the guide.
                <br />
                <span className="text-[#4F8CF7]">We give you the map.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg text-gray-500 mb-8 leading-relaxed"
              >
                Research shows children learn 2.6x faster with a personal guide.
                Upwise makes you that guide, with daily briefings, real-time nudges and
                conversation scripts. No teaching degree required.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="space-y-4">
                {[
                  "Daily briefing before each session with tips",
                  "Real-time nudges when your child needs support",
                  "Weekly reports you can share with teachers",
                  "Detailed analytics: engagement, accuracy, trends",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-[#4F8CF7]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{feature}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100/50"
            >
              <div className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8] mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <span className="text-base">📋</span>
                  <span className="font-medium">Today&apos;s Briefing</span>
                  <span className="ml-auto text-xs bg-blue-50 text-[#4F8CF7] px-2 py-0.5 rounded-full font-medium">
                    New
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Today <strong>Indigo</strong> is working on{" "}
                  <strong>3-digit subtraction with regrouping</strong>. She&apos;s
                  been getting about 72% correct, so the system will start with
                  simpler problems to rebuild confidence.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-clay border border-[#E8E2D8]">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span className="text-base">💡</span>
                  <span className="font-medium">If she gets stuck</span>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  &quot;Can you show me what 342 minus 178 looks like using the
                  blocks? Which column should we start with?&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#F8FAFF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3"
            >
              The Learning Experience
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl font-bold text-gray-900"
            >
              Designed for how children actually learn
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Right level, every time",
                desc: "Questions match your child's exact level. Challenging enough to grow, easy enough to stay confident",
              },
              {
                icon: "🧠",
                title: "Built to remember",
                desc: "Mastered skills return for review on a scientific schedule that builds long-term memory",
              },
              {
                icon: "🇦🇺",
                title: "100% Australian",
                desc: "Every question, context, and example is written for Australian kids using AUD, km, and local references",
              },
              {
                icon: "🎨",
                title: "Their world, their way",
                desc: "AFL, Bluey, Superheroes, Space. Your child picks their adventure",
              },
              {
                icon: "🔥",
                title: "Daily habits, lasting progress",
                desc: "Short daily sessions build consistency and confidence over time",
              },
              {
                icon: "🏆",
                title: "Rewards for real learning",
                desc: "Earn coins for mastering skills, not just showing up. Spend them on avatars and themes",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={scaleIn}
                custom={i}
                className="bg-white rounded-2xl p-6 border border-[#E8E2D8] shadow-clay hover:shadow-clay-hover hover:-rotate-1 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3"
            >
              Simple Pricing
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            >
              Invest in their foundations
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-gray-500 max-w-xl mx-auto"
            >
              Start with a free diagnostic. Upgrade when you&apos;re ready.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Free Trial",
                price: "$0",
                period: "for 7 days",
                description: "Full access, no commitment",
                features: [
                  "7 days of full access",
                  "Unlimited sessions",
                  "Maths, reading, writing, spelling & grammar",
                  "1 child",
                  "Full parent dashboard",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
              {
                name: "Standard",
                price: "$39",
                period: "/month",
                description: "For one child",
                features: [
                  "Unlimited diagnostics",
                  "Unlimited daily sessions",
                  "Maths, reading, writing, spelling & grammar",
                  "1 child",
                  "Full parent dashboard",
                  "Daily briefings & nudges",
                  "Weekly reports",
                ],
                cta: "Subscribe",
                popular: true,
              },
              {
                name: "Family",
                price: "$59",
                period: "/month",
                description: "For the whole family",
                features: [
                  "Everything in Standard",
                  "Up to 4 children",
                  "Maths, reading, writing, spelling & grammar",
                  "Term reports",
                  "Teacher-shareable reports",
                ],
                cta: "Subscribe",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={scaleIn}
                custom={i}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? "bg-[#4F8CF7] text-white shadow-xl shadow-blue-200/50 ring-1 ring-[#4F8CF7] scale-[1.02]"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF8C42] text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                <p
                  className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                    plan.popular ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-5xl font-bold">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm mb-6 ${
                    plan.popular ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "text-blue-200" : "text-[#4F8CF7]"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.popular ? "text-blue-50" : "text-gray-600"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Free Trial" ? "/start" : "/subscribe"}
                  className={`block text-center font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] ${
                    plan.popular
                      ? "bg-white text-[#4F8CF7] hover:bg-blue-50 shadow-md"
                      : "bg-[#4F8CF7] text-white hover:bg-[#3A6CD4] hover:shadow-lg hover:shadow-blue-100"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Annual pricing available: 20% off. Cancel anytime.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              See where your child
              <br />
              <span className="text-[#4F8CF7]">can grow</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg text-gray-500 mb-8 max-w-xl mx-auto"
            >
              The free diagnostic takes 15 minutes and shows your child&apos;s
              strengths and the skills they&apos;re ready to master next. No credit card required.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/start"
                className="inline-flex items-center gap-2 text-lg font-semibold text-white bg-[#4F8CF7] hover:bg-[#3A6CD4] px-10 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-200/50 active:scale-[0.98]"
              >
                Start Now
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-4 gap-8 mb-12">
            <div className="sm:col-span-1">
              <span className="font-display text-2xl font-bold text-white">
                Upwise
              </span>
              <p className="text-sm mt-3 leading-relaxed">
                Personalised learning that helps children build strong foundations in maths and English.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Product</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Data Protection</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} Techne AI Pty Ltd. All rights reserved.
            </p>
            <p className="text-xs">
              Australian owned and operated
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
