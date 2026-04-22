"use client";

import Link from "next/link";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";

export default function PrivacyPolicyPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
          <button
            onClick={() => setShowWaitlist(true)}
            className="text-sm font-semibold text-white bg-[#4F8CF7] hover:bg-[#3B7AE8] active:scale-[0.97] px-5 py-2.5 rounded-full transition-all"
          >
            Join the Waitlist
          </button>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-8 inline-block">
          Draft for review. Not yet reviewed by a solicitor.
        </p>

        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: 22 April 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-[15px] leading-relaxed text-gray-600">

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Who we are</h2>
            <p>
              Upwise is operated by Techne AI Pty Ltd (ABN pending), based in Adelaide, South Australia.
              When we say &quot;Upwise&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;, we mean Techne AI Pty Ltd.
            </p>
            <p className="mt-3">
              Upwise is a personalised learning platform for Australian children in Prep to Year 7,
              covering maths, reading, writing, spelling and grammar. Parents set up accounts and guide
              their child&apos;s learning.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">What we collect</h2>
            <p>We collect the minimum data needed to provide personalised learning.</p>

            <h3 className="font-display text-base font-semibold text-gray-800 mt-5 mb-2">From parents</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name and email address</li>
              <li>Payment information (processed by Stripe, see below)</li>
              <li>Preferences such as rewards mode settings</li>
            </ul>

            <h3 className="font-display text-base font-semibold text-gray-800 mt-5 mb-2">From children</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>First name (we do not require a surname)</li>
              <li>Year level and date of birth (optional)</li>
              <li>Learning responses: answers to questions, accuracy, time taken</li>
              <li>Skill mastery data and diagnostic results</li>
              <li>Theme and interest preferences</li>
            </ul>

            <h3 className="font-display text-base font-semibold text-gray-800 mt-5 mb-2">Automatically</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device type and browser information</li>
              <li>Session timestamps and duration</li>
              <li>Pages visited within the application</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">How we use your data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To personalise learning: adapting question difficulty, selecting skills to practise, and tracking mastery</li>
              <li>To generate age-appropriate questions using AI (see AI section below)</li>
              <li>To provide parent dashboards with progress reports and briefings</li>
              <li>To process payments and manage subscriptions</li>
              <li>To improve the platform and fix issues</li>
            </ul>
            <p className="mt-3">
              We do not sell your data. We do not show advertising to children. We do not use
              children&apos;s data for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Children&apos;s data</h2>
            <p>
              We take the protection of children&apos;s data seriously. Our approach aligns with the
              Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth) and the eSafety
              Commissioner&apos;s guidance on child safety.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Children cannot create accounts on their own. A parent or guardian must set up the account.</li>
              <li>We collect only what is necessary for the learning experience.</li>
              <li>Children&apos;s data is not shared with advertisers or used for profiling beyond the learning platform.</li>
              <li>Parents can view, export or delete their child&apos;s data at any time by contacting us.</li>
              <li>We do not knowingly collect data from children without parental involvement.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">AI-generated content</h2>
            <p>
              Upwise uses artificial intelligence (provided by Anthropic) to generate age-appropriate
              questions aligned with the Australian Curriculum (ACARA). The AI does not interact directly
              with children. It generates questions that are reviewed and validated before being shown.
            </p>
            <p className="mt-3">
              Learning response data (answers, accuracy, patterns) is used by our adaptive engine
              to select appropriate questions. This data is not sent to third-party AI providers.
              Question generation uses curriculum standards and skill descriptions only, not individual
              student data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Payment data</h2>
            <p>
              Payments are processed by Stripe. We do not store credit card numbers, CVVs or bank
              account details on our servers. Stripe handles all payment information in accordance
              with PCI DSS standards. For more information, see{" "}
              <a href="https://stripe.com/au/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4F8CF7] hover:underline">
                Stripe&apos;s Privacy Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Cookies and analytics</h2>
            <p>
              We use essential cookies to keep you signed in and remember your preferences.
              We do not use third-party advertising cookies or tracking pixels. We may use
              basic analytics to understand how the platform is used and to improve it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Data storage and security</h2>
            <p>
              Your data is stored securely using encrypted databases hosted by Railway (cloud
              infrastructure). We use HTTPS for all connections, hash passwords using industry-standard
              algorithms, and apply rate limiting to protect against misuse.
            </p>
            <p className="mt-3">
              While we take reasonable steps to protect your data, no system is completely secure.
              If we become aware of a data breach that affects you, we will notify you as required
              by Australian law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Data retention and deletion</h2>
            <p>
              We retain your data for as long as your account is active. If you cancel your
              subscription, your data remains accessible for 90 days in case you choose to return.
              After 90 days, we may delete your data.
            </p>
            <p className="mt-3">
              You can request deletion of your account and all associated data at any time by
              emailing us. We will process deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Third parties</h2>
            <p>We share data with the following third parties, only as needed to operate the service:</p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li><strong>Stripe</strong> for payment processing</li>
              <li><strong>Anthropic</strong> for AI question generation (curriculum data only, not student data)</li>
              <li><strong>Railway</strong> for cloud hosting and database infrastructure</li>
              <li><strong>Clerk</strong> for authentication (when enabled)</li>
            </ul>
            <p className="mt-3">
              We do not sell or share your data with data brokers, advertisers or social media platforms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Your rights</h2>
            <p>Under Australian privacy law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Access the personal information we hold about you or your child</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Complain to the Office of the Australian Information Commissioner (OAIC) if you believe we have breached your privacy</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Changes to this policy</h2>
            <p>
              We may update this policy from time to time. If we make significant changes, we will
              notify you by email or through the platform. The &quot;last updated&quot; date at the
              top of this page will always reflect the most recent version.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Contact us</h2>
            <p>
              If you have questions about this privacy policy or how we handle your data:
            </p>
            <ul className="list-none space-y-1 mt-3">
              <li><strong>Email:</strong> privacy@upwise.com.au</li>
              <li><strong>Company:</strong> Techne AI Pty Ltd</li>
              <li><strong>Location:</strong> Adelaide, South Australia</li>
            </ul>
            <p className="mt-3">
              If you are not satisfied with our response, you can lodge a complaint with the{" "}
              <a href="https://www.oaic.gov.au/privacy/privacy-complaints" target="_blank" rel="noopener noreferrer" className="text-[#4F8CF7] hover:underline">
                Office of the Australian Information Commissioner
              </a>.
            </p>
          </section>

        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Techne AI Pty Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <span className="text-gray-500">Privacy Policy</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </main>
  );
}
