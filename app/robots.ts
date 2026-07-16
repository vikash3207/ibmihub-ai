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
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/learn', '/practice', '/practice-lab', '/ai-tutor', '/privacy', '/terms', '/disclaimer'],
      disallow: ['/auth/', '/api/', '/dashboard', '/onboarding'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
