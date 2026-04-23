import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Upwise",
  description:
    "Answers to common questions about Upwise's evidence-based approach to mastery learning, privacy for children's data, pricing, and how it compares to traditional tutoring in Australia.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
