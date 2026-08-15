/**
 * AI Tutor RAG QA / Regression Pass (PR #133; generalized beyond lessons by
 * AI Tutor Insights/Deep Dives Grounding).
 *
 * Lightweight regression checks for the RAG v2 pipeline (PR #130/#131, now
 * spanning lessons + Insights + Deep Dives) and the Sources UI (PR #132),
 * built directly on the real production modules -- not a reimplementation
 * of their logic. Run standalone via `tsx` (no Next.js/browser/DB session
 * needed for most sections) rather than a new test framework, matching the
 * existing scripts/seed-lessons.ts and scripts/validate-env.ts style.
 *
 * Usage:
 *   npm run test:rag
 *
 * What this does NOT cover (see PR #133 report, and the AI Tutor
 * Insights/Deep Dives Grounding PR notes, for how these are verified
 * instead):
 *   - retrievePublishedContent()'s full orchestration (gathering all three
 *     content sources, the character/chunk capping across them, the
 *     Supabase Published-only lesson fetch itself) -- that function is
 *     `server-only` and needs a live Next request context
 *     (getPublishedLessons() calls next/headers cookies()), so it cannot
 *     run in a standalone script. Its guaranteed-current-page mechanism is
 *     covered directly, though: selectGuaranteedChunks() (lib/ai/
 *     retrieval-score.ts) is the exact, pure function that mechanism calls,
 *     extracted specifically so it can be exercised here against real
 *     Insight/Deep Dive markdown (Section 3/8 below) without needing the
 *     server-only wrapper. The rest of the orchestration is covered by code
 *     review + manual QA against a live dev server.
 *   - Practice pre-reveal answer-safety (app/api/ai-tutor/route.ts's
 *     parseContext()) -- same constraint, that module is only reachable
 *     through the Next route. Covered by code review plus the manual QA
 *     checklist, and by scripts/ai-tutor-context-regression.ts's source-level
 *     assertions against the route file.
 *   - Anything requiring real API responses (Anthropic calls, streaming).
 *
 * Section 7 (Published-only filtering) additionally does one live,
 * read-only Supabase query (service-role key, same pattern as
 * scripts/seed-lessons.ts) to confirm today's actual lesson catalog has no
 * non-Published rows a regression could accidentally start leaking.
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { chunkMarkdownContent, INTRODUCTION_HEADING, type ChunkableContent, type ContentChunk } from '../lib/ai/content-chunks'
import { tokenize, scoreChunk, selectGuaranteedChunks } from '../lib/ai/retrieval-score'
import { formatRetrievedContentForPrompt } from '../lib/ai/format-retrieved-content'
import { buildSourceRefs, MAX_SOURCE_REFS } from '../lib/ai/build-source-refs'
import type { RetrievalResult, RetrievedChunk } from '../lib/ai/retrieve-published-content'
import type { AiContentType } from '../components/ai-tutor/types'
import { IBM_I_FUNDAMENTALS_LESSONS, type LessonMetadata } from '../content/lessons/metadata'
import { INSIGHTS } from '../content/insights/catalog'
import { isInsightAvailable } from '../lib/insights'
import { DEEP_DIVES } from '../content/deep-dives/catalog'
import { isDeepDiveAvailable } from '../lib/deep-dives'

const STRONG_MATCH_SCORE = 5 // must match lib/ai/retrieve-published-content.ts
const CURRENT_CONTENT_MAX_CHUNKS = 3 // must match lib/ai/retrieve-published-content.ts
const CURRENT_CONTENT_MAX_CHARS = 3000 // must match lib/ai/retrieve-published-content.ts

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
// Section 1: Content chunking (lib/ai/content-chunks.ts), all three content types
// ---------------------------------------------------------------------------
section('1. Content chunking (generalized: lesson, insight, deep-dive)')

const FIXTURE_LESSON: ChunkableContent = {
  contentType: 'lesson',
  slug: 'fixture-lesson',
  title: 'Fixture Lesson',
  path: '/learn/ibm-i-fundamentals/fixture-lesson',
  tags: ['fixture'],
  masterCategoryId: 'rpg-programming',
  masterSubcategory: null,
  secondaryCategoryIds: [],
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
  const chunks = chunkMarkdownContent(FIXTURE_LESSON, FIXTURE_MARKDOWN)
  check('splits a 3-heading lesson into 3 chunks', chunks.length === 3, `got ${chunks.length}`)
  check(
    'strips the leading "# Title" line from the first chunk',
    !chunks[0]?.chunkText.includes('# Fixture Lesson')
  )
  check(
    'heading text matches the "## " line verbatim',
    chunks.map((c) => c.heading).join('|') === 'Learning Objective|Simple Explanation|Practical Example'
  )
  check('path is carried through from the input, not derived internally', chunks[0]?.path === '/learn/ibm-i-fundamentals/fixture-lesson')
  check('contentType is carried through', chunks.every((c) => c.contentType === 'lesson'))

  const noHeadings = chunkMarkdownContent(FIXTURE_LESSON, 'Just a paragraph, no headings at all.')
  check('content with no ## headings falls back to a single whole-body chunk', noHeadings.length === 1)

  const empty = chunkMarkdownContent(FIXTURE_LESSON, '   \n\n  ')
  check('effectively empty content produces zero chunks', empty.length === 0)
}

{
  // Insights and Deep Dives never have a leading "# Title" line (the
  // catalog carries the title instead -- see content/insights/catalog.ts's
  // and content/deep-dives/catalog.ts's header comments), and their real
  // articles use ## as the major-section level, exactly like lessons.
  const fixtureInsight: ChunkableContent = {
    contentType: 'insight',
    slug: 'fixture-insight',
    title: 'Fixture Insight',
    path: '/insights/fixture-insight',
    tags: ['fixture'],
    masterCategoryId: null,
    masterSubcategory: null,
    secondaryCategoryIds: [],
  }
  const insightMarkdown = `Intro paragraph, no heading.

## What You Will Learn

Some content.

## Quick Reference

More content.
`
  const chunks = chunkMarkdownContent(fixtureInsight, insightMarkdown)
  check('an Insight with leading intro text produces 3 chunks: Introduction + 2 headings', chunks.length === 3, `got ${chunks.length}`)
  check('the leading intro text becomes its own Introduction chunk, first in order', chunks[0]?.heading === INTRODUCTION_HEADING && chunks[0]?.chunkText === 'Intro paragraph, no heading.')
  check('Insight chunks carry contentType insight', chunks.every((c) => c.contentType === 'insight'))
  check('Insight chunk path is /insights/<slug>', chunks[0]?.path === '/insights/fixture-insight')

  const fixtureDeepDive: ChunkableContent = { ...fixtureInsight, contentType: 'deep-dive', slug: 'fixture-deep-dive', path: '/deep-dives/fixture-deep-dive' }
  const deepDiveChunks = chunkMarkdownContent(fixtureDeepDive, insightMarkdown)
  check('Deep Dive chunks carry contentType deep-dive', deepDiveChunks.every((c) => c.contentType === 'deep-dive'))
  check('Insight/Deep Dive chunks have null masterCategoryId (no taxonomy for those content types)', chunks.every((c) => c.masterCategoryId === null) && deepDiveChunks.every((c) => c.masterCategoryId === null))

  const noLeadingText = chunkMarkdownContent(fixtureInsight, '## What You Will Learn\n\nSome content.\n')
  check('content with no text before the first heading produces no Introduction chunk', !noLeadingText.some((c) => c.heading === INTRODUCTION_HEADING) && noLeadingText.length === 1)

  const onlyWhitespaceBeforeHeading = chunkMarkdownContent(fixtureInsight, '   \n\n## What You Will Learn\n\nSome content.\n')
  check('only-whitespace content before the first heading also produces no Introduction chunk', !onlyWhitespaceBeforeHeading.some((c) => c.heading === INTRODUCTION_HEADING))
}

// ---------------------------------------------------------------------------
// Section 1b: Introduction-chunk preservation against real content (PR
// review finding: leading prose before the first ## was silently dropped,
// never chunked or retrievable -- confirmed real, substantial loss in both
// named Insights below, ~900 characters each).
// ---------------------------------------------------------------------------
section('1b. Introduction-chunk preservation (real QSYS2 and RPG-modernization Insights)')

{
  const qsys2Slug = 'db2-for-i-qsys2-services-developers-should-know'
  const rpgSlug = 'modernizing-rpg-applications-with-sql-and-apis'

  for (const slug of [qsys2Slug, rpgSlug]) {
    const insight = INSIGHTS.find((i) => i.slug === slug && isInsightAvailable(i))
    check(`${slug} is genuinely published (test fixture sanity check)`, insight !== undefined)
    if (!insight) continue

    const markdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${slug}.md`), 'utf-8')
    const firstHeadingIndex = markdown.search(/^##\s+/m)
    check(`${slug} genuinely has real leading content before its first ## (test fixture sanity check)`, firstHeadingIndex > 100, `first ## at index ${firstHeadingIndex}`)

    const chunkable: ChunkableContent = {
      contentType: 'insight',
      slug: insight.slug,
      title: insight.title,
      path: `/insights/${insight.slug}`,
      tags: insight.tags,
      masterCategoryId: null,
      masterSubcategory: null,
      secondaryCategoryIds: [],
    }
    const chunks = chunkMarkdownContent(chunkable, markdown)
    const introChunks = chunks.filter((c) => c.heading === INTRODUCTION_HEADING)
    check(`${slug} produces at least one Introduction chunk from its real leading prose`, introChunks.length > 0, `${introChunks.length} Introduction chunk(s)`)
    check(`${slug}'s Introduction chunk is a real excerpt of the actual leading markdown, not empty/placeholder`, (introChunks[0]?.chunkText.length ?? 0) > 50)
    check(`${slug}'s Introduction chunk comes first, before any other heading's chunk`, chunks[0]?.heading === INTRODUCTION_HEADING)
  }
}

// ---------------------------------------------------------------------------
// Section 1c: Oversized-section-safe chunking (PR review finding: a single
// large ## section could exceed both the 3,000-character current-page
// budget and the 8,000-character overall retrieval budget, since both
// consumer loops in retrieve-published-content.ts always admit at least one
// candidate chunk regardless of its size, to guarantee a non-empty result).
// ---------------------------------------------------------------------------
section('1c. Oversized-section-safe chunking (subsection/paragraph/code-block-aware)')

const MAX_CHUNK_CHARS_UNDER_TEST = 2000 // must match lib/ai/content-chunks.ts's MAX_CHUNK_CHARS

{
  // Synthetic fixture: one oversized ## section with two ### subsections,
  // one of which is itself still oversized and must fall back to
  // paragraph-level splitting -- including a code block that must never be
  // split mid-fence even though it pushes a paragraph over budget alone.
  const bigParagraph = (label: string, chars: number) => `${label} ${'x'.repeat(chars)}`
  const codeBlock = ['```rpgle', ...Array.from({ length: 40 }, (_, i) => `  // line ${i} of a long code sample that must stay intact`), '```'].join('\n')

  const oversizedFixtureMarkdown = `## Big Section

### First Subsection
${bigParagraph('First subsection intro.', 500)}

${bigParagraph('Second paragraph of the first subsection, still short enough alone.', 400)}

### Second Subsection
${bigParagraph('A subsection that is oversized all on its own and must be paragraph-split.', 1200)}

${bigParagraph('A second paragraph in the same oversized subsection.', 1200)}

${codeBlock}

## Small Section
A short section that never needs splitting.
`

  const fixtureContent: ChunkableContent = {
    contentType: 'deep-dive',
    slug: 'fixture-oversized',
    title: 'Fixture Oversized Deep Dive',
    path: '/deep-dives/fixture-oversized',
    tags: [],
    masterCategoryId: null,
    masterSubcategory: null,
    secondaryCategoryIds: [],
  }

  const chunks = chunkMarkdownContent(fixtureContent, oversizedFixtureMarkdown)

  check('no chunk exceeds MAX_CHUNK_CHARS, even from a deliberately oversized section', chunks.every((c) => c.chunkText.length <= MAX_CHUNK_CHARS_UNDER_TEST), `sizes: ${chunks.map((c) => c.chunkText.length).join(', ')}`)
  check('the oversized section splits along its real ### subsection boundaries first', chunks.some((c) => c.heading === 'Big Section — First Subsection') && chunks.some((c) => c.heading.startsWith('Big Section — Second Subsection')))
  check('a subsection that is itself still oversized gets further paragraph-split, keeping its own heading', chunks.filter((c) => c.heading === 'Big Section — Second Subsection').length > 1)
  check('a small section that was never oversized is left as a single, unsplit chunk', chunks.some((c) => c.heading === 'Small Section' && c.chunkText === 'A short section that never needs splitting.'))

  const codeChunks = chunks.filter((c) => c.chunkText.includes('```'))
  check('every chunk containing a fence has an even number of ``` markers (no dangling/unterminated fence)', codeChunks.every((c) => (c.chunkText.match(/```/g) ?? []).length % 2 === 0))
  check('a fenced code block is never split mid-fence -- opening and closing fences stay in the same chunk', codeChunks.some((c) => c.chunkText.includes('```rpgle') && (c.chunkText.match(/```/g) ?? []).length === 2))

  // This fixture's code block (40 lines, ~2.4KB) is deliberately larger
  // than MAX_CHUNK_CHARS on its own -- confirms the re-fencing path (not
  // just the "small enough to stay whole" path) is actually exercised.
  const totalFenceMarkers = codeChunks.reduce((sum, c) => sum + (c.chunkText.match(/```/g) ?? []).length, 0)
  check('an oversized code block that cannot fit in one chunk is re-split into more than one well-formed fenced piece', codeChunks.length > 1 && totalFenceMarkers === codeChunks.length * 2, `${codeChunks.length} fenced chunks, ${totalFenceMarkers} total fence markers`)
}

{
  // Real content: content/deep-dives/sql-error-handling-on-ibm-i.md (the
  // largest published Deep Dive, ~88KB) has several real ## sections well
  // over both budgets -- up to 8,778 characters in "5. Production SQLRPGLE
  // error-handling patterns" alone, confirmed by direct inspection before
  // writing this fixture.
  const slug = 'sql-error-handling-on-ibm-i'
  const deepDive = DEEP_DIVES.find((d) => d.slug === slug && isDeepDiveAvailable(d))
  check(`${slug} is genuinely published (test fixture sanity check)`, deepDive !== undefined)

  if (deepDive) {
    const markdown = readFileSync(resolve(__dirname, '..', 'content', 'deep-dives', `${slug}.md`), 'utf-8')

    // Confirm the raw, unchunked source really does contain an oversized
    // section, so this test can't silently pass just because the fixture
    // content changed under it.
    const rawSectionMatches = [...markdown.matchAll(/^##\s+(.+)$/gm)]
    const rawSectionSizes = rawSectionMatches.map((m, i) => {
      const start = m.index! + m[0].length
      const end = i + 1 < rawSectionMatches.length ? rawSectionMatches[i + 1].index! : markdown.length
      return end - start
    })
    check('the real fixture Deep Dive genuinely has at least one raw ## section over both the 3,000 and 8,000-character budgets', Math.max(...rawSectionSizes) > 8000, `largest raw section: ${Math.max(...rawSectionSizes)} chars`)

    const chunkable: ChunkableContent = {
      contentType: 'deep-dive',
      slug: deepDive.slug,
      title: deepDive.title,
      path: `/deep-dives/${deepDive.slug}`,
      tags: deepDive.tags,
      masterCategoryId: null,
      masterSubcategory: null,
      secondaryCategoryIds: [],
    }
    const chunks = chunkMarkdownContent(chunkable, markdown)

    check('every chunk from the real oversized Deep Dive stays within MAX_CHUNK_CHARS', chunks.every((c) => c.chunkText.length <= MAX_CHUNK_CHARS_UNDER_TEST), `largest chunk: ${Math.max(...chunks.map((c) => c.chunkText.length))} chars`)
    check('every chunk therefore also fits within the tighter 3,000-character current-page budget', chunks.every((c) => c.chunkText.length <= CURRENT_CONTENT_MAX_CHARS))
    check('splitting an oversized section produces more than one chunk (content is preserved, not truncated away)', chunks.length > rawSectionMatches.length, `${chunks.length} chunks from ${rawSectionMatches.length} raw ## sections`)

    // No content is silently dropped: every chunk's total character count
    // (joined) should roughly match the total raw section content (allowing
    // for trimmed whitespace/blank lines between paragraphs).
    const totalChunkChars = chunks.reduce((sum, c) => sum + c.chunkText.length, 0)
    const totalRawChars = rawSectionSizes.reduce((sum, n) => sum + n, 0)
    check('splitting does not silently drop a meaningful amount of content (within 10% of the raw total)', totalChunkChars >= totalRawChars * 0.9, `chunked: ${totalChunkChars}, raw: ${totalRawChars}`)

    // The specific real bug this section's tests caught during development:
    // "13. Legacy patterns and modern recommendations" is a markdown
    // comparison table with no blank lines between rows -- one atomic
    // paragraph with no natural break at all -- and was the first real
    // content to exceed MAX_CHUNK_CHARS (2,844 chars) even after subsection/
    // paragraph splitting. Pin it directly: every resulting piece from that
    // section must stay within budget AND never break a table row in half
    // (a row is one line; every non-empty line of the raw section must
    // appear whole inside exactly one resulting chunk's text).
    const legacyIndex = rawSectionMatches.findIndex((m) => m[1].trim().startsWith('13. Legacy patterns'))
    check('the specific real section that originally caught this bug is still present in the fixture', legacyIndex >= 0)
    if (legacyIndex >= 0) {
      const legacyChunks = chunks.filter((c) => c.heading === rawSectionMatches[legacyIndex][1].trim())
      check('the table-only oversized section produces more than one chunk', legacyChunks.length > 1, `${legacyChunks.length} chunks`)
      check('every piece of the table-only section stays within MAX_CHUNK_CHARS', legacyChunks.every((c) => c.chunkText.length <= MAX_CHUNK_CHARS_UNDER_TEST))

      const start = rawSectionMatches[legacyIndex].index! + rawSectionMatches[legacyIndex][0].length
      const end = legacyIndex + 1 < rawSectionMatches.length ? rawSectionMatches[legacyIndex + 1].index! : markdown.length
      const rawLines = markdown.slice(start, end).split('\n').map((l) => l.trim()).filter(Boolean)
      const chunkedText = legacyChunks.map((c) => c.chunkText).join('\n')
      const brokenRows = rawLines.filter((line) => line.startsWith('|') && !chunkedText.includes(line))
      check('no table row from the oversized section is broken across a split (every original row appears whole)', brokenRows.length === 0, `${brokenRows.length} row(s) not found intact: ${brokenRows.slice(0, 2).join(' | ')}`)
    }
  }
}

// ---------------------------------------------------------------------------
// Section 2: Retrieval scoring (lib/ai/retrieval-score.ts), generalized
// ---------------------------------------------------------------------------
section('2. Retrieval scoring (generalized over ContentChunk)')

function fixtureChunk(overrides: Partial<ContentChunk> = {}): ContentChunk {
  return {
    contentType: 'lesson',
    slug: 'chain-for-keyed-access',
    title: 'CHAIN for Keyed Access',
    path: '/learn/ibm-i-fundamentals/chain-for-keyed-access',
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
      slug: 'unrelated',
      title: 'Unrelated Topic',
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

  const related = scoreChunk(fixtureChunk({ slug: 'other-lesson' }), tokenize('foo'), 'foo', {
    relatedLessonSlugs: ['other-lesson'],
  })
  const notRelated = scoreChunk(fixtureChunk({ slug: 'other-lesson' }), tokenize('foo'), 'foo')
  check('relatedLessonSlugs boosts score for a listed lesson', related.score > notRelated.score)

  const relatedInsightSameSlug = scoreChunk(
    fixtureChunk({ contentType: 'insight', slug: 'other-lesson', masterCategoryId: null }),
    tokenize('foo'),
    'foo',
    { relatedLessonSlugs: ['other-lesson'] }
  )
  check(
    'relatedLessonSlugs boost never applies to a non-lesson chunk, even with a coincidentally matching slug',
    relatedInsightSameSlug.score === notRelated.score && relatedInsightSameSlug.score < related.score
  )

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
// Section 3: Guaranteed-chunk selection (lib/ai/retrieval-score.ts's
// selectGuaranteedChunks) -- the exact pure mechanism
// retrievePublishedContent() uses for "current page always grounds"
// ---------------------------------------------------------------------------
section('3. Guaranteed-chunk selection (the current-page grounding mechanism, in isolation)')

{
  const chunks = [
    fixtureChunk({ heading: 'A', chunkText: 'first section text' }),
    fixtureChunk({ heading: 'B', chunkText: 'second section text' }),
    fixtureChunk({ heading: 'C', chunkText: 'third section text' }),
    fixtureChunk({ heading: 'D', chunkText: 'fourth section text' }),
  ]

  // A query with zero keyword overlap against any of these chunks -- every
  // score comes out 0, exactly the "explain this in simpler terms" case.
  const zeroOverlapScored = chunks.map((c) => scoreChunk(c, tokenize('completely unrelated gibberish query'), 'completely unrelated gibberish query'))
  check('every chunk scores 0 against a genuinely unrelated query (test setup sanity check)', zeroOverlapScored.every((s) => s.score === 0))

  const selected = selectGuaranteedChunks(zeroOverlapScored, { maxChunks: 3, maxChars: 10_000 })
  check('a zero-relevance query still returns chunks (the guarantee itself)', selected.length > 0, `got ${selected.length}`)
  check('selection keeps the original chunk order when every score is 0 (not an arbitrary/unstable sort)', selected.map((s) => s.chunk.heading).join('') === 'ABC')
  check('selection respects the maxChunks cap even with headroom left in maxChars', selected.length === 3)

  const onTopicScored = chunks.map((c, i) =>
    scoreChunk({ ...c, chunkText: i === 2 ? 'CHAIN retrieves a single record by key' : c.chunkText }, tokenize('CHAIN keyed record'), 'chain keyed record')
  )
  const onTopicSelected = selectGuaranteedChunks(onTopicScored, { maxChunks: 3, maxChars: 10_000 })
  check(
    'when scores differ, selection ranks by score (not original order) -- the on-topic chunk (C, index 2) comes first',
    onTopicSelected[0]?.chunk.heading === 'C'
  )

  const tinyBudget = selectGuaranteedChunks(zeroOverlapScored, { maxChunks: 10, maxChars: 15 })
  check(
    'a character budget too small for a second chunk still keeps at least the first one (never an empty guaranteed bucket just because of the char cap)',
    tinyBudget.length === 1
  )
}

// ---------------------------------------------------------------------------
// Section 4: Source metadata generation (lib/ai/build-source-refs.ts), generalized
// ---------------------------------------------------------------------------
section('4. Source metadata generation (generalized: contentType/title/slug/path)')

function fixtureRetrievedChunk(overrides: Partial<RetrievedChunk> = {}): RetrievedChunk {
  return {
    contentType: 'lesson',
    title: 'CHAIN for Keyed Access',
    slug: 'chain-for-keyed-access',
    path: '/learn/ibm-i-fundamentals/chain-for-keyed-access',
    heading: 'Simple Explanation',
    chunkText: 'irrelevant for source-ref purposes',
    score: 10,
    reasons: ['title match'],
    ...overrides,
  }
}

{
  const twoChunksSameLesson: RetrievalResult = {
    chunks: [
      fixtureRetrievedChunk({ heading: 'Simple Explanation' }),
      fixtureRetrievedChunk({ heading: 'Practical Example' }),
    ],
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  const dedupedRefs = buildSourceRefs(twoChunksSameLesson)
  check('two chunks from the same lesson collapse into one source entry', dedupedRefs.length === 1)
  check(
    'an item with more than one distinct heading omits `heading` rather than picking one arbitrarily',
    dedupedRefs[0]?.heading === undefined
  )

  const oneChunk: RetrievalResult = {
    chunks: [fixtureRetrievedChunk()],
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  const singleHeadingRefs = buildSourceRefs(oneChunk)
  check('an item with exactly one distinct heading keeps it', singleHeadingRefs[0]?.heading === 'Simple Explanation')
  check('a source ref carries contentType', singleHeadingRefs[0]?.contentType === 'lesson')
  check('a source ref carries title/slug/path (generalized field names, not lesson-prefixed)', singleHeadingRefs[0]?.title === 'CHAIN for Keyed Access' && singleHeadingRefs[0]?.slug === 'chain-for-keyed-access' && singleHeadingRefs[0]?.path === '/learn/ibm-i-fundamentals/chain-for-keyed-access')

  check('a source ref never carries chunkText', !('chunkText' in (singleHeadingRefs[0] ?? {})))
  check('a source ref never carries score/reasons', !('score' in (singleHeadingRefs[0] ?? {})) && !('reasons' in (singleHeadingRefs[0] ?? {})))

  // A lesson and an Insight could theoretically share a slug string across
  // their independent, separately-maintained catalogs -- dedupe must be
  // keyed on (contentType, slug), not slug alone, or one would silently
  // swallow the other.
  const collidingSlugs: RetrievalResult = {
    chunks: [
      fixtureRetrievedChunk({ contentType: 'lesson', slug: 'shared-slug', title: 'A Lesson', path: '/learn/ibm-i-fundamentals/shared-slug' }),
      fixtureRetrievedChunk({ contentType: 'insight', slug: 'shared-slug', title: 'An Insight', path: '/insights/shared-slug' }),
    ],
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  const collidingRefs = buildSourceRefs(collidingSlugs)
  check('a lesson and an Insight sharing the same slug string produce two distinct source entries, not one', collidingRefs.length === 2)

  const mixedContentTypes: RetrievalResult = {
    chunks: [
      fixtureRetrievedChunk({ contentType: 'lesson', slug: 'lesson-a', title: 'Lesson A', path: '/learn/ibm-i-fundamentals/lesson-a' }),
      fixtureRetrievedChunk({ contentType: 'insight', slug: 'insight-a', title: 'Insight A', path: '/insights/insight-a' }),
      fixtureRetrievedChunk({ contentType: 'deep-dive', slug: 'deep-dive-a', title: 'Deep Dive A', path: '/deep-dives/deep-dive-a' }),
    ],
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  const mixedRefs = buildSourceRefs(mixedContentTypes)
  check('a mixed-content-type result preserves each item\'s own contentType and canonical URL', new Set(mixedRefs.map((r) => r.contentType)).size === 3)
  check('every source ref path is a real canonical route for its content type', mixedRefs.every((r) => r.path.startsWith(`/${r.contentType === 'deep-dive' ? 'deep-dives' : r.contentType === 'insight' ? 'insights' : 'learn/ibm-i-fundamentals'}/`)))

  const manyItems: RetrievalResult = {
    chunks: Array.from({ length: MAX_SOURCE_REFS + 3 }, (_, i) =>
      fixtureRetrievedChunk({ slug: `lesson-${i}`, title: `Lesson ${i}`, path: `/learn/ibm-i-fundamentals/lesson-${i}` })
    ),
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  check(
    `source list is capped at MAX_SOURCE_REFS (${MAX_SOURCE_REFS})`,
    buildSourceRefs(manyItems).length === MAX_SOURCE_REFS
  )
}

// ---------------------------------------------------------------------------
// Section 5: Weak/no-match behavior
// ---------------------------------------------------------------------------
section('5. Weak / no-match behavior')

{
  const weakResult: RetrievalResult = {
    chunks: [fixtureRetrievedChunk({ score: 1 })],
    hasStrongMatch: false,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  check('a weak-match result produces NO source refs (no misleading "Sources used" block)', buildSourceRefs(weakResult).length === 0)
  check(
    'a weak-match result\'s prompt text is honest about weak coverage',
    formatRetrievedContentForPrompt(weakResult).includes('only loosely related')
  )

  const emptyResult: RetrievalResult = { chunks: [], hasStrongMatch: false, hasGuaranteedCurrentContent: false, resolvedCurrentContent: null }
  check('an empty result produces no source refs', buildSourceRefs(emptyResult).length === 0)
  check(
    'an empty result\'s prompt text says the topic may not be covered, not that it is confirmed absent',
    formatRetrievedContentForPrompt(emptyResult).includes('may be a topic the site does not cover deeply yet')
  )

  const strongResult: RetrievalResult = {
    chunks: [fixtureRetrievedChunk({ score: 10 })],
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  check('a strong-match result does produce source refs', buildSourceRefs(strongResult).length === 1)

  const mixedTypesResult: RetrievalResult = {
    chunks: [
      fixtureRetrievedChunk({ contentType: 'insight', title: 'An Insight', slug: 'an-insight' }),
      fixtureRetrievedChunk({ contentType: 'deep-dive', title: 'A Deep Dive', slug: 'a-deep-dive' }),
    ],
    hasStrongMatch: true,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  const promptText = formatRetrievedContentForPrompt(mixedTypesResult)
  check('the prompt text labels an Insight chunk as [Insight]', promptText.includes('[Insight] "An Insight"'))
  check('the prompt text labels a Deep Dive chunk as [Deep Dive]', promptText.includes('[Deep Dive] "A Deep Dive"'))
}

// ---------------------------------------------------------------------------
// Section 6: Published-only filtering, across all three catalogs
// ---------------------------------------------------------------------------
section('6. Published-only filtering (lessons, Insights, Deep Dives)')

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
  check('the lesson Published-only predicate excludes Draft/Review Ready/Approved/Archived fixture rows', filtered.length === 1 && filtered[0].slug === 'published-1')

  const nonPublishedLessons = IBM_I_FUNDAMENTALS_LESSONS.filter((l) => l.status !== 'Published')
  console.log(
    `  INFO  content/lessons/metadata.ts currently has ${nonPublishedLessons.length} non-Published lesson(s) ` +
      `out of ${IBM_I_FUNDAMENTALS_LESSONS.length} -- retrievePublishedContent() only ever reads getPublishedLessons(), ` +
      `so these (if any) can never be retrieved or shown as a source.`
  )

  const nonPublishedInsights = INSIGHTS.filter((i) => !isInsightAvailable(i))
  check('every Insight in the catalog currently has status published (none draft right now)', nonPublishedInsights.length === 0, `${nonPublishedInsights.length} non-published`)
  console.log(`  INFO  content/insights/catalog.ts: ${INSIGHTS.filter(isInsightAvailable).length} published / ${INSIGHTS.length} total -- retrievePublishedContent() only ever reads getPublishedInsights().`)

  const nonPublishedDeepDives = DEEP_DIVES.filter((d) => !isDeepDiveAvailable(d))
  check('the Deep Dive catalog has at least one non-published (planned/review-ready) entry to prove the filter is load-bearing, not vacuous', nonPublishedDeepDives.length > 0, `${nonPublishedDeepDives.length} non-published`)
  console.log(`  INFO  content/deep-dives/catalog.ts: ${DEEP_DIVES.filter(isDeepDiveAvailable).length} published / ${DEEP_DIVES.length} total -- retrievePublishedContent() only ever reads DEEP_DIVES.filter(isDeepDiveAvailable).`)
}

// ---------------------------------------------------------------------------
// Section 7: Retrieval scenarios against the real catalogs (lessons, Insights, Deep Dives)
// ---------------------------------------------------------------------------
section('7. Retrieval scenarios (real content, real chunking + scoring)')

interface LoadedChunk {
  contentType: AiContentType
  slug: string
  chunk: ContentChunk
}

function loadLessonChunks(): LoadedChunk[] {
  const all: LoadedChunk[] = []
  for (const lesson of IBM_I_FUNDAMENTALS_LESSONS) {
    if (lesson.status !== 'Published') continue // mirrors getPublishedLessons()'s filter
    let markdown: string
    try {
      markdown = readFileSync(resolve(__dirname, '..', lesson.contentSourcePath), 'utf-8')
    } catch {
      continue
    }
    const chunkable: ChunkableContent = {
      contentType: 'lesson',
      slug: lesson.slug,
      title: lesson.title,
      path: `/learn/ibm-i-fundamentals/${lesson.slug}`,
      tags: lesson.tags ?? [],
      masterCategoryId: lesson.masterCategoryId ?? null,
      masterSubcategory: lesson.masterSubcategory ?? null,
      secondaryCategoryIds: lesson.secondaryCategoryIds ?? [],
    }
    for (const chunk of chunkMarkdownContent(chunkable, markdown)) {
      all.push({ contentType: 'lesson', slug: lesson.slug, chunk })
    }
  }
  return all
}

function loadInsightChunks(): LoadedChunk[] {
  const all: LoadedChunk[] = []
  for (const insight of INSIGHTS.filter(isInsightAvailable)) {
    let markdown: string
    try {
      markdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${insight.slug}.md`), 'utf-8')
    } catch {
      continue
    }
    const chunkable: ChunkableContent = {
      contentType: 'insight',
      slug: insight.slug,
      title: insight.title,
      path: `/insights/${insight.slug}`,
      tags: insight.tags,
      masterCategoryId: null,
      masterSubcategory: null,
      secondaryCategoryIds: [],
    }
    for (const chunk of chunkMarkdownContent(chunkable, markdown)) {
      all.push({ contentType: 'insight', slug: insight.slug, chunk })
    }
  }
  return all
}

function loadDeepDiveChunks(): LoadedChunk[] {
  const all: LoadedChunk[] = []
  for (const deepDive of DEEP_DIVES.filter(isDeepDiveAvailable)) {
    let markdown: string
    try {
      markdown = readFileSync(resolve(__dirname, '..', 'content', 'deep-dives', `${deepDive.slug}.md`), 'utf-8')
    } catch {
      continue
    }
    const chunkable: ChunkableContent = {
      contentType: 'deep-dive',
      slug: deepDive.slug,
      title: deepDive.title,
      path: `/deep-dives/${deepDive.slug}`,
      tags: deepDive.tags,
      masterCategoryId: null,
      masterSubcategory: null,
      secondaryCategoryIds: [],
    }
    for (const chunk of chunkMarkdownContent(chunkable, markdown)) {
      all.push({ contentType: 'deep-dive', slug: deepDive.slug, chunk })
    }
  }
  return all
}

const lessonChunks = loadLessonChunks()
const insightChunks = loadInsightChunks()
const deepDiveChunks = loadDeepDiveChunks()
const allChunks = [...lessonChunks, ...insightChunks, ...deepDiveChunks]

check(`loaded chunks for the published lesson catalog (${IBM_I_FUNDAMENTALS_LESSONS.length} lessons in metadata)`, lessonChunks.length > 0, `${lessonChunks.length} chunks`)
check(`loaded chunks for the published Insight catalog (${INSIGHTS.filter(isInsightAvailable).length} published Insights)`, insightChunks.length > 0, `${insightChunks.length} chunks`)
check(`loaded chunks for the published Deep Dive catalog (${DEEP_DIVES.filter(isDeepDiveAvailable).length} published Deep Dives)`, deepDiveChunks.length > 0, `${deepDiveChunks.length} chunks`)

function topContentFor(pool: LoadedChunk[], query: string, limit = 3): { contentType: AiContentType; slug: string; score: number }[] {
  const queryTokens = tokenize(query)
  const queryLower = query.toLowerCase()
  const scored = pool.map(({ contentType, slug, chunk }) => ({
    contentType,
    slug,
    score: scoreChunk(chunk, queryTokens, queryLower).score,
  }))
  scored.sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const topDistinct: { contentType: AiContentType; slug: string; score: number }[] = []
  for (const entry of scored) {
    const key = `${entry.contentType}:${entry.slug}`
    if (seen.has(key)) continue
    seen.add(key)
    topDistinct.push(entry)
    if (topDistinct.length >= limit) break
  }
  return topDistinct
}

interface Scenario {
  query: string
  pool: LoadedChunk[]
  /** Accept any item whose slug matches one of these -- exact slugs, or a predicate for a whole family. */
  expectSlugOneOf?: string[]
  expectSlugMatching?: (slug: string) => boolean
}

