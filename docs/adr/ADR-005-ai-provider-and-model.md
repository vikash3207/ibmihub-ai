# ADR-005: AI Provider and Model

## Status

Proposed

## Context

IBMiHub AI requires an AI provider and model to power the MVP AI Tutor. The AI Tutor is the primary differentiator of the product and must support IBM i-focused Q&A for beginner and working-developer personas, with appropriate trust boundaries, privacy guardrails, and beginner-friendly explanations.

The MVP AI Tutor uses prompt-guidance only (D-AI-003 approved) — no lesson-aware context injection, no RAG, no fine-tuning. AI conversation history is session-level only, not persisted server-side (D-AI-004 approved). The PRD is intentionally provider-neutral (PRD 18.5, 15.12) and requires that the provider be replaceable if needs change.

**Current model pricing (as of review date):**
- Claude Haiku 4.5: $1/$5 per MTok input/output
- Claude Sonnet 4.6: $3/$15 per MTok input/output
- Claude Opus 4.8: $5/$25 per MTok input/output
- GPT-4o-mini (OpenAI): approximately $0.15/$0.60 per MTok (reference only)
- GPT-4o (OpenAI): approximately $2.50/$10 per MTok (reference only)

This ADR resolves Decision Register item: **D-AI-001** (AI provider and model).

---

## Decision Drivers

- Must support IBM i-focused learning explanations (RPGLE, CLLE, SQL, DDS, 5250, job logs) in clear, structured, beginner-friendly language
- Must communicate trust boundaries appropriately — not claim production correctness, not encourage sensitive data sharing
- Must support streaming responses for a conversational AI Tutor UX
- Must be cost-sustainable for an MVP with unknown but likely low initial usage
- Must remain replaceable — no business logic tightly coupled to provider-specific formats
- Must support the safety requirements in PRD Sections 13.8, 14.8, and 15.4–15.7
- AI cost will be monitored and may inform future paid plan tier limits (PRD 15.13, 17.4)
- PRD does not select a specific provider — this is an Engineering decision (PRD 15.12, 18.5)

---

## Options Considered

### Option A: Anthropic — Claude Sonnet 4.6 (Primary), Haiku 4.5 (Fallback)

Use Claude Sonnet 4.6 as the default AI Tutor model, with a pathway to downgrade to Claude Haiku 4.5 if cost management requires it during beta.

**Provider: Anthropic**
- Clear safety defaults and appropriate refusal behavior aligned with the PRD's trust boundary requirements
- Strong performance on technical explanation tasks — structured, clear, and appropriately cautious
- TypeScript SDK with full streaming support and Next.js compatibility
- Adaptive thinking (Sonnet 4.6) produces better technical explanations without requiring manual budget management
- System prompt guidance for IBM i context, caution messaging, and beginner-friendly framing is well-respected

**Claude Sonnet 4.6 specifics:**
- $3 input / $15 output per million tokens
- 1M context window, 64K max output
- Strong quality for IBM i Q&A, structured explanations, and multi-turn learning support
- Sufficient for the MVP use case without overpaying for Opus-tier capability

**Claude Haiku 4.5 as a cost fallback:**
- $1 input / $5 output per million tokens (5× cheaper input than Sonnet, 3× cheaper output)
- 200K context window, 64K max output
- Designed for "simple tasks" — acceptable for straightforward IBM i concept Q&A
- Useful if beta cost analysis shows Sonnet pricing is unsustainable at observed usage levels

**Pros:**
- Sonnet 4.6 quality is well-suited to the IBM i learning and explanation use case
- Safety defaults and appropriate caution language reduce the risk of harmful or overconfident technical guidance
- Downgrade path to Haiku 4.5 is a one-line model ID change — no architecture change required
- Provider-neutral prompt design in the AI Tutor Spec ensures the model can be switched later
- Anthropic SDK integrates well with Next.js and supports streaming out of the box

**Cons:**
- Sonnet 4.6 at $3/$15 per MTok is not the cheapest option; cost should be monitored from day one
- Anthropic is one of several viable providers — switching costs are low if a better option emerges, but are not zero

**MVP fit:** Excellent for quality; reasonable for cost at MVP scale.

---

### Option B: OpenAI — GPT-4o-mini (Primary), GPT-4o (Optional)

Use OpenAI's GPT-4o-mini as the cost-optimized model for the AI Tutor.

**Pros:**
- GPT-4o-mini is extremely cheap (~$0.15/$0.60 per MTok) — approximately 20× cheaper than Claude Sonnet 4.6
- Large developer ecosystem; extensive documentation and community examples
- OpenAI SDK supports streaming and Next.js well

**Cons:**
- GPT-4o-mini is positioned as a simpler, cheaper model — quality on technical IBM i explanations may be lower than Claude Sonnet 4.6 on structured, technically accurate output
- Safety boundaries and appropriate refusal behavior may differ from what the PRD requires for a learning platform
- IBM i is a specialized domain; GPT-4o-mini's training data for this niche may be shallower
- If GPT-4o is used instead for quality, the cost ($2.50/$10) is comparable to Claude Sonnet 4.6 but without the same trust-boundary defaults
- Switching from OpenAI to Anthropic later requires minor SDK changes but is straightforward given a provider-neutral prompt design

**MVP fit:** Viable from a cost perspective, but quality and safety alignment for the specific IBM i learning use case are less certain than Anthropic's Claude models.

---

### Option C: Google Gemini — Gemini Flash or Pro

Use Google's Gemini models via the Generative Language API.

