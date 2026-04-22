# Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all hardcoded mock data, wire frontend pages to real APIs, harden the backend, and fix the build pipeline so the platform delivers a personalised experience.

**Architecture:** Three independent workstreams — frontend API wiring (5 pages), backend hardening (rate limiting, validation, URL cleanup), and build/config cleanup. Frontend reads `studentId`/`familyId` from `sessionStorage` (set during onboarding) and calls existing REST endpoints via `api` utility in `@/lib/api`.

**Tech Stack:** Next.js 15, React, Express, Drizzle ORM, PostgreSQL, Zod, express-rate-limit, Stripe

**Spec:** `docs/superpowers/specs/2026-04-22-production-readiness-design.md`

---

## File Map

### Frontend (modify)
- `apps/web/src/app/(student)/dashboard/page.tsx` — replace mockStudent with API fetch
- `apps/web/src/app/(student)/profile/page.tsx` — replace hardcoded stats with API fetch
- `apps/web/src/app/(parent)/parent-dashboard/page.tsx` — wire coin/shop/mastery stats to API
- `apps/web/src/app/subscribe/page.tsx` — use api utility, remove hardcoded URL, remove alert()
- `apps/web/src/app/(auth)/start/page.tsx` — surface API errors to user
- `apps/web/next.config.ts` — remove ignoreBuildErrors/ignoreDuringBuilds

### Backend (modify)
- `apps/server/src/routes/students.ts` — add sessionsThisWeek to GET response
- `apps/server/src/routes/parent.ts` — add ownedItemsCount/masteredSkillsCount
- `apps/server/src/routes/subscriptions.ts` — remove hardcoded URL fallback
- `apps/server/src/routes/families.ts` — fix temp ID fallback
- `apps/server/src/routes/webhooks.ts` — fix error handling
- `apps/server/src/index.ts` — apply rate limiting middleware

### Backend (create)
- `apps/server/src/middleware/rate-limit.ts` — rate limiter configuration
- `apps/server/src/schemas/validation.ts` — Zod schemas for route validation

### Config (modify)
- `apps/server/package.json` — fix build script
- `.gitignore` — add dev artifact patterns
- `.env.example` — add missing Stripe vars

---

### Task 1: Backend — Enrich student endpoint with session count

**Files:**
- Modify: `apps/server/src/routes/students.ts:11-39`

- [ ] **Step 1: Add sessions-this-week query to GET /:id**

In `apps/server/src/routes/students.ts`, replace the existing GET handler (lines 11-39) with:

```typescript
studentRoutes.get("/:id", async (req, res, next) => {
  try {
    const [student] = await db.select().from(students).where(eq(students.id, req.params.id));
    if (!student) throw new AppError(404, "NOT_FOUND", "Student not found");

    const level = Math.floor(student.xpTotal / XP_PER_LEVEL);
    const xpInLevel = student.xpTotal % XP_PER_LEVEL;

    // Count mastery stats
    const [masteryStats] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        mastered: sql<number>`COUNT(*) FILTER (WHERE ${studentSkillStates.masteryStatus} IN ('mastered', 'review'))`,
      })
      .from(studentSkillStates)
      .where(eq(studentSkillStates.studentId, student.id));

    // Count sessions completed this week
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const [sessionCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(learningSessions)
      .where(
        and(
          eq(learningSessions.studentId, student.id),
          eq(learningSessions.status, "completed"),
          sql`${learningSessions.completedAt} >= ${weekAgo.toISOString()}`,
        ),
      );

    res.json({
      ...student,
      level,
      xpForNextLevel: XP_PER_LEVEL,
      xpInCurrentLevel: xpInLevel,
      masteryPercentage: masteryStats.total > 0 ? Math.round((masteryStats.mastered / masteryStats.total) * 100) : 0,
      totalSkillsAssessed: masteryStats.total,
      sessionsThisWeek: sessionCount.count,
    });
  } catch (err) {
    next(err);
  }
});
```

