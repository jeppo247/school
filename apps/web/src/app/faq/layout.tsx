import type { Metadata } from "next";
import { getAllFAQItems } from "@/data/faqData";

export const metadata: Metadata = {
  title: "FAQ — Upwise",
  description:
    "Answers to common questions about Upwise's evidence-based approach to mastery learning, privacy for children's data, pricing, and how it compares to traditional tutoring in Australia.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  const faqItems = getAllFAQItems();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
