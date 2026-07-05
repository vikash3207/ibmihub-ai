'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Record helpful/not-helpful feedback for an AI Tutor response.
 *
 * Stores only the response's client-generated correlation id and the rating
 * -- never the prompt or response text (Spec 001 Section 11). RLS on
 * ai_tutor_feedback is the real enforcement boundary: the insert policy
 * requires auth.uid() = user_id, so this can never write another user's row
 * even if called with a forged user id.
 */
export async function submitAiTutorFeedback(responseId: string, isHelpful: boolean) {
  if (!responseId) {
    return { ok: false }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false }
  }

  const { error } = await supabase.from('ai_tutor_feedback').upsert(
    {
      user_id: user.id,
      response_id: responseId,
      is_helpful: isHelpful,
    },
    { onConflict: 'user_id,response_id', ignoreDuplicates: true }
  )

  if (error) {
    console.error('submitAiTutorFeedback insert error:', error.message)
    return { ok: false }
  }

  return { ok: true }
}
