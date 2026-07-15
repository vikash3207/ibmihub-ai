import { Check, RotateCcw } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

interface Props {
  status: 'idle' | 'trying' | 'success'
  onReset: () => void
}

/**
 * Small status indicator + reset/retry control for an exercise workspace.
 * Purely local UI state -- no progress is persisted anywhere (Spec 010
 * Open Questions; this PR takes no position on persistence).
 */
export function ExerciseProgress({ status, onReset }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          status === 'success'
            ? 'inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
            : status === 'trying'
              ? 'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'
              : 'inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500'
        }
      >
        {status === 'success' && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
        {status === 'success' ? 'Completed' : status === 'trying' ? 'In progress' : 'Not started'}
      </span>

      <button
        type="button"
        onClick={onReset}
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
        Reset exercise
      </button>
    </div>
  )
}
