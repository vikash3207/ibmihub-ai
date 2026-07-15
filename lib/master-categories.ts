/**
 * Master IBM i / AS400 category taxonomy for Learning Center browsing.
 * IDs and order match the 27-category master list from
 * planning/IBM_I_MASTER_TOPIC_COVERAGE_AUDIT.md (PR #110) and the
 * MasterCategoryId type in content/lessons/metadata.ts (PR #121).
 *
 * Only a type-only import is possible here (no import at all, in fact --
 * this file has no dependency on lib/lessons.ts), so it is safe to import
 * from client components like components/lesson-browser.tsx.
 */

export interface MasterCategory {
  id: string
  label: string
}

export const MASTER_CATEGORIES: MasterCategory[] = [
  { id: 'ibm-i-platform-fundamentals', label: 'IBM i Platform Fundamentals' },
  { id: '5250-terminal-navigation', label: '5250 Terminal & Navigation' },
  { id: 'cl-programming', label: 'CL Programming' },
  { id: 'object-library-management', label: 'Object & Library Management' },
  { id: 'database-fundamentals', label: 'Database Fundamentals' },
  { id: 'sql-on-ibm-i', label: 'SQL on IBM i' },
  { id: 'database-design-advanced-db2', label: 'Database Design & Advanced DB2 for i' },
  { id: 'rpg-programming', label: 'RPG Programming' },
  { id: 'cobol-on-ibm-i', label: 'COBOL on IBM i' },
  { id: 'ile-concepts', label: 'ILE Concepts' },
  { id: 'screen-ui-development', label: 'Screen & UI Development' },
  { id: 'printer-report-programming', label: 'Printer & Report Programming' },
  { id: 'security-on-ibm-i', label: 'Security on IBM i' },
  { id: 'job-work-management', label: 'Job & Work Management' },
  { id: 'system-administration', label: 'System Administration' },
  { id: 'journaling-commitment-control', label: 'Journaling & Commitment Control' },
  { id: 'apis-system-interfaces', label: 'APIs & System Interfaces' },
  { id: 'ifs', label: 'IFS' },
  { id: 'modern-development-tools', label: 'Modern Development Tools' },
  { id: 'web-open-source', label: 'Web & Open Source on IBM i' },
  { id: 'integration-connectivity', label: 'Integration & Connectivity' },
  { id: 'backup-ha-enterprise-tooling', label: 'Backup, High Availability & Enterprise Tooling' },
  { id: 'legacy-query-tools', label: 'Legacy & Query Tools' },
  { id: 'change-management-devops', label: 'Change Management & DevOps' },
  { id: 'performance-tuning', label: 'Performance Tuning' },
  { id: 'modernization-topics', label: 'Modernization Topics' },
  { id: 'career-certification-path', label: 'Career & Certification Path' },
]

const LABEL_BY_ID = new Map(MASTER_CATEGORIES.map((c) => [c.id, c.label]))

/** Return the display label for a masterCategoryId, or undefined if unset/unknown. */
export function getMasterCategoryLabel(id: string | null | undefined): string | undefined {
  if (!id) return undefined
  return LABEL_BY_ID.get(id)
}

export interface MasterCategoryCount extends MasterCategory {
  count: number
}

/**
 * Count how many of the given lessons fall into each master category, in
 * master-list order. Callers should always pass an already Published-only
 * lesson list (e.g. from getPublishedLessons()) so counts never include
 * Review Ready/Draft lessons -- this function has no status awareness of
 * its own, it just counts whatever it's given.
 */
export function getMasterCategoryCounts(
  lessons: { master_category_id?: string | null }[]
): MasterCategoryCount[] {
  const counts = new Map<string, number>()
  for (const lesson of lessons) {
    if (!lesson.master_category_id) continue
    counts.set(lesson.master_category_id, (counts.get(lesson.master_category_id) ?? 0) + 1)
  }
  return MASTER_CATEGORIES.map((category) => ({ ...category, count: counts.get(category.id) ?? 0 }))
}
