import Link from 'next/link'
import type { Metadata } from 'next'
import { signUp } from '@/lib/actions/auth'
import { AuthCard } from '@/components/auth-card'
import { CaptchaProtectedSubmit } from '@/components/auth/captcha-protected-submit'
import { isTurnstileEnforcementEnabled } from '@/lib/turnstile'
import { safeInternalPath } from '@/lib/auth-redirect'
import { authCopyFor } from '@/lib/auth-destination-content'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Sign Up',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>
}

const GENERIC_SIGNUP_SUBTITLE =
  'Save your progress and unlock the AI Tutor, Practice questions, the Practice Lab, the SQL Console, and your dashboard.'

export default async function SignUpPage({ searchParams }: Props) {
  const { next: rawNext = '/', error } = await searchParams
  // Validated once here, then reused for both the copy lookup and the
  // hidden form field -- the raw query-string value is never rendered.
  const next = safeInternalPath(rawNext, '/')
  const destinationCopy = authCopyFor(next)

  return (
    <AuthCard
      title={destinationCopy?.signupHeading ?? 'Create your account'}
      subtitle={destinationCopy?.signupSubtitle ?? GENERIC_SIGNUP_SUBTITLE}
    >
      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-describedby="email-guidance"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          {/* Deliberately does NOT promise a verification email -- mandatory
              email confirmation is not enabled, and nothing here verifies
              mailbox ownership. */}
          <p id="email-guidance" className="mt-1.5 text-xs leading-relaxed text-slate-500">
            Please use an email address you can access. It may be needed for password recovery and
            important account-related communication.
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <CaptchaProtectedSubmit
          formAction={signUp}
          pendingLabel="Creating account..."
          captchaEnabled={isTurnstileEnforcementEnabled()}
        >
          Create Account
        </CaptchaProtectedSubmit>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthCard>
  )
}
