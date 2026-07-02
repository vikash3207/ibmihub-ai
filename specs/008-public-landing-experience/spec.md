# Spec 008: Public Landing Experience

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 008 |
| Feature | Public Landing Experience |
| Status | Approved |
| Version | 1.0 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor positioning and access rules |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center public access rules and routes |
| specs/003-lesson-experience/spec.md | v1.0 Approved | First lesson public preview reference |
| specs/004-user-account-and-onboarding/spec.md | v1.0 Approved | Sign-up, login, and access control reference |
| specs/007-feedback-collection/spec.md | v1.0 Approved | General beta feedback entry point reference |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-002-hosting-and-deployment.md | v0.1 Accepted | Vercel hosting decision |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth decision |

---

## 2. Purpose

The public landing page is the first thing many users see when they encounter IBMiHub AI. It introduces the product, explains who it is for, communicates its value proposition, and routes users to the appropriate next action: previewing the first lesson, browsing the Learning Center, requesting access or signing up, or logging in.

The landing page does not need to be a full marketing website. For an MVP in limited-access or beta mode, it needs to do three things well:

1. **Explain the product clearly.** A visitor who knows nothing about IBMiHub AI should understand what it does and who it is for within one minute.
2. **Show that the content is real.** The first lesson preview and Learning Center link give users a direct way to evaluate the product before committing to sign-up.
3. **Route users to their correct next action.** New visitors need a path to sign up or request access. Existing users need a path to log in.

The landing page also sets trust expectations. It must not overpromise. IBM i is a specialized technical domain, and IBM i professionals are skeptical of generic AI tools. The landing page must position IBMiHub AI as IBM i-focused, not as a generic AI wrapper, and must be transparent about what the MVP does and does not do.

---

## 3. MVP Scope

The MVP landing page provides a clear, focused public entry point for IBMiHub AI.

### In Scope for MVP

| Capability | Description |
|---|---|
| Public landing page | Accessible without authentication at the root URL or `/` |
| Clear product positioning | Communicates that IBMiHub AI is an IBM i-focused learning and AI assistance platform |
| IBM i-focused value proposition | Explains why IBMiHub AI is different from generic AI tools |
| Target user explanation | Identifies that the product is for IBM i learners, working developers, and teams |
| Hero section | Prominent section with headline, subheadline, and primary call-to-action |
| Primary CTA | "Join the Waitlist" for the first launch phase (OQ-LAND-001 resolved). The CTA label must be easy to update when the product transitions to invite-only beta ("Create Account") or open beta ("Get Started"). |
| Secondary CTA to first lesson preview | A visible link allowing visitors to preview the first lesson without creating an account |
| Secondary CTA to Learning Center | A visible link to the IBM i Fundamentals learning path |
| AI Tutor positioning | Describes the AI Tutor as a feature available after login; does not imply public access |
| Learning Center positioning | Describes the IBM i Fundamentals learning path |
| Trust and privacy messaging | A brief statement about what data is not collected, AI limitations, and IBM i focus |
| Limited-access / beta access messaging | Communicates the current access model clearly (waitlist, invite, or beta) |
| Login link | A clearly accessible link to the login page for returning users |
| Basic responsive design | The page must be usable on common desktop and mobile browser sizes |
| SEO-friendly public page | Appropriate page title, meta description, and semantic HTML structure |

---

## 4. Explicitly Out of Scope for MVP

