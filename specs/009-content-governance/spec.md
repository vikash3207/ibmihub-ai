# Spec 009: Content Governance

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 009 |
| Feature | Content Governance |
| Status | Approved |
| Version | 1.0 |
| Owner | Product + Content + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center lesson display and publication rules |
| specs/003-lesson-experience/spec.md | v1.0 Approved | Lesson rendering, template, slug, and access rules |
| specs/006-progress-tracking/spec.md | v1.0 Approved | Published lesson denominator and progress calculation |
| specs/008-public-landing-experience/spec.md | v1.0 Approved | Public visibility and SEO expectations for Lesson 1 |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Lesson content stored as version-controlled files |

---

## 2. Purpose

Content governance ensures that IBM i Fundamentals lesson content is accurate, consistent, beginner-friendly, reviewed by a human, and safe to publish before any user sees it.

IBMiHub AI is differentiated by original, trustworthy, IBM i-specific content. A lesson that contains inaccurate technical information, copies external material, or is published without review could damage the credibility of the product and the trust of the IBM i community. Once trust is lost, it is difficult to recover.

Content governance also protects the product legally and ethically. IBM i is a specialized domain where incorrect guidance — particularly around RPGLE, job log behavior, or database operations — could mislead users who apply AI Tutor advice or lesson content to production systems.

This spec defines the MVP content governance process: how lessons are authored, structured, reviewed, approved, published, and protected from accidental exposure in draft state. It defines the lesson template, the approved lesson path, the content status lifecycle, the quality checklist, and the publication rules that all downstream specs depend on.

This spec does not create an admin UI, a CMS, or an automated publishing pipeline. Content governance in the MVP is a disciplined human workflow backed by Git version control.

---

## 3. MVP Scope

The MVP Content Governance process covers the IBM i Fundamentals learning path — from initial lesson draft through review, approval, and publication.

### In Scope for MVP

| Capability | Description |
|---|---|
| Git/repository-based lesson content workflow | Lesson content is authored, reviewed, and version-controlled in the repository (ADR-003) |
| Plain Markdown lesson files | Lesson body content is stored as `.md` files (Spec 003 Lesson Content Rendering Rules; Spec 002 content model) |
| Separate lesson metadata | Lesson metadata (title, slug, status, order, estimated reading time, AI Tutor starter question) is managed separately from lesson body content |
| Approved 12-lesson IBM i Fundamentals path | The approved lesson sequence is defined in Section 5 |
| Minimum 8 complete/reviewed lessons for beta launch | At least 8 lessons must be complete, reviewed, approved, and published before MVP beta releases (D-PROD-002 resolved) |
| Lesson status lifecycle | Lessons move through defined statuses: Draft → Review Ready → Approved → Published (see Section 7) |
| Content review before publication | No lesson may be published without human review |
| Published lessons only visible to users | Only lessons with a published status appear in the Learning Center and lesson pages |
| Draft and unpublished lessons hidden from all users | Draft, Review Ready, and Approved-but-not-published lessons are invisible to all users |
| Lesson template enforcement | All MVP lessons must follow the approved template defined in Section 6 |
| Basic quality checklist | Each lesson must pass the quality checklist in Section 12 before being marked approved |
| AI Tutor starter question review | The optional AI Tutor starter question for each lesson is reviewed as part of the lesson review process |
| Content versioning through Git history | All lesson changes are tracked through Git commits |
| Repository-based lesson review checklist | A reusable checklist template stored at `docs/content/lesson-review-checklist.md` is used for all lesson reviews; completed during pull request review or review record (OQ-CONTENT-002 resolved) |
| No CMS or admin editing UI in MVP | Content updates go through the repository workflow; no web-based authoring or editing interface is built |

---

## 4. Explicitly Out of Scope for MVP

