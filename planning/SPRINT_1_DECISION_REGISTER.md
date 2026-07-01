# Sprint 1 Decision Register

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Track and resolve all decisions that must be made before Sprint 1 implementation can begin
- Version: 0.2
- Status: Partially Decided — Product and Content decisions resolved; Engineering decisions pending
- Last Updated: 2026-07-01
- Owner: Both

---

## Purpose

This register captures the Sprint 1 blocking decisions identified in PRD Section 20.14.

These decisions must be resolved — or explicitly deferred with a reason — before Sprint 1 coding begins.

Each decision has a recommended default. Recommended defaults are conservative MVP-safe suggestions only. They are **not final decisions**. The Product Owner and Engineering must confirm, modify, or override each recommendation before it becomes an approved decision.

Once a decision is made, it should be recorded here, reflected in the relevant SDD spec, and captured in an ADR where appropriate.

---

## Status Definitions

| Status | Meaning |
|---|---|
| Open | Decision not yet made |
| Decided | Decision made and recorded below |
| Deferred | Explicitly deferred; not needed for Sprint 1 but must be decided before MVP beta |
| Blocker | Must be resolved before progress can continue |

---

## Decision Register

### Product Decisions

---

#### D-PROD-001

| Field | Value |
|---|---|
| Decision ID | D-PROD-001 |
| Source Question ID | OQ-PROD-001 |
| Decision Area | Product |
| Question | Should MVP beta be invite-only, public beta, or limited-access waitlist? |
| Owner | Product / Founder |
| Needed Before | MVP launch |
| Status | Decided |

**Recommended Default:** Invite-only or limited waitlist for the first beta.

Rationale: Invite-only limits early exposure to users who can provide quality feedback. It reduces the risk of public trust damage from an immature product. A waitlist also creates demand signals and simplifies early AI cost management.

**Approved Decision:** Use a limited-access waitlist first, followed by invite-only beta access.

Rationale: This keeps early exposure controlled, helps collect better feedback, reduces public trust risk, and gives early demand signals without opening the product too broadly.

**Notes:** —

---

#### D-PROD-002

| Field | Value |
|---|---|
| Decision ID | D-PROD-002 |
| Source Question ID | OQ-PROD-002 |
| Decision Area | Product |
| Question | What is the minimum number of lessons required for MVP release? |
| Owner | Product |
| Needed Before | Sprint 1 planning |
| Status | Decided |

**Recommended Default:** A minimum of 8–12 lessons in the IBM i Fundamentals path before beta release.

Rationale: Section 16 proposes a 12-lesson sequence. A minimum of 8 complete, reviewed lessons covers the most foundational topics (What is IBM i, libraries, objects, 5250 basics, files, RPGLE intro, CLLE intro, development workflow) and gives users enough content to justify returning. Fewer than 8 risks a product that feels empty; more than 12 may delay launch unnecessarily.

**Approved Decision:** Target 12 lessons for the IBM i Fundamentals path, but allow MVP beta release with a minimum of 8 complete, reviewed lessons.

Rationale: 12 lessons gives the full intended beginner path. 8 reviewed lessons is the minimum acceptable beta threshold so the product does not feel empty while avoiding unnecessary launch delay.

**Notes:** Content creation timeline will affect this decision. Ties to D-CONT-001 (lesson list) and D-CONT-002 (lesson template).

---

#### D-PROD-003

| Field | Value |
|---|---|
| Decision ID | D-PROD-003 |
| Source Question ID | OQ-PROD-003 |
| Decision Area | Product |
| Question | Should MVP include quizzes or defer them to early post-MVP? |
| Owner | Product |
| Needed Before | Sprint 1 planning |
| Status | Decided |

**Recommended Default:** Defer quizzes to early post-MVP.

Rationale: Quizzes add product and engineering complexity without changing the core MVP validation question (do users engage with learning and AI Tutor). A lightweight "mark as complete" per lesson is sufficient for MVP progress tracking. Quizzes can be added quickly in the first post-MVP iteration once lesson content is stable.

**Approved Decision:** Defer quizzes to early post-MVP. MVP should use lesson completion only.