| Excluded Capability | Reason |
|---|---|
| Pricing page or subscription tier listing | Billing is out of MVP scope (PRD 17.2) |
| Billing or subscription checkout | Out of MVP scope (PRD 18.16) |
| Enterprise sales workflow or contact-sales form | Future feature (PRD 11, Phase 5+) |
| Public community features | Future feature (PRD 11) |
| Blog or content marketing system | Future feature |
| CMS for landing page content management | Not required for MVP; static content managed via code |
| User testimonials unless explicitly approved and verified as real | No fabricated social proof |
| Unverified market size or revenue claims | PRD Section 7 explicitly avoids unsupported market claims |
| AI benchmark or accuracy claims | AI responses may be incorrect; no correctness guarantee is made (PRD 15.7) |
| Live IBM i connectivity claims | No IBM i system connectivity in MVP (PRD 18.14) |
| Public AI Tutor usage without login | AI Tutor requires authentication (Spec 001 AI-TUTOR-FR-001) |
| Complex animations or heavy interactive elements | Not required for MVP; must not slow page load |
| Multi-page marketing site | Single landing page only for MVP |
| Public product roadmap | Not approved for public sharing |
| Customer or company logos | Not available at launch |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A beginner who has been assigned to work with IBM i or is considering learning it. They visit the landing page from a search result, LinkedIn post, or a colleague's recommendation. They need:

- To quickly understand what IBMiHub AI is and whether it is appropriate for someone with no IBM i background
- A low-friction path to preview content before committing to sign-up
- Confidence that the product is specifically for IBM i, not a generic AI tool

### Persona 2: Working IBM i Developer

An experienced IBM i developer who has heard about the product. They are skeptical and want to quickly assess whether the product has real IBM i depth. They need:

- Clear positioning that this is IBM i-specific, not a generic chatbot
- A direct path to see content quality (first lesson preview or Learning Center)
- A quick way to sign up or log in without wading through marketing

### Persona 3: IBM i Team Lead / Decision Maker

A team lead, manager, or trainer who is evaluating whether IBMiHub AI could help with team onboarding. They need:

- An understanding of what the product does for a team context
- A sense of the product's credibility and content quality
- A clear path to get started or request access

### Persona 4: Curious Visitor Evaluating the Product

A visitor from the IBM i community who wants to understand what IBMiHub AI is without a strong prior intent to sign up. They need:

- Enough information to form an opinion about the product in under two minutes
- An easy path to preview content
- No aggressive or confusing sign-up pressure

---

## 6. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-LAND-001 | New visitor | Read the headline and understand what IBMiHub AI is | I can decide in under one minute if this product is relevant to me |
| US-LAND-002 | New visitor | See clearly that this product is for IBM i professionals | I know it is not a generic AI chatbot and is specifically built for my domain |
| US-LAND-003 | New visitor | Understand how IBMiHub AI is different from simply using ChatGPT or Copilot | I can explain to others why this product has specific value for IBM i work |
| US-LAND-004 | Curious visitor | Preview the first lesson without creating an account | I can evaluate the content quality before committing to sign-up |
| US-LAND-005 | Curious visitor | Navigate to the Learning Center to see the full lesson list | I can browse what IBM i topics are covered |
| US-LAND-006 | Convinced visitor | Create an account or request access | I can join the product and start learning |
| US-LAND-007 | Returning user | See a clear login link | I can log in without hunting for the login button |
| US-LAND-008 | Curious visitor | Read a brief explanation of how the AI Tutor works and that it requires login | I understand what the AI Tutor does and that I need an account to use it |
| US-LAND-009 | Any visitor | See a brief trust or privacy message | I know what data is and is not collected and that AI output should be validated |
| US-LAND-010 | Mobile visitor | Read and navigate the landing page comfortably on a phone | I can use the landing page without zooming or horizontal scrolling |

---

## 7. Functional Requirements

### LANDING-FR-001 — Public Access

The landing page must be publicly accessible without authentication.

- The landing page must be served at the root URL (`/`) or a dedicated landing route without requiring login
- No authentication middleware must be applied to the landing page route
- Search engine crawlers must be able to index the landing page

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-001

---

### LANDING-FR-002 — Hero Section

The landing page must include a prominent hero section that communicates the product's purpose immediately.

- The hero section must include the approved headline, the approved subheadline, and the primary CTA
- Approved hero headline: **"Learn IBM i with structured lessons and AI guidance."** (OQ-LAND-002 resolved)
- Approved hero subheadline: **"IBMiHub AI helps beginners and working IBM i developers build confidence with IBM i Fundamentals, guided explanations, and an AI Tutor designed for IBM i concepts."** (OQ-LAND-002 resolved)
- The hero section must not use jargon that would be unfamiliar to IBM i professionals (e.g., no unexplained acronyms)
- The primary CTA ("Join the Waitlist") must be visually prominent

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-002, FR-LAND-003, FR-LAND-004; OQ-LAND-002 resolved

