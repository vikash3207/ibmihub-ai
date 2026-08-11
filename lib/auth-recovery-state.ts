/**
 * Server-controlled marker proving a request is part of a password-recovery
 * flow (PR #187 follow-up).
 *
 * WHY THIS EXISTS. The first cut of this PR gated /auth/reset-password on
 * supabase.auth.getUser() alone. That was wrong: getUser() proves there is
 * *a* session, never that it came from a recovery link. It let three cases
 * render a recovery form that should not have:
 *
 *   1. an ordinary signed-in learner opening the URL directly;
 *   2. a failed or expired callback while an unrelated session cookie
 *      already existed;
 *   3. reopening a link that had already been used successfully.
 *
 * The marker is an HttpOnly cookie written ONLY by app/auth/callback/route.ts
 * after exchangeCodeForSession() has actually succeeded. It is required
 * ALONGSIDE the Supabase session, never instead of it -- Supabase remains
 * authoritative for identity, and this only answers "which flow is this?".
 *
 * It is deliberately not a query parameter and not a client boolean: nothing
 * the browser can set participates in the decision, and no client-side value
 * is trusted.
 *
 * ON FORGERY. The cookie is bound to the account it was issued for, so one
 * captured from another session is useless. It is not signed, and that is a
 * considered choice rather than an oversight: crafting it requires already
 * holding a valid session for the account, and the only thing it unlocks is
 * a form that changes that same account's own password. There is no
 * privilege to gain, so a signing secret would guard a threat that does not
 * exist -- while adding a secret that, if unset in an environment, would
 * break recovery.
 *
 * The value is the account id. That is not a new disclosure: the Supabase
 * session cookie sitting beside it already carries the same id as the JWT
 * `sub` claim, readable by the same party.
 */

/** Cookie carrying the marker. Prefixed like the app, not like Supabase's own. */
export const RECOVERY_COOKIE_NAME = 'irpgenie-recovery'

/**
 * Short by design. A recovery link is meant to be used immediately, and a
 * stale marker must not keep the reset form alive in a browser the learner
 * has walked away from.
 */
export const RECOVERY_COOKIE_MAX_AGE_SECONDS = 15 * 60

/** The value written for a given account. */
export function recoveryMarkerFor(userId: string): string {
  return userId
}

/**
 * Whether this request is a genuine recovery flow for THIS user.
 *
 * Both halves are required. A missing cookie means the learner arrived some
 * other way; a mismatched one means the marker belongs to a different
 * account and must not be honoured.
 */
export function hasValidRecoveryMarker(
  cookieValue: string | undefined | null,
  userId: string | undefined | null
): boolean {
  if (typeof cookieValue !== 'string' || cookieValue.length === 0) return false
  if (typeof userId !== 'string' || userId.length === 0) return false
  return cookieValue === recoveryMarkerFor(userId)
}

/** Cookie attributes. Secure only in production so local http:// dev still works. */
export function recoveryCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: RECOVERY_COOKIE_MAX_AGE_SECONDS,
  }
}
