# Sprint 1 Implementation Decisions

## Document Metadata

| Field | Value |
|---|---|
| Title | Sprint 1 Implementation Decisions |
| Status | Review Ready |
| Version | 0.2 |
| Last Updated | 2026-07-01 |
| Owner | Product + Engineering |

### Source Documents

| Document | Version | Role |
|---|---|---|
| planning/SPRINT_1_IMPLEMENTATION_PLAN.md | v1.0 | Approved implementation plan |
| planning/SPRINT_1_TASK_BREAKDOWN.md | v1.0 | Approved task breakdown with open implementation questions |
| Specs 001–009 | v1.0 each | Approved SDD specifications |
| ADR-001 through ADR-005 | v0.1 each | Accepted Architecture Decision Records |

---

## 1. Decision Principles

The following principles govern all implementation decisions in this register.

| Principle | Constraint |
|---|---|
| Decisions must not change approved product scope | If a decision would require changes to an approved SDD spec or the PRD, it must be escalated to the Product Owner before proceeding |
| Decisions must support the approved SDD specs | Every implementation decision must satisfy the requirements of the relevant approved spec; no decision may contradict a spec requirement |
| Prefer simple, maintainable implementations | Among options that satisfy the spec requirements, prefer the simplest implementation that is easy to understand, change, and test |
| Prefer privacy-safe and server-side enforced behavior | Access control, data isolation, and content visibility rules must be enforced server-side; client-side filtering alone is not sufficient per the approved specs |
| Document tradeoffs clearly | Each decision must note what is gained and what is given up so future decisions can be made in context |
| Verify external provider details against official documentation | If a decision depends on provider model IDs, pricing, rate limits, or SDK behavior, verify against the provider's official documentation before coding — not against training data or cached examples |

---

## 2. Implementation Decision Register

---

### IMP-Q-001 — Markdown Rendering Library

| Field | Value |
|---|---|
| Question | Which Markdown rendering library should be used for lesson content? |
| Status | Decided |
| Owner | Engineering |
| Needed Before | S1-LESSON-002 |
| Impacted Tasks | S1-LESSON-002 |

**Context:**
Spec 003 Section 9 defines the supported Markdown elements for lesson content (headings, paragraphs, bullet lists, numbered lists, code blocks, inline code, links, bold, italic, tables). Spec 003 also specifies that plain monospace code block rendering is used in MVP — no syntax highlighting. The library must render all required elements correctly and must not require MDX, custom components, or client-side JavaScript to render basic Markdown.

**Options Considered:**

| Option | Description | Pros | Cons |
|---|---|---|---|
| `remark` + `rehype` | Standard Markdown-to-HTML pipeline; highly extensible | Well-maintained; used widely; granular control over rendering; supports Next.js App Router server-side rendering | Requires composing multiple packages; slightly more setup than opinionated libraries |
| `next-mdx-remote` | MDX rendering for Next.js | Good Next.js integration | Adds MDX support which is out of MVP scope; heavier than needed for plain Markdown |
| `marked` | Lightweight Markdown parser | Simple; fast; minimal dependencies | Less ecosystem support for server-side Next.js App Router integration; less flexible for customization |
| `react-markdown` | React Markdown component | Easy to use; good React integration | Renders client-side by default; requires extra work for server-side rendering in App Router |

**Recommendation:**
`remark` + `rehype` (specifically `remark-parse` → `remark-rehype` → `rehype-stringify` or a `@mdx-js/mdx`-free equivalent).

**Rationale:**
This pipeline is the de facto standard for Markdown rendering in Next.js App Router server components. It renders on the server, supports all required Markdown elements from Spec 003 Section 9, and does not pull in MDX or client-side rendering overhead. It can be extended later (e.g., to add code block styling) without requiring a library change.

**Tradeoffs:**
- Slightly more initial setup than `marked` or `react-markdown`
- No client-side interactivity required in lesson content in MVP, so server rendering is both sufficient and preferred

**Approved Decision:** Use `remark` + `rehype` with `remark-gfm` for MVP Markdown rendering. This supports the approved Markdown elements (headings, lists, links, code blocks, inline code, bold, italic, tables) defined in Spec 003 Section 9. It avoids MDX and does not require client-side rendering for basic lesson content.

---

### IMP-Q-002 — Lesson Rendering Strategy (SSG vs. SSR vs. Hybrid)

| Field | Value |
|---|---|
| Question | Should lesson pages use static site generation (SSG), server-side rendering (SSR), or a hybrid approach? |
| Status | Decided |
| Owner | Engineering |
| Needed Before | S1-LESSON-003 |
| Impacted Tasks | S1-LESSON-003 |

