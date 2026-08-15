import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PreviewAuthCtaProps {
  /** The real protected route this preview stands in for, e.g. `/ai-tutor'. Composed into `next` for both links so a signed-in visit lands back here. */
  next: string
  /** cva variant for the primary "Create Free Account" button -- 'ai' for the AI Tutor preview, 'primary' otherwise. */
  signupVariant?: 'primary' | 'ai'
  className?: string
}

/**
 * Shared Login / Create Free Account CTA row for every signed-out feature
 * preview (Homepage Hierarchy and Signed-Out Feature Discovery). `next` is a
 * literal internal route this module owns the callers of (never user input),
 * so it is passed straight through -- both destination pages
 * (app/auth/login, app/auth/sign-up) re-validate it themselves via
 * safeInternalPath before using it for anything, the same defensive posture
 * every other redirect target in the app gets.
 */
export function PreviewAuthCta({ next, signupVariant = 'primary', className }: PreviewAuthCtaProps) {
  const encodedNext = encodeURIComponent(next)

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      <Link href={`/auth/sign-up?next=${encodedNext}`} className={buttonVariants({ variant: signupVariant, size: 'lg' })}>
        Create Free Account
      </Link>
      <Link href={`/auth/login?next=${encodedNext}`} className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
        Log In
      </Link>
    </div>
  )
}
