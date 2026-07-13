# Spec 006: Progress Tracking

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 006 |
| Feature | Progress Tracking |
| Status | v1.0 Approved (current production baseline) — **v2.0 Amendment Draft, Pending Product Owner Review** |
| Version | 1.0 (Approved) → 2.0 (Draft, this revision) |
| Owner | Product + Engineering |
| Last Updated | 2026-07-14 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| planning/CURRICULUM_EXPANSION_BLUEPRINT.md | v0.1 Draft | Source of the multi-track curriculum model this v2.0 amendment supports |
| specs/002-learning-center/spec.md | v1.0 Approved → v2.0 Draft (companion amendment) | Learning Center lesson status display reference |
| specs/003-lesson-experience/spec.md | v1.0 Approved | Mark Complete behavior and completed state reference |
| specs/004-user-account-and-onboarding/spec.md | v1.0 Approved | Authentication identity reference |
| specs/005-dashboard/spec.md | v1.0 Approved | Dashboard progress summary requirements |
| specs/009-content-governance/spec.md | v1.0 Approved → v2.0 Draft (companion amendment) | Lesson metadata model this spec reads from, including `trackId`/`moduleId` |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL storage decision |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |

---

## 2. Purpose

Progress tracking allows authenticated users to save their lesson completion state and resume their IBM i learning journey across sessions.

Without progress tracking, IBMiHub AI is a stateless reading experience — every time a user returns, they must remember where they were and navigate back manually. With progress tracking, the product remembers: which lessons a user has completed, how far along they are in the IBM i Fundamentals path, and what lesson to recommend next.

Progress tracking is a foundational capability that other features depend on:

- The **Lesson Experience** (Spec 003) shows a read-only completed state and a Mark Complete button
- The **Learning Center** (Spec 002) shows completed/not-started status on each lesson in the list
- The **Dashboard** (Spec 005) uses progress data to display a progress summary and the next recommended lesson

This spec defines the MVP scope, progress data requirements, calculation rules, access control, UX requirements, and acceptance criteria for the Progress Tracking feature.

### 2.1 Amendment Notice — v2.0 (Multi-Track Progress)

This revision amends the v1.0 Approved spec to support progress calculation across the multi-track curriculum defined in `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` and formalized by the companion Spec 009 v2.0 amendment. Every v1.0 requirement, rule, and calculation is preserved and labeled; new v2.0 material is added alongside it and also labeled.

**Nothing changes in the live product as a result of this document.** Progress continues to be calculated exactly as it is today — a single completed count over a single published-lesson denominator — until this amendment, the companion Spec 009 v2.0 amendment, and the companion Spec 002 v2.0 amendment are all approved and implemented together. This spec does not authorize any code change by itself.

**Important mathematical note:** while only today's single "IBM i Fundamentals" track-equivalent content exists, the v2.0 per-track calculation (Section 10, v2.0) produces the exact same numeric result as the current v1.0 calculation, because the track's denominator equals the full published-lesson count, exactly as today. Approving this amendment does not change any user's currently displayed progress number on day one — it only changes the calculation's generality so it continues to work correctly once a second track's lessons are published.

---

## 3. MVP Scope

The MVP Progress Tracking feature provides authenticated lesson completion records, a Mark Complete action, a read-only completed state, progress count computation, and the continue-learning calculation used by the dashboard and lesson navigation.

### In Scope for MVP

| Capability | Description |
|---|---|
| Authenticated-only progress tracking | Only logged-in users can create or read progress records |
| Lesson completion records | A per-user, per-lesson completion record is created when a user marks a lesson complete |
| Mark Complete action | An authenticated user can mark a published lesson complete from the lesson page |
| Read-only completed state after completion | Once marked complete, a lesson's completion state cannot be undone in MVP |
| No unmark or toggle in MVP | Reversing lesson completion is explicitly out of scope |
| Progress summary calculation | The count of completed lessons out of currently published lessons is computed for display |
| Continue Learning calculation | The first published lesson not yet completed by the user is computed to power the dashboard and lesson navigation |
| Dashboard progress support | Progress data is read by Spec 005 Dashboard to display the progress summary and continue-learning card |
| Learning Center completion state support | Progress data is read by Spec 002 to show completed/not-started per lesson in the lesson list |
| Lesson page completed state support | Progress data is read by Spec 003 to show the read-only completed state on the lesson page |
| User-specific progress data | Progress records are scoped to the authenticated user; no cross-user data access |
| Published lessons only | Only published lessons can have completion records; draft lessons are excluded from progress |
| No progress for unauthenticated users | Unauthenticated users cannot create or read progress records |

### v2.0 Proposed Scope Additions (Pending Approval — Not Yet Implemented)

| Capability | Description |
|---|---|
| Module-level progress | Completed count and denominator scoped to a single module within a track |
| Track-level progress | Completed count and denominator scoped to a single track, rolled up from its modules |
| Recommended-path progress | A roll-up across the specific tracks that make up the curated recommended beginner path (Spec 002 v2.0 Section 6) |
| Dynamic per-scope denominators | The existing "dynamic, never hardcoded" denominator principle (v1.0 PROGRESS-FR-008) generalizes to any track or module scope, not only the whole curriculum |
| Future multi-track aggregate progress | An optional overall completion figure across every track a user has touched — explicitly lower priority, not required for Phase 1 or Phase 2 of the curriculum blueprint |