| Excluded Capability | Reason |
|---|---|
| CMS or admin authoring UI | Out of MVP scope (PRD 12; Spec 002 OQ-LC-004 resolved) |
| User-generated lesson content | Future feature |
| Community lesson contributions | Future feature |
| Public lesson comments or discussions | Future feature |
| Lesson ratings or helpfulness scores | Separate from content governance; future feature |
| Quizzes or knowledge checks embedded in lessons | Deferred to post-MVP (D-PROD-003) |
| Certifications or completion badges | Future feature (PRD 11) |
| Multi-language lesson content | MVP is English-only (PRD 14.17 NFR-LOC-001) |
| Video lessons | Not in MVP curriculum |
| Enterprise custom curriculum | Future feature (PRD 11) |
| Automated AI-generated content publishing without human review | All published content must be reviewed by a human |
| Automated content accuracy guarantees | No automated correctness validation is built in MVP |
| External contributor or collaborator workflow | Future feature |
| Content marketplace or user-submitted lessons | Future feature |

---

## 5. Approved Lesson Path

The IBM i Fundamentals learning path is the only approved learning path for the MVP. It consists of 12 lessons in a fixed approved sequence.

### IBM i Fundamentals — Approved Lesson Sequence

| # | Lesson Title | Beta Status |
|---|---|---|
| 1 | What is IBM i? | Required — public preview |
| 2 | Why IBM i still matters | Required for full beta |
| 3 | IBM i platform overview | Required for full beta |
| 4 | Libraries and objects | Required for full beta |
| 5 | 5250 screen basics | Required for full beta |
| 6 | Physical files and logical files | Required for full beta |
| 7 | Introduction to RPGLE | Required for full beta |
| 8 | Introduction to CLLE | Required for full beta |
| 9 | Introduction to DB2 for i | Optional for minimum beta threshold |
| 10 | Job logs and spool files basics | Optional for minimum beta threshold |
| 11 | Basic IBM i development workflow | Optional for minimum beta threshold |
| 12 | Where to go next | Optional for minimum beta threshold |

### Beta Launch Thresholds

- **Target:** All 12 lessons complete, reviewed, approved, and published.
- **Minimum for beta launch:** Lessons 1 through 8 (8 lessons) complete, reviewed, approved, and published.
- **Lesson 1 specifically** must be published first as it is the public preview lesson and is linked from the landing page.

### Lesson Ordering

- Lessons must appear in the Learning Center in the exact approved sequence above.
- Lesson ordering in the metadata must match the position number above.
- The order must not be rearranged without Product Owner approval and a revision to this spec.

---

## 6. Approved Lesson Template

All MVP IBM i Fundamentals lessons must follow this template. Sections may be combined or shortened for very short lessons but must not be skipped entirely without justification.

| Section | Purpose |
|---|---|
| 1. Lesson Title | Clearly identifies the lesson topic |
| 2. Learning Objective | States what the user will understand after completing the lesson |
| 3. Simple Explanation | Explains the concept in beginner-friendly language |
| 4. Why It Matters | Connects the concept to real IBM i work |
| 5. Practical Example | Provides an original IBM i example or scenario |
| 6. Common Confusions | Addresses likely beginner misunderstandings about this topic |
| 7. Quick Recap | Summarizes the key points from the lesson |
| 8. Try Asking AI Tutor | Suggests a question the user might ask the AI Tutor about this lesson |
| 9. Mark Complete | The lesson page control; not a content section but must flow naturally |
| 10. Next Lesson | Guides the user to the next lesson in the sequence |

**Notes:**
- Sections 1–7 are authored as content in the lesson Markdown file.
- Section 8, "Try Asking AI Tutor", may appear in the lesson Markdown body as a short prompt area directing users to ask the AI Tutor, or it may be rendered by the Lesson Experience (Spec 003) from lesson metadata. The specific AI Tutor starter question text is stored in lesson metadata and reviewed as part of content governance (CONTENT-FR-010), not embedded in the Markdown body.
- Section 9 (Mark Complete) is implemented by the Lesson Experience (Spec 003) as a UI element; it is not authored in the lesson Markdown file.
- Section 10 (Next Lesson) is driven by lesson ordering metadata and rendered by Spec 003; it is not authored in the Markdown file.

---

## 7. Content Status Lifecycle

Each lesson has a status that determines its visibility to users and its position in the review process.

