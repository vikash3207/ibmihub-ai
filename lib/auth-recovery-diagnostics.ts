/**
 * Why a recovery link failed, in safe opaque terms (PR #189).
 *
 * The previous callback collapsed four unrelated failures into one message,
 * so a production failure gave nobody -- owner or maintainer -- any way to
 * tell which had happened. These reasons are deliberately opaque tokens, not
 * prose: they identify a branch, and carry no code, token, cookie, email or
 * Supabase message.
 *
 * Pure and dependency-free so every branch can be executed by the regression
 * suite.
 */

export type RecoveryFailureReason =
  /** Neither ?code nor ?token_hash arrived. Supabase sent the credentials in
   *  the URL fragment (implicit flow), which a server can never see, or the
   *  link was truncated by a mail client. */
  | 'no_credentials'
  /** Supabase's own /verify step refused before ever reaching us -- normally
   *  an expired link, or one already consumed by a mail scanner. */
  | 'provider_denied'
  /** ?code arrived but exchangeCodeForSession failed. Almost always a
   *  missing or mismatched PKCE verifier: the link was opened in a different
   *  browser or profile from the one that requested it, or the code was
   *  already used. */
  | 'exchange_failed'
  /** ?token_hash arrived but verifyOtp failed. */
  | 'verification_failed'
  /** Credentials verified, but no session came back. */
  | 'no_session'

export const RECOVERY_FAILURE_REASONS: readonly RecoveryFailureReason[] = [
  'no_credentials',
  'provider_denied',
  'exchange_failed',
  'verification_failed',
  'no_session',
]

export function isRecoveryFailureReason(value: unknown): value is RecoveryFailureReason {
  return typeof value === 'string' && (RECOVERY_FAILURE_REASONS as readonly string[]).includes(value)
}

/**
 * Constrains a value that came from a URL before it is ever rendered.
 *
 * Supabase's error_code values are short snake_case tokens like
 * `otp_expired`. Anything that is not shaped like one is dropped entirely
 * rather than sanitised, so a crafted link cannot put chosen wording on our
 * own error page.
 */
export function sanitizeProviderCode(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > 64) return null
  return /^[a-z0-9_]+$/i.test(trimmed) ? trimmed : null
}

/** Email link types this app understands. Anything else is not honoured. */
const KNOWN_OTP_TYPES = ['recovery', 'signup', 'invite', 'magiclink', 'email_change', 'email'] as const
export type KnownOtpType = (typeof KNOWN_OTP_TYPES)[number]

export function normalizeOtpType(value: string | null | undefined): KnownOtpType | null {
  return typeof value === 'string' && (KNOWN_OTP_TYPES as readonly string[]).includes(value)
    ? (value as KnownOtpType)
    : null
}

/**
 * Which branch the callback should take, decided purely from what arrived.
 *
 * Order matters: an explicit refusal from Supabase is reported as such even
 * if other parameters are also present, because that is the most specific
 * thing we know.
 */
export type RecoveryArrival =
  | { kind: 'provider-error'; providerCode: string | null }
  | { kind: 'code'; code: string }
  | { kind: 'token-hash'; tokenHash: string; type: KnownOtpType }
  | { kind: 'nothing' }

export function classifyArrival(params: {
  code: string | null
  tokenHash: string | null
  type: string | null
  error: string | null
  errorCode: string | null
}): RecoveryArrival {
  if (params.error || params.errorCode) {
    return {
      kind: 'provider-error',
      providerCode: sanitizeProviderCode(params.errorCode) ?? sanitizeProviderCode(params.error),
    }
  }

  if (params.code) {
    return { kind: 'code', code: params.code }
  }

  if (params.tokenHash) {
    // A recovery link with no explicit type is still a recovery link -- the
    // route it was addressed to already told us that.
    return { kind: 'token-hash', tokenHash: params.tokenHash, type: normalizeOtpType(params.type) ?? 'recovery' }
  }

  return { kind: 'nothing' }
}

/**
 * The one-line reference shown under the error message.
 *
 * Not an apology and not a stack trace: a short token the account owner can
 * read back so the cause can be identified without server logs.
 */
export function recoveryReferenceLabel(
  reason: RecoveryFailureReason | null,
  providerCode: string | null
): string | null {
  if (!reason) return null
  return providerCode ? `${reason}/${providerCode}` : reason
}
