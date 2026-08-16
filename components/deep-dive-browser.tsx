'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X, Clock, ArrowRight, ChevronDown, Compass } from 'lucide-react'
import { isDeepDiveAvailable, type DeepDive } from '@/lib/deep-dives'
import { DEEP_DIVE_CATEGORIES, DEEP_DIVE_ACCENT_CLASSES, getDeepDiveAccent, type DeepDiveCategoryId } from '@/lib/deep-dive-categories'
import { cn } from '@/lib/utils'

function matchesQuery(deepDive: DeepDive, query: string): boolean {
  const haystack = [deepDive.title, deepDive.description, ...deepDive.tags].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

interface DeepDiveBrowserProps {
  deepDives: DeepDive[]
}

/**
 * Search + category filter + card grid for /deep-dives (Deep Dives, IBM i
 * Insights and Reader-Experience Polish). Previously rendered every
 * catalog entry -- published and planned -- in one flat grid in catalog
 * order, with a single "Showing X of Y Deep Dives" line that didn't say
 * how many of those were actually readable. Filtering (search + category)
 * is unchanged; the *result* is now split into two groups so a visitor
 * always sees what they can read right now before what's planned:
 *
 *  - "Available now": the existing full-card grid, real links, unchanged
 *    visual treatment.
 *  - "Planned topics": a collapsed-by-default <details> disclosure (the
 *    same zero-JS pattern components/curriculum-sidebar.tsx and
 *    components/insights/explore-insights-nav.tsx already use for their own
 *    mobile panels) holding compact, non-clickable rows -- not full cards,
 *    so 14 planned entries don't compete with 6 real, readable articles for
 *    the same visual weight.
 *
 * isDeepDiveAvailable() (lib/deep-dives.ts) is the single status check both
 * groups and DeepDiveCard derive from -- `review-ready` is never treated as
 * available, same as `planned`.
 */
export function DeepDiveBrowser({ deepDives }: DeepDiveBrowserProps) {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<DeepDiveCategoryId | null>(null)

  const visibleCategories = useMemo(() => {
    const present = new Set(deepDives.map((d) => d.category))
    return DEEP_DIVE_CATEGORIES.filter((c) => present.has(c.id))
  }, [deepDives])

  const filtered = useMemo(() => {
    return deepDives.filter((deepDive) => {
      if (categoryId && deepDive.category !== categoryId) return false
      if (query.trim() && !matchesQuery(deepDive, query)) return false
      return true
    })
  }, [deepDives, categoryId, query])

  const available = useMemo(() => filtered.filter(isDeepDiveAvailable), [filtered])
  const planned = useMemo(() => filtered.filter((d) => !isDeepDiveAvailable(d)), [filtered])

  const hasActiveFilter = query.trim() !== '' || categoryId !== null

  function clearFilters() {
    setQuery('')
    setCategoryId(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Deep Dives by topic or tag..."
            aria-label="Search Deep Dives"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1',
              categoryId === null ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
            )}
          >
            All Categories
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id === categoryId ? null : category.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1',
                categoryId === category.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {hasActiveFilter && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-600">
          No Deep Dives match your search or filter.{' '}
          <button
            type="button"
            onClick={clearFilters}
            className="rounded font-medium text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Clear filters
          </button>{' '}
          to see all Deep Dives.
        </div>
      ) : (
        <div className="space-y-8">
          {available.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-700">
                Available now ({available.length} {available.length === 1 ? 'Deep Dive' : 'Deep Dives'})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {available.map((deepDive) => (
                  <DeepDiveCard key={deepDive.slug} deepDive={deepDive} />
                ))}
              </div>
            </div>
          )}

          {planned.length > 0 && (
            <details className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:rounded">
                <Compass className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                Planned topics ({planned.length}) -- coming soon, not yet published
                <ChevronDown
                  className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform motion-reduce:transition-none group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 text-xs text-slate-500">
                These topics are on the roadmap but have no readable content yet -- shown here for direction, not as
                links.
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-slate-200 pt-3">
                {planned.map((deepDive) => {
                  const categoryLabel = DEEP_DIVE_CATEGORIES.find((c) => c.id === deepDive.category)?.label ?? deepDive.category
                  return (
                    <li key={deepDive.slug} className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-600">{categoryLabel}</span>
                      <span>{deepDive.title}</span>
                    </li>
                  )
                })}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

function DeepDiveCard({ deepDive }: { deepDive: DeepDive }) {
  const accent = getDeepDiveAccent(deepDive.category)
  const accentClasses = DEEP_DIVE_ACCENT_CLASSES[accent]
  const categoryLabel = DEEP_DIVE_CATEGORIES.find((c) => c.id === deepDive.category)?.label ?? deepDive.category

  // Every caller of this component only ever passes already-available
  // (isDeepDiveAvailable() === true) Deep Dives -- planned/review-ready
  // entries render as the compact, non-clickable "Planned topics" rows
  // above instead, never as a card. So this is always a real link.
  return (
    <Link
      href={`/deep-dives/${deepDive.slug}`}
      className={cn(
        'flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm border-t-4 transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
        accentClasses.topBorder
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', accentClasses.badgeBg, accentClasses.badgeText)}>
          {categoryLabel}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900">{deepDive.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-slate-600 leading-relaxed">{deepDive.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {deepDive.estimatedReadTime && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            ~{deepDive.estimatedReadTime} min read
          </span>
        )}
        {deepDive.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
        Read the Deep Dive
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </p>
    </Link>
  )
}
