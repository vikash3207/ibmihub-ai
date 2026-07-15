import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this layout (or any /learn/* route under it) or the header could serve a
// stale/incorrect logged-in state in production.
export const dynamic = 'force-dynamic'

// Wide enough to fit the lesson reader's sidebar + content columns
// (components/lesson-reader-layout.tsx). Pages that don't need the extra
// width (/learn, /learn/ibm-i-fundamentals) wrap their own content in a
// narrower `max-w-3xl mx-auto` div to keep their existing single-column look.
export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">{children}</main>
    </div>
  )
}
