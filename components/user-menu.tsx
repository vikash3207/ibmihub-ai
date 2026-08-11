'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { logout } from '@/lib/actions/auth'
import { avatarInitial, displayName } from '@/lib/profile'
import { SubmitButton } from '@/components/ui/submit-button'

interface UserMenuProps {
  /** The verified Supabase Auth email -- never editable metadata. */
  email: string
  firstName: string | null
  lastName: string | null
}

/**
 * Header avatar + account dropdown (Basic User Profile & Header Avatar
 * enhancement).
 *
 * DESIGN CHOICE -- disclosure, not an ARIA `menu` widget. A `role="menu"`
 * with `role="menuitem"` children (and, previously, `aria-haspopup="true"`
 * on the trigger, which ARIA reserves for exactly that combination) commits
 * to the full APG menu keyboard contract (arrow-key roving focus, Home/End,
 * type-ahead); implementing that without arrow-key support is a known
 * accessibility anti-pattern that leads assistive technology to expect
 * menu/menuitem semantics this panel does not provide. This is instead a
 * plain disclosure: a toggle button (`aria-expanded` + `aria-controls` only,
 * no `aria-haspopup`) revealing ordinary, natively focusable content (a
 * `<Link>` and a submit `<button>`), which is fully keyboard-operable via
 * standard Tab/Enter/Space with no extra ARIA role required -- the same
 * pattern many production account menus use. The revealed panel itself
 * carries no `role` and therefore no `aria-label` either: a label on a
 * plain `<div>` with no supporting role is not exposed to the accessibility
 * tree in any meaningful way.
 *
 * Renders beside the existing standalone Logout control in SiteHeader,
 * which is left untouched -- this adds a second way to log out rather than
 * replacing the first.
 */
export function UserMenu({ email, firstName, lastName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const initial = avatarInitial({ firstName, lastName, email })
  const name = displayName({ firstName, lastName })

  useEffect(() => {
    if (!isOpen) return

    // pointerdown (not click) covers mouse, touch and pen in one listener,
    // and fires before a click on an item inside the panel would otherwise
    // be swallowed by an ill-timed close.
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        // Returns focus to the control that opened the panel, rather than
        // leaving it stranded on an element that just disappeared.
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const closePanel = () => setIsOpen(false)

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={name ? `Account menu for ${name}` : `Account menu for ${email}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.97]"
      >
        {initial}
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-100 bg-white p-2 shadow-lg"
        >
          <div className="border-b border-slate-100 px-3 py-2">
            {name && <p className="truncate text-sm font-medium text-slate-900">{name}</p>}
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={closePanel}
              className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              My Profile
            </Link>

            {/* Second, independent way to log out -- calls the same logout()
                Server Action as SiteHeader's own standalone button.
                Deliberately no onClick to close the panel here: doing so
                risked unmounting this button (and its enclosing form)
                during the very click meant to submit it. logout() redirects
                on success, which removes the panel anyway, so there is
                nothing for a manual close to add. */}
            <form>
              <SubmitButton
                formAction={logout}
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm hover:bg-slate-50"
                pendingLabel="Logging out..."
              >
                Logout
              </SubmitButton>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
