# Spec 004: User Account and Onboarding

---

## 1. Spec Metadata

| Field | Value |
|---|---|
| Spec ID | 004 |
| Feature | User Account and Onboarding |
| Status | Draft |
| Version | 0.1 |
| Owner | Product + Engineering |
| Last Updated | 2026-07-01 |

### Source Documents

| Document | Version | Role |
|---|---|---|
| PRD.md | v2.9 | Primary product requirements source |
| planning/SPRINT_1_DECISION_REGISTER.md | v0.3 | Resolved Sprint 1 blocking decisions |
| specs/001-ai-tutor/spec.md | v1.0 Approved | AI Tutor authentication dependency |
| specs/002-learning-center/spec.md | v1.0 Approved | Learning Center access rules reference |
| specs/003-lesson-experience/spec.md | v1.0 Approved | Lesson access rules reference |
| docs/adr/ADR-001-mvp-technology-stack.md | v0.1 Accepted | Next.js + TypeScript stack decision |
| docs/adr/ADR-003-database-and-storage.md | v0.1 Accepted | Supabase PostgreSQL storage decision |
| docs/adr/ADR-004-authentication-approach.md | v0.1 Accepted | Supabase Auth authentication decision |

---

## 2. Purpose

User accounts are the identity layer that enables the personalized MVP experience. Without user accounts, IBMiHub AI can only provide public content — the landing page, Learning Center listing, and first lesson preview. With user accounts, the product can unlock its core learning value: saving progress across sessions, providing AI Tutor access, personalizing the dashboard, and giving users a reason to return.

The User Account and Onboarding feature exists in the MVP to:

- Allow users to create an account and log in securely using managed authentication (Supabase Auth)
- Associate learning progress with individual users so it persists across sessions
- Gate the AI Tutor and progress tracking behind authentication to protect these features
- Surface a single lightweight onboarding question that helps route new users to the right starting point
- Give working developers and beginners a distinct starting experience without enforcing rigid restrictions
- Provide a reliable, secure foundation that can support future team accounts, enterprise features, and monetization without a full rebuild

This spec defines the MVP scope, authentication requirements, onboarding question, access control rules, user data requirements, UX requirements, and acceptance criteria for the User Account and Onboarding feature.

---

## 3. MVP Scope

The MVP User Account and Onboarding feature provides email/password authentication, session management, a single onboarding question, and authentication-based access control for protected features.

### In Scope for MVP

| Capability | Description |
|---|---|
| Managed authentication via Supabase Auth | All authentication is handled by Supabase Auth; no custom auth is built (ADR-004) |
| Email/password sign-up | Users create an account with an email address and password |
| Email/password login | Users log in with their registered email and password |
| Logout | Users can log out of their account from any authenticated page |
| Session persistence | Sessions persist across browser refreshes and reasonable time periods without requiring re-login |
| Basic user profile | A minimal user profile exists: user ID, email, onboarding response, and timestamps |
| One onboarding question | After sign-up, new users are shown one question to determine their starting experience level (D-PROD-006) |
| Public landing page and Learning Center browsing | These are accessible without authentication |
| First lesson preview without login | Lesson 1 (What is IBM i?) is accessible without authentication (Spec 003) |
| Authentication required for AI Tutor | AI Tutor usage requires a logged-in account (Spec 001) |
| Authentication required for progress tracking | Lesson completion and progress are only tracked for authenticated users (Spec 006) |
| Authentication required for dashboard | The dashboard is only accessible to authenticated users (Spec 005) |
| Login/sign-up prompts for protected features | When unauthenticated users attempt to access protected features, they see a clear prompt |
| Minimal data collection | Only the data necessary for the MVP learning experience is collected |

---

## 4. Explicitly Out of Scope for MVP

The following capabilities must not be included in the MVP User Account and Onboarding implementation.

| Excluded Capability | Reason |
|---|---|
| Custom authentication implementation | Explicitly prohibited; Supabase Auth is the required managed provider (ADR-004) |
| Enterprise SSO | Future enterprise feature (PRD 18.17) |
| SAML or SCIM | Future enterprise identity protocols (PRD 18.17) |
| Organization or team accounts | Future feature (PRD 11, Phase 5) |
| Admin user management or admin roles | Out of MVP scope (PRD 18.17) |
| Role-based permissions or access tiers | Future feature |
| Billing or subscription account types | Monetization is out of MVP scope (PRD 17.2, 18.16) |
| Social login (Google, LinkedIn, GitHub) | Not approved for MVP; may be added in a post-MVP sprint after evaluation |
| Multi-factor authentication (MFA) or passkeys | Not required for MVP; Supabase Auth supports these and they can be enabled later |
| User profile customization (display name, avatar) | Future feature |
| Public user profiles | Future feature |
| Automated account deletion or data export | Future compliance feature |
| Complex multi-step onboarding survey | MVP uses one question only (D-PROD-006) |
| User-generated content or sharing features | Future feature |

---

## 5. User Personas

### Persona 1: Beginner IBM i Learner

A user new to IBM i who creates an account to save their learning progress and access the AI Tutor. This user needs:

- A simple, low-friction sign-up process
- A clear onboarding question that helps them start with beginner-appropriate content
- Confidence that their progress will be saved when they return
- A dashboard that shows where they left off

The sign-up and onboarding experience must not overwhelm this persona before they have experienced any product value. The first lesson preview (available without login) is a deliberate strategy to let beginners experience content quality before committing to sign-up.

### Persona 2: Working IBM i Developer

A user who already works with IBM i and creates an account primarily to use the AI Tutor or access refresher content. This user needs:

- A quick, low-friction sign-up process
- An onboarding question that recognizes their existing experience and routes them appropriately
- Access to the AI Tutor without being forced through a beginner-only experience

The onboarding question must offer a clear option for this persona ("I already work with IBM i") so they are not routed into the beginner path against their preference.

---

## 6. Approved Onboarding Question

The following onboarding question is approved for the MVP. It must be shown to new users immediately after completing sign-up, before they are directed to the dashboard or learning experience.

### Question

**Which best describes you?**

### Options

- I am new to IBM i and want to start learning.
- I already work with IBM i and want to refresh or deepen my knowledge.
- I am exploring what IBMiHub AI offers.

### Behavior Rules

- The question must be shown to every new user exactly once during their sign-up flow
- The answer helps recommend a starting point (e.g., beginner learning path vs. a general entry into the Learning Center)
- The answer does not restrict access; a user who selects "I already work with IBM i" can still read beginner lessons
- The onboarding answer must be stored with the user's account so it can inform personalization in the dashboard
- A user who skips or closes the onboarding question without answering should still be allowed to continue (skippable for MVP)
- The question should not be shown again to returning users who have already answered or skipped it

---

## 7. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-ACCOUNT-001 | New visitor | Create an account with my email and password | I can save my learning progress and access the AI Tutor |
| US-ACCOUNT-002 | Registered user | Log in with my email and password | I can continue where I left off |
| US-ACCOUNT-003 | Authenticated user | Log out | I can end my session on a shared device |
| US-ACCOUNT-004 | Registered user | Return to the product and still be logged in | I can continue learning without re-logging in every visit |
| US-ACCOUNT-005 | New user after sign-up | Answer a single question about my IBM i experience level | The product can recommend an appropriate starting point for me |
| US-ACCOUNT-006 | Authenticated user | Be taken to my dashboard after logging in | I can see my progress and continue learning immediately |
| US-ACCOUNT-007 | Unauthenticated visitor | See a clear login/sign-up prompt when I try to use the AI Tutor | I know I need an account to access this feature |
| US-ACCOUNT-008 | Unauthenticated visitor | Read Lesson 1 (What is IBM i?) without creating an account | I can evaluate the content before committing to sign-up |
| US-ACCOUNT-009 | Unauthenticated visitor | See a clear login/sign-up prompt when I try to open a lesson beyond Lesson 1 | I know I need an account to continue learning |
| US-ACCOUNT-010 | Authenticated user | See my completed lessons saved when I return | I do not have to re-complete lessons I have already finished |
| US-ACCOUNT-011 | User who made a mistake | See a clear, helpful error message if sign-up or login fails | I understand what went wrong and can try again |

