# PsalMix Waitlist — Audit Level 2 Report (Night 2)
**Date:** 2026-03-23  
**Auditor:** Nova (Forge)  
**Commit:** 526a132  
**Deploy:** dpl_EjqeVKbqHu8KvhF5Up88KA6dYwyL → READY ✅

---

## Step 1 — Files Read (Complete)

| File | Status |
|---|---|
| `src/app/api/signup/route.ts` | ✅ Read |
| `src/app/api/stats/route.ts` | ✅ Read |
| `src/app/api/share/route.ts` | ✅ Read |
| `src/app/api/user/[code]/route.ts` | ✅ Read |
| `src/app/api/admin/auth/route.ts` | ✅ Read |
| `src/app/api/admin/me/route.ts` | ✅ Read |
| `src/app/api/admin/stats/route.ts` | ✅ Read |
| `src/app/api/admin/users/route.ts` | ✅ Read |
| `src/app/api/admin/export/route.ts` | ✅ Read |
| `src/lib/adminAuth.ts` | ✅ Read |
| `src/lib/supabase.ts` | ✅ Read |
| `src/lib/flodesk.ts` | ✅ Read |
| `src/lib/rateLimit.ts` | ✅ Read |
| `src/lib/position.ts` | ✅ Read |
| `src/lib/rewards.ts` | ✅ Read |
| `src/components/ReferralLink.tsx` | ✅ Read |
| `src/components/ShareButtons.tsx` | ✅ Read |
| `src/components/sections/HeroSection.tsx` | ✅ Read |
| `src/components/sections/ProblemSection.tsx` | ✅ Read |
| `src/components/sections/SolutionSection.tsx` | ✅ Read |
| `src/components/sections/ComparisonSection.tsx` | ✅ Read |
| `src/components/sections/CTASection.tsx` | ✅ Read |
| `src/components/sections/GuaranteeSection.tsx` | ✅ Read |
| `src/app/page.tsx` | ✅ Read |
| `src/app/dashboard/[code]/page.tsx` | ✅ Read |
| `src/app/welcome/page.tsx` | ✅ Read |
| `src/app/admin/page.tsx` | ✅ Read |
| `src/app/privacy/page.tsx` | ✅ Read |
| `src/app/r/[code]/page.tsx` | ✅ Read |

---

## Step 2 — Bugs Found

### 🔴 SECURITY / CRITICAL

#### S1 — Hardcoded fallback token in adminAuth.ts
**File:** `src/lib/adminAuth.ts`  
**Issue:** `SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "psalmix-admin-dev-token"` — if the environment variable is ever missing (e.g., rotation, misconfiguration, new deployment without secrets), the admin auth silently falls back to a public string that anyone who has read the open-source repo can use indefinitely to access the admin dashboard.  
**Fix:** Changed `||` to `?? ""`. If the env var is missing, `SESSION_TOKEN` is an empty string and `isAdminAuthenticated` now short-circuits to `false` before even checking the cookie. Auth always fails when the env var is unset instead of silently granting access.

---

### 🟡 HIGH

#### H1 — `share/route.ts`: Channel not validated
**File:** `src/app/api/share/route.ts`  
**Issue:** The `channel` field was accepted as any arbitrary string. A bad actor could write garbage data into `share_events` (e.g., `"<script>..."`, long strings, path traversal attempts), polluting the analytics table.  
**Fix:** Added an allowlist: `["facebook", "instagram", "copy", "twitter", "whatsapp", "email"]`. Anything else returns HTTP 400.

#### H2 — Fake social proof: `Math.max(count, 1)` shows "1 family" with 0 signups
**File:** `src/app/page.tsx`  
**Issue:** `const displayCount = count !== null ? Math.max(count, 1) : null` — this means when the real signup count is 0, the site would show "1 families already on the waitlist." This is false social proof. The existing `>= 50` gate in `HeroSection` was the correct control — nothing should fabricate numbers above 0.  
**Fix:** Changed to `const displayCount = count` — passes the real number through. HeroSection's `displayCount !== null && displayCount >= 50` gate already handles hiding it at low counts correctly.

---

### 🟡 MEDIUM

#### M1 — `flodesk.ts` module-level console.warn fires during Vercel builds
**File:** `src/lib/flodesk.ts`  
**Issue:** `if (!API_KEY) console.warn(...)` at module scope fires every time the module is imported during `next build`, even if Flodesk is intentionally not configured in a preview/build environment. Pollutes CI/build logs.  
**Fix:** Removed the module-level warning. Each function already checks `if (!API_KEY)` at call-time with appropriate inline warnings.

---

### 🟢 LOW / INFO (Not Fixed — Noted for Level 3)

#### L1 — `rateLimit.ts`: In-memory only — Vercel serverless resets it per cold start
**File:** `src/lib/rateLimit.ts`  
**Note:** The current in-memory Map-based rate limiter provides zero protection on Vercel production (each function invocation can be a fresh process). Should be replaced with an upstash/redis-based limiter or rely on Supabase's email uniqueness constraint as the natural spam control. Tracked for Level 3.

#### L2 — `welcome/page.tsx` is orphaned
**Note:** Signup flow redirects to `/dashboard/[code]`, not `/welcome?code=`. The welcome page is unreachable. Tracked for Level 3 cleanup.

#### L3 — Admin export CSV shows UUID for "Referred By" column
**File:** `src/app/api/admin/export/route.ts`  
**Note:** The exported CSV includes the internal Supabase UUID for `referred_by`, not the referrer's email address. Requires cross-referencing to understand. Tracked for Level 3.

#### L4 — Privacy page uses light theme, inconsistent with dark site
**Note:** `bg-amber-50` background on privacy page vs dark background everywhere else. Jarring transition. Low priority, purely cosmetic.

---

## Step 3 — Fixes Applied

| # | Issue | File(s) | Fix |
|---|---|---|---|
| S1 | Hardcoded fallback admin token | `lib/adminAuth.ts` | Removed OR fallback; empty string + early `false` return |
| H1 | Unvalidated `channel` in share endpoint | `api/share/route.ts` | Added allowlist + 400 on invalid channel |
| H2 | `Math.max(count, 1)` fake social proof | `app/page.tsx` | Pass real count; gate in HeroSection handles display |
| M1 | Module-level console.warn during builds | `lib/flodesk.ts` | Removed; each fn already checks at call-time |

---

## TSC
```
npx tsc --noEmit → (no output) ✅ Clean
```

---

## Git
```
commit 526a132
fix(audit-l2-night2): security, social proof, share validation, module warnings
```

## Deploy
```
Deployment: dpl_EjqeVKbqHu8KvhF5Up88KA6dYwyL
State: READY ✅
URL: psalmix-waitlist-8jg8q1xsv-mmcmedias-projects.vercel.app
```

---

## Level 3 Backlog
1. Replace in-memory rate limiter with Upstash Redis or similar persisted solution
2. Remove/redirect `/welcome` page (orphaned)
3. Add referrer email lookup to CSV export (currently shows UUID)
4. Fix privacy page theme to match dark site design
