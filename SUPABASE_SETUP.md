# Supabase Setup for PsalMix Waitlist

## 1) Create project
- Create a new Supabase project and database.
- Save the **Project URL** and **Service Role Key**.

## 2) Run schema
Use the SQL editor in Supabase and run:

```
-- File: supabase/schema.sql
```

This creates:
- `waitlist_users`
- `referrals`
- `share_events` (optional share tracking)

> Note: `waitlist_users` includes a `referral_count` column for quick counters.

## 3) Environment variables
Create `.env.local` in the project root:

```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_MOCK_MODE=false
```

## 4) Run locally
```
npm install
npm run dev
```

## 5) Deploy to Vercel
- Add the same environment variables in Vercel Project Settings.
- Deploy the Next.js app.

## Notes
- Referral links use `/r/[code]` and redirect to `/?ref=code`.
- The waitlist position is assigned at signup, then adjusted via referrals.
