/**
 * Learning Progress metric calculations for the authenticated Dashboard
 * (PR #178).
 *
 * Deliberately pure and side-effect free: every function takes an already
 * fetched published-lesson list plus the caller's own completed-lesson id
 * set and returns a plain value. No Supabase client, no session lookup, no
 * `server-only` marker -- which is what makes these directly unit-testable
 * from scripts/dashboard-metrics-regression.ts without a database.
 *
 * Source of truth notes, since these numbers are user-facing claims:
 *  - "Completed" means a row exists in `lesson_completions` for this user
 *    (written only by lib/actions/progress.ts's Mark Complete action). A
 *    lesson being opened or read is never completion.
 *  - Totals always come from the caller's published-lesson list, so an
 *    unpublished or deleted lesson can never inflate a total, and a stale
 *    completion row pointing at a lesson that is no longer published is
 *    silently ignored: these functions only ever look up completion by
 *    intersecting against `lessons`, never by counting the id set directly.
 *  - Completion is curriculum progress, not demonstrated mastery. Nothing
 *    here produces a skill/mastery score.
 */

import type { Lesson } from '@/lib/lessons'
import { TOPIC_FILTERS } from '@/lib/topics'

/** A read-only id set; `Set<string>` satisfies this, so callers can pass theirs directly. */
type CompletedIds = ReadonlySet<string>

function percentOf(completed: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((completed / total) * 100)
}

export interface OverallProgress {
  completedCount: number
  totalCount: number
  /** Whole-number percent, 0 when there are no published lessons. */
  percent: number
  /** True only when there is at least one published lesson and all are complete. */
  isCurriculumComplete: boolean
}

/**
 * completedCount = published lessons that have a completion record
 * totalCount     = currently published lessons
 * percent        = round(completedCount / totalCount * 100), 0 when total is 0
 */
export function calculateOverallProgress(lessons: Lesson[], completedLessonIds: CompletedIds): OverallProgress {
  const totalCount = lessons.length
  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length

  return {
    completedCount,
    totalCount,
    percent: percentOf(completedCount, totalCount),
    isCurriculumComplete: totalCount > 0 && completedCount === totalCount,
  }
}

export interface TopicProgress {
  id: string
  label: string
  completedCount: number
  totalCount: number
  percent: number
  status: 'not-started' | 'in-progress' | 'completed'
}

/**
 * Per-topic progress, in the canonical TOPIC_FILTERS order (curriculum
 * order, not alphabetical) -- the same shared topic list the Learning
 * Center's chips and curriculum sidebar already use, so no second topic
 * taxonomy is introduced here.
 *
 * Topics with no currently published lessons are excluded entirely rather
 * than shown as a permanent 0-of-0 row.
 */
export function calculateTopicProgress(lessons: Lesson[], completedLessonIds: CompletedIds): TopicProgress[] {
  return TOPIC_FILTERS.map((topic) => {
    const topicLessons = lessons.filter((lesson) => topic.match(lesson))
    const completedCount = topicLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length
    const totalCount = topicLessons.length

    const status: TopicProgress['status'] =
      completedCount === 0 ? 'not-started' : completedCount === totalCount ? 'completed' : 'in-progress'

    return {
      id: topic.id,
      label: topic.label,
      completedCount,
      totalCount,
      percent: percentOf(completedCount, totalCount),
      status,
    }
  }).filter((topic) => topic.totalCount > 0)
}

export interface TopicSummary {
  /** Topics with at least one completed published lesson. */
  startedCount: number
  /** Topics where every currently published lesson is complete. */
  completedCount: number
  /** Topics that currently have any published lessons at all. */
  totalCount: number
}

export function summarizeTopics(topicProgress: TopicProgress[]): TopicSummary {
  return {
    startedCount: topicProgress.filter((topic) => topic.completedCount > 0).length,
    completedCount: topicProgress.filter((topic) => topic.status === 'completed').length,
    totalCount: topicProgress.length,
  }
}

/**
 * Deterministic "Continue Learning" pick:
 *
 *  1. If every published lesson is complete, return null -- the caller shows
 *     a curriculum-completed state instead. This is what stops a completed
 *     lesson ever being recommended as "next".
 *  2. Otherwise, if a most-recently-completed lesson is known (from a real
 *     `completed_at` timestamp) and it is still published, return the first
 *     incomplete lesson *after* it in canonical curriculum order.
 *  3. If everything after that point is already complete (the learner went
 *     back and finished later material first), fall back to the earliest
 *     incomplete lesson overall, so a gap earlier in the curriculum is not
 *     silently skipped forever.
 *  4. With no usable timestamp, return the earliest incomplete lesson.
 *
 * `lessons` is expected in canonical curriculum order (lesson_order), which
 * is what getPublishedLessons() already returns.
 */
export function selectContinueLesson(
  lessons: Lesson[],
  completedLessonIds: CompletedIds,
  mostRecentCompletedLessonId?: string | null
): Lesson | null {
  if (lessons.length === 0) return null

  const isIncomplete = (lesson: Lesson) => !completedLessonIds.has(lesson.id)
  const earliestIncomplete = lessons.find(isIncomplete) ?? null

  // Everything published is complete -- caller renders the completed state.
  if (!earliestIncomplete) return null

  if (mostRecentCompletedLessonId) {
    const anchorIndex = lessons.findIndex((lesson) => lesson.id === mostRecentCompletedLessonId)
    if (anchorIndex >= 0) {
      const nextAfterAnchor = lessons.slice(anchorIndex + 1).find(isIncomplete)
      if (nextAfterAnchor) return nextAfterAnchor
    }
  }

  return earliestIncomplete
}

/** The topic a lesson belongs to, for display next to a recommended/recent lesson. */
export function getTopicLabelForLesson(lesson: Lesson): string | undefined {
  return TOPIC_FILTERS.find((topic) => topic.match(lesson))?.label
}
