'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAiTutorPanel } from '@/components/ai-tutor/ai-tutor-panel-provider'
import { getNavLinks, handleAiTutorNavClick, isNavLinkActive, navItemClasses } from '@/lib/nav-links'

// Re-exported so existing imports of these (regression scripts, other
// components) keep working from this file's path too -- lib/nav-links.ts
// is where the actual definitions live now (see that file's header comment
// for why the pure logic had to move out of this 'use client' component).
export { getNavLinks, handleAiTutorNavClick, isNavLinkActive, navItemClasses }
export type { NavAccentClasses, NavLinkDef } from '@/lib/nav-links'

/**
 * Desktop pill-row nav links (Site-wide Navigation and Section Landing Page
 * Visual Upgrade; originally PR #147 -- Navigation Responsiveness + Loading
 * Feedback). Split out of the server-only SiteHeader so:
 *  - usePathname() can highlight the current section (a11y + "is this
 *    working" feedback beyond hover alone) with both a background pill and
 *    bold text, so the active page is identifiable without relying on
 *    color alone.
 *  - These specific links can rely on Next.js's default prefetch behavior
 *    (no `prefetch={false}`) now that every route.tsx they can point to
 *    now has a matching loading.tsx (see app/(authenticated)/*\/loading.tsx,
 *    app/learn/loading.tsx) -- Next.js prefetches that static loading shell
 *    on hover/viewport-enter, so the skeleton can appear instantly on
 *    click instead of a blank pause. Previously blanket-disabled here to
 *    be safe after PR #49's GET-logout-prefetch incident; that incident
 *    was specific to a GET route with a mutating side effect, which none
 *    of these read-only pages have.
 *
 * components/site-mobile-nav.tsx renders the same link data (via
 * lib/nav-links.ts's getNavLinks()) for narrow viewports, sharing that
 * module's accent classes and handleAiTutorNavClick() rather than
 * duplicating either.
 */
export function SiteNavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()
  const { openPanel } = useAiTutorPanel()
  const links = getNavLinks(isLoggedIn)

  return (
    <nav aria-label="Primary" className="hidden lg:flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50/70 p-1">
      {links.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={link.opensAiTutorPanel ? (event) => handleAiTutorNavClick(event, openPanel) : undefined}
            aria-current={isActive ? 'page' : undefined}
            className={navItemClasses(link, isActive)}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
