# Spec 001: AI Tutor

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 001 |
| Feature | AI Tutor |
| Status | Draft |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| docs/adr/ADR-005-ai-provider-and-model.md | v0.1 Accepted | AI provider, model, and abstraction decisions |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-002-hosting-and-deployment.md | v0.1 Accepted | Vercel hosting decision |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL and storage decisions |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |

---

## 2. Purpose

The AI Tutor is the primary differentiator of the IBMiHub AI MVP. Its purpose is to give IBM i learners and working developers a focused, trustworthy way to ask IBM i questions in natural language and receive useful explanations.

Without the AI Tutor, IBMiHub AI is a static learning website. With it, the product becomes a responsive, adaptive learning companion that helps users get unstuck, understand concepts from multiple angles, and connect theory to practical IBM i work — without requiring access to a senior developer or a live IBM i system.

The AI Tutor exists in the MVP to:

- Help beginners ask basic IBM i questions without embarrassment
- Help working developers quickly refresh or clarify IBM i concepts
- Demonstrate that AI can be genuinely useful in a focused IBM i learning context
- Validate the core product thesis that users will return to and trust an IBM i-specific AI assistant

This spec defines the MVP scope, behavior, requirements, acceptance criteria, and implementation boundaries for the AI Tutor feature.

---

## 3. MVP Scope

The MVP AI Tutor is a text-based, authenticated, session-scoped conversational assistant focused on IBM i learning and concept explanation.

### In Scope for MVP

| Capability | Description |
|---|---|
| IBM i-focused conceptual Q&A | Users can ask questions about IBM i concepts, RPGLE, CLLE, SQL, DDS, 5250, job logs, and IBM i development workflows |
| Beginner-friendly explanations | The AI Tutor adjusts language and depth for users who identify as new to IBM i |
| Working developer refresh support | The AI Tutor supports more direct, practical answers for users who already work with IBM i |
| Prompt-guidance-only behavior | The AI Tutor operates on a well-crafted system prompt only; no lesson-aware context, no RAG, no fine-tuning (D-AI-003) |
| Authenticated usage only | AI Tutor is only available to logged-in users; unauthenticated users see a login prompt (D-PROD-005) |
| Session-level conversation context | Conversation history is maintained within a single browser session; it is not persisted server-side across sessions (D-AI-004) |
| Safety and uncertainty messaging | The AI Tutor communicates that its responses may be incomplete or incorrect and should be validated before production use |
| Sensitive data warning | The AI Tutor includes clear guidance near the input area discouraging users from sharing private code, job logs, credentials, or customer data |
| AI response feedback collection | Users can mark individual AI responses as helpful or not helpful |
| Provider abstraction layer | All Anthropic SDK calls are isolated behind an AI service module; no other part of the codebase imports the Anthropic SDK directly |
| Streaming responses | The AI Tutor displays AI responses progressively as they are generated, not as a single block after a long wait |

---

## 4. Explicitly Out of Scope for MVP

The following capabilities must not be included in the MVP AI Tutor implementation.

| Excluded Capability | Reason |
|---|---|
| Lesson-aware AI (AI knowing current lesson context) | Deferred to post-MVP; adds pipeline complexity (D-AI-003) |
| Retrieval-Augmented Generation (RAG) | Not required for MVP prompt-guidance approach (D-AI-003) |
| Fine-tuning or model customization | Not approved for MVP; requires separate review |
| Real IBM i system connectivity | Explicitly prohibited in MVP (PRD 18.14, D-TECH-003) |
| Private production source code upload | Explicitly prohibited in MVP (PRD 18.15) |
| Sensitive production job log upload | Explicitly prohibited in MVP (PRD 18.15) |
| Server-side persistent AI conversation history | Not persisted across sessions in MVP (D-AI-004) |
| AI-generated production-safe guarantees | The AI Tutor must never claim production correctness |
| Automatic code execution or compilation | Not in MVP scope (PRD 12, Section MVP Explicit Exclusions) |
| Full job log analyzer feature | Post-MVP (PRD 11, Full Product Scope table) |
| Full RPG Playground feature | Post-MVP (PRD 11, Full Product Scope table) |
| Enterprise AI governance or audit controls | Future only (PRD 15.3) |
| Autonomous agent actions | Not in MVP scope |
| Customer-specific knowledge base ingestion | Future only (PRD 15.3) |
| Organization-level AI usage controls | Future only; enterprise features excluded from MVP |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A user who is new to IBM i and may have little or no prior exposure to RPGLE, CLLE, 5250 screens, libraries, objects, or job logs. This user benefits from the AI Tutor because:

