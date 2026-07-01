# Spec 005: Dashboard

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 005 |
| Feature | Dashboard |
| Status | Approved |
| Version | 1.0 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor quick access reference |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center structure and lesson ordering |
| specs/003-lesson-experience/spec.md | v1.0 Approved | Lesson routing and completion behavior |
| specs/004-user-account-and-onboarding/spec.md | v1.0 Approved | Authentication, onboarding response, and session behavior |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL storage decision |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |

---

## 2. Purpose

The dashboard is the authenticated home base for returning users of IBMiHub AI. Every logged-in user lands here after login and finds their most important next action without needing to navigate.

The dashboard exists to solve a specific problem: after a user creates an account and reads Lesson 1, what should they see when they come back the next day? Without a dashboard, returning users face a blank slate and must remember what they were doing. With a focused dashboard, the product answers the most important question immediately — "Where should I go next?" — and removes friction from continued learning.

The MVP dashboard is intentionally simple. It does not aim to be a full analytics view, a notification center, or an account management hub. Its purpose is to help users continue learning as fast as possible.

The dashboard exists in the MVP to:

- Give returning authenticated users a clear, immediate "Continue Learning" action
- Show basic IBM i Fundamentals progress (how many lessons completed out of the available lessons)
- Provide quick access to the AI Tutor and the Learning Center
- Use the user's onboarding response to show a contextually appropriate starting recommendation for new users
- Serve as the post-login landing page for all authenticated users

---

## 3. MVP Scope

The MVP dashboard is an authenticated landing page that shows learning progress, a continue-learning recommendation, and quick access to key product areas.

### In Scope for MVP

| Capability | Description |
|---|---|
| Authenticated-only dashboard | The dashboard is only accessible to logged-in users; unauthenticated users are redirected to login |
| Welcome message | Generic welcome message based on dashboard state. The dashboard must not display the user's email address or personal account information as the greeting in MVP. |
| Continue Learning card | A prominent card showing the next uncompleted lesson in the IBM i Fundamentals path and a direct link to it |
| IBM i Fundamentals progress summary | A display showing how many lessons the user has completed out of the available published lessons |
| Completed lesson count | The number of lessons the user has marked complete |
| Next recommended lesson | The first uncompleted lesson in the sequence, derived from progress tracking data |
| AI Tutor quick access | A visible link or button to the AI Tutor at `/ai-tutor` |
| Learning Center quick access | A visible link or button to the IBM i Fundamentals learning path |
| Onboarding-aware recommendation | For new users who have not yet started any lessons, the recommendation takes the onboarding response into account |
| New user empty state | A clear starting-point experience for users who have not completed any lessons yet |
| Basic user/account context | The dashboard uses the authenticated user's session to display personalized content |
| No complex personalization | Recommendations are based only on progress position and onboarding response; no AI-driven personalization |

---

## 4. Explicitly Out of Scope for MVP

The following capabilities must not be included in the MVP dashboard implementation.

| Excluded Capability | Reason |
|---|---|
| Admin dashboard or admin controls | Future feature; MVP users are all learners (PRD 18.17) |
| Enterprise or team dashboard | Future feature (PRD 11, Phase 5+) |
| Billing or subscription dashboard | Billing is out of MVP scope (PRD 17.2) |
| Learning analytics or engagement charts | Future feature |
| Certificates or badges | Future feature (PRD 11) |
| Leaderboards or social rankings | Future feature |
| Community activity feed | Future feature (PRD 11) |
| Notifications or alerts center | Future feature |
| Advanced AI-driven personalization | Future feature; MVP uses simple progress-based recommendations only |
| Multi-path recommendations | MVP supports only IBM i Fundamentals; multi-path is future |
| AI Tutor conversation history display | AI conversation history is session-only and is not persisted (D-AI-004; Spec 001) |
| User profile editing or account settings page | Future feature |
| Social login management | Out of MVP scope (Spec 004) |
| Password change from dashboard | Password reset is handled through the forgot password flow (Spec 004 ACCOUNT-FR-018) |
| Progress export or download | Future feature |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A beginner visits the dashboard after completing their first lesson or returning after a break. They need:

- An immediately visible "Continue Learning" action so they do not have to figure out what to do next
- A sense of progress (e.g., "You've completed 2 of the available lessons")
- A simple entry point for the AI Tutor when they have a question
- A non-overwhelming experience that does not distract them with features they do not need yet

The dashboard must make continued learning feel easy and achievable, not complicated.

### Persona 2: Working IBM i Developer

