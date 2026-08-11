/**
 * Redirect-target safety for the auth callback (PR #187).
 *
 * Pure and dependency-free so the regression suite can execute it rather
 * than pattern-match it.
 *
 * The callback takes its destination from a query parameter, and password
 * recovery now travels through that callback. Since the value is composed
 * onto the site origin, anything that could escape the origin -- a scheme, a
 * protocol-relative `//host`, a backslash that some browsers normalise to a
 * slash -- must be rejected rather than sanitised, so a crafted reset link
 * can never bounce a learner off the site.
 */

/** Paths the callback is allowed to send a browser to. */
export const RESET_PASSWORD_PATH = '/auth/reset-password'

/**
 * Returns `candidate` when it is unambiguously a path on this site, and
 * `fallback` otherwise.
 *
 * Deliberately strict: one leading slash, no second slash or backslash after
 * it, no scheme, no control characters. Rejecting is safe here because every
 * legitimate caller passes a known internal path.
 */
export function safeInternalPath(candidate: string | null | undefined, fallback: string): string {
  if (typeof candidate !== 'string' || candidate.length === 0) return fallback

  // Control characters (newlines, tabs, NUL) have no place in a path and
  // are a classic way to smuggle past a naive prefix check.
  if (/[\u0000-\u001f\u007f]/.test(candidate)) return fallback

  // Must be origin-relative...
  if (!candidate.startsWith('/')) return fallback
  // ...and must not be protocol-relative (`//evil.com`) or use a backslash
  // variant of it.
  if (candidate.startsWith('//') || candidate.startsWith('/\\')) return fallback
  if (candidate.includes('\\')) return fallback

  // A scheme anywhere means this is not a plain path.
  if (/^\/[a-z][a-z0-9+.-]*:/i.test(candidate)) return fallback

  return candidate
}

/**
 * Whether a callback destination is the password-reset form.
 *
 * Used to decide which failure page an unusable code lands on: a broken
 * recovery link should explain itself and offer a new one, not dump the
 * learner on the login page with a generic "Authentication failed".
 */
export function isRecoveryDestination(next: string): boolean {
  return next === RESET_PASSWORD_PATH || next.startsWith(`${RESET_PASSWORD_PATH}?`)
}
