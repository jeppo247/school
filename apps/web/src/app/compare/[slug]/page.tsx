import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComparison, getAllComparisonSlugs, COMPARISONS } from "@/data/comparisonData";

export function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/compare/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://upwise.com.au/compare/${page.slug}`,
      type: "article",
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `https://upwise.com.au/compare/${page.slug}`,
    about: [
      { "@type": "SoftwareApplication", name: "Upwise", url: "https://upwise.com.au" },
      { "@type": "SoftwareApplication", name: page.competitorName, url: page.competitorUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Nav */}
      <nav className="bg-[#F8FAFF]/80 backdrop-blur-md border-b border-gray-100/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-gray-600 hover:text-[#4F8CF7] transition-colors"
          >
            FAQ
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="pt-16 pb-10 px-6"
        style={{ background: "linear-gradient(180deg, #E8EEFF 0%, #F8FAFF 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-[#FF8C42] uppercase tracking-wider mb-3">
            Comparison
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {page.heroTitle}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {page.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-600 leading-relaxed">{page.summary}</p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            {/* Desktop table */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-500 px-6 py-4 w-[30%]">Feature</th>
                  <th className="text-left text-sm font-bold text-[#4F8CF7] px-6 py-4 w-[35%]">Upwise</th>
                  <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4 w-[35%]">{page.competitorName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {page.rows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.upwise}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-gray-100">
              {page.rows.map((row) => (
                <div key={row.feature} className="p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">{row.feature}</p>
                  <div className="bg-blue-50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-[#4F8CF7] mb-1">Upwise</p>
                    <p className="text-xs text-gray-700">{row.upwise}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{page.competitorName}</p>
                    <p className="text-xs text-gray-600">{row.competitor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-blue-100 p-6">
            <h2 className="font-display text-lg font-bold text-[#4F8CF7] mb-4">
              Where Upwise is stronger
            </h2>
            <ul className="space-y-3">
              {page.upwiseStrengths.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#4F8CF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-display text-lg font-bold text-gray-700 mb-4">
              Where {page.competitorName} is stronger
            </h2>
            <ul className="space-y-3">
              {page.competitorStrengths.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Verdict */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100/50">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">The verdict</h2>
            <p className="text-gray-600 leading-relaxed">{page.verdict}</p>
          </div>
        </div>
      </section>

      {/* Other comparisons */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Other comparisons</h2>
          <div className="flex flex-wrap gap-3">
            {COMPARISONS.filter((c) => c.slug !== page.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="text-sm font-medium text-[#4F8CF7] bg-white border border-gray-200 hover:border-[#4F8CF7] px-4 py-2 rounded-xl transition-colors"
              >
                {c.heroTitle}
              </Link>
            ))}
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
