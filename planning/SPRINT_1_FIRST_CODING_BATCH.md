# Sprint 1 First Coding Batch

## Document Metadata

| Field | Value |
|---|---|
| Title | Sprint 1 First Coding Batch |
| Status | Draft |
| Version | 0.1 |
| Last Updated | 2026-07-01 |
| Owner | Engineering |

### Source Documents

| Document | Version | Role |
|---|---|---|
| planning/SPRINT_1_IMPLEMENTATION_DECISIONS.md | v1.0 | Approved implementation decisions |
| planning/SPRINT_1_TASK_BREAKDOWN.md | v1.0 | Approved task definitions and acceptance notes |
| planning/SPRINT_1_IMPLEMENTATION_PLAN.md | v1.0 | Approved implementation plan |

---

## 1. Batch Scope

This batch covers the foundation, authentication, early content governance, and initial content loading tasks that are ready to begin now. All implementation decisions that these tasks depend on are resolved.

### Included Tasks

#### Foundation and Environment

| Task ID | Title |
|---|---|
| S1-FND-001 | Initialize Next.js + TypeScript project with Tailwind CSS and TypeScript strict mode |
| S1-FND-002 | Add lightweight component library (shadcn/ui or equivalent) |
| S1-FND-003 | Create Supabase project and configure PostgreSQL database |
| S1-FND-004 | Configure Vercel deployment connected to GitHub with PR preview deployments |
| S1-FND-005 | Configure environment variable management for development and Vercel |
| S1-FND-006 | Define repository directory structure (`app/`, `components/`, `lib/`, `services/`, `content/lessons/`, `docs/content/`) |

#### Authentication and Onboarding

| Task ID | Title |
|---|---|
| S1-AUTH-001 | Integrate Supabase Auth email/password sign-up |
| S1-AUTH-002 | Implement email/password login |
| S1-AUTH-003 | Implement logout |
| S1-AUTH-004 | Implement session persistence and confirm Supabase session is server-side readable |
| S1-AUTH-005 | Implement Next.js middleware for protected route enforcement |
| S1-AUTH-006 | Implement forgot password flow via Supabase Auth |
| S1-AUTH-007 | Implement onboarding question screen (shown once after sign-up) |
| S1-AUTH-008 | Implement post-login and post-signup redirect behavior |
| S1-AUTH-009 | Create basic user profile record in Supabase PostgreSQL |

#### Content Governance

| Task ID | Title |
|---|---|
| S1-GOV-001 | Create lesson review checklist template at `docs/content/lesson-review-checklist.md` |

#### Content Metadata and Markdown Loading

| Task ID | Title |
|---|---|
| S1-CONTENT-001 | Design lesson metadata record shape in Supabase PostgreSQL |
| S1-CONTENT-002 | Seed initial lesson metadata (12 lessons, status = Draft) |
| S1-CONTENT-003 | Implement lesson Markdown file loading from the repository content directory |
| S1-CONTENT-004 | Implement published-only lesson filter (server-side; status = Published only) |
| S1-CONTENT-005 | Implement non-published lesson route protection (404 for non-Published slugs) |
| S1-CONTENT-006 | Create lesson content directory structure with placeholder Markdown files for each lesson |

#### Public Landing Experience (Shell Only)

| Task ID | Title |
|---|---|
| S1-LAND-001 | Implement landing page shell at `/` (statically generated, no database calls) |
| S1-LAND-002 | Implement hero section with approved headline, subheadline, and "Join the Waitlist" CTA label (CTA label in config constant; form backend not required for this task) |

---

## 2. Explicitly Not in This Batch

The following tasks and features are excluded from this batch. They must not be implemented until the appropriate decisions are resolved or later batches are approved.

