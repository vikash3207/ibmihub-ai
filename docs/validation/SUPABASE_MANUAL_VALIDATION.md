# IBMiHub AI - Supabase Manual Validation Guide
## Batch 1 - Sprint 1 First Coding Batch

**Branch:** Feature_24
**Last updated:** 2026-07-03

---

## A. Purpose

This guide validates **Batch 1 only**. It does not test AI Tutor, Progress Tracking, Dashboard content, Feedback, Learning Center UI, Lesson Experience UI, or Waitlist backend -- those belong to future batches.

**`/dashboard` is not implemented in Batch 1.** It is listed as a protected route for future-proofing, but no page exists yet. Visiting it while authenticated is expected to return 404; visiting it while unauthenticated redirects to login. No Batch 1 auth or onboarding flow (sign-up, login, password reset, onboarding save) redirects a user to `/dashboard` -- successful flows redirect to `/onboarding` (if not yet answered) or `/` (if already onboarded or skipped).

Batch 1 validation confirms:

- Supabase project is configured correctly
- Database migration ran without errors
- Lesson metadata seed produced 12 records (all status `Draft`)
- Auth flows work: sign-up, login, logout, forgot password
- Onboarding question works and saves the response
- Protected routes (`/dashboard`, `/ai-tutor`, `/onboarding`) redirect to login for unauthenticated users
- Draft lesson content is not exposed through public routes
- Landing page renders with approved copy
- No secrets are committed

---

## B. Prerequisites

Before starting, confirm:

| Requirement | Details |
|---|---|
| Node.js version | >= 20.9.0 (`node --version`) |
| npm install | Run `npm install` in the project root if not done |
| Branch | `Feature_24` or the PR branch |
| Supabase account | Project created at [supabase.com](https://supabase.com) |
| Supabase Project URL | Available in: Supabase Dashboard -> Settings -> API -> Project URL |
| Supabase anon/public key | Available in: Supabase Dashboard -> Settings -> API -> Project API keys -> `anon` `public` |
| Supabase service role key | Available in: Supabase Dashboard -> Settings -> API -> Project API keys -> `service_role` |

**Security rules before starting:**
- NEVER commit `.env.local` to the repository
- NEVER share or log the service role key
- NEVER paste secrets into the codebase, comments, or documentation
- The `.env.local` file is already in `.gitignore` and will not be tracked

---

## C. Environment Setup

### Step 1 - Copy the example file

```
cp .env.local.example .env.local
```

### Step 2 - Fill in real values

Open `.env.local` and set:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ANTHROPIC_API_KEY=
```

**Important notes:**

- `ANTHROPIC_API_KEY` **must remain empty** for Batch 1. The Anthropic SDK is not installed and this value is unused. Do not add a real key.
- `NEXT_PUBLIC_SITE_URL` should be `http://localhost:3000` for local testing.
- `SUPABASE_SERVICE_ROLE_KEY` is used only by the server-side seed script and the `lib/supabase/admin.ts` module. It is never sent to the browser.

### Step 3 - Verify env variables (optional)

Run the env validation script to confirm all required variables are present (values are not printed):

```
npm run validate:env
```

Expected output:
```
Checking required environment variables...
  OK  NEXT_PUBLIC_SUPABASE_URL
  OK  NEXT_PUBLIC_SUPABASE_ANON_KEY
  OK  SUPABASE_SERVICE_ROLE_KEY
  OK  NEXT_PUBLIC_SITE_URL

All required environment variables are set.
ANTHROPIC_API_KEY is empty -- this is expected for Batch 1.
```

---

## D. Supabase Migration

### Step 1 - Open the SQL Editor

1. Go to your Supabase project dashboard
2. In the left sidebar, click **SQL Editor**
3. Click **New query**

### Step 2 - Run the migration

Copy the full contents of `supabase/migrations/001_initial_schema.sql` and paste it into the SQL Editor. Click **Run**.

The migration is idempotent -- it is safe to run multiple times. All triggers use `DROP ... IF EXISTS` before creation.

### Step 3 - Verify tables exist

Run this query in the SQL Editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

**Expected tables:**

| table_name |
|---|
| lessons |
| user_profiles |

### Step 4 - Verify Row-Level Security is enabled

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

**Expected:** Both `lessons` and `user_profiles` should show `rowsecurity = true`.

---

## E. Seed Lesson Metadata

### Step 1 - Run the seed script

```
npm run seed
```

This reads `content/lessons/metadata.ts` and upserts all 12 IBM i Fundamentals lesson records into the `lessons` table using the service role key.

**Expected output:**
```
Seeding 12 lessons...
  OK: what-is-ibm-i (Draft)
  OK: why-ibm-i-still-matters (Draft)
  OK: ibm-i-platform-overview (Draft)
  OK: libraries-and-objects (Draft)
  OK: 5250-screen-basics (Draft)
  OK: physical-files-and-logical-files (Draft)
  OK: introduction-to-rpgle (Draft)
  OK: introduction-to-clle (Draft)
  OK: introduction-to-db2-for-i (Draft)
  OK: job-logs-and-spool-files-basics (Draft)
  OK: basic-ibm-i-development-workflow (Draft)
  OK: where-to-go-next (Draft)

Seed complete.
```

If any row shows `FAILED:`, check the troubleshooting section below.

### Step 2 - Verify lesson count

```sql
select count(*) as lesson_count
from public.lessons;
```

**Expected:** `12`

### Step 3 - Verify lesson statuses

```sql
select status, count(*)
from public.lessons
group by status
order by status;
```

**Expected:**

| status | count |
|---|---|
| Draft | 12 |

All 12 lessons start as `Draft`. This is correct and expected. No lessons should be `Published` at this point -- lessons only become Published after the content governance review process (Spec 009) is completed for each lesson.

### Step 4 - Verify lesson sequence

```sql
select lesson_order, slug, title, status
from public.lessons
order by lesson_order;
```

**Expected sequence:**

| lesson_order | slug | title |
|---|---|---|
| 1 | what-is-ibm-i | What is IBM i? |
| 2 | why-ibm-i-still-matters | Why IBM i Still Matters |
| 3 | ibm-i-platform-overview | IBM i Platform Overview |
| 4 | libraries-and-objects | Libraries and Objects |
| 5 | 5250-screen-basics | 5250 Screen Basics |
| 6 | physical-files-and-logical-files | Physical Files and Logical Files |
| 7 | introduction-to-rpgle | Introduction to RPGLE |
| 8 | introduction-to-clle | Introduction to CLLE |
| 9 | introduction-to-db2-for-i | Introduction to DB2 for i |
| 10 | job-logs-and-spool-files-basics | Job Logs and Spool Files Basics |
| 11 | basic-ibm-i-development-workflow | Basic IBM i Development Workflow |
| 12 | where-to-go-next | Where to Go Next |

### Step 5 - Verify seed idempotency

Run `npm run seed` a second time. The output should be identical to Step 1 (all `OK`). The lesson count should remain 12 with no duplicates.

---

## F. Supabase Auth Configuration

### Step 1 - Set Site URL

1. Supabase Dashboard -> **Authentication** -> **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
3. Click **Save**

### Step 2 - Add Redirect URL

In the same **URL Configuration** section, add to **Redirect URLs**:

```
http://localhost:3000/auth/callback
```

### Step 3 - Email confirmation setting (local testing)

1. Supabase Dashboard -> **Authentication** -> **Providers** -> **Email**
2. For local testing speed, you may toggle **Confirm email** off.

> **Note:** Disabling email confirmation is for local development convenience only. For production or public beta, email confirmation should be re-evaluated per your launch requirements. The app code handles both flows (immediate login and email confirmation via the `/auth/callback` route).

---

## G. Start Local App

```
npm run dev
```

Open in browser: [http://localhost:3000](http://localhost:3000)

Leave the dev server running for all manual tests below.

---

## H. Manual Test Checklist

Fill in **Actual Result** and **Pass/Fail** after running each test.

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|
| VAL-001 | Landing page loads | Open `http://localhost:3000` | Landing page renders. Hero headline reads "Learn IBM i with structured lessons and AI guidance." Trust/privacy notice is visible. Page does not crash. | | | |
| VAL-002 | Sign-up page loads | Open `http://localhost:3000/auth/sign-up` | Sign-up form renders with email and password fields. No error. | | | |
| VAL-003 | Create test user | On sign-up page, enter a test email and password (min 8 chars). Submit. | User is created. Redirect to `/onboarding` (or email confirmation message if email confirmation is enabled). | | | |
| VAL-004 | User appears in Supabase Auth | Supabase Dashboard -> Authentication -> Users | Test user email is listed. | | | |
| VAL-005 | user_profiles row created | Run: `select * from public.user_profiles order by created_at desc limit 5;` | A row exists with the test user's UUID. `onboarding_response` is `null`, `onboarding_skipped` is `false`. | | | |
| VAL-006 | Login works | Log out if needed. Open `/auth/login`. Enter test credentials. Submit. | Authenticated session is created. Redirect to `/onboarding` (if not yet answered) or `/` (if already answered or skipped). Dashboard is not implemented in Batch 1, so no auth/onboarding flow redirects there. | | | |
| VAL-007 | Logout works | While logged in, POST to `/auth/logout` via the sign-up page form or directly. | Session clears. User returns to public state. | | | |
| VAL-008 | Forgot password page loads | Open `/auth/forgot-password` | Page renders with email field. No crash. | | | |
| VAL-009 | Reset password route handles no token | Open `/auth/reset-password` directly (no valid token in URL) | Page renders (form appears). No crash. Submitting without a valid session/token produces an appropriate error. | | | |
| VAL-010 | Onboarding page requires auth | While logged out, open `/onboarding` | Redirect to `/auth/login?next=%2Fonboarding`. Onboarding content is not exposed to unauthenticated users. | | | |
| VAL-011 | Onboarding saves selected option | Log in. Open `/onboarding`. Select one approved option. Submit. | Onboarding response is saved. Redirect to `/` (or original destination) -- never to `/dashboard`. Run SQL to verify: `select onboarding_response, onboarding_skipped from public.user_profiles where id = '<your-user-id>';` | | | Approved options are listed below this table |
| VAL-012 | Returning user skips onboarding | After completing onboarding, refresh or revisit the app. | User is NOT redirected back to `/onboarding`. No onboarding loop. | | | |
| VAL-013 | Protected `/dashboard` behavior | While logged out, open `/dashboard`. Then, while logged in, open `/dashboard`. | Logged out: redirect to `/auth/login?next=%2Fdashboard`, no protected content exposed. Logged in: `/dashboard` returns 404 (page not implemented in Batch 1) -- this is expected and acceptable. No auth or onboarding flow should ever redirect a user to `/dashboard`. | | | Dashboard is intentionally not implemented in Batch 1 |
| VAL-014 | Protected `/ai-tutor` redirects | While logged out, open `/ai-tutor` | Redirect to `/auth/login?next=%2Fai-tutor`. No AI Tutor content exposed. Note: AI Tutor page is not implemented in Batch 1. Anthropic SDK is NOT installed. The redirect behavior is what is being validated here. | | | |
| VAL-015 | Draft lesson content not exposed | Visit `/learn/ibm-i-fundamentals/what-is-ibm-i` or any lesson slug | Returns 404 or a Next.js not-found page. No draft lesson content is served. Note: The full Lesson Experience UI is not implemented in Batch 1. The server-side `getPublishedLessonBySlug()` guard in `lib/lessons.ts` returns `notFound()` for any non-Published lesson. Since all lessons are `Draft`, all lesson routes return 404. | | | |
| VAL-016 | Seed idempotency | Run `npm run seed` a second time | Output is identical to first run. No duplicate rows. `select count(*) from public.lessons;` still returns 12. | | | |

**Approved onboarding options (for VAL-011):**
1. I am new to IBM i and want to start learning.
2. I already work with IBM i and want to refresh or deepen my knowledge.
3. I am exploring what IBMiHub AI offers.

---

## I. Useful SQL Reference Queries

Keep these handy in the Supabase SQL Editor during testing.

### Lesson count
```sql
select count(*) as lesson_count
from public.lessons;
```

### Lesson list by order
```sql
select lesson_order, slug, title, status
from public.lessons
order by lesson_order;
```

### Lesson status breakdown
```sql
select status, count(*)
from public.lessons
group by status
order by status;
```

### Recent user profiles
```sql
select *
from public.user_profiles
order by created_at desc
limit 5;
```

### Check onboarding for specific user
```sql
-- Replace <uuid> with the user ID from Authentication -> Users
select id, onboarding_response, onboarding_skipped, created_at, updated_at
from public.user_profiles
where id = '<uuid>';
```

### Verify no published lessons exist yet
```sql
select count(*) as published_count
from public.lessons
where status = 'Published';
-- Expected: 0
```

### Check RLS is active
```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

### Check triggers exist
```sql
select trigger_name, event_object_table
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;
```

---

## J. Troubleshooting

### Missing environment variable errors

**Symptom:** App crashes or seed fails with "Missing ..." error.

**Fix:** Open `.env.local` and ensure all four required variables are set. Restart the dev server after any `.env.local` change.

---

### `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` not found in browser

**Symptom:** Auth flows fail silently; Supabase client does not connect.

**Fix:** Ensure variables start with `NEXT_PUBLIC_` exactly (case-sensitive). Restart `npm run dev` after updating `.env.local`.

---

### `SUPABASE_SERVICE_ROLE_KEY` missing or invalid

**Symptom:** `npm run seed` exits with "Missing ... SUPABASE_SERVICE_ROLE_KEY" or "Invalid API key".

**Fix:** Copy the `service_role` key from Supabase Dashboard -> Settings -> API -> Project API keys. Ensure it is in `.env.local` under `SUPABASE_SERVICE_ROLE_KEY`. Do NOT use the `anon` key here.

---

### Migration failed: object already exists

**Symptom:** SQL error like `relation "lessons" already exists` or `policy already exists`.

**Fix:** The migration is idempotent (`create table IF NOT EXISTS`, `drop policy IF EXISTS` before creation). If the error persists, check that you are running the current version of `001_initial_schema.sql` (not a cached older version). You can safely re-run the migration.

---

### Seed fails: "FAILED: what-is-ibm-i - ..."

**Symptom:** Seed script prints `FAILED:` for one or more lessons.

**Fix:**
1. Confirm the migration ran successfully and the `lessons` table exists.
2. Confirm `SUPABASE_SERVICE_ROLE_KEY` is set correctly.
3. Check the full error message -- common causes: RLS blocking writes (the service role should bypass RLS), network error, or URL typo.

---

### Email confirmation blocks immediate login

**Symptom:** After sign-up, the user is not logged in and no redirect happens; instead a "check your email" message appears (or no message at all).

**Fix:** Go to Supabase Dashboard -> Authentication -> Providers -> Email -> toggle **Confirm email** off for local testing. This is a per-project setting.

---

### Auth callback error: redirect URL mismatch

**Symptom:** After clicking the confirmation email link, you see an error about redirect URL not being allowed.

**Fix:** Go to Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs. Ensure `http://localhost:3000/auth/callback` is listed. Add it if missing.

---

### `user_profiles` row not created after sign-up

**Symptom:** `select * from public.user_profiles` returns no row for the new user.

**Fix:** The `handle_new_user` trigger should auto-create the row on `auth.users` insert. Check that the trigger exists:
```sql
select trigger_name, event_object_table
from information_schema.triggers
where trigger_name = 'on_auth_user_created';
```
If missing, re-run the migration.

---

### RLS policy blocks reads/writes

**Symptom:** App queries return empty results despite data being present; or writes fail with permission errors.

**Fix:** Confirm RLS policies were created by the migration (`select * from pg_policies where schemaname = 'public';`). Verify the user is authenticated (logged in) when making authenticated queries. The `lessons` table allows public reads for Published lessons only.

---

### Port mismatch

**Symptom:** Auth redirects go to port 3001 or another port instead of 3000.

**Fix:** Update `NEXT_PUBLIC_SITE_URL` in `.env.local` to match the actual port Next.js is using. Also update the Supabase Redirect URL in the dashboard.

---

### Changes to `.env.local` not taking effect

**Symptom:** App still uses old values after editing `.env.local`.

**Fix:** Stop the dev server (`Ctrl+C`) and run `npm run dev` again. Next.js reads `.env.local` only at startup.

---

## K. Final Validation Sign-Off

Before marking PR #25 as ready to merge, confirm each item below:

### Database

- [ ] Migration ran successfully (`001_initial_schema.sql`)
- [ ] Tables `lessons` and `user_profiles` exist in `public` schema
- [ ] RLS is enabled on both tables
- [ ] `on_auth_user_created` trigger exists and creates profile rows
- [ ] `npm run seed` succeeded with exit code 0
- [ ] Lesson count = 12
- [ ] All 12 lessons have status `Draft`
- [ ] Seed is idempotent (ran twice, count stayed 12)

### Auth and Onboarding

- [ ] Sign-up flow works (VAL-003)
- [ ] User appears in Supabase Auth dashboard (VAL-004)
- [ ] `user_profiles` row auto-created on sign-up (VAL-005)
- [ ] Login with correct credentials works (VAL-006)
- [ ] Logout clears session (VAL-007)
- [ ] Onboarding page is protected (VAL-010)
- [ ] Onboarding answer saves to `user_profiles` (VAL-011)
- [ ] Returning user does not loop back to onboarding (VAL-012)

### Protected Routes (Batch 1 scope)

- [ ] `/dashboard` redirects unauthenticated users to login, and returns 404 (not protected content) for authenticated users, since the page is not implemented in Batch 1 (VAL-013)
- [ ] `/ai-tutor` redirects unauthenticated users to login (VAL-014)
- [ ] Draft lesson routes return 404 / not-found (VAL-015)

### Automated Checks

- [ ] `npm run lint` passes (0 errors, 0 warnings)
- [ ] `npx tsc --noEmit` passes (0 TypeScript errors)
- [ ] `npm run build` passes (no build errors, no warnings)
- [ ] `npm run validate:env` passes (all required vars set, Anthropic key empty)

### Security and Scope

- [ ] `.env.local` is NOT committed (confirmed in `.gitignore`)
- [ ] No Anthropic SDK is installed (`grep -r "anthropic" node_modules/.package-lock.json` returns nothing from the AI SDK)
- [ ] `ANTHROPIC_API_KEY` is empty in `.env.local`
- [ ] No Batch 2 features built: no AI Tutor page, no Progress Tracking, no Dashboard page content, no Feedback, no full Lesson Experience, no Waitlist backend
- [ ] `npm audit --omit=dev` reviewed: 2 moderate PostCSS advisories documented as non-blocking (internal to Next.js bundle; cannot be resolved without a Next.js internal update)

---

*Guide version: Batch 1 | Branch: Feature_24 | Last updated: 2026-07-03*
