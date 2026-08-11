/**
 * Password-recovery session flow regression pass (PR #187).
 *
 * HONEST SCOPE. Three kinds of check live here and they prove different
 * amounts:
 *
 *   1. EXECUTED -- redirect-target safety, failure classification, message
 *      copy and the destination rule are pure functions, imported and run
 *      against real inputs. These genuinely test the code.
 *
 *   2. SIMULATED -- the callback's decision table and the reset action's
 *      branch order are replayed against fakes below. These prove the logic
 *      is right; they do not touch Supabase.
 *
 *   3. SOURCE -- a handful of assertions about wiring that cannot run
 *      outside a Next request.
 *
 * What NONE of this proves: that Supabase's PKCE exchange succeeds and that
 * the resulting Set-Cookie survives the redirect in production. No test here
 * performs a real code exchange or inspects a real cookie jar. That is
 * browser-verifiable only, and is item 3 of the manual checklist in the PR.
 *
 * Usage:
 *   npm run test:auth-recovery
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { isRecoveryDestination, safeInternalPath, RESET_PASSWORD_PATH } from '../lib/auth-redirect'
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_RESET_FAILURE_MESSAGES,
  PASSWORD_UPDATED_MESSAGE,
  RECOVERY_ERROR_CODE,
  RECOVERY_LINK_INVALID_MESSAGE,
  classifyPasswordResetError,
  type PasswordResetFailure,
} from '../lib/auth-messages'
import { postAuthDestinationFor } from '../lib/auth-destination'

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

const authActions = read('lib', 'actions', 'auth.ts')
const callback = read('app', 'auth', 'callback', 'route.ts')
const resetPage = read('app', 'auth', 'reset-password', 'page.tsx')
const resetForm = read('components', 'auth', 'reset-password-form.tsx')

// ---------------------------------------------------------------------------
section('Recovery links target the PKCE callback (source)')
// ---------------------------------------------------------------------------

const resetForEmailIdx = authActions.indexOf('resetPasswordForEmail(')
check('resetPasswordForEmail is still called', resetForEmailIdx > -1)

const redirectSlice = resetForEmailIdx > -1 ? authActions.slice(resetForEmailIdx, resetForEmailIdx + 400) : ''
check('the recovery email points at /auth/callback', /redirectTo: `\$\{SITE_URL\}\/auth\/callback\?next=/.test(redirectSlice))
check(
  'it no longer points straight at the reset form (the production bug)',
  !/redirectTo:[^\n]*\/auth\/reset-password`/.test(redirectSlice)
)
check(
  'the destination is URL-encoded',
  /next=\$\{encodeURIComponent\(RESET_PASSWORD_PATH\)\}/.test(redirectSlice)
)
check(
  'the site URL helper is used, not a bare env read that can be empty',
  !/process\.env\.NEXT_PUBLIC_SITE_URL[^\n]*reset-password/.test(authActions)
)

// ---------------------------------------------------------------------------
section('Redirect-target safety (executed)')
// ---------------------------------------------------------------------------

const allowedPaths = ['/', '/auth/reset-password', '/onboarding', '/learn/lesson-1', '/deep-dives/triggers']
for (const path of allowedPaths) {
  check(`allows the internal path ${path}`, safeInternalPath(path, '/') === path)
}

const rejectedPaths: Array<[string | null | undefined, string]> = [
  ['//evil.com', 'protocol-relative'],
  ['///evil.com', 'triple slash'],
  ['https://evil.com', 'absolute URL'],
  ['http://evil.com', 'absolute URL'],
  ['/\\evil.com', 'backslash variant of protocol-relative'],
  ['/path\\to', 'embedded backslash'],
  ['javascript:alert(1)', 'scheme, no leading slash'],
  ['/javascript:alert(1)', 'scheme after a slash'],
  ['auth/reset-password', 'relative, no leading slash'],
  ['', 'empty'],
  [null, 'null'],
  [undefined, 'undefined'],
  ['/foo\nbar', 'embedded newline'],
  ['/foo\rbar', 'embedded carriage return'],
  ['/foo\tbar', 'embedded tab'],
]

for (const [candidate, why] of rejectedPaths) {
  check(
    `rejects ${JSON.stringify(candidate)} (${why})`,
    safeInternalPath(candidate, '/fallback') === '/fallback'
  )
}

check('recognises the reset form as a recovery destination', isRecoveryDestination(RESET_PASSWORD_PATH))
check('recognises it with a query string', isRecoveryDestination(`${RESET_PASSWORD_PATH}?error=x`))
check('does not mistake the login page for recovery', !isRecoveryDestination('/auth/login'))
check('does not mistake a prefix lookalike for recovery', !isRecoveryDestination('/auth/reset-password-evil'))
check('does not mistake home for recovery', !isRecoveryDestination('/'))

// ---------------------------------------------------------------------------
section('Callback decision table (simulated)')
// ---------------------------------------------------------------------------

/**
 * Mirrors app/auth/callback/route.ts. `exchange` stands in for Supabase and
 * records how many times it was called, so "exactly once" is verifiable.
 */
