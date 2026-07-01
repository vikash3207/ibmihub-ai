# Product Requirements Document (PRD)

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Master Product Requirements Document — the single source of truth for all product decisions across the lifetime of the platform
- Version: 2.7
- Status: Draft — All Sections Complete / Ready for Product Owner Review
- Last Updated: 2026-07-01
- Owner: Product

---

## Document Purpose & How to Use This Document

This PRD is the authoritative product definition for IBMiHub AI. It exists one level above implementation: it defines **what** the product is, **why** it exists, **who** it serves, and **what success looks like** — not how it will be built.

This document is **not**:
- A technical specification
- An implementation or engineering design document
- An SDD feature specification (those live under `specs/` and derive from this PRD)

All sections below now contain approved draft content. This PRD should be reviewed as a complete document before downstream SDD specifications, implementation plans, architecture documents, or development work reference it. Each entry defines the section's purpose, audience, and expected size so the document can be written and reviewed section-by-section, then approved by the Product Owner before downstream specs, plans, or architecture work reference it.

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

### Purpose of This Section

The purpose of this section is to track PRD ownership, status, approval state, related documents, and governance expectations.

This section helps contributors understand whether the PRD is still being drafted, ready for review, approved, or superseded by a later version.

---

### Document Ownership

| Field | Value |
|---|---|
| Document Name | Product Requirements Document |
| Product | IBMiHub AI |
| Owner | Product |
| Primary Decision Owner | Product Owner |
| Current Version | 2.7 |
| Current Status | Draft — All Sections Complete / Ready for Product Owner Review |
| Last Updated | 2026-07-01 |

---

### Document Status Meaning

| Status | Meaning |
|---|---|
| Draft | Content is being written or reviewed |
| Ready for Product Owner Review | All planned sections are complete and ready for full review |
| Approved | Product Owner has approved the PRD as a source of truth for downstream planning |
| Superseded | A newer PRD version has replaced this version |

Current status:

**Draft — All Sections Complete / Ready for Product Owner Review**

This means the PRD content is complete for the current planning cycle, but it should still receive a full Product Owner review before being treated as formally approved for Sprint 1 planning.

---

### Related Governing Documents

| Document | Relationship to PRD |
|---|---|
| PROJECT_CONTEXT.md | Provides long-term project background, principles, and context |
| PROJECT_STATE.md | Tracks current project state, progress, blockers, and next actions |
| PROJECT_MASTER_INDEX.md | Provides navigation across major project documents |
| AI_RULES.md | Defines how AI assistants should work on this project |
| PROMPT_LIBRARY.md | Stores reusable prompts for product, engineering, SDD, and review workflows |
| Engineering Review | Provides engineering recommendations and technical risk observations |
| Sprint 0 Documentation Roadmap | Defines documentation expected before implementation |
| Future SDD Specs | Will derive feature-level requirements from this PRD |
| Future ADRs | Will capture technical decisions that should not live directly inside the PRD |

---

### Approval State

| Approval Item | Status |
|---|---|
| Section-by-section content drafting | Complete |
| Full PRD review | Pending |
| Product Owner approval | Pending |
| Engineering review against PRD | Pending |
| Sprint 1 readiness review | Pending |
| Downstream SDD spec creation | Pending |

---

### Governance Notes

- This PRD is the product source of truth.
- SDD specs should derive from this PRD.
- Architecture documents and ADRs should not contradict PRD-level scope.
- Implementation should not begin until required Sprint 1 decisions and SDD specs are ready.
- Future scope changes should be reflected in the PRD before implementation.
- Product Owner approval is required before treating this PRD as final for Sprint 1 execution.

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

### Purpose of This Section

The purpose of this section is to define how IBMiHub AI will measure product success.

The product should not be judged only by website traffic, page views, or sign-ups. Those numbers are useful, but they do not prove that the product is creating meaningful value.

IBMiHub AI should be measured by whether users learn better, return regularly, trust the platform, use the AI tutor meaningfully, and eventually become willing to pay for the value they receive.

### North Star Metric

The proposed North Star Metric for the early product is:

**Weekly Active Learning Sessions**

A weekly active learning session means a user meaningfully engages with the platform through learning content, AI tutor usage, practice activities, quizzes, or progress-based learning.

This is a better early metric than raw traffic because IBMiHub AI is not intended to be a passive content website. The platform should encourage active learning and repeated engagement.

### Why This Metric Matters

Weekly Active Learning Sessions indicate that users are not only visiting the platform, but actually using it to learn or improve.

This metric aligns with the core product goals:

- Help users learn IBM i concepts faster
- Encourage active learning instead of passive reading
- Validate whether users return to continue learning
- Measure whether the product is becoming part of a user's learning workflow
- Support future monetization through repeated value creation

### Early MVP Success Metrics

For the MVP phase, the most important metrics are learning engagement, AI usefulness, retention, and qualitative user feedback.

#### User Activation Metrics

These metrics measure whether new users reach initial value.

Examples:

- New user sign-ups
- Percentage of users who start their first lesson
- Percentage of users who complete the first lesson
- Percentage of users who ask at least one AI tutor question
- Percentage of users who return after the first session
- Time taken for a new user to reach first meaningful value

#### Learning Engagement Metrics

These metrics measure whether users are actively learning.

Examples:

- Weekly active learners
- Lessons started
- Lessons completed
- Average lessons completed per user
- Average session duration
- Learning path progress
- Quiz attempts
- Quiz completion rate
- Repeat learning sessions per user

#### AI Tutor Usage Metrics

These metrics measure whether users find the AI tutor useful.

Examples:

- AI tutor questions asked
- AI tutor sessions per user
- Follow-up questions per AI session
- Percentage of users who use AI tutor after reading a lesson
- Percentage of AI interactions rated helpful
- Common topics users ask about
- AI response feedback score

#### Retention Metrics

These metrics measure whether users come back.

Examples:

- Day 1 retention
- Day 7 retention
- Day 30 retention
- Weekly returning users
- Monthly active users
- Percentage of users continuing a learning path after starting it

#### Content Quality Metrics

These metrics measure whether learning content is useful and trusted.

Examples:

- Lesson helpfulness rating
- Content clarity rating
- User-reported confusion points
- Number of lesson corrections or improvements identified
- Most completed lessons
- Most abandoned lessons
- User comments and feedback per lesson

#### Trust and Accuracy Metrics

Trust is critical because the platform deals with technical learning and AI-generated assistance.

Examples:

- AI responses marked as incorrect
- Content issues reported
- Number of corrections made to AI guidance or learning material
- User trust rating
- Percentage of AI answers with user feedback
- Repeat usage after AI tutor interaction

#### Community and Demand Metrics

These metrics help validate market interest.

Examples:

- LinkedIn post engagement
- Waitlist sign-ups
- Beta user requests
- Returning beta users
- User referrals
- Comments from IBM i professionals
- Direct messages or inquiries from potential users
- Requests for specific features

### Business Metrics

Business metrics should become more important after the MVP shows early user value.

Examples:

- Free-to-paid conversion rate
- Paid subscribers
- Monthly recurring revenue
- Average revenue per user
- Churn rate
- Trial-to-paid conversion
- Enterprise inquiries
- Corporate training leads
- Willingness-to-pay feedback

In the early phase, revenue is important but should not be the only measure of progress. Before optimizing revenue, the product must first prove that users find the platform useful and trustworthy.

### Enterprise Readiness Metrics

For future enterprise adoption, IBMiHub AI should eventually track:

- Team accounts created
- Number of learners per organization
- Team learning progress
- Admin dashboard usage
- Corporate onboarding completion
- Enterprise trial requests
- Enterprise renewal interest
- Training completion reports
- Feature requests from organizations

These metrics are not required for the first MVP but should be considered when designing the long-term platform.

### Product Quality Metrics

The platform should also be measured by reliability, usability, and maintainability.

Examples:

- Page load performance
- Application error rate
- AI response latency
- Login success rate
- Lesson completion flow errors
- User-reported bugs
- Support requests
- Accessibility issues
- Mobile usability issues

These metrics help ensure that the product feels professional and trustworthy.

### Qualitative Success Indicators

Not all important signals are numerical.

Qualitative success indicators include:

- Users saying the platform helped them understand IBM i concepts
- Beginners saying the learning path feels less overwhelming
- Experienced developers saying AI explanations saved time
- Team leads saying the platform could help onboarding
- IBM i professionals voluntarily sharing or recommending the product
- Users asking for more lessons, labs, or advanced features
- Companies expressing interest in team training

These signals are especially important during the early stage, when user volume may be small.

### Metrics to Avoid Over-Optimizing Early

In the early phase, the team should avoid over-optimizing for:

- Raw page views
- Social media likes without product usage
- Total registered users without activation
- Large feature count
- AI question volume without quality
- Revenue before product value is validated

These metrics can be misleading if users are not actually learning, returning, or finding meaningful value.

### MVP Success Criteria

The MVP should be considered successful if it demonstrates that:

- Users understand the product value quickly
- Users engage with structured IBM i learning content
- Users ask meaningful AI tutor questions
- Users return for additional sessions
- Early users provide positive qualitative feedback
- The IBM i community shows interest in the concept
- There is evidence that users may pay for advanced value in the future

### Summary

IBMiHub AI should measure success through meaningful learning engagement, AI usefulness, retention, trust, and business potential.

The early goal is not to maximize traffic or feature count. The early goal is to prove that a focused AI-powered IBM i learning and productivity platform can deliver real value to users.

---

## 6. Product Principles

### Purpose of This Section

Product principles define how IBMiHub AI should make decisions.

As the product grows, there will be many possible features, technical options, business opportunities, and user requests. These principles will help decide what to build, what to avoid, and how to maintain product quality over time.

The principles below should guide product, design, content, AI, engineering, and business decisions.

### Principle 1: AI First, But Not AI Only

IBMiHub AI should use AI as a core product differentiator, but AI should not replace product structure, learning design, or human judgment.

AI should help users understand, practice, troubleshoot, and document IBM i concepts faster. However, the product should not become a generic chatbot wrapped inside a website.

This means:

- AI should be deeply connected to IBM i learning and productivity workflows.
- AI responses should be guided by product context and user intent.
- AI should support structured learning, not replace it.
- AI output should encourage review, validation, and critical thinking.
- AI features should be useful, focused, and trustworthy.

The goal is not to add AI everywhere. The goal is to use AI where it creates real value.

### Principle 2: Learn by Doing

IBM i cannot be learned effectively through reading alone.

Users should be encouraged to practice concepts, commands, workflows, and troubleshooting scenarios wherever possible.

This means:

- Lessons should eventually connect to exercises, quizzes, labs, or examples.
- Concepts should be explained through practical IBM i scenarios.
- Users should gain confidence by trying things, not only reading about them.
- The platform should move toward interactive practice over time.
- Future labs, 5250 simulations, RPG exercises, and job log scenarios should support this principle.

The product should help users move from passive learning to active skill building.

### Principle 3: Original Content Only

IBMiHub AI must create original IBM i-focused content.

The product should not copy articles, examples, explanations, or course material from existing websites, books, documentation, or training providers.

This means:

- Content should be written in IBMiHub AI's own voice and structure.
- External resources may be used for research and inspiration, but not copied.
- Examples should be created specifically for this platform.
- Any external references should be properly credited where applicable.
- The platform should build its own credibility through quality and originality.

This principle protects the product legally, ethically, and strategically.

### Principle 4: Practical Value Over Feature Count

The product should prioritize useful outcomes over a large number of features.

IBMiHub AI should not try to build every possible IBM i tool immediately. Each feature should solve a clear user problem and support the product vision.

This means:

- A small useful feature is better than a large unfinished module.
- MVP scope should remain focused.
- Advanced features should be added only when there is evidence of user value.
- Feature decisions should be tied to learning, productivity, trust, or business impact.
- The product should avoid becoming bloated or confusing.

The goal is not to look feature-rich. The goal is to be genuinely useful.

### Principle 5: Trust Is a Core Feature

Trust is essential because IBMiHub AI will teach technical concepts and provide AI-assisted explanations.

Users must feel that the platform is careful, accurate, transparent, and responsible.

This means:

- Content should be reviewed for clarity and correctness.
- AI responses should avoid overconfidence.
- Uncertainty should be communicated clearly.
- Users should be encouraged to validate AI-generated guidance.
- Sensitive code, logs, and uploaded materials must be handled responsibly.
- The product should avoid misleading users into thinking AI output is always correct.

A platform that teaches and advises developers must earn trust continuously.

### Principle 6: Beginner Friendly, Professional Enough for Experts

IBMiHub AI should be approachable for beginners without becoming shallow for experienced professionals.

The product should explain concepts simply, but not oversimplify important technical details.

This means:

- Beginner paths should avoid unnecessary complexity at the start.
- Advanced users should still find value in AI explanations, code understanding, job log analysis, and documentation tools.
- Content should support progressive depth.
- Explanations should be clear, practical, and technically respectful.
- The product should serve both learning and productivity use cases.

The platform should help someone starting from zero while still being useful to a working IBM i developer.

### Principle 7: Structured Learning Before Random Content

IBMiHub AI should provide guided learning, not just a library of disconnected articles.

Users should know what to learn next, why it matters, and how each topic connects to real IBM i work.

This means:

- Learning paths should be designed intentionally.
- Content should be sequenced from fundamentals to practical capability.
- Lessons should connect to user goals.
- Progress should be visible.
- Random content creation should not replace curriculum design.

The product should reduce confusion, not add more information overload.

### Principle 8: Build for Long-Term Platform Growth

IBMiHub AI should start narrow but be designed for long-term growth.

The first release does not need every future module, but today's decisions should not block tomorrow's platform.

This means:

- MVP features should be simple but extensible.
- Architecture should support future labs, AI tools, enterprise features, and content growth.
- Product naming and structure should allow expansion.
- Documentation should remain organized.
- Technical and product decisions should consider future maintainability.

The product should grow carefully without needing to restart from scratch.

### Principle 9: Community and Ecosystem Respect

IBMiHub AI should respect the existing IBM i community.

The goal is not to replace existing experts, websites, forums, vendors, or documentation. The goal is to provide a modern AI-first platform that complements and strengthens the ecosystem.

This means:

- The product should avoid copying existing community content.
- The platform should acknowledge that IBM i expertise is built through real experience.
- Community feedback should influence product direction.
- The product should create value for learners, professionals, teams, and companies.
- The platform should help keep IBM i knowledge accessible for future generations.

IBMiHub AI should become a trusted contributor to the IBM i ecosystem.

### Principle 10: Validate Before Scaling

The product should validate real user value before expanding aggressively.

IBMiHub AI has a broad vision, but each stage should prove that users actually want and use the product.

This means:

- Build a focused MVP.
- Test with real users.
- Measure engagement and feedback.
- Learn from early beta users.
- Prioritize features based on evidence, not excitement alone.
- Avoid overengineering before market validation.

The product should grow through learning, feedback, and disciplined execution.

### Summary

These principles should guide every major product decision.

When there is uncertainty, the team should ask:

- Does this help IBM i professionals learn or work better?
- Does this support AI-assisted learning or productivity?
- Does this create practical value?
- Does this build trust?
- Does this respect originality and the IBM i ecosystem?
- Does this support long-term platform growth?

If the answer is unclear, the feature or decision should be reconsidered.

---

## 7. Market Analysis

### Purpose of This Section

The purpose of this section is to describe the market opportunity for IBMiHub AI.

This section should not overstate the market size or make unsupported claims. IBM i is a specialized ecosystem, not a mass-market developer platform. However, it remains important in many organizations, and the combination of skills pressure, modernization needs, AI adoption, and fragmented learning resources creates a focused opportunity for a niche SaaS product.

### Market Framing

IBMiHub AI is not targeting the general programming education market.

It is targeting a specialized professional audience:

- IBM i learners
- RPGLE and CLLE developers
- IBM i consultants
- Team leads and architects
- Companies onboarding new IBM i talent
- Organizations trying to preserve legacy system knowledge
- Professionals involved in IBM i modernization

This makes the product a niche SaaS opportunity rather than a broad consumer education product.

The opportunity is smaller than mainstream developer education, but potentially more valuable because the audience works on critical systems, has fewer modern learning options, and may have higher willingness to pay for practical productivity and training tools.

### Market Signals

Several market signals support the opportunity for IBMiHub AI.

#### 1. IBM i Remains Relevant for Critical Business Workloads

IBM i continues to be positioned as an integrated platform for mission-critical workloads. It combines operating system, database, middleware, runtime, security, and system management capabilities into one environment.

This matters because IBMiHub AI is not being built for an obsolete platform. It is being built for a specialized ecosystem that continues to support important business applications.

#### 2. IBM i Skills Are a Major Concern

Public IBM i community research indicates that skills availability is a major concern for IBM i organizations.

The 2026 IBM i Marketplace Survey from Fortra reported that IBM i skills became the top concern for respondents. The same survey also highlighted continued interest in modernization, AI, security, and newer development tooling.

This directly supports IBMiHub AI's focus on learning, onboarding, AI assistance, and knowledge transfer.

#### 3. Modernization Continues to Drive Demand

Organizations running IBM i systems continue to face pressure to modernize applications, development practices, security, integrations, and user experiences.

Modernization does not always mean replacing IBM i. In many cases, it means improving how teams develop, maintain, document, integrate, and extend existing IBM i applications.

This creates demand for tools that help developers understand legacy systems, explain code, document behavior, and learn modern IBM i workflows.

#### 4. IBM i Learning Resources Are Fragmented

The IBM i ecosystem has valuable resources, including documentation, blogs, forums, training providers, books, and community experts.

However, these resources are often distributed across many places and are not always structured as a modern learning journey.

This creates an opportunity for a platform that combines structured learning, AI guidance, hands-on practice, and progress tracking.

#### 5. AI Is Becoming Relevant to IBM i Development

AI-assisted development is becoming increasingly relevant across software engineering, including IBM i modernization and code understanding.

Generic AI tools can help, but they are not designed specifically around IBM i learning paths, RPGLE, CLLE, DDS, job logs, 5250 workflows, and enterprise onboarding.

IBMiHub AI can differentiate by combining AI with IBM i-specific content, context, guardrails, and workflows.

#### 6. Developer Tooling Is Modernizing

The IBM i ecosystem is seeing increased use of modern developer tooling such as Visual Studio Code, Git-friendly workflows, and AI-assisted productivity tools.

This shift is important because it shows that IBM i professionals are not limited to traditional tooling. There is room for modern web-based and AI-assisted experiences that complement the IBM i platform.

### Target Market Segments

#### Segment 1: Individual Learners

These users are new to IBM i or trying to build foundational skills.

They need:

- Guided learning paths
- Beginner-friendly explanations
- Practice exercises
- AI tutor support
- Confidence-building content

This segment may begin with free or low-cost plans.

#### Segment 2: Working IBM i Developers

These users already work with IBM i systems and want productivity support.

They need:

- RPGLE and CLLE explanation
- SQL and DDS clarification
- Job log understanding
- Documentation support
- Faster troubleshooting
- Modernization guidance

This segment is a strong candidate for paid individual plans.

#### Segment 3: Team Leads and Architects

These users are responsible for onboarding, knowledge transfer, code understanding, and modernization.

They need:

- Structured training material
- Team learning paths
- Documentation tools
- Legacy code explanation
- Productivity assistance
- Knowledge preservation

This segment may influence team or enterprise purchases.

#### Segment 4: Companies and Enterprise Teams

These buyers need to train employees, reduce dependency on senior experts, and improve IBM i knowledge transfer.

They need:

- Team accounts
- Learning progress tracking
- Corporate onboarding paths
- Role-based learning
- Internal training support
- Enterprise-grade privacy and controls

This segment is likely to be a future revenue driver after the product proves individual value.

#### Segment 5: Interview Candidates and Career Switchers

These users want to prepare for IBM i roles.

They need:

- Interview questions
- Concept explanations
- Practice scenarios
- Mock assessments
- Skill validation

This segment may support future certification and interview-preparation offerings.

### Market Opportunity

The market opportunity is based on a focused but underserved audience.

IBMiHub AI does not need to capture a massive developer market to become valuable. It needs to become trusted by a meaningful portion of the IBM i community.

The opportunity exists because:

- IBM i systems remain business-critical.
- IBM i skills are difficult to find and transfer.
- Existing learning resources are fragmented.
- Modern AI-assisted learning experiences are still limited in this niche.
- Companies need better onboarding and documentation support.
- Developers need faster ways to understand legacy applications.

The strongest opportunity is likely to begin with individual learning and AI assistance, then expand into productivity tools and enterprise training.

### TAM / SAM / SOM Approach

Precise TAM, SAM, and SOM numbers are not yet approved in this PRD.

At this stage, the market sizing approach should remain conservative and evidence-driven.

The proposed approach is:

- TAM: Global IBM i professionals, learners, consultants, organizations, and training needs connected to IBM i systems
- SAM: English-speaking IBM i learners, developers, consultants, and teams reachable through online channels
- SOM: Early adopters from LinkedIn, IBM i communities, beta users, individual developers, small teams, and companies interested in AI-assisted onboarding

The first priority is not to prove a large theoretical TAM.

The first priority is to validate whether a focused audience finds the platform useful enough to return, recommend, and eventually pay.

### Buyer Landscape

IBMiHub AI may have two types of buyers.

#### Individual Buyers

These users may pay for:

- Advanced AI tutor usage
- Premium learning paths
- Practice labs
- RPGLE and job log tools
- Interview preparation
- Certifications

#### Enterprise Buyers

Companies may pay for:

- Team learning access
- Onboarding programs
- Progress tracking
- Enterprise privacy controls
- Internal training paths
- Documentation and productivity tools
- Corporate support

The product should begin with individual value but keep the long-term enterprise opportunity in mind.

### Go-To-Market Assumptions

Early go-to-market should be community-led and founder-led.

Potential channels include:

- LinkedIn posts targeting IBM i professionals
- IBM i community groups
- Developer forums
- Personal network outreach
- Content marketing
- Demo videos
- Early beta invitations
- Partnerships with trainers or consultants in the future

The early goal should be to attract beta users, validate demand, and identify the highest-value use cases.

### Market Risks

The market opportunity also has risks.

Key risks include:

- The IBM i audience is niche and may be smaller than expected.
- Users may trust human experts more than AI explanations.
- Companies may have concerns about uploading code or job logs.
- Enterprise sales may require security, privacy, and compliance maturity.
- Some users may expect free content because many learning resources are already available online.
- Building credibility in the IBM i community may take time.
- AI accuracy issues could damage trust if not handled carefully.

These risks should be managed through focused MVP scope, original content, transparent AI boundaries, strong privacy practices, and gradual market validation.

### Strategic Market Position

IBMiHub AI should position itself as:

**The AI-first learning and productivity platform for IBM i professionals.**

This positioning is intentionally focused.

The product should not compete directly with all IBM documentation, training providers, blogs, or generic AI coding assistants. Instead, it should combine the strengths of structured learning, AI assistance, hands-on practice, and IBM i-specific productivity workflows.

### Summary

The market for IBMiHub AI is specialized but meaningful.

IBM i remains important, IBM i skills are a visible concern, modernization continues, and learning resources remain fragmented. These conditions create an opportunity for a focused AI-powered platform that helps professionals learn, practice, troubleshoot, document, and modernize IBM i systems.

The early market strategy should be conservative, evidence-driven, and community-focused. The product should validate real demand before expanding into advanced tools or enterprise offerings.

---

## 8. Competitive Landscape

### Purpose of This Section

The purpose of this section is to position IBMiHub AI against existing alternatives in the IBM i learning, training, documentation, community, AI assistance, and modernization ecosystem.

The goal is not to claim that existing resources are weak or unimportant. Many existing IBM i resources are valuable and respected. The opportunity for IBMiHub AI is to combine structured learning, AI assistance, hands-on practice, and productivity workflows into one focused platform.

IBMiHub AI should be designed to complement the IBM i ecosystem, not disrespect or replace it.

### Competitive Framing

IBMiHub AI does not have one direct competitor that provides the exact same complete experience.

Instead, users currently solve their IBM i learning and productivity needs through a combination of alternatives:

- Official IBM documentation
- IBM training resources
- Tutorial websites
- Community articles and blogs
- Forums and user groups
- Paid training providers
- Internal company mentoring
- Generic AI assistants
- IBM i modernization and DevOps tools

The competitive opportunity is created by fragmentation. Users may find useful information across many sources, but they do not always have one guided, AI-assisted, hands-on platform built specifically for IBM i learning and productivity.

### Alternative Category 1: Official IBM Documentation

Official IBM documentation is authoritative and essential.

It provides product-level technical reference material for IBM i, DB2 for i, system operations, commands, APIs, and platform behavior.

#### Strengths

- Highly authoritative
- Official source of truth
- Broad technical coverage
- Useful for experienced professionals
- Important for validation and reference

#### Limitations from IBMiHub AI Perspective

- Not designed as a beginner-first learning journey
- Often reference-oriented rather than guided
- May feel overwhelming to new learners
- Does not provide AI tutoring by default
- Does not provide a unified hands-on practice experience
- Does not focus on personalized learning progression

#### IBMiHub AI Positioning

IBMiHub AI should not compete with IBM documentation as the source of truth.

Instead, IBMiHub AI should help users understand IBM i concepts in simpler language, learn in a structured sequence, practice safely, and know when to refer to official documentation for deeper validation.

### Alternative Category 2: IBM Training and Formal Courses

IBM and other formal training providers offer structured courses for IBM i topics.

These courses can be valuable for professionals and companies that want formal learning.

#### Strengths

- Structured training format
- Credible source
- Useful for official or enterprise learning
- May include instructor-led options
- Suitable for organizations investing in training

#### Limitations from IBMiHub AI Perspective

- May not be available instantly for every learner
- May not cover every real-world troubleshooting scenario
- May not provide continuous AI-assisted support
- May not provide daily practice or productivity tools
- May be less flexible for self-paced exploratory learning

#### IBMiHub AI Positioning

IBMiHub AI can complement formal training by giving users a continuous learning and practice environment before, during, and after formal courses.

### Alternative Category 3: Tutorial Websites and Free Learning Resources

Tutorial websites, blogs, and free learning resources are often the first place many learners go when trying to understand IBM i, RPGLE, CLLE, SQLRPGLE, DDS, commands, and basic concepts.

Examples include IBM i tutorial sites, personal blogs, code examples, and topic-specific articles.

#### Strengths

- Easy to access
- Often free
- Useful for quick explanations
- Helpful for specific syntax or examples
- Valuable for self-directed learners

#### Limitations from IBMiHub AI Perspective

- Content can be fragmented
- Quality and depth may vary
- Learning paths may not be structured
- No personalized guidance
- No progress tracking
- No integrated AI tutor
- Limited hands-on practice experience
- May not connect concepts to real-world workflows

#### IBMiHub AI Positioning

IBMiHub AI should differentiate through original structured learning paths, AI guidance, practice-oriented examples, and progressive learning rather than random topic discovery.

IBMiHub AI must not copy content from tutorial websites. It should create its own original explanations, examples, exercises, and learning flows.

### Alternative Category 4: IBM i Community, Publications, and User Groups

The IBM i ecosystem has strong community assets, including publications, user groups, conferences, webinars, forums, LinkedIn discussions, and expert-led sessions.

These resources are important for ongoing professional learning and ecosystem connection.

#### Strengths

- Community credibility
- Real-world experience
- Expert voices
- Industry updates
- Networking opportunities
- Practical insight from experienced professionals

#### Limitations from IBMiHub AI Perspective

- Not always designed as a step-by-step beginner path
- Information is spread across events, articles, discussions, and recordings
- Learning depends on user discovery and initiative
- No single product workflow for learning, practice, AI assistance, and progress tracking
- May not provide immediate answers for individual learning gaps

#### IBMiHub AI Positioning

IBMiHub AI should respect and support the IBM i community.

The platform can become a practical daily learning and productivity layer while community groups and publications continue to provide ecosystem knowledge, news, events, and expert discussion.

### Alternative Category 5: Internal Company Mentoring and Tribal Knowledge

Many IBM i professionals learn through senior developers, internal documentation, old source code, production support, and team-specific knowledge transfer.

This is one of the most common real-world alternatives to formal learning.

#### Strengths

- Highly practical
- Based on real company systems
- Context-rich
- Directly connected to business applications
- Useful for job-specific onboarding

#### Limitations from IBMiHub AI Perspective

- Depends heavily on availability of senior experts
- Knowledge may not be documented well
- Onboarding can be inconsistent
- Senior developers may become bottlenecks
- New learners may hesitate to ask repeated basic questions
- Legacy knowledge can be lost when people leave

#### IBMiHub AI Positioning

IBMiHub AI can help reduce the load on senior developers by supporting foundational learning, code explanation, job log understanding, documentation generation, and structured onboarding.

It should not replace experienced professionals. It should help teams transfer knowledge more consistently.

### Alternative Category 6: Generic AI Assistants

Generic AI assistants can already answer IBM i-related questions, explain code, and help users reason through technical topics.

These tools are powerful and will continue to improve.

#### Strengths

- Broad AI capability
- Natural language interface
- Useful for quick explanations
- Can assist with many programming languages and concepts
- Familiar to many users

#### Limitations from IBMiHub AI Perspective

- Not designed specifically for IBM i learning paths
- May lack product-level context
- No structured IBM i curriculum by default
- No built-in progress tracking
- No 5250 practice workflow
- No IBM i-specific learning guardrails
- No integrated job log or RPGLE practice experience by default
- May produce confident but incorrect answers if not constrained

#### IBMiHub AI Positioning

IBMiHub AI should not compete by being a generic chatbot.

It should compete by combining AI with IBM i-specific context, curriculum, examples, workflows, practice scenarios, feedback loops, and trust boundaries.

### Alternative Category 7: AI Coding Assistants and IDE Tools

AI coding assistants inside IDEs can help developers write, explain, and refactor code.

These tools are useful for working developers, especially in modern development environments.

#### Strengths

- Integrated into developer workflow
- Useful for code suggestions
- Strong productivity value
- Helpful for modern engineering teams
- Useful across many programming languages

#### Limitations from IBMiHub AI Perspective

- Not primarily designed for structured IBM i education
- May not support IBM i-specific workflows deeply
- Does not replace curriculum, practice labs, or onboarding
- May be less useful for business users, beginners, or interview candidates
- Does not provide a complete learning platform experience

#### IBMiHub AI Positioning

IBMiHub AI can coexist with IDE-based AI tools.

The platform should focus on structured learning, IBM i-specific explanations, practice, job log understanding, documentation, and onboarding rather than only code completion.

### Alternative Category 8: IBM i DevOps and Modernization Vendors

There are specialized IBM i vendors focused on modernization, DevOps, change management, application analysis, APIs, testing, and deployment workflows.

These tools are important for enterprise IBM i development teams.

#### Strengths

- Enterprise-grade IBM i tooling
- Strong focus on modernization and DevOps
- Useful for professional development teams
- Often integrated into real IBM i environments
- Solves production engineering problems

#### Limitations from IBMiHub AI Perspective

- Not primarily focused on beginner learning
- May require enterprise purchase and setup
- Not designed as an AI-first learning platform
- May not provide structured curriculum or public learning paths
- Focus is usually tooling and process rather than education

#### IBMiHub AI Positioning

IBMiHub AI should not initially compete directly with enterprise DevOps vendors.

Instead, it should focus on learning, AI-assisted understanding, documentation, practice, and onboarding. Over time, it may support productivity workflows that complement enterprise modernization tools.

### Competitive Positioning Matrix

