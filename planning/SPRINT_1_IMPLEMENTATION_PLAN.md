# Sprint 1 Implementation Plan

## Document Metadata

| Field | Value |
|---|---|
| Title | Sprint 1 Implementation Plan |
| Status | Draft |
| Version | 0.1 |
| Last Updated | 2026-07-01 |
| Owner | Product + Engineering |

### Source Specs (All Approved)

| Spec | Feature | Version |
|---|---|---|
| Spec 001 | AI Tutor | v1.0 |
| Spec 002 | Learning Center | v1.0 |
| Spec 003 | Lesson Experience | v1.0 |
| Spec 004 | User Account and Onboarding | v1.0 |
| Spec 005 | Dashboard | v1.0 |
| Spec 006 | Progress Tracking | v1.0 |
| Spec 007 | Feedback Collection | v1.0 |
| Spec 008 | Public Landing Experience | v1.0 |
| Spec 009 | Content Governance | v1.0 |

---

## 1. Implementation Principles

The following principles must guide all Sprint 1 implementation decisions. These are not preferences — they are constraints derived from the approved PRD and SDD specs.

| Principle | Constraint |
|---|---|
| SDD specs are source of truth | No implementation decisions may contradict an approved SDD spec. If a conflict is found, raise it with the Product Owner before proceeding. |
| No MVP scope expansion | If a feature is not defined in an approved spec, it must not be built. Scope additions require Product Owner approval and a PRD update. |
| Build critical foundations first | Auth, content loading, and lesson metadata must be in place before features that depend on them can be built. |
| Prefer simple, maintainable implementations | Avoid overengineering before beta validation. Choose the simplest implementation that satisfies the spec requirements. |
| Auth and content rules enforced server-side | Lesson visibility (Published only), AI Tutor access, Dashboard access, and progress tracking must be enforced server-side. Client-side enforcement alone is not sufficient. |
| No production IBM i connectivity | Nothing in Sprint 1 may connect to a real IBM i system, production source file library, or live 5250 session. |
| No billing, enterprise, or community features | These are explicitly out of scope for MVP across all approved specs. |
| AI conversation history is session-only | AI Tutor conversations must not be persisted server-side beyond the current session (Spec 001; D-AI-004 resolved). |
| Single status field for lessons | Lesson visibility is controlled by a single status field (status = Published). No separate published boolean flag (Spec 009 OQ-CONTENT-003 resolved). |

---

## 2. Sprint 1 Implementation Goals

Sprint 1 must produce a fully functional MVP beta candidate. By the end of Sprint 1, the product must support:

| Goal | Description | Source Spec |
|---|---|---|
| Public landing page | Hero, CTAs, trust/privacy message, link to first lesson and Learning Center | Spec 008 |
| Authentication and onboarding | Email/password sign-up, login, logout, session persistence, single onboarding question, forgot password | Spec 004 |
| Learning Center | IBM i Fundamentals lesson list, published-only display, lesson status indicators | Spec 002 |
| Lesson Experience | Lesson page rendering (Markdown), access rules, first lesson public, Mark Complete, next/previous navigation, AI Tutor link | Spec 003 |
| Progress Tracking | Lesson completion records, idempotent Mark Complete, live progress count and next lesson calculation | Spec 006 |
| Dashboard | Authenticated landing page, continue-learning card, progress summary, AI Tutor and Learning Center links | Spec 005 |
| AI Tutor | IBM i-focused Q&A, streaming responses, trust boundaries, feedback control, provider abstraction layer | Spec 001 |
| Feedback Collection | Helpful / Not helpful on AI responses, lightweight general beta feedback form | Spec 007 |
| Content Governance support | Lesson metadata and Markdown content loading, published-only filtering, slug routing, content checklist template | Spec 009 |
| Minimum content readiness | At least 8 lessons reviewed, approved, and published (Lessons 1–8) before beta launch | Spec 009; D-PROD-002 |

---

## 3. Dependency Order

The following recommended build sequence reflects the dependency relationships between specs. Later items depend on earlier items being in place. Parallel workstreams are possible within stages.

