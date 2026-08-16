import Link from 'next/link'

interface ReaderBreadcrumbProps {
  sectionLabel: string
  sectionHref: string
  currentLabel: string
}

/**
 * Standardized visible breadcrumb for the Deep Dive and Insight readers
 * (Deep Dives, IBM i Insights and Reader-Experience Polish). Previously only
 * the Insight reader had one (Home / IBM i Insights / {title}); the Deep
 * Dive reader had just a bare "<- All Deep Dives" link with no breadcrumb
 * and no BreadcrumbList structured data (see lib/reader-breadcrumb.ts). Both
 * readers now render this exact markup -- same placement (above the
 * article title), spacing, typography, and focus-visible treatment -- so
 * the only thing that differs between the two is the section name/link.
 *
 * Plain Server Component: every segment is a real <Link>, no client-side-only
 * navigation, so it works with JavaScript disabled and never affects browser
 * history behavior.
 */
export function ReaderBreadcrumb({ sectionLabel, sectionHref, currentLabel }: ReaderBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
      <Link
        href="/"
        className="rounded hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        Home
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={sectionHref}
        className="rounded hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        {sectionLabel}
      </Link>
      <span aria-hidden="true">/</span>
      <span className="font-medium text-slate-700" aria-current="page">
        {currentLabel}
      </span>
    </nav>
  )
}