| Status | Meaning | Visible to Users? |
|---|---|---|
| Draft | Lesson is being written; incomplete or unreviewed | No |
| Review Ready | Lesson is complete and ready for Product/Content review | No |
| Approved | Lesson has been reviewed and accepted; awaiting publication | No |
| Published | Lesson is approved and publicly visible according to access rules | Yes |
| Unpublished / Archived | Lesson was published and has been removed; retained in history | No |

### Status Transition Rules

- A lesson must progress through Draft → Review Ready → Approved → Published in order.
- A lesson must never move from Draft directly to Published.
- Only the **Product Owner / Founder** may move a lesson from Review Ready to Approved (OQ-CONTENT-001 resolved).
- Only a deliberate publish action may move a lesson from Approved to Published.
- A published lesson may be moved back to Unpublished/Archived if a significant inaccuracy or policy violation is found.
- Lessons in Draft, Review Ready, or Approved-but-not-published status must never appear in the public Learning Center or lesson list.

---

## 8. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-CONT-001 | Product/Content Owner | Create a lesson draft in a Markdown file in the repository | I can write and iterate on lesson content before sharing it for review |
| US-CONT-002 | Content Reviewer | Review a lesson marked as Review Ready against the quality checklist | I can confirm the lesson is accurate, beginner-friendly, and follows the template before approving it |
| US-CONT-003 | Product Owner | Mark a reviewed and approved lesson as published | The lesson becomes visible to users in the Learning Center |
| US-CONT-004 | Any user | Never see draft or unapproved lesson content | My experience is based on reviewed, intentionally published content only |
| US-CONT-005 | Product Owner | Confirm that at least 8 reviewed, approved, and published lessons are available before beta launch | The minimum beta content threshold is met before inviting users |
| US-CONT-006 | Product/Content Owner | Update a published lesson safely | I can fix an inaccuracy without exposing an incomplete version to users |
| US-CONT-007 | Product Owner | Ensure no AI-generated content is published without human review | The product never accidentally publishes unreviewed AI-assisted content |

---

## 9. Functional Requirements

### CONTENT-FR-001 — Lesson File Storage

Lesson body content must be stored as version-controlled plain Markdown (.md) files in the repository.

- Each lesson must have exactly one Markdown file containing its body content
- Lesson files must be version-controlled in the repository (ADR-003)
- Lesson files must be stored in a logical directory structure within the repository
- No lesson body content is stored in the database; the database stores only lesson metadata and user progress records

**Priority:** Must Have
**Source:** ADR-003 Content Storage Decision; Spec 003 Lesson Content Rendering Rules; Spec 002 content model; PRD 16.12

---

### CONTENT-FR-002 — Lesson Metadata Requirements

Each lesson must have associated metadata stored separately from the lesson body content.

- The metadata must include the fields defined in Section 11 (Lesson Metadata Requirements)
- Metadata must be readable by the Learning Center, Lesson Experience, Progress Tracking, and Dashboard implementations
- The lesson status field is the authoritative source for whether a lesson appears to users. No separate published boolean flag is used in MVP (OQ-CONTENT-003 resolved). A status of Published is the only state that makes a lesson visible.

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-003; Spec 003 LESSON-FR-001; Section 11; OQ-CONTENT-003 resolved

---

### CONTENT-FR-003 — Lesson Status Values

Each lesson must have one of the defined status values from Section 7.

- The status must be one of: Draft, Review Ready, Approved, Published, Unpublished/Archived (OQ-CONTENT-003 resolved — a single status field is used; no separate published boolean)
- Status must be stored in lesson metadata
- Status transitions must follow the rules in Section 7
- Status must be the single authoritative source for user visibility decisions

**Priority:** Must Have
**Source:** Section 7 Content Status Lifecycle; Spec 002 LEARNING-FR-013; Spec 003 LESSON-FR-005; OQ-CONTENT-003 resolved

---

### CONTENT-FR-004 — Published Lesson Visibility

Only Published lessons may be visible to users in the Learning Center or accessible at lesson page routes.

