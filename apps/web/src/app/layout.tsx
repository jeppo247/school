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
  metadataBase: new URL("https://upwise.com.au"),
  title: "Upwise — Strong foundations in maths and English",
  description:
    "Personalised learning that helps Australian primary students build strong foundations in maths and English. Evidence-based, outcome-led, works alongside school.",
  keywords: [
    "Australian curriculum",
    "ACARA",
    "adaptive learning",
    "primary school",
    "maths",
    "English",
    "education",
    "mastery learning",
    "online tutoring Australia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Upwise — Strong foundations in maths and English",
    description:
      "Personalised learning that helps Australian primary students build strong foundations in maths and English. Evidence-based, outcome-led, works alongside school.",
    url: "https://upwise.com.au",
    siteName: "Upwise",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upwise — Strong foundations in maths and English",
    description:
      "Personalised learning that helps Australian primary students build strong foundations in maths and English.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Upwise",
                  legalName: "Techne AI Pty Ltd",
                  url: "https://upwise.com.au",
                  description:
                    "Personalised mastery-based learning platform for Australian primary students in maths and English.",
                  foundingLocation: {
                    "@type": "Place",
                    name: "Adelaide, South Australia",
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "Australia",
                  },
                },
                {
                  "@type": "WebSite",
                  name: "Upwise",
                  url: "https://upwise.com.au",
                  publisher: {
                    "@type": "Organization",
                    name: "Upwise",
                  },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "Upwise",
                  applicationCategory: "EducationalApplication",
                  operatingSystem: "Web",
                  url: "https://upwise.com.au",
                  description:
                    "AI-powered mastery learning for Australian primary students (Prep-Year 7) in maths and English.",
                  offers: [
                    {
                      "@type": "Offer",
                      name: "Standard",
                      price: "39",
                      priceCurrency: "AUD",
                      description: "One child, all subjects",
                    },
                    {
                      "@type": "Offer",
                      name: "Family",
                      price: "59",
                      priceCurrency: "AUD",
                      description: "Up to 3 children, all subjects",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${fontBody.variable} ${fontDisplay.variable} min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
