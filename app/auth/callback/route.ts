import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isRecoveryDestination, safeInternalPath, RESET_PASSWORD_PATH } from '@/lib/auth-redirect'
import { RECOVERY_ERROR_CODE, safeAuthErrorCode } from '@/lib/auth-messages'
import {
  RECOVERY_COOKIE_NAME,
  recoveryCookieOptions,
  recoveryMarkerFor,
} from '@/lib/auth-recovery-state'
import { cookies } from 'next/headers'

/**
 * PKCE code exchange for every emailed auth link.
 *
 * Password recovery now travels through here too (PR #187). It previously
 * pointed straight at /auth/reset-password, which meant the one-time `code`
 * was never exchanged, no session cookies were ever written, and
 * updateUser({ password }) failed on a genuinely fresh link.
 *
 * The exchange happens exactly once, in this handler. Session cookies are
 * written through lib/supabase/server.ts's cookie adapter, which in a Route
 * Handler attaches Set-Cookie to the response below -- including a redirect
 * response -- so the reset form loads with a live recovery session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Both destinations come from the query string, so both are constrained to
  // unambiguous internal paths before being composed onto the origin.
  const next = safeInternalPath(searchParams.get('next'), '/')
  const after = safeInternalPath(searchParams.get('after'), '/')

  const isRecovery = isRecoveryDestination(next)

  // Where an unusable link lands. A broken recovery link explains itself and
  // offers a new one instead of dumping the learner on the login page with a
  // generic "Authentication failed".
  const failureUrl = isRecovery
    ? `${origin}${RESET_PASSWORD_PATH}?error=${RECOVERY_ERROR_CODE}`
    : `${origin}/auth/login?error=Authentication+failed`

  const cookieStore = await cookies()

  /**
   * Clears any recovery marker left over from an earlier attempt.
   *
   * Essential when a session cookie already exists: without this, a failed
   * or expired recovery callback would leave a stale marker behind and the
   * reset form would still open.
   */
  const clearRecoveryMarker = () => {
    cookieStore.delete(RECOVERY_COOKIE_NAME)
  }

  if (!code) {
    if (isRecovery) clearRecoveryMarker()
    return NextResponse.redirect(failureUrl)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // Fixed label plus the stable code only. The code itself, the tokens and
    // Supabase's raw message never reach the browser, a log line, or
    // analytics.
    console.error('Auth code exchange failed:', safeAuthErrorCode(error))
    if (isRecovery) clearRecoveryMarker()
    return NextResponse.redirect(failureUrl)
  }

  if (isRecovery) {
    const userId = data.session?.user?.id
    if (!userId) {
      // Exchange reported success but produced no user -- treat as failure
      // rather than opening a form with no identity behind it.
      console.error('Auth code exchange failed:', 'missing_user_after_exchange')
      clearRecoveryMarker()
      return NextResponse.redirect(failureUrl)
    }
    // Written only here, only after a real exchange. This is the sole
    // producer of the marker anywhere in the app.
    cookieStore.set(RECOVERY_COOKIE_NAME, recoveryMarkerFor(userId), recoveryCookieOptions())
  }

  // Only reached once a session actually exists.
  // For onboarding flows, next = /onboarding and after = the original destination
  const destination = next.startsWith('/onboarding')
    ? `${next}?next=${encodeURIComponent(after)}`
    : next

  return NextResponse.redirect(`${origin}${destination}`)
}
