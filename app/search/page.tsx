import type { Metadata } from 'next'
import Link from 'next/link'
import { Search as SearchIcon, BookOpen, Compass, Newspaper } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button, buttonVariants } from '@/components/ui/button'
import { getPublishedLessons } from '@/lib/lessons'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { isDeepDiveAvailable } from '@/lib/deep-dives'
import { INSIGHTS } from '@/content/insights/catalog'
import { isInsightAvailable } from '@/lib/insights'
import {
  lessonToSearchable,
  deepDiveToSearchable,
  insightToSearchable,
  searchContent,
  normalizeQuery,
  highlightMatch,
  type SearchableItem,
  type SearchResultType,
} from '@/lib/search'
import { cn } from '@/lib/utils'

// A /search?q=... URL is unique-per-query and has no single canonical form
// worth indexing, but the pages it links to (lessons, Deep Dives, Insights)
// should stay fully crawlable through their own canonical URLs -- so this is
// index:false paired with follow:true, not the index:false/follow:false pair
// every other noindex page in this codebase uses (auth, onboarding, profile,
// practice, AI Tutor). Deliberately no `alternates.canonical` here: unlike a
// real content page, no single query value is "the" canonical version of
// /search, so nothing meaningful to canonicalize to.
export const metadata: Metadata = {
  title: 'Search',
  description: 'Search published Learning Center lessons, Deep Dives, and IBM i Insights.',
  robots: { index: false, follow: true },
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

const TYPE_META: Record<SearchResultType, { label: string; icon: typeof BookOpen; badgeClasses: string; ring: string }> = {
  lesson: { label: 'Lesson', icon: BookOpen, badgeClasses: 'bg-blue-50 text-blue-700 border-blue-200', ring: 'focus-visible:ring-blue-600' },
  'deep-dive': { label: 'Deep Dive', icon: Compass, badgeClasses: 'bg-indigo-50 text-indigo-700 border-indigo-200', ring: 'focus-visible:ring-indigo-600' },
  insight: { label: 'IBM i Insight', icon: Newspaper, badgeClasses: 'bg-sky-50 text-sky-700 border-sky-200', ring: 'focus-visible:ring-sky-600' },
}

const GROUP_ORDER: { type: SearchResultType; heading: string }[] = [
  { type: 'lesson', heading: 'Lessons' },
  { type: 'deep-dive', heading: 'Deep Dives' },
  { type: 'insight', heading: 'IBM i Insights' },
]

const SECTION_LINKS = [
  { href: '/learn', label: 'Learning Center' },
  { href: '/deep-dives', label: 'Deep Dives' },
  { href: '/insights', label: 'IBM i Insights' },
]

/**
 * Bounds anything derived from the raw `?q=` value before it's ever rendered
 * -- matching lib/search.ts's own MAX_QUERY_LENGTH cap so a pathological,
 * very long query string can't bloat the DOM (input value, "no results"
 * message) even though matching itself is already bounded independently.
 */
function displayQuery(rawQuery: string): string {
  return rawQuery.slice(0, 200)
}

function ResultCard({ item, normalizedQuery }: { item: SearchableItem; normalizedQuery: string }) {
  const meta = TYPE_META[item.type]
  const Icon = meta.icon
  const titleSegments = highlightMatch(item.title, normalizedQuery)

  return (
    <Link
      href={item.url}
      className={cn(
        'flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        meta.ring
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', meta.badgeClasses)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {meta.label}
        </span>
        {item.category && <span className="text-xs text-slate-500">{item.category}</span>}
      </div>
      <h3 className="text-base font-bold text-slate-900">
        {titleSegments.map((segment, index) =>
          segment.match ? (
            <mark key={index} className="rounded bg-amber-100 text-slate-900">
              {segment.text}
            </mark>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        )}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
    </Link>
  )
}

function SectionLinksRow() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {SECTION_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          {link.label}
        </Link>
      ))}
    </div>
  )
}

function EmptyQueryState() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-slate-600">
        Start typing to search published lessons, Deep Dives, and IBM i Insights — or jump straight into a section:
      </p>
      <SectionLinksRow />
    </div>
  )
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-slate-600">
        No results for <span className="font-semibold text-slate-900">&ldquo;{query}&rdquo;</span>. Try a different
        term, or browse a section directly:
      </p>
      <SectionLinksRow />
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: rawQuery = '' } = await searchParams
  const boundedQuery = displayQuery(rawQuery)
  const normalizedQuery = normalizeQuery(rawQuery)
  const hasQuery = normalizedQuery.length > 0

  const lessons = await getPublishedLessons()
  const items: SearchableItem[] = [
    ...lessons.map(lessonToSearchable),
    ...DEEP_DIVES.filter(isDeepDiveAvailable).map(deepDiveToSearchable),
    ...INSIGHTS.filter(isInsightAvailable).map(insightToSearchable),
  ]

  const results = hasQuery ? searchContent(items, rawQuery) : []

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <div className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Search iRPGenie</h1>
            <p className="mt-3 text-slate-600">
              Search across published Learning Center lessons, Deep Dives, and IBM i Insights.
            </p>
            <form action="/search" method="get" role="search" className="mt-6 flex gap-2">
              <label htmlFor="search-query" className="sr-only">
                Search query
              </label>
              <input
                id="search-query"
                name="q"
                type="search"
                defaultValue={boundedQuery}
                placeholder="Search lessons, Deep Dives, Insights…"
                autoComplete="off"
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Button type="submit">
                <SearchIcon className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Search</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          {!hasQuery ? (
            <EmptyQueryState />
          ) : results.length === 0 ? (
            <NoResultsState query={boundedQuery.trim()} />
          ) : (
            <div className="space-y-10">
              {GROUP_ORDER.map(({ type, heading }) => {
                const group = results.filter((item) => item.type === type)
                if (group.length === 0) return null
                return (
                  <section key={type} aria-labelledby={`search-group-${type}`}>
                    <h2 id={`search-group-${type}`} className="mb-4 text-lg font-bold text-slate-900">
                      {heading} <span className="font-normal text-slate-500">({group.length})</span>
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {group.map((item) => (
                        <ResultCard key={`${item.type}-${item.slug}`} item={item} normalizedQuery={normalizedQuery} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