**Context:**
Spec 003 requires that Lesson 1 is publicly accessible (no auth required) and that all other published lessons require authentication. The rendering approach must handle this split correctly — Lesson 1 can be fully statically generated, while protected lessons require server-side auth validation before serving content. The decision also affects page load performance and the complexity of the auth-gating implementation.

**Options Considered:**

| Option | Description | Pros | Cons |
|---|---|---|---|
| Full SSG | All lesson pages pre-generated at build time; auth gated client-side | Fast loads from CDN | Client-side auth gating is insufficient per spec; complex to rebuild on content updates |
| Full SSR | All lesson pages server-rendered on each request | Straightforward auth gating server-side; always fresh content | More origin server load; slightly slower than SSG for public content |
| Hybrid (SSG for Lesson 1, SSR for protected lessons) | Lesson 1 statically generated; Lessons 2+ server-rendered with auth check | Lesson 1 benefits from CDN performance; protected lessons have server-side auth enforcement | Two rendering paths to maintain; more complex implementation |
| Next.js dynamic with server component auth | Server components handle auth; Next.js caches as appropriate | Simplest in Next.js App Router; leverages built-in caching | Requires understanding of Next.js App Router caching behavior |

**Recommendation:**
Use Next.js App Router server components for all lesson pages, relying on server-side auth checking within the component. Allow Next.js default caching behavior to handle performance. Lesson 1 can be served publicly (no auth check needed); protected lessons check the session server-side and return a login prompt if unauthenticated.

**Rationale:**
The Next.js App Router's server component model handles this pattern cleanly without requiring two separate rendering strategies. Auth gating is enforced server-side on every request (satisfying spec requirements). The implementation is simpler than maintaining separate SSG/SSR paths, and performance is acceptable for an MVP beta with a small user base.

**Tradeoffs:**
- Server renders on every request for lesson pages; acceptable for MVP beta scale
- Lesson 1 does not benefit from CDN-level caching unless additional caching configuration is applied; this can be optimized post-MVP

**Approved Decision:** Use Next.js App Router server components for lesson pages with server-side auth checks on every request. Lesson 1 is public and requires no authentication check. Published lessons beyond Lesson 1 require a server-side authentication check before content is served. Auth-gated lesson content must not rely on client-side-only protection. Auth-gated lesson responses must not be cached in a way that could expose protected content to unauthenticated users. Lesson 1 may be optimized for caching if safe, but this is not required for MVP.

---

### IMP-Q-003 — Lesson Metadata Structure and Seeding

| Field | Value |
|---|---|
| Question | What exact lesson metadata record shape and seeding/sync approach should be used in Supabase PostgreSQL? |
| Status | Decided |
| Owner | Engineering |
| Needed Before | S1-CONTENT-001, S1-CONTENT-002 |
| Impacted Tasks | S1-CONTENT-001, S1-CONTENT-002 |

**Context:**
Spec 009 and Spec 002 establish that lesson body content lives in repository Markdown files and lesson metadata lives in Supabase PostgreSQL. The metadata must include the fields defined in Spec 009 Section 11 (lesson ID, slug, title, description, lesson order, learning path ID, status, content source path, estimated reading time, AI Tutor starter question, created date, updated date). The approved status values are: Draft, Review Ready, Approved, Published, Unpublished/Archived.

The implementation question is: how is the metadata stored (table structure at a conceptual level) and how is it seeded and kept in sync with the repository content files?

**Options Considered:**

| Option | Description | Pros | Cons |
|---|---|---|---|
| Manual database seeding via SQL inserts | Metadata is inserted manually into the database | Simple for MVP; no tooling required | Manual and error-prone; must be repeated for each new lesson or status change |
| Seed script in the repository | A TypeScript or Node script reads a metadata config file and upserts lesson records | Repeatable; version-controlled; can be run as needed | Requires writing and maintaining a seed script |
| Metadata config file only (database-free) | Lesson metadata stored in a TypeScript or JSON config file loaded at runtime | No database required for metadata | Loses server-side status filtering benefits; makes progress denominator calculation harder |

**Recommendation:**
Use a version-controlled metadata configuration file (e.g., `content/lessons/metadata.ts` or `metadata.json`) as the source of truth, plus a seed/sync script that upserts records from the config file into the Supabase lessons table when run. The database is the runtime source for all lesson queries; the config file is the authoritative editable source.

**Rationale:**
This approach is repeatable, auditable through Git history, and avoids manual SQL operations. The status field in the database is updated by the seeding script or a deliberate manual update (reflecting the content governance workflow where the Product Owner / Founder changes status). Full conversation content is never involved.

