/**
 * Where a learner goes once an auth step succeeds (PR #186).
 *
 * Split out of lib/actions/auth.ts because that file is `'use server'` and
 * may only export async Server Actions -- a shared helper exported from there
 * would become a callable action. Deliberately imports nothing server-only,
 * so the rule can be executed directly by the regression suite.
 */

/**
 * Every possible destination, as a literal union.
 *
 * The type is the guarantee: a continuation link built from this can only
 * ever be an internal path, so the reset-password flow cannot be turned into
 * an open redirect by anything arriving in a URL.
 */
export type PostAuthDestination = '/onboarding' | '/'

export interface OnboardingFields {
  onboarding_response: string | null
  onboarding_skipped: boolean | null
}

/**
 * Same rule the login and reset actions have always applied: a learner who
 * has neither answered nor skipped onboarding is sent there first.
 *
 * A missing profile row counts as "not answered" -- unchanged from the
 * previous inline `!profile?.onboarding_response && !profile?.onboarding_skipped`.
 */
export function postAuthDestinationFor(profile: OnboardingFields | null): PostAuthDestination {
  const needsOnboarding = !profile?.onboarding_response && !profile?.onboarding_skipped
  return needsOnboarding ? '/onboarding' : '/'
}