| Alternative Category | Primary User Need Served | Key Strength | Main Gap IBMiHub AI Can Address |
|---|---|---|---|
| IBM Documentation | Authoritative reference | Official and complete | Not a guided AI-first learning journey |
| IBM Training | Formal education | Structured and credible | Less continuous and less personalized |
| Tutorial Websites | Quick learning | Free and accessible | Fragmented and not interactive |
| Community & Publications | Industry knowledge | Expert ecosystem insight | Not a unified product workflow |
| Internal Mentoring | Company-specific learning | Practical and contextual | Hard to scale consistently |
| Generic AI Assistants | Broad AI help | Flexible and powerful | Not IBM i-specific by default |
| AI Coding Assistants | Developer productivity | IDE-integrated coding help | Not full learning/onboarding platform |
| DevOps Vendors | Enterprise modernization | Production-grade tooling | Not beginner-first education |

### IBMiHub AI Differentiation

IBMiHub AI should differentiate through a combination of capabilities rather than one isolated feature.

The main differentiation areas are:

#### 1. IBM i-Specific Focus

The platform is designed specifically for IBM i professionals, not generic developers.

This allows the product to focus deeply on:

- IBM i concepts
- RPGLE
- CLLE
- SQLRPGLE
- DDS
- DB2 for i
- 5250 workflows
- Job logs
- Legacy code understanding
- IBM i modernization topics

#### 2. AI-Assisted Learning and Productivity

AI is not an add-on. It is part of the core product experience.

The AI tutor and future AI tools should help users learn, understand, troubleshoot, document, and practice IBM i topics faster.

#### 3. Structured Learning Paths

IBMiHub AI should reduce confusion by giving learners a clear path.

Users should not need to guess what to learn next.

#### 4. Hands-On Practice Direction

The long-term product direction includes 5250 simulations, RPGLE practice, job log scenarios, quizzes, and real-world exercises.

This creates differentiation beyond static content.

#### 5. Original Content and Examples

The platform should build trust by creating original explanations, examples, exercises, and scenarios rather than copying existing websites.

#### 6. Support for Both Beginners and Professionals

The product should help beginners learn fundamentals while also helping working developers understand code, logs, and legacy behavior faster.

#### 7. Future Enterprise Training Potential

IBMiHub AI can eventually support companies with onboarding, team learning, progress tracking, documentation support, and knowledge transfer.

### Competitive Strategy

The competitive strategy should be:

- Start with a focused learning and AI tutor MVP.
- Build trust through original, high-quality IBM i content.
- Avoid trying to compete with every IBM i tool category immediately.
- Treat existing IBM i resources as complementary, not enemies.
- Use AI to create a more interactive and personalized experience.
- Expand into practice labs and productivity tools only after early validation.
- Build credibility in the community before pursuing enterprise expansion.

### What IBMiHub AI Should Avoid

IBMiHub AI should avoid:

- Copying existing tutorial content
- Claiming to replace IBM documentation
- Competing directly with mature DevOps vendors too early
- Becoming a generic AI chatbot
- Building a large feature list before validating user value
- Making unsupported claims about competitors
- Positioning itself as superior to human IBM i experts

### Summary

The competitive landscape is fragmented rather than dominated by a single direct competitor.

Users currently rely on documentation, tutorials, community knowledge, training providers, internal mentoring, generic AI tools, and enterprise modernization products.

IBMiHub AI's opportunity is to unify the most important parts of learning and productivity into a focused, AI-first IBM i platform.

The product should position itself as complementary to the existing ecosystem while differentiating through IBM i-specific AI assistance, structured learning, original content, hands-on practice direction, and future enterprise training potential.

---

## 9. User Personas

### Purpose of This Section

The purpose of this section is to define the primary and secondary users for IBMiHub AI.

Personas help ensure that the product is not built around vague assumptions. Each persona represents a real type of user with specific goals, frustrations, skill levels, motivations, and success criteria.

These personas should guide product decisions, learning content design, AI tutor behavior, onboarding, pricing, and future roadmap decisions.

### Persona Overview

IBMiHub AI will serve multiple user groups over time, but the product should not try to satisfy all of them equally in the first release.

The early MVP should focus mainly on individual learners and working IBM i professionals. Team leads, architects, enterprise buyers, and interview candidates are important for future expansion, but they should not overload the first release.

| Persona | Priority | Primary Need | MVP Relevance |
|---|---|---|---|
| Beginner IBM i Learner | Primary | Learn IBM i from the ground up | High |
| Working IBM i Developer | Primary | Understand concepts, code, and logs faster | High |
| Team Lead / Mentor | Secondary | Onboard and support team members | Medium |
| IBM i Architect / Consultant | Secondary | Analyze legacy systems and guide modernization | Medium |
| Enterprise Training Buyer | Future Buyer | Train teams and track progress | Future |
| Interview Candidate / Career Switcher | Secondary | Prepare for IBM i roles | Medium |

---

### Persona 1: Beginner IBM i Learner

#### Profile

The Beginner IBM i Learner is new to the IBM i ecosystem.

This user may be a junior developer, a developer moving from another technology stack, a new employee assigned to an IBM i project, or someone trying to understand IBM i for the first time.

They may have basic programming knowledge but little or no exposure to RPGLE, CLLE, 5250 screens, libraries, objects, job logs, spool files, or DB2 for i.

#### Goals

This user wants to:

- Understand what IBM i is
- Learn basic IBM i terminology
- Navigate common IBM i concepts without feeling overwhelmed
- Learn RPGLE, CLLE, DDS, SQLRPGLE, and DB2 for i step by step
- Understand 5250 screens and command workflows
- Build confidence through examples and practice
- Become productive enough to work on real IBM i tasks

#### Pain Points

This user struggles because:

- IBM i concepts feel unfamiliar and intimidating
- Existing resources are scattered
- Many explanations assume prior experience
- There is no obvious beginner-friendly learning path
- 5250 screens can feel outdated or confusing
- They may not have safe hands-on access to practice
- They may depend too much on senior developers for basic questions

#### What Success Looks Like

This user is successful when they can:

- Explain basic IBM i concepts in their own words
- Follow a structured learning path
- Complete beginner lessons and quizzes
- Ask the AI tutor questions without fear
- Understand simple RPGLE and CLLE examples
- Recognize common IBM i objects and workflows
- Feel confident enough to continue learning independently

#### Product Implications

For this persona, IBMiHub AI should provide:

- Simple onboarding
- Beginner learning paths
- Plain-language explanations
- Glossary support
- AI tutor guidance
- Step-by-step examples
- Progress tracking
- Future practice labs and simulations

---

### Persona 2: Working IBM i Developer

#### Profile

The Working IBM i Developer already works with IBM i systems.

This user may write or maintain RPGLE, CLLE, SQLRPGLE, DDS, batch jobs, reports, integrations, or production support utilities.

They may not need beginner-level explanations all the time, but they often need faster ways to understand code, job logs, legacy behavior, or unfamiliar modules.

#### Goals

This user wants to:

- Understand unfamiliar RPGLE or CLLE programs faster
- Interpret job logs and errors more efficiently
- Refresh concepts they do not use daily
- Get practical explanations for IBM i topics
- Save time during debugging and analysis
- Create documentation from existing knowledge
- Learn modern tooling and development practices
- Improve productivity without leaving the IBM i context

#### Pain Points

This user struggles because:

- Legacy code can be difficult to understand
- Business logic may be undocumented
- Job logs can be long and noisy
- Root-cause analysis often takes manual effort
- Knowledge may be spread across code, logs, old documents, and senior developers
- Generic AI tools may not understand IBM i-specific context well
- Documentation work is often time-consuming

#### What Success Looks Like

This user is successful when they can:

- Get faster explanations for IBM i concepts
- Understand code snippets more quickly
- Use the AI tutor to clarify errors or concepts
- Reduce time spent searching across disconnected resources
- Produce clearer documentation
- Learn new IBM i topics as needed
- Trust the platform as a daily support tool

#### Product Implications

For this persona, IBMiHub AI should eventually provide:

- AI-assisted code explanation
- Job log explanation
- RPGLE, CLLE, SQL, and DDS help
- Practical examples
- Documentation generation
- Searchable learning content
- Advanced topic paths
- Productivity-focused AI tools

---

### Persona 3: Team Lead / Mentor

#### Profile

The Team Lead or Mentor is responsible for helping others become productive on IBM i projects.

This user may manage developers, review work, support onboarding, answer repeated questions, explain legacy systems, or guide production support activities.

They care about team productivity, consistency, training quality, and reducing dependency on a few senior people.

#### Goals

This user wants to:

- Onboard new IBM i developers faster
- Reduce repeated basic questions
- Standardize learning paths for the team
- Help junior developers become independent
- Preserve team knowledge
- Improve documentation quality
- Support team members during troubleshooting
- Track learning progress in the future

#### Pain Points

This user struggles because:

- New developers need significant guidance
- Senior developers become bottlenecks
- Internal documentation may be incomplete or outdated
- Training is often informal and inconsistent
- Knowledge transfer depends on availability of experienced people
- It is difficult to know whether learners are progressing
- Production support knowledge may not be captured well

#### What Success Looks Like

This user is successful when:

- New developers can learn basics independently
- Team members use IBMiHub AI before escalating simple questions
- Onboarding becomes more structured
- Internal mentoring effort reduces
- Documentation and explanations become easier to produce
- The team has a repeatable IBM i learning foundation

#### Product Implications

For this persona, IBMiHub AI should eventually support:

- Team learning paths
- Recommended onboarding tracks
- Progress visibility
- Shareable lessons
- Internal training support
- Documentation workflows
- Future admin/team features

---

### Persona 4: IBM i Architect / Consultant

#### Profile

The IBM i Architect or Consultant works across systems, teams, integrations, modernization initiatives, and legacy application analysis.

This user is experienced and often responsible for understanding complex systems, explaining architecture, documenting flows, advising on modernization, and helping teams make technical decisions.

#### Goals

This user wants to:

- Understand legacy application flows faster
- Explain system behavior clearly to others
- Support modernization planning
- Document existing applications
- Analyze RPGLE, CLLE, SQL, DDS, APIs, and integrations
- Identify knowledge gaps
- Help teams move toward modern practices
- Use AI to accelerate analysis without losing control

#### Pain Points

This user struggles because:

- Legacy systems may have limited documentation
- Application behavior may be spread across many programs and jobs
- Business rules may be hidden in old code
- Modernization requires both technical and business understanding
- Manual documentation is slow
- Generic AI tools may lack deep IBM i workflow context
- Accuracy and trust are critical

#### What Success Looks Like

This user is successful when:

- They can analyze systems faster
- They can generate clearer explanations and documentation
- They can support modernization without losing legacy understanding
- They can use AI as an assistant while retaining expert judgment
- They can help teams understand complex IBM i systems more efficiently

#### Product Implications

For this persona, IBMiHub AI should eventually provide:

- Advanced code understanding
- Application documentation support
- Job log and flow explanation
- Modernization learning paths
- Architecture-focused content
- AI-assisted analysis with clear trust boundaries

---

### Persona 5: Enterprise Training Buyer

#### Profile

The Enterprise Training Buyer is a manager, delivery leader, training owner, engineering leader, or organization decision-maker responsible for IBM i capability building.

This user may not personally use the platform daily, but they influence or approve purchases for training, onboarding, productivity, and knowledge-transfer tools.

#### Goals

This user wants to:

- Train new IBM i developers efficiently
- Reduce onboarding time
- Reduce dependency on senior experts
- Standardize IBM i learning across teams
- Improve knowledge retention
- Support modernization initiatives
- Track learner progress
- Justify training investment

#### Pain Points

This user struggles because:

- IBM i talent can be difficult to find
- Training is often dependent on internal experts
- Onboarding may take months
- Existing learning resources may not match company needs
- Knowledge transfer is hard to measure
- Enterprise adoption requires trust, privacy, security, and support
- Training budget needs clear value justification

#### What Success Looks Like

This user is successful when:

- Teams onboard faster
- Learners follow structured paths
- Progress can be tracked
- Senior developers spend less time on basics
- IBM i knowledge becomes easier to preserve
- The platform shows measurable training and productivity value

#### Product Implications

For this persona, IBMiHub AI should eventually support:

- Enterprise plans
- Team accounts
- Admin dashboards
- Progress reporting
- Role-based learning paths
- Privacy and security controls
- Corporate onboarding packages
- Enterprise support

This persona is important for long-term monetization, but should not dominate MVP scope.

---

### Persona 6: Interview Candidate / Career Switcher

#### Profile

The Interview Candidate or Career Switcher wants to prepare for IBM i job opportunities.

This user may already know some programming but needs to understand IBM i concepts, RPGLE basics, common interview topics, and practical development workflows.

They may be a fresher, lateral developer, internal transfer, or experienced developer moving into IBM i work.

#### Goals

This user wants to:

- Learn IBM i concepts quickly
- Prepare for interviews
- Understand common RPGLE, CLLE, SQL, and DB2 for i questions
- Practice real-world scenarios
- Build confidence before joining an IBM i role
- Validate their knowledge through quizzes or assessments

#### Pain Points

This user struggles because:

- Interview topics are scattered
- Many resources do not explain concepts from the ground up
- They may not know what level of depth is expected
- They may lack hands-on practice
- They may memorize answers without understanding workflows
- They may not know how IBM i is used in real projects

#### What Success Looks Like

This user is successful when:

- They understand core IBM i concepts
- They can answer interview questions with confidence
- They can explain RPGLE, CLLE, SQL, DDS, and job log basics
- They can complete quizzes and practice scenarios
- They feel prepared for entry-level or lateral IBM i roles

#### Product Implications

For this persona, IBMiHub AI should eventually provide:

- Interview preparation paths
- Topic-wise question banks
- Mock quizzes
- Practical scenario explanations
- Skill readiness indicators
- Future certification or assessment features

---

### Primary MVP Personas

The first MVP should focus mainly on:

1. Beginner IBM i Learner
2. Working IBM i Developer

These two personas give the product a strong early foundation.

The Beginner IBM i Learner validates the learning platform.

The Working IBM i Developer validates the AI assistance and productivity angle.

If the product creates value for both, it can later expand toward team leads, architects, enterprise buyers, and interview candidates.

### Persona Prioritization

For MVP decisions, priority should be:

| Priority | Persona | Why |
|---|---|---|
| 1 | Beginner IBM i Learner | Needs structured learning and validates the education foundation |
| 2 | Working IBM i Developer | Needs AI-assisted explanations and validates productivity potential |
| 3 | Team Lead / Mentor | Influences onboarding and future team features |
| 4 | Interview Candidate / Career Switcher | Supports learning and future monetization |
| 5 | IBM i Architect / Consultant | Important for advanced productivity and modernization tools |
| 6 | Enterprise Training Buyer | Important for future revenue but not the first MVP user |

### Summary

IBMiHub AI is being built for a specialized but diverse IBM i audience.

The product should begin by serving learners and working developers well. These personas represent the strongest early path to product validation because they directly experience the learning and AI-assistance problems the platform aims to solve.

Over time, the platform can expand to support team leads, architects, enterprise buyers, and interview candidates through more advanced learning, productivity, onboarding, assessment, and enterprise features.

---

## 10. User Journeys

### Purpose of This Section

The purpose of this section is to describe how key users discover, evaluate, start using, and continue engaging with IBMiHub AI.

User journeys help translate personas into real product experiences. They show what users are trying to accomplish, what friction they may face, and where the product must create value.

The MVP should focus mainly on the journeys of:

1. Beginner IBM i Learner
2. Working IBM i Developer

Other journeys are important for future roadmap planning but should not dominate the first release.

---

### Journey Overview

IBMiHub AI should support users through the following journey stages:

| Stage | Description | Product Responsibility |
|---|---|---|
| Awareness | User discovers IBMiHub AI | Communicate clear IBM i-focused value |
| Evaluation | User decides whether the platform is useful | Show credibility, clarity, and relevance |
| Onboarding | User creates account and starts | Make first steps simple and guided |
| Activation | User experiences first meaningful value | Help user complete first lesson or ask first AI question |
| Engagement | User returns and continues learning | Provide progress, next steps, and useful AI support |
| Expansion | User explores advanced value | Introduce deeper learning, AI tools, and future practice |
| Advocacy / Upgrade | User recommends or pays | Build enough trust and value to support growth |

---

## Journey 1: Beginner IBM i Learner

### User Context

The Beginner IBM i Learner is new to IBM i and may feel overwhelmed by unfamiliar terminology, 5250 screens, RPGLE, CLLE, DDS, job logs, and legacy system concepts.

This user needs confidence, structure, and reassurance.

### Stage 1: Awareness

The user may discover IBMiHub AI through:

- LinkedIn posts
- Search results
- IBM i community discussions
- Recommendation from a senior developer
- A colleague or team lead
- Content shared by the founder
- A beginner-friendly IBM i article or video

At this stage, the user is likely asking:

- What is IBM i?
- How do I start learning IBM i?
- Is there a beginner-friendly learning path?
- Can AI help me understand IBM i concepts?

### Stage 2: Evaluation

The user visits the platform and tries to understand whether it is meant for someone like them.

The product must quickly answer:

- Is this beginner-friendly?
- Does it assume prior IBM i knowledge?
- Is there a clear learning path?
- Can I ask basic questions without feeling embarrassed?
- Is this more useful than scattered articles?

The landing and onboarding experience should clearly communicate that IBMiHub AI supports beginners.

### Stage 3: Onboarding

The user creates an account or enters the learning experience.

A good onboarding flow should:

- Ask about the user's experience level
- Recommend a beginner learning path
- Explain what the AI tutor can help with
- Avoid overwhelming the user with too many modules
- Show the next best action clearly

For MVP, onboarding should be simple. The goal is to get the user into their first meaningful learning activity quickly.

### Stage 4: Activation

The first meaningful value occurs when the user completes an early lesson or receives a helpful AI tutor explanation.

Examples of activation moments:

- User understands what IBM i is
- User completes the first beginner lesson
- User asks the AI tutor a basic question and receives a clear answer
- User sees their learning progress
- User feels the platform is less intimidating than random web search

Activation is successful when the user thinks:

"This finally makes IBM i easier to understand."

### Stage 5: Engagement

The user returns to continue learning.

The product should support engagement through:

- Clear next lesson recommendations
- Visible progress tracking
- Simple quizzes or checks for understanding
- AI tutor support inside learning content
- Beginner-friendly explanations
- Practical examples connected to real IBM i work

The user should not need to decide what to learn next without guidance.

### Stage 6: Expansion

As the beginner gains confidence, they may explore:

- RPGLE basics
- CLLE basics
- DDS and database concepts
- 5250 workflow explanations
- Job log examples
- Practice exercises
- Interview preparation
- Future labs or simulations

Expansion should happen gradually. The product should avoid exposing too many advanced features too early.

### Stage 7: Advocacy or Upgrade

The user may recommend the platform if it helps them learn faster and with less frustration.

Possible advocacy or upgrade signals:

- User shares the platform with another learner
- User asks for more lessons
- User joins a beta program
- User upgrades for advanced AI tutor usage or practice labs in the future
- User recommends the platform to a team lead

### Key Friction Points

The beginner may drop off if:

- The platform feels too advanced
- The first lesson is too long
- IBM i terminology is not explained clearly
- The AI tutor gives overly technical answers
- The user does not know what to do next
- Progress is not visible
- The product feels like just another article website

### Product Requirements Implied by This Journey

The product should provide:

- Beginner onboarding
- Clear learning paths
- Simple first lesson
- Glossary support
- AI tutor with beginner-friendly behavior
- Progress tracking
- Next-step recommendations
- Low-friction account creation

---

## Journey 2: Working IBM i Developer

### User Context

The Working IBM i Developer already works with IBM i systems and wants practical help.

This user may not need beginner-level content every time. They want faster explanations, code understanding, job log support, and productivity assistance.

### Stage 1: Awareness

The user may discover IBMiHub AI through:

- LinkedIn posts about IBM i AI tools
- A shared demo video
- IBM i community discussion
- Search for RPGLE, CLLE, DDS, or job log explanation
- Recommendation from another developer
- A practical article about IBM i productivity

At this stage, the user is likely asking:

- Can this help me with real IBM i work?
- Is this more useful than a generic AI chatbot?
- Can it explain RPGLE or CLLE clearly?
- Can it help with job logs or documentation?
- Is it trustworthy?

### Stage 2: Evaluation

The user evaluates whether the platform is practical or only beginner-focused.

The product must quickly show:

- IBM i-specific depth
- Practical examples
- AI tutor usefulness
- RPGLE, CLLE, SQL, DDS, and job log relevance
- Trust boundaries
- Clear positioning as both learning and productivity support

The user should feel that the product respects experienced IBM i professionals.

### Stage 3: Onboarding

The user may choose a path such as:

- "I am new to IBM i"
- "I already work with IBM i"
- "I want help understanding code or logs"
- "I want to refresh concepts"

For MVP, the product may keep this simple, but it should avoid forcing all users through beginner-only content.

### Stage 4: Activation

The first meaningful value occurs when the user gets a useful answer or explanation that saves time.

Examples of activation moments:

- User asks the AI tutor about an RPGLE concept
- User gets a clear explanation of a CLLE command or flow
- User refreshes an IBM i concept quickly
- User finds a lesson or explanation relevant to current work
- User sees that the platform is more focused than generic search

Activation is successful when the user thinks:

"This can save me time during real IBM i work."

### Stage 5: Engagement

The working developer returns when the platform becomes useful for recurring tasks.

Engagement may include:

- Asking AI tutor questions
- Looking up IBM i concepts
- Reviewing RPGLE or CLLE explanations
- Learning modern IBM i tooling practices
- Revisiting advanced topics
- Using future code, job log, or documentation tools

The product should make repeated use easy and fast.

### Stage 6: Expansion

As the user trusts the platform, they may explore:

- Advanced RPGLE topics
- CLLE workflows
- SQLRPGLE and DB2 for i concepts
- Job log analysis
- Documentation generation
- Modernization content
- Future productivity tools
- Team onboarding features

Expansion should be based on actual user demand and measured engagement.

### Stage 7: Advocacy or Upgrade

The working developer may become a strong advocate if the platform saves time.

Possible advocacy or upgrade signals:

- User shares it with teammates
- User recommends it to juniors
- User uses it during support or analysis
- User upgrades for advanced AI usage or tools
- User asks for team features
- User provides product feedback

### Key Friction Points

The working developer may drop off if:

- The product feels too basic
- AI explanations are generic or inaccurate
- The platform does not understand IBM i terminology
- The workflow is slower than using a generic AI tool
- The product lacks trust indicators
- There is no clear productivity value
- Advanced use cases are promised too early but not delivered well

### Product Requirements Implied by This Journey

The product should provide:

- IBM i-specific AI tutor behavior
- Practical explanations
- Advanced topic discovery
- Fast access to useful content
- Clear trust boundaries
- Future support for code, job logs, and documentation
- Separation between beginner and professional user flows

---

## Journey 3: Team Lead / Mentor

### User Context

The Team Lead or Mentor wants to reduce onboarding burden and help team members become productive faster.

This user may not be the first daily user of the MVP, but they can influence adoption.

### Journey Summary

The team lead discovers IBMiHub AI through community activity, a recommendation, or seeing a junior developer use it.

They evaluate whether the platform can support onboarding and reduce repeated questions.

They may start by reviewing beginner learning paths, AI tutor behavior, and content quality.

If the product proves useful, they may recommend it to juniors or use it as part of informal onboarding.

### Success Moment

The success moment for this persona is:

"This can help my team members learn basics before coming to me."

### Future Product Opportunities

This journey may later require:

- Team learning paths
- Progress visibility
- Shareable lesson links
- Internal onboarding tracks
- Admin dashboards
- Team plans

These should not dominate the first MVP but should inform future design.

---

## Journey 4: IBM i Architect / Consultant

### User Context

The IBM i Architect or Consultant needs to understand complex systems, explain legacy behavior, and support modernization.

This user is experienced and expects accuracy, depth, and control.

### Journey Summary

The architect discovers IBMiHub AI through AI productivity positioning, IBM i modernization content, or peer recommendation.

They evaluate whether the platform can assist with code understanding, documentation, job logs, and modernization topics.

They may initially test the platform with conceptual questions or sample code before trusting it for deeper analysis.

### Success Moment

The success moment for this persona is:

"This can accelerate analysis and documentation without replacing expert judgment."

### Future Product Opportunities

This journey may later require:

- Advanced code analysis
- Application flow documentation
- Job log interpretation
- Modernization learning paths
- Architecture-level explanations
- Strong privacy and data handling controls

This is a high-value future persona but not the first MVP focus.

---

## Journey 5: Enterprise Training Buyer

### User Context

The Enterprise Training Buyer is interested in team training, onboarding, knowledge transfer, and measurable learning outcomes.

This user is more likely to engage after the product has proof of individual value.

### Journey Summary

The buyer may discover IBMiHub AI through employee recommendation, founder outreach, LinkedIn content, or a demo.

They evaluate whether the platform can reduce onboarding time, standardize learning, and support team capability building.

They will likely require evidence of content quality, product reliability, privacy, security, and measurable training outcomes.

### Success Moment

The success moment for this persona is:

"This could reduce onboarding effort and help us build IBM i capability at scale."

### Future Product Opportunities

This journey may later require:

- Enterprise plans
- Team accounts
- Admin dashboards
- Progress reports
- Role-based learning paths
- Privacy and security controls
- Procurement support
- Corporate onboarding packages

This persona is important for monetization but should be treated as a future buyer journey.

---

## Journey 6: Interview Candidate / Career Switcher

### User Context

The Interview Candidate or Career Switcher wants to learn enough IBM i to prepare for job opportunities.

This user may be motivated, time-sensitive, and focused on practical readiness.

### Journey Summary

The user may discover IBMiHub AI through search, LinkedIn, career advice, or interview preparation content.

They evaluate whether the platform can help them understand IBM i concepts and prepare for interviews.

They may begin with beginner lessons, then move into quizzes, common questions, and practical scenarios.

### Success Moment

The success moment for this persona is:

"I feel more confident preparing for an IBM i role."

### Future Product Opportunities

This journey may later require:

- Interview preparation paths
- Question banks
- Mock assessments
- Skill readiness scores
- Certification or completion badges
- Practical scenario practice

This persona can support future monetization but should remain secondary to the core learning and developer journeys.

---

## MVP Journey Prioritization

For the first MVP, the product should prioritize:

| Priority | Journey | Reason |
|---|---|---|
| 1 | Beginner IBM i Learner Journey | Validates structured learning and onboarding |
| 2 | Working IBM i Developer Journey | Validates AI assistance and productivity usefulness |
| 3 | Team Lead / Mentor Journey | Supports future onboarding and team adoption |
| 4 | Interview Candidate Journey | Supports future learning monetization |
| 5 | Architect / Consultant Journey | Supports future advanced productivity tools |
| 6 | Enterprise Buyer Journey | Supports future enterprise monetization |

The MVP should not attempt to fully serve all journeys.

It should serve the first two journeys well enough to validate demand, trust, and repeated usage.

---

## Key Journey Design Principles

Across all journeys, IBMiHub AI should:

- Make the next step clear
- Avoid overwhelming new users
- Separate beginner and experienced user needs
- Provide meaningful value quickly
- Use AI where it improves learning or productivity
- Maintain trust boundaries around AI output
- Encourage continued learning and practice
- Avoid over-promising advanced functionality before it exists

---

## Summary

User journeys show that IBMiHub AI must support both learning and productivity.

The first MVP should focus on helping beginners start confidently and helping working developers get useful IBM i-specific explanations.

If those journeys are successful, the product can gradually expand into team onboarding, interview preparation, architecture support, enterprise training, practice labs, and advanced productivity tools.

---

## 11. Product Scope

### Purpose of This Section

The purpose of this section is to define the boundary of IBMiHub AI across the MVP, later releases, and long-term platform vision.

IBMiHub AI has a broad long-term vision, but the product must be built in focused stages. The goal is not to build every possible module immediately. The goal is to start with a narrow, useful, trusted MVP and then expand based on user validation.

This section defines:

- What is in scope for the product overall
- What is in scope for the first MVP
- What is planned for later phases
- What is explicitly out of scope for now

### Scope Philosophy

IBMiHub AI should start narrow and grow carefully.

The first version should prove that users find value in a focused AI-powered IBM i learning and assistance experience. Advanced modules such as 5250 practice labs, RPG playgrounds, job log analyzers, documentation generators, enterprise training, and certifications are part of the long-term vision, but they should not overload the first release.

The product should follow these scope principles:

- Build the smallest useful version first.
- Prioritize learning and AI tutor value before advanced tools.
- Avoid real IBM i connectivity in the initial MVP.
- Avoid enterprise complexity until individual value is validated.
- Do not build features only because they sound impressive.
- Expand only when there is evidence of user demand.
- Keep the platform extensible so future modules can be added cleanly.

---

### Full Product Scope

The complete long-term product vision may include the following modules.

| Module | Description | Phase |
|---|---|---|
| Learning Center | Structured IBM i learning paths and lessons | MVP |
| AI Tutor | IBM i-focused AI assistant for learning and explanations | MVP |
| User Dashboard | User home, progress, next steps, and activity summary | MVP |
| Progress Tracking | Track lesson completion and learning activity | MVP |
| Basic Quizzes / Checks | Simple knowledge checks to support learning | MVP / Early Post-MVP |
| Glossary | Definitions of IBM i terms and concepts | MVP / Early Post-MVP |
| 5250 Practice Lab | Simulated 5250 learning workflows | Post-MVP |
| RPGLE / CLLE Practice | Practice exercises for RPGLE and CLLE concepts | Post-MVP |
| RPG Playground | Future safe environment for code-oriented practice | Future |
| Job Log Analyzer | AI-assisted job log explanation and troubleshooting | Future |
| Code Explanation / Review | AI-assisted explanation of RPGLE, CLLE, SQL, and DDS code | Future |
| Documentation Generator | Generate documentation from code, notes, or system behavior | Future |
| Interview Preparation | IBM i interview questions, quizzes, and readiness paths | Future |
| Certification / Assessment | Skill validation, badges, or certificates | Future |
| Team Learning | Team accounts, learning assignments, and shared progress | Future |
| Enterprise Training | Corporate onboarding, progress reporting, privacy controls | Future |
| Community | Knowledge sharing, discussions, and expert contributions | Future |
| Mobile App | Mobile companion experience | Future |
| VS Code Extension | Developer workflow integration | Future |

---

## MVP Scope

The MVP should focus on proving the core value proposition:

**A structured IBM i learning platform with AI-assisted guidance.**

The MVP should serve the first two primary personas:

1. Beginner IBM i Learner
2. Working IBM i Developer

The MVP should help beginners start learning IBM i with confidence and help working developers get IBM i-specific explanations faster.

### MVP In-Scope Features

The first MVP should include the following product capabilities.

---

### 1. Public Landing Experience

The product should have a clear public-facing entry point that explains what IBMiHub AI is and who it is for.

In scope:

- Clear product positioning
- Explanation of IBM i learning and AI assistance value
- Basic call-to-action to start learning or join beta
- Founder-led credibility and product story
- Simple description of MVP capabilities

Out of scope for MVP:

- Complex marketing site
- Full blog platform
- Customer case studies
- Enterprise sales pages
- Advanced SEO content engine

---

### 2. User Account and Basic Onboarding

The MVP should allow users to create an account or access a basic user experience.

In scope:

- Simple sign-up / login experience
- Basic onboarding question about user type or experience level
- Beginner vs experienced user path selection if feasible
- Clear first recommended action
- Low-friction start experience

Out of scope for MVP:

- Enterprise single sign-on
- Organization-level user management
- Complex role-based access
- Admin controls
- Team invitations

---

### 3. User Dashboard

The dashboard should give users a clear place to continue their learning.

In scope:

- Welcome message
- Current learning path
- Next recommended lesson
- Basic progress summary
- Recent activity if available
- Quick access to AI tutor

Out of scope for MVP:

- Advanced analytics
- Team progress dashboards
- Admin reporting
- Enterprise training reports
- Complex personalization engine

---

### 4. Learning Center

The Learning Center is the core MVP module.

It should provide structured IBM i learning content rather than disconnected articles.

In scope:

- Beginner IBM i learning path
- Initial set of original lessons
- Topic grouping by learning sequence
- Clear lesson titles and descriptions
- Simple lesson navigation
- Practical explanations and examples
- Content written in original IBMiHub AI style

Initial learning topics may include:

- What is IBM i
- IBM i basic terminology
- Libraries and objects
- 5250 screen basics
- Physical files and logical files
- Introduction to RPGLE
- Introduction to CLLE
- Introduction to DB2 for i
- Job logs and spool files basics
- Basic IBM i development workflow

Out of scope for MVP:

- Large full curriculum
- Advanced certification paths
- Paid course bundles
- Multi-language content
- Instructor-led training
- User-generated courses

---

### 5. AI Tutor

The AI Tutor is a core MVP differentiator.

It should help users ask IBM i-related questions and receive guided explanations.

In scope:

- IBM i-focused question answering
- Beginner-friendly explanations
- RPGLE, CLLE, SQL, DDS, 5250, and job log conceptual help
- Contextual assistance related to learning topics
- Safe disclaimers and trust boundaries
- Encouragement to validate AI output for real production use
- Feedback option for helpful / not helpful responses

Out of scope for MVP:

- Uploading private production source code
- Uploading sensitive job logs
- Automated production troubleshooting
- Guaranteed correctness claims
- Direct connection to IBM i systems
- Autonomous code changes
- Enterprise AI governance controls

---

### 6. Basic Progress Tracking

The MVP should track enough progress to help users continue learning.

In scope:

- Lesson started / completed state
- Learning path progress
- Basic user progress display
- Continue learning recommendation

Out of scope for MVP:

- Detailed learning analytics
- Team progress tracking
- Skill scoring engine
- Certification progress
- Manager reporting

---

### 7. Basic Feedback Collection

The MVP should collect feedback from early users.

In scope:

- Lesson feedback
- AI response helpfulness feedback
- General product feedback
- Beta user feedback signals
- Simple contact or feedback form

Out of scope for MVP:

- Full support ticketing system
- Public community forum
- Enterprise customer success workflow
- Advanced analytics dashboards

---

### 8. Basic Content Governance

The MVP should ensure that learning content remains original, clear, and maintainable.

In scope:

- Original content only
- Clear lesson structure
- Review process before publishing important content
- Content versioning through Git or documentation workflow
- Avoid copying external tutorials or documentation

Out of scope for MVP:

- Full content management system
- Multi-author publishing workflow
- Editorial approval dashboard
- Marketplace for user-submitted content

---

## Early Post-MVP Scope

The early post-MVP phase should expand only after the MVP validates user interest.

Possible early post-MVP features include:

### 1. Expanded Learning Paths

- RPGLE fundamentals path
- CLLE fundamentals path
- DB2 for i / SQL path
- 5250 workflow path
- Job log basics path
- Modern IBM i tooling path

### 2. Quizzes and Knowledge Checks

- Lesson-level quizzes
- Topic-level checks
- Beginner skill confidence indicators
- Review recommendations based on weak areas

### 3. Glossary and Concept Explorer

- IBM i terminology glossary
- Linked terms inside lessons
- Beginner-friendly definitions
- Searchable concept index

### 4. Improved AI Tutor Context

- AI tutor connected more closely to lesson context
- Suggested questions per lesson
- Better beginner vs experienced response styles
- AI answer feedback loop

### 5. Early Practice Experiences

- Guided command examples
- Simulated job log reading exercises
- Simple RPGLE and CLLE interpretation exercises
- Non-production practice scenarios

---

## Later Product Scope

Later product phases may include more advanced learning, practice, and productivity capabilities.

### 1. 5250 Practice Lab

A simulated 5250 practice experience where users can learn common IBM i workflows safely.

Potential capabilities:

- Simulated command line
- Guided command exercises
- Navigation examples
- Object and library practice scenarios
- Step-by-step workflows
- No real production system connection in early versions

### 2. RPGLE and CLLE Practice

Practice experiences for IBM i programming concepts.

Potential capabilities:

- Code reading exercises
- Syntax interpretation
- Simple coding challenges
- CL command flow understanding
- Debugging-style scenarios
- AI-assisted explanations

### 3. Job Log Analyzer

An AI-assisted tool for understanding job logs.

Potential capabilities:

- Paste sample job log text
- Explain key messages
- Identify likely error areas
- Suggest investigation steps
- Teach users how to read job logs

This should require strong privacy and trust boundaries before supporting real user uploads.

### 4. Code Explanation and Review

AI-assisted explanation of RPGLE, CLLE, SQLRPGLE, DDS, and related IBM i code.

Potential capabilities:

- Explain code snippets
- Summarize program behavior
- Identify important logic
- Explain file usage
- Suggest documentation notes
- Teach users how to read legacy code

This should not be positioned as automatic production-safe code review without human validation.

### 5. Documentation Generator

A tool to help create readable documentation from code, notes, logs, or manually supplied context.

Potential capabilities:

- Program summaries
- Process documentation
- Technical notes
- Onboarding explanations
- Legacy system documentation support

### 6. Interview Preparation

Learning paths and assessments for users preparing for IBM i jobs.

Potential capabilities:

- Interview question banks
- Topic-wise practice
- Mock quizzes
- Scenario-based questions
- Readiness indicators

### 7. Team and Enterprise Learning

Capabilities for organizations that want to train teams.

Potential capabilities:

- Team accounts
- Assigned learning paths
- Progress dashboards
- Role-based learning
- Corporate onboarding tracks
- Admin controls
- Enterprise privacy and security features

### 8. Community and Ecosystem Features

Possible future community capabilities.

Potential capabilities:

- Discussion spaces
- Expert Q&A
- User-submitted questions
- Community learning requests
- Content suggestions

Community features should only be added when moderation and quality control can be handled properly.

---

## Explicitly Out of Scope for MVP

The following items should not be part of the first MVP:

- Real IBM i system connectivity
- Live 5250 terminal connected to production or customer systems
- Real code compilation or execution
- Uploading private production code
- Uploading sensitive production job logs
- Full RPG playground
- Full job log analyzer
- Full documentation generator
- Enterprise accounts
- Team dashboards
- Admin dashboards
- Paid subscriptions and billing
- Certifications
- Community forum
- Mobile app
- VS Code extension
- Marketplace
- Multi-language support
- Public API
- Enterprise SSO
- Advanced security/compliance workflows

These features may be considered later, but adding them too early would increase complexity and risk before the core product value is validated.

---

## Scope Boundaries

### Learning Scope

IBMiHub AI should focus on practical IBM i learning.

The learning scope includes:

- IBM i fundamentals
- RPGLE basics and practical explanations
- CLLE basics and practical explanations
- DDS and DB2 for i concepts
- 5250 concepts and workflows
- Job log and spool file basics
- Modern IBM i tooling concepts
- Beginner-to-practical progression

The learning scope should avoid trying to cover every advanced IBM i topic in the MVP.

### AI Scope

The AI scope should focus on learning and explanation.

The AI tutor should:

- Explain IBM i concepts
- Help users understand lessons
- Answer beginner and working-developer questions
- Provide practical examples
- Encourage validation of technical guidance
- Avoid overconfident production advice

The AI tutor should not:

- Claim guaranteed correctness
- Replace expert review
- Make production changes
- Connect to customer systems
- Encourage unsafe handling of private code or logs

### Practice Scope

Practice is important to the long-term product, but MVP practice should remain light.

The MVP may include simple examples, quizzes, or checks for understanding.

More advanced practice such as 5250 simulation, RPG exercises, and job log scenarios should be phased in later.

### Enterprise Scope

Enterprise value is part of the long-term vision, but it is not part of the MVP.

The MVP should be designed in a way that does not block future enterprise features, but it should not attempt to build enterprise functionality immediately.

---

## Scope Prioritization

For the first MVP, priority should be:

| Priority | Scope Area | Reason |
|---|---|---|
| 1 | Learning Center | Core product foundation |
| 2 | AI Tutor | Main differentiation |
| 3 | User Dashboard | Helps users continue learning |
| 4 | Progress Tracking | Supports engagement |
| 5 | Feedback Collection | Supports validation |
| 6 | Basic Quizzes / Checks | Useful but can be lightweight |
| 7 | Glossary | Useful but can grow gradually |

Advanced tools such as 5250 labs, job log analyzer, code explanation, documentation generator, enterprise training, and community should remain outside the first MVP.

---

## Summary

IBMiHub AI has a broad long-term vision, but the first release should remain focused.

The MVP should prove that users want a structured IBM i learning platform with AI-assisted guidance.

The initial scope should focus on learning, AI tutor, dashboard, progress tracking, and feedback. More advanced capabilities should be introduced only after the product validates demand, trust, and repeated usage.

---

## 12. MVP Definition

### Purpose of This Section

The purpose of this section is to define the exact first release of IBMiHub AI.

The MVP should be narrow, useful, and realistic. It should prove whether users want a structured IBM i learning platform with AI-assisted guidance before the product expands into advanced labs, code tools, job log analyzers, enterprise training, certifications, or community features.

This section defines:

- The approved MVP product experience
- The primary MVP users
- The MVP feature set
- The MVP exclusions
- The success criteria for MVP validation
- The conditions for moving beyond MVP

---

### MVP Statement

The MVP of IBMiHub AI is:

**A web-based IBM i learning and AI assistance platform that helps beginners and working IBM i developers start a structured learning path, ask IBM i-focused questions, track basic progress, and provide feedback.**

The MVP is not intended to be a complete IBM i training academy, full developer tool, enterprise platform, or production troubleshooting system.

The MVP should answer one core question:

**Do IBM i learners and professionals find enough value in a focused AI-assisted learning experience to return, engage, and ask for more?**

---

### MVP Target Users

The MVP will focus on two primary personas:

1. Beginner IBM i Learner
2. Working IBM i Developer

These personas were selected because they directly represent the two core early product promises:

- Learning IBM i should become easier and more structured.
- IBM i explanations and assistance should become faster and more accessible.

Other personas such as team leads, architects, enterprise buyers, and interview candidates remain important for future growth, but they should not drive first-release complexity.

---

### MVP Core Value Proposition

The MVP should deliver the following value:

For a beginner:

**"I now have a clear place to start learning IBM i, and I can ask questions when I get stuck."**

For a working IBM i developer:

**"I can quickly refresh IBM i concepts and get focused explanations without searching across scattered resources."**

For the product team:

**"We can validate whether a focused IBM i AI learning platform creates enough engagement and trust to justify further investment."**

---

### Approved MVP Feature Set

The first MVP should include the following approved features.

---

### 1. Public Landing Experience

The MVP should include a simple public landing page that explains the product clearly.

The landing experience should communicate:

- What IBMiHub AI is
- Who it is for
- Why IBM i learning needs a modern AI-assisted platform
- What users can do in the MVP
- How users can start learning or join the beta

The landing page should be simple and credible. It does not need to be a full marketing website.

MVP acceptance expectations:

- A visitor can understand the product within one minute.
- A visitor can identify whether the product is meant for them.
- A visitor has a clear next action.

---

### 2. User Account and Basic Onboarding

The MVP should provide a simple way for users to start using the platform.

The onboarding experience should be lightweight and should not create unnecessary friction.

In scope:

- Basic sign-up and login
- Basic user profile
- Simple onboarding question such as experience level
- Clear recommendation for first action
- Option to start with beginner learning path

Out of scope:

- Enterprise SSO
- Team accounts
- Role-based permissions
- Admin dashboards
- Organization management

MVP acceptance expectations:

- A user can create an account and reach the learning experience quickly.
- A beginner can understand where to start.
- An experienced user is not forced into an overly beginner-only experience.

---

### 3. User Dashboard

The MVP should include a simple dashboard that acts as the user's home base.

The dashboard should help the user continue learning instead of wondering what to do next.

In scope:

- Welcome message
- Current or recommended learning path
- Next recommended lesson
- Basic progress summary
- Quick access to AI Tutor
- Simple recent activity if feasible

Out of scope:

- Advanced analytics
- Team dashboards
- Personalized recommendation engine
- Enterprise reporting

MVP acceptance expectations:

- A returning user can quickly continue learning.
- The dashboard makes the next step obvious.
- The dashboard does not feel empty or confusing.

---

### 4. Learning Center

The Learning Center is the core MVP feature.

It should provide a structured IBM i learning path with original content.

In scope:

- Beginner IBM i learning path
- Original lessons written for IBMiHub AI
- Simple lesson navigation
- Clear lesson sequence
- Beginner-friendly explanations
- Practical examples
- Lesson completion tracking

The initial learning path should focus on IBM i fundamentals and should not attempt to cover the entire IBM i ecosystem.

Suggested initial lesson topics:

- What is IBM i?
- IBM i platform overview
- Libraries and objects
- 5250 screen basics
- Physical files and logical files
- Introduction to RPGLE
- Introduction to CLLE
- Introduction to DB2 for i
- Job logs and spool files basics
- Basic IBM i development workflow

Out of scope:

- Complete RPGLE course
- Complete CLLE course
- Full certification path
- Paid course bundles
- User-generated courses
- Instructor-led learning

MVP acceptance expectations:

- A beginner can complete the first few lessons without needing outside context.
- Lessons feel structured rather than random.
- Content is original and not copied from existing websites.
- Lessons are clear enough to build confidence.

---

### 5. AI Tutor

The AI Tutor is the main MVP differentiator.

It should help users ask IBM i-related questions and receive useful explanations.

In scope:

- IBM i-focused question answering
- Beginner-friendly explanations
- Practical explanations for RPGLE, CLLE, SQL, DDS, 5250, job logs, and IBM i concepts
- Support for questions related to learning content
- Clear trust boundaries
- Helpful / not helpful feedback option
- Encouragement to validate AI guidance for real production use

Out of scope:

- Uploading private production code
- Uploading sensitive production logs
- Direct IBM i system connectivity
- Automatic code changes
- Production troubleshooting guarantees
- Enterprise AI governance controls
- Claims of guaranteed correctness

MVP acceptance expectations:

- Users can ask IBM i questions in natural language.
- Responses are understandable and useful.
- The AI Tutor does not behave like a generic chatbot with no IBM i context.
- AI output includes appropriate caution where needed.
- Users can provide feedback on response quality.

---

### 6. Basic Progress Tracking

The MVP should include lightweight progress tracking.

Progress tracking is important because IBMiHub AI is intended to be a learning platform, not just a content site.

In scope:

- Lesson started state
- Lesson completed state
- Learning path progress
- Dashboard progress display
- Continue learning indication

Out of scope:

- Skill scoring engine
- Certification progress
- Team progress tracking
- Detailed learning analytics
- Manager reports

MVP acceptance expectations:

- Users can see what they have completed.
- Users can continue from where they left off.
- Progress creates a sense of learning continuity.

---

### 7. Basic Feedback Collection

The MVP should collect early feedback from real users.

Feedback is required to validate whether the product is useful and what should be built next.

In scope:

- Lesson helpfulness feedback
- AI response helpfulness feedback
- General product feedback
- Simple contact or beta feedback form
- Ability to capture common user requests

Out of scope:

- Full support ticketing system
- Public community forum
- Enterprise customer success workflow
- Advanced feedback analytics

MVP acceptance expectations:

- Users can easily provide feedback.
- Product owner can identify common issues and requests.
- Feedback can guide post-MVP priorities.

---

### 8. Basic Content Governance

The MVP should include a simple process to protect content quality and originality.

In scope:

- Original content only
- Clear lesson structure
- Manual review before publishing important content
- Version control for content
- Avoid copying tutorials, documentation, or examples from other websites

Out of scope:

- Full CMS
- Editorial approval dashboard
- Multi-author publishing workflow
- User-submitted lessons
- Content marketplace

MVP acceptance expectations:

- Content is traceable and maintainable.
- Lessons follow a consistent structure.
- The platform avoids legal and ethical risk from copied content.

---

### MVP Explicit Exclusions

The following are explicitly excluded from the MVP:

- Real IBM i system connectivity
- Live 5250 terminal connected to any IBM i system
- Real code compilation or execution
- Uploading production source code
- Uploading sensitive job logs
- Full RPG playground
- Full 5250 practice lab
- Full job log analyzer
- Full code review tool
- Full documentation generator
- Enterprise accounts
- Team dashboards
- Admin dashboards
- Billing and paid subscriptions
- Certifications
- Community forum
- Mobile app
- VS Code extension
- Public API
- Enterprise SSO
- Advanced compliance workflows

These items may be considered later, but they should not be part of the first release.

---

### MVP User Experience Flow

The first MVP user flow should be simple:

1. User discovers IBMiHub AI.
2. User understands the product from the landing page.
3. User signs up or enters the beta experience.
4. User selects or is guided into a beginner or working-developer path.
5. User lands on dashboard.
6. User starts the first recommended lesson.
7. User asks the AI Tutor a question when needed.
8. User completes lesson or marks progress.
9. User returns later and continues learning.
10. User provides feedback.

This flow should be easy to understand and should not require advanced setup.

---

### MVP Success Criteria

The MVP should be considered successful if it demonstrates early evidence that users find the platform valuable.

Success indicators include:

- Users understand the product value quickly.
- Users start the beginner learning path.
- Users complete at least one lesson.
- Users ask meaningful AI Tutor questions.
- Users return for additional learning sessions.
- Users provide positive qualitative feedback.
- Users ask for more lessons or advanced features.
- IBM i professionals show interest through direct feedback, sharing, or beta requests.

The MVP does not need to prove full monetization immediately.

The MVP needs to prove that the product direction is valuable enough to continue.

---

### MVP Validation Questions

The MVP should help answer these questions:

- Do beginners find the learning path understandable?
- Do users trust the AI Tutor enough to ask questions?
- Do working developers find the explanations practical?
- Do users return after the first session?
- Which topics attract the most engagement?
- Which AI Tutor questions are most common?
- Where do users get confused?
- What advanced features do users request first?
- Is there evidence of willingness to pay later?

---

### MVP Quality Bar

Even though the MVP is narrow, it should still feel professional.

The MVP should be:

- Clear
- Fast enough for comfortable use
- Simple to navigate
- Trustworthy
- Original in content
- Beginner-friendly
- Useful for real IBM i learning
- Safe in its AI boundaries
- Easy to improve based on feedback

The MVP should not feel like a random collection of AI-generated pages.

---

### MVP Release Readiness Checklist

The MVP should not be considered ready until:

- Landing page clearly explains the product.
- User can sign up or access the learning experience.
- Dashboard provides a clear next step.
- Initial learning path is available.
- First lessons are reviewed and original.
- AI Tutor is available with appropriate boundaries.
- Progress tracking works at a basic level.
- Feedback collection is available.
- Out-of-scope risky features are not accidentally included.
- Product owner has reviewed and approved the release.

---

### Post-MVP Expansion Triggers

The team should consider expanding beyond MVP only when there is evidence of real user value.

Expansion may be justified when:

- Users return repeatedly.
- Users complete lessons.
- Users ask meaningful AI Tutor questions.
- Users request hands-on practice.
- Users request more advanced RPGLE, CLLE, or job log content.
- Working developers request productivity tools.
- Team leads show interest in onboarding use cases.
- There is early evidence of willingness to pay.

Post-MVP expansion should be driven by evidence, not excitement alone.

---

### Summary

The MVP of IBMiHub AI should be a focused, web-based IBM i learning and AI assistance experience.

The first release should include a public landing experience, basic onboarding, user dashboard, Learning Center, AI Tutor, progress tracking, feedback collection, and basic content governance.

The MVP should not include real IBM i connectivity, production code uploads, advanced labs, enterprise features, billing, certifications, community, mobile app, or VS Code extension.

The goal of the MVP is to validate trust, engagement, learning value, and AI usefulness before expanding into more advanced product capabilities.

---

## 13. Functional Requirements

### Purpose of This Section

The purpose of this section is to define what IBMiHub AI must do at the product requirements level.

This section does not define technical architecture, database design, APIs, UI components, or implementation details. Those will be defined later in SDD specifications, architecture documents, implementation plans, and task lists.

Functional requirements in this section should guide future SDD specs and Sprint 1 planning.

### Requirement Scope

The requirements in this section focus on the approved MVP.

The MVP includes:

- Public Landing Experience
- User Account and Basic Onboarding
- User Dashboard
- Learning Center
- AI Tutor
- Basic Progress Tracking
- Basic Feedback Collection
- Basic Content Governance

Future modules such as 5250 Practice Lab, RPG Playground, Job Log Analyzer, Code Explanation, Documentation Generator, Enterprise Training, Community, Mobile App, and VS Code Extension are not part of the MVP functional requirements.

They may be defined in future PRD updates or downstream feature specs after MVP validation.

---

## 13.1 Functional Requirement Categories

| Category | MVP Status | Purpose |
|---|---|---|
| Public Landing Experience | In Scope | Explain product value and guide users to start |
| Authentication & Account | In Scope | Allow users to access a personalized experience |
| Basic Onboarding | In Scope | Understand user type and guide first action |
| User Dashboard | In Scope | Help users continue learning |
| Learning Center | In Scope | Deliver structured IBM i learning content |
| Lesson Experience | In Scope | Let users read, navigate, and complete lessons |
| AI Tutor | In Scope | Provide IBM i-focused AI assistance |
| Progress Tracking | In Scope | Track basic learning progress |
| Feedback Collection | In Scope | Capture lesson, AI, and product feedback |
| Content Governance | In Scope | Protect originality, consistency, and quality |
| Admin / Internal Content Management | Limited MVP Scope | Manage content through simple internal process |
| Enterprise Features | Out of Scope | Future only |
| Real IBM i Connectivity | Out of Scope | Future consideration only |
| Billing / Payments | Out of Scope | Future only |

---

## 13.2 Public Landing Experience Requirements

### Objective

The public landing experience should clearly communicate what IBMiHub AI is, who it is for, and what users can do next.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-LAND-001 | The product must provide a public landing page accessible without login. | Must Have |
| FR-LAND-002 | The landing page must explain that IBMiHub AI is an AI-assisted learning platform for IBM i professionals. | Must Have |
| FR-LAND-003 | The landing page must identify the primary target users: beginners and working IBM i developers. | Must Have |
| FR-LAND-004 | The landing page must communicate the MVP value: structured learning and IBM i-focused AI assistance. | Must Have |
| FR-LAND-005 | The landing page must include a clear call-to-action to start learning, sign up, or join beta. | Must Have |
| FR-LAND-006 | The landing page should briefly mention future product direction without implying those features are available in the MVP. | Should Have |
| FR-LAND-007 | The landing page should communicate trust principles such as original content, AI boundaries, and IBM i-specific focus. | Should Have |

### Acceptance Expectations

- A new visitor can understand the product purpose within one minute.
- A visitor can identify whether the product is relevant to them.
- The landing page does not overpromise unavailable future features.

---

## 13.3 Authentication and User Account Requirements

### Objective

The MVP should allow users to access a basic personalized learning experience.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-001 | The product must allow a user to create an account or access an approved beta user experience. | Must Have |
| FR-AUTH-002 | The product must allow a user to log in after account creation. | Must Have |
| FR-AUTH-003 | The product must maintain a basic user profile. | Must Have |
| FR-AUTH-004 | The product must associate learning progress with the user account. | Must Have |
| FR-AUTH-005 | The product should allow users to update basic profile information if feasible. | Should Have |
| FR-AUTH-006 | The product should support a simple logout flow. | Should Have |

### Out of Scope

The MVP does not require:

- Enterprise SSO
- Team accounts
- Organization management
- Admin roles
- Role-based permissions
- Complex identity governance

### Acceptance Expectations

- A user can access the learning experience without unnecessary friction.
- User progress can be associated with the correct user.
- Authentication does not introduce enterprise complexity.

---

## 13.4 Basic Onboarding Requirements

### Objective

The onboarding experience should help users start from the right place.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-ONB-001 | The product must provide a simple onboarding step for new users. | Must Have |
| FR-ONB-002 | The onboarding step must ask the user about their experience level or learning intent. | Must Have |
| FR-ONB-003 | The product must guide beginner users toward the beginner IBM i learning path. | Must Have |
| FR-ONB-004 | The product should allow experienced users to indicate that they already work with IBM i. | Should Have |
| FR-ONB-005 | The onboarding flow must show the user a clear first recommended action. | Must Have |
| FR-ONB-006 | The onboarding flow must avoid presenting too many modules or choices in the MVP. | Must Have |

### Acceptance Expectations

- A beginner knows where to start.
- A working developer is not forced into an overly beginner-only journey.
- The onboarding experience is short and easy to complete.

---

## 13.5 User Dashboard Requirements

### Objective

The dashboard should act as the user's home base and help them continue learning.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-DASH-001 | The product must provide a dashboard after login or entry into the learning experience. | Must Have |
| FR-DASH-002 | The dashboard must show a welcome message or user-specific greeting. | Must Have |
| FR-DASH-003 | The dashboard must show the current or recommended learning path. | Must Have |
| FR-DASH-004 | The dashboard must show the next recommended lesson. | Must Have |
| FR-DASH-005 | The dashboard must show basic progress information. | Must Have |
| FR-DASH-006 | The dashboard must provide quick access to the AI Tutor. | Must Have |
| FR-DASH-007 | The dashboard should show recent learning activity if available. | Should Have |
| FR-DASH-008 | The dashboard should provide a simple way to resume learning. | Should Have |

### Out of Scope

The MVP dashboard does not include:

- Team progress
- Admin reporting
- Advanced analytics
- Enterprise dashboards
- Complex personalization

### Acceptance Expectations

- A returning user can quickly continue from where they left off.
- The dashboard makes the next step obvious.
- The dashboard supports learning continuity.

---

## 13.6 Learning Center Requirements

### Objective

The Learning Center should provide structured, original IBM i learning content.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-LEARN-001 | The product must provide a Learning Center. | Must Have |
| FR-LEARN-002 | The Learning Center must include at least one beginner IBM i learning path. | Must Have |
| FR-LEARN-003 | The learning path must present lessons in a logical sequence. | Must Have |
| FR-LEARN-004 | The Learning Center must use original IBMiHub AI content. | Must Have |
| FR-LEARN-005 | The Learning Center must include lesson titles and short descriptions. | Must Have |
| FR-LEARN-006 | The Learning Center must allow users to open and read lessons. | Must Have |
| FR-LEARN-007 | The Learning Center must allow users to move between lessons. | Must Have |
| FR-LEARN-008 | The Learning Center should group lessons by topic or learning stage. | Should Have |
| FR-LEARN-009 | The Learning Center should support beginner and working-developer entry points where feasible. | Should Have |

### Initial MVP Lesson Topics

The initial learning path may include:

- What is IBM i?
- IBM i platform overview
- Libraries and objects
- 5250 screen basics
- Physical files and logical files
- Introduction to RPGLE
- Introduction to CLLE
- Introduction to DB2 for i
- Job logs and spool files basics
- Basic IBM i development workflow

### Acceptance Expectations

- A beginner can follow the learning path without guessing what to learn next.
- Lessons feel structured rather than random.
- Content is original and aligned to the product voice.

---

## 13.7 Lesson Experience Requirements

### Objective

The lesson experience should make learning clear, practical, and easy to continue.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-LESSON-001 | Each lesson must have a clear title. | Must Have |
| FR-LESSON-002 | Each lesson must explain its learning objective. | Must Have |
| FR-LESSON-003 | Each lesson must provide beginner-friendly explanations where appropriate. | Must Have |
| FR-LESSON-004 | Each lesson should include practical IBM i examples or scenarios. | Should Have |
| FR-LESSON-005 | Each lesson must allow the user to mark it as complete. | Must Have |
| FR-LESSON-006 | Each lesson should provide a next-step recommendation. | Should Have |
| FR-LESSON-007 | Each lesson should provide quick access to the AI Tutor. | Should Have |
| FR-LESSON-008 | Each lesson should allow users to provide helpfulness feedback. | Should Have |

### Acceptance Expectations

- Lessons are easy to read and understand.
- Users know what they learned and what to do next.
- Lessons support both confidence and continuity.

---

## 13.8 AI Tutor Requirements

### Objective

The AI Tutor should provide IBM i-focused learning and explanation support.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-AI-001 | The product must provide an AI Tutor experience. | Must Have |
| FR-AI-002 | The AI Tutor must allow users to ask IBM i-related questions in natural language. | Must Have |
| FR-AI-003 | The AI Tutor must support beginner-friendly explanations. | Must Have |
| FR-AI-004 | The AI Tutor must support questions related to IBM i concepts, RPGLE, CLLE, SQL, DDS, 5250, job logs, and learning content. | Must Have |
| FR-AI-005 | The AI Tutor must communicate appropriate caution for production use. | Must Have |
| FR-AI-006 | The AI Tutor must not claim guaranteed correctness. | Must Have |
| FR-AI-007 | The AI Tutor must not encourage unsafe sharing of private production code or sensitive logs. | Must Have |
| FR-AI-008 | The AI Tutor should provide responses in a clear, practical, and structured style. | Should Have |
| FR-AI-009 | The AI Tutor should support follow-up questions. | Should Have |
| FR-AI-010 | The AI Tutor should allow users to mark responses as helpful or not helpful. | Should Have |
| FR-AI-011 | The AI Tutor should be accessible from the dashboard and lesson experience. | Should Have |

### Out of Scope

The MVP AI Tutor does not include:

- Real IBM i connectivity
- Production troubleshooting guarantees
- Uploading private source code
- Uploading sensitive job logs
- Automatic code changes
- Enterprise AI governance workflows
- Autonomous system actions

### Acceptance Expectations

- Users can ask meaningful IBM i questions.
- AI responses are useful and understandable.
- AI behavior respects trust and safety boundaries.
- The AI Tutor feels focused on IBM i, not like a generic chatbot.

---

## 13.9 Progress Tracking Requirements

### Objective

Progress tracking should help users continue learning over time.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-PROG-001 | The product must track lesson completion status. | Must Have |
| FR-PROG-002 | The product must show learning path progress. | Must Have |
| FR-PROG-003 | The product must allow users to resume from where they left off. | Must Have |
| FR-PROG-004 | The dashboard must display basic progress information. | Must Have |
| FR-PROG-005 | The product should track lesson started state if feasible. | Should Have |
| FR-PROG-006 | The product should track recent learning activity if feasible. | Should Have |

### Out of Scope

The MVP does not include:

- Skill scoring engine
- Certification progress
- Team progress tracking
- Manager reporting
- Advanced analytics

### Acceptance Expectations

- Users can see what they have completed.
- Users can continue learning without losing context.
- Progress tracking remains simple and understandable.

---

## 13.10 Feedback Collection Requirements

### Objective

The product should collect early user feedback to support MVP validation and future prioritization.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-FB-001 | The product must provide a way for users to submit general feedback. | Must Have |
| FR-FB-002 | The product should allow users to rate or mark lesson helpfulness. | Should Have |
| FR-FB-003 | The product should allow users to rate AI Tutor responses as helpful or not helpful. | Should Have |
| FR-FB-004 | The product should capture feedback context where appropriate, such as lesson or AI response. | Should Have |
| FR-FB-005 | The product should allow users to request topics or features. | Should Have |

### Acceptance Expectations

- Users can easily submit feedback.
- Product owner can identify recurring issues or requests.
- Feedback supports evidence-driven post-MVP decisions.

---

## 13.11 Content Governance Requirements

### Objective

Content governance should ensure that learning content is original, consistent, and maintainable.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-CONT-001 | All published learning content must be original to IBMiHub AI. | Must Have |
| FR-CONT-002 | Content must not copy tutorials, articles, examples, or course material from other websites or providers. | Must Have |
| FR-CONT-003 | Content should follow a consistent lesson structure. | Should Have |
| FR-CONT-004 | Important learning content should be reviewed before publishing. | Should Have |
| FR-CONT-005 | Content should be version-controlled or otherwise traceable. | Should Have |
| FR-CONT-006 | External references, when used for research or validation, should be credited where applicable. | Should Have |