- They can ask basic questions without feeling judged
- They can ask for alternate explanations when a lesson is confusing
- They can ask "what does this term mean?" during or after a lesson
- They can ask what to learn next

The AI Tutor should detect beginner-level questions through context and system prompt guidance and respond with simpler, more structured, term-explaining answers.

### Persona 2: Working IBM i Developer

A user who already works with IBM i systems and uses the AI Tutor to refresh concepts, clarify specific syntax or behavior, or explore unfamiliar areas of the IBM i platform. This user benefits from:

- Faster conceptual refreshers without searching across fragmented documentation
- Practical answers that assume some IBM i experience
- Explanations of RPGLE, CLLE, SQL, DDS, or job log behavior that save time during daily work

The AI Tutor should provide more concise, practical answers for users who demonstrate existing IBM i knowledge through their questions.

---

## 6. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-AITUTOR-001 | Beginner IBM i Learner | Ask what a physical file is in plain language | I can understand the concept without reading reference documentation |
| US-AITUTOR-002 | Beginner IBM i Learner | Receive a simple, structured explanation with IBM i-specific context | I can build my understanding step by step |
| US-AITUTOR-003 | Working IBM i Developer | Ask for a quick explanation of a CLLE command I haven't used recently | I can refresh my knowledge without spending time searching |
| US-AITUTOR-004 | Working IBM i Developer | Ask about RPGLE, SQL, DDS, or job log concepts | I can get focused IBM i answers without generic programming answers |
| US-AITUTOR-005 | Any user | Be reminded not to share private code, credentials, or sensitive logs before submitting a question | I know what is and is not safe to share with the AI Tutor |
| US-AITUTOR-006 | Any user | Mark an AI response as helpful or not helpful | The product team can understand which responses are useful |
| US-AITUTOR-007 | Any user | Ask follow-up questions within the same session | I can continue a learning conversation without losing context |
| US-AITUTOR-008 | Unauthenticated visitor | See a clear message prompting me to log in when I try to use the AI Tutor | I know I need an account to use this feature |
| US-AITUTOR-009 | Any user | Receive a response that clearly says when the AI is uncertain or when I should verify against official documentation | I do not apply AI guidance as production truth without validation |
| US-AITUTOR-010 | Any user | Ask follow-up questions and have the AI Tutor remember what was discussed in the current session | I do not have to repeat context within the same conversation |

---

## 7. Functional Requirements

### AI-TUTOR-FR-001 — AI Tutor Access Control

The AI Tutor must only be accessible to authenticated users.

- Logged-in users: full AI Tutor experience available
- Unauthenticated users: the AI Tutor UI must display a login prompt rather than a functional input area
- The system must not make AI provider API calls on behalf of unauthenticated users

**Priority:** Must Have
**Source:** D-PROD-005, PRD 13.8 FR-AI-002

---

### AI-TUTOR-FR-002 — Prompt Input Area

The AI Tutor must provide a text input area where authenticated users can type or paste questions.

- The input area must accept multi-line text
- The input must have a submit mechanism (button or keyboard shortcut)
- The input must be disabled while an AI response is being generated
- The input must be cleared or ready for follow-up after a response is received
- The input area must display or be accompanied by a privacy notice (see AI-TUTOR-FR-009)

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-002, UX Requirements Section 12

---

### AI-TUTOR-FR-003 — Response Generation

The AI Tutor must generate a response to each user question using the approved AI provider and model.

- Responses must be delivered via streaming so content appears progressively
- The UI must show a loading or streaming indicator while the response is being generated
- Responses must complete or handle timeout gracefully (see AI-TUTOR-FR-015)

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-001, ADR-005

---

### AI-TUTOR-FR-004 — IBM i Domain Focus

The AI Tutor must be configured to stay focused on IBM i learning and productivity topics.

