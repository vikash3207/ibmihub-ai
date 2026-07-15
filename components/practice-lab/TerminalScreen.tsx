import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Bottom status/message line, mirroring a real 5250 session's message area -- shown for both success and friendly-error feedback. */
  statusMessage?: string
  statusTone?: 'info' | 'success' | 'error'
}

/**
 * Green-screen-inspired terminal chrome (Spec 010 LAB-FR-004): dark
 * background, monospace text, a bounded scrollable body, and a bottom
 * status/message line. Deliberately not a real terminal emulator -- no
 * cursor/field navigation, no keyboard capture beyond the command input
 * rendered below it by the caller.
 */
export function TerminalScreen({ children, statusMessage, statusTone = 'info' }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-sm text-emerald-400 shadow-inner">
      <div className="overflow-x-auto p-4 font-mono leading-relaxed">{children}</div>
      {statusMessage && (
        <div
          className={
            statusTone === 'success'
              ? 'border-t border-slate-800 bg-emerald-950/60 px-4 py-2 font-mono text-xs text-emerald-300'
              : statusTone === 'error'
                ? 'border-t border-slate-800 bg-amber-950/40 px-4 py-2 font-mono text-xs text-amber-300'
                : 'border-t border-slate-800 px-4 py-2 font-mono text-xs text-slate-400'
          }
        >
          {statusMessage}
        </div>
      )}
    </div>
  )
}
