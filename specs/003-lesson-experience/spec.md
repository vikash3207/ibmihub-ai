# Spec 003: Lesson Experience

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 003 |
| Feature | Lesson Experience |
| Status | Approved |
| Version | 1.0 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor integration reference |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center context and access rules |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Content storage decisions |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |

---

## 2. Purpose

The Lesson Experience defines how a user reads and interacts with a single lesson inside the IBM i Fundamentals learning path.

While Spec 002 (Learning Center) defines the overall learning structure — the path, lesson list, and navigation entry points — Spec 003 defines what happens once the user is inside a lesson. It specifies how lesson content is rendered, how the user moves between lessons, how progress is recorded, how the AI Tutor is surfaced, and how authentication boundaries are enforced at the lesson page level.

Getting the lesson experience right is critical because it is the primary interaction the user has with IBMiHub AI content. A lesson that is hard to read, awkwardly gated, or difficult to navigate will undermine the trust and engagement the product depends on.

This spec defines the MVP scope, requirements, access rules, UX requirements, acceptance criteria, and implementation boundaries for the individual lesson page experience.

---

## 3. MVP Scope

The MVP Lesson Experience covers the reading and completion experience for a single lesson within the IBM i Fundamentals learning path.

### In Scope for MVP

| Capability | Description |
|---|---|
| Single lesson page | Each lesson in the IBM i Fundamentals path has a dedicated page at `/learn/ibm-i-fundamentals/[slug]` |
| Plain Markdown (.md) content rendering | Lesson body content is rendered from plain Markdown files; no MDX components in MVP |
| Lesson title display | Each lesson page prominently displays the lesson title |
| Lesson metadata display | Estimated reading time is displayed if provided in lesson metadata; omitted if not present |
| Lesson body rendering | Lesson body content is rendered with clean formatting supporting standard Markdown elements |
| Next and previous lesson navigation | Each lesson page includes controls to navigate to the next and previous lessons in the sequence |
| Mark Complete button for authenticated users | An authenticated user can mark a lesson as complete from the lesson page |
| First lesson public preview | Lesson 1 (What is IBM i?) is fully readable without authentication |
| Login prompt for protected lessons | Unauthenticated users who attempt to open lessons beyond Lesson 1 see a login/sign-up prompt |
| AI Tutor link from lesson page | Each lesson page includes a visible link to the AI Tutor at `/ai-tutor` |
| Optional AI Tutor starter question | If present in lesson metadata, a suggested question is displayed near the AI Tutor link |
| Published/reviewed lesson enforcement | Only lessons with a published status may be accessed; draft lessons are inaccessible to all users |

---

## 4. Explicitly Out of Scope for MVP

The following capabilities must not be included in the MVP Lesson Experience implementation.

| Excluded Capability | Reason |
|---|---|
| Quizzes and knowledge checks | Deferred to post-MVP (D-PROD-003) |
| Standalone or inline glossary | Deferred to post-MVP (D-PROD-004) |
| Lesson-aware embedded AI | Deferred to post-MVP (D-AI-003); AI Tutor link only |
| Inline AI side panel or chat overlay | Not in MVP scope; would require lesson-aware context |
| Lesson comments or discussion | Future feature |
| Video lessons | Not in MVP curriculum |
| Interactive 5250 terminal or lab | Future feature (PRD 11, Phase 4) |
| RPG playground or code execution | Future feature (PRD 11, Phase 4) |
| Real IBM i connectivity | Explicitly prohibited in MVP (PRD 18.14) |
| Content authoring or CMS editing UI | MVP uses Git-based workflow only (ADR-003) |
| Certifications, badges, or completion certificates | Future feature (PRD 11) |
| Bookmarking or note-taking | Future feature |
| Lesson rating beyond AI Tutor feedback | Out of MVP scope |
| User-generated content or contributions | Future feature |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A user new to IBM i who reads lessons from start to finish, following the sequence. They use the Lesson Experience to:

- Read clear explanations of unfamiliar IBM i concepts
- Know exactly where they are in the learning path
- Mark lessons complete as they progress
- Ask the AI Tutor a question when a concept is unclear
- See what lesson comes next

The lesson page must feel approachable, readable, and well-structured. It must not overwhelm the beginner with distracting UI elements or complex interactivity.

### Persona 2: Working IBM i Developer

A user who already works with IBM i and uses the Lesson Experience to refresh specific topics. They may:

- Navigate directly to a specific lesson without starting from Lesson 1
- Skim lesson content rather than reading it word for word
- Use the AI Tutor link to ask a follow-up question about a concept
- Mark a lesson complete after reviewing it

The lesson page must serve this persona as an efficient reference experience without forcing sequential reading.

---

## 6. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-LE-001 | Any user | Open a lesson and read its full content clearly | I can understand the IBM i concept being taught |
| US-LE-002 | Unauthenticated visitor | Read the full first lesson (What is IBM i?) without logging in | I can evaluate the content quality before creating an account |
| US-LE-003 | Unauthenticated visitor | See a clear login/sign-up prompt when I try to open a lesson beyond Lesson 1 | I know I need an account to access the rest of the content |
| US-LE-004 | Any user | Navigate to the next lesson at the bottom of a lesson page | I can continue learning without going back to the lesson list |
| US-LE-005 | Any user | Navigate to the previous lesson | I can revisit earlier content if needed |
| US-LE-006 | Authenticated user | Click Mark Complete at the end of a lesson | I can record my progress through the IBM i Fundamentals path |
| US-LE-007 | Authenticated user | See the lesson marked as completed after clicking Mark Complete | I have confirmation that my progress was saved |
| US-LE-008 | Any user | Click a link to the AI Tutor from the lesson page | I can ask a question about what I just read |
| US-LE-009 | Any user | See a suggested starter question near the AI Tutor link | I get help understanding what I could ask the AI Tutor about this lesson |
| US-LE-010 | Any user | Receive a clear error or redirect when I navigate to a lesson that does not exist or is not published | I do not see a blank page or confusing technical error |

---

## 7. Functional Requirements

### LESSON-FR-001 — Lesson Route Handling

Each lesson must be accessible at a stable, predictable route.

- Lesson pages must be served at the route `/learn/ibm-i-fundamentals/[slug]`
- Slugs must be lowercase kebab-case strings derived from the lesson title, without lesson number prefixes. Examples: `what-is-ibm-i`, `why-ibm-i-still-matters`, `libraries-and-objects`, `introduction-to-rpgle` (OQ-LE-005 resolved)
- Slugs are defined in lesson metadata and must be stable — they must not change after a lesson is published
- The route must resolve to the correct lesson content based on the slug
- The route for a draft or unpublished lesson must not return content; it must return a 404 or appropriate error response

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-004; OQ-LC-005 resolved; OQ-LE-005 resolved

---

### LESSON-FR-002 — Lesson Access Rules

Lesson page access must enforce the authentication boundaries approved in Spec 002.

- **Lesson 1** is fully accessible to all users without authentication
- **Published lessons beyond Lesson 1** require authentication; unauthenticated users must see a login/sign-up prompt in place of lesson content
- **Authenticated users** may access any published lesson
- **Draft or unpublished lessons** must not be served to any user, regardless of authentication status; a 404 or redirect must be returned

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-004 and LEARNING-FR-005; D-PROD-005

---

### LESSON-FR-003 — Lesson Metadata Display

The lesson page must display lesson metadata from the lesson metadata store.

- The lesson title must be prominently displayed at the top of the lesson page
- If an estimated reading time is present in lesson metadata, it must be displayed near the title (e.g., "~8 min read")
- If estimated reading time is absent from lesson metadata, the UI must not display any placeholder or zero value for it
- The lesson's position in the sequence may be displayed (e.g., "Lesson 4 of 12") to help users understand their location in the path

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-001, FR-LESSON-002; Spec 002 OQ-LC-003 resolved

---

### LESSON-FR-004 — Lesson Content Rendering

The lesson page must render lesson body content from the lesson's plain Markdown (.md) file.

- Lesson body content must be loaded from the content file associated with the lesson's content source path
- Content must be rendered as readable formatted text, not as raw Markdown syntax
- Rendering must support the Markdown elements defined in Section 9 (Lesson Content Rendering Rules)
- No MDX components or custom component rendering is required or permitted in MVP
- If the content file fails to load, the lesson page must display an appropriate error state (see LESSON-FR-012)

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-004; ADR-003 content storage decision; OQ-LC-001 resolved

---

### LESSON-FR-005 — Published/Reviewed Content Enforcement

Only published and reviewed lessons may be rendered on the lesson page.

- The lesson page must check the lesson's published status before rendering content
- Lessons with a published status of false (draft) must not be rendered regardless of whether the user has the URL
- Draft lesson routes must return a 404 or a redirect to the Learning Center
- This enforcement must be applied server-side so it cannot be bypassed by client-side manipulation

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-013; PRD 16.12 Content Governance

---

### LESSON-FR-006 — Next and Previous Lesson Navigation

Each lesson page must provide navigation controls to move between lessons.

- A "Next lesson" control must appear on every lesson page except the last lesson
- A "Previous lesson" control must appear on every lesson page except the first lesson
- The next and previous controls must be derived from lesson ordering defined in the metadata
- The next lesson control on the final lesson (Where to go next) should link to the Learning Center path page or a relevant follow-on action
- Navigation controls must be visible to all users, both authenticated and unauthenticated
- Navigation does not bypass authentication rules. If an unauthenticated user uses the next lesson control from Lesson 1 to navigate to Lesson 2, the Lesson 2 page must display the login/sign-up prompt, not the lesson content

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-006; Spec 002 LEARNING-FR-008; LESSON-FR-002 (access rules)

---

### LESSON-FR-007 — Mark Complete Button

An authenticated user must be able to mark a lesson as complete from the lesson page.

- The Mark Complete control must be visible on every lesson page for authenticated users
- Activating the Mark Complete control must trigger a progress update call to the backend (Spec 006 Progress Tracking)
- After a successful Mark Complete action, the control must update to reflect a completed/read-only state (e.g., "Completed ✓" label; the button is no longer interactive)
- The Mark Complete control must not be visible to unauthenticated users
- If the Mark Complete action fails (e.g., network error), the user must see a non-disruptive error indication and be able to retry
- Unmarking or toggling lesson completion is out of scope for MVP. Once marked complete, the completed state is permanent within the MVP progress model.

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-005; Spec 002 LEARNING-FR-007; Spec 006 Progress Tracking; OQ-LE-003 resolved

---

### LESSON-FR-008 — Completed Lesson State Display

When an authenticated user has previously completed a lesson, the lesson page must reflect this.

- If a lesson has been marked complete, the Mark Complete control must display a read-only completed state when the user returns to that lesson (e.g., "Completed ✓")
- The completed state must be loaded from the user's progress records (Spec 006) on page load
- A user who revisits a completed lesson should see clearly that they have already completed it, without being prevented from reading the content again
- The read-only completed state cannot be undone in MVP; toggling completion off is out of scope

**Priority:** Must Have
**Source:** PRD 13.9 FR-PROG-001; Spec 006 Progress Tracking; OQ-LE-003 resolved

---

### LESSON-FR-009 — Login Prompt for Protected Lessons

When an unauthenticated user attempts to access a lesson beyond Lesson 1, the lesson page must show a login/sign-up prompt rather than lesson content.

