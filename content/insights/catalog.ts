/**
 * IBM i Insights catalog. A plain, repository-committed data file, the same
 * pattern content/deep-dives/catalog.ts already uses -- no database table,
 * no migration.
 *
 * Intentionally empty for now. The Product Owner has asked to establish and
 * visually review the IBM i Insights section (/insights) on its own first;
 * individual Insight articles will be researched, reviewed, and approved
 * separately before any of them are added here and published. Do not add a
 * sample, placeholder, or "coming soon" entry to fill this in the meantime
 * -- lib/insights.ts and app/insights/page.tsx are both written to render a
 * correct, polished empty state with zero entries, and every downstream
 * consumer (the listing page, the detail route's generateStaticParams(),
 * the sitemap) already handles an empty INSIGHTS array as a normal case,
 * not an error case.
 *
 * Only `status: 'published'` entries are ever listed or linkable -- see
 * isInsightAvailable() in lib/insights.ts.
 */

import type { Insight } from '@/lib/insights'

export const INSIGHTS: Insight[] = []
