# PsalMix Waitlist — Audit Level 4: Data Flow & State Tracing

**Date:** 2026-03-22  
**Auditor:** Nova (Forge)  
**Build:** `npm run build` → clean, TSC clean  
**Commit:** `605ad55`  
**Deployed:** https://psalmix-waitlist.vercel.app ✅

---

## Audit Philosophy

Level 4 traces **data** and **state** end to end across every user-facing flow — not just execution paths, but what's in each field at each step, what's missing, and what the user sees if something breaks mid-flow.

---

## Flow 1: Signup

### Data Trace: form → POST → validate → DB → Flodesk → response → redirect

| Step | Data Present | Possible Gaps | User Shown on Failure |
|------|-------------|---------------|----------------------|
| Form submit | `email` (trimmed+lowercased in API), `referralCode` (from URL param or empty string) | No `firstName` — form doesn't collect it | Inline error via `setStatus("error")` |
| POST body | `{ email, referralCode }` | N/A | — |
| Validation | `email` must be non-empty string, `referralCode` optional | Empty email → 400 "Email is required" | Error toast on homepage |
| Duplicate check | `maybeSingle()` query by email | Returns null if new, record if existing | Existing: 200 `{ already: true, referralCode, position }` → redirect to their dashboard |
| Referral code gen | Loop up to 5 attempts | Collision on all 5 → **was silently falling through** (FIXED: now returns 500) | "Server error — please try again" |
| DB insert | `email, first_name: null, referral_code, position: (count+1), referred_by: referrerId\|null` | `position` race condition (two simultaneous signups) | 500 "Server error" |
| Referral credit | `UPDATE referred_by SET referral_count++` then `updateReferralCount(email, count)` | If referred_by lookup fails, credit is skipped silently | Nothing — signup still completes |
| Flodesk sync | `first_name: ''` (no first name from form), custom fields with position/code | If Flodesk is down → logged, signup proceeds | Nothing — non-blocking |
| Response | `{ position, referralCode }` | — | — |
| Client redirect | `router.push("/dashboard/${referralCode}")` | Success state flashes briefly before redirect | Success screen (intentional) |

**Bug Fixed (BUG-L4-01):** Referral code collision loop didn't guard the 5th failure — now returns 500 with clear message.

**Bug Fixed (BUG-L4-13):** `"You&apos;re already on the list!"` was a JSX-escaped entity in a JS string literal → rendered as literal ampersand-encoded text. Fixed to `"You're already on the list!"`.

**Design Note:** No `firstName` field in signup form (intentional — minimal friction). Flodesk receives `first_name: ""` which is valid.

---

## Flow 2: Dashboard

### Data Trace: URL param → API call → DB query → position calc → render

| Step | Data Present | Edge Cases Checked |
|------|-------------|-------------------|
| URL `/dashboard/[code]` | `params.code` from URL | If code is garbage → API returns 404 |
| `useEffect` fetch | `GET /api/user/${params.code}` | Race: `loading=true, data=null` until fetch resolves |
| DB query | `SELECT * WHERE referral_code = ?` via `.maybeSingle()` | Missing code → 404 `{ error: "User not found" }` |
| Position calc | `calculatePosition()` from `position.ts` | `Math.max(1, ...)` — position always ≥ 1 ✅ |
| `data?.position ?? 0` | Only rendered after `!loading && !fetchError` | `data` is never null when rendered — safe ✅ |
| `data?.referrals ?? 0` | Same guard | 0 referrals is valid → correct tier display ✅ |

**Reward Tier Edge Cases (all verified correct):**
- 0 referrals → "Digital Devotional Pack" at 0%, next tier at 3 ✅
- 1 referral → 33% progress to tier 2 ✅
- 3 referrals → first tier unlocked, 0% to tier 2 (at 10) ✅
- 10 referrals → second tier unlocked ✅
- 25 referrals → third tier unlocked ✅
- 50 referrals → fourth tier unlocked, `getProgressToNextTier` returns 100% ✅

**No bugs found** in position/reward logic.

---

## Flow 3: Referral Link

### Data Trace: /r/[code] → redirect → homepage with ?ref= → pre-fill → signup with credit

