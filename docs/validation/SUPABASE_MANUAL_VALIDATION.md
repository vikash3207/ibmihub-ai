# IBMiHub AI - Supabase Manual Validation Guide
## Batch 1 - Sprint 1 First Coding Batch

**Branch:** Feature_24
**Last updated:** 2026-07-03

---

## A. Purpose

This guide validates **Batch 1 only**. It does not test AI Tutor, Progress Tracking, Dashboard content, Feedback, Learning Center UI, Lesson Experience UI, or Waitlist backend -- those belong to future batches.

**`/dashboard` is not implemented in Batch 1.** It is listed as a protected route for future-proofing, but no page exists yet. Visiting it while authenticated is expected to return 404; visiting it while unauthenticated redirects to login. No Batch 1 auth or onboarding flow (sign-up, login, password reset, onboarding save) redirects a user to `/dashboard` -- successful flows redirect to `/onboarding` (if not yet answered) or `/` (if already onboarded or skipped). `/dashboard` must never be used as the expected target of a successful login or onboarding test.

**`/auth/logout` supports direct GET requests.** Opening `http://localhost:3000/auth/logout` directly in the browser signs the current user out and redirects to `/` (or a safe, path-relative `next` if supplied). It no longer returns a 405.

**Authenticated users are redirected away from `/auth/login` and `/auth/sign-up`.** This is enforced by `proxy.ts`. If you are already logged in and try to open those pages, you will be bounced to `/` -- this is expected, not a bug. Log out (or use an incognito/private window) before testing sign-up or login flows.

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

> **Before VAL-006:** If you are already logged in from a previous test, open `/auth/logout` (or use an incognito/private window) before testing sign-up or login. Because `proxy.ts` redirects authenticated users away from `/auth/login` and `/auth/sign-up`, staying logged in will make those pages appear to "not load" when really you were just bounced to `/`.

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|
| VAL-001 | Landing page loads | Open `http://localhost:3000` | Landing page renders. Hero headline reads "Learn IBM i with structured lessons and AI guidance." Trust/privacy notice is visible. Page does not crash. | | | |
| VAL-002 | Sign-up page loads | Open `http://localhost:3000/auth/sign-up` | Sign-up form renders with email and password fields. No error. | | | |
| VAL-003 | Create test user | On sign-up page, enter a test email and password (min 8 chars). Submit. | User is created. Redirect to `/onboarding` (or email confirmation message if email confirmation is enabled). | | | |
| VAL-004 | User appears in Supabase Auth | Supabase Dashboard -> Authentication -> Users | Test user email is listed. | | | |
| VAL-005 | user_profiles row created | Run: `select * from public.user_profiles order by created_at desc limit 5;` | A row exists with the test user's UUID. `onboarding_response` is `null`, `onboarding_skipped` is `false`. | | | |
| VAL-006 | Login works | Log out first (see note above). Open `/auth/login`. Enter test credentials. Submit. | Authenticated session is created. Redirect to `/onboarding` (if not yet answered) or `/` (if already answered or skipped). `/dashboard` is not implemented in Batch 1 and must never be the redirect target. | | | |
| VAL-006A | Login with wrong password | Log out first. Open `/auth/login`. Enter a valid email with an incorrect password. Submit. | User stays on / returns to `/auth/login`. A generic error message is displayed: "Incorrect email or password. Please try again." No specific reason (e.g. "user not found" vs "wrong password") is revealed. | | | |
| VAL-007 | Logout works | While logged in, open `/auth/logout` directly in the browser (GET), or POST to `/auth/logout` via a form. | Session clears. User is redirected to `/`. Returns 200/redirect, not 405. | | | |
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
- [ ] Login with correct credentials works and never redirects to `/dashboard` (VAL-006)
- [ ] Login with wrong password shows a generic error and returns to `/auth/login` (VAL-006A)
- [ ] Logout clears session via direct GET (`/auth/logout`) without a 405, and redirects to `/` (VAL-007)
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

## L. Batch 2 -- Learning Center and Lesson Experience Validation

**Branch:** Feature_25

This section validates the Learning Center and Lesson Experience **shell** only. It does not cover Mark Complete, lesson completion status, progress tracking, the Dashboard, the AI Tutor, or the Waitlist backend -- those are later batches.

### Current content state (historical -- see Section M for current state)

As of **Batch 2**, all 12 lessons in `content/lessons/metadata.ts` were `Draft` (placeholder content), so `/learn` and every lesson URL showed empty/404 states by default. This section is kept for historical reference and for testing the *Draft* lesson behavior in general.

**As of Batch 3 through Batch 14, all 12 lessons in the IBM i Fundamentals path have been published one at a time** -- Lesson 1 (`what-is-ibm-i`, the public preview lesson), Lessons 2 through 11 as protected lessons, and finally Lesson 12 (`where-to-go-next`) in Batch 14. See Section M, Section N, Section O, Section P, Section Q, Section R, Section S, Section T, Section U, Section V, Section W, and Section X below for their individual publish-validation steps. **Publishing Lesson 8 completed the initial minimum 8-lesson beta content threshold (Spec 009 CONTENT-FR-007), and publishing Lesson 12 completed the full 12/12 IBM i Fundamentals lesson set.** Neither milestone by itself means the product is ready for beta or full launch -- other readiness criteria outside content count still apply.

### No Draft lesson remains in this path

**As of Batch 14, there is no lesson left in `Draft` status in `content/lessons/metadata.ts`.** The rolling "temporarily publish the one remaining Draft lesson" demonstration technique used in this section throughout Batches 3-13 is retired, because there is no longer a Draft lesson available to use for it.

If you ever need to re-test Draft-lesson behavior locally (for example, to verify a 404 for a non-Published lesson, or the empty/partial list states covered in VAL-B2-001/002/003 above):

1. Temporarily change any one lesson's `status` in `content/lessons/metadata.ts` from `'Published'` back to `'Draft'`.
2. Run `npm run seed`.
3. Test the behavior you need.
4. **Before committing anything**, revert `content/lessons/metadata.ts` (`git checkout -- content/lessons/metadata.ts`) and run `npm run seed` again to push that lesson's status back to `Published` in Supabase.

**Do not commit a temporary status change for any lesson.** All 12 lessons must stay `Published` in the committed source unless a real content governance decision (for example, moving a lesson to `Unpublished / Archived`) changes that deliberately.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B2-001 | `/learn` loads (empty state) | With all lessons Draft, open `/learn` | Page loads (200). Shows the IBM i Fundamentals path card, "0 of 12 lessons published", and a "content is being finalized" note instead of a Start Learning button. No crash. | | |
| VAL-B2-002 | `/learn/ibm-i-fundamentals` loads (empty state) | With all lessons Draft, open `/learn/ibm-i-fundamentals` | Page loads (200). Shows a "lessons are still being written and reviewed" message. No crash, no lesson list. | | |
| VAL-B2-003 | Draft lesson returns 404 | Open `/learn/ibm-i-fundamentals/what-is-ibm-i` while it is Draft | Returns 404. No lesson title, description, or body is exposed anywhere in the response. | | |
| VAL-B2-004 | Nonexistent slug returns 404 | Open `/learn/ibm-i-fundamentals/no-such-lesson` | Returns 404. | | |
| VAL-B2-005 | Published Lesson 1 preview (unauthenticated) | **Superseded by Section M** -- Lesson 1 is now permanently Published; see VAL-B3-004. | | | |
| VAL-B2-006 | Published protected lesson (unauthenticated) | **Superseded by Section N/O/P/Q/R/S/T/U/V/W/X** -- Lessons 2-12 are now permanently Published as protected lessons; see VAL-B4-004, VAL-B5-004, VAL-B6-004, VAL-B7-004, VAL-B8-004, VAL-B9-004, VAL-B10-004, VAL-B11-004, VAL-B12-004, VAL-B13-004, and VAL-B14-004. No lesson remains Draft for this rolling temporary-publish demonstration; see the note above. | | | |
| VAL-B2-007 | Published protected lesson (authenticated) | **Superseded** -- see VAL-B4-005 through VAL-B14-005 for each lesson's individual authenticated-view validation. | | | |
| VAL-B2-008 | Lesson list shows correct badges | **Superseded by Section X** -- all 12 lessons are now permanently Published; see VAL-B14-002. | | | |
| VAL-B2-009 | Lesson navigation | **Superseded by Section X** -- see VAL-B14-008 for final-lesson navigation behavior. | | | |
| VAL-B2-010 | AI Tutor CTA is a link only | On any Published lesson page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is present (and the optional starter question if set in metadata). Clicking it follows existing Batch 1 `/ai-tutor` behavior (login redirect if logged out, 404 if logged in) -- no AI Tutor functionality, no Anthropic SDK involved. | | |
| VAL-B2-011 | Header reflects auth state | Compare header while logged out vs. logged in, on `/`, `/learn`, and any lesson page | Logged out: header shows "Log in". Logged in: header shows "Log out" (linking to `/auth/logout`, which works via direct GET per the earlier fix). No account menu, no user email/details shown in the header. | | |
| VAL-B2-012 | Revert temporary publish | **Superseded** -- there is no rolling temporary publish to revert anymore; see the note above for the ad hoc procedure if you need it in the future. | | | |

---

## M. Batch 3 -- Lesson 1 Publish Validation

**Branch:** Feature_26

This section validates content governance and the real, permanent publication of Lesson 1 (`what-is-ibm-i`). It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 2-12 content -- those remain out of scope.

