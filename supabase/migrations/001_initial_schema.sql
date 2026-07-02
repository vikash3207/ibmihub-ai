-- IBMiHub AI — Initial Schema (Sprint 1 First Coding Batch)
-- Run this against your Supabase project in the SQL Editor.
-- Tables in this migration: user_profiles, lessons
-- NOT included (future migrations): progress, feedback, ai_usage_log, waitlist

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── user_profiles ──────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  onboarding_response text        null,
  onboarding_skipped  boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

-- Row-Level Security on user_profiles
alter table public.user_profiles enable row level security;

create policy "Users can read their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── lessons ────────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id                        uuid        primary key default uuid_generate_v4(),
  slug                      text        not null unique,
  title                     text        not null,
  short_description         text        not null default '',
  lesson_order              integer     not null,
  learning_path_id          text        not null default 'ibm-i-fundamentals',
  status                    text        not null default 'Draft'
                              check (status in ('Draft', 'Review Ready', 'Approved', 'Published', 'Unpublished / Archived')),
  content_source_path       text        not null,
  estimated_reading_time    integer     null,
  ai_tutor_starter_question text        null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index if not exists lessons_slug_idx       on public.lessons (slug);
create index if not exists lessons_status_idx     on public.lessons (status);
create index if not exists lessons_order_idx      on public.lessons (lesson_order);

create trigger lessons_updated_at
  before update on public.lessons
  for each row execute procedure public.handle_updated_at();

-- Row-Level Security on lessons
-- Lessons are publicly readable when Published; only the service role can write.
alter table public.lessons enable row level security;

create policy "Anyone can read published lessons"
  on public.lessons for select
  using (status = 'Published');

-- Service role bypasses RLS; all writes go through the seed script using the
-- service role key. No client-side writes to the lessons table.