- The system prompt must establish IBM i as the primary domain context
- If a question is clearly outside IBM i scope, the AI Tutor should acknowledge this and redirect to IBM i topics
- The AI Tutor must not behave as a generic programming assistant

**Priority:** Must Have
**Source:** PRD 15.1 (IBM i Focused Principle), 15.4 (Principle 1), 13.8 FR-AI-004

---

### AI-TUTOR-FR-005 — Beginner-Friendly Explanations

The AI Tutor must support beginner-friendly explanations.

- The system prompt must instruct the AI to explain IBM i terms when they may be unfamiliar
- The AI Tutor must avoid overwhelming beginners with unnecessary technical depth in response to basic questions
- Explanations should use simple, practical language where appropriate
- The AI Tutor should offer follow-up suggestions ("You might also want to understand...")

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-003, 15.4 (Principle 4 - Beginner-Aware), D-PROD-006

---

### AI-TUTOR-FR-006 — Supported Question Topics

The AI Tutor must be able to support questions about the following IBM i topics:

- IBM i platform overview and terminology
- RPGLE concepts and syntax
- CLLE concepts and syntax
- SQLRPGLE and DB2 for i concepts
- DDS concepts
- 5250 screen and command concepts
- Job logs and spool files (conceptual understanding only)
- IBM i development workflow concepts
- IBM i basic terminology and system concepts

The AI Tutor must not support:
- Questions requiring real IBM i system access
- Analysis of private production source code
- Analysis of sensitive production job logs

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-004, 15.1 MVP AI Scope

---

### AI-TUTOR-FR-007 — Safety and Uncertainty Messaging

The AI Tutor must communicate appropriate caution about the reliability of its responses.

- Responses must not claim guaranteed correctness
- When uncertain, the AI Tutor must communicate uncertainty clearly (e.g., "This may vary depending on your system configuration")
- Responses to production-relevant questions must include a note that the guidance should be validated before production use
- The AI Tutor must not present any response as production-certified

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-005, FR-AI-006; NFR-AI-001, NFR-AI-002; 15.7 AI Trust Boundaries

---

### AI-TUTOR-FR-008 — Sensitive Data Warning

The AI Tutor must actively discourage users from sharing sensitive information.

- The system prompt must instruct the AI to decline requests involving private production source code
- The system prompt must instruct the AI to discourage sharing of sensitive job logs, credentials, passwords, customer data, or proprietary business data
- A visible privacy notice must appear near the AI Tutor input area before the user submits any question (see UX section)
- If a user's prompt appears to contain or request handling of sensitive data, the AI Tutor should respond with an appropriate redirect or refusal

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-007; NFR-AI-003; NFR-PRIV-002, NFR-PRIV-003; 15.7 AI Trust Boundaries

---

### AI-TUTOR-FR-009 — Privacy Notice Display

A privacy notice must be displayed near the AI Tutor input area, visible before the user submits a question.

The notice must communicate (at minimum):
- Do not share private production code
- Do not share sensitive job logs
- Do not share credentials, passwords, or customer data
- AI responses may be incorrect; validate before production use

The exact wording of the privacy notice should be finalized before beta launch (OQ-AI-005 from the decision register).

**Priority:** Must Have
**Source:** PRD 15.7, NFR-PRIV-003; OQ-SEC-003; D-AI-004

---

### AI-TUTOR-FR-010 — Session-Level Conversation Context

The AI Tutor must maintain conversation context within a single browser session.

- The AI Tutor must pass prior messages in the current session as part of the AI provider request so the AI can reference earlier context
- Conversation history must not be persisted server-side beyond the current session (D-AI-004)
- When the user starts a new browser session, the conversation context starts fresh with no prior history

**Priority:** Must Have
**Source:** D-AI-004, PRD 14.16, 14.7

---

### AI-TUTOR-FR-011 — Follow-Up Questions

The AI Tutor must support follow-up questions within the current session.

- Users must be able to send multiple questions in sequence
- The AI Tutor must use the conversation history from the current session to answer follow-up questions in context
- The conversation display must show the full exchange (questions and responses) in the current session

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-009, US-AITUTOR-010

---

### AI-TUTOR-FR-012 — Response Feedback Collection

The AI Tutor must allow users to provide feedback on individual AI responses.

- Each AI response must include a helpful / not helpful feedback mechanism
- Feedback submissions must be stored for product review and AI quality improvement
- Feedback should optionally support a brief reason or comment (to be determined during UX design; helpful/not helpful alone is acceptable for MVP per D-AI-007)

**Priority:** Must Have
**Source:** PRD 13.8 FR-AI-010, 15.10 AI Feedback and Quality Signals; D-AI-007

---

### AI-TUTOR-FR-013 — Provider Abstraction Layer

The AI Tutor implementation must use a provider abstraction layer.

- All calls to the Anthropic SDK must be encapsulated within a dedicated AI service module (e.g., a server-side service file or utility)
- No other part of the application (pages, components, other services) should import or call the Anthropic SDK directly
- The abstraction layer must expose a clean interface that accepts a conversation history and returns a streaming response
- This isolation ensures that switching from Claude Sonnet 4.6 to Haiku 4.5, or to a different provider entirely, requires changes only in the AI service layer

**Priority:** Must Have
**Source:** ADR-005 Recommended Decision, PRD 15.12

---

### AI-TUTOR-FR-014 — Token Usage and Cost Monitoring

The AI Tutor implementation must capture and log basic token usage and cost signals.

- After each AI response, the implementation must log the input token count and output token count returned by the AI provider
- This data must be available for review without requiring the storage of full conversation content
- No AI conversation content (question text or response text) is required to be persisted server-side for cost monitoring purposes
- Token usage signals should eventually support future rate limiting and paid plan enforcement

**Priority:** Must Have
**Source:** PRD 15.13, ADR-005 Consequences, 17.4

---

### AI-TUTOR-FR-015 — Error Handling

The AI Tutor must handle errors gracefully without breaking the product experience.

- If the AI provider returns an error, the AI Tutor must display a clear, non-technical error message to the user
- Common error scenarios requiring handling: provider timeout, rate limit exceeded, network failure
- The rest of the product (dashboard, lessons) must remain accessible when the AI Tutor experiences an error
- Error states must not expose internal error details, stack traces, or API credentials to the user

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-005; 14.3 NFR-PERF-004

---

### AI-TUTOR-FR-016 — Rate Limit Awareness

The AI Tutor implementation must be prepared for AI provider rate limits.

- The AI service layer must handle rate limit responses from the AI provider
- When rate limits are encountered, the user should receive a clear, friendly message indicating temporary unavailability
- A retry strategy appropriate for the AI provider's rate limit behavior should be defined during implementation planning
- Specific rate limit thresholds and retry logic are to be determined during the implementation plan phase (not this spec)

**Priority:** Should Have
**Source:** PRD 18.6 AI Cost and Rate Limit Constraints; ADR-005

---

### AI-TUTOR-FR-017 — Response Style Consistency

The AI Tutor must produce responses in a consistent, structured style.

- Responses must use clear headings, bullets, or examples where they improve readability
- Responses must be appropriately concise — not unnecessarily verbose
- IBM i technical terms mentioned in responses should be briefly explained when they may be unfamiliar to a beginner
- Response style must feel like a knowledgeable IBM i mentor, not a generic AI chatbot

**Priority:** Should Have
**Source:** PRD 13.8 FR-AI-008; 15.6 AI Response Style

---

## 8. Non-Functional Requirements

### NFR: Security

- All AI Tutor requests must be authenticated (Supabase Auth) before an AI provider call is made
- The AI provider API key must be stored as a server-side environment variable and must never be exposed to the client browser
- The AI service layer must run server-side (Next.js API route or Server Action) to ensure the API key is not accessible client-side
- AI Tutor responses must be served over HTTPS

**Source:** PRD 14.6 NFR-SEC-001, NFR-SEC-005; ADR-004

---

### NFR: Privacy

- AI conversation content must not be persisted server-side beyond the current session (D-AI-004)
- Token usage metadata may be logged without storing conversation content
- AI feedback submissions may be stored with a reference to the user and a helpfulness rating
- The system must not request, accept, or store private production code, job logs, credentials, or customer data
- Full AI interaction content must not be stored in the MVP database

**Source:** PRD 14.7 NFR-PRIV-001 through NFR-PRIV-004; D-AI-004; OQ-SEC-006

---

### NFR: Performance