### Acceptance Expectations

- Content quality is controlled.
- Content is original and legally safer.
- The product does not depend on copied material.

---

## 13.12 Basic Quiz / Knowledge Check Requirements

### Objective

Basic quizzes or knowledge checks may support learning validation in the MVP or early post-MVP phase.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-QUIZ-001 | The product may provide simple lesson-level knowledge checks. | Could Have |
| FR-QUIZ-002 | A knowledge check may show whether the selected answer is correct or incorrect. | Could Have |
| FR-QUIZ-003 | A knowledge check may provide a short explanation after the answer. | Could Have |
| FR-QUIZ-004 | Knowledge checks should remain lightweight and not become a full assessment system in MVP. | Should Have |

### Out of Scope

The MVP does not require:

- Full quiz engine
- Certification exams
- Skill scoring
- Question bank management
- Paid assessments

### Acceptance Expectations

- If included, quizzes support learning without increasing complexity.
- If not included in MVP, the product can still launch with lessons, AI Tutor, and progress tracking.

---

## 13.13 Glossary Requirements

### Objective

A glossary may help beginners understand IBM i terminology.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-GLOS-001 | The product may provide a glossary of IBM i terms. | Could Have |
| FR-GLOS-002 | Glossary entries should use beginner-friendly definitions. | Should Have |
| FR-GLOS-003 | Glossary terms may be linked from lessons in future versions. | Could Have |
| FR-GLOS-004 | The glossary should grow gradually based on learning content and user confusion points. | Should Have |

### Acceptance Expectations

- If included, glossary entries help reduce beginner confusion.
- Glossary scope remains manageable.

---

## 13.14 Internal Administration Requirements

### Objective

The MVP may require simple internal processes to manage content and product operations.

This does not require a full admin dashboard in the MVP.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-ADMIN-001 | The product team must have a way to add or update learning content. | Must Have |
| FR-ADMIN-002 | The product team must have a way to review published content. | Must Have |
| FR-ADMIN-003 | The product team should have a way to review user feedback. | Should Have |
| FR-ADMIN-004 | The product team should have a way to identify common AI Tutor feedback themes. | Should Have |

### Out of Scope

The MVP does not require:

- Full admin dashboard
- Multi-author workflow
- Editorial approval UI
- Enterprise admin controls
- Team management

### Acceptance Expectations

- The product owner can maintain MVP content.
- Feedback can be reviewed without building complex admin functionality.
- Operational needs do not create unnecessary product scope.

---

## 13.15 Explicitly Out-of-Scope Functional Requirements

The following are not functional requirements for the MVP:

- Real IBM i system connectivity
- Live 5250 terminal access
- Production code upload
- Sensitive job log upload
- Real code compilation
- Full RPG playground
- Full 5250 lab
- Full job log analyzer
- Full code review tool
- Full documentation generator
- Enterprise accounts
- Team dashboards
- Admin dashboards
- Billing and subscriptions
- Certifications
- Public community forum
- Mobile app
- VS Code extension
- Marketplace
- Public API
- Enterprise SSO
- Advanced compliance workflows

These may become future requirements only after product validation and explicit Product Owner approval.

---

## 13.16 Requirement Priority Definitions

The following priority labels should be used consistently:

| Priority | Meaning |
|---|---|
| Must Have | Required for MVP release readiness |
| Should Have | Important but may be simplified if needed |
| Could Have | Optional; include only if it does not delay MVP |
| Out of Scope | Not part of MVP |

---

## 13.17 MVP Functional Readiness Summary

For the MVP to be functionally ready:

- A visitor must understand the product from the landing page.
- A user must be able to access the learning experience.
- A user must receive a clear first learning recommendation.
- A user must be able to open and complete lessons.
- A user must be able to ask IBM i-related questions through the AI Tutor.
- A user must be able to see basic progress.
- A user must be able to provide feedback.
- The product must avoid out-of-scope risky features.
- Learning content must remain original and maintainable.

---

### Summary

The MVP functional requirements define a focused first release.

IBMiHub AI must provide a clear public entry point, basic user access, simple onboarding, a dashboard, structured IBM i learning content, AI Tutor assistance, basic progress tracking, feedback collection, and content governance.

The MVP should not include advanced labs, real IBM i connectivity, production code uploads, enterprise features, billing, certifications, mobile apps, or developer extensions.

These requirements should guide the first SDD feature specifications and Sprint 1 planning.

---

## 14. Non-Functional Requirements

### Purpose of This Section

The purpose of this section is to define the quality expectations for IBMiHub AI.

Functional requirements define what the product must do. Non-functional requirements define how well the product must behave while doing it.

This section covers product-level expectations for:

- Performance
- Reliability
- Availability
- Security
- Privacy
- AI safety and trust
- Usability
- Accessibility
- Scalability
- Maintainability
- Observability
- Content quality
- Data handling

This section does not prescribe technical architecture, hosting provider, database design, AI provider implementation, or detailed engineering solutions. Those decisions should be captured later in architecture documents, ADRs, SDD specs, and implementation plans.

---

## 14.1 Non-Functional Requirement Scope

The non-functional requirements in this section apply primarily to the approved MVP:

- Public Landing Experience
- User Account and Basic Onboarding
- User Dashboard
- Learning Center
- AI Tutor
- Basic Progress Tracking
- Basic Feedback Collection
- Basic Content Governance

Future modules such as 5250 Practice Lab, RPG Playground, Job Log Analyzer, Code Explanation, Documentation Generator, Enterprise Training, Community, Mobile App, and VS Code Extension may require additional non-functional requirements later.

---

## 14.2 Requirement Priority Definitions

| Priority | Meaning |
|---|---|
| Must Have | Required for MVP release readiness |
| Should Have | Important quality expectation, but may be simplified for MVP |
| Could Have | Useful improvement if it does not delay MVP |
| Future | Not required for MVP but important for later phases |

---

## 14.3 Performance Requirements

### Objective

The MVP should feel fast, responsive, and comfortable to use.

Users should not feel that the platform is slow when navigating lessons, dashboard, onboarding, or basic product pages.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-PERF-001 | Public pages should load quickly enough to support a good first impression. | Must Have |
| NFR-PERF-002 | Dashboard and Learning Center pages should respond fast enough for comfortable repeated use. | Must Have |
| NFR-PERF-003 | Lesson navigation should feel smooth and should not create unnecessary wait time. | Must Have |
| NFR-PERF-004 | AI Tutor responses should be delivered within a reasonable time for conversational learning use. | Must Have |
| NFR-PERF-005 | The product should avoid heavy or unnecessary UI elements that slow down the MVP experience. | Should Have |
| NFR-PERF-006 | The product should be usable on typical home, office, and mobile internet connections. | Should Have |

### Acceptance Expectations

- Users can move through landing, dashboard, and lessons without noticeable friction.
- AI Tutor response time is acceptable for learning support.
- The MVP does not feel slow or overloaded.

---

## 14.4 Reliability Requirements

### Objective

The product should work consistently for core MVP flows.

Reliability is important because users must trust the platform as a learning and AI-assistance experience.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-REL-001 | Core user flows should work consistently: sign-up/login, onboarding, dashboard, lesson access, progress tracking, AI Tutor, and feedback submission. | Must Have |
| NFR-REL-002 | User progress should not be lost during normal product usage. | Must Have |
| NFR-REL-003 | The product should handle common user errors gracefully. | Must Have |
| NFR-REL-004 | The product should show understandable error messages when something fails. | Must Have |
| NFR-REL-005 | AI Tutor failures should be handled gracefully without breaking the rest of the product experience. | Must Have |
| NFR-REL-006 | The product should avoid broken navigation paths or dead ends. | Must Have |

### Acceptance Expectations

- Users can complete core MVP flows without frequent failures.
- Failure states are understandable and recoverable.
- AI-related issues do not make the entire platform unusable.

---

## 14.5 Availability Requirements

### Objective

The MVP should be available enough for beta users and early adopters to use reliably.

The MVP does not need enterprise-grade availability guarantees, but it should not feel unstable.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-AVL-001 | The product should be available for normal early-user access during MVP validation. | Must Have |
| NFR-AVL-002 | Planned downtime, if any, should be minimized and communicated where practical. | Should Have |
| NFR-AVL-003 | The product should avoid single points of failure where simple design choices can reduce risk. | Should Have |
| NFR-AVL-004 | Enterprise-level uptime SLAs are not required for MVP. | Future |

### Acceptance Expectations

- Early users can access the product reliably.
- The product does not require enterprise SLA commitments during MVP.

---

## 14.6 Security Requirements

### Objective

The MVP must protect user accounts, product data, feedback, and learning activity.

Even though the MVP is narrow, security should be considered from the beginning because trust is central to the product.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-SEC-001 | User authentication must be handled securely. | Must Have |
| NFR-SEC-002 | User passwords, if used, must not be stored in plain text. | Must Have |
| NFR-SEC-003 | The product must protect user account data from unauthorized access. | Must Have |
| NFR-SEC-004 | The product must not expose private user data through public pages or URLs. | Must Have |
| NFR-SEC-005 | The product must use secure communication for user-facing application traffic. | Must Have |
| NFR-SEC-006 | The product must not include real IBM i system connectivity in the MVP. | Must Have |
| NFR-SEC-007 | The product must not allow production source code upload in the MVP. | Must Have |
| NFR-SEC-008 | The product must not allow sensitive production job log upload in the MVP. | Must Have |
| NFR-SEC-009 | Internal content update processes should be protected from unauthorized changes. | Should Have |
| NFR-SEC-010 | Security-sensitive decisions should be documented in architecture or ADR documents when implementation begins. | Should Have |

### Acceptance Expectations

- User data is protected appropriately for an MVP.
- Risky features such as production code upload and real IBM i connectivity are not accidentally included.
- Security is treated as a baseline expectation, not a later afterthought.

---

## 14.7 Privacy Requirements

### Objective

IBMiHub AI should handle user data responsibly.

Privacy is especially important because future product phases may involve code, logs, and enterprise workflows. The MVP should establish safe habits early even though it does not include sensitive production uploads.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-PRIV-001 | The product must collect only the user information needed for the MVP experience. | Must Have |
| NFR-PRIV-002 | The product must avoid requesting sensitive production code, logs, credentials, or customer data in the MVP. | Must Have |
| NFR-PRIV-003 | AI Tutor guidance must discourage users from sharing private production code or sensitive logs. | Must Have |
| NFR-PRIV-004 | User feedback should be handled as private product feedback unless clearly stated otherwise. | Must Have |
| NFR-PRIV-005 | The product should provide clear privacy messaging appropriate for MVP usage. | Should Have |
| NFR-PRIV-006 | Future support for code or log upload must require separate privacy, security, and data handling review. | Future |

### Acceptance Expectations

- Users are not encouraged to share sensitive production information.
- The MVP collects minimal data.
- Future sensitive workflows are not introduced without explicit review.

---

## 14.8 AI Trust and Safety Requirements

### Objective

The AI Tutor must be useful, but it must also be transparent and careful.

Users should understand that AI output can help learning and explanation, but should not be treated as guaranteed production truth.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-AI-001 | The AI Tutor must avoid claiming guaranteed correctness. | Must Have |
| NFR-AI-002 | The AI Tutor must include appropriate caution for production use. | Must Have |
| NFR-AI-003 | The AI Tutor must discourage users from sharing private production code, credentials, or sensitive logs. | Must Have |
| NFR-AI-004 | AI responses should be clear, structured, and practical. | Should Have |
| NFR-AI-005 | AI responses should match the user context where available, such as beginner vs working developer. | Should Have |
| NFR-AI-006 | AI responses should avoid unnecessary overconfidence. | Should Have |
| NFR-AI-007 | AI Tutor feedback should be captured where feasible to improve quality over time. | Should Have |
| NFR-AI-008 | AI provider selection and prompt design should be handled in later architecture and AI Strategy documents. | Future |

### Acceptance Expectations

- The AI Tutor feels helpful but not reckless.
- Users are encouraged to validate AI guidance.
- AI behavior supports trust and learning.

---

## 14.9 Usability Requirements

### Objective

The MVP should be easy to understand and navigate.

Users should not need training to use the platform.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-USE-001 | A new visitor should understand the product purpose quickly. | Must Have |
| NFR-USE-002 | A new user should know where to start after onboarding. | Must Have |
| NFR-USE-003 | A returning user should be able to continue learning easily. | Must Have |
| NFR-USE-004 | Navigation between dashboard, lessons, and AI Tutor should be simple. | Must Have |
| NFR-USE-005 | The product should avoid exposing too many future modules in the MVP user experience. | Must Have |
| NFR-USE-006 | Beginner users should not feel overwhelmed by terminology or layout. | Should Have |
| NFR-USE-007 | Working developers should be able to access AI Tutor and relevant learning content without unnecessary friction. | Should Have |

### Acceptance Expectations

- Users can understand what to do next.
- The MVP feels focused and uncluttered.
- Beginner and working-developer needs are both respected.

---

## 14.10 Accessibility Requirements

### Objective

IBMiHub AI should be usable by as many people as reasonably possible.

The MVP should follow basic accessibility expectations even before advanced accessibility certification work is done.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-ACC-001 | Text should be readable with sufficient contrast. | Must Have |
| NFR-ACC-002 | The product should support keyboard-friendly navigation where practical. | Should Have |
| NFR-ACC-003 | Important UI elements should have clear labels. | Should Have |
| NFR-ACC-004 | The product should avoid relying only on color to communicate important meaning. | Should Have |
| NFR-ACC-005 | Lesson content should use clear headings, lists, and readable structure. | Must Have |
| NFR-ACC-006 | Future accessibility targets should be reviewed before enterprise expansion. | Future |

### Acceptance Expectations

- Lesson content is readable and structured.
- Basic accessibility is considered during MVP design.
- Accessibility does not become an afterthought.

---

## 14.11 Mobile and Responsive Experience Requirements

### Objective

The MVP should work reasonably well across common screen sizes.

A dedicated mobile app is not part of the MVP, but the web experience should not be unusable on smaller screens.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-MOB-001 | Public landing pages should be usable on mobile and desktop browsers. | Must Have |
| NFR-MOB-002 | Lesson reading experience should be usable on common mobile and desktop screen sizes. | Should Have |
| NFR-MOB-003 | Dashboard and AI Tutor should be reasonably usable on common screen sizes. | Should Have |
| NFR-MOB-004 | A native mobile app is not required for MVP. | Future |

### Acceptance Expectations

- Users can read core content on desktop and mobile browsers.
- The MVP does not require a native mobile app.

---

## 14.12 Scalability Requirements

### Objective

The MVP should be simple but should not block future growth.

The product does not need enterprise-scale infrastructure on day one, but it should be designed so growth does not require a full restart.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-SCL-001 | The MVP should support a small early beta user base comfortably. | Must Have |
| NFR-SCL-002 | The product should be designed so learning content can grow over time. | Must Have |
| NFR-SCL-003 | The product should be designed so future modules can be added without rewriting the entire platform. | Should Have |
| NFR-SCL-004 | AI usage should be designed with future cost and rate-limit considerations in mind. | Should Have |
| NFR-SCL-005 | Enterprise-scale usage is not required for MVP. | Future |

### Acceptance Expectations

- The MVP supports early users without unnecessary complexity.
- Product and content structure do not block future expansion.

---

## 14.13 Maintainability Requirements

### Objective

IBMiHub AI should remain maintainable as the product grows.

The project is being treated as a long-term SaaS platform, so maintainability matters from the beginning.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-MAIN-001 | Product behavior should be documented through PRD, SDD specs, and implementation plans before coding. | Must Have |
| NFR-MAIN-002 | Requirements should remain traceable from PRD to future SDD specs. | Must Have |
| NFR-MAIN-003 | Product decisions should be captured in appropriate documentation or ADRs. | Should Have |
| NFR-MAIN-004 | Content should be organized so it can be updated without confusion. | Must Have |
| NFR-MAIN-005 | MVP implementation should avoid unnecessary complexity and overengineering. | Must Have |
| NFR-MAIN-006 | Future modules should be introduced through approved specs, not ad-hoc coding. | Must Have |

### Acceptance Expectations

- Future contributors can understand why the product behaves the way it does.
- MVP remains simple enough to maintain.
- Documentation remains the source of truth.

---

## 14.14 Observability and Monitoring Requirements

### Objective

The product owner and engineering team should be able to understand whether the product is working and where users face issues.

The MVP does not require enterprise observability, but basic visibility is important.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-OBS-001 | The product should capture basic product usage signals needed for MVP validation. | Should Have |
| NFR-OBS-002 | The product should make it possible to understand core flow failures such as login, lesson access, progress tracking, AI Tutor, and feedback submission. | Should Have |
| NFR-OBS-003 | The product should support basic review of user feedback. | Should Have |
| NFR-OBS-004 | The product should avoid collecting unnecessary or sensitive user data for analytics. | Must Have |
| NFR-OBS-005 | Advanced observability dashboards are not required for MVP. | Future |

### Acceptance Expectations

- MVP validation is possible through basic usage and feedback signals.
- Product issues can be identified without collecting excessive data.

---

## 14.15 Content Quality Requirements

### Objective

Content quality is a core part of product quality.

IBMiHub AI must build trust through original, clear, structured, and useful IBM i learning material.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-CQ-001 | Learning content must be original to IBMiHub AI. | Must Have |
| NFR-CQ-002 | Learning content must avoid copying external tutorials, documentation, articles, books, or course material. | Must Have |
| NFR-CQ-003 | Lessons must be clear enough for the intended learner level. | Must Have |
| NFR-CQ-004 | Lessons should include practical examples where useful. | Should Have |
| NFR-CQ-005 | Content should be reviewed before being treated as approved learning material. | Should Have |
| NFR-CQ-006 | Content should be updated when user feedback identifies confusion or errors. | Should Have |
| NFR-CQ-007 | External references used for research or validation should be credited where applicable. | Should Have |

### Acceptance Expectations

- Content builds trust.
- Content is useful for real learning.
- Content originality is protected.

---

## 14.16 Data Handling Requirements

### Objective

The MVP should handle product data responsibly and simply.

This includes user account data, progress data, feedback data, lesson content, and AI interaction data if retained.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-DATA-001 | User account data must be handled securely. | Must Have |
| NFR-DATA-002 | User progress data must be associated with the correct user. | Must Have |
| NFR-DATA-003 | Feedback data should be available for product review. | Should Have |
| NFR-DATA-004 | AI interaction data, if stored, should be handled with privacy and trust considerations. | Should Have |
| NFR-DATA-005 | The MVP must not store production IBM i source code or sensitive job logs. | Must Have |
| NFR-DATA-006 | Future data retention rules should be defined before supporting sensitive uploads or enterprise customers. | Future |

### Acceptance Expectations

- MVP data handling supports learning and validation without unnecessary risk.
- Sensitive future workflows require separate review.

---

## 14.17 Localization Requirements

### Objective

The MVP should initially focus on a clear English-language experience.

Localization may become important later, but it should not complicate the MVP.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-LOC-001 | MVP content should be created in English. | Must Have |
| NFR-LOC-002 | The product should avoid hard-to-change assumptions that would block future localization. | Should Have |
| NFR-LOC-003 | Multi-language content is not required for MVP. | Future |

### Acceptance Expectations

- MVP launches with focused English content.
- Future localization remains possible.

---

## 14.18 Compliance Requirements

### Objective

The MVP does not require enterprise compliance certification, but it should avoid decisions that create unnecessary compliance risk.

### Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-COMP-001 | The MVP must avoid collecting sensitive production code, logs, credentials, or customer data. | Must Have |
| NFR-COMP-002 | The MVP should provide basic privacy and acceptable-use messaging. | Should Have |
| NFR-COMP-003 | Enterprise compliance requirements should be evaluated before enterprise plans are launched. | Future |
| NFR-COMP-004 | Future support for sensitive uploads should require security, privacy, and compliance review. | Future |

### Acceptance Expectations

- MVP avoids high-risk data handling.
- Enterprise compliance is deferred until enterprise scope is approved.

---

## 14.19 Non-Functional MVP Readiness Summary

The MVP should not be considered ready unless:

- Core flows are reliable.
- Public and learning pages are reasonably fast.
- User data is protected.
- AI Tutor uses appropriate caution and trust boundaries.
- The product does not request production code or sensitive logs.
- Lesson content is original and reviewed.
- Users can navigate the product without confusion.
- Basic feedback and validation signals can be captured.
- The product remains maintainable and aligned with PRD / SDD process.

---

## 14.20 Future Non-Functional Considerations

Future product phases may require additional requirements for:

- Real IBM i connectivity
- Secure code upload
- Secure job log upload
- Enterprise accounts
- Team dashboards
- Billing and subscriptions
- Certifications
- Community moderation
- Mobile applications
- VS Code extension
- Public APIs
- Enterprise SSO
- Compliance certifications
- Advanced observability
- AI governance

These should be handled only after MVP validation and explicit Product Owner approval.

---

### Summary

The non-functional requirements define the quality bar for IBMiHub AI.

The MVP should be fast enough, reliable, secure, privacy-conscious, usable, accessible, maintainable, and trustworthy.

The product should avoid risky capabilities such as real IBM i connectivity, production code upload, sensitive job log upload, enterprise compliance claims, and advanced platform complexity until the core learning and AI-assistance value has been validated.

---

## 15. AI Strategy

### Purpose of This Section

The purpose of this section is to define the product-level AI strategy for IBMiHub AI.

AI is a core differentiator of the product, but the product should not become a generic chatbot or an uncontrolled AI wrapper. AI should be used where it improves IBM i learning, explanation, productivity, and confidence.

This section defines:

- The role of AI in the product
- MVP AI scope
- AI Tutor behavior expectations
- AI trust and safety boundaries
- AI feedback and quality expectations
- Future AI expansion direction
- What AI should not do in the MVP

This section does not define technical implementation, AI provider selection, prompt architecture, retrieval architecture, vector database design, model routing, hosting approach, or cost optimization strategy. Those decisions should be captured later in architecture documents, ADRs, AI implementation plans, and SDD specifications.

---

### AI Strategy Statement

IBMiHub AI should use AI to make IBM i learning and understanding faster, clearer, safer, and more practical.

The product should use AI as a guided learning and productivity assistant, not as a replacement for structured learning, official documentation, expert judgment, or production review.

The AI strategy is:

**Use AI to help users understand IBM i concepts, ask questions, clarify confusion, connect lessons to practical examples, and build confidence — while maintaining clear trust boundaries and avoiding unsafe production claims.**

---

### Strategic Role of AI

AI should support the product vision in four major ways.

#### 1. Reduce Learning Friction

AI should help beginners ask questions in plain language and receive explanations that match their level.

This matters because IBM i terminology, tools, workflows, and programming models can feel unfamiliar to new learners.

#### 2. Improve Concept Understanding

AI should explain IBM i topics from multiple angles, using simple language, practical examples, and structured responses.

The goal is not only to answer questions, but to help users understand the concept well enough to continue learning.

#### 3. Support Working Developers

AI should help working IBM i developers refresh concepts, understand unfamiliar topics, and get practical explanations faster than searching across scattered resources.

For the MVP, this should remain focused on conceptual explanation and learning support, not production troubleshooting or code review.

#### 4. Create a Foundation for Future Productivity Tools

Over time, AI may support code explanation, job log analysis, documentation generation, interview preparation, and enterprise onboarding.

However, those advanced AI capabilities should be introduced only after MVP validation and separate product approval.

---

## 15.1 MVP AI Scope

The MVP AI scope is limited to the **AI Tutor**.

The AI Tutor should support learning and explanation use cases for:

- IBM i fundamentals
- RPGLE concepts
- CLLE concepts
- SQL and DB2 for i concepts
- DDS concepts
- 5250 concepts
- Job log and spool file basics
- Learning content clarification
- Practical beginner-friendly explanations

The MVP AI Tutor should help users understand and learn. It should not perform production operations, connect to IBM i systems, analyze private source code, or troubleshoot sensitive production logs.

---

## 15.2 MVP AI In-Scope Capabilities

The MVP AI Tutor may support the following capabilities.

| Capability | Description | MVP Status |
|---|---|---|
| IBM i Q&A | Answer general IBM i learning questions | In Scope |
| Lesson Clarification | Explain lesson concepts in simpler or different ways | In Scope |
| Beginner Explanation | Adapt responses for new learners | In Scope |
| Working Developer Explanation | Provide practical explanations for experienced users | In Scope |
| Concept Examples | Provide simple examples to explain concepts | In Scope |
| Follow-up Questions | Allow users to continue a learning conversation | In Scope |
| AI Response Feedback | Allow users to mark responses helpful or not helpful | In Scope |
| Production Caution | Remind users to validate AI guidance before real production use | In Scope |

---

## 15.3 MVP AI Out-of-Scope Capabilities

The following AI capabilities are explicitly out of scope for the MVP:

- Real IBM i system connectivity
- Live 5250 terminal interaction
- Production troubleshooting guarantees
- Uploading private production source code
- Uploading sensitive job logs
- Automated code changes
- Code compilation or execution
- Full RPGLE code review
- Full job log analyzer
- Full documentation generator
- Autonomous agent workflows
- Enterprise AI governance
- Customer-specific knowledge base ingestion
- Organization-specific AI training
- AI-based certification scoring
- AI actions on external systems

These may be considered in future phases only after product validation, privacy review, security review, and explicit Product Owner approval.

---

## 15.4 AI Product Principles

AI behavior in IBMiHub AI should follow these principles.

### Principle 1: IBM i Focused

AI should stay focused on IBM i learning and productivity use cases.

It should not behave like a generic assistant covering unrelated topics unless the question clearly supports the user's IBM i learning journey.

### Principle 2: Guided, Not Random

AI should support structured learning paths and product workflows.

It should help users move forward, understand lessons, and know what to learn next.

### Principle 3: Helpful, But Not Overconfident

AI should be useful and direct, but should not pretend to be certain when uncertainty exists.

When appropriate, the AI should say that a topic may depend on system version, local standards, company implementation, or production context.

### Principle 4: Beginner-Aware

AI should adapt to beginner users by using simpler language, explaining terms, avoiding unnecessary jargon, and offering step-by-step clarification.

### Principle 5: Professional Enough for Working Developers

AI should also respect experienced users by providing practical, technically meaningful answers without oversimplifying everything.

### Principle 6: Privacy-Conscious

AI should not ask users to share private production source code, sensitive job logs, passwords, credentials, customer data, or proprietary business information.

### Principle 7: Human Judgment Required

AI output should support learning and analysis, but users should remain responsible for validation before applying anything to real systems.

### Principle 8: Product Context Matters

AI responses should align with the product's learning paths, MVP scope, content style, and trust boundaries.

---

## 15.5 AI Tutor Behavior Expectations

The AI Tutor should behave like a patient IBM i learning assistant.

It should:

- Answer in clear and practical language
- Structure explanations with headings, bullets, or examples when useful
- Explain IBM i terms when they may be unfamiliar
- Provide beginner-friendly answers when the user appears new
- Provide more concise practical answers for working developers when appropriate
- Encourage users to continue learning through related topics
- Avoid making production-safe guarantees
- Ask clarifying questions when the user's request is unclear
- Say when a topic depends on environment, version, configuration, or business logic
- Encourage review against official documentation, company standards, or expert guidance for production work

The AI Tutor should not:

- Pretend to have access to the user's IBM i system
- Claim it has verified production behavior
- Ask for private code, credentials, or sensitive logs
- Provide risky production instructions without caution
- Present generated answers as guaranteed facts
- Replace expert review for production decisions

---

## 15.6 AI Response Style

AI responses should follow a consistent product style.

Responses should generally be:

- Clear
- Practical
- Structured
- Beginner-friendly when needed
- Technically respectful
- Focused on IBM i context
- Honest about uncertainty
- Safe for learning use

For beginner users, responses should avoid overwhelming detail and should explain terminology.

For working developers, responses may be more direct and practical, but should still remain clear and trustworthy.

---

## 15.7 AI Trust Boundaries

Trust boundaries are required because IBMiHub AI deals with technical learning and future productivity workflows.

The AI Tutor must communicate that:

- AI output may be incomplete or incorrect
- Production usage requires validation
- Company-specific implementations may differ
- IBM i behavior can depend on system version, configuration, object authorities, job settings, and local standards
- Users should not share sensitive production data in the MVP

The product should avoid language that implies the AI Tutor is always correct or production-certified.

---

## 15.8 AI and Learning Content Relationship

The AI Tutor should support learning content, not replace it.

Structured lessons remain the foundation of the learning experience.

AI should help users:

- Understand lesson concepts
- Ask follow-up questions
- Get alternate explanations
- Clarify terminology
- Connect concepts to practical examples
- Continue learning when they are stuck

The product should avoid replacing the Learning Center with a blank chatbot experience.

The AI Tutor should strengthen the learning journey, not bypass it.

---

## 15.9 AI and Original Content Policy

IBMiHub AI must maintain its original content policy.

AI may assist the product team in drafting, brainstorming, simplifying, or reviewing content, but published learning content should be reviewed and approved before being treated as official IBMiHub AI content.

AI-generated content must not be used to copy or closely imitate external tutorials, documentation, books, courses, or websites.

The product should maintain its own voice, structure, examples, and learning flow.

---

## 15.10 AI Feedback and Quality Signals

The MVP should collect feedback that helps evaluate AI usefulness.

Useful AI quality signals include:

- Helpful / not helpful ratings
- Common user question topics
- Questions where users ask repeated follow-ups
- User-reported incorrect or confusing AI responses
- Topics where AI struggles
- Topics users ask for most often
- Repeat usage after AI Tutor interaction

This feedback should help improve product direction, lesson content, AI behavior, and future AI roadmap decisions.

---

## 15.11 AI Metrics

AI success should be measured by usefulness and trust, not just usage volume.

Possible MVP AI metrics include:

- Number of AI Tutor questions asked
- Percentage of users who ask at least one AI question
- AI Tutor usage after lesson reading
- Helpful response rating
- Not helpful response rating
- Follow-up question rate
- Repeat usage after AI Tutor session
- Common topic categories
- Reported incorrect or unsafe responses

High AI question volume alone does not prove success.

The better signal is whether AI helps users learn, return, trust the platform, and continue using the product.

---

## 15.12 AI Provider and Implementation Strategy

The PRD should remain provider-neutral at this stage.

The product should not lock itself into any specific AI provider, model, orchestration framework, embedding database, RAG architecture, or hosting decision inside the PRD.

Provider and implementation decisions should be handled later through:

- Architecture documents
- ADRs
- AI implementation plans
- Security and privacy review
- Cost and scalability analysis
- SDD feature specs

The product requirement is that AI must be useful, focused, safe, and maintainable.

The engineering solution should be decided separately.

---

## 15.13 AI Cost and Usage Considerations

AI usage can create operating cost.

The MVP should be designed with future cost awareness, but cost optimization should not dominate the first product definition.

Product-level considerations include:

- AI usage should support real learning value
- Abuse or excessive usage should be controllable in future versions
- Paid plans may later include higher AI usage limits
- Enterprise plans may later require separate controls
- AI cost should be monitored once real users begin using the product

Detailed AI cost controls should be defined later during architecture and implementation planning.

---

## 15.14 Future AI Capabilities

Future AI capabilities may include:

### Lesson-Aware AI Tutor

AI that has stronger awareness of the current lesson, learning path, and user progress.

### RPGLE / CLLE Code Explanation

AI-assisted explanation of user-provided or sample RPGLE and CLLE code.

### Job Log Explanation

AI-assisted explanation of job logs and likely investigation areas.

### Documentation Assistant

AI-assisted creation of program summaries, process notes, onboarding documents, or technical documentation.

### Interview Coach

AI-assisted interview preparation, mock questions, and explanation support.

### Practice Lab Assistant

AI assistance inside future 5250 simulations, RPG exercises, and job log scenarios.

### Enterprise AI Controls

Future controls for enterprise privacy, data handling, usage limits, and organization-specific policies.

These capabilities are future possibilities, not MVP commitments.

Each should require separate approval, privacy review, security review, and SDD specification.

---

## 15.15 AI Risks

Key AI risks include:

| Risk | Description | Mitigation Direction |
|---|---|---|
| Incorrect answers | AI may provide incomplete or wrong technical explanations | Use caution messaging, feedback, review loops, and future grounding |
| Overconfidence | AI may sound certain even when context is missing | Require uncertainty handling and production-use caution |
| Privacy leakage | Users may share sensitive code, logs, or business data | Warn users not to share sensitive data; block sensitive upload features in MVP |
| Generic answers | AI may not feel IBM i-specific enough | Guide AI behavior around IBM i context and product learning paths |
| Scope creep | AI may encourage advanced features too early | Keep MVP AI limited to AI Tutor learning support |
| Cost growth | AI usage may become expensive as usage grows | Monitor usage and define future limits or paid tiers |
| Trust damage | Poor AI answers may reduce credibility | Collect feedback and improve content, prompts, and AI behavior over time |

---

## 15.16 MVP AI Readiness Checklist

The MVP AI Tutor should not be considered ready unless:

- Users can ask IBM i-related questions.
- Responses are understandable and useful for learning.
- Responses avoid guaranteed correctness claims.
- Responses discourage sharing sensitive production data.
- AI Tutor is accessible from core product flows.
- AI feedback can be captured.
- The product does not allow private production code upload.
- The product does not allow sensitive job log upload.
- The product does not connect to real IBM i systems.
- Product Owner has reviewed and approved AI behavior for MVP release.

---

### Summary

AI is central to IBMiHub AI, but it must be focused, safe, and aligned with structured learning.

For the MVP, AI should be limited to an IBM i-focused AI Tutor that helps users understand concepts, clarify lessons, ask questions, and continue learning.

The product should avoid real IBM i connectivity, sensitive uploads, production troubleshooting guarantees, autonomous actions, or enterprise AI governance in the MVP.

Future AI capabilities such as code explanation, job log analysis, documentation generation, practice assistance, and enterprise controls should be introduced only after MVP validation and explicit Product Owner approval.

---

## 16. Learning & Content Strategy

### Purpose of This Section

The purpose of this section is to define how IBMiHub AI will create, structure, govern, and improve IBM i learning content.

Learning content is one of the core foundations of the product. The AI Tutor is important, but the product should not become only a chatbot. Structured learning content gives users a guided path, reduces confusion, supports progress tracking, and creates a foundation for future labs, quizzes, practice, interview preparation, and enterprise training.

This section defines:

- The learning strategy
- MVP curriculum scope
- Content principles
- Lesson structure
- Original content policy
- Content governance
- AI-assisted content creation boundaries
- Skill progression model
- Future content expansion direction

This section does not create actual lessons. Actual lesson content should be created later through approved content plans, curriculum specs, and review workflows.

---

### Learning Strategy Statement

IBMiHub AI should provide structured, original, practical IBM i learning content supported by AI guidance.

The learning strategy is:

**Help users move from confusion to confidence through guided IBM i learning paths, clear explanations, practical examples, AI-assisted clarification, and gradual skill progression.**

The product should not simply publish random IBM i articles. It should guide users through a logical journey from basic orientation to practical understanding.

---

## 16.1 Role of Learning Content in the Product

Learning content plays several important roles in IBMiHub AI.

### 1. Foundation for Beginners

Beginners need a clear place to start. Structured lessons should reduce fear and confusion by explaining IBM i concepts in a simple, practical sequence.

### 2. Reference for Working Developers

Working developers may use learning content to refresh concepts, clarify terminology, or understand topics they do not use daily.

### 3. Context for AI Tutor

The AI Tutor should support and reinforce learning content. Users should be able to ask questions around lessons and get clarification without leaving the learning flow.

### 4. Foundation for Future Practice

Future 5250 labs, RPGLE exercises, CLLE exercises, job log scenarios, quizzes, and interview preparation should connect back to structured learning content.

### 5. Trust Builder

High-quality original content is essential for credibility. The IBM i community will trust the product only if the content is accurate, practical, respectful, and not copied.

---

## 16.2 MVP Learning Scope

The MVP learning scope should remain focused.

The MVP should not attempt to become a complete IBM i academy. It should provide enough structured content to validate whether users find the product useful and want to continue learning.

### MVP Learning Goal

The MVP learning goal is:

**Help a beginner understand the IBM i platform at a basic level and help a working developer quickly refresh foundational IBM i concepts.**

### MVP In-Scope Learning Areas

The MVP learning content may include:

- IBM i overview
- IBM i terminology
- Libraries and objects
- 5250 screen basics
- Physical files and logical files
- RPGLE introduction
- CLLE introduction
- DB2 for i introduction
- Job logs and spool files basics
- Basic IBM i development workflow
- Modern IBM i tooling overview at a high level

### MVP Out-of-Scope Learning Areas

The MVP should not include:

- Complete RPGLE mastery course
- Complete CLLE mastery course
- Advanced DB2 for i optimization
- Advanced system administration
- Full security administration curriculum
- Full modernization program
- Enterprise onboarding curriculum
- Certification curriculum
- Paid course bundles
- User-generated courses
- Instructor-led training
- Vendor-specific product training

These may be considered in later phases after MVP validation.

---

## 16.3 Target Learning Audiences

The MVP learning strategy should focus on two primary audiences.

### Beginner IBM i Learner

This user needs:

- Simple explanations
- Clear sequencing
- Terminology support
- Confidence-building examples
- A safe way to ask questions
- Guidance on what to learn next

### Working IBM i Developer

This user needs:

- Practical explanations
- Fast concept refreshers
- Clear IBM i-specific context
- AI clarification support
- Pathways into deeper future content

Other audiences such as team leads, architects, enterprise buyers, and interview candidates should inform future content strategy but should not dominate the MVP curriculum.

---

## 16.4 Learning Path Strategy

IBMiHub AI should organize content into learning paths.

A learning path is a guided sequence of lessons designed to help users progress from one level of understanding to the next.

### MVP Learning Path

The MVP should include one primary learning path:

**IBM i Fundamentals**

This path should introduce users to the IBM i platform, basic terminology, system concepts, development concepts, and common workflows.

Suggested lesson sequence:

1. What is IBM i?
2. Why IBM i still matters
3. IBM i platform overview
4. Libraries and objects
5. 5250 screen basics
6. Physical files and logical files
7. Introduction to RPGLE
8. Introduction to CLLE
9. Introduction to DB2 for i
10. Job logs and spool files basics
11. Basic IBM i development workflow
12. Where to go next

This sequence may be refined later, but the MVP should remain focused on fundamentals.

---

## 16.5 Skill Progression Model

IBMiHub AI should support gradual skill progression.

The product should help users move through levels over time.

| Level | Description | MVP Status |
|---|---|---|
| Level 0: Orientation | Understand what IBM i is and why it exists | In Scope |
| Level 1: Fundamentals | Understand basic IBM i terminology and concepts | In Scope |
| Level 2: Beginner Development | Understand basic RPGLE, CLLE, files, and workflow concepts | Partial MVP / Post-MVP |
| Level 3: Practical Developer | Read simple programs, understand job logs, and follow common workflows | Post-MVP |
| Level 4: Productive Professional | Troubleshoot, document, and work with real-world systems more confidently | Future |
| Level 5: Advanced / Enterprise | Modernization, architecture, onboarding, enterprise training, and advanced tooling | Future |

The MVP should focus mainly on Level 0 and Level 1, with limited introduction to Level 2.

---

## 16.6 Lesson Design Principles

Each lesson should be designed to make learning easier, not just to present information.

Lessons should follow these principles:

### 1. Start Simple

Begin with the concept in plain language before adding technical detail.

### 2. Explain Why It Matters

Users should understand why the concept is important in real IBM i work.

### 3. Use Practical Examples

Examples should be simple, original, and connected to realistic IBM i scenarios.

### 4. Avoid Overloading Beginners

Do not introduce too many advanced terms at once.

### 5. Connect to the Next Topic

Each lesson should help users understand what comes next.

### 6. Encourage AI Clarification

Users should be encouraged to ask the AI Tutor when they are confused.

### 7. Support Review and Improvement

Lessons should be easy to update based on user feedback.

---

## 16.7 Standard Lesson Structure

MVP lessons should follow a consistent structure.

Suggested lesson structure:

| Section | Purpose |
|---|---|
| Lesson Title | Clearly state the topic |
| Learning Objective | Explain what the user should understand after the lesson |
| Simple Explanation | Explain the concept in beginner-friendly language |
| Why It Matters | Connect the concept to real IBM i work |
| Practical Example | Provide an original example or scenario |
| Common Confusions | Address likely beginner misunderstandings |
| Quick Recap | Summarize the key points |
| Try Asking AI Tutor | Suggest one or two relevant AI Tutor questions |
| Mark Complete | Allow progress tracking |
| Next Lesson | Guide the user forward |

This structure may be simplified for very short lessons, but consistency should remain a goal.

---

## 16.8 Content Style Guidelines

IBMiHub AI content should have a consistent voice.

The content should be:

- Clear
- Practical
- Beginner-friendly
- Respectful of IBM i professionals
- Technically careful
- Original
- Structured
- Easy to scan
- Honest about complexity
- Connected to real IBM i work

The content should avoid:

- Copying external explanations
- Excessive jargon without explanation
- Overly academic writing
- Unverified technical claims
- Overpromising AI capabilities
- Making IBM i sound obsolete
- Disrespecting existing IBM i resources or experts

The tone should feel like a patient senior IBM i mentor explaining concepts clearly.

---

## 16.9 Original Content Policy

Original content is a core product requirement.

IBMiHub AI must not copy content from:

- IBM documentation
- Go4AS400
- IT Jungle
- Blogs
- Books
- Online courses
- Training providers
- Forum answers
- Vendor documentation
- Competitor websites

External resources may be used for research, validation, and fact-checking, but final published content must be written in IBMiHub AI's own words, structure, examples, and teaching style.

Examples, scenarios, quizzes, and explanations should be created specifically for IBMiHub AI.

This protects the product legally, ethically, and strategically.

---

## 16.10 Research and Reference Policy

Learning content may require research and validation.

When external sources are used:

- Use reliable sources where possible
- Prefer official documentation for factual validation
- Do not copy phrasing or structure
- Do not reuse proprietary examples
- Credit external references where appropriate
- Keep research references in a suitable appendix or internal notes
- Review content before treating it as approved

The purpose of research is to improve accuracy, not to duplicate existing content.

---

## 16.11 AI-Assisted Content Creation Policy

AI may assist with content creation, but AI should not be treated as the final authority.

AI may be used to:

- Brainstorm lesson outlines
- Simplify explanations
- Generate original example ideas
- Identify likely beginner confusion points
- Create draft quizzes or recap questions
- Review clarity
- Suggest alternate explanations

AI must not be used to:

- Copy external content
- Generate unreviewed official lessons
- Invent unsupported technical claims
- Produce final content without human review
- Create content that imitates a specific website, author, book, or course
- Bypass the originality policy

Published content should be reviewed and approved before being considered official IBMiHub AI learning material.

---

## 16.12 Content Governance

Content governance is required to maintain trust and consistency.

For the MVP, governance can remain simple.

MVP governance should include:

- Content written or reviewed by the Product Owner
- Originality check through manual review
- Technical review for important lessons
- Version control for lesson content
- Feedback collection from users
- Updates based on confusion points or reported errors

The MVP does not require a full content management system, editorial dashboard, multi-author workflow, or marketplace.

Those capabilities may be considered later if content operations grow.

---

## 16.13 Content Lifecycle

Learning content should follow a lifecycle.

Suggested lifecycle:

1. Topic selected from approved curriculum
2. Lesson outline drafted
3. Lesson content drafted in original style
4. Technical accuracy reviewed
5. Clarity and beginner-friendliness reviewed
6. Content approved for publication
7. User feedback collected
8. Lesson improved over time

This lifecycle should remain lightweight during MVP but should establish good habits early.

---

## 16.14 Content Quality Criteria

A lesson should be considered good enough for MVP when:

- It supports the approved learning path
- It has a clear learning objective
- It explains the concept in original language
- It is understandable for the intended audience
- It avoids unnecessary complexity
- It includes practical context where useful
- It does not copy external material
- It avoids unsupported claims
- It connects to the next learning step
- It can be improved based on feedback

Content quality should be measured through user feedback, completion patterns, reported confusion points, and Product Owner review.

---

## 16.15 Relationship Between Lessons, AI Tutor, and Progress

The Learning Center, AI Tutor, and progress tracking should work together.

Lessons provide structure.

The AI Tutor provides clarification.

Progress tracking provides continuity.

The product should avoid treating these as disconnected features. A user should be able to read a lesson, ask AI Tutor questions, mark progress, and continue to the next lesson as part of one learning journey.

---

## 16.16 Quizzes and Knowledge Checks

Quizzes and knowledge checks are useful but should remain lightweight for MVP.

If included in MVP, they should:

- Reinforce lesson understanding
- Use simple questions
- Provide short explanations
- Avoid feeling like high-pressure exams
- Avoid certification-style scoring

Post-MVP, quizzes may evolve into:

- Topic-level assessments
- Readiness checks
- Interview preparation
- Certification preparation
- Skill confidence indicators

These should not overload the MVP.

---

## 16.17 Glossary Strategy

A glossary can help reduce beginner confusion.

For MVP, glossary support may be lightweight.

Glossary entries should:

- Use beginner-friendly definitions
- Be short and clear
- Connect to lessons where relevant
- Grow based on user confusion points
- Avoid becoming a copied dictionary of external definitions

The glossary should support learning, not become the main product experience.

---

## 16.18 Future Learning Expansion

After MVP validation, learning content may expand into additional paths.

Possible future paths include:

- RPGLE Fundamentals
- CLLE Fundamentals
- DB2 for i and SQL
- DDS and database files
- 5250 workflows
- Job log reading
- IBM i development workflow
- Modern IBM i tooling
- API and integration basics
- Production support basics
- Interview preparation
- Modernization fundamentals
- Team onboarding paths
- Enterprise training paths

Each future learning path should require its own content plan and Product Owner approval.

---

## 16.19 Learning Content Risks

Key risks include:

| Risk | Description | Mitigation Direction |
|---|---|---|
| Content inaccuracy | Lessons may contain technical mistakes | Review important content before publishing |
| Content copying | Content may unintentionally resemble external material | Enforce originality policy and manual review |
| Scope overload | Curriculum may grow too large before MVP validation | Keep MVP focused on fundamentals |
| Beginner overwhelm | Lessons may become too advanced too quickly | Use progressive sequencing and simple explanations |
| Low trust | Users may not trust content quality | Maintain review process and update based on feedback |
| AI-generated errors | AI-assisted drafts may include incorrect claims | Human review required before publication |
| Fragmentation | Lessons may become disconnected articles | Maintain learning paths and standard structure |

---

## 16.20 MVP Learning Readiness Checklist

The MVP learning experience should not be considered ready unless:

- A beginner IBM i learning path exists.
- Initial lessons are written in original IBMiHub AI style.
- Lessons follow a clear structure.
- Lessons are reviewed before release.
- Lessons avoid copied content.
- Users can navigate lesson sequence.
- Users can ask AI Tutor questions from the learning flow.
- Users can track lesson completion.
- Users can provide lesson feedback.
- Product Owner has approved the initial learning content.

---

### Summary

Learning content is central to IBMiHub AI.

The MVP should provide a focused IBM i Fundamentals learning path supported by AI Tutor clarification and basic progress tracking.

The content should be original, practical, structured, beginner-friendly, and reviewed before publication.

The product should avoid becoming a random article library or generic chatbot. The learning strategy should help users progress from confusion to confidence while creating a foundation for future labs, quizzes, job log scenarios, RPGLE practice, enterprise training, and certifications.

---

## 17. Monetization Strategy

### Purpose of This Section

The purpose of this section is to define the product-level monetization direction for IBMiHub AI.

IBMiHub AI is being designed as a real SaaS product, but monetization should be introduced carefully. The first priority is to validate user value, trust, engagement, learning outcomes, and AI usefulness. Revenue should follow demonstrated value rather than drive premature product complexity.

This section defines:

- Monetization philosophy
- MVP monetization position
- Potential pricing tiers
- Buyer types
- Revenue expansion stages
- Value drivers
- Future paid capabilities
- Monetization risks
- What is explicitly out of scope for MVP

This section does not define exact pricing, billing implementation, payment provider, tax handling, invoice workflow, subscription system, or revenue forecast. Those decisions should be made later after MVP validation and business review.

---

### Monetization Strategy Statement

IBMiHub AI should monetize by delivering practical IBM i learning, AI assistance, productivity, onboarding, and enterprise training value.

The monetization strategy is:

**Start free or beta-first to validate trust and usage, then introduce paid individual, team, and enterprise plans only after users demonstrate repeated engagement and willingness to pay for advanced value.**

The product should not attempt to monetize before proving that users find the platform useful.

---

## 17.1 Monetization Philosophy

IBMiHub AI should follow these monetization principles.

### 1. Value Before Revenue

The product must first prove that users find value in structured IBM i learning and AI-assisted guidance.

Revenue should come after users understand the product, use it repeatedly, and ask for more advanced capability.

### 2. Trust Before Paywall

IBM i professionals and companies need to trust the content, AI behavior, privacy boundaries, and product quality before paying.

A premature paywall could slow adoption and reduce feedback during MVP validation.

### 3. Free Entry, Paid Depth

The product should eventually allow users to start learning for free, while reserving deeper learning, higher AI usage, practice labs, advanced tools, team features, and enterprise controls for paid plans.

### 4. Individual First, Enterprise Later

The first users are likely to be individual learners and working developers.

Enterprise monetization is important long-term, but should come after the product proves individual value.

### 5. Evidence-Driven Pricing

Pricing should not be guessed too early.

Pricing should be informed by user interviews, beta feedback, AI usage cost, content value, comparable SaaS expectations, and willingness-to-pay signals.

### 6. Avoid MVP Complexity

Billing, subscriptions, invoices, plan limits, and payment workflows should not be part of the MVP unless separately approved later.

---

## 17.2 MVP Monetization Position

The MVP should not include paid subscriptions or billing.

The MVP should focus on:

- Attracting early users
- Validating learning engagement
- Validating AI Tutor usefulness
- Collecting feedback
- Measuring retention
- Understanding willingness to pay
- Identifying which advanced features users value most

### MVP Monetization Status

| Item | MVP Status |
|---|---|
| Paid subscriptions | Out of Scope |
| Billing / checkout | Out of Scope |
| Payment provider integration | Out of Scope |
| Pricing page with final paid tiers | Out of Scope |
| Enterprise sales workflow | Out of Scope |
| Free beta access | In Scope |
| Waitlist or beta interest capture | In Scope |
| Willingness-to-pay feedback | In Scope |
| Future plan messaging | Optional / Should be careful |

The MVP may mention future premium capabilities, but it should not imply that unavailable paid features already exist.

---

## 17.3 Primary Buyer Types

IBMiHub AI may eventually serve multiple buyer types.

### 1. Individual Learners

These users may pay for deeper learning paths, more AI Tutor usage, practice labs, quizzes, interview preparation, and skill validation.

### 2. Working IBM i Developers

These users may pay for advanced AI assistance, RPGLE / CLLE explanations, job log learning, documentation help, practice scenarios, and productivity-oriented tools.

### 3. Team Leads and Mentors

These users may influence team purchases if the product helps onboard juniors and reduce repeated basic questions.

### 4. Companies and Enterprise Teams

These buyers may pay for team learning, onboarding programs, progress reporting, privacy controls, admin features, and enterprise support.

### 5. Interview Candidates and Career Switchers

These users may pay for structured preparation paths, mock quizzes, practice scenarios, and future assessment or certification features.

---

## 17.4 Potential Pricing Tiers

The following tier structure is a product direction, not final pricing.

Exact prices are not approved in this PRD.

### Tier 1: Free

The Free tier should help users experience the product and build trust.

Potential Free tier value:

- Access to selected beginner lessons
- Limited AI Tutor usage
- Basic progress tracking
- Basic glossary access if available
- Product feedback submission
- Access to beta learning content

Purpose:

- Build awareness
- Validate demand
- Support community adoption
- Help beginners start without friction
- Create conversion path to paid plans later

### Tier 2: Pro / Individual

The Pro tier may serve serious learners and working developers.

Potential Pro value:

- Full individual learning paths
- Higher AI Tutor usage
- Advanced IBM i topics
- Expanded quizzes or checks
- Future practice exercises
- Interview preparation content
- Future job log and code explanation tools when approved

Purpose:

- Monetize individual value
- Support users who want deeper learning
- Support working developers who want productivity help
- Create recurring revenue from individual professionals

### Tier 3: Team

The Team tier may serve small teams, team leads, mentors, and companies onboarding multiple learners.

Potential Team value:

- Multiple user seats
- Team learning paths
- Shared onboarding tracks
- Basic team progress visibility
- Assigned lessons or recommended paths
- Team-level feedback and learning insights

Purpose:

- Support team onboarding
- Reduce senior developer mentoring burden
- Create a bridge between individual and enterprise plans

### Tier 4: Enterprise

The Enterprise tier may serve organizations that require training, privacy, controls, reporting, and support.

Potential Enterprise value:

- Enterprise learning access
- Admin controls
- Role-based learning paths
- Progress reporting
- Corporate onboarding packages
- Enterprise privacy and security controls
- Enterprise support
- Future SSO and compliance features when approved

Purpose:

- Support larger organizations
- Monetize corporate training and onboarding value
- Provide long-term business scalability

### Future Add-On Revenue

Future add-ons may include:

- Certification or assessment programs
- Interview preparation packages
- Advanced practice labs
- Enterprise onboarding packages
- Workshops or cohort-based learning
- Premium productivity tools
- Custom corporate learning paths

These are future possibilities, not MVP commitments.

---

## 17.5 Packaging Strategy

IBMiHub AI should package value around user outcomes rather than feature volume.

### Learning Value

Users may pay because they can learn IBM i in a clearer, more structured way.

### AI Assistance Value

Users may pay because AI Tutor helps them understand concepts faster and reduces time spent searching across scattered resources.

### Practice Value

Users may pay for future hands-on practice, labs, quizzes, job log scenarios, and RPGLE / CLLE exercises.

### Productivity Value

Working developers may pay for future tools that help explain code, job logs, documentation, and legacy behavior.

### Team Onboarding Value

Companies may pay because the platform helps reduce onboarding time and dependence on senior experts.

### Enterprise Trust Value

Enterprise customers may pay for privacy, security, administration, reporting, support, and structured training programs.

---

## 17.6 Revenue Stage Strategy

Monetization should evolve in stages.

### Stage 0: MVP / Free Beta

Goal:

- Validate value and trust.

Focus:

- Free access or invite-based beta
- User feedback
- Learning engagement
- AI Tutor usefulness
- Retention
- Willingness-to-pay signals

Revenue:

- No revenue required

### Stage 1: Early Individual Paid Plan

Goal:

- Test whether individual users will pay for deeper learning or higher AI value.

Possible paid value:

- Full learning paths
- Higher AI usage limits
- Advanced topics
- Practice exercises
- Interview preparation

Revenue:

- Individual subscription or one-time learning package may be explored later

### Stage 2: Team Plan

Goal:

- Support small teams and onboarding use cases.

Possible paid value:

- Team seats
- Shared learning paths
- Progress visibility
- Onboarding tracks

Revenue:

- Per-seat or team package may be explored later

### Stage 3: Enterprise Plan

Goal:

- Support organizations with larger IBM i training and onboarding needs.

Possible paid value:

- Enterprise controls
- Reporting
- Privacy and security controls
- Custom onboarding paths
- Support

Revenue:

- Enterprise subscription, annual contracts, or corporate training packages may be explored later

### Stage 4: Expanded Revenue Lines

Goal:

- Monetize advanced product maturity.

Possible revenue lines:

- Certifications
- Advanced labs
- Premium productivity tools
- Workshops
- Enterprise onboarding packages
- Community or expert-led offerings

These should only be considered after the core platform has enough trust and usage.

---

## 17.7 Free-to-Paid Conversion Strategy

Free-to-paid conversion should be based on natural user progression.

Possible conversion triggers include:

- User completes available free lessons and wants more
- User reaches AI Tutor free usage limits
- User asks for advanced RPGLE, CLLE, SQL, or job log content
- User wants practice labs or quizzes
- User wants interview preparation
- User wants to track deeper progress
- User wants to use the platform for team onboarding
- User requests enterprise controls or reporting

The product should avoid aggressive monetization that disrupts early trust.

---

## 17.8 Enterprise Monetization Direction

Enterprise monetization should be treated as a future growth path.

Enterprise buyers may care about:

- Reducing IBM i onboarding time
- Standardizing training
- Preserving legacy knowledge
- Reducing dependency on senior experts
- Supporting modernization initiatives
- Tracking learner progress
- Privacy and security controls
- Corporate support

Enterprise monetization should not be attempted seriously until the product has:

- Strong individual learning experience
- Trusted content
- Useful AI Tutor behavior
- Basic usage evidence
- Clear onboarding value
- Security and privacy readiness

---

## 17.9 Pricing Approach

Exact pricing is not approved in this PRD.

Future pricing decisions should consider:

- User willingness to pay
- Value delivered by learning content
- Value delivered by AI assistance
- AI operating cost
- Content creation and maintenance cost
- Market expectations for developer learning products
- Individual vs team vs enterprise buyer differences
- Regional affordability
- Monthly vs annual subscription options
- Founder-led beta feedback
- Competitive positioning

Pricing should be tested carefully and should remain flexible during early stages.

---

## 17.10 Monetization Metrics

Early monetization-related metrics may include:

- Waitlist sign-ups
- Beta users asking for paid features
- Users requesting more lessons
- Users requesting higher AI limits
- Users asking for practice labs
- Users asking for team onboarding features
- Willingness-to-pay survey responses
- Free-to-paid conversion once paid plans exist
- Paid subscriber count once paid plans exist
- Monthly recurring revenue once paid plans exist
- Churn once paid plans exist
- Enterprise inquiries
- Team plan inquiries

During MVP, the most important monetization signal is not revenue.

The most important signal is whether users find enough value to return, recommend, request more, and show future willingness to pay.

---

## 17.11 Monetization Risks

| Risk | Description | Mitigation Direction |
|---|---|---|
| Monetizing too early | Users may not trust the product enough yet | Keep MVP free or beta-first |
| Pricing too high | Individual IBM i learners may not convert | Validate willingness to pay before final pricing |
| Pricing too low | Product may not cover AI and content costs | Consider AI usage, content cost, and paid depth |
| Free users never convert | Free tier may provide too much value without upgrade path | Keep free useful but reserve deeper value for paid plans |
| Enterprise complexity too early | Enterprise features may distract from MVP | Defer enterprise until individual value is validated |
| AI cost pressure | Heavy AI usage may increase operating cost | Monitor usage and define future limits |
| Weak differentiation | Users may compare against free resources | Build value through structure, AI, practice, and trust |
| Trust concerns | Users may hesitate to pay for AI-generated technical guidance | Maintain original content, review, feedback, and AI boundaries |

---

## 17.12 MVP Monetization Readiness Checklist

The MVP should not be monetized until there is evidence that:

- Users understand the product value.
- Users start and complete lessons.
- Users ask meaningful AI Tutor questions.
- Users return for additional sessions.
- Users provide positive qualitative feedback.
- Users request more lessons or advanced features.
- Users show willingness to pay.
- The platform has enough trust and quality to support paid expectations.
- AI usage cost and limits are understood at a basic level.
- Product Owner approves monetization readiness.

---

## 17.13 Explicitly Out of Scope for MVP Monetization

The following are out of scope for MVP:

- Paid subscriptions
- Billing
- Payment provider integration
- Checkout
- Invoices
- Paid plans
- Pricing page with final prices
- Paywalls
- Enterprise contracts
- Team billing
- Coupon codes
- Refund workflow
- Tax handling
- Subscription management
- Certification payments
- Marketplace revenue

These may be introduced later only after MVP validation and explicit Product Owner approval.

---

### Summary

IBMiHub AI should monetize gradually.

The MVP should focus on free or beta access, user validation, learning engagement, AI Tutor usefulness, retention, and willingness-to-pay signals.

Future monetization may include Free, Pro, Team, and Enterprise tiers, with possible additional revenue from certifications, practice labs, interview preparation, workshops, and advanced productivity tools.

The product should not add billing or paid access before proving that users trust and value the platform.

---

## 18. Technical Constraints & Dependencies

### Purpose of This Section

The purpose of this section is to capture product-relevant technical constraints and dependencies that must be respected while building IBMiHub AI.

This section does not define the final architecture. It does not select a specific framework, hosting provider, database, authentication provider, AI provider, vector database, payment provider, analytics tool, or infrastructure design.

Those decisions should be made later through architecture documents, ADRs, SDD specifications, security review, and implementation planning.

This section defines:

- Product-level technical constraints
- MVP technology boundaries
- External dependency categories
- AI-related constraints
- Data and privacy constraints
- IBM i connectivity constraints
- Future technical dependencies
- Decisions that must be made before implementation

---

### Technical Constraint Strategy Statement

IBMiHub AI should be built as a modern, maintainable, secure, web-based SaaS product, but the MVP should avoid unnecessary complexity.

The technical strategy is:

**Build a simple, extensible MVP that supports structured learning, AI Tutor usage, progress tracking, and feedback collection while avoiding risky or complex capabilities such as real IBM i connectivity, production code upload, sensitive log upload, billing, enterprise administration, and advanced AI workflows.**

The product should remain flexible enough to support future growth, but the MVP should not be overengineered.

---

## 18.1 Constraint Scope

The constraints in this section apply primarily to the approved MVP:

- Public Landing Experience
- User Account and Basic Onboarding
- User Dashboard
- Learning Center
- AI Tutor
- Basic Progress Tracking
- Basic Feedback Collection
- Basic Content Governance

Future modules such as 5250 Practice Lab, RPG Playground, Job Log Analyzer, Code Explanation, Documentation Generator, Enterprise Training, Community, Mobile App, VS Code Extension, and real IBM i connectivity may require additional constraints later.

---

## 18.2 MVP Technical Boundary

The MVP must remain technically limited to a safe learning and AI-assistance experience.

### In Scope for MVP

The MVP may require technical support for:

- Public web pages
- User accounts
- Basic onboarding
- User dashboard
- Learning content display
- Lesson navigation
- Lesson completion tracking
- AI Tutor question and response flow
- AI Tutor feedback
- Lesson feedback
- Basic usage signals
- Basic content update process

### Out of Scope for MVP

The MVP must not include technical support for:

- Real IBM i connectivity
- Live 5250 terminal sessions
- Production source code upload
- Sensitive job log upload
- Real code compilation or execution
- Automated code changes
- Enterprise SSO
- Organization management
- Team dashboards
- Billing and payments
- Certification engine
- Public APIs
- Mobile application
- VS Code extension
- Marketplace
- Customer-specific AI training
- Autonomous agents acting on external systems

These exclusions are important because they reduce security, privacy, compliance, operational, and engineering risk during MVP validation.

---

## 18.3 Architecture Neutrality Constraint

The PRD must remain architecture-neutral.

The PRD may define product needs, constraints, and quality expectations, but it should not prescribe:

- Frontend framework
- Backend framework
- Hosting provider
- Database engine
- Authentication provider
- AI provider
- AI orchestration framework
- Vector database
- Analytics provider
- Payment provider
- Deployment pipeline
- Infrastructure model

These choices should be decided later through engineering review, architecture design, ADRs, and implementation planning.

---

## 18.4 Web-Based SaaS Constraint

IBMiHub AI MVP should be delivered as a web-based product.

This means:

- Users should be able to access the product through a browser.
- No desktop installation should be required for MVP.
- No native mobile app should be required for MVP.
- No IBM i client software should be required for MVP.
- The product should support common desktop and mobile browser usage reasonably well.

A web-based MVP supports faster validation, easier sharing, simpler onboarding, and lower operational complexity.

---

## 18.5 AI Provider and Model Constraints

The MVP depends on an AI capability, but the PRD should not lock the provider or model.

Product-level AI constraints include:

- AI must support IBM i-focused learning and explanation.
- AI responses must respect safety and trust boundaries.
- AI must not claim guaranteed correctness.
- AI must discourage sharing sensitive production data.
- AI must not require real IBM i connectivity in MVP.
- AI must be maintainable and replaceable if provider needs change.
- AI usage should be monitored for quality, cost, and reliability once real users begin using it.

Provider selection, model selection, prompt design, RAG strategy, cost controls, fallback behavior, and AI monitoring should be defined in later AI architecture and implementation documents.

---

## 18.6 AI Cost and Rate Limit Constraints

AI usage introduces cost and usage-limit considerations.

The MVP should be designed with awareness that:

- AI responses may create variable operating cost.
- AI providers may have rate limits.
- AI response latency may vary.
- Heavy usage may require future usage controls.
- Paid plans may later require AI usage limits.
- Enterprise plans may later require separate controls.

The MVP does not need a full monetized usage-limit system, but engineering should avoid choices that make future AI usage management impossible.

---

## 18.7 Data Privacy Constraints

The MVP must avoid high-risk data handling.

The product must not request or store:

- Production IBM i source code
- Sensitive production job logs
- Credentials
- Passwords entered into AI prompts
- Customer data
- Proprietary business data
- Real IBM i connection details

User data collection should remain minimal and limited to what is needed for the MVP learning experience, progress tracking, feedback, and product validation.

Future support for code upload, job log upload, enterprise knowledge bases, or customer-specific content must require separate privacy, security, and compliance review.

---

## 18.8 Security Constraints

Security must be treated as a baseline requirement even during MVP.

Product-level security constraints include:

- User account access must be protected.
- User progress and feedback must not be publicly exposed.
- Internal content update processes must be protected from unauthorized changes.
- Secure communication should be used for user-facing traffic.
- Authentication must not rely on unsafe or improvised handling.
- Secrets and credentials must not be exposed in source code or public repositories.
- Security-sensitive decisions should be documented before implementation.

Detailed security architecture should be defined later by engineering.

---

## 18.9 Authentication and User Account Dependencies

The MVP depends on a way to identify users and associate progress with them.

The product needs:

- Basic account creation or beta access
- Login capability
- Basic user profile
- Association between user and progress
- Association between user and feedback where appropriate

The PRD does not choose an authentication provider or implementation approach.

Enterprise identity features are out of scope for MVP, including:

- Enterprise SSO
- SAML
- SCIM
- Organization-level identity management
- Role-based enterprise permissions

---

## 18.10 Learning Content Management Constraints

The MVP requires a way to publish and maintain learning content.

However, the MVP does not require a full content management system.

Acceptable MVP direction:

- Content can be managed through a simple internal workflow.
- Content should be version-controlled or otherwise traceable.
- Content should support review before publishing.
- Content should be easy enough to update as feedback comes in.

Out of scope for MVP:

- Full CMS
- Multi-author editorial workflow
- User-generated content
- Content marketplace
- Public authoring tools
- Complex editorial dashboard

The exact content storage and management approach should be decided during architecture and implementation planning.

---

## 18.11 Progress Tracking Dependencies

The MVP depends on simple progress tracking.

The product needs a way to track:

- Lessons started, if feasible
- Lessons completed
- Current or recommended learning path
- Basic progress summary
- Continue learning state

Progress tracking should remain simple for MVP and should not become a skill scoring, certification, or enterprise reporting system.

---

## 18.12 Feedback Collection Dependencies

The MVP depends on feedback collection to validate product direction.

The product needs a way to collect:

- Lesson feedback
- AI Tutor helpfulness feedback
- General product feedback
- Topic requests
- User confusion points

The MVP does not require a full support ticketing system or customer success platform.

Feedback should be reviewable by the Product Owner so future decisions can be evidence-driven.

---

## 18.13 Analytics and Observability Dependencies

The MVP needs basic visibility into usage and failure points.

The product should be able to support basic understanding of:

- User activation
- Lesson starts and completions
- AI Tutor usage
- AI feedback
- Returning usage
- Feedback submissions
- Core flow failures

The MVP should avoid collecting unnecessary or sensitive data.

Advanced observability dashboards, enterprise analytics, and complex event pipelines are not required for MVP.

---

## 18.14 IBM i Connectivity Constraint

Real IBM i connectivity is explicitly out of scope for the MVP.

The MVP must not connect to:

- Customer IBM i systems
- Production IBM i systems
- Live 5250 sessions
- Real IBM i databases
- Real job queues
- Real output queues
- Real source libraries
- Real object libraries

This constraint protects the product from major security, privacy, compliance, operational, and support complexity during MVP.

Future IBM i connectivity may be considered only after:

- MVP validation
- Security review
- Privacy review
- Architecture review
- Clear customer use case approval
- Explicit Product Owner approval

---

## 18.15 Production Code and Job Log Constraint

The MVP must not support upload or storage of private production code or sensitive job logs.

Users may ask conceptual questions about RPGLE, CLLE, SQL, DDS, job logs, and IBM i behavior, but the product should discourage sharing sensitive real-world production material.

Future code or log analysis features should require:

- Clear upload policy
- Data retention policy
- Privacy controls
- Security review
- Terms of use review
- Enterprise controls where needed
- Explicit Product Owner approval

---

## 18.16 Payment and Billing Constraint

Billing is out of scope for MVP.

The MVP must not require:

- Payment provider integration
- Checkout
- Paid subscriptions
- Invoice generation
- Coupon handling
- Tax handling
- Subscription management
- Paid access control
- Refund workflow

Future monetization may require these capabilities, but only after MVP validation and explicit approval.

---

## 18.17 Enterprise Feature Constraints

Enterprise features are out of scope for MVP.

The MVP should not include:

- Organization accounts
- Team administration
- Admin dashboards
- Enterprise SSO
- Role-based enterprise permissions
- Compliance certifications
- Enterprise audit logs
- Corporate training contracts
- Manager reporting

However, engineering should avoid decisions that make future enterprise expansion unnecessarily difficult.

---

## 18.18 External Dependency Categories

IBMiHub AI may eventually depend on several external service categories.

Possible dependency categories include:

| Dependency Category | Product Need | MVP Relevance |
|---|---|---|
| Hosting / Deployment | Run the web application | Required |
| Database / Storage | Store users, progress, feedback, and content metadata | Required |
| Authentication | Support login and user identity | Required |
| AI Provider | Power AI Tutor responses | Required |
| Email / Notifications | Account or beta communication if needed | Optional |
| Analytics | Understand MVP usage and validation signals | Optional / Should Have |
| Error Monitoring | Understand failures and improve reliability | Optional / Should Have |
| Payment Provider | Future subscriptions and billing | Future |
| Enterprise Identity | Future SSO and organization controls | Future |
| File Storage | Future uploads or content assets | Future |
| Vector Search / Retrieval | Future grounded AI or content-aware AI | Future |

The PRD does not select vendors for these categories.

---

## 18.19 Engineering Decisions Required Later

Before Sprint 1 implementation begins, engineering should define or confirm:

- MVP technology stack
- Application architecture
- Hosting and deployment approach
- Database and data model direction
- Authentication approach
- AI provider and model approach
- AI prompt and safety strategy
- Content storage approach
- Progress tracking approach
- Feedback storage and review approach
- Analytics approach
- Error monitoring approach
- Environment and secrets management
- Basic security posture
- Development workflow
- Testing strategy

These decisions should be captured in architecture documents, ADRs, implementation plans, or SDD specs as appropriate.

---

## 18.20 Technical Dependency Risks

| Risk | Description | Mitigation Direction |
|---|---|---|
| AI provider dependency | AI quality, cost, latency, or availability may affect product experience | Keep provider decision documented and avoid unnecessary lock-in |
| Cost unpredictability | AI usage may create variable cost | Monitor usage and define future limits |
| Authentication complexity | Poor auth choices may create security or UX issues | Use a secure, well-understood approach |
| Content management complexity | Building a full CMS too early may delay MVP | Use a simple maintainable MVP process |
| Analytics overcollection | Excessive tracking may create privacy concerns | Collect only useful MVP validation signals |
| Real IBM i connectivity pressure | Users may request live integration too early | Keep connectivity out of MVP and revisit after validation |
| Future enterprise needs | Early choices may limit enterprise growth | Document trade-offs and use ADRs |
| Vendor lock-in | Early provider choices may be hard to change | Keep abstraction and portability in mind where practical |

---

## 18.21 MVP Technical Readiness Checklist

The MVP technical foundation should not be considered ready unless:

- Users can access the product through a browser.
- User account and basic onboarding flows are supported.
- Learning content can be displayed and updated.
- Lesson progress can be tracked.
- AI Tutor can answer IBM i learning questions.
- AI Tutor respects trust and privacy boundaries.
- Feedback can be submitted and reviewed.
- User data is protected appropriately.
- No real IBM i connectivity exists in MVP.
- No production code upload exists in MVP.
- No sensitive job log upload exists in MVP.
- No billing or paid access exists in MVP.
- Key architecture decisions are documented before implementation.
- Product Owner has reviewed and approved the MVP technical boundaries.

---

### Summary

IBMiHub AI should be built as a simple, secure, maintainable, web-based SaaS MVP.

The MVP should support learning, AI Tutor, progress tracking, and feedback without introducing risky or complex capabilities too early.

The PRD remains architecture-neutral. Specific technology choices should be made later through engineering architecture, ADRs, SDD specs, and implementation planning.

The most important MVP technical boundary is clear: no real IBM i connectivity, no production code upload, no sensitive job log upload, no billing, and no enterprise complexity until product value is validated.

---

## 19. Risk Analysis

### Purpose of This Section

The purpose of this section is to identify the major product, market, AI, content, privacy, technical, execution, and monetization risks for IBMiHub AI.

Risk analysis is important because IBMiHub AI has a broad long-term vision. Without active risk management, the product could become too large, too complex, too generic, too expensive, or too risky before validating real user value.

This section defines:

- Key product risks
- MVP risks
- AI trust and safety risks
- Content quality and originality risks
- Security and privacy risks
- Market and adoption risks
- Execution risks
- Monetization risks
- Technical dependency risks
- Risk ownership and mitigation direction

This section does not solve every risk in detail. Detailed mitigation plans should be handled through SDD specs, architecture documents, implementation plans, QA plans, security review, content review, and Product Owner decisions.

---

### Risk Strategy Statement

IBMiHub AI should manage risk by staying focused, validating early, avoiding sensitive capabilities in MVP, maintaining original content, setting clear AI trust boundaries, and expanding only after evidence of user value.

The risk strategy is:

**Start with a narrow, safe, useful MVP; learn from real users; protect trust; avoid premature complexity; and only expand into advanced AI, IBM i connectivity, enterprise, billing, and productivity workflows after explicit review and approval.**

---

## 19.1 Risk Rating Definitions

The following rating definitions should be used consistently.

### Likelihood

| Rating | Meaning |
|---|---|
| Low | Unlikely during MVP if current constraints are followed |
| Medium | Possible and should be actively monitored |
| High | Likely unless actively managed |

### Impact

| Rating | Meaning |
|---|---|
| Low | Limited inconvenience or minor delay |
| Medium | Could affect user trust, delivery timeline, or MVP validation |
| High | Could seriously damage product trust, security, delivery, or business viability |

### Ownership

Risk ownership indicates who should monitor and drive mitigation.

| Owner | Responsibility |
|---|---|
| Product | Scope, positioning, content direction, user validation, roadmap |
| Engineering | Implementation quality, reliability, security, technical decisions |
| Product + Engineering | Shared risks requiring product and technical decisions |
| Founder / Business | Monetization, go-to-market, community trust, partnerships |

---

## 19.2 Risk Summary

| Risk Category | Overall MVP Risk Level | Primary Owner |
|---|---|---|
| Scope Creep | High | Product |
| AI Accuracy and Trust | High | Product + Engineering |
| Privacy and Sensitive Data | High | Product + Engineering |
| Content Quality and Originality | High | Product |
| Market Adoption | Medium | Founder / Business |
| Execution and Delivery | Medium | Product + Engineering |
| Technical Dependencies | Medium | Engineering |
| Monetization Timing | Medium | Founder / Business |
| User Experience Complexity | Medium | Product |
| Community Reputation | Medium | Founder / Business |
| Security | Medium | Engineering |
| Future Enterprise Readiness | Low / Future | Product + Engineering |

The highest MVP risks are scope creep, AI trust, privacy, and content quality.

These risks should be actively managed from the beginning.

---

## 19.3 Scope Creep Risk

### Risk Description

IBMiHub AI has a broad long-term vision that includes learning, AI Tutor, 5250 labs, RPG playground, job log analyzer, code explanation, documentation generator, enterprise training, certifications, community, mobile app, and VS Code extension.

The risk is that the team may try to build too many modules before validating the core MVP.

### Likelihood

High

### Impact

High

### Why This Matters

Scope creep could delay MVP launch, increase complexity, reduce product focus, and make the first release harder to test with real users.

### Mitigation Direction

- Keep MVP limited to approved Sections 11–18.
- Treat future modules as future, not current.
- Do not add real IBM i connectivity, billing, enterprise features, or advanced tools to MVP.
- Use Product Owner approval before adding any new feature.
- Use SDD specs before implementation.
- Prioritize Learning Center, AI Tutor, Dashboard, Progress Tracking, and Feedback.

### Risk Owner

Product

### Monitoring Signals

- New features being added without PRD approval
- Claude or engineering generating code outside approved scope
- MVP discussions shifting toward future modules
- Sprint 1 planning becoming too large
- Delays caused by non-MVP work

---

## 19.4 AI Accuracy and Trust Risk

### Risk Description

The AI Tutor may produce incomplete, incorrect, generic, or overconfident technical explanations.

Because IBM i is a specialized technical ecosystem, poor AI answers could damage user trust quickly.

### Likelihood

High

### Impact

High

### Why This Matters

AI is one of the product's main differentiators. If users do not trust the AI Tutor, the product may be perceived as unreliable or generic.

### Mitigation Direction

- Keep MVP AI limited to learning and explanation.
- Avoid production troubleshooting guarantees.
- Clearly state that AI output should be validated.
- Discourage sharing private code, logs, credentials, or sensitive business data.
- Collect helpful / not helpful feedback.
- Review common AI failure patterns.
- Improve prompts, content, and guardrails over time.
- Keep AI provider and implementation decisions documented later through architecture and ADRs.

### Risk Owner

Product + Engineering

### Monitoring Signals

- Users marking AI answers as not helpful
- Users reporting incorrect AI responses
- AI answers sounding generic or non-IBM i-specific
- Repeated follow-ups due to confusion
- Users applying AI guidance as production truth
- AI giving overconfident answers without context

---

## 19.5 Privacy and Sensitive Data Risk

### Risk Description

Users may paste private production source code, sensitive job logs, credentials, customer data, or proprietary business information into the AI Tutor.

Even if the MVP does not support upload features, users may still enter sensitive text into prompts.

### Likelihood

Medium / High

### Impact

High

### Why This Matters

Privacy mistakes could damage user trust and create legal, security, or enterprise adoption concerns.

### Mitigation Direction

- MVP must not support production code upload.
- MVP must not support sensitive job log upload.
- AI Tutor should discourage users from sharing sensitive data.
- Product messaging should clearly define safe usage.
- User data collection should remain minimal.
- Future code/log upload should require security, privacy, and compliance review.
- Terms, privacy messaging, and acceptable-use guidance should be defined before broader launch.

### Risk Owner

Product + Engineering

### Monitoring Signals

- Users attempting to paste production code
- Users asking whether real logs or code can be uploaded
- AI prompts containing sensitive-looking material
- Enterprise users asking about data handling
- Confusion around what data is safe to share

---

## 19.6 Content Quality Risk

### Risk Description

Learning content may be unclear, inaccurate, too shallow, too advanced, or inconsistent.

The MVP depends heavily on content quality because Learning Center is the core product foundation.

### Likelihood

Medium

### Impact

High

### Why This Matters

If content is weak, users may see the product as another low-quality tutorial site rather than a trusted IBM i learning platform.

### Mitigation Direction

- Use the approved Learning & Content Strategy.
- Start with a focused IBM i Fundamentals path.
- Follow a consistent lesson structure.
- Review important lessons before publishing.
- Collect lesson feedback.
- Improve content based on confusion points.
- Avoid overloading beginners.
- Ensure working developers still find practical value.

### Risk Owner

Product

### Monitoring Signals

- Low lesson completion
- Lesson feedback marked not helpful
- Users reporting confusion
- Users asking basic questions that lessons should answer
- High drop-off after first lesson
- Content feeling disconnected or random

---

## 19.7 Originality and Copying Risk

### Risk Description

IBMiHub AI may unintentionally copy or closely imitate external IBM i tutorials, documentation, blogs, books, examples, or courses.

This could create legal, ethical, and reputation risks.

### Likelihood

Medium

### Impact

High

### Why This Matters

Original content is a core product principle and a key differentiator. Copying existing content would damage trust and weaken the product's strategic position.

### Mitigation Direction

- Enforce original content policy.
- Use external sources only for research and validation.
- Do not copy phrasing, structure, examples, or lesson flow.
- Create original scenarios and examples.
- Review content before publishing.
- Credit external references where appropriate.
- Avoid asking AI to imitate specific websites, authors, books, or courses.

### Risk Owner

Product

### Monitoring Signals

- Content closely resembles known tutorial sites
- AI-generated content uses familiar copied phrasing
- Lessons rely too heavily on external structure
- Missing references for externally validated claims
- User or community concerns about copied content

---

## 19.8 Market Adoption Risk

### Risk Description

The IBM i audience is specialized. The market may be smaller, harder to reach, or slower to adopt than expected.

Users may prefer existing resources, internal mentoring, official documentation, community groups, or generic AI tools.

### Likelihood

Medium

### Impact

High

### Why This Matters

Even a well-built product can fail if the target users do not adopt it, do not return, or do not see enough value.

### Mitigation Direction

- Start with founder-led and community-led validation.
- Share early demos and learning content.
- Build credibility with original, practical content.
- Focus on users who feel the pain most strongly.
- Track activation, retention, AI usage, and qualitative feedback.
- Avoid large investment in advanced features before validation.
- Use beta feedback to refine positioning.

### Risk Owner

Founder / Business

### Monitoring Signals

- Low waitlist or beta interest
- Users visit but do not start lessons
- Users start but do not return
- Low AI Tutor usage
- Weak LinkedIn/community response
- Users say existing resources are enough
- Users do not request more content or features

---

## 19.9 Positioning Risk

### Risk Description

Users may misunderstand IBMiHub AI as:

- A generic chatbot
- Another static tutorial website
- A replacement for IBM documentation
- A production troubleshooting tool
- A full IBM i lab environment
- A coding assistant or IDE replacement

### Likelihood

Medium

### Impact

Medium / High

### Why This Matters

Wrong positioning can attract the wrong users, create unrealistic expectations, or reduce trust when future features are not available in MVP.

### Mitigation Direction

- Keep landing page messaging clear.
- Explain MVP capabilities honestly.
- Distinguish current MVP from future roadmap.
- Emphasize structured learning and AI-assisted guidance.
- Avoid overpromising future modules.
- Make AI trust boundaries visible.
- Position as complementary to IBM documentation and community resources.

### Risk Owner

Product + Founder / Business

### Monitoring Signals

- Users ask for unavailable features immediately
- Users think the product connects to real IBM i systems
- Users ask where the RPG playground or job log analyzer is
- Users compare it only to generic AI chatbots
- Users misunderstand what is free, beta, or future

---

## 19.10 Execution and Delivery Risk

### Risk Description

The project may slow down due to too much documentation, unclear ownership, too many open decisions, or premature coding without approved specs.

### Likelihood

Medium

### Impact

Medium

### Why This Matters

The project is using a disciplined SDD approach. This improves quality, but it must not become so heavy that delivery stalls.

### Mitigation Direction

- Complete PRD section by section.
- Keep Sprint 0 focused on documentation foundation.
- Move to SDD specs after PRD reaches sufficient maturity.
- Keep Product, Architecture, and Implementation decisions separate.
- Use PROJECT_STATE.md to track progress.
- Avoid coding before approved specs.
- Keep Sprint 1 implementation narrow.

### Risk Owner

Product + Engineering

### Monitoring Signals

- Many documents but no clear next implementation path
- Repeated changes to approved scope
- Claude generates source code too early
- Sprint 1 cannot be planned from PRD
- Open questions block progress
- Documentation becomes inconsistent

---

## 19.11 Technical Dependency Risk

### Risk Description

The product will depend on external services for hosting, authentication, database/storage, AI, analytics, and possibly email or monitoring.

Provider limitations, cost, latency, outages, or lock-in could affect product quality.

### Likelihood

Medium

### Impact

Medium

### Why This Matters

Even though the PRD remains architecture-neutral, future engineering decisions will affect cost, scalability, maintainability, reliability, and user experience.

### Mitigation Direction

- Make technical decisions through architecture documents and ADRs.
- Avoid unnecessary provider lock-in where practical.
- Keep AI provider replaceability in mind.
- Monitor AI usage cost and latency.
- Use secure and maintainable authentication.
- Avoid overengineering the MVP.
- Document trade-offs before implementation.

### Risk Owner

Engineering

### Monitoring Signals

- AI latency is poor
- AI cost grows unexpectedly
- Authentication implementation becomes complex
- Provider limits affect beta users
- Engineering decisions are undocumented
- Technology choices block future modules

---

## 19.12 Security Risk

### Risk Description

User accounts, progress data, feedback data, content management, and AI interactions may be mishandled if security is treated as a later concern.

### Likelihood

Medium

### Impact

High

### Why This Matters

Trust is central to IBMiHub AI. Security issues could damage user confidence and block future enterprise adoption.

### Mitigation Direction

- Use secure authentication practices.
- Protect user data and feedback.
- Do not expose private user data through public pages or URLs.
- Do not store secrets in source code.
- Use secure communication for application traffic.
- Keep sensitive features out of MVP.
- Review security-sensitive decisions before implementation.

### Risk Owner

Engineering

### Monitoring Signals

- Unclear authentication approach
- User data visible without proper access control
- Secrets or keys appear in code or repository
- Feedback or AI history exposed incorrectly
- Security decisions not documented
- Users ask about privacy and security but answers are unclear

---

## 19.13 Monetization Risk

### Risk Description

The product may monetize too early, too late, too aggressively, or with unclear value packaging.

Users may not be willing to pay unless the product proves strong learning, AI, practice, or productivity value.

### Likelihood

Medium

### Impact

Medium / High

### Why This Matters

IBMiHub AI is intended to become a business, but monetization before trust can harm adoption. Delaying monetization too long may also make sustainability difficult later.

### Mitigation Direction

- Keep MVP free or beta-first.
- Collect willingness-to-pay signals.
- Do not add billing to MVP.
- Validate which features users value most.
- Introduce paid plans only after repeated engagement.
- Keep pricing flexible until enough data exists.
- Consider AI cost when designing future paid tiers.

### Risk Owner

Founder / Business

### Monitoring Signals

- Users do not return after free usage
- Users request more but resist paying
- AI costs grow without monetization path
- Paid plan ideas are unclear
- Enterprise interest appears before product is ready
- Pricing decisions are made without validation

---

## 19.14 Community and Reputation Risk

### Risk Description

The IBM i community may reject the product if it appears disrespectful, inaccurate, copied, overhyped, or dismissive of existing IBM i experts and resources.

### Likelihood

Medium

### Impact

High

### Why This Matters

Community trust is critical in a specialized ecosystem. A small number of negative impressions could slow adoption.

### Mitigation Direction

- Respect existing IBM i resources and experts.
- Position IBMiHub AI as complementary.
- Avoid claiming to replace IBM documentation or human expertise.
- Be transparent about AI limitations.
- Create original, useful content.
- Share progress humbly.
- Invite feedback from experienced IBM i professionals.

### Risk Owner

Founder / Business

### Monitoring Signals

- Negative community feedback
- Concerns about AI accuracy
- Concerns about copied content
- Users feel IBM i is being misrepresented
- Experts feel the product overclaims
- Low willingness to recommend

---

## 19.15 User Experience Risk

### Risk Description

The MVP may become confusing if users see too many modules, future features, technical terms, or unclear next steps.

### Likelihood

Medium

### Impact

Medium

### Why This Matters

The first MVP must make it easy for beginners and working developers to reach value quickly.

### Mitigation Direction

- Keep onboarding simple.
- Make next lesson obvious.
- Keep dashboard uncluttered.
- Avoid exposing too many future modules.
- Separate beginner and working-developer needs where feasible.
- Use clear language and practical examples.
- Collect feedback on confusion points.

### Risk Owner

Product

### Monitoring Signals

- Users do not know where to start
- Users abandon onboarding
- Users do not start first lesson
- Users ignore dashboard recommendations
- Users ask what the product is supposed to do
- Users confuse future features with MVP features

---

## 19.16 Content Maintenance Risk

### Risk Description

Content may become outdated, inconsistent, incomplete, or difficult to manage as the product grows.

### Likelihood

Medium

### Impact

Medium

### Why This Matters

IBMiHub AI depends on content as a core asset. Poor content maintenance can reduce trust over time.

### Mitigation Direction

- Keep content version-controlled or traceable.
- Use a consistent lesson structure.
- Start with a focused content scope.
- Update lessons based on feedback.
- Avoid multi-author complexity during MVP.
- Define future content governance before scaling.

### Risk Owner

Product

### Monitoring Signals

- Lessons become inconsistent
- Feedback identifies repeated errors
- Content updates are difficult to track
- Many new lessons are started but not reviewed
- Users ask for corrections
- Product voice becomes inconsistent

---

## 19.17 Future Enterprise Risk

### Risk Description

The product may eventually need enterprise-grade privacy, security, reporting, SSO, administration, and support, but building these too early would overload MVP.

### Likelihood

Low during MVP / Medium later

### Impact

Medium / High later

### Why This Matters

Enterprise revenue may be important long-term, but enterprise requirements can create major complexity.

### Mitigation Direction

- Keep enterprise features out of MVP.
- Avoid early decisions that block future enterprise expansion.
- Revisit enterprise requirements after individual value is validated.
- Define enterprise features through separate PRD updates and SDD specs.
- Conduct security and privacy review before enterprise workflows.

### Risk Owner

Product + Engineering

### Monitoring Signals

- Enterprise prospects ask for SSO or admin dashboards
- Team features requested before MVP validation
- Architecture choices make enterprise expansion difficult
- Privacy or security concerns block enterprise conversations
- Product roadmap shifts too early toward enterprise

---

## 19.18 Risk Mitigation Priorities for MVP

The most important MVP mitigation priorities are:

| Priority | Risk Area | Mitigation Focus |
|---|---|---|
| 1 | Scope Creep | Keep MVP limited to learning, AI Tutor, progress, feedback |
| 2 | AI Trust | Use caution, feedback, and IBM i-specific behavior |
| 3 | Privacy | Avoid sensitive uploads and discourage sensitive prompt sharing |
| 4 | Content Quality | Review original beginner-focused lessons |
| 5 | User Activation | Make onboarding and first lesson simple |
| 6 | Market Validation | Test with real IBM i users early |
| 7 | Technical Simplicity | Avoid overengineering and risky integrations |
| 8 | Monetization Timing | Keep MVP free/beta-first until value is proven |

---

## 19.19 MVP Risk Readiness Checklist

Before MVP release, the Product Owner should confirm:

- MVP scope has not expanded beyond approved sections.
- AI Tutor does not claim guaranteed correctness.
- AI Tutor discourages sensitive data sharing.
- Product does not support real IBM i connectivity.
- Product does not support production code upload.
- Product does not support sensitive job log upload.
- Product does not include billing or paid access.
- Learning content is original and reviewed.
- Landing page does not overpromise future features.
- Users have a clear first learning action.
- Feedback collection exists.
- Basic security and privacy expectations are addressed.
- Key technical decisions are documented before implementation.
- Product Owner has approved MVP release boundaries.

---

## 19.20 Risk Review Process

Risk review should not be a one-time activity.

Risks should be revisited:

- Before Sprint 1 implementation
- Before MVP beta release
- After early user feedback
- Before adding any advanced AI feature
- Before allowing code or log uploads
- Before enabling billing
- Before pursuing enterprise customers
- Before launching community features

Risk status should be reflected in PROJECT_STATE.md when relevant.

---

### Summary

IBMiHub AI has a strong opportunity, but it also has meaningful risks.

The biggest early risks are scope creep, AI trust, privacy, content quality, and market adoption.

The best mitigation is to keep the MVP narrow, safe, original, useful, and evidence-driven.

The product should validate learning and AI assistance first, then expand into advanced tools, enterprise features, monetization, community, and real IBM i workflows only after explicit review and Product Owner approval.

---

## 20. Assumptions & Open Questions

### Purpose of This Section

The purpose of this section is to make current assumptions explicit and track open questions that must be resolved before implementation, MVP launch, or later product expansion.

Assumptions are things the product is currently treating as true, but which may still need validation.

Open questions are unresolved decisions that require Product Owner, Engineering, Business, Legal, Security, or future user input.

This section helps prevent hidden assumptions from becoming accidental product decisions.

---

### Assumption and Question Management Strategy

IBMiHub AI should manage assumptions and open questions through disciplined review.

The strategy is:

**Make assumptions visible, validate them through user feedback and delivery learning, and resolve open questions before they block Sprint 1, MVP release, monetization, or future expansion.**

Assumptions should not be treated as permanent truth.

Open questions should not be silently converted into implementation decisions.

---

## 20.1 Status Definitions

### Assumption Status

| Status | Meaning |
|---|---|
| Active | Currently assumed true and used for planning |
| Needs Validation | Requires user, market, technical, or business validation |
| Validated | Supported by evidence or explicit Product Owner approval |
| Invalidated | Proven false or no longer appropriate |
| Replaced | Superseded by a better assumption or approved decision |

### Question Status

| Status | Meaning |
|---|---|
| Open | Decision still needed |
| In Review | Being evaluated by Product Owner, Engineering, or Business |
| Decided | Decision has been made and should be reflected in relevant documents |
| Deferred | Not needed for MVP or current phase |
| Blocker | Must be resolved before progress can continue |

---

## 20.2 Product Assumptions

| ID | Assumption | Status | Owner | Validation Method |
|---|---|---|---|---|
| ASM-PROD-001 | A focused IBM i learning and AI assistance MVP is valuable enough to test with early users. | Active | Product | Beta usage, feedback, retention |
| ASM-PROD-002 | The first MVP should focus on Beginner IBM i Learners and Working IBM i Developers. | Active | Product | User interviews, beta engagement |
| ASM-PROD-003 | Structured learning plus AI Tutor is a better starting point than advanced tools such as 5250 labs or job log analyzer. | Active | Product | MVP engagement and feature requests |
| ASM-PROD-004 | Users will prefer a guided IBM i learning path over disconnected article-style content. | Needs Validation | Product | Lesson completion and qualitative feedback |
| ASM-PROD-005 | Working IBM i developers will find value in AI-assisted concept refreshers even without production code upload. | Needs Validation | Product | AI Tutor usage and feedback |
| ASM-PROD-006 | MVP should remain narrow even if users request future features early. | Active | Product | Scope review and Product Owner approval |

---

## 20.3 Market and User Assumptions

