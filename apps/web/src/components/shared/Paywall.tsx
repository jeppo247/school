"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconBadge } from "@/components/ui/AppIcon";

interface PaywallProps {
  childName: string;
}

export function Paywall({ childName }: PaywallProps) {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <IconBadge name="lock" className="mx-auto mb-4 h-16 w-16 bg-blue-50 text-[#4F8CF7]" iconClassName="h-8 w-8" />
        <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
          Your free trial has ended
        </h1>
        <p className="text-gray-500 mb-8">
          {childName}&apos;s learning path is ready to continue. Subscribe to keep
          building on the progress made during the trial.
        </p>

        <Link
          href="/subscribe"
          className="inline-block w-full bg-[#4F8CF7] text-white font-semibold py-4 rounded-xl hover:bg-[#3A6CD4] transition-all text-center text-lg"
        >
          View Plans & Subscribe
        </Link>

        <p className="text-xs text-gray-400 mt-4 mb-4">
          From $39/month. Cancel anytime.
        </p>

        <Link href="/parent-dashboard" className="text-sm text-[#4F8CF7] hover:underline">
          View {childName}&apos;s progress so far
        </Link>
      </motion.div>
    </main>
  );
}