Rationale: Quizzes add complexity and are not required to validate the core MVP value of structured learning plus AI Tutor.

**Notes:** If deferred, the Lesson Experience Spec should still allow a quiz section to be added later without major rework.

---

#### D-PROD-004

| Field | Value |
|---|---|
| Decision ID | D-PROD-004 |
| Source Question ID | OQ-PROD-004 |
| Decision Area | Product |
| Question | Should MVP include a glossary or defer it to early post-MVP? |
| Owner | Product |
| Needed Before | Sprint 1 planning |
| Status | Decided |

**Recommended Default:** Defer a full glossary to early post-MVP; consider a lightweight inline tooltip or term explanation within lessons as optional.

Rationale: A standalone glossary feature adds product and engineering scope. Inline term definitions within lesson content can partially satisfy beginner needs without a separate glossary module. A full glossary can be added as one of the first post-MVP improvements.

**Approved Decision:** Defer a standalone glossary feature to early post-MVP. MVP lesson content may include inline term explanations where useful.

Rationale: A full glossary adds separate product scope. Inline explanations support beginners without creating a new MVP module.

**Notes:** —

---

#### D-PROD-005

| Field | Value |
|---|---|
| Decision ID | D-PROD-005 |
| Source Question ID | OQ-PROD-005 |
| Decision Area | Product |
| Question | Should users be required to create an account before viewing lessons? |
| Owner | Product |
| Needed Before | MVP UX design |
| Status | Decided |

**Recommended Default:** Allow the first lesson or first portion of the landing experience to be accessible without login, but require account creation before tracking progress or using AI Tutor.

Rationale: Friction-free first contact increases activation. Requiring an account before users see any content raises the barrier to entry and may increase bounce rate. However, progress tracking and AI Tutor require a user identity. A hybrid approach (some public content, account required for learning journey) is a common SaaS pattern and supports both early discovery and data collection.

**Approved Decision:** Allow landing page and first lesson preview without login. Require account creation for progress tracking and AI Tutor usage.

Rationale: This reduces first-time friction while still requiring identity for personalized features.

**Notes:** This decision affects authentication scope (D-TECH-004) and the Landing Experience Spec and User Account Spec.

---

#### D-PROD-006

| Field | Value |
|---|---|
| Decision ID | D-PROD-006 |
| Source Question ID | OQ-PROD-006 |
| Decision Area | Product |
| Question | What onboarding questions should be used to separate beginners from working developers? |
| Owner | Product |
| Needed Before | MVP UX design |
| Status | Decided |

**Recommended Default:** A single onboarding question with two or three clear options, such as:

- "I am new to IBM i and want to start learning."
- "I already work with IBM i and want to refresh or deepen my knowledge."
- "I am exploring what IBMiHub AI offers."

Rationale: More questions increase friction and drop-off. One well-phrased question that clearly routes users to the right starting point is better than a multi-step onboarding survey. The answer should determine the recommended learning path but should not block access.

**Approved Decision:** Use one simple onboarding question with three options:

- I am new to IBM i and want to start learning.
- I already work with IBM i and want to refresh or deepen my knowledge.
- I am exploring what IBMiHub AI offers.

Rationale: One question keeps onboarding lightweight and helps route users without creating a long survey.

**Notes:** Exact wording should be refined in the User Account and Onboarding Spec.

---

### AI Decisions

---

#### D-AI-001

| Field | Value |
|---|---|
| Decision ID | D-AI-001 |
| Source Question ID | OQ-AI-001 |
| Decision Area | AI |
| Question | Which AI provider and model should power the MVP AI Tutor? |
| Owner | Engineering |
| Needed Before | AI architecture |
| Status | Open |

**Recommended Default:** This decision belongs to Engineering and should be captured in an ADR after comparing available providers against cost, IBM i domain coverage, response quality, latency, and terms of service. The PRD is intentionally provider-neutral.

**Approved Decision:** _To be filled in by Engineering via ADR._

**Notes:** Whichever provider is selected, the AI Tutor must satisfy trust and safety requirements in PRD Sections 13.8, 14.8, and 15. Cost awareness should be built in from the start (PRD 15.13, 18.6).

---