function simulateCallback(params: {
  code: string | null
  next?: string | null
  after?: string | null
  exchangeSucceeds: boolean
}) {
  const origin = 'https://irpgenie.com'
  let exchangeCalls = 0

  const next = safeInternalPath(params.next, '/')
  const after = safeInternalPath(params.after, '/')
  const isRecovery = isRecoveryDestination(next)
  const failureUrl = isRecovery
    ? `${origin}${RESET_PASSWORD_PATH}?error=${RECOVERY_ERROR_CODE}`
    : `${origin}/auth/login?error=Authentication+failed`

  if (!params.code) {
    return { location: failureUrl, exchangeCalls, sessionWritten: false }
  }

  exchangeCalls += 1
  if (!params.exchangeSucceeds) {
    return { location: failureUrl, exchangeCalls, sessionWritten: false }
  }

  const destination = next.startsWith('/onboarding')
    ? `${next}?next=${encodeURIComponent(after)}`
    : next

  return { location: `${origin}${destination}`, exchangeCalls, sessionWritten: true }
}

{
  const ok = simulateCallback({ code: 'pkce-code', next: RESET_PASSWORD_PATH, exchangeSucceeds: true })
  check('a valid recovery code is exchanged exactly once', ok.exchangeCalls === 1)
  check('a valid recovery code opens the reset form', ok.location === `https://irpgenie.com${RESET_PASSWORD_PATH}`)
  check('the reset form is only reached after a session exists', ok.sessionWritten)
}

{
  const missing = simulateCallback({ code: null, next: RESET_PASSWORD_PATH, exchangeSucceeds: true })
  check('a missing code attempts no exchange', missing.exchangeCalls === 0)
  check('a missing code never opens a usable reset form', !missing.sessionWritten)
  check(
    'a missing code lands on the recovery-specific error',
    missing.location === `https://irpgenie.com${RESET_PASSWORD_PATH}?error=${RECOVERY_ERROR_CODE}`
  )
}

{
  const failed = simulateCallback({ code: 'expired-or-reused', next: RESET_PASSWORD_PATH, exchangeSucceeds: false })
  check('an expired or reused code is attempted once and only once', failed.exchangeCalls === 1)
  check('a failed exchange never opens a usable reset form', !failed.sessionWritten)
  check(
    'a failed recovery exchange does not dump the user on a generic login error',
    !failed.location.includes('/auth/login')
  )
  check('a failed recovery exchange offers the recovery path', failed.location.includes(RESET_PASSWORD_PATH))
}

{
  // Non-recovery flows keep their existing behaviour exactly.
  const signup = simulateCallback({ code: 'c', next: '/onboarding', after: '/learn', exchangeSucceeds: true })
  check(
    'the signup/onboarding flow is unchanged',
    signup.location === 'https://irpgenie.com/onboarding?next=%2Flearn'
  )
  const signupFailed = simulateCallback({ code: 'c', next: '/onboarding', exchangeSucceeds: false })
  check(
    'a non-recovery failure still uses the login error',
    signupFailed.location === 'https://irpgenie.com/auth/login?error=Authentication+failed'
  )
}

{
  const tampered = simulateCallback({ code: 'c', next: '//evil.com', exchangeSucceeds: true })
  check('a tampered destination falls back to home', tampered.location === 'https://irpgenie.com/')
  check('a tampered destination cannot leave the origin', tampered.location.startsWith('https://irpgenie.com/'))
}

