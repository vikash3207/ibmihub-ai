/**
 * Contextual login/sign-up copy for a validated `next` destination (Homepage
 * Hierarchy and Signed-Out Feature Discovery).
 *
 * Deliberately a plain, dependency-free module (mirrors lib/auth-destination.ts's
 * existing style) so the regression suite can execute it directly. Callers must
 * run `next` through `safeInternalPath` (lib/auth-redirect.ts) BEFORE calling
 * `authCopyFor` -- this module only maps an already-trusted internal path to
 * copy, it never re-validates or renders the raw query string itself. An
 * unrecognized (or invalid) path returns `null`, and callers fall back to the
 * existing generic auth copy -- this list is intentionally a fixed literal
 * map, never a pattern derived from user input.
 */

export interface AuthDestinationCopy {
  /** Short feature name, e.g. "the AI Tutor" -- used mid-sentence in fallback copy. */
  feature: string
  loginHeading: string
  loginSubtitle: string
  signupHeading: string
  signupSubtitle: string
}

const KNOWN_DESTINATIONS: Record<string, AuthDestinationCopy> = {
  '/ai-tutor': {
    feature: 'the AI Tutor',
    loginHeading: 'Log in to use the AI Tutor',
    loginSubtitle: 'Sign back in to ask IBM i questions and get guided, plain-language answers.',
    signupHeading: 'Create your free account to use the AI Tutor',
    signupSubtitle: 'Get IBM i-specific answers grounded in lessons, Deep Dives, and Insights.',
  },
  '/practice-lab': {
    feature: 'the Practice Lab',
    loginHeading: 'Log in to open the Practice Lab',
    loginSubtitle: 'Sign back in to continue the simulated 5250 and SQL practice environments.',
    signupHeading: 'Create your free account to open the Practice Lab',
    signupSubtitle: 'Get hands-on with a simulated 5250 command environment and an ACS-style SQL console.',
  },
  '/practice': {
    feature: 'Practice',
    loginHeading: 'Log in to start practicing',
    loginSubtitle: 'Sign back in to pick up your practice questions and progress.',
    signupHeading: 'Create your free account to start practicing',
    signupSubtitle: 'Practice questions, a simulated 5250 environment, and an ACS-style SQL console -- all free.',
  },
  '/dashboard': {
    feature: 'your learning dashboard',
    loginHeading: 'Log in to view your learning dashboard',
    loginSubtitle: 'Sign back in to see your progress and pick up where you left off.',
    signupHeading: 'Create your free account to get a learning dashboard',
    signupSubtitle: 'Track your progress, lessons completed, and achievements in one place.',
  },
}

/**
 * Longest-prefix match against the fixed map above, so a sub-route like
 * `/practice-lab/5250` or `/dashboard/achievements` still gets its parent
 * feature's copy without needing its own entry. `next` must already be a
 * validated internal path (see module doc comment) -- this function performs
 * no sanitization of its own.
 */
export function authCopyFor(next: string): AuthDestinationCopy | null {
  if (KNOWN_DESTINATIONS[next]) return KNOWN_DESTINATIONS[next]

  const prefixMatch = Object.keys(KNOWN_DESTINATIONS)
    .filter((path) => next.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0]

  return prefixMatch ? KNOWN_DESTINATIONS[prefixMatch] : null
}
