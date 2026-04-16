# Upwise UX/UI Design System

> Reference document for Claude Code implementation. Every section maps to buildable components and screens.

---

## 1. Design Philosophy

### Core Principles (Derived from Reading Eggs, Khan Academy Kids, PBS Kids)

All three reference sites share a set of proven patterns that Upwise should adopt:

**1. Character-Led Navigation**
Every successful children's platform uses mascot characters as guides, not just decoration. Khan Academy Kids has Kodi Bear narrating the journey plus four specialist characters (Ollo for phonics, Reya for reading, Peck for numbers, Sandy for puzzles). Reading Eggs has Reggie the egg character. PBS Kids uses beloved show characters as navigation waypoints. Upwise needs a core mascot character that guides the child through their learning journey, celebrates wins, and offers encouragement during struggles.

**2. Map-Based Progression (Not Lists)**
Reading Eggs uses a world-map progression where children move an avatar along a path, unlocking new maps at milestones. Khan Academy Kids uses a "Learning Path" with a large play arrow that auto-cycles through topics. The mental model is always a journey, not a checklist. Upwise's gap map and skill progression must feel like exploring a world, not completing a spreadsheet.

**3. Reward Loops Every 30-90 Seconds**
All three platforms provide near-constant positive reinforcement. Khan Academy Kids fires sparkle animations toward a delivery truck that eventually brings presents. Reading Eggs awards golden eggs after every activity that can be spent in an in-game shop. PBS Kids uses badge systems with character-specific achievements. The feedback must be immediate, visual, and auditory.

**4. Dual-Audience Architecture**
Every platform cleanly separates the child experience from the adult experience. The child sees characters, colours, and games. The parent/teacher sees data, reports, and controls. These are never mixed in the same interface. Upwise must maintain strict separation: the student portal is a world of colour and play; the parent portal is clean, data-driven, and actionable.

**5. Simplicity Over Features**
Khan Academy Kids succeeds with a single large "Play" button on the home screen. PBS Kids leads with just two tabs: Games and Videos. Reading Eggs presents a linear path forward. Children aged 5-10 need fewer choices and clearer paths than adults. Every screen a child sees should have one primary action.

---

## 2. Visual Design Language

### Colour Palette

**Primary Palette (Student-Facing)**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#4F8CF7` | Primary brand blue — buttons, active states, headers |
| `--color-primary-light` | `#7BABFF` | Hover states, secondary elements |
| `--color-primary-dark` | `#3A6CD4` | Pressed states, text on light backgrounds |
| `--color-secondary` | `#FF8C42` | Accent orange — streaks, XP, celebrations |
| `--color-success` | `#22C55E` | Correct answers, mastered skills, progress |
| `--color-warning` | `#FBBF24` | Almost mastered, partial understanding |
| `--color-error` | `#F87171` | Gentle error state — never harsh red (#FF0000) |
| `--color-error-soft` | `#FEE2E2` | Error background — soft, non-threatening |
| `--color-bg` | `#F8FAFF` | Page background — warm off-white, not sterile |
| `--color-surface` | `#FFFFFF` | Card surfaces |
| `--color-surface-raised` | `#F1F5FF` | Elevated card backgrounds |

**Design Note:** Never use pure red (#FF0000) for incorrect answers. Research shows red "X" symbols create anxiety in young learners. Use soft coral/salmon tones with gentle animations instead. Reading Eggs and Khan Academy Kids both use "gentle resets" rather than harsh error indicators.

**Parent Portal Palette**

| Token | Hex | Usage |
|-------|-----|-------|
| `--parent-bg` | `#FAFAFA` | Clean, professional background |
| `--parent-surface` | `#FFFFFF` | Cards and panels |
| `--parent-text` | `#1A1A2E` | Primary text — dark navy, not black |
| `--parent-text-secondary` | `#6B7280` | Secondary/meta text |
| `--parent-accent` | `#4F8CF7` | Links, CTAs, active elements |
| `--parent-success` | `#16A34A` | Mastered indicators |
| `--parent-warning` | `#D97706` | Gaps, attention needed |
| `--parent-danger` | `#DC2626` | Critical gaps (used sparingly) |

**Theme System (Already Built)**
The existing 7 themes (Default, AFL Footy, Bluey, Superheroes, Space Explorer, Animal Kingdom, Golf Pro) should be applied as CSS variable overrides. Each theme changes `--color-primary`, `--color-secondary`, `--color-accent`, background patterns, and sound sets. The child selects their theme during onboarding.

### Typography

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Display / Hero | Fredoka | 32-48px | 600 | Landing page headlines, celebration text |
| H1 (Student) | Fredoka | 28-32px | 600 | Screen titles, question stems |
| H2 (Student) | Fredoka | 22-26px | 500 | Section headers, skill names |
| Body (Student) | Inter | 18-20px | 400 | Question text, instructions, labels |
| Body Small | Inter | 16px | 400 | Hints, secondary info |
| H1 (Parent) | Inter | 24-28px | 600 | Dashboard headers |
| Body (Parent) | Inter | 16px | 400 | Report text, data labels |
| Data (Parent) | Inter | 14px | 500 | Table data, metrics |

**Critical:** Student-facing text must be minimum 18px body size. Children aged 5-10 need larger text than adults. Khan Academy Kids uses oversized, high-contrast text throughout. Labels on buttons should be 20px+ with icon accompaniment.

### Illustration & Character Style

**Mascot: "Wise" the Owl (Recommended)**
An Australian-themed mascot fits the ACARA-aligned positioning. The character should be:
- Rounded, friendly proportions (large head, small body — approachable, not intimidating)
- Expressive eyes that react to student actions (excited when correct, encouraging when wrong, curious during questions)
- Simple enough to animate with Framer Motion (not complex 3D)
- Appears in: onboarding, session intro, celebrations, hints, daily briefing

**Illustration Guidelines:**
- Style: Flat illustration with subtle gradients and soft shadows (like Khan Academy Kids)
- Shapes: Rounded corners everywhere (border-radius: 16-24px on cards, 12px on buttons)
- Icons: Lucide React icons supplemented with custom learning icons (pencil, lightbulb, star, brain)
- Backgrounds: Subtle patterns per theme (dots, waves, stars) — never plain white for student screens

### Iconography

Use icons alongside text for all interactive elements. Children aged 5-8 navigate primarily by icon recognition, not reading.

| Action | Icon | Label |
|--------|------|-------|
| Start session | Play circle (filled) | "Let's Go!" |
| Correct answer | Sparkle/star burst | "Amazing!" |
| Wrong answer | Gentle refresh/retry | "Try Again" |
| Hint | Lightbulb | "Need a Hint?" |
| Progress | Pie chart/ring | "My Progress" |
| Rewards | Trophy/star | "My Rewards" |
| Settings | Gear (parent only) | "Settings" |
| Back/Exit | Door (not arrow) | "Exit" |

---

## 3. Component Specifications

### 3.1 Question Card (Existing — Enhance)

The existing `QuestionCard.tsx` component is a solid foundation. Enhancements needed:

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  [Skill Badge]          [3/10] [Timer Optional] │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │                                             │ │
│  │         Question Stem (18-24px)             │ │
│  │         (with optional image)               │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │   Option A   │  │   Option B   │             │
│  └──────────────┘  └──────────────┘             │
│  ┌──────────────┐  ┌──────────────┐             │
│  │   Option C   │  │   Option D   │             │
│  └──────────────┘  └──────────────┘             │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  💡 Need a Hint?                            │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  [Progress Bar ████████░░░░░░░░░░░░]            │
└─────────────────────────────────────────────────┘
```

**Touch Targets:**
- Answer option buttons: minimum 56px height, 16px padding
- Spacing between options: 12px minimum (prevents mis-taps)
- Hint button: full width, 48px height
- All interactive elements: minimum 44x44px touch area

**Animations (Framer Motion):**
- Question entry: slide up + fade in (300ms, ease-out)
- Correct answer: option button pulses green, sparkle particles from button toward progress bar (500ms)
- Wrong answer: option gently shakes (200ms), fades to soft coral background, correct answer highlights after 1s
- Transition to next question: current card slides left, new card slides in from right (400ms)

**Feedback States:**
- Correct: Green border, checkmark icon, sparkle animation, positive sound, explanation appears below
- Incorrect: Soft coral background (NOT red border), gentle shake, encouraging message ("Almost! Let's look at why..."), explanation appears
- Hint revealed: Lightbulb glow animation, hint text slides down

### 3.2 Session Dashboard (Student Home — NEW)

This is the primary screen children see after login. Inspired by Khan Academy Kids' character home screen and Reading Eggs' map progression.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  [Avatar] Hi, [Name]!   🔥 5   🪙 340   ⭐ 1,240 │
│                         streak  coins    XP      │
│─────────────────────────────────────────────────│
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │                                             │ │
│  │     [Mascot Character — animated idle]      │ │
│  │                                             │ │
│  │     "Ready for today's adventure?"          │ │
│  │                                             │ │
│  │     ┌─────────────────────────────┐         │ │
│  │     │   ▶  START TODAY'S SESSION  │         │ │
│  │     └─────────────────────────────┘         │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Progress │ │ Rewards  │ │  Theme   │        │
│  │   Ring   │ │  Trophy  │ │  Picker  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  ── Today's Progress ──                         │
│  [Phase indicator: Warmup → Focus 1 → Break     │
│   → Focus 2 → Wrap-up]                          │
└─────────────────────────────────────────────────┘
```

**Behaviour:**
- Single primary CTA: "Start Today's Session" — large, prominent, animated pulse
- Mascot character has idle animation (breathing, blinking) and reacts to taps
- Streak counter uses flame emoji with scale animation (already built in StreakCounter.tsx)
- XP display shows current level progress (already built in XPBar.tsx)
- Bottom row: 3 secondary navigation cards with icons + labels (not text-only)
- Session phase indicator shows where the child is in today's session (if resuming)
- Background uses theme-specific pattern

### 3.3 Gap Map Visualisation (Key Differentiator — NEW)

The gap map is described in the product spec as the "aha moment" that drives conversion and the "viral growth mechanic." This must be beautiful and shareable.

**Concept: Skill Tree / Knowledge Garden**
Rather than a technical graph, present the knowledge graph as a garden/landscape where:
- Mastered skills = blooming flowers/trees (green, vibrant)
- Almost mastered = budding plants (yellow/amber, growing)
- Gaps = empty soil patches (grey, with a seed icon showing potential)
- Frontier gaps = glowing/pulsing patches (highlighted, "ready to grow")

**Alternative Concept: Island Map (Reading Eggs-inspired)**
A progression map with islands representing skill clusters:
- Each island = a strand/sub-strand (e.g., "Place Value Island", "Addition Archipelago")
- Nodes on each island = individual skills
- Bridges between islands = prerequisites
- Colour-coded: green (mastered), amber (learning), grey (locked/unknown)
- Child's avatar stands on their current frontier

**Technical Implementation:**
- Use SVG or Canvas (Recharts already in deps, but custom SVG may be better)
- Animate skill state changes (flower blooming when mastered)
- Pinch-to-zoom on mobile/tablet for detailed view
- Tap a node to see: skill name, mastery %, last practiced, "Practice Now" button
- Shareable: generate a static PNG/SVG snapshot for parent sharing

**Parent View of Gap Map:**
- Same underlying data, different presentation
- Traffic light table view: Green/Amber/Red per skill with % mastery
- Filterable by strand, year level, status
- Exportable as PDF for teacher conferences

### 3.4 Celebration Component (Existing — Enhance)

The existing `Celebration.tsx` has particle effects. Enhance with tiered celebrations:

| Trigger | Animation | Sound | Duration |
|---------|-----------|-------|----------|
| Correct answer | Sparkles from answer button | Bright chime | 800ms |
| 3 in a row | Confetti burst, mascot cheers | Ascending chime | 1.2s |
| 5 in a row (streak) | Full-screen confetti, streak counter flames | Triumphant fanfare | 2s |
| Skill mastered | Garden bloom / island unlock animation, mascot dances | Achievement jingle | 3s |
| Session complete | Progress ring fills, XP tally animation, mascot celebrates | Session complete melody | 4s |
| Level up | Full-screen celebration, new badge reveal | Level up fanfare | 4s |

**Critical:** Khan Academy Kids' delivery truck mechanic is worth studying — small sparkle rewards accumulate visibly toward a bigger payoff. Upwise should implement something similar: every correct answer sends a sparkle to a visible "reward meter" that fills up and triggers a bigger celebration.

### 3.5 Coin Economy System (Existing — Document)

The codebase already includes `CoinCounter`, `CoinEarnOverlay`, `CoinShop`, and `CoinHistory` components. This is the in-game reward currency (similar to Reading Eggs' golden eggs).

**Coin Earning Rates:**

| Action | Coins Earned |
|--------|-------------|
| Correct answer (first try) | 3 coins |
| Correct answer (with hint) | 1 coin |
| 3-streak bonus | +5 coins |
| 5-streak bonus | +10 coins |
| Session completed | +25 coins |
| Skill mastered | +50 coins |
| Daily login | +5 coins |

**Coin Shop (Keep Simple for MVP):**
- Avatar accessories (hats, glasses, frames): 50-200 coins
- Theme unlocks (premium themes beyond the default 7): 300 coins
- Mascot outfits/accessories: 100-250 coins
- Celebration effect upgrades (sparkle colours, confetti styles): 150 coins

**CoinEarnOverlay:** When coins are earned, animate them flying from the source (correct answer button, streak counter) toward the coin counter in the header. Use the sparkle-to-truck pattern from Khan Academy Kids — small rewards visually accumulate toward bigger payoffs.

**CoinHistory:** Accessible from the Rewards tab. Shows a simple log of coins earned and spent with dates and reasons.

**Design Notes:**
- Coin counter always visible in the student header bar (top right, next to XP)
- Use a gold coin icon with a subtle shine animation
- Shop is accessible but never pushy — no "Buy Now!" popups or FOMO mechanics
- Parents can see coin balance in their dashboard but cannot control spending (child autonomy within safe bounds)

### 3.6 Brain Break Component (NEW)

A dedicated screen for the 2-3 minute cognitive reset between focus blocks.

**Types:**
- Physical prompt: "Do 10 star jumps!" / "Touch your toes 5 times!" with animated mascot demonstrating
- Fun puzzle: Simple drag-and-drop puzzle unrelated to the learning content
- Breathing exercise: Animated circle that expands/contracts for deep breathing
- Drawing canvas: Free-draw with finger/mouse (cathartic, no right/wrong)

**Design:**
- Full-screen, different background colour (calming purple/teal)
- Large timer showing remaining break time
- "I'm Ready!" button to end break early
- No scoring, no pressure, purely restorative

### 3.6 Parent Daily Briefing Card (NEW)

Displayed on the parent dashboard before the child's session.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  📋 Today's Session Brief          April 16     │
│─────────────────────────────────────────────────│
│                                                  │
│  Today [Child Name] is working on:              │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ 🎯 3-Digit Subtraction with Regrouping     │ │
│  │    Currently: 72% accuracy (target: 85%)    │ │
│  │    ████████████░░░░░░░ 72%                  │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  💡 Parent Tip:                                 │
│  "If she gets stuck, try using physical objects  │
│   like MAB blocks. Ask her: 'Which column       │
│   should we start with?'"                        │
│                                                  │
│  ⏱️ Estimated session time: 32 minutes          │
│                                                  │
│  [View Conversation Script →]                   │
│  [View Full Gap Map →]                          │
└─────────────────────────────────────────────────┘
```

### 3.7 Progress Ring (Existing — Context)

The existing `ProgressRing.tsx` should be used as the primary progress indicator throughout:
- Session completion (% of today's session done)
- Skill mastery (% mastered in a strand)
- Weekly goal (sessions completed this week vs target)

Style it as Apple Watch-style completion rings per the product spec. Stack multiple rings for multi-metric display (e.g., sessions ring + accuracy ring + streak ring).

### 3.8 Navigation Bar (Student — NEW)

Bottom tab bar for student navigation (mobile/tablet) or sidebar for desktop.

**Tabs:**
| Tab | Icon | Label | Screen |
|-----|------|-------|--------|
| Home | House | Home | Session dashboard |
| Map | Globe/Map | My Map | Gap map visualisation |
| Rewards | Trophy | Rewards | Badge/achievement collection |
| Me | User circle | Me | Avatar, theme, settings |

**Design:**
- Bottom bar: 64px height, icons 28px, labels 12px
- Active tab: filled icon + theme primary colour
- Inactive: outlined icon + grey
- Desktop: convert to left sidebar with expanded labels
- No hamburger menus — all navigation visible at all times

---

## 4. Screen-by-Screen Specifications

### 4.1 Landing Page (Public — Marketing)

**Audience:** Parents (decision makers)
**Goal:** Communicate value prop, drive sign-up

**Sections:**
1. **Hero:** Headline ("See exactly where your child's learning gaps are"), subhead explaining the diagnostic, CTA "Start Free Diagnostic", background illustration of gap map preview
2. **How It Works:** 3-step visual (Diagnose → Learn → Master) with icons and short descriptions
3. **Social Proof:** "9.4 million questions answered" counter (like Reading Eggs' golden eggs counter), parent testimonials
4. **Gap Map Preview:** Interactive demo or animated preview of what the diagnostic reveals
5. **Pricing:** Tier comparison table (Free / Standard / Family)
6. **Trust Signals:** ACARA alignment badge, KidSAFE-style safety badge, university partnership (when available), Australian-made badge
7. **Footer:** Parent resources, teacher info, privacy policy, terms

### 4.2 Onboarding Flow (New Family)

**Step 1: Parent Account**
- Clerk-powered sign-up (email + password or Google SSO)
- Family name, state/territory (for curriculum alignment)

**Step 2: Add Child Profile**
- Child's first name (no surname required — privacy)
- Year level (Prep-Year 6 selector with visual year icons)
- Avatar selection (choose from 8-10 pre-made avatars)
- Theme selection (show the 7 themes as visual cards the child can pick)

**Step 3: Interest Selection (Phase 2 — skip in MVP)**
- Visual grid of interest categories (sports, animals, space, etc.)
- Child taps to select 3-5 interests
- Each interest has an icon and short label (no text-only)

**Step 4: Diagnostic Introduction**
- Mascot explains what's about to happen in child-friendly language
- "We're going to play some maths games to see what you already know!"
- Estimated time (15-20 minutes)
- Parent reassurance: "There are no wrong answers — this helps us find the best starting point"
- Large "Let's Start!" button

### 4.3 Diagnostic Assessment Screen

**Design:**
- Clean, focused layout — no navigation bar, no distractions
- Progress indicator: soft progress bar at top (not showing question numbers — reduces anxiety)
- Question card (see 3.1) centred on screen
- Mascot character in corner providing encouragement between questions
- Gentle background music (toggleable)
- Timer is internal only (drives IRT calculations) — never shown to child

**Adaptive Behaviour:**
- Questions get harder after correct answers, easier after incorrect
- Visual difficulty is invisible to the child (no "Level 3!" badges)
- Every 5-7 questions: brief mascot encouragement ("You're doing great!")
- After completion: celebration animation, then gap map reveal

### 4.4 Gap Map Reveal (Post-Diagnostic)

**The "Aha Moment" — This screen must be beautiful and emotionally impactful.**

**Child View:**
- Animated reveal: the garden/island map draws itself, skills light up one by one
- Mastered skills bloom/illuminate with sparkle effects
- Gaps show as opportunities ("Look at all the things you get to learn!")
- Positive framing: "You've already mastered 47 skills! Let's grow 12 more."
- CTA: "Start Your First Session!"

**Parent View (shown simultaneously on parent's device or after child view):**
- Traffic light summary: X mastered, Y learning, Z gaps detected
- Comparison to year-level expectations (without shame — "Most Year 3 students are working on these same skills")
- Top 3 priority gaps highlighted with plain-English explanations
- "Share Gap Map" button (generates shareable image — viral mechanic)
- CTA: "Set Up Daily Sessions"

### 4.5 Daily Learning Session Flow

**Phase transitions are visually distinct:**

| Phase | Background | Mascot State | Music |
|-------|------------|-------------|-------|
| Warmup | Warm yellow/sunrise gradient | Stretching, yawning | Gentle, building |
| Focus Block 1 | Theme primary colour | Alert, encouraging | Focused, rhythmic |
| Brain Break | Calming teal/purple | Playful, dancing | Fun, upbeat |
| Focus Block 2 | Theme secondary colour | Determined, supportive | Focused, different melody |
| Wrap-up | Sunset gradient | Celebrating, proud | Triumphant, warm |

**Session Progress Bar:**
A horizontal bar at the top showing all 5 phases as segments. Current phase is highlighted and animating. Completed phases show checkmarks. This gives the child a sense of "where am I in today's session" without overwhelming them.

### 4.6 Parent Dashboard

**Clean, data-driven interface** — completely different visual language from student screens.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Upwise                    [Child Selector ▼]  [Avatar] │
│─────────────────────────────────────────────────────────│
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ This Week  │ │ Accuracy   │ │ Streak     │          │
│  │ 4/5        │ │ 81%        │ │ 🔥 12 days │          │
│  │ sessions   │ │ (target:   │ │            │          │
│  │            │ │  85%)      │ │            │          │
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📋 Today's Briefing                      [NEW]  │   │
│  │  Focus: 3-digit subtraction with regrouping      │   │
│  │  Tip: Use MAB blocks if stuck...                 │   │
│  │  [Read Full Briefing →]                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📊 Gap Map Overview                             │   │
│  │  ██ 47 Mastered  ██ 8 Learning  ██ 12 Gaps      │   │
│  │  [View Full Map →]                               │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📈 This Week's Progress                         │   │
│  │  [Line chart: accuracy over past 7 days]         │   │
│  │  Skills mastered: +3  |  Time: 2hr 15min         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Weekly Report] [Session History] [Settings]           │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Interaction Patterns

### 5.1 Feedback Timing

| Event | Visual Delay | Audio Delay | Explanation Delay |
|-------|-------------|-------------|-------------------|
| Correct answer selected | 0ms (instant highlight) | 50ms | 600ms (after sparkle) |
| Wrong answer selected | 0ms (instant gentle shake) | 100ms | 1000ms (let it land gently) |
| Hint requested | 200ms (slide down) | 0ms (click sound) | N/A |
| Streak milestone | 300ms (build-up) | 300ms | 1500ms |

### 5.2 Loading States

Never show spinners to children. Use:
- Mascot animations (thinking, looking around)
- Skeleton screens with gentle pulse
- Progress messages: "Finding the perfect question for you..."

### 5.3 Error Handling

Never show error codes or technical messages to children.
- Connection lost: Mascot with "Hmm, let me try that again..." + automatic retry
- Question load failure: Skip to next question seamlessly
- Session save failure: Queue locally, sync when connection restored

### 5.4 Sound Design

| Event | Sound Character | Duration |
|-------|----------------|----------|
| Correct answer | Bright ascending chime (C-E-G) | 400ms |
| Wrong answer | Soft descending tone (gentle, NOT buzzer) | 300ms |
| Streak | Building musical phrase | 600ms |
| Level up | Triumphant fanfare | 1.5s |
| Button tap | Soft click/pop | 100ms |
| Session start | Adventure horn/theme | 2s |
| Brain break | Playful transition jingle | 1s |

**Critical:** Sound must always be toggleable. Include a visible mute button on every screen. Some children are sound-sensitive, and evening sessions need to be quiet.

---

## 6. Responsive Design

### Breakpoints

| Breakpoint | Target | Layout |
|------------|--------|--------|
| < 640px | Phone (portrait) | Single column, bottom nav, full-width cards |
| 640-1024px | Tablet (primary target) | Comfortable single column, larger touch targets |
| 1024-1440px | Laptop/Desktop | Two-column layouts where appropriate, sidebar nav |
| > 1440px | Large desktop | Max-width container (1280px), centred |

**Tablet is the primary device** (per product spec and UX research showing tablets are optimal for children under 10). Design tablet-first, then adapt down to phone and up to desktop.

### Touch Target Minimums

| Age Group | Min Touch Target | Min Spacing |
|-----------|-----------------|-------------|
| Years 1-2 (ages 5-7) | 56px | 16px |
| Years 3-4 (ages 8-9) | 48px | 12px |
| Years 5-6 (ages 10-11) | 44px | 8px |
| Parent interface | 44px | 8px |

---

## 7. Accessibility

### WCAG 2.1 AA Compliance (Minimum)

- Colour contrast: 4.5:1 for text, 3:1 for large text and UI components
- All interactive elements keyboard-navigable
- All images have alt text
- All audio has visual equivalent
- Focus indicators visible (3px theme-coloured ring)
- Reduced motion: respect `prefers-reduced-motion` — disable particles, use opacity transitions instead
- Screen reader support: ARIA labels on all interactive elements, live regions for dynamic content

### Reading Level

- All student-facing text: maximum Year 2 reading level (for Years 1-2 students)
- Instructions use simple sentences (subject-verb-object)
- Avoid idioms, metaphors, or culturally specific references in UI text
- Use voice narration for all instructions (Years 1-2 by default, optional for Years 3+)

---

## 8. Animation Guidelines

### Performance Budget

- Max 3 simultaneous animations on screen
- Use CSS transforms and opacity (GPU-accelerated) — never animate layout properties
- Framer Motion spring physics for natural feel: `{ type: "spring", stiffness: 300, damping: 20 }`
- Particle effects: max 30 particles per burst, fade out within 2s
- Skeleton loading: CSS-only (no JS animation overhead)

### Motion Principles

1. **Purposeful:** Every animation communicates state change or provides feedback
2. **Consistent:** Same action = same animation everywhere
3. **Quick:** UI transitions 200-400ms, celebrations 800-2000ms, never longer than 4s
4. **Respectful:** Reduced motion mode disables decorative animations, keeps functional transitions

---

## 9. Implementation Priority (for Claude Code)

### Phase 1: Core Learning Loop (Ship First)
1. Student home screen (session dashboard)
2. Question card (enhanced from existing)
3. Session flow (warmup → focus → break → focus → wrapup)
4. Celebration system (enhanced from existing)
5. Progress tracking UI (rings, XP bar, streaks — mostly built)
6. Basic parent dashboard with daily briefing

### Phase 2: Diagnostic & Gap Map
7. Onboarding flow (parent + child setup)
8. Diagnostic assessment screen
9. Gap map visualisation (garden/island concept)
10. Gap map reveal animation
11. Shareable gap map image generation

### Phase 3: Parent Guide System
12. Real-time nudge notifications
13. Conversation script viewer
14. Weekly report generation and display
15. Session history and analytics

### Phase 4: Polish & Engagement
16. Theme system integration (apply to all screens)
17. Sound design implementation
18. Brain break activities
19. Reward/achievement system
20. Avatar customisation

---

## 10. Reference Sites — Key Takeaways Summary

### Reading Eggs (readingeggs.com.au)
- **Steal:** Map-based progression (moving avatar along a path), golden egg reward currency, collectible "critters" as milestone rewards, quiz gates between map sections, separate Family Dashboard for parents
- **Adapt:** Their linear path works for reading (sequential), but Upwise's maths skills are a DAG (branching) — the gap map must show parallel paths
- **Avoid:** Overly complex in-game shop (keep rewards simple for MVP)

### Khan Academy Kids (khanacademy.org/kids)
- **Steal:** Single "Play" button simplicity, character home screen (visit characters, see their rooms), sparkle-to-truck reward accumulation mechanic, 3-5 minute micro-lessons, no ads/no upsells ethos
- **Adapt:** Their content cycles through topics randomly — Upwise must be deliberate about targeting frontier gaps
- **Avoid:** No parent dashboard in Khan Kids (they don't have a guide layer) — we must build one

### PBS Kids (pbskids.org)
- **Steal:** Dynamic theming per "property" (each show has its own colour scheme — like our theme system), character-driven navigation cards, badge system with character-specific colours, high-contrast accessibility (yellow masthead with black text), audio narration with children's voices
- **Adapt:** PBS is content browsing (passive), Upwise is active learning — but the navigation card pattern works for our strand/topic selection
- **Avoid:** Their lack of progress tracking or mastery mechanics — we need both
