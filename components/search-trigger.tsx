import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchTriggerProps {
  /**
   * 'labeled' (default) = icon + visible "Search" text, used in the desktop
   * account cluster so the control is never "an unexplained icon". 'icon-only'
   * = icon + aria-label only, used in the mobile header row where space is
   * constrained -- matching the hamburger toggle's own established
   * icon-only-with-aria-label convention (components/site-mobile-nav.tsx).
   */
  variant?: 'labeled' | 'icon-only'
  className?: string
}

/**
 * Search entry point (Unified Discovery, Accessibility and Responsive
 * Polish). A real <Link>, not a client-side trigger button -- this codebase
 * has no modal/dialog primitive (components/ai-tutor/limit-reached-dialog.tsx's
 * own comment: "no dialog/modal primitive... brief forbids adding a
 * dependency for it"), and a plain navigation to /search matches the
 * feature's own stated preference for a straightforward implementation over
 * a command palette. Works identically signed-in or signed-out, and with
 * zero client JS.
 *
 * One shared blue treatment across both variants -- the header/site-chrome
 * default accent already used for the hamburger toggle's focus ring -- since
 * search is a cross-cutting feature, not owned by any one themed section
 * (Deep Dives=indigo, Insights=sky, Practice=emerald, etc.).
 */
export function SearchTrigger({ variant = 'labeled', className }: SearchTriggerProps) {
  if (variant === 'icon-only') {
    return (
      <Link
        href="/search"
        aria-label="Search"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.97]',
          className
        )}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </Link>
    )
  }

  return (
    <Link
      href="/search"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-[0.97]',
        className
      )}
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      Search
    </Link>
  )
}
