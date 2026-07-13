# Spec 002: Learning Center

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 002 |
| Feature | Learning Center |
| Status | v1.0 Approved (current production baseline) — **v2.0 Amendment Draft, Pending Product Owner Review** |
| Version | 1.0 (Approved) → 2.0 (Draft, this revision) |
| Owner | Product + Engineering |
| Last Updated | 2026-07-14 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| planning/CURRICULUM_EXPANSION_BLUEPRINT.md | v0.1 Draft | Source of the multi-track curriculum model this v2.0 amendment adopts |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL and content storage decisions |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor integration reference |
| specs/009-content-governance/spec.md | v1.0 Approved → v2.0 Draft (companion amendment) | Lesson metadata model this spec reads from, including the v2.0 `trackId`/`moduleId`/`difficulty` fields |

---

## 2. Purpose

The Learning Center is the core structured learning experience of the IBMiHub AI MVP. It is the primary reason a beginner visits the product and the first place a working developer goes to refresh foundational IBM i knowledge.

Without the Learning Center, IBMiHub AI is only an AI chatbot. The Learning Center gives the product its structured, curriculum-driven identity — it is what distinguishes IBMiHub AI from a generic Q&A tool and grounds the AI Tutor in a learning context.

The Learning Center exists in the MVP to:

- Give beginners a clear, guided starting point for learning IBM i
- Provide a structured sequence of original lessons that build understanding progressively
- Give working developers quick access to foundational refresher content
- Support basic progress tracking so users know where they are and what comes next
- Validate the core product assumption that users prefer guided structured learning over disconnected article discovery

This spec defines the MVP scope, requirements, content model, UX requirements, acceptance criteria, and implementation boundaries for the Learning Center feature.

### 2.1 Amendment Notice — v2.0 (Multi-Track Curriculum)

This revision amends the v1.0 Approved spec to support the multi-track curriculum defined in `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` and formalized into content governance by the companion Spec 009 v2.0 amendment. Every v1.0 requirement is preserved and labeled; new v2.0 material is added alongside it and also labeled.

**Nothing changes in the live product as a result of this document.** The current single "IBM i Fundamentals" path, its route structure, and every currently-approved rule in this spec remain exactly as they are today until this amendment, the companion Spec 009 v2.0 amendment, and the companion Spec 006 v2.0 amendment are all approved and implemented together. This spec does not authorize any code change by itself.

---

## 3. MVP Scope

The MVP Learning Center provides a single guided learning path — IBM i Fundamentals — consisting of up to 12 original lessons, with a minimum of 8 complete and reviewed lessons required before beta launch.

### In Scope for MVP

| Capability | Description |
|---|---|
| IBM i Fundamentals learning path | One approved learning path consisting of ordered lessons covering foundational IBM i concepts (D-CONT-001) |
| Target 12 lessons; minimum 8 for beta | The full path targets 12 lessons; beta can launch with a minimum of 8 complete and reviewed lessons (D-PROD-002) |
| Lesson list display | The Learning Center page shows the IBM i Fundamentals path and its ordered list of lessons |
| Lesson ordering | Lessons are presented in a fixed, intentional sequence aligned with the approved lesson list |
| Lesson status display | Each lesson in the list displays whether it has been completed or not yet started (for authenticated users) |
| Lesson access and navigation | Users can open any lesson; navigate to previous and next lessons within the path |
| First lesson preview without login | The first lesson (What is IBM i?) is accessible to unauthenticated users as a preview; remaining lessons require login (D-PROD-005) |
| Authenticated progress tracking | Lesson completion state is stored per authenticated user; progress is displayed on the lesson list and dashboard |
| Mark complete behavior | At the end of each lesson, the user can explicitly mark the lesson as complete |
| Link to AI Tutor | Each lesson provides access to the AI Tutor so users can ask questions during or after reading a lesson |
| Version-controlled content | Lesson content is stored as plain Markdown (.md) files in the repository, not in a database (ADR-003) |
| Lesson metadata management | Lesson metadata (title, slug, order, description, status, estimated reading time) is managed separately from lesson body content |

### v2.0 Proposed Scope Additions (Pending Approval — Not Yet Implemented)

| Capability | Description |
|---|---|
| Track listing | A browsable list of all approved tracks (Spec 009 v2.0 Section 5), each showing its name, a short description, and lesson/completion counts |
| Module listing within a track | Opening a track shows its modules in order, each with its lessons |
| Lesson listing within a module | Generalizes today's flat lesson list (Section 6) to a module-scoped list, ordered by `lessonOrder` within the module |
| Difficulty indicators | Each lesson and each track displays a Beginner/Intermediate/Advanced indicator (or a span, for tracks) |
| Per-track and per-module progress indicators | Authenticated users see completion progress scoped to a track and to a module, not only one flat curriculum-wide count (companion Spec 006 v2.0 amendment) |
| First recommended beginner path | A curated, linear entry sequence for new users who don't yet want to browse the full track catalog (Section 6, v2.0 subsection) |
| Migration display continuity | The existing 11 retained lessons and their URLs continue to work exactly as today, now displayed under their migrated track/module (Spec 009 v2.0 Section 5B) |

**Everything currently out of scope for v1.0 (Section 4) remains out of scope under v2.0** unless explicitly listed above. In particular: no CMS, no quizzes, no certifications, no interactive lab, and no admin dashboard are introduced by this amendment.

---

## 4. Explicitly Out of Scope for MVP

The following capabilities must not be included in the MVP Learning Center implementation.

