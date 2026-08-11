/**
 * Server-controlled marker proving `updateUser({ password })` actually
 * succeeded (PR #192).
 *
 * WHY THIS EXISTS. /auth/reset-password gates the password FORM on the
 * recovery marker from lib/auth-recovery-state.ts, and resetPassword()
 * deliberately consumes that marker the instant the update succeeds -- a
 * used link must not reopen a working form. That is correct and unchanged.
 *
 * The bug this fixes: after the action returns `{ status: 'success' }` to
 * the client, Next.js also refreshes the current route's Server Component
 * tree (the standard behaviour after any Server Action bound to a form). By
 * the time that refresh runs, the recovery marker is already gone, so the
 * page's own gate -- which only knew about the recovery marker -- fell
 * through to the invalid-link branch and replaced the just-shown success
 * message with "This reset link is not valid." The password HAD changed;
 * only the confirmation was lost.
 *
 * This second marker gives the page's own re-render an independent, equally
 * server-authoritative way to reach the success branch instead of the
 * invalid-link one. Written ONLY by resetPassword() in lib/actions/auth.ts,
 * and only after supabase.auth.updateUser() has actually returned success --
 * never earlier, never speculatively.
 *
 * It is deliberately not a query parameter and not a client boolean, for the
 * same reason PR #186's `?status=success` had to be removed: anything the
 * browser can set, an attacker can set. Nothing here is read from the URL.
 *
 * ON CAPABILITY. This marker grants nothing. It is checked only to decide
 * what confirmation TEXT to render; resetPassword() never reads it, and a
 * password update is authorised solely by the recovery marker (unchanged).
 * Holding a forged copy of this cookie lets a visitor see a page saying
 * their own account's password changed -- which requires already holding a
 * session for that account, and it enables no action against it.
 *
 * ON LIFETIME. Two independent things bound its life: a short TTL, and the
 * "Continue to iRPGenie" action explicitly deleting it before it redirects
 * (continueAfterPasswordReset in lib/actions/auth.ts). Either one catches a
 * revisit later.
 *
 * ON FORGERY. Not signed, mirroring the recovery marker's own reasoning: it
 * is bound to the account it was issued for, so one captured from another
 * session is useless, and it grants no capability worth a signing secret.
 */

/** Cookie carrying the marker. Distinct name from the recovery marker -- they answer different questions. */
export const SUCCESS_COOKIE_NAME = 'irpgenie-reset-success'

/**
 * Short by design, but longer than a single request-response round trip:
 * long enough that the immediate post-action refresh, and a learner who sits
 * on the confirmation screen for a minute before clicking through, both
 * still see it; short enough that walking away and coming back later does
 * not.
 */
export const SUCCESS_COOKIE_MAX_AGE_SECONDS = 2 * 60

/** The value written for a given account. */
export function successMarkerFor(userId: string): string {
  return userId
}

/**
 * Whether the success screen may be shown for THIS user.
 *
 * Same shape as hasValidRecoveryMarker, deliberately: both halves are
 * required, and a marker issued for a different account must not be
 * honoured.
 */
export function hasValidSuccessMarker(
  cookieValue: string | undefined | null,
  userId: string | undefined | null
): boolean {
  if (typeof cookieValue !== 'string' || cookieValue.length === 0) return false
  if (typeof userId !== 'string' || userId.length === 0) return false
  return cookieValue === successMarkerFor(userId)
}

/** Cookie attributes. Secure only in production so local http:// dev still works. */
export function successCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SUCCESS_COOKIE_MAX_AGE_SECONDS,
  }
}
