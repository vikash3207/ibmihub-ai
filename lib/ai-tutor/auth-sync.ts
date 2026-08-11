/**
 * Pure decisions behind AI Tutor auth synchronisation (PR #186).
 *
 * Extracted from the provider so the behaviour can actually be executed by
 * the regression suite instead of merely pattern-matched in source.
 */

import type { AuthSignal } from '@/lib/auth-signal'

/**
 * What the Tutor shows: the login prompt, or the composer.
 *
 * `requiresLoginAfter401` is the raw client flag set when /api/ai-tutor
 * answered 401. This function is what makes it self-correcting -- once the
 * server has said the visitor is signed in, a leftover 401 flag is stale by
 * definition and is derived away during render.
 *
 * Deriving rather than clearing via an effect matters twice over: it lands in
 * the same render as the header flipping to "Log out" (no flash of the login
 * prompt), and it still holds if the provider remounts, which a
 * transition-only approach would miss.
 *
 * 'unknown' is deliberately NOT treated as signed out. It only means no
 * header has reported yet, so the existing flag stands unchanged.
 */
export function resolveRequiresLogin(signal: AuthSignal, requiresLoginAfter401: boolean): boolean {
  return signal === 'signed-in' ? false : requiresLoginAfter401
}

/**
 * True only for a real signed-in -> signed-out transition.
 *
 * Guards the one place the conversation is discarded. Every other pair is
 * false, so navigating between signed-out pages, arriving with an unknown
 * signal, or signing IN never erases Tutor history.
 */
export function isSignOutTransition(previous: AuthSignal, next: AuthSignal): boolean {
  return previous === 'signed-in' && next === 'signed-out'
}
