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
}

/**
 * Full, static Tailwind class strings per accent -- not string-interpolated
 * (e.g. `bg-${accent}-50`), so Tailwind's JIT scanner (which only greps
 * ./app, ./components, ./pages -- see tailwind.config.ts) can see them and
 * generate the corresponding CSS at build time. Same pattern as
 * lib/deep-dive-categories.ts's DEEP_DIVE_ACCENT_CLASSES.
 *
 * `headerWash` (PR #202 visual-design pass) is a saturated, blue/cyan/
 * violet-forward gradient -- deliberately in the 600/700 range, never a
 * -50/-100 tint, so the white text app/insights/[slug]/page.tsx's header
 * banner paints on top of it stays comfortably above WCAG AA contrast
 * regardless of where the gradient's diagonal lands. It is used in exactly
 * one place (that page's hero-style header banner) -- badgeBg/badgeText/
 * badgeBorder remain pale chips for light backgrounds (the listing card,
 * etc.) and are unaffected by this change.
 */
export const INSIGHT_ACCENT_CLASSES: Record<InsightAccent, InsightAccentClasses> = {
  sky: {
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    topBorder: 'border-t-sky-500',
    headerWash: 'bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500',
  },
  blue: {
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    topBorder: 'border-t-blue-500',
    headerWash: 'bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-600',
  },
  cyan: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
    topBorder: 'border-t-cyan-500',
    headerWash: 'bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600',
  },
  orange: {
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    topBorder: 'border-t-orange-500',
    headerWash: 'bg-gradient-to-br from-orange-600 via-amber-600 to-rose-500',
  },
  rose: {
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    topBorder: 'border-t-rose-500',
    headerWash: 'bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600',
  },
  emerald: {
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    topBorder: 'border-t-emerald-500',
    headerWash: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600',
  },
}