#### D-AI-003

| Field | Value |
|---|---|
| Decision ID | D-AI-003 |
| Source Question ID | OQ-AI-003 |
| Decision Area | AI |
| Question | Should the AI Tutor use only prompt guidance in MVP, or also include lesson-aware context? |
| Owner | Product + Engineering |
| Needed Before | AI implementation spec |
| Status | Decided |

**Recommended Default:** Prompt-guidance only for MVP. Lesson-aware context should be a post-MVP improvement.

Rationale: Lesson-aware AI (where the AI knows which lesson the user is currently reading) adds complexity to the AI implementation and content-data pipeline. For MVP, a well-crafted system prompt that establishes IBM i domain context, appropriate caution, and beginner-friendly behavior is sufficient. Lesson awareness can be added once the basic AI Tutor is working and validated.

**Approved Decision:** Use prompt-guidance only for MVP. Lesson-aware AI should be deferred to post-MVP.

Rationale: Prompt-guidance is enough for the first AI Tutor validation. Lesson-aware context adds complexity and should come after basic AI Tutor usage is validated.

**Notes:** The Lesson Experience Spec should leave room for a future "Ask AI about this lesson" integration without requiring rework.

---

#### D-AI-004

| Field | Value |
|---|---|
| Decision ID | D-AI-004 |
| Source Question ID | OQ-AI-004 |
| Decision Area | AI |
| Question | Should AI conversation history be stored, and if yes, for how long? |
| Owner | Product + Engineering |
| Needed Before | Privacy review |
| Status | Decided |

**Recommended Default:** Store session-level conversation history only (not persisted across sessions) for MVP. Do not retain AI conversation data server-side beyond what is needed to render the current session.

Rationale: Minimizing AI data retention reduces privacy risk, aligns with PRD Section 14.7 (minimal data collection), and avoids compliance complexity. Session-only history allows users to continue a conversation within one session while limiting long-term data exposure. Long-term conversation history storage should require a separate privacy and data retention review.

**Approved Decision:** Use session-level conversation history only for MVP. Do not persist AI conversation history server-side beyond what is needed for the current session.

Rationale: This minimizes privacy risk and aligns with the MVP principle of minimal data retention.

**Notes:** This decision should be documented in an ADR and reflected in the AI Tutor Spec and privacy messaging. OQ-SEC-006 (AI interaction storage) is related.

---

### Content Decisions

---

#### D-CONT-001

| Field | Value |
|---|---|
| Decision ID | D-CONT-001 |
| Source Question ID | OQ-CONT-001 |
| Decision Area | Content |
| Question | What exact lessons should be included in the first IBM i Fundamentals learning path? |
| Owner | Product |
| Needed Before | Content planning |
| Status | Decided |

**Recommended Default:** The 12-lesson sequence proposed in PRD Section 16.4:

1. What is IBM i?
2. Why IBM i still matters
3. IBM i platform overview
4. Libraries and objects
5. 5250 screen basics
6. Physical files and logical files
7. Introduction to RPGLE
8. Introduction to CLLE
9. Introduction to DB2 for i
10. Job logs and spool files basics
11. Basic IBM i development workflow
12. Where to go next

The Product Owner may adjust this list based on content readiness and teaching priorities. At minimum, Lessons 1, 4, 5, 7, 8, and 11 are strongly recommended for MVP.

**Approved Decision:** Approve the 12-lesson IBM i Fundamentals sequence:

1. What is IBM i?
2. Why IBM i still matters
3. IBM i platform overview
4. Libraries and objects
5. 5250 screen basics
6. Physical files and logical files
7. Introduction to RPGLE
8. Introduction to CLLE
9. Introduction to DB2 for i
10. Job logs and spool files basics
11. Basic IBM i development workflow
12. Where to go next

Minimum beta threshold: At least 8 complete and reviewed lessons before beta release.

**Notes:** The approved lesson list should be documented in the Learning Center Spec and Content Plan. Ties to D-PROD-002 (minimum lesson count) and D-CONT-002 (lesson template).

---

#### D-CONT-002