**Everything currently out of scope for v1.0 (Section 4) remains out of scope under v2.0** unless explicitly listed above. In particular: unmarking/toggling completion, quiz scores, streaks, badges, and admin/team progress views are not introduced by this amendment.

---

## 4. Explicitly Out of Scope for MVP

| Excluded Capability | Reason |
|---|---|
| Anonymous or session-level progress tracking | Progress requires authentication (D-PROD-005; Spec 004) |
| Cross-device progress without login | Progress is tied to the authenticated user account; no device-level tracking |
| Unmarking or toggling lesson completion | Explicitly out of scope for MVP (Spec 003 OQ-LE-003 resolved) |
| Progress reset | Future feature; no mechanism to reset all progress in MVP |
| Quiz scores or assessment tracking | Quizzes are deferred to post-MVP (D-PROD-003) |
| Certificates or completion badges | Future feature (PRD 11) |
| Time-spent tracking per lesson | Future feature |
| Detailed learning analytics | Future feature |
| Learning streaks or streak tracking | Future feature |
| Leaderboards or social progress | Future feature |
| Admin or instructor progress reports | Future feature (PRD 18.17) |
| Enterprise or team progress views | Future feature (PRD 11, Phase 5) |
| Progress export or download | Future feature |
| Progress for draft or unpublished lessons | Draft lessons are excluded from all progress operations |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A beginner relies on progress tracking to maintain a sense of continuity across sessions. Without it, every visit starts from scratch. With it, the user can:

- See which lessons they have completed when they return to the Learning Center
- Let the dashboard tell them exactly where to continue
- Feel a growing sense of achievement as their completed count increases

The progress tracking experience must be reliable. If a user marks a lesson complete and the record is lost, they will lose confidence in the product.

### Persona 2: Working IBM i Developer

A working developer uses the Learning Center less linearly. They may jump around, mark specific lessons complete after reviewing them, and skip lessons on topics they already know. Progress tracking should respect this behavior:

- Any published lesson can be marked complete in any order
- The completed state is recorded and shown consistently
- The "next lesson" recommendation on the dashboard is still useful as a navigation aid even if the developer has not followed a strict sequence

---

## 6. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-PROG-001 | Authenticated user | Mark a lesson complete from the lesson page | My completion is saved and I know I have finished this lesson |
| US-PROG-002 | Authenticated user | See the lesson displayed as completed when I return to it | I have clear confirmation that my progress was recorded |
| US-PROG-003 | Authenticated user | Return to the product days later and see my previously completed lessons still marked | My progress persists across sessions without re-completing lessons |
| US-PROG-004 | Authenticated user | See my completed lesson count on the dashboard | I know how far along I am in the IBM i Fundamentals path |
| US-PROG-005 | Authenticated user | See completed/not-started indicators next to each lesson in the Learning Center | I can quickly see my progress at a glance without opening each lesson |
| US-PROG-006 | Authenticated user | See the next uncompleted lesson recommended on the dashboard | I know exactly where to continue without searching |
| US-PROG-007 | Unauthenticated visitor | See a login prompt rather than a Mark Complete button | I understand I need an account to save progress |
| US-PROG-008 | Authenticated user | Find that clicking Mark Complete again on a lesson I already completed does nothing harmful | No duplicate records are created if I mark a lesson complete twice |
| US-PROG-009 | Authenticated user | Find that my completed lessons cannot be unmarked in MVP | My progress state remains stable once saved |

### v2.0 Proposed User Stories (Pending Approval)

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-PROG-010 | Authenticated user | See my progress broken down by track and by module | I understand exactly how far along I am in the specific skill I'm building |
| US-PROG-011 | Authenticated user | See my recommended-beginner-path progress as one number even though it spans multiple tracks internally | The transition from today's single-path experience to the multi-track model feels seamless, not more confusing |
| US-PROG-012 | Working IBM i Developer | Complete lessons out of order across several tracks and still see correct per-track progress | My non-linear learning style is respected exactly as it is in the current single-path MVP |
| US-PROG-013 | Product Owner | Confirm that adding a new track does not change any existing user's already-displayed progress numbers for tracks they've already been using | Users don't lose confidence in the product when the curriculum grows |

---

## 7. Functional Requirements

### PROGRESS-FR-001 — Authenticated Progress Only

Progress tracking must only be available to authenticated users.

- Unauthenticated users cannot create, read, or write progress records
- Any Mark Complete action attempted by an unauthenticated user must be blocked; the user must see a login/sign-up prompt in place of the Mark Complete button (Spec 003 LESSON-FR-007)
- Any read request for progress data must first verify the user is authenticated

**Priority:** Must Have
**Source:** PRD 13.9 FR-PROG-001; Spec 003 LESSON-FR-007; D-PROD-005

---

### PROGRESS-FR-002 — Mark Complete Write Behavior

When an authenticated user marks a published lesson as complete, a completion record must be created using an idempotent insert-if-missing approach (OQ-PROG-001 resolved).

- Triggering the Mark Complete action on a published lesson creates a completion record in the database for the authenticated user and the lesson ID, if no record already exists
- The Mark Complete write must be idempotent: if a record already exists for the same user ID and lesson ID, the existing record is preserved and no new record is created
- A uniqueness rule on the user ID + lesson ID pair must enforce idempotency at the data layer to prevent race condition duplicates
- The completion record must include at minimum: user ID, lesson ID, and the timestamp when the lesson was first marked complete
- The Mark Complete action must only succeed for published lessons; it must not create records for draft or unpublished lessons

