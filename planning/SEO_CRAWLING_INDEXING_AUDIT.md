# SEO Crawling & Indexing Audit

**Date of audit:** 2026-07-18
**Production domain checked:** https://irpgenie.com
**Canonical domain decision:** `https://irpgenie.com` (non-www, https). Already the default in `lib/config.ts`'s `SITE_URL` constant, which every page's metadata, `app/sitemap.ts`, and `app/robots.ts` already read from -- no code change was needed to establish this, only to verify it.
**PR:** #159 (branch `Feature_159`)

---

## Summary

The site was not showing up in Google search partly because it's genuinely new (indexing takes time regardless), but this audit found one real, fixable technical issue: **`/ai-tutor`, `/practice`, `/practice-lab`, and every `/practice-lab/*` sub-route were listed in `sitemap.xml` and allowed in `robots.txt`, but every one of them redirects any request without a session straight to `/auth/login`.** An anonymous crawler hitting these URLs never sees any content -- only a redirect to a page that's already disallowed. This told Google "please index this," while the actual response was "go somewhere else." That's fixed in this PR (see Problems Found / Fixes Made).

Beyond that specific bug, most of the crawling/indexing fundamentals were already solid: `app/robots.ts` and `app/sitemap.ts` already existed and were mostly correct, canonical URLs and per-page metadata were already unique and used the right domain, and private/account pages already had `robots: { index: false }`. This PR adds structured data (none existed before) and documents one intentional content-gating tradeoff that's outside this PR's scope to change.

---

## Problems found

