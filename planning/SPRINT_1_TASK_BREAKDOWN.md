# Sprint 1 Task Breakdown

## Document Metadata

| Field | Value |
|---|---|
| Title | Sprint 1 Task Breakdown |
| Status | Approved |
| Version | 1.0 |
| Last Updated | 2026-07-01 |
| Owner | Product + Engineering |
| Source | planning/SPRINT_1_IMPLEMENTATION_PLAN.md v1.0 |

---

## 1. Task Breakdown Principles

The following principles govern all tasks in this breakdown.

- **Tasks must map to approved specs.** Every task traces back to an approved SDD spec, an approved ADR, or the Sprint 1 Implementation Plan. No task may introduce features, behavior, or data handling outside the approved MVP scope.
- **No task may expand MVP scope.** If a task would add capability not defined in an approved spec, it must not be created. Scope additions require Product Owner approval and a PRD update.
- **Tasks should be small enough for implementation tracking.** A task that would take more than a few days should be split into subtasks when tickets are created.
- **Security and access control tasks must not be deferred.** Auth gating, published-only lesson enforcement, and user data isolation must be implemented in the same stage as the feature they protect — not as a follow-up.
- **Content production runs in parallel with engineering.** Lesson authoring, review, approval, and publication must begin at the same time as engineering Stage 3, not after the product is built.
- **Beta readiness requires both working product and minimum 8 published lessons.** Neither alone is sufficient to launch beta.

---

## 2. Task Groups

### Task Group: Foundation and Environment (S1-FND)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-FND-001 | Initialize Next.js + TypeScript project | Confirm the existing Next.js 14 + TypeScript scaffold is clean and ready for Sprint 1 development; add Tailwind CSS | ADR-001 | — | Tailwind installed; TypeScript strict mode enabled; project builds without errors |
| S1-FND-002 | Add component library | Add shadcn/ui or equivalent lightweight component library | ADR-001 | S1-FND-001 | At least one component renders in the project |
| S1-FND-003 | Create Supabase project | Create the Supabase project; configure PostgreSQL database; obtain API keys and connection string | ADR-003; ADR-004 | — | Supabase project exists; connection string available for development environment |
| S1-FND-004 | Configure Vercel deployment | Connect GitHub repository to Vercel; confirm main branch deployment and PR preview deployments are working | ADR-002 | S1-FND-001 | Next.js builds and deploys successfully to Vercel; preview URL generated for a test PR |
| S1-FND-005 | Configure environment variable management | Set up local `.env.local` for development and Vercel project-level environment variables for deployment; document required variables | ADR-002; ADR-003; ADR-004; ADR-005 | S1-FND-003; S1-FND-004 | Required variables (Supabase URL, Supabase anon key, Supabase service role key, AI provider API key) are documented and accessible; no secrets committed to the repository |
| S1-FND-006 | Define repository directory structure | Establish the top-level directory layout for `app/`, `components/`, `lib/`, `services/`, `content/lessons/`, and `docs/content/` | ADR-001; Spec 009 | S1-FND-001 | Directory structure exists; a brief README or comment in each directory explains its purpose |

---

### Task Group: Authentication and Onboarding (S1-AUTH)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-AUTH-001 | Integrate Supabase Auth email/password sign-up | Implement the sign-up form and Supabase Auth call; handle success and error states | Spec 004 ACCOUNT-FR-001 | S1-FND-003; S1-FND-005 | A new user can sign up with email and password; errors (duplicate email, weak password) are shown inline |
| S1-AUTH-002 | Implement email/password login | Implement the login form and Supabase Auth call | Spec 004 ACCOUNT-FR-002 | S1-AUTH-001 | A registered user can log in; wrong credentials show a non-specific error message |
| S1-AUTH-003 | Implement logout | Implement logout action and post-logout redirect | Spec 004 ACCOUNT-FR-003 | S1-AUTH-002 | Authenticated user can log out; session is cleared; user is redirected to the landing page or login |
| S1-AUTH-004 | Implement session persistence | Confirm Supabase Auth session is readable in Next.js server components and API routes across page refreshes | Spec 004 ACCOUNT-FR-004 | S1-AUTH-002 | A logged-in user who refreshes the page remains authenticated; session is available server-side |
| S1-AUTH-005 | Implement protected route middleware | Add Next.js middleware that enforces authentication for Dashboard, AI Tutor, progress write actions, and feedback submission | Spec 004 ACCOUNT-FR-005 | S1-AUTH-004 | Unauthenticated access to `/dashboard`, `/ai-tutor` redirects to login; public routes are unaffected |
| S1-AUTH-006 | Implement forgot password flow | Add "Forgot password?" link on login screen; implement email reset request using Supabase Auth; show non-specific confirmation message | Spec 004 ACCOUNT-FR-018 | S1-AUTH-002 | User can request a password reset email; email is delivered; reset flow works end-to-end |
| S1-AUTH-007 | Implement onboarding question screen | After successful sign-up, show the single onboarding question before the dashboard; store the answer in the user profile | Spec 004 ACCOUNT-FR-011; ACCOUNT-FR-012 | S1-AUTH-001; S1-FND-003 | New user sees the question once; answer (or skip) is stored in the user profile record; returning users do not see it again |
| S1-AUTH-008 | Implement post-login and post-signup redirect | After login, redirect to the originally requested page or dashboard; after sign-up, redirect to onboarding then original page or dashboard | Spec 004 ACCOUNT-FR-015 | S1-AUTH-002; S1-AUTH-007 | Protected lesson → login → correct lesson. Direct login → dashboard. Sign-up → onboarding → correct destination |
| S1-AUTH-009 | Create basic user profile record | After sign-up, create a user profile record in Supabase PostgreSQL (user ID, onboarding response, created timestamp) | Spec 004 ACCOUNT-FR-016 | S1-AUTH-001; S1-FND-003 | User profile record exists after sign-up; onboarding response is updated after S1-AUTH-007 |

---

### Task Group: Content Metadata and Markdown Loading (S1-CONTENT)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-CONTENT-001 | Design lesson metadata record | Define the lesson metadata record shape for Supabase PostgreSQL (lesson ID, slug, title, description, order, learning path ID, status, content source path, estimated reading time, AI Tutor starter question, dates) | Spec 009; ADR-003; IMP-Q-003 | S1-FND-003 | Metadata record shape documented in implementation notes; IMP-Q-003 resolved |
| S1-CONTENT-002 | Seed initial lesson metadata | Seed the approved IBM i Fundamentals lesson sequence (12 lessons, status = Draft initially) into the lesson metadata store | Spec 009 Section 5 | S1-CONTENT-001 | All 12 lesson metadata records exist in the database; records reflect the approved title and slug for each lesson |
| S1-CONTENT-003 | Implement lesson Markdown file loading | Implement content loading that reads a lesson's Markdown file from the repository content directory using the content source path in metadata | Spec 009 CONTENT-FR-001; Spec 003 LESSON-FR-004 | S1-CONTENT-001; S1-FND-006 | Given a lesson slug, the content loading function reads and returns the Markdown content from the corresponding file |
| S1-CONTENT-004 | Implement published-only lesson filter | Implement the server-side filter that returns only lessons with status = Published for public-facing lesson list and page routes | Spec 009 CONTENT-FR-004; Spec 002 LEARNING-FR-013 | S1-CONTENT-001 | Query for lessons returns only Published records; Draft, Review Ready, Approved, and Unpublished records are excluded |
| S1-CONTENT-005 | Implement non-published lesson route protection | Lesson page routes for non-Published lessons must return a 404; protection must be server-side | Spec 009 CONTENT-FR-005; Spec 003 LESSON-FR-005 | S1-CONTENT-004 | Navigating to a non-Published lesson slug returns 404; no lesson content or draft content is served |
| S1-CONTENT-006 | Create lesson content directory structure | Create `content/lessons/` directory structure in the repository with placeholder files for each of the 12 lessons | Spec 009 CONTENT-GOV | S1-FND-006 | Directory structure exists; 12 named Markdown files are in place as placeholders |

---

### Task Group: Public Landing Experience (S1-LAND)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-LAND-001 | Implement landing page shell | Create statically generated landing page at `/` with header, navigation, hero section placeholder, and footer | Spec 008; ADR-001 | S1-FND-001; S1-FND-004 | Page renders; Vercel deploys it; no database calls on page load |
| S1-LAND-002 | Implement hero section with approved copy | Add the approved hero headline, subheadline, and "Join the Waitlist" primary CTA to the hero section | Spec 008 LANDING-FR-002; LANDING-FR-009 | S1-LAND-001 | Hero displays the exact approved headline and subheadline; CTA label is "Join the Waitlist"; CTA label is stored in a configuration constant |
| S1-LAND-003 | Implement waitlist / access-request CTA mechanism | Implement the mechanism behind the "Join the Waitlist" CTA (resolve IMP-Q-004 and IMP-Q-008 first) | Spec 008 LANDING-FR-009; IMP-Q-004; IMP-Q-008 | S1-LAND-002 | Clicking the CTA collects waitlist interest or routes to the access-request flow; submissions are stored appropriately |
| S1-LAND-004 | Implement secondary CTAs | Add "Preview the first lesson" link to `/learn/ibm-i-fundamentals/what-is-ibm-i` and "Browse the Learning Center" link to `/learn/ibm-i-fundamentals` | Spec 008 LANDING-FR-006; LANDING-FR-007 | S1-LAND-001; S1-LESSON-001 | Both links navigate to correct destinations and are functional |
| S1-LAND-005 | Implement feature overview section | Add a section describing IBM i Fundamentals, AI Tutor, and progress tracking; use only approved MVP scope language | Spec 008 LANDING-FR-005 | S1-LAND-001 | Content describes only MVP features; no future features are presented as available |
| S1-LAND-006 | Implement audience section | Add a section identifying who the product is for: IBM i beginners and working IBM i developers | Spec 008 LANDING-FR-004 | S1-LAND-001 | Section is present and accurate |
| S1-LAND-007 | Implement trust and privacy section | Add the approved trust/privacy message to the landing page in a visible location | Spec 008 LANDING-FR-011 | S1-LAND-001 | The approved trust message appears on the page; it is visible without needing to scroll to the bottom |
| S1-LAND-008 | Implement login link in navigation | Add a login link to the navigation header | Spec 008 LANDING-FR-010 | S1-LAND-001; S1-AUTH-002 | Login link is visible in the header; navigates to the login page |
| S1-LAND-009 | Implement responsive layout | Ensure the landing page is usable on common mobile and desktop screen sizes | Spec 008 LANDING-FR-013 | S1-LAND-002 through S1-LAND-007 | Page is readable on mobile; no horizontal scrolling; CTAs are touch-friendly |
| S1-LAND-010 | Add SEO metadata | Add page title and meta description to the landing page | Spec 008 LANDING-FR-014 | S1-LAND-001 | `<title>` and `<meta name="description">` are present and accurate |

---

### Task Group: Learning Center (S1-LEARN)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-LEARN-001 | Implement Learning Center page | Create the `/learn` page showing the IBM i Fundamentals learning path with name, description, and lesson count | Spec 002 LEARNING-FR-001 | S1-CONTENT-004 | `/learn` is publicly accessible; displays IBM i Fundamentals path information |
| S1-LEARN-002 | Implement IBM i Fundamentals path page | Create the `/learn/ibm-i-fundamentals` page showing the ordered published lesson list with titles and descriptions | Spec 002 LEARNING-FR-002; LEARNING-FR-003 | S1-CONTENT-004 | Lesson list shows only Published lessons in the correct sequence; each entry shows title and short description |
| S1-LEARN-003 | Implement lesson completion status display | Add completed/not-started status indicators next to each lesson for authenticated users | Spec 002 LEARNING-FR-003; Spec 006 | S1-LEARN-002; S1-PROG-001 | Authenticated users see completed/not-started state per lesson; unauthenticated users see no status indicators |
| S1-LEARN-004 | Implement "More lessons being added" note | If fewer than 12 lessons are published, show a note below the lesson list | Spec 009 CONTENT-FR-004; Spec 002 | S1-LEARN-002 | Note appears when fewer than 12 lessons are published; disappears when all 12 are published |
| S1-LEARN-005 | Implement unauthenticated Learning Center view | Ensure lesson list is visible to unauthenticated users but without completion status | Spec 002 LEARNING-FR-001 | S1-LEARN-002 | Unauthenticated users can view the lesson list; no completion indicators are shown |

---

### Task Group: Lesson Experience (S1-LESSON)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-LESSON-001 | Implement lesson page route | Create the lesson page route at `/learn/ibm-i-fundamentals/[slug]` using the approved slug format | Spec 003 LESSON-FR-001; Spec 009 CONTENT-FR-009 | S1-CONTENT-003; S1-CONTENT-005 | Route resolves to the correct lesson for a valid published slug; non-Published slugs return 404 |
| S1-LESSON-002 | Implement Markdown rendering | Render lesson Markdown body content using the selected Markdown library (resolve IMP-Q-001 first) | Spec 003 LESSON-FR-004; Section 9 | S1-LESSON-001; IMP-Q-001 | Headings, paragraphs, bullet lists, numbered lists, code blocks, inline code, and links all render correctly |
| S1-LESSON-003 | Implement SSG/SSR for lesson pages | Implement the chosen rendering approach (resolve IMP-Q-002 first) with auth-aware content delivery for Lesson 1 vs. protected lessons | Spec 003 OQ-LE-002; IMP-Q-002 | S1-LESSON-001 | Lesson 1 is publicly accessible; protected lessons require auth |
| S1-LESSON-004 | Implement lesson access rules | Lesson 1 is fully accessible without login; all other Published lessons require authentication; unauthenticated users see a login/sign-up prompt | Spec 003 LESSON-FR-002; Spec 004 ACCOUNT-FR-007 | S1-LESSON-003; S1-AUTH-005 | Unauthenticated user can read Lesson 1; attempting Lesson 2+ redirects to login prompt; access is enforced server-side |
| S1-LESSON-005 | Implement lesson metadata display | Display lesson title, estimated reading time (if present), and position in sequence | Spec 003 LESSON-FR-003 | S1-LESSON-001 | Title is displayed; estimated reading time appears when metadata provides it; position (e.g., "Lesson 4 of 8") is shown |
| S1-LESSON-006 | Implement next/previous lesson navigation | Add next and previous lesson navigation controls at the bottom of each lesson page | Spec 003 LESSON-FR-006 | S1-LESSON-001 | Next and previous controls navigate to the correct adjacent lesson; first lesson has no previous control; last lesson's next control leads to an appropriate end-of-path action |
| S1-LESSON-007 | Implement Mark Complete button | Add the Mark Complete button for authenticated users; call the Progress Tracking write action | Spec 003 LESSON-FR-007; Spec 006 PROGRESS-FR-002 | S1-LESSON-004; S1-PROG-002 | Mark Complete button appears for authenticated users; clicking it records the completion; button transitions to read-only completed state |
| S1-LESSON-008 | Implement completed state display | Display a read-only completed state when a lesson has been previously completed by the current user | Spec 003 LESSON-FR-008; Spec 006 PROGRESS-FR-004 | S1-LESSON-007; S1-PROG-001 | A previously completed lesson shows a read-only completed indicator; no unmark/toggle option |
| S1-LESSON-009 | Implement AI Tutor link on lesson pages | Add a visible link to `/ai-tutor` on each lesson page with optional starter question | Spec 003 LESSON-FR-011; LESSON-FR-012 | S1-LESSON-001; S1-AI-004 | AI Tutor link is visible on all published lesson pages; starter question appears if present in lesson metadata |
| S1-LESSON-010 | Implement Lesson 1 sign-up CTA | At the end of Lesson 1 for unauthenticated users, show a clear call-to-action to create an account | Spec 003 LESSON-FR-010 | S1-LESSON-004; S1-AUTH-001 | Unauthenticated users reaching the end of Lesson 1 see a sign-up CTA |
| S1-LESSON-011 | Implement lesson error state | Display a user-friendly error if a lesson content file fails to load | Spec 003 LESSON-FR-013 | S1-LESSON-002 | A graceful error message appears if content loading fails; a link back to the Learning Center is provided |

---

### Task Group: Progress Tracking (S1-PROG)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-PROG-001 | Implement progress record read | Implement the query that reads completion records for the authenticated user; returns completed/not-completed state per lesson | Spec 006 PROGRESS-FR-004 | S1-AUTH-004; S1-CONTENT-001 | Given an authenticated user, the query returns correct completion state for each lesson |
| S1-PROG-002 | Implement Mark Complete write (idempotent) | Implement the Mark Complete write using the idempotent insert-if-missing approach with a uniqueness rule on user ID + lesson ID | Spec 006 PROGRESS-FR-002; PROGRESS-FR-003 | S1-PROG-001 | First Mark Complete creates a record; subsequent calls for the same user/lesson do not create duplicates; uniqueness is enforced at the data layer |
| S1-PROG-003 | Implement user data isolation | Enforce that all progress queries are scoped to the authenticated user ID; implement RLS or server-side filtering per IMP-Q-005 | Spec 006 PROGRESS-FR-014 | S1-PROG-001; IMP-Q-005 | A user cannot read or write another user's progress records; isolation is enforced at the database level |
| S1-PROG-004 | Implement progress count calculation | Calculate the count of Published lessons completed by the current user (not hardcoded; uses live published lesson count as denominator) | Spec 006 PROGRESS-FR-007; PROGRESS-FR-008 | S1-PROG-001; S1-CONTENT-004 | Progress count is correct; denominator reflects currently published lesson count; the value updates live, not from cache |
| S1-PROG-005 | Implement next uncompleted lesson calculation | Calculate the first Published lesson in sequence that the current user has not completed | Spec 006 PROGRESS-FR-009 | S1-PROG-001; S1-CONTENT-004 | Next lesson is correct for a user at any stage of completion; path-complete state is returned when all published lessons are done |
| S1-PROG-006 | Implement Mark Complete error handling | If the Mark Complete write fails, show a non-disruptive retryable error message | Spec 006 PROGRESS-FR-013 | S1-PROG-002 | On write failure, user sees a friendly error and can retry; the AI Tutor conversation and lesson content are unaffected |

---

### Task Group: Dashboard (S1-DASH)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-DASH-001 | Implement Dashboard page with auth gate | Create `/dashboard` as an authenticated-only page; redirect unauthenticated users to login | Spec 005 DASH-FR-001 | S1-AUTH-005 | Unauthenticated users accessing `/dashboard` are redirected to login |
| S1-DASH-002 | Implement welcome message | Display the approved generic welcome message based on user's progress state (new user / returning / path-complete) | Spec 005 DASH-FR-003 | S1-DASH-001 | Correct approved copy is shown for each state; no email address or display name is shown |
| S1-DASH-003 | Implement Continue Learning card | Display the next uncompleted lesson title and a direct link to it; show path-complete message if all published lessons are done | Spec 005 DASH-FR-004; DASH-FR-007 | S1-PROG-005; S1-DASH-001 | The continue learning card shows the correct next lesson; path-complete users see the appropriate message |
| S1-DASH-004 | Implement Start Learning empty state | For users with zero completed lessons, show the Start Learning state with onboarding-aware copy | Spec 005 DASH-FR-005; DASH-FR-010 | S1-DASH-001; S1-AUTH-009 | New users with zero completions see the Start Learning state; copy matches the user's onboarding response |
| S1-DASH-005 | Implement progress summary | Display "X of Y lessons completed" using the live published lesson count as denominator | Spec 005 DASH-FR-006; Spec 006 PROGRESS-FR-007; PROGRESS-FR-008 | S1-PROG-004; S1-DASH-001 | Progress count is correct; denominator is the published lesson count, not hardcoded |
| S1-DASH-006 | Implement quick links | Add AI Tutor and Learning Center quick-action links on the Dashboard | Spec 005 DASH-FR-008; DASH-FR-009 | S1-DASH-001 | Both links are visible and navigate to `/ai-tutor` and `/learn/ibm-i-fundamentals` respectively |
| S1-DASH-007 | Implement Dashboard loading and error states | Show a loading state while progress data is fetched; show a graceful error state if data fails to load (quick links must remain visible) | Spec 005 DASH-FR-013 | S1-DASH-003; S1-DASH-005 | Loading indicator appears during data fetch; error state shows a friendly message with quick links still visible |

---

### Task Group: AI Tutor (S1-AI)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-AI-001 | Verify and configure AI provider | Verify exact Anthropic model IDs, pricing, rate limits, and fallback settings against official documentation (per ADR-005 and IMP-Q-007); configure API key in environment | ADR-005; IMP-Q-007 | S1-FND-005 | IMP-Q-007 resolved; model ID, pricing, and rate limits confirmed; API key is set in environment variables |
| S1-AI-002 | Implement AI provider abstraction layer | Create a dedicated AI service module that encapsulates all Anthropic SDK calls; no other file in the codebase imports the SDK directly | Spec 001 AI-TUTOR-FR-013; ADR-005 | S1-AI-001 | A single AI service module handles all AI API calls; switching the model ID requires a change only in this module |
| S1-AI-003 | Implement system prompt | Implement the IBM i-focused system prompt: domain context, safety boundaries, beginner-friendly behavior, production-use caution, sensitive data guidance | Spec 001 AI Strategy Section 15 | S1-AI-002 | System prompt is in place; AI responses are IBM i-focused; trust and safety messaging is present in responses |
| S1-AI-004 | Implement AI Tutor page with auth gate | Create the `/ai-tutor` page as an authenticated-only page; redirect unauthenticated users to login or show a login/sign-up prompt | Spec 001 AI-TUTOR-FR-001 | S1-AUTH-005; S1-AI-002 | Unauthenticated users cannot access the AI Tutor; authenticated users see the AI Tutor interface |
| S1-AI-005 | Implement streaming response delivery | Implement streaming AI responses so content appears progressively as it is generated | Spec 001 AI-TUTOR-FR-003 | S1-AI-004 | AI responses stream progressively in the UI; users see content appearing during generation |
| S1-AI-006 | Implement session-level conversation history | Pass prior messages from the current session as context to each AI request; do not persist conversation server-side | Spec 001 AI-TUTOR-FR-010; D-AI-004 resolved | S1-AI-005 | Follow-up questions are answered with session context; no AI conversation content is stored in the database |
| S1-AI-007 | Implement AI Tutor privacy/trust notice | Display the approved privacy/trust notice near the AI Tutor input area | Spec 001 AI Tutor UX Requirements | S1-AI-004 | Privacy notice is visible near the input area before the user submits a question |
| S1-AI-008 | Implement empty state with starter prompts | When the AI Tutor conversation is empty, display the four approved starter prompts | Spec 001 UX Empty State | S1-AI-004 | Four starter prompts appear when the conversation is empty; clicking one populates the input area |
| S1-AI-009 | Implement token usage logging | Log input and output token counts per AI request without storing conversation content (resolve IMP-Q-006 first) | Spec 001 AI-TUTOR-FR-014; IMP-Q-006 | S1-AI-002; IMP-Q-006 | Token counts are logged per request; no prompt text or response text is stored in the log |
| S1-AI-010 | Implement AI Tutor error handling | Handle AI provider failures, rate limits, and timeouts with user-friendly error messages and retry options | Spec 001 AI-TUTOR-FR-015 | S1-AI-005 | Provider errors show a user-friendly message; rate limit responses show a temporary availability message; conversation remains usable |
| S1-AI-011 | Generate ai_response_id per completed AI response | Generate a server-side ai_response_id for each completed AI Tutor response and return it to the client so Feedback Collection can reference the response without storing full conversation content | Spec 007 FEEDBACK-FR-008; Spec 001 AI Tutor | S1-AI-005 | Each completed AI Tutor response has a server-generated ai_response_id; the ID is available to the feedback control; full prompt and response text are not stored as part of feedback |