| Stage | Focus Area | Key Deliverable |
|---|---|---|
| 1 | Project foundation and environment | Next.js project initialized; Supabase project created; Vercel deployment configured; environment variable management in place |
| 2 | Authentication | Supabase Auth email/password flow working; sign-up, login, logout, session persistence, forgot password; middleware for route protection |
| 3 | Content metadata and Markdown loading | Lesson metadata store designed; lesson Markdown content loading from files; published-only filter working |
| 4 | Public Landing Experience | Landing page with hero, CTAs, trust message, links to lesson preview and Learning Center; statically generated |
| 5 | Learning Center | Lesson list page; published-only lesson display; lesson status indicators for authenticated users |
| 6 | Lesson Experience | Lesson page route; Markdown rendering; access rules; Mark Complete button; next/previous navigation |
| 7 | Progress Tracking | Progress records; Mark Complete write; idempotent behavior; progress count and next lesson calculation |
| 8 | Dashboard | Authenticated home page; continue-learning card using progress data; progress summary; quick links |
| 9 | AI Tutor | Provider abstraction layer; AI Tutor page; streaming IBM i Q&A; session-level conversation history; trust messaging; privacy notice |
| 10 | Feedback Collection | Helpful / Not helpful controls on AI responses; ai_response_id generation; feedback storage; general beta feedback form |
| 11 | Content Governance support | Lesson review checklist template (`docs/content/lesson-review-checklist.md`); lesson content authoring workflow validated; minimum 8 lessons reviewed and published |
| 12 | End-to-end QA and beta readiness | Full user flow testing; access control verification; no draft lesson exposure; beta readiness checklist completion |

---

## 4. Workstreams and High-Level Tasks

### Workstream A: Foundation and Environment

This workstream covers the project scaffolding, environment configuration, and service connections that all other workstreams depend on.

**High-Level Tasks:**
- Confirm Next.js + TypeScript scaffold is ready for Sprint 1 (Spec 001; ADR-001)
- Create Supabase project; configure PostgreSQL database and Supabase Auth (ADR-003; ADR-004)
- Configure Vercel deployment connected to GitHub; confirm preview deployments work (ADR-002)
- Set up environment variable management for Supabase, AI provider API key, and any other secrets
- Configure TypeScript strict mode
- Add Tailwind CSS and a lightweight component library (ADR-001)
- Confirm Next.js App Router is the routing approach
- Define the repository directory structure for lesson content files

---

### Workstream B: Authentication and Onboarding

This workstream covers user identity, session management, route protection, and the post-signup onboarding question. All authenticated features depend on this.

**High-Level Tasks (Spec 004):**
- Integrate Supabase Auth email/password sign-up
- Integrate Supabase Auth email/password login
- Implement logout action
- Implement session persistence (verify Supabase Auth session is readable in Next.js server components and API routes)
- Implement Next.js middleware for protected route enforcement (Dashboard, AI Tutor, progress-writing actions, Feedback submission)
- Implement forgot password flow using Supabase Auth email reset
- Implement onboarding question screen (single question, three options, skippable) shown once after sign-up
- Store onboarding response in user profile record
- Implement post-login and post-signup redirect behavior (return user to originally requested page, or dashboard, per Spec 004 ACCOUNT-FR-015)
- Implement login/sign-up prompts for authenticated-only features on protected lesson pages, AI Tutor, and Dashboard
- Test all auth failure states: wrong password, already-registered email, validation errors

---

### Workstream C: Content and Learning

This workstream covers lesson content loading, metadata, the Learning Center, and the Lesson Experience. It depends on Workstream A for the repository structure and Workstream B for auth-gated lesson access.

**High-Level Tasks — Content Loading Foundation (Spec 009):**
- Design and implement lesson metadata storage (lesson ID, slug, title, description, order, status, content source path, estimated reading time, AI Tutor starter question)
- Implement lesson Markdown file loading from the repository content directory
- Implement published-only filtering: only lessons with status = Published are served to users
- Implement draft/unpublished lesson protection: non-Published lesson routes must return 404 server-side
- Create lesson content directory structure in the repository
- Create lesson review checklist template at `docs/content/lesson-review-checklist.md` based on Spec 009 Section 12

**High-Level Tasks — Learning Center (Spec 002):**
- Implement Learning Center page at `/learn`
- Implement IBM i Fundamentals path page at `/learn/ibm-i-fundamentals`
- Display ordered list of published lessons with titles, descriptions, and order
- Display completion status per lesson for authenticated users (reads from Progress Tracking)
- Show "More lessons are being added" note if fewer than 12 lessons are published
- Implement unauthenticated lesson list view (lesson titles visible, no completion status)