A working developer visits the dashboard less frequently and uses it primarily as a navigation hub. They may:

- Use the AI Tutor link as their primary entry point
- Check which lessons remain if they are refreshing specific topics
- Quickly navigate to the Learning Center to browse topics

The dashboard should feel useful as a quick navigation hub even for users who are not primarily following the structured beginner path.

---

## 6. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-DASH-001 | Authenticated user | Access my dashboard after logging in | I can see my progress and next actions immediately |
| US-DASH-002 | Authenticated user | See a welcome message | The product feels personal and welcoming |
| US-DASH-003 | Returning learner | See my next uncompleted lesson prominently | I can continue where I left off without searching |
| US-DASH-004 | Authenticated user | See how many IBM i Fundamentals lessons I have completed | I have a sense of my progress through the learning path |
| US-DASH-005 | New user who has not started any lessons | See a clear starting recommendation | I know exactly where to begin my IBM i learning |
| US-DASH-006 | Returning learner | Click a "Continue" action to open my next lesson | I can resume learning in one click |
| US-DASH-007 | Any authenticated user | See a quick link to the AI Tutor | I can ask IBM i questions without navigating to find it |
| US-DASH-008 | Any authenticated user | See a quick link to the Learning Center | I can browse lessons or return to the full learning path |
| US-DASH-009 | New user who answered the onboarding question | See a recommendation that reflects my IBM i experience | The dashboard starting point feels appropriate for me |
| US-DASH-010 | Unauthenticated visitor | Be redirected to login if I try to access the dashboard | I understand I need to log in to see my dashboard |

---

## 7. Functional Requirements

### DASH-FR-001 — Dashboard Access Control

The dashboard must only be accessible to authenticated users.

- The dashboard route (e.g., `/dashboard`) must be protected by authentication middleware
- Unauthenticated users who attempt to access the dashboard must be redirected to the login page
- After logging in, the user must be redirected back to the dashboard (per Spec 004 ACCOUNT-FR-015 post-login redirect rules)
- This access control must be enforced server-side

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-001; Spec 004 ACCOUNT-FR-005, ACCOUNT-FR-009

---

### DASH-FR-002 — Authenticated User Context

The dashboard must use the authenticated user's identity to display personalized content.

- The dashboard must read the authenticated user's session to identify the current user
- The user's onboarding response (answered or skipped) must be loaded from the user profile
- The user's lesson completion records must be loaded from the progress tracking data
- If user data cannot be loaded, the dashboard must display an appropriate error state (see DASH-FR-013)

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-002; Spec 004 ACCOUNT-FR-016; Spec 006 Progress Tracking

---

### DASH-FR-003 — Welcome Message

The dashboard must display a welcome message for the authenticated user using generic copy only (OQ-DASH-001 resolved).

- The welcome message must not display the user's email address. No display name is collected in the MVP user profile (Spec 004); the greeting must use generic copy.
- The approved welcome copy by user state is as follows:

| User State | Approved Welcome Copy |
|---|---|
| New user (zero lessons completed) | "Welcome to IBMiHub AI. Let's start your IBM i learning journey." |
| Returning user (one or more lessons completed) | "Welcome back. Continue your IBM i learning journey." |
| Path-complete user (all published lessons completed) | "Great work — you've completed the available IBM i Fundamentals lessons." |

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-002; OQ-DASH-001 resolved

---

### DASH-FR-004 — Continue Learning Card

The dashboard must display a prominent Continue Learning card that directs the user to their next recommended lesson.

- The Continue Learning card must display the title of the next uncompleted lesson in the IBM i Fundamentals sequence
- The card must include a direct link or button that navigates the user to that lesson's page
- The next uncompleted lesson is the first lesson in the sequence that the user has not yet marked complete
- If the user has completed all available published lessons, the Continue Learning card should indicate that they have completed the path and provide a link to the Learning Center for further navigation
- If the user has not started any lessons, the Continue Learning card functions as a Start Learning prompt (see DASH-FR-005)

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-003, FR-DASH-004, FR-DASH-007, FR-DASH-008; Spec 006 Progress Tracking

---

### DASH-FR-005 — New User Empty State

New users who have not yet completed any lessons must see a clear and welcoming starting-point experience (OQ-DASH-002 resolved).

- If the user has completed zero lessons, the dashboard must display a "Start Learning" state rather than a "Continue Learning" state
- The Start Learning state must clearly recommend the first lesson in the IBM i Fundamentals path
- The Start Learning state must use the approved onboarding-aware copy from DASH-FR-010
- The empty state must not feel like an error; it must feel like an encouraging invitation to begin

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-002; US-DASH-005; OQ-DASH-002 resolved

