/**
 * iRPGenie - Application Configuration Constants
 * Store CTA labels and other config-level values here so they can be updated
 * in one place without touching component code.
 */

/** Primary landing page CTA label - update here when transitioning to a new launch phase. */
export const PRIMARY_CTA_LABEL = 'Start Learning Free'

/** Site name used in metadata and UI */
export const SITE_NAME = 'iRPGenie'

/** IBM i Fundamentals learning path identifier */
export const IBM_I_FUNDAMENTALS_PATH_ID = 'ibm-i-fundamentals'

/** IBM i Fundamentals learning path display name */
export const IBM_I_FUNDAMENTALS_PATH_NAME = 'IBM i Fundamentals'

// --- Site config for metadata/SEO (PR #143, rebranded PR #148) --------------
// Central place for the values app/layout.tsx's root metadata, per-page
// metadata, app/sitemap.ts, and app/robots.ts all read from, so none of them
// hardcode the site name/description/URL independently. See
// planning/PUBLIC_BETA_READINESS_AUDIT.md Sections 2/5 for the audit this
// follows up on.

/** Short name for manifest/home-screen use, where the full SITE_NAME may not fit. */
export const SITE_SHORT_NAME = 'iRPGenie'

/** Short, reusable positioning line -- used in the footer and wherever a one-line tagline (not a full sentence) is wanted. */
export const SITE_TAGLINE = 'AI-powered IBM i, RPGLE & SQL learning'

/** Default browser-tab/search-result title -- wrapped by SITE_TITLE_TEMPLATE on pages that set their own `title`. */
export const SITE_DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`

/** `%s | iRPGenie` -- applied automatically by Next.js to any page-level `title` string that doesn't opt out with `title: { absolute: ... }`. */
export const SITE_TITLE_TEMPLATE = `%s | ${SITE_NAME}`

/**
 * Default meta description, and the basis for Open Graph/Twitter card text.
 * Reflects what the product actually does today -- no certification/job
 * guarantees, no claim of real IBM i system access, no "official IBM"
 * affiliation (see planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
 * Section 1 for why "5250-style"/"ACS-style" phrasing matters).
 */
export const SITE_DEFAULT_DESCRIPTION =
  'Learn IBM i, RPGLE, SQL, and 5250 concepts with guided lessons, practice questions, AI Tutor ' +
  'support, and hands-on practice labs.'

/** Short, reusable "this is a beta" phrase for places (OG image, metadata) that want it without a full sentence. */
export const SITE_BETA_TAGLINE = 'Public beta'

/**
 * Canonical base URL for absolute metadata (Open Graph, canonical links,
 * sitemap/robots entries). Prefers `NEXT_PUBLIC_SITE_URL` (set per-Vercel-
 * environment); falls back to the live production domain.
 *
 * Supabase Auth's Redirect URLs allowlist and Vercel's domain configuration
 * are managed separately (not code changes) -- see
 * planning/PUBLIC_BETA_READINESS_AUDIT.md Section 5.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://irpgenie.com').replace(/\/+$/, '')

// --- Trust/legal page config (PR #144, contact PR #148) ---------------------

/**
 * Support inbox -- login/account help, bugs, technical issues, AI Tutor or
 * Practice Lab problems. Shown on legal pages, the footer, and /contact.
 */
export const SUPPORT_EMAIL: string | null = 'support@irpgenie.com'

/**
 * General inbox -- feedback, content suggestions, collaboration, and
 * anything that isn't a support request. Shown on /contact.
 */
export const CONTACT_EMAIL: string | null = 'contact@irpgenie.com'

/** Shown as "Last updated: {date}" on each legal page -- bump when that page's copy changes. */
export const LEGAL_PAGES_LAST_UPDATED = 'July 18, 2026'
