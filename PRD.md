# Product Requirements Document (PRD)

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Master Product Requirements Document — the single source of truth for all product decisions across the lifetime of the platform
- Version: 0.6
- Status: Draft — Sections 1–4 Complete
- Last Updated: 2026-07-01
- Owner: Product

---

## Document Purpose & How to Use This Document

This PRD is the authoritative product definition for IBMiHub AI. It exists one level above implementation: it defines **what** the product is, **why** it exists, **who** it serves, and **what success looks like** — not how it will be built.

This document is **not**:
- A technical specification
- An implementation or engineering design document
- An SDD feature specification (those live under `specs/` and derive from this PRD)

Most sections below are currently placeholders. Sections 1–4 contain approved draft content, while remaining sections will be completed and reviewed section by section. Each entry defines the section's purpose, audience, and expected size so the document can be written and reviewed section-by-section, then approved by the Product Owner before downstream specs, plans, or architecture work reference it.

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

### Vision Statement

To build the world's leading AI-powered platform for IBM i professionals.

IBMiHub AI exists to make IBM i learning, development, troubleshooting, documentation, and modernization more accessible, practical, and intelligent for the next generation of professionals.

The long-term vision is to become the default destination for anyone who wants to learn IBM i, improve as an RPG developer, understand legacy applications, modernize existing systems, or train teams working on IBM i platforms.

### Mission Statement

Our mission is to help IBM i professionals learn faster, practice better, troubleshoot smarter, and stay productive using AI-assisted learning and development tools.

IBMiHub AI will combine structured education, interactive practice, AI guidance, and productivity utilities into one focused platform built specifically for the IBM i ecosystem.

The platform should help users move from passive reading to active learning, from manual investigation to AI-assisted understanding, and from fragmented resources to a guided learning and productivity experience.

### Product Philosophy

IBMiHub AI is based on the belief that IBM i remains important, but the way people learn and work with IBM i needs to become more modern.

Many IBM i professionals still depend on scattered tutorials, internal team knowledge, legacy documentation, and manual debugging techniques. While these resources are valuable, they are often difficult for beginners to navigate and inefficient for experienced developers trying to solve real problems quickly.

IBMiHub AI will not simply collect IBM i articles. It will provide a guided, AI-first experience where users can learn concepts, ask questions, practice workflows, analyze code, understand job logs, and build confidence through hands-on exercises.

### What IBMiHub AI Is

IBMiHub AI is:

- An AI-first learning platform for IBM i professionals
- A practical training environment for beginners and teams
- A productivity assistant for RPGLE, CLLE, SQL, DDS, job logs, and documentation
- A future enterprise training and enablement platform
- A long-term product designed to support learning, practice, troubleshooting, modernization, and career growth

### What IBMiHub AI Is Not

IBMiHub AI is not:

- Just another static tutorial website
- A copy of existing IBM i content websites
- A generic AI coding assistant with no IBM i focus
- A replacement for real production IBM i expertise
- A tool that encourages users to blindly trust AI output without review

### Long-Term Ambition

The long-term ambition is to build a trusted platform that supports the IBM i community globally.

Over time, IBMiHub AI may expand into multiple product areas, including:

- IBMiHub Learn for structured education
- IBMiHub Labs for hands-on 5250 and RPG practice
- IBMiHub AI for developer productivity
- IBMiHub Enterprise for corporate training and onboarding
- IBMiHub Community for knowledge sharing
- IBMiHub Certifications for skill validation

The first product focus is learning and AI assistance, but the foundation should be designed so the platform can grow into a broader ecosystem for IBM i professionals.

### Strategic Direction

The product will grow in phases.

The early focus will be on building trust through high-quality original content, a simple learning experience, and a useful AI tutor.

Later phases will introduce more advanced capabilities such as interactive 5250 practice, RPG playgrounds, job log analysis, documentation generation, team learning, certifications, and enterprise features.

Every product decision should support the core vision: helping IBM i professionals become more capable, productive, and confident through AI-assisted learning and practical tools.

---

## 3. Problem Statement

### Core Problem

IBM i continues to support critical business applications across many industries, but the learning and productivity experience around IBM i has not modernized at the same pace as the broader software development ecosystem.

Developers, learners, consultants, and teams often depend on scattered tutorials, legacy documentation, internal knowledge transfer, forums, tribal knowledge, and manual debugging practices. While these resources are valuable, they are fragmented and often difficult to use as a complete learning or productivity system.

This creates a gap between the importance of IBM i systems and the quality of modern tooling available to help people learn, practice, troubleshoot, document, and modernize those systems.

IBMiHub AI exists to close that gap.

### Problem 1: Learning IBM i Is Difficult for New Developers

New developers entering the IBM i ecosystem often struggle to understand where to begin.

They may need to learn many concepts at once, including:

- IBM i operating system basics
- 5250 green screen navigation
- Libraries, objects, jobs, job queues, and output queues
- Physical files and logical files
- DDS
- RPGLE
- CLLE
- SQLRPGLE
- DB2 for i
- Job logs and spool files
- Batch processing
- Modern tooling such as VS Code, Git, APIs, and AI assistants

