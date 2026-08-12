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
    const navSrc = readRepoFile('components/site-nav-links.tsx')
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
      'the page explains Insights are independent editorial articles, not lessons or Deep Dives',
      /not curriculum lessons and not Deep Dive reference guides/.test(listingSrc)
    )
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
