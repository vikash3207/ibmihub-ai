import { cn } from '@/lib/utils'

interface ProgressBarProps {
  /** Whole-number percent, 0-100. */
  percent: number
  /**
   * Accessible name, e.g. "IBM i Fundamentals progress". Required: a bare
   * progressbar with no name is meaningless to a screen reader, and every
   * caller here has a real label available.
   */
  label: string
  className?: string
  tone?: 'blue' | 'emerald'
}

/**
 * Shared accessible progress bar (PR #178 -- Dashboard).
 *
 * Exposes a real `role="progressbar"` with aria-valuenow/min/max so the
 * value is announced, rather than conveying progress only through the
 * width of a colored div. Every caller also renders the same number as
 * visible text nearby, so progress is never communicated by color alone.
 */
export function ProgressBar({ percent, label, className, tone = 'blue' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] motion-reduce:transition-none',
          tone === 'emerald' ? 'bg-emerald-500' : 'bg-blue-600'
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
