# PsalMix Waitlist — Audit Level 2 Report
**Date:** 2026-03-22  
**Auditor:** Nova (Forge)  
**Commit:** 519e98d  
**Deploy:** dpl_BU16UEfPJuQZCkN41EeAv9PUPb3J → READY

---

## STEP 1 — Files Read

| File | Status |
|---|---|
| `src/app/api/signup/route.ts` | ✅ Read |
| `src/app/api/admin/auth/route.ts` | ✅ Read |
| `src/app/api/admin/users/route.ts` | ✅ Read |
| `src/app/api/admin/stats/route.ts` | ✅ Read |
| `src/app/api/admin/export/route.ts` | ✅ Read |
| `src/app/api/user/[code]/route.ts` | ✅ Read |
| `src/app/api/stats/route.ts` | ✅ Read |
| `src/app/api/share/route.ts` | ✅ Read |
| `src/app/api/debug-flodesk/route.ts` | ✅ Read (DELETED) |
| `src/lib/supabase.ts` | ✅ Read |
| `src/lib/supabaseServer.ts` | ✅ Read |
| `src/lib/adminAuth.ts` | ✅ Read |
| `src/lib/flodesk.ts` | ✅ Read |
| `src/lib/position.ts` | ✅ Read |
| `src/lib/rewards.ts` | ✅ Read |
| `src/lib/email.ts` | ✅ Read |
| `src/components/ReferralLink.tsx` | ✅ Read |
| `src/components/ShareButtons.tsx` | ✅ Read |
| `src/components/PositionDisplay.tsx` | ✅ Read |
| `src/components/RewardTier.tsx` | ✅ Read |
| `src/components/RewardProgress.tsx` | ✅ Read |
| `src/app/page.tsx` | ✅ Read |
| `src/app/welcome/page.tsx` | ✅ Read |
| `src/app/dashboard/[code]/page.tsx` | ✅ Read |
| `src/app/admin/page.tsx` | ✅ Read |
| `src/app/privacy/page.tsx` | ✅ Read |
| `next.config.mjs` | ✅ Read |
| `package.json` | ✅ Read |
| `tsconfig.json` | ✅ Read |

---

## STEP 2 — Issues Found

### 🔴 CRITICAL

#### C1 — Admin cookie path blocks all API calls
**File:** `src/app/api/admin/auth/route.ts`  
**Issue:** Cookie was set with `path: "/admin"`. The browser only sends cookies that match the request path. Admin API routes live at `/api/admin/*`, which does NOT fall under `/admin` — so the cookie was never sent to stats/users/export. Every admin API call returned 401, even after successful login.  
**Impact:** Admin dashboard was completely broken — login appeared to succeed but all data fetches failed silently.  
**Fix:** Changed `path` from `"/admin"` to `"/"` so the cookie is sent to all routes.

---

### 🔴 SECURITY

#### S1 — Debug endpoint leaked API key fragments in production
**File:** `src/app/api/debug-flodesk/route.ts` (now deleted)  
**Issue:** Unauthenticated GET `/api/debug-flodesk` returned:
- `keyStart`: first 20 characters of Flodesk API key
- `keyEnd`: last 10 characters of Flodesk API key
- `segmentId`: Flodesk segment ID

Anyone with the URL could reconstruct partial credentials and identify the key format. No auth guard existed.  
**Fix:** Endpoint deleted entirely.

---

### 🟡 HIGH

#### H1 — `first_name` never returned by admin API
**Files:** `src/app/api/admin/users/route.ts`, `src/app/api/admin/stats/route.ts`  
**Issue:** `first_name` is stored in the DB at signup, but:
- `/api/admin/users` hardcoded `name: null` for every user
- `/api/admin/stats` top-referrers query never selected `first_name`

The admin UI showed every user as nameless.  
**Fix:** Added `first_name` to both SELECT statements; removed `name: null` override.

#### H2 — Admin page interfaces mismatched API snake_case responses
**File:** `src/app/admin/page.tsx`  
**Issue:** TypeScript interfaces used camelCase (`referralCount`, `createdAt`, `referredBy`, `name`) but API returns snake_case (`referral_count`, `created_at`, `referred_by`, `first_name`). React rendered blank values for referral counts, dates, names, and referred-by emails — silently.  
**Fix:** Rewrote all admin page interfaces to match the actual API response shape.

---

### 🟡 MEDIUM