| Excluded Capability | Reason |
|---|---|
| Full content management system (CMS) | Out of scope for MVP (PRD 12, ADR-003) |
| Content authoring or editing UI | MVP uses Git-based content workflow; no author UI required |
| Quizzes and knowledge checks | Deferred to post-MVP (D-PROD-003) |
| Standalone glossary feature | Deferred to post-MVP (D-PROD-004) |
| Certifications or completion badges | Future feature (PRD 11 full scope) |
| Interactive 5250 practice lab | Future feature (PRD 11, Phase 4) |
| RPG playground | Future feature (PRD 11, Phase 4) |
| Job log analyzer feature | Future feature (PRD 11, Phase 4) |
| Real IBM i system connectivity | Explicitly prohibited in MVP (PRD 18.14) |
| Lesson-aware AI integration | Deferred to post-MVP (D-AI-003, Spec 001) |
| Paid or premium learning paths | Billing is out of scope for MVP (PRD 17.2, 18.16) |
| Team or enterprise learning paths | Future feature (PRD 11) |
| Admin dashboard or content management UI | Out of scope for MVP (PRD 18.17) |
| Multi-language lesson content | MVP is English-only (PRD 14.17) |
| User-generated lesson content | Future feature |
| Mobile application | Future feature (PRD 11) |
| Video lessons | Not in MVP curriculum plan |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A user who is new to IBM i and has little or no prior experience. The Learning Center is their primary entry point into the product. They benefit from:

- A clearly visible, guided starting point — they do not need to guess where to begin
- An ordered sequence of lessons that builds understanding step by step
- The ability to mark each lesson complete and see their progress
- The ability to ask the AI Tutor questions when a lesson concept is unclear

The Learning Center must make this persona feel that learning IBM i is approachable rather than overwhelming.

### Persona 2: Working IBM i Developer

A user who already works with IBM i systems but uses the Learning Center to refresh foundational concepts or explore areas they do not use regularly. This user may:

- Navigate directly to a specific lesson rather than starting from Lesson 1
- Use the lesson content as a quick reference for terminology or concepts
- Link from a lesson to the AI Tutor for a practical follow-up question

The Learning Center should not force this persona into a beginner-only flow, though the MVP primarily targets beginners.

---

## 6. Approved Learning Path

The IBM i Fundamentals learning path is the only approved learning path for the MVP.

### IBM i Fundamentals

| # | Lesson Title | Notes |
|---|---|---|
| 1 | What is IBM i? | First lesson; available as unauthenticated preview |
| 2 | Why IBM i still matters | Motivation and context |
| 3 | IBM i platform overview | Core architecture and components |
| 4 | Libraries and objects | Core IBM i concept |
| 5 | 5250 screen basics | Terminal interface fundamentals |
| 6 | Physical files and logical files | Data storage concepts |
| 7 | Introduction to RPGLE | First development language introduction |
| 8 | Introduction to CLLE | Control language introduction |
| 9 | Introduction to DB2 for i | Database fundamentals |
| 10 | Job logs and spool files basics | Operational concepts |
| 11 | Basic IBM i development workflow | End-to-end practical context |
| 12 | Where to go next | Closing lesson; points to further learning |

**Beta launch threshold:** At least 8 complete, reviewed, and approved lessons must be available before the MVP beta releases. Lessons 1 through 8 are the recommended minimum set, as they cover the most foundational topics and provide a coherent beginner learning path.

### v2.0 Proposed Multi-Track Structure (Pending Approval)

The authoritative track list is defined in Spec 009 v2.0 Section 5; this spec does not duplicate it. This subsection defines how the Learning Center presents that structure.

**Track listing.** The Learning Center's top level becomes a list of all approved tracks (16 at the time of this amendment — see Spec 009 v2.0 Section 5), each showing: track name, a one-to-two sentence description, difficulty span, and (for authenticated users) a completion count scoped to that track.

**First recommended beginner path.** New and undecided users should not have to choose from 16 tracks on their first visit. The Learning Center must present one curated, linear recommended sequence as the default starting point — functionally, the direct successor to today's single "IBM i Fundamentals" path. This recommended path is the beginner spine defined in `planning/CURRICULUM_EXPANSION_BLUEPRINT.md` Phase 1: Tracks 1 (IBM i Foundations) → 2 (5250 Terminal and Core Commands) → 3 (Libraries, Objects, and the IFS) → 4 (Db2 for i, DDS, Physical Files, and Logical Files) → 5 (RPGLE Beginner), presented as one continuous sequence even though it spans five tracks internally. The full track catalog remains browsable alongside it for users who want to jump directly to a specific track (e.g., a working developer going straight to Track 11: SQL for IBM i).

- **What this recommended path should be called in the product UI is an open question (OQ-LC-006, Section 15) — this spec does not resolve it.** It may continue to be called "IBM i Fundamentals," or it may need a new name now that it spans multiple tracks internally. Implementation should not proceed on a specific name until this is resolved.
- The recommended path's progress is a roll-up across its five constituent tracks (Spec 006 v2.0 PROGRESS-FR-018), not a separate, independently-tracked entity.

**Migration display continuity.** The 11 retained lessons (Spec 009 v2.0 Section 5B) must continue to resolve at their existing URLs and display with all their existing content unchanged. Only their track/module placement in the Learning Center's navigation changes. The one rewritten lesson ("Where to go next") should, once rewritten, route learners from the end of the recommended path into the broader track catalog, matching its new role as a track-catalog gateway rather than a dead end.

---

## 7. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-LC-001 | Beginner IBM i Learner | Open the Learning Center and see the IBM i Fundamentals path | I know where to start learning IBM i |
| US-LC-002 | Beginner IBM i Learner | See an ordered list of lessons with clear titles | I understand the structure and sequence of what I will learn |
| US-LC-003 | Any user | Preview the first lesson (What is IBM i?) without creating an account | I can evaluate the content quality before committing to sign-up |
| US-LC-004 | Unauthenticated visitor | See a prompt to create an account when I try to access a lesson beyond the first | I know I need an account to continue |
| US-LC-005 | Beginner IBM i Learner | Create an account and return to see my lesson progress saved | I can continue learning across sessions |
| US-LC-006 | Authenticated user | Mark a lesson as complete after reading it | I can track my progress through the IBM i Fundamentals path |
| US-LC-007 | Authenticated user | See which lessons I have completed and which are still to do | I can quickly resume where I left off |
| US-LC-008 | Any user | Navigate to the next lesson at the end of a lesson | I can continue learning without returning to the lesson list |
| US-LC-009 | Any user | Navigate to the previous lesson | I can revisit earlier content without searching |
| US-LC-010 | Any user | Access the AI Tutor from a lesson page | I can ask a question about what I just read without leaving the learning flow |
| US-LC-011 | Working IBM i Developer | Open a specific lesson directly from the lesson list | I can quickly access the specific content I want to refresh |

### v2.0 Proposed User Stories (Pending Approval)

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-LC-012 | Absolute beginner | See one recommended path when I first arrive, not a list of 16 tracks | I'm not overwhelmed by choice before I've learned anything |
| US-LC-013 | Working IBM i Developer | Browse the full track catalog and jump directly into a specific track (e.g., SQL for IBM i) | I can refresh exactly the skill I need without walking through beginner content |
| US-LC-014 | Any authenticated user | See my progress broken down by track and by module | I understand exactly how far along I am in the specific skill I'm building, not just one flat number |
| US-LC-015 | Any user | See a difficulty indicator on a track or lesson before opening it | I can judge whether content matches my current skill level |
| US-LC-016 | Developer preparing for interviews | Find the Interview and Professional Readiness track easily from the track catalog | I can focus my remaining study time on interview-specific content |

---

## 8. Functional Requirements

### LEARNING-FR-001 — Learning Center Landing Page

The product must provide a Learning Center page that serves as the entry point for structured learning.

- The Learning Center page must display the IBM i Fundamentals learning path
- The page must be publicly accessible (no login required to view the Learning Center)
- The page must show a description or summary of the IBM i Fundamentals path
- The page must link to the lesson list or first lesson of the path

**Priority:** Must Have
**Source:** PRD 13.6 FR-LEARN-001

---

### LEARNING-FR-002 — Learning Path Display

The Learning Center must display the IBM i Fundamentals learning path in a way that communicates its purpose, structure, and approximate scope.

- The path must have a clear name: IBM i Fundamentals
- The path must show the number of lessons available
- The path should show a brief description of what the learner will understand after completing it
- For authenticated users, the path should show overall progress (e.g., 3 of 12 lessons completed)

**Priority:** Must Have
**Source:** PRD 13.6 FR-LEARN-002, FR-LEARN-008

---

### LEARNING-FR-003 — Lesson List Display

The Learning Center must display an ordered list of lessons within the IBM i Fundamentals path.

- Lessons must be displayed in the approved sequence (see Section 6)
- Each lesson in the list must show: lesson number, lesson title, and a short description
- Each lesson in the list must show its completion status for authenticated users (completed / not started)
- Lesson ordering must be fixed and cannot be reordered by the user
- Unauthenticated users may see the lesson list but do not see completion state

**Priority:** Must Have
**Source:** PRD 13.6 FR-LEARN-003, FR-LEARN-005; D-CONT-001

---

### LEARNING-FR-004 — Lesson Access

Lesson access is governed by authentication status and lesson publication state.

- **Lesson 1 (What is IBM i?)** is fully accessible to unauthenticated users. No login is required to read the full content of Lesson 1.
- **All published lessons beyond Lesson 1** require authentication. An unauthenticated user who attempts to open any lesson other than Lesson 1 must see a login/sign-up prompt instead of the lesson content.
- **Authenticated users** can open and read all published lessons in the learning path.
- **Draft or unpublished lessons** must not be accessible to any user — authenticated or unauthenticated. They must not appear in the lesson list, and their routes must not serve content.
- Clicking a published lesson from the list must navigate the user to the lesson page.
- Lesson content must be rendered clearly and readably, supporting markdown formatting: headings, paragraphs, bullets, numbered lists, and code blocks.

**Priority:** Must Have
**Source:** PRD 13.6 FR-LEARN-006; D-CONT-002; D-PROD-005 (OQ-LC-002 resolved)

---

### LEARNING-FR-005 — First Lesson Preview Without Login

The first lesson (What is IBM i?) must be accessible to unauthenticated users as a preview.

- An unauthenticated user who navigates to the first lesson must be able to read its full content
- When an unauthenticated user attempts to open any lesson other than the first, they must see a prompt to log in or create an account
- The preview experience must not include progress tracking or lesson completion state (those require a logged-in user)
- The lesson list must visibly distinguish which lesson is available for preview

**Priority:** Must Have
**Source:** D-PROD-005, PRD 12 MVP Definition

---

### LEARNING-FR-006 — Authenticated Progress Visibility

Authenticated users must be able to see their lesson completion status within the Learning Center.

- The lesson list must show which lessons have been completed and which have not been started
- The overall progress through the learning path must be visible (e.g., as a count or visual indicator)
- Progress state must be loaded from the database upon page load and must reflect the user's actual completion history
- An authenticated user who has not completed any lessons should see a clear starting point recommendation

**Priority:** Must Have
**Source:** PRD 13.9 FR-PROG-001, FR-PROG-002; Spec 006 Progress Tracking

---

### LEARNING-FR-007 — Mark Lesson Complete

An authenticated user must be able to explicitly mark a lesson as complete.

- Each lesson page must include a Mark Complete button or equivalent action
- Triggering Mark Complete must update the user's progress record in the database
- After marking complete, the lesson's status in the lesson list must update to reflect completion
- A user may only mark a lesson complete when authenticated; the control must not be shown to unauthenticated users
- Marking a lesson as complete should trigger or display a next-step recommendation (e.g., link to the next lesson)

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-005; Spec 006 Progress Tracking

---

### LEARNING-FR-008 — Lesson Navigation

Users must be able to navigate between lessons without returning to the lesson list each time.

- Each lesson page must include a link or button to navigate to the next lesson in the sequence
- Each lesson page must include a link or button to navigate to the previous lesson in the sequence
- On the first lesson, there must be no previous lesson link (or it must be visually disabled)
- On the last lesson, the next lesson control should direct the user toward a "Where to go next" action

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-006; US-LC-008, US-LC-009

---

### LEARNING-FR-009 — AI Tutor Access from Learning Context

Each lesson page must provide access to the AI Tutor.

- A clearly visible link to the AI Tutor page (`/ai-tutor`) must appear on each lesson page
- The link text should encourage the user to ask questions about what they just read
- The AI Tutor link must be accessible to both authenticated and unauthenticated users (though AI Tutor usage requires login per Spec 001)
- The AI Tutor is not embedded in the lesson page for MVP (Spec 001, D-AI-003)

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-007; Spec 001 AI Tutor

---

### LEARNING-FR-010 — Content Source and Loading

Lesson content must be loaded from version-controlled content files, not from a content management system.

- Lesson body content is stored as plain Markdown (.md) files in the repository (ADR-003 content storage decision)
- Lesson metadata (title, slug, order, description, status, estimated reading time) is stored separately from lesson body content
- Only lessons with a published/reviewed status flag set to true must be visible in the public lesson list
- The content loading mechanism must handle gracefully the case where a lesson file is missing or cannot be loaded

**Priority:** Must Have
**Source:** ADR-003 Content Storage Decision; PRD 16.12 Content Governance; D-CONT-002

---

### LEARNING-FR-011 — Continue Learning State

The Learning Center and dashboard must help returning users resume learning.

- An authenticated user who has previously completed one or more lessons must see a clear recommendation to continue to the next uncompleted lesson
- The "continue learning" state should be visible on both the Learning Center page and the dashboard (Spec 005)
- This state must be derived from the user's progress records stored in the database

**Priority:** Must Have
**Source:** PRD 13.5 FR-DASH-004; Spec 005 Dashboard; Spec 006 Progress Tracking

---

### LEARNING-FR-012 — Empty and Error States

The Learning Center must handle empty and error states gracefully.

- If no lessons have been published, the Learning Center must display a meaningful message rather than an empty list
- If a lesson fails to load (content file not found, network error), the lesson page must display a user-friendly error message
- Error states must not expose internal error details to the user
- Error states must not prevent the user from navigating back to the Learning Center

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-003, NFR-REL-004

---

### LEARNING-FR-013 — Content Review Status Enforcement

Only reviewed and approved lesson content may appear in the public Learning Center.

- Each lesson must have a published/reviewed status flag
- The lesson list must filter out any lesson whose status is not published/reviewed
- Draft or in-progress lessons must never appear in the public lesson list, regardless of their position in the approved sequence
- This enforcement must apply regardless of whether the user is authenticated

**Priority:** Must Have
**Source:** PRD 16.12 Content Governance; PRD 16.13 Content Lifecycle; D-CONT-002

---

### v2.0 Proposed Functional Requirements (Pending Approval — Not Yet Implemented)

The following requirements apply once this amendment, the companion Spec 009 v2.0 amendment, and the companion Spec 006 v2.0 amendment are all approved and implemented. They do not apply to the current production system today.

### LEARNING-FR-014 — Track Listing Page

The product must provide a track catalog page listing every approved track.

- Each track entry must show: track name, short description, difficulty span, and lesson count
- For authenticated users, each track entry must show a completion count scoped to that track (Spec 006 v2.0 PROGRESS-FR-017)
- Tracks must be listed in the order approved in Spec 009 v2.0 Section 5
- The track catalog page must be publicly accessible, consistent with LEARNING-FR-001's public-access principle

**Priority:** Must Have
**Source:** planning/CURRICULUM_EXPANSION_BLUEPRINT.md Section 2; Spec 009 v2.0 Section 5; US-LC-013

---

### LEARNING-FR-015 — Module Listing Within a Track

Opening a track must display its modules in approved order, each showing its lessons.

- Modules must be displayed in the order defined in the track's approved module list (Spec 009 v2.0)
- Each module must show its title and its ordered lesson list (LEARNING-FR-016)
- Only Published lessons appear, per the unchanged LEARNING-FR-013 enforcement

**Priority:** Must Have
**Source:** Spec 009 v2.0 CONTENT-FR-015, CONTENT-FR-023

---

### LEARNING-FR-016 — Lesson Listing Within a Module

This generalizes LEARNING-FR-003 (Lesson List Display) from a single flat path to a module-scoped list.

- Lessons within a module must be displayed in `lessonOrder` sequence (Spec 009 v2.0 Section 11.3)
- Each lesson entry must show: lesson title, short description, difficulty indicator, and (for authenticated users) completion status
- This requirement does not change how the 11 retained lessons display today; it changes the grouping context they display within

**Priority:** Must Have
**Source:** LEARNING-FR-003 (v1.0); Spec 009 v2.0 Section 5B

---

### LEARNING-FR-017 — Difficulty Indicator Display

Lessons and tracks must visibly display their difficulty classification.

- A lesson shows its single declared `difficulty` value (Beginner, Intermediate, or Advanced)
- A track shows its difficulty span (e.g., "Beginner → Advanced") as defined in Spec 009 v2.0 Section 5
- The indicator must not rely on color alone to convey meaning, consistent with the existing NFR Accessibility requirements

**Priority:** Must Have
**Source:** Spec 009 v2.0 CONTENT-FR-016; US-LC-015

---

### LEARNING-FR-018 — Per-Track and Per-Module Progress Display

Authenticated users must see progress scoped to a track and to a module, in addition to (not instead of) the recommended-path progress.

- Progress values must be read from Spec 006 v2.0's per-track and per-module calculations (PROGRESS-FR-016, PROGRESS-FR-017); the Learning Center must not compute its own progress values independently, matching the existing single-source-of-truth principle from Spec 006 PROGRESS-FR-004
- Display format follows the same count-based pattern already approved in v1.0 (e.g., "3 of 7 lessons completed"), scoped to the relevant track or module

**Priority:** Must Have
**Source:** Spec 006 v2.0 PROGRESS-FR-016, PROGRESS-FR-017; US-LC-014

---

### LEARNING-FR-019 — Recommended Beginner Path Entry Point

The Learning Center must present the curated recommended beginner path (Section 6, v2.0) as the default starting point for users who have not yet engaged with the track catalog.

- The recommended path must be visually prioritized over the full track catalog for new/undecided users (e.g., as the primary call-to-action), while the full catalog remains one click away
- The recommended path's progress is the roll-up defined in Spec 006 v2.0 PROGRESS-FR-018
- The specific name shown for this path in the UI is not resolved by this spec (OQ-LC-006)

**Priority:** Must Have
**Source:** Section 6 v2.0 subsection; planning/CURRICULUM_EXPANSION_BLUEPRINT.md Section 3; US-LC-012

---

### LEARNING-FR-020 — Migration Display Continuity

Existing published lesson URLs must continue to resolve correctly after the Section 5B (Spec 009) migration.

