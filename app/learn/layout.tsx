import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this layout (or any /learn/* route under it) or the header could serve a
// stale/incorrect logged-in state in production.
export const dynamic = 'force-dynamic'

// Unconstrained on purpose (Premium Section Layout Alignment): each /learn/*
// page now owns its own width/padding instead of inheriting it here, so
// /learn can render a full-bleed <SectionHero> (matching /deep-dives) as a
// direct child of <main> before its own narrower content wrapper starts.
// /learn/ibm-i-fundamentals and the lesson reader ([slug]) still wrap
// themselves in the exact `mx-auto max-w-6xl px-4 sm:px-6 py-10` this layout
// used to apply, so their rendered output is unchanged.
export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      <main id="main-content" className="flex-1">{children}</main>
    </div>
  )
}
