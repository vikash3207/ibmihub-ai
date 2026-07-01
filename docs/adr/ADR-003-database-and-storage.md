# ADR-003: Database and Storage

## Status

Accepted

## Context

IBMiHub AI needs a database and storage approach for the MVP. The MVP must store user accounts, learning progress (lesson completion state), lesson content metadata, and user feedback. The PRD requires minimal data retention, responsible handling of user data, and no storage of sensitive production code or job logs (PRD 14.7, 14.16, 18.7).

The MVP scope is small: a beta user base, a single IBM i Fundamentals learning path of 8–12 lessons, basic progress records, and feedback submissions. Storage needs are not complex, but decisions should not block future growth.

This ADR resolves Decision Register item: **D-TECH-003** (Database or storage approach).

---

## Decision Drivers

- Must store: user accounts, progress records (lesson started/completed state), lesson content metadata, feedback submissions
- Must NOT store: private production IBM i source code, sensitive job logs, credentials, customer data (PRD 18.7, 18.15)
- AI Tutor conversation history: session-level only, not server-side persisted beyond the session (D-AI-004)
- Must integrate cleanly with Next.js and the chosen hosting platform (ADR-001, ADR-002)
- Must support the authentication approach decided in ADR-004
- Simple enough to operate at MVP scale without dedicated DBA resources
- Must not lock content into a format that blocks future CMS-like capabilities
- PRD does not specify a database provider (PRD 18.3, architecture-neutral)

---

## Options Considered

### Option A: Supabase (PostgreSQL + Storage + Realtime)

Use Supabase as a managed PostgreSQL provider with optional file storage and built-in Auth support.

**Pros:**
- Managed PostgreSQL — well-understood relational model suitable for user accounts, progress, feedback
- Generous free tier (500 MB database, 1 GB file storage)
- Built-in Auth module can serve as the authentication provider (relevant to ADR-004)
- Supabase Storage for future file needs (lesson assets, future code uploads when approved)
- TypeScript SDK and Next.js integration are well-documented
- Row-level security (RLS) at the database level supports future multi-user privacy controls
- Dashboard for inspecting data during beta
- Referenced as a likely stack component in the PRD engineering review

**Cons:**
- One more vendor dependency alongside Vercel and the AI provider
- Auth and database bundled together — if the Auth module is replaced later, the database remains usable independently (reasonable separation)
- Supabase's free tier has connection limits; may need upgrading once real user volume begins

**MVP fit:** Excellent. Covers all MVP data needs with room to grow.

---

### Option B: PlanetScale or Neon (Serverless PostgreSQL)

Use a serverless-first PostgreSQL provider (PlanetScale is MySQL; Neon is PostgreSQL).

**Pros:**
- Serverless connection pooling is well-suited to Vercel's serverless model (no persistent connections)
- Neon (PostgreSQL) is a clean match for a standard SQL data model

**Cons:**
- Does not bundle auth or file storage — requires additional providers for those needs
- PlanetScale uses MySQL, which differs from PostgreSQL syntax
- Less integrated solution; more pieces to assemble
- Neon is newer and has a smaller ecosystem of tutorials and examples for Next.js

**MVP fit:** Good but less integrated than Option A.

---

### Option C: SQLite (Turso or similar edge SQLite)

Use SQLite via a managed edge SQLite provider (Turso) for serverless compatibility.

**Pros:**
- Very low cost at small scale
- Simple mental model — one file per database

**Cons:**
- Edge SQLite is a newer pattern with less ecosystem maturity
- No built-in auth or file storage
- Less suitable as the data model grows more relational
- Limited tooling compared to PostgreSQL options

**MVP fit:** Adequate for very small MVP, but lacks the ecosystem and integrations needed as the product grows.

---

### Option D: MongoDB Atlas (Document Database)

Use MongoDB Atlas as a managed document store.

**Pros:**
- Flexible schema good for evolving lesson content structures

**Cons:**
- Document model is a poor fit for the relational data (users, progress, lessons, feedback) that the MVP needs
- PostgreSQL is the better choice for structured relational data
- Additional learning curve if the team is not already familiar with MongoDB

**MVP fit:** Poor for the MVP's structured data requirements.

---

## Recommended Decision

**Use Supabase with PostgreSQL as the primary database (Option A).**

Supabase provides managed PostgreSQL, a built-in auth module (to be evaluated in ADR-004), file storage for future assets, and row-level security — all through a single vendor with a generous free tier and good Next.js integration.

**Content storage approach:** Lesson content for the MVP should be stored as markdown or structured JSON files in the repository (version-controlled), with content metadata (lesson ID, title, slug, path, order) stored in the database. This approach keeps lesson content in Git (traceable, reviewable per D-CONT-002 governance), while the database tracks what exists and which users have completed what. A full CMS is explicitly out of scope for MVP.

---

## Rationale

For an MVP with a small beta user base and a simple relational data model, Supabase provides all needed capabilities — PostgreSQL, auth, and file storage — with minimal operational overhead and a free tier that covers early beta usage. It aligns with the PRD engineering review's suggested stack and integrates well with Next.js and Vercel.

Storing lesson content in Git and content metadata in the database is a clean MVP approach: content is version-controlled and reviewable (supporting the content governance requirements in PRD Section 16.12), while the database handles only what needs to be dynamic (user accounts, progress, feedback).

---

## Consequences

**Enables:**
- Relational storage for user accounts, progress records, and feedback submissions
- Auth module evaluation (ADR-004) can start with Supabase Auth, which integrates natively
- Row-level security allows future per-user data isolation without application-layer logic changes
- File storage available for future lesson assets (images, diagrams) when needed
- Lesson content stays in Git — version-controlled, reviewable, and easy to update based on feedback

**Trade-offs:**
- Using Supabase for both database and auth creates a dependency on one vendor for two concerns; if auth needs to change later, database and auth can be separated independently
- Lesson content in Git (not a CMS) means content updates require a code deploy; this is acceptable for MVP but will need a content management solution if a content team grows
- Connection pooling (e.g. PgBouncer or Supabase's built-in pooler) should be configured before the product goes beyond a small beta, to handle Next.js serverless connection spikes

---

## PRD Alignment

- **PRD 14.16** (Data Handling): PostgreSQL with row-level security supports appropriate protection of user account and progress data
- **PRD 14.7** (Privacy): No production code, job logs, credentials, or customer data are stored; AI conversation history is session-only (D-AI-004)
- **PRD 18.7** (Data Privacy Constraints): The database will not be used to store any of the explicitly prohibited data types
- **PRD 16.12** (Content Governance): Storing lesson content in Git supports version control and review before publication

---

## Decision Register Impact

Resolves **D-TECH-003** (Database or storage approach) in `planning/SPRINT_1_DECISION_REGISTER.md`.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft |
