"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES } from "@/lib/themes";
import { api } from "@/lib/api";
import { AdventureBackground } from "@/components/student/AdventureBackground";

type Step = "parent" | "child" | "theme" | "ready";

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("parent");
  const [loading, setLoading] = useState(false);

  // Form state
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [yearLevel, setYearLevel] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState("default");

  // Steps 1-3 are client-side only. API calls happen at "Start Diagnostic".
  function handleParentSubmit() {
    if (!parentName || !parentEmail) return;
    setStep("child");
  }

  function handleChildSubmit() {
    if (!childName || yearLevel === null) return;
    setStep("theme");
  }

  function handleThemeSubmit() {
    setStep("ready");
  }

  async function handleStartDiagnostic() {
    setLoading(true);
    // Always store child name first so diagnostic page can use it
    sessionStorage.setItem("upwise_child_name", childName);
    sessionStorage.setItem("upwise_year_level", String(yearLevel ?? 3));
    sessionStorage.setItem("upwise_theme", selectedTheme);

    try {
      const family = await api.post<{ id: string }>("/families", {
        name: parentName,
        email: parentEmail,
      });

      await api.post(`/families/${family.id}/parents`, {
        name: parentName,
        email: parentEmail,
      });

      const child = await api.post<{ id: string }>(`/families/${family.id}/children`, {
        name: childName,
        yearLevel,
        themeId: selectedTheme,
      });

      const session = await api.post<{ sessionId: string }>(`/diagnostic/${child.id}/start`, {});

      sessionStorage.setItem("upwise_family_id", family.id);
      sessionStorage.setItem("upwise_student_id", child.id);
      sessionStorage.setItem("upwise_session_id", session.sessionId);
    } catch {
      sessionStorage.setItem("upwise_demo_mode", "true");
    }

    setLoading(false);
    router.push("/diagnostic");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <AdventureBackground />
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {(["parent", "child", "theme", "ready"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 w-8 sm:w-12 rounded-full transition-colors ${
                (["parent", "child", "theme", "ready"] as Step[]).indexOf(step) >= i
                  ? "bg-[#4F8CF7]"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Parent info */}
          {step === "parent" && (
            <motion.div
              key="parent"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/30 border border-gray-100"
            >
              <div className="text-center mb-6">
                <span className="text-5xl block mb-3">👋</span>
                <h1 className="font-display text-2xl font-bold text-gray-800">
                  Welcome to Upwise
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  Let&apos;s set up your free diagnostic assessment
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F8CF7] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F8CF7] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800"
                  />
                </div>

                <motion.button
                  onClick={handleParentSubmit}
                  disabled={!parentName || !parentEmail}
                  className="w-full bg-[#4F8CF7] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 hover:bg-[#3A6CD4] transition-all mt-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Continue
                </motion.button>

                <p className="text-xs text-gray-400 text-center mt-2">
                  No credit card required. Free diagnostic included.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Child info */}
          {step === "child" && (
            <motion.div
              key="child"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/30 border border-gray-100"
            >
              <div className="text-center mb-6">
                <span className="text-5xl block mb-3">🧒</span>
                <h1 className="font-display text-2xl font-bold text-gray-800">
                  Tell us about your child
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  We&apos;ll personalise the experience for them
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child&apos;s first name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Mia"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4F8CF7] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 0, label: "Prep" },
                      { value: 1, label: "Year 1" },
                      { value: 2, label: "Year 2" },
                      { value: 3, label: "Year 3" },
                      { value: 4, label: "Year 4" },
                      { value: 5, label: "Year 5" },
                      { value: 6, label: "Year 6" },
                      { value: 7, label: "Year 7" },
                    ].map((yr) => (
                      <button
                        key={yr.value}
                        onClick={() => setYearLevel(yr.value)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          yearLevel === yr.value
                            ? "bg-[#4F8CF7] text-white shadow-md"
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#4F8CF7]"
                        }`}
                      >
                        {yr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleChildSubmit}
                  disabled={!childName || yearLevel === null}
                  className="w-full bg-[#4F8CF7] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 hover:bg-[#3A6CD4] transition-all mt-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Theme selection */}
          {step === "theme" && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/30 border border-gray-100"
            >
              <div className="text-center mb-6">
                <span className="text-5xl block mb-3">🎨</span>
                <h1 className="font-display text-2xl font-bold text-gray-800">
                  Pick a theme, {childName}!
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  This will make your learning look awesome
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.values(THEMES).slice(0, 6).map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedTheme === theme.id
                        ? "border-[#4F8CF7] bg-blue-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span className="text-base">{theme.emoji}</span>
                    </div>
                    <p className="font-display font-semibold text-xs text-gray-800">
                      {theme.name}
                    </p>
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={handleThemeSubmit}
                disabled={loading}
                className="w-full bg-[#4F8CF7] text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 hover:bg-[#3A6CD4] transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? "Saving..." : "Continue"}
              </motion.button>
            </motion.div>
          )}

          {/* Step 4: Ready to start */}
          {step === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/30 border border-gray-100 text-center"
            >
              <motion.span
                className="text-7xl block mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🦉
              </motion.span>

              <h1 className="font-display text-2xl font-bold text-gray-800 mb-3">
                Ready, {childName}?
              </h1>
              <p className="text-gray-500 text-sm mb-2">
                We&apos;re going to play some learning games to find out what you already know.
              </p>
              <p className="text-gray-400 text-xs mb-2">
                There are no wrong answers — this helps us find the best starting point.
                It takes about 15 minutes.
              </p>
              <p className="text-gray-300 text-xs mb-6">
                Powered by AI — I&apos;m a learning helper, not a person.
              </p>

              <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-medium text-blue-700 mb-2">👨‍👩‍👧 For parents:</p>
                <p className="text-xs text-blue-600">
                  Sit with {childName} for the first few questions, then let them work independently.
                  You&apos;ll see the full results when they&apos;re done.
                </p>
              </div>

              <motion.button
                onClick={handleStartDiagnostic}
                disabled={loading}
                className="w-full bg-[#4F8CF7] text-white font-display font-bold text-xl py-5 rounded-2xl shadow-lg shadow-blue-200/50 disabled:opacity-50 hover:bg-[#3A6CD4] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      🦉
                    </motion.span>
                    Getting ready...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Start Diagnostic
                  </span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
