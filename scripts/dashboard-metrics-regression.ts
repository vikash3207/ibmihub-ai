/**
 * Dashboard Learning Progress metric regression pass (PR #178).
 *
 * Covers the calculations behind every user-facing number on the
 * authenticated Dashboard, since those are trust-bearing claims about a
 * learner's own progress. Exercises lib/dashboard-metrics.ts's pure
 * functions directly with synthetic lesson/completion fixtures -- no
 * database, no session, no network.
 *
 * Run standalone via `tsx`, no test framework dependency, matching the
 * existing scripts/deep-dive-toc-regression.ts and rag-regression.ts style.
 *
 * Usage:
 *   npm run test:dashboard-metrics
 */

import type { Lesson } from '../lib/lessons'
import {
  calculateOverallProgress,
  calculateTopicProgress,
  summarizeTopics,
  selectContinueLesson,
} from '../lib/dashboard-metrics'
import { formatCompletionDate, parseAcceptLanguage } from '../lib/format-date'

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

/**
 * Minimal Lesson fixture. `track_id`/`tags` drive lib/topics.ts's real
 * TOPIC_FILTERS predicates, so topic grouping is exercised through the
 * genuine shared taxonomy rather than a stubbed one.
 */
function lesson(order: number, overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: `lesson-${order}`,
    slug: `lesson-${order}`,
    title: `Lesson ${order}`,
    short_description: `Description ${order}`,
    lesson_order: order,
    learning_path_id: 'ibm-i-fundamentals',
    status: 'Published',
    content_source_path: `content/lessons/lesson-${order}.md`,
    estimated_reading_time: 5,
    ai_tutor_starter_question: null,
    track_id: 'ibm-i-foundations',
    module_id: null,
    difficulty: null,
    depth: null,
    tags: null,
    prerequisites: null,
    related_lessons: null,
    persona_tags: null,
    ai_tutor_prompts: null,
    ...overrides,
  } as Lesson
}

// ---------------------------------------------------------------------------
section('1. Overall completion percentage')

{
  const lessons = [lesson(1), lesson(2), lesson(3), lesson(4)]

  const none = calculateOverallProgress(lessons, new Set())
  check('new learner: 0 of N, 0%', none.completedCount === 0 && none.percent === 0, JSON.stringify(none))
  check('new learner is not flagged curriculum-complete', none.isCurriculumComplete === false)

  const partial = calculateOverallProgress(lessons, new Set(['lesson-1']))
  check('1 of 4 is 25%', partial.completedCount === 1 && partial.percent === 25, JSON.stringify(partial))

  const all = calculateOverallProgress(lessons, new Set(['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4']))
  check('all complete is exactly 100%', all.percent === 100, `got ${all.percent}`)
  check('all complete sets isCurriculumComplete', all.isCurriculumComplete === true)

  const rounded = calculateOverallProgress([lesson(1), lesson(2), lesson(3)], new Set(['lesson-1']))
  check('percent is a whole number (1/3 -> 33)', rounded.percent === 33, `got ${rounded.percent}`)
}

// ---------------------------------------------------------------------------
section('2. Empty curriculum is handled safely')

{
  const empty = calculateOverallProgress([], new Set())
  check('no division by zero; 0%', empty.percent === 0, `got ${empty.percent}`)
  check('total is 0', empty.totalCount === 0)
  check('empty curriculum is NOT reported as complete', empty.isCurriculumComplete === false)
  check('no continue lesson for an empty curriculum', selectContinueLesson([], new Set()) === null)
  check('no topic rows for an empty curriculum', calculateTopicProgress([], new Set()).length === 0)
}

// ---------------------------------------------------------------------------
section('3. Unpublished / stale completion rows cannot inflate progress')