| ID | Assumption | Status | Owner | Validation Method |
|---|---|---|---|---|
| ASM-MKT-001 | There is enough early interest in the IBM i community to validate the product through a beta. | Needs Validation | Founder / Business | Waitlist, LinkedIn response, direct outreach |
| ASM-MKT-002 | IBM i professionals will respond positively to a respectful AI-first product positioned as complementary to existing resources. | Needs Validation | Founder / Business | Community feedback |
| ASM-MKT-003 | Early users can be reached through founder network, LinkedIn, IBM i community groups, and direct outreach. | Active | Founder / Business | Outreach response rate |
| ASM-MKT-004 | The first market does not require broad paid advertising. | Active | Founder / Business | Organic beta interest |
| ASM-MKT-005 | English-language content is sufficient for MVP validation. | Active | Product | Beta user profile and feedback |
| ASM-MKT-006 | Enterprise buyers should not drive first MVP scope. | Active | Product | Product scope review |

---

## 20.4 Learning and Content Assumptions

| ID | Assumption | Status | Owner | Validation Method |
|---|---|---|---|---|
| ASM-CONT-001 | IBM i Fundamentals is the right first learning path. | Active | Product | Lesson engagement and feedback |
| ASM-CONT-002 | Initial learning content can be created originally without copying external tutorials or documentation. | Active | Product | Manual content review |
| ASM-CONT-003 | A consistent lesson structure will improve content quality and user confidence. | Active | Product | Lesson feedback |
| ASM-CONT-004 | The Product Owner can write or review initial MVP lessons. | Active | Product | Content delivery progress |
| ASM-CONT-005 | Users will provide enough feedback to improve lessons after beta. | Needs Validation | Product | Feedback submissions |
| ASM-CONT-006 | Lightweight quizzes and glossary can be deferred or kept optional if they slow MVP. | Active | Product | MVP prioritization review |

---

## 20.5 AI Assumptions

| ID | Assumption | Status | Owner | Validation Method |
|---|---|---|---|---|
| ASM-AI-001 | An AI Tutor can provide useful IBM i learning explanations within MVP scope. | Needs Validation | Product + Engineering | AI response testing and user feedback |
| ASM-AI-002 | AI Tutor should remain provider-neutral at PRD stage. | Active | Product + Engineering | Architecture review |
| ASM-AI-003 | AI Tutor should not support production troubleshooting guarantees in MVP. | Active | Product | Scope and risk review |
| ASM-AI-004 | Users can receive value from conceptual AI help without uploading production code or logs. | Needs Validation | Product | AI Tutor usage and qualitative feedback |
| ASM-AI-005 | AI caution and privacy messaging will reduce unsafe sharing of sensitive information. | Needs Validation | Product + Engineering | Prompt review and user behavior |
| ASM-AI-006 | Helpful / not helpful feedback is enough for initial AI quality learning. | Needs Validation | Product | Feedback quality review |

---

## 20.6 Technical Assumptions

| ID | Assumption | Status | Owner | Validation Method |
|---|---|---|---|---|
| ASM-TECH-001 | A web-based SaaS MVP is the right delivery model. | Active | Product + Engineering | Architecture review |
| ASM-TECH-002 | MVP can be built without real IBM i connectivity. | Active | Product + Engineering | Scope validation |
| ASM-TECH-003 | Basic authentication, progress tracking, AI Tutor, and feedback can be implemented without enterprise complexity. | Active | Engineering | Sprint 1 planning |
| ASM-TECH-004 | Content can be managed through a simple internal workflow rather than a full CMS. | Active | Product + Engineering | Content workflow test |
| ASM-TECH-005 | Basic analytics and feedback review can support MVP validation without heavy observability tooling. | Active | Product + Engineering | MVP measurement review |
| ASM-TECH-006 | Technology choices can be deferred to architecture and ADR documents. | Active | Engineering | Architecture planning |

---

## 20.7 Business and Monetization Assumptions

| ID | Assumption | Status | Owner | Validation Method |
|---|---|---|---|---|
| ASM-BIZ-001 | MVP should be free or beta-first. | Active | Founder / Business | MVP launch plan |
| ASM-BIZ-002 | Paid plans should be introduced only after repeated value is demonstrated. | Active | Founder / Business | Engagement and willingness-to-pay signals |
| ASM-BIZ-003 | Future monetization may include Free, Pro, Team, and Enterprise tiers. | Active | Founder / Business | User and buyer validation |
| ASM-BIZ-004 | Exact pricing should not be locked before MVP validation. | Active | Founder / Business | Pricing research |
| ASM-BIZ-005 | Individual value should be validated before enterprise monetization. | Active | Founder / Business | Beta usage and enterprise inquiry review |
| ASM-BIZ-006 | AI usage cost will become important once real users begin using AI Tutor. | Active | Product + Engineering | AI usage monitoring |

---

## 20.8 Open Product Questions

| ID | Question | Owner | Needed Before | Status |
|---|---|---|---|---|
| OQ-PROD-001 | Should MVP beta be invite-only, public beta, or limited-access waitlist? | Product / Founder | MVP launch | Open |
| OQ-PROD-002 | What is the minimum number of lessons required for MVP release? | Product | Sprint 1 planning | Open |
| OQ-PROD-003 | Should MVP include quizzes or defer them to early post-MVP? | Product | Sprint 1 planning | Open |
| OQ-PROD-004 | Should MVP include a glossary or defer it to early post-MVP? | Product | Sprint 1 planning | Open |
| OQ-PROD-005 | Should users be required to create an account before viewing lessons? | Product | MVP UX design | Open |
| OQ-PROD-006 | What onboarding question set should be used to separate beginners from working developers? | Product | MVP UX design | Open |
| OQ-PROD-007 | What exact landing page call-to-action should be used: Start Learning, Join Beta, or Join Waitlist? | Product / Founder | Landing page spec | Open |
| OQ-PROD-008 | What MVP success threshold is good enough to move into post-MVP expansion? | Product / Founder | MVP evaluation | Open |

---

## 20.9 Open AI Questions

| ID | Question | Owner | Needed Before | Status |
|---|---|---|---|---|
| OQ-AI-001 | Which AI provider and model should power the MVP AI Tutor? | Engineering | AI architecture | Open |
| OQ-AI-002 | Should AI Tutor be available only after login or partially available publicly? | Product + Engineering | MVP UX design | Open |
| OQ-AI-003 | Should AI Tutor use only prompt guidance in MVP or also include lesson-aware context? | Product + Engineering | AI implementation spec | Open |
| OQ-AI-004 | Should AI conversation history be stored, and if yes, for how long? | Product + Engineering | Privacy review | Open |
| OQ-AI-005 | What exact privacy warning should appear near the AI Tutor input? | Product | AI Tutor spec | Open |
| OQ-AI-006 | Should the product detect or block sensitive-looking prompts in MVP? | Product + Engineering | Security / privacy review | Open |
| OQ-AI-007 | What AI feedback options are required for MVP: helpful/not helpful only, or additional reason capture? | Product | AI Tutor spec | Open |

---

## 20.10 Open Content Questions

| ID | Question | Owner | Needed Before | Status |
|---|---|---|---|---|
| OQ-CONT-001 | What exact lessons should be included in the first IBM i Fundamentals path? | Product | Content planning | Open |
| OQ-CONT-002 | What is the approved standard lesson template for MVP content? | Product | Content planning | Open |
| OQ-CONT-003 | Who will technically review IBM i lesson content before MVP release? | Product | MVP release | Open |
| OQ-CONT-004 | Where should content references and research notes be stored? | Product | Content workflow | Open |
| OQ-CONT-005 | What is the minimum content quality checklist before publishing a lesson? | Product | Content workflow | Open |
| OQ-CONT-006 | Should lessons include explicit links to official IBM documentation where appropriate? | Product | Content policy | Open |
| OQ-CONT-007 | Should lesson content be stored as files, database records, or another content format? | Engineering | Architecture planning | Open |

---

## 20.11 Open Technical Questions

| ID | Question | Owner | Needed Before | Status |
|---|---|---|---|---|
| OQ-TECH-001 | What technology stack should be used for the MVP web application? | Engineering | Sprint 1 implementation | Open |
| OQ-TECH-002 | What hosting and deployment approach should be used? | Engineering | Sprint 1 implementation | Open |
| OQ-TECH-003 | What database or storage approach should be used for users, progress, content metadata, and feedback? | Engineering | Architecture planning | Open |
| OQ-TECH-004 | What authentication approach should be used for MVP? | Engineering | Architecture planning | Open |
| OQ-TECH-005 | What analytics approach should be used for MVP validation? | Product + Engineering | MVP launch | Open |
| OQ-TECH-006 | What error monitoring approach should be used? | Engineering | MVP launch | Open |
| OQ-TECH-007 | What development, branching, and deployment workflow should be followed? | Engineering | Sprint 1 implementation | Open |
| OQ-TECH-008 | What testing strategy is required before MVP beta release? | Engineering | Sprint 1 planning | Open |
| OQ-TECH-009 | What SDD specs must be created before coding begins? | Product + Engineering | Sprint 1 planning | Open |

---

## 20.12 Open Security, Privacy, and Legal Questions

| ID | Question | Owner | Needed Before | Status |
|---|---|---|---|---|
| OQ-SEC-001 | What privacy messaging is required before MVP beta launch? | Product / Founder | MVP launch | Open |
| OQ-SEC-002 | What acceptable-use guidance should be shown to users? | Product | MVP launch | Open |
| OQ-SEC-003 | What should the product say about not sharing production code, logs, credentials, or customer data? | Product | AI Tutor spec | Open |
| OQ-SEC-004 | Are Terms of Use and Privacy Policy required before public beta? | Founder / Business | Public beta | Open |
| OQ-SEC-005 | What user data should be retained during beta? | Product + Engineering | Privacy review | Open |
| OQ-SEC-006 | Should AI interactions be stored, anonymized, or discarded in MVP? | Product + Engineering | AI implementation spec | Open |

---

## 20.13 Open Business and Go-To-Market Questions

| ID | Question | Owner | Needed Before | Status |
|---|---|---|---|---|
| OQ-BIZ-001 | Who are the first target beta users? | Founder / Business | Beta planning | Open |
| OQ-BIZ-002 | Should the first launch be shared publicly on LinkedIn or kept limited to private testers? | Founder / Business | MVP launch | Open |
| OQ-BIZ-003 | What beta feedback process should be used? | Founder / Business | Beta launch | Open |
| OQ-BIZ-004 | Should future pricing direction be shown publicly during MVP? | Founder / Business | Landing page spec | Open |
| OQ-BIZ-005 | What signals will indicate willingness to pay? | Founder / Business | MVP evaluation | Open |
| OQ-BIZ-006 | When should monetization experiments begin? | Founder / Business | Post-MVP planning | Open |

---

## 20.14 Sprint 1 Decision Readiness

Before Sprint 1 implementation planning begins, the following questions should be resolved or explicitly deferred:

- OQ-PROD-001: Beta access model
- OQ-PROD-002: Minimum MVP lesson count
- OQ-PROD-003: Quiz inclusion or deferral
- OQ-PROD-004: Glossary inclusion or deferral
- OQ-PROD-005: Account requirement before lesson access
- OQ-PROD-006: MVP onboarding questions
- OQ-AI-001: AI provider and model direction
- OQ-AI-003: Prompt-only or lesson-aware AI Tutor
- OQ-AI-004: AI conversation storage decision
- OQ-CONT-001: Exact first learning path lessons
- OQ-CONT-002: Standard lesson template
- OQ-TECH-001: MVP technology stack
- OQ-TECH-002: Hosting and deployment approach
- OQ-TECH-003: Database or storage approach
- OQ-TECH-004: Authentication approach
- OQ-TECH-009: Required SDD specs before coding

Questions that do not block Sprint 1 should be marked as deferred and revisited before MVP beta release or post-MVP planning.

---

## 20.15 MVP Launch Decision Readiness

Before MVP beta launch, the following questions should be resolved or explicitly deferred:

- Privacy messaging
- Acceptable-use guidance
- AI sensitive data warning
- Beta user access model
- Landing page call-to-action
- Feedback collection process
- MVP success threshold
- Minimum content quality checklist
- Technical review of initial lessons
- Basic analytics and feedback review process
- Terms of Use and Privacy Policy requirement for public beta
- AI interaction storage and retention policy

---

## 20.16 Assumption Review Process

Assumptions should be reviewed:

- Before Sprint 1 planning
- Before coding begins
- Before MVP beta release
- After early beta feedback
- Before post-MVP scope expansion
- Before monetization
- Before enterprise feature planning
- Before sensitive data handling features

When an assumption is validated, invalidated, or replaced, the PRD, PROJECT_STATE.md, and relevant specs should be updated where needed.

---

## 20.17 Open Question Review Process

Open questions should be reviewed regularly.

Each open question should eventually be:

- Decided
- Deferred
- Converted into an SDD requirement
- Converted into an ADR
- Converted into a roadmap item
- Removed if no longer relevant

Open questions that affect Sprint 1 should not remain unresolved when implementation begins unless explicitly deferred by the Product Owner.

---

### Summary

IBMiHub AI has a clear MVP direction, but several assumptions and questions still need validation or decisions.

The most important unresolved areas are beta access model, exact MVP lesson count, onboarding flow, AI provider and AI data handling, content workflow, technology stack, authentication, analytics, and required SDD specs before coding.

This section should be treated as a live decision tracker. Its purpose is to prevent hidden assumptions from becoming accidental product decisions and to ensure Sprint 1 begins with enough clarity.

---

## 21. Roadmap

### Purpose of This Section

The purpose of this section is to describe how IBMiHub AI should evolve across phases.

The roadmap is a product direction document. It helps sequence work, manage scope, and align product, engineering, content, AI, and business decisions.

This roadmap should not be treated as a fixed delivery promise. Timelines may change based on user feedback, technical complexity, market response, founder capacity, engineering capacity, AI cost, and product validation results.

This section defines:

- Roadmap strategy
- Roadmap principles
- MVP phase
- Beta validation phase
- Early post-MVP phase
- Future platform expansion
- Roadmap gates
- Scope discipline
- What should not be built too early

---

### Roadmap Strategy Statement

IBMiHub AI should grow in focused phases.

The roadmap strategy is:

**Start with a narrow, trusted MVP focused on structured IBM i learning and AI Tutor assistance; validate real user value; then expand gradually into deeper learning, practice, productivity tools, team onboarding, monetization, and enterprise capabilities.**

The product should not attempt to build the full long-term vision at once.

---

## 21.1 Roadmap Principles

The roadmap should follow these principles.

### 1. Validate Before Expanding

Each phase should prove enough value before moving into the next phase.

### 2. MVP First, Platform Later

The first release should validate learning and AI assistance. Advanced platform capabilities should come later.

### 3. Learning Foundation Before Advanced Tools

The product should establish strong learning paths before expanding into full labs, job log analyzers, code tools, or documentation generators.

### 4. Trust Before Sensitive Data

The product should not support production code upload, sensitive job log upload, real IBM i connectivity, or enterprise AI workflows until privacy, security, and trust are ready.

### 5. Community Credibility Before Aggressive Monetization

The product should build credibility with IBM i professionals before introducing paid plans.

### 6. Evidence Over Excitement

Roadmap priority should be based on user engagement, feedback, retention, willingness to pay, and product risk — not only founder excitement or feature ideas.

---

## 21.2 Roadmap Horizon Model

The roadmap should use horizon-based planning rather than fixed dates.

| Horizon | Meaning | Commitment Level |
|---|---|---|
| Now | Current planning and MVP foundation | High |
| Next | Early post-MVP improvements after validation | Medium |
| Later | Larger product expansion | Directional |
| Future | Long-term platform vision | Exploratory |

This helps avoid unrealistic promises while keeping long-term direction visible.

---

## 21.3 Roadmap Overview

| Phase | Focus | Primary Goal |
|---|---|---|
| Phase 0: Sprint 0 Foundation | Documentation, PRD, scope, decisions | Prepare for disciplined implementation |
| Phase 1: MVP Build | Learning Center, AI Tutor, dashboard, progress, feedback | Build first usable product |
| Phase 2: MVP Beta Validation | Real users, feedback, retention, AI quality | Validate demand and trust |
| Phase 3: Early Post-MVP | Expand learning, quizzes, glossary, AI improvements | Improve engagement and learning depth |
| Phase 4: Practice and Productivity Expansion | 5250 simulation, RPGLE / CLLE practice, job log learning | Move toward learn-by-doing |
| Phase 5: Team and Monetization Readiness | Pro, Team, onboarding, deeper value | Prepare business model |
| Phase 6: Enterprise and Platform Expansion | Enterprise training, advanced AI tools, ecosystem | Long-term platform growth |

---

## 21.4 Phase 0: Sprint 0 Foundation

### Status

Current / In Progress

### Goal

Create the product and documentation foundation before implementation begins.

### Key Outcomes

- Product vision documented
- PRD created and reviewed section by section
- MVP scope defined
- Functional and non-functional requirements defined
- AI Strategy defined
- Learning & Content Strategy defined
- Monetization direction defined
- Technical constraints defined
- Risk analysis documented
- Assumptions and open questions documented
- Project state and master index maintained
- AI assistant rules and prompt library created

### Exit Criteria

Phase 0 should be considered complete when:

- PRD reaches sufficient maturity for Sprint 1 planning
- MVP scope is clear
- Required Sprint 1 decisions are resolved or explicitly deferred
- Initial SDD specs are identified
- Engineering is ready to produce implementation plans without guessing product requirements

### Not in Scope

Phase 0 should not include:

- Application coding
- UI implementation
- Backend implementation
- Database schemas
- AI provider integration
- Production deployment

---

## 21.5 Phase 1: MVP Build

### Horizon

Now / Next

### Goal

Build the first usable MVP of IBMiHub AI.

The MVP should validate the core product promise:

**A structured IBM i learning platform with AI-assisted guidance.**

### Primary Users

- Beginner IBM i Learner
- Working IBM i Developer

### In-Scope Product Areas

- Public Landing Experience
- User Account and Basic Onboarding
- User Dashboard
- Learning Center
- Lesson Experience
- AI Tutor
- Basic Progress Tracking
- Basic Feedback Collection
- Basic Content Governance

### MVP Build Priorities

| Priority | Area | Reason |
|---|---|---|
| 1 | Public Landing Experience | Communicates value and attracts early users |
| 2 | Basic Account / Onboarding | Supports personalized learning and progress |
| 3 | Learning Center | Core product foundation |
| 4 | Lesson Experience | Converts content into usable learning |
| 5 | AI Tutor | Main MVP differentiator |
| 6 | Progress Tracking | Supports learning continuity |
| 7 | Feedback Collection | Enables MVP validation |
| 8 | Content Governance | Protects quality and originality |

### MVP Build Exit Criteria

Phase 1 should be considered complete when:

- Users can access the product through a browser.
- Users can understand the product from the landing page.
- Users can enter the learning experience.
- Users can see a dashboard.
- Users can open and complete lessons.
- Users can ask IBM i-related AI Tutor questions.
- Users can see basic progress.
- Users can provide feedback.
- Product does not include excluded risky features.
- Product Owner approves beta readiness.

### Explicitly Not in Scope

Phase 1 must not include:

- Real IBM i connectivity
- Production code upload
- Sensitive job log upload
- Full RPG playground
- Full 5250 lab
- Full job log analyzer
- Billing or paid access
- Enterprise accounts
- Team dashboards
- Certifications
- Community forum
- Mobile app
- VS Code extension

---

## 21.6 Phase 2: MVP Beta Validation

### Horizon

Next

### Goal

Test the MVP with real users and validate whether the product creates meaningful value.

### Validation Focus

The beta should help answer:

- Do users understand the product value?
- Do beginners start the learning path?
- Do users complete lessons?
- Do users ask AI Tutor questions?
- Do users return after the first session?
- Do users trust the AI Tutor?
- Which topics create the most engagement?
- What confuses users?
- What features do users request next?
- Is there early willingness to pay later?

### Key Activities

- Invite or onboard beta users
- Collect qualitative feedback
- Review lesson completion
- Review AI Tutor usage
- Review AI feedback
- Identify confusing lessons
- Identify requested topics
- Monitor privacy and sensitive-data risks
- Refine positioning and onboarding

### Exit Criteria

Phase 2 should be considered successful if there is evidence of:

- Meaningful learning engagement
- Positive qualitative feedback
- Repeated usage
- AI Tutor usefulness
- Clear user demand for more content or features
- No major trust, privacy, or positioning failures

### Possible Outcomes

After beta validation, the product may:

- Continue improving MVP
- Expand learning content
- Add lightweight quizzes or glossary
- Improve AI Tutor behavior
- Begin early monetization exploration
- Reconsider scope if validation is weak

---

## 21.7 Phase 3: Early Post-MVP Improvements

### Horizon

Next

### Goal

Improve the product based on MVP validation.

This phase should deepen learning value without jumping too quickly into complex advanced tools.

### Possible In-Scope Areas

- Expanded IBM i Fundamentals lessons
- RPGLE Fundamentals path
- CLLE Fundamentals path
- DB2 for i / SQL basics path
- Lightweight quizzes
- Beginner glossary
- Improved dashboard
- Improved onboarding
- Lesson-aware AI Tutor
- Better AI feedback capture
- Improved content review workflow
- More useful progress indicators

### Priority Drivers

Post-MVP priorities should be based on:

- Beta feedback
- Lesson completion patterns
- AI Tutor question patterns
- User requests
- Retention signals
- Content quality issues
- Founder-led user interviews

### Not in Scope Without Separate Approval

- Real IBM i connectivity
- Production code upload
- Sensitive log upload
- Enterprise administration
- Billing
- Full job log analyzer
- Full RPG playground
- Community forum

---

## 21.8 Phase 4: Practice and Productivity Expansion

### Horizon

Later

### Goal

Move IBMiHub AI from structured learning toward practical skill-building and productivity support.

This phase should happen only after the learning and AI Tutor foundation shows strong value.

### Possible Product Areas

#### 1. 5250 Practice Lab

A simulated 5250 learning experience for safe practice.

Potential capabilities:

- Simulated command line
- Guided navigation exercises
- Basic object and library workflows
- Non-production practice scenarios

#### 2. RPGLE and CLLE Practice

Practice experiences for code reading and basic programming concepts.

Potential capabilities:

- Code interpretation exercises
- Simple RPGLE scenarios
- CLLE command flow exercises
- AI-assisted explanation of sample code

#### 3. Job Log Learning

Learning-oriented job log examples and explanations.

Potential capabilities:

- Sample job log walkthroughs
- Common message explanation
- Troubleshooting learning scenarios

#### 4. Documentation Assistance

Future support for generating simple learning or technical documentation from approved inputs.

Potential capabilities:

- Program summary examples
- Process explanation templates
- Onboarding notes

### Important Constraint

This phase should still avoid sensitive production workflows until privacy, security, and data handling are ready.

---

## 21.9 Phase 5: Monetization and Team Readiness

### Horizon

Later

### Goal

Prepare IBMiHub AI for paid individual and team value after strong validation.

### Possible Product Areas

- Pro individual plan exploration
- Higher AI Tutor usage limits
- Premium learning paths
- Interview preparation content
- More advanced quizzes or assessments
- Team learning paths
- Team onboarding support
- Basic team progress visibility
- Early team plan discovery

### Monetization Gate

Paid plans should not be introduced until there is evidence that:

- Users return repeatedly
- Users complete learning content
- Users trust the platform
- Users ask for more advanced value
- AI usage cost is understood
- Willingness-to-pay signals exist
- Product Owner approves monetization readiness

### Not in Scope Until Approved

- Full enterprise contracts
- Enterprise SSO
- Advanced compliance workflows
- Complex billing operations
- Certification payments
- Marketplace revenue

---

## 21.10 Phase 6: Enterprise and Platform Expansion

### Horizon

Future

### Goal

Expand IBMiHub AI into a broader platform for IBM i learning, productivity, onboarding, and enterprise training.

### Possible Product Areas

- Enterprise training
- Team accounts
- Admin dashboards
- Progress reporting
- Role-based learning paths
- Corporate onboarding packages
- Enterprise privacy and security controls
- Advanced AI governance
- Advanced code explanation
- Advanced job log analysis
- Documentation generator
- Certification or skill validation
- Community features
- Mobile companion experience
- VS Code extension
- Public API
- Ecosystem partnerships

### Important Constraint

These are long-term possibilities, not MVP commitments.

Each major future area should require:

- Product Owner approval
- Updated PRD scope if needed
- SDD specification
- Architecture review
- Security and privacy review where applicable
- Clear validation evidence

---

## 21.11 Roadmap by Product Area

| Product Area | MVP | Early Post-MVP | Later | Future |
|---|---|---|---|---|
| Landing / Marketing | Simple landing page | Improved positioning | Content marketing | Full growth engine |
| Learning Center | IBM i Fundamentals | More paths | Advanced learning | Enterprise curriculum |
| AI Tutor | Conceptual Q&A | Lesson-aware help | Code/log learning support | Advanced AI workflows |
| Progress Tracking | Basic completion | Better progress indicators | Skill confidence | Team / enterprise reporting |
| Quizzes | Optional / lightweight | Lesson quizzes | Assessments | Certification readiness |
| Glossary | Optional / lightweight | Searchable glossary | Concept explorer | Integrated learning graph |
| 5250 Practice | Out of scope | Planning only | Simulated lab | Advanced labs |
| RPGLE / CLLE Practice | Out of scope | Planning only | Practice scenarios | Playground |
| Job Logs | Conceptual basics | Sample scenarios | Job log learning | Analyzer |
| Documentation | Out of scope | Templates / examples | Assistant | Generator |
| Monetization | Out of scope | Research | Pro / Team tests | Enterprise |
| Enterprise | Out of scope | Discovery | Team readiness | Full enterprise platform |
| Community | Out of scope | Discovery | Limited community | Ecosystem platform |
| Mobile App | Out of scope | Out of scope | Consider later | Possible companion app |
| VS Code Extension | Out of scope | Out of scope | Consider later | Possible developer tool |

---

## 21.12 Roadmap Gates

The product should not move to a larger phase just because the roadmap says so.

Progression should depend on gates.

### Gate 1: Move from Sprint 0 to Sprint 1

Required signals:

- PRD is sufficiently complete
- MVP scope is clear
- Key Sprint 1 open questions are resolved or deferred
- SDD specs are identified
- Architecture planning is ready

### Gate 2: Move from MVP Build to Beta

Required signals:

- Core MVP flows work
- Initial content is ready
- AI Tutor is usable and bounded
- Feedback collection works
- No excluded risky features are present
- Product Owner approves beta readiness

### Gate 3: Move from Beta to Post-MVP Expansion

Required signals:

- Users complete lessons
- Users ask meaningful AI Tutor questions
- Users return
- Feedback is positive enough to continue
- Top improvement areas are clear
- Product direction is validated enough to expand

### Gate 4: Move Toward Monetization

Required signals:

- Repeat usage exists
- Users ask for deeper value
- Willingness-to-pay signals exist
- AI cost is understood
- Free vs paid packaging is clearer
- Product Owner approves monetization experiments

### Gate 5: Move Toward Enterprise

Required signals:

- Individual value is validated
- Team onboarding interest exists
- Privacy and security posture is stronger
- Product can support team workflows
- Enterprise requirements are documented separately

---

## 21.13 Roadmap Dependencies

Roadmap progress depends on several areas.

| Dependency | Why It Matters |
|---|---|
| PRD Completion | Provides product direction |
| SDD Specs | Converts PRD into implementable features |
| Architecture Decisions | Defines technical approach |
| Content Creation | Learning Center cannot launch without original lessons |
| AI Tutor Implementation | Core MVP differentiator |
| Feedback System | Required for validation |
| User Outreach | Required for beta validation |
| Privacy Messaging | Required before broader beta |
| Product Owner Review | Required before scope expansion |

---

## 21.14 What Should Not Be Built Too Early

The roadmap should avoid building the following too early:

- Real IBM i connectivity
- Live 5250 production terminal
- Production code upload
- Sensitive job log upload
- Full RPG playground
- Full job log analyzer
- Full documentation generator
- Enterprise accounts
- Admin dashboards
- Enterprise SSO
- Billing and paid subscriptions
- Certification engine
- Community forum
- Mobile app
- VS Code extension
- Public API
- Marketplace

These may be valuable later, but building them too early would increase complexity before the core product value is validated.

---

## 21.15 Roadmap Review Process

The roadmap should be reviewed:

- After PRD completion
- Before Sprint 1 planning
- Before MVP beta launch
- After early beta feedback
- Before post-MVP expansion
- Before monetization
- Before enterprise planning
- Whenever major assumptions change

Roadmap updates should be reflected in PRD, PROJECT_STATE.md, and relevant SDD specs when needed.

---

### Summary

The IBMiHub AI roadmap should move from focused validation to gradual platform expansion.

The immediate priority is to complete planning, then build a narrow MVP around structured IBM i learning, AI Tutor, dashboard, progress tracking, and feedback.

After real user validation, the product can expand into deeper content, quizzes, glossary, lesson-aware AI, practice labs, job log learning, productivity tools, monetization, team onboarding, enterprise training, and broader ecosystem features.

The roadmap should remain disciplined, evidence-driven, and gated by user value.

---

## 22. Future Vision

### Purpose of This Section

The purpose of this section is to describe the long-term product ambition for IBMiHub AI beyond the MVP and near-term roadmap.

The future vision helps preserve strategic direction while keeping the MVP focused. It describes what IBMiHub AI may become over multiple phases if the product validates real user value, earns trust, and grows responsibly.

This section does not change MVP scope. It does not create fixed delivery commitments. It does not approve future features for immediate implementation.

Future capabilities mentioned here should require separate validation, Product Owner approval, PRD updates where needed, SDD specifications, architecture review, and security/privacy review where applicable.

---

### Future Vision Statement

IBMiHub AI should evolve into the leading AI-powered learning, practice, productivity, onboarding, and knowledge platform for IBM i professionals.

The long-term vision is:

**To become the trusted platform where IBM i learners, developers, teams, consultants, and enterprises learn, practice, troubleshoot, document, modernize, and transfer IBM i knowledge using structured content, AI assistance, hands-on practice, and productivity workflows.**

The first MVP is only the starting point.

The long-term opportunity is to build a durable product ecosystem around IBM i knowledge, skills, productivity, and modernization.

---

## 22.1 Long-Term Platform Ambition

IBMiHub AI should not remain only a beginner learning website.

If the MVP validates user demand, the product may grow into a broader platform with multiple connected product areas:

- Structured IBM i learning
- AI-assisted explanations
- Hands-on practice
- 5250 simulation
- RPGLE and CLLE practice
- Job log learning and analysis
- Code explanation
- Documentation assistance
- Interview preparation
- Team onboarding
- Enterprise training
- Community and ecosystem participation
- Certification or skill validation

These areas should evolve gradually and only after the product proves value in earlier phases.

---

## 22.2 Future Product Pillars

The long-term platform may be organized around several product pillars.

### Pillar 1: IBMiHub Learn

A structured learning platform for IBM i professionals.

Possible future capabilities:

- Beginner-to-advanced learning paths
- RPGLE learning paths
- CLLE learning paths
- DB2 for i and SQL learning paths
- DDS and database file learning paths
- Job log and production support learning paths
- Modern IBM i tooling learning paths
- Interview preparation paths
- Progress tracking and learning history

### Pillar 2: IBMiHub AI Tutor

An IBM i-focused AI assistant that supports learning, clarification, and productivity.

Possible future capabilities:

- Lesson-aware AI Tutor
- User-level-aware explanations
- Suggested follow-up questions
- AI-assisted topic recommendations
- AI explanation of approved sample code
- AI-assisted learning recap
- AI feedback loops for quality improvement

### Pillar 3: IBMiHub Labs

A safe practice environment for IBM i learning.

Possible future capabilities:

- Simulated 5250 workflows
- Guided command practice
- Object and library practice scenarios
- RPGLE and CLLE reading exercises
- Job log walkthroughs
- Practice quizzes and exercises
- Scenario-based learning

Early labs should remain simulated and non-production unless future security, privacy, and architecture reviews approve deeper capabilities.

### Pillar 4: IBMiHub Productivity

AI-assisted tools for working IBM i professionals.

Possible future capabilities:

- Code explanation
- Job log explanation
- Documentation assistance
- Process summary generation
- Legacy system understanding support
- Modernization learning support
- Developer productivity workflows

These tools should be introduced carefully because they may involve higher trust, privacy, and accuracy requirements.

### Pillar 5: IBMiHub Teams

Team-oriented learning and onboarding capabilities.

Possible future capabilities:

- Team learning paths
- Onboarding tracks
- Shared progress visibility
- Assigned lessons
- Team-level learning insights
- Mentor-supported learning workflows

Team features should be introduced only after individual learning value is validated.

### Pillar 6: IBMiHub Enterprise

Enterprise training and enablement capabilities.

Possible future capabilities:

- Enterprise accounts
- Admin dashboards
- Role-based learning paths
- Progress reporting
- Corporate onboarding programs
- Privacy and security controls
- Enterprise support
- Future SSO and compliance readiness

Enterprise capabilities should require separate product, security, privacy, legal, and architecture review.

### Pillar 7: IBMiHub Community

A future ecosystem space for IBM i professionals.

Possible future capabilities:

- Community discussions
- Expert Q&A
- Content suggestions
- Learning requests
- Community feedback loops
- Founder-led knowledge sharing
- Partnerships with IBM i experts or trainers

Community features should be added only when moderation, content quality, and trust can be handled properly.

---

## 22.3 Product Evolution Vision

The product should evolve from a focused MVP into a broader platform through disciplined stages.

### Stage 1: Learning and AI Foundation

The first stage validates whether users want structured IBM i learning and AI Tutor guidance.

### Stage 2: Deeper Learning and Engagement

The second stage expands lessons, quizzes, glossary, learning paths, and AI Tutor context.

### Stage 3: Practice and Skill Building

The third stage introduces hands-on simulated practice, guided workflows, and scenario-based learning.

### Stage 4: Productivity Support

The fourth stage adds carefully bounded AI productivity tools for code, logs, documentation, and legacy understanding.

### Stage 5: Team and Enterprise Expansion

The fifth stage introduces team onboarding, reporting, enterprise controls, and corporate training value.

### Stage 6: Ecosystem Platform

The final long-term stage may include community, certifications, integrations, partnerships, and broader IBM i ecosystem participation.

This evolution should remain flexible and evidence-driven.

---

## 22.4 Future User Experience Vision

In the long term, a user should be able to come to IBMiHub AI and follow a complete IBM i growth journey.

A beginner may:

- Start with IBM i fundamentals
- Ask the AI Tutor basic questions
- Complete lessons and quizzes
- Practice 5250 workflows
- Learn RPGLE and CLLE basics
- Prepare for interviews
- Build confidence for real project work

A working developer may:

- Refresh IBM i concepts
- Ask practical AI questions
- Review sample RPGLE or CLLE examples
- Learn job log investigation patterns
- Generate documentation drafts from approved inputs
- Explore modernization topics
- Improve productivity over time

A team lead may:

- Recommend learning paths to juniors
- Use content for onboarding
- Track team learning progress
- Reduce repeated basic questions
- Improve consistency of IBM i knowledge transfer

An enterprise buyer may:

- Use IBMiHub AI for structured onboarding
- Train multiple employees
- Track learning progress
- Support modernization initiatives
- Reduce dependency on tribal knowledge
- Improve long-term IBM i capability

---

## 22.5 Future AI Vision

AI should remain a core part of the platform, but it should grow responsibly.

Future AI capabilities may include:

- Lesson-aware tutoring
- Learning-path-aware guidance
- AI-assisted practice support
- Sample code explanation
- Job log learning assistance
- Documentation drafting
- Interview coaching
- Team onboarding support
- Enterprise AI controls

The AI future should follow these principles:

- AI should support structured learning, not replace it.
- AI should remain IBM i-focused.
- AI should be transparent about uncertainty.
- AI should avoid production-safe guarantees.
- AI should protect privacy and sensitive information.
- AI should be improved through user feedback and review.
- AI should not perform risky actions without explicit future approval.

---

## 22.6 Future Practice Vision

IBMiHub AI should eventually move from learning-by-reading to learning-by-doing.

Future practice experiences may include:

- Simulated 5250 command flows
- Object and library exercises
- RPGLE reading exercises
- CLLE workflow exercises
- DB2 for i query examples
- Job log walkthroughs
- Debugging-style scenarios
- Guided practice paths

Practice features should help users build confidence safely.

The product should avoid connecting to real production systems until security, privacy, compliance, and support models are mature enough.

---

## 22.7 Future Productivity Vision

Working IBM i professionals may eventually use IBMiHub AI as a productivity companion.

Future productivity support may include:

- Understanding unfamiliar IBM i concepts
- Explaining sample code
- Explaining pasted non-sensitive snippets when allowed by policy
- Interpreting sample job logs
- Creating documentation drafts
- Summarizing process flows
- Supporting modernization learning
- Helping with onboarding notes

These productivity capabilities should be introduced only after trust, privacy, and accuracy expectations are strong enough.

---

## 22.8 Future Enterprise Vision

Enterprise value is a major long-term opportunity, but it should not dominate the MVP.

Future enterprise capabilities may include:

- Corporate onboarding programs
- Team learning paths
- Admin controls
- Progress reporting
- Role-based learning
- Enterprise privacy controls
- Enterprise support
- Future SSO
- Compliance readiness
- Custom training packages

Enterprise expansion should happen only after the platform proves individual value and has stronger security, privacy, and operational maturity.

---

## 22.9 Future Community and Ecosystem Vision

IBMiHub AI should eventually become a trusted contributor to the IBM i ecosystem.

The long-term community vision may include:

- Sharing original IBM i learning resources
- Supporting community feedback
- Highlighting practical IBM i learning topics
- Collaborating with experienced IBM i professionals
- Encouraging modern IBM i learning practices
- Helping preserve IBM i knowledge for future generations

The product should respect existing IBM i documentation, experts, websites, user groups, training providers, and vendors.

The goal is not to replace the ecosystem.

The goal is to strengthen it.

---

## 22.10 Future Certification and Skill Validation Vision

Certification and skill validation may become valuable after the platform has mature learning paths and practice experiences.

Possible future directions include:

- Completion badges
- Skill readiness checks
- Interview preparation assessments
- Topic-level quizzes
- Practical scenario assessments
- Corporate training completion reports
- Future certification-style programs

These should not be introduced too early.

The product should first prove that users trust the learning content, AI Tutor, and practice experience.

---

## 22.11 Future Platform Optionality

Current product and engineering decisions should preserve future optionality.

The product should avoid choices that block:

- More learning paths
- AI Tutor improvements
- Practice labs
- Team features
- Enterprise features
- Monetization
- Community features
- Mobile-friendly experiences
- Developer workflow integrations
- Future ecosystem partnerships

However, preserving optionality does not mean building everything now.

The MVP should remain narrow while the foundation remains extensible.

---

## 22.12 Future Vision Boundaries

The future vision must not be confused with approved MVP scope.

The following remain out of scope for MVP:

- Real IBM i connectivity
- Production code upload
- Sensitive job log upload
- Full 5250 lab
- Full RPG playground
- Full job log analyzer
- Full documentation generator
- Billing and paid subscriptions
- Enterprise accounts
- Admin dashboards
- Enterprise SSO
- Certification engine
- Community forum
- Mobile app
- VS Code extension
- Public API
- Marketplace

These items may be explored later only through proper approval, validation, SDD specs, and architecture review.

---

## 22.13 Future Success Indicators

Long-term success may be indicated by:

- Learners completing structured IBM i paths
- Working developers returning for AI-assisted explanations
- Teams using IBMiHub AI for onboarding
- Enterprises showing interest in training programs
- Users requesting advanced practice and productivity tools
- Positive reputation in the IBM i community
- Strong content quality and originality
- AI Tutor becoming trusted for learning support
- Evidence of willingness to pay for deeper value
- Sustainable product growth over time

The strongest signal will be repeated trust-based usage, not just traffic.

---

## 22.14 Future Vision Risks

Future expansion has risks.

| Risk | Description | Mitigation Direction |
|---|---|---|
| Expanding too fast | Product may become too broad before core value is validated | Use roadmap gates |
| Overpromising | Users may expect future features before they exist | Separate MVP from future vision |
| AI trust issues | Advanced AI tools may create accuracy and privacy concerns | Expand AI carefully with review |
| Enterprise complexity | Enterprise needs may overload the product | Validate individual value first |
| Content quality dilution | More content may reduce quality consistency | Maintain content governance |
| Community trust risk | Product may be seen as overhyped or disrespectful | Stay humble, original, and ecosystem-friendly |

---

### Summary

The future vision for IBMiHub AI is to become the trusted AI-powered learning, practice, productivity, onboarding, and knowledge platform for IBM i professionals.

The product may eventually include deeper learning paths, AI tutoring, hands-on labs, RPGLE and CLLE practice, job log learning, documentation assistance, team onboarding, enterprise training, community, and certification-style capabilities.

However, the MVP remains focused.

The product should first validate structured IBM i learning and AI Tutor value, then expand gradually based on user trust, feedback, engagement, and explicit Product Owner approval.

---

## 23. Glossary & Terminology

### Purpose of This Section

The purpose of this section is to define important terms used throughout the IBMiHub AI PRD.

This glossary helps keep product, engineering, content, AI, business, and roadmap discussions consistent.

The glossary is not intended to be a complete IBM i training guide. It provides short PRD-level definitions so contributors can understand the meaning of terms used in this document.

Detailed educational explanations should be created later inside approved learning content, lesson plans, glossary features, or curriculum specifications.

---

### Glossary Principles

Glossary definitions should follow these principles:

- Use clear and simple language.
- Define terms in the context of IBMiHub AI.
- Avoid unnecessary technical depth.
- Avoid copying definitions from external sources.
- Keep definitions useful for product and planning discussions.
- Expand glossary terms only when needed.
- Treat this section as a living reference.

---

## 23.1 Product and Planning Terms

| Term | Definition |
|---|---|
| IBMiHub AI | The AI-powered SaaS platform being designed to help IBM i professionals learn, practice, understand, document, and improve productivity. |
| PRD | Product Requirements Document. The source of truth for what the product is, why it exists, who it serves, and what it should achieve. |
| SDD | Spec-Driven Development. A disciplined approach where detailed specs are created before implementation begins. |
| MVP | Minimum Viable Product. The first focused version of IBMiHub AI used to validate core user value. |
| Product Owner | The person responsible for product direction, scope approval, prioritization, and final product decisions. |
| Roadmap | A phased product direction that explains how the product may evolve over time. |
| Scope | The set of features, capabilities, and boundaries approved for a phase or release. |
| Out of Scope | A feature or capability that is explicitly not included in the current phase or MVP. |
| Requirement | A product need or behavior that the product must, should, or may support. |
| Functional Requirement | A requirement describing what the product must do. |
| Non-Functional Requirement | A requirement describing how well the product should behave, such as security, reliability, performance, or usability. |
| Assumption | Something currently treated as true for planning, but which may need validation. |
| Open Question | An unresolved decision that must be answered, deferred, or converted into a future task. |
| Risk | A possible issue that could negatively affect product trust, delivery, adoption, security, cost, or business success. |
| Beta | An early release used with selected or public users to validate product value and collect feedback. |
| Sprint 0 | The planning and foundation phase before implementation starts. |
| Sprint 1 | The first implementation phase after enough product and technical clarity exists. |

---

## 23.2 User and Market Terms

| Term | Definition |
|---|---|
| Persona | A representative user type with specific goals, pain points, motivations, and product needs. |
| Beginner IBM i Learner | A primary MVP persona who is new to IBM i and needs structured, beginner-friendly learning. |
| Working IBM i Developer | A primary MVP persona who already works with IBM i and needs practical explanations, refreshers, and future productivity support. |
| Team Lead / Mentor | A secondary persona responsible for helping others learn, onboard, and become productive. |
| Enterprise Training Buyer | A future buyer persona responsible for training, onboarding, and team capability development. |
| Interview Candidate / Career Switcher | A user preparing for IBM i roles or transitioning into IBM i work. |
| User Journey | The path a user follows from discovery to onboarding, activation, engagement, and possible advocacy or upgrade. |
| Activation | The moment when a user experiences meaningful product value for the first time. |
| Retention | The degree to which users return and continue using the product over time. |
| Early Adopter | A user willing to try the product before it is mature and provide feedback. |

---

## 23.3 Learning and Content Terms

| Term | Definition |
|---|---|
| Learning Center | The product area where users access structured IBM i learning content. |
| Learning Path | A guided sequence of lessons designed to help users build understanding step by step. |
| Lesson | A focused learning unit covering one concept, topic, or practical idea. |
| IBM i Fundamentals | The first proposed MVP learning path focused on basic IBM i platform concepts. |
| Lesson Completion | A user action or state showing that a lesson has been completed. |
| Progress Tracking | The product capability that records and displays a user's learning progress. |
| Knowledge Check | A lightweight question or activity used to reinforce understanding. |
| Quiz | A structured set of questions used to test or reinforce learning. For MVP, quizzes are optional and lightweight. |
| Glossary | A reference list of terms and short explanations. |
| Original Content | Content written specifically for IBMiHub AI without copying external tutorials, documentation, books, blogs, or courses. |
| Content Governance | The process used to protect content quality, originality, consistency, and maintainability. |
| Content Review | The process of checking content for clarity, accuracy, originality, and usefulness before publication. |
| Content Lifecycle | The process by which content is selected, drafted, reviewed, published, improved, and maintained. |

---

## 23.4 AI Terms

| Term | Definition |
|---|---|
| AI Tutor | The MVP AI experience that helps users ask IBM i-related questions and receive learning-focused explanations. |
| AI-Assisted Learning | Learning supported by AI explanations, clarification, examples, and follow-up guidance. |
| AI Response | The answer or explanation generated by the AI Tutor. |
| AI Feedback | User feedback indicating whether an AI response was helpful, not helpful, confusing, or possibly incorrect. |
| Prompt | The user's question or instruction to the AI Tutor. |
| Lesson-Aware AI | A future AI capability where AI responses consider the current lesson or learning path context. |
| AI Trust Boundary | A product rule that limits what users should expect from AI, especially around correctness, privacy, and production use. |
| AI Provider | The external or internal AI service that may power AI responses. The PRD does not select a provider. |
| Model | The AI model used to generate responses. The PRD does not select a model. |
| AI Hallucination | A situation where AI generates incorrect, unsupported, or misleading information. |
| Grounding | A future AI approach where responses may be supported by approved content or trusted references. |
| RAG | Retrieval-Augmented Generation. A possible future technical approach where AI uses retrieved content to improve answers. The PRD does not require this for MVP. |
| AI Governance | Policies, controls, and review processes used to manage AI quality, privacy, safety, and usage. |

---

## 23.5 IBM i Platform Terms

| Term | Definition |
|---|---|
| IBM i | An integrated operating environment used by many organizations for business-critical applications. |
| AS/400 | An older name commonly associated with the IBM midrange platform lineage. Many users still use this term informally. |
| IBM Power | The hardware platform family commonly associated with IBM i workloads. |
| 5250 | A terminal-style interface commonly used to interact with IBM i applications and command screens. |
| Green Screen | An informal term often used for 5250-style terminal screens. |
| Library | A container-like IBM i concept used to organize objects. |
| Object | A named IBM i system item such as a program, file, command, job queue, or output queue. |
| Library List | The ordered list of libraries that IBM i uses to find objects during execution or commands. |
| Physical File | A database file that stores actual data records. |
| Logical File | A database access path or view-like structure over one or more physical files. |
| Source File | A file used to store source members such as RPGLE, CLLE, DDS, or SQL source. |
| Source Member | A named source entry inside a source file. |
| Program | An executable object created from source code or compiled logic. |
| Service Program | An IBM i object that can provide reusable procedures or services to programs. |
| Command | An IBM i instruction used to perform an action, such as working with objects, jobs, files, or system settings. |
| Job | A unit of work running on IBM i. |
| Job Queue | A queue where batch jobs wait before running. |
| Output Queue | A queue where spool files or printed output can be placed. |
| Spool File | Output generated by jobs or programs, often viewed or printed later. |
| Job Log | A record of messages and events related to a job's execution. |
| Message | Information, warning, inquiry, or error communication generated by IBM i or an application. |
| Batch Job | A job that runs without direct interactive user control. |
| Interactive Job | A job associated with an interactive user session. |
| Subsystem | An IBM i environment that controls where and how jobs run. |
| Authority | Permission or access control related to IBM i objects and operations. |

---

## 23.6 IBM i Development Terms

| Term | Definition |
|---|---|
| RPGLE | A modern form of RPG used for IBM i application development. |
| CLLE | Control Language with ILE support, commonly used for scripting, job control, and system-level workflows on IBM i. |
| SQLRPGLE | RPGLE source that includes embedded SQL. |
| DDS | Data Description Specifications, historically used to define physical files, logical files, display files, and printer files. |
| DB2 for i | The integrated relational database on IBM i. |
| Display File | A screen definition object commonly used by traditional IBM i applications. |
| Printer File | A definition used to produce formatted printed or spool output. |
| Module | A compiled unit that may be bound into a program or service program. |
| Procedure | A reusable block of logic, often used in modern RPGLE development. |
| Binding | The process of combining modules and service programs into executable objects. |
| Compile | The process of turning source code into executable or usable IBM i objects. |
| Debugging | The process of investigating and fixing program behavior or errors. |
| Legacy Code | Existing code that may be old, business-critical, underdocumented, or difficult to understand. |
| Modernization | Improving existing IBM i applications, workflows, interfaces, tooling, or integrations without necessarily replacing the platform. |
| API | An interface that allows systems or programs to communicate. |
| Integration | A connection or workflow between IBM i and another system, application, or service. |

---

## 23.7 Security, Privacy, and Data Terms

| Term | Definition |
|---|---|
| Sensitive Data | Information that should not be shared casually, such as credentials, customer data, proprietary code, production logs, or business-sensitive information. |
| Production Code | Real source code used in a live business system. Production code upload is out of scope for MVP. |
| Sensitive Job Log | A real job log that may contain customer, business, system, or operational information. Sensitive job log upload is out of scope for MVP. |
| Credentials | Passwords, tokens, keys, connection details, or other secrets used to access systems. |
| Privacy Messaging | Product text explaining how users should think about data sharing and privacy. |
| Acceptable Use | Guidance explaining what users should and should not do inside the product. |
| Data Retention | The policy or decision describing how long user or product data is stored. |
| Enterprise SSO | Single sign-on for organizations. This is out of scope for MVP. |
| Compliance | Legal, security, privacy, or regulatory expectations that may apply to future enterprise use. |

---

## 23.8 Business and Monetization Terms

| Term | Definition |
|---|---|
| Free Tier | A possible future entry-level plan allowing users to experience selected product value without payment. |
| Pro Plan | A possible future individual paid plan for deeper learning or higher AI usage. |
| Team Plan | A possible future plan for multiple users, onboarding, and team learning. |
| Enterprise Plan | A possible future plan for organizations needing training, controls, reporting, support, and privacy features. |
| Willingness to Pay | Evidence that users may pay for the value offered by the product. |
| MRR | Monthly Recurring Revenue. A future business metric once paid subscriptions exist. |
| Churn | The rate at which paying users cancel or stop using the product. |
| Conversion | The movement of a user from one stage to another, such as visitor to beta user or free user to paid user. |
| GTM | Go-To-Market. The approach used to reach users, explain value, and drive adoption. |
| Founder-Led Growth | Early growth driven directly by the founder through outreach, content, demos, community activity, and user conversations. |

---

## 23.9 Roadmap and Future Feature Terms

| Term | Definition |
|---|---|
| Future Vision | The long-term ambition for what IBMiHub AI may become after validation and responsible expansion. |
| Roadmap Gate | A decision point that must be passed before the product moves into a larger phase. |
| Post-MVP | Work considered after the first MVP has been built and validated. |
| 5250 Practice Lab | A possible future simulated practice experience for IBM i workflows. |
| RPG Playground | A possible future environment for RPGLE learning or practice. Not part of MVP. |
| Job Log Analyzer | A possible future feature for explaining job logs. Not part of MVP. |
| Documentation Generator | A possible future feature for helping create documentation from approved inputs. Not part of MVP. |
| Community Forum | A possible future community feature. Not part of MVP. |
| Certification | A possible future skill validation or assessment offering. Not part of MVP. |
| VS Code Extension | A possible future developer workflow integration. Not part of MVP. |
| Public API | A possible future interface for external systems or developers. Not part of MVP. |
| Marketplace | A possible future business or ecosystem capability. Not part of MVP. |

---

## 23.10 Glossary Maintenance

This glossary should be updated when:

- A new term becomes important to product decisions.
- A term is used repeatedly across PRD, specs, roadmap, or architecture documents.
- A definition is unclear or disputed.
- A term creates confusion during planning or implementation.
- New approved product areas are added.

Glossary updates should remain concise and should not turn this section into full training content.

Detailed explanations should live in Learning Center content, curriculum specs, or future glossary product features.

---

### Summary

The glossary defines key terms used across the IBMiHub AI PRD.

It helps keep product planning, engineering discussions, AI strategy, content strategy, roadmap decisions, and business planning consistent.

This glossary is intentionally concise. It should support clarity without replacing detailed IBM i learning content.

---

## 24. Appendix

### Purpose of This Section

The purpose of this appendix is to provide supporting references, related document links, and supplementary planning notes that support the IBMiHub AI PRD.

The appendix should help contributors understand where supporting information lives without cluttering the main PRD sections.

This section does not introduce new product scope, new MVP requirements, technical architecture decisions, legal commitments, pricing commitments, or implementation tasks.

If any appendix item conflicts with the approved PRD sections, the approved PRD sections should take priority.

---

### Appendix Usage Principles

The appendix should follow these principles:

- Support the PRD without replacing it.
- Keep references organized and easy to maintain.
- Avoid duplicating long content from other documents.
- Avoid adding unapproved product requirements.
- Avoid copying external source material.
- Keep research references separate from final product claims.
- Update links and references as the project evolves.
- Use this section as supporting context, not as the product source of truth.

---

## 24.1 Source of Truth Hierarchy

The following hierarchy should be used when product or implementation questions arise.

| Level | Document / Artifact Type | Purpose |
|---|---|---|
| 1 | PRD.md | Defines approved product direction, scope, requirements, constraints, risks, and roadmap |
| 2 | PROJECT_CONTEXT.md | Defines project background, vision, principles, and working context |
| 3 | PROJECT_STATE.md | Tracks current project phase, progress, blockers, next actions, and active status |
| 4 | PROJECT_MASTER_INDEX.md | Provides navigation across major project documents |
| 5 | SDD Specs | Define detailed feature-level requirements derived from the PRD |
| 6 | Architecture Documents / ADRs | Define technical decisions and trade-offs |
| 7 | Implementation Plans / Tasks | Define how approved specs will be built |
| 8 | Source Code | Implements approved requirements and specs |

When conflicts exist, product scope should be resolved at the PRD or Product Owner level before implementation continues.

---

## 24.2 Related Project Documents

The following documents are expected to support IBMiHub AI planning and execution.

| Document | Purpose |
|---|---|
| PROJECT_CONTEXT.md | Captures project vision, background, principles, and long-term context |
| PROJECT_STATE.md | Tracks current status, phase, blockers, risks, and next actions |
| PROJECT_MASTER_INDEX.md | Provides a master navigation index for project documents |
| AI_RULES.md | Defines rules for AI assistants working on the project |
| PROMPT_LIBRARY.md | Stores reusable prompts for product, engineering, SDD, review, and documentation work |
| Engineering Review | Captures engineering recommendations, risks, stack considerations, and architectural concerns |
| Sprint 0 Documentation Roadmap | Lists documentation needed before implementation begins |
| PRD.md | Master product requirements document |
| Future SDD Specs | Feature-level specifications created before implementation |
| Future ADRs | Records of important architecture and technology decisions |

This list may be expanded as the project grows.

---

## 24.3 Expected Future SDD Specifications

Before implementation begins, the following SDD specs may be needed.

These are not approved implementation tasks yet. They are likely candidate specs derived from the PRD.

| Possible Spec | Purpose |
|---|---|
| Public Landing Experience Spec | Define landing page content, positioning, CTA, and user entry flow |
| User Account and Onboarding Spec | Define sign-up, login, onboarding questions, and initial user path |
| Dashboard Spec | Define what users see after login and how they continue learning |
| Learning Center Spec | Define learning path display, lesson listing, and lesson access |
| Lesson Experience Spec | Define lesson page behavior, completion, navigation, and feedback |
| AI Tutor Spec | Define AI Tutor behavior, boundaries, UX, feedback, and privacy messaging |
| Progress Tracking Spec | Define basic lesson completion and progress display |
| Feedback Collection Spec | Define lesson feedback, AI feedback, and general product feedback |
| Content Governance Spec | Define how MVP content is created, reviewed, approved, and maintained |

The exact list should be finalized before Sprint 1 planning.

---

## 24.4 Expected Future Architecture / ADR Topics

The PRD intentionally avoids architecture decisions.

The following topics should likely be handled later through architecture documents or ADRs.

| Topic | Why It Matters |
|---|---|
| MVP technology stack | Determines implementation foundation |
| Hosting and deployment | Determines how the web application is released and operated |
| Database / storage approach | Supports users, progress, content metadata, and feedback |
| Authentication approach | Supports secure user identity |
| AI provider and model approach | Powers AI Tutor and affects quality, cost, latency, and safety |
| AI prompt and safety strategy | Defines how AI behavior is controlled |
| Content storage approach | Determines how lessons are authored, reviewed, and delivered |
| Analytics approach | Supports MVP validation without overcollecting data |
| Error monitoring approach | Helps identify product failures |
| Secrets and environment management | Protects sensitive configuration |
| Testing strategy | Supports release quality and confidence |
| Deployment workflow | Supports safe delivery and iteration |

These decisions should not be embedded directly into the PRD unless they become product-level constraints.

---

## 24.5 Research and Reference Notes

Research may be used to validate product direction, market assumptions, competitive positioning, IBM i terminology, and technical accuracy.

Research notes should follow these rules:

- Prefer reliable and authoritative sources when validating facts.
- Use official documentation where factual precision matters.
- Do not copy external wording into product content.
- Do not copy lesson structure from external tutorials.
- Record references where they influenced product or content decisions.
- Separate research notes from final approved content.
- Revalidate time-sensitive information when needed.
- Avoid making unsupported market-size or revenue claims.

Research supports decision-making, but it does not automatically create product requirements.

---

## 24.6 Content Reference Policy

IBMiHub AI content must remain original.

External resources may be used for research, validation, and fact-checking, but final learning content should be written in IBMiHub AI's own words, structure, examples, and teaching style.

The appendix may contain reference links or notes, but it must not contain copied tutorial content, copied documentation text, copied examples, or copied course material.

---

## 24.7 MVP Validation Evidence to Capture Later

After MVP beta begins, the appendix or supporting documents may reference evidence such as:

- Beta user feedback summaries
- Lesson completion observations
- AI Tutor usage observations
- Common user confusion points
- Feature request themes
- Willingness-to-pay signals
- User interview notes
- Community response notes
- Product decision summaries

Detailed evidence may live outside the PRD, but the PRD may reference it when it affects product decisions.

---

## 24.8 Decision Records to Maintain Later

As the project moves from planning to implementation, important decisions should be captured in appropriate documents.

Examples include:

- MVP beta access model
- Minimum MVP lesson count
- Quiz inclusion or deferral
- Glossary inclusion or deferral
- Account requirement before lesson access
- AI provider decision
- AI conversation storage decision
- Technology stack decision
- Authentication decision
- Analytics decision
- Content storage decision
- Required SDD specs before coding

Decisions that affect architecture should be recorded in ADRs.

Decisions that affect scope should be reflected in the PRD.

Decisions that affect current execution should be reflected in PROJECT_STATE.md.

---

## 24.9 Appendix Maintenance

This appendix should be reviewed:

- Before Sprint 1 planning
- When new supporting documents are created
- When architecture decisions are made
- When SDD specs are created
- Before MVP beta release
- After major roadmap changes
- Before final PRD approval

The appendix should remain concise.

If supporting material becomes too large, it should be moved into a separate document and referenced from this section.

---

### Summary

The appendix supports the PRD by organizing related documents, future spec candidates, future architecture decision topics, research guidance, content reference rules, validation evidence, and decision records.

It should not introduce new product scope or implementation decisions.

The PRD remains the product source of truth, while the appendix serves as a supporting reference layer.

---

## 25. Revision History

### Purpose of This Section

The purpose of this section is to track major PRD changes over time.

Revision history helps contributors understand how the PRD evolved from an initial structure into a complete planning document.

This section should capture meaningful content, scope, structure, and status changes. Minor typo fixes do not need separate revision entries unless they affect interpretation.

---

### Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-06-30 | 0.1 | Initial PRD structure created with table of contents and section placeholders |
| 2026-06-30 | 0.2 | Renamed PRODUCT_REQUIREMENTS.md to PRD.md; added Product Principles section; renumbered later sections |
| 2026-06-30 | 0.3 | Added approved Executive Summary content |
| 2026-07-01 | 0.4 | Added approved Vision & Mission content |
| 2026-07-01 | 0.5 | Added approved Problem Statement content |
| 2026-07-01 | 0.6 | Added approved Goals & Objectives content |
| 2026-07-01 | 0.7 | Added approved Success Metrics & KPIs content |
| 2026-07-01 | 0.8 | Added approved Product Principles content |
| 2026-07-01 | 0.9 | Added approved Market Analysis content |
| 2026-07-01 | 1.0 | Added approved Competitive Landscape content |
| 2026-07-01 | 1.1 | Added approved User Personas content |
| 2026-07-01 | 1.2 | Added approved User Journeys content |
| 2026-07-01 | 1.3 | Added approved Product Scope content |
| 2026-07-01 | 1.4 | Added approved MVP Definition content |
| 2026-07-01 | 1.5 | Added approved Functional Requirements content |
| 2026-07-01 | 1.6 | Added approved Non-Functional Requirements content |
| 2026-07-01 | 1.7 | Added approved AI Strategy content |
| 2026-07-01 | 1.8 | Added approved Learning & Content Strategy content |
| 2026-07-01 | 1.9 | Added approved Monetization Strategy content |
| 2026-07-01 | 2.0 | Added approved Technical Constraints & Dependencies content |
| 2026-07-01 | 2.1 | Added approved Risk Analysis content |
| 2026-07-01 | 2.2 | Added approved Assumptions & Open Questions content |
| 2026-07-01 | 2.3 | Added approved Roadmap content |
| 2026-07-01 | 2.4 | Added approved Future Vision content |
| 2026-07-01 | 2.5 | Added approved Glossary & Terminology content |
| 2026-07-01 | 2.6 | Added approved Appendix content |
| 2026-07-01 | 2.7 | Completed Document Control, Revision History, and final PRD cleanup |

---

### Current Version Summary

Version 2.7 completes the first full draft of the IBMiHub AI PRD.

At this stage:

- All planned PRD sections contain draft content.
- MVP scope is documented.
- Functional and non-functional requirements are documented.
- AI strategy is documented.
- Learning, content, monetization, technical constraints, risks, assumptions, roadmap, future vision, glossary, and appendix are documented.
- The PRD is ready for full Product Owner review.
- Sprint 1 implementation should not begin until required decisions and SDD specs are prepared.

---

### Summary

The PRD has now moved from section-by-section drafting to complete-document review readiness.

The next major step is not to add more PRD content, but to review the PRD as a whole, resolve Sprint 1 open questions, and create downstream SDD specifications for MVP implementation.
