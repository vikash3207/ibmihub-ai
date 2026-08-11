import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { isRecoveryDestination, safeInternalPath, RESET_PASSWORD_PATH } from '@/lib/auth-redirect'
import { RECOVERY_ERROR_CODE, safeAuthErrorCode } from '@/lib/auth-messages'
import {
  RECOVERY_COOKIE_NAME,
  recoveryCookieOptions,
  recoveryMarkerFor,
} from '@/lib/auth-recovery-state'
import { SUCCESS_COOKIE_NAME } from '@/lib/auth-success-state'
import {
  classifyArrival,
  sanitizeProviderCode,
  type RecoveryFailureReason,
} from '@/lib/auth-recovery-diagnostics'

/**
 * Verification for every emailed auth link.
 *
 * Handles both shapes Supabase can deliver (PR #189). Previously only `?code`
 * was understood, so a link arriving as `?token_hash=&type=recovery` -- which
 * is what Supabase sends when the email template uses TokenHash, and what its
 * own SSR guidance recommends -- fell straight through to "this reset link is
 * not valid" no matter how fresh it was.
 *
 * Every failure now carries an opaque reason token, because collapsing four
 * unrelated causes into one message left a production failure undiagnosable.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  // Both destinations come from the query string, so both are constrained to
  // unambiguous internal paths before being composed onto the origin.
  const next = safeInternalPath(searchParams.get('next'), '/')
  const after = safeInternalPath(searchParams.get('after'), '/')
  const isRecovery = isRecoveryDestination(next)

  const cookieStore = await cookies()

  /**
   * Clears any recovery marker left over from an earlier attempt. Essential
   * when a session cookie already exists: without it, a failed or expired
   * recovery callback would leave a stale marker and the reset form would
   * still open.
   */
  const clearRecoveryMarker = () => {
    cookieStore.delete(RECOVERY_COOKIE_NAME)
  }

  // Cleared the instant a recovery-destined request BEGINS, before any
  // exchange is attempted -- not only on failure (PR #192 follow-up). This
  // one call site covers both requirements at once:
  //
  //   - a failing callback must not leave a stale success marker sitting
  //     next to the invalid-link screen it is about to show;
  //   - a genuinely fresh, valid recovery link must not have its own
  //     brand-new session shadowed by a still-live success marker from a
  //     PREVIOUS completed reset. Without this, requesting and using a
  //     second link within the first marker's ~2-minute window made
  //     app/auth/reset-password/page.tsx's success-marker check (which runs
  //     ahead of the recovery-flow one) show "Password updated
  //     successfully" again instead of the password form the fresh link
  //     earned -- even though nothing about THIS link had succeeded yet.
  //
  // Placed before the new recovery marker is written on success below, so
  // that write is never shadowed by this leftover from an earlier flow.
  if (isRecovery) {
    cookieStore.delete(SUCCESS_COOKIE_NAME)
  }

  /**
   * Where an unusable link lands. A broken recovery link explains itself and
   * offers a new one rather than dumping the learner on the login page with
   * a generic "Authentication failed".
   */
  const fail = (reason: RecoveryFailureReason, providerCode: string | null = null) => {
    // Fixed label plus opaque tokens only. The code, the token hash, the
    // session tokens and Supabase's raw message never reach the browser, a
    // log line, or analytics.
    console.error('Auth callback failed:', reason, providerCode ?? 'none')

    if (!isRecovery) {
      return NextResponse.redirect(`${origin}/auth/login?error=Authentication+failed`)
    }

    clearRecoveryMarker()
    const params = new URLSearchParams({ error: RECOVERY_ERROR_CODE, reason })
    if (providerCode) params.set('detail', providerCode)
    return NextResponse.redirect(`${origin}${RESET_PASSWORD_PATH}?${params.toString()}`)
  }

  const arrival = classifyArrival({
    code: searchParams.get('code'),
    tokenHash: searchParams.get('token_hash'),
    type: searchParams.get('type'),
    error: searchParams.get('error'),
    errorCode: searchParams.get('error_code'),
  })

  // Supabase refused before the request ever reached us -- normally an
  // expired link, or one already consumed by a mail scanner following it.
  if (arrival.kind === 'provider-error') {
    return fail('provider_denied', arrival.providerCode)
  }

  // Nothing usable arrived. The credentials are most likely in the URL
  // fragment, which a server can never see.
  if (arrival.kind === 'nothing') {
    return fail('no_credentials', sanitizeProviderCode(searchParams.get('type')))
  }

  const supabase = await createClient()

  // Exactly one verification attempt, whichever shape arrived.
  const { data, error } =
    arrival.kind === 'code'
      ? await supabase.auth.exchangeCodeForSession(arrival.code)
      : await supabase.auth.verifyOtp({ token_hash: arrival.tokenHash, type: arrival.type })

  if (error) {
    return fail(
      arrival.kind === 'code' ? 'exchange_failed' : 'verification_failed',
      safeAuthErrorCode(error)
    )
  }

  const userId = data.session?.user?.id
  if (!userId) {
    // Verification reported success but produced no session -- treat as a
    // failure rather than opening a form with no identity behind it.
    return fail('no_session')
  }

  if (isRecovery) {
    // Written only here, only after real verification. This is the sole
    // producer of the marker anywhere in the app.
    cookieStore.set(RECOVERY_COOKIE_NAME, recoveryMarkerFor(userId), recoveryCookieOptions())
  }

  // For onboarding flows, next = /onboarding and after = the original destination
  const destination = next.startsWith('/onboarding')
    ? `${next}?next=${encodeURIComponent(after)}`
    : next

  return NextResponse.redirect(`${origin}${destination}`)
}
