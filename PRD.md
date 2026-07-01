# Product Requirements Document (PRD)

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Master Product Requirements Document — the single source of truth for all product decisions across the lifetime of the platform
- Version: 0.9
- Status: Draft — Sections 1–7 Complete
- Last Updated: 2026-07-01
- Owner: Product

---

## Document Purpose & How to Use This Document

This PRD is the authoritative product definition for IBMiHub AI. It exists one level above implementation: it defines **what** the product is, **why** it exists, **who** it serves, and **what success looks like** — not how it will be built.

This document is **not**:
- A technical specification
- An implementation or engineering design document
- An SDD feature specification (those live under `specs/` and derive from this PRD)

Most sections below are currently placeholders. Sections 1–7 contain approved draft content, while remaining sections will be completed and reviewed section by section. Each entry defines the section's purpose, audience, and expected size so the document can be written and reviewed section-by-section, then approved by the Product Owner before downstream specs, plans, or architecture work reference it.

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
| 2026-07-01 | 0.7 | Added approved Success Metrics & KPIs content |
| 2026-07-01 | 0.8 | Added approved Product Principles content |
| 2026-07-01 | 0.9 | Added approved Market Analysis content |
