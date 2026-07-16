# Public Beta Final Smoke Test

**Date:** 2026-07-16
**Author:** Produced as PR #145, the final launch-readiness pass following PR #142 (audit), PR #143 (SEO essentials), and PR #144 (legal/trust pages).
**Purpose:** A detailed, section-by-section public beta smoke test checklist, executed as far as this environment allows (route-level/HTTP/HTML-output verification against a live dev server), with every item that genuinely requires a real browser, real test credentials, or a live production domain explicitly marked as such rather than assumed passing.

**How to read this document:** each checklist item is one of:
- **[x] Verified** — actually executed in this session (via `curl`/HTML inspection against a running dev server, or direct code/config review) and confirmed correct.
- **[ ] Needs live browser + real account** — this environment has no test credentials and no browser/screenshot tool (a constraint present in every PR this session), so this item needs a human with real login access before beta traffic begins.
- **[ ] Needs live production domain** — depends on the domain-move steps in Section G, not yet performed.

---

## A. Anonymous User Smoke Test

- [x] **Verified** — Home page (`/`) loads: `200`.
- [x] **Verified** — Metadata appears: `<title>AI-Powered IBM i Learning Platform</title>`, description, keywords, Open Graph, and Twitter (`summary_large_image`) tags all present in page source.
- [x] **Verified** — Favicon appears: `<link rel="icon" href="/icon..." type="image/png" sizes="32x32">` present; `/icon` route returns `200 image/png`.
- [x] **Verified** — OG image available: `/opengraph-image` returns `200 image/png`; referenced correctly in `og:image`/`twitter:image` tags.
- [x] **Verified** — `/learn` loads: `200`.
- [x] **Verified** — First public preview lesson (`/learn/ibm-i-fundamentals/what-is-ibm-i`) loads: `200`, no login required.
- [x] **Verified** — Protected (non-preview) lessons still require login (unchanged code path; re-verified via `/learn`'s gating logic, not modified this PR).
- [x] **Verified** — `/practice` gates: `307` → `/auth/login?next=%2Fpractice`.
- [x] **Verified** — `/practice-lab` (and `/practice-lab/5250`, `/practice-lab/sql`, plus example exercise routes `/practice-lab/5250/wrkobj`, `/practice-lab/sql/simple-join`) all gate: `307` → the correct `next=` login redirect.
- [x] **Verified** — `/ai-tutor` gates: `307` → `/auth/login?next=%2Fai-tutor`.
- [x] **Verified** — Legal pages load: `/privacy`, `/terms`, `/disclaimer` all `200`.
- [x] **Verified** — Footer links work: inspected rendered HTML, `href="/learn"`, `/practice-lab`, `/privacy`, `/terms`, `/disclaimer` all present and pointing at the right routes.

## B. Logged-In User Smoke Test

- [ ] **Needs live browser + real account** — Login works.
- [ ] **Needs live browser + real account** — Dashboard loads.
- [ ] **Needs live browser + real account** — `/learn` loads (authenticated view).
- [ ] **Needs live browser + real account** — Lesson reader loads for a protected lesson.
- [ ] **Needs live browser + real account** — Mark Complete works.
- [ ] **Needs live browser + real account** — Progress updates on `/dashboard`.
- [ ] **Needs live browser + real account** — Practice questions work (answer/reveal).
- [ ] **Needs live browser + real account** — Embedded AI Tutor opens from a lesson page.
- [ ] **Needs live browser + real account** — Embedded AI Tutor opens from `/practice`.
- [ ] **Needs live browser + real account** — AI Tutor source references display for a relevant question.
- [ ] **Needs live browser + real account** — `/practice-lab` loads (authenticated view).
- [ ] **Needs live browser + real account** — 5250 exercises work end-to-end (type command → result → hint → reset).
- [ ] **Needs live browser + real account** — SQL Console exercises work end-to-end.
- [ ] **Needs live browser + real account** — Logout works and re-gates protected pages.

**Note:** every item in this section requires an authenticated session. This environment has never had test credentials at any point in this project's history — every prior PR's report disclosed the same limitation. Route-level gating (redirect-to-login behavior) *is* verified in Section A; the actual logged-in experience needs a human pass before beta traffic.

## C. AI Tutor Smoke Test

- [x] **Verified** — Standalone `/ai-tutor` gates correctly when logged out (Section A); route unchanged by this PR.
- [ ] **Needs live browser + real account** — Standalone `/ai-tutor` works end-to-end.
- [ ] **Needs live browser + real account** — Embedded panel opens, close button works, panel doesn't overlap content.
- [ ] **Needs live browser + real account** — Mobile full-screen sheet works.
- [ ] **Needs live browser + real account** — Lesson context grounding works.
- [ ] **Needs live browser + real account** — Practice pre-reveal answer safety and post-reveal explanation behavior.
- [ ] **Needs live browser + real account** — RAG/source references display correctly.
- [ ] **Needs live browser + real account** — Weak-coverage questions (e.g. "What is PowerHA?") are handled honestly, without a fabricated source list.

**Note:** the underlying logic for every item above was already built and regression-tested across PR #128–#133 (the embedded panel, RAG v2, and source-reference work), including a standalone script-based regression suite (PR #133, 34/34 checks passed) for the retrieval engine itself. This section is about confirming the *already-shipped* behavior still works after PR #140–#145's polish/copy changes touched nothing in the AI Tutor code path — worth a final human pass, not a rebuild.

## D. Practice Lab Smoke Test

- [x] **Verified** — All ten 5250 exercises' routes exist and gate correctly: `command-line-basics`, `wrkobj`, `dspobjd`, `wrksplf`, `wrkoutq`, `wrkactjob`, `dspjob`, `msgw-job`, `dspjob-joblog`, `wrkobjlck` (`wrklib` remains intentionally "planned").
- [x] **Verified** — All eight available SQL exercises' routes exist and gate correctly: `select-all`, `select-columns`, `where-filter`, `order-by`, `simple-join`, `group-by-count`, `sqlcode-100`, `invalid-table-column` (`update-concept-simulated`/`insert-concept-simulated` remain "planned").
- [x] **Verified** — Command/SQL validation logic itself: re-confirmed via each Practice Lab PR's own standalone verification scripts run against the real modules (17/17, 28/28, 31/31, 26/26, and 30/30 checks respectively across PR #136/#137/#138/#139/#141) — not re-run in this PR since no simulator logic changed, but the record exists and this PR touched none of those files.
- [ ] **Needs live browser + real account** — Each exercise actually typed/run in a browser end-to-end.
- [x] **Verified** — No real IBM i/Db2 connection exists: confirmed by code review across every Practice Lab file (no credential fields, no connection strings, no IBM i/Db2 client code anywhere in `lib/practice-lab/*` or `components/practice-lab/*`).
- [x] **Verified** — Simulator disclaimers visible: `SimulatorNotice` renders on every Practice Lab page (confirmed present in `components/practice-lab/simulator-notice.tsx`, unchanged by this PR), plus the new landing-page feature cards and `/disclaimer` page reinforce the same message.

## E. SEO/Domain Smoke Test

- [x] **Verified** — `sitemap.xml` renders: `200`, well-formed XML.
- [x] **Verified** — `robots.txt` renders: `200`, correct allow/disallow rules, references the sitemap.
- [x] **Verified** — Sitemap includes intended public URLs only: exactly **299** entries (8 static pages + 288 Published lessons + 3 legal pages), confirmed by count; zero entries for `/dashboard`, `/auth/*`, `/api/*`, or `/onboarding`.
- [x] **Verified** — Review Ready/Draft lessons are excluded: the sitemap's lesson URLs come from `getPublishedLessons()`, the same Published-only query every other public-facing lesson list uses — structurally guaranteed, not just checked once.
- [x] **Verified** — Canonical site URL uses site config: every page's `alternates.canonical` and the sitemap/robots URLs all resolve through `SITE_URL` in `lib/config.ts`, with zero hardcoded domains anywhere else in the codebase (re-confirmed via a repo-wide search this PR).
- [x] **Verified** — `NEXT_PUBLIC_SITE_URL` documented: present in `.env.local.example` with an explanatory comment.
- [x] **Verified** — OG image renders: `/opengraph-image` returns `200 image/png`, correctly referenced in meta tags.
- [x] **Verified** — Legal pages metadata exists: `/privacy`, `/terms`, `/disclaimer` each have their own title/description/canonical.

## F. Mobile Smoke Test

- [ ] **Needs live browser** — Home page at a narrow viewport.
- [ ] **Needs live browser** — `/learn` at a narrow viewport.
- [ ] **Needs live browser** — Lesson reader at a narrow viewport (PR #140's polish pass).
- [ ] **Needs live browser** — AI Tutor full-screen sheet at a narrow viewport.
- [ ] **Needs live browser** — `/practice` at a narrow viewport.
- [ ] **Needs live browser** — `/practice-lab` at a narrow viewport.
- [ ] **Needs live browser** — 5250 simulator workspace at a narrow viewport (terminal horizontal scroll, command input usability).
- [ ] **Needs live browser** — SQL Console at a narrow viewport (result grid horizontal scroll).
- [ ] **Needs live browser** — Legal pages at a narrow viewport.

**Note:** every page above was built with explicit mobile-responsive Tailwind classes and reviewed for mobile behavior at build time in its own PR (PR #129 for the AI Tutor sheet, PR #136 for the 5250 terminal's `overflow-x-auto`, PR #139 for the SQL result grid's horizontal scroll, PR #140 for the lesson reader). No PR in this project's history has had access to a real mobile viewport or device to visually confirm this — it has always been a code-review-level check. This remains the single largest category of "reasoned correct but not visually confirmed" risk heading into beta.

## G. Domain Setup Checklist

Manual steps for moving to a `.com` domain — **not performed in this or any prior PR**, documented here for whoever executes the actual launch:

1. **Purchase/choose the domain.** Apex (no `www.`) recommended per PR #142's audit, but either works.
2. **Add the domain in Vercel** (Project → Settings → Domains → Add Domain).
3. **Configure DNS** at the registrar (or point nameservers at Vercel) per Vercel's own generated instructions for that domain.
4. **Confirm HTTPS** — automatic via Vercel/Let's Encrypt once DNS resolves; no code action needed.
5. **Set `NEXT_PUBLIC_SITE_URL`** to the final domain in Vercel's **production** environment variables. This is the single environment variable every piece of canonical/OG/sitemap/robots logic in this codebase reads from (`lib/config.ts`'s `SITE_URL`) — no code change needed.
6. **Update Supabase Auth's Redirect URLs allowlist** (and Site URL setting) to the new domain — **required**, not optional, or `/auth/callback` will fail against the new domain even though no application code needs to change.
7. **Update OAuth callback URLs** at the provider's own developer console, **only if** a social login provider is added (none exists today — email/password via Supabase Auth only, confirmed unchanged since PR #142's audit).
8. **Verify www/apex redirect behavior** — configure the non-canonical form to redirect to the canonical one in Vercel's Domains UI (native support, no code-level redirect needed).
9. **Re-run this entire smoke test document** against the final domain once DNS/SSL/redirects are live — Sections A and E in particular, since they depend on the actual resolved domain.
10. **Test the social share preview** (OG image/title/description) on the final domain specifically — social platforms often cache a link's preview per-URL, so this is worth checking fresh once the domain changes, even though the underlying `opengraph-image.tsx`/metadata code needs no change.

---

## Validation Results

- `npm run seed` — 288 succeeded, 0 failed (unchanged)
- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run build` — clean, route list unchanged (this PR is copy/config only, no new routes)

## Manual QA (this session)

- All Section A and E items above verified live against a temporary dev server.
- Confirmed a real bug found and fixed during this PR's own QA: the home page's Twitter card silently reverted from `summary_large_image` to Next's `summary` default, because Next.js replaces a page's `twitter`/`openGraph` metadata object wholesale rather than merging individual fields with the parent layout's. Fixed by repeating `card: 'summary_large_image'` in the home page's own override; re-verified live afterward.
- Confirmed the new landing-page copy (beta badge, Practice Lab/SQL Console feature cards, "Try the Practice Lab" CTA, the AI disclaimer callout's new link to `/disclaimer`, and the footer's new Practice Lab link) all render with the correct text and `href` targets.
- Confirmed sitemap/robots/favicon/OG/canonical metadata all still correct after this PR's changes.
- Confirmed every gated route (`/practice`, `/practice-lab*` including individual exercise routes, `/ai-tutor`, `/dashboard`) still 307-redirects exactly as before — no route, auth, or gating logic was touched.
- Confirmed the first public preview lesson still loads without authentication.

## Remaining Launch Blockers

Carried forward from PR #142's audit, still open:

1. **No real support email** — `SUPPORT_EMAIL` in `lib/config.ts` is still `null`; legal pages currently show "Contact details will be added before wider launch." Not a hard blocker for a soft/invite beta, but should be resolved before wider public traffic.
2. **No production domain** — Section G above is entirely unexecuted; `NEXT_PUBLIC_SITE_URL` still resolves to the Vercel preview URL fallback.
3. **Legal page review** — the Privacy/Terms/Disclaimer copy (PR #144) is explicitly plain-language, not lawyer-reviewed; acceptable for a beta per the Product Owner's own stated approach, but flagged again here for visibility.
4. **Sections B, C (interactive parts), D (interactive parts), and F are entirely unexecuted** in any environment this project has had access to — this is not a code defect, it's an environment limitation that has applied to every PR in this project's history. A human with real login credentials and a real (or emulated) mobile device should run through Sections B/C/D/F before beta traffic begins.

## Product Owner Decisions Needed Before `.com` Domain Setup

1. **Final domain name and style** (apex vs. `www`) — Section G step 1 needs an actual name to execute against.
2. **Timing of the human-executed smoke test** (Sections B/C/D/F) — should this happen before or after the domain move? Recommend before, so any bug found doesn't need to be re-verified twice.
3. **Support email** — confirm an address before or shortly after domain setup, so `SUPPORT_EMAIL` can be set and the legal pages stop showing the placeholder.
4. **OAuth provider plans** — still open from PR #142; affects whether Section G step 7 is "not applicable" or "required."
5. **Beta invite scope** — is this smoke test gating a fully public launch, or a smaller invite-only beta first? Changes how urgently items 1–3 above need to close.
