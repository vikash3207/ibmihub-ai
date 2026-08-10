/**
 * Achievement badge registry and eligibility evaluation (PR #179).
 *
 * This module is the single source of truth for what badges exist and what
 * earns them. Deliberately pure and dependency-free -- no Supabase client,
 * no session, no `server-only` marker -- so every rule here is directly
 * unit-testable from scripts/achievements-regression.ts without a database,
 * and so the same definitions can be rendered by the Dashboard and gallery
 * without a second copy existing anywhere.
 *
 * Honesty constraints baked into the copy below: these are iRPGenie
 * learning-progress achievements based on lessons a learner marked
 * complete. They are not credentials, not assessments of skill, and carry
 * no association with or endorsement by IBM. Nothing here is described as
 * certification, mastery, or expertise.
 */

import type { Lesson } from '@/lib/lessons'
import { TOPIC_FILTERS } from '@/lib/topics'

export type AchievementCategory = 'lesson-milestone' | 'topic' | 'curriculum'

export interface AchievementDefinition {
  /** Stable machine-readable identifier -- the only value ever persisted. */
  code: string
  name: string
  description: string
  /** The precise, user-facing earning condition. */
  condition: string
  category: AchievementCategory
  /** Icon key resolved to a lucide icon by the UI; no icon dependency here. */
  icon: 'footprints' | 'trending-up' | 'target' | 'award' | 'medal' | 'trophy' | 'compass' | 'layers' | 'library' | 'graduation-cap'
  /** Lesson-count threshold, for milestone badges only. */
  lessonThreshold?: number
  /** Topic-count threshold, for topic badges only. */
  topicThreshold?: number
}

/**
 * Display order is the array order: lesson milestones (ascending), then
 * topic badges, then the full-curriculum badge. Earned/locked state never
 * reorders the gallery -- see the sort note in the gallery page.
 */
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    code: 'first_step',
    name: 'First Step',
    description: 'You completed your first lesson.',
    condition: 'Complete 1 published lesson',
    category: 'lesson-milestone',
    icon: 'footprints',
    lessonThreshold: 1,
  },
  {
    code: 'learning_momentum',
    name: 'Learning Momentum',
    description: 'Five lessons in. You are building a habit.',
    condition: 'Complete 5 published lessons',
    category: 'lesson-milestone',
    icon: 'trending-up',
    lessonThreshold: 5,
  },
  {
    code: 'committed_learner',
    name: 'Committed Learner',
    description: 'Ten lessons completed.',
    condition: 'Complete 10 published lessons',
    category: 'lesson-milestone',
    icon: 'target',
    lessonThreshold: 10,
  },
  {
    code: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Twenty-five lessons completed.',
    condition: 'Complete 25 published lessons',
    category: 'lesson-milestone',
    icon: 'award',
    lessonThreshold: 25,
  },
  {
    code: 'half_century',
    name: 'Half Century',
    description: 'Fifty lessons completed.',
    condition: 'Complete 50 published lessons',
    category: 'lesson-milestone',
    icon: 'medal',
    lessonThreshold: 50,
  },
  {
    code: 'century_learner',
    name: 'Century Learner',
    description: 'One hundred lessons completed.',
    condition: 'Complete 100 published lessons',
    category: 'lesson-milestone',
    icon: 'trophy',
    lessonThreshold: 100,
  },
  {
    code: 'topic_explorer',
    name: 'Topic Explorer',
    description: 'You have started lessons across three different areas of the curriculum.',
    condition: 'Complete at least one published lesson in 3 different topics',
    category: 'topic',
    icon: 'compass',
    topicThreshold: 3,
  },
  {
    code: 'topic_completer',
    name: 'Topic Completer',
    description: 'You worked through every published lesson in a topic.',
    condition: 'Complete every published lesson in any one topic',
    category: 'topic',
    icon: 'layers',
    topicThreshold: 1,
  },
  {
    code: 'multi_topic_finisher',
    name: 'Multi-Topic Finisher',
    description: 'Three topics completed end to end.',
    condition: 'Complete every published lesson in 3 different topics',
    category: 'topic',
    icon: 'library',
    topicThreshold: 3,
  },
  {
    code: 'curriculum_completer',
    name: 'Curriculum Completer',
    description: 'You completed every lesson currently published in the curriculum.',
    condition: 'Complete every currently published lesson',
    category: 'curriculum',
    icon: 'graduation-cap',
  },
]

export const ACHIEVEMENT_BY_CODE = new Map(ACHIEVEMENTS.map((a) => [a.code, a]))