- AI Tutor response streaming must begin within a reasonable time to maintain a conversational feel
- The first streamed token should appear within an acceptable latency window for the conversational use case
- Specific latency targets should be defined and tested during implementation; the target should feel responsive to a user in a learning context
- The AI Tutor should not degrade the performance of the rest of the product (lesson loading, dashboard)

**Source:** PRD 14.3 NFR-PERF-004

---

### NFR: Reliability

- The AI Tutor must handle provider failures gracefully without crashing the product (see AI-TUTOR-FR-015)
- The AI Tutor's failure must not prevent users from accessing lessons, dashboard, or feedback features
- The AI Tutor should remain available for the majority of a beta user's learning sessions; specific uptime targets are not required for MVP but should not feel broken

**Source:** PRD 14.4 NFR-REL-005

---

### NFR: Maintainability

- The AI service layer must be isolated in a dedicated module to enable future model, provider, or prompt changes with minimal impact
- The system prompt must be stored in a configurable location (e.g., a dedicated prompt file or constant), not hardcoded inline in the API route
- AI Tutor behavior changes (prompt updates, model switches, safety messaging updates) should be achievable without full application redeployment where feasible

**Source:** PRD 14.13 NFR-MAIN-005; ADR-005 Provider Abstraction; PRD 15.12

---

### NFR: Accessibility

- The AI Tutor input area and response display must be keyboard-navigable
- The loading or streaming state must be communicated appropriately to screen readers where feasible
- Sufficient color contrast must be maintained for the input, response text, and feedback controls

**Source:** PRD 14.10 NFR-ACC-001, NFR-ACC-002, NFR-ACC-005

---

### NFR: Observability

- Token usage per request must be logged in a format that allows review
- Feedback submissions (helpful / not helpful) must be stored for product review
- Basic AI Tutor error rates should be observable without full conversation content logging
- AI Tutor usage volume (number of questions asked per session, per day) should be trackable for MVP validation

**Source:** PRD 14.14 NFR-OBS-001, NFR-OBS-002; PRD 5 (AI Tutor Usage Metrics)

---

### NFR: Cost Awareness

- Token usage must be monitored from the first beta user session
- The implementation must log input token count and output token count per AI request
- The product team should be able to calculate approximate monthly AI cost from the logged data
- The provider abstraction layer must make it straightforward to switch from Claude Sonnet 4.6 to Claude Haiku 4.5 if cost monitoring indicates Sonnet pricing is unsustainable

**Source:** PRD 15.13; ADR-005 Cost monitoring guidance; D-AI-001

---

## 9. AI Behavior Rules

The following rules define how the AI Tutor must behave. These rules should be enforced through system prompt design and are not subject to user override.

| Rule | Required Behavior |
|---|---|
| IBM i Focus | Stay focused on IBM i learning and productivity topics. Do not provide unrelated programming assistance. |
| Clear Language | Use clear, practical, structured language. Prefer headings and bullets for multi-part answers. |
| Avoid Overconfidence | Do not present responses as guaranteed facts. Acknowledge that behavior may vary by IBM i version, system configuration, or company standards. |
| Say When Uncertain | When the AI cannot answer with confidence, state this explicitly rather than guessing. Example: "I'm not certain about this — you should verify against IBM documentation." |
| Encourage Validation | For any guidance that might be applied to a real system, remind users to verify with official IBM documentation, their company standards, or an experienced IBM i developer. |
| No Sensitive Data Requests | Do not ask the user to share private production code, job logs, credentials, passwords, company-specific object names, or customer data. |
| No Production Guarantees | Never claim that guidance is production-safe, verified, or correct for any specific system. |
| Beginner-Friendly When Needed | When a question indicates a beginner, explain technical terms, use analogies, and avoid overwhelming the user with advanced details. |
| Practical When Appropriate | For questions from working developers, provide more direct, technically accurate, concise answers without unnecessary simplification. |
| Respect Platform Boundaries | Never imply the ability to connect to a real IBM i system, execute code, or analyze private code from the user's environment. |

---

## 10. Prompt Strategy

This section defines what the MVP system prompt must accomplish at the product and requirements level. The final production system prompt should be written, reviewed, and tested as part of the AI Tutor implementation plan — not defined in this spec.

