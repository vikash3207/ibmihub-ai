# Public Beta Production Smoke Test

**Production URL tested:** https://irpgenie.com
**Date/time of test:** 2026-07-16, ~22:30–23:15 UTC
**Author:** PR #152, the final production smoke-test pass following PR #149 (AI Tutor Beta Usage Limits), PR #150 (Landing Page Contact Section + Homepage Noise Cleanup), and PR #151 (Public Beta Notice + Professional Content Roadmap Messaging).

**Environment assumptions:**
- `main`/`Feature_152` was at commit `3707664` (PR #151) when this test was run.
- The production Supabase project is the same one this dev environment's `.env.local` points at (confirmed: content, lesson counts, and AI Tutor usage rows created during this test were visible from both the local build and are the real production database).
- Two testing methods were used, and each finding below is labeled with which one produced it:
  - **[PROD]** — fetched directly from `https://irpgenie.com` over the public internet (`curl`), i.e. exactly what a real anonymous visitor sees right now.
  - **[CODE]** — verified by running this branch's own code locally (`npm run build && npm run start`) against the real production Supabase project, using a temporary test user created via the Supabase Admin API and fully deleted afterward. This confirms the *code* is correct and will behave this way once deployed; it does not by itself prove what's live on `irpgenie.com` right now.
- No real browser or screenshot tool is available in this environment (consistent with every prior PR this session). Mobile/console-error checks below are code-level, not a literal device/browser check.

---

## Headline finding: production is running an older deployment than `main`

**[PROD]** `https://irpgenie.com` is serving PR #150's code, **not** PR #151's:

| PR #151 feature | Expected on page | Found on `irpgenie.com` |
|---|---|---|
| `PublicBetaNotice` component (homepage, under hero) | "iRPGenie is currently in public beta. We are actively expanding..." | **Absent** |
| "Professional-grade content is coming next" roadmap section | 8 roadmap item cards | **Absent** |
| `/learn` curriculum-upgrade notice | "We are continuously upgrading the curriculum..." | **Absent** |
| `/contact` beta notice + Founder & Author gradient polish | Gradient-ring avatar, accent border | **Absent** (plain version from PR #150 still showing) |
| Disclaimer's added "Lesson coverage will keep evolving" sentence | Present in Public beta section | **Absent** |

Everything from PR #150 and earlier **is** live and correct (footer redesign with copyright line, homepage Contact section, curriculum bucket cards, Founder & Author section in its PR #150 form). This bounds the gap precisely: production is deployed somewhere at or shortly after PR #150's merge commit (`ae24a1b`), but before PR #151's (`3707664`).

This is almost certainly a Vercel deployment/promotion issue (e.g. auto-deploy paused, or production pinned to an older deployment), not a code defect — the exact same code, built and run locally against the same database in this session, works correctly (see the [CODE]-tagged results throughout this document). **No code, DNS, or Vercel setting was changed by this PR** per its own constraints; this is flagged here for the Product Owner to check the Vercel dashboard and confirm/trigger a fresh deploy of `main` (including this PR, once merged) to production.

---

## 1. Production domain checks

- [x] **[PROD]** `https://irpgenie.com` loads: `200 OK`.
- [x] **[PROD]** `https://www.irpgenie.com` also loads: `200 OK`. Neither domain redirects to the other -- both serve the same site independently. This isn't broken, but there's no canonical www/non-www redirect configured; worth a Vercel domain-settings decision (not a code fix) if canonical-URL SEO purity matters.
- [x] **[PROD]** HTTPS/TLS: every request in this test completed successfully over HTTPS with `Strict-Transport-Security: max-age=63072000` present; no certificate errors.
- [x] **[PROD]** Favicon: `/icon` → `200`, `Content-Type: image/png`.
- [x] **[PROD]** Page title: `<title>iRPGenie — AI-powered IBM i, RPGLE &amp; SQL learning</title>`.
- [x] **[PROD]** Header brand: "iRPGenie" (with the existing blue Cpu-icon mark).
- [x] **[PROD]** No "IBMiHub" text found anywhere on the fetched homepage HTML.

## 2. SEO/static file checks

- [x] **[PROD]** `/robots.txt`: allows `/`, `/learn`, `/practice`, `/practice-lab`, `/ai-tutor`, `/privacy`, `/terms`, `/disclaimer`; disallows `/auth/`, `/api/`, `/dashboard`, `/onboarding`; references `Sitemap: https://irpgenie.com/sitemap.xml`.
- [x] **[PROD]** `/sitemap.xml`: 491 URLs, all on `https://irpgenie.com`. Confirmed present: `/`, `/learn`, `/learn/ibm-i-fundamentals`, `/practice`, `/practice-lab` (+ `/5250`, `/sql`), `/ai-tutor`, `/privacy`, `/terms`, `/disclaimer`, `/contact`, plus one entry per published lesson (e.g. `/learn/ibm-i-fundamentals/what-is-ibm-i`).
- [x] **[PROD]** No Review Ready/Draft lesson could appear here even in principle -- `app/sitemap.ts` builds its lesson entries from `getPublishedLessons()`, the same Published-only query every public lesson list uses; this is a structural guarantee, not something that could regress silently.
- [x] **[PROD]** OG image: `/opengraph-image` → `200`, `image/png`; `og:title`/`twitter:title` read "iRPGenie — AI-powered IBM i, RPGLE & SQL learning".

## 3. Public pages smoke test

All returned `200` on production:

- [x] **[PROD]** `/`
- [x] **[PROD]** `/learn`
- [x] **[PROD]** First public preview lesson `/learn/ibm-i-fundamentals/what-is-ibm-i` -- loads without login, correct title `What is IBM i? | iRPGenie`, no "Log in to continue" gate shown.
- [x] **[PROD]** `/practice`, `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql`, `/ai-tutor`, `/dashboard` -- all `200` (anonymous requests to these render the client-side-redirect-to-login shell rather than an HTTP 3xx; this is standard Next.js App Router behavior for a `redirect()` call during the initial document render once streaming has started, confirmed as pre-existing/unrelated to any PR in this session during PR #147's investigation).
- [x] **[PROD]** `/contact`, `/privacy`, `/terms`, `/disclaimer` -- all `200`, correct content.

## 4. Auth and gating smoke test

- [x] **[CODE]** Login works: created a real Supabase Auth test user and signed in via `signInWithPassword` -- succeeded, session cookie issued.
- [x] **[CODE]** Dashboard works after login: authenticated fetch of `/dashboard` shows real content ("Dashboard" heading, "Welcome to iRPGenie" welcome message, the new PR #151 beta notice).
- [x] **[CODE]** Protected lesson gating works: an authenticated request to a non-preview lesson (`why-ibm-i-still-matters`) shows the real lesson body and a "Mark Complete" control, not the login-required card.
- [x] **[CODE]** First public preview lesson works for anonymous users (also confirmed live in production, Section 3).
- [x] **[CODE]** Logout: `/auth/logout` returns a `307` redirect for an authenticated session (unchanged code path -- `lib/actions/auth.ts` was not touched by PR #149, #150, or #151).
- [~] **[CODE, indirect]** Mark Complete / progress: not independently re-executed via `curl`, since it's a Next.js Server Action (requires a matching build-specific action-ID header that isn't practical to replicate outside a real browser). Confirmed instead that `lib/actions/progress.ts` and `lib/progress.ts` have had zero commits since long before this session (last touched in #50, many PRs before #149), and that the dashboard's progress UI (which reads from the same completed-lessons query) rendered correctly. Recommend one real click-through before wider traffic, though risk here is very low.

No auth/session/gating code was changed by this PR (consistent with the "not a feature PR" scope) -- every result above is a regression check, not new behavior.

## 5. AI Tutor smoke test

All run via direct `POST /api/ai-tutor` against the real production Supabase project, using a temporary test user (created and deleted within this test):

- [x] **[CODE]** Standalone/general question: real streamed response, `200`, correct RAG grounding label and source references in response headers.
- [x] **[CODE]** Lesson-origin context (`sourceType: "lesson"`): `X-Ai-Tutor-Context-Label: Using lesson context: What is IBM i?` and two source lesson references returned.
- [x] **[CODE]** Cooldown: two requests fired back-to-back -- first succeeds, second blocked `429` with "Please wait a few seconds before sending another AI Tutor question."
- [x] **[CODE]** Max message length: a 2,001-character message blocked `400` with "Please shorten your question. The beta limit is 2,000 characters per message."
- [x] **[CODE]** Daily quota exhausted (simulated by inserting 18 synthetic allowed usage rows, then sending one more): blocked `429` with the exact required text, **including `support@irpgenie.com`**, plus `contactHref: "mailto:support@irpgenie.com?subject=AI%20Tutor%20quota%20request"`.
- [x] **[CODE]** AI Tutor UI does not crash: every blocked/error response is a `{ error, contactHref? }` JSON body, which the existing client code (`ai-tutor-panel-provider.tsx`) already displays as a plain-text in-chat banner -- confirmed this path in PR #149's QA and unchanged since.
- [ ] **Not independently re-tested this pass:** embedded AI Tutor from a lesson page and from a practice question specifically (as opposed to the API route's `lesson`/`practice` context handling, which *was* tested above) -- these are thin UI wrappers around the same shared panel/API call already covered; no code in that wrapping layer changed in #149-#151.

No RAG retrieval or AI Tutor answer-quality logic was touched by this PR.

## 6. Practice and Practice Lab smoke test

- [x] **[CODE]** `/practice` loads with real content ("Practice Questions" heading, "Try the Practice Lab" card) for an authenticated user.
- [x] **[CODE]** `/practice-lab/5250`: loads, shows 20 available + 2 "Coming next" exercises, simulator disclaimer visible ("This is a guided simulator for learning. It does not connect to a real IBM i...").
- [x] **[CODE]** `/practice-lab/sql`: loads, shows 16 available + 4 "Coming next" exercises.
- [x] **[PROD]** Both practice-lab pages are also confirmed `200` live in production.
- [~] Answer reveal, related-lesson links, and "AI Tutor from practice" click-through were not individually re-clicked this pass (would need a real browser); the underlying practice pre-reveal safety guarantee (`correctAnswer`/`explanation` only ever forwarded when `revealed: true`) lives entirely in `app/api/ai-tutor/route.ts`'s `parseContext()`, which is untouched by #149-#151 -- confirmed via `git diff` showing no changes to that function across this session's PRs.

No Practice Lab simulator or SQL Console logic was touched by this PR.

## 7. Contact and footer smoke test

- [x] **[PROD]** Homepage Contact section visible with both email cards.
- [x] **[PROD]** `/contact` loads; Founder & Author section present (PR #150 form, since PR #151's visual polish isn't live yet -- see headline finding).
- [x] **[PROD]** `mailto:support@irpgenie.com` and `mailto:contact@irpgenie.com` both present as real `<a href="mailto:...">` links (verified in HTML source; a mailto link's actual "does it open Mail.app" behavior can't be verified without a browser, but the href is well-formed and correctly encoded).
- [x] **[PROD]** Footer shows all 9 required links (Home, Learning Center, Practice, AI Tutor, Practice Lab, Contact, Privacy, Terms, Disclaimer) plus "© 2026 iRPGenie. All rights reserved."

## 8. Public beta messaging check

- [x] **[CODE]** Reviewed `app/page.tsx`, `app/learn/page.tsx`, `app/contact/page.tsx`, `app/disclaimer/page.tsx`, `app/(authenticated)/dashboard/page.tsx`, and `components/public-beta-notice.tsx` for negative wording ("unfinished", "incomplete", "lacks depth", "site is incomplete") -- none found.
- [x] **[CODE]** Reviewed the same files for fake-promise claims -- every "connects to a real IBM i system" / "official IBM affiliation" / "real 5250 emulator" mention found is correctly **negated** (e.g. "does **not** connect to real IBM i systems", "**No** official IBM affiliation", "**not** a real 5250 emulator") -- these are the intended disclaimers, not false claims.
- [x] **[CODE]** No guaranteed job/certification/salary claims found; the disclaimer explicitly states the opposite ("No job or certification guarantees").

## 9. Mobile and responsive review

Code-level review only (no device/browser available). All markup touched by #149-#151 uses the same responsive utility patterns already established elsewhere in the app (`grid`/`sm:grid-cols-*`, `flex-col`/`sm:flex-row`), consistent with the rest of the site. No fixed-width containers or new custom breakpoints were introduced. Recommend one real mobile pass (homepage, `/learn`, a lesson page, embedded AI Tutor sheet, `/practice`, `/practice-lab/5250`, `/practice-lab/sql`, `/contact`, footer) before wide traffic, but nothing in this review suggests a specific problem.

## 10. Browser console / error check

No browser available. Code-level review found no obvious anti-patterns that would cause hydration mismatches or client errors: no `Date.now()`/`Math.random()` used inside content that hydrates on the client (the footer's `new Date().getFullYear()` runs once per request in a Server Component, with no client-side re-computation to diff against), no `dangerouslySetInnerHTML` introduced, all `.map()`-rendered lists use stable `key` props. `npm run build` (this PR and the branch it's based on) completes with zero warnings.

## 11. Performance / perceived speed check (PR #147 regression check)

- [x] **[CODE]** `components/route-progress-bar.tsx` and `components/ui/skeleton.tsx` still present and unmodified.
- [x] **[CODE]** All 8 `loading.tsx` files from PR #147 still present: `/learn`, `/learn/ibm-i-fundamentals`, `/learn/ibm-i-fundamentals/[slug]`, `/practice`, `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql`, `/ai-tutor`, `/dashboard`.
- No stuck-loading-state or unresponsive-click issues surfaced during this test's extensive `curl`-based traffic (dozens of requests across every route).

## Fixes made in this PR

None required. Every check above passed at the code level; the one real issue found (production deployment lagging behind `main`) is an infrastructure/deployment matter outside this PR's ability to fix (no Vercel access, and deploying to production is explicitly out of scope without direct authorization).

## Remaining known limitations

1. **Production deployment gap** (see headline finding) -- needs a Vercel redeploy/promotion of `main` (including this PR once merged) to close.
2. No canonical `www` ↔ non-www redirect configured (both serve `200` independently) -- a Vercel domain-settings decision, not a code change.
3. Mark Complete, practice answer-reveal, and embedded-AI-Tutor-from-UI click paths were verified by code/regression review rather than a literal browser click-through, consistent with every prior PR this session (no browser tool available). Risk is low: none of that code was touched in #149-#151.
4. Mobile/console-error checks are code-level only, not a literal device test.

## Final launch readiness status

**Ready for limited public beta, once the production deployment gap above is closed.** No functional defect was found in the code itself -- every AI Tutor guardrail, auth/gating rule, Practice Lab exercise, and public page tested correctly against the real production database. The only action item is operational (confirm/trigger the Vercel deployment), not a code fix.