---

### DASH-FR-006 — Progress Summary

The dashboard must display a basic progress summary for the IBM i Fundamentals learning path (OQ-DASH-003 resolved).

- The summary must show the number of lessons the user has completed
- The denominator must be the number of currently published lessons, not the full 12-lesson target. Example: if 8 lessons are published and the user completed 3, show "3 of 8 lessons completed." When additional lessons are published later, the denominator updates automatically.
- A secondary note such as "More lessons are being added" may be shown when fewer than 12 lessons are published, but it must not affect the progress count.
- The format may be a count (e.g., "3 of 8 lessons completed") or a visual indicator (e.g., a progress bar or fraction)
- The progress count must reflect the user's actual completion records from the progress tracking data
- The progress summary should update after the user completes a lesson and returns to the dashboard

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-005; Spec 006 Progress Tracking; OQ-DASH-003 resolved

---

### DASH-FR-007 — Next Lesson Recommendation

The dashboard must recommend the specific next lesson for the user.

- The recommended lesson is the first published lesson in the IBM i Fundamentals sequence that the user has not yet marked complete
- If the user has completed all available published lessons, no "next lesson" should be shown; instead, a path completion message is shown
- The recommendation must be derived from comparing the published lesson sequence (from lesson metadata) with the user's completion records (from progress tracking)
- The lesson title and a direct navigation link must be displayed

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-003, FR-DASH-004; Spec 002 Learning Center; Spec 006 Progress Tracking

---

### DASH-FR-008 — AI Tutor Quick Access

The dashboard must provide a visible quick-access link to the AI Tutor.

- A clearly visible link or button must be present on the dashboard that directs the user to the AI Tutor at `/ai-tutor`
- The link should be labeled clearly (e.g., "Ask the AI Tutor" or "AI Tutor")
- The AI Tutor link must be accessible to all authenticated users regardless of progress state

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-006; Spec 001 AI Tutor

---

### DASH-FR-009 — Learning Center Quick Access

The dashboard must provide a visible quick-access link to the Learning Center.

- A clearly visible link or button must be present on the dashboard that directs the user to the IBM i Fundamentals learning path page at `/learn/ibm-i-fundamentals`
- The link should be labeled clearly (e.g., "View All Lessons" or "Learning Center")
- The Learning Center link must be accessible to all authenticated users

**Priority:** Must Have
**Source:** PRD 13.5; Spec 002 Learning Center

---

### DASH-FR-010 — Onboarding Response Usage

The dashboard must use the user's onboarding response to provide context-appropriate Start Learning copy for new users with zero completed lessons (OQ-DASH-002 resolved).

The approved empty-state copy by onboarding response is as follows:

| Onboarding Response | Approved Start Learning Copy |
|---|---|
| "I am new to IBM i and want to start learning." | "Start with the IBM i Fundamentals path. It is designed to build your understanding step by step." |
| "I already work with IBM i and want to refresh or deepen my knowledge." | "Use the IBM i Fundamentals path as a refresher, or jump directly to the topic you want to revisit." |
| "I am exploring what IBMiHub AI offers." | "Explore the IBM i Fundamentals path and try the AI Tutor when you have questions." |
| Onboarding question skipped | "Start with the IBM i Fundamentals path or open the AI Tutor to ask an IBM i question." |

- The onboarding response does not restrict access; all users can still see and access all available lessons regardless of their onboarding answer
- This copy is a presentation-layer concern only and does not affect data fetching or progress computation
- The copy applies only when the user has zero completed lessons; returning users see the standard "Welcome back" state regardless of onboarding response

**Priority:** Should Have
**Source:** D-PROD-006; Spec 004 ACCOUNT-FR-012; OQ-DASH-002 resolved

---

### DASH-FR-011 — Returning User Behavior

When a user who has completed one or more lessons visits the dashboard, the Continue Learning state must be shown.

- The dashboard must detect that the user has at least one lesson completed and switch from the Start Learning state to the Continue Learning state
- The transition from Start Learning to Continue Learning must happen without requiring the user to take any additional action
- A returning user's dashboard must reflect their current progress accurately; it must not show a Start Learning state if they have completed lessons

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-007, FR-DASH-008

---

### DASH-FR-012 — No AI Conversation History Display

The dashboard must not display AI Tutor conversation history.

