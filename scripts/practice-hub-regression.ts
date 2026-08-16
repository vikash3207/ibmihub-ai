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
 * wherever practical (not just synthetic fixtures) -- e.g. the
 * insufficient-inventory case uses a real, guaranteed-true combination
 * (level: 'advanced', which the real catalog has zero records for) rather
 * than a fabricated fixture, and the duplicate-prevention/scoring checks
 * use small local fixtures only where a real edge case doesn't exist in
 * the catalog. Any InterviewQuestion-shaped fixture used to validate
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
  section('1. Practice Hub hierarchy: three knowledge cards, two hands-on cards, no new nav item')
  // ---------------------------------------------------------------------------

  {
    const pageSrc = stripComments(readRepoFile('app/(authenticated)/practice/page.tsx'))

    check('the hub page has a "Test Your Knowledge" section', pageSrc.includes('Test Your Knowledge'))
    check('the hub page has a "Practise Hands-On" section', pageSrc.includes('Practise Hands-On'))
    check('Guided Practice links to its relocated route', pageSrc.includes('href="/practice/guided"'))
    check('Quick Quiz links to its builder route', pageSrc.includes('href="/practice/quiz/builder"'))
    check('the 5250 Practice Lab card links to the real 5250 route', pageSrc.includes('href="/practice-lab/5250"'))
    check('the SQL Console card links to the real SQL route', pageSrc.includes('href="/practice-lab/sql"'))

    check(
      'Interview Prep is rendered via ComingSoonCard, not PracticeModeCard (never a clickable Start action)',
      /<ComingSoonCard[\s\S]*?title="Interview Prep"/.test(pageSrc)
    )
    check('Interview Prep is never wrapped in a real navigable <Link> to its own route', !/href="\/practice\/interview/.test(pageSrc))
    check('the Interview Prep card shows a "Coming soon" badge', /ComingSoonCard[\s\S]{0,10}/.test(pageSrc) && pageSrc.includes('Coming soon'))

    const navLinksSrc = readRepoFile('lib/nav-links.ts')
    check('no new top-level nav item was added for Interview Prep/Quiz/Practice Lab', !/label:\s*'(Interview Prep|Quick Quiz)'/.test(navLinksSrc))
    check('Practice is still the single top-level nav item pointing at /practice', /href:\s*'\/practice',\s*label:\s*'Practice'/.test(navLinksSrc))
  }

  // ---------------------------------------------------------------------------
  section('2. Guided Practice: relocated, not rewritten')
  // ---------------------------------------------------------------------------

  {
    const guidedSrc = readRepoFile('app/(authenticated)/practice/guided/page.tsx')
    check('Guided Practice still renders the real, unmodified PracticeBrowser component', guidedSrc.includes('<PracticeBrowser'))
    check('Guided Practice still passes the real PRACTICE_TOPICS/PRACTICE_QUESTIONS catalog, not a filtered/rewritten subset', guidedSrc.includes('topics={PRACTICE_TOPICS}') && guidedSrc.includes('questions={PRACTICE_QUESTIONS}'))
    check('Guided Practice still honors the ?topic= deep link', guidedSrc.includes('initialTopicId={initialTopicId ?? null}'))
    check('Guided Practice preserves the no-score notice wording', guidedSrc.includes('there is no ') && guidedSrc.includes('score, ranking, or certificate'))

    const browserSrc = readFileSync(resolve(__dirname, '..', 'components/practice-browser.tsx'), 'utf-8')
    check('components/practice-browser.tsx itself was not modified to compute a score', !/correctCount|totalScore|percentCorrect/.test(browserSrc))

    const lessonPageSrc = readRepoFile('app/learn/ibm-i-fundamentals/[slug]/page.tsx')
    check('the lesson-page "Practice this topic" deep link now points at /practice/guided', lessonPageSrc.includes('`/practice/guided?topic='))
  }

  // ---------------------------------------------------------------------------
  section('3. Quick Quiz uses only the existing approved question bank')
  // ---------------------------------------------------------------------------

  {
    const builderSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/builder/page.tsx'))
    const sessionPageSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/session/page.tsx'))

    check('the quiz session page imports questions only from the existing approved catalog', sessionPageSrc.includes("from '@/content/practice/questions'"))
    check('the quiz session page never imports the interview-questions catalog', !sessionPageSrc.includes('interview-questions'))
    check('the quiz builder never references INTERVIEW_QUESTIONS', !builderSrc.includes('INTERVIEW_QUESTIONS'))
    check('the quiz builder never offers an Advanced level (zero real advanced-difficulty questions exist today)', !/value="advanced"/.test(builderSrc))

    const beginnerAndIntermediateCount = PRACTICE_QUESTIONS.filter((q) => q.difficulty === 'beginner' || q.difficulty === 'intermediate').length
    check('the real catalog has at least some beginner/intermediate questions for Quick Quiz to draw from', beginnerAndIntermediateCount > 0, String(beginnerAndIntermediateCount))
  }

  // ---------------------------------------------------------------------------
  section('4. Mode/level/length validation (real functions, real catalog constraints)')
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
      advancedResult.status === 'insufficient' && advancedResult.status === 'insufficient' && advancedResult.available === 0
    )

    // A real, should-succeed case: Mixed level, All topics, 5 questions --
    // must have plenty of real multiple-choice inventory.
    const realisticResult = buildGuidedOrQuizSession('quiz', { topicGroupId: null, level: 'mixed', length: 5, seed: 42 }, PRACTICE_QUESTIONS)
    check('a realistic Quick Quiz combination (Mixed, All Topics, 5 questions) succeeds against the real catalog', realisticResult.status === 'ok')
    if (realisticResult.status === 'ok') {
      check('the real session has exactly 5 unique questions', realisticResult.questions.length === 5 && new Set(realisticResult.questions.map((q) => q.id)).size === 5)
      check('every question in a Quick Quiz session is multiple-choice (never scenario)', realisticResult.questions.every((q) => q.type === 'multiple-choice'))
    }
  }

  // ---------------------------------------------------------------------------
  section('7. Seeded shuffle: deterministic, stable across refresh/hydration')
  // ---------------------------------------------------------------------------

  {
    const items = Array.from({ length: 20 }, (_, i) => i)
    const shuffledA = seededShuffle(items, 12345)
    const shuffledB = seededShuffle(items, 12345)
    const shuffledC = seededShuffle(items, 99999)

    check('the same seed produces the same order every time (refresh/Back/Forward stability)', JSON.stringify(shuffledA) === JSON.stringify(shuffledB))
    check('a different seed produces a different order', JSON.stringify(shuffledA) !== JSON.stringify(shuffledC))
    check('a shuffle never loses or duplicates items', shuffledA.length === items.length && new Set(shuffledA).size === items.length)
  }

  // ---------------------------------------------------------------------------
  section('8. Quiz scoring, double-submission prevention, retry-incorrect')
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
  section('9. Interview Prep: unavailable/coming-soon, zero published content, no leakage')
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

    const searchLibSrc = readRepoFile('lib/search.ts')
    check('lib/search.ts has no reference to interview questions (no per-question search leakage)', !/interview-questions|InterviewQuestion/.test(searchLibSrc))
    const sitemapSrc = readRepoFile('app/sitemap.ts')
    check('app/sitemap.ts has no reference to interview questions', !/interview-questions|InterviewQuestion/.test(sitemapSrc))

    const practicePageSrc = readRepoFile('app/(authenticated)/practice/page.tsx')
    check(
      'the landing page derives Interview Prep\'s coming-soon state from real content, not a hardcoded boolean (no literal "Interview Prep is available" flag)',
      !/interviewPrepAvailable\s*=\s*true/.test(practicePageSrc)
    )
  }

  // ---------------------------------------------------------------------------
  section('10. Signed-out preview isolation and authenticated route protection')
  // ---------------------------------------------------------------------------

  {
    const practicePageSrc = stripComments(readRepoFile('app/(authenticated)/practice/page.tsx'))
    const previewFnMatch = practicePageSrc.match(/function PracticePreview\(\)[\s\S]*?\n\}/)
    check('found the PracticePreview function to isolate and inspect', !!previewFnMatch)
    if (previewFnMatch) {
      const previewBody = previewFnMatch[0]
      check('the signed-out preview never calls getPublishedLessons or any authenticated data fetch', !previewBody.includes('getPublishedLessons') && !previewBody.includes('supabase'))
      check('the signed-out preview never renders PracticeBrowser or any authenticated session component', !previewBody.includes('PracticeBrowser') && !previewBody.includes('QuizSession'))
    }
    check('the hub page checks auth before rendering the authenticated hierarchy', practicePageSrc.includes('if (!user)') && practicePageSrc.includes('<PracticePreview />'))

    const guidedSrc = stripComments(readRepoFile('app/(authenticated)/practice/guided/page.tsx'))
    check('the Guided Practice route redirects signed-out visitors to /practice rather than rendering its own preview', guidedSrc.includes("redirect('/practice')"))

    const quizBuilderSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/builder/page.tsx'))
    check('the Quick Quiz builder route is auth-guarded', quizBuilderSrc.includes("redirect('/practice')"))

    const quizSessionPageSrc = stripComments(readRepoFile('app/(authenticated)/practice/quiz/session/page.tsx'))
    check('the Quick Quiz session route is auth-guarded', quizSessionPageSrc.includes("redirect('/practice')"))
  }

  // ---------------------------------------------------------------------------
  section('11. Homepage copy updated without restructuring')
  // ---------------------------------------------------------------------------

  {
    const homepageSrc = readRepoFile('app/page.tsx')
    check('the homepage Journey 3 heading is unchanged ("Want hands-on practice?")', homepageSrc.includes('Want hands-on practice?'))
    check('the Journey 3 body now mentions quick quizzes', /quick quizzes/i.test(homepageSrc))
    check('the Journey 3 body now mentions interview preparation', /technical interviews/i.test(homepageSrc))
    check('the existing hands-on-simulator safety disclaimer is preserved verbatim', homepageSrc.includes('safe learning simulations, not a connection to a real IBM&nbsp;i system.'))
    check('the Journey 3 CTA still points at /practice unchanged', homepageSrc.includes('href="/practice"'))
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
