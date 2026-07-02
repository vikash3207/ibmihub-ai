# Spec 007: Feedback Collection

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 007 |
| Feature | Feedback Collection |
| Status | Approved |
| Version | 1.0 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor feedback requirements reference |
| specs/004-user-account-and-onboarding/spec.md | v1.0 Approved | Authentication identity reference |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL storage decision |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |

---

## 2. Purpose

Feedback collection is the mechanism through which IBMiHub AI learns whether the product is working. During the MVP and beta phase, the product team has limited visibility into what users actually find useful, confusing, or wrong. Structured feedback signals — even lightweight ones — are essential for making evidence-driven product decisions.

The primary feedback signal in the MVP is AI Tutor response quality: a simple helpful / not helpful rating on each AI response. This signal tells the product team which responses are landing well and which are not. Aggregate patterns across AI responses can identify topic areas where the AI Tutor performs poorly, prompts that should be revised, and IBM i topics that need stronger lesson content.

Secondary to AI response feedback, the MVP supports a lightweight general beta feedback entry point, consistent with PRD 13.10 FR-FB-001. This allows beta users to submit general impressions, report issues, or request topics without requiring a formal support system.

Feedback collection exists in the MVP to:

- Validate AI Tutor response quality during beta
- Identify which IBM i topics produce unhelpful or confusing AI answers
- Measure how often users find the AI Tutor responses useful
- Capture early beta impressions from users through a lightweight feedback channel
- Give the Product Owner a reviewable record of feedback without requiring a full analytics platform

---

## 3. MVP Scope

The MVP Feedback Collection feature provides a helpful / not helpful rating mechanism for AI Tutor responses and a lightweight general beta feedback entry point.

### In Scope for MVP

| Capability | Description |
|---|---|
| Helpful / Not helpful AI response feedback | Each completed AI Tutor response includes a helpful / not helpful rating control (Spec 001 AI-TUTOR-FR-012) |
| Authenticated feedback submission | Feedback can only be submitted by authenticated users (consistent with AI Tutor being authenticated-only) |
| Feedback tied to the authenticated user | Feedback records include the user ID of the submitting user |
| Feedback timestamp | Each feedback record includes a timestamp of when it was submitted |
| Feedback context type | Feedback records identify the type of feedback (e.g., AI response, general beta) |
| Feedback source surface | Feedback records identify which product surface the feedback came from (e.g., AI Tutor) |
| Lightweight general beta feedback | A simple authenticated feedback link or form where beta users can submit a short free-text message (impressions, requests). Separate from AI response feedback. Included in MVP (OQ-FB-002 resolved). |
| No free-text reason/comment for AI response feedback | AI response feedback is helpful / not helpful only in MVP (Spec 001 AI-TUTOR-FR-012) |
| No public reviews or ratings | Feedback is internal only; users cannot see each other's feedback |
| No admin feedback dashboard in MVP | Feedback is stored for manual Product Owner review; no dashboard is built in MVP |
| No automated AI retraining from feedback | Feedback does not trigger any automated model updates |

---

## 4. Explicitly Out of Scope for MVP

| Excluded Capability | Reason |
|---|---|
| Free-text reason or comment for AI response feedback | Deferred to post-MVP (Spec 001 approved AI Tutor feedback scope; Spec 001 AI-TUTOR-FR-012) |
| Star ratings | Not in MVP scope; helpful/not helpful is sufficient |
| Public reviews or ratings | All feedback is internal in MVP |
| Community comments on lessons or AI responses | Future feature |
| Lesson content comments or ratings | Lesson feedback through the lesson helpfulness mechanism is separate; free-text is not in MVP |
| Admin feedback dashboard or analytics UI | Future feature; MVP feedback is reviewed manually |
| Automated AI model retraining from feedback | Out of scope; feedback is used for human-driven product decisions only |
| Sentiment analysis on feedback | Future feature |
| Feedback analytics charts or reporting | Future feature |
| Enterprise feedback reports | Future feature (PRD 11) |
| User reputation, upvoting, or voting | Future feature |
| Content moderation workflows | Future feature |
| Feedback on draft or unpublished content | Draft content is not exposed to users |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A beginner uses AI Tutor feedback primarily to signal when an AI response was confusing or unhelpful. They need:

- A simple, fast feedback mechanism that does not interrupt their learning flow
- Confidence that their feedback is heard without requiring them to write a long explanation
- No pressure to elaborate — helpful / not helpful is sufficient

