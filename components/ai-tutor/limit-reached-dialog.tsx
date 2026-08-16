'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'
import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Shown only once the server reports the daily AI Tutor allowance is
 * exhausted (PR #182). Nothing about the quota appears anywhere in the UI
 * before this point -- see components/ai-tutor/chat-thread.tsx.
 *
 * Rendered once from AiTutorPanelProvider, so it covers every surface (side
 * panel, full-page /ai-tutor, mobile) without being duplicated per surface.
 *
 * Built by hand because this project has no dialog/modal primitive
 * (components/ui contains only badge, button, card, progress-bar, skeleton,
 * submit-button) and the brief forbids adding a dependency for it. It
 * therefore implements the accessibility contract explicitly: labelled
 * dialog role, focus moved in on open, focus trapped while open, focus
 * returned to whatever was focused before, and Escape to close.
 *
 * Honesty constraints: there is no checkout, billing, or plan
 * implementation in this repository, so there is deliberately no
 * "Subscribe" button, no price, and no link to a plans page that does not
 * exist. Wording is "coming soon", and the only real action besides
 * dismissing is Contact, which points at the genuine /contact route.
 * When subscription infrastructure lands, replace the Contact link with a
 * real "View plans" CTA -- lib/ai/product-facts.ts holds the matching
 * facts the Tutor states in conversation.
 */
export function LimitReachedDialog() {
  const { limitReachedOpen, dismissLimitReached } = useAiTutorPanel()
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!limitReachedOpen) return

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    confirmRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        dismissLimitReached()
        return
      }
      if (event.key !== 'Tab') return

      // Focus trap: cycle within the dialog's own focusable elements.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      // Return focus to whatever invoked this (normally the Tutor input),
      // so a keyboard user is not dumped back at the top of the document.
      previouslyFocusedRef.current?.focus?.()
    }
  }, [limitReachedOpen, dismissLimitReached])

  if (!limitReachedOpen) return null

  return (
    <div
      // Non-blocking scrim: the lesson or Deep Dive behind stays visible and
      // is never unmounted, reloaded, or navigated away from.
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismissLimitReached()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-tutor-limit-title"
        aria-describedby="ai-tutor-limit-body"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <button
            type="button"
            onClick={dismissLimitReached}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-500 transition-colors motion-reduce:transition-none hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <h2 id="ai-tutor-limit-title" className="mt-3 text-lg font-semibold text-slate-900">
          You&apos;ve reached today&apos;s AI Tutor limit
        </h2>
        <p id="ai-tutor-limit-body" className="mt-2 text-sm leading-relaxed text-slate-600">
          Your allowance resets tomorrow. Unlimited AI Tutor access and other premium learning
          features are planned for an upcoming subscription &mdash; plans are coming soon, and
          pricing hasn&apos;t been announced yet.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Everything else stays open in the meantime: all lessons and Deep Dives are free to read,
          and your conversation above is still here.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Link
            href="/contact"
            onClick={dismissLimitReached}
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
          >
            Contact us
          </Link>
          <button
            ref={confirmRef}
            type="button"
            onClick={dismissLimitReached}
            className={cn(buttonVariants({ variant: 'primary', size: 'sm' }))}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
