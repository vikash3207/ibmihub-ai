-- iRPGenie -- allow 'insight' as an AI Tutor usage origin (AI Tutor
-- Insights/Deep Dives Grounding)
--
-- Forward-only. Migrations 006 through 012 are NOT edited.
--
-- 009 widened the origin check constraint to permit 'deep-dive' and, doing
-- so, gave it a stable explicit name: ai_tutor_usage_events_origin_check.
-- This migration targets that name directly (no name-discovery step
-- needed, unlike 009, which had to find 006's anonymously-named inline
-- constraint first).
--
-- Safety:
--   * Every existing value ('standalone','lesson','practice','deep-dive')
--     stays valid, so no existing row can be invalidated. The new
--     constraint is a strict superset of the old one.
--   * Only the constraint on `origin` is touched; blocked_reason's check and
--     every other constraint are left alone.
--   * Idempotent: if the constraint already permits 'insight' (re-running
--     this migration, or it was already applied), this is a no-op.
--
-- Reversal: drop ai_tutor_usage_events_origin_check and re-add it without
--   'insight'. That is only safe once no row uses the value:
--     delete from public.ai_tutor_usage_events where origin = 'insight';
--   (usage events are analytics/limit accounting, not user content).

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.ai_tutor_usage_events'::regclass
      and conname = 'ai_tutor_usage_events_origin_check'
      and pg_get_constraintdef(oid) not ilike '%insight%'
  ) then
    alter table public.ai_tutor_usage_events
      drop constraint ai_tutor_usage_events_origin_check;

    alter table public.ai_tutor_usage_events
      add constraint ai_tutor_usage_events_origin_check
      check (origin in ('standalone', 'lesson', 'practice', 'deep-dive', 'insight'));
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- VERIFICATION -- run in the Supabase SQL editor after applying.
--
-- a) The constraint exists, is named, and lists all five values:
--      select conname, pg_get_constraintdef(oid)
--      from pg_constraint
--      where conrelid = 'public.ai_tutor_usage_events'::regclass
--        and contype = 'c';
--    Expect a row: ai_tutor_usage_events_origin_check
--      CHECK (origin = ANY (ARRAY['standalone','lesson','practice','deep-dive','insight']))
--
-- b) Existing rows are still valid (expect 0):
--      select count(*) from public.ai_tutor_usage_events
--      where origin not in ('standalone','lesson','practice','deep-dive','insight');
--
-- c) The new value is accepted and the old ones still are. Run inside a
--    transaction you roll back, substituting a real user id:
--      begin;
--      insert into public.ai_tutor_usage_events (user_id, origin, message_length)
--      values ('<some-auth-user-uuid>', 'insight', 10);
--      rollback;
--
-- d) An invalid value is still rejected (expect a check violation):
--      begin;
--      insert into public.ai_tutor_usage_events (user_id, origin, message_length)
--      values ('<some-auth-user-uuid>', 'not-a-real-origin', 10);
--      rollback;
-- ---------------------------------------------------------------------------
