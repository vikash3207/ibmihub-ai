'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, Search, X } from 'lucide-react'
import type { Lesson } from '@/lib/lessons'
import { getLessonAccent, LESSON_ACCENT_CLASSES } from '@/components/lesson-category-accent'
import { getMasterCategoryLabel } from '@/lib/master-categories'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function matchesQuery(lesson: Lesson, query: string): boolean {
  const haystack = [lesson.title, lesson.short_description, ...(lesson.tags ?? [])].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

interface LessonBrowserProps {
  /** Already topic-filtered server-side by the caller (searchParams.topic) -- this component only ever narrows further by keyword search, it does not own topic/category state. */
  lessons: Lesson[]
  completedLessonIds: string[]
  activeTopic: { id: string; label: string } | null
}

/**
 * Lesson list + keyword search (Learning Center and 288-Lesson Catalog
 * Simplification). Topic browsing moved out of this component entirely --
 * components/curriculum-sidebar.tsx is now the one primary category-browsing
 * control, real server-rendered navigation, not client state this component
 * has to coordinate with. The old "Browse by category" master-category
 * dropdown and the duplicate topic pill-button row are both gone; search is
 * the only thing left that still needs to be a fast, no-navigation client
 * interaction, since it narrows the current (already topic-scoped) list as
 * the visitor types.
 */
export function LessonBrowser({ lessons, completedLessonIds, activeTopic }: LessonBrowserProps) {
  const [query, setQuery] = useState('')

  const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds])

  const filteredLessons = useMemo(() => {
    if (!query.trim()) return lessons
    return lessons.filter((lesson) => matchesQuery(lesson, query))
  }, [lessons, query])

  return (
    <div className="min-w-0 space-y-5">
      <div className="space-y-3">
        {activeTopic && (
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-700">{activeTopic.label}</h2>
            <Link href="/learn/ibm-i-fundamentals" className="text-xs font-medium text-blue-600 hover:underline">
              View all lessons
            </Link>
          </div>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeTopic ? `Search within ${activeTopic.label}...` : 'Search lessons by title, description, or tag...'}
            aria-label="Search lessons"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredLessons.length} of {lessons.length} lesson{lessons.length === 1 ? '' : 's'}
            {activeTopic ? ` in ${activeTopic.label}` : ''}
          </span>
          {query.trim() !== '' && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear search
            </button>
          )}
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-600">
          No lessons match your search.{' '}
          <button type="button" onClick={() => setQuery('')} className="font-medium text-blue-600 hover:underline">
            Clear search
          </button>{' '}
          to see all lessons{activeTopic ? ` in ${activeTopic.label}` : ''}.
        </div>
      ) : (
        <ol className="space-y-3">
          {filteredLessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              activeTopic={activeTopic}
              isCompleted={completedSet.has(lesson.id)}
            />
          ))}
        </ol>
      )}
    </div>
  )
}

function LessonRow({
  lesson,
  activeTopic,
  isCompleted,
}: {
  lesson: Lesson
  activeTopic: { id: string } | null
  isCompleted: boolean
}) {
  const lessonHref = activeTopic
    ? `/learn/ibm-i-fundamentals/${lesson.slug}?topic=${activeTopic.id}`
    : `/learn/ibm-i-fundamentals/${lesson.slug}`

  const accent = getLessonAccent(lesson.master_category_id)
  const accentClasses = LESSON_ACCENT_CLASSES[accent]
  const categoryLabel = getMasterCategoryLabel(lesson.master_category_id)

  return (
    <li>
      <Link
        href={lessonHref}
        prefetch={false}
        className={cn(
          // `border` (all sides, 1px) must come BEFORE `border-t-4`/the accent
          // top-border color below -- tailwind-merge resolves conflicting
          // Tailwind utilities by keeping whichever one appears LAST in this
          // list for a given side, so the more specific top-edge overrides
          // need to be listed after the general shorthand, not before it.
          'flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors motion-reduce:transition-none',
          'hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
          'border-t-4',
          accentClasses.topBorder
        )}
      >
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
            isCompleted ? 'bg-emerald-100 text-emerald-800' : cn(accentClasses.badgeBg, accentClasses.badgeText)
          )}
        >
          {isCompleted ? <Check className="h-4 w-4" aria-hidden="true" /> : lesson.lesson_order}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 flex-wrap">
            <span className="break-words font-semibold text-slate-900">{lesson.title}</span>
            {isCompleted && (
              <Badge variant="success">
                <Check className="h-3 w-3" aria-hidden="true" />
                Completed
              </Badge>
            )}
          </span>
          <span className="mt-1 block break-words text-sm text-slate-600">{lesson.short_description}</span>
          {categoryLabel && (
            <span
              className={cn(
                'mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                accentClasses.badgeBg,
                accentClasses.badgeText,
                accentClasses.badgeBorder
              )}
            >
              {categoryLabel}
            </span>
          )}
        </span>
      </Link>
    </li>
  )
}
