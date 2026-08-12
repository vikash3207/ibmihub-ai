/**
 * Contact-form request parsing and field validation (PR #201). Pure and
 * framework-free -- no 'server-only' marker, no Node-only API beyond
 * node:crypto (which runs fine outside Next.js too) -- so
 * scripts/contact-form-regression.ts can import and execute every function
 * here directly, the same way scripts/auth-captcha-regression.ts exercises
 * lib/turnstile.ts's pure functions. All client input (the request body,
 * every string field) is untrusted until it has passed through
 * parseContactFormBody() below; app/api/contact/route.ts must never use a
 * raw request field without going through this module first.
 *
 * Deliberately treats "all client input as untrusted" per spec: unexpected
 * body keys (including any attempt to smuggle from/to/cc/bcc/headers past
 * the server) are rejected outright rather than merely ignored.
 */
import crypto from 'node:crypto'
import { isValidEmailFormat, INVALID_EMAIL_MESSAGE } from '@/lib/turnstile'
import {
  MAX_NAME_LENGTH,
  MAX_SUBJECT_LENGTH,
  MIN_MESSAGE_LENGTH,
  MAX_MESSAGE_LENGTH,
  HONEYPOT_FIELD_NAME,
  isValidSubmissionId,
} from '@/lib/contact-form-shared'

export {
  MAX_NAME_LENGTH,
  MAX_SUBJECT_LENGTH,
  MIN_MESSAGE_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_REQUEST_BODY_BYTES,
  HONEYPOT_FIELD_NAME,
  isValidSubmissionId,
} from '@/lib/contact-form-shared'

const ALLOWED_BODY_KEYS = new Set(['name', 'email', 'subject', 'message', 'submissionId', HONEYPOT_FIELD_NAME])

/**
 * HMAC-SHA256 of an IP address, keyed by a caller-supplied secret. Never
 * hashes with a hardcoded or empty-string key in production use -- the
 * secret is threaded in by the caller (lib/contact-form-rate-limit.ts,
 * using SUPABASE_SERVICE_ROLE_KEY) rather than read from process.env here,
 * so this function itself has no environment coupling and can be exercised
 * directly with a fixture secret in tests.
 */
export function hashIp(ip: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(`contact-form-ip:${ip}`).digest('hex')
}

/** Best-effort client IP from standard proxy headers (Vercel sets x-forwarded-for). Null if neither header is present. */
export function extractClientIp(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const real = headers.get('x-real-ip')
  return real && real.trim().length > 0 ? real.trim() : null
}

export type ContactFormFieldError =
  | 'invalid_json'
  | 'invalid_shape'
  | 'unexpected_fields'
  | 'invalid_types'
  | 'invalid_submission_id'
  | 'missing_fields'
  | 'name_too_long'
  | 'invalid_email'
  | 'subject_invalid_chars'
  | 'subject_too_long'
  | 'message_too_short'
  | 'message_too_long'

export interface ValidatedContactFormFields {
  name: string
  email: string
  subject: string
  message: string
  submissionId: string
  /** Trimmed honeypot value -- non-empty means the request is very likely automated. */
  honeypot: string
}

export type ValidateContactFormResult =
  | { ok: true; value: ValidatedContactFormFields }
  | { ok: false; error: ContactFormFieldError; message: string }

function fail(error: ContactFormFieldError, message: string): ValidateContactFormResult {
  return { ok: false, error, message }
}

const GENERIC_INVALID_MESSAGE = 'Invalid request.'

/**
 * Validates an already-JSON-parsed request body. Every failure returns a
 * curated, non-sensitive message safe to show a visitor -- never a stack
 * trace, provider detail, or reflected raw input.
 */
export function parseContactFormBody(raw: unknown): ValidateContactFormResult {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return fail('invalid_shape', GENERIC_INVALID_MESSAGE)
  }

  const obj = raw as Record<string, unknown>
  const keys = Object.keys(obj)
  if (keys.some((key) => !ALLOWED_BODY_KEYS.has(key))) {
    return fail('unexpected_fields', GENERIC_INVALID_MESSAGE)
  }

  const { name: nameRaw, email: emailRaw, subject: subjectRaw, message: messageRaw, submissionId: submissionIdRaw } = obj
  const honeypotRaw = obj[HONEYPOT_FIELD_NAME]

  if (
    typeof nameRaw !== 'string' ||
    typeof emailRaw !== 'string' ||
    typeof subjectRaw !== 'string' ||
    typeof messageRaw !== 'string' ||
    typeof submissionIdRaw !== 'string' ||
    (honeypotRaw !== undefined && typeof honeypotRaw !== 'string')
  ) {
    return fail('invalid_types', GENERIC_INVALID_MESSAGE)
  }

  if (!isValidSubmissionId(submissionIdRaw)) {
    return fail('invalid_submission_id', GENERIC_INVALID_MESSAGE)
  }

  const name = nameRaw.trim()
  const email = emailRaw.trim()
  const subject = subjectRaw.trim()
  const message = messageRaw.trim()
  const honeypot = (honeypotRaw ?? '').trim()

  if (name.length === 0 || email.length === 0 || subject.length === 0 || message.length === 0) {
    return fail('missing_fields', 'Please fill in all required fields.')
  }

  if (name.length > MAX_NAME_LENGTH) {
    return fail('name_too_long', `Name must be ${MAX_NAME_LENGTH} characters or fewer.`)
  }

  if (!isValidEmailFormat(email)) {
    return fail('invalid_email', INVALID_EMAIL_MESSAGE)
  }

  // Checked against the raw (untrimmed) value: a CR/LF anywhere in the
  // subject is a header-injection attempt regardless of surrounding
  // whitespace, and trimming alone would not remove an embedded newline.
  if (/[\r\n]/.test(subjectRaw)) {
    return fail('subject_invalid_chars', 'Subject cannot contain line breaks.')
  }

  if (subject.length > MAX_SUBJECT_LENGTH) {
    return fail('subject_too_long', `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.`)
  }

  if (message.length < MIN_MESSAGE_LENGTH) {
    return fail('message_too_short', 'Please enter a longer message.')
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return fail('message_too_long', `Message must be ${MAX_MESSAGE_LENGTH.toLocaleString()} characters or fewer.`)
  }

  return { ok: true, value: { name, email, subject, message, submissionId: submissionIdRaw, honeypot } }
}