const LESSON_SCENARIOS: Scenario[] = [
  { query: 'How is CHAIN different from READ?', pool: lessonChunks, expectSlugOneOf: ['chain-for-keyed-access', 'reading-physical-files-in-rpgle-with-read'] },
  { query: 'What does SQLCODE 100 mean?', pool: lessonChunks, expectSlugOneOf: ['sqlca-sqlcode-and-sqlstate-in-depth', 'sqlcode-and-sqlstate-basics-in-sqlrpgle'] },
  { query: 'How does adopted authority work?', pool: lessonChunks, expectSlugOneOf: ['adopted-authority-basics'] },
  { query: 'What is journaling vs backup?', pool: lessonChunks, expectSlugOneOf: ['backup-vs-journaling-vs-high-availability'] },
  // Query tokenizes to just "subfiles" (plural) -- "where", "should", "i",
  // "learn", "about" are all stopwords. The scoring algorithm is exact
  // token-overlap with no stemming (by design -- MVP, no NLP/embeddings), so
  // it won't match the singular "Subfile" in most lesson titles/slugs.
  // Accept any lesson in the subfile family as a correct, useful answer.
  { query: 'Where should I learn about subfiles?', pool: lessonChunks, expectSlugMatching: (slug) => slug.includes('subfile') },
]

