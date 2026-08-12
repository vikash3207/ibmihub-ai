/**
 * Contact Form / Resend Integration regression pass (PR #201).
 *
 * Two kinds of check live here, same split as scripts/auth-captcha-
 * regression.ts:
 *
 *   1. REAL behaviour -- lib/contact-form-validation.ts and
 *      lib/contact-email-template.ts are pure, framework-free modules (no
 *      'server-only' marker, no Next.js request context needed), so they
 *      are imported and executed against real inputs here.
 *
 *   2. SOURCE assertions -- app/api/contact/route.ts, lib/contact-form-
 *      rate-limit.ts (server-only, touches Supabase + a secret), and
 *      components/contact-form.tsx are checked by reading their source
 *      text, because a Route Handler cannot be invoked outside a real
 *      Next.js server, and lib/contact-form-rate-limit.ts's 'server-only'
 *      marker throws unconditionally under plain Node/tsx (see
 *      node_modules/server-only/index.js). A source assertion proves the
 *      wiring is present; it does NOT prove Resend actually delivers an
 *      email or that Supabase actually enforces the rate limit at runtime.
 *      That can only be established with real Resend/Supabase credentials
 *      configured, which is a manual verification step -- see the PR notes.
 *
 * Usage:
 *   npm run test:contact-form
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  parseContactFormBody,
  isValidSubmissionId,
  hashIp,
  extractClientIp,
  MAX_NAME_LENGTH,
  MAX_SUBJECT_LENGTH,
  MIN_MESSAGE_LENGTH,
  MAX_MESSAGE_LENGTH,
  HONEYPOT_FIELD_NAME,
  type ContactFormFieldError,
} from '../lib/contact-form-validation'
import { buildContactEmailHtml, buildContactEmailText, buildContactEmailSubject } from '../lib/contact-email-template'

/** Error code of a failed parse result, or undefined for a successful one -- narrows the ok/error discriminated union in one place for the checks below. */
function errorCode(result: ReturnType<typeof parseContactFormBody>): ContactFormFieldError | undefined {
  return result.ok ? undefined : result.error
}

let failures = 0
let passed = 0

function check(description: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1
    console.log(`  OK    ${description}`)
  } else {
    failures += 1
    console.error(`  FAIL  ${description}${detail ? ` -- ${detail}` : ''}`)
  }
}

function section(title: string) {
  console.log(`\n${title}`)
}

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf-8')
}

const routeSource = readRepoFile('app/api/contact/route.ts')
const rateLimitSource = readRepoFile('lib/contact-form-rate-limit.ts')
const formSource = readRepoFile('components/contact-form.tsx')
const pageSource = readRepoFile('app/contact/page.tsx')
const migrationSource = readRepoFile('supabase/migrations/012_contact_form_submissions.sql')
const envExample = readRepoFile('.env.local.example')
const validateEnvSource = readRepoFile('scripts/validate-env.ts')
const emailTemplateSource = readRepoFile('lib/contact-email-template.ts')
const allSource = [routeSource, rateLimitSource, formSource, pageSource].join('\n')

const VALID_ID = '11111111-2222-4333-8444-555555555555'

