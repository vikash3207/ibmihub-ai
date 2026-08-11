import Link from 'next/link'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { RECOVERY_COOKIE_NAME, hasValidRecoveryMarker } from '@/lib/auth-recovery-state'
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
  // Two independent server-side signals are required, and no query parameter
  // takes part in either. `?status=success` is not read at all, so the
  // success screen cannot be conjured from the URL.
  //
  // Supabase is authoritative for WHO this is. The marker cookie -- written
  // only by /auth/callback after a real code exchange, and cleared when that
  // exchange fails or the password has been changed -- is what establishes
  // that this is a recovery flow at all. getUser() alone was not enough: an
  // ordinary signed-in learner has a session, and so does someone whose
  // recovery callback just failed.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const isRecoveryFlow = hasValidRecoveryMarker(cookieStore.get(RECOVERY_COOKIE_NAME)?.value, user?.id)

  if (!user || !isRecoveryFlow) {
    // Not a recovery flow: an expired, reused or tampered link, a learner
    // who is simply signed in and typed the URL, or a callback that failed
    // while a session cookie already existed. Showing the form in any of
    // those cases would present something that looks usable and is
    // guaranteed to fail on submit.
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