- AI Tutor conversation history is session-only and is not stored server-side (D-AI-004; Spec 001 D-AI-004)
- The dashboard must not attempt to load or display past AI Tutor conversations
- No "recent questions" or "conversation history" section should appear on the dashboard in MVP

**Priority:** Must Have
**Source:** Spec 001 AI Tutor Privacy and Data Handling; D-AI-004

---

### DASH-FR-013 — Error and Loading States

The dashboard must handle loading and error states gracefully.

- A loading indicator must be displayed while the dashboard is fetching progress data or user context
- If progress data cannot be loaded (e.g., a database error), the dashboard must display a user-friendly error message and a link to the Learning Center or to try refreshing the page
- Error states must not expose technical error details or stack traces to the user
- Error states must not prevent the user from seeing the AI Tutor and Learning Center quick links

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-003, NFR-REL-005

---

## 8. Non-Functional Requirements

### NFR: Security

- The dashboard must only serve content to the authenticated user identified by the current session
- Progress records for one user must never be visible to another user
- The dashboard must not expose authenticated user data (e.g., progress records, onboarding response) to unauthenticated requests
- All dashboard data access must be performed on the server side, not in unauthenticated client-side requests

**Source:** PRD 14.6 NFR-SEC-003, NFR-SEC-004; Spec 004

---

### NFR: Privacy

- The dashboard must only display the minimum data needed to support the learning journey: user greeting, progress count, next lesson, and quick links
- No user data is shared with third parties or exposed in any public format
- The dashboard must not collect or store additional data beyond what is needed for the learning experience

**Source:** PRD 14.7 NFR-PRIV-001

---

### NFR: Performance

- The dashboard must load within a reasonable time after login so returning users are not kept waiting
- Progress data must load quickly enough that the Continue Learning card feels responsive, not sluggish
- If progress data requires multiple data lookups (lesson metadata + completion records), these should be resolved efficiently before the page renders or handled with a lightweight loading state

**Source:** PRD 14.3 NFR-PERF-002

---

### NFR: Accessibility

- The dashboard must be keyboard-navigable; all interactive elements (links, buttons) must be reachable via keyboard
- The Continue Learning card and quick-access buttons must have clear, accessible labels
- The progress summary must not communicate progress using color alone
- Loading and error states must be communicated to screen readers appropriately

**Source:** PRD 14.10 NFR-ACC-001, NFR-ACC-002, NFR-ACC-003

---

### NFR: Reliability

- The dashboard must handle gracefully the case where progress data is unavailable (see DASH-FR-013)
- A failure to load progress data must not make the entire dashboard inaccessible; quick links must still be visible
- The dashboard must not crash or display a blank page due to a progress data load failure

**Source:** PRD 14.4 NFR-REL-003, NFR-REL-005

---

### NFR: Maintainability

- The dashboard data loading logic should be clearly separated from the dashboard presentation layer
- Adding a new quick-access link to the dashboard should require a minimal code change
- The onboarding-aware messaging should be implemented in a way that makes it easy to update the copy for each onboarding response without touching data fetching logic

**Source:** PRD 14.13 NFR-MAIN-004

---

## 9. Dashboard Data Requirements

This section defines the data the dashboard needs to function at the spec level. This is not a database schema. The specific implementation will be defined in the implementation plan.

### Data the Dashboard Requires

| Data Item | Source | Purpose |
|---|---|---|
| Authenticated user ID | Supabase Auth session | Identity for all data lookups |
| Onboarding response | User profile (Supabase PostgreSQL) | Determines Start Learning messaging for new users |
| IBM i Fundamentals lesson metadata | Lesson metadata store | Full ordered lesson list for computing next lesson and progress |
| User lesson completion records | Progress tracking (Supabase PostgreSQL) | Which lessons the user has marked complete |
| Computed progress count | Derived from completion records vs. published lesson count | Displayed as "X of Y lessons completed" |
| Next uncompleted lesson | Derived from lesson order vs. completion records | The lesson title and link for the Continue Learning card |
| Authenticated user session | Supabase Auth session | Used only to confirm user identity and load user-specific dashboard data; not displayed as visible personal information. No display name or email address is used for MVP greetings. |

### Derived Data

- **Progress count**: count of lessons with a completion record for this user
- **Next uncompleted lesson**: the lesson with the lowest order number that does not have a completion record for this user among the published lessons
- **Path completion state**: true if count of completed lessons equals count of published lessons

### Data the Dashboard Must Not Access

