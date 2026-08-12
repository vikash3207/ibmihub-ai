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
 * a second component. No Insight is published yet (see content/insights/
 * catalog.ts) -- this component is retained, unused for now, as the
 * reusable presentation layer for whichever Insight is approved first.
 */
export function InsightCard({ insight, featured = false }: InsightCardProps) {
  const accent = getInsightAccent(insight.category)
  const accentClasses = INSIGHT_ACCENT_CLASSES[accent]
  const categoryLabel = INSIGHT_CATEGORIES.find((c) => c.id === insight.category)?.label ?? insight.category

  return (
    <Link
      href={`/insights/${insight.slug}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-t-4 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2',
        accentClasses.topBorder,
        featured ? 'border-slate-100 p-6 sm:p-8' : 'border-slate-100 p-5'
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
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

      <h3 className={cn('font-bold text-slate-900', featured ? 'text-2xl sm:text-3xl' : 'text-lg')}>{insight.title}</h3>
      <p className={cn('mt-3 leading-relaxed text-slate-600', featured ? 'text-base' : 'text-sm')}>{insight.description}</p>

      {/* Deliberately no publication date here (IBM i Insights Attribution
          Cleanup and Date Display Removal) -- Insight cards read as
          evergreen, not time-stamped. publishedAt still exists on the
          Insight record for catalog validation, sitemap lastModified, and
          sorting; it's just never rendered as visible page content.
          Reading time and tags now share one row instead of reading time
          sitting alone above a second row of tags. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {insight.readingTimeMinutes} min read
        </span>
        {insight.tags.slice(0, featured ? 6 : 3).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      <p
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 font-semibold text-sky-700 transition-transform group-hover:translate-x-0.5',
          featured ? 'text-sm' : 'text-xs'
        )}
      >
        Read Insight
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </p>
    </Link>
  )
}
