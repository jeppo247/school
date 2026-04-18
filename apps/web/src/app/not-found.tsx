import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] flex flex-col items-center justify-center px-6">
      <span className="text-6xl mb-4">🦉</span>
      <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">
        Page not found
      </h1>
      <p className="text-gray-500 mb-6">
        Looks like this page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="bg-[#4F8CF7] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#3A6CD4] transition-all"
      >
        Go Home
      </Link>
    </main>
  );
}