### Persona 2: Working IBM i Developer

A working developer may have more specific opinions about AI response quality on technical topics. They need:

- A quick way to signal when an AI response on a technical IBM i question was technically incorrect or misleading
- The ability to submit this signal without leaving the conversation
- The understanding that their feedback contributes to product improvement

### Persona 3: Product Owner / Builder Reviewing Beta Feedback

The Product Owner reviews stored feedback records to understand AI Tutor performance and product reception. They need:

- Feedback records that are useful and reviewable without requiring a dedicated analytics tool
- Enough context per record to understand which response or feature the feedback relates to
- A reliable, privacy-appropriate feedback dataset without full conversation content

---

## 6. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-FB-001 | Authenticated AI Tutor user | Click a "Helpful" indicator on an AI response | I can signal that the response was useful |
| US-FB-002 | Authenticated AI Tutor user | Click a "Not helpful" indicator on an AI response | I can signal that the response was not useful or incorrect |
| US-FB-003 | Authenticated user | Submit feedback without being asked to type a comment | I can give feedback quickly without adding friction to my learning session |
| US-FB-004 | Authenticated user | See a brief acknowledgement after submitting feedback | I know my feedback was received |
| US-FB-005 | Authenticated user | Find that submitting feedback on the same response again does not create confusing duplicate behavior | My feedback interaction is handled predictably |
| US-FB-006 | Product Owner | Review stored AI response feedback records | I can identify which AI Tutor responses are rated unhelpful and improve them |
| US-FB-007 | Beta user | Find a lightweight way to submit general feedback or a topic request | I can communicate something to the product team without needing a formal support channel |

---

## 7. Functional Requirements

### FEEDBACK-FR-001 — AI Response Feedback Control

Each completed AI Tutor response must display a helpful / not helpful feedback control.

- After the AI Tutor finishes generating a response, a feedback control must appear below the response
- The control must offer exactly two options: Helpful and Not helpful
- The control must be accessible to authenticated users; unauthenticated users cannot reach the AI Tutor and therefore cannot see this control

**Priority:** Must Have
**Source:** PRD 13.10 FR-FB-002; Spec 001 AI-TUTOR-FR-012

---

### FEEDBACK-FR-002 — Helpful / Not Helpful Only — No Free-Text Comment

AI response feedback must be limited to the helpful / not helpful binary rating in MVP. No free-text reason or comment field must be shown or accepted.

- The feedback control must not include a text input, dropdown reason, or any other free-text mechanism
- No prompt asking the user to elaborate on their rating may appear after submission in MVP
- The free-text reason/comment capability for AI response feedback is explicitly deferred to post-MVP (Spec 001 approved AI Tutor feedback scope). Note: general beta feedback uses free-text separately — see FEEDBACK-FR-015.

**Priority:** Must Have
**Source:** Spec 001 AI-TUTOR-FR-012

---

### FEEDBACK-FR-003 — Authenticated Feedback Submission

Feedback can only be submitted by authenticated users.

- Any attempt to submit feedback without an authenticated session must be rejected server-side
- This requirement is effectively always met for AI Tutor response feedback, since the AI Tutor itself requires authentication (Spec 001)
- The feedback submission endpoint must verify authentication before writing any feedback record

**Priority:** Must Have
**Source:** Spec 001 AI-TUTOR-FR-001; Spec 004 ACCOUNT-FR-005

---

### FEEDBACK-FR-004 — Feedback Storage

Submitted feedback must be stored in the database for Product Owner review.

- Each feedback submission must create a record in the database
- Feedback records must not store full AI conversation content (see FEEDBACK-FR-009)
- Feedback records must be stored securely and must not be publicly accessible
- Feedback records must be readable by the Product Owner for product review purposes

**Priority:** Must Have
**Source:** PRD 13.10 FR-FB-001; Spec 001 AI-TUTOR-FR-012

---

### FEEDBACK-FR-005 — Feedback Tied to Authenticated User

Each feedback record must include the user ID of the user who submitted it.

- The user ID from the authenticated session must be included in the feedback record
- This association allows the Product Owner to understand patterns across users without exposing individual user details unnecessarily
- No personally identifiable data beyond the user ID is required in the feedback record

**Priority:** Must Have
**Source:** PRD 13.10; Spec 004

---

### FEEDBACK-FR-006 — Feedback Timestamp

