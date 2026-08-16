'use client'

import { useSyncExternalStore } from 'react'

/**
 * Reports whether the recovery link delivered its credentials in the URL
 * fragment (PR #189).
 *
 * This exists because the fragment is the one place a server can never look.
 * When Supabase returns `#access_token=...` instead of `?code=...`, the
 * callback sees an empty query string and can only report "nothing arrived"
 * -- indistinguishable from a truncated link. Reading it here is what tells
 * the two apart.
 *
 * Strictly read-only diagnosis. It classifies the fragment and renders a
 * short token; it never transmits, logs, stores, or displays the fragment's
 * contents, and it does not attempt to establish a session from them.
 */

type FragmentKind = 'unknown' | 'none' | 'tokens' | 'error'

let cachedKind: FragmentKind | null = null

function classifyFragment(): FragmentKind {
  if (cachedKind !== null) return cachedKind

  // Cached because useSyncExternalStore requires a stable snapshot -- a value
  // recomputed on every render would loop.
  const hash = typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, '')
  if (hash.length === 0) {
    cachedKind = 'none'
  } else if (/(^|&)error(_code|_description)?=/.test(hash)) {
    cachedKind = 'error'
  } else if (/(^|&)(access_token|refresh_token)=/.test(hash)) {
    cachedKind = 'tokens'
  } else {
    cachedKind = 'none'
  }

  return cachedKind
}

/** The fragment never changes after load, so there is nothing to subscribe to. */
const subscribe = () => () => {}
const getServerSnapshot = (): FragmentKind => 'unknown'

export function RecoveryFragmentNotice() {
  const kind = useSyncExternalStore(subscribe, classifyFragment, getServerSnapshot)

  if (kind === 'unknown' || kind === 'none') return null

  return (
    <p className="mt-1 text-center text-xs text-slate-500">
      Reference: fragment/{kind}
    </p>
  )
}