| Field | Value |
|---|---|
| Decision ID | D-CONT-002 |
| Source Question ID | OQ-CONT-002 |
| Decision Area | Content |
| Question | What is the approved standard lesson template for MVP content? |
| Owner | Product |
| Needed Before | Content planning |
| Status | Decided |

**Recommended Default:** The lesson structure proposed in PRD Section 16.7:

1. Lesson Title
2. Learning Objective
3. Simple Explanation
4. Why It Matters
5. Practical Example
6. Common Confusions
7. Quick Recap
8. Try Asking AI Tutor
9. Mark Complete
10. Next Lesson

For shorter or simpler lessons, sections 6 and 7 may be combined or shortened. Section 8 (Try Asking AI Tutor) may be simplified to a single suggested question.

**Approved Decision:** Approve the MVP lesson template:

1. Lesson Title
2. Learning Objective
3. Simple Explanation
4. Why It Matters
5. Practical Example
6. Common Confusions
7. Quick Recap
8. Try Asking AI Tutor
9. Mark Complete
10. Next Lesson

Rationale: This gives all MVP lessons a consistent structure and supports both beginner learning and AI Tutor usage.

**Notes:** The approved template should be documented in the Content Governance Spec and used for all MVP lessons from the start. Consistency is more important than the exact structure chosen.

---

### Technical Decisions

---

#### D-TECH-001

| Field | Value |
|---|---|
| Decision ID | D-TECH-001 |
| Source Question ID | OQ-TECH-001 |
| Decision Area | Technical |
| Question | What technology stack should be used for the MVP web application? |
| Owner | Engineering |
| Needed Before | Sprint 1 implementation |
| Status | Open |

**Recommended Default:** This decision belongs to Engineering and should be captured in an ADR. The PRD intentionally does not select a technology stack. The existing workspace scaffold (Next.js + TypeScript) was created before the PRD was approved and may or may not be adopted.

**Approved Decision:** _To be filled in by Engineering via ADR._

**Notes:** The stack must support web-based delivery, user accounts, AI Tutor integration, lesson content display, progress tracking, and feedback collection. Engineering should evaluate the existing scaffold and decide whether to adopt, replace, or modify it.

---

#### D-TECH-002

| Field | Value |
|---|---|
| Decision ID | D-TECH-002 |
| Source Question ID | OQ-TECH-002 |
| Decision Area | Technical |
| Question | What hosting and deployment approach should be used for MVP? |
| Owner | Engineering |
| Needed Before | Sprint 1 implementation |
| Status | Open |

**Recommended Default:** This decision belongs to Engineering and should be captured in an ADR. A simple serverless or platform-as-a-service approach is appropriate for MVP given the scope. Avoid over-engineering hosting infrastructure before user demand is known.

**Approved Decision:** _To be filled in by Engineering via ADR._

**Notes:** MVP hosting should support fast iteration, low operational overhead, and basic scaling for a beta user base. Cost awareness matters given AI usage will add operating cost.

---

#### D-TECH-003

| Field | Value |
|---|---|
| Decision ID | D-TECH-003 |
| Source Question ID | OQ-TECH-003 |
| Decision Area | Technical |
| Question | What database or storage approach should be used for users, progress, content metadata, and feedback? |
| Owner | Engineering |
| Needed Before | Architecture planning |
| Status | Open |

**Recommended Default:** This decision belongs to Engineering and should be captured in an ADR. A relational database is appropriate for user accounts, progress tracking, and feedback. Content storage format (files vs database records) depends on the content management workflow decision (OQ-CONT-007).

**Approved Decision:** _To be filled in by Engineering via ADR._

**Notes:** The PRD intentionally does not select a database provider. Engineering should choose a well-supported, maintainable approach that avoids over-complexity for MVP scale.

---

#### D-TECH-004

| Field | Value |
|---|---|
| Decision ID | D-TECH-004 |
| Source Question ID | OQ-TECH-004 |
| Decision Area | Technical |
| Question | What authentication approach should be used for MVP? |
| Owner | Engineering |
| Needed Before | Architecture planning |
| Status | Open |

**Recommended Default:** This decision belongs to Engineering and should be captured in an ADR. A managed authentication provider (rather than a custom-built solution) is appropriate for MVP. The PRD does not select a provider. The choice should prioritize security, ease of integration, and minimal operational overhead.

