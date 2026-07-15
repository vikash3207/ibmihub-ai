/**
 * ACS-Style SQL Practice Console -- deterministic SQL validation engine
 * (Spec 010, PR #139).
 *
 * This is intentionally NOT a SQL parser or execution engine: it never
 * runs anything against a real database (or any database at all). It
 * normalizes a learner's typed SQL (case, whitespace, trailing semicolon)
 * and compares it against a small, exercise-defined, finite set of
 * accepted forms (PracticeLabSqlCheck) -- each with its own predefined
 * result table (lib/practice-lab/types.ts). Anything else is classified
 * into one of a handful of friendly, deterministic outcomes, mirroring
 * lib/practice-lab/5250-simulator.ts's evaluateCommand() design.
 */

import type { PracticeLabSqlCheck, PracticeLabSqlResultTable } from './types'

export type PracticeLabSqlOutcome =
  | 'success'
  | 'empty-input'
  | 'write-statement'
  | 'unsupported-statement'
  | 'missing-clause'
  | 'wrong-table'
  | 'unknown-column'
  | 'wrong-quote-style'
  | 'near-miss'

export interface PracticeLabSqlResult {
  outcome: PracticeLabSqlOutcome
  message: string
  resultTable?: PracticeLabSqlResultTable
}

const WRITE_VERBS = ['INSERT', 'UPDATE', 'DELETE', 'MERGE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE']

/**
 * Uppercase, trim, collapse whitespace, strip one trailing semicolon, and
 * normalize spacing around `,` and `=` so `select custno,name from
 * customer where status='active'` and `SELECT CUSTNO, NAME FROM CUSTOMER
 * WHERE STATUS = 'ACTIVE'` compare equal. Uppercasing also applies inside
 * string literals -- this is a pattern-matching simulator comparing
 * against fixed, fabricated (already-uppercase) sample data, not real SQL
 * with case-sensitive semantics.
 */
export function normalizeSql(raw: string): string {
  return raw
    .trim()
    .replace(/;+\s*$/, '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s*=\s*/g, ' = ')
}

const FALLBACK_MESSAGE = 'This SQL pattern is not available in this practice exercise yet.'
const WRITE_MESSAGE =
  'This practice console does not run INSERT, UPDATE, DELETE, or production SQL in this exercise.'
const QUOTE_MESSAGE = "Use single quotes around text values, like 'CHICAGO', not double quotes."

/**
 * Pull the SELECT column list out of a normalized query (already known to
 * contain " FROM "), split on the normalized ", " separator. Used only by
 * the optional unknown-column check below -- never for computing a query
 * result, which stays purely predefined (PracticeLabAcceptedSqlQuery).
 */
function extractSelectColumns(normalized: string): string[] {
  const afterSelect = normalized.slice('SELECT '.length, normalized.indexOf(' FROM '))
  return afterSelect.split(', ').map((column) => column.trim())
}

/**
 * Classify a learner's typed SQL against one exercise's expected query.
 * Never throws, never executes the input -- pure string comparison
 * against `check`'s finite accepted-forms list.
 */
export function evaluateSql(rawInput: string, check: PracticeLabSqlCheck): PracticeLabSqlResult {
  const normalized = normalizeSql(rawInput)

  if (normalized.length === 0) {
    return { outcome: 'empty-input', message: 'Type a SQL statement before running it.' }
  }

  const match = check.acceptedQueries.find((accepted) => normalizeSql(accepted.query) === normalized)
  if (match) {
    return { outcome: 'success', message: '', resultTable: match.resultTable }
  }

  const firstWord = normalized.split(' ')[0]

  if (WRITE_VERBS.includes(firstWord)) {
    return { outcome: 'write-statement', message: WRITE_MESSAGE }
  }

  if (firstWord !== 'SELECT') {
    return { outcome: 'unsupported-statement', message: FALLBACK_MESSAGE }
  }

  if (!normalized.includes(' FROM ')) {
    return {
      outcome: 'missing-clause',
      message: `Every SELECT needs a FROM naming the table, like FROM ${check.tableName}.`,
    }
  }

  const afterFrom = normalized.slice(normalized.indexOf(' FROM ') + ' FROM '.length)
  const tableToken = afterFrom.split(/[\s;]/)[0]
  if (tableToken !== check.tableName.toUpperCase()) {
    return {
      outcome: 'wrong-table',
      message: `There's no table named ${tableToken} in this lab yet -- check the sample schema panel and try ${check.tableName}.`,
    }
  }

  // Opt-in: only exercises that set knownColumns get column-name checking --
  // skips `*`, function calls like COUNT(*), and alias-qualified references
  // like C.CUSTNO, since this is plain-column validation, not a real
  // column/alias resolver.
  if (check.knownColumns) {
    const knownColumns = new Set(check.knownColumns.map((column) => column.toUpperCase()))
    for (const column of extractSelectColumns(normalized)) {
      if (column === '*' || column.includes('(') || column.includes('.')) continue
      if (!knownColumns.has(column)) {
        return {
          outcome: 'unknown-column',
          message: `Column ${column} was not found in ${check.tableName}. Check the sample schema and try one of: ${check.knownColumns.join(', ')}.`,
        }
      }
    }
  }

  if (normalized.includes('"')) {
    return { outcome: 'wrong-quote-style', message: QUOTE_MESSAGE }
  }

  // Padded with spaces so a short clause keyword (e.g. "ON") can't false-match
  // as a substring inside an unrelated word.
  if (check.requiredClause && !normalized.includes(` ${check.requiredClause.toUpperCase()} `)) {
    return {
      outcome: 'missing-clause',
      message: `This exercise is about using ${check.requiredClause} -- try adding something like ${check.requiredClauseExample}.`,
    }
  }

  return {
    outcome: 'near-miss',
    message: "Close, but that's not quite the expected form for this exercise. Try the hint if you're stuck.",
  }
}