---

## 8. Functional Requirements

### ACCOUNT-FR-001 — Email/Password Sign-Up

The product must allow users to create an account using an email address and password.

- The sign-up form must accept an email address and a password
- Password handling must be managed entirely by Supabase Auth; the application must never store, log, or process raw passwords directly
- On successful sign-up, the user is considered authenticated and must be directed to the onboarding question (see ACCOUNT-FR-012)
- If the email address is already registered, the sign-up form must display a clear error message
- If the email or password does not meet validation requirements, clear inline error messages must be displayed

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-001; ADR-004

---

### ACCOUNT-FR-002 — Email/Password Login

The product must allow registered users to log in with their email and password.

- The login form must accept an email address and a password
- On successful login, the user must be directed to the dashboard or to the page they were attempting to access before being redirected to login (see ACCOUNT-FR-015 post-login redirect)
- If the credentials are incorrect or the account does not exist, the login form must display a clear, non-specific error message (e.g., "Incorrect email or password")
- Specific error messages must not reveal whether an email is registered or not (security consideration)

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-002; ADR-004

---

### ACCOUNT-FR-003 — Logout

The product must allow authenticated users to log out.

- A logout control must be accessible from any authenticated page (e.g., in a navigation menu or user menu)
- On logout, the user's session must be cleared and they must be directed to the public landing page or login page
- After logout, protected routes must no longer be accessible without re-authenticating

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-006

---

### ACCOUNT-FR-004 — Session Persistence

Authenticated sessions must persist across browser refreshes and reasonable periods of inactivity.

- A user who refreshes the page must remain logged in without being forced to re-authenticate
- A user who returns to the product within a reasonable session window must remain logged in
- Session management is handled by Supabase Auth; the specific session expiry behavior follows Supabase Auth defaults unless explicitly overridden
- The session state must be available to server-side route handlers for access control enforcement

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-004

---

### ACCOUNT-FR-005 — Authenticated Route Protection

Protected features and routes must not be accessible to unauthenticated users.

- The following routes and features require authentication: Dashboard, AI Tutor, lesson pages beyond Lesson 1, progress tracking interactions
- Unauthenticated requests to protected routes must be redirected to the login page or shown a login/sign-up prompt
- This protection must be enforced server-side, not only client-side
- Authenticated route protection must be consistent and must not accidentally expose protected content

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-001; Spec 001, 003, 005, 006

---

### ACCOUNT-FR-006 — Public Route Access

Certain routes must remain publicly accessible without authentication.

- The following routes must remain public: Landing page, Learning Center page, Learning Center lesson list, Lesson 1 (What is IBM i?) full content
- Public routes must not redirect unauthenticated users to a login page
- Access to public routes must not be broken by future authentication configuration changes

**Priority:** Must Have
**Source:** PRD 13.2 FR-LAND-001; Spec 002 LEARNING-FR-001; Spec 003 LESSON-FR-002

---

### ACCOUNT-FR-007 — First Lesson Preview Access Without Authentication

Lesson 1 must be fully readable without authentication.

- An unauthenticated user who navigates to the first lesson route must receive the full lesson content
- The first lesson preview must not require any authentication token or session
- At the end of Lesson 1, the user must see a call-to-action to create an account to save progress and continue (Spec 003 LESSON-FR-010)

**Priority:** Must Have
**Source:** D-PROD-005; Spec 002 LEARNING-FR-005; Spec 003 LESSON-FR-002

---

### ACCOUNT-FR-008 — AI Tutor Authentication Gate

The AI Tutor must only be accessible to authenticated users.