**Approved Decision:** _To be filled in by Engineering via ADR._

**Notes:** The authentication approach must support basic sign-up, login, and user profile. Enterprise SSO is explicitly out of scope for MVP. The decision should align with D-PROD-005 (account requirement before lessons).

---

#### D-TECH-009

| Field | Value |
|---|---|
| Decision ID | D-TECH-009 |
| Source Question ID | OQ-TECH-009 |
| Decision Area | Technical |
| Question | What SDD specs must be created before coding begins? |
| Owner | Product + Engineering |
| Needed Before | Sprint 1 planning |
| Status | Decided |

**Recommended Default:** Based on the PRD Final Review recommendations (PRD_FINAL_REVIEW_v1.md), the following SDD specs are recommended before any coding begins, in priority order:

1. AI Tutor Spec
2. Learning Center Spec
3. Lesson Experience Spec
4. User Account and Onboarding Spec
5. Dashboard Spec
6. Progress Tracking Spec
7. Feedback Collection Spec
8. Public Landing Experience Spec
9. Content Governance Spec

All nine specs should be created and approved before engineering implements the corresponding features.

**Approved Decision:** Approve the following required SDD specs before coding begins:

1. AI Tutor Spec
2. Learning Center Spec
3. Lesson Experience Spec
4. User Account and Onboarding Spec
5. Dashboard Spec
6. Progress Tracking Spec
7. Feedback Collection Spec
8. Public Landing Experience Spec
9. Content Governance Spec

Rationale: These specs cover the approved MVP scope and should be completed before implementation starts.

**Notes:** The AI Tutor Spec, Learning Center Spec, and Lesson Experience Spec are critical path. Content Governance Spec should be created immediately so lesson content creation can begin in parallel with engineering.

---

## Decision Summary

| Decision ID | Area | Question Summary | Status | Owner |
|---|---|---|---|---|
| D-PROD-001 | Product | Beta access model | Decided | Product / Founder |
| D-PROD-002 | Product | Minimum lesson count for MVP | Decided | Product |
| D-PROD-003 | Product | Quizzes in MVP or deferred? | Decided | Product |
| D-PROD-004 | Product | Glossary in MVP or deferred? | Decided | Product |
| D-PROD-005 | Product | Account required before lessons? | Decided | Product |
| D-PROD-006 | Product | Onboarding question design | Decided | Product |
| D-AI-001 | AI | AI provider and model | Open | Engineering |
| D-AI-003 | AI | Prompt-only or lesson-aware AI Tutor | Decided | Product + Engineering |
| D-AI-004 | AI | AI conversation history storage | Decided | Product + Engineering |
| D-CONT-001 | Content | Exact first learning path lessons | Decided | Product |
| D-CONT-002 | Content | Standard lesson template | Decided | Product |
| D-TECH-001 | Technical | MVP technology stack | Open | Engineering |
| D-TECH-002 | Technical | Hosting and deployment | Open | Engineering |
| D-TECH-003 | Technical | Database or storage approach | Open | Engineering |
| D-TECH-004 | Technical | Authentication approach | Open | Engineering |
| D-TECH-009 | Technical | Required SDD specs before coding | Decided | Product + Engineering |

---

## Decision-Making Process

1. Product Owner reviews each Product and Content decision.
2. Engineering reviews each Technical and AI decision and captures choices in ADRs.
3. Shared decisions (Product + Engineering) are resolved collaboratively.
4. Each resolved decision is updated here with the approved value and date.
5. Resolved decisions are reflected in the relevant SDD spec or ADR.
6. Once all Sprint 1 blocking decisions are resolved, SDD spec creation begins.
7. Coding begins only after SDD specs are approved.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial Sprint 1 decision register created from PRD Section 20.14 open questions |
| 2026-07-01 | 0.2 | Product Owner resolved 11 decisions: D-PROD-001 through D-PROD-006, D-AI-003, D-AI-004, D-CONT-001, D-CONT-002, D-TECH-009. Engineering decisions D-AI-001, D-TECH-001–004 remain open. |
