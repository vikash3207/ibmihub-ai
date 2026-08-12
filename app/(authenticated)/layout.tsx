import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this layout (or any authenticated route under it) or the header could
// serve a stale/incorrect logged-in state in production.
export const dynamic = 'force-dynamic'

/**
 * Shared shell for authenticated product pages (Dashboard, AI Tutor,
 * Practice, Practice Lab, Onboarding, Profile) -- mirrors app/learn/layout.tsx
 * so navigation is consistent everywhere a logged-in user lands.
 * Unconstrained on purpose (Premium Section Layout Alignment): Dashboard and
 * Practice now render a full-bleed <SectionHero> as a direct child of
 * <main>, so this layout can no longer impose a page-wide max-width/padding.
 * Every other page under this route group (AI Tutor, Practice Lab + its
 * exercise routes, Onboarding, Profile, Dashboard/achievements) wraps itself
 * in the exact `mx-auto max-w-3xl px-4 sm:px-6 py-10` this layout used to
 * apply, so their rendered output is unchanged. Route group only; does not
 * affect the URL (still /dashboard, /ai-tutor, /onboarding, etc).
 */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