- Any attempt to access or submit a prompt to the AI Tutor without authentication must result in a login/sign-up prompt rather than AI Tutor functionality
- This gate must be enforced at the route level (the AI Tutor page at `/ai-tutor` must redirect unauthenticated users) and at the API level (AI provider calls must not be made for unauthenticated requests)

**Priority:** Must Have
**Source:** Spec 001 AI-TUTOR-FR-001; D-PROD-005

---

### ACCOUNT-FR-009 — Dashboard Authentication Gate

The dashboard must only be accessible to authenticated users.

- Any attempt to access the dashboard route without authentication must result in a redirect to the login page
- This gate must be enforced server-side

**Priority:** Must Have
**Source:** Spec 005 Dashboard; D-PROD-005

---

### ACCOUNT-FR-010 — Progress Tracking Identity

Learning progress records must be associated with the authenticated user's account.

- When a user marks a lesson complete, the completion record must be written with the authenticated user's ID
- Progress records must only be readable by the user who owns them
- Unauthenticated users have no progress records; their lesson reading is not saved

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-004; Spec 006 Progress Tracking

---

### ACCOUNT-FR-011 — Onboarding Question Display

New users must be shown the onboarding question immediately after completing sign-up.

- The onboarding question must appear after the sign-up flow completes and before the user reaches the dashboard
- The question and its options must match the approved content in Section 6 exactly
- The onboarding screen must allow the user to skip if they choose not to answer
- The onboarding question must not be shown again to users who have already answered or skipped it

**Priority:** Must Have
**Source:** D-PROD-006

---

### ACCOUNT-FR-012 — Onboarding Answer Storage

The user's onboarding question answer must be stored with their account.

- The selected option (or a skip indication) must be stored in the user's profile record in the database
- The stored answer may be used by the dashboard and Learning Center to recommend a starting point
- The stored answer must not restrict what the user can access

**Priority:** Must Have
**Source:** D-PROD-006; Spec 005 Dashboard

---

### ACCOUNT-FR-013 — Returning User Behavior

A returning authenticated user must not be shown the onboarding question again.

- If a user has already answered or skipped the onboarding question, their next login must take them directly to the dashboard
- The onboarding state (answered, skipped, not yet shown) must be determinable from the user's profile record

**Priority:** Must Have
**Source:** D-PROD-006; US-ACCOUNT-010

---

### ACCOUNT-FR-014 — Login/Sign-Up Prompt Behavior

When an unauthenticated user attempts to access a protected feature, they must see a clear login/sign-up prompt.

- The prompt must explain clearly that login or account creation is required for the feature they are trying to access
- The prompt must provide direct call-to-action options to log in or create a new account
- The prompt must not expose lesson content, AI Tutor responses, or dashboard data to unauthenticated users
- The prompt should communicate the benefit of creating an account (e.g., "Create an account to save your progress and access the AI Tutor")

**Priority:** Must Have
**Source:** PRD 13.4 FR-ONB-005; D-PROD-005; US-ACCOUNT-007, US-ACCOUNT-009

---

### ACCOUNT-FR-015 — Post-Login Redirect Behavior

After a successful login, the user must be directed to the appropriate page.

- If the user was redirected to the login page because they attempted to access a protected feature, they must be redirected back to that feature after login
- If the user visited the login page directly without a redirect context, they must be taken to the dashboard after login
- New users completing sign-up must be directed to the onboarding question before the dashboard

**Priority:** Must Have
**Source:** US-ACCOUNT-002, US-ACCOUNT-006

---

### ACCOUNT-FR-016 — Basic User Profile

A minimal user profile must exist for each registered user.

- The profile must include the data attributes defined in Section 11 (User Data Requirements)
- The profile must be associated with the Supabase Auth user record via user ID
- The application should be able to read basic profile data (onboarding answer, user ID) for use in the dashboard and learning experience
- No user-visible profile page or profile editing UI is required in MVP

**Priority:** Must Have
**Source:** PRD 13.3 FR-AUTH-003, FR-AUTH-005

---

### ACCOUNT-FR-017 — Authentication Error Handling

