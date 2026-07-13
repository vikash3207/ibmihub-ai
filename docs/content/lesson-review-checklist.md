# IBM i Fundamentals — Lesson Review Checklist

**Source:** Spec 009 Section 12 Content Quality Checklist (v1.0 checks 1–13; v2.0 checks 14–24 pending amendment approval — see note below)  
**Approver:** Product Owner / Founder  
**Process:** Complete this checklist before moving a lesson from Review Ready → Approved.  
Record completion in the pull request description or review record.

**Status note:** Spec 009 has a v2.0 amendment draft (open questions resolved; full amendment approval still pending Product Owner review) that adds checks 14–24 below, a Track/Module/Difficulty/Depth section, and an explicit external reference and certification-claims policy. Until the amendment as a whole is approved, only checks 1–13 are mandatory. The v2.0 sections in this checklist are marked accordingly and should not be enforced before the amendment is approved.

---

## Lesson Details

| Field | Value |
|---|---|
| Lesson title | |
| Lesson slug | |
| Lesson number (v1.0) / Track, Module, Lesson (v2.0, once approved) | |
| Difficulty (v2.0, once approved) — `beginner` / `intermediate` / `advanced` (one value only, no ranges) | |
| Depth (v2.0, once approved) — `foundation` / `professional` | |
| Persona tags (v2.0, once approved) — `beginner`, `working-developer`, `support-developer`, `interview-prep` | |
| Reviewed by | |
| Review date | |
| PR / commit reference | |

---

## Required Checks

All required checks must pass before a lesson may be marked Approved.

- [ ] **1. Correct IBM i terminology** — Technical terms are used accurately according to IBM i standards and conventions.
- [ ] **2. Beginner-friendly explanation** — The Simple Explanation section can be understood by someone with no IBM i background.
- [ ] **3. Practical example included** — A clear, original IBM i example or scenario appears in the Practical Example section.
- [ ] **4. No unsupported technical claims** — Every technical statement is verifiable; no speculation is presented as fact.
- [ ] **5. No production-safe guarantee** — The lesson does not imply that following its guidance is safe for production without expert review.
- [ ] **6. No private source code or job logs** — No real customer code, system data, or sensitive information appears in the lesson.
- [ ] **7. No credentials or customer data** — The lesson does not contain passwords, API keys, system addresses, or customer identifiers.
- [ ] **8. Follows approved lesson template** — All required template sections (1–8 in the Markdown body) are present in reasonable form.
- [ ] **9. Markdown renders correctly** — The reviewer has confirmed the Markdown is valid and expected elements render correctly.
- [ ] **10. Original content** — The lesson content is original and is not copied from IBM documentation, tutorials, blogs, books, or external training providers.
- [ ] **11. Next lesson navigation makes sense** — The lesson connects naturally to the next lesson in the sequence; the "Where to go next" guidance is appropriate.

## Applicable When Present

Complete these checks only if the relevant element exists in the lesson.

- [ ] **12. AI Tutor starter question is appropriate** — If present, the starter question is helpful, IBM i-specific, and does not encourage sharing sensitive data.
- [ ] **13. Code blocks are correct** — If code examples are present, they use correct IBM i syntax and are formatted as fenced code blocks.

---

## v2.0 Additional Checks (Not Yet Mandatory — Pending Spec 009 v2.0 Amendment Approval)

Do not enforce these until the Spec 009 v2.0 amendment is approved. Once approved, these apply to newly authored lessons under the expanded template; they do not retroactively apply to the 11 retained lessons unless one is substantively rewritten.

- [ ] **14. Difficulty-appropriate depth** — The lesson's actual content matches its declared difficulty; a Beginner lesson doesn't assume Advanced-track prerequisite knowledge, and an Advanced lesson isn't padded with beginner-level restatement.
- [ ] **15. Correct track/module placement** — The lesson is filed under the track and module a learner would actually look for it in.
- [ ] **16. Prerequisite accuracy** — Declared prerequisites are genuinely required to understand the lesson, not over- or under-listed.
- [ ] **17. No unjustified cross-track duplication** — A concept that needs restating in a second track cross-references rather than re-teaches it in full.
- [ ] **18. Real-world example is plausible, not generic** — The Real-World Example section reads like a believable production scenario, not a restatement of the Beginner Example with bigger numbers.
- [ ] **19. Interview/scenario question has a real model answer approach** — The question walks through how a strong candidate would reason about it, not only the final answer.
- [ ] **20. Debugging/support angle is concrete when present** — Names an actual failure mode and diagnostic step, not a generic non-answer.
- [ ] **21. AI Tutor prompts are genuinely varied** — The suggested prompts differ meaningfully in depth/angle, not just reworded versions of the same question.
- [ ] **22. External references used only for discovery/fact-checking** — If IBM documentation, Go4AS400, IBM Redbooks, RPGPGM, community blogs, or similar sources informed the lesson, confirm nothing was copied or too closely paraphrased from them.
- [ ] **23. No unverified certification claims** — The lesson, track, or module description does not claim or imply that completing it earns a recognized IBM i certification unless verified and implemented. Safer framing: "Career and Interview Readiness," "Certification-Aligned Foundations," or "Professional Readiness."
- [ ] **24. Depth matches its declared value** — If `depth: foundation`, the lesson genuinely teaches the concept from zero; if `depth: professional`, it delivers production-grade treatment and correctly declares its foundation-lesson prerequisite where one exists.

**External reference policy (reminder, applies regardless of v2.0 approval status):** IBM official documentation, Go4AS400, IBM Redbooks, RPGPGM, community blogs, and similar external IBM i resources may be used only for topic discovery and fact-checking. No text, code example, or structural pattern may be copied from them. This is already required by check 10 above; check 22 makes the named sources explicit once v2.0 is approved.

**Content creation approach (reminder):** content is AI-assisted but SME-reviewed. AI assistance during drafting is expected and permitted; it never replaces the human review this checklist represents.

---

## Reviewer Decision

- [ ] **Approved** — All required checks pass. Lesson may be moved to Approved status.
- [ ] **Needs revision** — One or more checks failed. See notes below.

**Notes:**

_Add any required revision notes here._

---

## Approved Lesson Template (Reference)

For reference, the approved (v1.0) lesson Markdown body must include:

1. Lesson Title (H1)
2. Learning Objective
3. Simple Explanation
4. Why It Matters
5. Practical Example
6. Common Confusions
7. Quick Recap
8. Try Asking AI Tutor _(may be a short prompt area or rendered from metadata)_

Sections 9 (Mark Complete) and 10 (Next Lesson) are UI/navigation elements handled by the Lesson Experience; they are not authored in the Markdown body.

### v2.0 Expanded Template (Reference Only — Pending Spec 009 v2.0 Amendment Approval)

Once approved, newly authored lessons follow this expanded template instead (Spec 009 v2.0 Section 6):

1. Lesson Title (H1)
2. Learning Objective
3. Simple Explanation
4. Why It Matters
5. Beginner Example
6. Real-World Example
7. Advanced Notes _(Intermediate/Advanced lessons)_
8. Common Mistakes
9. Debugging / Support Angle _(required for Track 12 lessons; optional elsewhere)_
10. Interview / Scenario Question
11. Quick Recap
12. AI Tutor Prompt Suggestions _(2–3 prompts)_
13. Related Lessons

Sections 14 (Mark Complete) and 15 (Next Lesson) remain UI/navigation elements, unchanged from v1.0. The 11 retained lessons from the multi-track migration are not required to be retrofitted to this template.