**Priority:** Must Have
**Source:** PRD 13.9 FR-PROG-001; Spec 003 LESSON-FR-007; OQ-PROG-001 resolved

---

### PROGRESS-FR-003 — Idempotent Completion Behavior

Marking a lesson complete that has already been marked complete must not create a duplicate record (OQ-PROG-001 resolved).

- If a user triggers the Mark Complete action on a lesson they have already completed, the action must return or preserve the existing completed state without creating a new record
- The response to a repeated Mark Complete action must behave identically to a successful first completion: no error shown, completed state confirmed
- Multiple Mark Complete calls for the same user/lesson pair must result in exactly one completion record in the database, enforced by a uniqueness rule on user ID + lesson ID
- No unmarking, toggling, or updating of the completion state is supported in MVP

**Priority:** Must Have
**Source:** US-PROG-008; OQ-PROG-001 resolved

---

### PROGRESS-FR-004 — Completed State Read Behavior

The completion state of a lesson must be readable and consistent across all surfaces that display it.

- A lesson's completion state for the current authenticated user must be retrievable from the progress records
- The same data source must be used by the Lesson Experience, Learning Center, and Dashboard to display completion state; each surface must not implement its own separate progress model
- Completion state must reflect the current state of the user's completion records at the time the page loads

**Priority:** Must Have
**Source:** Spec 002, 003, 005

---

### PROGRESS-FR-005 — Read-Only Completed State

Once a lesson has been marked complete, its completion state must be read-only in MVP.

- The completed state cannot be toggled, reversed, or removed in MVP
- The Mark Complete button must transition to a read-only completed indicator on first completion and must not allow the user to unmark it
- No interface element for unmarking, resetting, or toggling lesson completion may be exposed in MVP

**Priority:** Must Have
**Source:** Spec 003 OQ-LE-003 resolved

---

### PROGRESS-FR-006 — No Unmark or Toggle in MVP

The ability to unmark or toggle lesson completion is explicitly out of scope for the MVP.

- No API endpoint, button, or UI element for unmarking lesson completion must be implemented
- If a user attempts to interact with the completed state indicator (e.g., by clicking), no action must result
- This constraint applies regardless of whether the user thinks they made a mistake in marking a lesson complete

**Priority:** Must Have
**Source:** Spec 003 OQ-LE-003 resolved; PRD 11 MVP Explicit Exclusions

---

### PROGRESS-FR-007 — Progress Count Calculation

The count of completed lessons must be correctly computed for display in the Dashboard and Learning Center.

- Completed count = number of published lessons with a completion record for the current authenticated user
- Only lessons with a published status must be counted; completion records for lessons that have since been unpublished must not be included in the count
- The progress count must be derived from a live read of the user's completion records on each page load (OQ-PROG-002 resolved). No caching of completed count, progress summary, or next lesson recommendation is permitted in MVP.

**Priority:** Must Have
**Source:** PRD 13.9 FR-PROG-002; Spec 005 DASH-FR-006; OQ-PROG-002 resolved

---

### PROGRESS-FR-008 — Published Lesson Denominator

The total lesson count used as the denominator in progress display must reflect currently published lessons only.

- Denominator = number of currently published lessons in the IBM i Fundamentals learning path
- The denominator must be computed live on each request from the current published lesson metadata; it must not be hardcoded to 12 and must not be cached (OQ-PROG-002 resolved)
- If 8 lessons are published and the user has completed 3, the progress should be expressed as "3 of 8 lessons completed" not "3 of 12 lessons completed"

**Priority:** Must Have
**Source:** Spec 005 DASH-FR-006; Spec 002 OQ-LC-004 resolved; OQ-PROG-002 resolved

---

### PROGRESS-FR-009 — Next Uncompleted Lesson Calculation

The next recommended lesson must be correctly computed for the Dashboard continue-learning card and lesson navigation.

- Next lesson = the first published lesson in the IBM i Fundamentals sequence (by lesson order) that the current user has not marked complete
- If the user has completed all currently published lessons, there is no next lesson; a path-complete state is returned
- The calculation must use the published lesson sequence (ordered by lesson order metadata) and the user's completion records, computed live on each request (OQ-PROG-002 resolved)

**Priority:** Must Have
**Source:** Spec 005 DASH-FR-007; Spec 003 LESSON-FR-006; OQ-PROG-002 resolved

---

### PROGRESS-FR-010 — Learning Center Lesson Status Display

The Learning Center lesson list must display completion status for authenticated users.

- For each lesson in the lesson list, the Learning Center must indicate whether the lesson is completed or not started, based on the current user's progress records
- Unauthenticated users must not see a completion status indicator; the lesson list shows lesson titles without progress state
- The completion status must be loaded from the same progress data source as all other surfaces

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-003; US-PROG-005

---

### PROGRESS-FR-011 — Dashboard Progress Summary Support

The Progress Tracking implementation must provide the data the Dashboard needs to display the progress summary and continue-learning card.

- The dashboard must be able to retrieve: the authenticated user's completed lesson count, the total published lesson count, and the next uncompleted lesson title and slug
- These values must be computed live from the progress records and lesson metadata on each dashboard load; no caching is used in MVP (OQ-PROG-002 resolved)
- The progress tracking implementation must not require the Dashboard to compute these values independently; they must be derivable from the shared progress records and lesson metadata

**Priority:** Must Have
**Source:** Spec 005 DASH-FR-004, DASH-FR-006, DASH-FR-007; OQ-PROG-002 resolved

---

### PROGRESS-FR-012 — Lesson Page Completed State Support

