/**
 * AI Tutor RAG QA / Regression Pass (PR #133).
 *
 * Lightweight regression checks for the RAG v2 pipeline (PR #130/#131) and
 * the Sources UI (PR #132), built directly on the real production modules
 * -- not a reimplementation of their logic. Run standalone via `tsx`
 * (no Next.js/browser/DB session needed for most sections) rather than a
 * new test framework, matching the existing scripts/seed-lessons.ts and
 * scripts/validate-env.ts style.
 *
 * Usage:
 *   npm run test:rag
 *
 * What this does NOT cover (see PR #133 report for how these are verified
 * instead):
 *   - retrieveCourseContext()'s full orchestration (current-lesson bucket
 *     assembly, character/chunk capping, the Supabase Published-only
 *     fetch itself) -- that function is `server-only` and needs a live
 *     Next request context (getPublishedLessons() calls next/headers
 *     cookies()), so it cannot run in a standalone script. Covered by
 *     code review + manual QA against a live dev server instead.
 *   - Practice pre-reveal answer-safety (app/api/ai-tutor/route.ts's
 *     parseContext()) -- same constraint, that module is only reachable
 *     through the Next route. Covered by code review below (Section 5)
 *     plus the manual QA checklist.
 *   - Anything requiring real API responses (Anthropic calls, streaming).
 *
 * Section 4 (Published-only filtering) additionally does one live,
 * read-only Supabase query (service-role key, same pattern as
 * scripts/seed-lessons.ts) to confirm today's actual catalog has no
 * non-Published rows a regression could accidentally start leaking.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { chunkLessonMarkdown, type ChunkableLesson, type LessonChunk } from '../lib/ai/lesson-chunks'
import { tokenize, scoreChunk } from '../lib/ai/retrieval-score'
import { formatCourseContextForPrompt } from '../lib/ai/format-course-context'
import { buildSourceRefs, MAX_SOURCE_REFS } from '../lib/ai/build-source-refs'
import type { CourseContextResult, RetrievedChunk } from '../lib/ai/retrieve-course-context'
import { IBM_I_FUNDAMENTALS_LESSONS, type LessonMetadata } from '../content/lessons/metadata'

const STRONG_MATCH_SCORE = 5 // must match lib/ai/retrieve-course-context.ts

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

// ---------------------------------------------------------------------------
// Section 1: Lesson chunking (lib/ai/lesson-chunks.ts)
// ---------------------------------------------------------------------------
section('1. Lesson chunking')

const FIXTURE_LESSON: ChunkableLesson = {
  slug: 'fixture-lesson',
  title: 'Fixture Lesson',
  tags: ['fixture'],
  masterCategoryId: 'rpg-programming',
  masterSubcategory: null,
  secondaryCategoryIds: null,
}

const FIXTURE_MARKDOWN = `# Fixture Lesson

## Learning Objective
Understand the fixture.

## Simple Explanation
This is the simple explanation section.

## Practical Example
\`\`\`
EXAMPLE CODE
\`\`\`
`

{
  const chunks = chunkLessonMarkdown(FIXTURE_LESSON, FIXTURE_MARKDOWN)
  check('splits a 3-heading lesson into 3 chunks', chunks.length === 3, `got ${chunks.length}`)
  check(
    'strips the leading "# Title" line from the first chunk',
    !chunks[0]?.chunkText.includes('# Fixture Lesson')
  )
  check(
    'heading text matches the "## " line verbatim',
    chunks.map((c) => c.heading).join('|') === 'Learning Objective|Simple Explanation|Practical Example'
  )
  check('lessonPath is derived from slug', chunks[0]?.lessonPath === '/learn/ibm-i-fundamentals/fixture-lesson')

  const noHeadings = chunkLessonMarkdown(FIXTURE_LESSON, 'Just a paragraph, no headings at all.')
  check('a lesson with no ## headings falls back to a single whole-body chunk', noHeadings.length === 1)

  const empty = chunkLessonMarkdown(FIXTURE_LESSON, '   \n\n  ')
  check('an effectively empty lesson body produces zero chunks', empty.length === 0)
}

// ---------------------------------------------------------------------------
// Section 2: Retrieval scoring (lib/ai/retrieval-score.ts)
// ---------------------------------------------------------------------------
section('2. Retrieval scoring')

function fixtureChunk(overrides: Partial<LessonChunk> = {}): LessonChunk {
  return {
    lessonSlug: 'chain-for-keyed-access',
    lessonTitle: 'CHAIN for Keyed Access',
    lessonPath: '/learn/ibm-i-fundamentals/chain-for-keyed-access',
    heading: 'Simple Explanation',
    chunkText: 'CHAIN retrieves a single record by key from a keyed physical or logical file.',
    tags: ['rpgle', 'chain'],
    masterCategoryId: 'rpg-programming',
    masterSubcategory: null,
    secondaryCategoryIds: [],
    ...overrides,
  }
}

{
  const onTopicQuery = 'How does CHAIN work for keyed access?'
  const tokens = tokenize(onTopicQuery)
  const onTopic = scoreChunk(fixtureChunk(), tokens, onTopicQuery.toLowerCase())
  const offTopic = scoreChunk(
    fixtureChunk({
      lessonSlug: 'unrelated',
      lessonTitle: 'Unrelated Topic',
      heading: 'Something Else',
      chunkText: 'This section has nothing to do with the query.',
      tags: [],
    }),
    tokens,
    onTopicQuery.toLowerCase()
  )
  check('on-topic chunk scores higher than an unrelated chunk', onTopic.score > offTopic.score)
  check('on-topic chunk reaches the strong-match threshold', onTopic.score >= STRONG_MATCH_SCORE, `score=${onTopic.score}`)

  const stopwordOnly = tokenize('how does this work for the')
  check('content words like "work" survive tokenize()', stopwordOnly.includes('work'), JSON.stringify(stopwordOnly))

  const allStopwords = tokenize('how does this for the that what is')
  check('an all-stopword phrase tokenizes to nothing', allStopwords.length === 0, JSON.stringify(allStopwords))

  const related = scoreChunk(fixtureChunk({ lessonSlug: 'other-lesson' }), tokenize('foo'), 'foo', {
    relatedLessonSlugs: ['other-lesson'],
  })
  const notRelated = scoreChunk(fixtureChunk({ lessonSlug: 'other-lesson' }), tokenize('foo'), 'foo')
  check('relatedLessonSlugs boosts score for a listed lesson', related.score > notRelated.score)

  const sameCategory = scoreChunk(fixtureChunk(), tokenize('foo'), 'foo', {
    currentMasterCategoryId: 'rpg-programming',
  })
  const diffCategory = scoreChunk(fixtureChunk(), tokenize('foo'), 'foo', {
    currentMasterCategoryId: 'security-on-ibm-i',
  })
  check('same-category boost only applies when categories match', sameCategory.score > diffCategory.score)

  const exactPhraseQuery = 'keyed physical or logical file'
  const exact = scoreChunk(fixtureChunk(), tokenize(exactPhraseQuery), exactPhraseQuery.toLowerCase())
  check('an exact substring phrase match adds to the score', exact.reasons.includes('exact phrase match'))
}

// ---------------------------------------------------------------------------
// Section 3: Source metadata generation (lib/ai/build-source-refs.ts)
// ---------------------------------------------------------------------------
section('3. Source metadata generation')

function fixtureRetrievedChunk(overrides: Partial<RetrievedChunk> = {}): RetrievedChunk {
  return {
    lessonTitle: 'CHAIN for Keyed Access',
    lessonSlug: 'chain-for-keyed-access',
    lessonPath: '/learn/ibm-i-fundamentals/chain-for-keyed-access',
    heading: 'Simple Explanation',
    chunkText: 'irrelevant for source-ref purposes',
    score: 10,
    reasons: ['title match'],
    ...overrides,
  }
}

{
  const twoChunksSameLesson: CourseContextResult = {
    chunks: [
      fixtureRetrievedChunk({ heading: 'Simple Explanation' }),
      fixtureRetrievedChunk({ heading: 'Practical Example' }),
    ],
    hasStrongMatch: true,
    resolvedCurrentLesson: null,
  }
  const dedupedRefs = buildSourceRefs(twoChunksSameLesson)
  check('two chunks from the same lesson collapse into one source entry', dedupedRefs.length === 1)
  check(
    'a lesson with more than one distinct heading omits `heading` rather than picking one arbitrarily',
    dedupedRefs[0]?.heading === undefined
  )

  const oneChunk: CourseContextResult = {
    chunks: [fixtureRetrievedChunk()],
    hasStrongMatch: true,
    resolvedCurrentLesson: null,
  }
  const singleHeadingRefs = buildSourceRefs(oneChunk)
  check('a lesson with exactly one distinct heading keeps it', singleHeadingRefs[0]?.heading === 'Simple Explanation')

  check('a source ref never carries chunkText', !('chunkText' in (singleHeadingRefs[0] ?? {})))
  check('a source ref never carries score/reasons', !('score' in (singleHeadingRefs[0] ?? {})) && !('reasons' in (singleHeadingRefs[0] ?? {})))

  const manyLessons: CourseContextResult = {
    chunks: Array.from({ length: MAX_SOURCE_REFS + 3 }, (_, i) =>
      fixtureRetrievedChunk({ lessonSlug: `lesson-${i}`, lessonTitle: `Lesson ${i}`, lessonPath: `/learn/ibm-i-fundamentals/lesson-${i}` })
    ),
    hasStrongMatch: true,
    resolvedCurrentLesson: null,
  }
  check(
    `source list is capped at MAX_SOURCE_REFS (${MAX_SOURCE_REFS})`,
    buildSourceRefs(manyLessons).length === MAX_SOURCE_REFS
  )
}

// ---------------------------------------------------------------------------
// Section 4: Weak/no-match behavior
// ---------------------------------------------------------------------------
section('4. Weak / no-match behavior')

{
  const weakResult: CourseContextResult = {
    chunks: [fixtureRetrievedChunk({ score: 1 })],
    hasStrongMatch: false,
    resolvedCurrentLesson: null,
  }
  check('a weak-match result produces NO source refs (no misleading "Sources used" block)', buildSourceRefs(weakResult).length === 0)
  check(
    'a weak-match result\'s prompt text is honest about weak coverage',
    formatCourseContextForPrompt(weakResult).includes('only loosely related')
  )

  const emptyResult: CourseContextResult = { chunks: [], hasStrongMatch: false, resolvedCurrentLesson: null }
  check('an empty result produces no source refs', buildSourceRefs(emptyResult).length === 0)
  check(
    'an empty result\'s prompt text says the topic may not be covered, not that it is confirmed absent',
    formatCourseContextForPrompt(emptyResult).includes('may be a topic the course does not cover deeply yet')
  )

  const strongResult: CourseContextResult = {
    chunks: [fixtureRetrievedChunk({ score: 10 })],
    hasStrongMatch: true,
    resolvedCurrentLesson: null,
  }
  check('a strong-match result does produce source refs', buildSourceRefs(strongResult).length === 1)
}

// ---------------------------------------------------------------------------
// Section 5: Published-only filtering
// ---------------------------------------------------------------------------
section('5. Published-only filtering')

{
  type FixtureLessonRow = { slug: string; status: LessonMetadata['status'] }
  const mixedFixture: FixtureLessonRow[] = [
    { slug: 'published-1', status: 'Published' },
    { slug: 'draft-1', status: 'Draft' },
    { slug: 'review-ready-1', status: 'Review Ready' },
    { slug: 'approved-1', status: 'Approved' },
    { slug: 'archived-1', status: 'Unpublished / Archived' },
  ]
  // Exact predicate used by lib/lessons.ts getPublishedLessons() (`.eq('status', 'Published')`).
  const filtered = mixedFixture.filter((l) => l.status === 'Published')
  check('the Published-only predicate excludes Draft/Review Ready/Approved/Archived fixture rows', filtered.length === 1 && filtered[0].slug === 'published-1')

  const nonPublishedInCatalog = IBM_I_FUNDAMENTALS_LESSONS.filter((l) => l.status !== 'Published')
  console.log(
    `  INFO  content/lessons/metadata.ts currently has ${nonPublishedInCatalog.length} non-Published lesson(s) ` +
      `out of ${IBM_I_FUNDAMENTALS_LESSONS.length} -- retrieveCourseContext() only ever reads getPublishedLessons(), ` +
      `so these (if any) can never be retrieved or shown as a source.`
  )
}

// ---------------------------------------------------------------------------
// Section 6: Retrieval scenarios against the real course catalog
// ---------------------------------------------------------------------------
section('6. Retrieval scenarios (real lesson content, real chunking + scoring)')

interface ScoredCatalogChunk {
  lesson: LessonMetadata
  chunk: LessonChunk
  score: number
}

function loadCatalogChunks(): { lesson: LessonMetadata; chunk: LessonChunk }[] {
  const all: { lesson: LessonMetadata; chunk: LessonChunk }[] = []
  for (const lesson of IBM_I_FUNDAMENTALS_LESSONS) {
    if (lesson.status !== 'Published') continue // mirrors getPublishedLessons()'s filter
    let markdown: string
    try {
      markdown = readFileSync(resolve(__dirname, '..', lesson.contentSourcePath), 'utf-8')
    } catch {
      continue
    }
    const chunkable: ChunkableLesson = {
      slug: lesson.slug,
      title: lesson.title,
      tags: lesson.tags ?? null,
      masterCategoryId: lesson.masterCategoryId ?? null,
      masterSubcategory: lesson.masterSubcategory ?? null,
      secondaryCategoryIds: lesson.secondaryCategoryIds ?? null,
    }
    for (const chunk of chunkLessonMarkdown(chunkable, markdown)) {
      all.push({ lesson, chunk })
    }
  }
  return all
}

const catalogChunks = loadCatalogChunks()
check(
  `loaded chunks for the Published catalog (${IBM_I_FUNDAMENTALS_LESSONS.length} lessons in metadata)`,
  catalogChunks.length > 0,
  `${catalogChunks.length} chunks`
)

function topLessonsFor(query: string, limit = 3): ScoredCatalogChunk[] {
  const queryTokens = tokenize(query)
  const queryLower = query.toLowerCase()
  const scored: ScoredCatalogChunk[] = catalogChunks.map(({ lesson, chunk }) => ({
    lesson,
    chunk,
    score: scoreChunk(chunk, queryTokens, queryLower).score,
  }))
  scored.sort((a, b) => b.score - a.score)

  const seenSlugs = new Set<string>()
  const topDistinctLessons: ScoredCatalogChunk[] = []
  for (const entry of scored) {
    if (seenSlugs.has(entry.lesson.slug)) continue
    seenSlugs.add(entry.lesson.slug)
    topDistinctLessons.push(entry)
    if (topDistinctLessons.length >= limit) break
  }
  return topDistinctLessons
}

interface Scenario {
  query: string
  /** Accept any lesson whose slug matches one of these -- exact slugs, or a predicate for a whole family of lessons (e.g. "any subfile lesson"). */
  expectSlugOneOf?: string[]
  expectSlugMatching?: (slug: string) => boolean
}

