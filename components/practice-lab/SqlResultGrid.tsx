import type { PracticeLabSqlResultTable } from '@/lib/practice-lab/types'

interface Props {
  resultTable: PracticeLabSqlResultTable | null
}

/**
 * Result grid for a successful simulated query -- a plain HTML table,
 * horizontally scrollable so a wide result never overflows a narrow
 * viewport (Spec 010 mobile requirements). Renders nothing until a query
 * has actually succeeded; SqlMessages carries the "no results yet" /
 * error state instead of this component.
 */
export function SqlResultGrid({ resultTable }: Props) {
  if (!resultTable) {
    return null
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            {resultTable.columns.map((column) => (
              <th key={column} className="px-3 py-2 whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {resultTable.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 whitespace-nowrap text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