**Tradeoffs:**
- Requires a lightweight seed/sync script to maintain
- Status changes (e.g., Draft → Published) need to be reflected in both the config file and triggered via the script or a direct database update

**Approved Decision:** Use a version-controlled lesson metadata configuration file in the repository plus a seed/sync script that upserts lesson metadata into Supabase PostgreSQL. Lesson body content lives in repository Markdown files. Lesson metadata lives in Supabase PostgreSQL at runtime. The repository metadata config is the editable source for lesson metadata and publication status. Supabase is the runtime query source for Learning Center, Lesson Experience, Progress Tracking, and Dashboard. Status changes such as Draft → Review Ready → Approved → Published should be made through the repository metadata config and synced to Supabase. Ad-hoc direct database edits should be avoided except for emergency correction with Product Owner approval.

---

### IMP-Q-004 / IMP-Q-008 — Waitlist CTA Mechanism and Storage

| Field | Value |
|---|---|
| Question | What is the exact mechanism and storage approach for the "Join the Waitlist" CTA on the landing page? |
| Status | Decided |
| Owner | Product / Founder + Engineering |
| Needed Before | S1-LAND-003 |
| Impacted Tasks | S1-LAND-003 |

**Context:**
Spec 008 approves "Join the Waitlist" as the primary CTA for the first launch phase. The landing page must implement a mechanism to collect waitlist interest. The implementation mechanism (third-party form, custom form, email, Supabase table) must be decided before S1-LAND-003 can begin.

**Options Considered:**

| Option | Description | Pros | Cons |
|---|---|---|---|
| Third-party form tool (e.g., Google Forms, Typeform, Tally) | External form service handles collection and storage | Zero engineering effort; available immediately | External data dependency; less control over data |
| Custom form → Supabase table | Simple email-capture form submitting to a Supabase table | Data stays in the product database; controlled | Requires minimal engineering (a form + one DB table) |
| Email only | CTA opens a mailto link | Zero engineering effort | Poor user experience; no structured data collected |

**Recommendation:**
Custom form → Supabase table. A lightweight email-capture form that submits to a Supabase `waitlist` table (email, submitted_at, optional source field). This keeps waitlist data in the product database and requires minimal engineering effort.

**Rationale:**
A custom form aligned with the product's existing Supabase setup keeps the data under the product team's control and avoids adding an external dependency for a simple MVP use case. The implementation is a small incremental addition to the existing Supabase project.

**Tradeoffs:**
- Requires a small amount of engineering; not literally zero effort
- Form must be accessible without authentication (landing page is public)

**Approved Decision:** Use a custom public waitlist form that stores submissions in Supabase. The landing page CTA remains "Join the Waitlist". The form collects email only for MVP, plus optional source/referrer metadata if available. No account is required to join the waitlist. Duplicate email submissions must not create duplicate active records. Waitlist records must not be publicly readable. Public insert must be allowed only through the intended server-side action or protected route handler. No third-party form service is used for MVP.

---

### IMP-Q-005 — Supabase RLS and Server-Side User Filtering

| Field | Value |
|---|---|
| Question | How should Supabase Row-Level Security (RLS) policies and server-side user filtering be designed for progress and feedback records? |
| Status | Decided |
| Owner | Engineering |
| Needed Before | S1-PROG-003, S1-FB-007 |
| Impacted Tasks | S1-PROG-003, S1-FB-007 |

**Context:**
Spec 006 (Progress Tracking) and Spec 007 (Feedback Collection) both require that user records are strictly isolated — a user cannot read or write another user's data. The specs require enforcement at the database level (not only at the application layer). Supabase supports Row-Level Security (RLS) policies directly on tables, which enforce user isolation at the PostgreSQL level using the authenticated JWT.

**Recommendation:**
Enable Supabase RLS on the progress records table and the feedback records table. Define policies that allow a user to read and write only rows where `user_id = auth.uid()`. Additionally, enforce user ID filtering at the application query level as a secondary layer.

**Rationale:**
RLS provides a robust, server-enforced data isolation layer that cannot be bypassed by application-level mistakes or client-side manipulation. Using both RLS and application-layer filtering provides defense in depth. This approach is well-supported by Supabase and is the recommended pattern for user-scoped data.

**Tradeoffs:**
- RLS requires Supabase configuration and testing to confirm policies are correct
- RLS operates on the JWT from Supabase Auth; the service role key bypasses RLS (the service role key must never be used in client-facing code)
- Some additional testing is needed to confirm RLS policies work as expected with the Next.js App Router Supabase client

