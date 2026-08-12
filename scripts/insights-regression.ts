/**
 * IBM i Insights regression pass.
 *
 * Standalone via `tsx`, no test framework dependency -- matches the
 * existing scripts/deep-dive-toc-regression.ts style (check/section
 * helpers, pass/fail counter, process.exit(1) on any failure). Runs
 * entirely against real production modules under lib/ and content/insights/
 * (no mocked catalog for the "is the real catalog empty" assertions), plus
 * source-text assertions against the route/nav/footer/homepage files for
 * things that aren't otherwise unit-testable without a rendering/test-
 * framework dependency this repo doesn't have (see scripts/rag-regression.ts's
 * header comment for the same constraint on a different feature).
 *
 * Scope note: this section intentionally publishes ZERO Insight articles
 * right now (see content/insights/catalog.ts) -- the Product Owner asked to
 * establish and visually review the /insights section on its own first.
 * Individual Insight articles are a separate, future PR. Every check below
 * reflects that: there is no "known launch slug" to test against, and
 * several checks specifically assert the *absence* of article content,
 * placeholder cards, and fabricated publication data.
 *
 * Usage:
 *   npm run test:insights
 */

import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { INSIGHTS } from '../content/insights/catalog'
import { isInsightAvailable, getPublishedInsights, getFeaturedInsight, type Insight } from '../lib/insights'
import { INSIGHT_CATEGORIES } from '../lib/insight-categories'
import { buildInsightStructuredData, buildBreadcrumbStructuredData } from '../lib/insight-structured-data'
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

// Mirrors findPublishedInsight() in app/insights/[slug]/page.tsx exactly --
// duplicated here deliberately (not imported) since importing a Next.js
// page module into a standalone script pulls in next/navigation and a
// request context this script doesn't have. See lib/insight-structured-data.ts
// for the part of that page's logic that *was* worth extracting for testing.
function findPublishedInsight(catalog: Insight[], slug: string): Insight | undefined {
  const insight = catalog.find((i) => i.slug === slug)
  return insight && isInsightAvailable(insight) ? insight : undefined
}

// A synthetic, non-catalog Insight used to exercise generic logic (slug
// validation, structured-data building) without depending on any real,
// published article -- there isn't one right now, by design.
const SYNTHETIC_INSIGHT: Insight = {
  slug: 'synthetic-example-for-tests-only',
  title: 'Synthetic Example Insight (test fixture, never rendered)',
  description: 'A fixture Insight used only by scripts/insights-regression.ts -- never part of the real catalog.',
  category: 'apis-integration',
  tags: ['fixture'],
  publishedAt: '2026-01-01',
  readingTimeMinutes: 5,
  status: 'published',
}