**High-Level Tasks — Lesson Experience (Spec 003):**
- Implement lesson page route at `/learn/ibm-i-fundamentals/[slug]`
- Implement Markdown rendering for lesson body content (select Markdown library; confirm OQ-LE-001)
- Implement static or server-side rendering for lesson pages (resolve OQ-LE-002 before implementation)
- Implement lesson access control: Lesson 1 (slug: `what-is-ibm-i`) is public; all other published lessons require authentication
- Implement login/sign-up prompt for unauthenticated users attempting protected lessons
- Implement lesson metadata display: title, estimated reading time if provided, lesson position
- Implement next and previous lesson navigation
- Implement Mark Complete button for authenticated users (calls Progress Tracking)
- Implement read-only completed state display for already-completed lessons
- Implement AI Tutor link on each lesson page
- Implement optional AI Tutor starter question display near the link
- Implement Lesson 1 sign-up CTA at the end of the first lesson
- Implement 404 handling for non-existent or non-published lesson slugs
- Implement content load failure error state

---

### Workstream D: Progress and Dashboard

This workstream covers lesson progress records, progress calculations, and the authenticated dashboard. It depends on Workstream B for auth and Workstream C for lesson metadata.

**High-Level Tasks — Progress Tracking (Spec 006):**
- Design the progress record data model (user ID, lesson ID, learning path ID, completed timestamp) — record in implementation plan, not in spec
- Implement idempotent Mark Complete write with uniqueness enforcement on user ID + lesson ID
- Implement progress count calculation: count of Published lessons completed by current user
- Implement published lesson denominator: live count of published lessons (not hardcoded)
- Implement next uncompleted lesson calculation: first published lesson by order not yet completed
- Implement completed state read for lesson pages (per-lesson completion check)
- Implement completed state read for Learning Center lesson list (bulk completion status)
- Implement Mark Complete error handling with retryable user-friendly message
- Enforce user data isolation at the database level (row-level security or user ID filtering on all queries)

**High-Level Tasks — Dashboard (Spec 005):**
- Implement Dashboard page at `/dashboard` (authenticated only; redirect to login if unauthenticated)
- Implement welcome message using approved generic copy (Spec 005 DASH-FR-003)
- Implement Continue Learning card showing next uncompleted lesson title and link (from Progress Tracking)
- Implement Start Learning empty state for users with zero completed lessons, using onboarding-aware copy (Spec 005 DASH-FR-005, DASH-FR-010)
- Implement progress summary: "X of Y lessons completed" using live published lesson count as denominator
- Implement AI Tutor quick link to `/ai-tutor`
- Implement Learning Center quick link to `/learn/ibm-i-fundamentals`
- Implement dashboard loading state while progress data is fetched
- Implement dashboard error state if progress data fails to load (quick links must remain visible)

---

### Workstream E: AI Tutor

This workstream covers the AI Tutor feature. It depends on Workstream B for authentication and coordinates with Workstream F on ai_response_id.

**High-Level Tasks (Spec 001):**
- Select and configure AI provider (Anthropic Claude Sonnet 4.6; verify model ID and pricing before implementation — ADR-005)
- Implement provider abstraction layer: all Anthropic SDK calls isolated in a dedicated AI service module; no other file imports the Anthropic SDK directly
- Implement AI Tutor page at `/ai-tutor` (authenticated only; redirect or show login prompt if unauthenticated)
- Implement system prompt establishing IBM i domain context, safety boundaries, beginner-friendly behavior, production-use caution, and sensitive data guidance
- Implement streaming response delivery to the client
- Implement session-level conversation history: pass prior messages in the current session as context; do not persist server-side
- Implement AI Tutor privacy notice near the input area (approved wording: Spec 004 OQ-SEC-003 referenced in Spec 001 FR-009)
- Implement helpful / not helpful feedback controls on each completed AI response (coordinates with Workstream F for ai_response_id)
- Implement token usage logging (input and output token counts per request — Spec 001 LESSON-FR-014 / AI-TUTOR-FR-014)
- Implement error handling for AI provider failures, rate limits
- Implement starter prompt display when conversation is empty (Spec 001 UX — Empty State)