| Excluded | Reason |
|---|---|
| AI Tutor implementation | IMP-Q-007 (Anthropic model verification) must be completed first; AI provider code must not be written with assumed model IDs |
| Feedback Collection | Depends on AI Tutor (ai_response_id from S1-AI-011) being in place first |
| Progress Tracking | Depends on Content Metadata (S1-CONTENT tasks) and Auth being complete and tested |
| Dashboard | Depends on Progress Tracking and Auth |
| Full Lesson Experience | Depends on Content Metadata, Auth, and Progress Tracking |
| Full Learning Center (with completion status) | Lesson list shell depends on content foundation; completion status depends on Progress Tracking |
| Waitlist form backend (S1-LAND-003) | Implementation mechanism is decided but the form backend implementation is in the next batch |
| Billing or subscription features | Out of MVP scope |
| Enterprise or team features | Out of MVP scope |
| Real IBM i connectivity | Explicitly prohibited in MVP |
| Community features | Out of MVP scope |

---

## 3. Execution Order

Execute tasks in this batch in the following sequence. Some tasks within a stage can proceed in parallel once their prerequisites are met.

| Step | Task(s) | Notes |
|---|---|---|
| 1 | S1-FND-001 | Initialize the project scaffold first; all other tasks depend on it |
| 2 | S1-FND-002 | Add component library; runs immediately after S1-FND-001 |
| 3 | S1-FND-003 | Create Supabase project; can run in parallel with S1-FND-002 |
| 4 | S1-FND-004 | Configure Vercel; connect GitHub; confirm deployment works |
| 5 | S1-FND-005 | Set up environment variables after Supabase (S1-FND-003) and Vercel (S1-FND-004) are ready |
| 6 | S1-FND-006 | Define directory structure; runs after S1-FND-001 |
| 7 | S1-AUTH-001 through S1-AUTH-004 | Begin auth integration after S1-FND-003 and S1-FND-005 are complete |
| 8 | S1-AUTH-005 | Protected route middleware requires working session (S1-AUTH-004) |
| 9 | S1-AUTH-006 | Forgot password flow requires auth base to be working |
| 10 | S1-AUTH-007; S1-AUTH-008; S1-AUTH-009 | Onboarding, redirect, and user profile after core auth is working |
| 11 | S1-GOV-001 | Checklist template can be created any time after S1-FND-006 |
| 12 | S1-CONTENT-001 | Design metadata record after Supabase is ready (S1-FND-003) |
| 13 | S1-CONTENT-002 | Seed initial metadata after S1-CONTENT-001 |
| 14 | S1-CONTENT-003 | Implement Markdown loading after S1-FND-006 and S1-CONTENT-001 |
| 15 | S1-CONTENT-004; S1-CONTENT-005 | Published-only filter and route protection after metadata is seeded |
| 16 | S1-CONTENT-006 | Create lesson content directory and placeholder files after S1-FND-006 |
| 17 | S1-LAND-001 | Landing page shell after project and Vercel are working (S1-FND-004) |
| 18 | S1-LAND-002 | Hero section with approved copy after S1-LAND-001 |

---

## 4. Acceptance Checklist

All items in this checklist must be verified before this batch is considered complete and the next batch begins.

### Foundation

- [ ] Next.js project runs locally with no build errors
- [ ] TypeScript strict mode is enabled
- [ ] Tailwind CSS is installed and rendering styles correctly
- [ ] Component library is installed and a sample component renders
- [ ] Supabase project exists and the database is accessible from the development environment
- [ ] Vercel deployment is connected to GitHub; a push to the main branch deploys successfully
- [ ] A pull request creates a Vercel preview deployment
- [ ] Environment variables are documented; no secrets are committed to the repository
- [ ] Repository directory structure exists with named directories matching the approved layout

### Authentication

- [ ] A new user can sign up with an email address and password
- [ ] Sign-up errors are displayed inline (email already registered, weak password)
- [ ] A registered user can log in with correct credentials
- [ ] Incorrect credentials display a non-specific error message
- [ ] An authenticated user can log out; session is cleared; user is redirected
- [ ] An authenticated user who refreshes the page remains logged in
- [ ] The Supabase session is readable in a Next.js server component (not only client-side)
- [ ] Accessing `/dashboard` as an unauthenticated user redirects to login
- [ ] The forgot password email is delivered and the reset flow works end-to-end
- [ ] New user sees the onboarding question once after sign-up
- [ ] Onboarding answer is stored in the user profile record
- [ ] Returning user who has answered onboarding does not see it again
- [ ] Post-login redirect sends user to the original protected page, or to the dashboard if logged in directly

