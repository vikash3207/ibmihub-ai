'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Google Analytics 4 (PR #160). Read once at module scope, never
 * hardcoded -- Next.js inlines NEXT_PUBLIC_* vars at build time, so this
 * constant is empty in any environment (local dev, Preview deploys) that
 * doesn't set NEXT_PUBLIC_GA_MEASUREMENT_ID, which is intentionally only
 * configured in Vercel's Production environment.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

/** True only for an actual production build running in the browser -- never during SSR, local dev, or a Preview deploy without the env var set. */
const GA_ENABLED = typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && Boolean(GA_MEASUREMENT_ID)

/**
 * Loads the Google tag and initializes gtag. Renders nothing (no script
 * tags at all) if the measurement ID isn't configured -- there is no
 * conditional inside the script body that could still fire a request.
 * `gtag('config', ...)` sends the initial page_view itself; see
 * GoogleAnalyticsPageViews below for why route changes don't re-send it.
 */
export function GoogleAnalyticsScripts() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}

/**
 * Sends a page_view on every client-side route change. Requires
 * useSearchParams(), so the caller must wrap this in a <Suspense> boundary
 * (App Router rule) -- mirrors components/route-progress-bar.tsx's own
 * Suspense requirement in app/layout.tsx.
 *
 * Deliberately skips firing on the very first render: gtag('config', ...)
 * in GoogleAnalyticsScripts already sends GA4's automatic initial
 * page_view once the script loads, so re-sending one here on mount would
 * double-count the landing page.
 */
export function GoogleAnalyticsPageViews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!GA_ENABLED) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const query = searchParams.toString()
    window.gtag?.('event', 'page_view', {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}
