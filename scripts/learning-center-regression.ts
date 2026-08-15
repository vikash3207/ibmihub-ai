/**
 * Learning Center and 288-Lesson Catalog Simplification -- regression pass.
 * Standalone via `tsx`, no test framework dependency, matching the existing
 * scripts/*-regression.ts style (check/section helpers, pass/fail counter,
 * process.exit(1) on any failure).
 *
 * Two kinds of checks:
 *  - Real function execution against lib/dashboard-metrics.ts's pure
 *    functions (selectContinueLesson, calculateOverallProgress) with
 *    synthetic fixtures -- the exact same functions
 *    app/(authenticated)/dashboard/page.tsx already uses, so a passing
 *    check here is also proof the Learning Center's Start/Continue card
 *    cannot disagree with the Dashboard.
 *  - Source-text checks confirming the duplicate browsing controls this PR
 *    removed are actually gone, the one remaining control
 *    (components/curriculum-sidebar.tsx) is real server-rendered
 *    navigation, and every published lesson stays reachable.
 *
 * Usage:
 *   npm run test:learning-center
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import type { Lesson } from '../lib/lessons'
import { calculateOverallProgress, selectContinueLesson, getTopicLabelForLesson } from '../lib/dashboard-metrics'
import { TOPIC_FILTERS, getTopicById } from '../lib/topics'
import { isDeepDiveAvailable, type DeepDive } from '../lib/deep-dives'

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

/** Strips block/line comments before a check, so a file's own doc comment
 * explaining what it replaced (which legitimately names the old behavior)
 * can't produce a false failure/pass in a plain string search. Same
 * precedent as lib/section-theme.ts's own regression check. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

/** Minimal Lesson fixture -- same shape/style as scripts/dashboard-metrics-regression.ts's. */
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
    master_category_id: null,
    master_subcategory: null,
    secondary_category_ids: null,
    ...overrides,
  } as Lesson
}