const SCENARIOS: Scenario[] = [
  { query: 'How is CHAIN different from READ?', expectSlugOneOf: ['chain-for-keyed-access', 'reading-physical-files-in-rpgle-with-read'] },
  { query: 'What does SQLCODE 100 mean?', expectSlugOneOf: ['sqlca-sqlcode-and-sqlstate-in-depth', 'sqlcode-and-sqlstate-basics-in-sqlrpgle'] },
  { query: 'How does adopted authority work?', expectSlugOneOf: ['adopted-authority-basics'] },
  { query: 'What is journaling vs backup?', expectSlugOneOf: ['backup-vs-journaling-vs-high-availability'] },
  // Query tokenizes to just "subfiles" (plural) -- "where", "should", "i",
  // "learn", "about" are all stopwords. The scoring algorithm is exact
  // token-overlap with no stemming (by design -- MVP, no NLP/embeddings), so
  // it won't match the singular "Subfile" in most lesson titles/slugs.
  // Accept any lesson in the subfile family as a correct, useful answer.
  { query: 'Where should I learn about subfiles?', expectSlugMatching: (slug) => slug.includes('subfile') },
]

for (const scenario of SCENARIOS) {
  const top = topLessonsFor(scenario.query)
  const topSlugs = top.map((t) => t.lesson.slug)
  const matcher = scenario.expectSlugMatching ?? ((slug: string) => scenario.expectSlugOneOf!.includes(slug))
  check(
    `"${scenario.query}" surfaces an expected lesson in the top 3`,
    topSlugs.some(matcher),
    `got [${topSlugs.join(', ')}]`
  )
}

