-- Leaderboard ("hall of fame") for The One Machine — efficiency, speed & design.
-- Run this once in the Supabase project's SQL editor.
--
-- One public-read row per user.
--   `counts` maps cardId -> the user's best (lowest) TOTAL Nand count  (efficiency)
--   `serial` maps cardId -> the user's best (lowest) SERIAL Nand count (speed:
--            the most Nands in series on any input→output path)
--   `design` maps cardId -> the user's best (lowest) DESIGN TIME in seconds
--            (how long it took to design the card, incl. its user cards)
-- Nicknames are unique (except the shared default 'ללא שם'). The app reads every
-- row to derive each card's record and the signed-in user's rank; nicknames
-- appear only on a card's records page.
--
-- No DROP statements (so the SQL editor shows no "destructive operation"
-- warning). Run it once; a second run errors harmlessly on the policies.
-- If the table already exists from an earlier version, the `add column`
-- statements below add the new `serial` / `design` columns.

create table if not exists public.rankings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  nickname   text not null default 'ללא שם',
  counts     jsonb not null default '{}'::jsonb,
  serial     jsonb not null default '{}'::jsonb,
  design     jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- For projects whose `rankings` table predates the speed / design leaderboards.
alter table public.rankings add column if not exists serial jsonb not null default '{}'::jsonb;
alter table public.rankings add column if not exists design jsonb not null default '{}'::jsonb;

alter table public.rankings enable row level security;

-- Everyone (even signed-out) can read the leaderboard.
create policy "rankings read all" on public.rankings
  for select using (true);

-- A user may write only their own row.
create policy "rankings insert own" on public.rankings
  for insert with check (auth.uid() = user_id);

create policy "rankings update own" on public.rankings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Nicknames are unique case-insensitively, except the shared default 'ללא שם'.
create unique index if not exists rankings_nickname_unique
  on public.rankings (lower(nickname)) where nickname <> 'ללא שם';
