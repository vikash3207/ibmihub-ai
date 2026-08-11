import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isRecoveryDestination, safeInternalPath, RESET_PASSWORD_PATH } from '@/lib/auth-redirect'
import { RECOVERY_ERROR_CODE } from '@/lib/auth-messages'

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

  if (!code) {
    return NextResponse.redirect(failureUrl)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // The code, the tokens and Supabase's raw text never reach the browser,
    // a log line, or analytics -- only the fact that the exchange failed.
    console.error('Auth code exchange failed:', error.message)
    return NextResponse.redirect(failureUrl)
  }

  // Only reached once a session actually exists.
  // For onboarding flows, next = /onboarding and after = the original destination
  const destination = next.startsWith('/onboarding')
    ? `${next}?next=${encodeURIComponent(after)}`
    : next

  return NextResponse.redirect(`${origin}${destination}`)
}
