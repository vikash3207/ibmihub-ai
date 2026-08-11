/**
 * IBM i Insights model (PR #194 -- Launch IBM i Insights).
 *
 * Insights are a third, separate public content type alongside the linear
 * IBM i Fundamentals lesson path and the non-linear Deep Dive reference
 * guides: focused, practical, timely, outcome-oriented articles (product
 * positioning -- see planning docs for PR #194). This module is
 * intentionally the same shape as lib/deep-dives.ts -- a typed catalog read
 * from a plain committed data file (content/insights/catalog.ts) -- but is
 * fully independent of it. Insight entries never appear in DEEP_DIVES and
 * DeepDive's type is never reused here, so the two content types can evolve
 * on their own schedules without coupling.
 *
 * No dependency on lib/lessons.ts or any server-only module, so this file
 * (and everything that imports only from it) is safe to import from client
 * components.
 */

import type { InsightCategoryId } from './insight-categories'

/**
 * `draft` -- exists in the catalog for editorial work-in-progress but is
 * never listed, linked, or rendered publicly; its slug 404s the same way an
 * unknown slug does. `published` -- live, listed on /insights, and linkable.
 * There is no `planned`/"coming soon" state for Insights (unlike Deep
 * Dives): the spec for this section explicitly excludes placeholder cards
 * for unpublished topics.
 */
export type InsightStatus = 'draft' | 'published'

export interface Insight {
  slug: string
  title: string
  description: string
  category: InsightCategoryId
  tags: string[]
  /** ISO date string, e.g. '2026-08-12'. Never a future date. */
  publishedAt: string
  /** ISO date string. Only set once the article body has materially changed after publishing. */
  updatedAt?: string
  /** Minutes; a manually-set estimate, the same convention DeepDive.estimatedReadTime uses. */
  readingTimeMinutes: number
  status: InsightStatus
  featured?: boolean
  relatedDeepDiveSlugs?: string[]
  relatedLessonSlugs?: string[]
}

/** Only `published` Insights have anything real to show or link to. */
export function isInsightAvailable(insight: Insight): boolean {
  return insight.status === 'published'
}

export function getPublishedInsights(insights: Insight[]): Insight[] {
  return insights.filter(isInsightAvailable)
}

export function getFeaturedInsight(insights: Insight[]): Insight | undefined {
  return getPublishedInsights(insights).find((insight) => insight.featured)
}
