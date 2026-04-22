# Production Readiness — Design Spec

**Date:** 2026-04-22
**Status:** Approved
**Scope:** Full experience (frontend API wiring, backend hardening, build/config cleanup). Excludes auth, CI/CD, Docker, monitoring.

---

## Context

The Upwise platform has functional backend APIs and a working adaptive learning engine, but multiple frontend pages render hardcoded mock data instead of calling those APIs. The build pipeline has dangerous overrides (TypeScript errors and ESLint ignored), dev artifacts are committed to the repo, and backend safeguards (rate limiting, input validation) are installed but not applied. This spec covers making the entire user-facing experience production-ready.

---

## Workstream 1: Frontend — Wire Pages to Real APIs

### 1.1 Student Dashboard (`apps/web/src/app/(student)/dashboard/page.tsx`)

**Current:** Hardcoded `mockStudent` object (name "Indigo", level 5, 120 XP, 7-day streak, 142 coins). Every user sees identical data.

**Fix:**
- Remove `mockStudent` constant
- On mount, read `studentId` from `sessionStorage`
- Fetch student data from `GET /students/:studentId`
- Fetch coin balance from `GET /coins/:studentId/balance`
- Replace all hardcoded values with API response data
- Add loading skeleton state
- Add error state with retry

**API contracts (existing):**
- `GET /students/:id` returns `{ id, name, yearLevel, currentStreak, totalXP, level, ... }`
- `GET /coins/:studentId/balance` returns `{ balance, recentTransactions }`

### 1.2 Student Profile (`apps/web/src/app/(student)/profile/page.tsx`)

**Current:** Hardcoded "Indigo", "Year 3", streak 7, coins 142, level 5. Interest buttons render but have no onClick handlers.

**Fix:**
- Fetch student data from same API as dashboard
- Display real name, year level, stats
- Wire interest selection to `PUT /students/:studentId/interests`
- Add loading and error states

### 1.3 Parent Dashboard (`apps/web/src/app/(parent)/parent-dashboard/page.tsx`)

**Current:** Coin balance "142", items owned "3", skills rewarded "5" hardcoded in JSX. Diagnostic results read from sessionStorage only.

**Fix:**
- Fetch from `GET /parent/dashboard?familyId=...` (endpoint exists)
- Wire coin balance, shop items owned, and mastery stats to API response
- Keep sessionStorage as initial/fallback for diagnostic results, but prefer API data when available
- Add loading and error states

### 1.4 Subscribe Page (`apps/web/src/app/subscribe/page.tsx`)

**Current:** Uses raw `fetch()` with hardcoded Railway production URL fallback (`https://upwiseserver-production.up.railway.app/api/v1`). Uses `alert()` for errors.

**Fix:**
- Switch to `api.post()` from `@/lib/api` (consistent with rest of app)
- Remove hardcoded production URL (api.ts already reads `NEXT_PUBLIC_API_URL`)
- Replace `alert()` calls with inline error message UI
- Add proper loading state on button

### 1.5 Start/Onboarding Page (`apps/web/src/app/(auth)/start/page.tsx`)

**Current:** `console.error("API not available")` on failure, silently continues to demo mode without telling the user.

**Fix:**
- Remove `console.error` (use proper error state instead)
- When API fails, show a visible notification that results will be saved locally (demo mode)
- Keep demo fallback for resilience, but make it transparent to the user

### 1.6 Diagnostic Page (no change)

Keep the 69 hardcoded demo questions as offline fallback. The API-first flow already works. No changes needed.

---

## Workstream 2: Backend Fixes

### 2.1 Enable Rate Limiting (`apps/server/src/index.ts`)

**Current:** `express-rate-limit` v7.4.1 is in `package.json` but never imported or applied.

**Fix:**
- Import and apply global rate limiter (100 requests/15min per IP)
- Add stricter limiter for sensitive endpoints:
  - `POST /diagnostic/*/start` — 10/hour
  - `POST /sessions/*/start` — 20/hour
  - `POST /subscriptions/checkout` — 5/hour
  - `POST /families` — 10/hour
  - `POST /admin/questions/generate` — 5/hour (expensive Claude API calls)

### 2.2 Remove Hardcoded Production URLs

**Files:** `routes/subscriptions.ts`, any other files with Railway URLs.

