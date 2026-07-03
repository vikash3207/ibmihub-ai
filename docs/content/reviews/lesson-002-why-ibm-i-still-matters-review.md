# Lesson Review: Why IBM i Still Matters

**Source:** Spec 009 Section 12 Content Quality Checklist, completed via docs/content/lesson-review-checklist.md
**Approver:** Product Owner / Founder

---

## Lesson Details

| Field | Value |
|---|---|
| Lesson title | Why IBM i Still Matters |
| Lesson slug | why-ibm-i-still-matters |
| Lesson number | 2 of 12 |
| Reviewed by | Product Owner / Founder |
| Review date | 2026-07-04 |
| PR / commit reference | Feature_27 (Batch 4) |

---

## Required Checks

- [x] **1. Correct IBM i terminology** - Terms used (reliability, object-based security,
  DB2 for i, integrated platform) are consistent with Lesson 1 and standard IBM i
  platform naming.
- [x] **2. Beginner-friendly explanation** - The Simple Explanation section defines why
  IBM i persists without assuming prior IBM i knowledge, building directly on Lesson 1's
  framing.
- [x] **3. Practical example included** - The Practical Example section uses an original,
  fictional order-and-inventory scenario; no real company, product, or customer is
  referenced.
- [x] **4. No unsupported technical claims** - Statements are limited to well-established,
  verifiable facts about the platform's strengths and typical migration considerations,
  and avoid speculation.
- [x] **5. No production-safe guarantee** - The lesson does not claim or imply that any
  guidance is safe to apply to a production system or migration decision.
- [x] **6. No private source code or job logs** - No source code, job logs, or system
  output of any kind appears in the lesson.
- [x] **7. No credentials or customer data** - No passwords, API keys, system addresses,
  or customer identifiers appear anywhere in the lesson.
- [x] **8. Follows approved lesson template** - All required sections (Learning Objective,
  Simple Explanation, Why It Matters, Practical Example, Common Confusions, Quick Recap,
  Try Asking AI Tutor) are present. Mark Complete and Next Lesson are intentionally not
  authored in the Markdown body; per Spec 009 Section 6, those are Lesson Experience UI
  elements.
- [x] **9. Markdown renders correctly** - Verified in a local build: headings, paragraphs,
  and bullet lists all render as expected via the existing lesson rendering pipeline. No
  code blocks are used in this lesson.
- [x] **10. Original content** - Content was written from scratch for IBMiHub AI; it is
  not copied from IBM documentation, tutorials, blogs, books, or any other external
  source.
- [x] **11. Next lesson navigation makes sense** - The Quick Recap closes on IBM i's
  continued relevance, which leads naturally into Lesson 3's platform overview.

## Applicable When Present

- [x] **12. AI Tutor starter question is appropriate** - The metadata starter question
  ("Why don't companies just migrate off IBM i if it's an older platform?") is IBM
  i-specific, helpful, and does not encourage sharing sensitive or production data.
- [ ] **13. Code blocks are correct** - Not applicable; this lesson contains no code
  blocks.

---

## Additional Batch 4 Confirmations

- [x] The lesson is technically reasonable: claims about reliability, integration,
  security, and operational stability are consistent with Lesson 1 and standard IBM i
  platform characteristics.
- [x] No sensitive data of any kind appears in the lesson.
- [x] No production code appears in the lesson.
- [x] No real IBM i system connectivity is described, implied, or required to use the
  lesson.
- [x] No text is copied from IBM documentation or any other copyrighted source.
- [x] The lesson is ready for protected published lesson access: logged-out users will
  see title, description, and a login prompt; logged-in users will see the full content
  below.

---

## Reviewer Decision

- [x] **Approved** - All required checks pass. Lesson is published as part of this PR.
- [ ] **Needs revision**

**Notes:**

Per the Batch 4 implementation plan, this review note plus explicit Product Owner
approval in the pull request serves as the human review gate required by Spec 009
CONTENT-FR-006 and CONTENT-FR-014. As with Lesson 1, the lesson status is moved directly
from Draft to Published in this PR rather than through separate Review Ready and
Approved commits, consistent with the current single-founder review workflow.

This is the first lesson published under the protected-access rule (Spec 002
LEARNING-FR-004, LEARNING-FR-005): it is Published but not the free-preview lesson, so
logged-out users must see a login prompt instead of the lesson body.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-04 | 1.0 | Initial review and approval of Lesson 2 for publication |