// The code itself must never be re-emitted anywhere.
check('the callback never puts the code in a redirect', !/code[^\n]*\$\{code\}/.test(callback))
// Matches the code being interpolated or passed as an argument -- not the
// word "code" appearing in a human-readable label.
check(
  'the callback never logs the code',
  !/console\.[a-z]+\([^)]*(\$\{code\}|[,(]\s*code)/.test(callback)
)
check('the callback never logs tokens', !/console\.[a-z]+\([^)]*(access_token|refresh_token|session)/.test(callback))
check('the callback does not use the service-role key', !/SERVICE_ROLE|admin/.test(callback))
check('the callback exchanges the code in exactly one place', (callback.match(/exchangeCodeForSession\(/g) ?? []).length === 1)

// ---------------------------------------------------------------------------
section('Reset action branch order (simulated)')
// ---------------------------------------------------------------------------

/** Mirrors resetPassword() in lib/actions/auth.ts. */
function simulateResetPassword(params: {
  password: string | null
  hasSession: boolean
  updateError?: string
}) {
  let updateCalls = 0

  if (typeof params.password !== 'string' || params.password.length < MIN_PASSWORD_LENGTH) {
    return { status: 'error' as const, failure: 'password-too-short' as PasswordResetFailure, updateCalls }
  }
  if (!params.hasSession) {
    return { status: 'error' as const, failure: 'no-recovery-session' as PasswordResetFailure, updateCalls }
  }

  updateCalls += 1
  if (params.updateError) {
    return { status: 'error' as const, failure: classifyPasswordResetError(params.updateError), updateCalls }
  }

  return { status: 'success' as const, updateCalls }
}

{
  const ok = simulateResetPassword({ password: 'a-good-password', hasSession: true })
  check('a fresh recovery session can update the password', ok.status === 'success')
  check('the update is attempted exactly once', ok.updateCalls === 1)
}

{
  const noSession = simulateResetPassword({ password: 'a-good-password', hasSession: false })
  check('no recovery session fails safely', noSession.status === 'error')
  check('no recovery session is reported as such, not as a weak password', noSession.failure === 'no-recovery-session')
  check('no recovery session never reaches updateUser', noSession.updateCalls === 0)
}

{
  const short = simulateResetPassword({ password: 'short', hasSession: true })
  check('a too-short password is rejected', short.status === 'error')
  check('a too-short password is NOT blamed on an expired link', short.failure === 'password-too-short')
  check('a too-short password never reaches updateUser', short.updateCalls === 0)
}

{
  const missing = simulateResetPassword({ password: null, hasSession: true })
  check('a missing password field fails safely', missing.status === 'error')
}

{
  const reused = simulateResetPassword({
    password: 'a-good-password',
    hasSession: true,
    updateError: 'New password should be different from the old password.',
  })
  check('an unchanged password is reported accurately', reused.failure === 'password-unchanged')
}

{
  const stale = simulateResetPassword({
    password: 'a-good-password',
    hasSession: true,
    updateError: 'Auth session missing!',
  })
  check('a session lost between check and update is reported as a session problem', stale.failure === 'no-recovery-session')
}

// ---------------------------------------------------------------------------
section('Failure classification (executed)')
// ---------------------------------------------------------------------------

const classifications: Array<[string, PasswordResetFailure]> = [
  ['Auth session missing!', 'no-recovery-session'],
  ['session_not_found', 'no-recovery-session'],
  ['JWT expired', 'no-recovery-session'],
  ['invalid claim: missing sub claim', 'no-recovery-session'],
  ['New password should be different from the old password.', 'password-unchanged'],
  ['Password should be at least 6 characters.', 'password-too-short'],
  ['Password is too weak', 'password-too-short'],
  ['something nobody has seen before', 'unknown'],
]

for (const [raw, expected] of classifications) {
  check(`classifies ${JSON.stringify(raw)} as ${expected}`, classifyPasswordResetError(raw) === expected)
}

check(
  'every category has distinct copy',
  new Set(Object.values(PASSWORD_RESET_FAILURE_MESSAGES)).size ===
    Object.keys(PASSWORD_RESET_FAILURE_MESSAGES).length
)
for (const [failure, message] of Object.entries(PASSWORD_RESET_FAILURE_MESSAGES)) {
  check(`the ${failure} message never claims success`, !/\bsuccess/i.test(message))
  check(`the ${failure} message is not the success copy`, message !== PASSWORD_UPDATED_MESSAGE)
  check(`the ${failure} message leaks no Supabase internals`, !/jwt|claim|session_id|token/i.test(message))
}
check(
  'only the session category blames the link',
  /expire/i.test(PASSWORD_RESET_FAILURE_MESSAGES['no-recovery-session']) &&
    !/expire/i.test(PASSWORD_RESET_FAILURE_MESSAGES['password-too-short'])
)
check('the callback error code is an opaque code, not display copy', !/\s/.test(RECOVERY_ERROR_CODE))
check(
  'the shared invalid-link copy is the session category',
  RECOVERY_LINK_INVALID_MESSAGE === PASSWORD_RESET_FAILURE_MESSAGES['no-recovery-session']
)

// ---------------------------------------------------------------------------
section('Success-state integrity (source + executed)')
// ---------------------------------------------------------------------------

// The PR #186 hole: ?status=success rendered the success screen to anyone.
check('the reset page compares no status parameter', !/status\s*===/.test(resetPage))
check('the reset page destructures no query value', !/await searchParams/.test(resetPage))
check('the reset page reads no searchParams at all', !/searchParams/.test(resetPage))
check('the success wording is not present in the page shell', !resetPage.includes(PASSWORD_UPDATED_MESSAGE))
check(
  'success is rendered only from returned action state',
  /state\.status === 'success'/.test(resetForm)
)
check('the action returns the success copy from the shared constant', authActions.includes('PASSWORD_UPDATED_MESSAGE'))

// Server-authoritative gate.
check('the page gates on the Supabase session', /auth\.getUser\(\)/.test(resetPage))
// The no-session branch must return before the form is ever reached.
const noSessionIdx = resetPage.indexOf('if (!user)')
const formIdx = resetPage.indexOf('<ResetPasswordForm')
check('the page has a no-session branch', noSessionIdx > -1)
check('it comes before the form', noSessionIdx > -1 && formIdx > -1 && noSessionIdx < formIdx)
check(
  'it returns rather than falling through to the form',
  /if \(!user\) \{[\s\S]{0,400}return \(/.test(resetPage)
)
check('the page offers a new link when there is no session', resetPage.includes('/auth/forgot-password'))
check('there is no client-held authorisation flag', !/isRecovery|hasRecovery|canReset/.test(resetForm))
check('the action re-checks the session itself', /getUser\(\)[\s\S]{0,300}no-recovery-session/.test(authActions))

// Password privacy.
check('the password is never returned in action state', !/password[,:]\s*password/.test(authActions))
check('the form never re-renders a submitted password', !/defaultValue=/.test(resetForm))
// Every console.* in this file logs only a fixed label plus error.message.
// This matches the password being passed as an argument or interpolated.
check(
  'the password is never logged',
  !/console\.[a-z]+\([^)]*(\$\{password\}|[,(]\s*password)/.test(authActions)
)
check('the password never enters a URL', !/encodeURIComponent\(password\)/.test(authActions))
check('no reset outcome travels by redirect any more', !/reset-password\?status=/.test(authActions))

// Continuation destination.
check('the destination is computed server-side', /postAuthDestinationFor\(profile\)/.test(authActions))
for (const profile of [null, { onboarding_response: 'x', onboarding_skipped: null }]) {
  const destination = postAuthDestinationFor(profile)
  check(`destination ${destination} stays internal`, safeInternalPath(destination, '/BAD') === destination)
}
check('the continue link uses the returned destination', /href=\{state\.destination\}/.test(resetForm))

// Duplicate submission.
check('the submit button is the pending-aware one', /<SubmitButton/.test(resetForm))
check('no raw submit button remains', !/<button[^>]*type="submit"/.test(resetForm))

// ---------------------------------------------------------------------------
section('Untouched behaviour')
// ---------------------------------------------------------------------------

check('login still exists', /export async function login\(/.test(authActions))
check('signUp still exists', /export async function signUp\(/.test(authActions))
check('signUp still validates email format', /isValidEmailFormat/.test(authActions))
check('forgotPassword still returns a non-specific message', /If an account exists for that email/.test(authActions))
check('the captcha gate still runs on all three flows', (authActions.match(/captchaGate\(formData\)/g) ?? []).length === 3)
check('the captcha enforcement flag is still consulted', /isTurnstileEnforcementEnabled\(\)/.test(authActions))
// Scoped to the function body -- a window measured from another flow's gate
// would prove nothing. updateUser accepts no captchaToken, so gating it
// would block resets with a token Supabase would never validate.
const resetBody = authActions.slice(authActions.indexOf('export async function resetPassword('))
check('resetPassword is still not captcha-gated', !resetBody.includes('captchaGate'))
check('no service-role key is used in auth actions', !/SERVICE_ROLE/.test(authActions))

console.log(`\n${passed} passed, ${failures} failed`)
process.exit(failures > 0 ? 1 : 0)
