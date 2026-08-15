import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import type { Insight } from '@/lib/insights'
import { INSIGHT_CATEGORIES, INSIGHT_ACCENT_CLASSES, getInsightAccent } from '@/lib/insight-categories'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface InsightCardProps {
  insight: Insight
  /** Larger hero-style treatment for the listing page's lead card and the homepage showcase. */
  featured?: boolean
}

/**
 * Card for a published Insight. One component with a `featured` variant
 * rather than two near-duplicate components -- the same shape works for a
 * listing page's lead card and a compact grid card, so a future /insights
 * grid of several articles can reuse the non-featured branch below without
 * a second component.
 *
 * Featured-card compactness (Insights listing UI/UX refinement): the
 * featured variant used to be a taller version of the same stacked layout
 * (bigger padding, bigger title, nothing else different), which read as
 * disproportionately large next to the grid cards below it. It now uses a
 * balanced two-column layout from `sm:` up -- title/description/tags on the
 * left, reading time + the "Read Insight" action right-aligned on the
 * right, so the CTA no longer needs its own stacked row -- and a title size
 * (`text-xl sm:text-2xl`) that's only modestly larger than a standard card's
 * `text-lg`, not a full step up. Category badge, "Featured Insight" badge,
 * summary, tags, reading time, and the Read Insight action are all still
 * here -- only the layout and sizing changed.
 */
export function InsightCard({ insight, featured = false }: InsightCardProps) {
  const accent = getInsightAccent(insight.category)
  const accentClasses = INSIGHT_ACCENT_CLASSES[accent]
  const categoryLabel = INSIGHT_CATEGORIES.find((c) => c.id === insight.category)?.label ?? insight.category

  const readingTime = (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      {insight.readingTimeMinutes} min read
    </span>
  )

  const readInsightCta = (
    <p
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold text-sky-700 transition-transform group-hover:translate-x-0.5',
        featured ? 'text-sm' : 'text-xs'
      )}
    >
      Read Insight
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </p>
  )

  const tags = insight.tags.slice(0, featured ? 6 : 3).map((tag) => (
    <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
      {tag}
    </span>
  ))

  return (
    <Link
      href={`/insights/${insight.slug}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-t-4 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2',
        accentClasses.topBorder,
        featured ? 'border-slate-100 p-5 sm:p-6' : 'border-slate-100 p-5'
      )}
    >
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-xs font-medium',
            accentClasses.badgeBg,
            accentClasses.badgeText,
            accentClasses.badgeBorder
          )}
        >
          {categoryLabel}
        </span>
        {featured && <Badge variant="ai">Featured Insight</Badge>}
      </div>

      {featured ? (
        <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{insight.title}</h3>
            <p className="mt-2 leading-relaxed text-slate-600 text-sm sm:text-base">{insight.description}</p>
            {/* Deliberately no publication date here (IBM i Insights
                Attribution Cleanup and Date Display Removal) -- Insight
                cards read as evergreen, not time-stamped. publishedAt
                still exists on the Insight record for catalog validation,
                sitemap lastModified, and sorting; it's just never rendered
                as visible page content. */}
            <div className="mt-3 flex flex-wrap items-center gap-2">{tags}</div>
          </div>
          <div className="mt-4 flex shrink-0 items-center gap-3 sm:mt-1 sm:flex-col sm:items-end sm:gap-3">
            {readingTime}
            {readInsightCta}
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold text-slate-900">{insight.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{insight.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {readingTime}
            {tags}
          </div>
          <div className="mt-5">{readInsightCta}</div>
        </>
      )}
    </Link>
  )
}
