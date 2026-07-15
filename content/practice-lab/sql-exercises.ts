/**
 * SQL Practice Console -- exercise list.
 *
 * Sourced from planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md
 * Section 5 (PR #134). PR #139 implements the first four exercises
 * (select-all, select-columns, where-filter, order-by) end-to-end --
 * `status: 'available'` with full simulator content -- against the shared
 * CUSTOMER sample table (./sql-sample-schema.ts). The remaining six stay
 * `status: 'planned'` for later PRs (JOIN, GROUP BY, SQLCODE 100,
 * simulated INSERT/UPDATE, invalid-table troubleshooting).
 *
 * Renamed two PR #135 placeholder slugs to match PR #139's requested
 * routes -- `select-all-rows` -> `select-all`, `select-specific-columns`
 * -> `select-columns` -- safe since neither was ever interactive/linked
 * before now.
 *
 * All simulated data (customer rows/result tables) is fabricated training
 * data computed from ./sql-sample-schema.ts, never a real database query
 * result (Spec 010 Safety Rules).
 */
import type { PracticeLabExercise } from '@/lib/practice-lab/types'
import { CUSTOMER_TABLE_NAME, CUSTOMER_COLUMNS, CUSTOMER_ROWS, projectRows } from './sql-sample-schema'

const ALL_COLUMNS = [...CUSTOMER_COLUMNS]

export const PRACTICE_LAB_SQL_EXERCISES: PracticeLabExercise[] = [
  {
    id: 'sql-01',
    slug: 'select-all',
    title: 'SELECT all rows',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Run the most basic query shape and read a resulting table.',
    learningObjectives: ['Write a SELECT * FROM query', 'Read a result table'],
    relatedLessonSlugs: ['basic-select-on-ibm-i'],
    status: 'available',
    instructions: 'SELECT * returns every column for every row. Try: SELECT * FROM CUSTOMER',
    starterSql: 'SELECT * FROM CUSTOMER',
    sqlCheck: {
      tableName: CUSTOMER_TABLE_NAME,
      acceptedQueries: [
        {
          query: 'SELECT * FROM CUSTOMER',
          resultTable: { columns: ALL_COLUMNS, rows: projectRows(CUSTOMER_ROWS, ALL_COLUMNS) },
        },
      ],
    },
    hints: [
      'SELECT * FROM CUSTOMER means "every column, every row" -- the * is a shorthand for all columns.',
      'A trailing semicolon is optional here -- SELECT * FROM CUSTOMER; works the same as without it.',
    ],
    successMessage:
      'This shows every column and every row in the CUSTOMER sample table. SELECT * is the simplest ' +
      'query shape, but picking specific columns (next exercise) is usually clearer once a table has many.',
  },
  {
    id: 'sql-02',
    slug: 'select-columns',
    title: 'SELECT specific columns',
    labType: 'sql',
    difficulty: 'beginner',
    summary: 'Understand column projection instead of always using SELECT *.',
    learningObjectives: ['Select a specific column list', 'Explain why picking columns can be preferable to *'],
    relatedLessonSlugs: ['basic-select-on-ibm-i'],
    status: 'available',
    instructions:
      'Naming columns instead of using * returns only what you ask for. Try: SELECT CUSTNO, NAME FROM CUSTOMER',
    starterSql: 'SELECT CUSTNO, NAME FROM CUSTOMER',
    sqlCheck: {
      tableName: CUSTOMER_TABLE_NAME,
      acceptedQueries: [
        {
          query: 'SELECT CUSTNO, NAME FROM CUSTOMER',
          resultTable: { columns: ['CUSTNO', 'NAME'], rows: projectRows(CUSTOMER_ROWS, ['CUSTNO', 'NAME']) },
        },
        {
          query: 'SELECT NAME, CITY FROM CUSTOMER',
          resultTable: { columns: ['NAME', 'CITY'], rows: projectRows(CUSTOMER_ROWS, ['NAME', 'CITY']) },
        },
      ],
    },
    hints: [
      'List the columns you want, separated by commas: SELECT CUSTNO, NAME FROM CUSTOMER.',
      'Column order in the SELECT list is the column order in the result -- try SELECT NAME, CITY FROM CUSTOMER too.',
    ],
    successMessage:
      'Notice only the columns you named come back, in the order you named them -- not every column like ' +
      'SELECT * would return. This is usually what you want once a table has columns you do not need.',
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
    status: 'available',
    instructions:
      "WHERE filters which rows come back. Try: SELECT * FROM CUSTOMER WHERE CITY = 'CHICAGO'",
    starterSql: "SELECT * FROM CUSTOMER WHERE CITY = 'CHICAGO'",
    sqlCheck: {
      tableName: CUSTOMER_TABLE_NAME,
      requiredClause: 'WHERE',
      requiredClauseExample: "WHERE CITY = 'CHICAGO'",
      acceptedQueries: [
        {
          query: "SELECT * FROM CUSTOMER WHERE CITY = 'CHICAGO'",
          resultTable: {
            columns: ALL_COLUMNS,
            rows: projectRows(
              CUSTOMER_ROWS.filter((r) => r.CITY === 'CHICAGO'),
              ALL_COLUMNS
            ),
          },
        },
        {
          query: "SELECT CUSTNO, NAME FROM CUSTOMER WHERE STATUS = 'ACTIVE'",
          resultTable: {
            columns: ['CUSTNO', 'NAME'],
            rows: projectRows(
              CUSTOMER_ROWS.filter((r) => r.STATUS === 'ACTIVE'),
              ['CUSTNO', 'NAME']
            ),
          },
        },
      ],
    },
    hints: [
      "Text values need single quotes, like WHERE CITY = 'CHICAGO' -- not double quotes and not bare.",
      "Try filtering on a different column too: WHERE STATUS = 'ACTIVE'.",
    ],
    successMessage:
      "Only rows matching the WHERE condition come back -- without it, every row in the table would " +
      "return, which is rarely what you actually want once a table has more than a handful of rows.",
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
    status: 'available',
    instructions:
      'ORDER BY controls the order rows come back in. Try: SELECT * FROM CUSTOMER ORDER BY NAME',
    starterSql: 'SELECT * FROM CUSTOMER ORDER BY NAME',
    sqlCheck: {
      tableName: CUSTOMER_TABLE_NAME,
      requiredClause: 'ORDER BY',
      requiredClauseExample: 'ORDER BY NAME',
      acceptedQueries: [
        {
          query: 'SELECT * FROM CUSTOMER ORDER BY NAME',
          resultTable: {
            columns: ALL_COLUMNS,
            rows: projectRows(
              [...CUSTOMER_ROWS].sort((a, b) => a.NAME.localeCompare(b.NAME)),
              ALL_COLUMNS
            ),
          },
        },
        {
          query: 'SELECT CUSTNO, NAME, CITY FROM CUSTOMER ORDER BY CITY',
          resultTable: {
            columns: ['CUSTNO', 'NAME', 'CITY'],
            rows: projectRows(
              [...CUSTOMER_ROWS].sort((a, b) => a.CITY.localeCompare(b.CITY)),
              ['CUSTNO', 'NAME', 'CITY']
            ),
          },
        },
      ],
    },
    hints: [
      'ORDER BY goes after WHERE (if any) and names the column to sort by: ORDER BY NAME.',
      'Try sorting by a different column too: ORDER BY CITY.',
    ],
    successMessage:
      'Without ORDER BY, a query has no guaranteed row order at all -- it can happen to look sorted and ' +
      'then not, even for the exact same query, once the underlying data changes. ORDER BY is the only way ' +
      'to guarantee an order.',
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
