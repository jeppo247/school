# Upwise Brand Guardrails — Implementation Plan

> Generated: 2026-04-22
> Source: `/Users/jesse/Downloads/Upwise Brand Guardrails.pptx` (7 slides)
> Purpose: Audit the current codebase against the brand guardrails and produce actionable changes.

---

## Part 1: Brand Guardrails Summary

### 1.1 Positioning Anchor (Slide 7 — the single sentence everything flows from)

> **"Upwise helps primary school children build strong foundations in maths and English through personalised learning that works alongside school."**

Three pillars derive from this:
- **Child-first** — outcomes and confidence lead
- **School-positive** — partner, not replacement
- **Evidence-based** — learning science at the core

### 1.2 Positioning Discipline (Slide 2)

Upwise is **one thing clearly**: *A smarter alternative to traditional tutoring — personalised, evidence-based, outcome-led.*

**What we are NOT:**
- Tutoring marketplace
- School replacement
- Homework babysitter
- AI hype platform
- Test-cram tool
- Edtech commodity

### 1.3 What We ARE (Slide 3)

| Identity | Explanation |
|----------|-------------|
| A Smarter Alternative | Modern, personalised learning support — not a tutor marketplace |
| A Partner to Schools | We strengthen what happens at school, never replace it |
| Mastery of Foundations | Maths, reading, spelling, writing, comprehension — done right |
| Outcome-Led | Confidence, capability, progress and independence |
| Personalised at Scale | Right level, right sequence, right pace — for every child |
| Trustworthy & Evidence-Based | Built on learning science, mastery learning, deliberate practice |

### 1.4 What We Are NOT (Slide 4) — Do's and Don'ts

| Category | DON'T say | DO say |
|----------|-----------|--------|
| Not anti-school | "Schools are failing children." | "Schools do incredible work — children sometimes need more personalised support." |
| Not homework babysitting | "We help kids finish their worksheets." | "We build deep capability, not compliance." |
| Not screen-time junk | "Gamified dopamine loops." | "Deliberate practice. Real progress. Real mastery." |
| Not 'AI replacing humans' | "AI is our product." | "AI is invisible infrastructure. Outcomes are the message." |
| Not test-cram only | "NAPLAN prep platform." | "NAPLAN is one use case, not our identity." |
| Not cheap commodity tutoring | "Affordable tutoring for everyone." | "Premium, evidence-based support worth investing in." |

### 1.5 Messaging Guardrails (Slide 5)

> *"Technology is mechanism, not message."*

**ALWAYS lead with:**
- Child outcomes
- Confidence
- Personalised support
- Progress
- Mastery
- Peace of mind for parents

**RARELY lead with:**
- AI / Algorithms
- Adaptive engines
- Machine learning
- Dashboards
- Productivity claims

> *"Parents buy outcomes and confidence — not features and engines."*

### 1.6 Tone Guardrails (Slide 6)

**SHOULD feel:**
Smart, Warm, Calm, Trustworthy, Modern, Premium, Parent-first

**SHOULD NOT feel:**
Silicon Valley hype, Robotic, Gimmicky, Childish, Fear-based, Anti-teacher, Bargain-bin tutoring

### 1.7 Visual Identity (from PPTX formatting)

The PPTX itself uses a consistent visual language:
- **Dark navy background** for hero sections: approximately `#1B2B4B` / `#0F1729`
- **Sage/mint green accent**: `#9FC4B0` (used for category labels, anchor pillar highlights)
- **Muted blue-grey**: `#8FA8B8` (used for subtitles)
- **Warm dark text**: `#2D3748` (body copy)
- **Secondary text**: `#64748B` (muted explanations)
- **Error/don't red**: `#B91C1C` (for "what we are NOT")
- **Correct/do green**: `#5C8A6E` (for "what we are" corrections)
- **White**: `#FFFFFF` (headers on dark backgrounds)

---

## Part 2: Codebase Audit

### 2.1 What Is Already Aligned

The codebase is **substantially aligned** in several areas:

1. **Positioning anchor is used verbatim.** The hero subtitle on `page.tsx` line 175 reads: *"A smarter alternative to traditional tutoring — personalised, evidence-based, outcome-led."* This matches slide 2 exactly.

2. **School-positive messaging.** The FAQ page (both parent and teacher sections) consistently frames Upwise as complementary to school, never adversarial. Teacher FAQ explicitly says "Absolutely not" to replacing teachers.

3. **NAPLAN positioning is careful.** NAPLAN is mentioned as a feature ("All 5 NAPLAN domains") but not as the identity. The FAQ answer on "How does it help with NAPLAN?" positions it as building foundational skills, not test-cramming — aligned with the guardrail "NAPLAN is one use case, not our identity."

4. **Mastery-first language.** The hero headline ("Every child can master what school moves past"), the comparison table, the three-step flow (Diagnose / Learn / Master), and the research citations all lead with mastery and outcomes.

5. **Parent-first orientation.** The "Parent Layer" section, daily briefing mock-up, and parent features list all lead with parent peace-of-mind and guidance — aligned with "Parent-first" tone.

6. **Evidence-based claims.** Research citations (Bloom, Kulik, Carnegie, AI tutoring review) are backed by sources, not hand-waved.

7. **Typography.** Uses Fredoka (display) + Inter (body) — matches the design system and feels warm/modern without being childish on the parent-facing pages.

8. **Color system.** Primary blue `#4F8CF7`, accent orange `#FF8C42`, warm borders `#E8E2D8` — all consistent and established as brand tokens.

9. **Premium design execution.** Clay shadows, rounded corners, motion animations, white-space-rich layouts — the visual execution communicates "premium" rather than "bargain."

### 2.2 Guardrail Violations Found

#### VIOLATION 1: "AI-powered" leads in multiple places (Messaging Guardrail breach)

The guardrails say to **rarely** lead with AI. Currently:

| Location | Text | Issue |
|----------|------|-------|
| `page.tsx` line 544 | "Research shows AI-powered learning is 2.6x faster with a human guide." | Leads with AI as the headline concept |
| `page.tsx` line 911 | "AI-powered adaptive learning for Australian primary students." | Footer description leads with AI |
| `layout.tsx` line 21 | "AI-powered adaptive learning for Australian primary students." | Meta description leads with AI |
| `faq/page.tsx` line 58 | "An AI-powered learning system..." | FAQ answer for "What is Upwise?" leads with AI |

**Severity: P1** — These are the most visible surfaces (footer, meta description, hero section, first FAQ answer). They directly contradict the guardrail: *"AI is invisible infrastructure. Outcomes are the message."*

#### VIOLATION 2: Tech-forward language in parent-facing copy

| Location | Text | Issue |
|----------|------|-------|
| `page.tsx` line 452 | "Our AI pinpoints exactly which skills they've mastered" | AI leads the sentence |
| `page.tsx` line 407 | "mastery learning (proven over 40 years) + adaptive AI (first credible attempt...)" | Positions AI as the headline innovation |
| `page.tsx` line 465 | "Questions stay in the sweet spot" | Fine — but the step title "Learn" could be warmer |

**Severity: P2** — These are within body copy, not headlines, but still lean tech-forward.

#### VIOLATION 3: Pricing section header implies "bargain" positioning

`page.tsx` line 711: **"Less than a single tutoring session"**

The guardrails explicitly say:
- DON'T: "Affordable tutoring for everyone."
- DO: "Premium, evidence-based support worth investing in."

Leading with price comparison against tutoring positions Upwise as a cheaper alternative (commodity framing) rather than a premium, evidence-based investment.

**Severity: P1** — The pricing section header is a high-visibility brand statement.

#### VIOLATION 4: "Gamified" features section title — "Learning that feels like play"

`page.tsx` line 631: **"Learning that feels like play"**

The guardrails say:
- DON'T: "Gamified dopamine loops."
- DO: "Deliberate practice. Real progress. Real mastery."

While "feels like play" is not exactly "dopamine loops," it leans toward the "screen-time junk" positioning the guardrails explicitly reject. The features listed (gold coins, streaks, XP, themes) could easily read as gamification-forward rather than mastery-forward.

**Severity: P2** — The underlying features are fine (themes, adaptive difficulty, spaced repetition are all mastery-aligned), but the section framing puts gamification front-and-center.

#### VIOLATION 5: Hero headline is gap-focused, not confidence-focused

`page.tsx` line 153: **"Every child can master what school moves past"**

This is close to good but subtly violates two guardrails:
1. It implies schools are failing ("moves past" = school leaves children behind) — conflicts with "Schools do incredible work."
2. It leads with the problem (gaps) rather than the outcome (confidence, capability).

The positioning anchor says: *"Upwise helps primary school children build strong foundations."* The current headline is about what school doesn't do, not what Upwise helps children achieve.

**Severity: P2** — It's not explicitly anti-school, but the framing is negative rather than positive.

#### VIOLATION 6: NAPLAN is feature-listed prominently in pricing

All three pricing tiers list "All 5 NAPLAN domains" as a bullet feature. While this is factual, when combined with the "150+ Skill nodes mapped / ACARA / Prep-Y7" social proof bar, NAPLAN appears prominently enough that a casual reader might categorize Upwise as a NAPLAN prep tool.

**Severity: P3** — Not a hard violation (NAPLAN is a real feature), but the guardrail says "NAPLAN is one use case, not our identity." Consider rewording to "Maths & English — all core skills" or similar.

#### VIOLATION 7: "Adaptive Difficulty" feature name is tech-jargon

`page.tsx` line 649: Feature card titled **"Adaptive Difficulty"**

Parents don't buy "adaptive difficulty." They buy "questions at the right level for my child." This is tech-mechanism language, not outcome language.

**Severity: P3** — It's a feature card, not a headline, but it breaks the "technology is mechanism, not message" guardrail.

#### VIOLATION 8: No warmth signals in the navigation / header

The nav bar is functional (`Upwise | FAQ | Sign In | Get Started Free`) but feels like a SaaS product, not a warm, trustworthy education brand. The guardrails say the brand should feel **warm, calm, trustworthy** — the current nav is purely transactional.

**Severity: P3** — Minor, but the first impression should feel warmer.

#### VIOLATION 9: Footer describes Upwise as tech, not outcomes

`page.tsx` line 911: "AI-powered adaptive learning for Australian primary students."

This is the brand description in the footer. Per the guardrails, this should lead with outcomes/confidence, not technology.

**Severity: P1** — This text is likely used by search engines and social sharing. It should be the positioning anchor or an outcome-led variant.

#### VIOLATION 10: Meta description leads with AI

`layout.tsx` line 21: `"AI-powered adaptive learning for Australian primary students. Find gaps, build mastery, and learn with confidence."`

Same issue as the footer. The meta description is what appears in Google search results.

**Severity: P1** — This is SEO-critical and brand-defining.

---

## Part 3: Specific Changes Required

### P1 — Critical Brand Violations (Fix immediately)

#### P1-1: Rewrite meta description to lead with outcomes

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/layout.tsx` (line 21)

**Current:**
```
"AI-powered adaptive learning for Australian primary students. Find gaps, build mastery, and learn with confidence."
```

**Proposed:**
```
"Personalised learning that helps Australian primary students build strong foundations in maths and English. Evidence-based, outcome-led, works alongside school."
```

This uses the positioning anchor language directly and avoids leading with AI.

#### P1-2: Rewrite footer brand description

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (line 911)

**Current:**
```
AI-powered adaptive learning for Australian primary students.
```

**Proposed:**
```
Personalised learning support that helps children build strong foundations in maths and English.
```

#### P1-3: Rewrite pricing section header

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (line 711)

**Current:**
```
Less than a single tutoring session
```

**Proposed:**
```
Invest in their foundations
```

or

```
Premium support, simple pricing
```

The sub-copy can still mention value vs. tutoring, but the header should not lead with price comparison.

#### P1-4: Rewrite "AI-powered learning" in Parent Layer section

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (line 544)

**Current:**
```
Research shows AI-powered learning is 2.6x faster with a human guide.
```

**Proposed:**
```
Research shows children learn 2.6x faster with a personal guide. Upwise makes you that guide...
```

This keeps the claim but removes AI from the lead position.

#### P1-5: Rewrite footer description on FAQ page (if present) and any other pages

Audit all pages for the same "AI-powered" footer copy and apply the same fix as P1-2.

**Files to check:**
- `/Users/jesse/Documents/Claude/school/apps/web/src/app/faq/page.tsx` (footer area)
- `/Users/jesse/Documents/Claude/school/apps/web/src/app/subscribe/page.tsx` (no footer currently)

### P2 — Important Alignment (Fix in next sprint)

#### P2-1: Rewrite hero headline to be school-positive and outcome-led

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 153-168)

**Current:**
```
Every child can master what school moves past
```

**Proposed options:**
1. "Every child can build strong foundations" (directly from positioning anchor)
2. "Confidence starts with mastery" (outcome-led)
3. "Strong foundations. Real confidence." (concise, outcome-led)

The subtitle ("A smarter alternative to traditional tutoring...") is already perfect. The headline should match its quality.

#### P2-2: Reframe "Built for Kids" features section

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 619-631)

**Current section label:** "Built for Kids"
**Current heading:** "Learning that feels like play"

**Proposed section label:** "The Learning Experience"
**Proposed heading:** "Designed for how children actually learn"

Then reorder the feature cards to lead with mastery-aligned features:
1. Adaptive Difficulty (rename to "Right level, every time") -- outcome language
2. Spaced Repetition (rename to "Built to remember") -- outcome language
3. 100% Australian -- keep as-is, strong trust signal
4. Themeable -- keep but reframe: "Their world, their way"
5. Streaks & XP (rename to "Daily habits, lasting progress")
6. Gold Coins & Rewards -- move to last, de-emphasise gamification

#### P2-3: Rewrite "Adaptive Difficulty" feature card

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (line 649)

**Current:**
```
Title: "Adaptive Difficulty"
Desc: "Questions automatically adjust to your child's level — challenging enough to grow, easy enough to stay confident"
```

**Proposed:**
```
Title: "Right Level, Every Time"
Desc: "Questions match your child's exact level — challenging enough to grow, easy enough to stay confident"
```

#### P2-4: Soften "Our AI pinpoints" language in How It Works

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (line 452)

**Current:**
```
"Your child completes a 15-minute adaptive assessment. Our AI pinpoints exactly which skills they've mastered and where the gaps are hiding."
```

**Proposed:**
```
"Your child completes a short assessment. We pinpoint exactly which skills they've mastered and where the gaps are — so learning starts in the right place."
```

Remove "AI" and "adaptive" from parent-facing copy. The mechanism is invisible; the outcome is the message.

#### P2-5: Rewrite "What is Upwise?" FAQ answer

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/faq/page.tsx` (line 58)

**Current:**
```
An AI-powered learning system that helps your child build genuine mastery...
```

**Proposed:**
```
A personalised learning system that helps your child build genuine mastery...
```

One word change. AI is mechanism, not message.

#### P2-6: Review research citations section for tech-forward framing

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 357-410)

The research section currently mixes outcome language with tech language ("adaptive AI", "AI-based cognitive tutors"). While research citations are inherently technical, the summary line at the bottom (line 407) should lead with learning outcomes, not technology:

**Current:**
```
Upwise builds on these foundations: mastery learning (proven over 40 years) + adaptive AI (first credible attempt to deliver 1:1 mastery at scale) + parent as guide (the human layer research shows is essential).
```

**Proposed:**
```
Upwise builds on these foundations: mastery learning (proven over 40 years), personalised practice at scale, and the parent as guide — the human layer research shows is essential.
```

### P3 — Nice-to-Have Polish (Backlog)

#### P3-1: Rephrase NAPLAN in pricing tier features

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 732, 747, 764)

**Current:** "All 5 NAPLAN domains"
**Proposed:** "Maths, reading, writing, spelling & grammar" or "All core literacy & numeracy skills"

This reduces NAPLAN prominence in a buying context while keeping the same factual coverage.

#### P3-2: Rephrase NAPLAN in subscribe page features

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/subscribe/page.tsx` (lines 81, 125)

Same change as P3-1.

#### P3-3: Add warmth to the navigation bar

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 104-130)

Consider adding a subtle tagline next to the logo, or warming the CTA from "Get Started Free" to "Start Your Child's Journey" or similar. Small change but shifts first impression from SaaS to education.

#### P3-4: Review social proof bar for outcome-led metrics

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 227-244)

**Current stats:**
- "150+ Skill nodes mapped" (tech-mechanism)
- "ACARA Curriculum aligned" (trust signal -- keep)
- "30 min Daily sessions" (keep)
- "Prep-Y7 Year levels" (keep)

**Proposed:** Replace "150+ Skill nodes mapped" with something outcome-led:
- "4,000+ Skills mastered" (once there is usage data)
- "167 Core skills covered" (more parent-friendly than "nodes mapped")

#### P3-5: Consider updating the `<title>` tag

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/layout.tsx` (line 19)

**Current:** "Upwise -- Learn Smarter"
**Proposed:** "Upwise -- Strong foundations in maths and English"

"Learn Smarter" is generic EdTech language. The positioning anchor is more distinctive and specific.

#### P3-6: Review CTA section copy for gap-focus vs outcome-focus

**File:** `/Users/jesse/Documents/Claude/school/apps/web/src/app/page.tsx` (lines 869-880)

**Current:** "Find out what your child already knows" / "reveals a complete gap map of your child's maths knowledge"

