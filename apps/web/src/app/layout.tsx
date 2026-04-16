import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontDisplay = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Upwise — Learn Smarter",
  description:
    "AI-powered adaptive learning for Australian primary students. Find gaps, build mastery, and learn with confidence.",
  keywords: [
    "Australian curriculum",
    "ACARA",
    "adaptive learning",
    "primary school",
    "maths",
    "education",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body
        className={`${fontBody.variable} ${fontDisplay.variable} min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
