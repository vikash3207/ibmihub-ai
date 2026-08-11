/**
 * User-facing auth copy shared between Server Actions and the pages that
 * render their outcome (PR #186, extended in PR #187).
 *
 * Kept out of lib/actions/auth.ts because that file is `'use server'` and may
 * only export async Server Actions. Single-sourcing the strings is what lets
 * the regression suite assert that a failed password update can never render
 * the success wording.
 */

/** Heading shown after supabase.auth.updateUser({ password }) actually succeeded (PR #192). */
export const PASSWORD_UPDATED_TITLE = 'Password updated successfully'

/** Body copy shown alongside PASSWORD_UPDATED_TITLE. */
export const PASSWORD_UPDATED_MESSAGE =
  'Your password has been changed. You can now continue to iRPGenie using your new password.'

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
 * The shape actually needed to classify a Supabase auth failure.
 *
 * Both fields matter. `code` is the stable identifier for most API errors,
 * but some client-side errors carry no code at all -- AuthSessionMissingError
 * is constructed with `code: undefined` and is identifiable only by `name`.
 * Classifying on either is what makes this robust; classifying on prose was
 * the previous mistake, since Supabase can reword a message at any release.
 */
export interface ClassifiableAuthError {
  code?: string | undefined
  name?: string | undefined
}

/** Stable ErrorCode values from @supabase/auth-js that mean "no usable session". */
const NO_SESSION_CODES = new Set([
  'session_not_found',
  'session_expired',
  'refresh_token_not_found',
  'refresh_token_already_used',
  'bad_jwt',
  'invalid_jwt',
  'user_not_found',
  'no_authorization',
])

/** Error class names for the same condition, used where no code is set. */
const NO_SESSION_NAMES = new Set([
  'AuthSessionMissingError',
  'AuthInvalidJwtError',
  'AuthInvalidTokenResponseError',
])

/**
 * Maps a Supabase auth error to a category using its stable code or class
 * name -- never its message text.
 *
 * Anything unrecognised becomes `unknown` rather than being guessed at, so a
 * new Supabase error code degrades to a safe generic message instead of
 * being mislabelled as an expired link.
 */
export function classifyPasswordResetError(error: ClassifiableAuthError | null | undefined): PasswordResetFailure {
  const code = typeof error?.code === 'string' ? error.code : undefined
  const name = typeof error?.name === 'string' ? error.name : undefined

  if ((code && NO_SESSION_CODES.has(code)) || (name && NO_SESSION_NAMES.has(name))) {
    return 'no-recovery-session'
  }

  if (code === 'same_password') {
    return 'password-unchanged'
  }

  if (code === 'weak_password' || name === 'AuthWeakPasswordError') {
    return 'password-too-short'
  }

  return 'unknown'
}

/**
 * What is safe to put in a log line: the stable identifiers only, never the
 * message, which can quote session internals.
 */
export function safeAuthErrorCode(error: ClassifiableAuthError | null | undefined): string {
  const code = typeof error?.code === 'string' && error.code.length > 0 ? error.code : null
  const name = typeof error?.name === 'string' && error.name.length > 0 ? error.name : null
  return code ?? name ?? 'unspecified'
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