- Other users' progress records
- AI Tutor conversation content
- Draft or unpublished lesson content
- Payment or billing data
- Admin or system data

---

## 10. UX Requirements

The following UX requirements define the expected layout and interaction patterns for the dashboard. Specific visual design and component choices are to be determined during implementation.

### Dashboard Route

- The dashboard is accessible at `/dashboard`
- Authenticated users are directed to `/dashboard` after login if no redirect context is present (Spec 004 ACCOUNT-FR-015)

### Authenticated Layout

- The dashboard uses an authenticated page layout that includes navigation to the Learning Center, AI Tutor, and account controls (logout)
- The navigation must be consistent with other authenticated pages in the product

### Welcome Section

- A greeting appears at the top of the dashboard using the approved generic copy (see DASH-FR-003 table; no email or display name is used):
  - New user (zero lessons): "Welcome to IBMiHub AI. Let's start your IBM i learning journey."
  - Returning user: "Welcome back. Continue your IBM i learning journey."
  - Path-complete user: "Great work — you've completed the available IBM i Fundamentals lessons."

### Continue Learning Card

- The most prominent element on the dashboard
- Displays: the next uncompleted lesson title, a brief description or context, and a clear "Continue" or "Start" button/link
- For users who have completed all available lessons: a "You've finished the available lessons" message with a link to the Learning Center

### Progress Summary

- Displayed near the Continue Learning card
- Shows the user's completed lesson count and the total available published lessons (e.g., "3 of 10 lessons completed")
- A simple visual indicator (progress bar, fraction, or count) is sufficient; complex analytics charts are out of scope

### Quick Actions

- Two clearly visible quick-action links below or beside the Continue Learning card:
  - AI Tutor link to `/ai-tutor`
  - Learning Center link to `/learn/ibm-i-fundamentals`
- Both must be labeled clearly and accessible

### Empty State for New Users

- When a user has completed zero lessons, the dashboard shows a Start Learning state
- The state includes: an onboarding-aware message (see DASH-FR-010 table for approved copy), and a prominent call-to-action to start the first lesson
- The empty state must feel encouraging, not empty or broken

### Error State

- If progress data fails to load, the dashboard shows a friendly message (e.g., "We couldn't load your progress right now. Try refreshing the page.")
- The AI Tutor and Learning Center quick links must still be visible in the error state

### Loading State

- A loading indicator is shown while the dashboard is fetching progress and user data
- The loading state must not be shown for so long that it feels like a broken page; if data takes too long to load, show the error state

### Login Redirect for Unauthenticated Users

- If an unauthenticated user navigates to `/dashboard`, they must be immediately redirected to the login page
- After login, they are redirected back to `/dashboard`

---

## 11. Access Rules

| User State | Access Result |
|---|---|
| Authenticated | Full dashboard experience; personalized to their progress and onboarding response |
| Unauthenticated | Immediate redirect to login; no dashboard content is visible |
| Authenticated with zero completed lessons | Dashboard shows Start Learning state |
| Authenticated with one or more completed lessons | Dashboard shows Continue Learning state |
| Authenticated with all available lessons completed | Dashboard shows path-complete message with Learning Center link |

All access rules must be enforced server-side. The dashboard must not render any user-specific data in a publicly accessible client-side context.

---

## 12. Dependencies

The dashboard feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Authentication | Supabase Auth — dashboard requires an authenticated session | ADR-004 |
| Database | Supabase PostgreSQL — user profile (onboarding response) and progress records | ADR-003 |
| Tech stack | Next.js + TypeScript — server-side rendering for authenticated dashboard | ADR-001 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 004: User Account and Onboarding | Authentication and session must be in place; onboarding response is read from the user profile |
| Spec 002: Learning Center | Lesson metadata and ordering is needed to compute the next lesson and progress count |
| Spec 003: Lesson Experience | Dashboard links to lesson pages; lesson routes must exist |
| Spec 006: Progress Tracking | Lesson completion records are the primary data source for the dashboard's progress summary and Continue Learning card |
| Spec 001: AI Tutor | The dashboard links to the AI Tutor; the AI Tutor must exist at `/ai-tutor` |

---

## 13. Acceptance Criteria

The dashboard is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Access Control

- [ ] An authenticated user can access the dashboard at `/dashboard`
- [ ] An unauthenticated user who navigates to `/dashboard` is redirected to the login page
- [ ] After login, the user is redirected to the dashboard (or to the originally requested page per Spec 004 redirect rules)

### New User Experience