Each feedback record must include a timestamp of when the feedback was submitted.

- The timestamp must record the server-side time of the feedback submission
- The timestamp helps the Product Owner understand feedback volume over time and identify patterns by date

**Priority:** Must Have
**Source:** PRD 13.10

---

### FEEDBACK-FR-007 — Feedback Context Type and Source Surface

Each feedback record must identify what type of feedback it is and which surface it came from.

- Feedback type must be recorded (e.g., "ai_response" for AI Tutor response feedback, "general" for beta feedback)
- Source surface must be recorded (e.g., "ai_tutor")
- This context allows the Product Owner to filter and understand feedback by feature area

**Priority:** Must Have
**Source:** PRD 13.10 FR-FB-004

---

### FEEDBACK-FR-008 — AI Response Reference Identifier

AI response feedback must use a server-generated identifier (`ai_response_id`) to reference the specific AI response without storing full conversation content (OQ-FB-003 resolved).

- Each completed AI Tutor response must receive a server-generated `ai_response_id`
- When a user submits feedback on a response, the feedback record must include this `ai_response_id`
- The full text of the AI Tutor question and the AI response must not be stored in the feedback record
- The `ai_response_id` provides a privacy-safe reference to the response event without retaining conversation content
- The `ai_response_id` must be coordinated between the AI Tutor implementation and the Feedback Collection implementation (see SDD Handoff Notes)

**Priority:** Must Have
**Source:** Spec 001 Privacy and Data Handling section; D-AI-004; PRD 14.7 NFR-PRIV-001; OQ-FB-003 resolved

---

### FEEDBACK-FR-009 — No Private Data in Feedback Records

Feedback records must not contain private, sensitive, or personally identifiable data beyond what is required.

- Full AI Tutor conversation content (questions and responses) must not be stored in feedback records
- Private IBM i source code, sensitive job logs, credentials, or customer data must not be stored in feedback records
- Feedback records must contain only the attributes defined in Section 9 (Feedback Data Requirements)

**Priority:** Must Have
**Source:** PRD 14.7 NFR-PRIV-001; Spec 001 Privacy and Data Handling

---

### FEEDBACK-FR-010 — Duplicate Feedback Handling

A user may change their feedback on the same AI response. The latest selection replaces the previous value (OQ-FB-001 resolved).

- One active feedback value per user per AI response is maintained at all times
- If a user clicks "Helpful" and then clicks "Not helpful" on the same response, the stored value becomes "Not helpful"
- If a user clicks the same value again, no new record is created and the existing record is preserved unchanged
- The implementation must not create more than one active feedback record per user per AI response
- The UI must reflect the user's latest selected value after any change

**Priority:** Must Have
**Source:** US-FB-005; OQ-FB-001 resolved

---

### FEEDBACK-FR-011 — Feedback Submission Acknowledgement

After successfully submitting feedback, the user must receive a brief visual acknowledgement.

- The acknowledgement must appear near the feedback control after submission
- The acknowledgement must be brief and non-disruptive (e.g., a short confirmation message or a visual state change on the control)
- The acknowledgement must not interrupt or break the ongoing AI Tutor conversation
- If feedback submission fails, the user must see a friendly retryable error message instead of the acknowledgement

**Priority:** Must Have
**Source:** PRD 13.10 FR-FB-003

---

### FEEDBACK-FR-012 — Feedback Error Handling

Feedback submission failures must be handled gracefully.

- If the feedback write to the database fails (e.g., network error, database error), the user must see a non-disruptive error message with a retry option
- The error message must be user-friendly and must not expose technical details
- A failed feedback submission must not affect the AI Tutor conversation; the user must still be able to continue asking questions

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-003

---

### FEEDBACK-FR-013 — No Public Display of Feedback

Feedback records must never be visible to other users or displayed publicly.

- No user may see another user's feedback
- Feedback values (helpful / not helpful) must not be aggregated and displayed to end users as ratings or scores on AI responses
- Feedback is strictly internal and for Product Owner review only

**Priority:** Must Have
**Source:** PRD 13.10

---

### FEEDBACK-FR-014 — No Automated AI Retraining

Feedback must not trigger any automated changes to the AI provider or model.

- Feedback records are stored for human review and human-driven product decisions only
- No feedback record or feedback aggregate must automatically trigger a prompt change, model fine-tune, or API configuration change
- This constraint is important because inaccurate or malicious feedback could otherwise have unintended product effects

