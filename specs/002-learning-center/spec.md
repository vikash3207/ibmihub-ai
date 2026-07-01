# Spec 002: Learning Center

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 002 |
| Feature | Learning Center |
| Status | Review Ready |
| Version | 0.2 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL and content storage decisions |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor integration reference |

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
| Version-controlled content | Lesson content is stored as markdown or structured content files in the repository, not in a database (ADR-003) |
| Lesson metadata management | Lesson metadata (title, slug, order, description, status, estimated reading time) is managed separately from lesson body content |

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

- Lesson body content is stored as markdown or structured content files in the repository (ADR-003 content storage decision)
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

### Lesson Body Content

- Lesson body content is stored as a separate plain Markdown file (.md) in the repository (OQ-LC-001 resolved).
- Lesson metadata is managed separately from the lesson body content file — they are two distinct stores.
- Content files must be version-controlled in the repository (ADR-003).
- Content files are not stored in the database.
- Plain Markdown was chosen for its simplicity, Git reviewability, and alignment with the MVP lesson structure. MDX or structured content formats may be introduced in a later phase if component-level lesson features are needed.

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
| Spec 009: Content Governance | The content review and publication workflow governs which lessons are eligible to appear in the public lesson list (LEARNING-FR-013) |

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

---

## 15. Open Questions

The following questions remain genuinely unresolved and must be answered before or during implementation planning.

No open questions remain for this spec at this stage. Any new questions discovered during implementation planning should be added here before coding begins.

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

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP Learning Center spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Spec 001 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved Learning Center content format, preview, route, reading time, and unpublished lesson questions |
