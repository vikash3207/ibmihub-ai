import Link from 'next/link'
import { Compass, ChevronDown } from 'lucide-react'
import type { Insight } from '@/lib/insights'
import { INSIGHT_CATEGORIES, INSIGHT_ACCENT_CLASSES, getInsightAccent, type InsightCategoryId } from '@/lib/insight-categories'
import { cn } from '@/lib/utils'

interface ExploreInsightsNavProps {
  /** Published Insights only -- see getPublishedInsights() in lib/insights.ts. */
  insights: Insight[]
  activeCategory: InsightCategoryId | null
}

/**
 * "Explore Insights" catalog navigation (Insights listing UI/UX refinement).
 * Entirely generated from the `insights` prop -- categories, per-category
 * counts, and article titles are all derived from the live catalog, nothing
 * is hardcoded here -- so a newly published Insight (content/insights/
 * catalog.ts) appears in this nav automatically with zero changes to this
 * file.
 *
 * Filtering is real navigation, not client-side state: every control is a
 * plain <Link> to `/insights` or `/insights?category=<id>`, and
 * app/insights/page.tsx reads that query param server-side to decide what
 * to render. That means the filtered result is server-rendered HTML on the
 * very first response (nothing is hidden from a crawler that never runs
 * client JS), and browser Back/Forward work through ordinary history
 * entries rather than bespoke JS state. No client directive is needed
 * anywhere in this file -- it stays a plain Server Component; the mobile
 * disclosure below is a native <details>/<summary>, the same zero-JS
 * pattern components/curriculum-sidebar.tsx and components/deep-dive-toc.tsx
 * already use for their own mobile panels.
 */
export function ExploreInsightsNav({ insights, activeCategory }: ExploreInsightsNavProps) {
  const groups = INSIGHT_CATEGORIES.map((category) => ({
    category,
    insights: insights.filter((insight) => insight.category === category.id),
  })).filter((group) => group.insights.length > 0)

  function renderList() {
    return (
      <div className="space-y-2">
        <Link
          href="/insights"
          aria-current={activeCategory === null ? 'true' : undefined}
          className={cn(
            'flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600',
            activeCategory === null
              ? 'bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200'
              : 'text-slate-700 hover:bg-slate-100'
          )}
        >
          <span>All Insights</span>
          <span
            className={cn(
              'shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
              activeCategory === null ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'
            )}
          >
            {insights.length}
          </span>
        </Link>

        <ul className="space-y-2.5">
          {groups.map(({ category, insights: categoryInsights }) => {
            const isActive = activeCategory === category.id
            const accent = getInsightAccent(category.id)
            const accentClasses = INSIGHT_ACCENT_CLASSES[accent]
            return (
              <li key={category.id}>
                <Link
                  href={`/insights?category=${category.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 transition-colors motion-reduce:transition-none',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600',
                    isActive ? 'bg-slate-50 ring-1 ring-inset ring-slate-200' : 'hover:bg-slate-50'
                  )}
                >
                  <span
                    className={cn(
                      'truncate rounded-full border px-2 py-0.5 text-xs font-medium',
                      accentClasses.badgeBg,
                      accentClasses.badgeText,
                      accentClasses.badgeBorder
                    )}
                  >
                    {category.label}
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-500">
                    {categoryInsights.length}
                  </span>
                </Link>
                <ul className="ml-2 mt-1 space-y-0.5 border-l border-slate-100 pl-3">
                  {categoryInsights.map((insight) => (
                    <li key={insight.slug}>
                      <Link
                        href={`/insights/${insight.slug}`}
                        title={insight.title}
                        className="block truncate rounded-md py-1 pl-1 pr-2 text-xs text-slate-500 transition-colors motion-reduce:transition-none hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                      >
                        {insight.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <>
      {/* Mobile / narrow screens: collapsible "Browse Insights" panel, above
          the card grid. Same zero-JS <details> pattern as
          components/curriculum-sidebar.tsx's mobile "Curriculum" panel. */}
      <details className="group mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600">
          <Compass className="h-4 w-4 text-sky-600" aria-hidden="true" />
          Browse Insights
          <ChevronDown
            className="ml-auto h-4 w-4 text-slate-400 transition-transform motion-reduce:transition-none group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-3 max-h-96 overflow-y-auto border-t border-slate-100 pt-3">{renderList()}</div>
      </details>

      {/* Desktop / wide screens: sticky left sidebar, positioned below the
          sticky site header (top-0, ~4.25rem tall) -- lg:top-20 matches the
          exact offset components/curriculum-sidebar.tsx already uses under
          the same header, so both sections' sidebars sit at a consistent
          height. */}
      <nav aria-label="Explore Insights" className="hidden lg:sticky lg:top-20 lg:block">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Compass className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
            Explore Insights
          </p>
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">{renderList()}</div>
        </div>
      </nav>
    </>
  )
}