**Priority:** Must Have
**Source:** PRD 15.4 Principle 7 (Trust); PRD 15.9

---

### FEEDBACK-FR-015 — Lightweight General Beta Feedback

The MVP must include a lightweight authenticated general beta feedback entry point for users to submit impressions or requests (OQ-FB-002 resolved).

- A simple link or button must appear in a non-intrusive location such as the navigation or footer
- Clicking it opens a minimal form where the user can type a short free-text message. This free-text is for general beta feedback only and is separate from AI response feedback.
- AI response feedback remains Helpful / Not helpful only and must not show a free-text comment box (FEEDBACK-FR-002 is unaffected by this requirement)
- General beta feedback submissions must be stored with: user ID, timestamp, feedback type ("general_beta"), and source surface
- General beta feedback is internal only and must not be publicly visible
- General beta feedback must not replace or interrupt the AI Tutor experience

**Priority:** Must Have
**Source:** PRD 13.10 FR-FB-001, FR-FB-005; OQ-FB-002 resolved

---

## 8. Non-Functional Requirements

### NFR: Security

- Feedback submission endpoints must require authentication before writing any record
- Feedback records must not expose private user data beyond the user ID
- The feedback storage must not be publicly accessible
- No authentication secrets or user credentials must be logged or stored in feedback records

**Source:** PRD 14.6 NFR-SEC-003; Spec 004

---

### NFR: Privacy

- Full AI Tutor conversation content must not be stored in feedback records (FEEDBACK-FR-009)
- Feedback records must contain only the minimum attributes defined in Section 9
- Feedback data must not be shared with third parties in MVP
- No personally identifiable information beyond the user ID is required

**Source:** PRD 14.7 NFR-PRIV-001; Spec 001 Privacy and Data Handling

---

### NFR: Reliability

- A feedback write failure must not affect the AI Tutor conversation experience
- The feedback control must remain available for retry after a failure
- Feedback must not be a blocking dependency for the AI Tutor conversation — if feedback storage is unavailable, the AI Tutor must still function normally

**Source:** PRD 14.4 NFR-REL-005

---

### NFR: Performance

- The feedback submission must be fast and non-blocking relative to the AI Tutor conversation
- The feedback write must not delay the display of the next AI response
- Feedback should be submitted asynchronously where possible so the user is not waiting on the database write before seeing the acknowledgement

**Source:** PRD 14.3 NFR-PERF-004

---

### NFR: Accessibility

- The helpful / not helpful controls must have clear, descriptive accessible labels (e.g., "Mark this response as helpful", "Mark this response as not helpful")
- The feedback acknowledgement must be communicated to screen readers appropriately
- The controls must be keyboard-navigable

**Source:** PRD 14.10 NFR-ACC-002, NFR-ACC-003

---

### NFR: Maintainability

- The feedback data model should be designed to support adding optional fields (e.g., a reason or comment) in a future version without requiring a full table rebuild
- The feedback storage should be clearly separated from the AI Tutor implementation so that feedback behavior can be changed independently

**Source:** PRD 14.13 NFR-MAIN-005

---

## 9. Feedback Data Requirements

This section defines the data attributes for the MVP feedback records at the spec level. This is not a database schema. The specific implementation will be defined in the implementation plan.

### Feedback Record Attributes

| Attribute | Purpose | Notes |
|---|---|---|
| Feedback ID | Unique identifier for the feedback record | Generated by the database |
| User ID | Associates the feedback with the authenticated submitter | From the Supabase Auth session; required |
| Feedback type | Identifies the category of feedback | Examples: "ai_response", "general_beta" |
| Feedback value | The user's feedback choice | "helpful" or "not_helpful" for AI response feedback |
| Source surface | Which product feature the feedback came from | Examples: "ai_tutor" |
| AI response ID (`ai_response_id`) | A server-generated identifier linking the feedback to the specific AI response | Does NOT store full conversation content; one active feedback value per user per `ai_response_id` (OQ-FB-003 resolved) |
| Submitted timestamp | When the feedback was submitted | Server-side timestamp |
| Optional metadata | Additional context if needed | Must not include full AI conversation text, private source code, job logs, credentials, or customer data |

### Key Data Principles

