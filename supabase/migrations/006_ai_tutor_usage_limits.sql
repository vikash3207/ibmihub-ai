-- AI Tutor Beta Usage Limits (PR #149)
-- Idempotent: safe to re-run. Policies are dropped before creation.
-- Table: ai_tutor_usage_events
-- Does not store prompt text, response text, or conversation content --
-- only request metadata, mirroring 003_ai_tutor_feedback_and_usage.sql's
-- privacy stance for ai_usage_log/ai_tutor_feedback.

-- was_blocked/blocked_reason are kept consistent by a check constraint
-- rather than by convention alone: a blocked row always has a reason, and
-- an allowed row never does.
create table if not exists public.ai_tutor_usage_events (
  id                       uuid        primary key default uuid_generate_v4(),
  user_id                  uuid        not null references auth.users(id) on delete cascade,
  created_at               timestamptz not null default now(),
  origin                   text        not null check (origin in ('standalone', 'lesson', 'practice')),
  message_length           integer     not null default 0,
  -- Actual provider-reported tokens when available (a completed, allowed
  -- request); a character-based estimate (Math.ceil(length / 4)) otherwise,
  -- including every blocked request, which never reaches the model.
  estimated_input_tokens   integer,
  estimated_output_tokens  integer,
  -- Null for a blocked request -- no model call was ever made.
  model                    text,
  was_blocked              boolean     not null default false,
  blocked_reason           text        check (blocked_reason in ('message_too_long', 'cooldown', 'daily_limit')),

  check ((was_blocked = false and blocked_reason is null) or (was_blocked = true and blocked_reason is not null))
);

-- Serves both the cooldown check (last allowed row for a user) and the
-- daily-count check (allowed rows for a user since UTC midnight).
create index if not exists ai_tutor_usage_events_user_created_idx
  on public.ai_tutor_usage_events (user_id, created_at desc);

-- Row-Level Security
-- The API route (app/api/ai-tutor/route.ts, via lib/ai/tutor-usage.ts) uses
-- the service-role client for every read/write against this table, since
-- quota enforcement is a server-side decision, not something the product
-- currently needs to show back to the user (no usage-history UI exists).
-- The `authenticated` insert policy below is not exercised by any current
-- code path; it exists only as a defense-in-depth safety net (matching
-- 003's precedent) in case a future feature ever writes here with the
-- user's own session client -- RLS still confines it to the user's own
-- rows. There is deliberately no `authenticated` select policy, so a user
-- can never read their own or anyone else's usage rows directly.
alter table public.ai_tutor_usage_events enable row level security;

drop policy if exists "Users can insert their own usage events" on public.ai_tutor_usage_events;

create policy "Users can insert their own usage events"
  on public.ai_tutor_usage_events for insert
  with check (auth.uid() = user_id);

grant insert on public.ai_tutor_usage_events to authenticated, service_role;
grant select on public.ai_tutor_usage_events to service_role;
