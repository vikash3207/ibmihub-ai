/**
 * Unified cross-content search (Unified Discovery, Accessibility and
 * Responsive Polish). Pure, framework-free module -- no fetching, no
 * `server-only` import -- so it can be exercised directly by
 * scripts/search-regression.ts, the same "pure logic stays out of any
 * server-only/'use client' boundary" convention lib/nav-links.ts and
 * lib/deep-dive-render.ts already establish for this codebase. The one
 * caller that actually fetches data (app/search/page.tsx) is a Server
 * Component that calls getPublishedLessons() (lib/lessons.ts,
 * `server-only`) plus isDeepDiveAvailable()/isInsightAvailable() directly,
 * then hands already-published, already-normalized items to searchContent()
 * here -- this module never re-implements any publication-status rule.
 */

import type { Lesson } from './lessons'
import type { DeepDive } from './deep-dives'
import type { Insight } from './insights'
import { getDeepDiveCategoryLabel } from './deep-dive-categories'
import { getInsightCategoryLabel } from './insight-categories'
import { getMasterCategoryLabel } from './master-categories'

export type SearchResultType = 'lesson' | 'deep-dive' | 'insight'

export interface SearchableItem {
  type: SearchResultType
  slug: string
  title: string
  description: string
  /** Always a display-ready human label (or null) -- never a raw internal id/slug. */
  category: string | null
  /**
   * Secondary, more specific context shown alongside `category` -- only
   * lessons have one today (a lesson's masterSubcategory, e.g. "What IBM i
   * Is" under the "IBM i Platform Fundamentals" master category; already a
   * human-readable string in content/lessons/metadata.ts, no id lookup
   * needed). Deep Dives/Insights have no equivalent second tier, so this is
   * always null for them -- one shared shape, not a lesson-only type.
   */
  subcategory: string | null
  tags: string[]
  url: string
}

export function lessonToSearchable(lesson: Lesson): SearchableItem {
  return {
    type: 'lesson',
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.short_description,
    // getMasterCategoryLabel() is the one existing master-category-id ->
    // label mapping (lib/master-categories.ts, already used by
    // lesson-browser.tsx/curriculum-sidebar.tsx) -- reused here rather than
    // re-deriving a label, and it safely returns undefined (normalized to
    // null) for a missing/unknown id instead of ever exposing the raw
    // "ibm-i-platform-fundamentals"-style slug as display text.
    category: getMasterCategoryLabel(lesson.master_category_id) ?? null,
    subcategory: lesson.master_subcategory ?? null,
    tags: lesson.tags ?? [],
    url: `/learn/ibm-i-fundamentals/${lesson.slug}`,
  }
}

export function deepDiveToSearchable(deepDive: DeepDive): SearchableItem {
  return {
    type: 'deep-dive',
    slug: deepDive.slug,
    title: deepDive.title,
    description: deepDive.description,
    category: getDeepDiveCategoryLabel(deepDive.category),
    subcategory: null,
    tags: deepDive.tags,
    url: `/deep-dives/${deepDive.slug}`,
  }
}

export function insightToSearchable(insight: Insight): SearchableItem {
  return {
    type: 'insight',
    slug: insight.slug,
    title: insight.title,
    description: insight.description,
    category: getInsightCategoryLabel(insight.category),
    subcategory: null,
    tags: insight.tags,
    url: `/insights/${insight.slug}`,
  }
}

/**
 * Hard cap on query length applied before any other processing, so an
 * excessively long query (accidental paste, or a deliberately hostile
 * request) can never make normalization/matching do unbounded work --
 * everything past this many characters is simply never looked at.
 */
const MAX_QUERY_LENGTH = 200

/** Trim, collapse internal whitespace, and lowercase -- always bounded by MAX_QUERY_LENGTH first. */
export function normalizeQuery(raw: string): string {
  return raw.slice(0, MAX_QUERY_LENGTH).trim().replace(/\s+/g, ' ').toLowerCase()
}