Ensure `learningSessions` and `and` are imported at the top. Check existing imports — `learningSessions` may need to be added to the schema import.

- [ ] **Step 2: Verify**

Run: `cd apps/server && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/routes/students.ts
git commit -m "feat: add sessionsThisWeek to student GET endpoint"
```

---

### Task 2: Backend — Enrich parent dashboard with coin/shop stats

**Files:**
- Modify: `apps/server/src/routes/parent.ts:16-70`

- [ ] **Step 1: Add ownedItemsCount and masteredSkillsCount to child summaries**

In `apps/server/src/routes/parent.ts`, inside the `children.map()` callback (around line 28), add two queries and include their results in the returned object.

Add these queries after the `recentSessions` query:

```typescript
        // Owned shop items count
        const ownedItems = await db
          .select({ count: sql<number>`COALESCE(SUM(${studentOwnedItems.quantity}), 0)` })
          .from(studentOwnedItems)
          .where(eq(studentOwnedItems.studentId, child.id));

        // Mastered skills count
        const [masteredCount] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(studentSkillStates)
          .where(
            and(
              eq(studentSkillStates.studentId, child.id),
              sql`${studentSkillStates.masteryStatus} IN ('mastered', 'review')`,
            ),
          );
```

Add these fields to the return object:

```typescript
          ownedItemsCount: ownedItems[0]?.count ?? 0,
          masteredSkillsCount: masteredCount.count,
```

Ensure `studentOwnedItems`, `studentSkillStates`, and `and` are imported from schema/drizzle-orm.

- [ ] **Step 2: Verify**

Run: `cd apps/server && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/routes/parent.ts
git commit -m "feat: add ownedItemsCount and masteredSkillsCount to parent dashboard"
```

---

### Task 3: Frontend — Wire student dashboard to API

**Files:**
- Modify: `apps/web/src/app/(student)/dashboard/page.tsx`

- [ ] **Step 1: Replace mock data with API state and fetching**

Read the current file first. Then make these changes:

**Add import** (after existing imports):
```typescript
import { api } from "@/lib/api";
```

**Remove** the `mockStudent` constant (lines 12-24).

**Replace the state section** (around lines 27-31) with:

```typescript
interface StudentData {
  id: string;
  name: string;
  yearLevel: number;
  level: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  currentStreak: number;
  coinBalance: number;
  themeId: string;
  diagnosticCompleted: boolean;
  sessionsThisWeek: number;
  masteryPercentage: number;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rewardsMode, setRewardsMode] = useState("full");

  useEffect(() => {
    setRewardsMode(sessionStorage.getItem("upwise_rewards_mode") ?? "full");

    const studentId = sessionStorage.getItem("upwise_student_id");
    if (!studentId) {
      setError("No student session found.");
      setLoading(false);
      return;
    }

    api.get<StudentData>(`/students/${studentId}`)
      .then(setStudent)
      .catch(() => setError("Could not load your data. Please try again."))
      .finally(() => setLoading(false));
  }, []);
```

**Add loading state** before the main return (after the `useEffect`):

```typescript
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <AdventureBackground calm />
        <motion.span className="text-6xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🦉</motion.span>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <AdventureBackground calm />
        <span className="text-6xl block mb-4">😕</span>
        <p className="font-display text-xl text-gray-700 mb-4">{error ?? "Something went wrong."}</p>
        <a href="/start" className="btn-primary">Start Again</a>
      </main>
    );
  }
```

**Replace all `mockStudent.` references** in the JSX with `student.`:
- `mockStudent.name` → `student.name`
- `mockStudent.level` → `student.level`
- `mockStudent.xpInLevel` → `student.xpInCurrentLevel`
- `mockStudent.xpForLevel` → `student.xpForNextLevel`
- `mockStudent.currentStreak` → `student.currentStreak`
- `mockStudent.coinBalance` → `student.coinBalance`
- `mockStudent.diagnosticCompleted` → `student.diagnosticCompleted`
- `mockStudent.weeklySessionsCompleted` → `student.sessionsThisWeek`
- `mockStudent.weeklySessionsTarget` → `5`

