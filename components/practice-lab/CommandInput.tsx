import { buttonVariants } from '@/components/ui/button'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

/**
 * The single command-line input, matching the 5250 "type a command, press
 * Enter" model (Spec 010 LAB-FR-004) -- deliberately just one line, no
 * exact keyboard/AID-key emulation.
 */
export function CommandInput({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="practice-lab-command" className="sr-only">
        Command
      </label>
      <input
        id="practice-lab-command"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type a command..."
        autoComplete="off"
        spellCheck={false}
        className="w-full flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50"
      />
      <button type="submit" disabled={disabled} className={buttonVariants({ variant: 'primary' })}>
        Enter
      </button>
    </form>
  )
}
