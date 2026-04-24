import type { Metadata } from "next";
import ForParentsClientPage from "@/components/parents/ForParentsClientPage";

export const metadata: Metadata = {
  title: "For Parents — Upwise",
  description:
    "See how Upwise keeps you in the loop: daily briefings, progress charts, NAPLAN projections, smart nudges, and weekly reports. You're the guide — we give you the map.",
  alternates: { canonical: "https://upwise.com.au/for-parents" },
  openGraph: {
    title: "For Parents — Upwise",
    description:
      "Daily briefings, progress tracking, NAPLAN projections, and conversation scripts. Everything you need to guide your child's learning.",
    url: "https://upwise.com.au/for-parents",
  },
};

export default function ForParentsPage() {
  return <ForParentsClientPage />;
}