- [ ] **Step 2: Verify**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(student\)/dashboard/page.tsx
git commit -m "feat: wire student dashboard to real API data"
```

---

### Task 4: Frontend — Wire student profile to API

**Files:**
- Modify: `apps/web/src/app/(student)/profile/page.tsx`

- [ ] **Step 1: Replace hardcoded data with API state**

Read the current file first. Then make these changes:

**Add imports:**
```typescript
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
```

**Replace state and add fetching** (replace from the component function start up to the JSX return):

```typescript
export default function ProfilePage() {
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [student, setStudent] = useState<{
    name: string;
    yearLevel: number;
    currentStreak: number;
    coinBalance: number;
    level: number;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
    interests: string[] | null;
    themeId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    const studentId = sessionStorage.getItem("upwise_student_id");
    if (!studentId) { setLoading(false); return; }

    api.get<typeof student & { id: string }>(`/students/${studentId}`)
      .then((data) => {
        setStudent(data);
        setSelectedTheme(data.themeId ?? "default");
        setSelectedInterests(data.interests ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleInterest = useCallback(async (interest: string) => {
    const studentId = sessionStorage.getItem("upwise_student_id");
    if (!studentId) return;

    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(updated);

    try {
      await api.put(`/students/${studentId}/interests`, { interests: updated });
    } catch {
      // Revert on failure
      setSelectedInterests(selectedInterests);
    }
  }, [selectedInterests]);
```

**Add loading guard** before the main return:
```typescript
  if (loading || !student) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <motion.span className="text-6xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🦉</motion.span>
      </main>
    );
  }
```

**Replace hardcoded values in JSX:**
- `"Indigo"` (line 27) → `{student.name}`
- `"Year 3"` (line 28) → `{`Year ${student.yearLevel}`}`
- `count={7}` (StreakCounter) → `count={student.currentStreak}`
- `balance={142}` (CoinCounter) → `balance={student.coinBalance}`
- `currentXP={120}` → `currentXP={student.xpInCurrentLevel}`
- `levelXP={200}` → `levelXP={student.xpForNextLevel}`
- `level={5}` → `level={student.level}`

**Wire interest buttons** — find the interests `.map()` section (lines 76-82) and replace:
```typescript
{["AFL", "Animals", "Space", "Cooking", "Music", "Art", "Gaming", "Nature"].map((interest) => (
  <button
    key={interest}
    onClick={() => toggleInterest(interest)}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      selectedInterests.includes(interest)
        ? "bg-[var(--theme-primary)] text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {interest}
  </button>
))}
```

- [ ] **Step 2: Verify**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(student\)/profile/page.tsx
git commit -m "feat: wire student profile to real API data"
```

---

### Task 5: Frontend — Wire parent dashboard to API

**Files:**
- Modify: `apps/web/src/app/(parent)/parent-dashboard/page.tsx`

- [ ] **Step 1: Add API fetching for child data**

Read the current file first. Then:

**Add import:**
```typescript
import { api } from "@/lib/api";
```

**Add interface for API response** (near top of file):
```typescript
interface ChildSummary {
  id: string;
  name: string;
  yearLevel: number;
  currentStreak: number;
  xpTotal: number;
  coinBalance: number;
  diagnosticCompleted: boolean;
  domainProficiencies: { domain: string; proficiency: number; status: string }[];
  topMisconceptions: { id: string; concept: string; frequency: number }[];
  recentAccuracy: number | null;
  sessionsThisWeek: number;
  ownedItemsCount: number;
  masteredSkillsCount: number;
}
```

**Add state and API fetch** (inside the component, alongside existing state):
```typescript
  const [childData, setChildData] = useState<ChildSummary | null>(null);
```

**Update the existing useEffect** to also fetch from API:
```typescript
  useEffect(() => {
    const stored = sessionStorage.getItem("upwise_diagnostic_results");
    if (stored) {
      try { setResults(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setRewardsMode(sessionStorage.getItem("upwise_rewards_mode") ?? "full");

    const familyId = sessionStorage.getItem("upwise_family_id");
    if (familyId) {
      api.get<{ children: ChildSummary[] }>(`/parent/dashboard?familyId=${familyId}`)
        .then((data) => {
          if (data.children.length > 0) setChildData(data.children[0]);
        })
        .catch(() => {});
    }

    setLoading(false);
  }, []);
```

- [ ] **Step 2: Replace hardcoded stats with API data**

Find the three hardcoded stat boxes (lines 328-340). Replace the hardcoded values:

```typescript
<div className="bg-amber-50 rounded-lg p-4 text-center">
  <p className="text-2xl font-bold text-amber-600">{childData?.coinBalance ?? "—"}</p>
  <p className="text-xs text-amber-500 mt-1">Coin balance</p>
</div>
<div className="bg-blue-50 rounded-lg p-4 text-center">
  <p className="text-2xl font-bold text-blue-600">{childData?.ownedItemsCount ?? "—"}</p>
  <p className="text-xs text-blue-500 mt-1">Items owned</p>
</div>
<div className="bg-emerald-50 rounded-lg p-4 text-center">
  <p className="text-2xl font-bold text-emerald-600">{childData?.masteredSkillsCount ?? "—"}</p>
  <p className="text-xs text-emerald-500 mt-1">Skills mastered</p>
</div>
```

- [ ] **Step 3: Verify**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/\(parent\)/parent-dashboard/page.tsx
git commit -m "feat: wire parent dashboard stats to real API data"
```

---

### Task 6: Frontend — Fix subscribe page

**Files:**
- Modify: `apps/web/src/app/subscribe/page.tsx`

- [ ] **Step 1: Replace raw fetch with api utility and remove hardcoded URL**

Read the current file first. Then:

**Add import:**
```typescript
import { api } from "@/lib/api";
```

**Add error state:**
```typescript
const [error, setError] = useState<string | null>(null);
```

**Replace the `handleCheckout` function** (lines 10-33):

```typescript
  async function handleCheckout(tier: "standard" | "family") {
    setLoading(tier);
    setError(null);
    try {
      const familyId = sessionStorage.getItem("upwise_family_id");
      const data = await api.post<{ url: string | null }>("/subscriptions/checkout", {
        familyId,
        tier,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Unable to start checkout. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }
```

**Replace `alert()` calls** — they're now replaced by `setError()` above.

**Add error display** in JSX, above the plan cards:
```typescript
{error && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm text-center"
  >
    {error}
  </motion.div>
)}
```

- [ ] **Step 2: Verify**

Run: `cd apps/web && npx tsc --noEmit`
Expected: No new errors. Confirm no `alert(` calls remain in the file.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/subscribe/page.tsx
git commit -m "fix: use api utility in subscribe page, remove hardcoded URL and alert()"
```

---

### Task 7: Frontend — Surface API errors in onboarding

**Files:**
- Modify: `apps/web/src/app/(auth)/start/page.tsx`

- [ ] **Step 1: Replace silent console.error with visible notification**

Read the current file first. Then:

**Add state** for demo mode notification:
```typescript
const [demoNotice, setDemoNotice] = useState(false);
```

**Replace the catch block** in `handleStartDiagnostic()` (around line 68):

Change:
```typescript
  } catch (err) {
    console.error("API not available — running diagnostic in demo mode:", err);
  }
```

To:
```typescript
  } catch {
    setDemoNotice(true);
  }
```

**Add a visible notification** — find where the router pushes to `/diagnostic` (after the try/catch). Before the `router.push`, add:

```typescript
  if (demoNotice) {
    sessionStorage.setItem("upwise_demo_mode", "true");
  }
```

The diagnostic page already handles demo mode. The key change is removing `console.error` from production code. The user will see the demo diagnostic either way, which is the desired fallback behavior.

- [ ] **Step 2: Verify no console.error/console.log remains**

Run: `grep -n "console\." apps/web/src/app/\(auth\)/start/page.tsx`
Expected: No matches.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/\(auth\)/start/page.tsx
git commit -m "fix: remove console.error from onboarding, use sessionStorage flag for demo mode"
```

---

### Task 8: Backend — Enable rate limiting

**Files:**
- Create: `apps/server/src/middleware/rate-limit.ts`
- Modify: `apps/server/src/index.ts`

- [ ] **Step 1: Create rate limiter configuration**

Create `apps/server/src/middleware/rate-limit.ts`:

```typescript
import rateLimit from "express-rate-limit";

/** Global rate limit: 100 requests per 15 minutes per IP */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many requests, please try again later." } },
});

/** Strict limiter for expensive or sensitive endpoints */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many requests, please try again later." } },
});

/** Checkout limiter: 5 attempts per hour */
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMITED", message: "Too many checkout attempts. Please try again later." } },
});
```

- [ ] **Step 2: Apply rate limiters in index.ts**

In `apps/server/src/index.ts`, add import after existing imports:

```typescript
import { globalLimiter, strictLimiter, checkoutLimiter } from "./middleware/rate-limit.js";
```

Add global limiter after `app.use(express.json(...))`:

```typescript
app.use(globalLimiter);
```

Add route-specific limiters before the route registrations. Find the section where routes are mounted (e.g., `app.use("/api/v1/sessions", ...)`) and add:

```typescript
app.use("/api/v1/diagnostic", strictLimiter);
app.use("/api/v1/subscriptions", checkoutLimiter);
app.use("/api/v1/admin/questions/generate", strictLimiter);
```

- [ ] **Step 3: Verify**

Run: `cd apps/server && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/middleware/rate-limit.ts apps/server/src/index.ts
git commit -m "feat: enable rate limiting on all API endpoints"
```

---

### Task 9: Backend — Remove hardcoded URLs and fix temp IDs

**Files:**
- Modify: `apps/server/src/routes/subscriptions.ts`
- Modify: `apps/server/src/routes/families.ts`

- [ ] **Step 1: Fix hardcoded URL in subscriptions.ts**

In `apps/server/src/routes/subscriptions.ts`, find line 16:

```typescript
const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://upwiseweb-production.up.railway.app";
```

Replace with:

```typescript
const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  logger.warn("FRONTEND_URL not set — checkout redirects will fail");
}
```

Then in the checkout handler, add a guard before creating the Stripe session:

```typescript
    if (!FRONTEND_URL) {
      throw new AppError(500, "CONFIG_ERROR", "FRONTEND_URL environment variable is required for checkout");
    }
```

- [ ] **Step 2: Fix temp ID fallback in families.ts**

In `apps/server/src/routes/families.ts`, find line 79:

```typescript
clerkUserId: clerkUserId ?? `temp_${Date.now()}`,
```

Replace with:

```typescript
clerkUserId: clerkUserId ?? null,
```

Check the `parents` table schema to confirm `clerkUserId` allows null. If it has `.notNull()`, change it to allow null:

In `apps/server/src/db/schema.ts`, find the `clerkUserId` field in the `parents` table and change from:
```typescript
clerkUserId: text("clerk_user_id").notNull(),
```
to:
```typescript
clerkUserId: text("clerk_user_id"),
```

If it's already nullable, no schema change needed.

- [ ] **Step 3: Verify**

Run: `cd apps/server && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/routes/subscriptions.ts apps/server/src/routes/families.ts
git commit -m "fix: remove hardcoded production URL fallback, fix temp ID generation"
```

---

### Task 10: Backend — Apply input validation schemas

**Files:**
- Create: `apps/server/src/schemas/validation.ts`
- Modify: `apps/server/src/routes/families.ts`
- Modify: `apps/server/src/routes/sessions.ts`
- Modify: `apps/server/src/routes/coins.ts`

- [ ] **Step 1: Create Zod validation schemas**

Create `apps/server/src/schemas/validation.ts`:

```typescript
import { z } from "zod";

export const createFamilySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
});

export const addParentSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  clerkUserId: z.string().optional(),
});

export const addChildSchema = z.object({
  name: z.string().min(1).max(100),
  yearLevel: z.number().int().min(0).max(7),
  dateOfBirth: z.string().optional(),
  themeId: z.string().optional(),
});

export const submitAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.union([z.string(), z.number()]),
  timeTakenMs: z.number().int().min(0).optional(),
  hintUsed: z.boolean().optional(),
});

export const purchaseItemSchema = z.object({
  itemId: z.string().uuid(),
});

export const updateInterestsSchema = z.object({
  interests: z.array(z.string().max(50)).max(20),
});
```

- [ ] **Step 2: Apply validation to families route**

In `apps/server/src/routes/families.ts`, add imports:

```typescript
import { validate } from "../middleware/validate.js";
import { createFamilySchema, addParentSchema, addChildSchema } from "../schemas/validation.js";
```

Add `validate(createFamilySchema)` middleware to `POST /`:

```typescript
familyRoutes.post("/", validate(createFamilySchema), async (req, res, next) => {
```

Add `validate(addParentSchema)` to `POST /:id/parents`:

```typescript
familyRoutes.post("/:id/parents", validate(addParentSchema), async (req, res, next) => {
```

Add `validate(addChildSchema)` to `POST /:id/children`:

```typescript
familyRoutes.post("/:id/children", validate(addChildSchema), async (req, res, next) => {
```

- [ ] **Step 3: Apply validation to sessions respond route**

In `apps/server/src/routes/sessions.ts`, add imports:

```typescript
import { validate } from "../middleware/validate.js";
import { submitAnswerSchema } from "../schemas/validation.js";
```

Add validation middleware to `POST /:studentId/respond`:

```typescript
sessionRoutes.post("/:studentId/respond", validate(submitAnswerSchema), async (req, res, next) => {
```

- [ ] **Step 4: Apply validation to coins purchase route**

In `apps/server/src/routes/coins.ts`, add imports:

```typescript
import { validate } from "../middleware/validate.js";
import { purchaseItemSchema } from "../schemas/validation.js";
```

Add to `POST /:studentId/purchase`:

```typescript
coinRoutes.post("/:studentId/purchase", validate(purchaseItemSchema), async (req, res, next) => {
```

- [ ] **Step 5: Apply validation to students interests route**

In `apps/server/src/routes/students.ts`, add imports:

```typescript
import { validate } from "../middleware/validate.js";
import { updateInterestsSchema } from "../schemas/validation.js";
```

Add to `PUT /:id/interests`:

```typescript
studentRoutes.put("/:id/interests", validate(updateInterestsSchema), async (req, res, next) => {
```

- [ ] **Step 6: Verify**

Run: `cd apps/server && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 7: Commit**

```bash
git add apps/server/src/schemas/validation.ts apps/server/src/routes/families.ts apps/server/src/routes/sessions.ts apps/server/src/routes/coins.ts apps/server/src/routes/students.ts
git commit -m "feat: add Zod input validation to critical API endpoints"
```

---

### Task 11: Backend — Fix webhook error handling

**Files:**
- Modify: `apps/server/src/routes/webhooks.ts`

- [ ] **Step 1: Return error status on processing failure**

In `apps/server/src/routes/webhooks.ts`, find the catch block at lines 136-140:

```typescript
  } catch (err) {
    logger.error("Webhook processing error", { type: event.type, error: (err as Error).message });
  }

  res.json({ received: true });
```

Replace with:

```typescript
  } catch (err) {
    logger.error("Webhook processing error", { type: event.type, error: (err as Error).message });
    res.status(500).json({ error: "Webhook processing failed" });
    return;
  }

  res.json({ received: true });
```

This ensures Stripe retries on failure instead of silently dropping the event.

- [ ] **Step 2: Verify**

Run: `cd apps/server && npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/routes/webhooks.ts
git commit -m "fix: return 500 on webhook processing failure so Stripe retries"
```

---

### Task 12: Config — Fix build scripts and enable build validation

**Files:**
- Modify: `apps/server/package.json`
- Modify: `apps/web/next.config.ts`

- [ ] **Step 1: Fix server build script**

In `apps/server/package.json`, find the scripts section. Replace:

```json
"build": "echo 'build ok'",
```

With:

```json
"build": "tsc --project tsconfig.json",
```

- [ ] **Step 2: Enable build validation in Next.js**

In `apps/web/next.config.ts`, remove the `eslint` and `typescript` overrides. The file should become:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@upwise/shared"],
};

export default nextConfig;
```

- [ ] **Step 3: Verify builds pass**

Run both type checks:

```bash
cd apps/server && npx tsc --noEmit
cd ../web && npx tsc --noEmit
```

If there are pre-existing type errors surfaced by removing `ignoreBuildErrors`, fix them. Common issues:
- Missing type imports
- Implicit `any` types
- Unused variables (prefix with `_`)

- [ ] **Step 4: Commit**

```bash
git add apps/server/package.json apps/web/next.config.ts
git commit -m "fix: enable real TypeScript builds, remove ignoreBuildErrors"
```

---

### Task 13: Config — Clean dev artifacts and update .env.example

**Files:**
- Modify: `.gitignore`
- Modify: `.env.example`

- [ ] **Step 1: Add dev artifact patterns to .gitignore**

Append to `.gitignore`:

```
# Dev artifacts & data exports
all_questions.json
questions_export.csv
audit_*.json
audit_questions.py
validate_questions.py
flag_questions.py
all_dup_ids.json
duplicate_ids.json
final_report.json
question_validation_report.xlsx
GapFinder_Product_Spec.docx
```

- [ ] **Step 2: Remove tracked dev files**

```bash
git rm --cached all_questions.json questions_export.csv audit_results.json audit_refined.json audit_data.json all_dup_ids.json duplicate_ids.json final_report.json question_validation_report.xlsx audit_questions.py validate_questions.py flag_questions.py GapFinder_Product_Spec.docx 2>/dev/null || true
```

Note: Some files may not be tracked — the `|| true` prevents errors.

- [ ] **Step 3: Update .env.example**

Add the missing Stripe price variables after the existing Stripe section:

```
STRIPE_PRICE_STANDARD=price_xxxxx    # Stripe Price ID for Standard tier ($39/mo)
STRIPE_PRICE_FAMILY=price_xxxxx      # Stripe Price ID for Family tier ($59/mo)
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore .env.example
git commit -m "chore: clean dev artifacts from repo, update .env.example with missing vars"
```

---

## Task Dependency Map

```
Independent (can run in parallel):
├── Task 1 (student endpoint) → Task 3 (dashboard) depends on this
├── Task 2 (parent endpoint) → Task 5 (parent dashboard) depends on this  
├── Task 4 (profile) — independent
├── Task 6 (subscribe) — independent
├── Task 7 (onboarding) — independent
├── Task 8 (rate limiting) — independent
├── Task 9 (hardcoded URLs) — independent
├── Task 10 (validation) — independent
├── Task 11 (webhooks) — independent
└── Task 13 (artifacts) — independent

After all code changes:
└── Task 12 (build validation) — run last, may surface type errors
```

## Verification Checklist

After all tasks are complete:

- [ ] `cd apps/server && npx tsc --noEmit` — zero errors
- [ ] `cd apps/web && npx tsc --noEmit` — zero errors
- [ ] No `mockStudent` or `"Indigo"` in any frontend file
- [ ] No `console.error` or `console.log` in frontend code
- [ ] No `alert(` calls in frontend code
- [ ] No hardcoded Railway URLs in any file
- [ ] `grep -r "echo 'build ok'" .` returns nothing
- [ ] `.gitignore` contains dev artifact patterns
- [ ] `.env.example` contains `STRIPE_PRICE_STANDARD` and `STRIPE_PRICE_FAMILY`
