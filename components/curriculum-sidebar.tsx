import Link from 'next/link'
import { List, ChevronDown, ChevronRight, Check } from 'lucide-react'
import type { Lesson } from '@/lib/lessons'
import { TOPIC_FILTERS } from '@/lib/topics'
import { cn } from '@/lib/utils'

interface CurriculumSidebarProps {
  /** Full published-lesson list -- topic groups/counts are derived here, the same way components/insights/explore-insights-nav.tsx derives category groups from its `insights` prop, so counts always reflect the real catalog. */
  lessons: Lesson[]
  activeTopicId: string | null
  completedSet: Set<string>
}

/**
 * Curriculum index for the Learning Center (Learning Center and 288-Lesson
 * Catalog Simplification). Now the ONE primary browsing control for the
 * catalog -- previously this sidebar duplicated a second topic-filter UI
 * (a 19-button pill row) and a third, unrelated master-category dropdown,
 * both removed from components/lesson-browser.tsx in this same change.
 *
 * A plain Server Component, no client state: every row is a real
 * `<Link>` to `/learn/ibm-i-fundamentals` or
 * `/learn/ibm-i-fundamentals?topic=<id>`, and app/learn/ibm-i-fundamentals/page.tsx
 * reads that query param server-side to filter -- the exact pattern
 * components/insights/explore-insights-nav.tsx already established (real
 * navigation, shareable/bookmarkable URLs, browser Back/Forward works
 * through ordinary history entries, nothing hidden from a crawler).
 *
 * Only the currently active topic's lesson list renders expanded; every
 * other topic shows just its header row and count. This replaces the old
 * client `useState`-driven "manual expansion, independent of the active
 * topic" behavior (components/lesson-sidebar.tsx-adjacent PR #177 once had
 * to fix a desync bug in that exact model) with something that cannot
 * desync by construction: expanded state IS the active-topic state, both
 * driven by the one URL this component reads nothing but a prop from.
 *
 * One render function serves both surfaces: the mobile collapsible
 * "Curriculum" panel (a native <details>/<summary>, zero JS, matching
 * components/insights/explore-insights-nav.tsx's mobile "Browse Insights"
 * panel) and the desktop sticky sidebar.
 */
export function CurriculumSidebar({ lessons, activeTopicId, completedSet }: CurriculumSidebarProps) {
  const topicGroups = TOPIC_FILTERS.map((topic) => ({
    topic,
    lessons: lessons.filter((lesson) => topic.match(lesson)),
  }))

  function renderSections() {
    return (
      <div className="space-y-1">
        <Link
          href="/learn/ibm-i-fundamentals"
          aria-current={activeTopicId === null ? 'true' : undefined}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors motion-reduce:transition-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
            activeTopicId === null
              ? 'bg-blue-50 font-semibold text-blue-800 ring-1 ring-inset ring-blue-200'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <span>All Topics</span>
          <span
            className={cn(
              'shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
              activeTopicId === null ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
            )}
          >
            {lessons.length}
          </span>
        </Link>

        {topicGroups.map(({ topic, lessons: topicLessons }) => {
          const isActive = activeTopicId === topic.id
          const hasLessons = topicLessons.length > 0

          return (
            <div key={topic.id}>
              <Link
                href={`/learn/ibm-i-fundamentals?topic=${topic.id}`}
                aria-current={isActive ? 'true' : undefined}
                aria-expanded={isActive}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                  isActive ? 'bg-blue-50 font-semibold text-blue-800 ring-1 ring-inset ring-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {/* Right-pointing when collapsed, rotated 90deg (pointing
                      down) when this is the active/expanded topic -- always
                      accurate because it's driven by the same `isActive`
                      value the expansion itself is, computed once
                      server-side, never a separately-tracked React state
                      that could desync from it. */}
                  <ChevronRight
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none',
                      isActive && 'rotate-90',
                      isActive ? 'text-blue-500' : 'text-slate-400'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{topic.label}</span>
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {topicLessons.length}
                </span>
              </Link>
              {isActive && hasLessons && (
                <ol className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-100 pl-2.5">
                  {topicLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/learn/ibm-i-fundamentals/${lesson.slug}?topic=${topic.id}`}
                        // 288 lessons render across this sidebar; Next.js's
                        // default prefetch would queue a payload fetch per
                        // link as rows enter the viewport. Same reason the
                        // lesson cards in components/lesson-browser.tsx opt
                        // out.
                        prefetch={false}
                        title={lesson.title}
                        aria-current={false}
                        className="flex items-center gap-2 rounded-md py-1 pl-2 pr-3 text-xs text-slate-500 transition-colors motion-reduce:transition-none hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        {/* Fixed-width, non-shrinking number slot. 189 of the
                            288 lessons are numbered 100+, so a slot sized for
                            1-2 digits would overflow into the title -- w-7
                            fits "288" with room to spare, text-right keeps
                            every title starting at the same x regardless of
                            digit count. */}
                        <span className="flex w-7 shrink-0 items-center justify-end tabular-nums text-slate-400">
                          {completedSet.has(lesson.id) ? (
                            <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
                          ) : (
                            lesson.lesson_order
                          )}
                        </span>
                        <span className="min-w-0 truncate">{lesson.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Mobile / narrow screens: collapsible "Curriculum" panel, matching
          components/insights/explore-insights-nav.tsx's mobile "Browse
          Insights" panel -- a native <details>/<summary>, no client JS. */}
      <details className="group mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <List className="h-4 w-4 text-blue-600" aria-hidden="true" />
          Curriculum
          <ChevronDown className="ml-auto h-4 w-4 text-slate-400 transition-transform motion-reduce:transition-none group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-3 max-h-96 overflow-y-auto border-t border-slate-100 pt-3">{renderSections()}</div>
      </details>

      {/* Desktop / wide screens: sticky left sidebar. */}
      <nav aria-label="Curriculum" className="hidden lg:sticky lg:top-20 lg:block">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <List className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
            Curriculum
          </p>
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">{renderSections()}</div>
        </div>
      </nav>
    </>
  )
}
