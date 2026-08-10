-- iRPGenie -- Achievement Badges (PR #179)
-- Idempotent: safe to re-run. Policies are dropped before creation.
-- Tables: user_achievements
--
-- Badge DEFINITIONS deliberately live in application code
-- (lib/achievements.ts), not in a database table. Two reasons:
--   1. Topic membership is defined by predicate functions over track_id/tags
--      in lib/topics.ts, which the Learning Center, curriculum sidebar, and
--      the PR #178 Dashboard already share. Restating that taxonomy in SQL
--      would create a second, drift-prone definition of what a "topic" is.
--   2. It matches how every other catalog in this project is stored
--      (content/deep-dives/catalog.ts, content/lessons/metadata.ts,
--      lib/topics.ts): a committed, reviewable TypeScript module.
-- This table therefore stores only the AWARD records.
--
-- No badge_code CHECK constraint, for the same anti-drift reason: adding a
-- badge would otherwise require a migration in lockstep with the registry.
-- Forgery is prevented by the grants below instead -- see the note there.

create table if not exists public.user_achievements (
  id                          uuid        primary key default uuid_generate_v4(),
  user_id                     uuid        not null references auth.users(id) on delete cascade,
  -- Stable machine-readable code from lib/achievements.ts's ACHIEVEMENTS
  -- registry. Display names/descriptions are never persisted here, so they
  -- can be reworded without a data migration.
  badge_code                  text        not null,
  earned_at                   timestamptz not null default now(),
  -- Immutable award context. Small scalars only -- no curriculum snapshots.
  lessons_completed_at_award  integer,
  qualifying_topic_id         text,
  created_at                  timestamptz not null default now(),

  -- The idempotency guarantee. Repeated reconciliation, a refresh, two
  -- concurrent requests, or a retry can never produce a second award: the
  -- server inserts with ON CONFLICT DO NOTHING against this constraint.
  unique (user_id, badge_code)
);

create index if not exists user_achievements_user_id_idx on public.user_achievements (user_id);

-- Row-Level Security
alter table public.user_achievements enable row level security;

drop policy if exists "Users can read their own achievements" on public.user_achievements;

create policy "Users can read their own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

-- Deliberately NO insert, update, or delete policy for any client role.
--
-- This is the core anti-forgery control. Eligibility depends on the topic
-- taxonomy in lib/topics.ts (JavaScript predicates), which SQL cannot
-- evaluate, so an RLS insert policy could not verify a claimed badge is
-- genuinely earned. Rather than grant a check-free insert -- which would let
-- any authenticated browser client POST an arbitrary badge_code straight to
-- PostgREST -- clients get SELECT only, and all writes go through
-- lib/achievements-server.ts using the existing server-only service-role
-- client (lib/supabase/admin.ts, the same pattern lib/ai/tutor-usage.ts
-- already uses for trusted user-scoped writes). That code recomputes
-- eligibility from `lessons` + `lesson_completions` and never trusts a
-- client-supplied count, badge code, or user id.
--
-- No delete policy or grant also means awards are permanent: nothing in the
-- application can revoke a badge, whether or not curriculum changes later.

-- Grants
-- authenticated: SELECT only (combined with the policy above, own rows only).
-- service_role bypasses RLS; it is the only writer.
grant select on public.user_achievements to authenticated;
grant select, insert on public.user_achievements to service_role;
