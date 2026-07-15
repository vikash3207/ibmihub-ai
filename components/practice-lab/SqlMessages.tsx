interface Props {
  message?: string
  tone: 'info' | 'success' | 'error'
}

/**
 * The messages/errors pane -- kept separate from the result grid
 * (Spec 010 LAB-FR-012), matching ACS's own separation of a result set
 * from its messages/job log, so a learner learns to associate errors with
 * a distinct panel rather than an inline popup on the grid itself.
 */
export function SqlMessages({ message, tone }: Props) {
  if (!message) {
    return null
  }

  return (
    <div
      className={
        tone === 'success'
          ? 'rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800'
          : tone === 'error'
            ? 'rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-900'
            : 'rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600'
      }
    >
      {message}
    </div>
  )
}
