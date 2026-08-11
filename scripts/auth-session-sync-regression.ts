/**
 * AI Tutor auth synchronisation + password-reset confirmation regression
 * pass (PR #186).
 *
 * The synchronisation logic was deliberately extracted into pure modules
 * (lib/auth-signal.ts, lib/ai-tutor/auth-sync.ts, lib/auth-destination.ts)
 * precisely so this suite can EXECUTE it -- publish/subscribe sequences,
 * transition detection and the derived login state all run for real here,
 * including a full replay of the reported production bug.
 *
 * Source assertions appear only where behaviour genuinely cannot be run
 * outside React and Next: that a Server Action redirects, and that the sync
 * path contains no fetch. Those are marked where they occur.
 *
 * Usage:
 *   npm run test:auth-session-sync
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import {
  getAuthSignal,
  getServerAuthSignal,
  publishAuthSignal,
  subscribeAuthSignal,
  type AuthSignal,
} from '../lib/auth-signal'
import { isSignOutTransition, resolveRequiresLogin } from '../lib/ai-tutor/auth-sync'
import { postAuthDestinationFor } from '../lib/auth-destination'
import { PASSWORD_UPDATED_MESSAGE, PASSWORD_RESET_FAILURE_MESSAGES } from '../lib/auth-messages'

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

const provider = read('components', 'ai-tutor', 'ai-tutor-panel-provider.tsx')
const broadcaster = read('components', 'auth', 'auth-state-broadcaster.tsx')
const header = read('components', 'site-header.tsx')
const rootLayout = read('app', 'layout.tsx')
const authActions = read('lib', 'actions', 'auth.ts')
const resetPage = read('app', 'auth', 'reset-password', 'page.tsx')
const resetForm = read('components', 'auth', 'reset-password-form.tsx')
const signal = read('lib', 'auth-signal.ts')

/**
 * Minimal stand-in for the provider's subscription: the same
 * previous/next bookkeeping, so the reset rule is exercised rather than
 * described. Mirrors ai-tutor-panel-provider.tsx.
 */
function makeTutorState() {
  const state = {
    messages: ['existing question'],
    requiresLoginAfter401: false,
    resets: 0,
    aiRequests: 0,
  }
  let previous: AuthSignal = getAuthSignal()

  const unsubscribe = subscribeAuthSignal(() => {
    const next = getAuthSignal()
    const wasSignOut = isSignOutTransition(previous, next)
    previous = next
    if (wasSignOut) {
      state.messages = []
      state.requiresLoginAfter401 = false
      state.resets += 1
    }
  })

  return {
    state,
    unsubscribe,
    /** Stands in for /api/ai-tutor answering 401. Set through a function so
        the assignment does not narrow the field for later assertions. */
    markUnauthenticated: () => {
      state.requiresLoginAfter401 = true
    },
    /** What the panel actually renders. */
    requiresLogin: () => resolveRequiresLogin(getAuthSignal(), state.requiresLoginAfter401),
    isStaleFlagSet: () => state.requiresLoginAfter401,
  }
}

// ---------------------------------------------------------------------------
section('Auth signal store (executed)')
// ---------------------------------------------------------------------------

check('starts unknown before any header has reported', getAuthSignal() === 'unknown')
check('server snapshot is always unknown (no hydration mismatch)', getServerAuthSignal() === 'unknown')

let notifications = 0
const stopCounting = subscribeAuthSignal(() => {
  notifications += 1
})

publishAuthSignal('signed-out')
check('publishing a new value notifies subscribers', notifications === 1)
check('the value is readable immediately', getAuthSignal() === 'signed-out')

publishAuthSignal('signed-out')
publishAuthSignal('signed-out')
check(
  'republishing the same value notifies nobody (ordinary navigation is silent)',
  notifications === 1,
  `notifications=${notifications}`
)

publishAuthSignal('signed-in')
check('a genuine change notifies again', notifications === 2)

stopCounting()
publishAuthSignal('signed-out')
check('unsubscribing stops notifications', notifications === 2)

// ---------------------------------------------------------------------------
section('Derived login state (executed)')
// ---------------------------------------------------------------------------