- The Learning Center must filter lesson lists to show only Published lessons
- Lesson page routes for non-Published lessons must return a 404 or appropriate error
- This rule applies to all users, authenticated or unauthenticated

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-013; Spec 003 LESSON-FR-005, LESSON-FR-014

---

### CONTENT-FR-005 — Draft and Unpublished Lesson Protection

Lessons with a status of Draft, Review Ready, Approved, or Unpublished/Archived must never be visible to any user (OQ-CONTENT-003 resolved — only status = Published is visible).

- The learning center must not list these lessons
- The lesson page route for these lessons must not serve content
- The protection must be enforced server-side; client-side filtering alone is not sufficient
- Lesson URLs for non-published lessons must not appear in the Learning Center, landing page, or any public-facing surface

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-013; Spec 003 LESSON-FR-005, LESSON-FR-014; PRD 16.12 Content Governance

---

### CONTENT-FR-006 — Content Review Before Publication

No lesson may be published without passing through the review process (OQ-CONTENT-001 and OQ-CONTENT-002 resolved).

- The designated approver for lesson publication is the **Product Owner / Founder**. Only the Product Owner / Founder may move a lesson from Review Ready to Approved.
- Engineering may review technical rendering, metadata correctness, routing, and Markdown compatibility but is not the content approver.
- A lesson must be marked Review Ready and reviewed by the Product Owner / Founder before being marked Approved.
- An Approved lesson must be deliberately published by the Product Owner / Founder; there must be no automatic or accidental publishing.
- AI-assisted or AI-generated lesson draft content must be reviewed by the Product Owner / Founder before any lesson is moved to Approved or Published status.
- The review must be completed using the repository-based checklist template stored at `docs/content/lesson-review-checklist.md`. The completed checklist must be recorded in the pull request description or review record before the lesson is marked Approved.
- The checklist must match the content quality checklist in Section 12.

**Priority:** Must Have
**Source:** PRD 16.12 Content Governance; PRD 16.13 Content Lifecycle; US-CONT-002, US-CONT-007; OQ-CONTENT-001 resolved; OQ-CONTENT-002 resolved

---

### CONTENT-FR-007 — Beta Readiness Threshold

The MVP beta must not launch until at least 8 lessons are complete, reviewed, approved, and published.

- The specific 8 lessons required are Lessons 1 through 8 in the approved sequence (Section 5)
- Lesson 1 (What is IBM i?) must be published first as it is the public preview lesson
- Beta launch must be blocked until this threshold is confirmed by the Product Owner

**Priority:** Must Have
**Source:** D-PROD-002 resolved; Section 5 Approved Lesson Path

---

### CONTENT-FR-008 — Lesson Ordering

Lessons must appear in the Learning Center in the exact approved sequence from Section 5.

- The lesson order in metadata must match the position numbers in Section 5
- No lessons may be shown out of sequence
- Lesson order must not be changed without Product Owner approval and a revision to this spec

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-003; D-CONT-001 resolved

---

### CONTENT-FR-009 — Slug Stability

Published lesson slugs must be stable and must not change after publication.

- Each lesson slug is defined in lesson metadata and must remain unchanged after a lesson is published
- Approved slug format: lowercase kebab-case derived from the lesson title, without lesson number prefixes (e.g., `what-is-ibm-i`, `libraries-and-objects`, `introduction-to-rpgle`)
- If a slug must change for a critical reason, the old URL must redirect to the new URL and the Product Owner must be notified
- The slug format is consistent with the route structure approved in Spec 003 OQ-LE-005 resolved

**Priority:** Must Have
**Source:** Spec 003 LESSON-FR-001; Spec 003 OQ-LE-005 resolved

---

### CONTENT-FR-010 — AI Tutor Starter Question Review

The optional AI Tutor starter question associated with each lesson must be reviewed as part of the lesson review process.

- If a lesson includes an AI Tutor starter question in its metadata, the question must be reviewed for appropriateness, accuracy, and helpfulness
- The starter question must not encourage users to share private production code, credentials, or sensitive data
- The starter question must be reviewed before the lesson is moved to Approved status