---

### Workstream F: Feedback Collection

This workstream covers AI response feedback and general beta feedback. It depends on Workstream B for auth and coordinates with Workstream E on ai_response_id.

**High-Level Tasks (Spec 007):**
- Coordinate with Workstream E to confirm ai_response_id generation: each completed AI Tutor response must receive a server-generated identifier returned to the client for use in feedback submissions
- Implement helpful / not helpful feedback controls appearing after each completed AI Tutor response
- Implement feedback submission: stores user ID, feedback type ("ai_response"), feedback value, source surface, ai_response_id, and timestamp
- Implement replace-with-latest idempotent behavior: one active feedback value per user per ai_response_id; repeated submissions update the existing record
- Implement feedback submission acknowledgement state
- Implement feedback submission error state with retry
- Implement general beta feedback form (lightweight free-text form accessible from navigation or footer)
- Implement general beta feedback storage: user ID, timestamp, feedback type ("general_beta"), source surface, message text
- Ensure no full AI conversation content is stored in feedback records

---

### Workstream G: Public Landing Experience

This workstream covers the public landing page. It depends on Workstreams C (for lesson and Learning Center routes) and B (for auth routes). It is largely independent and can proceed in parallel with other workstreams once routes are stable.

**High-Level Tasks (Spec 008):**
- Implement public landing page at `/` as a statically generated Next.js page (no database calls required to render)
- Implement hero section with approved headline, subheadline, and "Join the Waitlist" primary CTA (Spec 008 LANDING-FR-002, LANDING-FR-009)
- Implement secondary CTAs: first lesson preview link and Learning Center link
- Implement feature overview section describing IBM i Fundamentals, AI Tutor, and progress tracking (accurately, per MVP scope)
- Implement audience section identifying IBM i learners and working developers
- Implement trust and privacy section with approved wording (Spec 008 LANDING-FR-011)
- Implement "Join the Waitlist" or beta access CTA mechanism
- Implement login link in navigation header
- Implement responsive layout (desktop and mobile)
- Implement SEO metadata: page title and meta description (Spec 008 LANDING-FR-014)
- Store CTA label in a configuration constant for easy future updates
- Test all links: Learning Center, first lesson, login, waitlist/access-request

---

### Workstream H: Content Governance

This workstream covers the content authoring, review, and publication workflow. It is primarily a process workstream, not an engineering workstream, but has one engineering artifact and a content dependency that must be satisfied before beta.

**High-Level Tasks (Spec 009):**
- Create lesson review checklist template at `docs/content/lesson-review-checklist.md` from Spec 009 Section 12
- Set up the lesson content directory structure in the repository
- Begin authoring Lessons 1–8 following the approved lesson template (Spec 009 Section 6)
- Each lesson goes through: Draft → Review Ready (author marks it complete) → Approved (Product Owner / Founder reviews against checklist) → Published (Product Owner / Founder publishes it)
- Lesson 1 (What is IBM i?) must be the first lesson published — it is required for the landing page public preview CTA and first lesson public access
- Lessons 1–8 must be published before beta launch
- Verify lesson slugs match the approved format (`what-is-ibm-i`, `why-ibm-i-still-matters`, etc.)
- Verify Markdown rendering works correctly for each published lesson

---

### Workstream I: QA and Beta Readiness

This workstream covers end-to-end testing, access control verification, and the beta readiness checklist. It should run as other workstreams complete features.

**High-Level Tasks:**
- Test the complete new-user flow: landing → first lesson preview → sign-up → onboarding → dashboard → continue learning → AI Tutor → feedback
- Test the returning-user flow: login → dashboard → continue learning → mark lesson complete → see updated progress
- Test all authentication gates: Dashboard, AI Tutor, lessons 2+, Mark Complete, Feedback
- Test that no draft, review-ready, approved-but-not-published lessons are accessible at any route
- Test that Lesson 1 is publicly accessible without login
- Test first lesson sign-up CTA leads to sign-up and returns user to the lesson
- Test AI Tutor: ask IBM i questions, verify responses are IBM i-focused, verify streaming works, verify trust messaging is visible
- Test feedback: helpful / not helpful on AI responses; general beta feedback form
- Test all landing page links: hero CTAs, first lesson, Learning Center, login
- Test responsive layout on common mobile and desktop sizes
- Verify SEO metadata on landing page and first lesson
- Complete beta readiness checklist (Section 8 of this document)