This is gap-focused (what's missing) rather than outcome-focused (what they can build). Consider:
"See where your child can grow" / "reveals your child's strengths and the skills they're ready to master next"

#### P3-7: Ensure design system document reflects brand guardrails

**File:** `/Users/jesse/Documents/Claude/school/ux/DESIGN_SYSTEM.md`

The design system is comprehensive but does not reference the brand guardrails. Add a section (or preamble) that encodes the messaging and tone guardrails so that anyone building new pages/components has the rules at hand.

---

## Part 4: Summary by Priority

### P1 (Critical — 5 changes)

| ID | File | Change | Why |
|----|------|--------|-----|
| P1-1 | `layout.tsx:21` | Rewrite meta description: drop "AI-powered", use positioning anchor | SEO/social first impression |
| P1-2 | `page.tsx:911` | Rewrite footer description: outcomes, not AI | Visible on every page |
| P1-3 | `page.tsx:711` | Rewrite pricing header: "Invest in their foundations" | Avoid commodity/bargain framing |
| P1-4 | `page.tsx:544` | Remove "AI-powered" from parent layer body | Lead with human guide, not tech |
| P1-5 | `page.tsx:911` + any other pages | Audit all pages for "AI-powered" footer copy | Consistency |

### P2 (Important — 6 changes)

| ID | File | Change | Why |
|----|------|--------|-----|
| P2-1 | `page.tsx:153-168` | Rewrite hero headline to be school-positive/outcome-led | First thing visitors read |
| P2-2 | `page.tsx:619-631` | Reframe features section: outcomes over gamification | Avoid "screen-time junk" perception |
| P2-3 | `page.tsx:649` | Rename "Adaptive Difficulty" to outcome language | Tech jargon in parent-facing UI |
| P2-4 | `page.tsx:452` | Remove "AI" from Diagnose step description | Mechanism vs. message |
| P2-5 | `faq/page.tsx:58` | Change "AI-powered" to "personalised" in FAQ | First FAQ answer sets tone |
| P2-6 | `page.tsx:407` | Rewrite research summary to de-emphasise tech | Bottom of evidence section |

### P3 (Polish — 7 changes)

| ID | File | Change | Why |
|----|------|--------|-----|
| P3-1 | `page.tsx:732,747,764` | Rephrase "All 5 NAPLAN domains" to skill-based language | Avoid NAPLAN-as-identity |
| P3-2 | `subscribe/page.tsx:81,125` | Same NAPLAN rephrase | Consistency with landing page |
| P3-3 | `page.tsx:104-130` | Warm up nav CTA language | First impression warmth |
| P3-4 | `page.tsx:227-244` | Replace "Skill nodes mapped" with outcome metric | Tech-mechanism stat |
| P3-5 | `layout.tsx:19` | Update `<title>` to use positioning anchor | Browser tab / SEO |
| P3-6 | `page.tsx:869-880` | Reframe CTA section from gap-focus to growth-focus | Positive framing |
| P3-7 | `ux/DESIGN_SYSTEM.md` | Add brand guardrails section | Developer reference |

---

## Part 5: What Is NOT Changing

The following elements are **already well-aligned** and should be preserved:

1. **Hero subtitle** ("A smarter alternative to traditional tutoring...") -- exact brand positioning
2. **Mastery vs Traditional comparison table** -- leads with child outcomes, not tech
3. **Three-step flow** (Diagnose / Learn / Master) -- clear, outcome-led
4. **Research citations section** -- evidence-based credibility (just soften the summary line)
5. **Parent briefing mock-up** -- shows warm, practical parent guidance
6. **FAQ content** (both parent and teacher) -- school-positive, research-backed, balanced
7. **Visual design system** -- premium feel, warm borders, clay shadows, Fredoka + Inter fonts
8. **Color palette** -- `#4F8CF7` brand blue, `#FF8C42` accent orange, warm neutrals
9. **Theme system** -- supports personalisation without gimmickry
10. **"100% Australian" feature card** -- strong trust signal, keep as-is

---

## Part 6: Implementation Notes

### Order of Execution

1. Start with P1 items -- they are all copy changes, no structural work
2. P2-1 (hero headline) deserves creative deliberation; draft 3 options and test
3. P2-2 (features reframe) requires reordering array elements and renaming -- straightforward
4. P3 items can be done opportunistically alongside other work

### Estimated Effort

- **P1 total:** ~30 minutes (all are string replacements)
- **P2 total:** ~1-2 hours (includes headline drafting and feature card restructuring)
- **P3 total:** ~1 hour (copy tweaks and one documentation update)

### Testing

After changes, visually review:
1. Landing page hero section (headline + subtitle coherence)
2. Pricing section (does it feel premium, not bargain?)
3. Features section (does it lead with learning, not gamification?)
4. Google search result preview (meta title + description)
5. Footer across all pages (consistent outcome-led description)

### Brand Voice Quick Reference (for future copy)

When writing any new Upwise copy, ask:
- Does it lead with **what the child gains** (confidence, mastery, strong foundations)?
- Is **AI invisible** (mentioned only if asked, never in headlines)?
- Is it **school-positive** (partner language, not replacement language)?
- Does it feel **smart, warm, calm, trustworthy, modern, premium, parent-first**?
- Would a parent reading this feel **reassured** or **sold to**?
