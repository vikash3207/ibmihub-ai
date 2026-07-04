# Lesson Review: 5250 Screen Basics

**Source:** Spec 009 Section 12 Content Quality Checklist, completed via docs/content/lesson-review-checklist.md
**Approver:** Product Owner / Founder

---

## Lesson Details

| Field | Value |
|---|---|
| Lesson title | 5250 Screen Basics |
| Lesson slug | 5250-screen-basics |
| Lesson number | 5 of 12 |
| Reviewed by | Product Owner / Founder |
| Review date | 2026-07-04 |
| PR / commit reference | Feature_30 (Batch 7) |

---

## Required Checks

- [x] **1. Correct IBM i terminology** - Terms used (5250 screen/session, command line,
  menu options, function keys, input/output fields, messages) are consistent with
  Lessons 1-4 and standard IBM i platform naming.
- [x] **2. Beginner-friendly explanation** - The Simple Explanation section introduces
  the 5250 interface and its building blocks in plain language, building on Lesson 3's
  brief mention of the 5250 interface without assuming prior IBM i knowledge.
- [x] **3. Practical example included** - The Practical Example section uses an
  original, fictional customer-service order-lookup scenario; no real company,
  product, or customer is referenced.
- [x] **4. No unsupported technical claims** - Statements about 5250 screens and their
  building blocks are limited to well-established, verifiable facts and avoid
  speculation.
- [x] **5. No production-safe guarantee** - The lesson does not claim or imply that any
  guidance is safe to apply to a production system.
- [x] **6. No private source code or job logs** - No source code, job logs, or system
  output of any kind appears in the lesson.
- [x] **7. No credentials or customer data** - No passwords, API keys, system addresses,
  or customer identifiers appear anywhere in the lesson.
- [x] **8. Follows approved lesson template** - All required sections (Learning
  Objective, Simple Explanation, Why It Matters, Practical Example, Common Confusions,
  Quick Recap, Try Asking AI Tutor) are present. Mark Complete and Next Lesson are
  intentionally not authored in the Markdown body; per Spec 009 Section 6, those are
  Lesson Experience UI elements.
- [x] **9. Markdown renders correctly** - Verified in a local build: headings,
  paragraphs, and bullet lists all render as expected via the existing lesson
  rendering pipeline. No code blocks are used in this lesson.
- [x] **10. Original content** - Content was written from scratch for IBMiHub AI; it is
  not copied from IBM documentation, tutorials, blogs, books, or any other external
  source.
- [x] **11. Next lesson navigation makes sense** - The lesson stays focused on the 5250
  interface as introduced conceptually in Lesson 3, setting up Lesson 6's dedicated
  coverage of physical and logical files.

## Applicable When Present

- [x] **12. AI Tutor starter question is appropriate** - The metadata starter question
  ("What do function keys like F3 typically do on a 5250 screen?") is IBM i-specific,
  helpful, and does not encourage sharing sensitive or production data.
- [ ] **13. Code blocks are correct** - Not applicable; this lesson contains no code
  blocks.

---

## Additional Batch 7 Confirmations

- [x] 5250 is explained as an interface used to interact with IBM i, not as the entire
  IBM i platform; this distinction is stated explicitly in both the Simple Explanation
  and Common Confusions sections.
- [x] Deep DDS, display file, subfile, workstation file, emulator configuration, and
  terminal protocol details are intentionally deferred; none of these terms appear in
  the lesson.
- [x] The lesson is technically reasonable: the description of the command line, menu
  options, function keys, input/output fields, and messages is consistent with
  standard 5250 interface behavior.
- [x] The "green screen" nickname is presented as historical rather than implying every
  modern session is literally green, and is explicitly stated not to mean the
  technology is outdated or unmaintained.
- [x] No sensitive data of any kind appears in the lesson.
- [x] No production code appears in the lesson.
- [x] No real IBM i system connectivity is described, implied, or required to use the
  lesson.
- [x] No text is copied from IBM documentation or any other copyrighted source.
- [x] The lesson is ready for protected published lesson access: logged-out users will
  see title, description, and a login prompt; logged-in users will see the full
  content below.

---

## Reviewer Decision

- [x] **Approved** - All required checks pass. Lesson is published as part of this PR.
- [ ] **Needs revision**

**Notes:**

Per the Batch 7 implementation plan, this review note plus explicit Product Owner
approval in the pull request serves as the human review gate required by Spec 009
CONTENT-FR-006 and CONTENT-FR-014. As with Lessons 1-4, the lesson status is moved
directly from Draft to Published in this PR rather than through separate Review Ready
and Approved commits, consistent with the current single-founder review workflow.

Like Lessons 2-4, this lesson is Published but not the free-preview lesson, so
logged-out users must see a login prompt instead of the lesson body (Spec 002
LEARNING-FR-004, LEARNING-FR-005).

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-04 | 1.0 | Initial review and approval of Lesson 5 for publication |