- The 11 retained lessons must remain accessible at their existing `/learn/ibm-i-fundamentals/[slug]` URLs unless and until OQ-CONTENT-004 (Spec 009 v2.0) is resolved in favor of a URL change with redirects
- No existing bookmark, external link, or search-indexed URL for a retained lesson may break as a result of this migration
- This requirement takes precedence over any convenience gained from a fully consistent new URL scheme; correctness of existing links comes first

**Priority:** Must Have
**Source:** Spec 009 v2.0 Section 5B; Spec 009 CONTENT-FR-009 Slug Stability

---

## 9. Non-Functional Requirements

### NFR: Performance

- The Learning Center page and lesson list must load within a reasonable time for comfortable repeated use
- Lesson content pages must load quickly enough that users do not experience friction between lesson navigation steps
- Static lesson content should be served with appropriate caching or static generation to minimize server load and maximize load speed
- Performance must not degrade as the number of published lessons grows from 8 to 12 during the beta period

**Source:** PRD 14.3 NFR-PERF-002, NFR-PERF-003

---

### NFR: Accessibility

- Lesson content must use clear semantic heading structure (H1, H2, H3 as appropriate)
- The lesson list must be keyboard-navigable
- Progress indicators must communicate completion state in a way that is not color-only
- The Mark Complete button must have a clear accessible label
- Lesson navigation controls must have accessible labels indicating where they lead

**Source:** PRD 14.10 NFR-ACC-001, NFR-ACC-002, NFR-ACC-005

---

### NFR: Maintainability

- Lesson content must be stored in version-controlled files so that updates require a code commit and can be reviewed before publication (ADR-003)
- Adding a new lesson must require only: creating a content file and adding a metadata entry; it must not require changes to application logic
- The lesson ordering and metadata must be manageable without modifying the lesson content files themselves
- The content loading and rendering implementation must be simple enough for a single developer to maintain

**Source:** PRD 14.13 NFR-MAIN-004, NFR-MAIN-005; ADR-003

---

### NFR: Content Governance

- No lesson may be published without review (LEARNING-FR-013)
- Draft lesson content must not be accessible to users — including unauthenticated users who could guess lesson slugs
- The content review process (even if lightweight for MVP) must be documented in the Content Governance Spec (Spec 009) before lesson writing begins

**Source:** PRD 16.12 Content Governance; PRD 16.13 Content Lifecycle

---

### NFR: Security

- The first lesson preview must not expose the content of unpublished lessons
- Lesson routes for lessons beyond the first must verify authentication before serving content
- Lesson slugs or IDs must not be guessable in a way that allows access to unpublished draft content
- No user-generated content is stored or rendered in the MVP Learning Center

**Source:** PRD 14.6 NFR-SEC-003, NFR-SEC-004

---

### NFR: Privacy

- The Learning Center does not collect sensitive data
- Lesson completion records stored in the database are associated with the user's account and must not be publicly exposed
- No tracking pixels, advertising scripts, or unnecessary analytics libraries should be added to lesson pages

**Source:** PRD 14.7 NFR-PRIV-001

---

### NFR: Reliability

- The lesson list must render even if some lesson content files fail to load (graceful degradation)
- A failure to load one lesson must not prevent other lessons from being accessible
- The Mark Complete action must handle database write failures gracefully without losing the user's current lesson position

**Source:** PRD 14.4 NFR-REL-003, NFR-REL-005

---

### NFR: SEO and Public Preview

- The Learning Center page and the first lesson must be publicly accessible for search engine indexing
- Lesson pages should use appropriate metadata (page title, description) to support search discoverability
- Lesson content behind authentication does not need to be indexed but must not generate error responses for search crawlers

**Source:** PRD 16.1 (Learning Center as trust builder); PRD 21.5 Phase 1 MVP Build

---

## 10. Content Model Requirements

This section defines the data attributes each lesson must have at the spec level. This is not a database schema. The specific storage format and schema will be defined in the implementation plan.

### Lesson Metadata Attributes

| Attribute | Purpose | Notes |
|---|---|---|
| Lesson ID | Unique stable identifier | Used for progress tracking records and URL routing |
| Slug | URL-friendly identifier | Used in the lesson page route (e.g., `/learn/what-is-ibm-i`) |
| Title | Human-readable lesson name | Displayed in lesson list and on lesson page |
| Short description | One or two sentences describing the lesson | Displayed in lesson list |
| Order | Integer position in the learning path sequence | Determines lesson list ordering and next/previous navigation |
| Learning path ID | Reference to the IBM i Fundamentals path | Supports future multi-path scenarios |
| Estimated reading time | Approximate time to complete the lesson | Optional manual metadata for MVP. If omitted, the UI must not display an estimated reading time for that lesson. |
| Published status | Boolean flag: true = visible to users, false = draft | Only published lessons appear in the public lesson list |
| Content source path | File path to the lesson markdown file | Used by the content loading implementation |
| AI Tutor starter question | Optional suggested question to display near the AI Tutor link | Helps users know what to ask after reading the lesson |

**Pre-existing note (not part of this amendment):** the "Published status" row above describes a boolean flag, which predates and is superseded in practice by Spec 009's already-Approved v1.0 resolution of OQ-CONTENT-003 (a single `status` field with values Draft/Review Ready/Approved/Published/Unpublished-Archived, not a separate boolean). This row is left as originally written to avoid retroactively editing v1.0 approved text outside this amendment's scope, but Spec 009 Section 7 is the authoritative source and this row should not be relied on. The v2.0 fields below use Spec 009's actual single-status-field model.

### Lesson Body Content

- Lesson body content is stored as a separate plain Markdown file (.md) in the repository (OQ-LC-001 resolved).
- Lesson metadata is managed separately from the lesson body content file — they are two distinct stores.
- Content files must be version-controlled in the repository (ADR-003).
- Content files are not stored in the database.
- Plain Markdown was chosen for its simplicity, Git reviewability, and alignment with the MVP lesson structure. MDX or structured content formats may be introduced in a later phase if component-level lesson features are needed.

### v2.0 Proposed Content Model (Pending Approval)

