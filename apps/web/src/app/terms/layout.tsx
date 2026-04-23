import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Upwise",
  description:
    "Terms of service for Upwise, the personalised learning platform for Australian primary students. Operated by Techne AI Pty Ltd, Adelaide.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