| Step | Data Present | Behavior |
|------|-------------|----------|
| `/r/[code]` hit | Server-side `redirect("/?ref=CODE")` | 307 redirect, browser URL changes to `/?ref=CODE` |
| `useSearchParams()` | Reads `?ref=` from URL | Lives in URL — survives reload (param stays in URL) ✅ |
| `referralCode` state | Set once on mount via `searchParams.get("ref")` | If user navigates away and back WITHOUT the `?ref=` param, ref is lost — expected behavior for URL-based referral |
| Signup POST | `referralCode` sent in body | Referral credited to the referrer ✅ |

**No sessionStorage persistence needed** — the URL is the source of truth. If the user opens `/r/CODE` fresh in a new tab, the `?ref=` persists in their browser URL until they submit or navigate away.

---

## Flow 4: Admin

### Data Trace: login → cookie → stats → users → export → logout

| Step | Data Present | Before Fix | After Fix |
|------|-------------|-----------|----------|
| Login form | `password` → POST `/api/admin/auth` | N/A | N/A |
| Cookie set | `httpOnly, secure, sameSite:lax, maxAge:28800, path:"/"` | Working ✅ | Working ✅ |
| Browser refresh | React state `authenticated=false` → forced re-login | ❌ Every refresh = re-login | ✅ GET `/api/admin/me` auto-restores session |
| Stats load | Supabase queries inside `GET /api/admin/stats` | ❌ Module-level `createClient` crashed Vercel build | ✅ Lazy-initialized with `getSupabase()` |
| Users load | Same issue | ❌ Same crash | ✅ Fixed |
| Export | Same issue | ❌ Same crash | ✅ Fixed |
| Logout | DELETE `/api/admin/auth` | ❌ `cookies.delete()` may not match browser cookie path | ✅ Now sets `maxAge:0, path:"/"` explicitly |
| Logout UI | Logout button | ❌ No logout button in UI | ✅ Added to dashboard header |

---

## Bugs Found and Fixed

| ID | Severity | Location | Description | Fix |
|----|----------|---------|-------------|-----|
| BUG-L4-01 | Medium | `api/signup/route.ts` | Referral code collision: loop exited without guard — 5th collision attempt fell through to insert potentially duplicate code | Replaced `while` loop with `for` + `codeUnique` boolean; returns 500 if all 5 attempts collide |
| BUG-L4-05 | Low | `api/admin/auth/route.ts` | `cookies.delete()` without explicit `path:"/"` — browser may not clear cookie if path doesn't match Set-Cookie path | Replaced with explicit `maxAge:0, path:"/"` Set-Cookie |
| BUG-L4-11 | High | `app/admin/page.tsx` + new `api/admin/me/route.ts` | Admin forced to re-login on every browser refresh — no session restore | Added `GET /api/admin/me` endpoint; admin page calls it on mount to auto-restore session |
| BUG-L4-12 | Medium | `app/admin/page.tsx` | No logout button in admin UI — `DELETE /api/admin/auth` route existed but was unreachable | Added Logout button to dashboard header; `handleLogout()` clears state and calls DELETE |
| BUG-L4-13 | Medium | `app/page.tsx` | `"You&apos;re already on the list!"` — HTML entity in JS string literal renders as literal text, not apostrophe | Changed to `"You're already on the list!"` (raw string) |
| BUG-L4-BUILD | Critical | `api/admin/stats`, `users`, `export` | Module-level `createClient(process.env.SUPABASE_URL!)` crashes Vercel build ("supabaseUrl is required") when env vars absent during page-data collection phase | Lazy-initialized with `getSupabase()` function — only called inside route handlers, not at module load |

---

## Data State Invariants Confirmed

1. **Position is always ≥ 1** — `Math.max(1, ...)` in `calculatePosition()` ✅
2. **Referral count is never null in render** — `?? 0` fallbacks throughout ✅
3. **`ref` param survives page reload** — URL-based (not session-only) ✅
4. **DB position is monotonically increasing** — count-based assignment at insert time ✅
5. **Flodesk failures are non-blocking** — try/catch returns null, signup continues ✅
6. **Admin cookie path matches logout** — fixed in this audit ✅

---

## Pre-Existing Non-Blocking Warnings

- `/admin` page uses `<img>` instead of `<Image />` (Next.js ESLint warning, non-blocking)
- `metadataBase` not set in root layout (affects OG image resolution in social previews, non-critical)

---

## Level 4 Status: COMPLETE

All 5 runtime bugs + 1 build bug fixed. TSC clean. Build clean. Deployed to production.

**Next Audit Level (L5 — if needed):** Load testing, concurrent signup race conditions (position assignment under high traffic), and Supabase Row Level Security (RLS) policy audit.