The challenge is not only the number of topics. The larger challenge is that these topics are often learned from disconnected resources with no guided path, no hands-on practice, and no immediate feedback.

As a result, beginners may feel overwhelmed, and companies may need to depend heavily on senior developers for onboarding and mentoring.

### Problem 2: Existing Learning Resources Are Mostly Static

Many IBM i learning resources are article-based, documentation-heavy, or reference-oriented.

Static content is useful, but it has limitations:

- It does not adapt to the learner's current level.
- It does not provide interactive practice.
- It does not explain concepts differently when the learner is confused.
- It does not easily connect theory to real development scenarios.
- It does not help users practice troubleshooting workflows.
- It does not provide a guided learning journey from beginner to job-ready capability.

A modern learner expects more than static reading. They expect guided learning, examples, exercises, feedback, progress tracking, and the ability to ask questions in natural language.

### Problem 3: Hands-On Practice Is Hard to Access

IBM i is best learned by doing, but hands-on access is not always easy.

A learner may understand a concept after reading about it, but still struggle when faced with a 5250 screen, a command line, a job log, or an RPGLE program.

Practical learning requires safe environments where users can experiment without fear of breaking production systems.

Today, many learners do not have easy access to:

- A safe IBM i practice environment
- Guided 5250 command exercises
- Realistic job log examples
- RPGLE and CLLE practice scenarios
- Debugging simulations
- Step-by-step business process examples

This limits confidence and slows skill development.

### Problem 4: Experienced Developers Still Lose Time on Manual Investigation

The problem is not limited to beginners.

Experienced IBM i professionals also spend significant time understanding legacy code, reviewing job logs, tracing program flows, documenting old applications, and explaining system behavior to other teams.

Common productivity challenges include:

- Understanding unfamiliar RPGLE or CLLE programs
- Reading long job logs
- Identifying the root cause of errors
- Explaining legacy business logic
- Creating documentation from existing code
- Reviewing program call flows
- Translating technical behavior into clear explanations
- Supporting modernization efforts

These tasks often require deep experience and manual effort. AI can reduce that effort, but generic AI tools are not always optimized for IBM i-specific workflows.

### Problem 5: Generic AI Tools Are Not Enough

General-purpose AI coding assistants are powerful, but they are not built specifically around IBM i learning and development.

They may help explain code, but they often lack:

- IBM i-specific learning paths
- 5250 practice workflows
- RPGLE and CLLE-focused context
- Job log analysis patterns
- DDS and DB2 for i examples
- Safe educational guardrails
- Structured curriculum
- Progress tracking
- Enterprise training features

Users need more than a chatbot. They need a focused platform that understands the IBM i ecosystem and combines AI assistance with structured learning, practice, and productivity workflows.

### Problem 6: IBM i Knowledge Is at Risk of Becoming Harder to Transfer

Many organizations rely on experienced IBM i professionals who have accumulated years of system and business knowledge.

As teams change, retire, or modernize, transferring that knowledge becomes difficult. Important understanding may live in source code, job logs, old documentation, and individual experience rather than in clear, accessible, reusable learning material.

Companies need better ways to:

- Train new developers
- Document existing applications
- Capture legacy knowledge
- Support modernization initiatives
- Reduce dependency on a few senior experts
- Help teams understand systems faster

IBMiHub AI can support this by combining education, AI explanation, documentation generation, and practical exercises.

### Problem 7: The IBM i Ecosystem Needs a Modern Learning and Productivity Experience

The broader software industry has moved toward interactive learning platforms, AI coding assistants, guided labs, online sandboxes, and developer productivity tools.

The IBM i ecosystem deserves the same kind of modern experience.

The opportunity is to create a platform that brings together:

- Structured IBM i learning
- AI-assisted explanations
- Hands-on practice
- 5250 simulations
- RPGLE and CLLE assistance
- Job log understanding
- Documentation support
- Team onboarding
- Enterprise training

This combination is currently fragmented across many tools and resources.

### Product Opportunity

IBMiHub AI has the opportunity to become a focused AI-powered platform for the IBM i community.

The product can help:

- Beginners learn with confidence
- Developers understand code faster
- Teams onboard new members more effectively
- Companies preserve and transfer IBM i knowledge
- Professionals practice real-world workflows safely
- The IBM i community modernize its learning and productivity experience

The core problem is not that IBM i lacks information.

The core problem is that IBM i knowledge, practice, troubleshooting, and productivity support are fragmented.

IBMiHub AI aims to transform that fragmented experience into a guided, AI-assisted, hands-on platform built specifically for IBM i professionals.

---

## 4. Goals & Objectives

### Purpose of This Section

The purpose of this section is to translate the product vision and problem statement into clear goals and measurable objectives.

IBMiHub AI is being built as a long-term AI-powered platform for IBM i professionals. However, the product must grow in focused stages. The early goal is not to build every possible feature immediately, but to validate that users find value in an AI-first IBM i learning and productivity experience.

### Primary Product Goal

The primary goal of IBMiHub AI is to become the most useful AI-powered learning and productivity platform for IBM i professionals.

This means the product should help users:

- Learn IBM i concepts faster
- Practice IBM i workflows more confidently
- Understand RPGLE, CLLE, SQL, DDS, and job logs more easily
- Reduce time spent searching across fragmented resources
- Improve productivity through AI-assisted explanations and tools
- Support companies in training and onboarding IBM i talent

### Goal 1: Build a Trusted IBM i Learning Foundation

The first major goal is to create a structured and trustworthy learning experience for IBM i professionals.

The product should help users move from scattered learning to guided learning.

Objectives:

- Define a clear beginner-to-practical IBM i learning path
- Create original IBM i-focused learning content
- Organize topics in a logical sequence
- Provide explanations that are simple, practical, and beginner-friendly
- Support learners who may have no prior IBM i exposure
- Build early trust through accuracy, clarity, and usefulness

### Goal 2: Introduce AI as a Practical Learning Assistant

The second goal is to make AI useful in a focused IBM i context.

The AI tutor should not behave like a generic chatbot. It should support IBM i learning and productivity use cases with appropriate context, boundaries, and guidance.

Objectives:

- Allow users to ask IBM i-related questions in natural language
- Provide explanations for RPGLE, CLLE, SQL, DDS, job logs, and IBM i concepts
- Help learners understand concepts from multiple angles
- Encourage review and validation of AI responses
- Avoid presenting AI output as unquestionable truth
- Establish early patterns for safe, useful, and trustworthy AI assistance

### Goal 3: Validate Real User Demand Before Expanding Scope

IBMiHub AI has a broad long-term vision, but the first product release must stay focused.

The early objective is to validate whether users are interested in a dedicated AI-powered IBM i platform before investing heavily in advanced modules.

Objectives:

- Launch a narrow MVP quickly
- Attract early users from the IBM i community
- Collect feedback from learners and working professionals
- Identify which use cases create the strongest value
- Avoid premature overengineering
- Prioritize learning and AI tutor experiences before advanced tools

### Goal 4: Create a Foundation for Future Hands-On Practice

Hands-on practice is central to the long-term vision, but it does not need to be fully delivered in the first release.

The platform should be designed so future interactive learning features can be added without redesigning the product.

Objectives:

- Plan for future 5250 practice labs
- Plan for future RPGLE and CLLE exercises
- Support future simulated job logs and debugging scenarios
- Keep learning content structured so it can later connect to labs
- Avoid architecture decisions that block future interactive modules

### Goal 5: Support Both Learning and Productivity

The product should not be limited to beginners.

While the MVP may begin with learning and AI assistance, the long-term platform should also support experienced IBM i professionals.

Objectives:

- Serve beginners learning IBM i fundamentals
- Serve experienced developers who need faster explanations
- Support team leads responsible for onboarding
- Support architects and consultants who analyze legacy systems
- Prepare the platform for future productivity tools such as code explanation, job log analysis, and documentation generation

### Goal 6: Build a Product That Can Become a Business

IBMiHub AI is being treated as a real SaaS product, not a casual side project.

The product should be designed with eventual monetization, trust, and scalability in mind.

Objectives:

- Build a professional product foundation
- Support future free, pro, and enterprise plans
- Create value that users may eventually pay for
- Maintain original content and clear product differentiation
- Build credibility in the IBM i community
- Avoid copying existing content or relying on low-quality generated material

### Goal 7: Establish a Disciplined Product Development Process

The project should follow a structured product and engineering process from the beginning.

This is important because the product has a long-term roadmap and will likely grow across learning, AI, labs, productivity tools, enterprise training, and community features.

Objectives:

- Use the PRD as the source of truth for product decisions
- Use SDD specifications for feature-level requirements
- Avoid coding without approved requirements
- Maintain project state, documentation, and decision records
- Use Git as the source of truth
- Keep product decisions, architecture decisions, and implementation work clearly separated

### Near-Term Objectives

For the first stage of the product, the near-term objectives are:

- Complete the PRD for the MVP direction
- Finalize the MVP scope
- Define the first learning path
- Define the AI tutor behavior and boundaries
- Prepare SDD specs for the first implementation features
- Build a simple, usable MVP
- Share early progress with the IBM i community
- Identify early beta users

### Long-Term Objectives

Over the longer term, IBMiHub AI should aim to:

- Become a trusted global learning resource for IBM i professionals
- Provide interactive 5250 and RPG practice experiences
- Offer AI-powered productivity tools for working developers
- Support corporate training and onboarding
- Enable certifications or skill validation
- Build a community around modern IBM i learning and productivity
- Help preserve and transfer IBM i knowledge to future generations

### Summary

The immediate objective is to create a focused, trusted, AI-assisted learning experience for IBM i professionals.

The long-term objective is to grow IBMiHub AI into a broader platform that supports learning, practice, troubleshooting, documentation, modernization, enterprise training, and community building.

The product should grow carefully, validating real user value at each stage before expanding into more advanced capabilities.

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
| 2026-07-01 | 0.4 | Added approved Vision & Mission content |
| 2026-07-01 | 0.5 | Added approved Problem Statement content |
| 2026-07-01 | 0.6 | Added approved Goals & Objectives content |