---

### Task Group: Feedback Collection (S1-FB)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-FB-001 | Confirm ai_response_id is available for feedback | Confirm that S1-AI-011 has been completed and that the server-generated `ai_response_id` is returned to the client and available to the feedback control | Spec 007 FEEDBACK-FR-008; Spec 001 | S1-AI-011 | Each completed AI response has a unique `ai_response_id` available to the feedback control; this task confirms the handoff between the AI Tutor and Feedback workstreams |
| S1-FB-002 | Implement helpful / not helpful feedback controls | Add Helpful and Not helpful controls below each completed AI Tutor response | Spec 007 FEEDBACK-FR-001 | S1-AI-005; S1-FB-001 | Controls appear after each completed response; they do not appear during streaming |
| S1-FB-003 | Implement AI response feedback submission | On control click, submit feedback (user ID, feedback type, feedback value, source surface, ai_response_id, timestamp) to the database using replace-with-latest logic | Spec 007 FEEDBACK-FR-003; FEEDBACK-FR-004; FEEDBACK-FR-010 | S1-FB-002 | Feedback is stored; no full AI conversation content is stored; changing from helpful to not helpful updates the existing record |
| S1-FB-004 | Implement feedback submission state | After submission, update the feedback controls to show the selected state | Spec 007 FEEDBACK-FR-011 | S1-FB-003 | Controls show which option is currently selected; changing selection updates the visual state |
| S1-FB-005 | Implement feedback error handling | If feedback submission fails, show a non-disruptive retryable error near the controls | Spec 007 FEEDBACK-FR-012 | S1-FB-003 | Friendly error message appears on write failure; AI Tutor conversation is unaffected; user can retry |
| S1-FB-006 | Implement general beta feedback form | Add a lightweight authenticated feedback form accessible from navigation or footer for general beta feedback (short free-text message) | Spec 007 FEEDBACK-FR-015 | S1-AUTH-004 | Authenticated users can submit a general text message; submission stores user ID, timestamp, feedback type ("general_beta"), and message |
| S1-FB-007 | Implement feedback user data isolation | Ensure feedback records are scoped to the authenticated user; no user can read another user's feedback | Spec 007 Access Rules; IMP-Q-005 | S1-FB-003 | Feedback queries are scoped to the authenticated user ID; no cross-user data access |

---

### Task Group: Content Governance (S1-GOV)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-GOV-001 | Create lesson review checklist template | Create `docs/content/lesson-review-checklist.md` based on Spec 009 Section 12 | Spec 009 CONTENT-FR-006; OQ-CONTENT-002 resolved | S1-FND-006 | Checklist template exists at `docs/content/lesson-review-checklist.md`; all Section 12 required checks are included |
| S1-GOV-002 | Draft Lesson 1 — What is IBM i? | Author the first lesson following the approved lesson template; include all required sections | Spec 009 Section 6; CONTENT-FR-006 | S1-GOV-001; S1-CONTENT-006 | Lesson 1 draft is complete in the content directory; follows the template; includes all required sections |
| S1-GOV-003 | Review and approve Lesson 1 | Product Owner / Founder reviews Lesson 1 against the content quality checklist; marks it Approved | Spec 009 CONTENT-FR-006; CONTENT-FR-014 | S1-GOV-002 | Checklist is completed; lesson status is updated to Approved |
| S1-GOV-004 | Publish Lesson 1 | Product Owner / Founder updates lesson status to Published; verifies it appears in the Learning Center and is publicly accessible | Spec 009 CONTENT-FR-003; CONTENT-FR-004 | S1-GOV-003; S1-LEARN-002; S1-LESSON-001 | Lesson 1 appears in the Learning Center; it is publicly accessible without login; it is the only lesson accessible without login |
| S1-GOV-005 | Draft, review, and publish Lessons 2–8 | Repeat the draft → review → approve → publish process for Lessons 2 through 8 following the same template and checklist | Spec 009 CONTENT-FR-007 | S1-GOV-001; S1-GOV-004 | Lessons 2–8 are published before beta launch; each has passed the content quality checklist; slugs match the approved format |
| S1-GOV-006 | Verify no draft content is exposed | Confirm that lessons in Draft, Review Ready, and Approved (not Published) status are not accessible at any route | Spec 009 CONTENT-FR-005; Spec 003 LESSON-FR-014 | S1-CONTENT-005; S1-GOV-004 | Attempting to access a non-Published lesson slug returns 404; non-Published lessons are not listed in the Learning Center |
| S1-GOV-007 | Verify lesson slug stability | Confirm all published lesson slugs match the approved format and are stable | Spec 009 CONTENT-FR-009; Spec 003 OQ-LE-005 resolved | S1-GOV-004 | Each published lesson slug is lowercase kebab-case; no slug has changed after publication |

