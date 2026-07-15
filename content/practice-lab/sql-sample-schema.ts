/**
 * SQL Practice Console -- shared sample schema (Spec 010, PR #139).
 *
 * One small, fixed, fabricated in-memory table (CUSTOMER), reused by every
 * SQL exercise and by the console's schema panel. Never a real database --
 * `projectRows()` below is plain array filtering/mapping over this fixed
 * data, computed once at module load, not a query engine executing
 * learner-supplied SQL (see lib/practice-lab/sql-simulator.ts for how a
 * learner's typed SQL is validated against a finite accepted-forms list,
 * entirely separately from this file).
 */

export const CUSTOMER_TABLE_NAME = 'CUSTOMER'
export const CUSTOMER_COLUMNS = ['CUSTNO', 'NAME', 'CITY', 'STATUS'] as const

export interface CustomerRow {
  CUSTNO: string
  NAME: string
  CITY: string
  STATUS: string
}

/** Fixed, fabricated training data -- never real customer data, never read from Supabase or any real database. */
export const CUSTOMER_ROWS: CustomerRow[] = [
  { CUSTNO: '1001', NAME: 'Alex Rivera', CITY: 'CHICAGO', STATUS: 'ACTIVE' },
  { CUSTNO: '1002', NAME: 'Jordan Lee', CITY: 'DALLAS', STATUS: 'ACTIVE' },
  { CUSTNO: '1003', NAME: 'Casey Kim', CITY: 'CHICAGO', STATUS: 'INACTIVE' },
  { CUSTNO: '1004', NAME: 'Morgan Diaz', CITY: 'ATLANTA', STATUS: 'ACTIVE' },
  { CUSTNO: '1005', NAME: 'Taylor Brooks', CITY: 'DALLAS', STATUS: 'INACTIVE' },
]

/** Project a fixed set of rows down to a column list, in column order -- plain array mapping, not SQL execution. */
export function projectRows(rows: CustomerRow[], columns: string[]): string[][] {
  return rows.map((row) => columns.map((col) => row[col as keyof CustomerRow] ?? ''))
}
