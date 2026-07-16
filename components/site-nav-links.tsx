'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkDef {
  href: string
  label: string
  /** "ai" gets the cyan AI Tutor accent instead of the default slate/blue. */
  accent?: 'ai'
}

const LOGGED_IN_LINKS: NavLinkDef[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/learn', label: 'Learning Center' },
  { href: '/practice', label: 'Practice' },
  { href: '/ai-tutor', label: 'AI Tutor', accent: 'ai' },
]

const LOGGED_OUT_LINKS: NavLinkDef[] = [{ href: '/learn', label: 'Learning Center' }]

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
  const links = isLoggedIn ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS

  return (
    <>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
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
