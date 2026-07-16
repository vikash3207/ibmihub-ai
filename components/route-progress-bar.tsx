'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Lightweight, dependency-free top-of-page progress bar for route changes
 * (PR #147 -- Navigation Responsiveness + Loading Feedback). Two independent
 * signals combine to give both "instant" and "actually done" feedback:
 *
 *  - A capture-phase document click listener starts the bar the moment a
 *    user clicks an internal link, before Next.js has even requested the
 *    next route's RSC payload -- this is the "immediate feedback" the PR
 *    asks for, and it works regardless of whether the target route was
 *    prefetched.
 *  - usePathname()/useSearchParams() changing confirms the navigation
 *    actually committed, so the bar completes and fades out.
 *
 * If a click never results in a route change (the user clicks the link
 * they're already on, a hash-only link, or navigation is cancelled), an 8s
 * safety timeout finishes the bar on its own so it can never get stuck.
 *
 * Deliberately does not touch auth/session/navigation logic -- this is a
 * purely visual overlay that reads route state, it never redirects or
 * blocks a click.
 */
export function RouteProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stuckRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastKeyRef = useRef(`${pathname}?${searchParams.toString()}`)

  function clearTimers() {
    if (tickRef.current) clearInterval(tickRef.current)
    if (hideRef.current) clearTimeout(hideRef.current)
    if (stuckRef.current) clearTimeout(stuckRef.current)
  }

  function finish() {
    clearTimers()
    setProgress(100)
    hideRef.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 200)
  }

  function start() {
    clearTimers()
    setVisible(true)
    setProgress(15)
    tickRef.current = setInterval(() => {
      // Eases toward 90% but never reaches it on its own -- only an actual
      // pathname/searchParams change (via the effect below) snaps to 100.
      setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.15))
    }, 180)
    stuckRef.current = setTimeout(finish, 8000)
  }

  useEffect(() => {
    const key = `${pathname}?${searchParams.toString()}`
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key
      finish()
    }
    // finish/clearTimers are stable enough for this effect's purpose; only
    // the route key should re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return
      }

      let url: URL
      try {
        url = new URL(href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (`${url.pathname}${url.search}` === `${window.location.pathname}${window.location.search}`) return

      start()
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      clearTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-blue-600"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
          transition: 'width 200ms ease-out, opacity 200ms ease-out',
        }}
      />
    </div>
  )
}
