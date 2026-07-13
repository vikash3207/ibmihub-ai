import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this layout (or any authenticated route under it) or the header could
// serve a stale/incorrect logged-in state in production.
export const dynamic = 'force-dynamic'

/**
 * Shared shell for authenticated product pages (Dashboard, AI Tutor,
 * Onboarding) -- mirrors app/learn/layout.tsx so navigation and page width
 * are consistent everywhere a logged-in user lands. Route group only;
 * does not affect the URL (still /dashboard, /ai-tutor, /onboarding).
 */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">{children}</main>
    </div>
  )
}