async function main() {
  // ---------------------------------------------------------------------------
  section('1. Start/Continue Learning: signed-out and no-progress states')
  // ---------------------------------------------------------------------------

  {
    const lessons = [lesson(1), lesson(2), lesson(3)]

    // Signed-out visitor: no completion data at all -- app/learn/page.tsx
    // passes an empty Set exactly like this for a null `user`.
    const signedOut = calculateOverallProgress(lessons, new Set())
    check('signed-out visitor: 0 completed, not curriculum-complete', signedOut.completedCount === 0 && !signedOut.isCurriculumComplete)
    const signedOutContinue = selectContinueLesson(lessons, new Set(), null)
    check('signed-out visitor: Start action points at lesson 1', signedOutContinue?.id === 'lesson-1')

    // Signed-in, no progress yet: same picture as signed-out for the purposes
    // of this card (isNewLearner path).
    const noProgress = calculateOverallProgress(lessons, new Set())
    check('signed-in, no progress: 0 completed', noProgress.completedCount === 0)
    const noProgressContinue = selectContinueLesson(lessons, new Set(), null)
    check('signed-in, no progress: Start action points at lesson 1 (same as signed-out)', noProgressContinue?.id === 'lesson-1')
  }

  // ---------------------------------------------------------------------------
  section('2. Start/Continue Learning: signed-in with real progress')
  // ---------------------------------------------------------------------------

  {
    const lessons = [lesson(1), lesson(2), lesson(3), lesson(4)]
    const completed = new Set(['lesson-1', 'lesson-2'])

    const overall = calculateOverallProgress(lessons, completed)
    check('2 of 4 completed -> 50%', overall.completedCount === 2 && overall.percent === 50, JSON.stringify(overall))
    check('not curriculum-complete with lessons remaining', !overall.isCurriculumComplete)

    const continueLesson = selectContinueLesson(lessons, completed, 'lesson-2')
    check('Continue action points at the first incomplete lesson after the anchor', continueLesson?.id === 'lesson-3')

    const topicLabel = continueLesson ? getTopicLabelForLesson(continueLesson) : undefined
    check('a topic label is resolvable for the recommended lesson (same helper the Dashboard uses)', typeof topicLabel === 'string')
  }

  // ---------------------------------------------------------------------------
  section('3. Start/Continue Learning: accurate completed-path state')
  // ---------------------------------------------------------------------------

  {
    const lessons = [lesson(1), lesson(2)]
    const completed = new Set(['lesson-1', 'lesson-2'])

    const overall = calculateOverallProgress(lessons, completed)
    check('all lessons complete -> isCurriculumComplete', overall.isCurriculumComplete === true)
    check('100% at curriculum completion', overall.percent === 100)

    const continueLesson = selectContinueLesson(lessons, completed, 'lesson-2')
    check(
      'no lesson is recommended once the curriculum is complete (no misleading "next" lesson)',
      continueLesson === null
    )
  }

  // ---------------------------------------------------------------------------
  section('4. app/learn/page.tsx reuses the Dashboard\'s own progress helpers')
  // ---------------------------------------------------------------------------

  {
    const learnPageSrc = readRepoFile('app/learn/page.tsx')
    const dashboardSrc = readRepoFile('app/(authenticated)/dashboard/page.tsx')

    check(
      "app/learn/page.tsx imports calculateOverallProgress/selectContinueLesson/getTopicLabelForLesson from lib/dashboard-metrics.ts, not a reimplementation",
      /import \{ calculateOverallProgress, selectContinueLesson, getTopicLabelForLesson \} from '@\/lib\/dashboard-metrics'/.test(
        learnPageSrc
      )
    )
    check('Dashboard imports the same calculateOverallProgress/selectContinueLesson functions', /calculateOverallProgress|selectContinueLesson/.test(dashboardSrc))
    check('app/learn/page.tsx defines no second progress-percent/completion calculation of its own', !/Math\.round\(.*completed.*\/.*total/i.test(learnPageSrc))
    check(
      'the completed-path branch never links to a fabricated "next" lesson (no ${continueLesson' + '.slug} inside the isCurriculumComplete branch)',
      (() => {
        const start = learnPageSrc.indexOf('overall.isCurriculumComplete ? (')
        const end = learnPageSrc.indexOf(') : continueLesson ? (')
        const branch = start >= 0 && end > start ? learnPageSrc.slice(start, end) : ''
        return branch.length > 0 && !branch.includes('continueLesson.slug')
      })()
    )
  }

  // ---------------------------------------------------------------------------
  section('5. One primary category-browsing control -- duplicates removed')
  // ---------------------------------------------------------------------------

  {
    const sidebarSrc = readRepoFile('components/curriculum-sidebar.tsx')
    const browserSrc = readRepoFile('components/lesson-browser.tsx')
    const sidebarCodeOnly = stripComments(sidebarSrc)
    const browserCodeOnly = stripComments(browserSrc)

    check('CurriculumSidebar is a Server Component (no "use client")', !sidebarSrc.includes("'use client'"))
    check('CurriculumSidebar has no React state (no useState)', !sidebarCodeOnly.includes('useState'))
    check(
      'LessonBrowser no longer imports TOPIC_FILTERS (the duplicate topic pill row is gone)',
      !browserCodeOnly.includes('TOPIC_FILTERS')
    )
    check(
      'LessonBrowser no longer renders a category <select> (the second, overlapping taxonomy is gone)',
      !browserCodeOnly.includes('<select')
    )
    check('LessonBrowser no longer offers "Browse by category"', !browserCodeOnly.includes('Browse by category'))
    check('LessonBrowser no longer owns topic/category client state', !/useState<string \| null>/.test(browserCodeOnly))
    check(
      'LessonBrowser still keeps free-text search (a different function, not a competing browsing control)',
      browserSrc.includes('Search lessons') && browserSrc.includes('useState')
    )
  }

  // ---------------------------------------------------------------------------
  section('6. CurriculumSidebar: real navigation, catalog-derived counts, clear active state')
  // ---------------------------------------------------------------------------

  {
    const sidebarSrc = readRepoFile('components/curriculum-sidebar.tsx')

    check(
      '"All Topics" is a real link back to the unfiltered catalog',
      sidebarSrc.includes('href="/learn/ibm-i-fundamentals"')
    )
    check(
      'each topic is a real link to a shareable ?topic= URL, not an onClick-only control',
      /href=\{`\/learn\/ibm-i-fundamentals\?topic=\$\{topic\.id\}`\}/.test(sidebarSrc)
    )
    check('no onClick-driven topic selection remains (real navigation only)', !sidebarSrc.includes('onClick'))
    check('active topic is marked for assistive tech via aria-current', sidebarSrc.includes('aria-current'))
    check(
      'topic counts are derived from the `lessons` prop (catalog-derived), not a hardcoded number',
      /\{topicLessons\.length\}/.test(sidebarSrc) && !/topicLessons\.length\s*=\s*\d/.test(sidebarSrc)
    )
    check('the "All Topics" count reflects the real lesson list length', /\{lessons\.length\}/.test(sidebarSrc))
    check('mobile disclosure is still the native, zero-JS <details>/<summary> pattern', sidebarSrc.includes('<details') && sidebarSrc.includes('<summary'))
    check('desktop sidebar stays sticky and lg:-gated, same as before', sidebarSrc.includes('lg:sticky lg:top-20 lg:block'))
  }

  // ---------------------------------------------------------------------------
  section('7. Catalog page: server-side topic filtering, validated via the existing helper')
  // ---------------------------------------------------------------------------

  {
    const catalogSrc = readRepoFile('app/learn/ibm-i-fundamentals/page.tsx')

    check(
      'reads `topic` from searchParams',
      /const \[\{ topic: topicParam \}/.test(catalogSrc) || /searchParams.*topic/.test(catalogSrc)
    )
    check(
      'validates the topic via the existing getTopicById() helper, not a second/duplicate check',
      /getTopicById\(topicParam\)/.test(catalogSrc)
    )
    check('imports getTopicById from lib/topics.ts (reused, not reimplemented)', /import \{ getTopicById \} from '@\/lib\/topics'/.test(catalogSrc))
    check(
      'the unfiltered branch renders every published lesson (no truncation)',
      /const visibleLessons = activeTopic \? lessons\.filter\(activeTopic\.match\) : lessons/.test(catalogSrc)
    )
    check('CurriculumSidebar receives the full, unfiltered lesson list (for accurate counts across all topics)', /<CurriculumSidebar\s+lessons=\{lessons\}/.test(catalogSrc))
  }

  // ---------------------------------------------------------------------------
  section('8. Every published lesson stays reachable; topic taxonomy is unchanged')
  // ---------------------------------------------------------------------------

  {
    // getTopicById is the same validated lookup used by both the catalog
    // page and the lesson reader page (app/learn/ibm-i-fundamentals/[slug]/page.tsx)
    // -- exercised directly here rather than only pattern-matched.
    check('a known topic id resolves', getTopicById('rpgle')?.label === 'RPGLE')
    check('an unknown topic id resolves to undefined (falls back to no filter, never a crash)', getTopicById('not-a-real-topic') === undefined)
    check('a missing topic id resolves to undefined', getTopicById(undefined) === undefined)
    check('TOPIC_FILTERS is untouched by this PR (19 curriculum topics, same taxonomy)', TOPIC_FILTERS.length === 19)

    const lessonPageSrc = readRepoFile('app/learn/ibm-i-fundamentals/[slug]/page.tsx')
    check(
      'the lesson reader page still derives its sidebar topic the same way (untouched)',
      lessonPageSrc.includes('getTopicById(topicParam) ?? getTopicForLesson(lesson)')
    )
  }

  // ---------------------------------------------------------------------------
  section('9. Deep Dives teaser: an accurate "published" count, not the raw catalog size')
  // ---------------------------------------------------------------------------
  //
  // Independent review flagged that app/learn/page.tsx's secondary Deep
  // Dives card read DEEP_DIVES.length -- the size of the WHOLE catalog,
  // including `planned`/`review-ready` entries with no real content yet --
  // and presented it as "Browse N standalone Deep Dives", implying all N
  // were available to read right now. isDeepDiveAvailable() (lib/deep-dives.ts)
  // is the existing, single source of truth for "published" already used by
  // the Deep Dives listing page itself; app/learn/page.tsx now filters
  // through it instead of a second/raw count.

  {
    function deepDive(status: DeepDive['status'], overrides: Partial<DeepDive> = {}): DeepDive {
      return {
        slug: `dd-${status}-${Math.random().toString(36).slice(2, 8)}`,
        title: 'A Deep Dive',
        description: 'Description',
        category: 'rpgle',
        status,
        tags: [],
        ...overrides,
      }
    }

    // Real function execution against a small mixed-status fixture, not
    // just source-text matching -- proves planned/review-ready entries are
    // actually excluded, not merely that the right function name appears.
    const mixedCatalog: DeepDive[] = [
      deepDive('published'),
      deepDive('published'),
      deepDive('planned'),
      deepDive('review-ready'),
      deepDive('planned'),
    ]
    const availableCount = mixedCatalog.filter(isDeepDiveAvailable).length
    check('isDeepDiveAvailable() counts only published entries (2 of 5 in a mixed fixture)', availableCount === 2)
    check('a `planned` entry is never counted as available', !isDeepDiveAvailable(deepDive('planned')))
    check('a `review-ready` entry is never counted as available (still not real, readable content)', !isDeepDiveAvailable(deepDive('review-ready')))
    check('a `published` entry is counted as available', isDeepDiveAvailable(deepDive('published')))

    // Singular/plural copy, exercised against the same helper rather than
    // assumed.
    const onePublished = [deepDive('published'), deepDive('planned')].filter(isDeepDiveAvailable).length
    check('a single available entry resolves to count 1 (singular copy branch)', onePublished === 1)

    const learnPageSrc = readRepoFile('app/learn/page.tsx')
    check(
      'the singular/plural branch is keyed off the computed count (publishedDeepDiveCount === 1 ? \'\' : \'s\')',
      learnPageSrc.includes("publishedDeepDiveCount === 1 ? '' : 's'")
    )
    check(
      "app/learn/page.tsx imports isDeepDiveAvailable from lib/deep-dives.ts, not a second status check",
      /import \{ isDeepDiveAvailable \} from '@\/lib\/deep-dives'/.test(learnPageSrc)
    )
    check(
      'the published count is derived by filtering DEEP_DIVES through isDeepDiveAvailable',
      /const publishedDeepDiveCount = DEEP_DIVES\.filter\(isDeepDiveAvailable\)\.length/.test(learnPageSrc)
    )
    check(
      'the Deep Dives teaser copy uses the computed published count, not raw DEEP_DIVES.length',
      learnPageSrc.includes('Browse {publishedDeepDiveCount} published Deep Dive{publishedDeepDiveCount === 1')
    )
    check(
      'DEEP_DIVES.length is no longer used for the "published Deep Dives" user-facing claim',
      !/Browse \{DEEP_DIVES\.length\}/.test(learnPageSrc)
    )
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Learning Center regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Learning Center regression FAILED.')
    process.exit(1)
  }
  console.log('Learning Center regression passed.')
}

main().catch((err) => {
  console.error('Learning Center regression script crashed:', err)
  process.exit(1)
})
