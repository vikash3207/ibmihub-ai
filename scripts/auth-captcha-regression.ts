/**
 * Signup email guidance + Turnstile CAPTCHA regression pass (PR #183).
 *
 * Two kinds of check live here, and the difference matters:
 *
 *   1. REAL behaviour -- normalizeEmail / isValidEmailFormat / readTurnstileToken
 *      are pure functions, so they are imported and executed against actual
 *      inputs. These assertions genuinely test the code.
 *
 *   2. SOURCE assertions -- everything about the Server Actions and widget is
 *      checked by reading source text, because Server Actions cannot be
 *      invoked outside a Next.js request. A source assertion proves the wiring
 *      is present; it does NOT prove Supabase rejects a bad token. That can
 *      only be established against the real project once the secret key is
 *      configured, and it is listed as a manual step in the PR notes.
 *
 * Usage:
 *   npm run test:auth-captcha
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import {
  TURNSTILE_FIELD_NAME,
  INVALID_EMAIL_MESSAGE,
  isValidEmailFormat,
  normalizeEmail,
  readTurnstileToken,
} from '../lib/turnstile'

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

const read = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts), 'utf8')

const turnstileLib = read('lib', 'turnstile.ts')
const authActions = read('lib', 'actions', 'auth.ts')
const widget = read('components', 'auth', 'turnstile-widget.tsx')
const submit = read('components', 'auth', 'captcha-protected-submit.tsx')
const signUpPage = read('app', 'auth', 'sign-up', 'page.tsx')
const loginPage = read('app', 'auth', 'login', 'page.tsx')
const forgotPage = read('app', 'auth', 'forgot-password', 'page.tsx')
const envExample = read('.env.local.example')

// ---------------------------------------------------------------------------
section('Email format validation (executed, not inspected)')
// ---------------------------------------------------------------------------

const validEmails = [
  'learner@example.com',
  'first.last@example.co.uk',
  // Plus-addressing must pass: it is valid, widely used, and blocking it
  // would lock real people out for no security gain.
  'learner+irpgenie@example.com',
  'someone@mail.sub.example.org',
  "o'brien@example.com",
  'user_name-1@example-host.io',
  'a@b.cd',
]

for (const email of validEmails) {
  check(`accepts ${email}`, isValidEmailFormat(email))
}

const invalidEmails = [
  ['', 'empty'],
  ['   ', 'whitespace only (post-normalize)'],
  ['learner', 'no @ or domain'],
  ['learner@', 'no domain'],
  ['@example.com', 'no local part'],
  ['learner@example', 'no dot in domain'],
  ['learner@example.c', 'single-character TLD'],
  ['learner@@example.com', 'two @ signs'],
  ['learner @example.com', 'embedded space'],
  ['learner@exa mple.com', 'space in domain'],
  ['learner@example..com', 'empty domain label'],
  ['learner@.example.com', 'leading dot in domain'],
  ['learner@example.com.', 'trailing dot'],
] as const

for (const [email, why] of invalidEmails) {
  check(`rejects ${JSON.stringify(email)} (${why})`, !isValidEmailFormat(normalizeEmail(email)))
}

check('over-length address is rejected', !isValidEmailFormat(`${'a'.repeat(250)}@example.com`))
check('normalizeEmail trims surrounding whitespace', normalizeEmail('  a@b.cd  ') === 'a@b.cd')
check('normalizeEmail coerces a null field to empty string', normalizeEmail(null) === '')

// The guidance copy promises access, not verification. If validation is ever
// mistaken for verification, that promise becomes a lie -- so assert the
// module states plainly that it performs no deliverability check.
check(
  'validation is documented as format-only (no DNS/MX/SMTP claim)',
  /no DNS, MX, SMTP, or deliverability check/i.test(turnstileLib)
)

// ---------------------------------------------------------------------------
section('Token extraction (executed, not inspected)')
// ---------------------------------------------------------------------------

function formWith(value?: string): FormData {
  const fd = new FormData()
  if (value !== undefined) fd.set(TURNSTILE_FIELD_NAME, value)
  return fd
}

check('missing token field yields undefined', readTurnstileToken(formWith()) === undefined)
check('empty token yields undefined', readTurnstileToken(formWith('')) === undefined)
check('whitespace-only token yields undefined', readTurnstileToken(formWith('   ')) === undefined)
check('absurdly long token yields undefined', readTurnstileToken(formWith('x'.repeat(5000))) === undefined)
check('a plausible token is returned trimmed', readTurnstileToken(formWith('  abc.def  ')) === 'abc.def')

// ---------------------------------------------------------------------------
section('Server-side enforcement is the security boundary')
// ---------------------------------------------------------------------------

check("auth actions module is server-only ('use server')", /^'use server'/m.test(authActions))

// The core of the brief's safety requirement: every Auth call that Supabase
// can demand a captcha for must already send one, so switching CAPTCHA on in
// the dashboard cannot break login or password recovery.
for (const call of ['signUp', 'signInWithPassword', 'resetPasswordForEmail'] as const) {
  const idx = authActions.indexOf(`auth.${call}(`)
  check(`${call} is present`, idx > -1)
  // Look only at the call expression that follows, not the whole file.
  const slice = idx > -1 ? authActions.slice(idx, idx + 500) : ''
  check(`${call} forwards captchaToken to Supabase`, /captchaToken:\s*readTurnstileToken\(formData\)/.test(slice))
}

const captchaGuardCount = (authActions.match(/checkTurnstile\(formData\)/g) ?? []).length
check('all three affected flows call the captcha guard', captchaGuardCount === 3, `found ${captchaGuardCount}`)

// updateUser takes no captchaToken in @supabase/auth-js -- gating it would
// block password resets with a token Supabase would never validate.
const updateUserIdx = authActions.indexOf('auth.updateUser(')
check('updateUser is present', updateUserIdx > -1)
check(
  'updateUser is NOT given a captchaToken',
  updateUserIdx > -1 && !/captchaToken/.test(authActions.slice(updateUserIdx, updateUserIdx + 300))
)

// Fail closed: a deployment with no site key must refuse, not silently allow.
check(
  'missing configuration blocks the action rather than bypassing it',
  /if \(!TURNSTILE_CONFIGURED\)[\s\S]{0,300}return TURNSTILE_UNAVAILABLE_MESSAGE/.test(authActions)
)
check(
  'signUp validates email format before calling Supabase',
  authActions.indexOf('isValidEmailFormat') < authActions.indexOf('auth.signUp(')
)
check('invalid email surfaces the shared message', authActions.includes('INVALID_EMAIL_MESSAGE'))
check('INVALID_EMAIL_MESSAGE is user-facing plain text', INVALID_EMAIL_MESSAGE === 'Enter a valid email address.')

// ---------------------------------------------------------------------------
section('Secret handling')
// ---------------------------------------------------------------------------

const allSource = [turnstileLib, authActions, widget, submit, signUpPage, loginPage, forgotPage].join('\n')

check(
  'no NEXT_PUBLIC_ variable named like a secret',
  !/NEXT_PUBLIC_[A-Z_]*(SECRET|PRIVATE)/.test(allSource)
)
check('the Turnstile secret is never read by application code', !/TURNSTILE_SECRET/.test(allSource))
// Matches a real request to Cloudflare's verification endpoint, not the prose
// explaining that Supabase is the one making it. An app-side siteverify call
// would mean the secret had leaked into this codebase.
check(
  'no siteverify request is made from app code (Supabase owns verification)',
  !/https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/.test(allSource)
)
// A token in a log line or a URL is a token that can be replayed or captured.
check('captcha tokens are never logged', !/console\.(log|error|warn)\([^)]*[Tt]oken/.test(allSource))
check(
  'no hard-coded live-looking Turnstile key is committed',
  !/0x4[A-Za-z0-9]{20,}/.test(allSource),
  'looks like a real Turnstile key literal'
)
check(
  '.env.local.example ships the site key placeholder empty',
  /NEXT_PUBLIC_TURNSTILE_SITE_KEY=\s*$/m.test(envExample)
)
check(
  '.env.local.example states the secret does not belong in env',
  /secret[\s\S]{0,300}Supabase dashboard/i.test(envExample)
)

// ---------------------------------------------------------------------------
section('Widget behaviour and failure handling')
// ---------------------------------------------------------------------------

check('widget is a client component', /^'use client'/m.test(widget))
check('widget loads the official Cloudflare script', widget.includes('https://challenges.cloudflare.com/turnstile/v0/api.js'))
check('script is loaded once per document via a stable id', widget.includes("SCRIPT_ID = 'cf-turnstile-script'"))
check('explicit render mode is used', widget.includes('render=explicit'))
check('lowest-friction appearance is requested', widget.includes("appearance: 'interaction-only'"))

// Expiry/error/timeout must clear the token, otherwise a stale single-use
// token gets submitted and Supabase rejects the whole attempt.
for (const cb of ['expired-callback', 'error-callback', 'timeout-callback'] as const) {
  check(`${cb} is handled`, widget.includes(`'${cb}'`))
}
check("expiry clears the held token", /'expired-callback':\s*\(\)\s*=>\s*apply\(''/.test(widget))
check('widget is removed on unmount', /window\.turnstile\.remove\(/.test(widget))
check('token travels in a hidden field, not a URL', widget.includes(`name={TURNSTILE_FIELD_NAME}`) && widget.includes('type="hidden"'))
check('status is announced politely to assistive tech', /aria-live="polite"/.test(widget))
check(
  'token is not persisted to storage',
  !/localStorage|sessionStorage|document\.cookie/.test(allSource)
)

check('submit is disabled without a token or configuration', submit.includes('disabled={!TURNSTILE_CONFIGURED || !token}'))
check(
  'the disabled button is documented as UX, not security',
  /NOT the security control/i.test(submit)
)

// ---------------------------------------------------------------------------
section('Auth pages')
// ---------------------------------------------------------------------------

for (const [name, source] of [
  ['sign-up', signUpPage],
  ['login', loginPage],
  ['forgot-password', forgotPage],
] as const) {
  check(`${name} renders the captcha-gated submit`, source.includes('<CaptchaProtectedSubmit'))
  check(`${name} no longer uses a bare submit button`, !/formAction=\{(signUp|login)\} className/.test(source))
  check(`${name} can display an error`, /\{error && \(/.test(source))
}

// Exact copy required by the brief.
const GUIDANCE =
  'Please use an email address you can access. It may be needed for password recovery and\n            important account-related communication.'
check('sign-up shows the required guidance copy', signUpPage.includes(GUIDANCE))
check('guidance is linked to the input for screen readers', signUpPage.includes('aria-describedby="email-guidance"'))

// The guidance must not imply a verification email is coming -- none is sent.
const promises = [/we(?:'| wi)ll send you (?:a|an) (?:confirmation|verification)/i, /verify your email/i, /check your inbox to activate/i, /confirmation link/i]
for (const pattern of promises) {
  check(`sign-up makes no verification promise (${pattern.source.slice(0, 32)})`, !pattern.test(signUpPage))
}

console.log(`\n${passed} passed, ${failures} failed`)
process.exit(failures > 0 ? 1 : 0)
