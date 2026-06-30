# Product Requirements Document (PRD)

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Master Product Requirements Document — the single source of truth for all product decisions across the lifetime of the platform
- Version: 0.2
- Status: Draft — Section 1 Started
- Last Updated: 2026-06-30
- Owner: Product

---

## Document Purpose & How to Use This Document

This PRD is the authoritative product definition for IBMiHub AI. It exists one level above implementation: it defines **what** the product is, **why** it exists, **who** it serves, and **what success looks like** — not how it will be built.

This document is **not**:
- A technical specification
- An implementation or engineering design document
- An SDD feature specification (those live under `specs/` and derive from this PRD)

Every section below is currently a **placeholder**. No section contains approved content yet. Each entry defines the section's purpose, audience, and expected size so the document can be written and reviewed section-by-section, then approved by the Product Owner before downstream specs, plans, or architecture work reference it.

Estimated total document length once complete: **45–65 pages**.

---

## Table of Contents

0. [Document Control](#0-document-control)
1. [Executive Summary](#1-executive-summary)
2. [Vision & Mission](#2-vision--mission)
3. [Problem Statement](#3-problem-statement)
4. [Goals & Objectives](#4-goals--objectives)
5. [Success Metrics & KPIs](#5-success-metrics--kpis)
6. [Product Principles](#6-product-principles)
7. [Market Analysis](#7-market-analysis)
8. [Competitive Landscape](#8-competitive-landscape)
9. [User Personas](#9-user-personas)
10. [User Journeys](#10-user-journeys)
11. [Product Scope](#11-product-scope)
12. [MVP Definition](#12-mvp-definition)
13. [Functional Requirements](#13-functional-requirements)
14. [Non-Functional Requirements](#14-non-functional-requirements)
15. [AI Strategy](#15-ai-strategy)
16. [Learning & Content Strategy](#16-learning--content-strategy)
17. [Monetization Strategy](#17-monetization-strategy)
18. [Technical Constraints & Dependencies](#18-technical-constraints--dependencies)
19. [Risk Analysis](#19-risk-analysis)
20. [Assumptions & Open Questions](#20-assumptions--open-questions)
21. [Roadmap](#21-roadmap)
22. [Future Vision](#22-future-vision)
23. [Glossary & Terminology](#23-glossary--terminology)
24. [Appendix](#24-appendix)
25. [Revision History](#25-revision-history)

---

## 0. Document Control

- **Purpose:** Track ownership, approval status, and change history at a glance.
- **Description:** Version table, approval sign-off log, and links to related governing documents (PROJECT_CONTEXT.md, PROJECT_STATE.md, PROJECT_MASTER_INDEX.md, Engineering Review, Sprint 0 Documentation Roadmap).
- **Audience:** Product Owner, Engineering leadership, all contributors.
- **Approximate size:** <1 page.
- **Status:** Not started.

---

## 1. Executive Summary

IBMiHub AI is an AI-powered SaaS platform designed for IBM i professionals, learners, teams, and enterprises. The product aims to modernize how people learn, practice, troubleshoot, document, and improve productivity within the IBM i ecosystem.

The IBM i ecosystem continues to power important business systems across industries, but learning resources, developer tooling, and modernization support remain fragmented. Many professionals rely on static tutorials, legacy documentation, internal knowledge transfer, and manual debugging practices. This creates a significant opportunity for a modern, AI-first platform focused specifically on IBM i.

IBMiHub AI is not intended to be just another tutorial website. It is being designed as a complete learning and productivity platform where users can learn IBM i concepts, practice through interactive labs, ask AI-powered questions, analyze RPGLE and CLLE code, understand job logs, generate documentation, and prepare for real-world development scenarios.

The initial MVP will focus on a narrow but valuable experience: a structured learning foundation, an AI tutor, a user dashboard, and early progress tracking. More advanced capabilities such as a 5250 practice lab, RPG playground, job log analyzer, documentation generator, enterprise training, and certification features will be introduced in later phases.

The long-term vision is to build the leading AI platform for IBM i professionals globally. The platform should serve beginners learning IBM i, experienced RPG developers, team leads, architects, interview candidates, and companies training new employees.

IBMiHub AI will differentiate itself through four core ideas:

- AI-first learning and assistance
- Learn-by-doing practice experiences
- Original IBM i-focused content
- Practical productivity tools for real IBM i professionals

The project will be developed using a disciplined Spec-Driven Development approach. Product decisions will be captured in this PRD, detailed feature specifications will live under the specs folder, and implementation will follow approved plans and tasks. This ensures the product can grow into a production-grade SaaS platform rather than a loosely assembled side project.

Success will be measured not only by traffic or sign-ups, but by meaningful outcomes: active learners, paid subscribers, enterprise adoption, community trust, improved developer productivity, and the creation of a modern platform that helps keep IBM i knowledge relevant for the next generation.

---

## 2. Vision & Mission

- **Purpose:** Articulate the long-term reason the product exists and where it is headed.
- **Description:** Vision statement, mission statement, guiding principles, and the multi-year product philosophy (AI-first, learn-by-doing, original content).
- **Audience:** All stakeholders; primary reference for prioritization disputes.
- **Approximate size:** 1–2 pages.
- **Status:** Not started.

---

## 3. Problem Statement

- **Purpose:** Establish the unmet need in the market with evidence, not assertion.
- **Description:** Pain points of IBM i professionals today (skills gap, aging workforce, fragmented tooling, lack of modern AI assistance for legacy stacks), framed per target segment.
- **Audience:** Product, Engineering, Marketing, Investors.
- **Approximate size:** 1–2 pages.
- **Status:** Not started.

---

## 4. Goals & Objectives

- **Purpose:** Translate vision into measurable, time-bound product objectives.
- **Description:** Company-level and product-level goals, likely structured as OKRs, spanning near-term (Sprint 1–2) and annual horizons.
- **Audience:** Product, Engineering, Leadership.
- **Approximate size:** 1 page.
- **Status:** Not started.

---

## 5. Success Metrics & KPIs

- **Purpose:** Define how the team will know the product is winning.
- **Description:** North Star metric, activation/retention/engagement metrics, learning outcome metrics, revenue metrics, and enterprise adoption metrics.
- **Audience:** Product, Engineering, Leadership, Investors.
- **Approximate size:** 1–2 pages.
- **Status:** Not started.

---

## 6. Product Principles

- **Purpose:** The principles that guide every product decision.
- **Examples:**
  - AI First
  - Learn by Doing
  - Original Content
  - Productivity over Complexity
  - Enterprise Ready
  - Accessibility
  - Continuous Improvement
  - Customer Obsession
- **Audience:** All stakeholders; primary reference for prioritization and trade-off decisions.
- **Approximate size:** 1 page.
- **Status:** Not started.

---

## 7. Market Analysis

- **Purpose:** Size and characterize the market opportunity.
- **Description:** TAM/SAM/SOM estimate, IBM i ecosystem trends (workforce demographics, modernization pressure), buyer landscape (individual vs. enterprise).
- **Audience:** Product, Leadership, Investors.
- **Approximate size:** 3–5 pages.
- **Status:** Not started.

---

## 8. Competitive Landscape

- **Purpose:** Position IBMiHub AI against existing alternatives.
- **Description:** Direct competitors (IBM i training vendors, generic AI coding assistants), indirect substitutes (in-house mentorship, forums, IBM documentation), feature/positioning comparison matrix, and differentiation thesis.
- **Audience:** Product, Marketing, Leadership.
- **Approximate size:** 2–4 pages.
- **Status:** Not started.

---

## 9. User Personas

- **Purpose:** Ground every product decision in named, specific user needs.
- **Description:** Detailed personas (Beginner, RPG Developer, Team Lead, Architect, Enterprise Buyer, Interview Candidate) including goals, pain points, technical context, and success criteria per persona.
- **Audience:** Product, Design, Engineering, Marketing.
- **Approximate size:** 3–5 pages.
- **Status:** Not started.

---

## 10. User Journeys

- **Purpose:** Map how each persona discovers, adopts, and grows within the product.
- **Description:** End-to-end journey maps (awareness → onboarding → activation → habitual use → advocacy/upgrade) for primary personas, including key moments of friction or delight.
- **Audience:** Product, Design, Engineering.
- **Approximate size:** 2–4 pages.
- **Status:** Not started.

---

## 11. Product Scope

- **Purpose:** Define the full boundary of the product across all phases — not just MVP.
- **Description:** Complete module inventory (Learning Center, AI Tutor, 5250 Practice Lab, RPG Playground, AI Code Review, Job Log Analyzer, Documentation Generator, Quiz Engine, Community), explicitly marked in-scope vs. out-of-scope per phase.
- **Audience:** Product, Engineering.
- **Approximate size:** 2–3 pages.
- **Status:** Not started.

---

## 12. MVP Definition

- **Purpose:** Pin down the precise, approved first release.
- **Description:** MVP feature list, explicit exclusions, MVP success criteria, and the rationale for sequencing.
- **Audience:** Product, Engineering, Sprint 1 planning.
- **Approximate size:** 2–3 pages.
- **Status:** Not started.

---

## 13. Functional Requirements

- **Purpose:** Specify what the product must do, module by module, at the requirements level (not implementation level).
- **Description:** Per-module requirement statements with acceptance-level detail (Authentication, Dashboard, Learning Center, AI Tutor, 5250 Lab, RPG Playground, Code Review, Job Log Analyzer, Documentation Generator, Quiz Engine, Community), cross-referenced to downstream SDD specs in `specs/`.
- **Audience:** Product, Engineering, QA.
- **Approximate size:** 8–15 pages (largest section in the document).
- **Status:** Not started.

---

## 14. Non-Functional Requirements

- **Purpose:** Define the quality bar the product must meet regardless of feature.
- **Description:** Performance, scalability, availability, security, privacy, accessibility, localization, and maintainability expectations at the product level.
- **Audience:** Engineering, Product, Security/Compliance.
- **Approximate size:** 3–5 pages.
- **Status:** Not started.

---

## 15. AI Strategy

- **Purpose:** Define the product's approach to AI as a core differentiator, at the product (not technical) level.
- **Description:** AI use cases by module, AI specialist/agent roles (Tutor, RPG Expert, CL Expert, SQL Expert, Job Log Expert, Interview Coach, Documentation Writer), quality/trust expectations, human-in-the-loop boundaries, and AI provider strategy at a product-decision level.
- **Audience:** Product, Engineering, AI/ML stakeholders.
- **Approximate size:** 3–5 pages.
- **Status:** Not started.

---

## 16. Learning & Content Strategy

- **Purpose:** Define how educational value is created, structured, and kept current.
- **Description:** Curriculum structure, content sourcing and originality policy, skill progression model, certification/gamification approach, and content governance.
- **Audience:** Product, Content/Curriculum team, Engineering.
- **Approximate size:** 2–4 pages.
- **Status:** Not started.

---

## 17. Monetization Strategy

- **Purpose:** Define how the product generates revenue at each stage of growth.
- **Description:** Pricing tiers (Free / Pro / Enterprise), packaging, enterprise/corporate training offering, certification revenue, future marketplace model.
- **Audience:** Product, Leadership, Sales/Business.
- **Approximate size:** 2–4 pages.
- **Status:** Not started.

---

## 18. Technical Constraints & Dependencies

- **Purpose:** Capture product-relevant constraints that originate from technology, vendors, or platform realities — without prescribing architecture.
- **Description:** Known constraints (e.g., AI provider limitations, hosting model implications, IBM i connectivity realities), and dependencies on the Engineering Review's open technical decisions.
- **Audience:** Product, Engineering.
- **Approximate size:** 1–2 pages.
- **Status:** Not started.

---

## 19. Risk Analysis

- **Purpose:** Surface product-level risks early so they can be actively managed.
- **Description:** Scope risk, AI trust/accuracy risk, data privacy risk, competitive risk, monetization risk — each with likelihood, impact, and mitigation owner.
- **Audience:** Product, Engineering, Leadership.
- **Approximate size:** 2–3 pages.
- **Status:** Not started.

---

## 20. Assumptions & Open Questions

- **Purpose:** Make hidden assumptions explicit and track unresolved product questions to closure.
- **Description:** Running log of assumptions made in absence of data, and open questions requiring Product Owner decisions, each with an owner and target resolution date.
- **Audience:** Product, Engineering.
- **Approximate size:** 1–2 pages.
- **Status:** Not started.

---

## 21. Roadmap

- **Purpose:** Sequence the product's evolution across releases.
- **Description:** Phased roadmap from MVP through subsequent releases (post-MVP modules, enterprise readiness, platform expansion), time-horizon framed (Now / Next / Later) rather than fixed dates where uncertainty is high.
- **Audience:** Product, Engineering, Leadership, Investors.
- **Approximate size:** 2–3 pages.
- **Status:** Not started.

---

## 22. Future Vision

- **Purpose:** Describe the multi-year aspiration beyond the current roadmap horizon.
- **Description:** Platform expansion (mobile, desktop, VS Code extension, enterprise SaaS), ecosystem and marketplace ambitions, and how today's decisions preserve future optionality.
- **Audience:** Leadership, Investors, Product.
- **Approximate size:** 1–2 pages.
- **Status:** Not started.

---

## 23. Glossary & Terminology

- **Purpose:** Ensure shared, unambiguous language across product, engineering, and business stakeholders.
- **Description:** Definitions of domain terms (RPGLE, CLLE, DDS, 5250, job log, etc.) and product-specific terminology.
- **Audience:** All stakeholders, especially new contributors.
- **Approximate size:** 1 page.
- **Status:** Not started.

---

## 24. Appendix

- **Purpose:** House supporting material that would otherwise clutter the core narrative.
- **Description:** Research references, source data for market sizing, supplementary diagrams, links to related documents (Engineering Review, Sprint 0 Roadmap, journal).
- **Audience:** Product, Engineering (as needed).
- **Approximate size:** Variable.
- **Status:** Not started.

---

## 25. Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-06-30 | 0.1 | Initial structure created — table of contents and section placeholders only; no content drafted |
| 2026-06-30 | 0.2 | Renamed to PRD.md; inserted new section 6 "Product Principles" after Success Metrics & KPIs; renumbered sections 6–24 to 7–25 |
| 2026-06-30 | 0.3 | Added approved Executive Summary content |
