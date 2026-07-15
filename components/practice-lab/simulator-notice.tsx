import { ShieldAlert } from 'lucide-react'

/**
 * Shared safety/disclaimer copy for every Practice Lab page (Spec 010,
 * PR #135). Must appear on the landing page and both module pages -- this
 * is the platform's explicit "guided simulator, not a real system" promise
 * (planning/5250_PRACTICE_LAB_SQL_CONSOLE_DESIGN_PROPOSAL.md Section 1/12),
 * mirroring the same honesty commitment already in the AI Tutor's system
 * prompt (lib/ai/system-prompt.ts).
 */
export function SimulatorNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">
        This is a guided simulator for learning. It does not connect to a real IBM i system.
        Commands and SQL here run only against simulated / sample training data.
      </p>
    </div>
  )
}