const INSIGHT_SCENARIOS: Scenario[] = [
  { query: 'What is the IBM i MCP Server and how do AI assistants use it?', pool: insightChunks, expectSlugOneOf: ['ibm-i-mcp-server-ai-assistants'] },
  { query: 'How do I generate JSON or call a REST API from RPG?', pool: insightChunks, expectSlugOneOf: ['modernizing-rpg-applications-with-sql-and-apis'] },
  { query: 'Which QSYS2 service shows job log messages as rows?', pool: insightChunks, expectSlugOneOf: ['db2-for-i-qsys2-services-developers-should-know'] },
  { query: 'How do I deploy an RPG program as a REST API using Integrated Web Services and PCML?', pool: insightChunks, expectSlugOneOf: ['building-rest-apis-from-ibm-i-applications'] },
  { query: 'What is a safe workflow for AI-assisted RPG development?', pool: insightChunks, expectSlugOneOf: ['practical-ai-assisted-development-for-rpg-programmers'] },
]

const DEEP_DIVE_SCENARIOS: Scenario[] = [
  { query: 'How do database triggers work on IBM i?', pool: deepDiveChunks, expectSlugOneOf: ['database-triggers-on-ibm-i'] },
  { query: 'How do SQL cursors work in RPGLE?', pool: deepDiveChunks, expectSlugOneOf: ['sql-cursors-on-ibm-i'] },
  { query: 'How do I write a stored procedure on Db2 for i?', pool: deepDiveChunks, expectSlugOneOf: ['stored-procedures-on-ibm-i'] },
  { query: 'How should I handle SQL errors and SQLCODE/SQLSTATE?', pool: deepDiveChunks, expectSlugOneOf: ['sql-error-handling-on-ibm-i'] },
]