**Priority:** Should Have
**Source:** PRD 16; Spec 003 LESSON-FR-012; Spec 002 Content Model — AI Tutor starter question attribute

---

### CONTENT-FR-011 — Markdown Rendering Alignment

All lesson Markdown content must use only the Markdown elements supported by the lesson rendering implementation.

- Lesson content must use the Markdown elements defined in Spec 003 Section 9 (Lesson Content Rendering Rules)
- No MDX components, HTML tags, or custom components may be embedded in lesson Markdown files
- Code blocks must use fenced syntax and plain monospace rendering is expected in MVP
- The reviewer must verify that the lesson renders correctly as part of the review checklist

**Priority:** Must Have
**Source:** Spec 003 Section 9 Lesson Content Rendering Rules

---

### CONTENT-FR-012 — Content Update Process

Updates to published lessons must follow a safe process that does not expose incomplete content to users.

- A published lesson that needs correction must be updated in a new branch or commit
- The updated content must be reviewed and approved before replacing the published version
- A simple copy fix (e.g., typo correction) may be reviewed more quickly, but human approval is still required
- The lesson status must remain Published during the review of the update; the update is only live after deliberate publication of the revised content

**Priority:** Must Have
**Source:** PRD 16.13 Content Lifecycle

---

### CONTENT-FR-013 — No CMS or Admin Editing UI

No content management system, web-based editing interface, or admin authoring UI is built in MVP.

- All lesson content changes go through the repository workflow (create file, edit in code editor or text editor, commit, review, approve, publish)
- No browser-based lesson editor, preview, or publishing dashboard is implemented in MVP
- Content operations are performed by the Product Owner or content team with repository access

**Priority:** Must Have
**Source:** PRD 12 MVP Explicit Exclusions; Spec 002 LEARNING-FR-010 Out of Scope

---

### CONTENT-FR-014 — Human Review Required Before Publication

No lesson content may be moved to Published status without explicit review and approval by the Product Owner / Founder (OQ-CONTENT-001 resolved).

- This requirement applies even when AI assistance is used to draft or improve lesson content
- The Product Owner / Founder must verify that the lesson content is accurate, original, beginner-friendly, and compliant with the quality checklist before approving
- AI-generated draft content is permitted as a starting point but must never be published without Product Owner / Founder review and approval
- The review must be completed using the repository-based checklist template at `docs/content/lesson-review-checklist.md` (OQ-CONTENT-002 resolved)

**Priority:** Must Have
**Source:** PRD 16.11 AI-Assisted Content Creation Policy; US-CONT-007; OQ-CONTENT-001 resolved; OQ-CONTENT-002 resolved

---

## 10. Non-Functional Requirements

### NFR: Accuracy

- Lesson content must not contain technically incorrect IBM i statements
- If accuracy is uncertain, the reviewer must verify against official IBM documentation before approving
- Lessons must not claim production correctness or guarantee outcomes for specific IBM i implementations
- AI Tutor starter questions must reflect what the AI Tutor can actually answer in the MVP scope

**Source:** PRD 16.14 Content Quality Criteria; PRD 16.8 Content Style Guidelines

---

### NFR: Maintainability

- Lesson content in Markdown files must be easy to update through the standard repository workflow
- Adding a new lesson must not require changes to lesson rendering logic; only a new content file and a metadata entry are needed
- Content governance tooling and workflows must be documented enough that a new content contributor can follow them without guidance

**Source:** PRD 14.13 NFR-MAIN-004; PRD 16.12 Content Governance

---

### NFR: Security

- Draft and non-published lesson content must be protected from exposure through repository access controls
- No lesson content in Draft, Review Ready, Approved, or Unpublished/Archived status must be accessible through product routes
- Published status (single status field, per OQ-CONTENT-003 resolved) must be enforced server-side; it must not be possible for a user to guess or construct a URL to access unpublished content
- MVP assumes lesson drafts and review-ready content are stored in a private repository or a non-public location. If the repository or content source becomes public in the future, draft, review-ready, approved-but-not-yet-published, and archived lesson content must not be exposed publicly. Product routes must still enforce Published-only access server-side regardless of repository visibility.

