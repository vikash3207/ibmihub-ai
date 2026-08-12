import { NextRequest } from 'next/server'
import { after } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL, CONTACT_EMAIL } from '@/lib/config'
import { parseContactFormBody, MAX_REQUEST_BODY_BYTES } from '@/lib/contact-form-validation'
import {
  extractClientIp,
  hashIp,
  checkContactFormRateLimit,
  findExistingSubmission,
  recordContactFormSubmission,
} from '@/lib/contact-form-rate-limit'
import { buildContactEmailHtml, buildContactEmailText, buildContactEmailSubject } from '@/lib/contact-email-template'

export type ContactApiErrorCode =
  | 'invalid_request'
  | 'rate_limited'
  | 'server_error'
  | 'provider_error'

function jsonSuccess() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

function jsonError(message: string, status: number, code: ContactApiErrorCode) {
  // `message` is always a curated, non-sensitive string chosen at the call
  // site -- never a raw provider/database error. See section 4's "never
  // expose Resend's API key, provider internals, stack traces, or raw
  // provider errors" requirement.
  return new Response(JSON.stringify({ ok: false, error: message, code }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const FALLBACK_CONTACT_EMAIL = CONTACT_EMAIL ?? 'contact@irpgenie.com'

/**
 * Allowed request origins: this deployment's own canonical SITE_URL, this
 * specific Vercel deployment's auto-provisioned URL (covers preview
 * deploys -- VERCEL_URL is set by Vercel to the current deployment's own
 * hostname), and localhost in non-production for local development. A
 * request with neither an Origin nor a parseable Referer is rejected --
 * every same-origin `fetch()` POST from a browser sends Origin, so this
 * never blocks the real form; it blocks the simplest scripted abuse that
 * omits both headers. This is defense-in-depth, not a hard security
 * boundary: a determined scripted client can forge an Origin header. See
 * the PR notes for why a CAPTCHA is flagged as a follow-up rather than
 * shipped in this PR.
 */
function isAllowedOrigin(request: NextRequest): boolean {
  const originHeader = request.headers.get('origin')
  const refererHeader = request.headers.get('referer')

  let candidate: string | null = null
  if (originHeader) {
    candidate = originHeader
  } else if (refererHeader) {
    try {
      candidate = new URL(refererHeader).origin
    } catch {
      candidate = null
    }
  }

  if (!candidate) return false

  const allowed = new Set<string>([SITE_URL])
  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`)
  }
  if (allowed.has(candidate)) return true

  if (process.env.NODE_ENV !== 'production') {
    try {
      const hostname = new URL(candidate).hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') return true
    } catch {
      // fall through to false
    }
  }

  return false
}

/**
 * Contact form submission endpoint (PR #201), replacing the previous
 * mailto: link that depended on the visitor having a local email app
 * configured. See lib/contact-form-validation.ts, lib/contact-form-rate-
 * limit.ts, and lib/contact-email-template.ts for the pieces this wires
 * together; this file's own job is orchestration and error-shape control,
 * not validation or business logic.
 */
export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return jsonError('Invalid request.', 403, 'invalid_request')
  }

  const contentLengthHeader = request.headers.get('content-length')
  if (contentLengthHeader && Number(contentLengthHeader) > MAX_REQUEST_BODY_BYTES) {
    return jsonError('Request too large.', 413, 'invalid_request')
  }

  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return jsonError('Invalid request.', 400, 'invalid_request')
  }

  if (rawBody.length > MAX_REQUEST_BODY_BYTES) {
    return jsonError('Request too large.', 413, 'invalid_request')
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(rawBody)
  } catch {
    return jsonError('Invalid request.', 400, 'invalid_request')
  }

  const parsed = parseContactFormBody(parsedJson)
  if (!parsed.ok) {
    return jsonError(parsed.message, 400, 'invalid_request')
  }
  const { name, email, subject, message, submissionId, honeypot } = parsed.value

  const clientIp = extractClientIp(request.headers)
  const ipHash = clientIp ? hashIp(clientIp) : null

  // Honeypot: a real visitor never sees or fills this field (it is visually
  // hidden and unreachable by keyboard in components/contact-form.tsx), so
  // any non-empty value here is treated as automated. Rejected as an
  // ordinary, honest failure rather than a faked success -- section 7
  // requires the form to never falsely claim success, and that requirement
  // is not scoped to "except for bots."
  if (honeypot.length > 0) {
    after(() =>
      recordContactFormSubmission({ submissionId, ipHash, status: 'blocked', blockReason: 'honeypot' })
    )
    return jsonError('Invalid request.', 400, 'invalid_request')
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL

  if (!apiKey || !fromEmail || !toEmail) {
    console.error(
      'Contact form is misconfigured: RESEND_API_KEY, CONTACT_FORM_FROM_EMAIL, and CONTACT_FORM_TO_EMAIL must all be set.'
    )
    return jsonError(
      `The contact form isn't available right now. Please email ${FALLBACK_CONTACT_EMAIL} directly.`,
      503,
      'server_error'
    )
  }

  // Duplicate-send protection, layer 1: a retried/double-clicked request
  // carrying a submission id we already recorded as sent is answered from
  // our own record, with no second call to Resend at all.
  const existing = await findExistingSubmission(submissionId)
  if (existing?.status === 'sent') {
    return jsonSuccess()
  }

  const rateLimit = await checkContactFormRateLimit(ipHash)
  if (rateLimit.blocked) {
    after(() =>
      recordContactFormSubmission({ submissionId, ipHash, status: 'blocked', blockReason: 'rate_limited' })
    )
    return jsonError(
      rateLimit.message ?? 'Please wait a few seconds before sending another message.',
      429,
      'rate_limited'
    )
  }

  // Best-effort only: an authenticated user id is a nice-to-have in the
  // notification email, never a requirement. A session lookup failure must
  // not block an otherwise-valid submission.
  let authenticatedUserId: string | undefined
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    authenticatedUserId = user?.id
  } catch (err) {
    console.error('Contact form: session lookup failed (continuing without it):', err)
  }

  const resend = new Resend(apiKey)
  const emailFields = { name, email, subject, message, submissionId, authenticatedUserId }

  // Duplicate-send protection, layer 2: the Resend idempotency key. Even if
  // two requests with the same submission id both reach this point
  // concurrently (a race the layer-1 check above cannot fully close),
  // Resend itself will not send the email twice for the same key within its
  // 24-hour idempotency window -- https://resend.com/docs/dashboard/emails/idempotency-keys.
  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: [toEmail],
      // The visitor's email is ONLY ever used as Reply-To, never as From --
      // section 2's core requirement. The client cannot influence `from` or
      // `to` at all; both come exclusively from server env vars.
      replyTo: email,
      subject: buildContactEmailSubject(subject),
      html: buildContactEmailHtml(emailFields),
      text: buildContactEmailText(emailFields),
    },
    { idempotencyKey: submissionId }
  )

  if (error) {
    // `error` is a structured Resend error object -- logged for operators,
    // never returned to the browser.
    console.error('Contact form: Resend send failed:', error.name, error.message)
    after(() => recordContactFormSubmission({ submissionId, ipHash, status: 'error' }))
    return jsonError(
      `Something went wrong sending your message. Please try again, or email ${toEmail} directly.`,
      502,
      'provider_error'
    )
  }

  after(() =>
    recordContactFormSubmission({ submissionId, ipHash, status: 'sent', resendMessageId: data?.id })
  )

  return jsonSuccess()
}
