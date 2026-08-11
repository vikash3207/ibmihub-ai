'use client'

import { useEffect, useId, useRef, useState } from 'react'
import {
  TURNSTILE_SITE_KEY,
  TURNSTILE_CONFIGURED,
  TURNSTILE_FIELD_NAME,
  TURNSTILE_FAILURE_MESSAGE,
  TURNSTILE_UNAVAILABLE_MESSAGE,
} from '@/lib/turnstile'

/**
 * Cloudflare Turnstile challenge for the Auth forms (PR #183).
 *
 * Implemented directly against Turnstile's explicit-render API rather than
 * via a React wrapper package. This repository has no UI/widget
 * dependencies at all (components/ui is hand-rolled), the brief asks for the
 * smallest maintainable implementation, and the whole integration is one
 * script tag plus render/reset/remove -- so a dependency would add supply
 * chain and version-coupling for no real benefit.
 *
 * SECURITY: the token this produces is NOT the security boundary. It is
 * submitted as a hidden field, forwarded by the Server Action to Supabase as
 * `options.captchaToken`, and validated by Supabase against Cloudflare using
 * the secret key. Completing the widget in the browser proves nothing on its
 * own, and the secret never exists in client code.
 *
 * Renders in "managed" mode, which is Turnstile's lowest-friction setting --
 * most genuine users are never shown an interactive puzzle.
 */

// Minimal shape of the pieces of the Turnstile API actually used here.
interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
      'timeout-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
      appearance?: 'always' | 'execute' | 'interaction-only'
    }
  ) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    onTurnstileReady?: () => void
  }
}

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Load the Turnstile script once per document, shared across Auth pages. */
function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('turnstile-load-failed')), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile-load-failed'))
    document.head.appendChild(script)
  })
}

interface TurnstileWidgetProps {
  /** Disables the submit button while no valid token is held. */
  onTokenChange?: (token: string | null) => void
}

export function TurnstileWidget({ onTokenChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenChangeRef = useRef(onTokenChange)
  const [token, setToken] = useState('')
  // Derived at first render rather than set from an effect: TURNSTILE_CONFIGURED
  // is a build-time constant, so a missing site key is already known before
  // anything mounts and needs no state synchronisation.
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    TURNSTILE_CONFIGURED ? 'loading' : 'error'
  )
  const fieldId = useId()

  // Keep the latest callback without making it an effect dependency, so the
  // widget is never torn down and re-rendered just because the parent
  // re-rendered with a new inline function.
  useEffect(() => {
    onTokenChangeRef.current = onTokenChange
  }, [onTokenChange])

  useEffect(() => {
    // Status is already 'error' from the initial render; nothing to load and
    // no token will ever be produced, so the submit button stays disabled.
    if (!TURNSTILE_CONFIGURED) return

    let cancelled = false

    function apply(next: string, nextStatus: 'ready' | 'error') {
      if (cancelled) return
      setToken(next)
      setStatus(nextStatus)
      onTokenChangeRef.current?.(next || null)
    }

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: 'interaction-only',
          theme: 'light',
          callback: (t) => apply(t, 'ready'),
          // A token is single-use and short-lived. Clearing it on expiry is
          // what forces a fresh challenge instead of submitting a stale one.
          'expired-callback': () => apply('', 'ready'),
          'error-callback': () => apply('', 'error'),
          'timeout-callback': () => apply('', 'ready'),
        })
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
          onTokenChangeRef.current?.(null)
        }
      })

    return () => {
      cancelled = true
      const id = widgetIdRef.current
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id)
        } catch {
          // Widget already gone (e.g. fast navigation) -- nothing to clean up.
        }
      }
      widgetIdRef.current = null
    }
  }, [])

  return (
    <div className="space-y-2">
      {/* The token the Server Action forwards to Supabase. Empty until the
          challenge completes, which is what makes the action fail closed. */}
      <input type="hidden" name={TURNSTILE_FIELD_NAME} value={token} readOnly />

      <div ref={containerRef} className="min-h-[1px]" />

      {/* Status is announced politely so a screen-reader user learns the
          challenge failed without the message stealing focus. */}
      <p
        id={fieldId}
        role="status"
        aria-live="polite"
        className={status === 'error' ? 'text-sm text-red-700' : 'sr-only'}
      >
        {status === 'error'
          ? TURNSTILE_CONFIGURED
            ? TURNSTILE_FAILURE_MESSAGE
            : TURNSTILE_UNAVAILABLE_MESSAGE
          : status === 'loading'
            ? 'Loading security check.'
            : 'Security check ready.'}
      </p>
    </div>
  )
}