**Source:** Spec 003 LESSON-FR-005, LESSON-FR-014; PRD 14.6 NFR-SEC-003

---

### NFR: Privacy

- Lesson content must not include real user data, customer data, or examples containing real IBM i customer code
- Examples and scenarios must be original and fictional for the purposes of teaching
- Lesson content must not instruct users to share private production code, credentials, or sensitive data with any tool, including the AI Tutor

**Source:** PRD 16.9 Original Content Policy; PRD 14.7 NFR-PRIV-001

---

### NFR: Accessibility

- Lesson Markdown content must use clear heading structures (H1 for lesson title, H2 for major sections, H3 for subsections)
- Code examples in lessons must not rely on color alone to convey meaning
- Lessons must be written in plain, readable English appropriate for non-native English speakers as well as native speakers

**Source:** PRD 14.10 NFR-ACC-001, NFR-ACC-005

---

### NFR: Reliability

- The lesson publication process must be deterministic; a lesson with Published status must always appear and a lesson without Published status must never appear
- Content updates must not cause lesson content to disappear or appear broken during the update process

**Source:** PRD 14.4 NFR-REL-001

---

### NFR: SEO for Public First Lesson

- Lesson 1 (What is IBM i?) must be published and publicly indexable before or at the time of beta launch
- The slug for Lesson 1 (`what-is-ibm-i`) must be stable and must not change after publication
- The Lesson 1 content must be complete and representative of the product's content quality, as it will be seen by search engines and first-time visitors

**Source:** Spec 003 NFR SEO; Spec 008 LANDING-FR-007

---

## 11. Lesson Metadata Requirements

This section defines the metadata attributes required for each lesson at the spec level. This is not a database schema. The specific storage implementation will be defined in the implementation plan.

### Required Metadata Attributes

| Attribute | Purpose | Notes |
|---|---|---|
| Lesson ID | Unique stable identifier | Used for progress tracking records and URL routing |
| Slug | URL-friendly route identifier | Lowercase kebab-case; must be stable after publication |
| Title | Human-readable lesson name | Displayed in lesson list and on lesson page |
| Short description | One or two sentences describing the lesson | Displayed in lesson list |
| Lesson order | Integer position in the IBM i Fundamentals sequence | Determines lesson list ordering and next/previous navigation |
| Learning path ID | Reference to the IBM i Fundamentals path | Supports future multi-path scenarios |
| Status | Current content status | One of: Draft, Review Ready, Approved, Published, Unpublished/Archived. Single status field; no separate published boolean (OQ-CONTENT-003 resolved). |
| Content source path | File path to the lesson Markdown file | Used by the content loading implementation |
| Created date | When the lesson metadata was first created | For record-keeping |
| Updated date | When the lesson metadata or content was last updated | For record-keeping |

### Optional Metadata Attributes

| Attribute | Purpose | Notes |
|---|---|---|
| Estimated reading time | Approximate time to complete the lesson | Optional; manually entered; omitted if not provided (Spec 003 OQ-LC-003 resolved) |
| AI Tutor starter question | A suggested question for the AI Tutor about this lesson | Optional; reviewed as part of lesson review (CONTENT-FR-010) |
| Reviewed/approved indicator | Who reviewed and approved the lesson | Optional tracking for audit trail purposes |

---

## 12. Content Quality Checklist

Each lesson must pass all required checks and any applicable optional checks before it may be moved from Review Ready to Approved (OQ-CONTENT-002 resolved).

The checklist below is the canonical source. A reusable checklist template must be maintained in the repository at `docs/content/lesson-review-checklist.md`. Each lesson review must complete this checklist and record the completion in the pull request description or review record before the lesson is marked Approved.

### Required Checks

