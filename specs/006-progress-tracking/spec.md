# Spec 006: Progress Tracking

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 006 |
| Feature | Progress Tracking |
| Status | Approved |
| Version | 1.0 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center lesson status display reference |
| specs/003-lesson-experience/spec.md | v1.0 Approved | Mark Complete behavior and completed state reference |
| specs/004-user-account-and-onboarding/spec.md | v1.0 Approved | Authentication identity reference |
| specs/005-dashboard/spec.md | v1.0 Approved | Dashboard progress summary requirements |
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

---

## 16. Open Questions

No open questions remain for this spec at this stage. Any new questions discovered during implementation planning should be added here before coding begins.

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

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP Progress Tracking spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 002–005 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved idempotency, live calculation, and progress display decisions |
| 2026-07-01 | 1.0 | Approved Progress Tracking SDD spec for implementation planning |