The Learning Center's content model is owned by Spec 009 (Content Governance) — see Spec 009 v2.0 Section 11.3 for the full field-level metadata schema (`trackId`, `moduleId`, `difficulty`, `tags`, `prerequisites`, `relatedLessons`, `personaTags`, `aiTutorPrompts`, and the carried-over fields). This spec does not redefine that schema; it specifies which fields the Learning Center reads and how it uses them:

| Field (from Spec 009 v2.0) | How the Learning Center uses it |
|---|---|
| `trackId` | Groups lessons under their track for the track listing (LEARNING-FR-014) |
| `moduleId` | Groups lessons under their module for the module listing (LEARNING-FR-015) |
| `lessonOrder` | Orders lessons within their module (LEARNING-FR-016) |
| `difficulty` | Drives the difficulty indicator (LEARNING-FR-017) |
| `status` | Unchanged — sole visibility gate, exactly as in v1.0 |
| `tags`, `personaTags` | Not required for Phase 1 Learning Center UI; reserved for future discovery/filtering features, not designed in this amendment |
| `prerequisites`, `relatedLessons` | Not required for Phase 1 Learning Center UI; reserved for future cross-track navigation features, not designed in this amendment |

---

## 11. UX Requirements

The following UX requirements define the expected user experience of the Learning Center feature. Specific visual design, layout, and component choices are to be determined during implementation.

### Learning Center Page

- The Learning Center is accessible at `/learn`.
- The IBM i Fundamentals learning path is accessible at `/learn/ibm-i-fundamentals`.
- Individual lesson pages are accessible at `/learn/ibm-i-fundamentals/[slug]` (OQ-LC-005 resolved).
- The `/learn` page must display the IBM i Fundamentals learning path with its name, a description, and lesson count.
- For authenticated users, the page should show overall path progress.
- A clear call-to-action (e.g., Start Learning, Continue Learning) directs the user to their appropriate starting point.

### Learning Path Card or Section

- The IBM i Fundamentals path should be visually presented as a distinct learning path
- The path card or section should communicate the scope and value of the path in one or two sentences

### Lesson List

- Below or within the learning path presentation, the ordered list of published lessons must be displayed.
- Each lesson entry shows: lesson number, title, short description, and completion status (authenticated users only).
- Lesson 1 must be visually identified as the starting point and as available for preview without login.
- Lessons beyond Lesson 1 must have a clear indication when the user is unauthenticated (e.g., a lock icon or login prompt).
- Only published and reviewed lessons appear in the lesson list. Draft or unpublished lessons are not shown (OQ-LC-004 resolved).
- Individual "coming soon" placeholders for unpublished lessons must not be shown in MVP. If fewer than 12 lessons are published at beta launch, the UI may display a general note such as "More lessons are being added" below the lesson list.

### Lesson Page

- Each lesson occupies a dedicated page at `/learn/ibm-i-fundamentals/[slug]` (OQ-LC-005 resolved).
- The lesson page displays: lesson title, estimated reading time if metadata is present (optional — omit if not provided, per OQ-LC-003 resolved), lesson body content, AI Tutor link, next/previous navigation, and Mark Complete control (authenticated users only).
- Lesson body content must render plain Markdown cleanly: headings, paragraphs, bullet lists, numbered lists, and code blocks (OQ-LC-001 resolved).

### Progress Indicator

- A visible progress indicator shows how many lessons in the path have been completed
- Progress must be clearly associated with the IBM i Fundamentals path
- The indicator should not be shown to unauthenticated users (progress tracking requires authentication)

### Mark Complete Button

- Appears at the bottom of each lesson page for authenticated users
- Triggers the lesson completion action (LEARNING-FR-007)
- After marking complete, the button state should update to reflect completion and a next-step recommendation should be shown
- The button must not appear for unauthenticated users

### Continue Learning Action

- After marking a lesson complete, the user should see a clear prompt to move to the next lesson
- On the lesson list and dashboard, returning authenticated users should see a "Continue Learning" action pointing to their next uncompleted lesson

### First Lesson Preview

- Lesson 1 is fully accessible without authentication
- The lesson page for Lesson 1 should make clear that creating an account allows progress to be saved
- When an unauthenticated user reaches the end of Lesson 1, they should see a clear prompt to sign up to continue

### Login Prompt for Protected Lessons

- For lessons beyond Lesson 1, unauthenticated users who click to open a lesson must see a friendly login/sign-up prompt
- The prompt must communicate why login is needed (to track progress and continue learning)
- The prompt should not block the user from reading the lesson list or lesson titles

### AI Tutor Link on Lesson Pages

- Each lesson page must include a visible link to the AI Tutor (`/ai-tutor`)
- The link should be presented contextually: "Have a question about this lesson? Ask the AI Tutor."
- The optional AI Tutor starter question from the lesson metadata may be displayed as a suggested prompt near the link

### v2.0 Proposed UX Requirements (Pending Approval)

**Track Catalog Page**
- A new page (route to be defined in implementation planning, pending OQ-LC-006) lists all approved tracks as cards or rows
- Each track entry shows: name, description, difficulty span, lesson count, and (authenticated) completion count
- The recommended beginner path (below) is visually distinguished from — and prioritized over — the general track catalog for new/undecided users

**Recommended Beginner Path Entry Point**
- The `/learn` landing experience defaults to the recommended beginner path (Section 6, v2.0), not the full track catalog, consistent with today's v1.0 experience of landing directly on "IBM i Fundamentals"
- A clearly visible way to reach the full track catalog is always present alongside it
- The recommended path's own progress indicator rolls up across its constituent tracks (Spec 006 v2.0 PROGRESS-FR-018)

**Module Listing Within a Track**
- Opening a track shows its modules as a sub-list, each expandable or navigable to its own lesson list
- Module names and their lesson counts are visible before opening a module

**Difficulty Indicator**
- A small, non-color-only badge or label shows Beginner/Intermediate/Advanced on lesson entries, and a range (e.g., "Beginner → Advanced") on track entries
- The badge style should be visually consistent with existing status indicators (e.g., completion checkmarks) already used in the v1.0 lesson list

