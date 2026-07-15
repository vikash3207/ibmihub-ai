/**
 * SQL Practice Console -- planned exercise list (PR #135 skeleton).
 *
 * Sourced from planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
 * Section 5 (PR #134). Every exercise is `status: 'planned'` in this PR --
 * no SQL validation/execution engine exists yet (see lib/practice-lab/
 * types.ts header). That is PR #137's scope.
 */
import type { PracticeLabExercise } from '@/lib/practice-lab/types'

export const PRACTICE_LAB_SQL_EXERCISES: PracticeLabExercise[] = [
  {
    id: 'sql-01',
    slug: 'select-all-rows',
    title: 'SELECT all rows',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Run the most basic query shape and read a resulting table.',
    learningObjectives: ['Write a SELECT * FROM query', 'Read a result table'],
    relatedLessonSlugs: ['basic-select-on-ibm-i'],
    status: 'planned',
  },
  {
    id: 'sql-02',
    slug: 'select-specific-columns',
    title: 'SELECT specific columns',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Understand column projection instead of always using SELECT *.',
    learningObjectives: ['Select a specific column list', 'Explain why picking columns can be preferable to *'],
    relatedLessonSlugs: ['basic-select-on-ibm-i'],
    status: 'planned',
  },
  {
    id: 'sql-03',
    slug: 'where-filter',
    title: 'WHERE filter',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Filter rows by a condition using WHERE.',
    learningObjectives: ['Write a WHERE condition', 'Explain why text values need quotes and numbers don\'t'],
    relatedLessonSlugs: ['basic-where-conditions-in-embedded-sql'],
    status: 'planned',
  },
  {
    id: 'sql-04',
    slug: 'order-by',
    title: 'ORDER BY',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Control result row ordering explicitly instead of assuming a default order.',
    learningObjectives: ['Write an ORDER BY clause', 'Explain there is no guaranteed default row order without one'],
    relatedLessonSlugs: ['order-by-and-result-ordering'],
    status: 'planned',
  },
  {
    id: 'sql-05',
    slug: 'simple-join',
    title: 'Simple JOIN',
    labType: 'sql',
    difficulty: 'intermediate',
    summary: 'Combine two related tables via a shared key.',
    learningObjectives: ['Write a two-table JOIN with an ON condition', 'Explain what happens if ON is omitted'],
    relatedLessonSlugs: ['simple-join-in-sqlrpgle'],
    status: 'planned',
  },
  {
    id: 'sql-06',
    slug: 'count-group-by',
    title: 'Aggregate COUNT / GROUP BY',
    labType: 'sql',
    difficulty: 'intermediate',
    summary: 'Summarize rows into per-group counts.',
    learningObjectives: ['Write a GROUP BY with COUNT(*)', 'Explain why non-aggregated columns must be grouped'],
    // No lesson in the current catalog covers GROUP BY/aggregates directly yet --
    // a content gap already flagged in planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
    // Section 5 (Exercise 6). Left empty rather than pointing at a loosely-related
    // lesson, consistent with this platform's existing "don't overclaim coverage" rule.
    relatedLessonSlugs: [],
    status: 'planned',
  },
  {
    id: 'sql-07',
    slug: 'sqlcode-100-concept',
    title: 'SQLCODE 100 / no row found concept',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Recognize that "no rows found" (SQLCODE 100) is a normal, expected outcome -- not an error.',
    learningObjectives: ['Run a query that matches no rows', 'Explain that SQLCODE 100 is not a failure'],
    relatedLessonSlugs: ['sqlcode-and-sqlstate-basics-in-sqlrpgle', 'sqlca-sqlcode-and-sqlstate-in-depth'],
    status: 'planned',
  },
  {
    id: 'sql-08',
    slug: 'update-concept-simulated',
    title: 'UPDATE concept (safe simulated mode)',
    labType: 'sql',
    difficulty: 'intermediate',
    summary: "Understand UPDATE's SET + WHERE shape and the danger of an unfiltered UPDATE -- always simulated, never a real write.",
    learningObjectives: ['Write an UPDATE with SET and WHERE', 'Explain why a WHERE-less UPDATE is dangerous'],
    relatedLessonSlugs: ['update-and-delete-with-embedded-sql'],
    status: 'planned',
  },
  {
    id: 'sql-09',
    slug: 'insert-concept-simulated',
    title: 'INSERT concept (safe simulated mode)',
    labType: 'sql',
    difficulty: 'intermediate',
    summary: "Understand INSERT's columns-plus-values shape -- always simulated, never a real write.",
    learningObjectives: ['Write an INSERT with a column list and matching values', 'Explain a column-count/value-count mismatch error'],
    relatedLessonSlugs: ['insert-with-embedded-sql'],
    status: 'planned',
  },
  {
    id: 'sql-10',
    slug: 'invalid-column-table-error',
    title: 'Troubleshoot invalid column/table error',
    labType: 'sql',
    difficulty: 'intermediate',
    summary: 'Read and act on a real-looking "object not found" SQL error.',
    learningObjectives: ['Recognize a misspelled column/table error', 'Explain SQLSTATE 42703 / 42704 in plain language'],
    relatedLessonSlugs: ['common-advanced-sql-mistakes-on-ibm-i', 'sqlcode-and-sqlstate-basics-in-sqlrpgle'],
    status: 'planned',
  },
]
