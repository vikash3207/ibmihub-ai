/**
 * Deep Dives taxonomy/model (PR #154 -- Deep Dives Framework + Taxonomy).
 *
 * Deep Dives are the third learning pillar alongside the linear IBM i
 * Fundamentals lesson path: standalone, non-linear, professional-grade
 * topic guides (see planning/DEEP_DIVES_STRATEGY.md for selection
 * criteria and planning/DEEP_DIVE_TEMPLATE.md for the content structure
 * every Deep Dive should eventually follow).
 *
 * This module is intentionally simple -- a typed catalog read from a
 * plain data file (content/deep-dives/catalog.ts), the same pattern
 * content/practice/questions.ts already uses. No database table, no
 * migration: the catalog is small enough that a committed TS file is the
 * right level of ceremony for now, matching this PR's "framework and
 * taxonomy, not a content platform" scope. No dependency on
 * lib/lessons.ts or any server-only module, so this file (and everything
 * that imports only from it) is safe to import from client components.
 */

import type { DeepDiveCategoryId } from './deep-dive-categories'

export type DeepDiveDifficulty = 'intermediate' | 'professional' | 'expert'

/**
 * `planned` -- announced on the listing page as "Coming soon", not
 * clickable, no real content exists yet.
 * `review-ready` -- content is written and is going through review; still
 * not linked from the public listing as fully available (treated the same
 * as `planned` for now -- promote to `published` once review is done).
 * `published` -- content exists and its detail page (once #155+ adds
 * detail pages) is live and linkable.
 */
export type DeepDiveStatus = 'planned' | 'review-ready' | 'published'

export interface DeepDive {
  slug: string
  title: string
  description: string
  category: DeepDiveCategoryId
  subcategory?: string
  difficulty: DeepDiveDifficulty
  /** Minutes; omitted for `planned`/`review-ready` entries -- there is no real content yet to estimate a reading time from. */
  estimatedReadTime?: number
  status: DeepDiveStatus
  tags: string[]
  relatedLessonSlugs?: string[]
  relatedPracticeTopics?: string[]
  relatedDeepDiveSlugs?: string[]
  /** ISO date string, e.g. '2026-07-18'. */
  lastUpdated?: string
  featured?: boolean
}

/** Only `published` Deep Dives have anything real to show or link to. */
export function isDeepDiveAvailable(deepDive: DeepDive): boolean {
  return deepDive.status === 'published'
}

export interface DeepDiveCategoryCount {
  id: DeepDiveCategoryId
  count: number
}

export function getDeepDiveCategoryCounts(deepDives: DeepDive[]): Map<DeepDiveCategoryId, number> {
  const counts = new Map<DeepDiveCategoryId, number>()
  for (const deepDive of deepDives) {
    counts.set(deepDive.category, (counts.get(deepDive.category) ?? 0) + 1)
  }
  return counts
}
