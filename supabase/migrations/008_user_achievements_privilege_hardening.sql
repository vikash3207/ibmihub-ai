-- iRPGenie -- user_achievements privilege hardening (PR #180)
--
-- Forward-only. Migration 007 has already been applied to production and is
-- NOT edited or replaced by this file.
--
-- 007 already granted `authenticated` SELECT only and defined no client
-- write policy, so the intended posture was already in place. This migration
-- makes that posture explicit and enforced rather than merely implied:
--   * `anon` is explicitly stripped of every privilege (007 never granted it
--     anything, but it says so out loud and also revokes anything an earlier
--     blanket grant or future default-privilege change might introduce).
--   * INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER are explicitly revoked
--     from `authenticated`, so the "no client writes" guarantee no longer
--     depends on a grant simply having been omitted.
--   * SELECT is re-granted to `authenticated`, scoped per-row by the existing
--     RLS policy, so learners keep reading their own achievements.
--
-- RLS remains the primary row-level control. These grants are defense in
-- depth: even if a policy were ever loosened by mistake, a browser client
-- still holds no write privilege on this table.
--
-- Idempotent and safe to re-run. It intentionally does not touch
-- service_role, which is how lib/achievements-server.ts writes legitimate
-- awards, and it creates/drops no policies, so the existing
-- "Users can read their own achievements" policy is preserved as-is.

-- 1. anon: no access whatsoever.
revoke all privileges on public.user_achievements from anon;

-- 2. authenticated: remove every write privilege...
revoke insert, update, delete, truncate, references, trigger
  on public.user_achievements from authenticated;

-- 3. ...and keep exactly the read access the app needs (row-scoped by RLS).
grant select on public.user_achievements to authenticated;

-- 4. The trusted writer. Restated so the write path is explicit in the
--    migration history rather than only in 007.
grant select, insert on public.user_achievements to service_role;

-- 5. RLS must stay on. (007 enabled it; this is a no-op safeguard in case a
--    future migration or manual change ever disables it.)
alter table public.user_achievements enable row level security;

-- ---------------------------------------------------------------------------
-- VERIFICATION -- run these manually in the Supabase SQL editor after
-- applying, and confirm each expected result.
--
-- a) RLS is enabled. Expect relrowsecurity = true:
--      select relname, relrowsecurity
--      from pg_class
--      where oid = 'public.user_achievements'::regclass;
--
-- b) Exactly one SELECT policy, scoped to the owner. Expect a single row:
--    cmd = 'SELECT', qual containing "auth.uid() = user_id":
--      select policyname, cmd, qual, with_check
--      from pg_policies
--      where schemaname = 'public' and tablename = 'user_achievements';
--
-- c) anon has no privileges. Expect ZERO rows:
--      select grantee, privilege_type
--      from information_schema.role_table_grants
--      where table_schema = 'public'
--        and table_name = 'user_achievements'
--        and grantee = 'anon';
--
-- d) authenticated has SELECT and nothing else. Expect exactly one row,
--    privilege_type = 'SELECT':
--      select grantee, privilege_type
--      from information_schema.role_table_grants
--      where table_schema = 'public'
--        and table_name = 'user_achievements'
--        and grantee = 'authenticated';
--
-- e) Cross-user read protection and browser write rejection are behavioural;
--    verify from a signed-in browser session (anon key, NOT service role):
--      - select * from user_achievements;
--          -> returns only the signed-in user's own rows (RLS).
--      - insert into user_achievements (user_id, badge_code)
--        values (auth.uid(), 'first_step');
--          -> must fail with "permission denied for table user_achievements"
--            (privilege denied by (2) above, before RLS is even consulted).
--      - update / delete against the table
--          -> must fail the same way.
-- ---------------------------------------------------------------------------
