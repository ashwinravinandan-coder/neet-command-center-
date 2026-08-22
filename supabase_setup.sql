-- ============================================================
-- Run this ONCE in Supabase → SQL Editor → New Query → Run.
-- Creates the single table the whole app uses (one row per
-- user per data-key, e.g. "taskStates", "history", etc.)
-- and locks it down so each user can only see their own rows.
-- ============================================================

create table if not exists app_data (
  user_id uuid references auth.users(id) on delete cascade not null,
  key text not null,
  value jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, key)
);

alter table app_data enable row level security;

create policy "Users can read their own data"
  on app_data for select
  using (auth.uid() = user_id);

create policy "Users can insert their own data"
  on app_data for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own data"
  on app_data for update
  using (auth.uid() = user_id);

create policy "Users can delete their own data"
  on app_data for delete
  using (auth.uid() = user_id);
