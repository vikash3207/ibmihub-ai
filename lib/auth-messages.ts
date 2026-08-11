/**
 * User-facing auth copy shared between Server Actions and the pages that
 * render their outcome (PR #186, extended in PR #187).
 *
 * Kept out of lib/actions/auth.ts because that file is `'use server'` and may
 * only export async Server Actions. Single-sourcing the strings is what lets
 * the regression suite assert that a failed password update can never render
 * the success wording.
 */

/** Shown after supabase.auth.updateUser({ password }) actually succeeded. */
export const PASSWORD_UPDATED_MESSAGE = 'Your password has been updated successfully.'

/**
 * Why a password update failed.
 *
 * Separate categories because a single "expired or already used" sentence
 * was actively misleading: the real production failure was a missing
 * recovery session, and a too-short password would have been reported as an
 * expired link too.
 */
export type PasswordResetFailure =
  | 'no-recovery-session'
  | 'password-too-short'
  | 'password-unchanged'
  | 'unknown'

export const MIN_PASSWORD_LENGTH = 8

/**
 * Safe copy per category. None of these repeat Supabase's raw error, which
 * can describe session internals.
 */
export const PASSWORD_RESET_FAILURE_MESSAGES: Record<PasswordResetFailure, string> = {
  'no-recovery-session':
    'Your reset link is no longer valid. Reset links can only be used once and expire after a short time. Please request a new one.',
  'password-too-short': `Choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`,
  'password-unchanged': 'Choose a password that is different from your current one.',
  unknown: 'We could not update your password. Please request a new reset link and try again.',
}

/**
 * Maps a raw Supabase error to a category.
 *
 * Matches on the message because @supabase/auth-js does not expose a stable
 * typed code for every one of these. Anything unrecognised falls through to
 * `unknown` rather than being guessed at.
 */
export function classifyPasswordResetError(rawMessage: string): PasswordResetFailure {
  const lower = rawMessage.toLowerCase()

  if (
    lower.includes('auth session missing') ||
    lower.includes('session_not_found') ||
    lower.includes('session from session_id claim in jwt does not exist') ||
    lower.includes('invalid claim') ||
    lower.includes('jwt expired') ||
    lower.includes('not authenticated')
  ) {
    return 'no-recovery-session'
  }

  if (lower.includes('should be different') || lower.includes('same as the old')) {
    return 'password-unchanged'
  }

  if (lower.includes('password') && (lower.includes('at least') || lower.includes('short') || lower.includes('weak'))) {
    return 'password-too-short'
  }

  return 'unknown'
}

/**
 * Shown when the callback could not exchange a recovery code, and when
 * /auth/reset-password is opened with no recovery session at all.
 */
export const RECOVERY_LINK_INVALID_MESSAGE = PASSWORD_RESET_FAILURE_MESSAGES['no-recovery-session']

/**
 * The only error code the callback puts in a URL. A code rather than free
 * text, so a crafted link cannot render arbitrary wording on our own page.
 */
export const RECOVERY_ERROR_CODE = 'recovery_link_invalid'
