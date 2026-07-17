'use client'

import { useMemo, useState } from 'react'
import { Search, X, Clock } from 'lucide-react'
import type { DeepDive } from '@/lib/deep-dives'
import { DEEP_DIVE_CATEGORIES, DEEP_DIVE_ACCENT_CLASSES, getDeepDiveAccent, type DeepDiveCategoryId } from '@/lib/deep-dive-categories'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function matchesQuery(deepDive: DeepDive, query: string): boolean {
  const haystack = [deepDive.title, deepDive.description, ...deepDive.tags].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

interface DeepDiveBrowserProps {
  deepDives: DeepDive[]
}

/**
 * Search + category filter + card grid for /deep-dives (PR #154).
 * Mirrors components/lesson-browser.tsx's established search/filter
 * pattern (search input + filter chips, client-side filtering over an
 * already-fetched list) rather than inventing a new UI convention.
 *
 * Every catalog entry today is `status: 'planned'` -- their cards render
 * as plain, non-clickable divs with a "Coming soon" badge, the same
 * disabled-link convention components/practice-lab/exercise-list.tsx
 * already uses for its own "Coming next" exercises. Nothing here creates
 * a link to a route that doesn't exist.
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
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              categoryId === null ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                categoryId === category.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filtered.length} of {deepDives.length} Deep Dives
          </span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-600">
          No Deep Dives match your search or filter.{' '}
          <button type="button" onClick={clearFilters} className="font-medium text-blue-600 hover:underline">
            Clear filters
          </button>{' '}
          to see all Deep Dives.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((deepDive) => (
            <DeepDiveCard key={deepDive.slug} deepDive={deepDive} />
          ))}
        </div>
      )}
    </div>
  )
}

function DeepDiveCard({ deepDive }: { deepDive: DeepDive }) {
  const accent = getDeepDiveAccent(deepDive.category)
  const accentClasses = DEEP_DIVE_ACCENT_CLASSES[accent]
  const isAvailable = deepDive.status === 'published'
  const categoryLabel = DEEP_DIVE_CATEGORIES.find((c) => c.id === deepDive.category)?.label ?? deepDive.category

  return (
    <Card
      className={cn('flex h-full flex-col p-5 border-t-4', accentClasses.topBorder, !isAvailable && 'opacity-75')}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', accentClasses.badgeBg, accentClasses.badgeText)}>
          {categoryLabel}
        </span>
        <Badge variant={isAvailable ? 'success' : 'neutral'}>{isAvailable ? 'Available' : 'Coming soon'}</Badge>
      </div>

      <h3 className="font-semibold text-slate-900">{deepDive.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-slate-600 leading-relaxed">{deepDive.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
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
    </Card>
  )
}