---

### Task Group: QA and Beta Readiness (S1-QA)

| Task ID | Title | Description | Source | Depends On | Acceptance Notes |
|---|---|---|---|---|---|
| S1-QA-001 | Test new user flow end-to-end | Landing → first lesson preview → sign-up → onboarding → dashboard → continue learning | Spec 004; 005; 003; 008 | All S1-AUTH; S1-LAND; S1-LEARN; S1-LESSON; S1-DASH | Full flow completes without errors |
| S1-QA-002 | Test returning user flow end-to-end | Login → dashboard → continue learning → mark lesson complete → see updated progress | Spec 003; 005; 006 | All S1-AUTH; S1-PROG; S1-DASH | Progress updates correctly; dashboard reflects completed lessons |
| S1-QA-003 | Test all authentication gates | Dashboard, AI Tutor, Lessons 2+, Mark Complete, Feedback submission all require auth | All specs | All S1-AUTH; feature tasks | All protected routes redirect or show login prompt for unauthenticated users |
| S1-QA-004 | Test lesson access and visibility | Lesson 1 is public; Lessons 2+ require login; no non-Published lesson is accessible; draft lessons return 404 | Spec 002; 003; 009 | S1-GOV-006; S1-LESSON-004 | All access rules verified; no draft content exposed |
| S1-QA-005 | Test AI Tutor flow | Ask IBM i questions; verify IBM i-focused responses; verify streaming; verify trust messaging; verify privacy notice | Spec 001 | All S1-AI | AI Tutor responds with IBM i context; trust notice is visible; streaming works |
| S1-QA-006 | Test feedback flow | Helpful / Not helpful on AI responses; general beta feedback form | Spec 007 | All S1-FB | Feedback is stored without full conversation content; replace-with-latest behavior confirmed |
| S1-QA-007 | Test responsive design | Landing page, Learning Center, lesson pages, AI Tutor, Dashboard on mobile | Spec 008; 003; 002 | All UI tasks | All pages are usable on mobile without horizontal scrolling |
| S1-QA-008 | Verify SEO metadata | Landing page and Lesson 1 have correct page title, meta description; Lesson 1 is indexable | Spec 008 LANDING-FR-014; Spec 003 NFR SEO | S1-LAND-010; S1-LESSON-003 | Metadata present and correct; no noindex on landing page or Lesson 1 |
| S1-QA-009 | Complete beta readiness checklist | Product Owner confirms all items in Section 8 of the Sprint 1 Implementation Plan | All | All tasks | All beta readiness checklist items are confirmed before inviting beta users |

---

## 3. Suggested Initial Execution Order

This is a practical sequence for the first weeks of Sprint 1. It accounts for dependencies and the parallel content track.

| Priority | Task Group | First Tasks to Execute |
|---|---|---|
| 1 | Foundation and Environment | S1-FND-001 through S1-FND-006 |
| 2 | Authentication and Onboarding | S1-AUTH-001 through S1-AUTH-009 |
| 3a (Engineering) | Content Metadata and Markdown Loading | S1-CONTENT-001 through S1-CONTENT-006 |
| 3b (Content, parallel) | Content Governance and Lesson Authoring | S1-GOV-001; S1-GOV-002 |
| 4 | Public Landing Experience | S1-LAND-001 through S1-LAND-010 |
| 5 | Learning Center | S1-LEARN-001; S1-LEARN-002; S1-LEARN-004; S1-LEARN-005 |
| 6 | Lesson Experience (without Progress) | S1-LESSON-001 through S1-LESSON-006; S1-LESSON-009 through S1-LESSON-011 |
| 7 | Progress Tracking | S1-PROG-001 through S1-PROG-006 |
| 7b | Complete Lesson Experience + Learning Center Progress | S1-LESSON-007; S1-LESSON-008; S1-LEARN-003 |
| 8 | Dashboard | S1-DASH-001 through S1-DASH-007 |
| 9 | AI Tutor | S1-AI-001 through S1-AI-011 |
| 10 | Feedback Collection | S1-FB-001 through S1-FB-007 |
| 11 | Content: Lessons 3–8 | S1-GOV-005; S1-GOV-003 through S1-GOV-007 |
| 12 | QA and Beta Readiness | S1-QA-001 through S1-QA-009 |

---

## 4. Critical Path

The following dependencies represent the longest or most risk-sensitive paths through Sprint 1.

