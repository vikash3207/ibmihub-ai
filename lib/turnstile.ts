/**
 * Cloudflare Turnstile configuration and email validation for the Auth
 * forms (PR #183).
 *
 * No `server-only` marker: the SITE key is public by design (it is rendered
 * into the widget in the browser), so this module is imported by both the
 * client widget and the server Actions. The Turnstile SECRET is never
 * referenced here or anywhere in application code -- Supabase Auth holds it
 * and performs the siteverify call server-side, which is what makes the
 * check enforceable rather than cosmetic.
 *
 * IMPORTANT: this file contains no verification logic. A Turnstile token is
 * validated by Supabase when it is passed as `options.captchaToken` on the
 * real Auth call. Client-side widget completion alone proves nothing, and
 * nothing here should ever be treated as a security boundary on its own.
 */

/**
 * Public site key. Absent means Turnstile is not configured, and every
 * protected Auth action must refuse to proceed rather than silently fall
 * back to unprotected account creation -- see checkTurnstile() in
 * lib/actions/auth.ts.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

export const TURNSTILE_CONFIGURED = TURNSTILE_SITE_KEY.length > 0

/** Name of the hidden form field carrying the token from widget to Server Action. */
export const TURNSTILE_FIELD_NAME = 'captchaToken'

/** Shown when the widget itself fails, expires, or cannot load. Deliberately calm and non-alarming. */
export const TURNSTILE_FAILURE_MESSAGE = 'The security check could not be completed. Please try again.'

/**
 * Shown when the site key is missing. Distinct from the failure message so
 * the operator can tell "misconfigured deployment" from "user hit a flaky
 * challenge", without leaking configuration detail to the visitor.
 */
export const TURNSTILE_UNAVAILABLE_MESSAGE =
  'Sign-in is temporarily unavailable. Please try again shortly or contact support.'

/**
 * Pull the Turnstile token out of a submitted form.
 *
 * Returns undefined for a missing/blank/implausible value so the caller can
 * fail closed. The upper bound is a sanity guard only -- Supabase performs
 * the real validation.
 */
export function readTurnstileToken(formData: FormData): string | undefined {
  const raw = formData.get(TURNSTILE_FIELD_NAME)
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  if (trimmed.length === 0 || trimmed.length > 4096) return undefined
  return trimmed
}

/**
 * Email format check applied before Supabase Auth is invoked.
 *
 * Deliberately permissive: this rejects blank and clearly malformed input,
 * nothing more. It does NOT and cannot establish that the mailbox exists or
 * that the person controls it -- no DNS, MX, SMTP, or deliverability check
 * happens anywhere in this codebase. Plus-addressing, subdomains, long TLDs,
 * and uncommon-but-valid domains all pass; there is no allowlist and no
 * disposable-domain blocking.
 *
 * Supabase remains the authoritative account-creation system and applies its
 * own validation on top of this.
 */
export function normalizeEmail(raw: FormDataEntryValue | null): string {
  return typeof raw === 'string' ? raw.trim() : ''
}

export function isValidEmailFormat(email: string): boolean {
  if (email.length === 0 || email.length > 254) return false
  // One @, no whitespace, a dot-bearing domain with a 2+ char final label.
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(email)
}

export const INVALID_EMAIL_MESSAGE = 'Enter a valid email address.'
