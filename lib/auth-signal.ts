/**
 * Client-side broadcast of the server's authentication verdict (PR #186).
 *
 * The problem this solves: login is a Server Action, so the browser never
 * performs a Supabase sign-in itself and the browser client's
 * onAuthStateChange never fires. Meanwhile AiTutorPanelProvider lives in the
 * root layout and survives App Router navigation, so a `requiresLogin` flag
 * set by a 401 outlived the login that fixed it -- the header said "Log out"
 * while the Tutor still said "Log in to ask the AI Tutor a question".
 *
 * The fix is to reuse an auth read that already happens. SiteHeader is a
 * Server Component that already calls supabase.auth.getUser() on every page
 * that can show the Tutor, and every route rendering it is already
 * force-dynamic. A tiny client child publishes that verdict here, and the
 * provider subscribes. So:
 *
 *   - no extra auth request on any navigation
 *   - no polling, no timers, no reload
 *   - no new dynamic routes and no caching/SEO regression
 *
 * A module-level store rather than React state because the publisher
 * (SiteHeader, deep in the tree) is BELOW the consumer (the provider, in the
 * root layout), and because the publisher unmounts on the auth pages -- which
 * have no header -- while the value must survive that gap.
 *
 * SECURITY: this is a UI hint, nothing more. It says what the server said on
 * the last render, and it grants no access. /api/ai-tutor re-checks the
 * session on every request and that remains the only real boundary; a user
 * who forges 'signed-in' here just gets a composer that 401s.
 */

export type AuthSignal = 'unknown' | 'signed-in' | 'signed-out'

let current: AuthSignal = 'unknown'
const listeners = new Set<() => void>()

/**
 * Records the server's verdict and wakes subscribers.
 *
 * No-ops when the value is unchanged, so an ordinary navigation between two
 * signed-out pages notifies nobody and can never be mistaken for a
 * transition.
 */
export function publishAuthSignal(next: AuthSignal): void {
  if (next === current) return
  current = next
  for (const listener of listeners) {
    listener()
  }
}

export function subscribeAuthSignal(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getAuthSignal(): AuthSignal {
  return current
}

/**
 * Server snapshot for useSyncExternalStore. Always 'unknown': the store is a
 * browser-only concept, and returning anything else would risk a hydration
 * mismatch on a statically rendered page.
 */
export function getServerAuthSignal(): AuthSignal {
  return 'unknown'
}
