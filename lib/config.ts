/**
 * IBMiHub AI - Application Configuration Constants
 * Store CTA labels and other config-level values here so they can be updated
 * in one place without touching component code.
 */

/** Primary landing page CTA label - update here when transitioning to a new launch phase. */
export const PRIMARY_CTA_LABEL = 'Start Learning Free'

/** Site name used in metadata and UI */
export const SITE_NAME = 'IBMiHub AI'

/** IBM i Fundamentals learning path identifier */
export const IBM_I_FUNDAMENTALS_PATH_ID = 'ibm-i-fundamentals'

/** IBM i Fundamentals learning path display name */
export const IBM_I_FUNDAMENTALS_PATH_NAME = 'IBM i Fundamentals'

// --- Site config for metadata/SEO (PR #143) ---------------------------------
// Central place for the values app/layout.tsx's root metadata, per-page
// metadata, app/sitemap.ts, and app/robots.ts all read from, so none of them
// hardcode the site name/description/URL independently. See
// planning/PUBLIC_BETA_READINESS_AUDIT.md Sections 2/5 for the audit this
// follows up on.

/** Short name for manifest/home-screen use, where the full SITE_NAME may not fit. */
export const SITE_SHORT_NAME = 'IBMiHub AI'

/** Default browser-tab/search-result title -- wrapped by SITE_TITLE_TEMPLATE on pages that set their own `title`. */
export const SITE_DEFAULT_TITLE = `${SITE_NAME} - IBM i Learning and AI Assistance`

/** `%s | IBMiHub AI` -- applied automatically by Next.js to any page-level `title` string that doesn't opt out with `title: { absolute: ... }`. */
export const SITE_TITLE_TEMPLATE = `%s | ${SITE_NAME}`

/**
 * Default meta description, and the basis for Open Graph/Twitter card text.
 * Reflects what the product actually does today -- no certification/job
 * guarantees, no claim of real IBM i system access, no "official IBM"
 * affiliation (see planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
 * Section 1 for why "5250-style"/"ACS-style" phrasing matters).
 */
export const SITE_DEFAULT_DESCRIPTION =
  'AI-powered IBM i learning platform with guided lessons, practice questions, an AI Tutor, a ' +
  '5250-style Practice Lab, and an ACS-style SQL Practice Console. Currently in public beta.'

/** Short, reusable "this is a beta" phrase for places (OG image, metadata) that want it without a full sentence. */
export const SITE_BETA_TAGLINE = 'Public beta'

/**
 * Canonical base URL for absolute metadata (Open Graph, canonical links,
 * sitemap/robots entries). Prefers `NEXT_PUBLIC_SITE_URL` (set per-Vercel-
 * environment); falls back to the current Vercel deployment URL as a
 * placeholder until a real .com domain is live.
 *
 * TODO(domain): once a production .com domain is chosen, set
 * NEXT_PUBLIC_SITE_URL to it in Vercel's production environment variables --
 * no code here should need to change. Also update Supabase Auth's Redirect
 * URLs allowlist to the new domain (not a code change either). See
 * planning/PUBLIC_BETA_READINESS_AUDIT.md Section 5 for the full checklist.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibmihub-ai.vercel.app').replace(/\/+$/, '')

// --- Trust/legal page config (PR #144) --------------------------------------

/**
 * Support/contact email shown on legal pages and in the footer. Deliberately
 * left unset until a real, monitored inbox exists on a confirmed domain --
 * inventing a plausible-looking address here would risk publishing a
 * contact method nobody reads (see planning/PUBLIC_BETA_READINESS_AUDIT.md
 * Section 4). Every page that reads this constant already handles the
 * `null` case with a "contact details coming before wider launch" fallback,
 * so setting a real address here is the only change needed once one exists.
 */
export const SUPPORT_EMAIL: string | null = null

/** Shown as "Last updated: {date}" on each legal page -- bump when that page's copy changes. */
export const LEGAL_PAGES_LAST_UPDATED = 'July 16, 2026'