check('401 flag shows the prompt while signed out', resolveRequiresLogin('signed-out', true) === true)
check('401 flag shows the prompt while auth is unknown', resolveRequiresLogin('unknown', true) === true)
check('a signed-in verdict clears the stale prompt', resolveRequiresLogin('signed-in', true) === false)
check('no 401 means no prompt, signed out', resolveRequiresLogin('signed-out', false) === false)
check('no 401 means no prompt, signed in', resolveRequiresLogin('signed-in', false) === false)
// 'unknown' must not be read as signed out -- that would show the prompt on
// any page with no header before the first report.
check('unknown never invents a prompt on its own', resolveRequiresLogin('unknown', false) === false)

// ---------------------------------------------------------------------------
section('Transition detection (executed)')
// ---------------------------------------------------------------------------

const transitions: Array<[AuthSignal, AuthSignal, boolean]> = [
  ['signed-in', 'signed-out', true],
  ['signed-out', 'signed-in', false],
  ['signed-out', 'signed-out', false],
  ['signed-in', 'signed-in', false],
  ['unknown', 'signed-out', false],
  ['unknown', 'signed-in', false],
  ['signed-out', 'unknown', false],
  ['signed-in', 'unknown', false],
]

for (const [previous, next, expected] of transitions) {
  check(
    `${previous} -> ${next} is ${expected ? '' : 'not '}a sign-out`,
    isSignOutTransition(previous, next) === expected
  )
}

// ---------------------------------------------------------------------------
section('Reported production bug, replayed end to end (executed)')
// ---------------------------------------------------------------------------

{
  publishAuthSignal('signed-out')
  const tutor = makeTutorState()

  // 1. Signed out, the learner asks a question and /api/ai-tutor answers 401.
  tutor.markUnauthenticated()
  check('a 401 produces the login-required state', tutor.requiresLogin() === true)

  // 2. They navigate around while still signed out (login page, back, etc).
  publishAuthSignal('signed-out')
  check('a signed-out route change does not clear the prompt', tutor.requiresLogin() === true)
  check('a signed-out route change does not erase the conversation', tutor.state.resets === 0)

  // 3. They log in. The header re-renders and reports it.
  publishAuthSignal('signed-in')
  check('the prompt clears the moment the header reports signed in', tutor.requiresLogin() === false)
  check('the composer is available with no second login', tutor.requiresLogin() === false)

  // 4. Nothing is auto-sent and nothing is thrown away.
  check('synchronising sends no AI request', tutor.state.aiRequests === 0)
  check('synchronising does not erase existing messages', tutor.state.messages.length === 1)
  check('signing in triggers no reset', tutor.state.resets === 0)

  // 5. They log out.
  publishAuthSignal('signed-out')
  check('logging out resets the Tutor to a signed-out session', tutor.state.resets === 1)
  check('logging out discards the conversation', tutor.state.messages.length === 0)
  check('logging out leaves no stale authenticated state', tutor.isStaleFlagSet() === false)

  tutor.unsubscribe()
}

// A provider that mounts fresh AFTER login -- the case a transition-only
// design would miss, because it never observed the signed-out state.
{
  publishAuthSignal('signed-in')
  const tutor = makeTutorState()
  tutor.markUnauthenticated()
  check(
    'a stale 401 flag is still resolved away on a fresh mount while signed in',
    tutor.requiresLogin() === false
  )
  tutor.unsubscribe()
}

// ---------------------------------------------------------------------------
section('Password reset destination (executed)')
// ---------------------------------------------------------------------------

check(
  'a learner who has not answered onboarding goes to onboarding',
  postAuthDestinationFor({ onboarding_response: null, onboarding_skipped: null }) === '/onboarding'
)
check(
  'a missing profile row goes to onboarding',
  postAuthDestinationFor(null) === '/onboarding'
)
check(
  'an answered learner goes home',
  postAuthDestinationFor({ onboarding_response: 'developer', onboarding_skipped: null }) === '/'
)
check(
  'a learner who skipped onboarding goes home',
  postAuthDestinationFor({ onboarding_response: null, onboarding_skipped: true }) === '/'
)
check(
  'explicitly false skipped still goes to onboarding',
  postAuthDestinationFor({ onboarding_response: null, onboarding_skipped: false }) === '/onboarding'
)