### Content Governance

- [ ] `docs/content/lesson-review-checklist.md` exists and contains all required checks from Spec 009 Section 12

### Content Metadata and Markdown Loading

- [ ] Lesson metadata records exist in Supabase for all 12 IBM i Fundamentals lessons
- [ ] All 12 records have status = Draft
- [ ] Lesson slugs match the approved format (lowercase kebab-case, e.g., `what-is-ibm-i`)
- [ ] A query filtered by status = Published returns no results (all lessons are Draft at this point)
- [ ] The content loading function reads and returns Markdown content given a valid slug
- [ ] Requesting a non-Published lesson slug at a route returns 404 (not the lesson content)
- [ ] Lesson content directory exists with 12 named placeholder Markdown files

### Public Landing Page Shell

- [ ] The landing page is accessible at `/` without login
- [ ] The approved hero headline and subheadline are displayed
- [ ] "Join the Waitlist" appears as the CTA label
- [ ] The CTA label is stored in a configuration constant (not hardcoded in a component)
- [ ] The page deploys to Vercel successfully as a statically generated page
- [ ] No database calls are required to render the landing page

---

## 5. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Supabase Auth + Next.js App Router integration issues — middleware session detection may not work as expected with server components | Medium | High | Test S1-AUTH-004 (server-side session detection) thoroughly before building any auth-gated feature; this is the critical prerequisite for Dashboard, Progress, AI Tutor, and Feedback |
| Environment variable mistakes — a secret key committed to the repository or incorrect variable name breaking a service connection | Medium | High | Review all environment variable setup in S1-FND-005 before pushing to the repository; use `.gitignore` to exclude `.env.local`; test all connections in development before pushing |
| Supabase service role key exposure — the service role key bypasses RLS and must never appear in client-side code | Low | High | During S1-FND-005 setup, document clearly which Supabase key is used where; the service role key must only appear in server-side code; the anon key is used client-side |
| Metadata sync confusion — developers updating lesson status directly in the database instead of through the metadata config file | Medium | Medium | Establish the metadata config file + seed/sync script workflow (IMP-Q-003 resolved) before S1-CONTENT-002; communicate that the config file is the source of truth for status changes |
| Starting feature UI before foundations are stable — building lesson pages or the dashboard before auth and content loading are working and tested | Medium | Medium | Follow the execution order in Section 3; do not begin Learning Center or Lesson Experience tasks until S1-AUTH and S1-CONTENT tasks are verified complete |

---

## 6. Notes for Coding

The following constraints apply to all work in this batch.

- **Code may begin only for the tasks listed in Section 1 of this document.** No task outside this batch should be implemented without a new approved coding batch document or explicit Product Owner approval.
- **No AI provider code should be written.** IMP-Q-007 (Anthropic model verification) is not yet resolved. No Anthropic SDK, API key usage, or AI provider configuration should appear in any code written in this batch. The AI provider abstraction layer (S1-AI-002) is not part of this batch.
- **No task outside this batch should be implemented without Product Owner approval.** If a developer starts implementing a Progress Tracking, Dashboard, AI Tutor, or Feedback feature during this batch, that work is out of scope and must stop.
- **Any blocker should be documented before expanding scope.** If a task in this batch cannot proceed due to a technical issue, document the blocker clearly. Do not resolve a blocker by implementing a feature from a future batch.
- **The Supabase service role key must never appear in client-side code.** This rule applies from the first line of code in S1-FND-005.
- **Auth middleware must be implemented server-side.** Client-side protection alone is insufficient for any access control rule in the approved specs.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial first coding batch document created from approved implementation decisions and task breakdown |
