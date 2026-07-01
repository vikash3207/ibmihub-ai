# ADR-004: Authentication Approach

## Status

Accepted

## Context

IBMiHub AI needs a user authentication mechanism for the MVP. The product requires basic sign-up, login, session persistence, logout, and association of learning progress with a user account. Decision D-PROD-005 (approved) allows unauthenticated access to a first lesson preview but requires an account for progress tracking and AI Tutor usage.

The MVP must not build custom authentication from scratch. Custom auth introduces significant security risk, operational overhead, and development time that is better spent on the product's core learning and AI value (PRD 18.9). Enterprise features — SSO, SCIM, organization management, role-based permissions — are explicitly out of scope (PRD 18.17).

This ADR resolves Decision Register item: **D-TECH-004** (Authentication approach).

---

## Decision Drivers

- Must support email/password sign-up and login (PRD Spec 001)
- Must support session persistence and basic user profile
- Must associate learning progress with authenticated users
- Must allow partial public access (first lesson preview without login per D-PROD-005)
- Must NOT build custom auth — use a managed provider (PRD 18.9)
- Must be secure by default — no plain-text password storage, secure cookies, HTTPS only (PRD 14.6, NFR-SEC-001 through 005)
- Must integrate well with Next.js App Router and the database decision (ADR-003)
- Enterprise SSO, SAML, SCIM, and org management are explicitly out of scope for MVP (PRD 18.17)
- Should preserve future optionality for social login (Google, LinkedIn) without requiring a full re-implementation

---

## Options Considered

### Option A: Supabase Auth

Use Supabase's built-in authentication module, already bundled with the database decision (ADR-003).

**Pros:**
- Already part of the Supabase stack — no additional vendor
- Tightly integrated with Supabase PostgreSQL and row-level security; user records link directly to database rows
- Supports email/password, magic links, and social OAuth providers out of the box
- TypeScript SDK and Next.js integration are well-documented
- Session management is handled server-side with JWTs; secure by default
- Password hashing, email verification, and password reset are built in
- Adding social login (Google, GitHub, LinkedIn) later requires minimal code change

**Cons:**
- Auth is bundled with the database — if Supabase is replaced as a database, auth must be migrated too; however, the two are loosely coupled enough that migration is manageable
- Supabase Auth is opinionated about session handling; some edge-case customization may require workarounds

**MVP fit:** Excellent. Minimal setup, integrates with the existing database decision.

---

### Option B: Auth.js (NextAuth.js v5)

Use Auth.js, the de facto auth library for Next.js applications, with a database adapter connecting to the chosen database.

**Pros:**
- Framework-native — built specifically for Next.js App Router with first-class support
- Provider-agnostic — supports dozens of OAuth providers and credential strategies without being tied to Supabase
- Open-source with no managed service dependency
- Can use any database as the session store (integrates with the ADR-003 database via a Supabase adapter)
- Well-documented and widely used in the Next.js community

**Cons:**
- More configuration required than Supabase Auth; password hashing and email verification require additional setup or third-party libraries
- Requires a separate email provider for verification and password reset flows
- v5 (App Router native) is newer and has fewer community examples than v4
- A managed auth provider reduces this kind of integration surface

**MVP fit:** Good but requires more initial setup than Option A given the existing Supabase dependency.

---

### Option C: Clerk

Use Clerk, a managed authentication platform with a generous free tier and pre-built UI components.

**Pros:**
- Excellent developer experience — pre-built sign-in and sign-up UI components reduce frontend work
- Handles email verification, password reset, MFA, and session management automatically
- Native Next.js App Router support with middleware
- Free tier covers generous user counts (10,000 monthly active users)
- Social login, magic links, and passkey support included

**Cons:**
- Additional vendor dependency alongside Supabase and the AI provider
- User identity lives in Clerk, not in Supabase; linking Clerk users to Supabase records requires a sync webhook or foreign key strategy
- More expensive than Supabase Auth as volume grows
- Two sources of truth for user identity (Clerk + Supabase) adds conceptual overhead

**MVP fit:** Good DX, but the dual-identity source of truth adds unnecessary complexity given the Supabase decision.

---

### Option D: Custom JWT Auth

Build a custom authentication system using bcrypt for password hashing, JWTs for sessions, and email verification flows from scratch.

**Pros:**
- Full control over every aspect of auth behavior

**Cons:**
- Explicitly prohibited by the PRD: "do not build custom authentication" (PRD 18.9)
- High security risk — auth is a domain where subtle implementation errors cause serious vulnerabilities
- Significant development time that should be spent on product value
- Ongoing maintenance burden

**MVP fit:** Rejected. Not an acceptable option per PRD constraints.

---

## Recommended Decision

**Use Supabase Auth (Option A).**

Supabase Auth is already bundled with the database decision (ADR-003), supports email/password login, password reset, and email verification out of the box, and integrates natively with Supabase PostgreSQL row-level security. It requires minimal configuration to support the MVP authentication requirements.

The first lesson preview without login (per D-PROD-005) should be implemented as a publicly accessible route with no auth middleware applied — standard Next.js route-level protection handles this cleanly.

---

## Rationale

Given the decision to use Supabase for the database (ADR-003), Supabase Auth is the lowest-friction path to a secure, managed authentication solution. Users and their associated progress records live in the same PostgreSQL database, with row-level security policies ensuring data isolation without complex application-layer logic. Adding social login providers in a future sprint requires only adding OAuth credentials to the Supabase dashboard.

The tradeoff of being somewhat coupled to Supabase for both database and auth is acceptable at the MVP stage. If the product ever needs a more specialized auth provider (e.g. enterprise SSO for a team/enterprise plan), the auth layer can be replaced independently of the database.

---

## Consequences

**Enables:**
- Secure email/password authentication with bcrypt hashing, JWT sessions, and email verification managed by Supabase
- Row-level security in the database tied to authenticated user IDs, ensuring learning progress is user-scoped
- Future social login (Google, LinkedIn, GitHub) via Supabase OAuth providers with minimal additional configuration
- Simple public/protected route split for the first lesson preview (public) vs. dashboard and AI Tutor (protected)

**Trade-offs:**
- Email delivery for verification and password reset depends on Supabase's email service; the Product Owner should review the default email templates before beta launch
- The Supabase Auth JWT includes user metadata — the team should review what data is included and ensure it aligns with privacy commitments (PRD 14.7)
- A future decision to replace Supabase Auth (e.g. for enterprise SSO) would require migrating user records; this is manageable but is a known future migration cost

---

## PRD Alignment

- **PRD 14.6** (Security): Supabase Auth handles password hashing, secure cookie management, and HTTPS enforcement
- **PRD 18.9** (Authentication): Managed auth provider selected; no custom auth built
- **PRD 18.17** (Enterprise Features Out of Scope): Supabase Auth supports only individual user accounts at MVP; enterprise SSO and org management are not configured
- **D-PROD-005** (Account Requirement): Route-level protection in Next.js middleware can allow the first lesson preview publicly while requiring auth for dashboard and AI Tutor

---

## Decision Register Impact

Resolves **D-TECH-004** (Authentication approach) in `planning/SPRINT_1_DECISION_REGISTER.md`.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft |
