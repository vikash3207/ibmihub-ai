'use client'

import { List, ChevronDown, Check } from 'lucide-react'
import type { Lesson } from '@/lib/lessons'
import type { TopicFilter } from '@/lib/topics'
import { cn } from '@/lib/utils'

export interface CurriculumTopicGroup {
  topic: TopicFilter
  /** Already sorted by lesson_order; already filtered by search + category, but NOT by topic -- every topic stays visible/selectable regardless of which one is currently active. */
  lessons: Lesson[]
}

interface CurriculumSidebarProps {
  topicGroups: CurriculumTopicGroup[]
  /** Lessons matching the current search + category filters, before any topic narrowing -- the "All Topics" row's count. */
  allCount: number
  activeTopicId: string | null
  onSelectTopic: (id: string | null) => void
  completedSet: Set<string>
}

/**
 * Curriculum index for the Learning Center (PR #175). Groups the full
 * lesson catalog by the same lib/topics.ts TOPIC_FILTERS the search chips
 * already use -- a single shared source of truth, not a second filtering
 * system -- so selecting a topic here sets the exact same `topicId` state
 * components/lesson-browser.tsx's chips already read and write.
 *
 * One component renders both the desktop sticky sidebar and the mobile
 * collapsible "Curriculum" panel, matching the established pattern in
 * components/deep-dive-toc.tsx: shared render logic, native <details> for
 * every expand/collapse (topic sections AND the mobile panel itself), no
 * new dependency, fully keyboard/screen-reader accessible by construction.
 *
 * Each topic section's <summary> click does two things at once, on
 * purpose: it toggles that section open/closed (the browser's own default
 * behavior for a <summary> click, left completely alone -- no
 * preventDefault/stopPropagation anywhere in this component) AND selects
 * that topic as the active filter. This keeps the interaction model
 * entirely native (nothing fighting the browser's own disclosure-widget
 * semantics) and, as a side effect, means only one section is ever open at
 * a time -- selecting a new topic auto-closes whichever one was open
 * before, which is exactly the "manageable amount of content visible at
 * once" behavior the sidebar needs with 18 topics and ~290 lessons.
 */
export function CurriculumSidebar({ topicGroups, allCount, activeTopicId, onSelectTopic, completedSet }: CurriculumSidebarProps) {
  function closeMobilePanel(event: React.MouseEvent<HTMLElement>) {
    event.currentTarget.closest('details')?.removeAttribute('open')
  }

  function renderSections() {
    return (
      <div className="space-y-1">
        <button
          type="button"
          aria-current={activeTopicId === null ? 'true' : undefined}
          onClick={() => onSelectTopic(null)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors motion-reduce:transition-none',
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
            {allCount}
          </span>
        </button>

        {topicGroups.map(({ topic, lessons }) => {
          const isActive = activeTopicId === topic.id
          return (
            <details key={topic.id} open={isActive} className="rounded-lg">
              <summary
                onClick={() => onSelectTopic(topic.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors motion-reduce:transition-none',
                  isActive ? 'bg-blue-50 font-semibold text-blue-800 ring-1 ring-inset ring-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <ChevronDown
                    className={cn('h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none group-open:rotate-180', isActive ? 'text-blue-500' : 'text-slate-400')}
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
                  {lessons.length}
                </span>
              </summary>
              {lessons.length > 0 && (
                <ol className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-100 pl-2.5">
                  {lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <a
                        href={`/learn/ibm-i-fundamentals/${lesson.slug}?topic=${topic.id}`}
                        onClick={closeMobilePanel}
                        className="flex items-center gap-1.5 truncate rounded-md px-2 py-1 text-xs text-slate-500 transition-colors motion-reduce:transition-none hover:bg-slate-50 hover:text-slate-800"
                      >
                        {completedSet.has(lesson.id) ? (
                          <Check className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true" />
                        ) : (
                          <span className="w-3 shrink-0 text-center tabular-nums text-slate-400">{lesson.lesson_order}</span>
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </details>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Mobile / narrow screens: collapsible "Curriculum" panel, matching
          components/deep-dive-toc.tsx's mobile "Contents" panel convention. */}
      <details className="group mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-900">
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
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-1">{renderSections()}</div>
        </div>
      </nav>
    </>
  )
}