function baseBody(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Jane Learner',
    email: 'jane@example.com',
    subject: 'A question about lessons',
    message: 'This is a perfectly reasonable message about IBM i lessons.',
    submissionId: VALID_ID,
    [HONEYPOT_FIELD_NAME]: '',
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
section('Successful submission (executed, not inspected)')
// ---------------------------------------------------------------------------

const validResult = parseContactFormBody(baseBody())
check('a well-formed submission parses ok', validResult.ok === true)
if (validResult.ok) {
  check('name is trimmed/preserved', validResult.value.name === 'Jane Learner')
  check('email is trimmed/preserved', validResult.value.email === 'jane@example.com')
  check('honeypot is empty for a real submission', validResult.value.honeypot === '')
}

// ---------------------------------------------------------------------------
section('Blank / missing required fields')
// ---------------------------------------------------------------------------

for (const field of ['name', 'email', 'subject', 'message']) {
  const result = parseContactFormBody(baseBody({ [field]: '' }))
  check(`blank ${field} is rejected`, errorCode(result) === 'missing_fields')
}

const missingKeyResult = parseContactFormBody({
  email: 'jane@example.com',
  subject: 'x',
  message: 'a valid enough message',
  submissionId: VALID_ID,
})
check(
  'a body missing the name key entirely is rejected (not crashed)',
  errorCode(missingKeyResult) === 'invalid_types'
)

// ---------------------------------------------------------------------------
section('Invalid email')
// ---------------------------------------------------------------------------

for (const bad of ['not-an-email', 'missing@domain', '@nodomain.com', 'spaces in@email.com', '']) {
  const result = parseContactFormBody(baseBody({ email: bad }))
  check(`"${bad}" is rejected as an email`, result.ok === false, result.ok ? 'was accepted' : undefined)
}

const validEmailResult = parseContactFormBody(baseBody({ email: 'learner+tag@example.co.uk' }))
check('a valid plus-addressed email is accepted', validEmailResult.ok === true)

// ---------------------------------------------------------------------------
section('Oversized fields')
// ---------------------------------------------------------------------------

check(
  `name over ${MAX_NAME_LENGTH} chars is rejected`,
  errorCode(parseContactFormBody(baseBody({ name: 'a'.repeat(MAX_NAME_LENGTH + 1) }))) === 'name_too_long'
)
check(
  `name at exactly ${MAX_NAME_LENGTH} chars is accepted`,
  parseContactFormBody(baseBody({ name: 'a'.repeat(MAX_NAME_LENGTH) })).ok === true
)
check(
  `subject over ${MAX_SUBJECT_LENGTH} chars is rejected`,
  errorCode(parseContactFormBody(baseBody({ subject: 'a'.repeat(MAX_SUBJECT_LENGTH + 1) }))) === 'subject_too_long'
)
check(
  `message under ${MIN_MESSAGE_LENGTH} chars is rejected`,
  errorCode(parseContactFormBody(baseBody({ message: 'short' }))) === 'message_too_short'
)
check(
  `message over ${MAX_MESSAGE_LENGTH} chars is rejected`,
  errorCode(parseContactFormBody(baseBody({ message: 'a'.repeat(MAX_MESSAGE_LENGTH + 1) }))) === 'message_too_long'
)
check(
  `message at exactly ${MAX_MESSAGE_LENGTH} chars is accepted`,
  parseContactFormBody(baseBody({ message: 'a'.repeat(MAX_MESSAGE_LENGTH) })).ok === true
)

// ---------------------------------------------------------------------------
section('Header-injection / malformed-input rejection')
// ---------------------------------------------------------------------------

check(
  'a subject containing CRLF is rejected',
  errorCode(parseContactFormBody(baseBody({ subject: 'Hi\r\nBcc: attacker@evil.com' }))) === 'subject_invalid_chars'
)
check(
  'a subject containing a bare LF is rejected',
  errorCode(parseContactFormBody(baseBody({ subject: 'Hi\nBcc: attacker@evil.com' }))) === 'subject_invalid_chars'
)
check('a null body is rejected, not crashed', parseContactFormBody(null).ok === false)
check('an array body is rejected, not crashed', parseContactFormBody([1, 2, 3]).ok === false)
check('a string body is rejected, not crashed', parseContactFormBody('not an object').ok === false)
check(
  'non-string field types are rejected, not crashed',
  errorCode(parseContactFormBody(baseBody({ name: 12345 }))) === 'invalid_types'
)
check(
  'a malformed submissionId is rejected',
  errorCode(parseContactFormBody(baseBody({ submissionId: 'not-a-uuid' }))) === 'invalid_submission_id'
)
check('isValidSubmissionId accepts a real crypto.randomUUID()-shaped value', isValidSubmissionId(VALID_ID))
check('isValidSubmissionId rejects a plain string', !isValidSubmissionId('hello'))
check('isValidSubmissionId rejects a number', !isValidSubmissionId(12345))

// ---------------------------------------------------------------------------
section('Honeypot rejection (executed, not inspected)')
// ---------------------------------------------------------------------------

const honeypotResult = parseContactFormBody(baseBody({ [HONEYPOT_FIELD_NAME]: 'https://spam.example' }))
check('a filled honeypot still parses as a normal, valid submission', honeypotResult.ok === true)
check(
  'the parsed honeypot value is surfaced for the caller to reject on',
  honeypotResult.ok === true && honeypotResult.value.honeypot === 'https://spam.example'
)
check(
  'route.ts rejects a non-empty honeypot value before calling Resend',
  /honeypot\.length\s*>\s*0/.test(routeSource) && /return jsonError/.test(routeSource)
)
check(
  'route.ts never fakes a success response for a honeypot hit (never falsely claims success)',
  !/honeypot\.length\s*>\s*0\)\s*{\s*[\s\S]{0,120}?jsonSuccess/.test(routeSource)
)

// ---------------------------------------------------------------------------
section('Client cannot control recipient/sender/headers (executed, not inspected)')
// ---------------------------------------------------------------------------

for (const smuggledKey of ['to', 'from', 'cc', 'bcc', 'headers', 'replyTo']) {
  const result = parseContactFormBody(baseBody({ [smuggledKey]: 'attacker@evil.com' }))
  check(`a body carrying a client-supplied "${smuggledKey}" field is rejected`, errorCode(result) === 'unexpected_fields')
}

check(
  'route.ts sets `from` only from the server env var, never from parsed request fields',
  /from:\s*fromEmail/.test(routeSource) && !/from:\s*(name|email|subject|message)\b/.test(routeSource)
)
check(
  'route.ts sets `to` only from the server env var, never from parsed request fields',
  /to:\s*\[toEmail\]/.test(routeSource)
)
check(
  'route.ts uses the visitor email ONLY as replyTo, never as `from`',
  /replyTo:\s*email/.test(routeSource)
)

// ---------------------------------------------------------------------------
section('Duplicate-submission / idempotency wiring (source assertions)')
// ---------------------------------------------------------------------------

check(
  'route.ts passes the client submission id as the Resend idempotency key',
  /idempotencyKey:\s*submissionId/.test(routeSource)
)
check(
  'route.ts short-circuits on a prior "sent" outcome before calling Resend again',
  /findExistingSubmission\(submissionId\)/.test(routeSource) &&
    /existing\?\.status === 'sent'/.test(routeSource)
)
check(
  'the rate-limit/dedupe table is keyed by the client submission id (primary key = id)',
  /id\s+uuid\s+primary key/.test(migrationSource)
)

// ---------------------------------------------------------------------------
section('Abuse control: honeypot, origin, durable rate limiting (source assertions)')
// ---------------------------------------------------------------------------

check('route.ts validates the request Origin/Referer before doing any work', /isAllowedOrigin\(request\)/.test(routeSource))
check(
  'origin allowlist includes this deployment\'s own SITE_URL',
  /allowed = new Set<string>\(\[SITE_URL\]\)/.test(routeSource)
)
check(
  'origin allowlist covers Vercel preview deployments via VERCEL_URL, not just production',
  /VERCEL_URL/.test(routeSource)
)
check('route.ts enforces a maximum request body size', /MAX_REQUEST_BODY_BYTES/.test(routeSource))
check(
  'rate limiting reads from Postgres (Supabase), not an in-process/in-memory store',
  /createAdminClient\(\)/.test(rateLimitSource) && !/new Map\(/.test(rateLimitSource)
)
check(
  'rate limiting enforces both a short cooldown and a sliding-window cap',
  /CONTACT_FORM_COOLDOWN_SECONDS/.test(rateLimitSource) && /CONTACT_FORM_RATE_LIMIT_MAX_PER_WINDOW/.test(rateLimitSource)
)
check('route.ts checks the rate limit before calling Resend', /checkContactFormRateLimit\(ipHash\)/.test(routeSource))
check(
  'IP addresses are hashed (HMAC), never stored raw',
  /createHmac\('sha256'/.test(readRepoFile('lib/contact-form-validation.ts')) && !/ip_hash:\s*clientIp\b/.test(routeSource)
)
const hashed1 = hashIp('203.0.113.5', 'test-secret-one')
const hashed2 = hashIp('203.0.113.5', 'test-secret-two')
const hashed3 = hashIp('203.0.113.6', 'test-secret-one')
check('hashIp() is deterministic for the same IP + secret', hashIp('203.0.113.5', 'test-secret-one') === hashed1)
check('hashIp() output does not contain the raw IP as a substring', !hashed1.includes('203.0.113.5'))
check('hashIp() differs when the secret differs', hashed1 !== hashed2)
check('hashIp() differs when the IP differs', hashed1 !== hashed3)
check(
  'extractClientIp() reads the first entry of x-forwarded-for',
  extractClientIp(new Headers({ 'x-forwarded-for': '203.0.113.5, 70.41.3.18' })) === '203.0.113.5'
)
check(
  'extractClientIp() falls back to x-real-ip',
  extractClientIp(new Headers({ 'x-real-ip': '198.51.100.7' })) === '198.51.100.7'
)
check('extractClientIp() returns null when neither header is present', extractClientIp(new Headers()) === null)

// ---------------------------------------------------------------------------
section('No message content ever written to Supabase (executed + source assertions)')
// ---------------------------------------------------------------------------

check(
  'the migration table has no name/email/subject/message column',
  !/\bname\s+text/.test(migrationSource) &&
    !/\bemail\s+text/.test(migrationSource) &&
    !/\bsubject\s+text/.test(migrationSource) &&
    !/\bmessage\s+text/.test(migrationSource)
)
check(
  'recordContactFormSubmission() only ever upserts id/ip_hash/status/block_reason/resend_message_id',
  /upsert\(\{\s*id:\s*input\.submissionId,\s*ip_hash:\s*input\.ipHash,\s*status:\s*input\.status,\s*block_reason:[\s\S]{0,40}resend_message_id:/.test(
    rateLimitSource
  )
)
check(
  'recordContactFormSubmission() is never called with name/email/subject/message',
  !/recordContactFormSubmission\(\{[^}]*\b(name|email|subject|message)\b/.test(routeSource)
)

// ---------------------------------------------------------------------------
section('Email content: safe escaping (executed, not inspected)')
// ---------------------------------------------------------------------------

const dangerousFields = {
  name: '<img src=x onerror=alert(1)>',
  email: 'attacker@example.com',
  subject: 'Hello & <b>world</b>',
  message: 'Line one\n<script>alert("xss")</script>\nLine two',
  submissionId: VALID_ID,
}

const html = buildContactEmailHtml(dangerousFields)
const text = buildContactEmailText(dangerousFields)

check('HTML output never contains a raw <script> tag from the message', !html.includes('<script>alert("xss")</script>'))
check('HTML output never contains a raw <img onerror> tag from the name', !html.includes('<img src=x onerror=alert(1)>'))
check('HTML output escapes the dangerous name as &lt;img', html.includes('&lt;img src=x onerror=alert(1)&gt;'))
check('HTML output escapes ampersands in the subject', html.includes('Hello &amp; &lt;b&gt;world&lt;/b&gt;'))
check('plain-text output preserves the message verbatim (no HTML entity mangling)', text.includes(dangerousFields.message))
check('subject is prefixed with [iRPGenie Contact]', buildContactEmailSubject('Hello') === '[iRPGenie Contact] Hello')
check('HTML output includes the submission id for support traceability', html.includes(VALID_ID))
check('HTML output has no authenticated-user-id row when none was supplied', !html.includes('Authenticated user ID'))
const htmlWithUser = buildContactEmailHtml({ ...dangerousFields, authenticatedUserId: 'user-123' })
check('HTML output includes the authenticated user id row when supplied', htmlWithUser.includes('Authenticated user ID'))
check(
  'the email template module never imports cookies/headers/session APIs',
  !/next\/headers/.test(emailTemplateSource) && !/getUser\(/.test(emailTemplateSource)
)

// ---------------------------------------------------------------------------
section('No mailto construction/navigation in the form (source assertions)')
// ---------------------------------------------------------------------------

check('contact-form.tsx submits via fetch to /api/contact', /fetch\('\/api\/contact'/.test(formSource))
check('contact-form.tsx no longer navigates via window.location.href', !/window\.location\.href/.test(formSource))
check(
  'contact-form.tsx builds no mailto: URL for the main submission path',
  !/mailtoUrl/.test(formSource) && !/mailto:\$\{/.test(formSource)
)
check(
  'the only mailto: href left in the form is the visible failure-state fallback link',
  (formSource.match(/href="mailto:/g) ?? []).length === 1
)
check('the button label is "Send Message", not "Send Email"', /Send Message/.test(formSource) && !/Send Email/.test(formSource))
check(
  'the Contact page\'s two mailto: cards (Support / General Contact) are untouched',
  (pageSource.match(/mailto:\$\{SUPPORT_EMAIL\}/) ?? []).length === 1 &&
    (pageSource.match(/mailto:\$\{CONTACT_EMAIL\}/) ?? []).length === 1
)
check(
  'the stale "nothing here is sent or stored" copy has been removed from the Contact page',
  !/nothing here is sent or stored/.test(pageSource)
)

// ---------------------------------------------------------------------------
section('UX states: loading, success, failure, a11y (source assertions)')
// ---------------------------------------------------------------------------

check('the submit button is disabled while submitting', /disabled={isDisabled}/.test(formSource))
check('the button shows "Sending" while in flight', /Sending/.test(formSource))
check(
  'fields are cleared ONLY inside the confirmed-success branch',
  /response\.ok && data\?\.ok\) \{[\s\S]*?setName\(''\)/.test(formSource)
)
check(
  'fields are NOT cleared in the network-failure branch',
  !/Network error[\s\S]{0,60}setName/.test(formSource)
)
check('there is an aria-live status region', /aria-live="polite"/.test(formSource))
check('focus moves to the status region on success/error for screen readers', /statusRegionRef\.current\?\.focus\(\)/.test(formSource))
check(
  'the success message matches the required copy',
  /Thanks! Your message has been sent to iRPGenie\./.test(formSource)
)
check(
  'the failure state shows the contact@irpgenie.com fallback',
  /contact@irpgenie\.com/.test(formSource)
)
check('a client-side submission cooldown exists', /CLIENT_COOLDOWN_SECONDS/.test(formSource))
check(
  'a honeypot field is rendered and kept out of the tab order',
  /tabIndex={-1}/.test(formSource) && formSource.includes('HONEYPOT_FIELD_NAME')
)
check('a fresh submission id is generated per form session via crypto.randomUUID()', /crypto\.randomUUID\(\)/.test(formSource))

// ---------------------------------------------------------------------------
section('Provider / network failure handling (source assertions)')
// ---------------------------------------------------------------------------

check(
  'route.ts never echoes the raw Resend error object/message back to the client',
  !/jsonError\(error\.message/.test(routeSource) && !/jsonError\(error,/.test(routeSource)
)
check('route.ts logs the raw Resend error server-side for operators', /console\.error\('Contact form: Resend send failed/.test(routeSource))
check('a provider failure returns a curated, retry-friendly message', /Something went wrong sending your message/.test(routeSource))
check('contact-form.tsx shows a generic message on a network/fetch exception', /Network error\. Please check your connection/.test(formSource))

// ---------------------------------------------------------------------------
section('Server-only secrets (source assertions)')
// ---------------------------------------------------------------------------

check('lib/contact-form-rate-limit.ts is marked server-only', /^import 'server-only'/m.test(rateLimitSource))
check('app/api/contact/route.ts never hardcodes an API key literal', !/RESEND_API_KEY\s*=\s*['"]re_/.test(routeSource))
check('RESEND_API_KEY is read only from process.env, never NEXT_PUBLIC_', /process\.env\.RESEND_API_KEY/.test(routeSource))
check(
  'no NEXT_PUBLIC_ variant of the Resend secret exists anywhere in the touched files',
  !/NEXT_PUBLIC_RESEND/.test(allSource) && !/NEXT_PUBLIC_RESEND/.test(envExample)
)
check(
  'the contact form fails safely (controlled error) when Resend config is missing',
  /!apiKey \|\| !fromEmail \|\| !toEmail/.test(routeSource) && /503/.test(routeSource)
)

// ---------------------------------------------------------------------------
section('Environment documentation')
// ---------------------------------------------------------------------------

for (const key of ['RESEND_API_KEY', 'CONTACT_FORM_FROM_EMAIL', 'CONTACT_FORM_TO_EMAIL']) {
  check(`${key} is documented in .env.local.example`, envExample.includes(key))
}
check(
  'the Resend vars are NOT added to validate-env.ts REQUIRED_VARS (feature-gated, app still boots without them)',
  !/REQUIRED_VARS = \[[\s\S]*?RESEND_API_KEY/.test(validateEnvSource)
)

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed, ${failures} failed`)
if (failures > 0) {
  process.exit(1)
}
