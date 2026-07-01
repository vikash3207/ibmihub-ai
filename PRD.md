# Product Requirements Document (PRD)

## Document Metadata
- Project: IBMiHub AI
- Document Purpose: Master Product Requirements Document — the single source of truth for all product decisions across the lifetime of the platform
- Version: 1.5
- Status: Draft — Sections 1–13 Complete
- Last Updated: 2026-07-01
- Owner: Product

---

## Document Purpose & How to Use This Document

This PRD is the authoritative product definition for IBMiHub AI. It exists one level above implementation: it defines **what** the product is, **why** it exists, **who** it serves, and **what success looks like** — not how it will be built.

This document is **not**:
- A technical specification
- An implementation or engineering design document
- An SDD feature specification (those live under `specs/` and derive from this PRD)

Most sections below are currently placeholders. Sections 1–13 contain approved draft content, while remaining sections will be completed and reviewed section by section. Each entry defines the section's purpose, audience, and expected size so the document can be written and reviewed section-by-section, then approved by the Product Owner before downstream specs, plans, or architecture work reference it.

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
| 2026-07-01 | 1.0 | Added approved Competitive Landscape content |
| 2026-07-01 | 1.1 | Added approved User Personas content |
| 2026-07-01 | 1.2 | Added approved User Journeys content |
| 2026-07-01 | 1.3 | Added approved Product Scope content |
| 2026-07-01 | 1.4 | Added approved MVP Definition content |
| 2026-07-01 | 1.5 | Added approved Functional Requirements content |
