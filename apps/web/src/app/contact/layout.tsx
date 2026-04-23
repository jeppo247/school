import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Upwise",
  description:
    "Get in touch with the Upwise team. Australian-owned and operated from Adelaide, South Australia.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