for (const scenario of [...LESSON_SCENARIOS, ...INSIGHT_SCENARIOS, ...DEEP_DIVE_SCENARIOS]) {
  const top = topContentFor(scenario.pool, scenario.query)
  const topSlugs = top.map((t) => t.slug)
  const matcher = scenario.expectSlugMatching ?? ((slug: string) => scenario.expectSlugOneOf!.includes(slug))
  check(
    `"${scenario.query}" surfaces an expected item in the top 3`,
    topSlugs.some(matcher),
    `got [${topSlugs.join(', ')}]`
  )
}

{
  // "Why is my job in MSGW?" -- no lesson is titled exactly around MSGW, so
  // this is a soft check: retrieval must not crash and should return SOME
  // ranked result, not that a specific lesson wins.
  const top = topContentFor(lessonChunks, 'Why is my job in MSGW?')
  check('a query with no exact-title lesson still returns a ranked (non-crashing) result', Array.isArray(top))
}

{
  // "What is PowerHA?" -- PowerHA/HA clustering is not covered in depth by
  // this catalog -- this must NOT look like a strong, confident match
  // anywhere across lessons, Insights, or Deep Dives combined.
  const query = 'What is PowerHA?'
  const queryTokens = tokenize(query)
  const queryLower = query.toLowerCase()
  const maxScore = Math.max(0, ...allChunks.map(({ chunk }) => scoreChunk(chunk, queryTokens, queryLower).score))
  check(
    '"What is PowerHA?" does not reach the strong-match threshold anywhere across the combined catalog',
    maxScore < STRONG_MATCH_SCORE,
    `max score found: ${maxScore}`
  )
}

