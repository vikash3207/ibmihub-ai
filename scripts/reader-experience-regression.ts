/**
 * Deep Dives, IBM i Insights and Reader-Experience Polish -- regression pass.
 * Standalone via `tsx`, no test framework dependency, matching the existing
 * scripts/*-regression.ts style (check/section helpers, pass/fail counter,
 * process.exit(1) on any failure).
 *
 * Two kinds of checks:
 *  - Real function execution against the pure, framework-free modules this
 *    PR touches (lib/deep-dive-render.ts's addDeepDiveHeadingAnchors/
 *    groupTocItems, lib/deep-dives.ts's isDeepDiveAvailable,
 *    lib/reader-breadcrumb.ts's buildReaderBreadcrumbStructuredData) rather
 *    than only pattern-matching source text.
 *  - Source-text checks confirming the listing-page decluttering, the
 *    available/planned split, and the standardized breadcrumb are actually
 *    wired into the four page files this PR touches.
 *
 * Usage:
 *   npm run test:reader-experience
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  addDeepDiveHeadingAnchors,
  groupTocItems,
  resolveExpandedGroupId,
  resolveHashHeadingId,
  type DeepDiveTocItem,
} from '../lib/deep-dive-render'
import { isDeepDiveAvailable, type DeepDive } from '../lib/deep-dives'
import { buildReaderBreadcrumbStructuredData } from '../lib/reader-breadcrumb'
import { SITE_URL } from '../lib/config'

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

function tocItem(id: string, title: string, level: 2 | 3): DeepDiveTocItem {
  return { id, title, level }
}

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

async function main() {
  // ---------------------------------------------------------------------------
  section('1. Entity decoding: the live &#x3C; defect, fixed at the rendering layer')
  // ---------------------------------------------------------------------------

  {
    // The exact live bug: a heading containing a literal `<` inside inline
    // code, reproduced against the real pipeline output shape (rehype-stringify
    // encodes `<`/`&` as hex numeric references, never named ones -- see
    // lib/deep-dive-render.ts's decodeEntities() doc comment for the full
    // trace). This is the literal HTML app/deep-dives/[slug]/page.tsx's real
    // pipeline produces for `### Why \`SqlCode < 0\` alone is insufficient`.
    const { toc: bugToc } = addDeepDiveHeadingAnchors('<h3>Why <code>SqlCode &#x3C; 0</code> alone is insufficient</h3>')
    check(
      'a heading with a literal `<` decodes to a real `<` in the TOC title, not the literal text "&#x3C;"',
      bugToc[0]?.title === 'Why SqlCode < 0 alone is insufficient',
      bugToc[0]?.title
    )
    check('the same heading no longer produces a mangled "x3c" anchor id fragment', bugToc[0]?.id === 'why-sqlcode-0-alone-is-insufficient', bugToc[0]?.id)

    const { toc: ampToc } = addDeepDiveHeadingAnchors('<h2>Escaping &#x26; Special Characters</h2>')
    check('a heading with a literal `&` decodes correctly (hex numeric reference)', ampToc[0]?.title === 'Escaping & Special Characters')

    const { toc: decimalToc } = addDeepDiveHeadingAnchors('<h2>Escaping &#38; Also This Way</h2>')
    check('decimal numeric character references decode correctly too', decimalToc[0]?.title === 'Escaping & Also This Way')

    const { toc: namedToc } = addDeepDiveHeadingAnchors('<h2>A &amp; B, &lt;tag&gt;, &quot;quoted&quot;, it&apos;s</h2>')
    check(
      'named entities (&amp; &lt; &gt; &quot; &apos;) still decode correctly (no regression)',
      namedToc[0]?.title === 'A & B, <tag>, "quoted", it\'s',
      namedToc[0]?.title
    )

    // Protection against double encoding: if the source HTML somehow already
    // contained an escaped ampersand followed by literal entity-looking text
    // (e.g. a genuinely double-encoded "&amp;#x3C;"), decoding must stop at
    // one pass -- resolving to a literal "&#x3C;" as *text*, not recursing
    // into a second decode that would produce "<".
    const { toc: doubleEncodedToc } = addDeepDiveHeadingAnchors('<h2>Already Escaped &amp;#x3C; Text</h2>')
    check(
      'a double-encoded input decodes exactly one level (no double-decoding into a raw "<")',
      doubleEncodedToc[0]?.title === 'Already Escaped &#x3C; Text',
      doubleEncodedToc[0]?.title
    )

    // Code blocks: entities inside <code>/<pre> are still just text content
    // in the DOM once dangerouslySetInnerHTML parses this HTML -- this suite
    // only verifies the TOC-title extraction path (the part that was
    // actually broken); the raw HTML itself is asserted unchanged/safe below.
    const rawHtml = addDeepDiveHeadingAnchors('<h2>Code: <code>a &#x3C; b &#x26;&#x26; c &#x3C; d</code></h2>').html
    check(
      'the underlying HTML (what dangerouslySetInnerHTML actually renders) is untouched by the TOC-title fix',
      rawHtml.includes('<code>a &#x3C; b &#x26;&#x26; c &#x3C; d</code>')
    )
  }

  // ---------------------------------------------------------------------------
  section('2. lib/markdown.ts safety is unchanged (source check, not weakened)')
  // ---------------------------------------------------------------------------

  {
    const markdownSrc = readRepoFile('lib/markdown.ts')
    // Note: the file's own doc comment legitimately explains that
    // allowDangerousHtml is NOT used (mentioning the option name by name) --
    // checking for an actual enabled option (`allowDangerousHtml: true` or
    // `allowDangerousHtml,` passed as a truthy shorthand) rather than the
    // bare substring avoids a false failure against that explanatory text.
    check('remark-rehype is not actually passed allowDangerousHtml: true', !/allowDangerousHtml\s*:\s*true/.test(markdownSrc))
    check('remark-rehype is not called with an allowDangerousHtml options object at all', !/remarkRehype\)?\s*\.use\(remarkRehype,\s*\{[^}]*allowDangerousHtml/.test(markdownSrc))
    check('no new raw-HTML rehype plugin was introduced', !/rehype-raw|rehypeRaw/.test(markdownSrc))
  }

  // ---------------------------------------------------------------------------
  section('3. Deep Dive available/planned status: one shared helper, no duplicate checks')
  // ---------------------------------------------------------------------------

  {
    check("isDeepDiveAvailable('published') is available", isDeepDiveAvailable(deepDive('published')))
    check("isDeepDiveAvailable('planned') is not available", !isDeepDiveAvailable(deepDive('planned')))
    check("isDeepDiveAvailable('review-ready') is not available (never presented as publicly available)", !isDeepDiveAvailable(deepDive('review-ready')))

    const mixed = [deepDive('published'), deepDive('published'), deepDive('planned'), deepDive('review-ready'), deepDive('planned')]
    const available = mixed.filter(isDeepDiveAvailable)
    const planned = mixed.filter((d) => !isDeepDiveAvailable(d))
    check('a mixed 5-entry fixture splits into 2 available / 3 planned', available.length === 2 && planned.length === 3)

    const browserSrc = readRepoFile('components/deep-dive-browser.tsx')
    check('DeepDiveBrowser imports isDeepDiveAvailable from lib/deep-dives.ts', /import \{ isDeepDiveAvailable, type DeepDive \} from '@\/lib\/deep-dives'/.test(browserSrc))
    check('DeepDiveCard no longer inlines its own status check (no `.status === ' + "'published'" + '` left)', !browserSrc.includes(".status === 'published'"))
    check('the old ambiguous "Showing X of Y Deep Dives" line is gone', !browserSrc.includes('Showing') || !/Showing \{filtered\.length\} of \{deepDives\.length\}/.test(browserSrc))
    check('an "Available now" heading with a catalog-derived count exists', /Available now \(\{available\.length\}/.test(browserSrc))
    check('a "Planned topics" disclosure with a catalog-derived count exists', /Planned topics \(\{planned\.length\}\)/.test(browserSrc))
    check('planned topics render as a collapsed-by-default <details> disclosure, not a full card grid', /<details className="group[^"]*">/.test(browserSrc))
    check('singular/plural is handled for the Available heading', /available\.length === 1 \? 'Deep Dive' : 'Deep Dives'/.test(browserSrc))
  }

  // ---------------------------------------------------------------------------
  section('4. Deep Dives catalog counts: verified against the real catalog file')
  // ---------------------------------------------------------------------------

  {
    const catalogSrc = readRepoFile('content/deep-dives/catalog.ts')
    const codeOnly = catalogSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    const publishedCount = (codeOnly.match(/status: 'published'/g) ?? []).length
    const plannedCount = (codeOnly.match(/status: 'planned'/g) ?? []).length
    const reviewReadyCount = (codeOnly.match(/status: 'review-ready'/g) ?? []).length
    check('catalog has exactly 6 published Deep Dives today', publishedCount === 6, String(publishedCount))
    check('catalog has exactly 14 planned Deep Dives today', plannedCount === 14, String(plannedCount))
    check('catalog has 0 review-ready Deep Dives today', reviewReadyCount === 0, String(reviewReadyCount))

    const learnPageSrc = readRepoFile('app/learn/page.tsx')
    check(
      "Learning Center's PR #211 published-count logic (from lib/deep-dives.ts's isDeepDiveAvailable) is still intact",
      learnPageSrc.includes('DEEP_DIVES.filter(isDeepDiveAvailable).length')
    )
  }

  // ---------------------------------------------------------------------------
  section('5. Listing pages bring published content higher (redundant intro elements removed)')
  // ---------------------------------------------------------------------------

  {
    const deepDivesPageSrc = readRepoFile('app/deep-dives/page.tsx')
    check('the redundant "don\'t need to be read in order" muted explanatory card is gone', !deepDivesPageSrc.includes("Deep Dives don&apos;t need to be read in"))
    check('the 3-pillar row (genuinely distinct info) is preserved', deepDivesPageSrc.includes('PILLARS.map'))
    check('DeepDiveBrowser is still rendered with the real catalog', deepDivesPageSrc.includes('<DeepDiveBrowser deepDives={DEEP_DIVES} />'))

    const insightsPageSrc = readRepoFile('app/insights/page.tsx')
    check('the redundant POSITIONING_POINTS row (restated the hero tagline) is gone', !insightsPageSrc.includes('POSITIONING_POINTS'))
    check('ExploreInsightsNav is preserved', insightsPageSrc.includes('<ExploreInsightsNav'))
    check('the featured-card treatment is preserved (featured prop still used)', insightsPageSrc.includes('featured'))
    check('the hero itself is untouched (same headline)', insightsPageSrc.includes('Practical ideas, modern techniques, and emerging trends.'))
    check('?category= server-side filtering is preserved', insightsPageSrc.includes('searchParams: Promise<{ category?: string }>'))
  }

  // ---------------------------------------------------------------------------
  section('6. TOC grouping: real execution against synthetic item lists')
  // ---------------------------------------------------------------------------

  {
    const flat: DeepDiveTocItem[] = [
      tocItem('intro', '1. Introduction', 2),
      tocItem('intro-sub-a', 'Sub A', 3),
      tocItem('intro-sub-b', 'Sub B', 3),
      tocItem('deep-dive', '2. Deep Dive', 2),
      tocItem('deep-dive-sub-a', 'Sub A', 3),
      tocItem('wrap-up', '3. Wrap-up', 2),
    ]
    const groups = groupTocItems(flat)
    check('3 h2 sections group correctly from a flat 6-item list', groups.length === 3)
    check('the first group carries its 2 h3 children', groups[0].children.length === 2)
    check('the second group carries its 1 h3 child', groups[1].children.length === 1)
    check('a section with no h3 children has an empty children array, not a crash', groups[2].children.length === 0)
    check('every real heading survives grouping (no item lost)', groups.reduce((n, g) => n + 1 + g.children.length, 0) === flat.length)

    // Edge case: an h3 with no preceding h2 must still appear in the TOC,
    // not be silently dropped.
    const noParent: DeepDiveTocItem[] = [tocItem('orphan-sub', 'Orphan sub-heading', 3), tocItem('real-h2', 'Real section', 2)]
    const orphanGroups = groupTocItems(noParent)
    check('an h3 with no preceding h2 becomes its own top-level group rather than being dropped', orphanGroups.length === 2 && orphanGroups[0].heading.id === 'orphan-sub')

    check('an empty item list groups to an empty array', groupTocItems([]).length === 0)
  }

  // ---------------------------------------------------------------------------
  section('6b. Expanded-group resolution: real execution against synthetic group lists (follow-up fix)')
  // ---------------------------------------------------------------------------

  {
    // A review found the first version of this fell back to "every group
    // expanded" whenever activeId was null -- true on first paint, and
    // permanently true if no heading ever intersected the observer's active
    // band. Every case below exercises resolveExpandedGroupId/
    // resolveHashHeadingId directly (the real functions the component calls),
    // not a source-string pattern match, per the review's explicit preference.
    const items: DeepDiveTocItem[] = [
      tocItem('intro', '1. Introduction', 2),
      tocItem('intro-sub-a', 'Sub A', 3),
      tocItem('intro-sub-b', 'Sub B', 3),
      tocItem('deep-dive', '2. Deep Dive', 2),
      tocItem('deep-dive-sub-a', 'Sub A', 3),
      tocItem('wrap-up', '3. Wrap-up', 2),
    ]
    const groups = groupTocItems(items)

    check(
      'default initial state (activeId null) expands only the first H2 group, not every group',
      resolveExpandedGroupId(groups, null) === 'intro'
    )

    const h2Hash = resolveHashHeadingId(items, '#deep-dive')
    check('a hash targeting an H2 resolves to that H2 id', h2Hash === 'deep-dive')
    check('a hash targeting an H2 expands that H2 group', resolveExpandedGroupId(groups, h2Hash) === 'deep-dive')

    const h3Hash = resolveHashHeadingId(items, '#deep-dive-sub-a')
    check('a hash targeting an H3 resolves to that H3 id', h3Hash === 'deep-dive-sub-a')
    check("a hash targeting an H3 expands its parent H2's group, not a group of its own", resolveExpandedGroupId(groups, h3Hash) === 'deep-dive')

    const unknownHash = resolveHashHeadingId(items, '#does-not-exist')
    check('an unknown hash does not resolve to a real heading id', unknownHash === null)
    check('an unknown/stale hash falls back safely to the first group, never zero or all groups', resolveExpandedGroupId(groups, unknownHash) === 'intro')
    check('a leading-# and bare-id hash resolve identically', resolveHashHeadingId(items, 'deep-dive') === resolveHashHeadingId(items, '#deep-dive'))
    check('an empty/null hash resolves to no match', resolveHashHeadingId(items, '') === null && resolveHashHeadingId(items, null) === null)

    check(
      'changing the active heading (as the observer would) changes the expanded group away from the default',
      resolveExpandedGroupId(groups, 'wrap-up') === 'wrap-up' && resolveExpandedGroupId(groups, 'wrap-up') !== resolveExpandedGroupId(groups, null)
    )

    check(
      'exactly one group is ever expanded for any activeId input (never zero, never more than one)',
      [null, 'intro', 'intro-sub-a', 'deep-dive', 'deep-dive-sub-a', 'wrap-up', 'unknown-id'].every(
        (id) => groups.filter((g) => g.heading.id === resolveExpandedGroupId(groups, id)).length === 1
      )
    )

    check('all H2 headings remain present in the grouped structure regardless of which group is expanded', groups.map((g) => g.heading.id).join(',') === 'intro,deep-dive,wrap-up')
    check(
      'H3 headings are never lost from the grouped structure (grouping itself is unaffected by expansion state)',
      groups.reduce((n, g) => n + g.children.length, 0) === items.filter((i) => i.level === 3).length
    )

    check('an empty TOC has no groups to expand', resolveExpandedGroupId(groupTocItems([]), null) === null)
    check('an empty TOC has no heading hash to resolve', resolveHashHeadingId([], '#anything') === null)

    // Orphan H3 (no preceding H2) becomes its own top-level "group" (see
    // section 6 above) -- resolving it as the active id must still land on
    // a real, existing group id, not crash or return something stale.
    const orphanItems: DeepDiveTocItem[] = [tocItem('orphan-sub', 'Orphan sub-heading', 3), tocItem('real-h2', 'Real section', 2)]
    const orphanGroups = groupTocItems(orphanItems)
    check('an orphan H3 group resolves safely as its own expandable group', resolveExpandedGroupId(orphanGroups, 'orphan-sub') === 'orphan-sub')

    const tocSrc = readRepoFile('components/deep-dive-toc.tsx')
    check(
      'DeepDiveToc imports the grouping and expansion helpers rather than redefining them',
      /import \{ groupTocItems, resolveExpandedGroupId, resolveHashHeadingId, type DeepDiveTocItem \} from '@\/lib\/deep-dive-render'/.test(tocSrc)
    )
    check(
      'children render only for the group resolveExpandedGroupId actually picked, not a hand-rolled null fallback',
      tocSrc.includes('group.heading.id === expandedGroupId')
    )
    check(
      'the old "activeId === null means expand everything" fallback is gone',
      !/activeId === null \|\| isGroupActive/.test(tocSrc)
    )
    check('DeepDiveToc still has exactly one client-side scroll-tracking system (the existing single IntersectionObserver, no second one added)', (tocSrc.match(/new IntersectionObserver/g) ?? []).length === 1)
    check('the mobile disclosure is still the native, zero-JS <details>/<summary> pattern', tocSrc.includes('<details') && tocSrc.includes('<summary'))
    check('the initial activeId state stays hash-free (no window.location read in the useState initializer, to avoid a hydration mismatch)', !/useState<string \| null>\(\s*window\.location/.test(tocSrc))
    check('a useLayoutEffect resolves the hash before paint (not useEffect, to avoid a first-group flash on hash-targeted loads)', /useLayoutEffect\(\(\) => \{\s*const hashId = resolveHashHeadingId/.test(tocSrc))
    check('the chevron expand indicator is decorative only, not a misleading interactive control', tocSrc.includes('aria-hidden="true"') && !/<ChevronRight[\s\S]{0,120}onClick/.test(tocSrc))
  }

  // ---------------------------------------------------------------------------
  section('7. Standardized breadcrumb: shared structured-data builder + shared visible component')
  // ---------------------------------------------------------------------------

  {
    const data = buildReaderBreadcrumbStructuredData({ name: 'Deep Dives', path: '/deep-dives' }, { name: 'Example', path: '/deep-dives/example' })
    check('breadcrumb structured data is a valid BreadcrumbList', data['@type'] === 'BreadcrumbList')
    check('position 1 is always Home at the site root', data.itemListElement[0].name === 'Home' && data.itemListElement[0].item === SITE_URL)
    check('position 2 is the section', data.itemListElement[1].name === 'Deep Dives' && data.itemListElement[1].item === `${SITE_URL}/deep-dives`)
    check('position 3 is the article', data.itemListElement[2].name === 'Example' && data.itemListElement[2].item === `${SITE_URL}/deep-dives/example`)

    const insightStructuredSrc = readRepoFile('lib/insight-structured-data.ts')
    check(
      "Insight's own breadcrumb builder delegates to the shared one, rather than duplicating the JSON-LD shape",
      /return buildReaderBreadcrumbStructuredData\(/.test(insightStructuredSrc)
    )

    const deepDivePageSrc = readRepoFile('app/deep-dives/[slug]/page.tsx')
    const insightPageSrc = readRepoFile('app/insights/[slug]/page.tsx')
    check('Deep Dive detail page now renders the shared <ReaderBreadcrumb>', deepDivePageSrc.includes('<ReaderBreadcrumb'))
    check('Deep Dive detail page now emits BreadcrumbList structured data (it had none before)', deepDivePageSrc.includes('buildReaderBreadcrumbStructuredData'))
    check('Insight detail page renders the same shared <ReaderBreadcrumb>, not its own inline nav', insightPageSrc.includes('<ReaderBreadcrumb'))
    check('Insight detail page no longer hand-rolls its breadcrumb nav markup', !insightPageSrc.includes('aria-label="Breadcrumb"'))
    check('Deep Dive detail page gained a bottom "All Deep Dives" return link (standardized with Insight\'s existing pattern)', deepDivePageSrc.includes('All Deep Dives'))
    check('Insight detail page still has its own bottom "All IBM i Insights" return link (unchanged)', insightPageSrc.includes('All IBM i Insights'))

    const breadcrumbComponentSrc = readRepoFile('components/reader-breadcrumb.tsx')
    check('ReaderBreadcrumb is a Server Component (no "use client")', !breadcrumbComponentSrc.includes("'use client'"))
    check('every breadcrumb segment is a real <Link>, not client-only navigation', breadcrumbComponentSrc.includes('<Link'))
  }

  // ---------------------------------------------------------------------------
  section('8. Canonical URLs, noindex rules, and existing structured data are unchanged')
  // ---------------------------------------------------------------------------

  {
    const deepDivePageSrc = readRepoFile('app/deep-dives/[slug]/page.tsx')
    const insightPageSrc = readRepoFile('app/insights/[slug]/page.tsx')
    check('Deep Dive canonical URL pattern is unchanged', deepDivePageSrc.includes('canonical: `/deep-dives/${deepDive.slug}`'))
    check('Insight canonical URL pattern is unchanged', insightPageSrc.includes('canonical: `/insights/${insight.slug}`'))
    check('Deep Dive TechArticle structured data is still emitted', deepDivePageSrc.includes('buildDeepDiveStructuredData'))
    check('Insight TechArticle structured data is still emitted', insightPageSrc.includes('buildInsightStructuredData'))
    check('generateStaticParams for Deep Dives still filters through isDeepDiveAvailable (only published slugs are ever routable)', deepDivePageSrc.includes('DEEP_DIVES.filter(isDeepDiveAvailable)'))
  }

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`Reader-experience regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('Reader-experience regression FAILED.')
    process.exit(1)
  }
  console.log('Reader-experience regression passed.')
}

main().catch((err) => {
  console.error('Reader-experience regression script crashed:', err)
  process.exit(1)
})
