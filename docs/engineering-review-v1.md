# IBMiHub AI Engineering Review

## Overview
This document captures the engineering review produced for the IBMiHub AI project vision, based on the attached `IBMiHub_AI_Project_Journal_v0.1.md`.

The review is focused on:
- architecture recommendations
- risks
- missing technical decisions
- folder structure
- technology stack
- repository organization
- SDD workflow

This document also summarizes the initial workspace scaffold created for the MVP.

---

## Product Vision Summary

IBMiHub AI is an AI-first platform for IBM i professionals, aimed at:
- learning IBM i
- practicing on a simulated 5250 terminal
- asking AI questions
- uploading RPGLE code for explanations
- analyzing job logs
- generating documentation
- preparing for interviews
- tracking learning progress

Core modules include:
- Learning Center
- AI Tutor
- 5250 Practice Lab
- RPG Playground
- AI Code Review
- Job Log Analyzer
- Documentation Generator
- Quiz Engine
- Community

MVP scope includes:
- User login
- Dashboard
- Learning Center
- AI Tutor
- 5250 Simulator
- Progress tracking

---

## Engineering Perspective

### Strengths
- Clear AI-first positioning
- Good modular separation of product domains
- Reasonable initial stack proposal
- Strong MVP alignment to product vision

### Observations
- The current document is largely product-focused and needs translation into technical architecture and implementation detail.
- The project covers many ambitious domains; for MVP success, the scope must remain narrow and focused.
- The simulator, AI assistant, and analytics features each have significant implementation complexity.

---

## Architecture Improvements

### Recommended core architecture
- Use a modular web app architecture with:
  - Frontend: Next.js
  - Backend/API: Node.js serverless functions or API service
  - Database: PostgreSQL
  - Auth: Supabase Auth or Auth.js
  - AI layer: provider-agnostic wrapper
- Separate concerns clearly across:
  - presentation/UI
  - AI orchestration
  - business/domain logic
  - persistence/data access

### AI architecture
- Build an AI abstraction layer with provider clients, prompt templates, and retry handling.
- Keep prompts and domain-specific logic separate from UI code.
- Apply guardrails for hallucination, validation, and safe output.

### Scalability
- Keep the frontend lightweight and modular.
- Use server-side rendering for public pages and client-side UX for chat and editor experiences.
- Design the system such that AI workloads can migrate to specialized compute if needed.
- Treat the 5250 simulator as a separate module to minimize coupling.

---

## Risks

### Scope risk
- The product is ambitious; including AI tutor, simulator, code review, job log analysis, and documentation generation together creates execution risk.
- The simulator is a major engineering effort by itself.

### AI risk
- Model hallucination and incorrect IBM i guidance.
- Risk of providing inaccurate or unsafe code recommendations.
- Need strong validation and human review paths.

### Data/privacy/security risk
- Uploaded RPGLE code and job logs may contain sensitive business data.
- Must define encryption, retention, and access controls early.

### Vendor lock-in risk
- Starting with Supabase, Vercel, and OpenAI is reasonable, but avoid architecting business logic around a single provider.
- Abstract AI provider and auth layers.

### Operational risk
- AI provider rate limits and cost management.
- Performance with large uploads and log processing.
- Need monitoring, observability, and error handling.

---

## Missing Technical Decisions

### AI provider strategy
- Which provider is primary: OpenAI, Claude, or both?
- What is the fallback behavior if the primary provider fails?
- How will prompt templates be versioned and managed?

### Hosting
- Should the project use Vercel serverless only, or a separate backend service?
- Will the 5250 simulator run in the same deployment or as a dedicated service?

### Database and storage
- Schema decisions for users, lessons, progress, chat history, uploads, and logs.
- File storage strategy for code uploads and log artifacts.
- Handling of large or binary data.

### Authentication / authorization
- Supabase Auth vs Auth.js vs custom JWT.
- Role model and permissions definitions.
- Access control around uploads and AI features.

### UI/UX technology
- Tailwind CSS is a good choice, but decide if a component system or design system is required.
- State management approach: React context, Zustand, Redux, or simpler local state.

### Testing
- Frameworks for unit, integration, and E2E tests.
- How to validate AI-driven features with automated tests.

### Repository format
- Monorepo vs single repo.
- When to split packages or modules.

---

## Suggested Folder Structure

A scalable layout could look like:

- `app/` or `apps/web/`
- `components/`
- `features/`
  - `features/ai-tutor/`
  - `features/rpg-playground/`
  - `features/learning-center/`
  - `features/job-log-analyzer/`
- `lib/`
- `services/`
- `hooks/`
- `types/`
- `packages/`
  - `packages/ui/`
  - `packages/ai/`
  - `packages/data/`
- `specs/`
- `plans/`
- `tasks/`
- `test-cases/`
- `docs/`

The structure should be feature-based rather than purely technical, so domain code stays grouped and easier to maintain.

---

## Recommended Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Next.js API routes for MVP
- PostgreSQL
- Supabase storage/auth

### AI
- OpenAI (primary)
- Optional Claude or additional providers
- Provider abstraction layer

### Auth
- Supabase Auth or Auth.js with JWT session support

### DevOps
- GitHub Actions
- Vercel hosting for frontend
- Supabase for database/storage

---

## Repository Organization

### Top-level files
- `README.md`
- `package.json`
- `tsconfig.json`
- `next.config.mjs`
- `.gitignore`

### Planning and documentation
- `specs/`
- `plans/`
- `tasks/`
- `test-cases/`
- `docs/`
- `docs/architecture.md`
- `docs/decision-records.md`

### Source code
- `app/`
- `components/`
- `features/`
- `lib/`
- `services/`
- `types/`

### Process
- `CONTRIBUTING.md`
- `ISSUE_TEMPLATE.md`
- `PULL_REQUEST_TEMPLATE.md`

---

## Suggested SDD Workflow

1. Product Vision
2. PRD / specs
3. Architecture and decision records
4. Implementation
5. Testing
6. Release

### Workflow details
- Create `specs/<feature>.md` for each feature.
- Create `plans/<feature>.md` with high-level implementation and dependencies.
- Create `tasks/<feature>.md` with actionable development items.
- Create `test-cases/<feature>.md` with acceptance criteria.
- Keep architecture decisions in `docs/decision-records.md`.
- Build MVP slices incrementally and validate before expanding.

---

## Initial Workspace Scaffold Summary

Created the following MVP foundation files:

- `README.md`
- `.gitignore`
- `package.json`
- `tsconfig.json`
- `next.config.mjs`
- `next-env.d.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `specs/000-product-vision.md`
- `specs/001-authentication.md`
- `specs/002-ai-tutor.md`
- `tasks/000-mvp-tasks.md`

---

## Next steps

- Review this engineering document.
- Finalize the missing technical decisions.
- Agree the initial MVP scope.
- Proceed with the first implementation sprint after approval.