The Lesson Experience must be able to determine whether a specific lesson has been completed by the current user.

- When a lesson page loads for an authenticated user, the completed state for that specific lesson must be readable
- If completed, the Mark Complete button must be replaced with a read-only completed indicator
- If not completed, the Mark Complete button must be shown and functional
- This per-lesson state must be loaded from the progress records on page load

**Priority:** Must Have
**Source:** Spec 003 LESSON-FR-007, LESSON-FR-008

---

### PROGRESS-FR-013 — Error Handling

The progress tracking implementation must handle failures gracefully.

- If a Mark Complete write fails (e.g., database error, network issue), the lesson page must display a non-disruptive error message and allow the user to retry
- If progress data cannot be read (e.g., database unavailable), the Learning Center and Dashboard must display appropriate fallback states rather than crashing
- A progress read failure on the Dashboard must not prevent the AI Tutor and Learning Center quick links from being accessible (Spec 005 DASH-FR-013)
- Errors must not expose internal technical details to the user

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-003, NFR-REL-005; Spec 003 LESSON-FR-007; Spec 005 DASH-FR-013

---

### PROGRESS-FR-014 — User Data Isolation

Progress records must be strictly scoped to the authenticated user.

- A user must only be able to read their own progress records
- A user must only be able to write to their own progress records
- No user must ever see or be able to modify another user's progress data
- This isolation must be enforced at the database level (e.g., Supabase row-level security or query-level user ID filtering), not only at the application level

**Priority:** Must Have
**Source:** PRD 14.6 NFR-SEC-003; Spec 005 DASH-FR-002

---

### PROGRESS-FR-015 — Draft and Unpublished Lesson Exclusion

Draft and unpublished lessons must be excluded from all progress operations.

- A Mark Complete action against a draft or unpublished lesson must be rejected
- Draft or unpublished lessons must not appear in progress count calculations
- If a lesson was previously published and then unpublished, its completion records must not be included in the active progress count for the user (they may be retained in the database but excluded from queries)

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-013; Spec 003 LESSON-FR-005, LESSON-FR-014

---

### v2.0 Proposed Functional Requirements (Pending Approval — Not Yet Implemented)

The following requirements apply once this amendment, the companion Spec 009 v2.0 amendment, and the companion Spec 002 v2.0 amendment are all approved and implemented. They do not apply to the current production system today.

### PROGRESS-FR-016 — Module-Level Progress Calculation

The completed count and denominator must be computable scoped to a single module.

- Module completed count = number of completion records for the current user where the lesson's `moduleId` matches the target module and the lesson's `status` is Published
- Module denominator = number of currently Published lessons with that `moduleId`
- This calculation must use the same live, uncached computation principle as the existing v1.0 PROGRESS-FR-007

**Priority:** Must Have
**Source:** Spec 009 v2.0 CONTENT-FR-015; US-PROG-010

---

### PROGRESS-FR-017 — Track-Level Progress Calculation

The completed count and denominator must be computable scoped to a single track.

- Track completed count = number of completion records for the current user where the lesson's `trackId` matches the target track and the lesson's `status` is Published
- Track denominator = number of currently Published lessons with that `trackId`
- A track's progress is not simply the sum of its modules' progress values recomputed independently — it must be calculated directly from the same underlying completion records and lesson metadata, to guarantee module-level and track-level numbers are always consistent with each other (no independent recalculation that could drift)

**Priority:** Must Have
**Source:** Spec 009 v2.0 CONTENT-FR-015; US-PROG-010, US-PROG-012

---

### PROGRESS-FR-018 — Recommended-Path Progress Calculation

The recommended beginner path's progress (Spec 002 v2.0 Section 6) must be computable as a roll-up across its constituent tracks.

- Recommended-path completed count = sum of completed counts across the specific tracks that make up the recommended path (at the time of this amendment: Tracks 1 through 5, per `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` Phase 1)
- Recommended-path denominator = sum of Published lesson counts across those same tracks
- The set of tracks that make up the recommended path is itself a piece of configuration, not hardcoded lesson IDs — if the Product Owner changes which tracks constitute the recommended path, this calculation must reflect that without a code change to the calculation logic itself
- This calculation must produce the same numeric result as today's v1.0 single-path calculation for as long as only Track-1-equivalent content exists, satisfying the backward-compatibility principle in Section 2.1

**Priority:** Must Have
**Source:** Spec 002 v2.0 Section 6; US-PROG-011

---

### PROGRESS-FR-019 — Dynamic Per-Scope Denominators

This generalizes v1.0 PROGRESS-FR-008 (Published Lesson Denominator) from a single curriculum-wide count to any track or module scope.

- Every denominator described in PROGRESS-FR-016 through PROGRESS-FR-018 must be computed live from current lesson metadata on each request; none may be hardcoded or cached
- Adding a new Published lesson to any track or module must be immediately reflected in that track's and module's denominator on the next page load, with no code change required
- This requirement does not change v1.0 PROGRESS-FR-008 itself; it extends the same principle to the new scopes introduced by this amendment

**Priority:** Must Have
**Source:** v1.0 PROGRESS-FR-008; US-PROG-013

---

### PROGRESS-FR-020 — Multi-Track Aggregate Progress (Lower Priority)

An overall completion figure across every track a user has engaged with may optionally be computed and displayed in a future phase.

- This is explicitly **not required** for Phase 1 or Phase 2 of the curriculum blueprint and should not be built as part of this amendment's initial implementation
- If built in a future phase, it must follow the same live-calculation, no-caching principle as every other progress value in this spec
- Whether this is ever surfaced to users at all is an open product decision (OQ-PROG-004) — this requirement describes how it would be calculated *if* the Product Owner decides to build it, not a commitment to build it

**Priority:** Could Have (deferred)
**Source:** planning/CURRICULUM_EXPANSION_BLUEPRINT.md Section 5; OQ-PROG-004

---

## 8. Non-Functional Requirements

### NFR: Security

- All progress read and write operations must be performed by authenticated users only
- The authenticated user ID from the session must be used as the filter on all database queries; hardcoded or user-supplied user IDs must not be used
- Row-level security (Supabase RLS) or equivalent server-side filtering must ensure a user cannot access another user's progress records by constructing a direct query
- The Mark Complete API endpoint must verify authentication before writing any record

**Source:** PRD 14.6 NFR-SEC-001, NFR-SEC-003

---

### NFR: Privacy

- Progress records contain only the minimum data required: user ID, lesson ID, learning path ID, and completion timestamp
- No sensitive data, lesson content, or user behavior beyond completion state is stored in progress records
- Progress records are associated with the user's Supabase Auth user ID; no personally identifiable data other than the user ID is stored in the progress record itself

**Source:** PRD 14.7 NFR-PRIV-001

---

### NFR: Reliability

- The Mark Complete action must persist reliably; a successful response must indicate that the record has been durably stored
- After a progress state change, surfaces that reload or refresh their progress data must show the updated completed state consistently. Real-time synchronization across multiple already-open tabs is not required in MVP.
- If the database is temporarily unavailable, the product must degrade gracefully; users should see appropriate error messages rather than silent data loss

**Source:** PRD 14.4 NFR-REL-001, NFR-REL-003, NFR-REL-005

---

### NFR: Performance

- Progress data reads for the dashboard (completed count, next lesson) must be efficient enough not to add meaningful latency to dashboard load time
- The Mark Complete action must respond within a reasonable time to give users immediate confirmation
- If multiple progress reads are needed for a single page (e.g., lesson status for a full lesson list), they should be batched or resolved efficiently

**Source:** PRD 14.3 NFR-PERF-002

---

### NFR: Maintainability

- The progress tracking implementation must be the single source of truth for lesson completion data; other specs (Learning Center, Dashboard, Lesson Experience) must read from the same progress records and must not maintain their own parallel progress models
- Changes to the progress data model (e.g., adding a `started` state in a future version) should be possible without breaking existing completion records

**Source:** PRD 14.13 NFR-MAIN-004

---

### NFR: Accessibility

- The Mark Complete button and the completed state indicator must meet accessibility requirements defined in Spec 003 (LESSON-FR-007, NFR Accessibility)
- Progress count display on the dashboard and lesson list must not rely on color alone to convey completion state

**Source:** PRD 14.10 NFR-ACC-001, NFR-ACC-004

---

## 9. Progress Data Requirements

This section defines the data attributes needed for the MVP progress tracking implementation at the spec level. This is not a database schema. The specific implementation will be defined in the implementation plan.

### Progress Record Attributes

| Attribute | Purpose | Notes |
|---|---|---|
| User ID | Associates the completion record with the authenticated user | Foreign key to the Supabase Auth user; never null |
| Lesson ID | Identifies which lesson was completed | Must reference a published lesson; draft lessons must not have records |
| Learning path ID | Identifies which learning path the lesson belongs to | Supports future multi-path scenarios; IBM i Fundamentals for all MVP records |
| Completed timestamp | When the lesson was marked complete | Required; used for future analytics if needed |
| Created timestamp | When the record was first created | May be the same as completed timestamp in MVP |

### Key Data Principles

- Passwords are not involved in progress tracking. Authentication is handled by Supabase Auth separately.
- Progress records must always be scoped to the authenticated user. No record should be writable or readable without a valid authenticated user ID.
- Only published lessons should count toward the progress count and denominator. Completion records for unpublished lessons must be excluded from progress calculations.

### What Is Not Stored in MVP Progress Records

- Time spent on a lesson
- Number of times a lesson was viewed
- Quiz scores or assessment results
- Lesson rating or feedback (feedback is a separate feature)
- Any lesson content or user-generated notes

### v2.0 Proposed Progress Data Requirements (Pending Approval)

- The "Learning path ID" attribute above generalizes to referencing a lesson's `trackId` and `moduleId` (Spec 009 v2.0 Section 11.3), rather than a single implicit path
- **Implementation open question, not resolved here:** whether the progress record itself should denormalize a copy of the lesson's `trackId`/`moduleId` at write time (for query efficiency at scale) or whether track/module scoping should always be computed by joining against current lesson metadata at read time (simpler, always up to date, but potentially less efficient as the curriculum grows). This is an implementation-plan decision, not a spec-level one — flagged here so it is not overlooked (OQ-PROG-005)
- No new data is stored beyond what v1.0 already stores (user ID, lesson ID, completion timestamp, created timestamp); this amendment changes how existing data is *interpreted and scoped* for calculation purposes, not what is captured

---

## 10. Progress Calculation Rules

This section defines the precise calculations the Progress Tracking implementation must support. These rules must be implemented consistently across all surfaces.

### Completed Count

> Completed count = count of completion records for the current authenticated user where the lesson status is published

### Denominator (Total Lesson Count)

> Denominator = count of published lessons in the IBM i Fundamentals learning path at the time of the request

The denominator is dynamic — it updates automatically as lessons are published. It must not be hardcoded.

### Progress Display

> Progress display = "[completed count] of [denominator] lessons completed"

Example: if 8 lessons are published and the user has completed 3, display "3 of 8 lessons completed."

### Next Uncompleted Lesson

> Next lesson = the published lesson with the lowest order value that does not have a completion record for the current user

If all published lessons have completion records, the result is: path complete (no next lesson).

### Path Complete State

> Path complete = true if completed count equals denominator (all currently published lessons are completed)

If new lessons are published later, the path complete state may revert to false even for users who previously completed all available lessons. This is expected behavior.

### Progress Display Format

> Progress display = "[completed count] of [published lesson count] lessons completed"

MVP uses count-based display only (OQ-PROG-003 resolved). Progress percentage is not shown in MVP. A visual progress bar may be added in a later phase if separately approved, but MVP acceptance criteria rely on the count-based display.

### v2.0 Proposed Calculation Rules (Pending Approval)

These generalize the v1.0 rules above from "the one path" to any track or module scope. The v1.0 rules remain correct as the special case where the scope is "the whole curriculum."

**Module Completed Count**

> Module completed count = count of completion records for the current authenticated user where the lesson's `moduleId` matches the target module and the lesson's `status` is Published

**Module Denominator**

> Module denominator = count of Published lessons with the target `moduleId` at the time of the request

**Track Completed Count**

> Track completed count = count of completion records for the current authenticated user where the lesson's `trackId` matches the target track and the lesson's `status` is Published

**Track Denominator**

> Track denominator = count of Published lessons with the target `trackId` at the time of the request

**Recommended-Path Completed Count**

> Recommended-path completed count = sum of track completed counts across the tracks configured as the recommended path (Spec 002 v2.0 Section 6)

**Recommended-Path Denominator**

> Recommended-path denominator = sum of track denominators across those same tracks

**Backward-compatibility check:** as long as the recommended path's configured tracks are exactly the tracks seeded from today's 12 lessons (Spec 009 v2.0 Section 5B), the Recommended-Path Completed Count and Denominator above evaluate to the exact same numbers as the v1.0 Completed Count and Denominator formulas. No user-visible progress number changes on the day this amendment is approved.

**Display format:** all v2.0 scopes use the same count-based format already approved in v1.0 (Section 10 "Progress Display Format" above) — no percentage, no new display format introduced by this amendment.

**Multi-track aggregate (deferred, PROGRESS-FR-020):** not defined here, since whether it is ever built is an open product decision (OQ-PROG-004).

---

## 11. UX Requirements

The following UX requirements define how progress tracking data surfaces in the product. Implementation details for each surface are defined in their respective specs; this section defines the shared expectations across surfaces.

### Mark Complete Button Behavior

- The Mark Complete button appears at the bottom of lesson pages for authenticated users on lessons they have not yet completed (Spec 003 LESSON-FR-007)
- Clicking the button triggers the PROGRESS-FR-002 write action
- After a successful write, the button transitions to a read-only completed state immediately
- The completed state indicator must be visually distinct from the active Mark Complete button (e.g., different text, icon, or disabled styling)

### Completed State Display on Lesson Page

- When a lesson has been marked complete, the Mark Complete area shows a read-only "Completed ✓" or equivalent indicator
- The completed state indicator is not interactive — clicking it does nothing
- The completed state must load on page entry without requiring any user action

### Learning Center Lesson Status Indicators

- Each lesson entry in the Learning Center lesson list must show a status indicator for authenticated users
- Completed lessons: a visual indicator (e.g., checkmark, "Completed" label)
- Not started lessons: no completion indicator (or a neutral/empty state indicator)
- Unauthenticated users: no status indicators are shown

### Dashboard Progress Summary

- The Dashboard progress summary shows the completed count and denominator using the approved count-based format: "[completed count] of [published lesson count] lessons completed" (OQ-PROG-003 resolved)
- No progress percentage is displayed in MVP
- A secondary note may be shown during beta when fewer than 12 lessons are published (e.g., "More lessons are being added")

### Continue Learning State

- The Dashboard continue-learning card shows the next uncompleted lesson as calculated in Section 10 (PROGRESS-FR-009)
- If the user has completed all available lessons, a path-complete message is shown

### Error Message If Mark Complete Fails

- If the Mark Complete write fails, a non-disruptive error message must appear near the Mark Complete area
- The error message must be user-friendly (e.g., "Couldn't save your progress. Please try again.")
- The Mark Complete button must remain available for retry

### Loading State for Progress

- While progress data is being loaded, a loading indicator must appear in place of the progress summary and completion status indicators
- The loading state must resolve quickly; if it takes too long, an error state should be shown

### No Progress UI for Unauthenticated Users

- Mark Complete button: not shown; replaced by a login/sign-up prompt where the button would appear
- Lesson list completion indicators: not shown for unauthenticated users
- Dashboard progress summary: not applicable; the dashboard requires authentication

### v2.0 Proposed UX Requirements (Pending Approval)

- **Track and module progress indicators** appear on the Learning Center's track catalog and module listing pages (Spec 002 v2.0), using the same count-based format as v1.0 (e.g., "3 of 7 lessons completed")
- **Recommended-path progress** appears as one number on the recommended-path entry point (Spec 002 v2.0 Section 6), computed per PROGRESS-FR-018, so a new user's experience looks identical in form to today's v1.0 dashboard progress summary
- **No new visual pattern is introduced** — track/module/path progress reuses the existing count-based, non-percentage display approved in v1.0 (OQ-PROG-003 resolved); this amendment does not reopen that decision
- **Loading and error states** for track/module/path progress follow the same patterns already approved in v1.0 (loading indicator, non-disruptive error message)

---

## 12. Access Rules

| Operation | Authenticated User | Unauthenticated User |
|---|---|---|
| Create a completion record (Mark Complete) | Allowed for published lessons only | Blocked; login prompt shown |
| Read own completion records | Allowed | Blocked |
| Read another user's completion records | Blocked (data isolation enforced) | Blocked |
| Delete or modify a completion record | Not supported in MVP | Not supported in MVP |
| Mark a draft/unpublished lesson complete | Blocked | Blocked |

All access rules must be enforced server-side. Client-side enforcement is not sufficient.

**v2.0 note:** these access rules are unchanged by the multi-track model. Track/module scoping affects how progress is *calculated and displayed*, not who is allowed to read or write it.

---

## 13. Dependencies

The Progress Tracking feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Database | Supabase PostgreSQL — progress records are stored here | ADR-003 |
| Authentication | Supabase Auth — user identity for scoping all progress operations | ADR-004 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 003: Lesson Experience | Triggers the Mark Complete write action; reads completed state per lesson on page load |
| Spec 002: Learning Center | Reads progress data to display completion status per lesson in the lesson list |
| Spec 005: Dashboard | Reads progress data to display the progress summary and next lesson in the continue-learning card |
| Spec 004: User Account and Onboarding | Provides the authenticated user identity that scopes all progress operations |

### v2.0 Companion Amendments (Pending Approval)

| Spec | Role |
|---|---|
| Spec 009: Content Governance (v2.0) | Source of `trackId`/`moduleId` on lesson metadata that this spec's v2.0 calculations key off of |
| Spec 002: Learning Center (v2.0) | Displays the track/module/recommended-path progress values this spec computes; defines which tracks make up the recommended path (PROGRESS-FR-018) |

### v2.0 Planning Dependency (Not a Spec)

| Document | Role |
|---|---|
| planning/CURRICULUM_EXPANSION_BLUEPRINT.md | Defines the track structure and Phase 1 recommended-path track set this spec's calculations reference |

---

## 14. Acceptance Criteria

The Progress Tracking feature is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Core Completion Behavior

- [ ] An authenticated user can mark a published lesson complete from the lesson page
- [ ] After marking complete, the lesson page shows a read-only completed state
- [ ] Marking a lesson complete a second time does not create a duplicate record; the idempotent behavior is confirmed
- [ ] An unauthenticated user cannot mark a lesson complete; a login prompt is shown instead of the Mark Complete button
- [ ] A draft or unpublished lesson cannot be marked complete

### Persistence

- [ ] A user who marks lessons complete and returns in a new browser session still sees their lessons as completed
- [ ] The completed state is consistent across the Lesson Experience, Learning Center, and Dashboard surfaces

### Progress Summary

- [ ] The Dashboard shows the correct completed lesson count for the authenticated user
- [ ] The denominator is the number of currently published lessons, not a hardcoded value of 12
- [ ] If 8 lessons are published and the user completed 3, the display shows "3 of 8 lessons completed" using the approved count-based format (no percentage)
- [ ] The Learning Center lesson list shows completed/not-started status for authenticated users

### Continue Learning

- [ ] The Dashboard continue-learning card shows the correct next uncompleted lesson in the sequence
- [ ] If all available published lessons are completed, the Dashboard shows a path-complete message

### Data Isolation

- [ ] A user cannot see another user's progress records
- [ ] All progress queries are scoped to the authenticated user's ID at the database level

### No Unsupported Features

- [ ] No option to unmark or toggle lesson completion is present in MVP
- [ ] No quiz scores, streaks, badges, or detailed analytics are present
- [ ] No admin or team progress views are present

### v2.0 Acceptance Criteria (Pending Approval — Not Yet Implemented)

- [ ] This amendment, the companion Spec 009 v2.0 amendment, and the companion Spec 002 v2.0 amendment are all approved
- [ ] Module-level completed count and denominator are correctly computed and match Section 10's v2.0 formulas
- [ ] Track-level completed count and denominator are correctly computed and are always consistent with the sum of their modules' values
- [ ] Recommended-path progress is correctly computed as a roll-up across its configured tracks
- [ ] On the day this amendment is deployed, existing users see no change to their currently displayed progress numbers (backward-compatibility check, Section 10 v2.0)
- [ ] All new denominators are computed live and are never hardcoded, matching the existing v1.0 principle
- [ ] OQ-PROG-004 and OQ-PROG-005 are resolved (or explicitly deferred with a documented interim decision) before implementation

---

## 15. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Duplicate completion records — race condition or retry creates more than one record per user/lesson | Low | Medium | Use the approved idempotent insert-if-missing approach backed by a uniqueness rule on user ID + lesson ID (PROGRESS-FR-002, PROGRESS-FR-003; OQ-PROG-001 resolved) |
| Incorrect progress denominator when lessons are published gradually — denominator uses wrong lesson count | Medium | Medium | PROGRESS-FR-008 requires the denominator to be computed dynamically from published lesson count; test with 8 lessons and again after adding more |
| User data leakage — one user's progress visible to another | Low | High | Enforce row-level security (Supabase RLS) or server-side user ID filtering on all queries; test with multiple user accounts before beta |
| Mark Complete failure — database write fails silently | Low | Medium | PROGRESS-FR-013 requires a retry-able error state; test failure scenarios explicitly during QA |
| Dashboard and Learning Center calculating progress differently — each feature implements its own progress model | Medium | High | PROGRESS-FR-004 and PROGRESS-FR-011 require a single shared implementation; the implementation plan must enforce a single data source |
| Scope creep into analytics, streaks, or badges during implementation | Medium | Medium | This spec explicitly excludes these; any addition requires Product Owner approval and a PRD update |

### v2.0 Risks and Mitigations (Pending Approval)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Track-level and module-level progress drift out of sync (e.g., a bug makes them disagree) | Low | High | PROGRESS-FR-017 requires track progress to be computed from the same underlying records as module progress, not independently re-derived; test with multi-module tracks explicitly |
| Existing users see their progress number change unexpectedly when this amendment ships | Low | High | Section 10 v2.0's backward-compatibility formula guarantees identical output while only Track-1-equivalent content exists; this must be verified with a regression test comparing pre- and post-migration progress values for existing test accounts |
| Recommended-path track configuration drifts from what Spec 002 actually displays as "the recommended path" | Low | Medium | PROGRESS-FR-018 and Spec 002 v2.0 Section 6 must reference the same configured track set; the implementation plan should define this set in one shared location, not duplicate it in both features |
| Pressure to build multi-track aggregate progress (PROGRESS-FR-020) before it's actually needed | Medium | Low | This requirement is explicitly marked deferred/lower-priority; building it prematurely is scope creep against this amendment's own stated priority |

---

## 16. Open Questions

**v1.0 questions:** No open questions remain for the v1.0 scope.

**v2.0 open questions (new — must be resolved before implementation):**

- **OQ-PROG-004:** Should overall multi-track aggregate progress (PROGRESS-FR-020) ever be surfaced to users, or should progress always be shown scoped to a track/module/recommended-path and never as one curriculum-wide figure? (Mirrors Spec 009 v2.0 OQ-CONTENT-006 — the same open question, tracked here since it determines whether PROGRESS-FR-020 is ever implemented.)
- **OQ-PROG-005:** Should progress records denormalize a copy of `trackId`/`moduleId` at write time for query efficiency, or should track/module scoping always be computed by joining against current lesson metadata at read time? This is an implementation-plan-level decision but is flagged here so it isn't decided ad hoc during coding.

Any new questions discovered during implementation planning should be added here before coding begins.

---

## 17. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any Progress Tracking implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope, calculation rules, and access control requirements
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for Progress Tracking is created and approved
- [ ] Spec 004 (User Account and Onboarding) is implemented — user identity is required for all progress operations
- [ ] Database table design for progress records has been reviewed and approved (in the implementation plan)
- [ ] Row-level security or server-side user ID filtering is confirmed to be part of the implementation design before any progress queries are written

### Notes for Implementation Planning

- Progress Tracking is a shared dependency for Spec 002, 003, and 005. Its implementation should be prioritized early in Sprint 1 so that the Lesson Experience, Learning Center, and Dashboard can all depend on it.
- The single source of truth principle (PROGRESS-FR-004) is critical. The implementation plan must not allow individual specs to compute progress independently; all progress reads must go through the approved Progress Tracking implementation.
- Idempotency (PROGRESS-FR-003) must be enforced via the approved uniqueness rule on user ID + lesson ID at the data layer, not only in application logic, to prevent race condition duplicates.
- The dynamic denominator (PROGRESS-FR-008) must be computed from a live count of published lessons; the implementation must not hardcode the value 12.

### v2.0 SDD Handoff Notes (Pending Approval — Not Yet Implemented)

**Before this amendment authorizes any implementation:**

- [ ] The Product Owner has reviewed and approved this v2.0 amendment in full, including OQ-PROG-004 and OQ-PROG-005
- [ ] The companion Spec 009 v2.0 amendment and Spec 002 v2.0 amendment are also approved — these three specs must move together
- [ ] The set of tracks that make up the recommended beginner path (PROGRESS-FR-018) is confirmed and matches what Spec 002 v2.0 displays

**Notes for implementation planning:**

- The single-source-of-truth principle (PROGRESS-FR-004, unchanged) applies with equal force to the new track/module/recommended-path scopes: Spec 002's v2.0 UI must read these values from this spec's implementation, not recompute them independently.
- Before writing any migration code, implementation planning should design and test the backward-compatibility check from Section 10 v2.0 against real existing test-account data, to catch any discrepancy before it reaches production users.
- This amendment intentionally does not touch Spec 003 (Lesson Experience) or Spec 005 (Dashboard). Spec 003's per-lesson Mark Complete behavior is unaffected by track/module scoping. If Spec 005's dashboard needs to display per-track progress summaries (beyond the existing single progress summary), that should be scoped as its own amendment once this one is approved, not folded in here.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP Progress Tracking spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 002–005 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved idempotency, live calculation, and progress display decisions |
| 2026-07-01 | 1.0 | Approved Progress Tracking SDD spec for implementation planning |
| 2026-07-14 | 2.0-draft | Amendment draft generalizing progress calculation to module-level, track-level, and recommended-path scopes, with dynamic per-scope denominators. Companion to Spec 009 v2.0 and Spec 002 v2.0. Includes an explicit backward-compatibility guarantee: no user's displayed progress number changes while only today's single-path-equivalent content exists. All v1.0 content preserved and labeled; nothing in production changes until all three amendments are approved and implemented together. Pending Product Owner review. |
