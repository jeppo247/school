"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  source?: { label: string; url: string };
}

interface FAQSection {
  title: string;
  icon: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Why is this better than traditional classroom learning?",
    icon: "🎓",
    items: [
      {
        question: "What is mastery learning and why does it matter?",
        answer: `Mastery learning means your child fully understands a concept before moving on.\n\nIn a classroom, teachers need to keep the whole class moving. That often means some students move on before they're ready, and gaps build up over time.\n\nOur system ensures your child learns each concept properly, fills gaps immediately, and builds confidence as they go.`,
      },
      {
        question: "Is this approach actually more efficient?",
        answer: `Yes, and this is where the data is compelling.\n\nModern mastery-based, AI-supported learning models have shown that students can complete a full year of curriculum in roughly 20–30 hours of focused learning — equating to learning up to 10x faster than traditional pacing, with students achieving approximately 2.3x annual academic growth compared to peers.\n\nMore simply: students in these models often learn twice as fast in a fraction of the time.\n\nThe difference is not more hours — it's better use of time.`,
        source: { label: "Alpha School", url: "https://alpha.school/blog/the-two-hour-school-day-how-ai-tutors-are-redefining-learning-efficiency/" },
      },
      {
        question: "Why is traditional school less efficient?",
        answer: `Traditional classrooms optimise for managing groups, not individual learning.\n\nResearch and real-world models show that a large portion of the school day is spent on transitions, repetition, or waiting. Students often work on material that is too easy or too hard for them, and feedback is delayed — allowing mistakes to become habits.\n\nOur system focuses only on the exact skill your child needs, at the exact moment they need it.`,
      },
      {
        question: "How does this compare to teacher-led learning?",
        answer: `Teacher-led learning works at a fixed pace for the whole class.\n\nOur system works one-to-one with your child. It adjusts difficulty in real time, slows down when needed, and speeds up when they're ready.\n\nThis removes the "left behind" and "held back" problem that affects most classrooms.`,
      },
      {
        question: "Why is AI better at identifying learning gaps?",
        answer: `Our system analyses every answer, not just occasional tests or homework.\n\nIt can detect patterns instantly, pinpoint exact gaps (e.g. fractions vs multiplication, not just "maths"), and adapt immediately.\n\nThis level of precision isn't possible in a traditional classroom with 25+ students.`,
      },
      {
        question: "Will this actually improve my child's results?",
        answer: `Yes, because it targets the root cause of underperformance.\n\nInstead of broad revision, your child fixes specific gaps, builds strong foundations, and develops confidence.\n\nThat's what leads to better outcomes in NAPLAN and school overall.`,
      },
      {
        question: "Is this just more screen time?",
        answer: `No — it's high-quality learning time.\n\nStudents in AI-led mastery models often complete core academics in as little as 2 focused hours per day, spending less time on low-value work and gaining more time for other activities.\n\nShort, focused sessions (10–20 minutes) outperform long, unfocused ones.`,
        source: { label: "Alpha School", url: "https://alpha.school/" },
      },
    ],
  },
  {
    title: "About the platform",
    icon: "💡",
    items: [
      {
        question: "What is Upwise?",
        answer: `An AI-powered learning system that helps your child improve in literacy and numeracy by identifying gaps and guiding them through personalised, mastery-based learning.\n\nAligned to the Australian Curriculum (ACARA) and designed to build the skills assessed by NAPLAN.`,
      },
      {
        question: "How does it help with NAPLAN?",
        answer: `NAPLAN tests core skills in reading, writing, spelling, grammar, and numeracy.\n\nOur system builds those skills from the ground up, aligns practice to the curriculum frameworks that NAPLAN assesses, and ensures your child is genuinely prepared — not just familiar with test formats.`,
      },
      {
        question: "What age group is this for?",
        answer: `Prep to Year 7.\n\nWe focus on building strong foundations early, then refine and extend skills as your child progresses through primary school.`,
      },
      {
        question: "How does the AI personalise learning?",
        answer: `As your child works, the system analyses every response, identifies strengths and gaps, and adjusts the next activity automatically.\n\nNo two children follow the same path. The difficulty stays in the optimal zone — challenging enough to learn, easy enough to stay confident.`,
      },
      {
        question: "What if my child is already doing well?",
        answer: `They'll be challenged appropriately.\n\nThe system extends stronger students by introducing more advanced concepts and keeps them engaged at their level — not held back by the class average.`,
      },
      {
        question: "How much time should my child spend on it?",
        answer: `10–20 minutes per day is ideal.\n\nConsistency beats long sessions. Our system is designed for short, focused practice that builds over time.`,
      },
      {
        question: "How can I track progress?",
        answer: `Through the parent dashboard, you'll see your child's strengths and weaknesses across all NAPLAN domains, improvement trends over time, and clear next steps.\n\nYou'll also receive daily briefings before each session and weekly reports you can share with teachers.`,
      },
      {
        question: "Does this replace tutoring?",
        answer: `For many families, yes.\n\nIt delivers personalised instruction, instant feedback, and targeted learning — without the cost ($60–$100+/hour) or scheduling hassle of a private tutor.\n\nAnd it's available whenever your child is ready to learn.`,
      },
      {
        question: "Is my child's data safe?",
        answer: `Yes. We follow Australian Privacy Principles and keep all data secure.\n\nYour child's information is only used to improve their learning experience. We never sell data to third parties, and you can request deletion at any time.`,
      },
      {
        question: "Do schools use this?",
        answer: `We're built for families first, with the ability to integrate into schools over time.\n\nTeachers can receive shared reports from parents to better understand where each child is at.`,
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-gray-800 pr-4 group-hover:text-[#4F8CF7] transition-colors">
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      {/* Nav */}
      <nav className="bg-[#F8FAFF]/80 backdrop-blur-md border-b border-gray-100/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
          <Link
            href="/start"
            className="text-sm font-semibold text-white bg-[#4F8CF7] hover:bg-[#3A6CD4] px-5 py-2.5 rounded-full transition-all"
          >
            Start Free Diagnostic
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 max-w-2xl mx-auto"
          >
            Everything you need to know about how Upwise helps your child learn smarter.
          </motion.p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {FAQ_SECTIONS.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="font-display text-xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 px-6">
                {section.items.map((item) => (
                  <FAQAccordion key={item.question} item={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 text-center border border-blue-100/50">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
              This isn&apos;t about doing more work.
            </h2>
            <p className="text-gray-600 mb-6">
              It&apos;s about doing the <em>right work</em>, at the right time, for your child.
            </p>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 bg-[#4F8CF7] text-white font-semibold px-8 py-4 rounded-2xl hover:bg-[#3A6CD4] transition-all hover:shadow-xl hover:shadow-blue-200/50 active:scale-[0.98]"
            >
              Start Free Diagnostic
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Techne AI Pty Ltd. All rights reserved.</p>
          <p>Australian owned and operated</p>
        </div>
      </footer>
    </main>
  );
}
