/**
 * Trusted, server-only achievement awarding and reconciliation (PR #179).
 *
 * SECURITY MODEL. `user_achievements` grants ordinary authenticated clients
 * SELECT only (supabase/migrations/007_user_achievements.sql) -- there is no
 * insert/update/delete policy or grant for them at all. Every write happens
 * here, through the existing server-only service-role client
 * (lib/supabase/admin.ts, the same pattern lib/ai/tutor-usage.ts already
 * uses for trusted user-scoped writes). Consequences:
 *
 *  - A browser cannot POST an arbitrary badge_code to PostgREST; the grant
 *    simply is not there.
 *  - Callers pass a userId taken from the trusted server session
 *    (supabase.auth.getUser()), never from a request body or query string.
 *  - Eligibility is always recomputed here from `lessons` and
 *    `lesson_completions`. No client-supplied completion count, badge code,
 *    topic, or timestamp is ever trusted or even accepted.
 *  - Only codes present in the ACHIEVEMENTS registry can be written, because
 *    the rows inserted are built from evaluateAchievements() output.
 *
 * IDEMPOTENCY. Inserts use ON CONFLICT DO NOTHING against the
 * unique (user_id, badge_code) constraint, so repeated reconciliation, a
 * page refresh, two concurrent requests, or a retry all converge on exactly
 * one row per badge. Nothing here ever deletes: an achievement, once
 * genuinely earned, is permanent even if the curriculum later grows and the
 * learner would no longer re-qualify today.
 */

import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPublishedLessons } from '@/lib/lessons'
import { getCompletionRecordsForUser } from '@/lib/progress'
import { evaluateAchievements } from '@/lib/achievements'

export interface StoredAchievement {
  badgeCode: string
  earnedAt: string
  lessonsCompletedAtAward: number | null
  qualifyingTopicId: string | null
}

/**
 * Read the caller's own stored achievements.
 *
 * Uses the normal request-scoped client (not the admin client) so the RLS
 * policy `auth.uid() = user_id` independently enforces that one learner can
 * never read another's awards, even if this were somehow called with a
 * different id.
 */
export async function getAchievementsForUser(userId: string): Promise<StoredAchievement[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_achievements')
    .select('badge_code, earned_at, lessons_completed_at_award, qualifying_topic_id')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('getAchievementsForUser error:', error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    badgeCode: row.badge_code as string,
    earnedAt: row.earned_at as string,
    lessonsCompletedAtAward: (row.lessons_completed_at_award as number | null) ?? null,
    qualifyingTopicId: (row.qualifying_topic_id as string | null) ?? null,
  }))
}

export interface ReconcileResult {
  /** Every achievement this user holds after reconciliation. */
  achievements: StoredAchievement[]
  /** Codes awarded by *this* call -- empty on every subsequent run. */
  newlyAwardedCodes: string[]
}

/**
 * Recompute eligibility for one user and persist any newly qualified
 * achievements, returning their full, current award list.
 *
 * This doubles as the backfill for learners who qualified before this
 * feature shipped: it is lazy, per-user, and runs when an authenticated
 * learner opens their own Dashboard or achievement gallery. There is no
 * migration-time backfill, because topic membership is defined by the
 * JavaScript predicates in lib/topics.ts and cannot be evaluated in SQL --
 * restating that taxonomy in the migration would create exactly the second,
 * drift-prone definition of "topic" this project avoids elsewhere. Nothing
 * recalculates all users at once, and no anonymous request reaches this.
 *
 * Earned dates are historically accurate where derivable:
 * evaluateAchievements() replays the learner's completions oldest-first, so
 * a backfilled badge carries the timestamp of the completion that actually
 * crossed its threshold, not the time of the backfill.
 */
export async function reconcileAchievementsForUser(userId: string): Promise<ReconcileResult> {
  const [lessons, completions, existing] = await Promise.all([
    getPublishedLessons(),
    getCompletionRecordsForUser(userId),
    getAchievementsForUser(userId),
  ])

  const alreadyEarned = new Set(existing.map((achievement) => achievement.badgeCode))
  const qualified = evaluateAchievements(lessons, completions)
  const missing = qualified.filter((achievement) => !alreadyEarned.has(achievement.code))

  if (missing.length === 0) {
    return { achievements: existing, newlyAwardedCodes: [] }
  }

  // Service-role write: this table intentionally has no client insert grant.
  const admin = createAdminClient()
  const { error } = await admin.from('user_achievements').upsert(
    missing.map((achievement) => ({
      user_id: userId,
      badge_code: achievement.code,
      earned_at: achievement.earnedAt,
      lessons_completed_at_award: achievement.lessonsCompletedAtAward,
      qualifying_topic_id: achievement.qualifyingTopicId ?? null,
    })),
    { onConflict: 'user_id,badge_code', ignoreDuplicates: true }
  )

  if (error) {
    // A failure here must never break the page that triggered it -- the
    // learner's lesson completions are already safely stored, and the next
    // reconciliation will pick these up. Degrade to what is already known.
    console.error('reconcileAchievementsForUser insert error:', error.message)
    return { achievements: existing, newlyAwardedCodes: [] }
  }

  return {
    achievements: await getAchievementsForUser(userId),
    newlyAwardedCodes: missing.map((achievement) => achievement.code),
  }
}
