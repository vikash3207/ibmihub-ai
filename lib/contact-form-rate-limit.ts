/**
 * Contact form abuse controls (PR #201): durable, serverless-safe rate
 * limiting and duplicate-send bookkeeping for app/api/contact/route.ts.
 *
 * Uses the service-role client (lib/supabase/admin.ts) against
 * contact_form_submissions -- a metadata-only table (see
 * supabase/migrations/012_contact_form_submissions.sql) that never stores
 * the visitor's name, email, subject, or message. Mirrors the shape of
 * lib/ai/tutor-usage.ts (cooldown via most-recent-row lookup, a sliding
 * window count, fail-open on DB error so an infra hiccup degrades gracefully
 * rather than taking the public contact form down) adapted for a route with
 * no authenticated session: identity here is a hashed IP, not a user id.
 *
 * Explicitly NOT an in-memory limiter -- every check reads Postgres, so the
 * limit holds across concurrent serverless/edge instances.
 *
 * IP hashing and submission-id validation themselves live in the
 * 'server-only'-free lib/contact-form-validation.ts so
 * scripts/contact-form-regression.ts can exercise that logic directly; this
 * module is the server-only-marked wrapper that supplies the real secret
 * and does the actual database reads/writes -- the part a plain Node
 * script cannot invoke outside a Next.js server context, verified instead
 * by source assertions (same pattern as lib/turnstile.ts /
 * scripts/auth-captcha-regression.ts).
 */
import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { hashIp as hashIpWithSecret, extractClientIp } from '@/lib/contact-form-validation'

/** Minimum time between submissions from the same hashed IP. */
export const CONTACT_FORM_COOLDOWN_SECONDS = 20
/** Sliding window (minutes) the send-count cap below is measured over. */
export const CONTACT_FORM_RATE_LIMIT_WINDOW_MINUTES = 60
/** Max successfully-sent messages from the same hashed IP within the window. */
export const CONTACT_FORM_RATE_LIMIT_MAX_PER_WINDOW = 5

export type ContactFormStatus = 'sent' | 'blocked' | 'error'
export type ContactFormBlockReason = 'honeypot' | 'origin' | 'rate_limited' | 'invalid_request'

export { extractClientIp }

/**
 * HMAC-SHA256 of the visitor's IP, never the raw address. Reuses
 * SUPABASE_SERVICE_ROLE_KEY as the HMAC secret rather than requiring a new
 * env var -- it is already a server-only secret never exposed to the
 * client, and this is a one-way keyed hash, not a use of the key's own
 * database privileges.
 */
export function hashIp(ip: string): string {
  return hashIpWithSecret(ip, process.env.SUPABASE_SERVICE_ROLE_KEY ?? '')
}

export interface RateLimitResult {
  blocked: boolean
  message?: string
}

/**
 * Cooldown then sliding-window checks, cheapest first. `ipHash` is null when
 * neither proxy header was present (should not happen behind Vercel, but
 * this fails open rather than blocking every request from an unusual
 * client) -- flagged as a known gap rather than silently perfect.
 */
export async function checkContactFormRateLimit(ipHash: string | null): Promise<RateLimitResult> {
  if (!ipHash) {
    return { blocked: false }
  }

  const admin = createAdminClient()

  const { data: last, error: lastError } = await admin
    .from('contact_form_submissions')
    .select('created_at')
    .eq('ip_hash', ipHash)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastError) {
    console.error('Contact form rate-limit lookup (cooldown) failed:', lastError.message)
  }

  if (last) {
    const secondsSinceLast = (Date.now() - new Date(last.created_at).getTime()) / 1000
    if (secondsSinceLast < CONTACT_FORM_COOLDOWN_SECONDS) {
      return { blocked: true, message: 'Please wait a few seconds before sending another message.' }
    }
  }

  const windowStartIso = new Date(Date.now() - CONTACT_FORM_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
  const { count, error: countError } = await admin
    .from('contact_form_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('status', 'sent')
    .gte('created_at', windowStartIso)

  if (countError) {
    console.error('Contact form rate-limit lookup (window count) failed:', countError.message)
  }

  if ((count ?? 0) >= CONTACT_FORM_RATE_LIMIT_MAX_PER_WINDOW) {
    return {
      blocked: true,
      message: "You've sent several messages recently. Please try again later, or email contact@irpgenie.com directly.",
    }
  }

  return { blocked: false }
}

/**
 * Looks up a prior outcome for this exact client-generated submission id.
 * The route uses this to short-circuit a retried/double-clicked request
 * that already succeeded -- returning the original success rather than
 * re-checking rate limits or calling Resend again. Returns null (not an
 * error) when the id is unseen, which is the common case.
 */
export async function findExistingSubmission(
  submissionId: string
): Promise<{ status: ContactFormStatus } | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('contact_form_submissions')
    .select('status')
    .eq('id', submissionId)
    .maybeSingle()

  if (error) {
    console.error('Contact form duplicate-submission lookup failed:', error.message)
    return null
  }
  return data ? { status: data.status as ContactFormStatus } : null
}

export interface RecordSubmissionInput {
  submissionId: string
  ipHash: string | null
  status: ContactFormStatus
  blockReason?: ContactFormBlockReason
  resendMessageId?: string
}

/**
 * Best-effort record of this submission's outcome, keyed by the client's
 * submission id so a retry with the same id overwrites rather than
 * duplicates this bookkeeping row. Never stores message content. Must never
 * throw -- a logging failure must not turn a successfully-sent email into a
 * failed request.
 */
export async function recordContactFormSubmission(input: RecordSubmissionInput): Promise<void> {
  try {
    const admin = createAdminClient()
    const { error } = await admin.from('contact_form_submissions').upsert({
      id: input.submissionId,
      ip_hash: input.ipHash,
      status: input.status,
      block_reason: input.blockReason ?? null,
      resend_message_id: input.resendMessageId ?? null,
    })
    if (error) {
      console.error('Failed to record contact form submission:', error.message)
    }
  } catch (err) {
    console.error('Failed to record contact form submission:', err)
  }
}