### What the System Prompt Must Accomplish

**IBM i Context Establishment**
The system prompt must establish that this AI assistant is specialized for IBM i learning and productivity. It must define the primary subject domains: IBM i concepts, RPGLE, CLLE, SQL, DDS, DB2 for i, 5250 workflows, job logs, and IBM i development practices.

**User Safety and Trust**
The system prompt must instruct the AI to:
- Communicate clearly that responses may be incomplete or incorrect
- Always recommend validation against official IBM documentation for production use
- Never claim production correctness or system-specific certainty

**Sensitive Data Boundary**
The system prompt must instruct the AI to:
- Decline to process or encourage the sharing of private production source code
- Decline to process sensitive job logs, credentials, or customer data
- Redirect any such requests to conceptual alternatives where possible

**Beginner and Professional Support**
The system prompt must instruct the AI to:
- Detect whether a question comes from a beginner or a more experienced developer based on context
- Adjust language, depth, and explanation style accordingly
- Always explain IBM i-specific terms when they may be unfamiliar

**Structured and Clear Responses**
The system prompt must instruct the AI to:
- Use clear structure (headings, bullets, examples) where it aids understanding
- Keep responses appropriately concise — not unnecessarily long
- Focus on practical, actionable explanations

**Uncertainty Handling**
The system prompt must instruct the AI to:
- State explicitly when it is uncertain about something
- Distinguish between general IBM i knowledge and behavior that may vary by system

### Prompt Review Requirement

The production system prompt must be reviewed by the Product Owner before beta launch. It must be tested against a representative set of IBM i questions (beginner and working developer) to verify that responses align with the AI behavior rules in Section 9 above.

---

## 11. Privacy and Data Handling

### Conversation Content

- **No server-side persistence of conversation content in MVP.** AI conversation messages (user questions and AI responses) are held in client-side session state only during a session and are not written to the database or any server-side store.
- When the user's browser session ends or the page is refreshed, conversation context is lost. This is expected and acceptable behavior for MVP.

### Session-Level Context

- The AI Tutor may pass prior messages from the current session to the AI provider API as part of the conversation history parameter. This is sent to the provider per-request and is not stored server-side by IBMiHub AI.
- The AI provider's own data handling policies apply to content sent to their API. Model names, model IDs, pricing, and provider data retention policies must be verified against official provider documentation before implementation begins.

### Token Usage Metadata

- Input token count and output token count returned by the AI provider may be logged server-side without storing conversation content.
- This metadata supports cost monitoring (AI-TUTOR-FR-014) and MVP validation metrics.

### Feedback Storage

- Helpful / not helpful feedback submitted by users (AI-TUTOR-FR-012) may be stored in the database.
- Feedback records should include: user reference, a timestamp, an identifier for the AI response, and the feedback value.
- Full AI response content is not required to be stored as part of the feedback record in MVP.

### What Must Never Be Stored

- Private production IBM i source code submitted by users
- Sensitive production job logs submitted by users
- Credentials, passwords, API keys, or customer data
- Full AI conversation content beyond the current session

---

## 12. UX Requirements

The following UX requirements define the expected user experience of the AI Tutor feature. Specific visual design, layout, and component choices are to be determined during implementation.

### AI Tutor Page or Panel

- The AI Tutor must be accessible as a dedicated page (e.g., `/ai-tutor`) or as a panel accessible from the dashboard and lesson experience
- The AI Tutor must be clearly presented as an IBM i learning assistant, not a general programming assistant

### Prompt Input

- A text area where the user can type a question
- A submit button or keyboard shortcut to send the question
- The input area must be disabled during response generation
- The input must accept multi-line text

### Response Display

- AI responses must appear in a clearly readable format (supporting markdown-style formatting: headings, bullets, code blocks)
- Response text must stream progressively as it is generated
- Each response must be visually distinguished from the user's question

### Loading and Streaming State

- A visible loading or streaming indicator must appear immediately when the user submits a question, before the response begins streaming
- Users must be able to tell when the AI Tutor is generating a response vs. idle

### Error State

- If the AI Tutor fails to generate a response, a clear, user-friendly error message must be shown
- The error message must not include technical error details or expose the AI provider
- The error state must allow the user to retry

### Privacy Notice

