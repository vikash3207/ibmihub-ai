import Link from 'next/link'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { RECOVERY_COOKIE_NAME, hasValidRecoveryMarker } from '@/lib/auth-recovery-state'
import { SUCCESS_COOKIE_NAME, hasValidSuccessMarker } from '@/lib/auth-success-state'
import { postAuthDestinationFor } from '@/lib/auth-destination'
import { PASSWORD_UPDATED_TITLE, RECOVERY_LINK_INVALID_MESSAGE } from '@/lib/auth-messages'
import {
  isRecoveryFailureReason,
  recoveryReferenceLabel,
  sanitizeProviderCode,
} from '@/lib/auth-recovery-diagnostics'
import { RecoveryFragmentNotice } from '@/components/auth/recovery-fragment-notice'
import { AuthCard } from '@/components/auth-card'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { ResetSuccessContent } from '@/components/auth/reset-success-content'

// Not useful search-result content, and excluded from app/sitemap.ts --
// explicitly opt out of indexing rather than relying only on robots.txt.
export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
}

// Reads the recovery session on every request -- must never be cached.
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ reason?: string; detail?: string }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  // Three independent server-side signals are checked below, and no query
  // parameter takes part in any of them. `?status=success` is not read at
  // all, so the success screen cannot be conjured from the URL.
  //
  // Supabase is authoritative for WHO this is. The recovery marker cookie --
  // written only by /auth/callback after a real code exchange, and cleared
  // when that exchange fails or the password has been changed -- is what
  // establishes that this is a recovery flow at all. getUser() alone was not
  // enough: an ordinary signed-in learner has a session, and so does someone
  // whose recovery callback just failed.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const cookieStore = await cookies()

  // PR #192: checked BEFORE the recovery-flow gate below, and on its own
  // terms. Next.js re-renders this page immediately after resetPassword()
  // returns (standard behaviour for a Server Action bound to a form), and by
  // then the recovery marker has already been deleted -- on purpose, so the
  // link cannot be reused. Without an independent signal for "it just
  // succeeded", that re-render had nothing left to work with and fell
  // through to the invalid-link branch below, replacing the confirmation the
  // learner had just seen with an error, even though the password HAD
  // changed. See lib/auth-success-state.ts for why this is its own marker
  // rather than a reuse of the recovery one.
  const hasSucceeded = hasValidSuccessMarker(cookieStore.get(SUCCESS_COOKIE_NAME)?.value, user?.id)

  if (user && hasSucceeded) {
    // Recomputed here rather than carried over from the action's own return
    // value, because this is a fresh render reached independently of it --
    // the same onboarding rule resetPassword() already applied.
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_response, onboarding_skipped')
      .eq('id', user.id)
      .maybeSingle()

    return (
      <AuthCard title={PASSWORD_UPDATED_TITLE} subtitle="You're signed in and ready to continue.">
        <ResetSuccessContent destination={postAuthDestinationFor(profile)} />
      </AuthCard>
    )
  }

  // Read only to display an opaque reference token. Neither value can grant
  // anything -- both are validated against a fixed allowlist first, and the
  // gate below ignores them entirely.
  const { reason: rawReason, detail: rawDetail } = await searchParams
  const reason = isRecoveryFailureReason(rawReason) ? rawReason : null
  const reference = recoveryReferenceLabel(reason, sanitizeProviderCode(rawDetail))

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

        {/* Short opaque tokens, shown so the cause can be identified without
            server logs. They name a branch and nothing more -- no code,
            token, cookie, email or Supabase message. */}
        {reference && <p className="mt-4 text-center text-xs text-slate-400">Reference: {reference}</p>}
        <RecoveryFragmentNotice />
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account.">
      <ResetPasswordForm />
    </AuthCard>
  )
}