async function runChecks() {
  // ---------------------------------------------------------------------------
  section('1. The real catalog is intentionally empty -- no article, no placeholder')
  // ---------------------------------------------------------------------------

  check('content/insights/catalog.ts has zero entries', INSIGHTS.length === 0, `got ${INSIGHTS.length}`)
  check('getPublishedInsights() on the real catalog is empty', getPublishedInsights(INSIGHTS).length === 0)
  check('getFeaturedInsight() on the real catalog is undefined (no fake "featured" article)', getFeaturedInsight(INSIGHTS) === undefined)

  const insightsContentDir = resolve(__dirname, '..', 'content', 'insights')
  const markdownFiles = readdirSync(insightsContentDir).filter((f) => f.endsWith('.md'))
  check('content/insights/ has no leftover article Markdown files', markdownFiles.length === 0, `found: ${markdownFiles.join(', ')}`)

  // ---------------------------------------------------------------------------
  section('2. Catalog entry validation logic (executed against a synthetic fixture, generically)')
  // ---------------------------------------------------------------------------

  {
    // Exercises the shape every future catalog entry must satisfy, without
    // depending on a real article existing yet.
    const insight = SYNTHETIC_INSIGHT
    check('a well-formed entry has a non-empty title', insight.title.trim().length > 0)
    check('a well-formed entry has a non-empty description', insight.description.trim().length > 0)
    check('a well-formed entry has a known InsightCategoryId', INSIGHT_CATEGORIES.some((c) => c.id === insight.category))
    check('a well-formed entry has at least one tag', insight.tags.length > 0)
    check('a well-formed entry has a valid ISO publishedAt', !Number.isNaN(new Date(insight.publishedAt).getTime()))
    check('a well-formed entry has a positive readingTimeMinutes', insight.readingTimeMinutes > 0)
  }

  // ---------------------------------------------------------------------------
  section('3. Slugs stay unique as entries are added, and drafts never leak')
  // ---------------------------------------------------------------------------

  {
    const slugs = INSIGHTS.map((i) => i.slug)
    check('no duplicate slugs in the real catalog', slugs.length === new Set(slugs).size)

    const draftInsight: Insight = { ...SYNTHETIC_INSIGHT, slug: 'a-draft-not-ready-yet', status: 'draft' }
    const publishedInsight: Insight = { ...SYNTHETIC_INSIGHT, slug: 'a-published-one', status: 'published' }

    check('isInsightAvailable() is false for a draft entry', isInsightAvailable(draftInsight) === false)
    check('isInsightAvailable() is true for a published entry', isInsightAvailable(publishedInsight) === true)

    const mixed = [draftInsight, publishedInsight]
    const listed = getPublishedInsights(mixed)
    check('getPublishedInsights() excludes drafts', !listed.some((i) => i.slug === draftInsight.slug))
    check('getPublishedInsights() includes published entries', listed.some((i) => i.slug === publishedInsight.slug))
  }

  // ---------------------------------------------------------------------------
  section('4. Detail-route slug resolution: everything 404s while the catalog is empty')
  // ---------------------------------------------------------------------------

  {
    const anyRealSlug = findPublishedInsight(INSIGHTS, 'anything-at-all')
    check('no slug resolves against the real (empty) catalog', anyRealSlug === undefined)

    const unknown = findPublishedInsight([SYNTHETIC_INSIGHT], 'this-slug-does-not-exist-anywhere')
    check('an unknown slug resolves to undefined (drives notFound()), generically', unknown === undefined)

    const known = findPublishedInsight([SYNTHETIC_INSIGHT], SYNTHETIC_INSIGHT.slug)
    check('a published slug resolves when it does exist in a catalog, generically', known?.slug === SYNTHETIC_INSIGHT.slug)
  }

  // ---------------------------------------------------------------------------
  section('5. Canonical URLs and structured-data builders still work generically')
  // ---------------------------------------------------------------------------

  {
    const canonicalListing = `${SITE_URL}/insights`
    const canonicalDetail = `${SITE_URL}/insights/${SYNTHETIC_INSIGHT.slug}`

    check('SITE_URL has no trailing slash to double up', !SITE_URL.endsWith('/'))
    check('listing canonical URL is well-formed', canonicalListing.endsWith('/insights'))
    check('detail canonical URL has no double slashes after the protocol', !canonicalDetail.replace(/^https?:\/\//, '').includes('//'))

    const techArticle = buildInsightStructuredData(SYNTHETIC_INSIGHT)
    check('TechArticle @type is correct', techArticle['@type'] === 'TechArticle')
    check('TechArticle headline matches the title', techArticle.headline === SYNTHETIC_INSIGHT.title)
    check('TechArticle url matches the canonical detail URL', techArticle.url === canonicalDetail)

    const breadcrumb = buildBreadcrumbStructuredData(SYNTHETIC_INSIGHT)
    check('BreadcrumbList @type is correct', breadcrumb['@type'] === 'BreadcrumbList')
    check('BreadcrumbList has exactly 3 items (Home / Insights / Article)', breadcrumb.itemListElement.length === 3)
    check('BreadcrumbList last item points at the detail URL', breadcrumb.itemListElement[2].item === canonicalDetail)
  }

  // ---------------------------------------------------------------------------
  // Section 6: sitemap and robots (static source checks -- sitemap.ts itself
  // calls getPublishedLessons(), a server-only Supabase call that needs a
  // live DB session, so it isn't invoked directly here; same constraint
  // scripts/rag-regression.ts documents for a different route).
  // ---------------------------------------------------------------------------
  section('6. Sitemap references /insights, and no article slug can enter it while the catalog is empty')

  {
    const sitemapSrc = readRepoFile('app/sitemap.ts')
    check('sitemap.ts imports the Insights catalog', sitemapSrc.includes("from '@/content/insights/catalog'"))
    check('sitemap.ts filters with isInsightAvailable before listing routes', sitemapSrc.includes('isInsightAvailable'))
    check('sitemap.ts includes a static /insights listing route', sitemapSrc.includes('${SITE_URL}/insights`'))
    check('sitemap.ts includes an insightRoutes block in the returned array', sitemapSrc.includes('insightRoutes'))
    check(
      'no article slug can enter the sitemap right now -- the real catalog sitemap.ts reads from is empty',
      INSIGHTS.filter(isInsightAvailable).length === 0
    )

    const robotsSrc = readRepoFile('app/robots.ts')
    check("robots.ts allows '/insights'", /allow:\s*\[[^\]]*'\/insights'/.test(robotsSrc))
  }

  // ---------------------------------------------------------------------------
  section('7. Navigation and footer link to IBM i Insights; homepage carries no featured-article section')
  // ---------------------------------------------------------------------------

  {
    // The nav link data (Site-wide Navigation and Section Landing Page
    // Visual Upgrade) now lives in lib/nav-links.ts, a plain module
    // components/site-nav-links.tsx imports from -- see that file's header
    // comment for why the data had to move out of the 'use client' component.
    const navSrc = readRepoFile('lib/nav-links.ts')
    const navInsightLinks = navSrc.match(/href:\s*'\/insights'/g) ?? []
    check('nav links include /insights for logged-in and logged-out link sets', navInsightLinks.length >= 2, `found ${navInsightLinks.length}`)
    check("nav label reads 'IBM i Insights'", navSrc.includes("label: 'IBM i Insights'"))

    const footerSrc = readRepoFile('components/site-footer.tsx')
    check("footer PRODUCT_LINKS include '/insights'", footerSrc.includes("{ href: '/insights', label: 'IBM i Insights' }"))

    const homepageSrc = readRepoFile('app/page.tsx')
    check('homepage no longer has a featured-Insight section (no article to feature)', !homepageSrc.includes('Explore IBM i Insights'))
    check('homepage no longer imports InsightCard', !homepageSrc.includes('InsightCard'))
    check('homepage no longer imports the Insights catalog', !homepageSrc.includes("from '@/content/insights/catalog'"))
    check(
      'homepage still has exactly 3 Cards in "Three ways to learn" (unaffected by removing the Insights section)',
      (() => {
        const start = homepageSrc.indexOf('Three ways to learn')
        const end = homepageSrc.indexOf('IBM i Fundamentals highlight')
        const between = start >= 0 && end > start ? homepageSrc.slice(start, end) : ''
        return (between.match(/<Card className="p-6">/g) ?? []).length === 3
      })()
    )
  }

  // ---------------------------------------------------------------------------
  section('8. /insights is a polished, honest empty-state landing page')
  // ---------------------------------------------------------------------------

  {
    const listingSrc = readRepoFile('app/insights/page.tsx')

    check('the page has an "IBM i Insights" heading', /IBM i Insights<\/h1>/.test(listingSrc))
    check('the page states the approved tagline', listingSrc.includes('Practical ideas, modern techniques, and emerging trends.'))
    check(
      'the page explains Insights are independent editorial content, separate from lessons and Deep Dives',
      /separate from curriculum lessons and Deep Dive reference guides/.test(listingSrc)
    )
    check('the hero has a premium badge distinct from an article claim', listingSrc.includes('Editorial perspectives for modern IBM i'))
    check('the hero does not add an article CTA (no "Read Insight"/"Read Article" link in the hero)', !/Read (Insight|Article)/.test(listingSrc))
    check('the page has a tasteful "being prepared" empty state', listingSrc.includes('Insights are being prepared'))
    check(
      'the empty state does not actually import or render InsightCard (a bare mention in a comment is fine)',
      !/import \{ InsightCard/.test(listingSrc) && !/<InsightCard/.test(listingSrc)
    )
    check('the page does not import the (currently empty) Insights catalog', !listingSrc.includes("from '@/content/insights/catalog'"))
    check('the word "Chapter" never appears anywhere on the page', !/\bChapter\b/i.test(listingSrc))
    check('the page never calls Insights "lessons"', !/\binsight lessons\b/i.test(listingSrc))
    check('there is no fake "Coming soon" placeholder card (the Deep Dive convention this page deliberately does not reuse)', !listingSrc.includes('Coming soon'))
    check(
      'there is no publishing-frequency or specific-date promise (e.g. "every week", "monthly", "this month")',
      !/\b(every week|weekly|monthly|this month|next month|coming soon|launching soon)\b/i.test(listingSrc)
    )
    check(
      'the removed launch article is not referenced by title or slug anywhere on this page',
      !listingSrc.includes('rpg-rest-api-integrated-web-services') &&
        !listingSrc.includes('Integrated Web Services')
    )
  }

  // ---------------------------------------------------------------------------
  section('9. Insight detail route infrastructure is retained and still safe with zero entries')
  // ---------------------------------------------------------------------------

  {
    const detailSrc = readRepoFile('app/insights/[slug]/page.tsx')
    check('generateStaticParams() only ever includes available Insights', /INSIGHTS\.filter\(isInsightAvailable\)/.test(detailSrc))
    check('an unresolved slug calls notFound()', /if \(!insight\) \{[\s\S]{0,40}notFound\(\)/.test(detailSrc))
    check(
      'generateStaticParams() produces zero routes right now (nothing to statically build)',
      INSIGHTS.filter(isInsightAvailable).length === 0
    )
    check('the removed article-specific diagram component is no longer imported', !detailSrc.includes('architecture-diagram'))
    check('the detail route still reuses the generic Deep Dive TOC/markdown primitives (retained, reusable infrastructure)', detailSrc.includes('DeepDiveToc'))
  }

  // ---------------------------------------------------------------------------
  section('10. Documentation hygiene: no stale PR references, no leftover "Launch article" wording')
  // ---------------------------------------------------------------------------

  {
    const insightFiles: Record<string, string> = {
      'lib/insights.ts': readRepoFile('lib/insights.ts'),
      'lib/insight-categories.ts': readRepoFile('lib/insight-categories.ts'),
      'lib/insight-content.ts': readRepoFile('lib/insight-content.ts'),
      'lib/insight-structured-data.ts': readRepoFile('lib/insight-structured-data.ts'),
      'content/insights/catalog.ts': readRepoFile('content/insights/catalog.ts'),
      'components/insight-card.tsx': readRepoFile('components/insight-card.tsx'),
      'app/insights/page.tsx': readRepoFile('app/insights/page.tsx'),
      'app/insights/[slug]/page.tsx': readRepoFile('app/insights/[slug]/page.tsx'),
    }

    // scripts/insights-regression.ts itself is deliberately excluded from this
    // loop: this very check's own description text has to name the stale
    // pattern it's looking for, which would make the script fail against
    // itself if it were included -- the source files under lib/, content/,
    // components/, and app/ are what actually needed to stay clean.
    for (const [path, src] of Object.entries(insightFiles)) {
      check(`${path} has no stale "PR #194" reference`, !src.includes('PR #194'))
    }

    check(
      'components/insight-card.tsx no longer uses the "Launch article" badge label',
      !insightFiles['components/insight-card.tsx'].includes('Launch article')
    )
    check(
      'components/insight-card.tsx uses the reusable "Featured Insight" badge label instead',
      insightFiles['components/insight-card.tsx'].includes('Featured Insight')
    )
  }

  // ---------------------------------------------------------------------------
  section('11. Listing-page social metadata and keyboard-focus safeguards')
  // ---------------------------------------------------------------------------

  {
    const listingSrc = readRepoFile('app/insights/page.tsx')
    check('the listing page declares openGraph metadata', /openGraph:\s*\{/.test(listingSrc))
    check('the listing openGraph block has its own title', /openGraph:\s*\{[\s\S]{0,80}title:/.test(listingSrc))
    check('the listing openGraph block has its own description', /openGraph:\s*\{[\s\S]{0,160}description:/.test(listingSrc))
    check('the listing page declares twitter card metadata', /twitter:\s*\{/.test(listingSrc))
    check(
      'the listing page does not add article-specific structured data (no JSON-LD on the empty listing page)',
      !listingSrc.includes('StructuredData')
    )

    const detailSrc = readRepoFile('app/insights/[slug]/page.tsx')
    const cardSrc = readRepoFile('components/insight-card.tsx')

    // The empty-state's two secondary links use buttonVariants(), which already
    // bakes in focus-visible:ring-2 (see components/ui/button.tsx) -- that
    // literal string lives in button.tsx's source, not repeated inline here,
    // so "uses buttonVariants" is the correct signal for this file, the same
    // "already supplied by shared button styles" carve-out used elsewhere.
    check(
      "the listing page's secondary links get focus-visible styling, either inline or via buttonVariants()",
      (listingSrc.match(/focus-visible:ring-2/g) ?? []).length >= 2 ||
        (listingSrc.includes('buttonVariants(') && (listingSrc.match(/href="\/(deep-dives|learn)"/g) ?? []).length >= 2)
    )
    check('the retained InsightCard link carries focus-visible styling', /focus-visible:ring-2/.test(cardSrc))
    check(
      'the detail page\'s breadcrumb links carry focus-visible styling',
      /Breadcrumb"[\s\S]{0,300}focus-visible:ring-2/.test(detailSrc)
    )
    check(
      'the detail page\'s related-lessons links carry focus-visible styling',
      /Related lessons[\s\S]{0,700}focus-visible:ring-2/.test(detailSrc)
    )
    check(
      'the detail page\'s related-Deep-Dive links carry focus-visible styling',
      /Related Deep Dive[\s\S]{0,700}focus-visible:ring-2/.test(detailSrc)
    )
  }

  // ---------------------------------------------------------------------------
  section('12. Hero visual-polish pass: decorative-only, reduced-motion-safe, no external assets')
  // ---------------------------------------------------------------------------

  {
    const listingSrc = readRepoFile('app/insights/page.tsx')
    const globalsCss = readRepoFile('app/globals.css')

    check(
      'every decorative glow/grid/glyph element is aria-hidden (never announced to assistive tech)',
      (listingSrc.match(/pointer-events-none absolute/g) ?? []).length ===
        (listingSrc.match(/pointer-events-none absolute[\s\S]{0,400}?aria-hidden="true"/g) ?? []).length
    )
    check('no external image URL or <img>/<Image> is used for hero decoration', !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/.test(listingSrc) && !listingSrc.includes('next/image'))
    check('the hero entrance animation is CSS-only (a named class, not a JS animation library)', listingSrc.includes('insights-hero-enter'))
    check('the hero entrance keyframes exist in globals.css', /@keyframes insights-hero-in/.test(globalsCss))
    check(
      // .insights-hero-enter is now grouped with the reusable .section-hero-enter
      // (Site-wide Navigation and Section Landing Page Visual Upgrade) inside the
      // same reduced-motion override, so this checks the *content* of the
      // `@media (prefers-reduced-motion: reduce) { ... }` block for both the
      // selector and `animation: none`, rather than requiring one exact
      // single-selector layout.
      'the hero entrance animation is fully disabled under prefers-reduced-motion',
      (() => {
        const match = globalsCss.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)
        const block = match?.[1] ?? ''
        return block.includes('.insights-hero-enter') && /animation:\s*none/.test(block)
      })()
    )
    check(
      'card hover elevation respects prefers-reduced-motion (motion-reduce:transition-none present)',
      listingSrc.includes('motion-reduce:transition-none')
    )
    check('each positioning card has its own distinct gradient accent (3 unique accent class pairs)', new Set([...listingSrc.matchAll(/accent: '([^']+)'/g)].map((m) => m[1])).size === 3)
    check('the h1 "IBM i Insights" appears exactly once (single top-level heading)', (listingSrc.match(/<h1[^>]*>/g) ?? []).length === 1)
    // Exactly 2 literal <h2> occurrences in source: one JSX element mapped over
    // the 3 positioning cards (so it renders 3 times, but appears once in
    // source) plus the empty-state's own heading -- both one level below h1.
    check('the positioning-card and empty-state headings are h2, one level below h1 (no skipped heading level)', (listingSrc.match(/<h2[^>]*>/g) ?? []).length === 2)
  }
}

async function main() {
  await runChecks()

  console.log(`\n${'-'.repeat(60)}`)
  console.log(`IBM i Insights regression: ${passed} passed, ${failures} failed.`)
  if (failures > 0) {
    console.error('IBM i Insights regression FAILED.')
    process.exit(1)
  }
  console.log('IBM i Insights regression passed.')
}

main().catch((err) => {
  console.error('IBM i Insights regression script crashed:', err)
  process.exit(1)
})
