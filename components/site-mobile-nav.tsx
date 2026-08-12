'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useId, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { PRIMARY_CTA_LABEL } from '@/lib/config'
import { useAiTutorPanel } from '@/components/ai-tutor/ai-tutor-panel-provider'
import { buttonVariants } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { getNavLinks, handleAiTutorNavClick, isNavLinkActive, navItemClasses } from '@/lib/nav-links'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  isLoggedIn: boolean
}

/**
 * Accessible compact mobile navigation (Site-wide Navigation and Section
 * Landing Page Visual Upgrade). Below `lg:`, the full pill-row nav
 * (components/site-nav-links.tsx's <SiteNavLinks>) doesn't have room for
 * seven items plus the logo and account controls without wrapping into an
 * untidy second line -- this replaces that wrap with a single hamburger
 * trigger and a dropdown panel carrying the exact same destinations (and
 * the exact same AI Tutor click-interception behavior, via the shared
 * getNavLinks()/handleAiTutorNavClick() from lib/nav-links.ts -- no
 * duplicated logic to drift out of sync).
 *
 * No new auth/session check: `isLoggedIn` is a prop from the server-only
 * SiteHeader, which already made the one getUser() call this whole header
 * needs. Profile/logout controls shown here reuse the same logout()
 * Server Action SiteHeader's standalone button and UserMenu's dropdown
 * both call -- a third caller of the same action, not new behavior.
 */
export function MobileNav({ isLoggedIn }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { openPanel } = useAiTutorPanel()
  const panelId = useId()
  const links = getNavLinks(isLoggedIn)

  // Close whenever navigation actually happens, so the panel never stays
  // open over a page the visitor didn't mean to leave it open on. Adjusted
  // during render (React's own recommended pattern for "reset state when a
  // prop/route changes" -- see react.dev/learn/you-might-not-need-an-effect)
  // rather than in a useEffect, which avoids the extra render pass an
  // effect-based setState would cause.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (isOpen) setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.97]"
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-40 border-b border-slate-100 bg-white p-3 shadow-lg"
        >
          <nav aria-label="Primary" className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    if (link.opensAiTutorPanel) handleAiTutorNavClick(event, openPanel)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={navItemClasses(link, isActive, 'mobile')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    'rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
                  )}
                >
                  My Profile
                </Link>
                <form>
                  <SubmitButton
                    formAction={logout}
                    variant="secondary"
                    className="w-full justify-start rounded-full border-none px-4 py-2.5 text-sm font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
                    pendingLabel="Logging out..."
                  >
                    Log out
                  </SubmitButton>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    'rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
                  )}
                >
                  Log in
                </Link>
                <Link href="/learn" className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'mt-1 justify-center')}>
                  {PRIMARY_CTA_LABEL}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
