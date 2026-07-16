# Public Beta Readiness Audit + Launch Checklist

**Date:** 2026-07-16
**Author:** Produced as PR #142, following the completed Practice Lab sequence (PR #135–#141) and Lesson Content Visual Polish (PR #140).
**Purpose:** A factual audit of IBMiHub AI's current state against what a real public beta launch needs — SEO, favicon/app identity, legal/trust pages, domain readiness, launch copy, public-safety guarantees, analytics/monitoring, and a smoke test checklist — plus a recommended, small-PR implementation roadmap.

**This PR is audit/planning only.** No SEO changes, no legal pages, no sitemap/robots, no domain changes, no deployment changes, no auth changes. `git status` at the end of this PR shows only this new planning document.

---

## Executive Summary

IBMiHub AI's **product surface is in materially better shape for a beta than its launch infrastructure is.** The core learning experience (288 lessons, practice questions, AI Tutor with RAG, Practice Lab) is built, gated correctly, and already carries honest, beta-appropriate disclaimers in its own copy. What's missing is almost entirely *outside* the app's feature logic: no SEO metadata beyond page titles, no favicon beyond a generated tab icon, no legal/trust pages at all, no sitemap/robots, no analytics, and no production domain. None of this is a product-quality problem — it's a pre-launch checklist that hasn't been started yet, which is exactly the gap this audit exists to document.

**Launch blockers (must fix before any public beta traffic):**
1. No Privacy Policy, Terms of Use, or beta/AI disclaimer pages exist at all — legally and ethically this is the single hardest blocker for public traffic, even informal beta traffic.
2. No `robots.txt`/sitemap — not a hard blocker for a private/soft beta, but a blocker for *public* discoverability launch specifically.
3. No production domain configured — `NEXT_PUBLIC_SITE_URL` still defaults to `http://localhost:3000` in `.env.local.example`; auth redirect callbacks need a real domain before public beta.

**Everything else in this audit is "should fix soon" or "can wait," not a hard blocker** — see Section 1 for the full breakdown.

---

## 1. Product Readiness

