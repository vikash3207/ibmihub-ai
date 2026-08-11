/**
 * Which auth routes an already-authenticated visitor should be bounced away
 * from (PR #188).
 *
 * WHY THIS EXISTS. proxy.ts previously redirected authenticated visitors off
 * every route in one PUBLIC_AUTH_ROUTES list, matched with startsWith(). Two
 * of those routes are load-bearing for password recovery:
 *
 *   /auth/callback        must run its one-time code exchange even when a
 *                         session already exists. Redirecting it away means
 *                         the code is never exchanged at all.
 *   /auth/reset-password  is reached *because* the exchange just succeeded,
 *                         so the visitor is authenticated by definition.
 *                         Redirecting authenticated visitors away made the
 *                         page unreachable at exactly the moment it was
 *                         supposed to work.
 *
 * Being authenticated is therefore not a reason to redirect either one. What
 * decides whether the reset form may be shown stays where PR #187 put it:
 * the page's own session-plus-recovery-marker gate, re-checked in the Server
 * Action. This module only decides routing, never authorisation.
 *
 * Pure and dependency-free so the proxy's behaviour can be executed by the
 * regression suite rather than pattern-matched.
 */

/**
 * Entry pages an authenticated visitor has no reason to see.
 *
 * Deliberately NOT including /auth/callback or /auth/reset-password. Note
 * also what is absent: any protected route. The proxy does not gate those --
 * each page performs its own check, per the Batch 21 investigation recorded
 * in proxy.ts.
 */
export const SIGNED_OUT_ONLY_ROUTES = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/forgot-password',
] as const

/** Trailing slashes are equivalent to Next's canonical form; the root is left alone. */
export function normalizePathname(pathname: string): string {
  if (typeof pathname !== 'string' || pathname.length === 0) return '/'
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/**
 * Exact match, not startsWith().
 *
 * startsWith() silently claimed every path underneath each entry -- so a
 * future /auth/login-help or /auth/reset-password-sent would have inherited
 * the redirect without anyone choosing that. Exact matching means adding a
 * route is a deliberate act.
 */
export function isSignedOutOnlyRoute(pathname: string): boolean {
  const normalized = normalizePathname(pathname)
  return (SIGNED_OUT_ONLY_ROUTES as readonly string[]).includes(normalized)
}

/** The proxy's only auth-based routing decision. */
export function shouldRedirectAuthenticatedVisitor(pathname: string, isAuthenticated: boolean): boolean {
  return isAuthenticated && isSignedOutOnlyRoute(pathname)
}
