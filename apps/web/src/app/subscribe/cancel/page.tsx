"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BrandMark } from "@/components/ui/AppIcon";

export default function SubscribeCancel() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <BrandMark className="mx-auto mb-4 h-16 w-16" />
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-3">
          No worries!
        </h1>
        <p className="text-gray-500 mb-8">
          You can subscribe anytime. Your child&apos;s diagnostic results
          are saved and ready when you are.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/subscribe"
            className="flex-1 bg-[#4F8CF7] text-white font-semibold py-3 rounded-xl text-center hover:bg-[#3A6CD4] transition-all"
          >
            View Plans
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white text-gray-600 font-semibold py-3 rounded-xl border border-gray-200 text-center hover:bg-gray-50 transition-all"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
