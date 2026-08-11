-- iRPGenie -- basic profile identity fields (Basic User Profile & Header
-- Avatar enhancement)
--
-- Forward-only. Migrations 001-009 have already been applied to production
-- and are NOT edited or replaced by this file.
--
-- Extends the existing user_profiles table (created in 001) rather than
-- introducing a new table or Supabase Auth user_metadata: user_profiles is
-- already the dedicated place mutable per-user app data lives (it already
-- holds onboarding_response/onboarding_skipped), and its RLS policies and
-- table-level grants are not column-scoped -- they already cover any column
-- added here with no policy or grant change required. Verified below.
--
-- All three columns are nullable with no default, matching the existing
-- onboarding_response column's style: NULL means "not yet supplied", which
-- both the signup flow (collects only email/password, never a name) and the
-- header avatar's fallback chain (first name -> full name -> email) are
-- designed to handle.
--
-- Idempotent and safe to re-run: add column if not exists, and constraints
-- are dropped before being (re)created, mirroring 001's drop-then-create
-- style for triggers/policies.

alter table public.user_profiles
  add column if not exists first_name     text null,
  add column if not exists last_name      text null,
  add column if not exists contact_number text null;

-- Length ceilings as defense in depth alongside the application-level
-- validation in lib/profile.ts -- a client is never the only thing standing
-- between a malformed value and this table.
alter table public.user_profiles drop constraint if exists user_profiles_first_name_length;
alter table public.user_profiles
  add constraint user_profiles_first_name_length
  check (first_name is null or char_length(first_name) <= 60);

alter table public.user_profiles drop constraint if exists user_profiles_last_name_length;
alter table public.user_profiles
  add constraint user_profiles_last_name_length
  check (last_name is null or char_length(last_name) <= 60);

alter table public.user_profiles drop constraint if exists user_profiles_contact_number_length;
alter table public.user_profiles
  add constraint user_profiles_contact_number_length
  check (contact_number is null or char_length(contact_number) <= 25);

-- No RLS policy change: 001's existing "Users can read/insert/update their
-- own profile" policies key on `auth.uid() = id` only, not on which columns
-- are touched, so they already govern these new columns.
--
-- No grant change: 001's `grant select, insert, update on public.user_profiles
-- to authenticated, service_role` has no column list, which in Postgres
-- means the grant is table-level and already covers every column, including
-- ones added after the grant was issued. Re-stated here, not re-run, since
-- re-issuing an identical grant is a harmless no-op but adds nothing.

-- ---------------------------------------------------------------------------
-- VERIFICATION -- two different methods, because they check different
-- things. The Supabase SQL Editor runs as an elevated Postgres role with no
-- JWT/session context, so `auth.uid()` there is NULL and a query run there
-- can never genuinely exercise the `auth.uid() = id` RLS policy as a real
-- signed-in user would experience it. Ownership enforcement is therefore
-- verified through the application/API instead, never the SQL Editor, and
-- never with the service-role key, which bypasses RLS entirely and so could
-- not demonstrate it either.
--
-- PART 1 -- structural checks, run manually in the Supabase SQL editor:
--
-- a) The three columns exist and are nullable:
--      select column_name, is_nullable, data_type
--      from information_schema.columns
--      where table_schema = 'public' and table_name = 'user_profiles'
--        and column_name in ('first_name', 'last_name', 'contact_number');
--
-- b) RLS is still enabled (unchanged by this migration, reasserted as a
--    no-op safeguard in case something else ever disabled it):
--      select relname, relrowsecurity
--      from pg_class
--      where oid = 'public.user_profiles'::regclass;
--
-- c) The length constraints exist:
--      select conname, pg_get_constraintdef(oid)
--      from pg_constraint
--      where conrelid = 'public.user_profiles'::regclass
--        and conname like 'user_profiles_%_length';
--
-- d) The length constraints actually reject an oversized value (this part
--    only needs a value, not a session, so the SQL Editor's own role is
--    fine for it -- the check constraint fires regardless of who is
--    writing):
--      update user_profiles set first_name = repeat('a', 61)
--      where id = (select id from user_profiles limit 1);
--          -> must fail with a check-constraint violation, and must not
--             have modified the row (roll back or confirm afterward).
--
-- PART 2 -- ownership, verified through an authenticated application/API
-- session using the anon key, NOT the SQL Editor and NOT the service-role
-- key:
--
-- e) Sign in as a real user (via the running app, or a REST call to
--    PostgREST authenticated with that user's own access token) and update
--    that user's own row:
--      update user_profiles set first_name = 'Test' where id = auth.uid();
--          -> succeeds, exactly one row -- auth.uid() now resolves to that
--             session's real user id, unlike in the SQL Editor.
--
-- f) With that same authenticated session, attempt another user's row:
--      update user_profiles set first_name = 'Test' where id <> auth.uid();
--          -> affects zero rows (RLS), even though no error is raised --
--             confirm by re-selecting the target row and seeing it
--             unchanged, not just by the absence of an error.
-- ---------------------------------------------------------------------------
