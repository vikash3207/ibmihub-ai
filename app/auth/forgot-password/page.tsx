import Link from 'next/link'
import type { Metadata } from 'next'
import { forgotPassword } from '@/lib/actions/auth'
import { AuthCard } from '@/components/auth-card'
import { CaptchaProtectedSubmit } from '@/components/auth/captcha-protected-submit'
import { isTurnstileEnforcementEnabled } from '@/lib/turnstile'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Forgot Password',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ message?: string; error?: string }>
}

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { message, error } = await searchParams

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email address and we'll send you a reset link.">
      {message && (
        <div role="status" className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4">
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <CaptchaProtectedSubmit
          formAction={async (formData) => {
            'use server'
            const result = await forgotPassword(formData)
            const { redirect } = await import('next/navigation')
            // forgotPassword now returns either a validation/captcha error or
            // the deliberately non-specific success message (which is shown
            // whether or not the address is registered).
            redirect(
              result.error
                ? `/auth/forgot-password?error=${encodeURIComponent(result.error)}`
                : `/auth/forgot-password?message=${encodeURIComponent(result.message ?? '')}`
            )
          }}
          pendingLabel="Sending..."
          captchaEnabled={isTurnstileEnforcementEnabled()}
        >
          Send Reset Link
        </CaptchaProtectedSubmit>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
          Back to login
        </Link>
      </p>
    </AuthCard>
  )
}
