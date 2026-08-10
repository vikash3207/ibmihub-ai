/**
 * Lesson completion queries.
 * Single source of truth for reading a user's progress -- the lesson page
 * and the learning path page both read through this module rather than
 * each computing their own progress model (Spec 006 PROGRESS-FR-004).
 * Server-side only - do not import in client components.
 */

import 'server-only'

import { createClient } from '@/lib/supabase/server'

/** Return the set of lesson IDs the given user has completed. */
export async function getCompletedLessonIdsForUser(userId: string): Promise<Set<string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lesson_completions')
    .select('lesson_id')
    .eq('user_id', userId)

  if (error) {
    console.error('getCompletedLessonIdsForUser error:', error.message)
    return new Set()
  }

  return new Set((data ?? []).map((row) => row.lesson_id as string))
}

export interface LessonCompletionRecord {
  lessonId: string
  /** ISO timestamp from lesson_completions.completed_at (NOT NULL, defaults to now()). */
  completedAt: string
}

/**
 * Return the user's completions with timestamps, most recent first
 * (PR #178 -- Dashboard).
 *
 * One query, no N+1: the Dashboard derives its completed-id set, its
 * most-recently-completed lesson (for the Continue Learning anchor), and
 * its recent-activity list all from this single result rather than issuing
 * a request per metric.
 *
 * `completed_at` is NOT NULL with a `now()` default in
 * supabase/migrations/002_lesson_completions.sql, so every row genuinely
 * has a real completion time -- nothing here infers or fabricates one.
 *
 * Privacy: filtered to the caller-supplied userId, which callers must take
 * from the trusted server session (supabase.auth.getUser()), never from
 * client input. The lesson_completions RLS policy independently restricts
 * SELECT to `auth.uid() = user_id`, so this cannot read another user's
 * rows even if called with someone else's id.
 */
export async function getCompletionRecordsForUser(userId: string): Promise<LessonCompletionRecord[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lesson_completions')
    .select('lesson_id, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('getCompletionRecordsForUser error:', error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    lessonId: row.lesson_id as string,
    completedAt: row.completed_at as string,
  }))
}