**Pros:**
- Gemini Flash is cost-competitive
- Good technical reasoning on general software topics

**Cons:**
- Less established developer ecosystem for Next.js integration compared to Anthropic and OpenAI SDKs
- IBM i domain coverage is less well-characterized
- Safety and trust-boundary defaults require independent evaluation before using on a learning platform
- The PRD notes an Anthropic or OpenAI approach in the project journal — Gemini is a third option with less prior evaluation

**MVP fit:** Adequate but less validated for this use case than Option A.

---

### Option D: Multiple Providers / Routing

Implement a multi-provider routing layer that calls different AI providers based on availability, cost, or quality.

**Pros:**
- Resilience against provider outages
- Cost optimization by routing simple queries to cheaper models

**Cons:**
- Significantly increases implementation complexity for MVP
- Requires abstraction logic that the MVP does not need
- PRD explicitly recommends starting simple and expanding later
- The AI Tutor Spec should include provider abstraction at the interface level, not at the routing level, for MVP

**MVP fit:** Out of scope for MVP. Can be introduced post-MVP if needed.

---

## Recommended Decision

**Use Anthropic as the AI provider, with Claude Sonnet 4.6 as the initial MVP model.**

Begin monitoring AI usage costs from the first beta user session. If observed costs during beta indicate that Sonnet 4.6 is unsustainable at the usage levels seen, evaluate Claude Haiku 4.5 as a downgrade with a brief quality assessment against representative IBM i questions.

**Provider abstraction requirement:** The AI Tutor implementation must use an abstraction layer (a service module or utility function) that isolates the Anthropic SDK call behind a clean interface. The rest of the codebase should not import the Anthropic SDK directly. This ensures future model or provider changes require changes only in one place.

---

## Rationale

Claude Sonnet 4.6 is the most appropriate starting model for the IBM i AI Tutor because:

1. **Quality for IBM i explanations**: IBM i is a specialized technical domain. The AI Tutor needs to produce clear, structured, technically careful explanations. Claude Sonnet 4.6 performs well on structured technical content and follows system prompt instructions accurately — important for enforcing IBM i-specific context, beginner-friendly framing, and production-use caution.

2. **Trust boundary alignment**: Anthropic's model safety defaults align well with the PRD's requirements that the AI Tutor must not claim production correctness, must discourage sharing of sensitive data, and must communicate uncertainty appropriately (PRD 15.7, NFR-AI-001–003). These behaviors are reinforced by system prompt guidance but are easier to achieve when the base model already trends toward appropriate caution.

3. **Cost sustainability at MVP scale**: At MVP with a small beta user base, Sonnet 4.6's pricing ($3/$15 per MTok) is manageable. A typical AI Tutor session involving several exchanges of 500–1000 tokens each would cost less than $0.05. Even at 1,000 sessions per month, total AI cost would be under $50/month — well within an early-stage budget.

4. **Downgrade path**: If cost monitoring reveals that Sonnet 4.6 is too expensive at observed usage, Claude Haiku 4.5 is available as a one-line model ID change. The provider abstraction layer makes this change safe and testable.

5. **Replaceability**: Provider-neutral prompt design in the AI Tutor Spec and the abstraction layer ensure that switching to a different model or provider later is a contained engineering change.

---

## Consequences

**Enables:**
- IBM i-focused AI Tutor Q&A with high-quality structured explanations
- Streaming responses for a conversational chat UX (supported by Anthropic's TypeScript SDK)
- System prompt-based IBM i context, caution messaging, and beginner-friendly behavior
- A clear cost monitoring and downgrade path (Sonnet → Haiku) if needed
- Future model or provider changes are isolated to a single service module

**Trade-offs:**
- Sonnet 4.6 at $3/$15 per MTok is more expensive than the cheapest options (Haiku 4.5, GPT-4o-mini); cost must be monitored and included in any future paid plan design (PRD 17.4, 17.9)
- No RAG or lesson-aware context injection at MVP (D-AI-003 decision); AI Tutor quality depends entirely on system prompt guidance and model capability
- AI conversation history is not persisted server-side (D-AI-004); users cannot continue a conversation across sessions in MVP

**Cost monitoring guidance:**
- Track AI usage by session via the Anthropic usage response fields (input_tokens, output_tokens)
- Log approximate token usage per session to identify unexpectedly long conversations or abuse patterns
- Evaluate monthly AI cost against the beta user base size before deciding whether to maintain Sonnet 4.6 or switch to Haiku 4.5 for cost

---

## PRD Alignment

- **PRD 15.12** (AI Provider Neutrality): Provider abstraction layer maintains replaceability; this ADR selects a starting point, not a permanent lock-in
- **PRD 15.13** (AI Cost): Sonnet 4.6 pricing is reasonable at MVP scale; monitoring and a downgrade path are built into the recommendation
- **PRD 14.8** (AI Trust): Claude Sonnet 4.6 safety defaults align with NFR-AI-001 through 003 (no guaranteed correctness claims, production-use caution, discouragement of sensitive data sharing)
- **PRD 13.8** (AI Tutor Requirements): FR-AI-001 through FR-AI-007 (IBM i Q&A, beginner explanations, safety messaging) are achievable with Sonnet 4.6 and appropriate system prompt guidance
- **PRD 18.5** (AI Constraints): Provider is replaceable; cost and rate limit considerations noted for future

---

## Decision Register Impact

Resolves **D-AI-001** (AI provider and model) in `planning/SPRINT_1_DECISION_REGISTER.md`.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft; recommended Claude Sonnet 4.6 with Haiku 4.5 fallback path |