---

### LANDING-FR-003 — Product Value Proposition

The landing page must communicate why IBMiHub AI is useful and how it differs from generic AI tools.

- At least one section must explain the core differentiators: IBM i-specific focus, structured learning, AI Tutor assistance
- The messaging must not claim that IBMiHub AI is better than other AI tools in general; it must focus on the IBM i-specific value
- The messaging must not make claims about AI accuracy, production correctness, or IBM i system connectivity
- The messaging must not use unverified market statistics or benchmark numbers

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-002, FR-LAND-004; Section 9 Messaging Requirements

---

### LANDING-FR-004 — Target Audience Section

The landing page must identify who IBMiHub AI is for.

- The landing page must clearly name at least two of the primary target audiences: IBM i beginners, working IBM i developers, or teams and organizations with IBM i talent needs
- The audience description must be specific enough that a relevant user says "that is me" and an irrelevant user understands the product is not targeted at them

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-003

---

### LANDING-FR-005 — MVP Feature Overview

The landing page must describe the key MVP capabilities at a high level.

- IBM i Fundamentals learning path
- AI Tutor for IBM i-focused Q&A
- Basic progress tracking
- The descriptions must be accurate to the approved MVP scope; future features must not be presented as available

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-004

---

### LANDING-FR-006 — Learning Center CTA

The landing page must include a visible link to the Learning Center or IBM i Fundamentals path.

- The link must navigate to `/learn` or `/learn/ibm-i-fundamentals`
- The link should communicate that users can browse lessons or preview content
- The link must be accessible to unauthenticated users (the Learning Center and lesson list are public)

**Priority:** Must Have
**Source:** Spec 002 LEARNING-FR-001; PRD 13.2 FR-LAND-005

---

### LANDING-FR-007 — First Lesson Preview CTA

The landing page must include a visible link to the first lesson preview.

- The link must navigate to the first lesson at `/learn/ibm-i-fundamentals/what-is-ibm-i`
- The link should communicate that users can read the first lesson without signing up
- The link must be accessible to unauthenticated users

**Priority:** Must Have
**Source:** Spec 003 LESSON-FR-002; D-PROD-005; PRD 13.2 FR-LAND-005

---

### LANDING-FR-008 — AI Tutor Positioning

The landing page must describe the AI Tutor as a feature available after login, without implying it is publicly accessible.

- The AI Tutor description must communicate what it does: helps users ask IBM i-related questions and receive explanations
- The description must make clear that the AI Tutor is available after creating an account or logging in
- The description must not imply the AI Tutor provides production-safe or guaranteed-correct answers
- The description should note that users should not share private production code or sensitive job logs with the AI Tutor

**Priority:** Must Have
**Source:** Spec 001 AI-TUTOR-FR-001; PRD 13.2 FR-LAND-007; Section 9 Messaging Requirements

---

### LANDING-FR-009 — Primary Account CTA

The landing page must include a prominent call-to-action for new visitors to sign up or request access.

- The CTA for the first launch phase must use the label **"Join the Waitlist"** and must route to the waitlist or access-request mechanism (OQ-LAND-001 resolved)
- The CTA label must be stored in a configuration constant so it can be updated when the product moves to invite-only beta ("Create Account") or open beta ("Get Started") without touching component logic
- Later phases may change the CTA label only after Product Owner approval
- The CTA must be visually prominent and accessible in the hero section at minimum
- The CTA must be the primary action for new visitors who are ready to join

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-005; OQ-LAND-001 resolved

---

### LANDING-FR-010 — Login Link

The landing page must include a clearly accessible link to the login page.

- A login link must be present in the navigation header or an equivalent accessible location
- The login link must be distinct from the primary CTA for new visitors
- The login link must navigate to the login page defined in Spec 004

**Priority:** Must Have
**Source:** Spec 004 ACCOUNT-FR-002