**Per-Track / Per-Module Progress**
- Track and module entries show a count-based progress indicator for authenticated users, following the same format already approved in v1.0 (no percentage, per Spec 006's existing display-format decision)

---

## 12. Dependencies

The Learning Center feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Database | Supabase PostgreSQL for lesson metadata and user progress records | ADR-003 |
| Authentication | Supabase Auth for gating lesson access and progress tracking | ADR-004 |
| Tech stack | Next.js + TypeScript for content rendering and routing | ADR-001 |
| Content storage | Lesson body content stored as version-controlled files in the repository | ADR-003 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 001: AI Tutor | Lesson pages link to the AI Tutor at `/ai-tutor`; AI Tutor must be implemented for this link to be functional |
| Spec 003: Lesson Experience | Lesson page rendering, lesson body content display, lesson navigation, and Mark Complete behavior are specified separately in Spec 003 |
| Spec 004: User Account and Onboarding | Authentication must be in place for progress tracking and gated lesson access |
| Spec 005: Dashboard | The dashboard displays continue-learning state derived from Learning Center progress |
| Spec 006: Progress Tracking | Lesson completion state and progress records are managed by the Progress Tracking implementation; the Learning Center reads from this data |
| Spec 009: Content Governance | The content review and publication workflow governs which lessons are eligible to appear in the public lesson list (LEARNING-FR-013). v2.0: also the sole owner of the `trackId`/`moduleId`/`difficulty`/etc. metadata schema this spec's v2.0 UI reads from (companion amendment). |

### v2.0 Planning Dependency (Not a Spec)

| Document | Role |
|---|---|
| planning/CURRICULUM_EXPANSION_BLUEPRINT.md | Source of the track/module structure and the recommended beginner path definition adopted in Section 6 v2.0 |

---

## 13. Acceptance Criteria

The Learning Center feature is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Core Learning Center

- [ ] A user can navigate to the Learning Center page and see the IBM i Fundamentals learning path
- [ ] The lesson list displays lessons in the approved sequence (Section 6)
- [ ] Lesson list entries show: lesson number, title, and short description
- [ ] Only published and reviewed lessons appear in the public lesson list; draft lessons are not visible
- [ ] The Learning Center page is publicly accessible without authentication

### First Lesson Preview

- [ ] An unauthenticated user can open and read the first lesson (What is IBM i?) in full
- [ ] An unauthenticated user who attempts to open any lesson beyond the first sees a login/sign-up prompt
- [ ] The first lesson page includes a prompt for unauthenticated users to create an account to save progress
- [ ] The first lesson is distinguishable in the lesson list as the preview-accessible starting point

### Authenticated Learning Experience

- [ ] An authenticated user who has completed lessons sees completion status on the lesson list
- [ ] An authenticated user can mark a lesson as complete from the lesson page
- [ ] After marking complete, the lesson shows as completed in the list
- [ ] An authenticated user who returns to the Learning Center sees their current progress and a continue-learning prompt

### Navigation

- [ ] A user can navigate from one lesson to the next using the next lesson control
- [ ] A user can navigate from a lesson to the previous lesson using the previous lesson control
- [ ] The first lesson has no previous lesson control (or it is clearly disabled)
- [ ] The last lesson's next control leads to an appropriate closing action

### AI Tutor Integration

- [ ] Each lesson page includes a visible link to the AI Tutor page
- [ ] The AI Tutor link is accessible to both authenticated and unauthenticated users

### Content Governance

- [ ] No lesson with a draft/unpublished status is visible in the lesson list
- [ ] Adding a new published lesson appears in the lesson list without requiring application logic changes
- [ ] The minimum beta content threshold is met: at least 8 complete, reviewed lessons are available

### Out-of-Scope Verification

- [ ] No quiz or knowledge check feature is present
- [ ] No standalone glossary feature is present
- [ ] No interactive 5250 lab or RPG playground is present
- [ ] No content authoring or CMS UI is accessible to users
- [ ] No lesson-aware AI integration is present (AI Tutor link only)

### v2.0 Acceptance Criteria (Pending Approval — Not Yet Implemented)

- [ ] This amendment, the companion Spec 009 v2.0 amendment, and the companion Spec 006 v2.0 amendment are all approved
- [ ] A user can browse the full track catalog and see all 16 approved tracks with name, description, difficulty span, and lesson count
- [ ] A user can open a track and see its modules, and open a module to see its lessons, in approved order
- [ ] New/undecided users land on the recommended beginner path by default, with the full track catalog reachable alongside it
- [ ] Lesson and track entries show a non-color-only difficulty indicator
- [ ] Authenticated users see progress scoped to a track and to a module, in addition to the recommended path's roll-up progress
- [ ] All 11 retained lessons resolve at their existing URLs with no broken links after the Spec 009 v2.0 Section 5B migration
- [ ] OQ-LC-006 (naming of the recommended path) is resolved before this UI ships to users

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content feels too thin — fewer than 8 reviewed lessons are ready at beta launch | Medium | High | Set content creation as a parallel workstream with engineering; prioritize Lessons 1–8 as the minimum set; do not launch beta until the minimum threshold is met |
| Lesson sequence is confusing — learners do not understand the progression | Low | Medium | The approved 12-lesson sequence (Section 6) is intentionally progressive; content review should verify each lesson sets up the next; section numbering in the UI reinforces sequence |
| Unauthenticated preview boundary leaks too much value — users get enough from Lesson 1 that they do not sign up | Low | Medium | Lesson 1 ends with a clear prompt to continue and create an account; the value of progress tracking and AI Tutor access motivates sign-up; adjust if beta data shows low conversion |
| Unauthenticated preview boundary is too restrictive — users cannot evaluate quality before signing up | Low | Medium | Lesson 1 (What is IBM i?) gives a meaningful preview of content quality; if beta feedback indicates more preview is needed, Lesson 2 can be unlocked post-MVP |
| Progress tracking dependency delays Learning Center — Spec 006 is not ready in time | Medium | Medium | Coordinate the Learning Center implementation plan with Spec 006 Progress Tracking before coding progress-related behavior. The Learning Center should not implement a separate or duplicated progress model outside the approved Progress Tracking spec. |
| Content updates require a code deploy — slow iteration on lesson content | Medium | Low | Acceptable for MVP; a deploy-based content workflow is fast enough at MVP scale and ensures content review before publication; a CMS or preview system can be added post-MVP |
| Scope creep — pressure to add quizzes, glossary, or embedded AI during implementation | Medium | Medium | This spec explicitly excludes quizzes (D-PROD-003), glossary (D-PROD-004), and lesson-aware AI (D-AI-003); any addition requires Product Owner approval and a PRD update |
| Lesson content quality insufficient — lessons do not build beginner confidence | Medium | High | Content must go through the review process defined in Spec 009 (Content Governance) before publication; early lessons should be tested with a beginner reviewer before beta |

### v2.0 Risks and Mitigations (Pending Approval)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Track catalog overwhelms new users despite the recommended-path design intent | Medium | Medium | The recommended path must be visually prioritized (LEARNING-FR-019); usability-test the default landing experience with a true beginner before shipping |
| Existing lesson URLs break during migration | Low | High | LEARNING-FR-020 and Spec 009 v2.0 Section 5B require URL continuity; test all 11 retained lesson URLs explicitly after migration |
| Per-track/per-module progress display is inconsistent with the recommended path's roll-up progress, confusing users | Medium | Medium | Both must read from the same Spec 006 v2.0 calculations (single source of truth, per the existing PROGRESS-FR-004 principle); do not let the Learning Center compute either independently |
| Naming the recommended path incorrectly before OQ-LC-006 is resolved | Medium | Low | Implementation should not hardcode a specific name in code or copy until the Product Owner resolves OQ-LC-006 |

---

## 15. Open Questions

The following questions remain genuinely unresolved and must be answered before or during implementation planning.

**v1.0 questions:** No open questions remain for the v1.0 scope.

**v2.0 open questions (new — must be resolved before implementation):**

- **OQ-LC-006:** What should the recommended beginner path (Section 6, v2.0) be called in the product UI? Does "IBM i Fundamentals" continue as its name, or does it need a new name now that it spans five tracks internally? (Mirrors Spec 009 v2.0 OQ-CONTENT-005 — the same open question, tracked in both specs since it affects both content governance and Learning Center UI copy.)
- **OQ-LC-007:** Should the track catalog page live at a new top-level route (e.g., `/learn/tracks`), or should `/learn` itself become the track catalog with the recommended path as a prominent featured entry? This is an information-architecture decision not resolved by this amendment. (Related to Spec 009 v2.0 OQ-CONTENT-004 on URL structure.)
- **OQ-LC-008:** Should unauthenticated users be able to browse the full track catalog (titles/descriptions only, no lesson content beyond the existing first-lesson-preview rule), or should track browsing itself require authentication? This amendment assumes the track catalog is publicly browsable, consistent with the existing v1.0 principle that the lesson list (though not lesson content beyond Lesson 1) is publicly visible — this should be explicitly confirmed.

Any new questions discovered during implementation planning should be added here before coding begins.

---

## 16. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any Learning Center implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope, learning path, and acceptance criteria
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] Implementation plan coordinates with Spec 006 Progress Tracking before coding progress-related behavior

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for the Learning Center is created and approved
- [ ] Spec 003 (Lesson Experience) is available — lesson page rendering is specified there
- [ ] Spec 004 (User Account and Onboarding) is approved — auth gating depends on auth being in place
- [ ] Spec 006 (Progress Tracking) is available — Mark Complete and progress state depend on progress tracking implementation
- [ ] Spec 009 (Content Governance) is available — content review process must be defined before lessons are written
- [ ] At least a draft of the first two lessons exists and has been reviewed — confirms the content model works before full engineering effort

