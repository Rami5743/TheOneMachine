-- Efficiency leaderboard ("hall of fame") for The One Machine.
-- Run this once in the Supabase project's SQL editor.
--
-- One public-read row per user. `counts` maps cardId -> the user's best (lowest)
-- Nand count for that card. Nicknames are unique (except the shared default
-- 'ללא שם'). The app reads every row to derive each card's record and the
-- signed-in user's rank; nicknames appear only on a card's records page.

create table if not exists public.rankings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  nickname   text not null default 'ללא שם',
  counts     jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.rankings enable row level security;

-- Everyone (even signed-out) can read the leaderboard.
drop policy if exists "rankings read all" on public.rankings;
create policy "rankings read all" on public.rankings
  for select using (true);

-- A user may write only their own row.
drop policy if exists "rankings insert own" on public.rankings;
create policy "rankings insert own" on public.rankings
  for insert with check (auth.uid() = user_id);

drop policy if exists "rankings update own" on public.rankings;
create policy "rankings update own" on public.rankings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Nicknames are unique case-insensitively, except the shared default 'ללא שם'.
create unique index if not exists rankings_nickname_unique
  on public.rankings (lower(nickname)) where nickname <> 'ללא שם';