- The prompt must clearly communicate that login is required to read this lesson and track progress
- The prompt must provide a clear call-to-action to log in or create an account
- The prompt should not reveal the lesson content to unauthenticated users
- The prompt must not be a full-page takeover that prevents the user from navigating back to the lesson list

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-005; D-PROD-005

---

### LESSON-FR-010 — First Lesson Preview Call to Action

At the end of Lesson 1 (the unauthenticated preview lesson), the page must prompt the user to sign up to continue.

- After reaching the end of Lesson 1, an unauthenticated user must see a clear prompt to create an account or log in
- The prompt must communicate that creating an account allows progress to be saved and the remaining lessons to be accessed
- The prompt should be presented in the natural reading flow of the lesson page, not as an intrusive pop-up

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-005; US-LE-002

---

### LESSON-FR-011 — AI Tutor Link

Each lesson page must include a visible link to the AI Tutor.

- The AI Tutor link must direct the user to the AI Tutor at `/ai-tutor` (Spec 001)
- The link must be contextually presented to encourage lesson-related questions (e.g., "Have a question about this lesson? Ask the AI Tutor")
- The AI Tutor link must be visible to both authenticated and unauthenticated users
- The AI Tutor is not embedded in the lesson page (no lesson-aware AI, no side panel); the link navigates away from the lesson

**Priority:** Must Have
**Source:** PRD 13.7 FR-LESSON-007; Spec 001 AI Tutor; Spec 002 LEARNING-FR-009

---

### LESSON-FR-012 — Optional AI Tutor Starter Question

If a lesson's metadata includes an AI Tutor starter question, it must be displayed near the AI Tutor link.

- The starter question should be displayed as a suggested prompt the user can use when visiting the AI Tutor
- Starter questions are optional; if no starter question is present in lesson metadata, nothing is shown in its place
- Starter questions must not be displayed as required or mandatory questions

**Priority:** Should Have
**Source:** Spec 002 Content Model (AI Tutor starter question attribute)

---

### LESSON-FR-013 — Error and Missing Lesson State

The lesson page must handle error states gracefully.

- If a lesson slug does not match any published lesson, the page must return a 404 or display a friendly "Lesson not found" message with a link back to the Learning Center
- If the lesson content file fails to load after the lesson metadata is found, the page must display a friendly error message rather than a blank or broken page
- Error states must not expose internal technical details, file paths, or stack traces to users
- Error states must not prevent the user from navigating to other parts of the product

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-003, NFR-REL-004

---

### LESSON-FR-014 — No Draft Content Exposure

Draft lesson content must never be served or visible to any user.

- The lesson page implementation must not render draft lesson content even if the URL is known or guessed
- Draft lesson routes must return a 404 or redirect server-side
- The presence or absence of draft lessons must not be discoverable from the lesson page response

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-013; PRD 16.12 Content Governance

---

## 8. Non-Functional Requirements

### NFR: Accessibility

- Lesson headings must use correct semantic HTML heading levels (H1 for lesson title, H2/H3 for content sections)
- Navigation controls (next, previous, mark complete) must be keyboard-accessible and have clear accessible labels
- The Mark Complete button must clearly indicate its state (not yet complete vs. completed) in a way that is not color-only
- Lesson body content must maintain sufficient text contrast for readability
- Code blocks in lesson content must be legible. Syntax highlighting is deferred to post-MVP; plain monospace rendering is used in MVP.

**Source:** PRD 14.10 NFR-ACC-001 through NFR-ACC-005

---

### NFR: Performance

- Lesson content pages must load quickly for comfortable repeated use during a learning session
- Lesson content should be statically generated where possible to minimize server response time
- The authenticated vs. unauthenticated rendering difference (content vs. login prompt) must not introduce significant additional latency
- Moving from one lesson to the next must feel fast; avoid full-page loading spinners for lesson-to-lesson navigation where the framework supports it

**Source:** PRD 14.3 NFR-PERF-002, NFR-PERF-003

---

### NFR: Security

