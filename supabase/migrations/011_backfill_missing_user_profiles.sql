-- iRPGenie -- one-time backfill: create missing user_profiles rows
-- (Hotfix: Profile Save Server Error)
--
-- Forward-only. Migrations 001-010 have already been applied to production
-- and are NOT edited or replaced by this file.
--
-- Root cause this backfill addresses: 001's handle_new_user() trigger
-- inserts a user_profiles row for every new auth.users signup, so every
-- account created through the normal signup flow should already have one.
-- In practice, production has at least one auth.users row with no matching
-- user_profiles row (root cause is unconfirmed -- an account predating the
-- trigger, a manual/dashboard-created user, or some other one-off path that
-- never went through handle_new_user()). lib/actions/profile.ts's
-- updateProfile() no longer depends on the row already existing (it now
-- upserts), so this backfill is not required for correctness going forward
-- -- it only closes the gap for any row that is missing *right now*, and is
-- a genuine no-op for every account that already has one.
--
-- Pure data backfill, no schema change: no new column, table, grant, or RLS
-- policy. Idempotent and safe to re-run any number of times -- `on conflict
-- (id) do nothing` makes a second run affect zero rows.
--
-- Does not require the service-role key to run manually as a superuser/
-- owner role in the Supabase SQL Editor (this is a one-time administrative
-- backfill, not something app code ever needs to run -- app code always
-- upserts scoped to its own session's auth.uid(), per RLS, and never uses
-- the service-role key -- see lib/actions/profile.ts).

insert into public.user_profiles (id)
select u.id
from auth.users u
left join public.user_profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- VERIFICATION -- run manually in the Supabase SQL editor after applying:
--
-- a) Confirm no auth.users row is missing a user_profiles row anymore:
--      select count(*) from auth.users u
--      left join public.user_profiles p on p.id = u.id
--      where p.id is null;
--          -> must return 0.
--
-- b) Confirm this did not touch any existing row's data (spot check a known
--    account that already had first_name/last_name/contact_number set):
--      select id, first_name, last_name, contact_number, created_at
--      from public.user_profiles
--      where id = '<a known existing user id>';
--          -> values unchanged from before this migration ran.
-- ---------------------------------------------------------------------------
