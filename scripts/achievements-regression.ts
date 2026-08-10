/**
 * Achievement badge regression pass (PR #179).
 *
 * Covers the eligibility rules behind every badge, since an award is a
 * durable claim about a learner's history. Exercises lib/achievements.ts's
 * pure functions with synthetic lesson/completion fixtures -- no database,
 * no session, no network.
 *
 * The security and persistence guarantees (no client insert grant,
 * unique(user_id, badge_code), service-role-only writes) are enforced by
 * supabase/migrations/007_user_achievements.sql and asserted against the
 * migration text at the end of this file, since they cannot be exercised
 * without a live database.
 *
 * Usage:
 *   npm run test:achievements
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import type { Lesson } from '../lib/lessons'
import { ACHIEVEMENTS, evaluateAchievements, calculateAchievementProgress, type CompletionInput } from '../lib/achievements'

let failures = 0
let passed = 0

function check(description: string, condition: boolean, detail?: string) {
  if (condition) {
    passed += 1
    console.log(`  OK    ${description}`)
  } else {
    failures += 1
    console.error(`  FAIL  ${description}${detail ? ` -- ${detail}` : ''}`)
  }
}

function section(title: string) {
  console.log(`\n${title}`)
}

/** track_id/tags drive the real lib/topics.ts predicates, not a stub. */
function lesson(n: number, trackId = 'ibm-i-foundations', tags: string[] | null = null): Lesson {
  return {
    id: `l${n}`,
    slug: `l${n}`,
    title: `Lesson ${n}`,
    short_description: '',
    lesson_order: n,
    learning_path_id: 'ibm-i-fundamentals',
    status: 'Published',
    content_source_path: '',
    estimated_reading_time: 5,
    ai_tutor_starter_question: null,
    track_id: trackId,
    module_id: null,
    difficulty: null,
    depth: null,
    tags,
    prerequisites: null,
    related_lessons: null,
    persona_tags: null,
    ai_tutor_prompts: null,
  } as Lesson
}

/** Completions in ascending time, one day apart, for the given lesson ids. */
function completions(ids: string[]): CompletionInput[] {
  return ids.map((lessonId, i) => ({
    lessonId,
    completedAt: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
  }))
}

const codesOf = (result: { code: string }[]) => result.map((r) => r.code)

// ---------------------------------------------------------------------------
section('1. Lesson-count milestones and their boundaries')

{
  const lessons = Array.from({ length: 120 }, (_, i) => lesson(i + 1))
  const ids = lessons.map((l) => l.id)
  const milestones = [1, 5, 10, 25, 50, 100]
  const codeFor: Record<number, string> = {
    1: 'first_step',
    5: 'learning_momentum',
    10: 'committed_learner',
    25: 'dedicated_learner',
    50: 'half_century',
    100: 'century_learner',
  }

  for (const threshold of milestones) {
    const below = codesOf(evaluateAchievements(lessons, completions(ids.slice(0, threshold - 1))))
    const at = codesOf(evaluateAchievements(lessons, completions(ids.slice(0, threshold))))
    check(`${threshold - 1} lessons: ${codeFor[threshold]} NOT awarded`, !below.includes(codeFor[threshold]))
    check(`${threshold} lessons: ${codeFor[threshold]} awarded`, at.includes(codeFor[threshold]))
  }

  // Each milestone fires exactly once, on the crossing completion.
  const at5 = evaluateAchievements(lessons, completions(ids.slice(0, 5)))
  const momentum = at5.find((a) => a.code === 'learning_momentum')
  check('milestone count == threshold at award time', momentum?.lessonsCompletedAtAward === 5, String(momentum?.lessonsCompletedAtAward))
  check(
    'earned date is the crossing completion, not "now"',
    momentum?.earnedAt === new Date(Date.UTC(2026, 0, 5)).toISOString(),
    momentum?.earnedAt
  )
  check('a milestone appears at most once', at5.filter((a) => a.code === 'learning_momentum').length === 1)
}

// ---------------------------------------------------------------------------
section('2. Duplicate completion rows cannot inflate eligibility')

{
  const lessons = [lesson(1), lesson(2), lesson(3), lesson(4), lesson(5)]
  // Same lesson recorded five times.
  const dupes: CompletionInput[] = Array.from({ length: 5 }, (_, i) => ({
    lessonId: 'l1',
    completedAt: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
  }))

  const result = codesOf(evaluateAchievements(lessons, dupes))
  check('five duplicates of one lesson award only first_step', result.includes('first_step'))
  check('five duplicates do NOT award learning_momentum', !result.includes('learning_momentum'), result.join(','))
}

// ---------------------------------------------------------------------------
section('3. Unpublished / deleted lessons are ignored')

{
  const lessons = [lesson(1), lesson(2)]
  const withStale = completions(['l1', 'gone-1', 'gone-2', 'gone-3', 'gone-4'])

  const result = codesOf(evaluateAchievements(lessons, withStale))
  check('stale ids do not count toward milestones', !result.includes('learning_momentum'), result.join(','))
  check('the one published completion still awards first_step', result.includes('first_step'))
  check('stale ids cannot complete the curriculum', !result.includes('curriculum_completer'))
}

