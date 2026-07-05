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
