import type { MasterCategoryId } from '@/content/lessons/metadata'

/**
 * Category-based accent theme for lesson pages (PR #146 visual enrichment).
 * Groups the 27 master categories into a small, professional palette rather
 * than one color per category, so the effect reads as "this lesson belongs
 * to a themed area" instead of a rainbow of unrelated hues.
 */
export type LessonAccent =
  | 'blue'
  | 'cyan'
  | 'amber'
  | 'indigo'
  | 'teal'
  | 'rose'
  | 'emerald'
  | 'slate'
  | 'orange'

const ACCENT_BY_CATEGORY: Partial<Record<MasterCategoryId, LessonAccent>> = {
  'ibm-i-platform-fundamentals': 'blue',
  'modern-development-tools': 'blue',
  'career-certification-path': 'blue',

  '5250-terminal-navigation': 'cyan',
  'screen-ui-development': 'cyan',
  'printer-report-programming': 'cyan',

  'cl-programming': 'amber',
  'job-work-management': 'amber',
  'system-administration': 'amber',

  'rpg-programming': 'indigo',
  'cobol-on-ibm-i': 'indigo',
  'ile-concepts': 'indigo',

  'database-fundamentals': 'teal',
  'sql-on-ibm-i': 'teal',
  'database-design-advanced-db2': 'teal',
  'legacy-query-tools': 'teal',

  'security-on-ibm-i': 'rose',

  'journaling-commitment-control': 'emerald',
  'backup-ha-enterprise-tooling': 'emerald',

  'object-library-management': 'slate',
  'apis-system-interfaces': 'slate',
  ifs: 'slate',
  'integration-connectivity': 'slate',

  'web-open-source': 'orange',
  'change-management-devops': 'orange',
  'performance-tuning': 'orange',
  'modernization-topics': 'orange',
}

const DEFAULT_ACCENT: LessonAccent = 'blue'

export function getLessonAccent(masterCategoryId: string | null | undefined): LessonAccent {
  if (!masterCategoryId) return DEFAULT_ACCENT
  return ACCENT_BY_CATEGORY[masterCategoryId as MasterCategoryId] ?? DEFAULT_ACCENT
}

interface LessonAccentClasses {
  /** Card top-edge accent strip. */
  topBorder: string
  /** Eyebrow ("Lesson N of M") text color. */
  eyebrowText: string
  /** Category badge pill. */
  badgeBg: string
  badgeText: string
  badgeBorder: string
  /** Subtle header background wash, edge to edge behind the title block. */
  headerWash: string
}

/**
 * Full, static Tailwind class strings per accent -- deliberately not built by
 * string-interpolating the accent name (e.g. `bg-${accent}-50`). Tailwind's
 * JIT scanner only greps literal class strings out of file contents; it
 * cannot evaluate template expressions, and only ./app, ./components, and
 * ./pages are configured as scan roots (see tailwind.config.ts). Keeping
 * every class spelled out here, in a file under components/, guarantees the
 * generated CSS actually exists at build time.
 */
export const LESSON_ACCENT_CLASSES: Record<LessonAccent, LessonAccentClasses> = {
  blue: {
    topBorder: 'border-t-blue-500',
    eyebrowText: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    headerWash: 'bg-gradient-to-br from-blue-50 via-white to-white',
  },
  cyan: {
    topBorder: 'border-t-cyan-500',
    eyebrowText: 'text-cyan-600',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200',
    headerWash: 'bg-gradient-to-br from-cyan-50 via-white to-white',
  },
  amber: {
    topBorder: 'border-t-amber-500',
    eyebrowText: 'text-amber-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    headerWash: 'bg-gradient-to-br from-amber-50 via-white to-white',
  },
  indigo: {
    topBorder: 'border-t-indigo-500',
    eyebrowText: 'text-indigo-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    headerWash: 'bg-gradient-to-br from-indigo-50 via-white to-white',
  },
  teal: {
    topBorder: 'border-t-teal-500',
    eyebrowText: 'text-teal-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    headerWash: 'bg-gradient-to-br from-teal-50 via-white to-white',
  },
  rose: {
    topBorder: 'border-t-rose-500',
    eyebrowText: 'text-rose-600',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    headerWash: 'bg-gradient-to-br from-rose-50 via-white to-white',
  },
  emerald: {
    topBorder: 'border-t-emerald-500',
    eyebrowText: 'text-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerWash: 'bg-gradient-to-br from-emerald-50 via-white to-white',
  },
  slate: {
    topBorder: 'border-t-slate-400',
    eyebrowText: 'text-slate-600',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    headerWash: 'bg-gradient-to-br from-slate-100 via-white to-white',
  },
  orange: {
    topBorder: 'border-t-orange-500',
    eyebrowText: 'text-orange-600',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    headerWash: 'bg-gradient-to-br from-orange-50 via-white to-white',
  },
}