/** A completion as stored: which lesson, and when. */
export interface CompletionInput {
  lessonId: string
  /** ISO timestamp from lesson_completions.completed_at. */
  completedAt: string
}

export interface QualifiedAchievement {
  code: string
  /** The timestamp at which the learner actually crossed this threshold. */
  earnedAt: string
  /** Published lessons completed at that moment. */
  lessonsCompletedAtAward: number
  /** For topic badges, the topic whose completion triggered the award. */
  qualifyingTopicId?: string
}

/**
 * Determine every achievement a learner currently qualifies for, replaying
 * their completions in chronological order so each award carries the
 * timestamp at which the threshold was genuinely crossed rather than "now".
 * That is what lets pre-existing learners be backfilled with real historical
 * dates instead of a fabricated one.
 *
 * Reconciliation rules, all enforced here rather than by the caller:
 *  - Only currently published lessons count. A completion row for a deleted
 *    or unpublished lesson is dropped before anything is evaluated, so it
 *    can never contribute to a threshold.
 *  - Each lesson counts at most once; duplicate completion rows for the same
 *    lesson are collapsed to their earliest timestamp.
 *  - Topic membership uses the shared TOPIC_FILTERS predicates -- the same
 *    ones the Learning Center and Dashboard use. A lesson matching no topic
 *    contributes to lesson-count badges but to no topic badge.
 *  - An empty curriculum yields nothing, so curriculum_completer can never
 *    be granted for "completing" zero lessons.
 *
 * IMPORTANT: this reports *current* eligibility. It is only ever used to ADD
 * awards; stored awards are never deleted, so a badge already earned stays
 * earned even if later-published lessons mean the learner would no longer
 * re-qualify today. See lib/achievements-server.ts.
 */
export function evaluateAchievements(lessons: Lesson[], completions: CompletionInput[]): QualifiedAchievement[] {
  if (lessons.length === 0) return []

  const publishedById = new Map(lessons.map((lesson) => [lesson.id, lesson]))

  // Drop stale/unpublished rows, then collapse duplicates to the earliest
  // completion per lesson, then replay oldest-first.
  const earliestByLesson = new Map<string, string>()
  for (const completion of completions) {
    if (!publishedById.has(completion.lessonId)) continue
    const existing = earliestByLesson.get(completion.lessonId)
    if (!existing || completion.completedAt < existing) {
      earliestByLesson.set(completion.lessonId, completion.completedAt)
    }
  }

  const timeline = [...earliestByLesson.entries()]
    .map(([lessonId, completedAt]) => ({ lessonId, completedAt }))
    .sort((a, b) => (a.completedAt < b.completedAt ? -1 : a.completedAt > b.completedAt ? 1 : 0))

  if (timeline.length === 0) return []

  // Precompute each topic's published lesson ids once (no per-completion rescan).
  const topicLessonIds = new Map<string, Set<string>>()
  for (const topic of TOPIC_FILTERS) {
    const ids = new Set(lessons.filter((lesson) => topic.match(lesson)).map((lesson) => lesson.id))
    if (ids.size > 0) topicLessonIds.set(topic.id, ids)
  }
  const topicIdForLesson = new Map<string, string>()
  for (const [topicId, ids] of topicLessonIds) {
    for (const id of ids) {
      if (!topicIdForLesson.has(id)) topicIdForLesson.set(id, topicId)
    }
  }

  const qualified = new Map<string, QualifiedAchievement>()
  const record = (code: string, entry: Omit<QualifiedAchievement, 'code'>) => {
    if (!qualified.has(code)) qualified.set(code, { code, ...entry })
  }

  const completedIds = new Set<string>()
  const completedPerTopic = new Map<string, number>()
  const startedTopics = new Set<string>()
  const finishedTopics = new Set<string>()

  timeline.forEach((entry, index) => {
    completedIds.add(entry.lessonId)
    const completedCount = index + 1
    const at = entry.completedAt

    // Lesson-count milestones -- fires exactly on the crossing completion.
    for (const definition of ACHIEVEMENTS) {
      if (definition.lessonThreshold === completedCount) {
        record(definition.code, { earnedAt: at, lessonsCompletedAtAward: completedCount })
      }
    }

    const topicId = topicIdForLesson.get(entry.lessonId)
    if (topicId) {
      startedTopics.add(topicId)
      const topicCompleted = (completedPerTopic.get(topicId) ?? 0) + 1
      completedPerTopic.set(topicId, topicCompleted)

      if (startedTopics.size === 3) {
        record('topic_explorer', { earnedAt: at, lessonsCompletedAtAward: completedCount })
      }

      const topicTotal = topicLessonIds.get(topicId)?.size ?? 0
      if (topicTotal > 0 && topicCompleted === topicTotal && !finishedTopics.has(topicId)) {
        finishedTopics.add(topicId)
        record('topic_completer', {
          earnedAt: at,
          lessonsCompletedAtAward: completedCount,
          qualifyingTopicId: topicId,
        })
        if (finishedTopics.size === 3) {
          record('multi_topic_finisher', {
            earnedAt: at,
            lessonsCompletedAtAward: completedCount,
            qualifyingTopicId: topicId,
          })
        }
      }
    }

    // Whole curriculum -- guarded by lessons.length > 0 at the top, so an
    // empty curriculum can never reach this.
    if (completedIds.size === lessons.length) {
      record('curriculum_completer', { earnedAt: at, lessonsCompletedAtAward: completedCount })
    }
  })

  // Return in registry order so callers get a stable, intentional sequence.
  return ACHIEVEMENTS.map((definition) => qualified.get(definition.code)).filter(
    (entry): entry is QualifiedAchievement => entry !== undefined
  )
}

