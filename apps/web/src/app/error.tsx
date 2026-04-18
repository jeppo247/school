"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-6">
      <span className="text-6xl mb-4">🦉</span>
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-6">
        Don&apos;t worry — let&apos;s try again.
      </p>
      <button
        onClick={() => reset()}
        className="bg-[#4F8CF7] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#3A6CD4] transition-all"
      >
        Try Again
      </button>
    </main>
  );
}