---

## 5. Cross-Spec Dependencies

The following dependencies must be actively managed during implementation. A blocking dependency means the downstream feature cannot be fully implemented or tested until the upstream item is complete.

| Upstream | Downstream Dependent | Nature of Dependency |
|---|---|---|
| Spec 004 (Auth) | Spec 005 Dashboard | Dashboard requires authenticated session |
| Spec 004 (Auth) | Spec 001 AI Tutor | AI Tutor requires authentication; token count logging tied to user identity |
| Spec 004 (Auth) | Spec 006 Progress Tracking | Progress records are scoped to authenticated user ID |
| Spec 004 (Auth) | Spec 007 Feedback Collection | Feedback submission requires authenticated user ID |
| Spec 006 (Progress Tracking) | Spec 005 Dashboard | Dashboard reads progress count and next lesson from Progress Tracking |
| Spec 006 (Progress Tracking) | Spec 002 Learning Center | Lesson list reads per-lesson completion status from Progress Tracking |
| Spec 006 (Progress Tracking) | Spec 003 Lesson Experience | Lesson page reads and writes completion state through Progress Tracking |
| Spec 009 (Content Governance) | Beta launch | At least 8 lessons published; Lesson 1 published for public preview |
| Spec 001 (AI Tutor) + Spec 007 (Feedback) | ai_response_id | The AI Tutor implementation must generate and return a server-side ai_response_id per completed response; Feedback Collection reads this to store feedback without retaining full conversation content (Spec 007 FEEDBACK-FR-008) |
| Spec 002 / 003 / 006 / 009 | Lesson visibility | All four specs depend on a consistent Published-only lesson visibility rule enforced by a single status field in lesson metadata; implementations must not diverge from this |
| Spec 003 (Lesson Experience) | Spec 008 Landing page | The first lesson preview link on the landing page must resolve to a real, published lesson route |

---

## 6. Beta Readiness Checklist

The MVP beta must not launch until all of the following are confirmed by the Product Owner.

### Content

- [ ] At least 8 lessons (Lessons 1–8) are complete, reviewed, approved, and published
- [ ] Lesson 1 (What is IBM i?) is published and publicly accessible at `/learn/ibm-i-fundamentals/what-is-ibm-i`
- [ ] All published lessons follow the approved template (Spec 009 Section 6)
- [ ] All published lessons have passed the content quality checklist (Spec 009 Section 12)

### Public Landing Experience

- [ ] Landing page is publicly accessible at `/`
- [ ] Hero headline, subheadline, and primary CTA are correct (Spec 008)
- [ ] Trust and privacy message is visible (Spec 008 LANDING-FR-011)
- [ ] First lesson preview link and Learning Center link are working
- [ ] Login link is accessible in the navigation
- [ ] Page is usable on mobile

### Authentication

- [ ] New user can sign up with email and password
- [ ] New user sees onboarding question once after sign-up
- [ ] Returning user can log in and reach the dashboard
- [ ] Session persists across page refreshes
- [ ] Forgot password flow works (reset email delivered and functional)
- [ ] Logout works correctly

### Learning Center and Lesson Experience

- [ ] Published lesson list is visible at `/learn/ibm-i-fundamentals`
- [ ] Lesson 1 is readable by unauthenticated users
- [ ] Protected lessons (Lessons 2+) show a login prompt for unauthenticated users
- [ ] No draft or non-published lessons are accessible at any route
- [ ] Mark Complete works for authenticated users and persists
- [ ] Next/previous lesson navigation works correctly

### Progress Tracking and Dashboard

- [ ] Progress count is correct for users with completed lessons
- [ ] Progress denominator uses published lesson count (not hardcoded 12)
- [ ] Dashboard continue-learning card shows the correct next uncompleted lesson
- [ ] Dashboard shows Start Learning state with onboarding-aware copy for new users

### AI Tutor