| # | Check | Description |
|---|---|---|
| 1 | Correct IBM i terminology | Technical terms are used accurately according to IBM i standards and conventions |
| 2 | Beginner-friendly explanation | The Simple Explanation section can be understood by someone with no IBM i background |
| 3 | Practical example included | A clear, original IBM i example or scenario appears in Section 5 of the template |
| 4 | No unsupported technical claims | Every technical statement is verifiable; no speculation presented as fact |
| 5 | No production-safe guarantee | The lesson does not imply that following its guidance is safe for production without expert review |
| 6 | No private source code or job logs | No real customer code, system data, or sensitive information appears in the lesson |
| 7 | No credentials or customer data | The lesson does not contain passwords, API keys, system addresses, or customer identifiers |
| 8 | Follows approved lesson template | All required template sections (1–8) are present in reasonable form |
| 9 | Markdown renders correctly | The reviewer has confirmed the Markdown is valid and expected elements render correctly |
| 10 | Original content | The lesson content is original and is not copied from IBM documentation, tutorials, blogs, books, or external training providers |
| 11 | Next lesson navigation makes sense | The lesson connects naturally to the next lesson in the sequence; the "Where to go next" guidance is appropriate |

### Applicable When Present

| # | Check | Description |
|---|---|---|
| 12 | AI Tutor starter question is appropriate | If present, the starter question is helpful, IBM i-specific, and does not encourage sharing sensitive data |
| 13 | Code blocks are correct | If code examples are present, they use correct IBM i syntax and are fenced code blocks in Markdown |

---

## 13. Access and Publication Rules

Content governance determines not only what is reviewed and published but also what users may and may not see. These rules align with the access rules defined in Specs 002, 003, 006, and 008.

### Visibility by Status

| Status | Visible in Learning Center | Accessible at Lesson Route | Counts in Progress Denominator |
|---|---|---|---|
| Draft | No | No | No |
| Review Ready | No | No | No |
| Approved (not yet published) | No | No | No |
| Published | Yes | Yes | Yes |
| Unpublished / Archived | No | No | No |

### Public vs. Authenticated Access for Published Lessons

| Lesson | Access |
|---|---|
| Lesson 1 (What is IBM i?) — Published | Public full preview; no login required |
| Published lessons 2 through 12 | Login required; unauthenticated users see a login/sign-up prompt |

### Progress Impact

- Only Published lessons count toward the progress denominator (Spec 006 PROGRESS-FR-008)
- If a published lesson is later unpublished/archived, it must not count toward the denominator
- Users who had previously completed a now-archived lesson retain their completion record, but the lesson no longer counts toward the denominator

---

## 14. Dependencies

The Content Governance feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Content storage | Lesson Markdown files stored in the repository; lesson metadata in the database | ADR-003 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 002: Learning Center | Reads lesson metadata to display the lesson list; must enforce published-only display |
| Spec 003: Lesson Experience | Renders lesson Markdown content; enforces published-only access at the route level; uses slug for routing |
| Spec 006: Progress Tracking | Uses published lesson count as the denominator for progress calculation |
| Spec 008: Public Landing Experience | Links to the published Lesson 1 for the public preview CTA |

---

## 15. Acceptance Criteria

The Content Governance process is considered ready for beta when all of the following are met.

### Content Path

- [ ] The 12-lesson IBM i Fundamentals sequence exists in the approved order (Section 5)
- [ ] At least 8 lessons (Lessons 1–8) are complete, reviewed, approved, and published before beta launch
- [ ] Lesson 1 (What is IBM i?) is the first published lesson and is publicly accessible

### Template and Quality

- [ ] All published lessons follow the approved lesson template (Section 6)
- [ ] All published lessons have passed the content quality checklist (Section 12)
- [ ] No published lesson contains a production-safe guarantee
- [ ] No published lesson contains private source code, job logs, credentials, or customer data
- [ ] All published lesson content is original and not copied from external sources

### Status and Visibility

- [ ] Draft, Review Ready, and Approved-but-not-published lessons are not visible in the Learning Center or accessible at lesson routes
- [ ] Only Published lessons appear in the Learning Center lesson list
- [ ] The progress denominator in Spec 006 counts only Published lessons

### Metadata and Routing

- [ ] Each published lesson has a stable, unique, lowercase kebab-case slug
- [ ] Published lesson slugs match the format approved in Spec 003 OQ-LE-005 resolved
- [ ] No published lesson slug changes after publication without a redirect

