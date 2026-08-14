/**
 * IBM i Insights category taxonomy. Deliberately its own, small
 * taxonomy -- not the 12-entry
 * DeepDiveCategoryId (lib/deep-dive-categories.ts) and not the 27-entry
 * lesson MASTER_CATEGORIES. Insights are a third, separate content type
 * (practical/timely/outcome-oriented articles), not a Deep Dive subtype,
 * so it gets its own category list and its own accent-color system rather
 * than borrowing either existing one.
 *
 * No dependency on lib/lessons.ts or any server-only module, so this file
 * is safe to import from client components (e.g. components/insight-card.tsx).
 */

export type InsightCategoryId =
  | 'apis-integration'
  | 'modernization'
  | 'ai-emerging-tech'
  | 'operations-performance'
  | 'security'
  | 'best-practices'

export interface InsightCategory {
  id: InsightCategoryId
  label: string
}

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  { id: 'apis-integration', label: 'APIs & Integration' },
  { id: 'modernization', label: 'Modernization' },
  { id: 'ai-emerging-tech', label: 'AI & Emerging Tech' },
  { id: 'operations-performance', label: 'Operations & Performance' },
  { id: 'security', label: 'Security' },
  { id: 'best-practices', label: 'Best Practices' },
]

const LABEL_BY_ID = new Map(INSIGHT_CATEGORIES.map((c) => [c.id, c.label]))

export function getInsightCategoryLabel(id: InsightCategoryId): string {
  return LABEL_BY_ID.get(id) ?? id
}

export type InsightAccent = 'sky' | 'blue' | 'cyan' | 'orange' | 'rose' | 'emerald'

const ACCENT_BY_CATEGORY: Record<InsightCategoryId, InsightAccent> = {
  'apis-integration': 'sky',
  modernization: 'blue',
  'ai-emerging-tech': 'cyan',
  'operations-performance': 'orange',
  security: 'rose',
  'best-practices': 'emerald',
}

export function getInsightAccent(categoryId: InsightCategoryId): InsightAccent {
  return ACCENT_BY_CATEGORY[categoryId] ?? 'sky'
}

interface InsightAccentClasses {
  badgeBg: string
  badgeText: string
  badgeBorder: string
  topBorder: string
  headerWash: string
  /** Solid, saturated pill background for the category label inside the header banner -- pairs with `text-white`. The one deliberately strong color inside an otherwise soft header (see headerWash below). */
  headerBadgeBg: string
  /** First (upper-right) decorative glow blob -- a soft tint of the category color, echoing it without dominating. */
  headerBlobOne: string
  /** Second (lower-left) decorative glow blob -- a softer, secondary tone. */
  headerBlobTwo: string
}

/**
 * Full, static Tailwind class strings per accent -- not string-interpolated
 * (e.g. `bg-${accent}-50`), so Tailwind's JIT scanner (which only greps
 * ./app, ./components, ./pages -- see tailwind.config.ts) can see them and
 * generate the corresponding CSS at build time. Same pattern as
 * lib/deep-dive-categories.ts's DEEP_DIVE_ACCENT_CLASSES.
 *
 * `headerWash` (Insights Header Visual Refinement) is a soft, light tint --
 * `-50`/`-50/60` stops fading into white, the same weight class as Deep
 * Dive's own headerWash (lib/deep-dive-categories.ts), not the saturated
 * 600/700-range gradient this used to be. That original version painted
 * white text directly on a strong color across the *entire* header banner,
 * which read as heavy (especially the orange/amber/rose combination) and
 * created an abrupt seam against the white article body below. The fade-to-
 * white stop is what makes that seam disappear; app/insights/[slug]/page.tsx
 * pairs this with dark slate text instead of white, and reserves genuinely
 * strong, saturated color for one deliberate accent -- the category pill
 * (`headerBadgeBg`, solid `-700`) -- rather than the whole surface.
 * `-700`, not `-600`: measured contrast against white text (WCAG formula)
 * showed sky/cyan/orange/emerald-600 all fall short of AA's 4.5:1 (3.56-
 * 4.10:1); every color reaches a comfortable 5.1+:1 at `-700`, so all six
 * use that shade for consistency rather than only fixing the ones that
 * happened to fail -- the same "-700 not -600" contrast lesson already
 * applied once before in this codebase (see the `.insight-article
 * .dd-table-wrap table thead tr` gradient comment in app/globals.css).
 * `headerBlobOne`/`headerBlobTwo` are low-opacity decorative echoes of the
 * category color, not load-bearing for contrast (text never sits on them
 * directly at meaningful opacity). `badgeBg`/`badgeText`/`badgeBorder`
 * (pale chips for light backgrounds -- the listing card, etc.) are
 * unaffected by this change.
 */
export const INSIGHT_ACCENT_CLASSES: Record<InsightAccent, InsightAccentClasses> = {
  sky: {
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    topBorder: 'border-t-sky-500',
    headerWash: 'bg-gradient-to-br from-sky-50 via-blue-50/60 to-white',
    headerBadgeBg: 'bg-sky-700',
    headerBlobOne: 'bg-sky-300/25',
    headerBlobTwo: 'bg-blue-300/20',
  },
  blue: {
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    topBorder: 'border-t-blue-500',
    headerWash: 'bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white',
    headerBadgeBg: 'bg-blue-700',
    headerBlobOne: 'bg-blue-300/25',
    headerBlobTwo: 'bg-indigo-300/20',
  },
  cyan: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
    topBorder: 'border-t-cyan-500',
    headerWash: 'bg-gradient-to-br from-cyan-50 via-sky-50/60 to-white',
    headerBadgeBg: 'bg-cyan-700',
    headerBlobOne: 'bg-cyan-300/25',
    headerBlobTwo: 'bg-sky-300/20',
  },
  orange: {
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    topBorder: 'border-t-orange-500',
    headerWash: 'bg-gradient-to-br from-orange-50 via-amber-50/60 to-white',
    headerBadgeBg: 'bg-orange-700',
    headerBlobOne: 'bg-orange-300/25',
    headerBlobTwo: 'bg-amber-300/20',
  },
  rose: {
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    topBorder: 'border-t-rose-500',
    headerWash: 'bg-gradient-to-br from-rose-50 via-pink-50/60 to-white',
    headerBadgeBg: 'bg-rose-700',
    headerBlobOne: 'bg-rose-300/25',
    headerBlobTwo: 'bg-pink-300/20',
  },
  emerald: {
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    topBorder: 'border-t-emerald-500',
    headerWash: 'bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white',
    headerBadgeBg: 'bg-emerald-700',
    headerBlobOne: 'bg-emerald-300/25',
    headerBlobTwo: 'bg-teal-300/20',
  },
}