- Draft and unpublished lesson routes must be protected server-side; client-side protection alone is insufficient
- The authentication check for lesson access must be performed before any lesson content is returned to the client
- Lesson page routes must not expose the existence of unpublished lessons in their responses (404, not 403)
- No user-generated content is rendered in the lesson page; all content is from controlled repository files

**Source:** PRD 14.6 NFR-SEC-003, NFR-SEC-004

---

### NFR: Privacy

- No sensitive user data is collected or stored at the lesson page level beyond what is needed for progress tracking (handled by Spec 006)
- The Mark Complete action communicates the minimum necessary data: user identity and lesson ID
- No advertising, third-party tracking, or analytics scripts should be added to lesson pages that would expose user reading behavior to external parties

**Source:** PRD 14.7 NFR-PRIV-001

---

### NFR: Maintainability

- Adding a new published lesson must not require changes to lesson page rendering logic; only a new content file and a metadata entry are needed
- The Markdown rendering implementation must be based on a well-supported, standard library to minimize maintenance burden
- The lesson page component should be clearly structured so that future additions (e.g., quiz rendering, lesson-aware AI) can be added without rewriting the core layout

**Source:** PRD 14.13 NFR-MAIN-004, NFR-MAIN-005

---

### NFR: Reliability

- Lesson content rendering must degrade gracefully if the content file cannot be loaded (see LESSON-FR-013)
- The Mark Complete action must handle backend failures without losing the user's reading position
- Navigation between lessons must not cause the entire page to crash; errors in one lesson must not prevent other lessons from loading

**Source:** PRD 14.4 NFR-REL-003, NFR-REL-005

---

### NFR: SEO for Public First Lesson

- The first lesson page (What is IBM i?) must be publicly accessible for search engine indexing
- The first lesson page must include appropriate metadata: a descriptive page title and meta description
- The first lesson's URL is `/learn/ibm-i-fundamentals/what-is-ibm-i` (slug format approved per OQ-LE-005); this URL must be stable and must not change after publication
- Protected lesson pages must not generate error responses for search crawlers; a 200 status with a login prompt or a 403 with appropriate headers is acceptable

**Source:** PRD 14 NFR discussion; Spec 002 NFR SEO

---

## 9. Lesson Content Rendering Rules

This section defines the Markdown elements that the lesson experience must render correctly. All lesson content is written in plain Markdown (.md) for the MVP. No MDX components, interactive elements, or custom React components are permitted within lesson content files.

### Supported Markdown Elements