Authentication failures must be handled gracefully with clear, helpful messaging.

- Sign-up errors: email already registered, weak password, invalid email format
- Login errors: incorrect credentials (shown as a non-specific message that does not reveal whether the email exists)
- Network or provider errors: a user-friendly error message must be shown; technical details must not be exposed
- Error messages must not block the user from retrying; forms must remain usable after an error

**Priority:** Must Have
**Source:** PRD 14.4 NFR-REL-003, NFR-REL-004

---

## 9. Non-Functional Requirements

### NFR: Security

- Passwords must never be stored, logged, or processed by the application layer; Supabase Auth manages all password handling
- The application must not implement custom authentication logic of any kind
- Session tokens must be stored securely using Supabase Auth's standard session management (typically HTTP-only cookies or secure local storage depending on the Supabase Auth configuration and Next.js integration)
- Authentication checks for protected routes must be performed server-side
- Error messages must not reveal security-sensitive information (e.g., whether an email is already registered)
- No authentication secrets or API keys may be exposed to the client browser

**Source:** PRD 14.6 NFR-SEC-001, NFR-SEC-002; ADR-004

---

### NFR: Privacy

- Only the minimum user data required for the MVP experience must be collected and stored
- Passwords are never stored by the application; they are handled entirely by Supabase Auth
- The onboarding answer is stored to improve the learning experience, not for advertising or external sharing
- No user data may be shared with third parties in the MVP without explicit review
- Users must not be required to provide personal information beyond an email address to use the product

**Source:** PRD 14.7 NFR-PRIV-001; ADR-004

---

### NFR: Accessibility

- Sign-up and login forms must be fully keyboard-navigable
- Form fields must have clear, associated accessible labels
- Error messages must be announced to screen readers and must be associated with the relevant form field
- The onboarding question and its options must be accessible via keyboard and assistive technology
- The logout control must have a clear accessible label

**Source:** PRD 14.10 NFR-ACC-001, NFR-ACC-002, NFR-ACC-003

---

### NFR: Reliability

- Authentication must work reliably for core user flows: sign-up, login, and logout
- If Supabase Auth is unavailable, authentication flows must fail gracefully with a user-friendly error message
- Session state must be consistent between page loads; a user logged in on one page must remain logged in on navigation
- Authentication errors must not prevent the user from retrying; the forms must remain functional after a failure

**Source:** PRD 14.4 NFR-REL-001, NFR-REL-003

---

### NFR: Maintainability

- All authentication logic must go through Supabase Auth; no custom auth code is permitted
- The authentication integration must be implemented in a way that could support future additions (email verification, social login, MFA) without requiring a full re-implementation
- Protected route middleware must be centralized rather than duplicated per-route, so access rules can be updated in one place

**Source:** PRD 14.13 NFR-MAIN-005; ADR-004

---

### NFR: Performance

- Sign-up, login, and logout flows must complete within a reasonable time for a good first-impression experience
- Authentication state must be available to server-side route handlers without adding significant latency to page loads
- Session validation must not block lesson content from loading on public routes

**Source:** PRD 14.3 NFR-PERF-001, NFR-PERF-002

---

## 10. Access Control Rules

This section consolidates the access control rules applicable to the User Account and Onboarding implementation into a single clear reference. These rules must be enforced consistently across all specs.

| Route / Feature | Authentication Required | Notes |
|---|---|---|
| Landing page | No | Publicly accessible |
| Learning Center page (`/learn`) | No | Publicly accessible |
| Learning path page (`/learn/ibm-i-fundamentals`) | No | Publicly accessible |
| Lesson 1 full content | No | Public preview; no login required (D-PROD-005) |
| Published lessons beyond Lesson 1 | Yes | Unauthenticated users see a login/sign-up prompt |
| AI Tutor (`/ai-tutor`) | Yes | Unauthenticated users see a login/sign-up prompt (Spec 001) |
| Dashboard | Yes | Unauthenticated users are redirected to login |
| Progress tracking interactions (Mark Complete) | Yes | Progress records are only created for authenticated users |
| User feedback submission | Yes | Feedback associated with the authenticated user's account |

