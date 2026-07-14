'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Lock, Check, Search, X } from 'lucide-react'
import type { Lesson } from '@/lib/lessons'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TopicFilter {
  id: string
  label: string
  match: (lesson: Lesson) => boolean
}

/**
 * Buckets are derived from real trackId values in content/lessons/tracks.ts,
 * with RPGLE/File I/O and Display Files/Subfiles each split from their
 * shared trackId using the `tags` convention already used consistently
 * across every lesson in those two tracks ('file-io' and 'subfiles').
 */
const TOPIC_FILTERS: TopicFilter[] = [
  { id: 'foundations', label: 'Foundations', match: (l) => l.track_id === 'ibm-i-foundations' },
  { id: 'commands', label: 'Commands', match: (l) => l.track_id === '5250-terminal-and-commands' },
  { id: 'libraries-objects-ifs', label: 'Libraries, Objects & IFS', match: (l) => l.track_id === 'libraries-objects-and-ifs' },
  { id: 'db2-dds', label: 'Db2 / DDS', match: (l) => l.track_id === 'db2-for-i-and-dds' },
  { id: 'rpgle', label: 'RPGLE', match: (l) => l.track_id === 'rpgle-beginner' && !(l.tags ?? []).includes('file-io') },
  { id: 'file-io', label: 'File I/O', match: (l) => l.track_id === 'rpgle-beginner' && (l.tags ?? []).includes('file-io') },
  { id: 'clle', label: 'CLLE', match: (l) => l.track_id === 'clle' },
  {
    id: 'display-files',
    label: 'Display Files',
    match: (l) => l.track_id === 'display-files-and-subfiles' && !(l.tags ?? []).includes('subfiles'),
  },
  { id: 'subfiles', label: 'Subfiles', match: (l) => l.track_id === 'display-files-and-subfiles' && (l.tags ?? []).includes('subfiles') },
  { id: 'sqlrpgle', label: 'SQLRPGLE', match: (l) => l.track_id === 'sql-for-ibm-i' },
  { id: 'printer-files', label: 'Printer Files', match: (l) => l.track_id === 'printer-files-and-reports' },
  { id: 'debugging', label: 'Debugging', match: (l) => l.track_id === 'debugging-and-job-logs' },
  { id: 'operations', label: 'Operations', match: (l) => l.track_id === 'ibm-i-operations' },
  { id: 'mini-projects', label: 'Mini Projects', match: (l) => l.track_id === 'real-world-projects' },
  { id: 'interview', label: 'Interview Readiness', match: (l) => l.track_id === 'interview-and-professional-readiness' },
]

function matchesQuery(lesson: Lesson, query: string): boolean {
  const haystack = [lesson.title, lesson.short_description, ...(lesson.tags ?? [])].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

interface LessonBrowserProps {
  lessons: Lesson[]
  totalLessons: number
  completedLessonIds: string[]
  isLoggedIn: boolean
}

export function LessonBrowser({ lessons, totalLessons, completedLessonIds, isLoggedIn }: LessonBrowserProps) {
  const [query, setQuery] = useState('')
  const [topicId, setTopicId] = useState<string | null>(null)

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
            Showing {filteredLessons.length} of {totalLessons} lessons
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

            return (
              <li key={lesson.id}>
                <Link
                  href={`/learn/ibm-i-fundamentals/${lesson.slug}`}
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
