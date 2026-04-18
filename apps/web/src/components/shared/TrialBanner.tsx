"use client";

import Link from "next/link";

interface TrialBannerProps {
  daysLeft: number;
}

/**
 * Shows a non-intrusive banner during the trial period
 * letting parents know how many days remain.
 */
export function TrialBanner({ daysLeft }: TrialBannerProps) {
  if (daysLeft > 5) return null; // Only show in last 2 days

  const urgent = daysLeft <= 1;

  return (
    <div className={`px-4 py-2 text-center text-sm font-medium ${
      urgent
        ? "bg-amber-50 text-amber-700 border-b border-amber-100"
        : "bg-blue-50 text-blue-700 border-b border-blue-100"
    }`}>
      {urgent ? (
        <>
          Your free trial ends {daysLeft === 0 ? "today" : "tomorrow"}.{" "}
          <Link href="/subscribe" className="underline font-semibold">
            Subscribe now
          </Link>{" "}
          to keep {`your child's`} progress going.
        </>
      ) : (
        <>
          {daysLeft} days left in your free trial.{" "}
          <Link href="/subscribe" className="underline font-semibold">
            View plans
          </Link>
        </>
      )}
    </div>
  );
}