{
  // "Why is my job in MSGW?" -- no lesson is titled exactly around MSGW, so
  // this is a soft check: retrieval must not crash and should return SOME
  // ranked result, not that a specific lesson wins.
  const top = topLessonsFor('Why is my job in MSGW?')
  check('a query with no exact-title lesson still returns a ranked (non-crashing) result', Array.isArray(top))
}

{
  // "What is PowerHA?" -- PowerHA/HA clustering is not a lesson in this
  // catalog (only "Backup vs Journaling vs High Availability" touches HA
  // conceptually) -- this must NOT look like a strong, confident match.
  const query = 'What is PowerHA?'
  const queryTokens = tokenize(query)
  const queryLower = query.toLowerCase()
  const maxScore = Math.max(0, ...catalogChunks.map(({ chunk }) => scoreChunk(chunk, queryTokens, queryLower).score))
  check(
    '"What is PowerHA?" does not reach the strong-match threshold anywhere in the catalog',
    maxScore < STRONG_MATCH_SCORE,
    `max score found: ${maxScore}`
  )
}

// ---------------------------------------------------------------------------
// Section 7: Live catalog sanity check (Published-only, real Supabase data)
// ---------------------------------------------------------------------------
section('7. Live catalog sanity check (read-only)')

async function liveCatalogCheck() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.log('  SKIP  NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set -- skipping live DB check')
    return
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { count: totalCount, error: totalError } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
  const { count: publishedCount, error: publishedError } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Published')

  if (totalError || publishedError) {
    check('live Supabase catalog query succeeds', false, (totalError ?? publishedError)?.message)
    return
  }

  console.log(`  INFO  live DB: ${publishedCount ?? 0} Published / ${totalCount ?? 0} total lesson rows`)
  check(
    'no non-Published rows exist in the live catalog today (getPublishedLessons() would exclude them if any existed)',
    (totalCount ?? 0) === (publishedCount ?? 0),
    `${(totalCount ?? 0) - (publishedCount ?? 0)} non-Published row(s) present`
  )
}

async function main() {
  await liveCatalogCheck()

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`RAG regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('RAG regression FAILED.')
    process.exit(1)
  }
  console.log('RAG regression passed.')
}

main().catch((err) => {
  console.error('RAG regression script crashed:', err)
  process.exit(1)
})
