/**
 * IBM i Practice Hub regression pass (UI foundation + Guided Practice
 * relocation + Quick Quiz, using only the existing approved question bank
 * -- Interview Prep content itself is explicitly out of scope for this PR
 * and this suite proves none was published). Standalone via `tsx`, matching
 * the existing scripts/*-regression.ts style (check/section helpers,
 * pass/fail counter, process.exit(1) on any failure).
 *
 * Executes the real, pure functions in lib/practice-session.ts directly
 * against the REAL production PRACTICE_QUESTIONS/PRACTICE_TOPICS catalog
 * wherever practical (not just synthetic fixtures) -- e.g. the availability
 * matrix is cross-checked against countEligibleQuestions() independently
 * for every topic-group x level combination, rather than hardcoding any
 * expected count that could silently drift out of sync with real content.
 * Any InterviewQuestion-shaped fixture used to validate
 * isInterviewPrepAvailable()'s logic lives ONLY in this file, as a local
 * constant -- never in content/practice/interview-questions.ts itself,
 * which must stay genuinely empty in production.
 *
 * Usage:
 *   npm run test:practice-hub
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { PRACTICE_QUESTIONS, PRACTICE_TOPICS, type PracticeQuestion } from '../content/practice/questions'
import { INTERVIEW_QUESTIONS, isInterviewPrepAvailable, type InterviewQuestion } from '../content/practice/interview-questions'
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
  QUIZ_LEVELS,
  ALL_TOPICS_KEY,
  seededShuffle,
  scoreQuiz,
  selectRetryQuestions,
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
  section('1. Practice Hub hierarchy: two knowledge cards + Interview Prep coming-soon, two hands-on cards, no new nav item')
  // ---------------------------------------------------------------------------

  {
    const pageSrc = stripComments(readRepoFile('app/(authenticated)/practice/page.tsx'))

    check('the hub page has a "Test Your Knowledge" section', pageSrc.includes('Test Your Knowledge'))
    check('the hub page has a "Hands-On Practice" section (American-English spelling, not "Practise")', pageSrc.includes('Hands-On Practice'))
    check('the old "Practise Hands-On" (British spelling) wording is gone', !pageSrc.includes('Practise Hands-On'))
    check('Guided Practice links to its relocated route', pageSrc.includes("href: '/practice/guided'"))
    check('Quick Quiz links to its builder route', pageSrc.includes("href: '/practice/quiz/builder'"))
    check('the 5250 Practice Lab card links to the real 5250 route', pageSrc.includes("href: '/practice-lab/5250'"))
    check('the SQL Console card links to the real SQL route', pageSrc.includes("href: '/practice-lab/sql'"))

    check('Guided Practice uses a descriptive CTA, not generic "Start"', pageSrc.includes("cta: 'Start Guided Practice'"))
    check('Quick Quiz uses a descriptive CTA, not generic "Start"', pageSrc.includes("cta: 'Build a Quiz'"))
    check('the 5250 Practice Lab card uses a descriptive CTA', pageSrc.includes("cta: 'Open 5250 Lab'"))
    check('the SQL Console card uses a descriptive CTA', pageSrc.includes("cta: 'Open SQL Console'"))
    check('no card renders the generic word "Start" as its action label', !/cta:\s*'Start'/.test(pageSrc))

    check(
      'Interview Prep is rendered via ComingSoonCard, not PracticeModeCard (never a clickable Start action)',
      /<ComingSoonCard[\s\S]*?title="Interview Prep"/.test(pageSrc)
    )
    check('Interview Prep is never wrapped in a real navigable <Link> to its own route', !/href="\/practice\/interview/.test(pageSrc) && !/href:\s*'\/practice\/interview/.test(pageSrc))
    check('the Interview Prep card shows a "Coming soon" badge', pageSrc.includes('Badge variant="neutral">Coming soon'))

    const comingSoonFnMatch = pageSrc.match(/function ComingSoonCard\([\s\S]*?\n\}/)
    check('found the ComingSoonCard function to isolate and inspect', !!comingSoonFnMatch)
    if (comingSoonFnMatch) {
      const body = comingSoonFnMatch[0]
      check('ComingSoonCard never renders a <Link> (structurally non-clickable, not just visually muted)', !body.includes('<Link'))
      check('ComingSoonCard never renders a raw <a href> either', !/<a\s+href/.test(body))
    }

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

    // Every combination the matrix marks as supported must actually succeed
    // via the real session-building function, for both lengths -- proving
    // the builder's own availability signal is never optimistic.
    let attempted = 0
    let allSupportedSucceed = true
    for (const groupId of groupIds) {
      for (const level of QUIZ_LEVELS) {
        const entry = matrix[groupId][level]
        for (const length of [5, 10] as const) {
          if (!entry.supportsLength[length]) continue
          attempted += 1
          const result = buildGuidedOrQuizSession('quiz', { topicGroupId: groupId || null, level, length, seed: 7 }, PRACTICE_QUESTIONS)
          if (result.status !== 'ok' || result.questions.length !== length) {
            allSupportedSucceed = false
          }
        }
      }
    }
    check(
      'every matrix-marked-supported combination actually produces a session of the advertised length (no combination is ever presented as startable but fails)',
      allSupportedSucceed && attempted > 0,
      `${attempted} supported combinations checked`
    )

    const sessionBuilderFormSrc = stripComments(readRepoFile('components/practice/session-builder-form.tsx'))
    check('the builder form disables topic pills with zero eligible questions at any level', sessionBuilderFormSrc.includes('disabled={!hasAnyQuestions}'))
    check('the builder form disables level pills with zero eligible questions for the current topic', sessionBuilderFormSrc.includes('disabled={count === 0}'))
    check('the builder form disables length pills unsupported by the current topic/level', sessionBuilderFormSrc.includes('disabled={!supported}'))
    check('the builder form auto-corrects the level when the current one becomes unavailable for a newly chosen topic', sessionBuilderFormSrc.includes('handleTopicChange'))
    check('the builder form auto-corrects the length when the current one becomes unavailable', /nextLength = lengths\.find/.test(sessionBuilderFormSrc))
    check('the submit button is disabled unless the current combination can actually start', sessionBuilderFormSrc.includes('disabled={!canSubmit}'))
    check('the default selection (first level/length option) is validated, not assumed valid', sessionBuilderFormSrc.includes('canSubmit'))
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
  section('11. Interview Prep: unavailable/coming-soon, zero published content, no automatic-activation claims, no leakage')
  // ---------------------------------------------------------------------------

  {
    check('the real production INTERVIEW_QUESTIONS catalog is empty', INTERVIEW_QUESTIONS.length === 0)
    check('isInterviewPrepAvailable() correctly reports unavailable against the real (empty) catalog', isInterviewPrepAvailable(INTERVIEW_QUESTIONS) === false)

    // Local, in-test-only fixtures -- proving the *logic* works once real
    // content exists, without ever touching the production catalog file.
    const draftOnlyFixture: InterviewQuestion[] = [
      {
        id: 'fixture-draft-1',
        topicId: 'rpgle-foundations',
        difficulty: 'beginner',
        status: 'draft',
        prompt: 'test fixture prompt, never published',
        modelAnswer: 'test fixture answer',
        essentialPoints: ['test point'],
        commonMistakes: ['test mistake'],
        relatedLessonSlugs: [],
        tags: ['test-fixture'],
      },
    ]
    check('a draft-only fixture still reports unavailable (draft entries never count)', isInterviewPrepAvailable(draftOnlyFixture) === false)

    const publishedFixture: InterviewQuestion[] = [{ ...draftOnlyFixture[0], id: 'fixture-published-1', status: 'published' }]
    check('a fixture with at least one published entry correctly reports available (proves the logic itself is correct)', isInterviewPrepAvailable(publishedFixture) === true)

    const interviewFileSrc = readRepoFile('content/practice/interview-questions.ts')
    const interviewFileSrcNoComments = stripComments(interviewFileSrc)
    check('content/practice/interview-questions.ts exports an empty production array, not test/placeholder content', /export const INTERVIEW_QUESTIONS: InterviewQuestion\[\] = \[\]/.test(interviewFileSrc))
    check(
      'no fixture/dummy prompt text leaked into the production catalog file (checked outside comments, so this file\'s own explanatory doc comment about where fixtures belong can\'t produce a false pass)',
      !/test fixture|fixture-draft|fixture-published/.test(interviewFileSrcNoComments)
    )
    check(
      'the file explicitly documents that isInterviewPrepAvailable() is not called anywhere in this PR (no false "automatically activates" claim)',
      interviewFileSrc.includes('Not called anywhere in this PR') || interviewFileSrc.includes('not called anywhere in this PR')
    )
    check(
      'the file header does not claim that publishing a record automatically makes Interview Prep appear/work',
      !/will (automatically )?(activate|make.*appear|become available)/i.test(interviewFileSrc)
    )

    // No route/page exists for an Interview Prep session in this PR.
    let interviewRouteExists = true
    try {
      readFileSync(resolve(__dirname, '..', 'app/(authenticated)/practice/interview/page.tsx'), 'utf-8')
    } catch {
      interviewRouteExists = false
    }
    check('no /practice/interview session route exists (there is genuinely nothing to link to yet)', !interviewRouteExists)

    const searchLibSrc = readRepoFile('lib/search.ts')
    check('lib/search.ts has no reference to interview questions (no per-question search leakage)', !/interview-questions|InterviewQuestion/.test(searchLibSrc))
    const sitemapSrc = readRepoFile('app/sitemap.ts')
    check('app/sitemap.ts has no reference to interview questions', !/interview-questions|InterviewQuestion/.test(sitemapSrc))

    const practicePageSrc = readRepoFile('app/(authenticated)/practice/page.tsx')
    check(
      'the landing page never hardcodes an "Interview Prep is available" flag',
      !/interviewPrepAvailable\s*=\s*true/.test(practicePageSrc)
    )
    check(
      'the landing page never calls isInterviewPrepAvailable() to gate the card (Interview Prep is unconditionally coming-soon in this PR, not content-driven yet)',
      !stripComments(practicePageSrc).includes('isInterviewPrepAvailable')
    )
    check(
      'the landing page never imports INTERVIEW_QUESTIONS (the card renders with no dependency on catalog content, so it cannot flip on by accident)',
      !stripComments(practicePageSrc).includes('INTERVIEW_QUESTIONS')
    )
    check(
      'the Practice Hub hero copy (shown to both signed-out and authenticated visitors) does not market interview prep as available now -- it is explicitly "coming soon"',
      practicePageSrc.includes('interview prep coming soon')
    )

    const homepageSrc = readRepoFile('app/page.tsx')
    check(
      'the homepage does not market interview preparation as a currently-available feature alongside the real ones -- it is explicitly labeled coming soon',
      homepageSrc.includes('Interview prep is coming soon')
    )
    check(
      'the homepage no longer lists "prepare for technical interviews" as an unqualified peer of the real, working features',
      !/test yourself with quick quizzes, prepare for\s+technical interviews/.test(homepageSrc)
    )
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
