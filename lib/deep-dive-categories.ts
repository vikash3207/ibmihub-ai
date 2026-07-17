/**
 * Deep Dives category taxonomy (PR #154 -- Deep Dives Framework + Taxonomy).
 * Deliberately a separate, smaller taxonomy from the 27-entry
 * MASTER_CATEGORIES (lib/master-categories.ts): Deep Dives are a
 * standalone third pillar (non-linear professional topic guides), not
 * part of the linear lesson path that taxonomy was built for, so reusing
 * it would force an awkward fit. This list is intentionally small enough
 * to stay maintainable by hand as the catalog grows.
 *
 * No dependency on lib/lessons.ts or any server-only module, so this file
 * is safe to import from client components (e.g. components/deep-dive-
 * browser.tsx).
 */

export type DeepDiveCategoryId =
  | 'rpgle'
  | 'sql-db2'
  | 'cl-automation'
  | 'database-dds'
  | 'ile-service-programs'
  | 'apis-integration'
  | 'operations-troubleshooting'
  | 'security'
  | 'journaling-commitment-control'
  | 'modernization'
  | 'performance'
  | 'interview-real-world'

export interface DeepDiveCategory {
  id: DeepDiveCategoryId
  label: string
}

export const DEEP_DIVE_CATEGORIES: DeepDiveCategory[] = [
  { id: 'rpgle', label: 'RPGLE' },
  { id: 'sql-db2', label: 'SQL / Db2 for i' },
  { id: 'cl-automation', label: 'CL / Automation' },
  { id: 'database-dds', label: 'Database & DDS' },
  { id: 'ile-service-programs', label: 'ILE & Service Programs' },
  { id: 'apis-integration', label: 'APIs & Integration' },
  { id: 'operations-troubleshooting', label: 'Operations & Troubleshooting' },
  { id: 'security', label: 'Security' },
  { id: 'journaling-commitment-control', label: 'Journaling & Commitment Control' },
  { id: 'modernization', label: 'Modernization' },
  { id: 'performance', label: 'Performance' },
  { id: 'interview-real-world', label: 'Interview & Real-World Scenarios' },
]

const LABEL_BY_ID = new Map(DEEP_DIVE_CATEGORIES.map((c) => [c.id, c.label]))

export function getDeepDiveCategoryLabel(id: DeepDiveCategoryId): string {
  return LABEL_BY_ID.get(id) ?? id
}

export type DeepDiveAccent = 'indigo' | 'teal' | 'amber' | 'rose' | 'emerald' | 'orange' | 'slate'

/**
 * Groups related categories under one of a small, curated set of accent
 * colors rather than giving each of the 12 categories its own color --
 * keeps the listing page feeling like a deliberate palette instead of a
 * rainbow (Product Owner explicitly asked to avoid "too many colors").
 */
const ACCENT_BY_CATEGORY: Record<DeepDiveCategoryId, DeepDiveAccent> = {
  rpgle: 'indigo',
  'ile-service-programs': 'indigo',
  'sql-db2': 'teal',
  'database-dds': 'teal',
  'cl-automation': 'amber',
  'operations-troubleshooting': 'amber',
  security: 'rose',
  'journaling-commitment-control': 'emerald',
  modernization: 'orange',
  performance: 'orange',
  'apis-integration': 'slate',
  'interview-real-world': 'slate',
}

export function getDeepDiveAccent(categoryId: DeepDiveCategoryId): DeepDiveAccent {
  return ACCENT_BY_CATEGORY[categoryId] ?? 'slate'
}

interface DeepDiveAccentClasses {
  badgeBg: string
  badgeText: string
  topBorder: string
}

/**
 * Full, static Tailwind class strings per accent -- not string-interpolated
 * (e.g. `bg-${accent}-50`), so Tailwind's JIT scanner (which only greps
 * ./app, ./components, ./pages -- see tailwind.config.ts) can see them and
 * generate the corresponding CSS at build time. Same reasoning as
 * components/lesson-category-accent.ts (PR #146).
 */
export const DEEP_DIVE_ACCENT_CLASSES: Record<DeepDiveAccent, DeepDiveAccentClasses> = {
  indigo: { badgeBg: 'bg-indigo-50', badgeText: 'text-indigo-700', topBorder: 'border-t-indigo-500' },
  teal: { badgeBg: 'bg-teal-50', badgeText: 'text-teal-700', topBorder: 'border-t-teal-500' },
  amber: { badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', topBorder: 'border-t-amber-500' },
  rose: { badgeBg: 'bg-rose-50', badgeText: 'text-rose-700', topBorder: 'border-t-rose-500' },
  emerald: { badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', topBorder: 'border-t-emerald-500' },
  orange: { badgeBg: 'bg-orange-50', badgeText: 'text-orange-700', topBorder: 'border-t-orange-500' },
  slate: { badgeBg: 'bg-slate-100', badgeText: 'text-slate-700', topBorder: 'border-t-slate-400' },
}
