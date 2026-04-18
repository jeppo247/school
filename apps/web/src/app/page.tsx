"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
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
              <span className="text-gray-900">See exactly where</span>
              <br />
              <span className="text-gray-900">your child&apos;s </span>
              <span className="relative inline-block">
                <span className="relative z-10 text-[#4F8CF7]">learning gaps</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-[#4F8CF7]/10 rounded-full -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                />
              </span>
              <br />
              <span className="text-gray-900">are hiding</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
            >
              Upwise uses adaptive AI to diagnose your child&apos;s knowledge gaps in
              minutes, then builds a personalised learning path to close them.
              <span className="text-gray-700 font-medium"> For Prep to Year 7.</span>
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
                Start Free Diagnostic
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

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
          >
            {[
              { value: "150+", label: "Skill nodes mapped" },
              { value: "ACARA", label: "Curriculum aligned" },
              { value: "30 min", label: "Daily sessions" },
              { value: "Prep–Y7", label: "Year levels" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <p className="font-display text-3xl font-bold text-[#4F8CF7]">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mastery vs Traditional Comparison */}
      <section className="py-20 bg-white">
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
            className="rounded-2xl border border-gray-200 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-500 px-6 py-4 w-[40%]"></th>
                  <th className="text-center text-sm font-bold text-[#4F8CF7] px-6 py-4 w-[30%]">
                    Mastery Learning
                  </th>
                  <th className="text-center text-sm font-semibold text-gray-600 px-6 py-4 w-[30%]">
                    Traditional Classroom
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: "Progression", mastery: "Only when skill is truly mastered", traditional: "When the class moves on" },
                  { feature: "Personalisation", mastery: "Private tutor-level, for every child", traditional: "One teacher, 25+ students" },
                  { feature: "Feedback", mastery: "Instant, after every answer", traditional: "Hours to days later" },
                  { feature: "Gap detection", mastery: "Pinpoints exact weaknesses", traditional: "General test scores" },
                  { feature: "Time efficiency", mastery: "10–20 focused minutes per day", traditional: "5–6 hours (mixed value)" },
                  { feature: "Difficulty", mastery: "Always in the optimal zone", traditional: "Too easy or too hard" },
                  { feature: "Retention", mastery: "Spaced repetition (science-backed)", traditional: "Cram before tests, forget after" },
                  { feature: "Engagement", mastery: "Active, gamified, in flow state", traditional: "Passive listening, waiting" },
                  { feature: "Consistency", mastery: "Same quality every session", traditional: "Varies by teacher and day" },
                  { feature: "Outcome", mastery: "Outperforms 98% of peers*", traditional: "Average performance" },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-700">{row.feature}</td>
                    <td className="px-6 py-3.5 text-sm text-center text-gray-800 font-medium">{row.mastery}</td>
                    <td className="px-6 py-3.5 text-sm text-center text-gray-600">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">
                *Bloom&apos;s 2 Sigma Problem (1984): students receiving 1:1 mastery-based tutoring performed 2 standard deviations above classroom peers.
              </p>
            </div>
          </motion.div>

          {/* Compounding gaps explanation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-10 bg-white rounded-2xl p-8 border border-gray-200"
          >
            <h3 className="font-display text-lg font-bold text-gray-800 mb-3">
              Why gaps get bigger over time
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              In a traditional classroom, if your child doesn&apos;t fully understand a concept, the class moves on anyway.
              That gap doesn&apos;t go away — it becomes the foundation for the next topic. Each new lesson builds on
              something they didn&apos;t master, and the deficit compounds. By the end of the year, what started as a
              small misunderstanding can become a major barrier.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Mastery learning works differently. Your child doesn&apos;t move on until they&apos;ve genuinely understood
              the basics. Once those foundations are solid, everything built on top of them is stronger. Gaps are
              closed at the source, not papered over — so learning accelerates instead of slowing down.
            </p>
          </motion.div>

          {/* Research citations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl p-8 border border-blue-100/50"
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
                  of improvement — equivalent to outperforming 98% of classroom-taught peers. Bloom concluded
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
                  with strongest gains when AI is paired with human guidance — the exact model Upwise uses.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-5">
              Upwise builds on these foundations: mastery learning (proven over 40 years) + adaptive AI (first
              credible attempt to deliver 1:1 mastery at scale) + parent as guide (the human layer research shows is essential).
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
                  "Your child completes a 15-minute adaptive assessment. Our AI pinpoints exactly which skills they've mastered and where the gaps are hiding.",
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
                  "Daily 20-minute sessions adapt in real-time to your child's level. Questions stay in the sweet spot — challenging enough to grow, easy enough to stay confident.",
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
                className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-100/80 transition-shadow duration-300 group"
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
                Research shows AI-powered learning is 2.6x faster with a human guide.
                Upwise makes you that guide with daily briefings, real-time nudges, and
                conversation scripts — no teaching degree required.
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
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
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
              Built for Kids
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl font-bold text-gray-900"
            >
              Learning that feels like play
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎨",
                title: "Themeable",
                desc: "AFL, Bluey, Superheroes, Space — your child picks their adventure",
              },
              {
                icon: "🏆",
                title: "Gold Coins & Rewards",
                desc: "Earn coins for milestones, spend them in the shop on avatars and themes",
              },
              {
                icon: "🎯",
                title: "Adaptive Difficulty",
                desc: "Questions automatically adjust to your child's level — challenging enough to grow, easy enough to stay confident",
              },
              {
                icon: "🔥",
                title: "Streaks & XP",
                desc: "Daily streaks and experience points keep motivation high day after day",
              },
              {
                icon: "🧠",
                title: "Spaced Repetition",
                desc: "Mastered skills return for review on a scientific schedule that builds long-term memory",
              },
              {
                icon: "🇦🇺",
                title: "100% Australian",
                desc: "Every question, context, and example is written for Australian kids using AUD, km, and local references",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={scaleIn}
                custom={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
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
              Less than a single tutoring session
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
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Try the diagnostic",
                features: [
                  "1 diagnostic assessment",
                  "3 sessions per week",
                  "Maths only",
                  "1 child",
                  "Basic progress summary",
                ],
                cta: "Start Free",
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
                  "Maths + English",
                  "1 child",
                  "Full parent dashboard",
                  "Daily briefings & nudges",
                  "Weekly reports",
                ],
                cta: "Get Started",
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
                  "Maths + English + Science",
                  "Term reports",
                  "Teacher-shareable reports",
                ],
                cta: "Get Started",
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
                  href="/start"
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

      {/* Trust Signals */}
      <section className="py-16 bg-[#F8FAFF] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-14"
          >
            {[
              { icon: "📚", label: "ACARA Aligned" },
              { icon: "🇦🇺", label: "Australian Made" },
              { icon: "🔒", label: "Privacy First" },
              { icon: "🎓", label: "Evidence-Based" },
            ].map((badge, i) => (
              <motion.div
                key={badge.label}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-2.5 text-gray-500"
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
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
              Find out what your child
              <br />
              <span className="text-[#4F8CF7]">already knows</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-lg text-gray-500 mb-8 max-w-xl mx-auto"
            >
              The free diagnostic takes 15 minutes and reveals a complete gap map
              of your child&apos;s maths knowledge. No credit card required.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/start"
                className="inline-flex items-center gap-2 text-lg font-semibold text-white bg-[#4F8CF7] hover:bg-[#3A6CD4] px-10 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-200/50 active:scale-[0.98]"
              >
                Start Free Diagnostic
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
                AI-powered adaptive learning for Australian primary students.
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
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
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