- A privacy notice must be visible near the prompt input area before the user submits any question
- The notice must communicate: do not share private code, logs, credentials, or customer data; AI responses may be incorrect
- The exact wording of the privacy notice is to be finalized before beta launch (OQ-AI-005)

### Helpful / Not Helpful Feedback

- Each completed AI response must include a mechanism for the user to mark the response as helpful or not helpful
- The feedback mechanism must be accessible without disrupting the conversation flow
- After submitting feedback, the user should receive a brief acknowledgement

### Unauthenticated User State

- Users who are not logged in must see a clear message when they attempt to access the AI Tutor
- The message must invite them to log in or create an account to use the feature
- The AI Tutor input must not be available to unauthenticated users

---

## 13. Dependencies

The AI Tutor feature depends on the following decisions, which have all been approved in the Sprint 1 Decision Register v0.3.

| Dependency | Decision | Register Reference |
|---|---|---|
| Authentication | Supabase Auth — users must be authenticated to use the AI Tutor | D-TECH-004, ADR-004 |
| Database | Supabase PostgreSQL — feedback records and token usage metadata stored here | D-TECH-003, ADR-003 |
| AI Provider | Anthropic, Claude Sonnet 4.6 as default; Claude Haiku 4.5 as cost fallback | D-AI-001, ADR-005 |
| Prompt approach | Prompt-guidance only; no lesson-aware context in MVP | D-AI-003 |
| Conversation history | Session-level only; not persisted server-side | D-AI-004 |
| Hosting | Vercel — AI service layer runs as Next.js API route or Server Action on Vercel serverless | D-TECH-002, ADR-002 |
| Tech stack | Next.js + TypeScript — AI service layer implemented as a server-side module | D-TECH-001, ADR-001 |
| Privacy notice wording | Final wording to be confirmed before beta (OQ-AI-005) | OQ-AI-005 |

### Internal Dependencies

The AI Tutor also depends on:
- **Spec 000: User Account and Authentication** — the authenticated session that gates AI Tutor access must be established by the auth implementation
- **Spec 000: Dashboard** — the quick-access AI Tutor link referenced in PRD dashboard requirements (FR-DASH-006) depends on this spec being implemented

---

## 14. Acceptance Criteria

The AI Tutor feature is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Authentication and Access Control

- [ ] An authenticated user can access the AI Tutor and submit questions
- [ ] An unauthenticated user sees a login prompt and cannot submit questions
- [ ] The AI provider API key is never exposed in client-side JavaScript or browser network requests

### Core AI Tutor Functionality

- [ ] An authenticated user can type an IBM i question and submit it
- [ ] The AI Tutor begins streaming a response within an acceptable latency window
- [ ] The response streams progressively in the UI — not displayed as a single block after a long delay
- [ ] The AI Tutor responds with IBM i-specific, practical, structured content
- [ ] The AI Tutor stays focused on IBM i topics and does not behave as a generic coding assistant

### Safety and Trust Boundaries

- [ ] AI responses do not claim guaranteed correctness or production-safe status
- [ ] AI responses include appropriate uncertainty language when the answer may vary by system or configuration
- [ ] The AI Tutor declines requests to process or provide private production source code
- [ ] The AI Tutor declines requests to process sensitive production job logs
- [ ] A privacy notice is displayed near the input area before a question is submitted

### Conversation and Session Behavior

- [ ] The user can ask follow-up questions and the AI Tutor references the current session context
- [ ] Starting a new browser session results in a fresh conversation with no prior history
- [ ] No AI conversation content is stored in the database or server-side logs

### Feedback Collection

- [ ] Each AI response includes a helpful / not helpful feedback option
- [ ] Submitting feedback stores a feedback record in the database
- [ ] Feedback submission does not disrupt the conversation

### Error and Edge Case Handling

- [ ] If the AI provider returns an error, a user-friendly message is shown
- [ ] An AI provider error does not crash or make the rest of the product inaccessible
- [ ] The product handles rate limit responses without exposing technical error details to the user

### Provider Abstraction

- [ ] All Anthropic SDK calls are isolated in a dedicated AI service module
- [ ] No other file in the codebase imports the Anthropic SDK directly
- [ ] Switching the model ID from Sonnet 4.6 to Haiku 4.5 requires a change only in the AI service configuration

