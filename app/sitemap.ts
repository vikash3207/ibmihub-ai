import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'
import { getPublishedLessons } from '@/lib/lessons'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable } from '@/lib/deep-dives'

/**
 * Generated sitemap (Spec-adjacent, PR #143 -- see
 * planning/PUBLIC_BETA_READINESS_AUDIT.md Section 6). Reuses
 * getPublishedLessons() -- the exact same Published-only query every other
 * public-facing lesson list already uses -- so a Review Ready or Draft
 * lesson can never appear here, structurally, not by convention.
 *
 * Excludes /practice, /practice-lab (and its /5250, /sql sub-routes), and
 * /ai-tutor -- PR #159's SEO audit found all of them call
 * redirect('/auth/login?...') for any request without a session, so an
 * anonymous crawler never sees content there, only a redirect. An earlier
 * version of this file included them on the theory that their
 * marketing/description content would be publicly visible; that was never
 * actually true given the redirect-first implementation, so listing them
 * here was telling Google to index pages that immediately bounce it
 * elsewhere. Also excludes account-specific pages (/dashboard,
 * /onboarding), auth pages, individual Practice Lab exercise routes, and
 * all /api/* routes -- every one of these is also marked
 * `robots: { index: false }` in its own page metadata and disallowed in
 * app/robots.ts, so all three layers agree.
 *
 * PR #144 adds the Privacy/Terms/Disclaimer pages, PR #148 adds Contact --
 * genuinely public, indexable trust/contact content, unlike the
 * auth/account-specific pages above.
 *
 * PR #154 added /deep-dives (the listing page only), with no detail routes
 * since every catalog entry was `status: 'planned'`. PR #156 adds the first
 * published Deep Dive detail page, so deepDiveRoutes below now includes
 * every `published` DEEP_DIVES entry, filtered with isDeepDiveAvailable()
 * -- the exact same function app/deep-dives/[slug]/page.tsx uses to decide
 * what's linkable, so a `planned`/`review-ready` entry can never appear
 * here, the same guarantee lessonRoutes already gives Published lessons.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessons = await getPublishedLessons()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/learn`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/learn/ibm-i-fundamentals`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/deep-dives`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const lessonRoutes: MetadataRoute.Sitemap = lessons.map((lesson) => ({
    url: `${SITE_URL}/learn/ibm-i-fundamentals/${lesson.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const deepDiveRoutes: MetadataRoute.Sitemap = DEEP_DIVES.filter(isDeepDiveAvailable).map((deepDive) => ({
    url: `${SITE_URL}/deep-dives/${deepDive.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...lessonRoutes, ...deepDiveRoutes]
}
