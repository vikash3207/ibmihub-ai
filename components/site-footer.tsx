import Link from 'next/link'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/config'

/**
 * Shared site footer (PR #144) -- extracted from what was previously
 * inline-only markup in app/page.tsx, so the new legal pages can reuse the
 * exact same footer instead of duplicating it. PR #148 added the Privacy/
 * Terms/Disclaimer/Contact links and pointed Contact at the dedicated
 * /contact page. PR #150 reworks the visual treatment (bolder section
 * labels, grouped links, a copyright line) after Product Owner feedback
 * that the original single-row footer felt too light/subtle -- still no
 * new links' *destinations*, just Home/Practice/AI Tutor added alongside
 * the existing ones so every primary nav surface is reachable from the
 * footer too.
 */
const PRODUCT_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/learn', label: 'Learning Center' },
  { href: '/deep-dives', label: 'Deep Dives' },
  { href: '/practice', label: 'Practice' },
  { href: '/ai-tutor', label: 'AI Tutor' },
  { href: '/practice-lab', label: 'Practice Lab' },
]

const COMPANY_LINKS = [
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/disclaimer', label: 'Disclaimer' },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-lg font-bold text-slate-900">{SITE_NAME}</p>
            <p className="mt-1.5 text-sm text-slate-500">{SITE_TAGLINE}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Product</p>
            <nav className="mt-3 flex flex-col gap-2.5">
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700 active:opacity-70"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Company</p>
            <nav className="mt-3 flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    link.href === '/contact'
                      ? 'text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900 active:opacity-70'
                      : 'text-sm font-medium text-slate-600 transition-colors hover:text-blue-700 active:opacity-70'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
