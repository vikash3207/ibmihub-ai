'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAiTutorPanel } from '@/components/ai-tutor/ai-tutor-panel-provider'
import { cn } from '@/lib/utils'

interface NavLinkDef {
  href: string
  label: string
  /** "ai" gets the cyan AI Tutor accent instead of the default slate/blue. */
  accent?: 'ai'
  /**
   * When set, the item opens the shared AI Tutor panel in place instead of
   * navigating (PR #180). `href` is still required and still rendered as a
   * real anchor, so middle-click / cmd-click / "open in new tab" keep working
   * and the canonical /ai-tutor route stays reachable.
   */
  opensAiTutorPanel?: boolean
}

const LOGGED_IN_LINKS: NavLinkDef[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/learn', label: 'Learning Center' },
  { href: '/deep-dives', label: 'Deep Dives' },
  { href: '/insights', label: 'IBM i Insights' },
  { href: '/practice', label: 'Practice' },
  { href: '/ai-tutor', label: 'AI Tutor', accent: 'ai', opensAiTutorPanel: true },
  { href: '/contact', label: 'Contact Us' },
]

// AI Tutor links straight to the real, already-protected /ai-tutor route
// for signed-out visitors too -- that page's own `if (!user) redirect(...)`
// (app/(authenticated)/ai-tutor/page.tsx) is what sends them to login with
// `?next=%2Fai-tutor` already attached, so a signed-in visitor lands on AI
// Tutor directly and a signed-out one is returned there after logging in.
// No second auth check or redirect is introduced here.
const LOGGED_OUT_LINKS: NavLinkDef[] = [
  { href: '/learn', label: 'Learning Center' },
  { href: '/deep-dives', label: 'Deep Dives' },
  { href: '/insights', label: 'IBM i Insights' },
  { href: '/ai-tutor', label: 'AI Tutor', accent: 'ai', opensAiTutorPanel: true },
  { href: '/contact', label: 'Contact Us' },
]

/**
 * Client-side top-nav links (PR #147 -- Navigation Responsiveness + Loading
 * Feedback). Split out of the server-only SiteHeader so:
 *  - usePathname() can highlight the current section (a11y + "is this
 *    working" feedback beyond hover alone).
 *  - These specific links can rely on Next.js's default prefetch behavior
 *    (no `prefetch={false}`) now that every route.tsx they can point to
 *    now has a matching loading.tsx (see app/(authenticated)/*\/loading.tsx,
 *    app/learn/loading.tsx) -- Next.js prefetches that static loading shell
 *    on hover/viewport-enter, so the skeleton can appear instantly on
 *    click instead of a blank pause. Previously blanket-disabled here to
 *    be safe after PR #49's GET-logout-prefetch incident; that incident
 *    was specific to a GET route with a mutating side effect, which none
 *    of these read-only pages have.
 */
export function SiteNavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()
  const { openPanel } = useAiTutorPanel()
  const links = isLoggedIn ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={
              link.opensAiTutorPanel
                ? (event) => {
                    // Let the browser handle any modified click (new tab, new
                    // window, download) and non-primary buttons -- only a
                    // plain left click is intercepted to open the panel in
                    // place, so the canonical /ai-tutor route stays reachable.
                    if (event.defaultPrevented) return
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                    event.preventDefault()
                    // No explicit context: the provider resolves whatever the current
                    // page registered (PR #181), so the Tutor opens knowing the lesson or Deep Dive being read.
                    openPanel()
                  }
                : undefined
            }
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'text-sm transition-colors active:opacity-70',
              link.accent === 'ai'
                ? cn('font-medium', isActive ? 'text-cyan-900' : 'text-cyan-700 hover:text-cyan-800')
                : cn(isActive ? 'font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900')
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
