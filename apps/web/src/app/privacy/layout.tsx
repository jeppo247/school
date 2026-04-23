import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Upwise",
  description:
    "How Upwise protects your child's data. Compliant with the Australian Privacy Act 1988 and Australian Privacy Principles. Children's data is never sold or used for advertising.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