| Upstream | Downstream | Risk if Delayed |
|---|---|---|
| S1-AUTH (all) | S1-DASH, S1-AI, S1-PROG, S1-FB | Dashboard, AI Tutor, Progress, and Feedback cannot be tested without working auth |
| S1-CONTENT (metadata + loading) | S1-LEARN, S1-LESSON | Learning Center and Lesson Experience depend on published lesson data being queryable |
| S1-PROG | S1-DASH completion state; S1-LESSON Mark Complete | Dashboard continue-learning card and lesson completion state cannot be completed before Progress Tracking |
| S1-AI-011 + S1-FB-001 | S1-FB-002 through S1-FB-005 | Feedback controls require the ai_response_id generated by S1-AI-011 and confirmed available by S1-FB-001 |
| S1-GOV-004 (Lesson 1 published) | S1-QA-004; S1-LAND-004; Landing page first lesson CTA | Landing page first lesson preview link and first lesson public access require Lesson 1 to be published |
| S1-GOV-005 (Lessons 2–8 published) | S1-QA-009 beta readiness | Beta cannot launch until the 8-lesson minimum is confirmed |

---

## 5. Beta Blockers

The following items are hard blockers for beta launch. Beta must not open until all are resolved.

| # | Blocker | Related Task(s) |
|---|---|---|
| 1 | Fewer than 8 lessons reviewed, approved, and published | S1-GOV-002 through S1-GOV-005 |
| 2 | Lesson 1 not publicly accessible | S1-GOV-004; S1-LESSON-004 |
| 3 | Authentication is not working | S1-AUTH-001 through S1-AUTH-009 |
| 4 | AI Tutor is unavailable to authenticated users | S1-AI-004 through S1-AI-007 |
| 5 | Progress is not persisted across sessions | S1-PROG-002; S1-PROG-001 |
| 6 | Dashboard is broken or not loading progress | S1-DASH-003; S1-DASH-005 |
| 7 | Feedback is not stored | S1-FB-003; S1-FB-006 |
| 8 | Draft or non-published lesson content is exposed | S1-CONTENT-005; S1-GOV-006 |
| 9 | Trust and privacy messaging is missing | S1-LAND-007; S1-AI-007 |
| 10 | Any out-of-scope MVP feature has been accidentally built | S1-QA-009 |

---

## 6. Open Implementation Questions

The following questions are carried forward from the Sprint 1 Implementation Plan. They must be resolved before the relevant task group begins.

| ID | Question | Owner | Needed Before |
|---|---|---|---|
| IMP-Q-001 | Which Markdown rendering library should be used for lesson content? (Spec 003 OQ-LE-001) | Engineering | S1-LESSON-002 |
| IMP-Q-002 | Should lesson pages use SSG, SSR, or a hybrid approach? (Spec 003 OQ-LE-002) | Engineering | S1-LESSON-003 |
| IMP-Q-003 | What exact lesson metadata record shape and seeding/sync approach should be used in Supabase PostgreSQL? | Engineering | S1-CONTENT-001 |
| IMP-Q-004 | What is the exact waitlist or access-request mechanism for the "Join the Waitlist" CTA? | Product / Founder | S1-LAND-003 |
| IMP-Q-005 | How should Supabase RLS policies and server-side user filtering be designed for progress and feedback records? | Engineering | S1-PROG-003; S1-FB-007 |
| IMP-Q-006 | What is the token usage logging mechanism? (no conversation content stored) | Engineering | S1-AI-009 |
| IMP-Q-007 | What are the exact current Anthropic model IDs, pricing, rate limits, and fallback settings? (verify per ADR-005) | Engineering | S1-AI-001 |
| IMP-Q-008 | Where should waitlist/access-request submissions be stored? | Product + Engineering | S1-LAND-003 |

---

## 7. Notes for Ticket Creation

This task breakdown is intended as the input for creating implementation tickets or work items in the team's chosen project management tool.

**When creating tickets:**
- Each task in the Task Groups section of this document maps to one or more tickets
- Tickets should inherit the Source spec references from the task breakdown
- Ticket acceptance criteria should be derived from the "Acceptance Notes" column
- Dependency relationships in the "Depends On" column should be tracked as ticket blockers or prerequisites
- IMP-Q items should become separate investigative tasks or spikes before the dependent feature tasks begin
- Content governance tasks (S1-GOV) should be tracked as a separate content workstream alongside the engineering ticket board

**Tickets must not:**
- Add features, behavior, or data handling not defined in the source specs
- Omit security, access control, or user data isolation requirements
- Defer authentication gates to a follow-up ticket — auth must be enforced in the same ticket as the feature it protects

**This document will be updated** if new implementation questions are identified or if the approved specs are revised. Ticket creation may begin after Product Owner and Engineering review of this task breakdown.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial Sprint 1 task breakdown created from SPRINT_1_IMPLEMENTATION_PLAN.md v1.0 |
| 2026-07-01 | 0.2 | Cleanup after review; added ai_response_id task, fixed dependencies, and corrected source references |
| 2026-07-01 | 1.0 | Approved Sprint 1 task breakdown for implementation decision resolution and ticket creation |
