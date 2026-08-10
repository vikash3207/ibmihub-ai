-- iRPGenie -- allow 'deep-dive' as an AI Tutor usage origin (PR #181)
--
-- Forward-only. Migrations 006, 007, and 008 are NOT edited.
--
-- 006 created ai_tutor_usage_events with an INLINE check constraint:
--     origin text not null check (origin in ('standalone','lesson','practice'))
-- Because it was declared inline it has a Postgres-generated name (normally
-- ai_tutor_usage_events_origin_check, but that is an implementation detail
-- and is not guaranteed). This migration therefore DISCOVERS the existing
-- origin check constraint from the catalog rather than hard-coding a name,
-- drops it, and re-adds an equivalent constraint -- explicitly named this
-- time -- that also permits 'deep-dive'.
--
-- Safety:
--   * Every existing value ('standalone','lesson','practice') stays valid,
--     so no existing row can be invalidated. The new constraint is a strict
--     superset of the old one.
--   * Only the constraint on `origin` is touched; blocked_reason's check and
--     every other constraint are left alone.
--   * Idempotent: re-running finds the new named constraint already present
--     and is a no-op.
--
-- Reversal: drop ai_tutor_usage_events_origin_check and re-add it without
--   'deep-dive'. That is only safe once no row uses the value:
--     delete from public.ai_tutor_usage_events where origin = 'deep-dive';
--   (usage events are analytics/limit accounting, not user content).

do $$
declare
  existing_constraint text;
begin
  -- Find whichever check constraint currently governs `origin`, by name-
  -- agnostic inspection of its definition.
  select con.conname
    into existing_constraint
  from pg_constraint con
  where con.conrelid = 'public.ai_tutor_usage_events'::regclass
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%origin%'
    and pg_get_constraintdef(con.oid) ilike '%standalone%'
  limit 1;

  if existing_constraint is not null then
    execute format(
      'alter table public.ai_tutor_usage_events drop constraint %I',
      existing_constraint
    );
  end if;

  -- Re-add with an explicit, stable name so any future migration can target
  -- it directly instead of repeating this discovery step.
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.ai_tutor_usage_events'::regclass
      and conname = 'ai_tutor_usage_events_origin_check'
  ) then
    alter table public.ai_tutor_usage_events
      add constraint ai_tutor_usage_events_origin_check
      check (origin in ('standalone', 'lesson', 'practice', 'deep-dive'));
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- VERIFICATION -- run in the Supabase SQL editor after applying.
--
-- a) The constraint exists, is named, and lists all four values:
--      select conname, pg_get_constraintdef(oid)
--      from pg_constraint
--      where conrelid = 'public.ai_tutor_usage_events'::regclass
--        and contype = 'c';
--    Expect a row: ai_tutor_usage_events_origin_check
--      CHECK (origin = ANY (ARRAY['standalone','lesson','practice','deep-dive']))
--
-- b) Existing rows are still valid (expect 0):
--      select count(*) from public.ai_tutor_usage_events
--      where origin not in ('standalone','lesson','practice','deep-dive');
--
-- c) The new value is accepted and the old ones still are. Run inside a
--    transaction you roll back, substituting a real user id:
--      begin;
--      insert into public.ai_tutor_usage_events (user_id, origin, message_length)
--      values ('<some-auth-user-uuid>', 'deep-dive', 10);
--      rollback;
--
-- d) An invalid value is still rejected (expect a check violation):
--      begin;
--      insert into public.ai_tutor_usage_events (user_id, origin, message_length)
--      values ('<some-auth-user-uuid>', 'not-a-real-origin', 10);
--      rollback;
-- ---------------------------------------------------------------------------
