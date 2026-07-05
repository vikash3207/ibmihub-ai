-- IBMiHub AI -- AI Tutor Feedback and Usage Logging (Batch 19 / Spec 001 AI Tutor MVP)
-- Idempotent: safe to re-run. Policies are dropped before creation.
-- Tables: ai_tutor_feedback, ai_usage_log
-- Neither table stores prompt text, response text, or conversation content.

-- ai_tutor_feedback
create table if not exists public.ai_tutor_feedback (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  response_id  text        not null,
  is_helpful   boolean     not null,
  created_at   timestamptz not null default now(),

  unique (user_id, response_id)
);

create index if not exists ai_tutor_feedback_user_id_idx on public.ai_tutor_feedback (user_id);

-- ai_usage_log
-- input_tokens/output_tokens default to 0 so error or rate-limited requests
-- (where the provider never returned usage data) can still be logged without
-- a not-null violation. total_tokens is derived, never independently wrong.
create table if not exists public.ai_usage_log (
  id             uuid        primary key default uuid_generate_v4(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  model          text        not null,
  input_tokens   integer     not null default 0,
  output_tokens  integer     not null default 0,
  total_tokens   integer     generated always as (input_tokens + output_tokens) stored,
  status         text        not null check (status in ('success', 'error', 'rate_limited')),
  created_at     timestamptz not null default now()
);

create index if not exists ai_usage_log_user_id_idx on public.ai_usage_log (user_id);

-- Row-Level Security on both tables
-- MVP is insert-only from the application's perspective: neither table has a
-- select policy for `authenticated`, since no MVP UI reads this data back.
-- Product review happens via the Supabase SQL Editor using the service role,
-- which bypasses RLS. No update or delete policy exists on either table.
alter table public.ai_tutor_feedback enable row level security;
alter table public.ai_usage_log enable row level security;

drop policy if exists "Users can insert their own feedback" on public.ai_tutor_feedback;
drop policy if exists "Users can insert their own usage log rows" on public.ai_usage_log;

create policy "Users can insert their own feedback"
  on public.ai_tutor_feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can insert their own usage log rows"
  on public.ai_usage_log for insert
  with check (auth.uid() = user_id);

-- Grants
-- `authenticated` gets insert only (no select), matching the RLS design
-- above. `service_role` gets select + insert for manual review and
-- programmatic logging; it already bypasses RLS by nature.
grant insert on public.ai_tutor_feedback to authenticated, service_role;
grant select on public.ai_tutor_feedback to service_role;

grant insert on public.ai_usage_log to authenticated, service_role;
grant select on public.ai_usage_log to service_role;
