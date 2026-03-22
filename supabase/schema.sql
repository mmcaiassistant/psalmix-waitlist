-- PsalMix waitlist schema
-- Enable UUID generation
create extension if not exists "pgcrypto";

create table if not exists waitlist_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  referral_code text not null unique,
  referred_by uuid references waitlist_users(id) on delete set null,
  position integer not null,
  referral_count integer not null default 0,
  created_at timestamp with time zone not null default now()
);

create index if not exists waitlist_users_referral_code_idx on waitlist_users (referral_code);
create index if not exists waitlist_users_referred_by_idx on waitlist_users (referred_by);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references waitlist_users(id) on delete cascade,
  referee_id uuid not null references waitlist_users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  unique (referrer_id, referee_id)
);

create index if not exists referrals_referrer_idx on referrals (referrer_id);
create index if not exists referrals_referee_idx on referrals (referee_id);

create table if not exists share_events (
  id uuid primary key default gen_random_uuid(),
  referral_code text not null,
  channel text not null,
  created_at timestamp with time zone not null default now()
);
