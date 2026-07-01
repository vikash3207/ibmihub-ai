# ADR-002: Hosting and Deployment

## Status

Accepted

## Context

IBMiHub AI needs a hosting and deployment approach for the MVP web application. The MVP is a Next.js web application (per ADR-001) serving a landing page, learning content, AI Tutor, dashboard, and feedback collection for a small beta user base.

The PRD requires the MVP to be web-accessible, maintainable, and operable with low overhead during early validation (PRD 18.4, 14.5). The MVP does not need enterprise-scale infrastructure, high availability SLAs, or complex deployment pipelines.

This ADR resolves Decision Register item: **D-TECH-002** (Hosting and deployment approach).

---

## Decision Drivers

- Must support Next.js App Router (ADR-001)
- Must enable fast iteration and frequent deploys during MVP
- Low operational overhead — no dedicated DevOps capacity available
- Must support a small beta user base without excessive infrastructure spend
- AI usage costs (ADR-005) are the primary operating cost; hosting should not add significant overhead on top
- Must be scalable enough to not require a migration when user volume grows modestly post-MVP
- Must support environment variable management for secrets (AI API keys, database credentials, auth secrets)
- PRD does not require enterprise uptime SLAs during MVP (PRD 14.5)

---

## Options Considered

### Option A: Vercel

Deploy the Next.js application to Vercel, the platform built by the Next.js team.

**Pros:**
- Zero-configuration deploys for Next.js — no build pipeline to write
- Automatic preview deployments on every pull request (valuable for testing lesson content and UI changes)
- Built-in CDN for static assets and edge caching for public pages
- Free tier covers MVP-scale beta usage comfortably
- Built-in environment variable management
- Serverless functions for Next.js API routes scale automatically
- CI/CD from GitHub push with no configuration required
- Analytics and performance monitoring included
- Excellent first-class support for App Router features (Server Components, Server Actions)

**Cons:**
- Vendor lock-in if the Next.js-specific deployment model is ever abandoned (mitigated by the fact that Next.js is the standard)
- Serverless function cold starts may add slight latency to API routes; not relevant at MVP scale
- Compute costs scale with usage — but AI provider costs (ADR-005) will dominate by far

**MVP fit:** Excellent. Purpose-built for the stack chosen in ADR-001.

---

### Option B: Railway or Render

Deploy to a general-purpose PaaS (Railway, Render) that supports Node.js and containers.

**Pros:**
- Provider-neutral — not tied to Vercel or Next.js
- Supports a wider range of architectures if the stack changes

**Cons:**
- Requires more manual configuration for a Next.js application
- No zero-config Next.js support — Vercel's SSR/ISR/edge features require Vercel or self-hosting
- Preview deployments require more setup
- Less ecosystem tooling around the chosen stack

**MVP fit:** Adequate but notably more friction than Option A for the chosen stack.

---

### Option C: AWS (Amplify, EC2, ECS)

Deploy on AWS infrastructure using Amplify, EC2 instances, or ECS containers.

**Pros:**
- High flexibility and control
- No vendor lock-in at the PaaS level
- AWS has proven enterprise-scale reliability

**Cons:**
- Significantly higher operational complexity for an MVP
- Requires DevOps time for configuration, monitoring, and maintenance
- Cost is less predictable at small scale
- Slower time-to-first-deploy
- PRD explicitly recommends avoiding overengineering the MVP (PRD 18.3, Principle 4)

**MVP fit:** Poor. Overengineered for an MVP serving a beta user base. This level of infrastructure is appropriate post-Series A, not pre-validation.

---

### Option D: Self-Managed VPS (DigitalOcean, Linode, Hetzner)

Run the application on a rented virtual machine with manual configuration.

**Pros:**
- Full control over the server
- Predictable fixed monthly cost

**Cons:**
- Highest operational overhead — requires server setup, security patching, monitoring, backup configuration
- No automatic scaling
- No zero-config deployment pipeline
- Not appropriate for a product team focused on building and validating, not operating servers

**MVP fit:** Poor. Inappropriate operational overhead for this stage.

---

## Recommended Decision

**Deploy to Vercel (Option A).**

Use the free Hobby or Pro tier for the initial beta, upgrading to a paid plan as real usage begins. Connect the GitHub repository to Vercel for automatic deploys on push to the main branch and preview deploys on pull requests.

---

## Rationale

Vercel is the natural hosting target for a Next.js application, particularly one using App Router features. It eliminates deployment configuration entirely, provides automatic preview environments for content and UI review, and its free tier is more than sufficient for an early beta user base. The primary operating costs will be the AI provider (ADR-005) and potentially the database (ADR-003), not the hosting layer.

The PRD's priority is validating product value quickly. Vercel enables the fastest path from code to user, which supports the MVP validation goal. If the product outgrows Vercel's model — which would indicate significant user growth and revenue — migrating to a more customized infrastructure at that point is a well-understood engineering exercise.

---

## Consequences

**Enables:**
- Immediate deployment of the Next.js MVP without infrastructure configuration
- Preview deployments for every PR — useful for Product Owner review of lesson content and UI changes
- Built-in CDN for fast public page delivery
- Automatic TLS certificates and domain management
- Serverless API routes for the AI Tutor, feedback collection, and auth callbacks
- Easy environment variable management for AI API keys, database credentials, and auth secrets

**Trade-offs:**
- Vercel's serverless model is a good fit for stateless request handling but not for long-running processes; this is fine for the MVP scope
- AI Tutor streaming responses require Next.js streaming support (available in App Router) — must be verified in the AI Tutor Spec
- Future needs such as background jobs, persistent worker processes, or real IBM i connectivity would require additional infrastructure decisions at that time

---

## PRD Alignment

- **PRD 14.5** (Availability): Vercel provides adequate availability for a beta product without requiring SLA commitments
- **PRD 14.3** (Performance): CDN-backed static pages and edge caching support fast page load targets
- **PRD 14.13** (Maintainability): Zero-config deploys minimize operational burden and let the team focus on product
- **PRD 18.12** (Scalability): Vercel scales automatically with traffic; no manual intervention needed as beta grows

---

## Decision Register Impact

Resolves **D-TECH-002** (Hosting and deployment approach) in `planning/SPRINT_1_DECISION_REGISTER.md`.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft |
