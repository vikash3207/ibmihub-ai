import { buttonVariants } from '@/components/ui/button'

interface Props {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  disabled?: boolean
}

/**
 * The SQL editor pane -- a plain textarea plus a "Run" button, matching
 * ACS "Run SQL Scripts"' basic shape (Spec 010 LAB-FR-012) without a
 * code-editor dependency.
 */
export function SqlEditor({ value, onChange, onRun, disabled }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onRun()
      }}
      className="space-y-2"
    >
      <label htmlFor="practice-lab-sql" className="sr-only">
        SQL statement
      </label>
      <textarea
        id="practice-lab-sql"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={4}
        spellCheck={false}
        placeholder="Type a SQL statement..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50"
      />
      <button type="submit" disabled={disabled} className={buttonVariants({ variant: 'primary' })}>
        Run
      </button>
    </form>
  )
}