---

### LANDING-FR-011 — Trust and Privacy Messaging

The landing page must include a brief trust and privacy statement using the approved wording (OQ-LAND-003 resolved).

Approved trust/privacy message:

> "AI Tutor responses may be incorrect and should be validated before production use. Do not paste private source code, sensitive job logs, credentials, or customer data. IBMiHub AI does not connect to real IBM i systems in the MVP."

- The trust message must appear as shown above; it must not be hidden in fine print
- The trust message must be accessible and visible to visitors evaluating the product

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-007; Spec 001 AI Trust Boundaries; Section 9 Messaging Requirements; OQ-LAND-003 resolved

---

### LANDING-FR-012 — Beta / Limited-Access Messaging

The landing page must communicate the current access model to visitors.

- If the product is in a limited-access or waitlist phase, the landing page must clearly state this
- The messaging must not imply the product is publicly open if it is not
- If access shifts from waitlist to open beta, the landing page messaging must be updated accordingly

**Priority:** Must Have
**Source:** D-PROD-001 (beta access model resolved); PRD 13.2 FR-LAND-006

---

### LANDING-FR-013 — Responsive Layout

The landing page must provide a usable experience on common desktop and mobile browser sizes.

- The page must be readable and navigable on common mobile screen sizes without horizontal scrolling
- The CTA buttons and navigation links must be large enough to be usable on touch screens
- The page layout must adapt reasonably between desktop and mobile views

**Priority:** Must Have
**Source:** PRD 14.11 NFR-MOB-001

---

### LANDING-FR-014 — SEO Metadata

The landing page must include basic SEO metadata.

- A descriptive page title must be included (e.g., "IBMiHub AI — IBM i Learning and AI Assistance Platform")
- A meta description of appropriate length must be included describing the product
- Semantic HTML heading structure must be used
- The page must be indexable by search engines; no `noindex` directive must be applied to the landing page

**Priority:** Must Have
**Source:** PRD 14 NFR SEO

---

### LANDING-FR-015 — Error-Free Navigation

All links and CTAs on the landing page must navigate to correct destinations.

- The Learning Center link must navigate to the live Learning Center
- The first lesson preview link must navigate to the live first lesson
- The login link must navigate to the login page
- The primary CTA must navigate to the sign-up or access-request flow
- All links must be tested and confirmed before beta launch

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-006

---

## 8. Non-Functional Requirements

### NFR: Performance

- The landing page must load quickly to support a good first impression
- Static content should be statically generated or cached at the CDN level (Vercel) for fast delivery
- The page must not include heavy JavaScript bundles, complex animations, or unnecessary third-party scripts
- The page must be usable on typical mobile internet connections

**Source:** PRD 14.3 NFR-PERF-001, NFR-PERF-006

---

### NFR: Accessibility

- The landing page must use semantic HTML structure (heading hierarchy, landmark elements)
- All images must have descriptive alt text
- CTA buttons and links must have accessible labels
- The page must maintain sufficient color contrast for readability
- The page must be keyboard-navigable; all interactive elements must be reachable without a mouse

**Source:** PRD 14.10 NFR-ACC-001 through NFR-ACC-005

---

### NFR: SEO

- The page must be publicly indexable
- Page title and meta description must be present and descriptive
- Canonical URL must be set correctly
- Semantic heading structure must be used to support search indexing
- The first lesson preview route (`/learn/ibm-i-fundamentals/what-is-ibm-i`) must be linked from the landing page to support search discovery

**Source:** PRD 14 NFR; Spec 003 NFR SEO

---

### NFR: Security

- The landing page must not include any authenticated endpoints or expose user data
- No authentication tokens or session data must be present in the landing page response
- The landing page must not introduce XSS, clickjacking, or other security vulnerabilities

**Source:** PRD 14.6 NFR-SEC

---

### NFR: Privacy

- The landing page must not include third-party advertising scripts, social media tracking pixels, or analytics tools that collect PII without user consent
- Any analytics used on the landing page must be privacy-respecting and minimal
- The landing page must not collect user data beyond what is submitted through the sign-up CTA