**Approved Decision:** Use Supabase Row-Level Security plus server-side user ID filtering for progress and feedback records. Progress records must be scoped to the authenticated user. Feedback records must be scoped to the authenticated user. A user must not be able to read or write another user's progress or feedback. RLS policies must enforce `user_id = auth.uid()`. Server-side queries must also filter by authenticated user ID for defense in depth. The Supabase service role key must never be exposed to client-side code.

---

### IMP-Q-006 — Token Usage Logging

| Field | Value |
|---|---|
| Question | What is the token usage logging mechanism for AI Tutor requests? |
| Status | Decided |
| Owner | Engineering |
| Needed Before | S1-AI-009 |
| Impacted Tasks | S1-AI-009 |

**Context:**
Spec 001 AI-TUTOR-FR-014 requires that input and output token counts are logged per AI request. Full conversation content must not be logged. The logging mechanism must make it possible for the Product Owner to calculate approximate monthly AI cost from the logged data.

**Options Considered:**

| Option | Description | Pros | Cons |
|---|---|---|---|
| Supabase table (`ai_usage_log`) | Log token counts (user ID, timestamp, input_tokens, output_tokens) to a Supabase table | Data in the product database; queryable by the Product Owner | Small additional table; must ensure no prompt/response text is included |
| Server-side log file or Next.js logging | Write token counts to application logs (Vercel log output) | Zero database overhead | Logs may rotate; harder to query for cost calculation |
| Lightweight analytics store | External service (e.g., Axiom, Vercel Analytics) | Purpose-built for metrics | External dependency; additional cost |

**Recommendation:**
Supabase table (`ai_usage_log`) with columns: `id`, `user_id`, `timestamp`, `input_tokens`, `output_tokens`. No prompt text, response text, or conversation content is stored.

**Rationale:**
A Supabase table is already the product's primary data store; adding a usage log table keeps all operational data in one place. The Product Owner can run a simple query to estimate AI cost for any time period. The table definition and query are straightforward and do not require a separate service.

**Tradeoffs:**
- Adds one table to the Supabase database
- Requires care to ensure no conversation content is accidentally included in log records

**Approved Decision:** Use a Supabase `ai_usage_log` table for AI Tutor token usage logging. Store user ID, timestamp, provider, model ID, input token count, output token count, and request status. Do not store user prompt text. Do not store AI response text. Do not store full conversation history. The log exists only for usage monitoring and cost estimation.

---

### IMP-Q-007 — Anthropic Model Verification

| Field | Value |
|---|---|
| Question | What are the exact current Anthropic model IDs, pricing, rate limits, and fallback model settings to use? |
| Status | Verification Required |
| Owner | Engineering |
| Needed Before | S1-AI-001 |
| Impacted Tasks | S1-AI-001 |

**Context:**
ADR-005 approves Anthropic as the AI provider, Claude Sonnet 4.6 as the initial model, and Claude Haiku 4.5 as a cost fallback. ADR-005 explicitly requires that model names, model IDs, pricing, and rate limits be verified against official Anthropic provider documentation before implementation begins and again before MVP beta release.

Training data or cached AI knowledge about model IDs and pricing must not be used as the source of truth — they may be stale.

**Required Verification Checklist:**

| Item | Verified? | Source |
|---|---|---|
| Exact model ID string for Claude Sonnet 4.6 | ☐ | Official Anthropic documentation |
| Exact model ID string for Claude Haiku 4.5 (fallback) | ☐ | Official Anthropic documentation |
| Current input token pricing for Sonnet 4.6 ($/1M tokens) | ☐ | Official Anthropic pricing page |
| Current output token pricing for Sonnet 4.6 ($/1M tokens) | ☐ | Official Anthropic pricing page |
| Current input token pricing for Haiku 4.5 (fallback) | ☐ | Official Anthropic pricing page |
| Current output token pricing for Haiku 4.5 (fallback) | ☐ | Official Anthropic pricing page |
| Rate limits for MVP tier / usage level | ☐ | Official Anthropic documentation or account settings |
| Anthropic SDK version and installation command | ☐ | Official Anthropic SDK documentation |
| Streaming API support in current SDK | ☐ | Official Anthropic SDK documentation |
| Safety and refusal behavior on IBM i topics | ☐ | Empirical testing before AI Tutor goes live |

**Rationale:**
Model IDs, pricing, and API behavior change. Using incorrect model IDs will result in API errors. Using incorrect pricing information will produce inaccurate cost estimates. ADR-005 explicitly requires verification before implementation for this reason.

