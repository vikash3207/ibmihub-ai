# Lesson Review: Where to Go Next

**Source:** Spec 009 Section 12 Content Quality Checklist, completed via docs/content/lesson-review-checklist.md
**Approver:** Product Owner / Founder

---

## Lesson Details

| Field | Value |
|---|---|
| Lesson title | Where to Go Next |
| Lesson slug | where-to-go-next |
| Lesson number | 12 of 12 |
| Reviewed by | Product Owner / Founder |
| Review date | 2026-07-05 |
| PR / commit reference | Feature_37 (Batch 14) |

---

## Required Checks

- [x] **1. Correct IBM i terminology** - Terms used across the recap (platform,
  libraries and objects, 5250, physical/logical files, RPGLE, CLLE, Db2 for i,
  job logs, spool files, development workflow) are consistent with Lessons 1-11
  and standard IBM i platform naming.
- [x] **2. Beginner-friendly explanation** - The Simple Explanation section
  recaps the path in plain language and sets clear, encouraging expectations
  without assuming prior knowledge beyond what earlier lessons covered.
- [x] **3. Practical example included** - The Practical Example section uses an
  original, fictional new-team-member scenario described entirely in prose; no
  real company, product, or customer is referenced, and no code is used.
- [x] **4. No unsupported technical claims** - Statements about the path's
  content and realistic next steps are limited to well-established framing and
  avoid speculation.
- [x] **5. No production-safe guarantee** - The lesson does not claim or imply
  that any guidance is safe to apply to a production system.
- [x] **6. No private source code or job logs** - No real source code, job
  logs, or system output of any kind appears in the lesson.
- [x] **7. No credentials or customer data** - No passwords, API keys, system
  addresses, or customer identifiers appear anywhere in the lesson.
- [x] **8. Follows approved lesson template** - All required sections (Learning
  Objective, Simple Explanation, Why It Matters, Practical Example, Common
  Confusions, Quick Recap, Try Asking AI Tutor) are present, matching the same
  seven-section structure used by Lessons 1-11. No eighth "Next Lesson" heading
  was added; suggested next learning directions are folded into the Quick
  Recap section instead, since this is the final lesson and there is no next
  lesson in the path to point to. Mark Complete and Next Lesson navigation
  remain Lesson Experience UI elements, not authored in the Markdown body, per
  Spec 009 Section 6.
- [x] **9. Markdown renders correctly** - Verified in a local build: headings,
  paragraphs, and bullet lists all render as expected via the existing lesson
  rendering pipeline. No code blocks are used in this lesson.
- [x] **10. Original content** - Content was written from scratch for IBMiHub
  AI; it is not copied from IBM documentation, tutorials, blogs, books, or any
  other external source.
- [x] **11. Next lesson navigation makes sense** - There is no next lesson in
  the path; the app's existing navigation UI falls back to linking back to the
  IBM i Fundamentals path page, which is the expected and already-tested
  behavior for the last lesson in a path.

## Applicable When Present

- [x] **12. AI Tutor starter question is appropriate** - The metadata starter
  question ("What should I focus on learning next after finishing IBM i
  Fundamentals?") is IBM i-specific, helpful, and does not encourage sharing
  sensitive or production data.
- [ ] **13. Code blocks are correct** - Not applicable; this lesson contains no
  code blocks or pseudocode by design.

---

## Additional Batch 14 Confirmations

- [x] The lesson correctly acts as the closing lesson for the IBM i
  Fundamentals path: it recaps Lessons 1-11 briefly (without re-teaching them
  in depth) and does not introduce a new technical topic.
- [x] The lesson does not imply full mastery after completing the path. It
  explicitly states the learner now has "a mental map... not full mastery" and
  that real comfort comes from continued exposure and practice.
- [x] Future learning directions (advanced RPGLE, CLLE, Db2 for i,
  troubleshooting, modernization, integrations, AI-assisted learning) are
  described only as suggested directions for continued learning, explicitly
  not as already-built product features or firm promises. The lesson states
  these "represent natural directions for future learning rather than
  features that are already built or promised on a specific timeline."
- [x] This completes the full 12/12 IBM i Fundamentals lesson set: all 12
  lessons in `content/lessons/metadata.ts` now have status `Published`.
- [x] No code blocks or pseudocode appear anywhere in the lesson.
- [x] The tone is encouraging and practical, consistent with your instruction,
  without marketing exaggeration or unsupported claims.
- [x] No sensitive data of any kind appears in the lesson.
- [x] No production code appears in the lesson.
- [x] No real IBM i system connectivity is described, implied, or required to
  use the lesson.
- [x] No text is copied from IBM documentation or any other copyrighted
  source.
- [x] The lesson is ready for protected published lesson access: logged-out
  users will see title, description, and a login prompt; logged-in users will
  see the full content below.

---

## Reviewer Decision

- [x] **Approved** - All required checks pass. Lesson is published as part of
  this PR.
- [ ] **Needs revision**

**Notes:**

Per the Batch 14 implementation plan, this review note plus explicit Product
Owner approval in the pull request serves as the human review gate required by
Spec 009 CONTENT-FR-006 and CONTENT-FR-014. As with Lessons 1-11, the lesson
status is moved directly from Draft to Published in this PR rather than
through separate Review Ready and Approved commits, consistent with the
current single-founder review workflow.

Like Lessons 2-11, this lesson is Published but not the free-preview lesson,
so logged-out users must see a login prompt instead of the lesson body (Spec
002 LEARNING-FR-004, LEARNING-FR-005). With this lesson published, all 12 of
12 IBM i Fundamentals lessons are now Published; no lesson remains in Draft
status in this learning path.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-05 | 1.0 | Initial review and approval of Lesson 12 for publication |
