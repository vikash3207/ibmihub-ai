/**
 * IBM i Insights catalog (PR #194 -- Launch IBM i Insights). A plain,
 * repository-committed data file, the same pattern content/deep-dives/
 * catalog.ts already uses -- no database table, no migration. Order is
 * publish order (newest last is fine at this size; re-sort by publishedAt
 * once there are enough entries for it to matter).
 *
 * Only `status: 'published'` entries are ever listed or linkable -- see
 * isInsightAvailable() in lib/insights.ts. Do not add `planned`/"coming
 * soon" placeholder entries here; the product decision for this section is
 * to show only real, published articles.
 */

import type { Insight } from '@/lib/insights'

export const INSIGHTS: Insight[] = [
  {
    slug: 'rpg-rest-api-integrated-web-services',
    title: 'Turn Existing RPG Programs into REST APIs with Integrated Web Services',
    description:
      'A practical guide to exposing existing RPG business logic as REST APIs with Integrated Web Services (IWS) -- choosing a good candidate program, designing a clean interface, and the production concerns (auth, TLS, authorities, CCSIDs, versioning) that come with going live.',
    category: 'apis-integration',
    tags: ['integrated-web-services', 'rest-api', 'rpgle', 'service-programs', 'modernization'],
    publishedAt: '2026-08-11',
    readingTimeMinutes: 22,
    status: 'published',
    featured: true,
    relatedDeepDiveSlugs: ['stored-procedures-on-ibm-i'],
    relatedLessonSlugs: [
      'exposing-ibm-i-logic-as-an-api',
      'rest-api-concepts-for-ibm-i-developers',
      'api-error-handling-basics',
    ],
  },
]
