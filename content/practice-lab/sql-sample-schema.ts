/**
 * SQL Practice Console -- shared sample schema (Spec 010, PR #139/#141).
 *
 * Small, fixed, fabricated in-memory tables (CUSTOMER, ORDHDR), reused by
 * every SQL exercise and by the console's schema panel. Never a real
 * database -- `projectRows()`/`joinCustomerOrders()`/`groupCustomerCount()`
 * below are plain array filtering/mapping/counting over this fixed data,
 * computed once at module load, not a query engine executing learner-
 * supplied SQL (see lib/practice-lab/sql-simulator.ts for how a learner's
 * typed SQL is validated against a finite accepted-forms list, entirely
 * separately from this file).
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

export const ORDHDR_TABLE_NAME = 'ORDHDR'
export const ORDHDR_COLUMNS = ['ORDERNO', 'CUSTNO', 'ORDERDATE', 'TOTAL'] as const

export interface OrdhdrRow {
  ORDERNO: string
  CUSTNO: string
  ORDERDATE: string
  TOTAL: string
}

/**
 * Fixed, fabricated order data (PR #141) -- deliberately not every customer
 * has an order (1003, 1005 have none), so the JOIN exercise's result
 * visibly excludes them, teaching the inner-join "only matching rows"
 * behavior instead of looking identical to a plain CUSTOMER listing.
 */
export const ORDHDR_ROWS: OrdhdrRow[] = [
  { ORDERNO: '5001', CUSTNO: '1001', ORDERDATE: '2026-01-15', TOTAL: '250.00' },
  { ORDERNO: '5002', CUSTNO: '1002', ORDERDATE: '2026-01-18', TOTAL: '125.50' },
  { ORDERNO: '5003', CUSTNO: '1001', ORDERDATE: '2026-02-02', TOTAL: '75.25' },
  { ORDERNO: '5004', CUSTNO: '1004', ORDERDATE: '2026-02-10', TOTAL: '300.00' },
]

/** Project a fixed set of rows down to a column list, in column order -- plain array mapping, not SQL execution. */
export function projectRows<T extends object>(rows: T[], columns: string[]): string[][] {
  return rows.map((row) => columns.map((col) => (row as Record<string, string>)[col] ?? ''))
}

/**
 * Fixed inner join of CUSTOMER and ORDHDR on CUSTNO -- plain array
 * filtering/mapping over the two fixed tables above, computed once, not a
 * query engine. Customers with no matching order row are correctly
 * excluded, exactly like a real INNER JOIN.
 */
export function joinCustomerOrders(): { CUSTNO: string; NAME: string; ORDERNO: string; TOTAL: string }[] {
  const result: { CUSTNO: string; NAME: string; ORDERNO: string; TOTAL: string }[] = []
  for (const order of ORDHDR_ROWS) {
    const customer = CUSTOMER_ROWS.find((c) => c.CUSTNO === order.CUSTNO)
    if (customer) {
      result.push({ CUSTNO: customer.CUSTNO, NAME: customer.NAME, ORDERNO: order.ORDERNO, TOTAL: order.TOTAL })
    }
  }
  return result
}

/**
 * Fixed per-value row count over CUSTOMER, in first-occurrence order --
 * plain array counting, not a query engine.
 */
export function groupCustomerCount(column: keyof CustomerRow): string[][] {
  const counts = new Map<string, number>()
  for (const row of CUSTOMER_ROWS) {
    const key = row[column]
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries()).map(([key, count]) => [key, String(count)])
}