// ---------------------------------------------------------------------------
// Section 8: Cross-content general retrieval and guaranteed current-page
// grounding, against real Insight/Deep Dive content
// ---------------------------------------------------------------------------
section('8. Cross-content general retrieval, and guaranteed grounding on real Insights/Deep Dives')

{
  // A shared candidate pool spanning all three content types, scored
  // against one query, must be able to surface a top-3 that isn't
  // artificially restricted to a single content type -- proving the
  // general-retrieval pass genuinely operates over one unified pool rather
  // than three separate engines bolted together.
  const crossContentQuery = 'How do I work with SQL and Db2 for i on IBM i?'
  const top = topContentFor(allChunks, crossContentQuery, 10)
  const typesRepresented = new Set(top.map((t) => t.contentType))
  check(
    'a broad cross-cutting query surfaces results from more than one content type in the combined top 10',
    typesRepresented.size > 1,
    `content types found: ${[...typesRepresented].join(', ')}`
  )
}

{
  // The real "explain this in simpler terms" case: a genuinely zero-overlap
  // query against a real, published Insight's own chunks. This is the exact
  // pure mechanism (selectGuaranteedChunks) retrievePublishedContent() runs
  // for currentInsightSlug -- see Section 3 for the synthetic-fixture
  // version of this same guarantee.
  const dbInsight = INSIGHTS.find((i) => i.slug === 'db2-for-i-qsys2-services-developers-should-know' && isInsightAvailable(i))
  check('the fixture Insight slug used below is genuinely published', dbInsight !== undefined)

  if (dbInsight) {
    const ownChunks = insightChunks.filter((c) => c.slug === dbInsight.slug).map((c) => c.chunk)
    check('the fixture Insight has more than one chunk to guarantee-select from', ownChunks.length > 1, `${ownChunks.length} chunks`)

    const zeroOverlapQuery = 'explain this in simpler terms'
    const scored = ownChunks.map((c) => scoreChunk(c, tokenize(zeroOverlapQuery), zeroOverlapQuery))
    const guaranteed = selectGuaranteedChunks(scored, { maxChunks: CURRENT_CONTENT_MAX_CHUNKS, maxChars: CURRENT_CONTENT_MAX_CHARS })
    check(
      '"explain this in simpler terms" (no keyword overlap) still guarantees chunks from the real, currently-open Insight',
      guaranteed.length > 0,
      `got ${guaranteed.length} chunks`
    )
    check('every guaranteed chunk is genuinely from this Insight, not another content item', guaranteed.every((s) => s.chunk.slug === dbInsight.slug && s.chunk.contentType === 'insight'))

    // PR review finding: the guaranteed current-page bucket must show up
    // under "Sources used" and must never be described as "loosely
    // related" -- assemble the exact RetrievalResult shape
    // retrievePublishedContent() would return for this zero-overlap query
    // (hasStrongMatch false, since every score is 0; hasGuaranteedCurrentContent
    // true, since the current Insight's own chunks are present) and run it
    // through the real buildSourceRefs()/formatRetrievedContentForPrompt().
    const guaranteedResult: RetrievalResult = {
      chunks: guaranteed.map((s) => ({
        contentType: s.chunk.contentType,
        title: s.chunk.title,
        slug: s.chunk.slug,
        path: s.chunk.path,
        heading: s.chunk.heading,
        chunkText: s.chunk.chunkText,
        score: s.score,
        reasons: [...s.reasons, 'current page'],
      })),
      hasStrongMatch: false,
      hasGuaranteedCurrentContent: true,
      resolvedCurrentContent: { contentType: 'insight', slug: dbInsight.slug, title: dbInsight.title },
    }
    const sources = buildSourceRefs(guaranteedResult)
    check('"Sources used" includes the current Insight even with zero keyword overlap', sources.some((s) => s.contentType === 'insight' && s.slug === dbInsight.slug))
    const promptText = formatRetrievedContentForPrompt(guaranteedResult)
    check('the prompt text does NOT describe the guaranteed current-Insight excerpt as "loosely related"', !promptText.includes('only loosely related'))
  }

  const triggersDeepDive = DEEP_DIVES.find((d) => d.slug === 'database-triggers-on-ibm-i' && isDeepDiveAvailable(d))
  check('the fixture Deep Dive slug used below is genuinely published', triggersDeepDive !== undefined)

  if (triggersDeepDive) {
    const ownChunks = deepDiveChunks.filter((c) => c.slug === triggersDeepDive.slug).map((c) => c.chunk)
    check('the fixture Deep Dive has more than one chunk to guarantee-select from', ownChunks.length > 1, `${ownChunks.length} chunks`)

    const zeroOverlapQuery = 'explain this in simpler terms'
    const scored = ownChunks.map((c) => scoreChunk(c, tokenize(zeroOverlapQuery), zeroOverlapQuery))
    const guaranteed = selectGuaranteedChunks(scored, { maxChunks: CURRENT_CONTENT_MAX_CHUNKS, maxChars: CURRENT_CONTENT_MAX_CHARS })
    check(
      '"explain this in simpler terms" (no keyword overlap) still guarantees chunks from the real, currently-open Deep Dive',
      guaranteed.length > 0,
      `got ${guaranteed.length} chunks`
    )
    check('every guaranteed chunk is genuinely from this Deep Dive, not another content item', guaranteed.every((s) => s.chunk.slug === triggersDeepDive.slug && s.chunk.contentType === 'deep-dive'))

    const guaranteedResult: RetrievalResult = {
      chunks: guaranteed.map((s) => ({
        contentType: s.chunk.contentType,
        title: s.chunk.title,
        slug: s.chunk.slug,
        path: s.chunk.path,
        heading: s.chunk.heading,
        chunkText: s.chunk.chunkText,
        score: s.score,
        reasons: [...s.reasons, 'current page'],
      })),
      hasStrongMatch: false,
      hasGuaranteedCurrentContent: true,
      resolvedCurrentContent: { contentType: 'deep-dive', slug: triggersDeepDive.slug, title: triggersDeepDive.title },
    }
    const sources = buildSourceRefs(guaranteedResult)
    check('"Sources used" includes the current Deep Dive even with zero keyword overlap', sources.some((s) => s.contentType === 'deep-dive' && s.slug === triggersDeepDive.slug))
    const promptText = formatRetrievedContentForPrompt(guaranteedResult)
    check('the prompt text does NOT describe the guaranteed current-Deep-Dive excerpt as "loosely related"', !promptText.includes('only loosely related'))
  }
}