- [ ] AI Tutor is accessible only to authenticated users
- [ ] AI Tutor produces IBM i-focused responses (not generic programming responses)
- [ ] Streaming responses work
- [ ] Privacy notice is visible near the input area
- [ ] Empty state shows starter prompts (Spec 001 UX)
- [ ] Token usage is being logged

### Feedback Collection

- [ ] Helpful / Not helpful controls appear on each completed AI Tutor response
- [ ] Submitting feedback stores a record without storing full conversation content
- [ ] General beta feedback form is accessible and stores submissions

### Exclusion Verification

- [ ] No real IBM i system connectivity is present
- [ ] No billing, subscription, or paid access features are present
- [ ] No enterprise, team, or admin dashboard features are present
- [ ] No community forum or public comments are present
- [ ] No AI conversation history persists across sessions
- [ ] No draft lesson content is accessible at any route

---

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Auth setup complexity — Supabase Auth + Next.js App Router middleware requires careful configuration | Medium | High | Treat auth as Stage 2 (early in Sprint 1); resolve before any auth-dependent feature is built; test auth middleware with a simple protected route before building Dashboard or AI Tutor |
| Lesson content not ready — fewer than 8 lessons are reviewed and published before beta | Medium | High | Begin content authoring in parallel with engineering immediately; track lesson completion status each week; do not launch beta until the 8-lesson threshold is confirmed |
| AI Tutor cost and control — AI provider usage during beta exceeds expected budget | Medium | Medium | Token usage logging is required from the first session; monitor weekly; configure rate limits if the provider supports them; Haiku 4.5 fallback is available if Sonnet 4.6 costs are unsustainable |
| Progress data inconsistency — Dashboard, Learning Center, and Lesson Experience compute progress differently | Medium | High | Spec 006 PROGRESS-FR-004 requires a single shared implementation; implementation plan must prohibit individual specs from maintaining separate progress models; test all three surfaces read the same completion state |
| Draft content exposure — a non-Published lesson becomes accessible through an engineering mistake | Low | High | Enforce Published-only access server-side in both lesson metadata queries and lesson page route handlers; include draft exposure testing in the QA checklist |
| Scope creep — pressure to add features not in approved specs during implementation | Medium | Medium | All additions require Product Owner approval and a PRD update; engineering should flag any out-of-spec request rather than silently implementing it |
| Overbuilding before beta validation — implementing advanced features before simple MVP features are validated | Low | Medium | Strictly follow the dependency order in Section 3; do not begin Stage 9+ until Stage 1–8 features are working end-to-end |

---

## 8. Open Implementation Questions

The following questions are genuine implementation-level questions that remain open after all SDD specs are approved. They do not reopen product decisions already resolved in the Sprint 1 Decision Register or approved SDD specs.

| ID | Question | Owner | Needed Before |
|---|---|---|---|
| IMP-Q-001 | Which Markdown rendering library should be used for lesson content? The choice affects bundle size, rendering quality, and maintenance. Options include `remark` / `rehype`, `next-mdx-remote`, or a similar library. (Spec 003 OQ-LE-001) | Engineering | Lesson Experience implementation |
| IMP-Q-002 | Should lesson pages use static generation (SSG) or server-side rendering (SSR)? SSG provides better performance but requires careful handling of the Lesson 1 public / rest authenticated split. SSR is simpler for auth-gated content but may add latency. (Spec 003 OQ-LE-002) | Engineering | Lesson Experience implementation |
| IMP-Q-003 | How should the lesson metadata store be structured? Options include a JSON metadata file in the repository, a TypeScript module, or database records. This affects how lesson status (published/draft) is read at runtime. | Engineering | Content loading foundation |
| IMP-Q-004 | What is the exact waitlist or access-request mechanism for the "Join the Waitlist" CTA on the landing page? Does it route to a third-party form service, a custom form, or an email? | Product / Founder | Landing page implementation |
| IMP-Q-005 | Should Supabase row-level security (RLS) policies be used for progress record isolation, or should all user ID filtering be enforced at the application query level? RLS is more robust but requires additional Supabase configuration. | Engineering | Progress Tracking implementation |
| IMP-Q-006 | What is the token usage logging mechanism? Options include a Supabase table, a server log, or a lightweight analytics store. Full conversation content must not be logged. | Engineering | AI Tutor implementation |

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial Sprint 1 implementation plan created from all 9 approved SDD specs |
