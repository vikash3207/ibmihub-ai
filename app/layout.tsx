import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import {
  SITE_NAME,
  SITE_URL,
  SITE_DEFAULT_TITLE,
  SITE_TITLE_TEMPLATE,
  SITE_DEFAULT_DESCRIPTION,
} from '@/lib/config'
import { AiTutorPanelProvider } from '@/components/ai-tutor/ai-tutor-panel-provider'
import { EmbeddedAiTutorPanel } from '@/components/ai-tutor/embedded-ai-tutor-panel'
import { AiTutorContentShift } from '@/components/ai-tutor/ai-tutor-content-shift'
import { RouteProgressBar } from '@/components/route-progress-bar'
import { GoogleAnalyticsScripts, GoogleAnalyticsPageViews } from '@/components/analytics/google-analytics'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

// metadataBase lets every page's relative Open Graph/canonical URLs (and the
// app/opengraph-image.tsx file-convention image) resolve to an absolute URL
// without each page needing to know the site's own domain -- see
// lib/config.ts's SITE_URL comment for how that domain is chosen.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: [
    'IBM i',
    'IBM i learning',
    'AS400',
    'RPGLE',
    'CLLE',
    'Db2 for i',
    '5250',
    'IBM i training',
    'IBM i tutorial',
    'SQL practice',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="h-full bg-slate-50 text-slate-900 antialiased font-sans">
        {/*
          Mounted at the root, not in app/learn/layout.tsx or
          app/(authenticated)/layout.tsx: those are sibling route-group
          layouts, not nested, so a provider placed in either one alone
          would lose its conversation state when navigating between a
          lesson page and /practice. The root layout is the only layout
          both trees share (Spec 001 v1.1 AI-TUTOR-FR-024; see
          planning/EMBEDDED_AI_TUTOR_PANEL_PROPOSAL.md Section 3).
        */}
        {/*
          useSearchParams() inside RouteProgressBar requires a Suspense
          boundary (Next.js App Router rule) -- fallback is null since the
          bar renders nothing until a navigation actually starts.
        */}
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        {/*
          GoogleAnalyticsScripts renders nothing at all (no <script> tags)
          when NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set -- no separate env
          check needed here. GoogleAnalyticsPageViews uses useSearchParams()
          for the same App Router reason RouteProgressBar does above, so it
          needs its own Suspense boundary too.
        */}
        <GoogleAnalyticsScripts />
        <Suspense fallback={null}>
          <GoogleAnalyticsPageViews />
        </Suspense>
        <AiTutorPanelProvider>
          <AiTutorContentShift>{children}</AiTutorContentShift>
          <EmbeddedAiTutorPanel />
        </AiTutorPanelProvider>
      </body>
    </html>
  )
}
