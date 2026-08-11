import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import type { Insight } from '@/lib/insights'
import { INSIGHT_CATEGORIES, INSIGHT_ACCENT_CLASSES, getInsightAccent } from '@/lib/insight-categories'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function formatPublishedDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

interface InsightCardProps {
  insight: Insight
  /** Larger hero-style treatment for the listing page's lead card and the homepage showcase. */
  featured?: boolean
}

/**
 * Card for a published Insight (PR #194 -- Launch IBM i Insights). One
 * component with a `featured` variant rather than two near-duplicate
 * components -- there's only one published Insight today, so a separate
 * "compact grid card" component would have no second caller yet; the
 * non-featured branch below is what a future /insights grid of several
 * articles will use once there are enough to need one (spec explicitly
 * defers search/filtering until ~6-8 articles exist).
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
        {featured && <Badge variant="ai">Launch article</Badge>}
      </div>

      <h3 className={cn('font-bold text-slate-900', featured ? 'text-2xl sm:text-3xl' : 'text-lg')}>{insight.title}</h3>
      <p className={cn('mt-3 leading-relaxed text-slate-600', featured ? 'text-base' : 'text-sm')}>{insight.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <time dateTime={insight.publishedAt}>{formatPublishedDate(insight.publishedAt)}</time>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {insight.readingTimeMinutes} min read
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
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
