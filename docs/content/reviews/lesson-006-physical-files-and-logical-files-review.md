# Lesson Review: Physical Files and Logical Files

**Source:** Spec 009 Section 12 Content Quality Checklist, completed via docs/content/lesson-review-checklist.md
**Approver:** Product Owner / Founder

---

## Lesson Details

| Field | Value |
|---|---|
| Lesson title | Physical Files and Logical Files |
| Lesson slug | physical-files-and-logical-files |
| Lesson number | 6 of 12 |
| Reviewed by | Product Owner / Founder |
| Review date | 2026-07-04 |
| PR / commit reference | Feature_31 (Batch 8) |

---

## Required Checks

- [x] **1. Correct IBM i terminology** - Terms used (physical file, logical file,
  record, field, keyed access, Db2 for i) are consistent with Lessons 1-5 and
  standard IBM i platform naming.
- [x] **2. Beginner-friendly explanation** - The Simple Explanation section defines
  physical files, logical files, and keyed access in plain language, building on
  Lesson 3's brief mention of Db2 for i without assuming prior IBM i knowledge.
- [x] **3. Practical example included** - The Practical Example section uses an
  original, fictional customer-order scenario with two logical views over the same
  physical data; no real company, product, or customer is referenced.
- [x] **4. No unsupported technical claims** - Statements about physical files,
  logical files, and keyed access are limited to well-established, verifiable facts
  and avoid speculation.
- [x] **5. No production-safe guarantee** - The lesson does not claim or imply that
  any guidance is safe to apply to a production system.
- [x] **6. No private source code or job logs** - No source code, job logs, or system
  output of any kind appears in the lesson.
- [x] **7. No credentials or customer data** - No passwords, API keys, system
  addresses, or customer identifiers appear anywhere in the lesson.
- [x] **8. Follows approved lesson template** - All required sections (Learning
  Objective, Simple Explanation, Why It Matters, Practical Example, Common
  Confusions, Quick Recap, Try Asking AI Tutor) are present. Mark Complete and Next
  Lesson are intentionally not authored in the Markdown body; per Spec 009 Section 6,
  those are Lesson Experience UI elements.
- [x] **9. Markdown renders correctly** - Verified in a local build: headings,
  paragraphs, and bullet lists all render as expected via the existing lesson
  rendering pipeline. No code blocks are used in this lesson.
- [x] **10. Original content** - Content was written from scratch for IBMiHub AI; it
  is not copied from IBM documentation, tutorials, blogs, books, or any other
  external source.
- [x] **11. Next lesson navigation makes sense** - The lesson stays focused on
  physical and logical files as data concepts, setting up Lesson 7's dedicated
  coverage of RPGLE, which reads and writes this kind of data.

## Applicable When Present

- [x] **12. AI Tutor starter question is appropriate** - The metadata starter
  question ("What's the difference between a physical file and a logical file on
  IBM i?") is IBM i-specific, helpful, and does not encourage sharing sensitive or
  production data.
- [ ] **13. Code blocks are correct** - Not applicable; this lesson contains no code
  blocks.

---

## Additional Batch 8 Confirmations

- [x] Physical files are explained as where actual data is stored on IBM i, organized
  as records made up of fields.
- [x] Logical files are explained as alternate views or access paths over data that
  already lives in a physical file, using the safer wording "normally does not store
  a separate duplicate copy" rather than an absolute claim, consistent with your
  instruction to avoid wording like "logical files never store data."
- [x] Keyed access is explained only at a conceptual level (looking up or ordering
  records by specific fields), without going into access-path maintenance internals.
- [x] The relationship to Db2 for i is explained at a high level, connecting back to
  Lesson 3, without DDS syntax or SQL DDL.
- [x] Deep DDS syntax, SQL DDL, access-path maintenance internals, multi-format
  logical files, join logical files, and performance tuning are intentionally
  deferred; none of these appear in the lesson.
- [x] The lesson is technically reasonable: the physical file/logical file/keyed
  access explanation is consistent with standard IBM i platform behavior.
- [x] No sensitive data of any kind appears in the lesson.
- [x] No production code appears in the lesson.
- [x] No real IBM i system connectivity is described, implied, or required to use the
  lesson.
- [x] No text is copied from IBM documentation or any other copyrighted source.
- [x] The lesson is ready for protected published lesson access: logged-out users
  will see title, description, and a login prompt; logged-in users will see the full
  content below.

---

## Reviewer Decision

- [x] **Approved** - All required checks pass. Lesson is published as part of this
  PR.
- [ ] **Needs revision**

**Notes:**

Per the Batch 8 implementation plan, this review note plus explicit Product Owner
approval in the pull request serves as the human review gate required by Spec 009
CONTENT-FR-006 and CONTENT-FR-014. As with Lessons 1-5, the lesson status is moved
directly from Draft to Published in this PR rather than through separate Review
Ready and Approved commits, consistent with the current single-founder review
workflow.

Like Lessons 2-5, this lesson is Published but not the free-preview lesson, so
logged-out users must see a login prompt instead of the lesson body (Spec 002
LEARNING-FR-004, LEARNING-FR-005). Lesson 6 is the sixth published lesson overall;
Lessons 7 and 8 remain in the current Lessons 2-8 publishing stretch.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-04 | 1.0 | Initial review and approval of Lesson 6 for publication |
