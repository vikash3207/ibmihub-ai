import Link from 'next/link'
import { SITE_NAME, SUPPORT_EMAIL } from '@/lib/config'

/**
 * Shared site footer (PR #144) -- extracted from what was previously
 * inline-only markup in app/page.tsx, so the new legal pages can reuse the
 * exact same footer instead of duplicating it. Visual style is unchanged
 * from the original; PR #144 added the Privacy/Terms/Disclaimer/Contact
 * links, PR #145 added the Practice Lab product link.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div>
          <span className="font-semibold text-slate-600">{SITE_NAME}</span>
          <span className="ml-2">AI-guided IBM i learning.</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/learn" className="hover:text-slate-600 transition-colors">
            Learning Center
          </Link>
          <Link href="/practice-lab" prefetch={false} className="hover:text-slate-600 transition-colors">
            Practice Lab
          </Link>
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">
            Terms
          </Link>
          <Link href="/disclaimer" className="hover:text-slate-600 transition-colors">
            Disclaimer
          </Link>
          {SUPPORT_EMAIL ? (
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-600 transition-colors">
              Contact
            </a>
          ) : null}
        </nav>
      </div>
    </footer>
  )
}