#### M1 — `select("*")` in user route
**File:** `src/app/api/user/[code]/route.ts`  
**Issue:** Fetching all columns when only `id, email, referral_code, referral_count, position` are needed. Exposes any future internal fields added to the table.  
**Fix:** Changed to explicit column list.

#### M2 — SimpleBarChart divide-by-zero
**File:** `src/app/admin/page.tsx`  
**Issue:** `Math.max(...data.map(d => d.count))` returns `-Infinity` when all counts are 0 (no signups). Every bar would render at `0/0 = NaN%` height.  
**Fix:** Clamped `maxCount` to `Math.max(..., 1)`.

#### M3 — Admin dashboard shows blank screen on load error
**File:** `src/app/admin/page.tsx`  
**Issue:** If `/api/admin/stats` or `/api/admin/users` failed (e.g., because of the cookie bug), `loadDashboardData` swallowed the error silently — admin saw nothing but a blank page with no feedback.  
**Fix:** Added `dataError` state with a visible red error banner.

#### M4 — Unused `cookies` import in adminAuth.ts
**File:** `src/lib/adminAuth.ts`  
**Issue:** `import { cookies } from "next/headers"` was present but never used. Causes TypeScript noise and unnecessary module reference.  
**Fix:** Removed unused import.

---

### 🟢 LOW / INFO

#### L1 — Export silent failure in admin UI
**File:** `src/app/admin/page.tsx`  
**Issue:** If CSV export failed, the error was only logged to console — no user feedback.  
**Fix:** Added `alert()` on export failure.

#### L2 — `supabaseServer.ts` appears to duplicate `supabase.ts`
**File:** `src/lib/supabaseServer.ts`  
**Issue:** Both files export a `supabase` singleton using `SUPABASE_SERVICE_ROLE_KEY`. The "Server" version is not actually needed — API routes already import from `supabase.ts` directly. Not a bug, but dead code.  
**Note:** Not removed to avoid risk; tracked for Level 3 cleanup.

#### L3 — `route-with-flowdesk.ts` is a dead backup file
**File:** `src/app/api/signup/route-with-flowdesk.ts`  
**Issue:** Old copy of the signup route that is not registered as an active Next.js route handler. Not harmful but adds confusion.  
**Note:** Not removed; tracked for Level 3 cleanup.

#### L4 — Admin export CSV includes `referred_by` as UUID, not email
**File:** `src/app/api/admin/export/route.ts`  
**Issue:** The "Referred By" column in the export CSV contains the internal `referred_by` UUID, not the referrer's email. McKinzie would need to cross-reference separately.  
**Note:** Tracked for Level 3 — add referrer email lookup in export.

---

## STEP 3 — Fixes Applied

| # | Issue | File(s) | Fix |
|---|---|---|---|
| C1 | Cookie path `/admin` → `/` | `api/admin/auth/route.ts` | Changed `path: "/"` |
| S1 | Debug endpoint leaking API key | `api/debug-flodesk/route.ts` | Deleted file |
| H1 | `first_name` missing from admin API | `api/admin/users/route.ts`, `api/admin/stats/route.ts` | Added to SELECT |
| H2 | Admin page interface mismatch | `app/admin/page.tsx` | Full interface rewrite to snake_case |
| M1 | `select("*")` in user route | `api/user/[code]/route.ts` | Explicit column list |
| M2 | Divide-by-zero in chart | `app/admin/page.tsx` | Clamp `maxCount` to ≥ 1 |
| M3 | Silent dashboard error | `app/admin/page.tsx` | Added error banner + state |
| M4 | Unused import in adminAuth | `lib/adminAuth.ts` | Removed |
| L1 | Export silent failure | `app/admin/page.tsx` | Added `alert()` |

---

## TSC
```
npx tsc --noEmit → (no output) ✅ Clean
```

---

## Git
```
commit 519e98d
fix(audit-l2): cookie path, first_name, debug endpoint, type safety
```

## Deploy
```
Deployment ID: dpl_BU16UEfPJuQZCkN41EeAv9PUPb3J
State: READY ✅
```

---

## Level 3 Backlog (Deferred)
- Remove dead `supabaseServer.ts` after confirming no usage
- Delete `route-with-flowdesk.ts` backup file
- Add referrer email lookup to CSV export
- Consider rate limiting on `/api/signup`
- Consider timing-safe password comparison in admin auth (though password length is not the attack surface here)
