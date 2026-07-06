'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Mark a lesson complete for the current authenticated user.
 *
 * Idempotent: relies on the unique(user_id, lesson_id) constraint plus
 * ignoreDuplicates so repeated submissions are a safe no-op (Spec 006
 * PROGRESS-FR-002, PROGRESS-FR-003).
 *
 * Published-only enforcement is defense-in-depth here: the lesson is
 * re-fetched by ID filtered to status = 'Published' immediately before the
 * write, in addition to the database-level check in the lesson_completions
 * insert RLS policy (supabase/migrations/002_lesson_completions.sql).
 */
export async function markLessonComplete(formData: FormData) {
  const lessonId = formData.get('lessonId') as string
  if (!lessonId) {
    return
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // TEMP AUTH DIAGNOSTIC (safe: no token/cookie values, remove after the P0
  // auth-session investigation is closed out).
  console.log(`[auth-diag] markLessonComplete: user=${user ? 'present' : 'null'}`)

  if (!user) {
    // No session -- the UI never renders this form for logged-out users,
    // but the action itself must not trust that.
    return
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id, slug, learning_path_id')
    .eq('id', lessonId)
    .eq('status', 'Published')
    .maybeSingle()

  if (lessonError || !lesson) {
    // Lesson does not exist or is not Published -- silently do nothing.
    return
  }

  const { error: insertError } = await supabase.from('lesson_completions').upsert(
    {
      user_id: user.id,
      lesson_id: lesson.id,
      learning_path_id: lesson.learning_path_id,
    },
    { onConflict: 'user_id,lesson_id', ignoreDuplicates: true }
  )

  if (insertError) {
    console.error('markLessonComplete insert error:', insertError.message)
    return
  }

  revalidatePath(`/learn/ibm-i-fundamentals/${lesson.slug}`)
  revalidatePath('/learn/ibm-i-fundamentals')
}
