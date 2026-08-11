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
  safeAuthErrorCode,
  PASSWORD_RESET_FAILURE_MESSAGES,
  PASSWORD_UPDATED_MESSAGE,
  RECOVERY_ERROR_CODE,
  RECOVERY_LINK_INVALID_MESSAGE,
  classifyPasswordResetError,
  type PasswordResetFailure,
} from '../lib/auth-messages'
import { postAuthDestinationFor } from '../lib/auth-destination'
import {
  RECOVERY_COOKIE_NAME,
  hasValidRecoveryMarker,
  recoveryCookieOptions,
  recoveryMarkerFor,
} from '../lib/auth-recovery-state'

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
 * A cookie jar standing in for next/headers, so marker writes and deletes
 * are observable.
 */
function makeJar(initial: Record<string, string> = {}) {
  const jar = new Map(Object.entries(initial))
  return {
    get: (name: string) => (jar.has(name) ? { value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => {
      jar.set(name, value)
    },
    delete: (name: string) => {
      jar.delete(name)
    },
    has: (name: string) => jar.has(name),
    read: (name: string) => jar.get(name),
  }
}

type Jar = ReturnType<typeof makeJar>

/**
 * Mirrors app/auth/callback/route.ts, including marker writes and clears.
 * `exchangeCalls` makes "exactly once" verifiable.
 */
function simulateCallback(params: {
  code: string | null
  next?: string | null
  after?: string | null
  exchangeSucceeds: boolean
  exchangedUserId?: string
  jar?: Jar
}) {
  const origin = 'https://irpgenie.com'
  const jar = params.jar ?? makeJar()
  let exchangeCalls = 0

  const next = safeInternalPath(params.next, '/')
  const after = safeInternalPath(params.after, '/')
  const isRecovery = isRecoveryDestination(next)
  const failureUrl = isRecovery
    ? `${origin}${RESET_PASSWORD_PATH}?error=${RECOVERY_ERROR_CODE}`
    : `${origin}/auth/login?error=Authentication+failed`

  const clearRecoveryMarker = () => jar.delete(RECOVERY_COOKIE_NAME)

  if (!params.code) {
    if (isRecovery) clearRecoveryMarker()
    return { location: failureUrl, exchangeCalls, jar, markerWritten: false }
  }

  exchangeCalls += 1
  if (!params.exchangeSucceeds) {
    if (isRecovery) clearRecoveryMarker()
    return { location: failureUrl, exchangeCalls, jar, markerWritten: false }
  }

  let markerWritten = false
  if (isRecovery) {
    const userId = params.exchangedUserId
    if (!userId) {
      clearRecoveryMarker()
      return { location: failureUrl, exchangeCalls, jar, markerWritten: false }
    }
    jar.set(RECOVERY_COOKIE_NAME, recoveryMarkerFor(userId))
    markerWritten = true
  }

  const destination = next.startsWith('/onboarding')
    ? `${next}?next=${encodeURIComponent(after)}`
    : next

  return { location: `${origin}${destination}`, exchangeCalls, jar, markerWritten }
}

/** Mirrors the gate in app/auth/reset-password/page.tsx. */
function simulateResetPage(params: { jar: Jar; sessionUserId: string | null }) {
  const user = params.sessionUserId
  const isRecoveryFlow = hasValidRecoveryMarker(params.jar.get(RECOVERY_COOKIE_NAME)?.value, user)
  return { rendersForm: Boolean(user) && isRecoveryFlow }
}

// ---------------------------------------------------------------------------
section('Reset action branch order (simulated)')
// ---------------------------------------------------------------------------

/** Mirrors resetPassword() in lib/actions/auth.ts, marker handling included. */
function simulateResetPassword(params: {
  password: string | null
  sessionUserId: string | null
  jar: Jar
  updateError?: { code?: string; name?: string }
}) {
  let updateCalls = 0
  const consume = () => params.jar.delete(RECOVERY_COOKIE_NAME)

  if (typeof params.password !== 'string' || params.password.length < MIN_PASSWORD_LENGTH) {
    // Marker deliberately KEPT so the learner can correct the password.
    return { status: 'error' as const, failure: 'password-too-short' as PasswordResetFailure, updateCalls }
  }

  const isRecoveryFlow = hasValidRecoveryMarker(
    params.jar.get(RECOVERY_COOKIE_NAME)?.value,
    params.sessionUserId
  )

  if (!params.sessionUserId || !isRecoveryFlow) {
    consume()
    return { status: 'error' as const, failure: 'no-recovery-session' as PasswordResetFailure, updateCalls }
  }

  updateCalls += 1
  if (params.updateError) {
    const failure = classifyPasswordResetError(params.updateError)
    if (failure === 'no-recovery-session') consume()
    return { status: 'error' as const, failure, updateCalls }
  }

  consume()
  return { status: 'success' as const, updateCalls }
}

/** A browser that has just followed a working recovery link. */
function freshRecovery(userId = 'user-1') {
  return simulateCallback({
    code: 'pkce-code',
    next: RESET_PASSWORD_PATH,
    exchangeSucceeds: true,
    exchangedUserId: userId,
  }).jar
}

{
  const jar = freshRecovery()
  check('a fresh recovery link renders the form', simulateResetPage({ jar, sessionUserId: 'user-1' }).rendersForm)

  const ok = simulateResetPassword({ password: 'a-good-password', sessionUserId: 'user-1', jar })
  check('a fresh recovery session can update the password', ok.status === 'success')
  check('the update is attempted exactly once', ok.updateCalls === 1)
}

{
  const jar = freshRecovery()
  const noSession = simulateResetPassword({ password: 'a-good-password', sessionUserId: null, jar })
  check('no session fails safely', noSession.status === 'error')
  check('no session is reported as such, not as a weak password', noSession.failure === 'no-recovery-session')
  check('no session never reaches updateUser', noSession.updateCalls === 0)
}

{
  const jar = freshRecovery()
  const short = simulateResetPassword({ password: 'short', sessionUserId: 'user-1', jar })
  check('a too-short password is rejected', short.status === 'error')
  check('a too-short password is NOT blamed on an expired link', short.failure === 'password-too-short')
  check('a too-short password never reaches updateUser', short.updateCalls === 0)
  check('a too-short password keeps the marker so the learner can retry', jar.has(RECOVERY_COOKIE_NAME))
  check(
    'and the form is still usable for that retry',
    simulateResetPage({ jar, sessionUserId: 'user-1' }).rendersForm
  )
}

{
  const jar = freshRecovery()
  const missing = simulateResetPassword({ password: null, sessionUserId: 'user-1', jar })
  check('a missing password field fails safely', missing.status === 'error')
}

{
  const jar = freshRecovery()
  const reused = simulateResetPassword({
    password: 'a-good-password',
    sessionUserId: 'user-1',
    jar,
    updateError: { code: 'same_password' },
  })
  check('an unchanged password is reported accurately', reused.failure === 'password-unchanged')
}

{
  const jar = freshRecovery()
  const stale = simulateResetPassword({
    password: 'a-good-password',
    sessionUserId: 'user-1',
    jar,
    updateError: { name: 'AuthSessionMissingError' },
  })
  check('a session lost between check and update is reported as a session problem', stale.failure === 'no-recovery-session')
  check('and that clears the marker', !jar.has(RECOVERY_COOKIE_NAME))
}

// ---------------------------------------------------------------------------
section('getUser() alone is not proof of a recovery flow (simulated)')
// ---------------------------------------------------------------------------

// The three cases the first cut of this PR got wrong: getUser() proves there
// is A session, never that it came from a recovery link.

{
  // 1. An ordinary signed-in learner types the URL. Perfectly valid session,
  //    no recovery marker.
  const jar = makeJar()
  check('an ordinary signed-in user gets no recovery form', !simulateResetPage({ jar, sessionUserId: 'user-1' }).rendersForm)

  const attempt = simulateResetPassword({ password: 'a-good-password', sessionUserId: 'user-1', jar })
  check('and the action refuses as well', attempt.status === 'error')
  check('without ever calling updateUser', attempt.updateCalls === 0)
  check('reported as a recovery problem, not a password problem', attempt.failure === 'no-recovery-session')
}

{
  // 2. A failed or expired callback while a session cookie already exists.
  const jar = makeJar({ [RECOVERY_COOKIE_NAME]: recoveryMarkerFor('user-1') })
  check('the stale marker starts present', jar.has(RECOVERY_COOKIE_NAME))

  const failed = simulateCallback({
    code: 'expired',
    next: RESET_PASSWORD_PATH,
    exchangeSucceeds: false,
    jar,
  })
  check('a failed callback clears the stale marker', !failed.jar.has(RECOVERY_COOKIE_NAME))
  check(
    'so an existing session cannot open the form',
    !simulateResetPage({ jar, sessionUserId: 'user-1' }).rendersForm
  )
}

{
  // 3. Reopening a link that was already used successfully.
  const jar = freshRecovery()
  const first = simulateResetPassword({ password: 'a-good-password', sessionUserId: 'user-1', jar })
  check('the first use succeeds', first.status === 'success')
  check('success consumes the recovery marker', !jar.has(RECOVERY_COOKIE_NAME))
  check(
    'reopening the used link shows no form even though the session is live',
    !simulateResetPage({ jar, sessionUserId: 'user-1' }).rendersForm
  )

  const second = simulateResetPassword({ password: 'another-password', sessionUserId: 'user-1', jar })
  check('a second submission is refused', second.status === 'error')
  check('and never reaches updateUser', second.updateCalls === 0)

  // Following the used link again re-runs the callback, which fails.
  const replay = simulateCallback({
    code: 'already-used',
    next: RESET_PASSWORD_PATH,
    exchangeSucceeds: false,
    jar,
  })
  check('replaying the used link lands on the recovery error', replay.location.includes(RECOVERY_ERROR_CODE))
  check('and still writes no marker', !jar.has(RECOVERY_COOKIE_NAME))
}

{
  // A marker issued for a different account must not be honoured.
  const jar = makeJar({ [RECOVERY_COOKIE_NAME]: recoveryMarkerFor('user-2') })
  check(
    'a marker bound to another account is rejected',
    !simulateResetPage({ jar, sessionUserId: 'user-1' }).rendersForm
  )
}

// Marker helper edge cases, executed directly.
check('an empty marker is invalid', !hasValidRecoveryMarker('', 'user-1'))
check('a missing marker is invalid', !hasValidRecoveryMarker(undefined, 'user-1'))
check('a marker with no session is invalid', !hasValidRecoveryMarker(recoveryMarkerFor('user-1'), null))
check('a marker with an empty user id is invalid', !hasValidRecoveryMarker('', ''))
check('a matching marker is valid', hasValidRecoveryMarker(recoveryMarkerFor('user-1'), 'user-1'))

const cookieOptions = recoveryCookieOptions()
check('the marker cookie is HttpOnly, so client script cannot set it', cookieOptions.httpOnly === true)
check('the marker cookie is SameSite=Lax', cookieOptions.sameSite === 'lax')
check('the marker cookie expires quickly', cookieOptions.maxAge <= 15 * 60)

// ---------------------------------------------------------------------------
section('Failure classification by stable code or name (executed)')
// ---------------------------------------------------------------------------

// Classified on @supabase/auth-js's stable ErrorCode values and error class
// names, never on message text -- Supabase can reword a message in any
// release, and AuthSessionMissingError carries no code at all.

const classifications: Array<[{ code?: string; name?: string }, PasswordResetFailure, string]> = [
  [{ code: 'session_not_found' }, 'no-recovery-session', 'code'],
  [{ code: 'session_expired' }, 'no-recovery-session', 'code'],
  [{ code: 'bad_jwt' }, 'no-recovery-session', 'code'],
  [{ code: 'refresh_token_already_used' }, 'no-recovery-session', 'code'],
  [{ code: 'user_not_found' }, 'no-recovery-session', 'code'],
  // Constructed by auth-js with code: undefined -- name is the only signal.
  [{ name: 'AuthSessionMissingError' }, 'no-recovery-session', 'name only'],
  [{ name: 'AuthInvalidJwtError', code: 'invalid_jwt' }, 'no-recovery-session', 'name + code'],
  [{ code: 'same_password' }, 'password-unchanged', 'code'],
  [{ code: 'weak_password' }, 'password-too-short', 'code'],
  [{ name: 'AuthWeakPasswordError' }, 'password-too-short', 'name only'],
  [{ code: 'over_request_rate_limit' }, 'unknown', 'unrecognised code'],
  [{ name: 'AuthRetryableFetchError' }, 'unknown', 'unrecognised name'],
  [{}, 'unknown', 'no code and no name'],
]

for (const [error, expected, why] of classifications) {
  check(
    `classifies ${JSON.stringify(error)} as ${expected} (${why})`,
    classifyPasswordResetError(error) === expected
  )
}

check('a null error is safe', classifyPasswordResetError(null) === 'unknown')
check('an undefined error is safe', classifyPasswordResetError(undefined) === 'unknown')

// Message text must have no influence at all: an error whose prose screams
// "expired session" but carries an unrelated code stays unknown.
check(
  'message text does not drive classification',
  classifyPasswordResetError({ code: 'over_request_rate_limit', name: 'AuthApiError' }) === 'unknown'
)

// Only stable identifiers are ever logged.
check('a code is preferred for logging', safeAuthErrorCode({ code: 'weak_password', name: 'AuthWeakPasswordError' }) === 'weak_password')
check('the name is used when no code exists', safeAuthErrorCode({ name: 'AuthSessionMissingError' }) === 'AuthSessionMissingError')
check('an empty code falls through to the name', safeAuthErrorCode({ code: '', name: 'AuthApiError' }) === 'AuthApiError')
check('a bare error logs a placeholder', safeAuthErrorCode({}) === 'unspecified')
check('a null error logs a placeholder', safeAuthErrorCode(null) === 'unspecified')

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
const noSessionIdx = resetPage.indexOf('if (!user || !isRecoveryFlow)')
const formIdx = resetPage.indexOf('<ResetPasswordForm')
check('the page has a not-a-recovery-flow branch', noSessionIdx > -1)
check('it comes before the form', noSessionIdx > -1 && formIdx > -1 && noSessionIdx < formIdx)
check(
  'it returns rather than falling through to the form',
  /if \(!user \|\| !isRecoveryFlow\) \{[\s\S]{0,400}return \(/.test(resetPage)
)
check('the page offers a new link when there is no session', resetPage.includes('/auth/forgot-password'))
check('there is no client-held authorisation flag', !/isRecovery|hasRecovery|canReset/.test(resetForm))
check('the marker is never read in client code', !resetForm.includes('RECOVERY_COOKIE_NAME'))
check('the page requires the marker as well as the session', /hasValidRecoveryMarker\(/.test(resetPage))
check('the page refuses when either signal is missing', /if \(!user \|\| !isRecoveryFlow\)/.test(resetPage))
check('the action requires the marker as well as the session', /hasValidRecoveryMarker\(/.test(authActions))
check('the marker is written in exactly one place', (callback.match(/cookieStore\.set\(RECOVERY_COOKIE_NAME/g) ?? []).length === 1)
check('nothing but the callback writes the marker', !/cookies\(\)[\s\S]*?\.set\(RECOVERY_COOKIE_NAME/.test(resetPage))
check('the action consumes the marker on success', /consumeRecoveryMarker\(\)[\s\S]{0,400}status: 'success'/.test(authActions))
check('the callback clears the marker when the exchange fails', /if \(isRecovery\) clearRecoveryMarker\(\)/.test(callback))
check(
  'the action re-checks both signals itself rather than trusting the page',
  /getUser\(\)[\s\S]{0,600}hasValidRecoveryMarker\([\s\S]{0,300}no-recovery-session/.test(authActions)
)

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
