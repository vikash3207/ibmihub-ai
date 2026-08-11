'use client'

import { useEffect } from 'react'
import { publishAuthSignal } from '@/lib/auth-signal'

/**
 * Publishes the server's authentication verdict to the client auth signal
 * store (PR #186). Renders nothing.
 *
 * Mounted inside SiteHeader, which is a Server Component that already calls
 * supabase.auth.getUser() -- so this adds no request, no round trip, and no
 * change to which routes are dynamic. It simply makes the answer the header
 * already has available to the AI Tutor provider in the root layout.
 *
 * Writing to an external store is the intended job of an effect, so no state
 * is set here and nothing re-renders as a result of mounting.
 */
export function AuthStateBroadcaster({ isAuthenticated }: { isAuthenticated: boolean }) {
  useEffect(() => {
    publishAuthSignal(isAuthenticated ? 'signed-in' : 'signed-out')
  }, [isAuthenticated])

  return null
}