**Action Required:**
Engineering must complete this verification checklist before S1-AI-001 begins. Verified values should be recorded in the Engineering team's implementation notes and reflected in the AI provider abstraction layer configuration.

**Approved Decision:** Not yet decided. This decision must not be marked Decided until Engineering has verified the exact current Anthropic model IDs, pricing, rate limits, fallback model, Anthropic SDK version, and streaming API support from official Anthropic documentation. The AI Tutor implementation must not begin using assumed or cached model IDs or pricing from any source other than official provider documentation.

---

## 3. Decisions Needed Before First Coding Batch

Foundation and authentication tasks may begin while implementation decisions are being finalized. However, the dependent tasks listed below must not begin until their decisions are resolved.

| Question | Decision | Dependent Tasks | Status |
|---|---|---|---|
| IMP-Q-003 | Lesson metadata structure and seeding approach | S1-CONTENT-001, S1-CONTENT-002 | Decided |
| IMP-Q-004 / IMP-Q-008 | Waitlist CTA mechanism and storage | S1-LAND-003 | Decided |
| IMP-Q-005 | Supabase RLS and server-side user filtering design | S1-PROG-003, S1-FB-007 | Decided |

These decisions are now resolved. The dependent tasks may proceed.

---

## 4. Decisions Needed Before Lesson Experience

The following decisions must be resolved before Lesson Experience implementation begins (Stage 6 in the dependency order).

| Question | Decision | Status |
|---|---|---|
| IMP-Q-001 | Markdown rendering library | Decided |
| IMP-Q-002 | Lesson rendering strategy (SSG / SSR / hybrid) | Decided |

These decisions are now resolved. S1-LESSON-002 and S1-LESSON-003 may proceed.

---

## 5. Decisions Needed Before AI Tutor

The following decisions must be resolved before AI Tutor implementation begins (Stage 9 in the dependency order).

| Question | Decision | Status |
|---|---|---|
| IMP-Q-006 | Token usage logging mechanism | Decided |
| IMP-Q-007 | Anthropic model ID, pricing, rate limits — verified against official documentation | Verification Required |

IMP-Q-007 must be completed by Engineering as a verification task before any AI provider code is written. The AI Tutor implementation must not begin using assumed or cached model IDs or pricing from any source other than official provider documentation.

---

## 6. First Approved Coding Batch

After this decision document is approved, the first safe coding batch can begin. The following tasks do not depend on unresolved implementation decisions and may proceed immediately.

### May Begin Immediately

- **Foundation (S1-FND-001 through S1-FND-006):** Project setup, Supabase project, Vercel deployment, environment variables, component library, directory structure.
- **Authentication and Onboarding (S1-AUTH-001 through S1-AUTH-009):** Sign-up, login, logout, session persistence, forgot password, onboarding question, post-login redirect, user profile.
- **Content Governance (S1-GOV-001):** Create lesson review checklist template at `docs/content/lesson-review-checklist.md`.

### May Begin After IMP-Q-003 Is Confirmed

- **Content Metadata and Markdown Loading (S1-CONTENT-001 through S1-CONTENT-006):** Lesson metadata structure, seeding, Markdown loading, published-only filter, draft protection, content directory structure.

### May Begin Before Waitlist Storage Is Complete

- **Public Landing Experience (S1-LAND-001 and S1-LAND-002):** Landing page shell and hero section with approved copy may be built before the waitlist mechanism is finalized.

### May Begin Only After IMP-Q-004/008 Is Confirmed

- **Waitlist CTA Implementation (S1-LAND-003):** The waitlist form and storage mechanism require the decision to be confirmed before implementation.

---

## 7. Notes

Once the implementation decisions in this register are reviewed and approved by Product + Engineering, task ticket creation and coding can begin for the resolved decision areas.

**Process:**
1. Engineering reviews each decision entry and confirms the recommendation or proposes an alternative
2. Product Owner reviews any decisions with product implications (especially IMP-Q-004/008)
3. Each decision is marked as Decided with the confirmed approach noted in the "Approved Decision" field
4. Once a batch of decisions is resolved (e.g., First Coding Batch), the relevant tasks from the Sprint 1 Task Breakdown can be converted to implementation tickets
5. This document should be updated as decisions are made; unresolved questions must not be silently skipped

**IMP-Q-007 note:** The model verification checklist must be completed with real values from official Anthropic documentation before any AI provider code is written. The AI Tutor implementation must not proceed using assumed or cached model ID values.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial implementation decision register created from Sprint 1 Implementation Plan v1.0 and Task Breakdown v1.0 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved implementation decisions except Anthropic provider verification |