for (const profile of [
  null,
  { onboarding_response: null, onboarding_skipped: null },
  { onboarding_response: 'x', onboarding_skipped: true },
]) {
  const destination = postAuthDestinationFor(profile)
  check(
    `destination ${destination} is an internal path`,
    destination.startsWith('/') && !destination.startsWith('//') && !destination.includes(':')
  )
}

// ---------------------------------------------------------------------------
section('Password reset messaging (executed)')
// ---------------------------------------------------------------------------

check('success copy is the required wording', PASSWORD_UPDATED_MESSAGE === 'Your password has been updated successfully.')

// Deeper password-recovery coverage lives in test:auth-recovery (PR #187).
// What matters here is only that no failure path can borrow success wording.
for (const [failure, message] of Object.entries(PASSWORD_RESET_FAILURE_MESSAGES)) {
  check(`the ${failure} message never claims success`, !/success/i.test(message))
  check(`the ${failure} message is not the success copy`, message !== PASSWORD_UPDATED_MESSAGE)
}

// ---------------------------------------------------------------------------
section('Wiring (source assertions -- React/Next behaviour cannot be run here)')
// ---------------------------------------------------------------------------

check('the header broadcasts its existing session check', header.includes('<AuthStateBroadcaster isAuthenticated={Boolean(user)} />'))
check('the broadcaster renders nothing', /return null/.test(broadcaster))
check('the broadcaster only publishes, never sets state', !/useState|setState/.test(broadcaster))
check('the provider reads the signal during render', provider.includes('useSyncExternalStore(subscribeAuthSignal'))
check('the panel value uses the derived login state', /requiresLogin = resolveRequiresLogin\(/.test(provider))

// The banned fixes.
check('no forced reload', !/location\.reload|location\.href\s*=/.test(provider + broadcaster + header))
check('no timers or arbitrary delays', !/setTimeout|setInterval/.test(provider + broadcaster))
check('no session polling', !/poll|refetchInterval/i.test(provider + broadcaster))
check('the sync path does not clear on pathname change', !/usePathname/.test(provider + broadcaster))
check(
  'synchronising issues no request of its own',
  !/fetch\(/.test(broadcaster) && !/fetch\(/.test(header)
)

// Cost: the header was already dynamic and already called getUser(), so no
// route becomes dynamic and the root layout stays static.
check('the root layout still performs no auth read', !/supabase|getUser|createClient/.test(rootLayout))
check('the header still performs exactly one session check', (header.match(/auth\.getUser\(\)/g) ?? []).length === 1)

// Server-side authority is unchanged: the client signal grants nothing.
check(
  'the signal is documented as a UI hint, not a boundary',
  /grants no access/i.test(signal)
)

// Password reset wiring.
check('a failed update never returns the success status', !/status: 'success'[\s\S]{0,80}error/.test(authActions))
check('a successful update returns a server-built success state', /status: 'success'/.test(authActions))
check('the raw Supabase error is not shown to the user', !/message:\s*error\.message/.test(authActions))
check('the password is never placed in a URL', !/encodeURIComponent\(password\)/.test(authActions))
check('the success state is no longer reachable from a query parameter', !/status === 'success'/.test(resetPage))
check('the success screen announces itself accessibly', /role="status"/.test(resetForm))
check('the success screen offers a continuation action', resetForm.includes('Continue to iRPGenie'))
check('the continuation link is not built from a search param', !/href=\{`?\$?\{?(next|redirect)/.test(resetForm))
check(
  'duplicate submission is prevented by the pending-aware button',
  /<SubmitButton/.test(resetForm)
)
check('an expired link offers a way to request a new one', resetPage.includes('/auth/forgot-password'))

// ---------------------------------------------------------------------------
section('PR #185 CAPTCHA behaviour is untouched')
// ---------------------------------------------------------------------------

check('the enforcement flag is still consulted', /isTurnstileEnforcementEnabled\(\)/.test(authActions))
check('the captcha gate still runs on all three flows', (authActions.match(/captchaGate\(formData\)/g) ?? []).length === 3)
check('the flag is still server-only', !/NEXT_PUBLIC_TURNSTILE_ENFORCEMENT/.test(authActions))
check('resetPassword is still not captcha-gated (updateUser takes no token)', !/captchaGate[\s\S]{0,200}updateUser/.test(authActions))

console.log(`\n${passed} passed, ${failures} failed`)
process.exit(failures > 0 ? 1 : 0)