- [ ] A user with zero completed lessons sees a Start Learning state rather than a Continue Learning state
- [ ] The Start Learning state shows the first lesson in the IBM i Fundamentals path
- [ ] If an onboarding response is present, the Start Learning messaging reflects it (without restricting access)
- [ ] If the onboarding question was skipped, a default Start Learning state is shown without onboarding-specific messaging

### Returning User Experience

- [ ] A user with one or more completed lessons sees a Continue Learning card
- [ ] The Continue Learning card shows the correct next uncompleted lesson title
- [ ] The Continue Learning card includes a working link to that lesson's page
- [ ] If all available published lessons are completed, a path-complete message is shown with a link to the Learning Center

### Progress Summary

- [ ] The progress summary correctly shows the number of lessons the user has completed
- [ ] The denominator is the number of currently published lessons, not the full 12-lesson target (e.g., "3 of 8 lessons completed" when 8 are published)
- [ ] The progress count reflects the user's actual completion records from progress tracking

### Quick Links

- [ ] An AI Tutor link is visible and navigates to `/ai-tutor`
- [ ] A Learning Center link is visible and navigates to `/learn/ibm-i-fundamentals`
- [ ] Both links are accessible to all authenticated users regardless of progress state

### Data Isolation

- [ ] The dashboard only displays progress data for the currently logged-in user
- [ ] No AI Tutor conversation history is displayed on the dashboard

### Out-of-Scope Verification

- [ ] No admin controls, team features, or billing information appear on the dashboard
- [ ] No AI conversation history is displayed
- [ ] No advanced analytics, charts, or leaderboards appear on the dashboard
- [ ] No account settings or profile editing is accessible from the dashboard

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Progress data unavailable — database error prevents loading completion records | Low | Medium | Dashboard must display a graceful error state with quick links still accessible (DASH-FR-013); implement retry or refresh guidance |
| Dashboard feels empty for new users — zero lessons completed creates a blank or unhelpful experience | Medium | High | Implement a welcoming, encouraging Start Learning state with clear call-to-action; use onboarding response to make the message feel contextual (DASH-FR-005, DASH-FR-010) |
| Incorrect next lesson recommendation — progress data or lesson ordering is inconsistent | Low | Medium | Next lesson derivation logic must be tested against multiple progress states: zero lessons, some lessons, last lesson completed; include explicit test cases in QA |
| Auth gating mistake exposes one user's data to another | Low | High | Dashboard data queries must always be scoped to the authenticated user ID; enforce user ID filtering server-side; test with multiple user accounts before beta |
| Scope creep into analytics or admin dashboard — requests to add charts, activity feeds, or notifications during implementation | Medium | Medium | This spec explicitly excludes these features; any addition requires Product Owner approval and a PRD update |
| Dashboard depends on Progress Tracking spec (Spec 006) — if Spec 006 is not ready, the Continue Learning card cannot be built | Medium | High | Coordinate dashboard implementation plan with Spec 006; the dashboard should not implement its own progress data model; if Spec 006 is delayed, an interim stub can show a static Start Learning state |

---

## 15. Open Questions

No open questions remain for this spec at this stage. Any new questions discovered during implementation planning should be added here before coding begins.

---

## 16. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any Dashboard implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope and dashboard content requirements
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] Dashboard data fetching design is reviewed to ensure queries are scoped to the authenticated user only

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for the Dashboard is created and approved
- [ ] Spec 004 (User Account and Onboarding) is approved and implemented — authentication is required for the dashboard
- [ ] Spec 006 (Progress Tracking) is available — progress data is the core data source for the dashboard
- [ ] Dashboard data fetching logic is designed to query only the authenticated user's progress records (data isolation)

### Notes for Implementation Planning

- The dashboard should be implemented as a server-side rendered page in Next.js to support fast loading and to ensure authentication is validated before any user data is fetched.
- The dashboard's data requirements (progress count, next lesson) should be computed server-side rather than in client-side JavaScript to avoid exposing raw user data to the browser before it is ready to display.
- Progress tracking (Spec 006) is the source of truth for lesson completion state; the dashboard must read from the approved Progress Tracking implementation and must not implement its own progress model.
- The onboarding-aware messaging (DASH-FR-010) should be implemented as a presentation-layer concern only — it does not change data fetching; it only changes the wording of the empty-state card based on the stored onboarding response.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP Dashboard spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 001–004 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved dashboard copy and progress denominator decisions |
| 2026-07-01 | 1.0 | Approved Dashboard SDD spec for implementation planning |