All access control enforcement must be applied server-side. Client-side protection is insufficient and must not be relied upon as the only gate.

---

## 11. User Data Requirements

This section defines the user data attributes needed for the MVP at the spec level. This is not a database schema. The specific implementation of these attributes will be defined in the implementation plan.

### User Account Attributes

| Attribute | Purpose | Notes |
|---|---|---|
| User ID | Unique stable identifier for the user | Generated by Supabase Auth; primary key for associating progress and profile records |
| Email address | Authentication identity | Stored and managed by Supabase Auth |
| Onboarding response | Which best describes you answer or skip indication | Stored in the application's user profile record; used to recommend a starting point |
| Account created timestamp | When the account was created | Useful for cohort analysis and beta user tracking |
| Last login timestamp | When the user last logged in (if available) | Optional; may be derived from Supabase Auth session metadata |
| Account status | Active or suspended | Active for all MVP users; suspension is a future admin capability |

### Password Handling

Passwords are managed entirely by Supabase Auth. The application code must never:
- Accept a raw password in any form other than forwarding it to the Supabase Auth sign-in or sign-up method
- Store a password, password hash, or password-derived value in the application database
- Log a password or password-related value

### What Is Not Collected

The following user data must not be collected in MVP:

- Full name or display name (unless surfaced automatically by Supabase Auth)
- Phone number
- Address or location
- Company or employer
- Social login token
- Payment or billing information

---

## 12. UX Requirements

The following UX requirements define the expected user experience for the User Account and Onboarding feature. Specific visual design and component choices are to be determined during implementation.

### Sign-Up Screen

- A dedicated sign-up page or modal with fields for email and password
- Clear submission button (e.g., "Create Account")
- A link to the login page for users who already have an account
- Inline validation errors for invalid email, weak password, or email already in use
- A brief statement of what creating an account enables (e.g., "Save your progress and access the AI Tutor")

### Login Screen

- A dedicated login page or modal with fields for email and password
- Clear submission button (e.g., "Log In")
- A link to the sign-up page for users without an account
- A "Forgot password" flow if feasible for MVP (dependent on Supabase Auth email configuration)
- Non-specific error message on incorrect credentials

### Logout Control

- A clearly labeled logout control accessible from the navigation menu or user menu on all authenticated pages
- On logout, the user is taken to the landing page or login page

### Onboarding Question Screen

- Shown once to new users after sign-up and before the dashboard
- The approved question displayed prominently: "Which best describes you?"
- Three selectable options (radio buttons or card-style selections) with the approved text (Section 6)
- A clear submit or continue button
- A visible skip option for users who do not want to answer
- The screen should not feel like a long form; it must be fast and lightweight

### Protected Feature Prompt

- When an unauthenticated user encounters a protected feature, a prompt or overlay must appear
- The prompt must clearly name what is being protected and why login is required
- Call-to-action options: Log In, Create Account
- The prompt must not expose any protected content

### Post-Login Redirect Behavior

- After successful login, the user is taken to the dashboard (or to the protected page they were trying to access before being asked to log in)
- After successful sign-up, the user is taken to the onboarding question, then to the dashboard

### First Lesson Sign-Up CTA

- At the end of Lesson 1 (public preview), unauthenticated users see a prompt to create an account
- The prompt communicates the benefit: saving progress, accessing more lessons, using the AI Tutor
- This CTA is defined in Spec 003 (Lesson Experience) and must be consistent with the sign-up flow defined here

### Error Messages

- All authentication error messages must be clear, non-technical, and actionable
- Errors must not reveal security details (e.g., "There is no account with that email" must not be shown)
- Generic messages are acceptable for login failures: "Incorrect email or password. Please try again."
- Sign-up field errors may be specific: "That email address is already registered."

### Loading State

- Sign-up, login, and logout actions must display a loading indicator while the Supabase Auth request is in progress
- The form must be disabled during the loading state to prevent double submission

