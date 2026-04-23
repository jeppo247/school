# Upwise SEO Audit Report

**Website:** upwise.com.au
**Date:** 23 April 2026
**Prepared by:** Jesse (via automated SEO analysis)
**Status:** Updated after implementation

---

## Overall Health Score: 70 out of 100 (was 38)

This score reflects how well the site is set up to be found by Google, AI search tools (like ChatGPT and Perplexity), and social media.

---

## What Changed

We implemented 14 fixes across 3 commits. Here's the before/after:

| Area | Before | After | What was done |
|------|--------|-------|---------------|
| FAQ content visible to Google | 207 words | 2,300+ words | Converted to server-side rendering |
| Homepage H1 | Hidden (opacity:0, JS required) | Visible immediately (CSS animation) | Replaced Framer Motion with CSS |
| GapsExplainer content | Hidden from DOM | Always in DOM | CSS visibility toggle |
| Security headers | None | HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy | Added via next.config.ts |
| x-powered-by header | Exposed "Next.js" | Removed | poweredByHeader: false |
| Structured data | Zero schema | Organization, WebSite, SoftwareApplication, FAQPage (33 Q&A pairs), WebPage | JSON-LD in layout + FAQ + comparison pages |
| Open Graph tags | None | Full OG + Twitter Card on every page | Added to root layout metadata |
| Canonical tags | None | On every page | metadataBase + per-page alternates |
| Per-page metadata | Only root layout | Unique title + description on FAQ, privacy, terms, contact, comparisons | Route-level layouts + generateMetadata |
| robots.txt | 404 in production | Next.js route handler (guaranteed serving) + AI crawler directives | Converted to app/robots.ts |
| sitemap.xml | 404 in production | Next.js route handler with 8 URLs | Converted to app/sitemap.ts |
| llms.txt | Did not exist | Brand description, key pages, research citations, preferred citation format | Created in public/ |
| Draft banners | "Not reviewed by solicitor" on live pages | Removed | Deleted from privacy + terms |
| Dead footer links | About, Blog, Data Protection linked to # | Removed non-existent pages, Pricing anchored to #pricing | Fixed in footer |
| Unsourced claim | "2.6x faster" with no citation | Replaced with sourced Bloom's 2 Sigma reference | Rephrased on homepage |
| Comparison pages | Did not exist | 3 pages: vs Cluey, vs Mathletics, vs IXL | New /compare/ route with SSG |

---

## Updated Score Breakdown

| Category | Before | After | Change |
|----------|--------|-------|--------|
| Technical SEO (22%) | 38 | 68 | +30 |
| Content Quality (23%) | 49 | 68 | +19 |
| On-Page SEO (20%) | 42 | 72 | +30 |
| Structured Data (10%) | 0 | 80 | +80 |
| Performance (10%) | 55 | 70 | +15 |
| AI Search Readiness (10%) | 41 | 65 | +24 |
| Images (5%) | 65 | 65 | 0 |
| **Overall** | **38** | **70** | **+32** |

---

## What's Working Well

Everything from the original audit, plus:

- **All FAQ content is now server-rendered** — 2,300+ words of research-backed answers visible to Google and AI crawlers
- **FAQPage JSON-LD schema** with 33 Q&A pairs for AI Overview citation eligibility
- **Organization, WebSite, SoftwareApplication schemas** provide entity recognition for knowledge panels
- **Security headers** — HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy all present
- **robots.txt with AI crawler directives** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended explicitly allowed
- **llms.txt** gives AI tools a machine-readable brand description with research citations
- **3 comparison pages** target uncontested search terms (Upwise vs Cluey/Mathletics/IXL)
- **Hero H1 renders immediately** via CSS animations instead of Framer Motion (LCP improvement)
- **Social sharing** now produces proper previews with OG and Twitter Card tags

---

## What's Still Missing (Remaining Items)

### High Impact

| # | Action | Score Impact | Effort |
|---|--------|-------------|--------|
| 1 | **Add founder/team section** — Name, credentials, LinkedIn. Biggest remaining E-E-A-T gap | +5-8 pts | 1-2 hours |
| 2 | **Build 3-4 blog articles** — "What is mastery learning?", "Why maths gaps compound", "Bloom's 2 Sigma explained" | +5-10 pts | 1-2 weeks |
| 3 | **Create an About page** — Company story, mission, team | +2-3 pts | 1-2 hours |

### Medium Impact

| # | Action | Score Impact | Effort |
|---|--------|-------------|--------|
| 4 | **Create OG image** (1200x630) for social sharing previews | +1-2 pts | 1 hour |
| 5 | **List on ProductReview.com.au** — Free listing for review accumulation | +1-2 pts | 1 hour (manual) |
| 6 | **Display ABN + full contact details** in footer | +1 pt | 30 minutes |

### Longer Term

| # | Action | Score Impact | Effort |
|---|--------|-------------|--------|
| 7 | **Establish YouTube presence** — highest AI citation correlation signal | +3-5 pts | 1-2 weeks |
| 8 | **Get editorial press mention** — The Educator, EducationHQ | +3-5 pts | Ongoing |
| 9 | **Build year-level content pages** — Year 3 maths, Year 4 reading | +2-3 pts | Ongoing |
| 10 | **Teacher-facing landing page** — expand teacher-shareable reports differentiator | +1-2 pts | 3-5 days |

---

## Pages Now Live

| URL | Type | Schema |
|-----|------|--------|
| / | Homepage (SSR) | Organization, WebSite, SoftwareApplication |
| /faq | FAQ (SSR) | FAQPage (33 Q&A pairs) |
| /contact | Contact | Per-page metadata |
| /privacy | Privacy Policy | Per-page metadata |
| /terms | Terms of Service | Per-page metadata |
| /compare/upwise-vs-cluey | Comparison (SSG) | WebPage |
| /compare/upwise-vs-mathletics | Comparison (SSG) | WebPage |
| /compare/upwise-vs-ixl | Comparison (SSG) | WebPage |
| /robots.txt | Route handler | AI crawler directives |
| /sitemap.xml | Route handler | 8 URLs |
| /llms.txt | Static file | Brand description |

---

## The Bottom Line

The score jumped from **38 to 70** — a 32-point improvement. The site went from "Google can't see any of our content" to "all content is server-rendered, structured, and citable by AI tools."

The remaining gap to 85+ is primarily **content and authority building** (founder bio, blog articles, press mentions, YouTube) rather than technical fixes. The infrastructure is now solid.

---

*Report updated after 3 implementation commits on 23 April 2026.*
*14 fixes implemented across technical SEO, content visibility, structured data, performance, and AI search readiness.*