- **Full AI conversation content must not be stored in feedback records.** The source item reference ID provides a reference, not the content itself.
- **Feedback records must not contain private IBM i source code, sensitive job logs, credentials, or customer data.** If any such content appears in an AI prompt, it must not flow into the feedback record.
- **Feedback records must be scoped to authenticated users.** No anonymous feedback records are created in MVP.
- No free-text reason or comment field is stored for AI response feedback records in MVP. General beta feedback records include a short free-text message field (FEEDBACK-FR-015).
- One active feedback value per user per `ai_response_id` is maintained; a user changing their rating replaces the previous value rather than creating a duplicate (OQ-FB-001 resolved).

---

## 10. UX Requirements

The following UX requirements define the expected user experience for feedback collection. Specific visual design and component choices are to be determined during implementation.

### Helpful / Not Helpful Controls on AI Responses

- After each completed AI Tutor response, a helpful / not helpful control set must appear below the response
- The controls must be clearly labeled (e.g., thumbs up/down icons or "Helpful" / "Not helpful" text buttons)
- The controls must not appear during response streaming; they appear only after the response has fully completed

### Submitted Feedback State

- After the user clicks Helpful or Not helpful, the controls must visually indicate which option is currently selected (e.g., the selected option is highlighted)
- If the user clicks the other option, the UI must update to reflect the new selection (the previous selection is deselected and the new selection is highlighted)
- The submitted/selected state must not disrupt the ongoing conversation; the user can continue asking questions immediately after submitting

### Error State

- If feedback submission fails, a brief, non-disruptive error message must appear near the controls
- The error message should allow retry (e.g., "Couldn't save your feedback. Try again.")
- The AI Tutor conversation must remain fully functional if feedback fails

### Accessibility Labels

- Each feedback button/icon must have a descriptive accessible label for screen reader users
- Accessible labels must clearly communicate the purpose of each control

### No Comment Box for AI Response Feedback

- No free-text comment field, dropdown reason selector, or elaboration prompt must appear for AI response feedback in MVP
- AI response feedback is a single click only: Helpful or Not helpful
- Note: general beta feedback (FEEDBACK-FR-015) uses a short free-text message — this is a separate feedback type on a separate form and does not appear within the AI Tutor response flow

### No Disruption to AI Tutor Conversation Flow

- The feedback controls must be displayed in a way that does not interrupt or visually compete with the AI Tutor conversation
- Feedback submission must not scroll the user away from the conversation or open a modal in the MVP

### General Beta Feedback Entry Point

- A lightweight feedback link or button must appear in a non-intrusive location (navigation or footer) (OQ-FB-002 resolved; FEEDBACK-FR-015)
- Clicking it opens a minimal form where the user can type a short free-text message and submit
- The form is for general beta feedback only — it is a separate mechanism from AI response feedback and must not include Helpful / Not helpful controls
- The form must be simple and fast; it must not feel like a full support ticket system

---

## 11. Access Rules

| Operation | Authenticated User | Unauthenticated User |
|---|---|---|
| Submit AI response feedback | Allowed (AI Tutor requires auth by definition) | Not possible (AI Tutor not accessible) |
| Submit general beta feedback | Allowed | Not possible (auth required) |
| Read own feedback records | Not exposed to users in MVP | Not applicable |
| Read another user's feedback records | Blocked | Blocked |
| View aggregate feedback scores | Not available to users in MVP | Not available to users in MVP |

All feedback submission operations must be enforced server-side. Feedback must not be publicly visible in any form.

---

## 12. Dependencies

The Feedback Collection feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Database | Supabase PostgreSQL — feedback records are stored here | ADR-003 |
| Authentication | Supabase Auth — user identity for scoping feedback records | ADR-004 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 001: AI Tutor | The helpful / not helpful feedback control appears on AI Tutor responses; AI Tutor authentication gates access to the feedback control |
| Spec 004: User Account and Onboarding | Authentication must be in place for feedback submissions to be associated with a user |

---

## 13. Acceptance Criteria

The Feedback Collection feature is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### AI Response Feedback

- [ ] Each completed AI Tutor response shows Helpful and Not helpful feedback controls
- [ ] The controls appear after the response completes, not during streaming
- [ ] An authenticated user can submit a "Helpful" rating and receive a visual acknowledgement
- [ ] An authenticated user can submit a "Not helpful" rating and receive a visual acknowledgement
- [ ] After submitting, the controls update to a submitted/selected state
- [ ] The AI Tutor conversation continues normally after feedback submission

### Feedback Storage