// ---------------------------------------------------------------------------
// Section 8b: hasGuaranteedCurrentContent gating, synthetic edge cases
// ---------------------------------------------------------------------------
section('8b. Guaranteed-current-content gating (synthetic edge cases)')

{
  const guaranteedOnlyChunk: RetrievedChunk = {
    contentType: 'insight',
    title: 'Some Insight',
    slug: 'some-insight',
    path: '/insights/some-insight',
    heading: 'Some Heading',
    chunkText: 'irrelevant text',
    score: 0,
    reasons: ['current page'],
  }
  const guaranteedOnlyResult: RetrievalResult = {
    chunks: [guaranteedOnlyChunk],
    hasStrongMatch: false,
    hasGuaranteedCurrentContent: true,
    resolvedCurrentContent: { contentType: 'insight', slug: 'some-insight', title: 'Some Insight' },
  }
  check('a zero-score guaranteed-only chunk still produces a source ref', buildSourceRefs(guaranteedOnlyResult).length === 1)
  check('a zero-score guaranteed-only chunk\'s prompt text has no "loosely related" caveat', !formatRetrievedContentForPrompt(guaranteedOnlyResult).includes('only loosely related'))

  // An incidental low-score general chunk riding alongside a guaranteed
  // chunk must not be shown as if it were an equally confident source --
  // only the guaranteed chunk should surface when hasStrongMatch is false.
  const incidentalGeneralChunk: RetrievedChunk = {
    contentType: 'lesson',
    title: 'Unrelated Lesson',
    slug: 'unrelated-lesson',
    path: '/learn/ibm-i-fundamentals/unrelated-lesson',
    heading: 'Some Section',
    chunkText: 'irrelevant text',
    score: 1, // nonzero but below STRONG_MATCH_SCORE -- an incidental, non-confident match
    reasons: ['body match'], // NOT tagged 'current page'
  }
  const mixedResult: RetrievalResult = {
    chunks: [guaranteedOnlyChunk, incidentalGeneralChunk],
    hasStrongMatch: false,
    hasGuaranteedCurrentContent: true,
    resolvedCurrentContent: { contentType: 'insight', slug: 'some-insight', title: 'Some Insight' },
  }
  const mixedSources = buildSourceRefs(mixedResult)
  check('with hasStrongMatch false, only the guaranteed current-page chunk becomes a source -- an incidental weak general chunk does not ride along', mixedSources.length === 1 && mixedSources[0]?.slug === 'some-insight')

  const neitherResult: RetrievalResult = {
    chunks: [{ ...incidentalGeneralChunk, score: 1 }],
    hasStrongMatch: false,
    hasGuaranteedCurrentContent: false,
    resolvedCurrentContent: null,
  }
  check('with neither hasStrongMatch nor hasGuaranteedCurrentContent, no sources are shown (unchanged prior behavior)', buildSourceRefs(neitherResult).length === 0)
  check('with neither flag set, the weak-coverage caveat is still shown (unchanged prior behavior)', formatRetrievedContentForPrompt(neitherResult).includes('only loosely related'))
}

// ---------------------------------------------------------------------------
// Section 9: Live catalog sanity check (Published-only, real Supabase data)
// ---------------------------------------------------------------------------
section('9. Live catalog sanity check (read-only)')

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
