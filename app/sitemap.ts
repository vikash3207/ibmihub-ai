import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config'
import { getPublishedLessons } from '@/lib/lessons'

/**
 * Generated sitemap (Spec-adjacent, PR #143 -- see
 * planning/PUBLIC_BETA_READINESS_AUDIT.md Section 6). Reuses
 * getPublishedLessons() -- the exact same Published-only query every other
 * public-facing lesson list already uses -- so a Review Ready or Draft
 * lesson can never appear here, structurally, not by convention.
 *
 * Deliberately includes /practice, /practice-lab, /practice-lab/5250, and
 * /practice-lab/sql even though they redirect an unauthenticated visitor to
 * login: their own marketing/description content is meant to be
 * discoverable, the same way many gated products list their app's landing
 * routes in a sitemap even though the underlying feature requires an
 * account. Excludes account-specific pages (/dashboard, /onboarding),
 * auth pages, individual Practice Lab exercise routes, and all /api/*
 * routes -- those are also marked `robots: { index: false }` in their own
 * page metadata where applicable (see app/(authenticated)/dashboard/page.tsx
 * and the app/auth/* pages).
 *
 * PR #144 adds the Privacy/Terms/Disclaimer pages, PR #148 adds Contact --
 * genuinely public, indexable trust/contact content, unlike the
 * auth/account-specific pages above.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lessons = await getPublishedLessons()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/learn`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/learn/ibm-i-fundamentals`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/practice`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/practice-lab`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/practice-lab/5250`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/practice-lab/sql`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/ai-tutor`, changeFrequency: 'monthly', priority: 0.5 },
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

  return [...staticRoutes, ...lessonRoutes]
}
