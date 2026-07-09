import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this layout (or any /learn/* route under it) or the header could serve a
// stale/incorrect logged-in state in production.
export const dynamic = 'force-dynamic'

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">{children}</main>
    </div>
  )
}