### Observability

- [ ] Token usage (input and output token counts) is logged per AI request
- [ ] The product team can calculate approximate AI cost from the logged token data

### Product Owner Sign-off

- [ ] The Product Owner has reviewed the final system prompt and confirmed it matches the AI behavior rules in Section 9
- [ ] The Product Owner has confirmed the privacy notice wording before beta launch

---

## 15. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI hallucination — AI provides incorrect IBM i guidance | High | High | System prompt enforces uncertainty acknowledgement; safety messaging encourages validation; feedback collection identifies bad responses; continuous prompt improvement |
| Sensitive data sharing — user pastes private production code or logs | Medium / High | High | Privacy notice near input; system prompt instructs AI to decline sensitive content; no server-side content storage in MVP |
| AI cost overrun — usage exceeds budget during beta | Medium | Medium | Token usage logged from day one; monitoring allows early intervention; Haiku 4.5 fallback available as a one-line model ID change (ADR-005) |
| User overtrust — user applies AI guidance directly to production without validation | Medium | High | Safety messaging in every relevant response; privacy notice makes trust boundaries explicit; cannot be fully eliminated but can be substantially mitigated |
| Provider outage — Anthropic API becomes unavailable | Low | Medium | Error state handled gracefully (AI-TUTOR-FR-015); rest of product remains usable; provider abstraction layer supports future provider addition |
| Poor IBM i answer quality — AI gives generic or inaccurate IBM i responses | Medium | High | System prompt establishes IBM i domain context; feedback collection identifies poor responses; prompt iteration is a low-effort improvement path |
| Rate limit exceeded during beta | Low during early beta | Medium | Rate limit handling in AI service layer (AI-TUTOR-FR-016); user sees friendly message; token logging supports limit planning |

---

## 16. Open Questions

The following questions remain genuinely unresolved after the Sprint 1 Decision Register. Previously-decided items are not listed here.

| ID | Question | Owner | Needed Before |
|---|---|---|---|
| OQ-AI-005 | What exact wording should appear in the privacy notice near the AI Tutor input? | Product | Beta launch |
| OQ-AI-007 | Should the AI feedback mechanism support additional reason capture beyond helpful / not helpful in MVP, or is the binary sufficient? | Product | AI Tutor Spec finalization |
| OQ-AITUTOR-001 | Should the AI Tutor be a full-page experience, a side panel, or a modal? This affects the implementation design but not the functional requirements. | Product + Engineering | Implementation planning |
| OQ-AITUTOR-002 | Should the AI Tutor be accessible from within a lesson page as a side-by-side panel, or as a separate page the user navigates to? | Product + Engineering | Implementation planning |
| OQ-AITUTOR-003 | What is the maximum conversation length (number of turns) within a single session before conversation context should be truncated to manage token costs? | Engineering | Implementation planning |
| OQ-AITUTOR-004 | Should the AI Tutor display a suggested question prompt (e.g., "Try asking: What is a physical file?") when the conversation is empty? | Product | UX design |

---

## 17. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any implementation planning or coding begins for the AI Tutor feature.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the scope, behavior rules, and acceptance criteria
- [ ] Open questions OQ-AI-005 and OQ-AI-007 are resolved or explicitly deferred
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] OQ-AITUTOR-001 and OQ-AITUTOR-002 (page vs panel, layout) are decided

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for the AI Tutor is created and approved
- [ ] The Spec 000: User Account and Authentication is approved (auth must be in place for AI Tutor to function)
- [ ] The system prompt draft has been written and is ready for Product Owner review
- [ ] Model names, model IDs, and pricing have been re-verified against official Anthropic documentation (per ADR-005)
- [ ] AI provider API key is available as an environment variable in the development environment

### Notes for Implementation Planning

- The AI service layer (provider abstraction) is a critical architectural piece. It should be designed and reviewed before any AI Tutor UI work begins.
- Streaming support in Next.js (via Server Actions or API route with streaming response) must be confirmed to work in the chosen Vercel deployment before the UI streaming state is built.
- The feedback storage schema should be designed as part of the database implementation plan (not in this spec).

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP AI Tutor spec based on PRD v2.9 and Sprint 1 Decision Register v0.3 |
