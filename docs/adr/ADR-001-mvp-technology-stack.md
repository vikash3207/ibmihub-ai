# ADR-001: MVP Technology Stack

## Status

Accepted

## Context

IBMiHub AI requires a technology stack for the MVP web application. The MVP must support a public landing page, user accounts, a learning center, an AI Tutor interface, basic progress tracking, and feedback collection — all as a web-based SaaS product (PRD Section 18.4).

The workspace already contains a Next.js 14 + TypeScript scaffold created during Sprint 0 (app/layout.tsx, app/page.tsx, app/globals.css, package.json). The PRD is intentionally stack-neutral at the product level but notes this scaffold exists without yet committing to it.

This ADR evaluates whether to adopt the existing scaffold or replace it, and what supporting technologies to add.

This ADR resolves Decision Register item: **D-TECH-001** (MVP technology stack).

---

## Decision Drivers

- Must deliver a web-based product accessible via browser (PRD 18.4)
- Must support structured learning content display, AI chat interface, user auth, and progress tracking
- Must remain maintainable and extensible for future modules (PRD 14.13)
- Must support fast iteration during MVP and beta
- Must avoid premature complexity (PRD Principle 4)
- Must support server-side rendering for public pages and client-side interactivity for AI Tutor
- No real IBM i connectivity, no billing, no enterprise features in MVP
- Engineering team should be able to implement all 9 required SDD specs (D-TECH-009) without the stack becoming a constraint

---

## Options Considered

### Option A: Adopt the Existing Next.js 14 + TypeScript Scaffold

Adopt the current scaffold (Next.js 14.2.5, React 18.3.1, TypeScript 5.6.3) and build from it. Add Tailwind CSS, an auth library, a database client, and an AI SDK on top.

**Pros:**
- Work already started; no restart cost
- Next.js aligns with PRD engineering review recommendations (full-stack web framework, supports SSR and client-side interactions)
- TypeScript provides type safety across the codebase
- App Router (used by the current scaffold) supports both static and server-rendered pages
- Strong ecosystem for adding Tailwind, auth, database, and AI SDK integrations
- Vercel deployment (probable choice for ADR-002) has first-class Next.js support
- File-system routing keeps the codebase organized as features grow

**Cons:**
- Scaffold is barebones — no auth, no database, no styling system yet installed
- Next.js version may need upgrading to 15 before Sprint 1 begins

**MVP fit:** Excellent. Covers landing page, learning content, AI Tutor chat, dashboard, and progress tracking without architectural overengineering.

---

### Option B: Replace with a Separate Frontend + Backend Split

Use a React SPA (e.g. Vite + React) for the frontend and a separate Node.js/Express or Fastify API server for the backend.

**Pros:**
- Clear separation of concerns between frontend and backend
- Backend can be scaled independently

**Cons:**
- More infrastructure to manage during MVP (two deployments, CORS config, separate environments)
- Increases operational complexity before any user value is proven
- Slower time-to-working-MVP
- Abandons the existing scaffold entirely

**MVP fit:** Poor. Adds complexity the MVP does not need. The separation can be introduced later if necessary.

---

### Option C: Full-Stack Framework Other Than Next.js (e.g. SvelteKit, Remix, Nuxt)

Adopt a different full-stack web framework from scratch.

**Pros:**
- Some alternatives (Remix, SvelteKit) have good DX and performance characteristics

**Cons:**
- Requires abandoning the existing scaffold and all setup work done so far
- Smaller ecosystem for AI integration tooling (most examples and SDKs target Next.js/React)
- No obvious advantage for the MVP use case that justifies the restart cost

**MVP fit:** Poor relative to Option A. No compelling reason to switch given existing work.

---

## Recommended Decision

**Adopt the existing Next.js 14 + TypeScript scaffold (Option A).**

Add the following to complete the MVP foundation:

- **Tailwind CSS** — utility-first styling, fast to build with, matches PRD engineering review recommendation
- **TypeScript strict mode** — enforce type safety across the codebase
- **shadcn/ui or similar component library** — consistent accessible components without a full design system overhead

The authentication library, database client, and AI SDK should be decided in ADR-004 and ADR-005 respectively, not here.

---

## Rationale

The existing scaffold is already aligned with what the PRD engineering review recommended (Next.js, TypeScript, Tailwind CSS, Node.js). It is minimal and uncommitted — there are no heavy dependencies, no database schemas, no auth logic to unwind. Adopting it avoids restart cost and keeps the team moving.

Next.js App Router is a strong fit for the MVP use case: server-side rendering for the landing page and lesson content (fast first load, SEO-friendly), client-side interactivity for the AI Tutor chat and dashboard, and file-system routing that will scale naturally as more modules are added.

---

## Consequences

**Enables:**
- Immediate Sprint 1 implementation start without environment setup from scratch
- Server-rendered public pages (landing, lesson display) for fast load and accessibility
- Client-side AI Tutor chat UX
- Clear file structure for adding auth, database, and AI integration
- Seamless deployment to Vercel (ADR-002)

**Trade-offs:**
- Next.js 14 App Router has a learning curve for developers unfamiliar with React Server Components; team should ensure familiarity before Sprint 1
- The scaffold currently has no styling system or component library installed — this must be added as the first engineering task in Sprint 1
- If the product ever needs a fully decoupled API (e.g. for a mobile app in a later phase), Next.js API routes can be extracted or supplemented with a separate service at that time

---

## PRD Alignment

- **PRD 18.4** (Web-Based SaaS): Next.js delivers a browser-accessible web product with no client installation required
- **PRD 14.13** (Maintainability): Next.js + TypeScript is a well-supported, widely understood stack; future contributors can onboard quickly
- **PRD 14.12** (Scalability): Next.js is designed to grow — from MVP to more advanced features — without requiring a full rewrite
- **PRD 18.3** (Architecture Neutrality): This decision does not lock the product into a specific database, auth provider, or AI provider — those remain separate decisions (ADR-002 through ADR-005)

---

## Decision Register Impact

Resolves **D-TECH-001** (MVP technology stack) in `planning/SPRINT_1_DECISION_REGISTER.md`.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft |
