# Upwise SEO Audit Report

**Website:** upwise.com.au
**Date:** 23 April 2026
**Prepared by:** Jesse (via automated SEO analysis)

---

## Overall Health Score: 38 out of 100

This score reflects how well the site is set up to be found by Google, AI search tools (like ChatGPT and Perplexity), and social media. It does **not** reflect the quality of the product or the content — both of which are strong.

---

## The Good News

The content on Upwise is genuinely excellent. Several independent analysis tools flagged the following strengths:

- **Research quality is well above average.** The site cites real peer-reviewed studies from Nature, PNAS, and Harvard with specific effect sizes and author names. Most competitors in this space cite nothing.
- **The value proposition is clear.** "A smarter alternative to traditional tutoring" is well-positioned for Australian parents paying $60-$100/hour for private tutoring.
- **Pricing is transparent.** Showing $39/month and $59/month on the homepage builds trust. Most competitors hide pricing.
- **Privacy and Terms are substantive.** The legal documents reference the Australian Privacy Principles and the Privacy Act 1988 correctly — far better than typical startup boilerplate.
- **The FAQ content is outstanding.** Over 2,300 words of well-sourced, parent-friendly answers covering how it works, the research, safety, and pricing.
- **No AI-generated content red flags.** The writing has a consistent, specific, founder-authored voice that quality reviewers would rate positively.

---

## What's Holding the Score Back

The low score comes from **technical infrastructure problems**, not content problems. Here's what that means in plain terms:

### 1. Google can't read the page content (Critical)

The site is built in a way where the text only appears after JavaScript runs in the browser. When Google's crawler visits, it sees an almost-empty page. The FAQ — which has 2,300 words of great content — shows up as roughly 200 words to Google. All those research citations, all the parent Q&A... invisible.

**What this means:** The site effectively doesn't exist in Google's eyes for most of its content.

### 2. No roadmap for search engines (Critical)

Two files that every website needs — `robots.txt` (tells search engines what to look at) and `sitemap.xml` (lists all the pages) — are returning errors when Google tries to access them. They exist in the code but aren't being served by the hosting platform.

**What this means:** Google is navigating the site blind, with no guidance on what pages exist.

### 3. No structured data (Critical)

Structured data is a way of labelling content so Google and AI tools can understand what the site is about — "this is an educational software product", "this is a FAQ", "this is an organisation based in Adelaide". Upwise has zero structured data. Every competitor in the top 10 search results has it.

**What this means:** Upwise can't appear in rich search results (FAQ dropdowns, star ratings, price displays, app carousels) even if it did rank.

### 4. No security headers (Critical)

The site is missing standard security protections that browsers and search engines expect. For a product that handles children's data, this is particularly important. Headers like HSTS (forces secure connections) and CSP (prevents code injection) are absent.

**What this means:** Both a security risk and a trust signal that quality reviewers look for.

### 5. AI search tools can't cite the content (High)

Tools like ChatGPT, Perplexity, and Google's AI Overviews are increasingly how parents discover products. Upwise scores 41/100 for AI search readiness. The research citations would be perfect for AI to quote — but they're locked behind JavaScript and there's no `llms.txt` file (the equivalent of a business card for AI tools).

### 6. Nobody knows who built it (High)

There is no founder name, team section, credentials, or professional background anywhere on the site. The only attribution is "Techne AI Pty Ltd, Adelaide." For a product asking parents to trust it with their children's learning, this is a significant gap. Google's quality guidelines specifically look for this under "Expertise" and "Trustworthiness."

### 7. Draft banners on legal pages (High)

The Privacy Policy and Terms of Service both display "Draft for review. Not yet reviewed by a solicitor." on the live production site. For a product handling children's data, this actively undermines trust.

### 8. Wrong page type for search (Structural)

When parents search "online maths tutoring Australia" or "primary school learning app", every result on the first page of Google is either an active product you can sign up for, or a comparison guide. Zero pre-launch waitlist pages appear. The homepage — as a waitlist page — cannot compete in these results regardless of how good the content is.

---

## What the Competitors Look Like

For context, here's what ranks on page 1 of Google for the keywords Upwise would target:

