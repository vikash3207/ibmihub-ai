import { Rocket } from 'lucide-react'
import type { ReactNode } from 'react'
import { CONTACT_EMAIL } from '@/lib/config'
import { cn } from '@/lib/utils'

interface PublicBetaNoticeProps {
  className?: string
  /** Smaller padding/text for space-constrained spots (dashboard welcome area, /learn's header, /contact's hero). */
  compact?: boolean
  /** Overrides the default beta message -- used by /learn for its own curriculum-specific copy. Callers own their own feedback-email wording if they want one. */
  children?: ReactNode
}

/**
 * Reusable public-beta / roadmap notice (PR #151). One shared component so
 * every surface it appears on (homepage, /learn, dashboard, /contact) reads
 * consistently rather than each page inventing its own banner. Deliberately
 * a single, subtle inline card -- not a dismissible/sticky banner -- so it
 * can't get "stuck" open or require any client-side state.
 */
export function PublicBetaNotice({ className, compact, children }: PublicBetaNoticeProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-cyan-50/60 to-blue-50 shadow-sm',
        compact ? 'px-4 py-3' : 'px-5 py-4 sm:px-6 sm:py-5',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white',
            compact ? 'h-7 w-7' : 'h-9 w-9'
          )}
        >
          <Rocket className={compact ? 'h-3.5 w-3.5' : 'h-5 w-5'} aria-hidden="true" />
        </span>
        <p className={cn('text-slate-700 leading-relaxed', compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base')}>
          {children ?? (
            <>
              <span className="font-semibold text-slate-900">iRPGenie is currently in public beta.</span>{' '}
              We are actively expanding the platform with deeper professional-grade IBM&nbsp;i, RPGLE,
              SQL, and operations content. Our goal is to make this an all-in-one learning hub for
              IBM&nbsp;i learners and working professionals. Stay tuned
              {CONTACT_EMAIL && (
                <>
                  {' '}
                  — and{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=iRPGenie%20feedback`}
                    className="font-medium text-blue-700 underline hover:text-blue-900"
                  >
                    share your feedback
                  </a>
                </>
              )}
              .
            </>
          )}
        </p>
      </div>
    </div>
  )
}
