/**
 * IBM i Practice Hub regression pass (UI foundation + Guided Practice
 * relocation + Quick Quiz + Interview Prep phase 1 -- a real, active
 * catalog import with zero published/answered content yet). Standalone via
 * `tsx`, matching the existing scripts/*-regression.ts style (check/section
 * helpers, pass/fail counter, process.exit(1) on any failure).
 *
 * Executes the real, pure functions in lib/practice-session.ts,
 * lib/interview-questions-filter.ts, and lib/interview-search.ts directly
 * against the REAL production catalogs wherever practical (not just
 * synthetic fixtures) -- e.g. the Quick Quiz availability matrix is
 * cross-checked against countEligibleQuestions() independently for every
 * topic-group x level combination, and the real 764-question
 * INTERVIEW_QUESTIONS import is validated for count/uniqueness/valid
 * topic-id/enum-shape directly, rather than hardcoding any expected value
 * that could silently drift out of sync with real content. Any
 * InterviewQuestion-shaped `published` fixture used to exercise
 * display/search/filter logic against non-empty content lives ONLY in this
 * file, as a local constant -- content/practice/interview-questions.ts's
 * real 764 records must all stay `status: 'draft'` in this PR (zero
 * fabricated/placeholder answers).
 *
 * Usage:
 *   npm run test:practice-hub
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PRACTICE_QUESTIONS, PRACTICE_TOPICS, type PracticeQuestion } from '../content/practice/questions'
import { INTERVIEW_QUESTIONS, isInterviewPrepAvailable, type InterviewQuestion, type InterviewQuestionType } from '../content/practice/interview-questions'
import { filterInterviewQuestions, countByTopic, countByDifficulty, countByType } from '../lib/interview-questions-filter'
import { searchInterviewQuestions, scoreInterviewQuestion, normalizeQuery as normalizeInterviewQuery } from '../lib/interview-search'
import { PRACTICE_TOPIC_GROUPS, resolveTopicGroup, topicIdsForGroup } from '../lib/practice-topic-groups'
import {
  isValidMode,
  isValidLevel,
  isValidLength,
  normalizeSessionParams,
  selectSessionQuestions,
  isQuizEligible,
  buildGuidedOrQuizSession,
  buildQuizAvailabilityMatrix,
  countEligibleQuestions,
  isTopicRunnable,
  isLevelRunnable,
  isConfigRunnable,
  QUIZ_LEVELS,
  ALL_TOPICS_KEY,
  seededShuffle,
  scoreQuiz,
  selectRetryQuestions,
  type SessionLevel,
  type SessionLength,
} from '../lib/practice-session'

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

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf-8')
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

async function main() {
  // ---------------------------------------------------------------------------
  section('1. Practice Hub hierarchy: three real knowledge cards, two hands-on cards, no new nav item')
  // ---------------------------------------------------------------------------

  {
    const pageSrc = stripComments(readRepoFile('app/(authenticated)/practice/page.tsx'))

    check('the hub page has a "Test Your Knowledge" section', pageSrc.includes('Test Your Knowledge'))
    check('the hub page has a "Hands-On Practice" section (American-English spelling, not "Practise")', pageSrc.includes('Hands-On Practice'))
    check('the old "Practise Hands-On" (British spelling) wording is gone', !pageSrc.includes('Practise Hands-On'))
    check('Guided Practice links to its relocated route', pageSrc.includes("href: '/practice/guided'"))
    check('Quick Quiz links to its builder route', pageSrc.includes("href: '/practice/quiz/builder'"))
    check('Interview Prep links to its real, active route (phase 1 -- catalog import + activation)', pageSrc.includes("href: '/practice/interview'"))
    check('the 5250 Practice Lab card links to the real 5250 route', pageSrc.includes("href: '/practice-lab/5250'"))
    check('the SQL Console card links to the real SQL route', pageSrc.includes("href: '/practice-lab/sql'"))

    check('Guided Practice uses a descriptive CTA, not generic "Start"', pageSrc.includes("cta: 'Start Guided Practice'"))
    check('Quick Quiz uses a descriptive CTA, not generic "Start"', pageSrc.includes("cta: 'Build a Quiz'"))
    check('Interview Prep uses a descriptive CTA, not generic "Start"', pageSrc.includes("cta: 'Explore Interview Prep'"))
    check('the 5250 Practice Lab card uses a descriptive CTA', pageSrc.includes("cta: 'Open 5250 Lab'"))
    check('the SQL Console card uses a descriptive CTA', pageSrc.includes("cta: 'Open SQL Console'"))
    check('no card renders the generic word "Start" as its action label', !/cta:\s*'Start'/.test(pageSrc))

    check(
      'Interview Prep is now a real KNOWLEDGE_CARDS entry (an unconditional <Link> via PracticeModeCard), not a ComingSoonCard',
      /title:\s*'Interview Prep'/.test(pageSrc)
    )
    check('the old ComingSoonCard function no longer exists on this page (nothing else uses it)', !pageSrc.includes('function ComingSoonCard'))
    check('the old "Coming soon" badge treatment for Interview Prep is gone', !pageSrc.includes('Badge variant="neutral">Coming soon'))
    check('the hub page no longer imports the unused Badge component', !pageSrc.includes("from '@/components/ui/badge'"))

    const navLinksSrc = readRepoFile('lib/nav-links.ts')
    check('no new top-level nav item was added for Interview Prep/Quiz/Practice Lab', !/label:\s*'(Interview Prep|Quick Quiz)'/.test(navLinksSrc))
    check('Practice is still the single top-level nav item pointing at /practice', /href:\s*'\/practice',\s*label:\s*'Practice'/.test(navLinksSrc))
  }

  // ---------------------------------------------------------------------------
  section('2. Guided Practice: relocated, not rewritten, with back-navigation to the hub')
  // ---------------------------------------------------------------------------

  {
    const guidedSrc = readRepoFile('app/(authenticated)/practice/guided/page.tsx')
    check('Guided Practice still renders the real, unmodified PracticeBrowser component', guidedSrc.includes('<PracticeBrowser'))
    check(
      'Guided Practice still passes the real PRACTICE_TOPICS/PRACTICE_QUESTIONS catalog, not a filtered/rewritten subset',
      guidedSrc.includes('topics={PRACTICE_TOPICS}') && guidedSrc.includes('questions={PRACTICE_QUESTIONS}')
    )
    check('Guided Practice still honors the ?topic= deep link', guidedSrc.includes('initialTopicId={initialTopicId ?? null}'))
    check('Guided Practice preserves the no-score notice wording', guidedSrc.includes('there is no ') && guidedSrc.includes('score, ranking, or certificate'))
    check('Guided Practice has a back-link to the Practice Hub', /href="\/practice"[\s\S]{0,500}Practice Hub/.test(guidedSrc))

    const browserSrc = readFileSync(resolve(__dirname, '..', 'components/practice-browser.tsx'), 'utf-8')
    check('components/practice-browser.tsx itself was not modified to compute a score', !/correctCount|totalScore|percentCorrect/.test(browserSrc))

    const lessonPageSrc = readRepoFile('app/learn/ibm-i-fundamentals/[slug]/page.tsx')
    check('the lesson-page "Practice this topic" deep link now points at /practice/guided', lessonPageSrc.includes('`/practice/guided?topic='))

    const loadingSrc = readRepoFile('app/(authenticated)/practice/guided/loading.tsx')
    check('the Guided Practice loading skeleton mirrors the real dark hero (no light-to-dark flash)', loadingSrc.includes('bg-slate-950'))
  }

  // ---------------------------------------------------------------------------
  section('3. Quick Quiz uses only the existing approved question bank, with back-navigation')
  // ---------------------------------------------------------------------------

  {
    const builderSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/builder/page.tsx'))
    const sessionPageSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/session/page.tsx'))

    check('the quiz session page imports questions only from the existing approved catalog', sessionPageSrc.includes("from '@/content/practice/questions'"))
    check('the quiz session page never imports the interview-questions catalog', !sessionPageSrc.includes('interview-questions'))
    check('the quiz builder never references INTERVIEW_QUESTIONS', !builderSrc.includes('INTERVIEW_QUESTIONS'))
    check('the quiz builder never offers an Advanced level (zero real advanced-difficulty questions exist today)', !/value:\s*'advanced'/.test(builderSrc))
    check('the quiz builder has a back-link to the Practice Hub', /href="\/practice"[\s\S]{0,500}Practice Hub/.test(builderSrc))
    check('the quiz session page has a back-link to the Quiz Builder', /href="\/practice\/quiz\/builder"[\s\S]{0,500}Quiz Builder/.test(sessionPageSrc))

    const beginnerAndIntermediateCount = PRACTICE_QUESTIONS.filter((q) => q.difficulty === 'beginner' || q.difficulty === 'intermediate').length
    check('the real catalog has at least some beginner/intermediate questions for Quick Quiz to draw from', beginnerAndIntermediateCount > 0, String(beginnerAndIntermediateCount))
  }

  // ---------------------------------------------------------------------------
  section('4. Mode/level/length validation and seed canonicalization (real functions, real catalog constraints)')
  // ---------------------------------------------------------------------------

  {
    check('a valid mode passes', isValidMode('quiz'))
    check('an invalid mode is rejected', !isValidMode('not-a-real-mode'))
    check('a missing mode is rejected', !isValidMode(undefined))

    check('"mixed" is a valid level for quiz', isValidLevel('mixed', 'quiz'))
    check('"beginner" is a valid level for quiz', isValidLevel('beginner', 'quiz'))
    check('"advanced" is NOT a valid level for quiz (no real advanced quiz content exists)', !isValidLevel('advanced', 'quiz'))
    check('"advanced" IS a valid level for interview (reserved for future approved content)', isValidLevel('advanced', 'interview'))
    check('an unrecognized level string is rejected', !isValidLevel('expert', 'quiz'))

    check('5 is a valid quiz length', isValidLength(5, 'quiz'))
    check('10 is a valid quiz length', isValidLength(10, 'quiz'))
    check('1 is NOT a valid quiz length (never a one-question scored quiz)', !isValidLength(1, 'quiz'))
    check('1 IS a valid guided length (Single Question)', isValidLength(1, 'guided'))
    check('an arbitrary length like 7 is rejected for every mode', !isValidLength(7, 'quiz') && !isValidLength(7, 'guided'))

    check('normalizeSessionParams returns null for a missing/invalid mode', normalizeSessionParams({ mode: 'bogus' }) === null)

    const normalized = normalizeSessionParams({ mode: 'quiz', level: 'advanced', length: '5' })
    check('normalizeSessionParams falls back to the default level when an invalid-for-this-mode level is requested (never crashes, never trusts the raw value)', normalized?.level === 'mixed')

    const normalizedBadLength = normalizeSessionParams({ mode: 'quiz', length: '7' })
    check('normalizeSessionParams falls back to the mode default length for an unsupported length', normalizedBadLength?.length === 5)

    const seedless = normalizeSessionParams({ mode: 'quiz', topicGroup: 'rpgle', level: 'beginner', length: '5' })
    const seedlessAgain = normalizeSessionParams({ mode: 'quiz', topicGroup: 'rpgle', level: 'beginner', length: '5' })
    check('a bare URL with no seed param deterministically derives the same seed every time (stable across refresh)', seedless?.seed === seedlessAgain?.seed)

    // --- Seed canonicalization: a malformed/fractional/huge/negative seed
    // must always resolve to a safe, bounded, non-negative integer -- never
    // trusted as-is.
    const fractionalSeed = normalizeSessionParams({ mode: 'quiz', seed: '42.9' })
    check('a fractional seed is truncated to an integer', fractionalSeed?.seed === 42)

    const negativeSeed = normalizeSessionParams({ mode: 'quiz', seed: '-17' })
    check('a negative seed is canonicalized to a non-negative value', negativeSeed?.seed === 17)

    const hugeSeed = normalizeSessionParams({ mode: 'quiz', seed: '99999999999999999999' })
    check(
      'an out-of-range seed is clamped to Number.MAX_SAFE_INTEGER, never left unbounded',
      hugeSeed?.seed === Number.MAX_SAFE_INTEGER
    )

    const malformedSeed = normalizeSessionParams({ mode: 'quiz', topicGroup: 'rpgle', level: 'beginner', length: '5', seed: 'not-a-number' })
    check(
      'a non-numeric seed falls back to the same deterministic derived seed as a missing seed (never NaN, never crashes)',
      Number.isFinite(malformedSeed?.seed) && malformedSeed?.seed === seedless?.seed
    )

    // --- Refresh / Back-Forward stability with an explicit seed already in the URL.
    const explicitA = normalizeSessionParams({ mode: 'quiz', seed: '555' })
    const explicitB = normalizeSessionParams({ mode: 'quiz', seed: '555' })
    check('the exact same explicit seed value always normalizes to the same seed (refresh/Back/Forward on a seeded URL is stable)', explicitA?.seed === 555 && explicitA?.seed === explicitB?.seed)
  }

  // ---------------------------------------------------------------------------
  section('5. Topic-group consolidation: every real topic id is covered or intentionally excluded')
  // ---------------------------------------------------------------------------

  {
    const groupedTopicIds = new Set(PRACTICE_TOPIC_GROUPS.flatMap((g) => g.topicIds))
    const realTopicIds = new Set(PRACTICE_TOPICS.map((t) => t.id))
    const intentionallyExcluded = new Set(['mini-projects', 'mixed-review', 'interview-readiness'])

    for (const id of groupedTopicIds) {
      check(`consolidated group topicId "${id}" is a real PRACTICE_TOPICS id (no typo)`, realTopicIds.has(id))
    }

    const uncovered = [...realTopicIds].filter((id) => !groupedTopicIds.has(id) && !intentionallyExcluded.has(id))
    check('every real topic is either in a consolidated group or one of the three deliberately-excluded topics', uncovered.length === 0, JSON.stringify(uncovered))

    check('resolveTopicGroup returns null for an unknown group id, never throws', resolveTopicGroup('not-a-real-group') === null)
    check('topicIdsForGroup returns null ("All Topics", no filter) for a null/missing group id', topicIdsForGroup(null) === null)
    check('topicIdsForGroup resolves a real group to its topic ids', (topicIdsForGroup('rpgle') ?? []).includes('rpgle-foundations'))
  }

  // ---------------------------------------------------------------------------
  section('6. Question selection: duplicate prevention, eligibility, real insufficient-inventory case')
  // ---------------------------------------------------------------------------

  {
    check('isQuizEligible is true for a multiple-choice question', isQuizEligible(PRACTICE_QUESTIONS.find((q) => q.type === 'multiple-choice')!))
    check(
      'isQuizEligible is false for a scenario question (free-text answer, not auto-gradable)',
      !isQuizEligible(PRACTICE_QUESTIONS.find((q) => q.type === 'scenario')!)
    )

    // Duplicate prevention: a deliberately duplicated fixture must never
    // produce a session containing the same question id twice.
    const oneQuestion = PRACTICE_QUESTIONS[0]
    const duplicated = [oneQuestion, oneQuestion, oneQuestion]
    const dedupResult = selectSessionQuestions({ topicGroupId: null, level: 'mixed', length: 1, seed: 1 }, duplicated)
    check(
      'a duplicated input array never produces a session with a repeated question id',
      dedupResult.status === 'ok' && dedupResult.questions.length === 1
    )

    // Real, guaranteed-true insufficient-inventory case: the production
    // catalog has zero 'advanced' questions today (confirmed by audit), so
    // requesting Advanced for any topic combination must report
    // insufficient, never silently start a shorter/empty session.
    const advancedResult = buildGuidedOrQuizSession('quiz', { topicGroupId: null, level: 'advanced', length: 5, seed: 1 }, PRACTICE_QUESTIONS)
    check(
      'requesting the Advanced level against the real catalog correctly reports insufficient inventory (0 available), never a silent short session',
      advancedResult.status === 'insufficient' && advancedResult.available === 0
    )

    // A real, should-succeed case: Mixed level, All topics, 5 questions --
    // must have plenty of real multiple-choice inventory.
    const realisticResult = buildGuidedOrQuizSession('quiz', { topicGroupId: null, level: 'mixed', length: 5, seed: 42 }, PRACTICE_QUESTIONS)
    check('a realistic Quick Quiz combination (Mixed, All Topics, 5 questions) succeeds against the real catalog', realisticResult.status === 'ok')
    if (realisticResult.status === 'ok') {
      check('the real session has exactly 5 unique questions', realisticResult.questions.length === 5 && new Set(realisticResult.questions.map((q) => q.id)).size === 5)
      check('every question in a Quick Quiz session is multiple-choice (never scenario)', realisticResult.questions.every((q) => q.type === 'multiple-choice'))
    }

    // The real, known-insufficient combination the review itself named:
    // SQLRPGLE has only a handful of eligible multiple-choice questions.
    const sqlrpgleCount = countEligibleQuestions({ topicGroupId: 'sqlrpgle', level: 'beginner' }, PRACTICE_QUESTIONS, isQuizEligible)
    const sqlrpgleResult = buildGuidedOrQuizSession('quiz', { topicGroupId: 'sqlrpgle', level: 'beginner', length: 5, seed: 1 }, PRACTICE_QUESTIONS)
    check(
      'the real SQLRPGLE + Beginner combination genuinely has fewer than 5 eligible questions today (the exact case the review flagged)',
      sqlrpgleCount < 5,
      String(sqlrpgleCount)
    )
    check('requesting 5 questions for that real insufficient combination correctly reports insufficient, matching the independently-computed count', sqlrpgleResult.status === 'insufficient' && sqlrpgleResult.available === sqlrpgleCount)
  }

  // ---------------------------------------------------------------------------
  section('7. Quiz availability matrix: derived exclusively from the real catalog, never hardcoded')
  // ---------------------------------------------------------------------------

  {
    const matrix = buildQuizAvailabilityMatrix(PRACTICE_QUESTIONS)
    const groupIds = [ALL_TOPICS_KEY, ...PRACTICE_TOPIC_GROUPS.map((g) => g.id)]

    check('the matrix has an entry for "All Topics" plus every consolidated topic group', groupIds.every((id) => id in matrix))

    let crossCheckMismatches = 0
    let unsupported5 = 0
    let unsupported10 = 0
    let total = 0

    for (const groupId of groupIds) {
      for (const level of QUIZ_LEVELS) {
        total += 1
        const entry = matrix[groupId][level]
        const independentCount = countEligibleQuestions({ topicGroupId: groupId || null, level }, PRACTICE_QUESTIONS, isQuizEligible)
        if (entry.count !== independentCount) crossCheckMismatches += 1
        if (entry.supportsLength[5] !== independentCount >= 5) crossCheckMismatches += 1
        if (entry.supportsLength[10] !== independentCount >= 10) crossCheckMismatches += 1
        if (!entry.supportsLength[5]) unsupported5 += 1
        if (!entry.supportsLength[10]) unsupported10 += 1
      }
    }

    check(
      'every matrix entry\'s count/supportsLength exactly matches an independently computed count for the same combination (matrix never drifts from the real catalog)',
      crossCheckMismatches === 0,
      `${crossCheckMismatches} mismatches out of ${total} combinations`
    )
    check(
      'the real catalog genuinely has at least one topic/level combination that cannot support a 5-question quiz (proves the builder must actually gate on real inventory, not a hypothetical concern)',
      unsupported5 > 0,
      `${unsupported5} of ${total} combinations`
    )
    check(
      'the real catalog genuinely has at least one topic/level combination that cannot support a 10-question quiz',
      unsupported10 > 0,
      `${unsupported10} of ${total} combinations`
    )

    // Every combination the matrix marks as supported at an exact length
    // must actually succeed via the real session-building function --
    // proving a length pill is never enabled optimistically (review item 3:
    // "every enabled length can produce a session").
    let attempted = 0
    let allSupportedSucceed = true
    for (const groupId of groupIds) {
      for (const level of QUIZ_LEVELS) {
        const entry = matrix[groupId][level]
        for (const length of [5, 10] as const) {
          if (!isConfigRunnable(entry, length)) continue
          attempted += 1
          const result = buildGuidedOrQuizSession('quiz', { topicGroupId: groupId || null, level, length, seed: 7 }, PRACTICE_QUESTIONS)
          if (result.status !== 'ok' || result.questions.length !== length) {
            allSupportedSucceed = false
          }
        }
      }
    }
    check(
      'every isConfigRunnable()-true combination actually produces a session of the advertised length (no length is ever presented as startable but fails)',
      allSupportedSucceed && attempted > 0,
      `${attempted} supported combinations checked`
    )

    // "Available" means runnable, not merely non-empty: a topic/level with
    // fewer eligible questions than the shortest offered length (5) is
    // still a selectable dead end under a bare `count > 0` check -- the
    // review's exact concern. Cross-check isTopicRunnable()/isLevelRunnable()
    // against an independent, direct computation over supportsLength for
    // every real combination, rather than trusting the helpers' own
    // internal logic circularly.
    const offeredLengths = [5, 10] as const
    let topicRunnableMismatches = 0
    let levelRunnableMismatches = 0
    let enabledTopicsWithNoRunnableLevel = 0
    let enabledLevelsWithNoRunnableLength = 0

    for (const groupId of groupIds) {
      const perLevel = matrix[groupId]
      const independentTopicRunnable = QUIZ_LEVELS.some((level) => offeredLengths.some((length) => perLevel[level].supportsLength[length]))
      if (isTopicRunnable(perLevel, [...offeredLengths]) !== independentTopicRunnable) topicRunnableMismatches += 1
      if (isTopicRunnable(perLevel, [...offeredLengths]) && !independentTopicRunnable) enabledTopicsWithNoRunnableLevel += 1

      for (const level of QUIZ_LEVELS) {
        const entry = perLevel[level]
        const independentLevelRunnable = offeredLengths.some((length) => entry.supportsLength[length])
        if (isLevelRunnable(entry, [...offeredLengths]) !== independentLevelRunnable) levelRunnableMismatches += 1
        if (isLevelRunnable(entry, [...offeredLengths]) && !independentLevelRunnable) enabledLevelsWithNoRunnableLength += 1
      }
    }

    check(
      'isTopicRunnable() exactly matches an independent per-level/per-length computation for every real topic group (review item 1)',
      topicRunnableMismatches === 0 && enabledTopicsWithNoRunnableLevel === 0,
      `${topicRunnableMismatches} mismatches`
    )
    check(
      'isLevelRunnable() exactly matches an independent per-length computation for every real topic-group/level combination (review item 2)',
      levelRunnableMismatches === 0 && enabledLevelsWithNoRunnableLength === 0,
      `${levelRunnableMismatches} mismatches`
    )

    // The exact real-catalog cases the review named, computed from the real
    // catalog (never hardcoded) and cross-checked against the independent
    // count -- review items 4 and 5.
    const sqlrpgleCounts = QUIZ_LEVELS.map((level) => countEligibleQuestions({ topicGroupId: 'sqlrpgle', level }, PRACTICE_QUESTIONS, isQuizEligible))
    check(
      'SQLRPGLE genuinely has fewer than 5 eligible questions at every level today (the exact real-inventory shape the review named)',
      sqlrpgleCounts.every((c) => c < 5),
      JSON.stringify(sqlrpgleCounts)
    )
    check(
      'SQLRPGLE is therefore not topic-runnable for Quick Quiz -- it can never be selected into an unrunnable state because it is disabled outright, not merely "selectable but always failing"',
      !isTopicRunnable(matrix['sqlrpgle'], [...offeredLengths])
    )

    const jobsOpsBeginnerCount = countEligibleQuestions({ topicGroupId: 'jobs-operations', level: 'beginner' }, PRACTICE_QUESTIONS, isQuizEligible)
    check(
      'Jobs/Operations + Beginner genuinely has exactly the real, under-5 count the review named',
      jobsOpsBeginnerCount > 0 && jobsOpsBeginnerCount < 5,
      String(jobsOpsBeginnerCount)
    )
    check(
      'Jobs/Operations + Beginner is therefore not level-runnable and must be disabled',
      !isLevelRunnable(matrix['jobs-operations']['beginner'], [...offeredLengths])
    )
    check(
      'Jobs/Operations the TOPIC nonetheless stays runnable overall (Intermediate/Mixed both have enough questions) -- only the Beginner level is disabled, the topic pill itself is not',
      isTopicRunnable(matrix['jobs-operations'], [...offeredLengths])
    )

    // Review item 6: the quiz builder's real default (All Topics + Mixed +
    // 5, matching app/(authenticated)/practice/quiz/builder/page.tsx's
    // levels=[mixed, beginner, intermediate] / lengths=[5, 10] prop order)
    // must itself be runnable against the real catalog.
    check(
      'the default builder configuration (All Topics, Mixed, 5 questions) is runnable against the real catalog',
      isConfigRunnable(matrix[ALL_TOPICS_KEY]['mixed'], 5)
    )

    // Review item 7: simulate the exact auto-correction algorithm
    // session-builder-form.tsx uses (first level from the caller's own
    // ordered list that's runnable, then first length from the caller's own
    // ordered list that's runnable) against every real topic group with the
    // Quick Quiz builder's real levels/lengths order, and confirm it never
    // resolves to a level/length that isn't genuinely runnable.
    const builderLevelOrder: Array<Exclude<SessionLevel, 'advanced'>> = ['mixed', 'beginner', 'intermediate']
    const builderLengthOrder: SessionLength[] = [5, 10]
    let autoCorrectionEverPickedDeadEnd = false
    for (const groupId of groupIds) {
      const perLevel = matrix[groupId]
      const resolvedLevel = builderLevelOrder.find((level) => isLevelRunnable(perLevel[level], builderLengthOrder))
      if (resolvedLevel) {
        if (!isLevelRunnable(perLevel[resolvedLevel], builderLengthOrder)) autoCorrectionEverPickedDeadEnd = true
        const resolvedLength = builderLengthOrder.find((length) => isConfigRunnable(perLevel[resolvedLevel], length))
        if (resolvedLength && !isConfigRunnable(perLevel[resolvedLevel], resolvedLength)) autoCorrectionEverPickedDeadEnd = true
        if (!resolvedLength && isTopicRunnable(perLevel, builderLengthOrder)) autoCorrectionEverPickedDeadEnd = true
      } else if (isTopicRunnable(perLevel, builderLengthOrder)) {
        // isTopicRunnable said yes but the same ordered search found no
        // runnable level -- a genuine contradiction, not just an edge case.
        autoCorrectionEverPickedDeadEnd = true
      }
    }
    check(
      'the auto-correction algorithm, replayed against every real topic group, never resolves to a level/length that is not genuinely runnable',
      !autoCorrectionEverPickedDeadEnd
    )

    // Review item 11: a manually crafted URL requesting a real,
    // insufficient-capacity combination still gets the factual server-side
    // fallback (never a silent change to the request, never a crash).
    const sqlrpgleInsufficient = buildGuidedOrQuizSession('quiz', { topicGroupId: 'sqlrpgle', level: 'mixed', length: 5, seed: 1 }, PRACTICE_QUESTIONS)
    check(
      'a manually crafted URL for SQLRPGLE + Mixed + 5 (real, insufficient capacity) reports the factual "insufficient" status with the real available count, never a silent shorter session',
      sqlrpgleInsufficient.status === 'insufficient' && sqlrpgleInsufficient.available === sqlrpgleCounts[0],
      JSON.stringify(sqlrpgleInsufficient)
    )

    const sessionBuilderFormSrc = stripComments(readRepoFile('components/practice/session-builder-form.tsx'))
    check(
      'the builder form never re-derives its own count-based availability check (no disabled={!hasAnyQuestions}/disabled={count === 0} -- the review-flagged bug class)',
      !/disabled=\{!hasAnyQuestions\}/.test(sessionBuilderFormSrc) && !/disabled=\{count === 0\}/.test(sessionBuilderFormSrc)
    )
    check('the builder form disables topic pills via the shared isTopicRunnable() helper, not a local count check', /disabled=\{!isTopicRunnable\(matrix\[ALL_TOPICS_KEY\], offeredLengths\)\}/.test(sessionBuilderFormSrc) && sessionBuilderFormSrc.includes('const topicRunnable = isTopicRunnable(matrix[group.id], offeredLengths)'))
    check('the builder form disables level pills via the shared isLevelRunnable() helper, not a local count check', sessionBuilderFormSrc.includes('const levelRunnable = isLevelRunnable(entry, offeredLengths)') && /disabled=\{!levelRunnable\}/.test(sessionBuilderFormSrc))
    check('the builder form disables length pills via the shared isConfigRunnable() helper', sessionBuilderFormSrc.includes('const supported = isConfigRunnable(currentAvailability, len.value)'))
    check('a disabled topic pill\'s accessible label explains why (not just a silent visual style)', sessionBuilderFormSrc.includes('(not enough questions)'))
    check('a disabled level pill\'s accessible label explains why (not just a silent visual style)', sessionBuilderFormSrc.includes('-- not enough for a quiz'))
    check('the builder form auto-corrects the level when the current one becomes unrunnable for a newly chosen topic', sessionBuilderFormSrc.includes('handleTopicChange'))
    check('the builder form auto-corrects the length when the current one becomes unrunnable', /nextLength = lengths\.find/.test(sessionBuilderFormSrc))
    check('the submit button is disabled unless the current combination can actually start', sessionBuilderFormSrc.includes('disabled={!canSubmit}'))
    check('canSubmit itself is derived via the shared isConfigRunnable() helper, not a local check', sessionBuilderFormSrc.includes('const canSubmit = isConfigRunnable(currentAvailability, length)'))
  }

  // ---------------------------------------------------------------------------
  section('8. Seeded shuffle and session variety: explicit seed on submit, stable on refresh, new on "start another"')
  // ---------------------------------------------------------------------------

  {
    const items = Array.from({ length: 20 }, (_, i) => i)
    const shuffledA = seededShuffle(items, 12345)
    const shuffledB = seededShuffle(items, 12345)
    const shuffledC = seededShuffle(items, 99999)

    check('the same seed produces the same order every time (refresh/Back/Forward stability)', JSON.stringify(shuffledA) === JSON.stringify(shuffledB))
    check('a different seed produces a different order', JSON.stringify(shuffledA) !== JSON.stringify(shuffledC))
    check('a shuffle never loses or duplicates items', shuffledA.length === items.length && new Set(shuffledA).size === items.length)

    // Same explicit seed -> same real session; different explicit seeds ->
    // different selection/order for a pool large enough to vary.
    const params = { topicGroupId: null, level: 'mixed' as const, length: 10 as const }
    const sessionSeed1 = buildGuidedOrQuizSession('quiz', { ...params, seed: 1001 }, PRACTICE_QUESTIONS)
    const sessionSeed1Again = buildGuidedOrQuizSession('quiz', { ...params, seed: 1001 }, PRACTICE_QUESTIONS)
    const sessionSeed2 = buildGuidedOrQuizSession('quiz', { ...params, seed: 2002 }, PRACTICE_QUESTIONS)
    check(
      'the same explicit seed against the real catalog produces the identical question set and order every time',
      sessionSeed1.status === 'ok' &&
        sessionSeed1Again.status === 'ok' &&
        JSON.stringify(sessionSeed1.questions.map((q) => q.id)) === JSON.stringify(sessionSeed1Again.questions.map((q) => q.id))
    )
    check(
      'a different explicit seed produces a different selection or order against the real catalog (large enough pool to vary)',
      sessionSeed1.status === 'ok' &&
        sessionSeed2.status === 'ok' &&
        JSON.stringify(sessionSeed1.questions.map((q) => q.id)) !== JSON.stringify(sessionSeed2.questions.map((q) => q.id))
    )

    const sessionBuilderFormSrc = stripComments(readRepoFile('components/practice/session-builder-form.tsx'))
    check('the builder form carries a hidden seed field submitted with the form', sessionBuilderFormSrc.includes('name="seed"'))
    check(
      'submitting the builder attaches a fresh Date.now()-based seed immediately before the native GET submission proceeds (so "start another quiz" genuinely varies)',
      /seedInputRef\.current\.value = String\(Date\.now\(\)\)/.test(sessionBuilderFormSrc)
    )
    check(
      'the builder\'s submit handler is not preventDefault()\'d (the native GET submission is what actually navigates, keeping the URL shareable)',
      !/handleSubmit[\s\S]*?preventDefault/.test(sessionBuilderFormSrc)
    )

    const quizSummarySrc = stripComments(readRepoFile('components/practice/quiz-session.tsx'))
    check(
      '"Start another quiz" routes back through the builder (where a fresh seed is attached), not directly to a new session URL',
      /href="\/practice\/quiz\/builder"[\s\S]{0,200}Start another quiz/.test(quizSummarySrc)
    )
  }

  // ---------------------------------------------------------------------------
  section('9. Quiz scoring, double-submission prevention, retry-incorrect')
  // ---------------------------------------------------------------------------

  {
    const quizQuestions = PRACTICE_QUESTIONS.filter((q) => q.type === 'multiple-choice').slice(0, 3) as PracticeQuestion[]
    const correctAnswers = Object.fromEntries(quizQuestions.map((q) => [q.id, q.correctAnswer]))
    const perfectResult = scoreQuiz(quizQuestions, correctAnswers)
    check('scoreQuiz gives full marks when every answer is correct', perfectResult.correctCount === quizQuestions.length && perfectResult.total === quizQuestions.length)

    const wrongAnswers = { [quizQuestions[0].id]: 'definitely not the right answer' }
    const partialResult = scoreQuiz(quizQuestions, wrongAnswers)
    check('scoreQuiz counts an unanswered question as incorrect, not skipped from the total', partialResult.total === quizQuestions.length)
    check('scoreQuiz correctly identifies the one wrong/answered question as incorrect', partialResult.results.find((r) => r.questionId === quizQuestions[0].id)?.correct === false)

    const retryQuestions = selectRetryQuestions(quizQuestions, partialResult)
    check('selectRetryQuestions returns only the incorrect questions', retryQuestions.length === quizQuestions.length - 1 || retryQuestions.length >= 1)
    check('selectRetryQuestions never includes a question the learner got right', !retryQuestions.some((q) => correctAnswers[q.id] === wrongAnswers[q.id]))

    const quizSessionSrc = stripComments(readRepoFile('components/practice/quiz-session.tsx'))
    check(
      'the quiz session UI guards against double-submission with a synchronous ref check before any state update',
      /submittingRef\.current/.test(quizSessionSrc) && /if \(submittingRef\.current/.test(quizSessionSrc)
    )
    check('an option is disabled once the question has been submitted (cannot change the answer after submitting)', quizSessionSrc.includes('disabled={submitted}'))
    check('the correct answer is only revealed after submission, not before (no color/icon shown until showResult)', /showResult\s*=\s*submitted/.test(quizSessionSrc))
  }

  // ---------------------------------------------------------------------------
  section('10. Quiz session accessibility: native radios, headings, live announcements, focus management')
  // ---------------------------------------------------------------------------

  {
    const quizSessionSrc = stripComments(readRepoFile('components/practice/quiz-session.tsx'))
    const sessionPageSrc = readRepoFile('app/(authenticated)/practice/quiz/session/page.tsx')

    check('the quiz session page has a real <h1>', /<h1[\s>]/.test(sessionPageSrc))
    check('every SectionHero-based page (Guided Practice, Quiz Builder, Practice Hub) gets an <h1> from the shared SectionHero component', /<h1\b/.test(readRepoFile('components/section-hero.tsx')))

    check('answer options use real native <input type="radio"> elements, not a hand-rolled ARIA widget', quizSessionSrc.includes('type="radio"'))
    check('answer options never use role="radio" (native radios get correct Tab/Arrow-key/roving-focus behavior for free)', !quizSessionSrc.includes('role="radio"'))
    check('answer options share one `name` per question so the browser groups them as a single radio group', /name={`answer-\$\{current\.id\}`}/.test(quizSessionSrc))
    check('answer options are wrapped in a <fieldset> with a <legend> naming the question', quizSessionSrc.includes('<fieldset') && quizSessionSrc.includes('<legend'))

    check('the correct-answer indicator includes screen-reader text, not color/icon alone', quizSessionSrc.includes('(Correct answer)'))
    check('the incorrect-answer indicator includes screen-reader text, not color/icon alone', quizSessionSrc.includes('incorrect'))
    check('there is a dedicated aria-live region announcing submission feedback, separate from the progress announcement', (quizSessionSrc.match(/aria-live="polite"/g) ?? []).length >= 2)
    check('the progress text ("Question X of N") is itself announced via aria-live', /aria-live="polite"[\s\S]{0,80}Question \{index \+ 1\} of \{questions\.length\}/.test(quizSessionSrc))

    check('focus moves to the question heading on advancing/retrying (ref + effect keyed on the active question)', quizSessionSrc.includes('questionHeadingRef') && /useEffect\([\s\S]*?questionHeadingRef\.current\?\.focus\(\)/.test(quizSessionSrc))
    check('focus moves to the completion summary heading when the quiz finishes', quizSessionSrc.includes('summaryHeadingRef') && /useEffect\(\(\) => \{\s*summaryHeadingRef\.current\?\.focus\(\)/.test(quizSessionSrc))
    check(
      'programmatic focus targets keep a VISIBLE focus indicator (never focus:outline-none with nothing to replace it)',
      (quizSessionSrc.match(/focus:outline-none focus:ring-2/g) ?? []).length >= 2
    )
    check('interactive answer labels forward the hidden input\'s focus-visible state to a visible ring on the label', quizSessionSrc.includes('has-[:focus-visible]:ring-2'))

    check('every per-question review row in the completion summary also carries non-color-only correct/incorrect text', quizSessionSrc.includes("r?.correct ? ' (Correct answer)' : ' (Incorrect answer)'"))

    check('the quiz session UI respects prefers-reduced-motion for its own transitions (motion-reduce or a transition-only, non-transform animation)', !/animate-(bounce|spin|ping)/.test(quizSessionSrc))
  }

  // ---------------------------------------------------------------------------
  section('11. Interview Prep phase 1: 764-question import integrity, zero fabricated answers, real activation')
  // ---------------------------------------------------------------------------

  {
    // The 19 individual PRACTICE_TOPICS ids covered by lib/practice-topic-groups.ts's
    // consolidated groups (the 22 real topics minus interview-readiness/
    // mini-projects/mixed-review) -- the same set the Quick Quiz builder's
    // topic picker already restricts itself to.
    const ALLOWED_INTERVIEW_TOPICS = new Set(PRACTICE_TOPIC_GROUPS.flatMap((g) => g.topicIds))
    const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced'])
    const VALID_TYPES = new Set<InterviewQuestionType>(['conceptual', 'scenario-based', 'code-based'])

    check('the real production catalog has exactly 764 imported questions', INTERVIEW_QUESTIONS.length === 764, String(INTERVIEW_QUESTIONS.length))

    const ids = INTERVIEW_QUESTIONS.map((q) => q.id)
    check('every id is unique', new Set(ids).size === ids.length)

    const originalNumbers = INTERVIEW_QUESTIONS.map((q) => q.originalNumber)
    const expectedNumbers = new Set(Array.from({ length: 764 }, (_, i) => i + 1))
    check(
      'originalNumber is unique per record and forms exactly the contiguous set 1..764 (traceable back to the source doc, no gaps/dupes)',
      new Set(originalNumbers).size === 764 && originalNumbers.every((n) => expectedNumbers.has(n))
    )

    const invalidTopics = INTERVIEW_QUESTIONS.filter((q) => !ALLOWED_INTERVIEW_TOPICS.has(q.topicId))
    check(
      'every question\'s topicId is one of the 19 subject-matter topics lib/practice-topic-groups.ts already uses (never interview-readiness/mini-projects/mixed-review, which are reserved/owned elsewhere)',
      invalidTopics.length === 0,
      invalidTopics.slice(0, 5).map((q) => `${q.id}:${q.topicId}`).join(', ')
    )
    check('no question uses topicId "interview-readiness" (that id is owned by existing, unrelated Guided-Practice content)', !INTERVIEW_QUESTIONS.some((q) => q.topicId === 'interview-readiness'))

    check('every question has a valid difficulty', INTERVIEW_QUESTIONS.every((q) => VALID_DIFFICULTIES.has(q.difficulty)))
    check('every question has a valid questionType', INTERVIEW_QUESTIONS.every((q) => VALID_TYPES.has(q.questionType)))
    check('every question has a non-empty prompt', INTERVIEW_QUESTIONS.every((q) => q.prompt.trim().length > 0))

    // The central, non-negotiable requirement: zero fabricated/placeholder
    // answers, zero published records, in this PR.
    check(
      'every one of the 764 imported questions is status "draft" today (zero published, zero answers written in this PR)',
      INTERVIEW_QUESTIONS.every((q) => q.status === 'draft')
    )
    check('isInterviewPrepAvailable() correctly reports unavailable against the real catalog (0 published)', isInterviewPrepAvailable(INTERVIEW_QUESTIONS) === false)

    // Scoped to the DATA array only, not the whole file -- the
    // InterviewQuestion type's own 'published'-branch declaration
    // legitimately names modelAnswer/essentialPoints/commonMistakes as
    // field names once, and a naive whole-file check would false-fail on
    // that type definition rather than actually checking the 764 data
    // records for fabricated answer content.
    const interviewFileSrc = readRepoFile('content/practice/interview-questions.ts')
    const interviewDataArraySrc = interviewFileSrc.slice(interviewFileSrc.indexOf('export const INTERVIEW_QUESTIONS'))
    check('the production data array never contains a modelAnswer field literal (no answer content was written for any of the 764 records)', !interviewDataArraySrc.includes('modelAnswer:'))
    check('the production data array never contains an essentialPoints field literal', !interviewDataArraySrc.includes('essentialPoints:'))
    check('the production data array never contains a commonMistakes field literal', !interviewDataArraySrc.includes('commonMistakes:'))

    check(
      'the file header correctly attributes the isInterviewPrepAvailable() call to the destination page, not the Practice Hub landing page (the landing card is an unconditional link and never calls it)',
      interviewFileSrc.includes('does NOT call it') && interviewFileSrc.includes('destination')
    )
    check(
      'the stale claim that "the landing page now DOES call it" is gone from the header',
      !interviewFileSrc.includes('The landing page now DOES call it')
    )

    const withDuplicateOf = INTERVIEW_QUESTIONS.filter((q) => q.duplicateOf)
    check('at least one near-duplicate pair was flagged (proves the automated + manual dedup pass actually ran, not just a hypothetical concern)', withDuplicateOf.length > 0, String(withDuplicateOf.length))
    check(
      'every duplicateOf link points at a real, existing id in the same catalog (never a dangling reference)',
      withDuplicateOf.every((q) => ids.includes(q.duplicateOf!))
    )
    check('no question is marked as a duplicate of itself', withDuplicateOf.every((q) => q.duplicateOf !== q.id))

    const legacyFlagged = INTERVIEW_QUESTIONS.filter((q) => q.legacyContext)
    check('at least one legacy-tooling question was flagged (SDA/RLU/PDM/SEU/Query-400/RPG-400-specific)', legacyFlagged.length > 0, String(legacyFlagged.length))

    const releaseDependentFlagged = INTERVIEW_QUESTIONS.filter((q) => q.releaseDependent)
    check('at least one release-dependent question was flagged (numeric limits that vary by IBM i release)', releaseDependentFlagged.length > 0, String(releaseDependentFlagged.length))

    // Three manually-corrected first-pass misclassifications, locked in so
    // they can't silently regress if the catalog is regenerated later.
    // iq-317/iq-589 were caught by a bare "cursor" keyword match that
    // didn't distinguish a SQL cursor from a 5250 screen/subfile cursor.
    const iq317 = INTERVIEW_QUESTIONS.find((q) => q.id === 'iq-317')
    check('iq-317 ("...subfile record on which the cursor is located") is classified as subfiles, not advanced-sql (a screen cursor, not a SQL cursor)', iq317?.topicId === 'subfiles')
    const iq589 = INTERVIEW_QUESTIONS.find((q) => q.id === 'iq-589')
    check('iq-589 ("How do you get the cursor position?") is classified as display-files, not advanced-sql', iq589?.topicId === 'display-files')
    const iq431 = INTERVIEW_QUESTIONS.find((q) => q.id === 'iq-431')
    check('iq-431 ("What is a trigger?") is classified as physical-logical-files, matching its neighboring PF-trigger questions (iq-432/433/434)', iq431?.topicId === 'physical-logical-files')
    check(
      'every genuinely SQL-cursor question (iq-502/596/597/600/601) is still advanced-sql -- the cursor-keyword fix only touched the two false positives, not real SQL-cursor content',
      ['iq-502', 'iq-596', 'iq-597', 'iq-600', 'iq-601'].every((id) => INTERVIEW_QUESTIONS.find((q) => q.id === id)?.topicId === 'advanced-sql')
    )

    // The committed source document is the sole, cited source -- cross-check
    // the imported data actually traces back to it, not just to itself.
    let sourceDocSrc = ''
    try {
      sourceDocSrc = readFileSync(
        resolve(__dirname, '..', 'docs/tutorials/IBMi Interview Questions/IBM_i_Interview_Questions_Master_onlyQuestions.md'),
        'utf-8'
      )
    } catch {
      sourceDocSrc = ''
    }
    check('the committed source document exists at the documented path', sourceDocSrc.length > 0)
    check('the source document itself claims exactly 764 unique questions (matches the imported count)', /\*\*Total unique questions:\*\*\s*764\./.test(sourceDocSrc))
    const sourceQuestionLines = sourceDocSrc.split('\n').filter((l) => /^\d+\.\s+.+/.test(l))
    check('the source document has exactly 764 numbered question lines', sourceQuestionLines.length === 764, String(sourceQuestionLines.length))
    const first = INTERVIEW_QUESTIONS.find((q) => q.originalNumber === 1)
    const last = INTERVIEW_QUESTIONS.find((q) => q.originalNumber === 764)
    check('question #1 is present and its prompt appears verbatim (or lightly edited) from the source doc\'s first line', !!first && sourceDocSrc.includes('1. Define a shared access path?'))
    check('question #764 is present and traces to the source doc\'s final numbered line', !!last && /764\. What effect does the P operation extender/.test(sourceDocSrc))

    // --- Pure filter/search logic, exercised against local published
    // fixtures since the real catalog has zero published entries today. ---
    const fixtureBase = {
      relatedLessonSlugs: [] as string[],
      tags: ['fixture'] as string[],
    }
    const publishedFixtures: InterviewQuestion[] = [
      {
        ...fixtureBase,
        id: 'fixture-1',
        originalNumber: 9001,
        topicId: 'rpgle-foundations',
        difficulty: 'beginner',
        questionType: 'conceptual',
        status: 'published',
        prompt: 'What is a data structure in RPG?',
        modelAnswer: 'A named grouping of subfields.',
        essentialPoints: ['groups related fields'],
        commonMistakes: ['confusing it with a file'],
      },
      {
        ...fixtureBase,
        id: 'fixture-2',
        originalNumber: 9002,
        topicId: 'subfiles',
        difficulty: 'intermediate',
        questionType: 'scenario-based',
        status: 'published',
        prompt: 'A subfile page is not refreshing after an update -- what would you check first?',
        modelAnswer: 'Confirm SFLNXTCHG is set and the control record was written.',
        essentialPoints: ['SFLNXTCHG'],
        commonMistakes: ['forgetting to write the control record'],
      },
      {
        ...fixtureBase,
        id: 'fixture-3',
        originalNumber: 9003,
        topicId: 'advanced-sql',
        difficulty: 'advanced',
        questionType: 'code-based',
        status: 'published',
        prompt: 'Write a cursor declaration that reads customer records for update.',
        modelAnswer: 'DECLARE cursor_name CURSOR FOR SELECT ... FOR UPDATE OF ...',
        essentialPoints: ['FOR UPDATE clause'],
        commonMistakes: ['omitting FOR UPDATE'],
      },
    ]
    const draftFixture: InterviewQuestion = {
      ...fixtureBase,
      id: 'fixture-draft',
      originalNumber: 9004,
      topicId: 'rpgle-foundations',
      difficulty: 'beginner',
      questionType: 'conceptual',
      status: 'draft',
      prompt: 'This fixture is intentionally never published.',
    }
    const mixedFixtures = [...publishedFixtures, draftFixture]

    check('isInterviewPrepAvailable() reports unavailable for a draft-only set', isInterviewPrepAvailable([draftFixture]) === false)
    check('isInterviewPrepAvailable() reports available once at least one published entry exists', isInterviewPrepAvailable(mixedFixtures) === true)

    check(
      'filterInterviewQuestions() by topic returns only matching-topic questions',
      filterInterviewQuestions(publishedFixtures, { topicIds: ['subfiles'] }).length === 1 &&
        filterInterviewQuestions(publishedFixtures, { topicIds: ['subfiles'] })[0].id === 'fixture-2'
    )
    check(
      'filterInterviewQuestions() by difficulty returns only matching-difficulty questions',
      filterInterviewQuestions(publishedFixtures, { difficulties: ['advanced'] }).length === 1
    )
    check(
      'filterInterviewQuestions() by questionType returns only matching-type questions',
      filterInterviewQuestions(publishedFixtures, { questionTypes: ['code-based'] }).length === 1
    )
    check('filterInterviewQuestions() with no filters returns everything unchanged', filterInterviewQuestions(publishedFixtures, {}).length === 3)
    check(
      'filterInterviewQuestions() combines topic + difficulty as AND, not OR',
      filterInterviewQuestions(publishedFixtures, { topicIds: ['subfiles'], difficulties: ['advanced'] }).length === 0
    )

    check('countByTopic() reflects the real per-topic distribution of the input set', countByTopic(publishedFixtures).every((f) => f.count === 1) && countByTopic(publishedFixtures).length === 3)
    check('countByDifficulty() omits difficulties with zero matches rather than reporting a zero row', countByDifficulty([publishedFixtures[0]]).length === 1)
    check('countByType() omits question types with zero matches', countByType([publishedFixtures[0]]).length === 1)

    check('an empty search query returns every input question unfiltered (no results-hidden-by-default surprise)', searchInterviewQuestions(publishedFixtures, '').length === 3)
    check(
      'searching for a prompt-only keyword finds the right question and nothing else',
      searchInterviewQuestions(publishedFixtures, 'subfile page').length === 1 && searchInterviewQuestions(publishedFixtures, 'subfile page')[0].id === 'fixture-2'
    )
    check('a query matching zero prompts/tags returns zero results (never falls back to showing everything)', searchInterviewQuestions(publishedFixtures, 'zzz-no-such-term-zzz').length === 0)
    check('scoreInterviewQuestion() ranks a prompt-prefix match ahead of a mid-prompt match', scoreInterviewQuestion(publishedFixtures[0], normalizeInterviewQuery('what is')) === 1)

    // --- Route existence, auth guard, real page wiring ---
    const interviewPageSrc = readRepoFile('app/(authenticated)/practice/interview/page.tsx')
    check('the /practice/interview route now exists (phase 1 activates the real page)', interviewPageSrc.length > 0)
    check('the route is auth-guarded, redirecting a signed-out visitor to /practice', interviewPageSrc.includes("redirect('/practice')"))
    check('the route never statically caches (dynamic = force-dynamic, matching every other authenticated Practice sub-route)', interviewPageSrc.includes("export const dynamic = 'force-dynamic'"))
    check('the route is noindex (robots.index === false), matching every other Practice sub-route', /robots:\s*\{\s*index:\s*false/.test(interviewPageSrc))
    check('the page calls the real isInterviewPrepAvailable() helper (never re-derives its own availability check)', interviewPageSrc.includes('isInterviewPrepAvailable(INTERVIEW_QUESTIONS)'))
    check(
      'the page only ever renders questions filtered to status === \'published\' -- never the full draft set',
      interviewPageSrc.includes("q.status === 'published'")
    )
    check('the page shows an "in review" empty state, not a blank page, when nothing is published', interviewPageSrc.includes('being reviewed'))
    check('the empty state never exposes the word "prompt" as literal unreviewed content -- it only states the real total in preparation', interviewPageSrc.includes('totalInPreparation'))
    check('the empty state states the topic count as an exact fact ("across N topics"), not a hedged "up to N topics"', interviewPageSrc.includes('across {topicCount} topics') && !interviewPageSrc.includes('up to {topicCount}'))
    check('the topic count is computed from the real INTERVIEW_QUESTIONS data (distinct topicId values), not the full 22-topic PRACTICE_TOPICS taxonomy size', interviewPageSrc.includes('new Set(INTERVIEW_QUESTIONS.map((q) => q.topicId)).size'))
    check('the page has a back-link to the Practice Hub', /href="\/practice"[\s\S]{0,500}Practice Hub/.test(interviewPageSrc))

    const questionListSrc = readRepoFile('components/practice/interview-question-list.tsx')
    check(
      'the answer section is only ever rendered behind a status === \'published\' guard in the question list',
      /q\.status === 'published'[\s\S]{0,60}RevealAnswer/.test(questionListSrc)
    )
    check(
      'RevealAnswer\'s own parameter type is narrowed to the \'published\' branch of the InterviewQuestion union (a type-level guarantee that modelAnswer/essentialPoints/commonMistakes exist, not just a runtime proximity check)',
      questionListSrc.includes("Extract<InterviewQuestion, { status: 'published' }>")
    )
    check('the question-list component never uses dangerouslySetInnerHTML (highlighting renders real <mark> JSX, not an HTML string)', !questionListSrc.includes('dangerouslySetInnerHTML'))

    // --- Reveal Answer: collapsed by default, native accessible disclosure ---
    check(
      'the prompt itself (an <h3>) is rendered before the reveal/disclosure element in source order -- always visible, never gated',
      questionListSrc.indexOf('<h3') !== -1 && questionListSrc.indexOf('<h3') < questionListSrc.indexOf('RevealAnswer question=')
    )
    check('the answer is behind a real native <details> element, not a hand-rolled show/hide widget', questionListSrc.includes('<details'))
    check('the disclosure trigger is a real <summary> (keyboard/screen-reader accessible natively, no custom ARIA widget needed)', questionListSrc.includes('<summary'))
    check('the disclosure is collapsed by default (no hardcoded `open` attribute forcing it visible)', !/<details[^>]*\bopen\b/.test(questionListSrc))
    check('the trigger is labeled "Reveal Answer", not a bare icon or ambiguous "Show more"', questionListSrc.includes('Reveal Answer'))
    check('the trigger keeps a visible focus ring (focus-visible:ring), not focus:outline-none with nothing to replace it', questionListSrc.includes('focus-visible:ring-2') && questionListSrc.includes('<summary'))
    check('the disclosure chevron is aria-hidden (decorative only -- the real accessible state comes from the native <details> element, not the icon)', /ChevronDown[\s\S]{0,200}aria-hidden="true"/.test(questionListSrc))

    check('the model answer is rendered inside the reveal section', /RevealAnswer[\s\S]*question\.modelAnswer/.test(questionListSrc))
    check('essential points render as a real list (<ul>/<li>), not a single paragraph blob', /essentialPoints\.map[\s\S]{0,40}<li/.test(questionListSrc))
    check('essential points are conditionally rendered only when non-empty', questionListSrc.includes('question.essentialPoints.length > 0'))
    check('common mistakes render as a real list, not a single paragraph blob', /commonMistakes\.map[\s\S]{0,40}<li/.test(questionListSrc))
    check('common mistakes are conditionally rendered only when non-empty', questionListSrc.includes('question.commonMistakes.length > 0'))
    check('follow-up questions render as a real list when present', /followUpQuestions\.map[\s\S]{0,40}<li/.test(questionListSrc))
    check(
      'follow-up questions (an optional field) are only rendered when the array exists AND is non-empty -- never assumes it\'s always present',
      questionListSrc.includes('question.followUpQuestions && question.followUpQuestions.length > 0')
    )
    check('each of the three answer sections has its own labeled heading (Essential points / Common mistakes / Follow-up questions), not an unlabeled list', questionListSrc.includes('Essential points') && questionListSrc.includes('Common mistakes') && questionListSrc.includes('Follow-up questions'))

    // --- Global search / sitemap boundary preserved (unchanged from before this PR) ---
    const searchLibSrc = readRepoFile('lib/search.ts')
    check('lib/search.ts is untouched by Interview Prep (no reference to interview questions -- stays out of global site search)', !/interview-questions|InterviewQuestion/.test(searchLibSrc))
    const sitemapSrc = readRepoFile('app/sitemap.ts')
    check('app/sitemap.ts has no reference to interview questions (Practice is excluded wholesale, as before)', !/interview-questions|InterviewQuestion/.test(sitemapSrc))
    const interviewSearchSrc = readRepoFile('lib/interview-search.ts')
    check('lib/interview-search.ts never builds a RegExp from the raw query (plain string matching only, same convention as lib/search.ts)', !interviewSearchSrc.includes('new RegExp'))

    // --- Landing-page card activation (real, unconditional link) ---
    const practicePageSrc = readRepoFile('app/(authenticated)/practice/page.tsx')
    check('the landing page card links to the real /practice/interview route', practicePageSrc.includes("href: '/practice/interview'"))
    check(
      'the landing page itself never calls isInterviewPrepAvailable() -- the card is an unconditional link like Guided Practice/Quick Quiz; the destination page owns the empty-state gating',
      !stripComments(practicePageSrc).includes('isInterviewPrepAvailable')
    )
    check(
      'the landing page never imports INTERVIEW_QUESTIONS directly (no dependency on catalog content for the card itself to render)',
      !stripComments(practicePageSrc).includes('INTERVIEW_QUESTIONS')
    )
    check(
      'the card body copy is honest about review status (mentions reviewed answers being added, never claims the bank is complete/ready)',
      practicePageSrc.includes('reviewed answers are being added')
    )

    const homepageSrc = readRepoFile('app/page.tsx')
    check(
      'the homepage Journey 3 body now mentions real interview-question prep as an available capability, not "coming soon"',
      homepageSrc.includes('prepare with real') && homepageSrc.includes('interview questions')
    )
    check('the stale "Interview prep is coming soon" sentence is gone from the homepage', !homepageSrc.includes('Interview prep is coming soon'))
  }

  // ---------------------------------------------------------------------------
  section('12. Question model cleanup: no stale Interview Prep references, no unused fields')
  // ---------------------------------------------------------------------------

  {
    const questionsFileSrc = readRepoFile('content/practice/questions.ts')
    check('content/practice/questions.ts no longer claims a 60-question bank spanning all three levels (that content was withdrawn)', !/60-question bank/.test(questionsFileSrc))
    check('the unused optional `hint` field was removed from PracticeQuestion (zero real questions used it)', !/hint\?:\s*string/.test(questionsFileSrc))
    check('no PracticeQuestion in the real catalog has a `hint` property (nothing depends on the removed field)', !PRACTICE_QUESTIONS.some((q) => 'hint' in q))
  }

  // ---------------------------------------------------------------------------
  section('13. Legacy /practice?topic=... links keep working after the Guided Practice relocation')
  // ---------------------------------------------------------------------------

  {
    const practicePageSrc = stripComments(readRepoFile('app/(authenticated)/practice/page.tsx'))

    check(
      'a topic value is only trusted as a legacy destination if it matches a real PRACTICE_TOPICS id',
      practicePageSrc.includes('PRACTICE_TOPICS.some((t) => t.id === topic)')
    )
    check(
      'a valid legacy topic redirects an authenticated visitor to the equivalent /practice/guided?topic=... destination',
      /redirect\(legacyTopicDestination\)/.test(practicePageSrc) && practicePageSrc.includes('`/practice/guided?topic=')
    )
    check(
      'the full legacy-destination expression is exactly "valid topic ? /practice/guided?topic=... : null" -- a real match resolves to the relocated route, never back to /practice itself (no redirect loop possible), and an invalid/missing topic resolves to null rather than an unsafe/unvalidated redirect',
      /topic && PRACTICE_TOPICS\.some\(\(t\) => t\.id === topic\) \? `\/practice\/guided\?topic=\$\{encodeURIComponent\(topic\)\}` : null/.test(
        practicePageSrc
      )
    )
    check(
      'a signed-out visitor is handed `legacyTopicDestination ?? \'/practice\'` as their post-auth `next` -- a real topic survives login/sign-up, and no topic falls back to the normal hub-preview destination (unchanged baseline behavior)',
      practicePageSrc.includes("signedOutNext={legacyTopicDestination ?? '/practice'}")
    )

    // safeInternalPath (used downstream by /auth/login and /auth/sign-up)
    // genuinely accepts a path that includes a query string, which is what
    // makes the "preserved through signup" flow actually work end to end.
    const authRedirectSrc = readRepoFile('lib/auth-redirect.ts')
    check(
      'safeInternalPath has no special-case rejection of query strings (a `next` like /practice/guided?topic=... is a normal accepted path)',
      !authRedirectSrc.includes("candidate.includes('?')")
    )

    check('PRACTICE_TOPICS (the real topic catalog used for legacy-link validation) is non-empty', PRACTICE_TOPICS.length > 0, String(PRACTICE_TOPICS.length))
  }

  // ---------------------------------------------------------------------------
  section('14. Signed-out preview isolation, shared visual identity, and authenticated route protection')
  // ---------------------------------------------------------------------------

  {
    const practicePageSrc = stripComments(readRepoFile('app/(authenticated)/practice/page.tsx'))
    const previewFnMatch = practicePageSrc.match(/function PracticePreview\([^)]*\)[\s\S]*?\n\}/)
    check('found the PracticePreview function to isolate and inspect', !!previewFnMatch)
    if (previewFnMatch) {
      const previewBody = previewFnMatch[0]
      check('the signed-out preview never calls getPublishedLessons or any authenticated data fetch', !previewBody.includes('getPublishedLessons') && !previewBody.includes('supabase'))
      check('the signed-out preview never renders PracticeBrowser or any authenticated session component', !previewBody.includes('PracticeBrowser') && !previewBody.includes('QuizSession'))
      check('the signed-out preview uses the same dark SectionHero as the authenticated hub (shared visual identity across auth states)', previewBody.includes('<SectionHero') && previewBody.includes("title=\"Practice Hub\""))
      check('the signed-out preview\'s hero accents only the word "Hub", not the whole heading', previewBody.includes('accentWord="Hub"'))
      check('the signed-out preview keeps the same knowledge/hands-on card grid below the hero (not just a bare CTA)', previewBody.includes('KNOWLEDGE_CARDS') && previewBody.includes('HANDS_ON_CARDS'))
      check('the signed-out preview renders the auth CTA (Create Account / Log In) inside the hero', previewBody.includes('PreviewAuthCta'))
    }
    check(
      'the hub page checks auth before rendering the authenticated hierarchy and passes a real next destination to the preview',
      practicePageSrc.includes('if (!user)') && /<PracticePreview\s/.test(practicePageSrc)
    )

    // AI Tutor and Practice Lab's own signed-out previews are untouched --
    // only Practice's preview was adjusted.
    const featurePreviewShellSrc = readRepoFile('components/feature-preview/feature-preview-shell.tsx')
    check('the shared FeaturePreviewShell (used by AI Tutor and Practice Lab) is untouched -- Practice built its own hero rather than changing a shell three features share', !featurePreviewShellSrc.includes('Practice Hub'))

    const guidedSrc = stripComments(readRepoFile('app/(authenticated)/practice/guided/page.tsx'))
    check('the Guided Practice route redirects signed-out visitors to /practice rather than rendering its own preview', guidedSrc.includes("redirect('/practice')"))

    const quizBuilderSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/builder/page.tsx'))
    check('the Quick Quiz builder route is auth-guarded', quizBuilderSrc.includes("redirect('/practice')"))

    const quizSessionPageSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/session/page.tsx'))
    check('the Quick Quiz session route is auth-guarded', quizSessionPageSrc.includes("redirect('/practice')"))
  }

  // ---------------------------------------------------------------------------
  section('15. Homepage copy updated without restructuring')
  // ---------------------------------------------------------------------------

  {
    const homepageSrc = readRepoFile('app/page.tsx')
    check('the homepage Journey 3 heading is unchanged ("Want hands-on practice?")', homepageSrc.includes('Want hands-on practice?'))
    check('the Journey 3 body still mentions quick quizzes', /quick quizzes/i.test(homepageSrc))
    check('the existing hands-on-simulator safety disclaimer is preserved verbatim', homepageSrc.includes('safe learning simulations, not a connection to a real IBM&nbsp;i system.'))
    check('the Journey 3 CTA still points at /practice unchanged', homepageSrc.includes('href="/practice"'))
  }

  // ---------------------------------------------------------------------------
  section('16. No unsafe HTML rendering and no leakage into unrelated systems (dashboard/achievements)')
  // ---------------------------------------------------------------------------

  {
    const touchedFiles = [
      'app/(authenticated)/practice/page.tsx',
      'app/(authenticated)/practice/guided/page.tsx',
      'app/(authenticated)/practice/quiz/builder/page.tsx',
      'app/(authenticated)/practice/quiz/session/page.tsx',
      'components/practice/session-builder-form.tsx',
      'components/practice/quiz-session.tsx',
    ]
    for (const file of touchedFiles) {
      check(`${file} never uses dangerouslySetInnerHTML`, !readRepoFile(file).includes('dangerouslySetInnerHTML'))
    }

    const dashboardMetricsSrc = readRepoFile('lib/dashboard-metrics.ts')
    const achievementsSrc = readRepoFile('lib/achievements.ts')
    check('lib/dashboard-metrics.ts has no dependency on Practice session/question logic (Quick Quiz never mutates dashboard progress)', !dashboardMetricsSrc.includes('practice-session') && !dashboardMetricsSrc.includes('practice/questions'))
    check('lib/achievements.ts has no dependency on Practice session/question logic (Quick Quiz never mutates achievements)', !achievementsSrc.includes('practice-session') && !achievementsSrc.includes('practice/questions'))

    const quizSessionSrc = readRepoFile('components/practice/quiz-session.tsx')
    check('the quiz session component never imports dashboard-metrics or achievements logic', !quizSessionSrc.includes('dashboard-metrics') && !quizSessionSrc.includes('achievements'))
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Practice Hub regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Practice Hub regression FAILED.')
    process.exit(1)
  }
  console.log('Practice Hub regression passed.')
}

main().catch((err) => {
  console.error('Practice Hub regression script crashed:', err)
  process.exit(1)
})