### Process

- [ ] No CMS or admin publishing UI is built
- [ ] No AI-generated lesson draft is published without Product Owner / Founder review and approval
- [ ] The Product Owner / Founder is the designated approver for all lesson publication (OQ-CONTENT-001 resolved)
- [ ] The repository-based lesson review checklist template exists at `docs/content/lesson-review-checklist.md` and matches Section 12 (OQ-CONTENT-002 resolved)
- [ ] Lesson status uses a single field (no separate published boolean); status = Published is the only state that makes a lesson visible (OQ-CONTENT-003 resolved)

---

## 16. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Inaccurate IBM i content — a lesson contains technically incorrect information | Medium | High | Quality checklist requires verifying technical claims against IBM documentation before approval; reviewer should have IBM i knowledge or access to someone who does |
| Inconsistent lesson tone or structure — lessons feel inconsistent across the path | Medium | Medium | Approved lesson template enforces structure; style checklist ensures beginner-friendly tone; Product Owner reviews all lessons |
| Draft content accidentally exposed — a lesson in Draft, Review Ready, or Approved status becomes visible to users | Low | High | CONTENT-FR-004 and CONTENT-FR-005 require server-side enforcement; status = Published is the sole visibility gate (OQ-CONTENT-003 resolved); test specifically for non-published lesson accessibility before beta; repository privacy is also noted in NFR Security |
| Publishing fewer than the beta threshold — fewer than 8 lessons are ready at beta launch | Medium | High | CONTENT-FR-007 blocks beta launch until the threshold is confirmed; content creation should begin immediately in parallel with engineering; do not wait for all 12 lessons before starting |
| AI-generated content published without review — AI-assisted lesson drafts bypass the review process | Low | High | CONTENT-FR-006 and CONTENT-FR-014 require human review before any lesson is Approved or Published; the workflow must make skipping review structurally difficult |
| Slug changes breaking links — a published lesson slug is changed, breaking existing URLs | Low | Medium | CONTENT-FR-009 requires slug stability after publication; the approved slug format is defined and must be followed at authoring time; any change requires Product Owner approval and a redirect |
| Scope creep into CMS — pressure to build a content editing or publishing UI during implementation | Medium | Medium | CONTENT-FR-013 explicitly prohibits a CMS in MVP; any addition requires Product Owner approval and a PRD update |

---

## 17. Open Questions

No open questions remain for this spec at this stage. Any new questions discovered during implementation planning should be added here before coding begins.

---

## 18. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before lesson content production begins and before any implementation that depends on published lesson content can be finalized.

### Before Content Production Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the lesson path, template, status lifecycle, and quality checklist
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] The lesson review checklist template (`docs/content/lesson-review-checklist.md`) is created from Section 12 before the first lesson goes to review (OQ-CONTENT-002 resolved)

### Before Implementation Depending on Published Content

- [ ] This spec is approved
- [ ] Lesson metadata design uses a single status field — no separate published boolean (OQ-CONTENT-003 resolved)
- [ ] Lesson 1 is published (required for the landing page public preview CTA and the first lesson public access rule)
- [ ] At least 8 lessons are published before beta launch (CONTENT-FR-007)

### Notes for Implementation Planning

- Content Governance is a dependency for Spec 002, 003, 006, and 008 in a specific way: those specs define rules about published lessons, but those rules can only be tested and verified once real published lessons exist. Lesson content production should begin as early as possible in parallel with engineering work.
- The single-status-field design (OQ-CONTENT-003 resolved) must be reflected in the Learning Center implementation plan; the Learning Center reads status to filter the lesson list and status = Published is the only state that triggers visibility.
- The lesson review checklist template (`docs/content/lesson-review-checklist.md`) must be created from Section 12 before the first lesson goes to review.
- Content production should begin as early as possible in parallel with engineering; the MVP beta cannot launch without at least 8 published lessons.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — MVP Content Governance spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 002, 003, 006, 008 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved approver, checklist format, and status model decisions |
| 2026-07-01 | 1.0 | Approved Content Governance SDD spec for implementation planning |