### Notes for Implementation Planning

- The lesson metadata store (which lessons exist, their order, status, and metadata) and the lesson content files are two separate concerns; the implementation plan should address both independently.
- Static generation or server-side rendering for lesson content pages is strongly recommended; this will affect the implementation approach for authenticated vs. unauthenticated lesson access at `/learn/ibm-i-fundamentals/[slug]`.
- The progress tracking database interaction (reading and writing lesson completion state) must be designed in coordination with Spec 006 to avoid duplicated or conflicting implementations.
- The route structure (`/learn`, `/learn/ibm-i-fundamentals`, `/learn/ibm-i-fundamentals/[slug]`) is approved and must be used in the implementation plan and implementation.

### v2.0 SDD Handoff Notes (Pending Approval — Not Yet Implemented)

**Before this amendment authorizes any implementation:**

- [ ] The Product Owner has reviewed and approved this v2.0 amendment in full, including OQ-LC-006, OQ-LC-007, and OQ-LC-008
- [ ] The companion Spec 009 v2.0 amendment and Spec 006 v2.0 amendment are also approved — these three specs must move together
- [ ] OQ-CONTENT-004 and OQ-CONTENT-005 (Spec 009 v2.0) are resolved, since they directly determine this spec's route structure and recommended-path naming

**Notes for implementation planning:**

- Do not build the track catalog or recommended-path UI until the URL/routing open questions (OQ-LC-006, OQ-LC-007) are resolved — building against an assumed route structure risks a rework if the Product Owner decides differently
- The v1.0 route structure (`/learn`, `/learn/ibm-i-fundamentals`, `/learn/ibm-i-fundamentals/[slug]`) remains the only approved, implementable route structure until v2.0 routing is resolved and approved
- This amendment intentionally does not touch Spec 003 (Lesson Experience) or Spec 005 (Dashboard). Spec 003's per-lesson rendering is unaffected by track/module grouping. If Spec 005's dashboard needs its own v2.0 amendment to display per-track progress summaries, that should be scoped separately once Spec 006 v2.0 is approved.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP Learning Center spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Spec 001 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved Learning Center content format, preview, route, reading time, and unpublished lesson questions |
| 2026-07-01 | 1.0 | Approved Learning Center SDD spec for implementation planning |
| 2026-07-14 | 2.0-draft | Amendment draft adding multi-track support: track catalog, module listing, difficulty indicators, per-track/per-module progress display, and a curated recommended beginner path. Companion to Spec 009 v2.0 and Spec 006 v2.0. All v1.0 content preserved and labeled; nothing in production changes until all three amendments are approved and implemented together. Pending Product Owner review. |