// ---------------------------------------------------------------------------
section('4. Topic Explorer')

{
  // Three distinct topics: foundations, clle, printer-files.
  const lessons = [
    lesson(1, 'ibm-i-foundations'),
    lesson(2, 'ibm-i-foundations'),
    lesson(3, 'clle'),
    lesson(4, 'printer-files-and-reports'),
  ]

  const oneTopic = codesOf(evaluateAchievements(lessons, completions(['l1', 'l2'])))
  check('two lessons in ONE topic is not exploration', !oneTopic.includes('topic_explorer'), oneTopic.join(','))

  const twoTopics = codesOf(evaluateAchievements(lessons, completions(['l1', 'l3'])))
  check('two distinct topics is not yet enough', !twoTopics.includes('topic_explorer'))

  const threeTopics = codesOf(evaluateAchievements(lessons, completions(['l1', 'l3', 'l4'])))
  check('three distinct topics awards topic_explorer', threeTopics.includes('topic_explorer'))
}

// ---------------------------------------------------------------------------
section('5. Topic Completer and Multi-Topic Finisher')

{
  const lessons = [
    lesson(1, 'ibm-i-foundations'),
    lesson(2, 'ibm-i-foundations'),
    lesson(3, 'clle'),
    lesson(4, 'printer-files-and-reports'),
    lesson(5, 'debugging-and-job-logs'),
  ]

  const partial = codesOf(evaluateAchievements(lessons, completions(['l1'])))
  check('partially finishing a topic does not award topic_completer', !partial.includes('topic_completer'))

  const oneDone = evaluateAchievements(lessons, completions(['l1', 'l2']))
  check('finishing every lesson in one topic awards topic_completer', codesOf(oneDone).includes('topic_completer'))
  check(
    'the qualifying topic is recorded',
    oneDone.find((a) => a.code === 'topic_completer')?.qualifyingTopicId === 'foundations',
    oneDone.find((a) => a.code === 'topic_completer')?.qualifyingTopicId
  )

  const twoDone = codesOf(evaluateAchievements(lessons, completions(['l1', 'l2', 'l3'])))
  check('two completed topics is not yet multi_topic_finisher', !twoDone.includes('multi_topic_finisher'))

  const threeDone = codesOf(evaluateAchievements(lessons, completions(['l1', 'l2', 'l3', 'l4'])))
  check('three completed topics awards multi_topic_finisher', threeDone.includes('multi_topic_finisher'))
  check('topic_completer still appears exactly once', threeDone.filter((c) => c === 'topic_completer').length === 1)
}

// ---------------------------------------------------------------------------
section('6. Curriculum Completer, including the empty-curriculum guard')

{
  const lessons = [lesson(1), lesson(2), lesson(3)]

  const partial = codesOf(evaluateAchievements(lessons, completions(['l1', 'l2'])))
  check('partial curriculum does not award curriculum_completer', !partial.includes('curriculum_completer'))

  const full = codesOf(evaluateAchievements(lessons, completions(['l1', 'l2', 'l3'])))
  check('completing every published lesson awards curriculum_completer', full.includes('curriculum_completer'))

  check('empty curriculum awards nothing at all', evaluateAchievements([], completions([])).length === 0)
  check(
    'empty curriculum never awards curriculum_completer even with stale completions',
    !codesOf(evaluateAchievements([], completions(['ghost']))).includes('curriculum_completer')
  )
}

// ---------------------------------------------------------------------------
section('7. Permanence: evaluation is additive, never revoking')

{
  // A learner finished the whole 2-lesson curriculum...
  const before = [lesson(1), lesson(2)]
  const earned = codesOf(evaluateAchievements(before, completions(['l1', 'l2'])))
  check('curriculum_completer earned on the original curriculum', earned.includes('curriculum_completer'))

  // ...then a third lesson was published. Current eligibility drops, which is
  // correct for *locked-badge progress*, but the stored award is never
  // deleted -- lib/achievements-server.ts only ever inserts.
  const after = [lesson(1), lesson(2), lesson(3)]
  const reEvaluated = codesOf(evaluateAchievements(after, completions(['l1', 'l2'])))
  check(
    'after curriculum growth the badge is simply not re-derived (not revoked)',
    !reEvaluated.includes('curriculum_completer')
  )
  check('previously earned milestones still re-derive', reEvaluated.includes('first_step'))
}

// ---------------------------------------------------------------------------
section('8. Idempotency of evaluation')

{
  const lessons = [lesson(1), lesson(2), lesson(3), lesson(4), lesson(5)]
  const input = completions(['l1', 'l2', 'l3', 'l4', 'l5'])

  const first = evaluateAchievements(lessons, input)
  const second = evaluateAchievements(lessons, input)
  check('repeated evaluation returns identical codes', JSON.stringify(codesOf(first)) === JSON.stringify(codesOf(second)))
  check('repeated evaluation returns identical timestamps', JSON.stringify(first) === JSON.stringify(second))
  check('no duplicate codes within one result', new Set(codesOf(first)).size === first.length)

  // Out-of-order input must not change the outcome: the evaluator sorts.
  const shuffled = [...input].reverse()
  check(
    'input ordering does not affect the result',
    JSON.stringify(evaluateAchievements(lessons, shuffled)) === JSON.stringify(first)
  )
}

