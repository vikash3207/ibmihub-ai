/**
 * AI Tutor beta usage enforcement + tracking (PR #149). Shared by
 * app/api/ai-tutor/route.ts -- the one API route every AI Tutor surface
 * (standalone /ai-tutor, the embedded panel from a lesson or practice
 * question) already calls, so there is exactly one place these limits are
 * applied, not one per surface.
 *
 * Uses the service-role client (lib/supabase/admin.ts) for every read and
 * write against ai_tutor_usage_events: quota enforcement is a server-side
 * decision the product doesn't currently expose back to the user (no
 * usage-history UI), so there's no reason for this to go through the
 * user's own RLS-scoped session client. See the migration
 * (supabase/migrations/006_ai_tutor_usage_limits.sql) for the RLS shape.
 */
import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { AI_TUTOR_DAILY_LIMIT, AI_TUTOR_MAX_MESSAGE_CHARS, AI_TUTOR_COOLDOWN_SECONDS } from './tutor-limits'

export type AiTutorUsageOrigin = 'standalone' | 'lesson' | 'practice'
export type AiTutorBlockReason = 'message_too_long' | 'cooldown' | 'daily_limit'

export type AiTutorLimitCheck =
  | { blocked: false }
  | { blocked: true; reason: AiTutorBlockReason; message: string; contactHref?: string }

/** mailto: link shown alongside the daily-quota-exhausted message -- see app/api/ai-tutor/route.ts's client-facing response shape. */
const SUPPORT_CONTACT_HREF = 'mailto:support@irpgenie.com?subject=AI%20Tutor%20quota%20request'

/** Character-based fallback estimate when the provider doesn't return actual token usage: ~4 characters per token. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Runs the three beta guardrails in cost order (cheapest/no-DB-read first):
 * message length, then cooldown, then the daily count. The first violation
 * wins and short-circuits the rest -- callers must not proceed to call the
 * AI model when `blocked` is true.
 */
export async function checkAiTutorLimits(
  userId: string,
  latestUserMessage: string
): Promise<AiTutorLimitCheck> {
  if (latestUserMessage.length > AI_TUTOR_MAX_MESSAGE_CHARS) {
    return {
      blocked: true,
      reason: 'message_too_long',
      message: `Please shorten your question. The beta limit is ${AI_TUTOR_MAX_MESSAGE_CHARS.toLocaleString()} characters per message.`,
    }
  }

  const admin = createAdminClient()
  const startOfDayIso = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()

  // Cooldown only ever compares against the most recent ALLOWED request --
  // if a blocked attempt's own timestamp counted, a user retrying during
  // cooldown would keep pushing the window forward and could get stuck
  // waiting indefinitely.
  const { data: lastAllowed, error: lastAllowedError } = await admin
    .from('ai_tutor_usage_events')
    .select('created_at')
    .eq('user_id', userId)
    .eq('was_blocked', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fails open, never blocking the AI Tutor over an infrastructure problem
  // (e.g. the migration not yet applied) -- but logged, since a silent
  // fail-open here would otherwise mean the whole feature quietly does
  // nothing with no way to notice.
  if (lastAllowedError) {
    console.error('AI Tutor usage lookup (cooldown) failed:', lastAllowedError.message)
  }

  if (lastAllowed) {
    const secondsSinceLast = (Date.now() - new Date(lastAllowed.created_at).getTime()) / 1000
    if (secondsSinceLast < AI_TUTOR_COOLDOWN_SECONDS) {
      return {
        blocked: true,
        reason: 'cooldown',
        message: 'Please wait a few seconds before sending another AI Tutor question.',
      }
    }
  }

  const { count, error: countError } = await admin
    .from('ai_tutor_usage_events')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('was_blocked', false)
    .gte('created_at', startOfDayIso)

  if (countError) {
    console.error('AI Tutor usage lookup (daily count) failed:', countError.message)
  }

  if ((count ?? 0) >= AI_TUTOR_DAILY_LIMIT) {
    return {
      blocked: true,
      reason: 'daily_limit',
      message:
        "You've reached your daily free AI Tutor quota for today. Your quota will reset tomorrow. " +
        'If you need more AI Tutor access during beta, please contact us at support@irpgenie.com.',
      contactHref: SUPPORT_CONTACT_HREF,
    }
  }

  return { blocked: false }
}

interface RecordEventInput {
  userId: string
  origin: AiTutorUsageOrigin
  messageLength: number
  wasBlocked: boolean
  blockedReason?: AiTutorBlockReason
  model?: string
  estimatedInputTokens?: number
  estimatedOutputTokens?: number
}

/**
 * Best-effort only, like the existing ai_usage_log insert in
 * app/api/ai-tutor/route.ts -- usage tracking must never break or delay
 * the user-facing response.
 */
export async function recordAiTutorUsageEvent(input: RecordEventInput): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from('ai_tutor_usage_events').insert({
      user_id: input.userId,
      origin: input.origin,
      message_length: input.messageLength,
      was_blocked: input.wasBlocked,
      blocked_reason: input.blockedReason ?? null,
      model: input.model ?? null,
      estimated_input_tokens: input.estimatedInputTokens ?? null,
      estimated_output_tokens: input.estimatedOutputTokens ?? null,
    })
  } catch (err) {
    console.error('Failed to record AI Tutor usage event:', err)
  }
}
