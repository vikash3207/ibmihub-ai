/**
 * Unified cross-content search regression pass (Unified Discovery,
 * Accessibility and Responsive Polish). Standalone via `tsx`, matching the
 * existing scripts/*-regression.ts style (check/section helpers, pass/fail
 * counter, process.exit(1) on any failure).
 *
 * Executes the real, pure functions in lib/search.ts directly against
 * synthetic fixtures, and the real isDeepDiveAvailable()/isInsightAvailable()
 * against mixed-status fixtures -- not just source-text pattern matching --
 * per this codebase's established preference (see lib/deep-dive-render.ts,
 * lib/nav-links.ts and their regression suites for the same approach).
 * Lessons come from a `server-only` module (lib/lessons.ts), so this suite
 * imports only `type Lesson` (safe, type-only) and builds a lesson fixture by
 * hand, then feeds it through lessonToSearchable() -- the same "type-only
 * import from a server-only module" pattern scripts/reader-experience-
 * regression.ts and scripts/learning-center-regression.ts already establish.
 *
 * Usage:
 *   npm run test:search
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  lessonToSearchable,
  deepDiveToSearchable,
  insightToSearchable,
  normalizeQuery,
  scoreItem,
  searchContent,
  highlightMatch,
  type SearchableItem,
} from '../lib/search'
import { isDeepDiveAvailable, type DeepDive } from '../lib/deep-dives'
import { isInsightAvailable, type Insight } from '../lib/insights'
import type { Lesson } from '../lib/lessons'

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

/**
 * Strips /* *‍/ and // comments before a source-text safety check runs --
 * without this, an explanatory doc comment that names the very thing it's
 * confirming absent (e.g. "no dangerouslySetInnerHTML anywhere in this
 * feature") would make the check pass for the wrong reason. This exact
 * self-inflicted-regex-bug class has recurred across several PRs in this
 * codebase; stripping comments first is the established fix.
 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

function lessonFixture(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: 'id-1',
    slug: 'what-is-ibm-i',
    title: 'What is IBM i?',
    short_description: 'An introduction to the IBM i platform.',
    lesson_order: 1,
    learning_path_id: 'ibm-i-fundamentals',
    status: 'Published',
    content_source_path: 'what-is-ibm-i.md',
    estimated_reading_time: 5,
    ai_tutor_starter_question: null,
    track_id: null,
    module_id: null,
    difficulty: null,
    depth: null,
    tags: ['platform', 'basics'],
    prerequisites: null,
    related_lessons: null,
    persona_tags: null,
    ai_tutor_prompts: null,
    master_category_id: 'ibm-i-platform-fundamentals',
    master_subcategory: null,
    secondary_category_ids: null,
    ...overrides,
  }
}

function deepDiveFixture(overrides: Partial<DeepDive> = {}): DeepDive {
  return {
    slug: 'sql-error-handling-on-ibm-i',
    title: 'SQL Error Handling on IBM i',
    description: 'A deep dive into SQLCODE, SQLSTATE, and GET DIAGNOSTICS.',
    category: 'sql-db2',
    status: 'published',
    tags: ['sql', 'error-handling'],
    ...overrides,
  }
}

function insightFixture(overrides: Partial<Insight> = {}): Insight {
  return {
    slug: 'ibm-i-mcp-server',
    title: 'IBM i MCP Server',
    description: 'Connecting AI assistants to IBM i systems.',
    category: 'ai-emerging-tech',
    tags: ['mcp', 'ai'],
    publishedAt: '2026-01-01',
    readingTimeMinutes: 10,
    status: 'published',
    ...overrides,
  }
}

async function main() {
  // ---------------------------------------------------------------------------
  section('1. Mapper functions: correct URLs, category labels, safe fallbacks')
  // ---------------------------------------------------------------------------

  {
    const lessonItem = lessonToSearchable(lessonFixture())
    check('lessonToSearchable builds the correct detail URL', lessonItem.url === '/learn/ibm-i-fundamentals/what-is-ibm-i')
    check('lessonToSearchable type is "lesson"', lessonItem.type === 'lesson')
    check(
      'lessonToSearchable falls back to master_category_id when master_subcategory is null',
      lessonItem.category === 'ibm-i-platform-fundamentals'
    )

    const noCategoryLesson = lessonToSearchable(lessonFixture({ master_category_id: null, master_subcategory: null }))
    check('lessonToSearchable falls back to null category rather than crashing when both taxonomy fields are absent', noCategoryLesson.category === null)

    const noTagsLesson = lessonToSearchable(lessonFixture({ tags: null }))
    check('lessonToSearchable falls back to an empty tags array when tags is null, not a crash', Array.isArray(noTagsLesson.tags) && noTagsLesson.tags.length === 0)

    const deepDiveItem = deepDiveToSearchable(deepDiveFixture())
    check('deepDiveToSearchable builds the correct detail URL', deepDiveItem.url === '/deep-dives/sql-error-handling-on-ibm-i')
    check('deepDiveToSearchable type is "deep-dive"', deepDiveItem.type === 'deep-dive')
    check('deepDiveToSearchable resolves a human category label, not the raw category id', deepDiveItem.category === 'SQL / Db2 for i')

    const insightItem = insightToSearchable(insightFixture())
    check('insightToSearchable builds the correct detail URL', insightItem.url === '/insights/ibm-i-mcp-server')
    check('insightToSearchable type is "insight"', insightItem.type === 'insight')
    check('insightToSearchable resolves a human category label, not the raw category id', insightItem.category === 'AI & Emerging Tech')
  }

  // ---------------------------------------------------------------------------
  section('2. normalizeQuery: trimming, whitespace collapsing, casing, length cap')
  // ---------------------------------------------------------------------------

  {
    check('trims leading/trailing whitespace', normalizeQuery('  sql  ') === 'sql')
    check('collapses internal whitespace to a single space', normalizeQuery('sql   error   handling') === 'sql error handling')
    check('lowercases the query', normalizeQuery('SQLCODE') === 'sqlcode')
    check('an empty string normalizes to an empty string', normalizeQuery('') === '')
    check('a whitespace-only query normalizes to an empty string', normalizeQuery('   \t\n  ') === '')

    const veryLongQuery = 'a'.repeat(5000)
    const normalized = normalizeQuery(veryLongQuery)
    check('an excessively long query is capped, never processed at full length', normalized.length === 200, String(normalized.length))
  }

  // ---------------------------------------------------------------------------
  section('3. scoreItem: deterministic, explainable rank tiers')
  // ---------------------------------------------------------------------------

  {
    const item: SearchableItem = {
      type: 'deep-dive',
      slug: 'sql-error-handling-on-ibm-i',
      title: 'SQL Error Handling on IBM i',
      description: 'A deep dive into SQLCODE, SQLSTATE, and GET DIAGNOSTICS.',
      category: 'SQL / Db2 for i',
      tags: ['sql', 'error-handling'],
      url: '/deep-dives/sql-error-handling-on-ibm-i',
    }

    check('an exact (case-insensitive) title match is tier 1', scoreItem(item, 'sql error handling on ibm i') === 1)
    check('a title-starts-with match is tier 2', scoreItem(item, 'sql error') === 2)
    check('a title-contains match is tier 3', scoreItem(item, 'handling on ibm') === 3)
    check('a category match is tier 4', scoreItem(item, 'db2') === 4)
    check('a tag match is tier 4', scoreItem(item, 'error-handling') === 4)
    check('a description-only match is tier 5', scoreItem(item, 'sqlstate') === 5)
    check('no match returns null', scoreItem(item, 'cobol') === null)
    check('an empty normalized query returns null (never a false match)', scoreItem(item, '') === null)
    check('matching is case-insensitive regardless of the item title\'s own casing', scoreItem(item, normalizeQuery('SQL ERROR')) === 2)
  }

  // ---------------------------------------------------------------------------
  section('4. searchContent: empty/whitespace/unknown/special-character/long queries, deterministic ranking')
  // ---------------------------------------------------------------------------

  {
    const items: SearchableItem[] = [
      { type: 'lesson', slug: 'sql-basics', title: 'SQL Basics', description: 'Intro to SQL.', category: 'SQL', tags: ['sql'], url: '/learn/ibm-i-fundamentals/sql-basics' },
      { type: 'deep-dive', slug: 'sql-error-handling', title: 'SQL Error Handling', description: 'Advanced SQL error handling.', category: 'SQL / Db2 for i', tags: ['sql'], url: '/deep-dives/sql-error-handling' },
      { type: 'insight', slug: 'sql-performance', title: 'SQL Performance', description: 'Tuning SQL performance.', category: 'Operations & Performance', tags: ['sql'], url: '/insights/sql-performance' },
    ]

    check('an empty query returns no results (the empty-query guidance state, never the full catalog)', searchContent(items, '').length === 0)
    check('a whitespace-only query returns no results', searchContent(items, '   ').length === 0)
    check('an unknown query returns no results', searchContent(items, 'cobol green screen').length === 0)

    const allSqlMatches = searchContent(items, 'sql')
    check('a broad query matches all three content types', allSqlMatches.length === 3)
    check(
      'multi-type results correctly partition by type for grouped display',
      allSqlMatches.filter((r) => r.type === 'lesson').length === 1 &&
        allSqlMatches.filter((r) => r.type === 'deep-dive').length === 1 &&
        allSqlMatches.filter((r) => r.type === 'insight').length === 1
    )

    // Deterministic tie-break: two items in the same rank tier sort
    // alphabetically by title, not by input array order.
    const tieItems: SearchableItem[] = [
      { type: 'lesson', slug: 'b', title: 'Zebra Topic', description: 'contains zzz-term', category: null, tags: [], url: '/b' },
      { type: 'lesson', slug: 'a', title: 'Alpha Topic', description: 'contains zzz-term', category: null, tags: [], url: '/a' },
    ]
    const tieResults = searchContent(tieItems, 'zzz-term')
    check('same-tier ties break alphabetically by title, deterministically', tieResults[0]?.slug === 'a' && tieResults[1]?.slug === 'b')

    // Special characters must be treated as literal text, never as regex --
    // if the query were interpreted as a RegExp, "a.b" would match "axb" via
    // the "." wildcard. Confirm it does NOT.
    const regexRiskItems: SearchableItem[] = [
      { type: 'lesson', slug: 'literal-dot', title: 'a.b', description: '', category: null, tags: [], url: '/literal-dot' },
      { type: 'lesson', slug: 'would-match-if-regex', title: 'axb', description: '', category: null, tags: [], url: '/would-match-if-regex' },
    ]
    const regexResults = searchContent(regexRiskItems, 'a.b')
    check(
      'special regex characters in a query are treated as literal text, not compiled as a RegExp',
      regexResults.length === 1 && regexResults[0].slug === 'literal-dot'
    )

    // A pathologically long query must not throw and must still return a
    // sensible (bounded) result -- exercises the full pipeline, not just
    // normalizeQuery() in isolation.
    const longQueryItems: SearchableItem[] = [{ type: 'lesson', slug: 'x', title: 'a'.repeat(300), description: '', category: null, tags: [], url: '/x' }]
    let longQueryThrew = false
    let longQueryResults: SearchableItem[] = []
    try {
      longQueryResults = searchContent(longQueryItems, 'a'.repeat(5000))
    } catch {
      longQueryThrew = true
    }
    check('an excessively long query does not throw', !longQueryThrew)
    check('an excessively long query still produces a bounded, sensible match', longQueryResults.length === 1)
  }

  // ---------------------------------------------------------------------------
  section('5. highlightMatch: safe, structural highlighting (no HTML strings)')
  // ---------------------------------------------------------------------------

  {
    const segments = highlightMatch('SQL Error Handling', 'error')
    check('the matched substring is isolated into its own segment', segments.some((s) => s.match && s.text.toLowerCase() === 'error'))
    check('non-matching text is preserved as non-match segments', segments.some((s) => !s.match && s.text.includes('SQL')))
    check(
      'concatenating every segment reproduces the original text exactly (no characters lost or duplicated)',
      segments.map((s) => s.text).join('') === 'SQL Error Handling'
    )

    const noQuerySegments = highlightMatch('SQL Error Handling', '')
    check('an empty query produces a single non-match segment covering the whole string', noQuerySegments.length === 1 && !noQuerySegments[0].match)

    const noMatchSegments = highlightMatch('SQL Error Handling', 'cobol')
    check('no-match text produces a single non-match segment, not a crash', noMatchSegments.length === 1 && !noMatchSegments[0].match)

    const multiMatchSegments = highlightMatch('sql sql sql', 'sql')
    check('every occurrence of the query is highlighted, not just the first', multiMatchSegments.filter((s) => s.match).length === 3)
  }

  // ---------------------------------------------------------------------------
  section('6. Publication-status filtering: real isDeepDiveAvailable/isInsightAvailable, no duplicated rules')
  // ---------------------------------------------------------------------------

  {
    const mixedDeepDives = [
      deepDiveFixture({ slug: 'published-one', title: 'Published Deep Dive', status: 'published' }),
      deepDiveFixture({ slug: 'planned-one', title: 'Planned Deep Dive', status: 'planned' }),
      deepDiveFixture({ slug: 'review-ready-one', title: 'Review Ready Deep Dive', status: 'review-ready' }),
    ]
    const searchableDeepDives = mixedDeepDives.filter(isDeepDiveAvailable).map(deepDiveToSearchable)
    check('only the published Deep Dive survives isDeepDiveAvailable filtering', searchableDeepDives.length === 1 && searchableDeepDives[0].slug === 'published-one')

    const deepDiveSearch = searchContent(searchableDeepDives, 'Deep Dive')
    check(
      'a query matching all three titles only ever returns the already-published one (planned/review-ready never leak through)',
      deepDiveSearch.length === 1 && deepDiveSearch[0].slug === 'published-one'
    )

    const mixedInsights = [
      insightFixture({ slug: 'published-insight', title: 'Published Insight', status: 'published' }),
      insightFixture({ slug: 'draft-insight', title: 'Draft Insight', status: 'draft' }),
    ]
    const searchableInsights = mixedInsights.filter(isInsightAvailable).map(insightToSearchable)
    check('only the published Insight survives isInsightAvailable filtering', searchableInsights.length === 1 && searchableInsights[0].slug === 'published-insight')

    const insightSearch = searchContent(searchableInsights, 'Insight')
    check('a draft Insight never appears in search results even when its title matches', insightSearch.length === 1 && insightSearch[0].slug === 'published-insight')
  }

  // ---------------------------------------------------------------------------
  section('7. Search safety: no dangerouslySetInnerHTML anywhere in the new search files')
  // ---------------------------------------------------------------------------

  {
    const searchLibSrc = stripComments(readRepoFile('lib/search.ts'))
    const searchPageSrc = stripComments(readRepoFile('app/search/page.tsx'))
    const searchTriggerSrc = stripComments(readRepoFile('components/search-trigger.tsx'))

    check('lib/search.ts contains no dangerouslySetInnerHTML', !searchLibSrc.includes('dangerouslySetInnerHTML'))
    check('app/search/page.tsx contains no dangerouslySetInnerHTML', !searchPageSrc.includes('dangerouslySetInnerHTML'))
    check('components/search-trigger.tsx contains no dangerouslySetInnerHTML', !searchTriggerSrc.includes('dangerouslySetInnerHTML'))
    check('lib/search.ts never constructs a RegExp from the query (plain string matching only)', !searchLibSrc.includes('new RegExp'))
  }

  // ---------------------------------------------------------------------------
  section('8. /search page: metadata, GET form, reused publication helpers')
  // ---------------------------------------------------------------------------

  {
    const searchPageSrc = readRepoFile('app/search/page.tsx')

    check('/search sets robots index:false, follow:true (query URLs stay unindexed but linked content stays crawlable)', /robots:\s*{\s*index:\s*false,\s*follow:\s*true\s*}/.test(searchPageSrc))
    check('/search reuses the real getPublishedLessons(), not a reimplemented lesson query', searchPageSrc.includes('getPublishedLessons()'))
    check('/search reuses the real isDeepDiveAvailable(), not a reimplemented status check', searchPageSrc.includes('DEEP_DIVES.filter(isDeepDiveAvailable)'))
    check('/search reuses the real isInsightAvailable(), not a reimplemented status check', searchPageSrc.includes('INSIGHTS.filter(isInsightAvailable)'))
    check('the query form is a real GET form to /search (works with JS disabled, shareable ?q= URL)', /<form action="\/search" method="get"/.test(searchPageSrc))
    check('the empty-query state never renders the full catalog (guarded by hasQuery)', searchPageSrc.includes('!hasQuery') && searchPageSrc.includes('EmptyQueryState'))
  }

  // ---------------------------------------------------------------------------
  section('9. Search entry point: accessible, works signed-out and authenticated')
  // ---------------------------------------------------------------------------

  {
    const triggerSrc = readRepoFile('components/search-trigger.tsx')
    const headerSrc = readRepoFile('components/site-header.tsx')

    check('SearchTrigger is a real <Link>, not a client-only button (works with zero JS)', triggerSrc.includes('<Link'))
    check('SearchTrigger has no "use client" directive (no unnecessary client boundary)', !triggerSrc.includes("'use client'"))
    check('the icon-only variant carries a real aria-label, not just a bare icon', /aria-label="Search"/.test(triggerSrc))
    check('the labeled variant renders visible "Search" text, not an unexplained icon', /Search\s*<\/Link>/.test(triggerSrc))
    check('SiteHeader renders SearchTrigger in the desktop account cluster', headerSrc.includes('<SearchTrigger />'))
    check('SiteHeader renders a second, icon-only SearchTrigger for mobile', headerSrc.includes('variant="icon-only"'))
    check(
      'the search entry point sits outside the auth branch, so it renders identically signed-in or signed-out',
      headerSrc.indexOf('<SearchTrigger />') < headerSrc.indexOf('{user ? (')
    )
  }

  // ---------------------------------------------------------------------------
  section('10. Accessibility corrections: skip link, main landmarks, footer nav labels, error announcements')
  // ---------------------------------------------------------------------------

  {
    const skipLinkSrc = readRepoFile('components/skip-link.tsx')
    check('SkipLink targets the #main-content landmark', skipLinkSrc.includes('href="#main-content"'))
    check('SkipLink is visually hidden until focused (sr-only focus:not-sr-only)', skipLinkSrc.includes('sr-only focus:not-sr-only'))

    const rootLayoutSrc = readRepoFile('app/layout.tsx')
    check('SkipLink is mounted in the root layout, before the rest of the page content', rootLayoutSrc.includes('<SkipLink />'))

    const mainContentFiles = [
      'app/page.tsx',
      'app/deep-dives/page.tsx',
      'app/deep-dives/[slug]/page.tsx',
      'app/insights/page.tsx',
      'app/insights/[slug]/page.tsx',
      'app/contact/page.tsx',
      'app/search/page.tsx',
      'app/learn/layout.tsx',
      'app/(authenticated)/layout.tsx',
      'components/auth-card.tsx',
    ]
    for (const file of mainContentFiles) {
      const src = readRepoFile(file)
      check(`${file} has a <main id="main-content"> landmark for the skip link to target`, /<main id="main-content"/.test(src))
    }

    const footerSrc = readRepoFile('components/site-footer.tsx')
    check('the footer\'s Product nav has an accessible label', footerSrc.includes('aria-label="Product links"'))
    check('the footer\'s Company nav has an accessible label', footerSrc.includes('aria-label="Company links"'))

    const loginSrc = readRepoFile('app/auth/login/page.tsx')
    const signUpSrc = readRepoFile('app/auth/sign-up/page.tsx')
    check('the login page error banner is announced to screen readers (role="alert")', /role="alert"/.test(loginSrc))
    check('the sign-up page error banner is announced to screen readers (role="alert")', /role="alert"/.test(signUpSrc))
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Search regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Search regression FAILED.')
    process.exit(1)
  }
  console.log('Search regression passed.')
}

main().catch((err) => {
  console.error('Search regression script crashed:', err)
  process.exit(1)
})