1. **Sitemap/robots.txt claimed pages were indexable that actually hard-redirect anonymous visitors.** `/ai-tutor`, `/practice`, `/practice-lab`, `/practice-lab/5250`, and `/practice-lab/sql` all call `redirect('/auth/login?...')` server-side for any request with no session (confirmed by reading each page's source -- this is not a hypothesis). `app/sitemap.ts`'s own comment claimed these pages had "marketing/description content... meant to be discoverable," but the actual implementation redirects before rendering anything; the comment described intent that the code never matched. `app/robots.ts` listed the same five paths under `allow`.
2. **`/contact` was missing from `robots.ts`'s explicit `allow` list**, even though it's genuinely public and already in the sitemap. This didn't actually block anything (no catch-all `Disallow: /` exists, so unlisted paths are allowed by default), but it was an inconsistency worth fixing for clarity.
3. **No structured data (JSON-LD) existed anywhere in the codebase** -- confirmed by a full-repo search for `application/ld+json` / `schema.org`, zero matches. Not a crawling blocker on its own, but a missed opportunity for how Google understands and displays the brand and content.
4. **No `noindex` on the 5 hard-redirecting pages above, or their 2 exercise sub-routes** (`/practice-lab/5250/[exerciseSlug]`, `/practice-lab/sql/[exerciseSlug]`) -- low real-world impact since they redirect before any HTML with a meta tag could ever be served to an anonymous crawler, but added anyway for defense-in-depth and consistency with how `/dashboard` and `/onboarding` are already handled.
5. **No accidental `noindex` on any genuinely public page** -- checked. This is a "confirmed absence of a problem," not a fix.

## Fixes made

1. **`app/robots.ts`**: moved `/practice`, `/practice-lab`, and `/ai-tutor` from `allow` to `disallow` (the `/practice-lab` prefix rule also covers its `/5250` and `/sql` sub-routes and their exercise pages). Added `/contact` to the explicit `allow` list.
2. **`app/sitemap.ts`**: removed `/practice`, `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql`, and `/ai-tutor` from the static route list. Rewrote the file's doc comment to describe what the code actually does, instead of the redirect-blind rationale it had before.
3. **Added `robots: { index: false, follow: false }`** to the metadata of: `app/(authenticated)/ai-tutor/page.tsx`, `.../practice/page.tsx`, `.../practice-lab/page.tsx`, `.../practice-lab/5250/page.tsx`, `.../practice-lab/sql/page.tsx`, `.../practice-lab/5250/[exerciseSlug]/page.tsx`, `.../practice-lab/sql/[exerciseSlug]/page.tsx` -- the same treatment `/dashboard` and `/onboarding` already had.
4. **Added `components/structured-data.tsx`**, a small shared `<StructuredData data={...} />` component that renders a JSON-LD `<script>` tag from a plain object.
5. **Homepage (`app/page.tsx`)**: added `Organization` + `WebSite` JSON-LD (name `iRPGenie`, url `https://irpgenie.com`, no IBM affiliation claim, no `sameAs` links since none exist yet).
6. **Deep Dive detail pages (`app/deep-dives/[slug]/page.tsx`)**: added `TechArticle` JSON-LD per published Deep Dive -- `headline`, `description`, `url`, `mainEntityOfPage`, `dateModified` (from the catalog's `lastUpdated`), `author` (Vikash Choudhary), `publisher` (iRPGenie).
7. **Lesson detail pages (`app/learn/ibm-i-fundamentals/[slug]/page.tsx`)**: added `BreadcrumbList` JSON-LD (Home -> Learning Center -> IBM i Fundamentals -> lesson title).

No fake ratings, reviews, course schema, organization address, or phone number were added -- none of that data exists, and the task explicitly said not to fabricate it.

## Files modified

- `app/robots.ts`
- `app/sitemap.ts`
- `app/(authenticated)/ai-tutor/page.tsx`
- `app/(authenticated)/practice/page.tsx`
- `app/(authenticated)/practice-lab/page.tsx`
- `app/(authenticated)/practice-lab/5250/page.tsx`
- `app/(authenticated)/practice-lab/sql/page.tsx`
- `app/(authenticated)/practice-lab/5250/[exerciseSlug]/page.tsx`
- `app/(authenticated)/practice-lab/sql/[exerciseSlug]/page.tsx`
- `app/page.tsx`
- `app/deep-dives/[slug]/page.tsx`
- `app/learn/ibm-i-fundamentals/[slug]/page.tsx`
- `components/structured-data.tsx` (new)
- `planning/GOOGLE_INDEXING_CHECKLIST.md` (new)
- `planning/SEO_CRAWLING_INDEXING_AUDIT.md` (new, this file)

---

## Sitemap route inclusion summary

**Included in `sitemap.xml`:**

| Route | Source |
|---|---|
| `/` | static |
| `/learn` | static |
| `/learn/ibm-i-fundamentals` | static |
| every `Published` lesson (`/learn/ibm-i-fundamentals/{slug}`) | `getPublishedLessons()` -- structurally can never include Draft/Review Ready/Unpublished |
| `/deep-dives` | static |
| every `published` Deep Dive (`/deep-dives/{slug}`) | `DEEP_DIVES.filter(isDeepDiveAvailable)` -- structurally can never include `planned`/`review-ready` entries; currently `sql-on-ibm-i` and `embedded-sql-in-rpgle` |
| `/privacy`, `/terms`, `/disclaimer`, `/contact` | static |

**Intentionally excluded from `sitemap.xml` (and now `disallow`ed in `robots.txt`, and `noindex` on the page itself):**

| Route | Why |
|---|---|
| `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password` | account auth flows |
| `/auth/callback`, `/auth/logout` | route handlers, not pages -- no HTML/metadata to index at all |
| `/dashboard` | account-specific, requires login |
| `/onboarding` | account-specific, requires login |
| `/ai-tutor` | hard-redirects to `/auth/login` for anonymous requests (this PR's main finding) |
| `/practice`, `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql` | same -- hard-redirect anonymous requests |
| `/practice-lab/5250/[exerciseSlug]`, `/practice-lab/sql/[exerciseSlug]` | same, plus never linked from a public page even for a logged-in user's crawl path |
| `/api/*` | JSON endpoints, not pages |
| any Draft/Review Ready/Unpublished lesson | excluded structurally by `getPublishedLessons()` |
| any `planned`/`review-ready` Deep Dive | excluded structurally by `isDeepDiveAvailable()` |

No duplicate URLs, no `localhost`, no Vercel preview hostnames, and no Supabase URLs appear anywhere in the sitemap -- every entry is built from `SITE_URL` (`lib/config.ts`), which resolves to `https://irpgenie.com` in production.

---

## noindex usage summary

Confirmed via a full-repo search for `noindex`/`nofollow`/`googlebot`/`X-Robots-Tag`/`robots:`.

**Already had `robots: { index: false, follow: false }` before this PR:** `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`, `/dashboard`, `/onboarding`.

**Added by this PR:** `/ai-tutor`, `/practice`, `/practice-lab`, `/practice-lab/5250`, `/practice-lab/sql`, `/practice-lab/5250/[exerciseSlug]`, `/practice-lab/sql/[exerciseSlug]`.

**No public page has an accidental `noindex`** -- every genuinely public page (`/`, `/learn`, `/learn/ibm-i-fundamentals`, every published lesson, `/deep-dives`, every published Deep Dive, `/contact`, `/privacy`, `/terms`, `/disclaimer`) was checked and has no `robots` override, which means the default `index, follow` applies.

No `X-Robots-Tag` HTTP header is set anywhere (checked `next.config.mjs` and `proxy.ts`) -- all robots signals go through Next's `metadata.robots` (rendered as a `<meta name="robots">` tag) and `app/robots.ts`, which is the correct, sufficient mechanism here; there was no need to add response-header-level robots control.

---

## Structured data added

- **Homepage** -- `Organization` + `WebSite` (`@graph`), name `iRPGenie`, url `https://irpgenie.com`, description `AI-powered IBM i, RPGLE & SQL learning platform.` No IBM affiliation claim, no fabricated `sameAs` social links.
- **Deep Dive detail pages** -- `TechArticle` per published Deep Dive, with `author` (Vikash Choudhary), `publisher` (iRPGenie), `dateModified` (from the catalog), `mainEntityOfPage`.
- **Lesson detail pages** -- `BreadcrumbList` (Home -> Learning Center -> IBM i Fundamentals -> lesson). Purely navigational; the lesson title used in it is already public even for a logged-out visitor (see the gating note below), so this carries no gated content.

No ratings, reviews, `Course` schema, or organization address/phone were added -- none of that data exists, and inventing it was explicitly out of scope.

---

## Canonical URL findings

Every page's canonical is built via a relative path (e.g. `alternates: { canonical: '/deep-dives/sql-on-ibm-i' }`) resolved against `metadataBase: new URL(SITE_URL)` in `app/layout.tsx`, and `SITE_URL` (`lib/config.ts`) defaults to `https://irpgenie.com` with any trailing slash stripped. That means every canonical URL in the app:

- uses `https://irpgenie.com`
- is absolute once rendered (Next resolves the relative path against `metadataBase`)
- is non-www
- has no trailing-slash inconsistency (paths are written without one, consistently)

No canonical anywhere references `localhost`, a Vercel preview hostname, a Supabase URL, or `http://`. This was already correct before this PR; nothing needed to change here.

---

## Server-rendered content findings

- **Homepage, `/learn`, `/deep-dives`, and both published Deep Dive pages** render their full title, headings, and body text directly in server-rendered HTML -- confirmed by reading each route (all are React Server Components with no client-only data fetching for their primary content). Deep Dive body content specifically goes through a server-side Markdown-to-HTML pipeline (`lib/markdown.ts` + `lib/deep-dive-render.ts`) before the page ever renders, so there's no client-side rendering step required to see it.
- **Lesson detail pages -- an intentional gating tradeoff, not a bug:** only the very first lesson in the course (`lesson_order === 1`) is readable without an account (`isPreview` in `app/learn/ibm-i-fundamentals/[slug]/page.tsx`). Every other Published lesson renders a real `<h1>` with the lesson's actual title and description in server-rendered HTML (so an anonymous crawler, including Googlebot, sees an accurate title/description and now a `BreadcrumbList`), but the lesson **body** is replaced with a "Log in to continue" card instead of the real content when there's no session. This is **not cloaking** -- Googlebot and any other anonymous visitor see exactly the same thing -- but it does mean roughly 280+ lesson URLs are in the sitemap with a title/snippet Google can index while the actual page body is a login prompt for anyone without an account. This was true before this PR and is unchanged by it; changing lesson gating rules was explicitly out of scope for this audit. **Flagged as an open Product Owner decision below.**

---

## HTTP behavior findings

Live production checks against `https://irpgenie.com` (this session's sandbox tooling had an intermittent outage partway through, but all of these were confirmed once it recovered):

- [x] `https://irpgenie.com` returns HTTP 200
- [x] `http://irpgenie.com` returns HTTP 308 with `Location: https://irpgenie.com/` -- redirects to https correctly
- [x] `https://www.irpgenie.com` returns HTTP 200 (does not redirect to non-www) -- **but** its rendered `<link rel="canonical">` correctly points to `https://irpgenie.com` (non-www), so both hostnames serve the same app and both agree on which URL is canonical. This satisfies "behaves consistently" even without a hostname-level redirect; a hostname redirect would still be the cleaner setup (see Remaining Manual Actions).
- [x] No redirect loops observed
- [x] `https://irpgenie.com/robots.txt` returns HTTP 200
- [x] `https://irpgenie.com/sitemap.xml` returns HTTP 200 and valid XML
- [x] `https://irpgenie.com/deep-dives/sql-on-ibm-i` returns HTTP 200, with `<title>SQL on IBM i Deep Dive | iRPGenie</title>` and the real `<h1>SQL on IBM i</h1>` present in the raw server-rendered response (not client-only)
- [x] A nonexistent path (`/this-page-does-not-exist-xyz`) returns a proper HTTP 404, not a soft-404 200

**Confirms the fix in this PR is needed**: the live `robots.txt` (fetched from production during this audit, before this PR is merged) still shows the pre-fix state --
```
Allow: /practice
Allow: /practice-lab
Allow: /ai-tutor
```
--- and the live `sitemap.xml` still lists `https://irpgenie.com/practice`, `/practice-lab`, `/ai-tutor`. This is exactly the problem described in Problems Found #1, confirmed live, not just in the repo's current `main`.

**A deeper, empirically-confirmed nuance found during local QA** (`npm run build && npm run start`), worth recording precisely: `/practice`, `/practice-lab`, and `/ai-tutor` don't return a clean HTTP 3xx for an anonymous request -- they return **HTTP 200** with the page's `<title>` tag present but none of the page's actual body content (confirmed by checking for `INTRO_NOTICE`-equivalent body text, which was absent), and the redirect to `/auth/login` happens as a client-side navigation encoded in the React Server Components payload rather than a server-level redirect. By contrast, `/onboarding` returns a clean HTTP 307. Both call `redirect()` for the same reason (no session); the difference in observed behavior is a rendering-timing detail of Next.js's streaming SSR, not something this PR's fixes depend on -- the `robots.txt` disallow (which prevents Googlebot from fetching these URLs in the first place) is unaffected by which redirect mechanism ends up firing. Diagnosing or changing that timing would mean touching the auth-check structure of these pages, which is explicitly out of scope for this PR (`redirect()` logic itself was not modified). Flagged here only because it makes the sitemap/robots.txt fix *more* important, not less: even a "soft" client-side redirect on a `disallow`ed URL is now something Googlebot never fetches at all.

---

## Remaining manual actions

1. **Deploy this PR**, then re-check `https://irpgenie.com/robots.txt` and `/sitemap.xml` to confirm production picked up the fix (they still showed the pre-fix state as of this audit -- see HTTP Behavior Findings).
2. **Complete `planning/GOOGLE_INDEXING_CHECKLIST.md`** -- GSC property creation, verification, sitemap submission, and manual indexing requests are all outside what code can do.
3. **Consider a Vercel domain setting change for `www.irpgenie.com`** -- it currently serves HTTP 200 directly rather than redirecting to the non-www host. The canonical tag already tells Google which one is authoritative, so this isn't blocking indexing, but a clean redirect (Project -> Settings -> Domains) is still the more standard setup and avoids two crawlable hostnames for the same content.
4. **Product Owner decision on lesson gating and indexing** (see below) -- no code change is proposed here without that decision.

---

## Open Product Owner decision needed

**Should every Published lesson stay in the sitemap even though only the first one is readable without an account?**

Current behavior (unchanged by this PR): all ~280+ Published lessons are in `sitemap.xml` with accurate, unique titles/descriptions, but only lesson #1 shows real body content to a logged-out visitor -- every other lesson shows a "Log in to continue" card in the same request. This is common and legitimate for paywalled/gated content sites (not cloaking, since everyone anonymous sees the same thing), but it does mean Google may index many lesson URLs whose visible body, to its crawler, is a login prompt rather than lesson content. Three reasonable options, none implemented in this PR pending a decision:

- **(a) Leave as-is.** Google can still show an accurate title/snippet for these URLs in search results even with a gated body; users who click through get a clear "log in to read this" call to action, which is a normal, honest pattern.
- **(b) Only include the free-preview lesson (and top-level `/learn` pages) in the sitemap**, removing the other ~280 gated lesson URLs from `sitemap.xml` (still leave them crawlable/`index`-able if directly linked, just stop actively submitting them).
- **(c) Add `robots: { index: false }` to every lesson beyond the free preview**, explicitly telling Google not to index thin/gated pages at all.

This is a content/product strategy decision (how much of the catalog should be search-visible before someone creates an account), not a technical bug -- flagging it rather than picking one unilaterally.

---

## Validation results

All four passed clean: `npm run seed` (288 succeeded, 0 failed), `npm run lint`, `npx tsc --noEmit`, `npm run build` (all 22 routes compiled, no errors).

## Manual QA results

Performed against a local `npm run build && npm run start` production server, plus live checks against `https://irpgenie.com` (see HTTP Behavior Findings above for the production-specific results):

- `/`, `/learn`, `/deep-dives`, `/deep-dives/sql-on-ibm-i`, `/deep-dives/embedded-sql-in-rpgle`, `/practice`, `/practice-lab`, `/ai-tutor`, `/dashboard`, `/auth/login`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/robots.txt`, `/sitemap.xml` all return HTTP 200 locally; a nonexistent path returns 404.
- Homepage structured data: exactly one `Organization` and one `WebSite` JSON-LD block present; title and canonical render correctly.
- Deep Dive structured data: `TechArticle` JSON-LD present on `/deep-dives/sql-on-ibm-i`, including `"author":{"@type":"Person","name":"Vikash Choudhary"}`.
- Lesson structured data: `BreadcrumbList` JSON-LD present on a lesson detail page.
- `/practice` and `/ai-tutor` both render `<meta name="robots" content="noindex, nofollow">` -- confirms the metadata fix took effect even though (per the HTTP Behavior finding above) the body itself is a client-side redirect for an anonymous request.
- Local `robots.txt` output matches the new `app/robots.ts` exactly: `/practice`, `/practice-lab`, `/ai-tutor` under `Disallow`, `/contact` now under `Allow`.
- Local `sitemap.xml` contains zero `/practice*`/`/ai-tutor` entries, and both published Deep Dive URLs (`/deep-dives/sql-on-ibm-i`, `/deep-dives/embedded-sql-in-rpgle`) plus every Published lesson URl -- no duplicates, no `localhost`/Vercel/Supabase URLs (all built from `SITE_URL`).
- `/learn`, `/practice-lab`, `/ai-tutor`, `/dashboard`, `/auth/login` all still load correctly -- no regression to existing routes or auth gating from this PR's metadata-only and sitemap/robots changes.