/**
 * Next.js hands a Server Component's `searchParams` value for a repeated
 * key (e.g. `/search?q=sql&q=rpgle`) back as a `string[]`, not a `string` --
 * a plain `q?: string` page-prop type doesn't reflect that, and passing an
 * array straight into a string-only helper like normalizeQuery() would
 * throw calling `.trim()` on it. This safely reduces every shape the
 * framework can hand back (a string, an array, an empty array, or
 * undefined/a missing param) to one bounded string: a plain string is used
 * as-is; an array deterministically uses its first entry (never
 * concatenated -- that could turn two already-long values into one
 * unnecessarily expensive query) if that entry is itself a usable string,
 * or an empty string otherwise. The result still needs normalizeQuery()
 * applied on top of this for trimming/casing/length -- this function only
 * settles the *shape*, not the content.
 */
export function extractQueryParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value[0]
    return typeof first === 'string' ? first : ''
  }
  return ''
}

/**
 * Deterministic, explainable rank tiers -- lower is better. Plain
 * `.includes()`/`.startsWith()` string matching only, never a regex built
 * from the query itself (so special characters in a query are always
 * treated as literal text, never as regex syntax) and never a fuzzy-match
 * dependency.
 */
export type SearchRankTier = 1 | 2 | 3 | 4 | 5

export function scoreItem(item: SearchableItem, normalizedQuery: string): SearchRankTier | null {
  if (!normalizedQuery) return null

  const title = item.title.toLowerCase()
  if (title === normalizedQuery) return 1
  if (title.startsWith(normalizedQuery)) return 2
  if (title.includes(normalizedQuery)) return 3

  const categoryMatch = item.category?.toLowerCase().includes(normalizedQuery) ?? false
  const subcategoryMatch = item.subcategory?.toLowerCase().includes(normalizedQuery) ?? false
  const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  if (categoryMatch || subcategoryMatch || tagMatch) return 4

  if (item.description.toLowerCase().includes(normalizedQuery)) return 5

  return null
}

/**
 * Empty or whitespace-only queries return no results (the caller renders
 * the empty-query guidance state instead, never the full catalog). Ties
 * within a tier break alphabetically by title -- deterministic, never
 * dependent on input array order.
 */
export function searchContent(items: SearchableItem[], rawQuery: string): SearchableItem[] {
  const normalized = normalizeQuery(rawQuery)
  if (!normalized) return []

  return items
    .map((item) => ({ item, tier: scoreItem(item, normalized) }))
    .filter((entry): entry is { item: SearchableItem; tier: SearchRankTier } => entry.tier !== null)
    .sort((a, b) => a.tier - b.tier || a.item.title.localeCompare(b.item.title))
    .map((entry) => entry.item)
}

export interface HighlightSegment {
  text: string
  match: boolean
}

/**
 * Pure string-splitting for safe result highlighting -- returns plain data,
 * never an HTML string. The caller (app/search/page.tsx) renders `match:
 * true` segments inside a real <mark> JSX element; there is no
 * dangerouslySetInnerHTML anywhere in this feature.
 */
export function highlightMatch(text: string, normalizedQuery: string): HighlightSegment[] {
  if (!normalizedQuery) return [{ text, match: false }]

  const lowerText = text.toLowerCase()
  const segments: HighlightSegment[] = []
  let cursor = 0

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(normalizedQuery, cursor)
    if (matchIndex === -1) {
      segments.push({ text: text.slice(cursor), match: false })
      break
    }
    if (matchIndex > cursor) {
      segments.push({ text: text.slice(cursor, matchIndex), match: false })
    }
    segments.push({ text: text.slice(matchIndex, matchIndex + normalizedQuery.length), match: true })
    cursor = matchIndex + normalizedQuery.length
  }

  return segments.length > 0 ? segments : [{ text, match: false }]
}
