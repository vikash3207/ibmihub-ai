import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { RECOVERY_LINK_INVALID_MESSAGE } from '@/lib/auth-messages'
import { AuthCard } from '@/components/auth-card'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
}

// Reads the recovery session on every request -- must never be cached.
export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage() {
  // The Supabase session established by /auth/callback is the only thing
  // that decides whether this form is usable. No query parameter takes part:
  // in particular `?status=success` is no longer read at all, so the success
  // screen cannot be conjured from the URL (PR #187 fixing PR #186).
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // No recovery session: an expired, reused or tampered link, or someone
    // opening this URL directly. Showing the form here would be a form that
    // looks usable and is guaranteed to fail on submit.
    return (
      <AuthCard title="This reset link is not valid" subtitle="Request a new link and we will email it to you.">
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {RECOVERY_LINK_INVALID_MESSAGE}
        </div>

        <p className="text-center text-sm text-slate-500">
          <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:underline">
            Request a new reset link
          </Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account.">
      <ResetPasswordForm />
    </AuthCard>
  )
}