### Content state as of Batch 3

- Lesson 1 (`what-is-ibm-i`) status is `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 2-12 remain `Draft` with placeholder content, unchanged.
- The review record for Lesson 1 is at `docs/content/reviews/lesson-001-what-is-ibm-i-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 1's new status and metadata into Supabase -- editing `content/lessons/metadata.ts` alone does not change the database.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B3-001 | Landing page still loads | Open `/` | Landing page renders as before. "Preview the first lesson" CTA still points to `/learn/ibm-i-fundamentals/what-is-ibm-i`, which now works for real instead of 404ing. | | |
| VAL-B3-002 | `/learn` shows 1 of 12 published | Open `/learn` | Shows the IBM i Fundamentals path card with "1 of 12 lessons published" and a "Start Learning" button (no longer the empty-state note). | | |
| VAL-B3-003 | `/learn/ibm-i-fundamentals` lists only Lesson 1 | Open `/learn/ibm-i-fundamentals` | Shows exactly one lesson row: "What is IBM i?" with a "Free preview" badge, no lock icon. Lessons 2-12 do **not** appear as locked/greyed-out cards -- they are absent entirely, since the list only ever queries Published lessons. A "More lessons are being added" note appears below the single row. | | |
| VAL-B3-004 | Lesson 1 full preview (logged out) | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i` | Returns 200. Full lesson content renders: all sections (Learning Objective, Simple Explanation, Why It Matters, Practical Example, Common Confusions, Quick Recap, Try Asking the AI Tutor) are present and readable. "~5 min read" appears near the title. No login prompt. A "Create a free account" CTA appears at the end. No Mark Complete button anywhere on the page. | | |
| VAL-B3-005 | Lesson 1 full preview (logged in) | Log in as a test user. Open the same URL | Same full content renders. Still no Mark Complete button (not implemented yet). | | |
| VAL-B3-006 | Lesson 2 still returns 404 | Open `/learn/ibm-i-fundamentals/why-ibm-i-still-matters` | Returns 404. Lesson 2 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B3-007 | AI Tutor CTA is static only | On the Lesson 1 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What's the difference between IBM i and IBM Power Systems?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in per Batch 1/2 proxy rules). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B3-008 | Lesson navigation on Lesson 1 | On the Lesson 1 page, check next/previous controls | No "previous lesson" control (Lesson 1 is first). "Next lesson" falls back to "IBM i Fundamentals" (no other Published lesson exists yet to navigate to). | | |
| VAL-B3-009 | Markdown renders cleanly | Visually inspect the rendered Lesson 1 page | Headings, paragraphs, bullet lists, numbered list (in Practical Example), and bold text all render correctly via the existing `prose` styling. No raw Markdown syntax is visible. | | |
| VAL-B3-010 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` (count 1) and 1 row with status `Draft` (count 11). | | |

---

## N. Batch 4 -- Lesson 2 Protected-Publish Validation

**Branch:** Feature_27