---

## 13. Dependencies

The User Account and Onboarding feature depends on the following approved decisions and related specs.

### External Dependencies (Approved)

| Dependency | Decision | Reference |
|---|---|---|
| Authentication | Supabase Auth — managed email/password auth, session management, and password handling | ADR-004 |
| Database | Supabase PostgreSQL — user profile records (onboarding response, timestamps) | ADR-003 |
| Tech stack | Next.js + TypeScript — server-side middleware for protected route enforcement | ADR-001 |

### Spec Dependencies

| Spec | Role |
|---|---|
| Spec 001: AI Tutor | The AI Tutor requires authentication; auth must be in place before AI Tutor is usable |
| Spec 002: Learning Center | The Learning Center access rules (public vs. authenticated) are enforced by this spec |
| Spec 003: Lesson Experience | Lesson access rules (Lesson 1 public, rest protected) depend on the auth implementation here |
| Spec 005: Dashboard | The dashboard is an authenticated feature; this spec provides the auth layer it depends on |
| Spec 006: Progress Tracking | Progress records are user-specific; this spec provides the user identity they depend on |

---

## 14. Acceptance Criteria

The User Account and Onboarding feature is considered implementation-complete and ready for beta when all of the following acceptance criteria are met.

### Sign-Up

- [ ] A new visitor can create an account with an email address and password
- [ ] After successful sign-up, the user is shown the onboarding question before reaching the dashboard
- [ ] An error is shown if the email is already registered
- [ ] An error is shown if the password does not meet the minimum requirements
- [ ] Passwords are never stored, logged, or processed directly by the application code

### Login

- [ ] A registered user can log in with their correct email and password
- [ ] After successful login, the user is directed to the dashboard or the page they were trying to access
- [ ] An error is shown for incorrect credentials; the error is non-specific (does not reveal if the email is registered)
- [ ] A registered user cannot log in with an incorrect password

### Logout

- [ ] An authenticated user can log out from any authenticated page
- [ ] After logout, the user is taken to the landing page or login page
- [ ] After logout, protected routes no longer return content; the user is redirected to login

### Session Persistence

- [ ] An authenticated user who refreshes the page remains logged in
- [ ] An authenticated user who returns within the session window remains logged in without re-authenticating

### Onboarding Question

- [ ] A new user sees the onboarding question exactly once after sign-up
- [ ] All three approved options are displayed with the correct text (Section 6)
- [ ] The user can submit an answer or skip
- [ ] The selected answer or skip state is stored in the user's profile record
- [ ] A returning user who has already answered or skipped does not see the question again

### Access Control

- [ ] Public routes (landing page, Learning Center, Lesson 1) are accessible without authentication
- [ ] The dashboard is not accessible without authentication; unauthenticated access redirects to login
- [ ] The AI Tutor is not accessible without authentication; unauthenticated users see a login/sign-up prompt
- [ ] Lessons beyond Lesson 1 are not accessible without authentication; unauthenticated users see a login/sign-up prompt
- [ ] Authentication access control is enforced server-side; it cannot be bypassed client-side

### Progress Identity

- [ ] A logged-in user who marks a lesson complete has their progress associated with their user account
- [ ] An unauthenticated user's lesson reading is not recorded as progress

### No Custom Auth

- [ ] No custom authentication code (JWT generation, password hashing, session management) is implemented in the application
- [ ] All authentication is handled through the Supabase Auth client or SDK

---