**Source:** PRD 14.7 NFR-PRIV-001

---

### NFR: Maintainability

- Landing page copy (headline, subheadline, section text) must be easy to update without requiring code changes to component logic
- The landing page CTA label must be easy to update as the product moves from waitlist to open beta
- Static text should be stored in a way that makes copy changes straightforward

**Source:** PRD 14.13 NFR-MAIN-004

---

### NFR: Reliability

- The landing page must be served reliably from the Vercel CDN; it must not depend on runtime database calls
- If any dynamic elements are used (e.g., for detecting auth state), they must fail gracefully without breaking the page for unauthenticated visitors

**Source:** PRD 14.4 NFR-REL-001

---

## 9. Landing Page Messaging Requirements

This section defines the approved messaging boundaries for the landing page. The hero headline, subheadline, and trust/privacy message are approved (see LANDING-FR-002 and LANDING-FR-011; OQ-LAND-002 and OQ-LAND-003 resolved). This section defines what the messaging must and must not communicate.

### What the Messaging Must Communicate

- IBMiHub AI helps IBM i learners and working developers learn and work with IBM i through structured lessons and AI assistance
- It is IBM i-focused — not a generic chatbot that happens to know some IBM i facts
- The MVP offers: IBM i Fundamentals structured learning path, AI Tutor for IBM i-focused Q&A, basic progress tracking
- The first lesson is available to preview without signing up
- The AI Tutor requires creating an account to use
- Users should not paste private production code, sensitive job logs, credentials, or customer data into the AI Tutor
- AI Tutor responses may be incorrect and should be validated before production use
- IBMiHub AI does not connect to real IBM i systems in the current version

### What the Messaging Must Not Claim

- That the AI Tutor provides guaranteed-correct IBM i guidance
- That IBMiHub AI outperforms specific competitors in benchmarks
- Market size statistics unless explicitly verified and approved
- That the product is ready for production use as a technical reference
- That data is stored securely without also noting what data is not collected (i.e., must not overclaim data security without specifics)
- That the product is already used by enterprises or large teams during the initial MVP phase

---

## 10. CTA and Access Rules

### Public Access (No Login Required)

| Page / Resource | Access |
|---|---|
| Landing page | Public |
| Learning Center (`/learn`) | Public |
| IBM i Fundamentals path (`/learn/ibm-i-fundamentals`) | Public |
| First lesson (`/learn/ibm-i-fundamentals/what-is-ibm-i`) | Public full preview |

### Login Required

| Feature | Access |
|---|---|
| Lessons beyond Lesson 1 | Login required; login/sign-up prompt shown |
| AI Tutor (`/ai-tutor`) | Login required; login/sign-up prompt shown |
| Dashboard (`/dashboard`) | Login required; redirect to login |
| Progress tracking | Login required |

### CTA Behavior by Launch Phase

The primary CTA label and behavior depends on the current access model.

| Launch Phase | Primary CTA | Behavior |
|---|---|---|
| Limited-access / waitlist | **"Join the Waitlist"** (approved; OQ-LAND-001 resolved) | Collects interest or directs to a waitlist mechanism |
| Invite-only beta | "Create Account" (requires Product Owner approval to change from waitlist phase) | Navigates to sign-up flow |
| Open beta | "Create Account" or "Get Started" (requires Product Owner approval) | Navigates to sign-up flow |

---

## 11. UX Requirements

### Header / Navigation

- A visible header must be present at the top of the landing page
- The header must include: the IBMiHub AI product name or logo, a login link, and the primary account CTA
- The header must be consistent with the design direction established during implementation
- The header must be sticky or accessible on scroll so the login link and CTA remain reachable

### Hero Section

- The hero section is the first content visible without scrolling
- It must display the approved headline: **"Learn IBM i with structured lessons and AI guidance."** (OQ-LAND-002 resolved)
- It must display the approved subheadline: **"IBMiHub AI helps beginners and working IBM i developers build confidence with IBM i Fundamentals, guided explanations, and an AI Tutor designed for IBM i concepts."**
- It must include the primary CTA ("Join the Waitlist") and optionally a secondary CTA to the first lesson or Learning Center
- The hero must not be visually cluttered; the primary CTA must be obvious