{
  // `lessons` is the currently published set. The completion set additionally
  // references ids that are no longer published -- these must be ignored.
  const lessons = [lesson(1), lesson(2)]
  const completed = new Set(['lesson-1', 'removed-lesson', 'unpublished-lesson'])

  const progress = calculateOverallProgress(lessons, completed)
  check('stale ids are not counted', progress.completedCount === 1, `got ${progress.completedCount}`)
  check('total reflects published lessons only', progress.totalCount === 2, `got ${progress.totalCount}`)
  check('percent uses published totals (1/2 = 50%)', progress.percent === 50, `got ${progress.percent}`)
  check(
    'a curriculum is not "complete" just because stale ids outnumber lessons',
    progress.isCurriculumComplete === false
  )
}

// ---------------------------------------------------------------------------
section('4. Duplicate completion ids are de-duplicated')

{
  const lessons = [lesson(1), lesson(2)]
  // A Set is what the Dashboard builds from completion rows; even if the
  // table ever yielded repeats, the same lesson cannot be counted twice.
  const withRepeats = new Set(['lesson-1', 'lesson-1', 'lesson-1'])

  const progress = calculateOverallProgress(lessons, withRepeats)
  check('repeated ids count once', progress.completedCount === 1, `got ${progress.completedCount}`)
  check('percent not inflated by repeats', progress.percent === 50, `got ${progress.percent}`)
}

// ---------------------------------------------------------------------------
section('5. Topic progress uses the real shared taxonomy')

{
  const lessons = [
    lesson(1, { track_id: 'ibm-i-foundations' }),
    lesson(2, { track_id: 'ibm-i-foundations' }),
    lesson(3, { track_id: 'clle' }),
  ]

  const topics = calculateTopicProgress(lessons, new Set(['lesson-1']))
  const foundations = topics.find((t) => t.id === 'foundations')
  const clle = topics.find((t) => t.id === 'clle')

  check('only topics with published lessons are listed', topics.length === 2, `got ${topics.length}`)
  check('foundations counts 1 of 2 (50%)', foundations?.completedCount === 1 && foundations?.percent === 50, JSON.stringify(foundations))
  check('foundations status is in-progress', foundations?.status === 'in-progress', foundations?.status)
  check('untouched topic reports 0%', clle?.percent === 0, JSON.stringify(clle))
  check('untouched topic status is not-started', clle?.status === 'not-started', clle?.status)

  const allDone = calculateTopicProgress(lessons, new Set(['lesson-1', 'lesson-2']))
  check(
    'fully completed topic reports completed status at 100%',
    allDone.find((t) => t.id === 'foundations')?.status === 'completed' &&
      allDone.find((t) => t.id === 'foundations')?.percent === 100
  )

  // Curriculum order, not alphabetical: 'foundations' precedes 'clle' in
  // TOPIC_FILTERS, but 'CLLE' would sort before 'Foundations' alphabetically.
  check('topics keep curriculum order, not alphabetical', topics[0].id === 'foundations', topics.map((t) => t.id).join(','))
}

// ---------------------------------------------------------------------------
section('6. Topic summary counts (started / completed)')

{
  const lessons = [
    lesson(1, { track_id: 'ibm-i-foundations' }),
    lesson(2, { track_id: 'ibm-i-foundations' }),
    lesson(3, { track_id: 'clle' }),
  ]

  const noneStarted = summarizeTopics(calculateTopicProgress(lessons, new Set()))
  check('no completions means 0 topics started', noneStarted.startedCount === 0)
  check('totalCount counts topics that have lessons', noneStarted.totalCount === 2, `got ${noneStarted.totalCount}`)

  const oneStarted = summarizeTopics(calculateTopicProgress(lessons, new Set(['lesson-1'])))
  check('one partial topic counts as started', oneStarted.startedCount === 1, `got ${oneStarted.startedCount}`)
  check('a partially done topic is not "completed"', oneStarted.completedCount === 0, `got ${oneStarted.completedCount}`)

  const oneComplete = summarizeTopics(calculateTopicProgress(lessons, new Set(['lesson-3'])))
  check('a fully done topic counts as completed', oneComplete.completedCount === 1, `got ${oneComplete.completedCount}`)
}

