"use client";

import Link from "next/link";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function ContactPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-500 mb-8">
          We'd love to hear from you. Send us an email and we'll get back to you as soon as we can.
        </p>
        <a
          href="mailto:admin@upwise.com.au"
          className="inline-block font-display text-2xl font-bold text-[#4F8CF7] hover:underline"
        >
          admin@upwise.com.au
        </a>
        <p className="text-sm text-gray-400 mt-8">
          Techne AI Pty Ltd, Adelaide, South Australia
        </p>
      </div>

      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Techne AI Pty Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </main>
  );
}