### Primary CTA

- A visually prominent button labeled **"Join the Waitlist"** (OQ-LAND-001 resolved) that routes the user to the waitlist or access-request mechanism
- The CTA label is stored in a configuration constant; it must not be hardcoded so it can be updated for future launch phases
- The CTA must be large enough for touch targets on mobile
- The CTA must appear at minimum in the hero section; it may be repeated further down the page

### Secondary CTAs

- "Preview the first lesson" — links to the first lesson at `/learn/ibm-i-fundamentals/what-is-ibm-i`
- "Browse the Learning Center" — links to `/learn/ibm-i-fundamentals`
- These secondary CTAs must be clearly labeled and positioned to support curiosity without competing with the primary CTA

### Feature Overview Section

- A section that briefly describes the product's key capabilities: Learning Center, AI Tutor, progress tracking
- Each feature description must be accurate to the approved MVP scope
- No speculative future features must appear in the feature overview

### Audience Section

- A section that names who the product is for: IBM i beginners, working IBM i developers, and/or teams
- This section may use a simple list or short descriptions per audience type

### Trust and Privacy Section

- A brief section displaying the approved trust/privacy message (OQ-LAND-003 resolved):
  > "AI Tutor responses may be incorrect and should be validated before production use. Do not paste private source code, sensitive job logs, credentials, or customer data. IBMiHub AI does not connect to real IBM i systems in the MVP."
- This must be positioned where a serious evaluator will see it, not hidden at the bottom of the page

### Footer

- A simple footer with: product name, link to Learning Center, link to login, and optionally a link to the general beta feedback form (Spec 007 FEEDBACK-FR-015)
- The footer must not include placeholder links or "coming soon" links

### Mobile Layout

- The page must reflow correctly on mobile screen sizes
- The hero section must be readable on a phone without zooming
- The primary CTA must be large enough for touch interaction

### Loading or Error Behavior

- The landing page is primarily static; it must not show meaningful loading states unless a dynamic auth-state detection element is used
- If a dynamic element fails (e.g., detecting whether a user is already logged in to adjust the CTA), it must fall back to the default unauthenticated state without breaking the page

---

## 12. Dependencies

The Public Landing Experience feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Tech stack | Next.js + TypeScript — landing page built with the same framework | ADR-001 |
| Hosting | Vercel — statically generated or server-rendered landing page served from CDN | ADR-002 |
| Authentication | Supabase Auth — login link and sign-up CTA route to Supabase Auth flows | ADR-004 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 002: Learning Center | The Learning Center link and first lesson link route to the implemented Learning Center |
| Spec 003: Lesson Experience | The first lesson preview CTA routes to the lesson page at `/learn/ibm-i-fundamentals/what-is-ibm-i` |
| Spec 004: User Account and Onboarding | The login link and primary account CTA route to the auth flows defined in Spec 004 |
| Spec 001: AI Tutor | AI Tutor is described on the landing page; its authentication requirement is communicated |
| Spec 007: Feedback Collection | If a beta feedback link appears in the footer, it connects to the general beta feedback form |

---

## 13. Acceptance Criteria

The Public Landing Experience is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Public Access and Navigation

- [ ] The landing page is publicly accessible without authentication
- [ ] A link to the Learning Center (`/learn` or `/learn/ibm-i-fundamentals`) navigates correctly
- [ ] A link to the first lesson (`/learn/ibm-i-fundamentals/what-is-ibm-i`) navigates correctly
- [ ] A login link navigates to the login page
- [ ] The primary account CTA navigates to the appropriate sign-up or access-request flow

### Content and Messaging

- [ ] A visitor can understand what IBMiHub AI is from the hero section in under one minute
- [ ] The page communicates that the product is IBM i-focused and not a generic AI tool
- [ ] MVP capabilities are described accurately: IBM i Fundamentals path, AI Tutor, progress tracking
- [ ] The AI Tutor is described as requiring login
- [ ] A trust/privacy message is visible communicating AI limitations and data sharing guidance
- [ ] Beta/limited-access messaging accurately reflects the current access model

### Technical

- [ ] The page loads quickly
- [ ] The page is usable on common mobile screen sizes
- [ ] SEO metadata is present: page title and meta description
- [ ] The page is publicly indexable (no noindex directive)
- [ ] All links and CTAs lead to correct destinations

### Out-of-Scope Verification

- [ ] No pricing or billing information appears
- [ ] No enterprise sales workflow or contact-sales form appears
- [ ] No unverified market statistics or benchmark claims appear
- [ ] No claim of production-safe AI output appears
- [ ] No claim of real IBM i system connectivity appears
- [ ] No fabricated testimonials or customer logos appear
- [ ] No public AI Tutor usage without login is possible from the landing page

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Landing page overpromises beyond MVP scope — copy implies features not yet built | Medium | High | Messaging requirements in Section 9 define explicit boundaries; copy must be reviewed by Product Owner before launch; no future features may be described as available |
| Messaging sounds like a generic ChatGPT wrapper — visitors do not see IBM i-specific value | Medium | High | Explicitly name IBM i topics (RPGLE, CLLE, DDS, 5250, job logs) in the value proposition; position as IBM i-first, not AI-first |
| User confusion about what is public vs. login-required — visitors bounce because they do not know they can preview content | Medium | Medium | LANDING-FR-006 and LANDING-FR-007 require clear CTAs to the free preview; the distinction between public and authenticated features should be made visible |
| Low conversion from preview to sign-up — users preview the first lesson but do not create an account | Medium | Medium | This is a known risk for any freemium product; the first lesson must end with a clear sign-up CTA (Spec 003 LESSON-FR-010); track preview-to-signup conversion from beta day one |
| Unverified claims reduce trust — IBM i professionals detect inaccurate statements and lose confidence | Low | High | Section 9 messaging requirements explicitly prohibit unverified claims; Product Owner must review all copy before launch |
| Scope creep into multi-page marketing site — pressure to add blog, pricing, case studies during implementation | Medium | Medium | This spec explicitly defines the MVP as a single landing page; any additional pages require Product Owner approval |

---

## 15. Open Questions

No open questions remain for this spec at this stage. Any new questions discovered during implementation planning should be added here before coding begins.

---

## 16. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any Public Landing Experience implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope and messaging boundaries
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] Routes for Learning Center, first lesson, login, and waitlist/access-request are confirmed before implementation begins

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for the Public Landing Experience is created and approved
- [ ] Spec 002 (Learning Center) is implemented or its routes are confirmed — the landing page links to the Learning Center
- [ ] Spec 003 (Lesson Experience) is implemented or the first lesson route is confirmed — the landing page links to the first lesson
- [ ] Spec 004 (User Account and Onboarding) is implemented or the login/sign-up route is confirmed — the landing page links to auth flows
- [ ] All landing page copy has been reviewed and approved by the Product Owner

### Notes for Implementation Planning

- The landing page should be implemented as a statically generated Next.js page to maximize load speed and CDN delivery. Database calls must not be required to render the page.
- If the landing page needs to detect whether a user is already logged in (e.g., to change the CTA to "Go to Dashboard"), this should be a client-side hydration step that does not block initial render.
- The CTA label ("Join the Waitlist") must be stored in a configuration constant so it can be updated when the access model changes without touching component logic; Product Owner approval is required before changing the label.
- All copy on the landing page must be reviewed for accuracy against the MVP feature set before beta launch; no future features may be described as current.
- The approved hero headline, subheadline, and trust/privacy message (LANDING-FR-002, LANDING-FR-011) must be used verbatim; no paraphrasing or substitution without Product Owner approval.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — MVP Public Landing Experience spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 001–004, 007 |
| 2026-07-01 | 0.2 | Cleanup after review; resolved CTA, hero copy, and trust/privacy message decisions |
| 2026-07-01 | 1.0 | Approved Public Landing Experience SDD spec for implementation planning |