**Fix:**
- Remove `?? "https://upwiseserver-production.up.railway.app"` fallbacks
- If `FRONTEND_URL` env var is missing, throw a startup error (fail fast)
- Same for any other hardcoded URL fallbacks

### 2.3 Fix Temp Student ID Fallback (`routes/families.ts:79`)

**Current:** `clerkUserId: clerkUserId ?? \`temp_${Date.now()}\``

**Fix:** Make `clerkUserId` nullable in the schema. When Clerk is not yet integrated, store `null` instead of a fake ID. This avoids data integrity issues and makes the auth migration cleaner later.

### 2.4 Apply Input Validation (`middleware/validate.ts`)

**Current:** Validation middleware exists but is never used on routes.

**Fix:** Add Zod schemas and validation middleware to highest-risk endpoints:
- `POST /families` — validate email format, name length, yearLevel range (0-7)
- `POST /sessions/:id/respond` — validate answer exists, questionId is UUID
- `POST /coins/:id/purchase` — validate itemId is UUID
- `PUT /students/:id/interests` — validate array of strings, max length

### 2.5 Fix Webhook Error Handling (`routes/webhooks.ts`)

**Current:** Returns 200 even when webhook processing fails internally.

**Fix:** Wrap processing in try/catch. Return 500 on processing failure so Stripe retries. Keep 200 only on successful processing.

---

## Workstream 3: Build & Config Cleanup

### 3.1 Fix Server Build Script (`apps/server/package.json`)

**Current:** `"build": "echo 'build ok'"` — does nothing.

**Fix:** Replace with `"build": "tsc --project tsconfig.json"`. Verify the compiled output works.

### 3.2 Enable Build Validation (`apps/web/next.config.ts`)

**Current:**
```typescript
eslint: { ignoreDuringBuilds: true },
typescript: { ignoreBuildErrors: true },
```

**Fix:** Remove both overrides. Fix any resulting build errors (type errors, lint violations). This is critical — without this, broken code can reach production undetected.

### 3.3 Clean Dev Artifacts from Repo

**Files to remove (git rm --cached):**
- `all_questions.json` (7.3 MB)
- `questions_export.csv` (4.3 MB)
- `audit_results.json` (33 MB)
- `audit_refined.json` (6.7 MB)
- `audit_data.json` (110 KB)
- `all_dup_ids.json` (423 KB)
- `duplicate_ids.json` (28 KB)
- `final_report.json` (191 KB)
- `question_validation_report.xlsx` (1.5 MB)
- `audit_questions.py` (31 KB)
- `validate_questions.py` (30 KB)
- `flag_questions.py` (17 KB)

**Add to `.gitignore`:**
```
# Dev artifacts
all_questions.json
questions_export.csv
audit_*.json
audit_*.py
validate_questions.py
flag_questions.py
all_dup_ids.json
duplicate_ids.json
final_report.json
question_validation_report.xlsx
```

### 3.4 Update .env.example

**Add missing variables:**
```
STRIPE_PRICE_STANDARD=     # Stripe Price ID for Standard tier
STRIPE_PRICE_FAMILY=       # Stripe Price ID for Family tier
FRONTEND_URL=              # Required. Full URL of frontend (e.g. https://app.upwise.com.au)
```

---

## Out of Scope

- **Authentication (Clerk)** — deferred until all features are built
- **CI/CD pipeline** — no GitHub Actions
- **Docker/containerization** — infrastructure is separate
- **Monitoring/alerting** — Sentry, DataDog deferred
- **i18n** — AU-only launch
- **Offline/PWA** — deferred
- **API documentation** — Swagger/OpenAPI deferred

---

## Verification

After implementation, verify:

1. **Frontend pages:** Each page loads real data from API, shows loading skeleton, handles errors gracefully. No "Indigo" or hardcoded stats visible.
2. **Rate limiting:** Hit a rate-limited endpoint repeatedly; confirm 429 response after threshold.
3. **Build pipeline:** Run `npm run build` in both apps. Confirm no `echo` shortcuts, no ignored errors.
4. **Dev artifacts:** Confirm `git status` shows removed files, `.gitignore` prevents re-add.
5. **Type check:** `npx tsc --noEmit` passes in both apps.
6. **Subscribe flow:** Confirm no hardcoded URLs, no `alert()` calls.
