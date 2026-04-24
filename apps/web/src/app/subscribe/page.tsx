"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(tier: "standard" | "family") {
    setLoading(tier);
    setError(null);
    try {
      const familyId = sessionStorage.getItem("upwise_family_id");
      const data = await api.post<{ url: string | null }>("/subscriptions/checkout", { familyId, tier });
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Unable to start checkout. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl lg:max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose your plan
          </h1>
          <p className="text-lg text-gray-500">
            The results of mastery tutoring, delivered daily, on your schedule. Cancel anytime.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto">
          {/* Standard */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#4F8CF7] text-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-blue-200/50"
          >
            <span className="inline-block bg-[#FF8C42] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              Most Popular
            </span>
            <p className="text-blue-100 text-sm uppercase tracking-wider font-semibold mb-1">Standard</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-5xl lg:text-6xl font-bold">$39</span>
              <span className="text-blue-200 text-sm">/month</span>
            </div>
            <p className="text-blue-100 text-sm mb-6">For one child</p>

            <ul className="space-y-3 mb-8">
              {[
                "Unlimited daily sessions",
                "Maths, reading, writing, spelling & grammar",
                "Full parent dashboard",
                "Daily briefings & nudges",
                "Weekly progress reports",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm lg:text-base text-blue-50">
                  <svg className="w-4 h-4 mt-0.5 text-blue-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => handleCheckout("standard")}
              disabled={loading !== null}
              className="w-full bg-white text-[#4F8CF7] font-semibold py-4 lg:py-5 lg:text-lg rounded-xl shadow-md hover:bg-blue-50 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading === "standard" ? "Redirecting to checkout..." : "Subscribe — $39/mo"}
            </motion.button>
          </motion.div>

          {/* Family */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-200"
          >
            <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1 mt-6">Family</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-5xl lg:text-6xl font-bold text-gray-900">$59</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Up to 4 children</p>

            <ul className="space-y-3 mb-8">
              {[
                "Everything in Standard",
                "Up to 4 children",
                "Maths, reading, writing, spelling & grammar",
                "Term reports",
                "Teacher-shareable reports",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm lg:text-base text-gray-600">
                  <svg className="w-4 h-4 mt-0.5 text-[#4F8CF7] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => handleCheckout("family")}
              disabled={loading !== null}
              className="w-full bg-[#4F8CF7] text-white font-semibold py-4 lg:py-5 lg:text-lg rounded-xl hover:bg-[#3A6CD4] transition-all disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading === "family" ? "Redirecting to checkout..." : "Subscribe — $59/mo"}
            </motion.button>
          </motion.div>
        </div>

        {/* Gap Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 max-w-xl mx-auto text-center bg-green-50 rounded-2xl p-6 border border-green-100"
        >
          <p className="font-display text-lg font-bold text-gray-900 mb-2">
            The Upwise Gap Guarantee
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            If your child doesn&apos;t close at least 3 skill gaps in their first month,
            we&apos;ll refund you in full. We track every gap automatically.
          </p>
        </motion.div>

        <p className="text-center text-sm md:text-base text-gray-400 mt-8">
          Annual pricing available: 20% off. Secure payment via Stripe.
        </p>
      </div>
    </main>
  );
}
