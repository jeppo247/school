import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold text-[#4F8CF7]">
            Upwise
          </Link>
          <Link
            href="/start"
            className="text-sm font-semibold text-white bg-[#4F8CF7] hover:bg-[#3A6CD4] px-5 py-2.5 rounded-full transition-all"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-8 inline-block">
          Draft for review. Not yet reviewed by a solicitor.
        </p>

        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: 22 April 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-[15px] leading-relaxed text-gray-600">

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Agreement to terms</h2>
            <p>
              By accessing or using Upwise, you agree to be bound by these Terms of Service. If you do
              not agree, please do not use the platform. These terms constitute a legally binding agreement
              between you and Techne AI Pty Ltd (ABN pending), based in Adelaide, South Australia.
            </p>
            <p className="mt-3">
              If you are setting up an account for a child, you confirm that you are their parent or
              legal guardian and that you consent to their use of Upwise under your supervision.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">What Upwise is</h2>
            <p>
              Upwise is a personalised learning platform for Australian children in Prep to Year 7.
              It covers maths, reading, writing, spelling and grammar, aligned with the Australian
              Curriculum (ACARA).
            </p>
            <p className="mt-3">
              Upwise is a supplementary learning tool. It is not a substitute for school education,
              professional tutoring, or specialist educational support. It does not diagnose learning
              disabilities or provide medical or psychological advice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Accounts and parental responsibility</h2>
            <p>
              Parents or guardians are responsible for creating accounts and managing their child&apos;s
              use of the platform. You are responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Providing accurate information during registration</li>
              <li>Keeping your account credentials secure</li>
              <li>Supervising your child&apos;s use of the platform as appropriate for their age</li>
              <li>Ensuring the year level and other details you provide are correct</li>
            </ul>
            <p className="mt-3">
              Children cannot create accounts independently. All child accounts are linked to a parent
              or guardian account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Free trial and subscriptions</h2>
            <p>
              Upwise offers a 7-day free trial with full access to all features. No credit card is
              required to start the free trial.
            </p>
            <p className="mt-3">After the trial, you may subscribe to one of our paid plans:</p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li><strong>Standard ($39/month):</strong> Full access for one child</li>
              <li><strong>Family ($59/month):</strong> Full access for up to four children</li>
            </ul>
            <p className="mt-3">
              Subscriptions renew automatically each month. You can cancel at any time through the
              platform or by contacting us. Cancellation takes effect at the end of the current
              billing period. We do not offer partial refunds for unused portions of a billing period.
            </p>
            <p className="mt-3">
              We reserve the right to change our pricing with 30 days notice. Price changes will not
              affect your current billing period.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Use the platform for any unlawful purpose</li>
              <li>Attempt to access other users&apos; accounts or data</li>
              <li>Reverse-engineer, decompile or attempt to extract the source code of the platform</li>
              <li>Use automated tools to scrape content or overload the service</li>
              <li>Share your account with anyone outside your immediate family</li>
              <li>Misrepresent a child&apos;s year level or age to access inappropriate content</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Intellectual property</h2>
            <p>
              All content on the platform, including questions, explanations, illustrations, software
              and design, is owned by Techne AI Pty Ltd or used under licence. You may not reproduce,
              distribute or create derivative works from our content without written permission.
            </p>
            <p className="mt-3">
              The Australian Curriculum content referenced by Upwise is developed by the Australian
              Curriculum, Assessment and Reporting Authority (ACARA). ACARA does not endorse Upwise
              or any specific product. Curriculum content descriptions are used for alignment purposes
              only.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">AI-generated content</h2>
            <p>
              Some questions and educational content on Upwise are generated using artificial intelligence.
              While we validate AI-generated content for accuracy and age-appropriateness, we cannot
              guarantee that every piece of content is free from errors.
            </p>
            <p className="mt-3">
              If you or your child encounter content that seems incorrect or inappropriate, please
              report it to us using the &quot;Ask an adult&quot; feature or by emailing us directly.
              We take all content reports seriously and will review them promptly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Availability and changes</h2>
            <p>
              We aim to keep Upwise available at all times but do not guarantee uninterrupted access.
              We may need to take the platform offline for maintenance, updates or unforeseen technical
              issues.
            </p>
            <p className="mt-3">
              We may update features, content and the structure of the platform from time to time.
              We will try to notify you of significant changes but are not obligated to maintain
              any particular feature.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by Australian law, Techne AI Pty Ltd is not liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>Any indirect, incidental or consequential damages arising from your use of the platform</li>
              <li>Loss of data, profits or anticipated savings</li>
              <li>Errors in AI-generated content</li>
              <li>Interruptions to service availability</li>
              <li>Learning outcomes or academic performance</li>
            </ul>
            <p className="mt-3">
              Nothing in these terms excludes or limits liability that cannot be excluded under
              Australian Consumer Law, including guarantees relating to the provision of services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Termination</h2>
            <p>
              You may close your account at any time by contacting us. We may suspend or terminate
              your account if you breach these terms, with or without notice depending on the severity
              of the breach.
            </p>
            <p className="mt-3">
              On termination, your right to use the platform ceases immediately. We will retain your
              data for 90 days in case you wish to return, after which it may be deleted. See our{" "}
              <Link href="/privacy" className="text-[#4F8CF7] hover:underline">Privacy Policy</Link>{" "}
              for more details.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Changes to these terms</h2>
            <p>
              We may update these terms from time to time. If we make material changes, we will notify
              you by email or through the platform at least 14 days before the changes take effect.
              Your continued use of the platform after changes take effect constitutes acceptance of
              the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Governing law</h2>
            <p>
              These terms are governed by the laws of South Australia, Australia. Any disputes arising
              from these terms will be subject to the exclusive jurisdiction of the courts of South
              Australia. Nothing in these terms limits your rights under the Australian Consumer Law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Contact us</h2>
            <p>
              If you have questions about these terms:
            </p>
            <ul className="list-none space-y-1 mt-3">
              <li><strong>Email:</strong> hello@upwise.com.au</li>
              <li><strong>Company:</strong> Techne AI Pty Ltd</li>
              <li><strong>Location:</strong> Adelaide, South Australia</li>
            </ul>
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
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-gray-500">Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
