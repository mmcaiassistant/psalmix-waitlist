-- PsalMix Waitlist Schema (local reference)
-- Run migrations in Supabase SQL Editor if not already applied:

-- 1. Add first_name column (if missing)
-- ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS first_name TEXT;

-- 2. Atomic referral count increment RPC:
-- CREATE OR REPLACE FUNCTION increment_referral_count(user_id UUID)
-- RETURNS INTEGER LANGUAGE plpgsql AS $$
-- DECLARE new_count INTEGER;
-- BEGIN
--   UPDATE waitlist_users SET referral_count = referral_count + 1
--   WHERE id = user_id RETURNING referral_count INTO new_count;
--   RETURN new_count;
-- END;
-- $$;

-- 3. [RECOMMENDED] Atomic position assignment — prevents race conditions under
--    concurrent signups. Run this in Supabase SQL Editor:
--
-- CREATE OR REPLACE FUNCTION get_next_position()
-- RETURNS INTEGER LANGUAGE plpgsql AS $$
-- DECLARE next_pos INTEGER;
-- BEGIN
--   SELECT COALESCE(MAX(position), 0) + 1 INTO next_pos FROM waitlist_users;
--   RETURN next_pos;
-- END;
-- $$;
--
-- Once deployed, update the signup route to call:
--   const { data: nextPos } = await supabase.rpc('get_next_position');
--   const position = nextPos ?? 1;
-- This replaces the current count-then-insert pattern.
--
-- Note: Two simultaneous signups from different emails could still land the
-- same position if they both call get_next_position before either inserts.
-- A true serial sequence (ALTER TABLE waitlist_users ALTER COLUMN position SET DEFAULT nextval('...'))
-- is the gold-standard fix. For MVP scale (< 10k/day), this RPC is sufficient.
--
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist_users(id) ON DELETE SET NULL,
  position INTEGER NOT NULL,
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES waitlist_users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES waitlist_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (referrer_id, referee_id)
);

CREATE TABLE IF NOT EXISTS share_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT NOT NULL,
  channel TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