- [ ] Each AI response feedback submission creates or updates a record in the database with: user ID, feedback type, feedback value, source surface, ai_response_id, and timestamp
- [ ] Each general beta feedback submission creates a record with: user ID, feedback type ("general_beta"), source surface, free-text message, and timestamp
- [ ] Full AI Tutor conversation content (question text and response text) is not stored in the feedback record
- [ ] No private source code, job logs, credentials, or customer data appears in any feedback record

### Error Handling

- [ ] If the feedback write fails, a brief friendly retryable error message appears near the feedback controls
- [ ] A feedback failure does not interrupt the AI Tutor conversation

### Restrictions

- [ ] No free-text reason or comment field appears within AI response feedback controls in MVP (general beta feedback's free-text form is separate and does not appear in the AI Tutor conversation flow)
- [ ] Feedback is not publicly visible or displayed to other users
- [ ] Feedback does not trigger any automated AI model changes

### General Beta Feedback

- [ ] A feedback link or button is visible in a non-intrusive location (navigation or footer)
- [ ] An authenticated user can submit a general text feedback message through the form
- [ ] General beta feedback is stored with user ID, timestamp, feedback type ("general_beta"), and source surface
- [ ] The general beta feedback form is separate from AI response feedback controls and does not show Helpful / Not helpful controls
- [ ] The general beta feedback form is lightweight and does not disrupt the product experience

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low feedback volume — users do not click helpful / not helpful | Medium | Medium | Design the controls to be visible and easy to interact with; ensure they do not require extra steps to use; monitor click rates from beta day one |
| Users misunderstanding feedback purpose — users think the AI will immediately change based on their rating | Low | Low | Avoid overstating feedback impact in the UI; do not promise real-time improvement; keep the feedback control simple and label it clearly |
| Duplicate or conflicting feedback records — user clicks both Helpful and Not helpful in quick succession | Low | Medium | Implement FEEDBACK-FR-010 replace-with-latest behavior (OQ-FB-001 resolved); enforce one active record per user per ai_response_id at the data layer; test rapid click scenarios |
| Feedback storing too much sensitive context — sensitive data leaks into optional metadata or source item reference | Low | High | FEEDBACK-FR-009 explicitly prohibits storing full conversation content or sensitive data; test that no prompt text, response text, or user-pasted content flows into feedback records |
| Scope creep into admin analytics dashboard — requests to build a feedback dashboard during implementation | Medium | Medium | This spec explicitly excludes an admin feedback dashboard; manual review of database records is sufficient for MVP; any dashboard requires Product Owner approval |
| Feedback not actionable without comments — helpful / not helpful alone is too thin to guide specific improvements | Medium | Medium | Aggregate patterns (which response types or topics get "not helpful") are still meaningful; optional general beta feedback form adds a text channel; post-MVP can add comment fields |

---

## 15. Open Questions

No open questions remain for this spec at this stage. Any new questions discovered during implementation planning should be added here before coding begins.

---

## 16. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any Feedback Collection implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope and feedback data requirements
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] AI Tutor implementation plan (Spec 001) is coordinated to confirm the server-generated `ai_response_id` is generated and returned per response, so feedback can reference it

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for Feedback Collection is created and approved
- [ ] Spec 001 (AI Tutor) is implemented — the AI Tutor response control is the primary host for feedback controls
- [ ] Spec 004 (User Account and Onboarding) is implemented — authentication is required for all feedback submissions
- [ ] The feedback record design confirms that no full conversation content or sensitive user data flows into the record

### Notes for Implementation Planning

- The feedback write should be implemented as a non-blocking, asynchronous operation. The AI Tutor conversation must not wait for the feedback write to complete before displaying the next response.
- The feedback control should be implemented as a client-side component that calls a server-side feedback submission endpoint. The endpoint must verify authentication and the absence of sensitive content before writing the record.
- The `ai_response_id` (FEEDBACK-FR-008) must be coordinated between the AI Tutor and Feedback Collection implementation plans. The AI Tutor implementation must generate and return a server-side identifier per completed response so the feedback control can include it in the submission.
- The replace-with-latest behavior for duplicate feedback (FEEDBACK-FR-010) should be enforced at the data layer (e.g., upsert on user ID + ai_response_id) to avoid race condition duplicates.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — MVP Feedback Collection spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 001 and 004 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved duplicate feedback, general beta feedback, and AI response identifier decisions |
| 2026-07-01 | 1.0 | Approved Feedback Collection SDD spec for implementation planning |