| Competitor | What They Have | Reviews/Social Proof |
|---|---|---|
| Cluey Learning | Active product, video demos, structured data | 33,000+ students |
| Kinetic Education | Service page, star ratings in Google | 1,719 verified reviews |
| MathsOnline | Product homepage, founder visible | "Australia's #1" positioning |
| Mathletics | Curriculum badges, school adoption | Global brand, millions of users |
| IXL | Product homepage, curriculum depth | 18M+ users worldwide |

Upwise's **research-backed positioning** is a genuine differentiator none of these competitors have. But the technical barriers mean Google can't see it yet.

---

## Priority Fixes (Ranked by Impact)

### Must Do Before Launch

| Priority | What | Why It Matters | Time Needed |
|---|---|---|---|
| 1 | Make content visible to Google | Unlocks everything else. All that research and FAQ content becomes findable. | 2-4 days dev work |
| 2 | Fix robots.txt and sitemap | Gives Google a map of the site | 2-3 hours |
| 3 | Add security headers | Protects users and builds trust signals | 2-3 hours |
| 4 | Add structured data | Enables rich search results and AI citations | 1-2 days |
| 5 | Add social sharing tags | Links shared on Facebook/LinkedIn show real previews instead of blank boxes | 2-3 hours |
| 6 | Remove "Draft" banners | Immediate trust improvement | 5 minutes |
| 7 | Add canonical tags | Prevents duplicate content confusion | 30 minutes |

### Should Do Within 2 Weeks of Launch

| Priority | What | Why It Matters |
|---|---|---|
| 8 | Add a founder/team section | Parents want to know who built this |
| 9 | Fix or remove dead footer links | About, Blog, Data Protection all go nowhere |
| 10 | Add AI search file (llms.txt) | Makes the site citable by ChatGPT, Perplexity, etc. |
| 11 | Source the "2.6x faster" claim | It's the only unsourced statistic on the site |

### Should Do Within First Month

| Priority | What | Why It Matters |
|---|---|---|
| 12 | Launch blog with 3-4 articles | "What is mastery learning?", "Why maths gaps compound" — these can rank with low competition |
| 13 | Create comparison pages | "Upwise vs Cluey", "Upwise vs Mathletics" — no one owns these search terms yet |
| 14 | List on ProductReview.com.au | Free, appears in search results, gives early users a place to review |
| 15 | Display ABN and full contact details | Basic Australian business trust requirement |

### Longer Term (3-6 Months)

| Priority | What | Why It Matters |
|---|---|---|
| 16 | Create a YouTube explainer video | YouTube presence has the strongest correlation with AI tool citations |
| 17 | Get mentioned in The Educator or EducationHQ | One editorial mention would significantly boost authority |
| 18 | Build year-level content pages | "Year 3 maths gaps", "Year 4 reading help" — long-tail search traffic |
| 19 | Build a teacher-facing landing page | "Teacher-shareable reports" is a unique feature no competitor offers at this price |

---

## The Bottom Line

The score of 38/100 sounds alarming, but the path to 70+ is mostly **technical plumbing**, not content creation. The hard part — writing genuine, research-backed content that differentiates from competitors — is already done well.

The top 4 fixes (making content visible to Google, fixing the sitemap, adding security headers, and adding structured data) are all engineering tasks that could be completed in a focused week of work. Doing just these four would likely lift the score to approximately **60-65/100**.

The content quality, research citations, and transparent pricing position Upwise well against competitors who have years of reviews and social proof but cite zero research. Once Google can actually see the content, the site has a genuine path to ranking.

---

## Score Breakdown Detail

| Category | Score | What It Measures |
|---|---|---|
| Technical SEO | 38/100 | Can search engines crawl and index the site correctly? |
| Content Quality | 49/100 | Is the content trustworthy, expert, and substantial? |
| On-Page SEO | 42/100 | Are titles, descriptions, headings, and tags optimised? |
| Structured Data | 0/100 | Does the site tell Google what type of content each page contains? |
| Performance | 55/100 | Does the site load fast and respond to interactions quickly? |
| AI Search Readiness | 41/100 | Can AI tools (ChatGPT, Perplexity, Google AI) find and cite the content? |
| Images | 65/100 | Are images optimised? (Site uses SVG graphics — no major issues) |

---

*Report generated from 8 parallel specialist analyses covering technical SEO, content quality, schema markup, sitemap structure, performance, visual/mobile presentation, AI search optimisation, and search experience.*