| Element | Example | Required |
|---|---|---|
| Level 1 heading | `# Heading` | Must have (lesson sections) |
| Level 2 heading | `## Sub-heading` | Must have |
| Level 3 heading | `### Sub-sub-heading` | Should have |
| Paragraph text | Plain prose | Must have |
| Unordered (bullet) list | `- item` | Must have |
| Ordered (numbered) list | `1. item` | Must have |
| Fenced code block | ` ``` ` delimited blocks | Must have (IBM i syntax examples) |
| Inline code | `` `code` `` | Must have |
| Links | `[text](url)` | Must have |
| Bold text | `**bold**` | Must have |
| Italic text | `*italic*` | Should have |
| Horizontal rule | `---` | Could have |
| Basic table | Pipe-delimited table syntax | Should have (useful for comparison content) |
| Block quote | `> quote` | Could have |

### What Is Not Supported in MVP

- MDX component syntax
- Custom React/JSX components embedded in content
- HTML tags inside Markdown files
- Syntax highlighting in code blocks — plain monospace rendering is used in MVP; syntax highlighting is deferred to post-MVP (OQ-LE-004 resolved)
- Interactive elements of any kind embedded in lesson content

### Rendering Notes

- Code blocks containing IBM i commands, RPGLE, CLLE, or SQL must render in a plain monospace font. No syntax highlighting is applied in MVP.
- Long code blocks must be horizontally scrollable on small screens rather than wrapping.
- Links in lesson content should open in the same tab (default behavior); external links should open in a new tab

---

## 10. UX Requirements

The following UX requirements define the expected layout and interaction patterns for the lesson page. Specific visual design and component choices are to be determined during implementation.

### Lesson Page Layout

- The lesson page has a clear, focused reading layout
- The primary purpose of the lesson page is content reading; the layout must not clutter the reading experience with excessive UI elements
- The lesson page must be comfortable to read on both desktop and mobile browser sizes

### Title Area

- The lesson title appears prominently at the top of the page
- The learning path name (IBM i Fundamentals) and lesson position (e.g., Lesson 4 of 12) may appear above the title as breadcrumb or context text
- Estimated reading time is displayed below or near the title if present in lesson metadata

### Reading Content Area

- The lesson body content occupies the main content area of the page
- Content is rendered from plain Markdown with appropriate typographic styling
- Code blocks are rendered in a monospace font, visually distinct from prose text
- The reading area must have comfortable line length and font size for extended reading

### AI Tutor Callout or Link

- A contextual call-to-action linking to the AI Tutor appears within the lesson page
- The AI Tutor link is positioned in a way that feels natural within the lesson flow — either after a content section or at the end of the lesson
- If a starter question is present in lesson metadata, it is displayed near the AI Tutor link

### Mark Complete Area

- The Mark Complete button appears at the bottom of the lesson page for authenticated users who have not yet completed the lesson.
- After marking complete, the button area updates to a read-only completed state (e.g., "Completed ✓") and displays a next-step prompt (e.g., "Continue to the next lesson →").
- Once a lesson is marked complete, the Mark Complete control becomes read-only. Toggling or unmarking completion is not available in MVP.
- The Mark Complete area is not shown to unauthenticated users.

### Next and Previous Navigation

- Clear next and previous lesson controls appear at the bottom of the lesson page
- The controls display the title of the adjacent lesson where space allows
- The first lesson has no previous control (or a visually disabled one)
- The last lesson's next control leads to a relevant end-of-path action

### Login Prompt State

- When an unauthenticated user reaches a protected lesson (beyond Lesson 1), the lesson content area is replaced with a friendly login/sign-up prompt
- The prompt clearly states why login is needed and provides a call-to-action
- The lesson title and metadata area may still be shown to communicate what the lesson contains

### First Lesson Preview CTA

- At the end of Lesson 1 (visible to unauthenticated users), a clear call-to-action appears prompting the user to create an account to save progress and continue to the next lesson
- The CTA must be in the natural reading flow of the page

### Error State

- If a lesson cannot be found or loaded, the page displays a friendly message
- The error message includes a link back to the IBM i Fundamentals learning path page
- No technical error details are shown to the user

---

## 11. Access Rules

This section consolidates the lesson access rules defined across Spec 002 and Spec 003 into a single clear reference.

| User State | Lesson | Access Result |
|---|---|---|
| Unauthenticated | Lesson 1 (What is IBM i?) | Full lesson content accessible; no login required |
| Unauthenticated | Any published lesson beyond Lesson 1 | Login/sign-up prompt shown; content not displayed |
| Unauthenticated | Draft or unpublished lesson | 404 or redirect; lesson does not exist publicly |
| Authenticated | Any published lesson | Full lesson content accessible |
| Authenticated | Draft or unpublished lesson | 404 or redirect; draft is never served |
| Any user | Non-existent lesson slug | 404 or friendly "not found" error page |

These rules must be enforced server-side on every request. Client-side enforcement alone is not sufficient.

---

## 12. Dependencies

The Lesson Experience feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Database | Supabase PostgreSQL for lesson metadata lookups and progress record writes | ADR-003 |
| Authentication | Supabase Auth for gating lesson access beyond Lesson 1 | ADR-004 |
| Tech stack | Next.js + TypeScript for lesson page routing and Markdown rendering | ADR-001 |
| Content storage | Lesson body content in plain Markdown (.md) files in the repository | ADR-003; OQ-LC-001 resolved |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 002: Learning Center | Defines the learning path structure, lesson ordering, and route conventions that the Lesson Experience implements at the page level |
| Spec 004: User Account and Onboarding | Authentication must be in place before the access rules in Section 11 can be enforced |
| Spec 006: Progress Tracking | Mark Complete writes a completion record; completed lesson state is read from the progress tracking implementation |
| Spec 001: AI Tutor | The AI Tutor link on each lesson page routes to the AI Tutor feature; Spec 001 governs AI Tutor behavior |
| Spec 009: Content Governance | The content review and publication workflow governs which lessons qualify as published and therefore accessible (LESSON-FR-005, LESSON-FR-014) |

---

## 13. Acceptance Criteria

The Lesson Experience feature is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Content Rendering

- [ ] A lesson page loads and displays its title, metadata, and body content
- [ ] Lesson body content is rendered from a plain Markdown file, not from a database
- [ ] Headings, paragraphs, bullet lists, numbered lists, code blocks, inline code, and links all render correctly in lesson content
- [ ] Estimated reading time appears on the lesson page when present in metadata; no placeholder is shown when absent
- [ ] Draft and unpublished lessons return a 404 or redirect and cannot be accessed by any user

### Access Control

- [ ] Lesson 1 (What is IBM i?) is fully readable without authentication
- [ ] An unauthenticated user who attempts to open any lesson beyond Lesson 1 sees a login/sign-up prompt instead of lesson content
- [ ] An authenticated user can open and read all published lessons
- [ ] The access enforcement is applied server-side and cannot be bypassed client-side
- [ ] At the end of Lesson 1, an unauthenticated user sees a clear call-to-action to create an account

### Navigation

- [ ] The next lesson control appears on every lesson page except the last
- [ ] The previous lesson control appears on every lesson page except the first
- [ ] The first lesson has no active previous lesson control
- [ ] Clicking next or previous navigates to the correct adjacent lesson

### Mark Complete

- [ ] The Mark Complete button appears for authenticated users on every lesson page
- [ ] The Mark Complete button is not shown to unauthenticated users
- [ ] Clicking Mark Complete records a lesson completion entry (Spec 006)
- [ ] After marking complete, the control updates to a read-only completed state; the button is no longer interactive
- [ ] A previously completed lesson shows the read-only completed state when the user returns to it
- [ ] No option to unmark or toggle completion is available in MVP

### AI Tutor Integration

- [ ] Each lesson page includes a visible link to the AI Tutor at `/ai-tutor`
- [ ] The AI Tutor link is accessible to both authenticated and unauthenticated users
- [ ] A starter question is displayed near the AI Tutor link when one is present in lesson metadata
- [ ] No starter question placeholder is shown when the metadata field is absent

### Error Handling

- [ ] A lesson URL that does not match any published lesson returns a 404 or a user-friendly not-found page
- [ ] A lesson content file load failure displays a friendly error message with a link back to the Learning Center
- [ ] Error states do not expose technical details to the user

### Out-of-Scope Verification

- [ ] No quiz or knowledge check is present on any lesson page
- [ ] No glossary feature is embedded in the lesson page
- [ ] The AI Tutor is not embedded as a side panel or inline chat; only a link to `/ai-tutor` is present
- [ ] No interactive 5250 lab or RPG playground is present
- [ ] No code execution or real IBM i connectivity is present
- [ ] No content authoring or CMS editing UI is accessible to users

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Markdown rendering inconsistency — different headings, code blocks, or tables render differently across browsers or screen sizes | Medium | Medium | Use a well-supported, widely-tested Markdown rendering library; include visual review of all supported element types before beta launch |
| Draft lesson exposure — a draft lesson URL is discoverable or accessible despite not being listed | Low | High | Enforce draft access control server-side on every request; return 404 for all non-published lesson routes; test specifically for draft content exposure before beta |
| Confusing login gate — unauthenticated users reach a lesson and do not understand why they are blocked | Medium | Medium | Login prompt must clearly communicate what the user must do and why (to save progress and continue learning); do not show a generic 401 error page |
| Mark Complete dependency on progress tracking — Spec 006 is not ready when the Lesson Experience is built | Medium | Medium | Coordinate implementation with Spec 006 before building the Mark Complete behavior; do not implement a separate progress model in the lesson page |
| Lesson page becoming too feature-heavy — pressure to add quizzes, AI side panels, or glossary tooltips during implementation | Medium | Medium | This spec explicitly excludes these features; any addition requires Product Owner approval and a PRD update |
| AI Tutor link causes context confusion — user clicks the link expecting lesson-aware AI but gets a generic AI Tutor | Low | Medium | The AI Tutor link label should set correct expectations: "Ask the AI Tutor a question" rather than implying the AI Tutor knows the lesson; the optional starter question helps frame the interaction |
| Long lessons feel unstructured — lessons without clear sections feel hard to read | Low | Medium | Content governance (Spec 009) must require lessons to use headings that break the content into navigable sections |
| Static generation vs. authenticated access tension — statically generated lesson pages may complicate per-user access control | Medium | Medium | Resolve the static vs. server-side rendering strategy during implementation planning; the authenticated access check may require server-side rendering or a hybrid approach for protected lessons |

---

## 15. Open Questions

The following questions remain genuinely open for the Lesson Experience. They do not reopen questions already resolved in Spec 002.

| ID | Question | Owner | Needed Before |
|---|---|---|---|
| OQ-LE-001 | Which Markdown rendering library should be used? The choice affects rendering quality, bundle size, and maintenance. | Engineering | Implementation planning |
| OQ-LE-002 | Should lesson pages use static generation (SSG), server-side rendering (SSR), or a hybrid approach? This affects how authenticated vs. unauthenticated access is enforced and how fast lesson pages load. | Engineering | Implementation planning |

---

## 16. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any Lesson Experience implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope, access rules, and acceptance criteria
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] OQ-LE-001 (Markdown library) is decided — this affects the implementation approach
- [ ] OQ-LE-002 (SSG vs. SSR vs. hybrid) is decided — this is architecturally significant for access control and performance

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for the Lesson Experience is created and approved
- [ ] Spec 002 (Learning Center) is approved and the route structure is confirmed
- [ ] Spec 004 (User Account and Onboarding) is approved — auth must be in place for access control
- [ ] Spec 006 (Progress Tracking) is available — Mark Complete behavior depends on progress tracking
- [ ] Spec 009 (Content Governance) is available — lesson publication workflow must exist before lessons can be published
- [ ] The lesson slug format has been confirmed for the first lessons before content writing begins (approved: lowercase kebab-case, no number prefix, per OQ-LE-005 resolved)
- [ ] At least one reviewed lesson content file exists to confirm the rendering implementation works end-to-end

### Notes for Implementation Planning

- The access control enforcement in Section 11 must be implemented server-side. Do not rely on client-side route protection alone.
- The Markdown rendering library decision (OQ-LE-001) and the static vs. dynamic rendering decision (OQ-LE-002) are closely related. They should be evaluated together and resolved in the same implementation planning session.
- The lesson page must not implement its own progress data model. All lesson completion writes must go through the Spec 006 Progress Tracking implementation.
- The AI Tutor starter question is optional lesson metadata. The lesson page implementation must gracefully handle its absence without rendering a broken or empty UI element.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP Lesson Experience spec based on PRD v2.9, Spec 001, and Spec 002 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved Mark Complete state, code block rendering, and slug format decisions |
| 2026-07-01 | 1.0 | Approved Lesson Experience SDD spec for implementation planning |
