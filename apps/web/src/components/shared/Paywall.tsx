"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface PaywallProps {
  childName: string;
}

export function Paywall({ childName }: PaywallProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <span className="text-6xl block mb-4">✅</span>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-3">
            {selected === "standard" ? "Standard" : "Family"} plan selected
          </h1>
          <p className="text-gray-500 mb-6">
            Payment integration coming soon. You&apos;ll be able to subscribe via Stripe.
          </p>
          <a href="/dashboard" className="text-[#4F8CF7] hover:underline text-sm font-medium">
            Return to dashboard
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <span className="text-6xl block mb-4">🔒</span>
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
          Your free trial has ended
        </h1>
        <p className="text-gray-500 mb-8">
          {childName}&apos;s learning path is ready to continue. Subscribe to keep
          building on the progress made during the trial.
        </p>

        <div className="space-y-4 mb-8">
          <motion.button
            onClick={() => setSelected("standard")}
            className="w-full bg-[#4F8CF7] text-white rounded-2xl p-6 text-left hover:bg-[#3A6CD4] transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-lg font-bold">Standard</span>
              <span className="font-display text-2xl font-bold">$39<span className="text-sm font-normal text-blue-200">/mo</span></span>
            </div>
            <p className="text-blue-100 text-sm">
              1 child — Unlimited sessions, all NAPLAN domains, full parent dashboard
            </p>
          </motion.button>

          <motion.button
            onClick={() => setSelected("family")}
            className="w-full bg-white text-gray-800 rounded-2xl p-6 text-left border border-gray-200 hover:border-[#4F8CF7] hover:shadow-md transition-all"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-lg font-bold">Family</span>
              <span className="font-display text-2xl font-bold">$59<span className="text-sm font-normal text-gray-400">/mo</span></span>
            </div>
            <p className="text-gray-500 text-sm">
              Up to 4 children — Everything in Standard, term reports, teacher-shareable reports
            </p>
          </motion.button>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Annual pricing available: 20% off. Cancel anytime.
        </p>

        <Link href="/parent-dashboard" className="text-sm text-[#4F8CF7] hover:underline">
          View {childName}&apos;s progress so far
        </Link>
      </motion.div>
    </main>
  );
}