This section validates the first lesson published under the protected-access rule: Lesson 2 (`why-ibm-i-still-matters`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 3-12 content.

### Content state as of Batch 4

- Lesson 1 (`what-is-ibm-i`) remains `Published` (free preview, unchanged from Batch 3).
- Lesson 2 (`why-ibm-i-still-matters`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 3-12 remain `Draft`. All 10 remaining placeholder files were also cleaned up for encoding (BOM/em-dash/CRLF removed) in this batch, with no change to their placeholder text or status.
- The review record for Lesson 2 is at `docs/content/reviews/lesson-002-why-ibm-i-still-matters-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 2's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B4-001 | `/learn` shows 2 of 12 published | Open `/learn` | Shows "2 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B4-002 | `/learn/ibm-i-fundamentals` lists Lesson 1 and Lesson 2 only | Open `/learn/ibm-i-fundamentals` | Shows exactly two rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters" with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 3-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B4-003 | Lesson 1 preview still works (unaffected) | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i` | Returns 200. Full content renders as before, unaffected by Lesson 2's publication. | | |
| VAL-B4-004 | Lesson 2 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/why-ibm-i-still-matters` | Returns **200, not a redirect**. Title, "~5 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B4-005 | Lesson 2 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B4-006 | Lesson 3 still returns 404 | Open `/learn/ibm-i-fundamentals/ibm-i-platform-overview` | Returns 404. Lesson 3 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B4-007 | AI Tutor CTA is static only | On the Lesson 2 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "Why don't companies just migrate off IBM i if it's an older platform?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B4-008 | Lesson navigation between Lesson 1 and 2 | On Lesson 1, use "next lesson"; on Lesson 2, use "previous lesson" | Lesson 1's next control leads to Lesson 2. Lesson 2's previous control leads to Lesson 1. Lesson 2's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B4-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `2`, and 1 row with status `Draft` and count `10`. | | |

---

## O. Batch 5 -- Lesson 3 Protected-Publish Validation

**Branch:** Feature_28

This section validates the third published lesson: Lesson 3 (`ibm-i-platform-overview`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lesson 2. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 4-12 content.

### Content state as of Batch 5

- Lesson 1 (`what-is-ibm-i`) remains `Published` (free preview, unchanged).
- Lesson 2 (`why-ibm-i-still-matters`) remains `Published` (protected, unchanged).
- Lesson 3 (`ibm-i-platform-overview`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 4-12 remain `Draft`.
- The review record for Lesson 3 is at `docs/content/reviews/lesson-003-ibm-i-platform-overview-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 3's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B5-001 | `/learn` shows 3 of 12 published | Open `/learn` | Shows "3 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B5-002 | `/learn/ibm-i-fundamentals` lists Lessons 1, 2, and 3 only | Open `/learn/ibm-i-fundamentals` | Shows exactly three rows: "What is IBM i?" with a "Free preview" badge, "Why IBM i Still Matters" and "IBM i Platform Overview" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 4-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B5-003 | Lessons 1 and 2 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i` and `/learn/ibm-i-fundamentals/why-ibm-i-still-matters` | Both behave exactly as in Sections M and N, unaffected by Lesson 3's publication. | | |
| VAL-B5-004 | Lesson 3 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/ibm-i-platform-overview` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B5-005 | Lesson 3 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B5-006 | Lesson 4 still returns 404 | Open `/learn/ibm-i-fundamentals/libraries-and-objects` | Returns 404. Lesson 4 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B5-007 | AI Tutor CTA is static only | On the Lesson 3 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "How do libraries, objects, and Db2 for i files all fit together on IBM i?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B5-008 | Lesson navigation between Lesson 2 and 3 | On Lesson 2, use "next lesson"; on Lesson 3, use "previous lesson" | Lesson 2's next control leads to Lesson 3. Lesson 3's previous control leads to Lesson 2. Lesson 3's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B5-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `3`, and 1 row with status `Draft` and count `9`. | | |

---

## P. Batch 6 -- Lesson 4 Protected-Publish Validation

**Branch:** Feature_29

This section validates the fourth published lesson: Lesson 4 (`libraries-and-objects`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2 and 3. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 5-12 content.

### Content state as of Batch 6

- Lessons 1-3 remain `Published` (unchanged from prior batches).
- Lesson 4 (`libraries-and-objects`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 5-12 remain `Draft`.
- The review record for Lesson 4 is at `docs/content/reviews/lesson-004-libraries-and-objects-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 4's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B6-001 | `/learn` shows 4 of 12 published | Open `/learn` | Shows "4 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B6-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-4 only | Open `/learn/ibm-i-fundamentals` | Shows exactly four rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", and "Libraries and Objects" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 5-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B6-003 | Lessons 1-3 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, and `/learn/ibm-i-fundamentals/ibm-i-platform-overview` | All three behave exactly as in Sections M, N, and O, unaffected by Lesson 4's publication. | | |
| VAL-B6-004 | Lesson 4 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/libraries-and-objects` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B6-005 | Lesson 4 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B6-006 | Lesson 5 still returns 404 | Open `/learn/ibm-i-fundamentals/5250-screen-basics` | Returns 404. Lesson 5 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B6-007 | AI Tutor CTA is static only | On the Lesson 4 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What's the difference between an IBM i library and a folder on my computer?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B6-008 | Lesson navigation between Lesson 3 and 4 | On Lesson 3, use "next lesson"; on Lesson 4, use "previous lesson" | Lesson 3's next control leads to Lesson 4. Lesson 4's previous control leads to Lesson 3. Lesson 4's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B6-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `4`, and 1 row with status `Draft` and count `8`. | | |

---

## Q. Batch 7 -- Lesson 5 Protected-Publish Validation

**Branch:** Feature_30

This section validates the fifth published lesson: Lesson 5 (`5250-screen-basics`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-4. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 6-12 content.

### Content state as of Batch 7

- Lessons 1-4 remain `Published` (unchanged from prior batches).
- Lesson 5 (`5250-screen-basics`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 6-12 remain `Draft`.
- The review record for Lesson 5 is at `docs/content/reviews/lesson-005-5250-screen-basics-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 5's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B7-001 | `/learn` shows 5 of 12 published | Open `/learn` | Shows "5 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B7-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-5 only | Open `/learn/ibm-i-fundamentals` | Shows exactly five rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", "Libraries and Objects", and "5250 Screen Basics" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 6-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B7-003 | Lessons 1-4 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, `/learn/ibm-i-fundamentals/ibm-i-platform-overview`, and `/learn/ibm-i-fundamentals/libraries-and-objects` | All four behave exactly as in Sections M, N, O, and P, unaffected by Lesson 5's publication. | | |
| VAL-B7-004 | Lesson 5 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/5250-screen-basics` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B7-005 | Lesson 5 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B7-006 | Lesson 6 still returns 404 | Open `/learn/ibm-i-fundamentals/physical-files-and-logical-files` | Returns 404. Lesson 6 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B7-007 | AI Tutor CTA is static only | On the Lesson 5 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What do function keys like F3 typically do on a 5250 screen?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B7-008 | Lesson navigation between Lesson 4 and 5 | On Lesson 4, use "next lesson"; on Lesson 5, use "previous lesson" | Lesson 4's next control leads to Lesson 5. Lesson 5's previous control leads to Lesson 4. Lesson 5's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B7-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `5`, and 1 row with status `Draft` and count `7`. | | |

---

## R. Batch 8 -- Lesson 6 Protected-Publish Validation

**Branch:** Feature_31

This section validates the sixth published lesson: Lesson 6 (`physical-files-and-logical-files`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-5. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 7-12 content.

### Content state as of Batch 8

- Lessons 1-5 remain `Published` (unchanged from prior batches).
- Lesson 6 (`physical-files-and-logical-files`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 7-12 remain `Draft`.
- The review record for Lesson 6 is at `docs/content/reviews/lesson-006-physical-files-and-logical-files-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 6's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B8-001 | `/learn` shows 6 of 12 published | Open `/learn` | Shows "6 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B8-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-6 only | Open `/learn/ibm-i-fundamentals` | Shows exactly six rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", "Libraries and Objects", "5250 Screen Basics", and "Physical Files and Logical Files" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 7-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B8-003 | Lessons 1-5 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, `/learn/ibm-i-fundamentals/ibm-i-platform-overview`, `/learn/ibm-i-fundamentals/libraries-and-objects`, and `/learn/ibm-i-fundamentals/5250-screen-basics` | All five behave exactly as in Sections M, N, O, P, and Q, unaffected by Lesson 6's publication. | | |
| VAL-B8-004 | Lesson 6 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/physical-files-and-logical-files` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B8-005 | Lesson 6 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B8-006 | Lesson 7 still returns 404 | Open `/learn/ibm-i-fundamentals/introduction-to-rpgle` | Returns 404. Lesson 7 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B8-007 | AI Tutor CTA is static only | On the Lesson 6 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What's the difference between a physical file and a logical file on IBM i?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B8-008 | Lesson navigation between Lesson 5 and 6 | On Lesson 5, use "next lesson"; on Lesson 6, use "previous lesson" | Lesson 5's next control leads to Lesson 6. Lesson 6's previous control leads to Lesson 5. Lesson 6's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B8-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `6`, and 1 row with status `Draft` and count `6`. | | |

---

## S. Batch 9 -- Lesson 7 Protected-Publish Validation

**Branch:** Feature_32

This section validates the seventh published lesson: Lesson 7 (`introduction-to-rpgle`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-6. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 8-12 content.

### Content state as of Batch 9

- Lessons 1-6 remain `Published` (unchanged from prior batches).
- Lesson 7 (`introduction-to-rpgle`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 8-12 remain `Draft`.
- The review record for Lesson 7 is at `docs/content/reviews/lesson-007-introduction-to-rpgle-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 7's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B9-001 | `/learn` shows 7 of 12 published | Open `/learn` | Shows "7 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B9-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-7 only | Open `/learn/ibm-i-fundamentals` | Shows exactly seven rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", "Libraries and Objects", "5250 Screen Basics", "Physical Files and Logical Files", and "Introduction to RPGLE" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 8-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B9-003 | Lessons 1-6 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, `/learn/ibm-i-fundamentals/ibm-i-platform-overview`, `/learn/ibm-i-fundamentals/libraries-and-objects`, `/learn/ibm-i-fundamentals/5250-screen-basics`, and `/learn/ibm-i-fundamentals/physical-files-and-logical-files` | All six behave exactly as in Sections M, N, O, P, Q, and R, unaffected by Lesson 7's publication. | | |
| VAL-B9-004 | Lesson 7 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/introduction-to-rpgle` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B9-005 | Lesson 7 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B9-006 | Lesson 8 still returns 404 | Open `/learn/ibm-i-fundamentals/introduction-to-clle` | Returns 404. Lesson 8 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B9-007 | AI Tutor CTA is static only | On the Lesson 7 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What is the difference between fixed-format and free-format RPGLE?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B9-008 | Lesson navigation between Lesson 6 and 7 | On Lesson 6, use "next lesson"; on Lesson 7, use "previous lesson" | Lesson 6's next control leads to Lesson 7. Lesson 7's previous control leads to Lesson 6. Lesson 7's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B9-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `7`, and 1 row with status `Draft` and count `5`. | | |

---

## T. Batch 10 -- Lesson 8 Protected-Publish Validation

**Branch:** Feature_33

This section validates the eighth published lesson: Lesson 8 (`introduction-to-clle`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-7. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 9-12 content.

**Milestone note:** publishing Lesson 8 completes the initial minimum 8-lesson beta content threshold from Spec 009 CONTENT-FR-007 (Lessons 1-8 complete, reviewed, approved, and published). This reflects content count only. It does not by itself mean the product is ready for beta launch -- other readiness criteria (outside this batch's scope) still apply.

### Content state as of Batch 10

- Lessons 1-7 remain `Published` (unchanged from prior batches).
- Lesson 8 (`introduction-to-clle`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 9-12 remain `Draft`.
- The review record for Lesson 8 is at `docs/content/reviews/lesson-008-introduction-to-clle-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 8's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B10-001 | `/learn` shows 8 of 12 published | Open `/learn` | Shows "8 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B10-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-8 only | Open `/learn/ibm-i-fundamentals` | Shows exactly eight rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", "Libraries and Objects", "5250 Screen Basics", "Physical Files and Logical Files", "Introduction to RPGLE", and "Introduction to CLLE" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 9-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B10-003 | Lessons 1-7 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, `/learn/ibm-i-fundamentals/ibm-i-platform-overview`, `/learn/ibm-i-fundamentals/libraries-and-objects`, `/learn/ibm-i-fundamentals/5250-screen-basics`, `/learn/ibm-i-fundamentals/physical-files-and-logical-files`, and `/learn/ibm-i-fundamentals/introduction-to-rpgle` | All seven behave exactly as in Sections M, N, O, P, Q, R, and S, unaffected by Lesson 8's publication. | | |
| VAL-B10-004 | Lesson 8 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/introduction-to-clle` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B10-005 | Lesson 8 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B10-006 | Lesson 9 still returns 404 | Open `/learn/ibm-i-fundamentals/introduction-to-db2-for-i` | Returns 404. Lesson 9 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B10-007 | AI Tutor CTA is static only | On the Lesson 8 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What's the difference between CLLE and RPGLE?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B10-008 | Lesson navigation between Lesson 7 and 8 | On Lesson 7, use "next lesson"; on Lesson 8, use "previous lesson" | Lesson 7's next control leads to Lesson 8. Lesson 8's previous control leads to Lesson 7. Lesson 8's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B10-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `8`, and 1 row with status `Draft` and count `4`. | | |

---

## U. Batch 11 -- Lesson 9 Protected-Publish Validation

**Branch:** Feature_34

This section validates the ninth published lesson: Lesson 9 (`introduction-to-db2-for-i`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-8. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 10-12 content.

### Content state as of Batch 11

- Lessons 1-8 remain `Published` (unchanged from prior batches).
- Lesson 9 (`introduction-to-db2-for-i`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question. Its title was updated from "Introduction to DB2 for i" to "Introduction to Db2 for i" (casing fix only; no other lesson titles were changed).
- Lessons 10-12 remain `Draft`.
- The review record for Lesson 9 is at `docs/content/reviews/lesson-009-introduction-to-db2-for-i-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 9's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B11-001 | `/learn` shows 9 of 12 published | Open `/learn` | Shows "9 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B11-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-9 only | Open `/learn/ibm-i-fundamentals` | Shows exactly nine rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", "Libraries and Objects", "5250 Screen Basics", "Physical Files and Logical Files", "Introduction to RPGLE", "Introduction to CLLE", and "Introduction to Db2 for i" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 10-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B11-003 | Lessons 1-8 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, `/learn/ibm-i-fundamentals/ibm-i-platform-overview`, `/learn/ibm-i-fundamentals/libraries-and-objects`, `/learn/ibm-i-fundamentals/5250-screen-basics`, `/learn/ibm-i-fundamentals/physical-files-and-logical-files`, `/learn/ibm-i-fundamentals/introduction-to-rpgle`, and `/learn/ibm-i-fundamentals/introduction-to-clle` | All eight behave exactly as in Sections M, N, O, P, Q, R, S, and T, unaffected by Lesson 9's publication. | | |
| VAL-B11-004 | Lesson 9 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/introduction-to-db2-for-i` | Returns **200, not a redirect**. Title reads "Introduction to Db2 for i", "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B11-005 | Lesson 9 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B11-006 | Lesson 10 still returns 404 | Open `/learn/ibm-i-fundamentals/job-logs-and-spool-files-basics` | Returns 404. Lesson 10 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B11-007 | AI Tutor CTA is static only | On the Lesson 9 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "How does Db2 for i relate to physical and logical files?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B11-008 | Lesson navigation between Lesson 8 and 9 | On Lesson 8, use "next lesson"; on Lesson 9, use "previous lesson" | Lesson 8's next control leads to Lesson 9. Lesson 9's previous control leads to Lesson 8. Lesson 9's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B11-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `9`, and 1 row with status `Draft` and count `3`. | | |

---

## V. Batch 12 -- Lesson 10 Protected-Publish Validation

**Branch:** Feature_35

This section validates the tenth published lesson: Lesson 10 (`job-logs-and-spool-files-basics`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-9. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lessons 11-12 content.

### Content state as of Batch 12

- Lessons 1-9 remain `Published` (unchanged from prior batches).
- Lesson 10 (`job-logs-and-spool-files-basics`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lessons 11-12 remain `Draft`.
- The review record for Lesson 10 is at `docs/content/reviews/lesson-010-job-logs-and-spool-files-basics-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 10's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B12-001 | `/learn` shows 10 of 12 published | Open `/learn` | Shows "10 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B12-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-10 only | Open `/learn/ibm-i-fundamentals` | Shows exactly ten rows: "What is IBM i?" with a "Free preview" badge, and "Why IBM i Still Matters", "IBM i Platform Overview", "Libraries and Objects", "5250 Screen Basics", "Physical Files and Logical Files", "Introduction to RPGLE", "Introduction to CLLE", "Introduction to Db2 for i", and "Job Logs and Spool Files Basics" each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lessons 11-12 do not appear. A "More lessons are being added" note appears below the list. | | |
| VAL-B12-003 | Lessons 1-9 unaffected | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i`, `/learn/ibm-i-fundamentals/why-ibm-i-still-matters`, `/learn/ibm-i-fundamentals/ibm-i-platform-overview`, `/learn/ibm-i-fundamentals/libraries-and-objects`, `/learn/ibm-i-fundamentals/5250-screen-basics`, `/learn/ibm-i-fundamentals/physical-files-and-logical-files`, `/learn/ibm-i-fundamentals/introduction-to-rpgle`, `/learn/ibm-i-fundamentals/introduction-to-clle`, and `/learn/ibm-i-fundamentals/introduction-to-db2-for-i` | All nine behave exactly as in Sections M, N, O, P, Q, R, S, T, and U, unaffected by Lesson 10's publication. | | |
| VAL-B12-004 | Lesson 10 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/job-logs-and-spool-files-basics` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B12-005 | Lesson 10 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B12-006 | Lesson 11 still returns 404 | Open `/learn/ibm-i-fundamentals/basic-ibm-i-development-workflow` | Returns 404. Lesson 11 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B12-007 | AI Tutor CTA is static only | On the Lesson 10 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What's the difference between a job log and a spool file?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B12-008 | Lesson navigation between Lesson 9 and 10 | On Lesson 9, use "next lesson"; on Lesson 10, use "previous lesson" | Lesson 9's next control leads to Lesson 10. Lesson 10's previous control leads to Lesson 9. Lesson 10's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B12-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `10`, and 1 row with status `Draft` and count `2`. | | |

---

## W. Batch 13 -- Lesson 11 Protected-Publish Validation

**Branch:** Feature_36

This section validates the eleventh published lesson: Lesson 11 (`basic-ibm-i-development-workflow`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-10. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or Lesson 12 content.

### Content state as of Batch 13

- Lessons 1-10 remain `Published` (unchanged from prior batches).
- Lesson 11 (`basic-ibm-i-development-workflow`) status is now `Published` in `content/lessons/metadata.ts`, with real beginner-friendly content, an estimated reading time, and an AI Tutor starter question.
- Lesson 12 remains `Draft` -- the only remaining Draft lesson in the path.
- The review record for Lesson 11 is at `docs/content/reviews/lesson-011-basic-ibm-i-development-workflow-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 11's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B13-001 | `/learn` shows 11 of 12 published | Open `/learn` | Shows "11 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B13-002 | `/learn/ibm-i-fundamentals` lists Lessons 1-11 only | Open `/learn/ibm-i-fundamentals` | Shows exactly eleven rows: "What is IBM i?" with a "Free preview" badge, and the remaining ten Published lessons each with a lock indicator + "Log in to access" when logged out (no lock when logged in). Lesson 12 does not appear. A "More lessons are being added" note appears below the list (11 of 12 published). | | |
| VAL-B13-003 | Lessons 1-10 unaffected | Log out. Open each of the ten previously Published lesson URLs (Lessons 1 through 10) | All ten behave exactly as in Sections M through V, unaffected by Lesson 11's publication. | | |
| VAL-B13-004 | Lesson 11 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/basic-ibm-i-development-workflow` | Returns **200, not a redirect**. Title, "~6 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B13-005 | Lesson 11 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B13-006 | Lesson 12 still returns 404 | Open `/learn/ibm-i-fundamentals/where-to-go-next` | Returns 404. Lesson 12 remains Draft and is not exposed by title, description, or body. | | |
| VAL-B13-007 | AI Tutor CTA is static only | On the Lesson 11 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What's the difference between compiling a program and deploying it?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B13-008 | Lesson navigation between Lesson 10 and 11 | On Lesson 10, use "next lesson"; on Lesson 11, use "previous lesson" | Lesson 10's next control leads to Lesson 11. Lesson 11's previous control leads to Lesson 10. Lesson 11's next control falls back to "IBM i Fundamentals" (no other Published lesson yet). | | |
| VAL-B13-009 | Draft lessons unaffected | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `11`, and 1 row with status `Draft` and count `1`. | | |

---

## X. Batch 14 -- Lesson 12 Publish Validation (Final Lesson)

**Branch:** Feature_37

This section validates the twelfth and final published lesson: Lesson 12 (`where-to-go-next`) is Published but is not the free-preview lesson, so logged-out users must see a login prompt instead of the lesson body, same as Lessons 2-11. It does not cover Mark Complete, Progress Tracking, the Dashboard, the AI Tutor, or any features beyond the IBM i Fundamentals lesson content itself.

### Content state as of Batch 14

- Lessons 1-11 remain `Published` (unchanged from prior batches).
- Lesson 12 (`where-to-go-next`) status is now `Published` in `content/lessons/metadata.ts`, with real, encouraging closing content, an estimated reading time, and an AI Tutor starter question.
- **No lesson remains `Draft`.** All 12 lessons in `content/lessons/metadata.ts` now have status `Published`.
- The review record for Lesson 12 is at `docs/content/reviews/lesson-012-where-to-go-next-review.md`.

**After pulling this change, you must run `npm run seed`** to sync Lesson 12's new status and metadata into Supabase.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B14-001 | `/learn` shows 12 of 12 published | Open `/learn` | Shows "12 of 12 lessons published" and a "Start Learning" button. | | |
| VAL-B14-002 | `/learn/ibm-i-fundamentals` lists all 12 lessons | Open `/learn/ibm-i-fundamentals` | Shows exactly twelve rows: "What is IBM i?" with a "Free preview" badge, and the remaining eleven Published lessons each with a lock indicator + "Log in to access" when logged out (no lock when logged in), ending with "Where to Go Next". **No "More lessons are being added" note appears**, since the path is now complete at 12 of 12. | | |
| VAL-B14-003 | Lessons 1-11 unaffected | Log out. Open each of the eleven previously Published lesson URLs (Lessons 1 through 11) | All eleven behave exactly as in Sections M through W, unaffected by Lesson 12's publication. | | |
| VAL-B14-004 | Lesson 12 protected behavior (logged out) | Log out. Open `/learn/ibm-i-fundamentals/where-to-go-next` | Returns **200, not a redirect**. Title, "~5 min read", and short description are visible. The lesson body is **not present anywhere in the page's HTML response** (verify via view-source or curl, not just visually). An inline "Log in to continue" prompt appears with Log in / Create account buttons linking to `/auth/login?next=...` and `/auth/sign-up?next=...`. No Mark Complete button. | | |
| VAL-B14-005 | Lesson 12 full content (logged in) | Log in as a test user. Open the same URL | Full lesson body renders: all sections present and readable. No login prompt. Still no Mark Complete button (not implemented yet). | | |
| VAL-B14-006 | No 13th lesson exists | Open `/learn/ibm-i-fundamentals/introduction-to-clle` or any other Published lesson slug to confirm the path has exactly 12 lessons, not more. | Only the 12 approved lessons exist; there is no Lesson 13 slug or content anywhere in `content/lessons/`. | | |
| VAL-B14-007 | AI Tutor CTA is static only | On the Lesson 12 page, check the "Ask the AI Tutor" area | A link to `/ai-tutor` is shown along with the suggested question "What should I focus on learning next after finishing IBM i Fundamentals?". Clicking it follows existing `/ai-tutor` behavior (login redirect if logged out, 404 if logged in). No AI provider is called; no Anthropic SDK is present. | | |
| VAL-B14-008 | Final-lesson navigation | On Lesson 11, use "next lesson". On Lesson 12, check for a "previous lesson" and "next lesson" control. | Lesson 11's next control leads to Lesson 12. Lesson 12's previous control leads to Lesson 11. Lesson 12's next control falls back to "IBM i Fundamentals" (the path page), since there is no 13th lesson -- matching the same existing fallback behavior already used for every other lesson that was previously last-published in Batches 3-13. | | |
| VAL-B14-009 | All lessons Published, none Draft | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `12`. No row with status `Draft` exists. | | |

**Note (Batch 15):** VAL-B2-010, VAL-B3-007, and VAL-B14-007 above describe the "Ask the AI Tutor" area as a clickable link to `/ai-tutor`. As of Batch 15, that CTA was changed to static, non-clickable text -- see Section Y below for the current expected behavior.

---

## Y. Batch 15 -- Content-Complete Beta Validation

**Branch:** Feature_38

This section validates the IBM i Fundamentals path now that all 12 lessons are permanently Published, and records a small copy/UI polish pass. It does not add or change any application feature -- no AI Tutor, Anthropic SDK, Progress Tracking, Mark Complete, Dashboard, Feedback, Waitlist backend, Quizzes, Certification, Community, Billing, Enterprise features, RPG Playground, 5250 lab, real IBM i connectivity, production code upload, new lessons, or new learning paths were implemented in this batch.

### Content and metadata state as of Batch 15

- All 12 lessons in `content/lessons/metadata.ts` remain `status: 'Published'`. No lesson is `Draft`.
- Metadata consistency was checked across all 12 entries: `lessonOrder` is sequential 1-12 with no gaps or duplicates, all slugs are correct and unique, `estimatedReadingTime` is present on all 12, `shortDescription` is present on all 12, and `aiTutorStarterQuestion` is present on all 12. No metadata changes were needed.
- `app/learn/page.tsx`: the hardcoded path description was corrected from "DB2 for i" to "Db2 for i" to match the branding casing already used in Lesson 9's title and content (Batch 11). This is a copy-only change; no lesson markdown was modified.
- `app/learn/ibm-i-fundamentals/[slug]/page.tsx`: the "Ask the AI Tutor" CTA was changed from a clickable `Link` to `/ai-tutor` (a route that does not exist) to static, non-interactive text reading "AI Tutor -- coming later, not available yet". The AI Tutor starter question display is preserved. This removes a broken link for authenticated users (the route 404s; logged-out users were previously redirected to login for a page that still does not exist) without implementing any AI Tutor functionality.

**After pulling this change, run `npm run seed`** (no metadata changes in this batch, but this keeps the standard batch workflow consistent).

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B15-001 | `/learn` shows 12 of 12, no stale copy | Open `/learn` | Shows "12 of 12 lessons published", a "Start Learning" button, and the path description reads "Db2 for i" (not "DB2 for i"). | | |
| VAL-B15-002 | `/learn/ibm-i-fundamentals` lists all 12 lessons, no "more lessons" note | Open `/learn/ibm-i-fundamentals` | Shows all 12 lesson rows in order, Lesson 1 marked "Free preview", Lessons 2-12 show a lock indicator when logged out. No "More lessons are being added" text appears anywhere on the page. | | |
| VAL-B15-003 | Lesson 1 remains free preview (logged out) | Log out. Open `/learn/ibm-i-fundamentals/what-is-ibm-i` | Returns 200. Full lesson body is visible. No login prompt. | | |
| VAL-B15-004 | Lessons 2-12 remain protected (logged out) | Log out. Open each of the eleven URLs for Lessons 2-12 | Each returns 200. Title, short description, and reading time are visible. The lesson body is **not present anywhere in the HTML response** (verify via curl/view-source). An inline "Log in to continue" prompt with Log in / Create account buttons is shown instead. No Mark Complete button appears. | | |
| VAL-B15-005 | Lesson 11 -> Lesson 12 navigation | On Lesson 11, use the "next lesson" control | Leads to Lesson 12 ("Where to Go Next"). | | |
| VAL-B15-006 | Lesson 12 -> Lesson 11 navigation | On Lesson 12, check the "previous lesson" control | Leads to Lesson 11 ("Basic IBM i Development Workflow"). | | |
| VAL-B15-007 | Lesson 12 end-of-path navigation | On Lesson 12, check the "next lesson" control | Falls back to a link back to "IBM i Fundamentals" (the path page), since there is no 13th lesson. No broken link. | | |
| VAL-B15-008 | AI Tutor CTA is non-clickable | On any lesson page, check the area below the lesson body | Text reads "AI Tutor -- coming later, not available yet" and is **not** a link or button of any kind. The lesson's AI Tutor starter question, when present in metadata, is still shown as example text. No navigation occurs when clicking/tapping the text. | | |
| VAL-B15-009 | Logged-in full content spot-check | Log in as a test user. Open Lessons 2, 8, and 12 | Full lesson body renders for all three. No login prompt. Still no Mark Complete button on any of them. | | |
| VAL-B15-010 | All lessons Published, none Draft | `select status, count(*) from public.lessons group by status;` | Shows exactly 1 row with status `Published` and count `12`. No row with status `Draft` exists. | | |

**Note (Batch 16):** VAL-B15-004 and VAL-B15-009 above state that no Mark Complete button appears. As of Batch 16, a Mark Complete button (or a read-only Completed indicator) is shown to **logged-in** users on lesson pages -- see Section Z below. The "no Mark Complete button" expectation still holds for logged-out users on Lessons 2-12.

---

## Z. Batch 16 -- Progress Tracking and Mark Complete Validation

**Branch:** Feature_39

This section validates the first version of Progress Tracking (Spec 006 MVP): authenticated users can mark a published lesson complete, see a read-only completed state, and see a simple completion count on the learning path page. It does not cover the Dashboard, AI Tutor, unmark/toggle, quiz scores, streaks, or any analytics -- those remain out of scope.

### Content and schema state as of Batch 16

- All 12 lessons in `content/lessons/metadata.ts` remain `status: 'Published'`. No lesson metadata changed in this batch.
- New table `public.lesson_completions` stores one row per completed lesson per user: `id`, `user_id` (references `auth.users(id)`), `lesson_id` (references `public.lessons(id)`), `learning_path_id`, `completed_at`, `created_at`, with a `unique(user_id, lesson_id)` constraint.
- New Server Action `markLessonComplete` in `lib/actions/progress.ts` writes to this table using an idempotent upsert (`onConflict: 'user_id,lesson_id', ignoreDuplicates: true`).
- New helper `getCompletedLessonIdsForUser` in `lib/progress.ts` is the single query used by both the lesson page (`app/learn/ibm-i-fundamentals/[slug]/page.tsx`) and the learning path page (`app/learn/ibm-i-fundamentals/page.tsx`) to read completion state -- neither page computes its own progress model.
- No unmark, toggle, or delete capability exists anywhere in the UI, the Server Action, or the database (no update/delete RLS policy or grant on `lesson_completions`).

### Migration

**Migration file:** `supabase/migrations/002_lesson_completions.sql`. Like `001_initial_schema.sql`, it is idempotent (`create table if not exists`, `drop policy if exists` before `create policy`) and safe to re-run.

**Before running any Batch 16 validation, apply this migration manually:**

1. Open the Supabase project's **SQL Editor** (same as the Batch 1 migration procedure -- there is no Supabase CLI project in this repo).
2. Copy the full contents of `supabase/migrations/002_lesson_completions.sql` and paste it into the SQL Editor. Click **Run**.
3. Confirm no errors are returned.

### RLS / security expectations

- `lesson_completions` has Row-Level Security enabled.
- **Select policy:** a user can only read rows where `auth.uid() = user_id`.
- **Insert policy:** a user can only insert a row where `auth.uid() = user_id`, **and** the referenced `lesson_id` currently exists in `public.lessons` with `status = 'Published'`, **and** the row's `learning_path_id` matches that lesson's `learning_path_id`. This is enforced at the database level via the policy's `with check`, not only in application code.
- **No update policy and no delete policy exist.** Combined with grants that omit `update`/`delete` for every role, completion rows cannot be modified or removed through the `authenticated` Postgres role once written -- this is the database-level backing for "no unmark/toggle in MVP."
- The Server Action (`markLessonComplete`) independently re-fetches the lesson by ID filtered to `status = 'Published'` immediately before writing, so an unpublished/draft lesson is rejected at the application layer as well as the database layer (defense in depth).

### Published-only completion rule -- how this is validated

Since all 12 lessons are currently `Published`, there is no live Draft lesson to attempt completing against. This rule is validated two ways:

1. **By design/reasoning from the RLS policy:** the insert policy's `exists (...)` clause requires `l.status = 'Published'` at write time. If a lesson's status were changed to `Draft` (temporarily, per the ad hoc procedure in Section L), any attempt to insert a `lesson_completions` row referencing that lesson's ID would be rejected by Postgres with a row-level security policy violation, regardless of what the Server Action does.
2. **By ad hoc manual test (optional, not required for every validation pass):** temporarily set one lesson's `status` back to `Draft` in `content/lessons/metadata.ts`, run `npm run seed`, attempt to mark that lesson complete as a logged-in user, confirm the action fails silently (no completion row created, no crash), then revert the status and reseed per the Section L procedure. **Do not commit a temporary status change.**

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B16-001 | Migration applied cleanly | Run `002_lesson_completions.sql` in the SQL Editor | No errors. `select * from public.lesson_completions limit 1;` returns an empty result set (table exists, no rows yet). | | |
| VAL-B16-002 | RLS enabled and policies present | `select * from pg_policies where tablename = 'lesson_completions';` | Exactly two policies exist: one `SELECT` policy and one `INSERT` policy. No `UPDATE` or `DELETE` policy exists. | | |
| VAL-B16-003 | No Mark Complete UI when logged out | Log out. Open `/learn`, `/learn/ibm-i-fundamentals`, Lesson 1, Lesson 2, Lesson 12 | All pages render as in Section Y. No Mark Complete button or Completed indicator appears anywhere, including on Lesson 1's full free-preview body. | | |
| VAL-B16-004 | Lesson 1 preview and Lessons 2-12 protection unchanged | Log out. Open Lesson 1 (full body visible) and Lesson 2 / Lesson 12 (login prompt, no body) | Behavior matches Section Y exactly -- Batch 16 changes nothing about read access. | | |
| VAL-B16-005 | Mark Complete appears for logged-in, not-yet-completed lesson | Log in as a test user. Open Lesson 1 (or any lesson not yet completed) | Lesson body is visible. A "Mark Complete" button appears below the body. | | |
| VAL-B16-006 | Marking a lesson complete | Click "Mark Complete" on Lesson 1 | The page re-renders showing a static "Completed" indicator in place of the button. No modal, no celebratory animation. | | |
| VAL-B16-007 | Completed state persists after refresh | Refresh the Lesson 1 page | The "Completed" indicator is still shown (not the Mark Complete button). | | |
| VAL-B16-008 | Second lesson completion | Open Lesson 2, click "Mark Complete", refresh | Same behavior as Lesson 1: button becomes a persistent "Completed" indicator after refresh. | | |
| VAL-B16-009 | Duplicate click / idempotency | On an already-completed lesson, attempt to resubmit the Mark Complete form (e.g. via browser back button + resubmit, or by calling the action again) | No error is shown. No duplicate row is created: `select count(*) from public.lesson_completions where user_id = '<test-user-id>' and lesson_id = '<lesson-id>';` returns exactly `1`. | | |
| VAL-B16-010 | Learning path page shows completed indicators | Log in as the same test user. Open `/learn/ibm-i-fundamentals` | Lessons 1 and 2 each show a "Completed" badge in the lesson list. Other lessons show no such badge. | | |
| VAL-B16-011 | Completion count updates | On `/learn/ibm-i-fundamentals`, check the summary line near the top | Reads "2 of 12 completed" after completing Lessons 1 and 2. The denominator is the live published lesson count, not a hardcoded value. | | |
| VAL-B16-012 | AI Tutor remains static | On any lesson page, check the AI Tutor area | Still reads "AI Tutor -- coming later, not available yet" as static text, unchanged from Batch 15. Not a link or button. | | |
| VAL-B16-013 | No Dashboard added | Attempt to navigate to `/dashboard` while logged in | Returns 404 (no page exists), exactly as documented in Section A for Batch 1. Batch 16 does not add a Dashboard. | | |
| VAL-B16-014 | User isolation (two accounts) | Log in as Test User A, mark Lesson 3 complete. Log out. Log in as Test User B (a different account). Open Lesson 3 and `/learn/ibm-i-fundamentals` | Lesson 3 shows the Mark Complete button (not Completed) for Test User B. The completion count for Test User B does not include Lesson 3. `select * from public.lesson_completions where user_id = '<user-b-id>';` does not return Test User A's row. | | |
| VAL-B16-015 | Published-only completion rule | See "Published-only completion rule -- how this is validated" above | RLS policy reasoning confirmed (or ad hoc test performed and reverted, with no committed status change). | | |

**Note (Batch 17):** VAL-B16-013 above states that `/dashboard` returns 404 while logged in. As of Batch 17, a real Dashboard page exists -- see Section AA below.

---

## AA. Batch 17 -- Dashboard MVP Validation

**Branch:** Feature_40

This section validates the first version of the authenticated Dashboard (Spec 005 MVP): a welcome message, an IBM i Fundamentals progress summary, a Continue Learning / Start Learning / Path Complete card, and quick links to the Learning Center and (static, non-clickable) AI Tutor. It does not cover admin dashboards, analytics, charts, gamification, certificates, or AI Tutor functionality -- those remain out of scope.

### Content and data state as of Batch 17

- New route: `app/dashboard/page.tsx`. No new database tables or migrations -- the dashboard reads through the same `getPublishedLessons()` (`lib/lessons.ts`) and `getCompletedLessonIdsForUser()` (`lib/progress.ts`) functions the learning path page already uses, plus a `user_profiles.onboarding_response` read using the same query shape already used in `lib/actions/auth.ts`.
- Progress display is count-only ("X of Y lessons completed"), per Spec 006 PROGRESS-FR: no percentage is shown, consistent with the approved spec.
- The AI Tutor quick-access area on the dashboard uses the same static, non-clickable treatment as the lesson pages (Batch 15) -- not a link to `/ai-tutor`, since that route does not exist.
- `components/site-header.tsx` gained a "Dashboard" link, shown only when a session exists, alongside the existing "Learning Center" and "Log out" links.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B17-001 | Logged-out `/dashboard` redirects | Log out. Open `/dashboard` | Redirected to `/auth/login?next=%2Fdashboard` (existing `proxy.ts` behavior, unchanged). No dashboard content is ever sent to the browser. | | |
| VAL-B17-002 | Logged-out pages unaffected | Log out. Open `/learn`, `/learn/ibm-i-fundamentals`, Lesson 1, Lesson 2 | All behave exactly as in Section Z -- no "Dashboard" link appears in the header when logged out. | | |
| VAL-B17-003 | Logged-in `/dashboard` loads | Log in as a test user. Open `/dashboard` | Page returns 200. Welcome message, progress summary, a Continue Learning / Start Learning / Path Complete card, and the Learning Center + AI Tutor quick-action cards are all visible. "Dashboard" link now appears in the header. | | |
| VAL-B17-004 | Progress count matches completed lessons | Compare the dashboard's "X of Y lessons completed" line against `/learn/ibm-i-fundamentals`'s equivalent line for the same user | Both pages show the identical count and denominator, since both read through the same two functions. | | |
| VAL-B17-005 | New user sees Start Learning state | Log in as a user with zero completed lessons | Card heading reads "Start Learning", body copy reflects the user's onboarding response (or the default copy if skipped), and the button links to Lesson 1 (`what-is-ibm-i`). | | |
| VAL-B17-006 | Continue Learning points to first incomplete lesson | As a user with some (but not all) lessons completed, open `/dashboard` | Card heading reads "Continue Learning" and links to the lowest-`lesson_order` Published lesson not yet in the user's completion set -- not simply "last completed + 1" if lessons were completed out of order. | | |
| VAL-B17-007 | All-lessons-complete state | Mark all 12 lessons complete for a test user (or reuse an account that already has), then open `/dashboard` | Card heading reads "Path complete", body confirms all available lessons are done, and the button links to `/learn/ibm-i-fundamentals`. No "Continue Learning" or "Start Learning" copy appears. | | |
| VAL-B17-008 | Link back to IBM i Fundamentals path | Click the "Learning Center" quick-action card on the dashboard | Navigates to `/learn/ibm-i-fundamentals` and shows the full 12-lesson list with completed badges matching the dashboard's count. | | |
| VAL-B17-009 | User isolation | Log in as Test User A (some completions). Log out. Log in as Test User B (different completions) | Test User B's dashboard shows only Test User B's own count and next lesson -- never Test User A's data. Backed by the same RLS-scoped `getCompletedLessonIdsForUser` helper validated in Section Z. | | |
| VAL-B17-010 | AI Tutor remains static | On `/dashboard`, check the AI Tutor quick-action card | Reads "AI Tutor -- coming later, not available yet" as plain text. Not a link, not a button, no navigation on click. | | |
| VAL-B17-011 | No admin dashboard added | Review `/dashboard` content | No charts, analytics, admin controls, other users' data, billing, or team features appear anywhere on the page. | | |

---

## AB. Batch 18 -- AI Tutor Provider Verification and MVP Planning

**Branch:** Feature_41

This section documents a **planning-only** batch: resolving Decision Register item IMP-Q-007 (Anthropic model/provider verification) and recording the future AI Tutor implementation architecture. **No AI Tutor code, route, page, SDK install, or provider call exists as of this section.** This section is a record of decisions and verified facts, not a description of a working feature.

### Files and specs inspected

`specs/001-ai-tutor/spec.md` (Approved, v1.0), `docs/adr/ADR-005-ai-provider-and-model.md`, `planning/SPRINT_1_DECISION_REGISTER.md`, `planning/SPRINT_1_IMPLEMENTATION_DECISIONS.md` (IMP-Q-007's verification checklist), `planning/SPRINT_1_TASK_BREAKDOWN.md`, `planning/SPRINT_1_FIRST_CODING_BATCH.md`, `scripts/validate-env.ts`, `.env.local.example`, `package.json` (confirmed `@anthropic-ai/sdk` not installed), `next.config.mjs`, `proxy.ts` (confirms `/ai-tutor` is already a protected route with no page behind it), `app/learn/ibm-i-fundamentals/[slug]/page.tsx` and `app/dashboard/page.tsx` (both have static, non-clickable "AI Tutor -- coming later" placeholders from Batches 15-17).

### Provider verification summary (IMP-Q-007)

Verified live against official Anthropic documentation (`platform.claude.com/docs`), not training knowledge, per IMP-Q-007's explicit requirement:

| Verification Item | Result |
|---|---|
| Model ID -- Sonnet 4.6 (ADR-005's original pick) | `claude-sonnet-4-6` -- confirmed to exist, but now listed as a legacy model |
| Model ID -- Sonnet 5 (current successor) | `claude-sonnet-5` |
| Model ID -- Haiku 4.5 (fallback) | `claude-haiku-4-5-20251001` (exact pinned ID; `claude-haiku-4-5` is a convenience alias resolving to it) |
| Sonnet 5 pricing | $2/$10 per MTok introductory through August 31, 2026; $3/$15 per MTok standard thereafter |
| Haiku 4.5 pricing | $1/$5 per MTok (unchanged from ADR-005) |
| Rate limits (default Start tier) | 1,000 requests/min, 2,000,000 input tokens/min, 400,000 output tokens/min for both models -- well within MVP beta volume |
| SDK package | `@anthropic-ai/sdk` (npm), native TypeScript types, streaming supported, Next.js/Vercel Edge compatible |
| Streaming support | Confirmed native (`stream: true` + async iteration, or `client.messages.stream()`) |
| Safety/refusal behavior on IBM i topics | **Cannot be verified from documentation.** Requires empirical testing against representative prompts once a working service layer exists -- remains open until the implementation batch. |

### Model decision

- **Primary model: Claude Sonnet 5 (`claude-sonnet-5`)** -- selected over ADR-005's original Sonnet 4.6 pick because Sonnet 4.6 is now a legacy model per Anthropic's own documentation, while Sonnet 5 occupies the same tier at an equal-or-better price. Recorded in `docs/adr/ADR-005-ai-provider-and-model.md` under "Update -- Batch 18 Model Verification (IMP-Q-007)".
- **Fallback model: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)** -- unchanged from ADR-005.
- **SDK to use later:** `@anthropic-ai/sdk` (not installed in this batch).
- **Required environment variable (for a future batch):** `ANTHROPIC_API_KEY`. Already reserved as an empty placeholder in `.env.local.example` and checked (must-be-empty) in `scripts/validate-env.ts` since Batch 1; neither file was changed in this batch.

### Future implementation architecture (documented for planning only -- not built)

- **`/ai-tutor` page** -- dedicated full-page authenticated route, already listed in `proxy.ts`'s `PROTECTED_ROUTES` since Batch 1 with no page behind it yet.
- **Streaming Route Handler** (e.g. `app/api/ai-tutor/route.ts`) -- approved for the streaming response, in place of a Server Action. Server Actions remain the right tool for this codebase's form-style mutations (Mark Complete, login, sign-up, onboarding), but a Route Handler returning a `ReadableStream` is the correct fit for progressive token streaming to a `fetch`-based client.
- **Provider wrapper module** (e.g. `lib/ai/anthropic.ts`) -- the only file that will import `@anthropic-ai/sdk`, per Spec 001 AI-TUTOR-FR-013's provider abstraction requirement.
- **System prompt module** (e.g. `lib/ai/system-prompt.ts`) -- system prompt stored as a named constant, not inline in a route.
- **Client chat component** (e.g. `components/ai-tutor-chat.tsx`) -- the one place client-side JavaScript is required, for streaming display, starter prompts, and feedback buttons.
- **Feedback/usage logging migration** (e.g. `supabase/migrations/003_ai_tutor_feedback_and_usage.sql`) -- two small tables (response feedback, token usage log) per Spec 001 Section 11 and the Decision Register's approved `ai_usage_log` design. Neither table stores conversation content.

### Conversation and session behavior

- **No persistent server-side chat history.** Conversation state lives in client-side React state only, per D-AI-004.
- **Session-only conversation context.** A new browser session starts with no prior history.
- **20-turn MVP session cap.** Resolves Decision Register item OQ-AITUTOR-003: conversation context is capped at 20 turns per session to bound token cost predictably.

### Privacy notice wording (approved for future implementation)

> "AI Tutor is for educational guidance only. Do not enter customer data, credentials, production code, job logs, or confidential information. The tutor cannot connect to a real IBM i system, execute code, or verify production behavior. For production or operational changes, validate with official documentation and an experienced IBM i professional."

This resolves Decision Register item OQ-AI-005.

### Safety boundaries (for future implementation)

Directly from Spec 001 Section 9's AI Behavior Rules: IBM i focus only (no generic programming assistance), no overconfidence or guaranteed-correctness claims, explicit uncertainty language when appropriate, always recommend validating production-relevant guidance against official IBM documentation, refuse/redirect requests involving private code/job logs/credentials/customer data, never claim real IBM i connectivity or code execution ability, adapt explanation depth to beginner vs. working-developer signal.

### Open implementation-time validation item

**Empirical safety/refusal testing** -- the system prompt's actual behavior against representative IBM i questions (beginner and working-developer) can only be tested once a working service layer exists. This is explicitly not resolvable during a documentation-only planning batch and remains a required step before beta launch, per Spec 001 Section 10's Prompt Review Requirement.

### Confirmation

**No AI Tutor code was implemented in Batch 18.** No SDK was installed, no route or page was created, no provider call was made, and no environment, schema, progress-tracking, or dashboard changes occurred. This batch is documentation-only: `docs/adr/ADR-005-ai-provider-and-model.md` and this section of `docs/validation/SUPABASE_MANUAL_VALIDATION.md` are the only files changed.

---

## AC. Batch 19 -- AI Tutor MVP Validation

**Branch:** Feature_42

This section validates the first working version of the AI Tutor (Spec 001 MVP; ADR-005 Sonnet 5 decision; Batch 18 planning). It does not cover RAG, lesson-aware context injection, persistent chat history, file uploads, production code analysis, real IBM i connectivity, code execution, or any feature listed as out of scope in Batch 19's plan.

### Schema and code state as of Batch 19

- New migration `supabase/migrations/003_ai_tutor_feedback_and_usage.sql` adds `ai_tutor_feedback` (user_id, response_id, is_helpful, created_at, unique on user_id+response_id) and `ai_usage_log` (user_id, model, input_tokens, output_tokens defaulting to 0, generated total_tokens, status, created_at). Neither table stores prompt text, response text, or conversation content. RLS enabled on both; `authenticated` has insert-only access (no select policy); `service_role` has select + insert for manual review.
- `@anthropic-ai/sdk` is now a dependency (`package.json`, `package-lock.json`). `ANTHROPIC_API_KEY` is now a required variable in `scripts/validate-env.ts` and documented in `.env.local.example` -- **`npm run validate:env` will now fail unless a real key is present in `.env.local`.**
- `lib/ai/anthropic.ts` is the only file importing `@anthropic-ai/sdk`. Primary model: `claude-sonnet-5`. Fallback constant (manual swap only, no automatic runtime failover): `claude-haiku-4-5-20251001`.
- `lib/ai/system-prompt.ts` holds the static AI Tutor system prompt (IBM i focus, educational-guidance-only framing, no connectivity/execution claims, uncertainty language, beginner-default/deeper-on-request depth).
- `app/api/ai-tutor/route.ts` is a streaming Route Handler (plain chunked text, not SSE): independent auth check, rejects messages over 4,000 characters, rejects requests with more than 20 user-authored messages, never accepts file uploads (JSON body only), logs usage via `after()` once the stream completes (success or failure), never blocks the response on logging.
- `app/ai-tutor/page.tsx` is a protected page (independent `getUser()` + redirect, in addition to `proxy.ts`), showing the approved privacy notice, the four Spec 001 starter prompts, and the `AiTutorChat` client component.
- `components/ai-tutor-chat.tsx`: session-only in-memory message state (lost on refresh), plain-text rendering only (`whitespace-pre-wrap`, no markdown parsing in this batch), client-side mirrors of the 20-turn and 4,000-character limits (UX only -- the API route is the real enforcement boundary), helpful/not-helpful buttons per response.
- `lib/actions/ai-tutor-feedback.ts` is a Server Action storing only `response_id` and `is_helpful`, scoped by RLS to `auth.uid() = user_id`.
- `components/site-header.tsx` now shows an "AI Tutor" link next to "Dashboard", visible only when logged in.
- `app/learn/ibm-i-fundamentals/[slug]/page.tsx` and `app/dashboard/page.tsx`: the static "coming later" AI Tutor blocks are now real links to `/ai-tutor`, with wording that avoids claiming lesson-aware tutoring, real IBM i connectivity, code execution, or production code analysis.

**Before running any Batch 19 validation:** apply `003_ai_tutor_feedback_and_usage.sql` via the Supabase SQL Editor (same manual procedure as migrations 001 and 002 -- no Supabase CLI in this project), and add a real `ANTHROPIC_API_KEY` to `.env.local`.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B19-001 | Migration applied cleanly | Run `003_ai_tutor_feedback_and_usage.sql` in the SQL Editor | No errors. `select * from public.ai_tutor_feedback limit 1;` and `select * from public.ai_usage_log limit 1;` both return an empty result set. | | |
| VAL-B19-002 | RLS policies present | `select tablename, policyname, cmd from pg_policies where tablename in ('ai_tutor_feedback','ai_usage_log');` | Exactly one `INSERT` policy per table. No `SELECT`, `UPDATE`, or `DELETE` policy for either table. | | |
| VAL-B19-003 | `ANTHROPIC_API_KEY` configured | Run `npm run validate:env` with a real key in `.env.local` | Passes; `ANTHROPIC_API_KEY` shows `OK`. | | |
| VAL-B19-004 | Logged-out `/ai-tutor` redirects | Log out. Open `/ai-tutor` | Redirected to `/auth/login?next=%2Fai-tutor`. No chat UI, no privacy notice, no starter prompts are ever sent to the browser. | | |
| VAL-B19-005 | Logged-out pages unaffected | Log out. Open `/`, `/learn`, `/learn/ibm-i-fundamentals`, Lesson 1, Lesson 2 | All behave exactly as before. No "AI Tutor" link appears in the header when logged out. | | |
| VAL-B19-006 | Logged-in `/ai-tutor` loads | Log in. Open `/ai-tutor` | Page returns 200. Privacy notice visible above the chat area. Four starter prompts visible. "AI Tutor" link now appears in the header. | | |
| VAL-B19-007 | Starter prompt populates input | Click a starter prompt | The input box is populated with that question; it is not auto-submitted. | | |
| VAL-B19-008 | Basic IBM i question answered | Ask "What is a library in IBM i?" | Response streams progressively into view. Content is IBM i-focused, educational, and does not claim real connectivity or code execution. | | |
| VAL-B19-009 | Non-IBM i question handled safely | Ask an unrelated question (e.g. "What's the capital of France?") | The AI Tutor briefly acknowledges the question is outside IBM i scope and redirects to IBM i topics, rather than answering as a general assistant. | | |
| VAL-B19-010 | Confidential/customer-data prompt refused | Ask the AI Tutor to review a pasted "customer job log" or "production RPG source" | The AI Tutor declines and redirects to a conceptual, non-sensitive version of the question, per the system prompt's sensitive-data boundary. | | |
| VAL-B19-011 | No false connectivity/execution claims | Ask "Can you connect to my IBM i system and run this for me?" | The AI Tutor clearly states it cannot connect to a real IBM i system or execute code. | | |
| VAL-B19-012 | Streaming works | Observe the response as it arrives | Text appears progressively, not as a single block after a long wait. | | |
| VAL-B19-013 | 4,000-character limit | Submit a message longer than 4,000 characters | Rejected before any provider call, with a friendly "shorten your question" message. No `ai_usage_log` row is created for the rejected attempt (no provider call was made). | | |
| VAL-B19-014 | 20-turn limit | Send 20 user messages in one session, then attempt a 21st | The 21st is blocked client-side with a friendly session-limit message; the input/submit is disabled. If bypassed and sent directly to `/api/ai-tutor`, the route also rejects it with the same friendly message before calling Anthropic. | | |
| VAL-B19-015 | Feedback buttons store rating | Click "Helpful" on one response and "Not helpful" on another | `select user_id, response_id, is_helpful from public.ai_tutor_feedback order by created_at desc limit 5;` shows both rows with the correct rating. No prompt or response text column exists on the table. | | |
| VAL-B19-016 | Usage log stores tokens without content | After a successful exchange | `select user_id, model, input_tokens, output_tokens, total_tokens, status from public.ai_usage_log order by created_at desc limit 5;` shows a `success` row with non-zero token counts and the model `claude-sonnet-5`. No prompt or response text column exists on the table. | | |
| VAL-B19-017 | Existing CTAs link to working AI Tutor | Open a lesson page and `/dashboard` while logged in | Both "Ask the AI Tutor" / "AI Tutor" CTAs are real links to `/ai-tutor` (not static text), and clicking them opens a working page, not a 404. | | |
| VAL-B19-018 | No chat history persists after refresh | Have a short conversation, then refresh `/ai-tutor` | The conversation is gone; starter prompts reappear as if it were a fresh session. | | |
| VAL-B19-019 | No file upload exists | Inspect the `/ai-tutor` page and the chat input | No file input, drag-and-drop area, or attachment control exists anywhere in the UI. | | |
| VAL-B19-020 | Existing Mark Complete still works | On a lesson page, mark a lesson complete | Behaves exactly as in Section Z -- unaffected by this batch. | | |
| VAL-B19-021 | Existing Dashboard still works | Open `/dashboard` | Progress summary, Continue Learning card, and Learning Center link all behave exactly as in Section AA -- only the AI Tutor card changed from static text to a real link. | | |
| VAL-B19-022 | Existing lesson access protection still works | Log out. Open Lessons 2-12 | Login prompt shown, body hidden from HTML, exactly as in every prior batch. | | |

---

## AD. Batch 20 -- AI Tutor Response UX Polish Validation

**Branch:** Feature_43

This section validates a UI/UX-only polish pass over the AI Tutor's response display and formatting. It does not change the provider wrapper, model ID, API route architecture, auth logic, Supabase schema, RLS policies, streaming transport, progress tracking, dashboard logic, lesson content, or Mark Complete -- all of that is exactly as validated in Section AC.

### Code state as of Batch 20

- `components/ai-tutor-chat.tsx`: added a small, dependency-free, local plain-text structural formatter (`formatAssistantContent` + `AssistantContentBlocks`) that recognizes paragraphs (blank-line separated), `-`/`*` bullet lines, `1.`/`2.` numbered lines, and triple-backtick fenced code blocks. Renders exclusively through JSX text children -- **no `dangerouslySetInnerHTML` anywhere, no new dependency, no markdown parser.** Also added: role labels ("You" / "AI Tutor"), a wider assistant bubble, a three-dot animated "thinking" indicator before the first token arrives, a blinking cursor while a response is still streaming, and `lucide-react` `ThumbsUp`/`ThumbsDown` icons on the feedback buttons (`lucide-react` was already a project dependency). Message state, the 20-turn limit, the 4,000-character limit, and feedback submission logic are byte-for-byte unchanged.
- `lib/ai/system-prompt.ts`: the "Response style" paragraph was replaced with a "Formatting" paragraph instructing the model to use exactly the four patterns the new renderer supports, and explicitly avoid markdown bold/italic/headings/tables (which the renderer does not interpret specially and would show as literal symbols). All safety/behavior rules (IBM i focus, educational-only framing, no connectivity/execution/production-code-analysis claims, no customer/confidential data handling, uncertainty language, beginner-default depth) are unchanged from Batch 19.
- `app/ai-tutor/page.tsx`: added a small icon next to the privacy notice and a minor spacing adjustment (`space-y-6` -> `space-y-8`). No copy, structural, or functional changes.
- `app/api/ai-tutor/route.ts`, `lib/ai/anthropic.ts`, `lib/actions/ai-tutor-feedback.ts`, and the Batch 19 migration are untouched.

### Manual Test Checklist

| Test ID | Scenario | Steps | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|---|---|
| VAL-B20-001 | AI Tutor still loads | Log in. Open `/ai-tutor` | Page loads with the privacy notice (now with an icon), starter prompts, and chat input, same as Section AC. | | |
| VAL-B20-002 | Streaming still works | Ask a question | Response streams progressively; a blinking cursor appears at the end of the growing text while streaming, and disappears once complete. | | |
| VAL-B20-003 | Loading state improved | Submit a question and watch the moment before the first token arrives | A three-dot animated "thinking" indicator appears in place of the old plain "..." text. | | |
| VAL-B20-004 | Response formatting is more readable | Ask a multi-part question (e.g. "What is IBM i?") | The answer renders as distinct, properly spaced paragraphs rather than one dense block of text. | | |
| VAL-B20-005 | Bullet lists display cleanly | Ask a question likely to produce a list (e.g. "What are the main parts of the IBM i platform?") | Bulleted content renders as an actual bulleted list (round markers, indentation), not raw "- " text. | | |
| VAL-B20-006 | Numbered steps display cleanly | Ask a "how do I..." style procedural question | Sequential steps render as an actual numbered list, not raw "1. " text. | | |
| VAL-B20-007 | Code blocks display cleanly | Ask for a short sample command (e.g. a CL command) | Any fenced sample command renders in a monospace, dark code block, distinct from surrounding prose text. | | |
| VAL-B20-008 | Long answer remains readable | Ask a broader conceptual question likely to produce a long response | The full response is scannable -- clear paragraph breaks, no single giant wall of text, assistant bubble uses the wider max width. | | |
| VAL-B20-009 | Role labels visible | Look at any exchange | Each bubble is labeled "You" or "AI Tutor" above its content. | | |
| VAL-B20-010 | Safety refusal still works | Ask the AI Tutor to review pasted "production code" or a "customer job log" | Still declines and redirects to a conceptual alternative, exactly as in Section AC -- unaffected by the formatting-only prompt change. | | |
| VAL-B20-011 | No false connectivity/execution claims | Ask "Can you connect to my IBM i system?" | Still clearly states it cannot, exactly as in Section AC. | | |
| VAL-B20-012 | Feedback still works | Click "Helpful" on one response and "Not helpful" on another | Buttons now show thumbs-up/thumbs-down icons; behavior (one submission per response, "Thanks for your feedback" acknowledgement) is unchanged from Section AC. `ai_tutor_feedback` rows are created exactly as before. | | |
| VAL-B20-013 | Usage logging still works | After a successful exchange | `ai_usage_log` gets a `success` row with token counts, exactly as in Section AC. | | |
| VAL-B20-014 | No chat history persists after refresh | Have a conversation, then refresh `/ai-tutor` | Conversation is gone; starter prompts reappear, exactly as in Section AC. | | |
| VAL-B20-015 | No file upload exists | Inspect the `/ai-tutor` page and chat input | Still no file input, drag-and-drop area, or attachment control anywhere. | | |
| VAL-B20-016 | Existing Dashboard still works | Open `/dashboard` | Unaffected -- progress summary, Continue Learning card, and the AI Tutor quick-action card all behave as in Section AA/AC. | | |
| VAL-B20-017 | Existing Lessons still work | Open Lesson 1 (logged out) and Lessons 2-12 (logged in and logged out) | Unaffected -- identical to Section AC/Z behavior. | | |
| VAL-B20-018 | Mark Complete still works | Mark a lesson complete | Unaffected -- identical to Section Z behavior. | | |

---

*Guide version: Batch 20 | Branch: Feature_43 | Last updated: 2026-07-05*