## 15. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Auth configuration complexity — Supabase Auth requires careful setup for Next.js App Router integration | Medium | High | Resolve Supabase Auth + Next.js middleware configuration during implementation planning before any auth-dependent feature is built; treat auth setup as Sprint 1 Day 1 |
| Login friction reducing activation — requiring sign-up before accessing any value reduces user conversion | Medium | High | The first lesson is publicly accessible without sign-up; users experience content quality before being asked to create an account (D-PROD-005) |
| Onboarding friction — the onboarding question feels like a barrier rather than a welcome | Low | Medium | The question must be presented as a single screen; it must be clearly skippable; it must feel fast and purposeful |
| Supabase Auth vendor dependency — Supabase changes, pricing, or service disruption | Low | High | Supabase Auth is well-supported; the implementation should use the Supabase Auth client library in a way that isolates the dependency; future migration to Auth.js or another provider should be feasible without full rewrite |
| Auth-gating mistakes exposing protected content — a misconfigured route allows unauthenticated access | Medium | High | Test every protected route explicitly during QA; enforce auth checks server-side via centralized middleware; include access control tests in acceptance criteria |
| Poor error messages causing user drop-off — generic or confusing errors during sign-up or login | Medium | Medium | Define error messages per scenario in UX requirements; test all error states; use clear, actionable language |
| Email deliverability — if email verification is required, verification emails may not be received | Low | Medium | Confirm email verification configuration before beta launch (OQ-ACCOUNT-002); if verification is required, test delivery before opening beta |

---

## 16. Open Questions

The following questions remain genuinely open and must be resolved before or during implementation planning.

| ID | Question | Owner | Needed Before |
|---|---|---|---|
| OQ-ACCOUNT-001 | What is the exact post-login redirect behavior when a user was viewing a protected lesson list vs. a protected lesson page vs. the AI Tutor before being asked to log in? Should all of these redirect back to the original page, or only some? | Product + Engineering | Implementation planning |
| OQ-ACCOUNT-002 | Is email verification required before a new user can use the product in MVP? If yes, what happens between sign-up and email verification? If no, does verification happen later in the background? | Product | Implementation planning |
| OQ-ACCOUNT-003 | What exact wording should appear in the login/sign-up prompts shown when users try to access the AI Tutor vs. a protected lesson vs. the dashboard? Should each context have unique copy or generic copy? | Product | UX design |
| OQ-ACCOUNT-004 | Should the "Forgot password" reset flow be included in MVP? This depends on Supabase Auth email configuration and may be a quick win or a complexity spike depending on setup. | Engineering | Implementation planning |

---

## 17. SDD Handoff Notes

This specification must be reviewed and approved by the Product Owner before any User Account and Onboarding implementation planning or coding begins.

### Before Implementation Planning Can Begin

- [ ] Product Owner has reviewed this spec and confirmed the MVP scope, onboarding question, and access control rules
- [ ] Engineering has reviewed this spec and confirmed no blocking technical ambiguities
- [ ] OQ-ACCOUNT-002 (email verification requirement) is decided — this affects the sign-up flow design
- [ ] OQ-ACCOUNT-004 (forgot password in MVP) is decided — this affects Supabase Auth email configuration

### Before Coding Can Begin

- [ ] This spec is approved
- [ ] An implementation plan for User Account and Onboarding is created and approved
- [ ] Supabase Auth is configured and working in the development environment
- [ ] Supabase Auth + Next.js App Router middleware integration is confirmed working (session detection in server components and API routes)
- [ ] OQ-ACCOUNT-001 (post-login redirect rules) is decided and reflected in the implementation plan
- [ ] OQ-ACCOUNT-003 (login prompt copy per context) is decided

### Notes for Implementation Planning

- Supabase Auth configuration and Next.js App Router middleware integration should be treated as the first implementation task in Sprint 1. Many other specs depend on auth being in place.
- The centralized protected route middleware should be designed and reviewed before individual protected routes are implemented to ensure consistency.
- The onboarding question screen is lightweight but must be sequenced correctly: after sign-up completion and before the first dashboard visit. The implementation plan should map this flow explicitly.
- Auth error handling (ACCOUNT-FR-017) must be tested against all auth failure scenarios before beta launch; poor error messages are a known drop-off risk.

---

## Revision History

| Date | Version | Summary |
|---|---|---|
| 2026-07-01 | 0.1 | Initial draft — full MVP User Account and Onboarding spec based on PRD v2.9, Sprint 1 Decision Register v0.3, and Specs 001–003 |
