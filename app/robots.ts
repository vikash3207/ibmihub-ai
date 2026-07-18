import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'

/**
 * Generated robots.txt (PR #143 -- see
 * planning/PUBLIC_BETA_READINESS_AUDIT.md Section 7). Allows the public
 * marketing/learning surface; disallows auth, account-specific, and
 * internal routes. This is a broad, top-level allow/disallow list -- the
 * finer-grained "don't index this specific page" decisions (e.g.
 * /dashboard, /auth/*) are additionally enforced per-page via
 * `robots: { index: false }` in that page's own metadata, so both layers
 * agree rather than relying on just one.
 *
 * PR #159 (SEO crawling/indexing audit) moved /practice, /practice-lab, and
 * /ai-tutor from `allow` to `disallow`: all three (and every /practice-lab/*
 * sub-route) call redirect('/auth/login?...') for any request without a
 * session -- there is no marketing/preview content for an anonymous
 * crawler to see, only a redirect to a page that's already disallowed
 * below. Allowing them wasted crawl budget on a guaranteed redirect and
 * miscommunicated these as indexable in the previous sitemap.ts (see that
 * file's comment). They're the same shape as /dashboard and /onboarding,
 * so they now get the identical three-layer treatment: disallowed here,
 * excluded from sitemap.ts, and `robots: { index: false }` on the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/learn', '/deep-dives', '/privacy', '/terms', '/disclaimer', '/contact'],
      disallow: ['/auth/', '/api/', '/dashboard', '/onboarding', '/practice', '/practice-lab', '/ai-tutor'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
