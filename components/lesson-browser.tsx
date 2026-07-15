'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Lock, Check, Search, X } from 'lucide-react'
import type { Lesson } from '@/lib/lessons'
import { TOPIC_FILTERS } from '@/lib/topics'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function matchesQuery(lesson: Lesson, query: string): boolean {
  const haystack = [lesson.title, lesson.short_description, ...(lesson.tags ?? [])].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

interface LessonBrowserProps {
  lessons: Lesson[]
  completedLessonIds: string[]
  isLoggedIn: boolean
}

export function LessonBrowser({ lessons, completedLessonIds, isLoggedIn }: LessonBrowserProps) {
  // Reads the ?topic= query param once, on mount, so a link like
  // /learn/ibm-i-fundamentals?topic=sqlrpgle (e.g. from a lesson sidebar's
  // "back to Learning Center" link) reopens with that filter pre-applied.
  // Intentionally a one-time seed, not kept in sync with URL changes after
  // that -- filter interactions here stay in local component state.
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [topicId, setTopicId] = useState<string | null>(() => {
    const requested = searchParams.get('topic')
    return requested && TOPIC_FILTERS.some((t) => t.id === requested) ? requested : null
  })

  const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds])
  const activeTopic = TOPIC_FILTERS.find((t) => t.id === topicId)

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (activeTopic && !activeTopic.match(lesson)) return false
      if (query.trim() && !matchesQuery(lesson, query)) return false
      return true
    })
  }, [lessons, activeTopic, query])

  const hasActiveFilter = query.trim() !== '' || topicId !== null

  function clearFilters() {
    setQuery('')
    setTopicId(null)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons by title, description, or tag..."
            aria-label="Search lessons"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopicId(null)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              topicId === null ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            All Topics
          </button>
          {TOPIC_FILTERS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setTopicId(topic.id === topicId ? null : topic.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                topicId === topic.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {topic.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredLessons.length} of {lessons.length} lessons
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

      {filteredLessons.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-600">
          No lessons match your search or filter.{' '}
          <button type="button" onClick={clearFilters} className="font-medium text-blue-600 hover:underline">
            Clear filters
          </button>{' '}
          to see all lessons.
        </div>
      ) : (
        <ol className="space-y-3">
          {filteredLessons.map((lesson) => {
            const isPreview = lesson.lesson_order === 1
            const isLocked = !isPreview && !isLoggedIn
            const isCompleted = completedSet.has(lesson.id)

            const lessonHref = activeTopic
              ? `/learn/ibm-i-fundamentals/${lesson.slug}?topic=${activeTopic.id}`
              : `/learn/ibm-i-fundamentals/${lesson.slug}`

            return (
              <li key={lesson.id}>
                <Link
                  href={lessonHref}
                  prefetch={false}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                      isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" aria-hidden="true" /> : lesson.lesson_order}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{lesson.title}</span>
                      {isPreview && <Badge variant="success">Free preview</Badge>}
                      {isLocked && (
                        <Badge variant="locked">
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          Log in to access
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="success">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          Completed
                        </Badge>
                      )}
                    </span>
                    <span className="block text-sm text-slate-600 mt-1">{lesson.short_description}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