// ---------------------------------------------------------------------------
section('7. Continue Learning selection')

{
  const lessons = [lesson(1), lesson(2), lesson(3), lesson(4)]

  const fresh = selectContinueLesson(lessons, new Set())
  check('new learner gets the first lesson in canonical order', fresh?.id === 'lesson-1', fresh?.id)

  const noAnchor = selectContinueLesson(lessons, new Set(['lesson-1']))
  check('no timestamp anchor: earliest incomplete', noAnchor?.id === 'lesson-2', noAnchor?.id)

  const withAnchor = selectContinueLesson(lessons, new Set(['lesson-1', 'lesson-2']), 'lesson-2')
  check('anchored: next incomplete after most recent completion', withAnchor?.id === 'lesson-3', withAnchor?.id)

  // Learner finished later material first; everything after the anchor is
  // done, so an earlier gap must not be skipped forever.
  const gapBefore = selectContinueLesson(lessons, new Set(['lesson-2', 'lesson-3', 'lesson-4']), 'lesson-4')
  check('falls back to an earlier gap when nothing follows the anchor', gapBefore?.id === 'lesson-1', gapBefore?.id)

  // Anchor id no longer published -- must not crash or return a completed lesson.
  const staleAnchor = selectContinueLesson(lessons, new Set(['lesson-1']), 'no-longer-published')
  check('unknown anchor falls back to earliest incomplete', staleAnchor?.id === 'lesson-2', staleAnchor?.id)

  const done = selectContinueLesson(lessons, new Set(['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4']), 'lesson-4')
  check('fully complete curriculum recommends nothing (null)', done === null, String(done))
}

// ---------------------------------------------------------------------------
section('8. A completed lesson is never recommended as "next"')

{
  const lessons = [lesson(1), lesson(2), lesson(3)]
  const completed = new Set(['lesson-1', 'lesson-3'])

  for (const anchor of [null, 'lesson-1', 'lesson-3', 'unknown']) {
    const pick = selectContinueLesson(lessons, completed, anchor)
    check(
      `anchor=${anchor ?? 'none'} -> recommended lesson is incomplete`,
      pick !== null && !completed.has(pick.id),
      pick ? pick.id : 'null'
    )
  }
}

// ---------------------------------------------------------------------------
section('9. Recent-activity date formatting')

{
  check('plain header picks the first tag', parseAcceptLanguage('en-GB,en;q=0.9') === 'en-GB')
  check('q-weights are stripped', parseAcceptLanguage('de-DE;q=0.8') === 'de-DE')
  check('missing header falls back to en-US', parseAcceptLanguage(null) === 'en-US')
  check('empty header falls back to en-US', parseAcceptLanguage('') === 'en-US')
  check('wildcard falls back to en-US', parseAcceptLanguage('*') === 'en-US')
  check('malformed header cannot reach Intl', parseAcceptLanguage('not a locale!!') === 'en-US')

  const iso = '2026-08-11T14:30:00.000Z'
  const formatted = formatCompletionDate(iso, 'en-US')
  check('a valid timestamp formats to a date', /2026/.test(formatted) && formatted !== iso, formatted)
  check('no time-of-day is shown', !/\d{1,2}:\d{2}/.test(formatted), formatted)
  check(
    'an unparseable timestamp degrades to its date slice, not "Invalid Date"',
    formatCompletionDate('nonsense', 'en-US') === 'nonsense'.slice(0, 10)
  )
  check('an invalid locale still formats rather than throwing', formatCompletionDate(iso, 'zz-ZZ-ZZ').length > 0)
}

// ---------------------------------------------------------------------------

console.log('\n' + '-'.repeat(60))
if (failures > 0) {
  console.error(`Dashboard metrics regression: ${passed} passed, ${failures} failed.`)
  process.exit(1)
}
console.log(`Dashboard metrics regression: ${passed} passed, 0 failed.`)
console.log('Dashboard metrics regression passed.')