export interface AchievementProgress {
  /** Current value toward the requirement, e.g. lessons or topics completed. */
  current: number
  /** The requirement's target. */
  target: number
  /** Human-readable remaining requirement, or undefined when not applicable. */
  remainingLabel?: string
  /** Short "N of M ..." summary for locked badges. */
  progressLabel: string
}

/**
 * Progress toward a *locked* badge, computed from current curriculum data.
 * Only returned where it is genuinely calculable; callers omit the progress
 * line entirely rather than showing a misleading figure.
 */
export function calculateAchievementProgress(
  definition: AchievementDefinition,
  lessons: Lesson[],
  completedLessonIds: ReadonlySet<string>
): AchievementProgress | null {
  if (lessons.length === 0) return null

  const completedPublished = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length

  if (definition.lessonThreshold !== undefined) {
    const target = definition.lessonThreshold
    const current = Math.min(completedPublished, target)
    const remaining = Math.max(0, target - completedPublished)
    return {
      current,
      target,
      progressLabel: `${current} of ${target} lessons completed`,
      remainingLabel: remaining > 0 ? `${remaining} lesson${remaining === 1 ? '' : 's'} remaining` : undefined,
    }
  }

  const topicStats = TOPIC_FILTERS.map((topic) => {
    const topicLessons = lessons.filter((lesson) => topic.match(lesson))
    return {
      id: topic.id,
      label: topic.label,
      total: topicLessons.length,
      completed: topicLessons.filter((lesson) => completedLessonIds.has(lesson.id)).length,
    }
  }).filter((topic) => topic.total > 0)

  if (definition.code === 'topic_explorer') {
    const target = definition.topicThreshold ?? 3
    const started = topicStats.filter((topic) => topic.completed > 0).length
    const current = Math.min(started, target)
    const remaining = Math.max(0, target - started)
    return {
      current,
      target,
      progressLabel: `${current} of ${target} topics explored`,
      remainingLabel: remaining > 0 ? `${remaining} topic${remaining === 1 ? '' : 's'} remaining` : undefined,
    }
  }

  if (definition.code === 'topic_completer' || definition.code === 'multi_topic_finisher') {
    const target = definition.topicThreshold ?? 1
    const finished = topicStats.filter((topic) => topic.completed === topic.total).length
    const current = Math.min(finished, target)
    const remaining = Math.max(0, target - finished)

    // For the single-topic badge, point at the topic they are closest to
    // finishing -- deterministic: fewest lessons remaining, then registry
    // order, so ties never reorder between renders.
    let remainingLabel = remaining > 0 ? `${remaining} topic${remaining === 1 ? '' : 's'} remaining` : undefined
    if (definition.code === 'topic_completer' && finished === 0) {
      const closest = topicStats
        .filter((topic) => topic.completed < topic.total)
        .sort((a, b) => a.total - a.completed - (b.total - b.completed))[0]
      if (closest) {
        const left = closest.total - closest.completed
        remainingLabel = `Closest: ${closest.label}, ${left} lesson${left === 1 ? '' : 's'} remaining`
      }
    }

    return {
      current,
      target,
      progressLabel: `${current} of ${target} topic${target === 1 ? '' : 's'} completed`,
      remainingLabel,
    }
  }

  if (definition.code === 'curriculum_completer') {
    const target = lessons.length
    const remaining = Math.max(0, target - completedPublished)
    return {
      current: completedPublished,
      target,
      progressLabel: `${completedPublished} of ${target} lessons completed`,
      remainingLabel: remaining > 0 ? `${remaining} lesson${remaining === 1 ? '' : 's'} remaining` : undefined,
    }
  }

  return null
}