// ---------------------------------------------------------------------------
section('9. Result ordering is the stable registry order')

{
  const lessons = Array.from({ length: 30 }, (_, i) => lesson(i + 1))
  const result = codesOf(evaluateAchievements(lessons, completions(lessons.map((l) => l.id))))
  const registryOrder = ACHIEVEMENTS.map((a) => a.code).filter((c) => result.includes(c))
  check('awards are returned in registry order', JSON.stringify(result) === JSON.stringify(registryOrder), result.join(','))
}

// ---------------------------------------------------------------------------
section('10. Locked-badge progress')

{
  const lessons = Array.from({ length: 20 }, (_, i) => lesson(i + 1))
  const completed = new Set(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'])

  const committed = ACHIEVEMENTS.find((a) => a.code === 'committed_learner')!
  const p = calculateAchievementProgress(committed, lessons, completed)
  check('milestone progress reads "7 of 10 lessons completed"', p?.progressLabel === '7 of 10 lessons completed', p?.progressLabel)
  check('milestone remaining reads "3 lessons remaining"', p?.remainingLabel === '3 lessons remaining', p?.remainingLabel)

  const explorer = ACHIEVEMENTS.find((a) => a.code === 'topic_explorer')!
  const ep = calculateAchievementProgress(explorer, lessons, completed)
  check('topic progress is expressed in topics, not lessons', ep?.progressLabel.includes('topics explored') === true, ep?.progressLabel)

  const curriculum = ACHIEVEMENTS.find((a) => a.code === 'curriculum_completer')!
  const cp = calculateAchievementProgress(curriculum, lessons, completed)
  check('curriculum progress uses the dynamic published total', cp?.target === 20, String(cp?.target))
  check('progress is null for an empty curriculum', calculateAchievementProgress(committed, [], new Set()) === null)

  // Singular/plural correctness -- user-facing copy.
  const oneLeft = calculateAchievementProgress(committed, lessons, new Set(['l1','l2','l3','l4','l5','l6','l7','l8','l9']))
  check('singular "1 lesson remaining"', oneLeft?.remainingLabel === '1 lesson remaining', oneLeft?.remainingLabel)
}

// ---------------------------------------------------------------------------
section('11. Registry integrity')

{
  const codes = ACHIEVEMENTS.map((a) => a.code)
  check('badge codes are unique', new Set(codes).size === codes.length)
  check('all 10 specified badges exist', codes.length === 10, `got ${codes.length}`)
  check(
    'codes are stable snake_case identifiers',
    codes.every((c) => /^[a-z][a-z0-9_]*$/.test(c)),
    codes.join(',')
  )
  check(
    'no badge implies certification, mastery, or IBM endorsement',
    !ACHIEVEMENTS.some((a) =>
      /certif|master|expert|ibm[- ]certified|credential/i.test(`${a.name} ${a.description} ${a.condition}`)
    )
  )
  check(
    'ordering is milestones, then topic, then curriculum',
    JSON.stringify(ACHIEVEMENTS.map((a) => a.category)) ===
      JSON.stringify([
        ...Array(6).fill('lesson-milestone'),
        ...Array(3).fill('topic'),
        'curriculum',
      ])
  )
}

// ---------------------------------------------------------------------------
section('12. Migration enforces the security + idempotency guarantees')

{
  const sql = readFileSync(join(process.cwd(), 'supabase', 'migrations', '007_user_achievements.sql'), 'utf8')
  const normalized = sql.toLowerCase()

  check('unique (user_id, badge_code) constraint exists', /unique\s*\(\s*user_id\s*,\s*badge_code\s*\)/.test(normalized))
  check('row level security is enabled', /enable row level security/.test(normalized))
  check('a select policy scopes rows to auth.uid()', /for select[\s\S]*auth\.uid\(\)\s*=\s*user_id/.test(normalized))

  // The anti-forgery guarantee: authenticated clients get SELECT only.
  const authenticatedGrant = normalized.match(/grant\s+([a-z, ]+)\s+on\s+public\.user_achievements\s+to\s+authenticated/)
  check('authenticated is granted SELECT only', authenticatedGrant?.[1].trim() === 'select', authenticatedGrant?.[1])
  check(
    'no insert/update/delete policy is defined for clients',
    !/for\s+(insert|update|delete)/.test(normalized),
    'a client write policy would allow forging a badge_code'
  )
  check('no delete grant anywhere (awards are permanent)', !/grant[^;]*delete[^;]*user_achievements/.test(normalized))
}

// ---------------------------------------------------------------------------

console.log('\n' + '-'.repeat(60))
if (failures > 0) {
  console.error(`Achievements regression: ${passed} passed, ${failures} failed.`)
  process.exit(1)
}
console.log(`Achievements regression: ${passed} passed, 0 failed.`)
console.log('Achievements regression passed.')
