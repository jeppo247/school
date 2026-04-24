"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { WaitlistModal } from "@/components/WaitlistModal";
import { AppIcon, IconBadge, type AppIconName } from "@/components/ui/AppIcon";
import type { FAQItem, FAQSection } from "@/data/faqData";

type Audience = "parents" | "teachers";

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border-warm-light)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-medium text-gray-800 pr-4 group-hover:text-[#4F8CF7] transition-colors">
          {item.question}
        </span>
        <motion.svg
          className="w-5 h-5 text-gray-400 flex-shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Answer is ALWAYS in the DOM for SEO — animated open/close is visual only */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 pr-8">
          {item.answer.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-sm text-gray-500 leading-relaxed mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
          {item.source && (
            <p className="text-xs text-gray-400 mt-3">
              Source:{" "}
              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4F8CF7] hover:underline"
              >
                {item.source.label}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FAQClientPage({
  parentSections,
  teacherSections,
}: {
  parentSections: FAQSection[];
  teacherSections: FAQSection[];
}) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [audience, setAudience] = useState<Audience>("parents");
  const sections = audience === "parents" ? parentSections : teacherSections;

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      {/* Nav */}
      <nav className="bg-[#F8FAFF]/80 backdrop-blur-md border-b border-[var(--border-warm-light)] px-6 py-4 sticky top-0 z-50" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
          <button
            onClick={() => setShowWaitlist(true)}
            className="text-sm font-semibold text-white bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.97] px-5 py-2.5 rounded-full transition-all"
          >
            Join the Waitlist
          </button>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-16 pb-8 px-6" style={{ background: "linear-gradient(180deg, #E8EEFF 0%, #F8FAFF 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {audience === "parents"
              ? "Everything you need to know about how Upwise helps your child learn smarter."
              : "How Upwise supports your teaching — and why it's a complement, not a competitor."}
          </p>
        </div>
      </section>

      {/* Audience tabs */}
      <section className="px-6 pb-10">
        <div className="max-w-3xl mx-auto flex justify-center">
          <div className="inline-flex bg-white rounded-2xl border border-[var(--border-warm)] p-1.5" style={{ boxShadow: "var(--shadow-clay)" }}>
            {([
              { key: "parents" as Audience, label: "For Parents", icon: "users" as AppIconName },
              { key: "teachers" as Audience, label: "For Teachers", icon: "apple" as AppIconName },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setAudience(tab.key)}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  audience === tab.key
                    ? "bg-[#4F8CF7] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <AppIcon name={tab.icon} className="mr-2 inline h-4 w-4 align-[-2px]" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="pb-24 px-6" style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F0F0FF 30%, #F8FAFF 60%, #EEF2FF 100%)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={audience}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl mx-auto space-y-12"
          >
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <IconBadge name={section.icon} className="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
                  <h2 className="font-display text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--border-warm)] px-6" style={{ boxShadow: "var(--shadow-clay)" }}>
                  {section.items.map((item) => (
                    <FAQAccordion key={item.question} item={item} />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 text-center border border-blue-100/50">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
              {audience === "parents"
                ? "This isn't about doing more work."
                : "Built to make your classroom stronger."}
            </h2>
            <p className="text-gray-600 mb-6">
              {audience === "parents"
                ? <>It&apos;s about doing the <em>right work</em>, at the right time, for your child.</>
                : <>Upwise handles targeted practice so you can focus on what matters most — teaching.</>}
            </p>
            <button
              onClick={() => setShowWaitlist(true)}
              className="inline-flex items-center bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.98] text-white font-semibold px-8 py-4 rounded-2xl transition-all"
            >
              Register Your Interest
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border-warm-light)] px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Techne AI Pty Ltd. All rights reserved.</p>
          <p>Australian owned and operated</p>
        </div>
      </footer>

      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </main>
  );
}