| Area | Status | Notes |
|---|---|---|
| `/learn` (Learning Center) | **Ready** | Custom metadata present; lists Published lessons only ([lib/lessons.ts](../lib/lessons.ts) `getPublishedLessons()`). |
| Lesson reader (`/learn/ibm-i-fundamentals/[slug]`) | **Ready** | Per-lesson `generateMetadata`; visually polished (PR #140); protected-lesson gating and first-preview-lesson behavior both correct. |
| `/practice` | **Ready** | Gated correctly; 169 practice questions; "Try the Practice Lab" cross-link added (PR #135). |
| `/practice-lab` | **Ready** | Landing page with clear simulator disclaimer; gated correctly. |
| `/practice-lab/5250` | **Ready for beta, incomplete by design** | 7 of 10 planned exercises are interactive (`command-line-basics`, `wrkobj`, `dspobjd`, `wrksplf`, `wrkoutq`, `wrkactjob`, `dspjob`, `msgw-job`, `dspjob-joblog`, `wrkobjlck` — 10 total now available per PR #138); only `wrklib` remains "planned." This reads as intentional incremental rollout, not broken.
| `/practice-lab/sql` | **Ready for beta, incomplete by design** | 8 of 10 planned exercises available (select-all, select-columns, where-filter, order-by, simple-join, group-by-count, sqlcode-100, invalid-table-column); `update-concept-simulated`/`insert-concept-simulated` remain "planned." |
| Embedded AI Tutor | **Ready** | RAG v2 retrieval, source/related-lesson references, practice pre/post-reveal answer safety all shipped and regression-tested (PR #130–#133). |
| Standalone `/ai-tutor` | **Ready** | Shares the same provider/state as the embedded panel (PR #128/#129); gated correctly. |
| `/dashboard` | **Ready** | Progress bar, next-lesson card, feature cards (including the new Practice Lab card) all present. |
| Login/logout flow | **Ready, needs visual/live verification** | Structurally consistent (`/auth/login?next=...` pattern used identically across all 9 protected pages) — but **no PR in this entire project history has been able to exercise it in a live browser**, since this environment has no test credentials. This is the single most important manual QA gap heading into beta. |
| First public preview lesson | **Ready** | `what-is-ibm-i` (lesson_order 1) is readable without auth; confirmed via `canRead = isPreview || Boolean(user)` in the lesson page. |
| Protected lesson gating | **Ready** | Unchanged and re-verified after every PR in this session via live route-gating checks (307 redirects to `/auth/login?next=...`). |
| Mark Complete / progress | **Ready** | Untouched by any Practice Lab or polish PR; last directly modified under Spec 006. |

**What's blocking public beta specifically (not the product, the launch):** the items in Sections 2–5 below (SEO, favicon polish, legal pages, domain) — none of these are product defects, all are pre-launch checklist items.

**What can wait until after beta:** the remaining "planned" 5250/SQL exercises, full Practice Lab AI Tutor context integration (explicitly deferred through PR #138–#141), any visual redesign beyond PR #140's lesson polish, analytics/monitoring beyond the minimum (Section 8).

---

## 2. SEO Readiness

### Current state (confirmed by direct inspection)

| Item | Status |
|---|---|
| Root metadata (`app/layout.tsx`) | Present: `title: { default: "IBMiHub AI - IBM i Learning and AI Assistance", template: "%s \| IBMiHub AI" }`, `description`. No `metadataBase`, no `openGraph`, no `twitter`, no `keywords`, no `robots`, no `alternates`. |
| Per-page titles/descriptions | Present on 10 of 12 audited routes (`/learn`, `/learn/ibm-i-fundamentals`, lesson pages via `generateMetadata`, `/practice`, `/practice-lab` + both sub-modules + their exercise pages, `/dashboard`, `/ai-tutor`). **Missing** on `/` (the landing page itself — inherits only the generic root default) and all `/auth/*` pages (login, sign-up, forgot-password, reset-password) and `/onboarding`. |
| Open Graph metadata | **Absent everywhere.** No page sets `openGraph.title`/`description`/`images`. A shared link (Slack, LinkedIn, iMessage) today would show no preview card image and a generic title. |
| Twitter/social metadata | **Absent everywhere.** |
| Canonical URL handling | **Absent.** No `alternates.canonical` anywhere, and no `metadataBase` to resolve relative URLs against — this also means any `openGraph`/`twitter` image path added later would need an explicit absolute URL until `metadataBase` is set. |
| `robots.txt` | **Does not exist** — no `app/robots.ts`, no static file (there is no `public/` directory in the repo at all). |
| `sitemap.xml` | **Does not exist** — no `app/sitemap.ts`, no static file. |
| Public indexability | Currently undefined-by-omission — with no robots file, default crawler behavior applies (everything crawlable), which is *accidentally* permissive rather than a deliberate decision. Protected pages redirect to login for an unauthenticated crawler, so they're self-limiting in practice, but this should be an explicit choice, not an accident. |
| Lesson page metadata | **Good** — per-lesson title/description already sourced from real content (Section 1). |
| Landing page copy | **Good, see Section 6** — the gap here is metadata/tags, not the copy itself. |

### Recommended implementation scope (for a follow-up PR, not this one)

- Add `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')` to the root layout's metadata — this one addition makes every other relative-URL metadata field (OG images, canonical) resolve correctly with zero further plumbing.
- Add root-level `openGraph` (site name, default title/description, a single default OG image) and `twitter: { card: 'summary_large_image' }` — inherited by every page unless overridden, exactly like the existing title template.
- Add page-level `metadata` to `/` and the `/auth/*` pages (short, low-effort — these are static titles, not dynamic like lesson pages).
- Add `app/robots.ts` (a Next.js Route Handler, not a static file — there's no `public/` dir to add one to, and the dynamic route is the more idiomatic Next 16 approach anyway). Recommend allowing `/`, `/learn/*`; disallowing `/auth/*`, `/api/*`, `/dashboard`, `/practice*`, `/ai-tutor`, `/onboarding` (all auth-gated anyway, but explicit is better than implicit for a crawler).
- Add `app/sitemap.ts` — dynamically enumerate Published lessons via `getPublishedLessons()` (the same function every other public-facing list already uses) plus the static public routes (`/`, `/learn`, `/learn/ibm-i-fundamentals`). This guarantees the sitemap can never leak a Review Ready/Draft lesson, since it reuses the existing Published-only guarantee rather than a new query.
- Canonical domain handling: once `metadataBase` and a real domain exist, add `alternates.canonical` per page (or rely on `metadataBase` + relative paths, which Next.js resolves automatically for most cases).

---

## 3. Favicon / App Identity

### Current state

| Item | Status |
|---|---|
| Favicon | `app/icon.tsx` exists — a **dynamically generated** 32×32 PNG via Next's built-in `next/og` `ImageResponse` (no external image asset, no new dependency): a rounded blue square (`#2563eb`) with a white "i" bar and a cyan (`#22d3ee`) accent dot, deliberately echoing the `SiteHeader`/`AuthCard` brand mark. |
| App icon (larger sizes, e.g. 192×192/512×512 for home-screen/PWA use) | **Absent.** |
| `apple-touch-icon` | **Absent** — no `app/apple-icon.tsx` or static equivalent. |
| Manifest (`manifest.json`/`manifest.ts`) | **Absent.** |
| Browser tab title | Correct — uses the root layout's title template. |
| Brand consistency | Good, as far as it goes — the one icon that exists is deliberately on-brand, not a generic default. |

### Recommendation

- **Simplest, lowest-risk approach: extend the existing `app/icon.tsx` pattern rather than introducing new image assets.** Add `app/apple-icon.tsx` using the identical `ImageResponse` approach at 180×180 (Apple's standard size) — this reuses code that already works and needs no new dependency, no design tool, and no asset pipeline.
- Add a minimal `app/manifest.ts` (Next.js supports this as a typed route handler, same pattern as `robots.ts`/`sitemap.ts`) with `name`, `short_name`, `theme_color` (matching the icon's `#2563eb`), and `background_color` — enables "Add to Home Screen" correctly on mobile without committing to full PWA/offline behavior.
- **Do not generate a new branded icon from scratch for beta** — the existing generated icon is already deliberately on-brand and consistent; reusing its exact colors/shape for the larger sizes keeps everything visually identical, just larger, with zero new design decisions needed before beta.

---

## 4. Legal / Trust Pages

### Current state

**None of `/privacy`, `/terms`, `/disclaimer`, `/contact`, or `/support` exist** — confirmed by an exhaustive filename search across the entire `app/` tree. There is no footer link to any of these either (Section 6) — the current footer has exactly one link, to `/learn`.

### This is the single most important gap in this audit.

Even an informal public beta involves collecting real user accounts (Supabase Auth), showing AI-generated content, and implicitly asking users to trust the platform with their learning time. Shipping without at least a Privacy Policy and a beta/AI disclaimer is the one item in this whole audit I'd genuinely call a hard blocker rather than "should fix soon."

### Recommended MVP copy requirements (plain-language beta policy, NOT formal legal advice)

**Explicit disclaimer for this section:** everything below is plain-language placeholder policy copy meant to unblock a *beta*, not a substitute for actual legal review. Mark every page visibly as "Beta — [Month Year]" and flag internally that a lawyer (or at minimum, legal-templating service like Termly/iubenda) should review before a full public (non-beta) launch or before handling EU/CCPA-regulated data at scale.

- **Privacy Policy** — must cover, at minimum: what's collected (email, auth session, lesson progress, AI Tutor conversation content sent to Anthropic's API), why (account/progress/answering questions), who it's shared with (Supabase as the data processor, Anthropic as the AI Tutor's model provider — name both explicitly since PII/content flows through both), retention (current: essentially indefinite, since there's no deletion flow — this itself may need a decision, see Section 10 PO questions), and how to request account deletion (even if the current answer is "email us," that must be stated somewhere).
- **Terms of Use** — must cover: this is a beta, features may change or be removed without notice, no warranty of availability/accuracy, acceptable use (no abuse of the AI Tutor, no attempting to extract system prompts/attack the model, no scraping), and a liability limitation appropriate for a free educational beta product.
- **AI Disclaimer** — the landing page **already has strong disclaimer copy** in its amber "A note on AI guidance" callout ("AI Tutor responses may be incorrect and should be validated before production use. Do not paste private source code, sensitive job logs, credentials, or customer data. IBMiHub AI does not connect to real IBM i systems at this time.") — this exact language should become the seed for a dedicated, always-linked AI disclaimer page, not just a homepage callout a visitor might not scroll to.
- **Educational disclaimer** — explicit statement that IBMiHub AI is an educational tool, not a certification body, not a guarantee of job placement or career outcomes, and that IBM i skills should be validated against official IBM documentation before production use (this language already exists almost verbatim in the AI Tutor's own system prompt — reuse it).
- **Beta disclaimer** — explicit "this product is in public beta; expect bugs, incomplete features (see the Practice Lab's own 'planned' exercises), and possible data resets during this period" framing, set expectations rather than overpromise.
- **No guarantee of job/certification outcomes** — fold into the Educational Disclaimer above rather than a separate page.
- **No real IBM i system connection in Practice Lab** — this guarantee is *already stated in-product* (every Practice Lab page shows a "This is a guided simulator... does not connect to a real IBM i system" notice, per PR #135–#141) — the legal/trust page should restate it for anyone reading policy pages directly without having used the product yet.
- **AI Tutor may make mistakes** — already covered by the AI Disclaimer above; this is not a separate document.
- **Users should not enter secrets/private production data** — already stated in the landing page's AI disclosure callout; restate in the Privacy Policy's "what not to submit" section too.
- **Contact/support** — at minimum a `mailto:` link or a simple contact form; doesn't need to be a full support ticketing system for beta.

---

## 5. Domain Readiness

### Current state

- `lib/config.ts` has **no site URL constant** at all — only `SITE_NAME` and the CTA/path-name constants.
- `.env.local.example` documents `NEXT_PUBLIC_SITE_URL` (comment: "Full URL of this deployment (used in auth callback redirects)"), defaulting to `http://localhost:3000` — meaning **there is no production domain configured today**, only whatever the current Vercel preview/production URL happens to be.
- `next.config.mjs` has no domain-related configuration (no redirects, no `images.remotePatterns`) — nothing here would need to change for a domain move, which is good news for how contained this change will be.

### Checklist for moving to a `.com` domain (documentation only — not implemented in this PR)

1. **Recommended domain style:** short, matches `SITE_NAME` closely (e.g. a domain reading naturally as "IBMiHub AI") — apex domain (no `www.`) is increasingly the modern default and matches this product's casual/modern brand tone better than a `www.`-prefixed enterprise style, but either is fine; the important thing is picking one and redirecting the other to it (see step 6).
2. **Vercel custom domain steps:** Vercel Project → Settings → Domains → Add Domain → follow Vercel's provided DNS instructions (either an `A`/`ALIAS` record to Vercel's IP for an apex domain, or a `CNAME` for a subdomain). Vercel automatically provisions and renews HTTPS/SSL via Let's Encrypt once DNS is verified — no manual certificate work needed.
3. **DNS considerations:** if the domain is bought through a registrar other than Vercel, DNS records must be added at that registrar (or the domain's nameservers pointed at Vercel's, if using Vercel as the DNS host) — this is a registrar-side task, not a code change.
4. **HTTPS/SSL:** automatic via Vercel once DNS resolves correctly; no action needed in this codebase.
5. **www vs apex:** pick one as canonical (Section 5.1 recommends apex) and let Vercel's domain settings redirect the other automatically (Vercel supports this natively in the same Domains UI — no code-level redirect needed).
6. **Canonical domain choice:** whichever is chosen, it becomes the value of `NEXT_PUBLIC_SITE_URL` in the production Vercel environment variables (not `.env.local`, which is never deployed) — this is the one variable this whole domain move actually touches in application terms.
7. **Redirect behavior:** confirm old preview/staging URLs (e.g. `*.vercel.app`) either keep working (fine for internal use) or are documented as "do not share externally" once the real domain is live — no code change needed either way, just a team communication item.
8. **Environment variables check:** `NEXT_PUBLIC_SITE_URL` must be updated in Vercel's production environment (and any preview environments that should match); `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY`/`ANTHROPIC_API_KEY` are unaffected by a domain change.
9. **Supabase allowed redirect URLs:** Supabase Auth requires the production domain to be added to the project's Authentication → URL Configuration → Redirect URLs allowlist (and Site URL setting) — **this is a required step, not optional**, or auth callback redirects (`/auth/callback`) will fail against the new domain even though the code itself needs no change.
10. **OAuth/auth provider callback implications:** this project's `docs/adr/ADR-004-authentication-approach.md` (per earlier session context) uses Supabase Auth — if email/password is the only method today, there's no third-party OAuth callback URL to update elsewhere; if a social login provider is ever added, that provider's own developer-console redirect URL allowlist would need the new domain too. **Confirm with Product Owner whether any OAuth provider is planned before or shortly after beta**, since that changes this step from "not applicable" to "required."

**No domain configuration is changed by this PR** — this section is purely a checklist for whenever that decision is made.

---

## 6. Launch Copy Readiness

### Current state — better than expected

The landing page (`app/page.tsx`) already has substantially complete, on-brand launch copy:

| Element | Current copy | Assessment |
|---|---|---|
| Hero | "The AI-powered learning platform for IBM i professionals." + supporting paragraph | Clear, specific, not generic. **Ready.** |
| Value proposition | "Learn IBM i fundamentals, understand RPGLE, CLLE, DB2 for i, DDS, and job logs, and get guided help from an AI tutor built for the IBM i ecosystem." | Concrete, names real topics. **Ready.** |
| Who this is for | Dedicated "Why IBMiHub AI?" section with "IBM i Beginners" and "Working IBM i Developers" cards | **Ready.** |
| What learners can do | "Platform Features" section (Structured Curriculum, AI Tutor, Progress Tracking, Career-Ready IBM i Skills) | **Ready**, though "Career-Ready IBM i Skills" should be worded carefully alongside the Educational Disclaimer (Section 4) to avoid implying a guarantee. |
| AI Tutor positioning | "Ask IBM i questions, get IBM i-specific answers... not a generic programming assistant" + the amber AI-guidance disclosure box | **Ready, and already honest** — this is exactly the tone a beta needs. |
| Practice Lab positioning | **Not yet on the landing page at all** — the landing page predates the Practice Lab work (PR #134–#141) and has not been updated to mention it. | **Gap** — the single most concrete "should fix before beta" item in this section, since Practice Lab is a real, shipped differentiator not yet reflected in launch copy. |
| Beta expectations | **Not stated anywhere on the landing page today** — no "Beta" badge, no expectations-setting copy. | **Gap** — ties directly to the Beta Disclaimer in Section 4; recommend a small "Beta" badge near the hero eyebrow, not a big scary banner. |
| CTA buttons | "Start Learning Free" (primary, → sign-up), "Preview the first lesson →" (secondary, → first lesson) | Clear, low-friction, honest ("no credit card required"). **Ready.** |
| Footer copy | Minimal: site name + one-line tagline + a single "Learning Center" link. **No legal links, no copyright/year, no contact link, no social links.** | **Gap**, directly blocked on Section 4's legal pages existing first — the footer is the natural home for those links once they exist. |

### Recommendation

Launch copy needs two additions, not a rewrite: (1) a Practice Lab mention/section (the product has grown since this copy was written and the copy hasn't caught up), and (2) a visible but low-key "Beta" indicator plus a footer that links to the new legal pages once they exist. **Do not implement in this PR** — this is exactly PR C in the roadmap (Section 10).

---

## 7. Public Beta Safety

| Guarantee | Status | Evidence |
|---|---|---|
| Review Ready/Draft lessons are not public | **Confirmed intact** | `getPublishedLessons()`/`getPublishedLessonBySlug()`/`getPublishedLessonBySlugOrNull()` all still filter `.eq('status', 'Published')` ([lib/lessons.ts](../lib/lessons.ts)); no public-facing query bypasses this filter anywhere in the codebase (verified by direct search, not just spot-check). |
| Protected routes are gated | **Confirmed intact** | All 9 pages under `app/(authenticated)/` (including all Practice Lab pages) call `supabase.auth.getUser()` and `redirect()` — zero exceptions found. |
| AI Tutor does not expose unpublished content | **Confirmed intact** | RAG v2's `retrieveCourseContext()` only ever reads `getPublishedLessons()` (PR #131, re-verified by PR #133's regression suite) — structurally cannot surface Review Ready/Draft content, by construction rather than by convention. |
| Practice Lab clearly states it is simulated | **Confirmed** | Every Practice Lab page renders `SimulatorNotice` ("This is a guided simulator... does not connect to a real IBM i system"), with an extra troubleshooting-specific note on the MSGW/job-log/object-lock exercises. |
| SQL Console clearly states sample data only | **Confirmed** | `SqlConsole` renders the same notice with an SQL-specific extra sentence ("...does not connect to a real IBM i or Db2 system"). |
| No real IBM i credentials/configuration | **Confirmed** | No credential field, connection string, or IBM i/Db2 connection code exists anywhere in the Practice Lab implementation (PR #135–#141) — this was an explicit constraint enforced across every one of those PRs. |
| No fake certification/job placement claims | **Confirmed, with one wording note** | Landing page copy does not claim certification or guaranteed job outcomes today. The "Career-Ready IBM i Skills" feature label (Section 6) should be reviewed alongside the Educational Disclaimer wording to make sure it reads as "skills that support a career" rather than "guarantees a career," but no actual overclaiming exists in the current text. |
| No production system execution claims | **Confirmed** | Both the AI Tutor's system prompt and every Practice Lab page explicitly state the opposite (cannot connect to/execute against a real system). |

**Overall: this is the strongest section of the audit.** Every safety guarantee a public beta needs at the product level is already true today, largely because it was built in from the start across the RAG and Practice Lab PR sequences rather than needing to be retrofitted now.

---

## 8. Analytics / Monitoring Readiness

### Current state

No analytics or error-tracking package exists in `package.json` — confirmed by dependency list inspection and a repo-wide grep for `@vercel/analytics`, `@vercel/speed-insights`, `posthog`, Google Analytics, and `Sentry` (zero matches for all of them). Whatever monitoring exists today is purely Vercel's own platform-level request/build logging, outside this codebase.

One relevant thing **already exists**: the AI Tutor API route already has friendly fallback error copy for both rate-limiting ("AI Tutor is busy right now. Please try again in a moment.", 429) and provider failures ("AI Tutor is temporarily unavailable. Please try again.", 502) — so "AI Tutor error fallback copy" from the audit's own checklist is already done, not a gap.

### Recommendation for beta (optional, not a blocker)

- **Vercel Analytics** (`@vercel/analytics`) and **Vercel Speed Insights** (`@vercel/speed-insights`) are the lowest-risk options if the project is already on Vercel — first-party, no cookie-consent-banner implications for basic page-view analytics, minimal bundle impact, and literally a `<Analytics />` component drop-in. Recommend these over a third-party tool (PostHog, GA) for a beta specifically because they need zero additional privacy-policy complexity beyond what Section 4 already covers.
- **Error logging:** nothing beyond Vercel's own function logs exists today. For beta scale, this is probably *acceptable to start with*, but recommend Sentry (or a similarly lightweight alternative) as a fast-follow once real user traffic starts, specifically to catch AI Tutor/Practice Lab client-side errors that wouldn't show up in server logs.
- **Contact/support feedback route:** ties directly to Section 4's Contact page — even a simple `mailto:` is enough for beta; a formal feedback widget is not required.
- **Simple user feedback mechanism:** the AI Tutor already has a per-response Helpful/Not Helpful control (Spec 007, Feedback Collection) — this already covers "AI response quality feedback." A general "give us feedback" mechanism (not AI-response-specific) does not exist yet and would be a reasonable, small beta addition, but not a blocker.

**Do not add any analytics dependency in this PR** — this section is a recommendation for a later PR, consistent with the explicit constraint.

---

## 9. Public Beta Smoke Test Checklist

To be run manually, in a real browser, with real test credentials, before beta traffic begins (this environment could not execute this checklist itself — see Manual QA section below for what *was* verifiable here).

**Anonymous user**
- [ ] `/` loads, hero/CTA/features/AI disclosure/footer all render correctly
- [ ] First public preview lesson (`what-is-ibm-i`) loads and is fully readable without logging in
- [ ] Any other lesson redirects to `/auth/login?next=...` 
- [ ] `/practice`, `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql`, `/ai-tutor`, `/dashboard` all redirect to login with the correct `next=` param
- [ ] `/auth/login` and `/auth/sign-up` render correctly

**Registration / login / logout**
- [ ] Sign up with a new email succeeds and lands on the expected post-signup page (onboarding or dashboard)
- [ ] Log in with existing credentials succeeds and honors the `?next=` redirect target
- [ ] Log out actually clears the session (protected pages redirect to login again afterward)
- [ ] Onboarding flow (if shown) completes and doesn't block subsequent access

**Logged-in user — core learning**
- [ ] `/learn` shows the full Learning Center; lesson count matches Published count
- [ ] A protected (non-preview) lesson loads once logged in
- [ ] Mark Complete works and persists across a refresh
- [ ] Next/previous lesson navigation works; the visually-polished header/nav (PR #140) renders correctly
- [ ] Progress bar on `/dashboard` reflects actual completed-lesson count

**Practice questions**
- [ ] `/practice` loads questions by topic; answering/revealing works
- [ ] Related-lesson links from a practice question resolve to real, Published lessons

**AI Tutor**
- [ ] Embedded panel opens from a lesson page, is grounded in that lesson, and shows source/related-lesson references for a relevant question
- [ ] Standalone `/ai-tutor` works independently and shares conversation state with the embedded panel per FR-023/FR-024
- [ ] A weak-coverage question (e.g. something outside the course) does not fabricate a confident "Sources used" list
- [ ] Practice-question AI Tutor context correctly withholds the answer pre-reveal and allows it post-reveal

**Practice Lab**
- [ ] `/practice-lab` shows both module cards; available vs. "Coming next" exercises are visually distinct
- [ ] At least one 5250 exercise (e.g. WRKOBJ) runs end-to-end: type command → success screen → hint → reset
- [ ] At least one SQL exercise (e.g. SELECT all rows) runs end-to-end, including a deliberately wrong query producing a friendly error
- [ ] The MSGW/job-log/object-lock troubleshooting flow reads coherently as one connected investigation
- [ ] A destructive/action command (ENDJOB, INSERT, etc.) is correctly refused with the safety-focused message, in both 5250 and SQL

**Mobile**
- [ ] Lesson reading pane, Practice Lab exercise workspace, and SQL console all remain usable on a narrow viewport (no unwanted horizontal scroll except code blocks/tables/terminal, per PR #140/#136)
- [ ] AI Tutor opens as a full-screen sheet on mobile, not a squeezed split layout

**SEO / discoverability (once Section 2's follow-up PR ships)**
- [ ] `robots.txt` is reachable and returns the expected allow/disallow rules
- [ ] `sitemap.xml` is reachable and lists exactly the Published lesson URLs plus static public pages
- [ ] A shared link (e.g. pasted into Slack/iMessage/LinkedIn) shows a real title, description, and OG image, not a blank/generic preview
- [ ] View-source on `/` and a lesson page shows the expected `<title>`/`<meta description>` tags

**Legal pages (once Section 4's follow-up PR ships)**
- [ ] `/privacy`, `/terms`, and the AI/beta disclaimer page all load and are linked from the footer
- [ ] Footer appears consistently across at least the landing page and one authenticated page

**Domain (once Section 5's checklist is executed)**
- [ ] Production domain resolves over HTTPS with a valid certificate
- [ ] `www` (or apex, whichever isn't canonical) redirects to the canonical form
- [ ] Login/sign-up/auth callback works against the real domain, not just `*.vercel.app`

---

## 10. Recommended Implementation PR Roadmap

Small, reviewable PRs, in dependency order (legal pages before footer links to them; domain before final auth-callback verification):

| PR | Scope |
|---|---|
| **PR A — SEO + favicon + sitemap + robots + OG image** | `metadataBase`, root `openGraph`/`twitter` defaults, metadata for `/` and `/auth/*`, `app/robots.ts`, `app/sitemap.ts` (Published-lessons-driven), `app/apple-icon.tsx` (reusing the existing generated-icon approach), `app/manifest.ts`. No new dependency. |
| **PR B — Privacy + Terms + Beta Disclaimer + footer links** | New `/privacy`, `/terms`, and a combined AI/beta/educational disclaimer page (plain-language beta copy per Section 4, explicitly marked as pending legal review), plus a proper footer component (replacing the current inline `app/page.tsx` footer) linking all three plus a contact `mailto:`. |
| **PR C — Launch copy polish + public landing page polish** | Add a Practice Lab section to the landing page, add a small "Beta" indicator near the hero, review the "Career-Ready IBM i Skills" wording against the Educational Disclaimer. No structural redesign — additive copy/sections only, per this audit's own "do not redesign" guidance. |
| **PR D — Final smoke test + deployment checklist** | Execute Section 9's full checklist in a real browser against a real (or production-mirroring staging) deployment with real test credentials; execute Section 5's domain checklist; add Vercel Analytics/Speed Insights per Section 8 if approved. This is the PR where the domain/deployment/analytics decisions from this audit actually get executed, once approved. |

Each PR should stay scoped to its own concern, matching this project's established one-PR-per-slice discipline (the RAG v2 and Practice Lab sequences both did this well).

---

## Validation Results

This PR is documentation-only. The following was run to confirm nothing else changed:

- `npm run seed` — 288 succeeded, 0 failed (unchanged)
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean, route list unchanged

## Manual QA

- `git status` shows only `planning/PUBLIC_BETA_READINESS_AUDIT.md` added
- `/learn` loads correctly, still shows 288 lessons published
- `/practice` still loads (gated, unchanged)
- `/practice-lab` still loads (gated, unchanged)
- `/ai-tutor` still opens/gates as before (unchanged)
- `/dashboard` still loads (gated, unchanged)
- Protected lesson gating unchanged (no code touched)
- First public preview lesson (`what-is-ibm-i`) still loads without authentication
- No lesson URLs changed (no code touched)

**Note on this audit's own limits:** every finding above about the *existing* product (Sections 1 and 7 especially) is well-grounded — that code has been built, read, and route-tested across this entire session. But like every prior PR in this project, this environment has no live browser or test login credentials, so Section 9's smoke test checklist is a checklist to be *executed by someone with real access*, not something this audit could run itself. That gap is the audit's own most important limitation, and it's the same gap flagged in every PR before this one.

---

## Product Owner Decisions Needed

1. **Domain name and style** (apex vs. `www`) — Section 5 needs an actual name to execute against.
2. **Account/data deletion policy** — the Privacy Policy (Section 4) needs a real answer for "how does a user delete their account/data," even if the beta answer is manual/email-based.
3. **OAuth provider plans** — does beta launch with email/password only, or is a social login provider planned soon after? Changes Section 5's Supabase redirect-URL checklist from "not applicable" to "required."
4. **Legal review budget/timeline** — is a lawyer or legal-templating service (Termly/iubenda-style) available before or shortly after beta, or does beta ship with the plain-language placeholder copy from Section 4 alone for now?
5. **Analytics choice** — approve Vercel Analytics/Speed Insights for beta (Section 8), or hold off entirely until post-beta?
6. **"Career-Ready IBM i Skills" wording** — keep as-is, or adjust alongside the Educational Disclaimer to preempt any "guarantees a career" misreading?
7. **Practice Lab landing-page visibility** — should the landing page mention Practice Lab before or only after the remaining "planned" exercises (5250's `wrklib`, SQL's simulated INSERT/UPDATE) ship?
