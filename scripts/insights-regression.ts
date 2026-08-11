/**
 * IBM i Insights regression pass (PR #194 -- Launch IBM i Insights).
 *
 * Standalone via `tsx`, no test framework dependency -- matches the
 * existing scripts/deep-dive-toc-regression.ts style (check/section
 * helpers, pass/fail counter, process.exit(1) on any failure). Runs
 * entirely against real production modules under lib/ and content/insights/
 * (no mocked catalog), plus a few source-text assertions against the route
 * and navigation/footer/homepage files for things that aren't otherwise
 * unit-testable without a rendering/test-framework dependency this repo
 * doesn't have (see scripts/rag-regression.ts's header comment for the same
 * constraint on a different feature).
 *
 * Usage:
 *   npm run test:insights
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { INSIGHTS } from '../content/insights/catalog'
import { isInsightAvailable, getPublishedInsights, getFeaturedInsight, type Insight } from '../lib/insights'
import { INSIGHT_CATEGORIES } from '../lib/insight-categories'
import { renderLessonMarkdown } from '../lib/markdown'
import { addDeepDiveHeadingAnchors } from '../lib/deep-dive-render'
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
function findPublishedInsight(slug: string): Insight | undefined {
  const insight = INSIGHTS.find((i) => i.slug === slug)
  return insight && isInsightAvailable(insight) ? insight : undefined
}

// Compared as plain ISO date strings (YYYY-MM-DD), not Date timestamps --
// comparing `new Date(dateOnlyString)` (parsed as UTC midnight) against
// `new Date()` (the local instant right now) is timezone-flaky: a machine
// running west of UTC can have a local moment that's still technically
// "before" today's UTC midnight, flagging a same-day publishedAt as
// falsely in the future. String comparison of YYYY-MM-DD sidesteps that.
const TODAY_ISO_DATE = new Date().toISOString().slice(0, 10)
const LAUNCH_SLUG = 'rpg-rest-api-integrated-web-services'

async function runChecks() {
// ---------------------------------------------------------------------------
// Section 1: catalog validation
// ---------------------------------------------------------------------------
section('1. Insight catalog entries are well-formed')

{
  check('catalog has at least one entry', INSIGHTS.length > 0, `got ${INSIGHTS.length}`)

  for (const insight of INSIGHTS) {
    const label = `"${insight.slug}"`
    check(`${label} has a non-empty title`, insight.title.trim().length > 0)
    check(`${label} has a non-empty description`, insight.description.trim().length > 0)
    check(
      `${label} category is a known InsightCategoryId`,
      INSIGHT_CATEGORIES.some((c) => c.id === insight.category),
      `got ${insight.category}`
    )
    check(`${label} has at least one tag`, insight.tags.length > 0)
    check(
      `${label} publishedAt is a valid ISO date`,
      !Number.isNaN(new Date(insight.publishedAt).getTime()),
      `got ${insight.publishedAt}`
    )
    check(`${label} publishedAt is not in the future`, insight.publishedAt <= TODAY_ISO_DATE, `got ${insight.publishedAt}`)
    if (insight.updatedAt) {
      check(`${label} updatedAt is not in the future`, insight.updatedAt <= TODAY_ISO_DATE, `got ${insight.updatedAt}`)
    }
    check(`${label} readingTimeMinutes is a positive number`, insight.readingTimeMinutes > 0)
    check(`${label} status is 'draft' or 'published'`, insight.status === 'draft' || insight.status === 'published')
  }
}

// ---------------------------------------------------------------------------
// Section 2: unique slugs
// ---------------------------------------------------------------------------
section('2. Insight slugs are unique')

{
  const slugs = INSIGHTS.map((i) => i.slug)
  const uniqueSlugs = new Set(slugs)
  check('no duplicate slugs in the catalog', slugs.length === uniqueSlugs.size, `${slugs.length} entries, ${uniqueSlugs.size} unique`)
}

// ---------------------------------------------------------------------------
// Section 3: published-only listing behavior + no leakage
// ---------------------------------------------------------------------------
section('3. Only published Insights are ever listed, and drafts never leak')

{
  const draftInsight: Insight = {
    slug: 'a-draft-not-ready-yet',
    title: 'Draft',
    description: 'Draft',
    category: 'apis-integration',
    tags: ['draft'],
    publishedAt: '2026-01-01',
    readingTimeMinutes: 5,
    status: 'draft',
  }
  const publishedInsight: Insight = { ...draftInsight, slug: 'a-published-one', status: 'published' }

  check('isInsightAvailable() is false for a draft entry', isInsightAvailable(draftInsight) === false)
  check('isInsightAvailable() is true for a published entry', isInsightAvailable(publishedInsight) === true)

  const mixed = [draftInsight, publishedInsight]
  const listed = getPublishedInsights(mixed)
  check('getPublishedInsights() excludes drafts', !listed.some((i) => i.slug === draftInsight.slug))
  check('getPublishedInsights() includes published entries', listed.some((i) => i.slug === publishedInsight.slug))

  check(
    'every entry currently in the real catalog is published (no draft ever reaches the live listing)',
    INSIGHTS.every((i) => i.status === 'published'),
    `non-published slugs: ${INSIGHTS.filter((i) => i.status !== 'published').map((i) => i.slug).join(', ')}`
  )
}

// ---------------------------------------------------------------------------
// Section 4: known-slug lookup, unknown-slug handling, featured selection
// ---------------------------------------------------------------------------
section('4. Slug resolution matches detail-route behavior')

{
  const found = findPublishedInsight(LAUNCH_SLUG)
  check('launch article resolves by its real slug', found !== undefined, `slug ${LAUNCH_SLUG}`)
  check('resolved article status is published', found?.status === 'published')

  const unknown = findPublishedInsight('this-slug-does-not-exist-anywhere')
  check('unknown slug resolves to undefined (drives notFound())', unknown === undefined)

  const featured = getFeaturedInsight(INSIGHTS)
  check('a featured Insight exists for the homepage/listing hero card', featured !== undefined)
  check('featured Insight is published', featured ? isInsightAvailable(featured) : false)
}

// ---------------------------------------------------------------------------
// Section 5: canonical URL + structured data essentials
// ---------------------------------------------------------------------------
section('5. Canonical URLs and structured data are well-formed')

{
  const insight = findPublishedInsight(LAUNCH_SLUG)!
  const canonicalListing = `${SITE_URL}/insights`
  const canonicalDetail = `${SITE_URL}/insights/${insight.slug}`

  check('SITE_URL has no trailing slash to double up', !SITE_URL.endsWith('/'))
  check('listing canonical URL is well-formed', canonicalListing.endsWith('/insights'))
  check('detail canonical URL has no double slashes after the protocol', !canonicalDetail.replace(/^https?:\/\//, '').includes('//'))
  check('detail canonical URL contains the slug once', canonicalDetail.split(insight.slug).length === 2)

  const techArticle = buildInsightStructuredData(insight)
  check('TechArticle @type is correct', techArticle['@type'] === 'TechArticle')
  check('TechArticle headline matches the title', techArticle.headline === insight.title)
  check('TechArticle url matches the canonical detail URL', techArticle.url === canonicalDetail)
  check('TechArticle datePublished matches publishedAt', techArticle.datePublished === insight.publishedAt)
  check('TechArticle has no dateModified when updatedAt is unset', insight.updatedAt ? true : !('dateModified' in techArticle))
  check('TechArticle publisher name/url are set', techArticle.publisher.name.length > 0 && techArticle.publisher.url === SITE_URL)

  const breadcrumb = buildBreadcrumbStructuredData(insight)
  check('BreadcrumbList @type is correct', breadcrumb['@type'] === 'BreadcrumbList')
  check('BreadcrumbList has exactly 3 items (Home / Insights / Article)', breadcrumb.itemListElement.length === 3)
  check('BreadcrumbList last item points at the detail URL', breadcrumb.itemListElement[2].item === canonicalDetail)
}

// ---------------------------------------------------------------------------
// Section 6: sitemap and robots inclusion (static source checks -- sitemap.ts
// itself calls getPublishedLessons(), a server-only Supabase call that needs
// a live DB session, so it isn't invoked directly here; same constraint
// scripts/rag-regression.ts documents for a different route)
// ---------------------------------------------------------------------------
section('6. Sitemap and robots reference /insights')

{
  const sitemapSrc = readRepoFile('app/sitemap.ts')
  check("sitemap.ts imports the Insights catalog", sitemapSrc.includes("from '@/content/insights/catalog'"))
  check('sitemap.ts filters with isInsightAvailable before listing routes', sitemapSrc.includes('isInsightAvailable'))
  check('sitemap.ts includes a static /insights listing route', sitemapSrc.includes('${SITE_URL}/insights`'))
  check('sitemap.ts includes an insightRoutes block in the returned array', sitemapSrc.includes('insightRoutes'))

  const robotsSrc = readRepoFile('app/robots.ts')
  check("robots.ts allows '/insights'", /allow:\s*\[[^\]]*'\/insights'/.test(robotsSrc))
}

// ---------------------------------------------------------------------------
// Section 7: navigation, footer, and homepage wiring
// ---------------------------------------------------------------------------
section('7. Navigation, footer, and homepage link to IBM i Insights')

{
  const navSrc = readRepoFile('components/site-nav-links.tsx')
  const navInsightLinks = navSrc.match(/href:\s*'\/insights'/g) ?? []
  check('nav links include /insights for logged-in and logged-out link sets', navInsightLinks.length >= 2, `found ${navInsightLinks.length}`)
  check("nav label reads 'IBM i Insights'", navSrc.includes("label: 'IBM i Insights'"))

  const footerSrc = readRepoFile('components/site-footer.tsx')
  check("footer PRODUCT_LINKS include '/insights'", footerSrc.includes("{ href: '/insights', label: 'IBM i Insights' }"))

  const homepageSrc = readRepoFile('app/page.tsx')
  check("homepage has an 'Explore IBM i Insights' section heading", homepageSrc.includes('Explore IBM i Insights'))
  check('homepage links out to /insights', homepageSrc.includes("href=\"/insights\""))
  check(
    'homepage does not fold Insights into the existing "Three ways to learn" grid (still exactly 3 Cards there)',
    (() => {
      const start = homepageSrc.indexOf('Three ways to learn')
      const end = homepageSrc.indexOf('IBM i Fundamentals highlight')
      const between = start >= 0 && end > start ? homepageSrc.slice(start, end) : ''
      const cardCount = (between.match(/<Card className="p-6">/g) ?? []).length
      return cardCount === 3
    })()
  )
}

// ---------------------------------------------------------------------------
// Section 8: article rendering -- TOC, diagram slot, heading structure
// ---------------------------------------------------------------------------
section('8. Launch article renders with a complete TOC and exactly one diagram slot')

{
  const markdown = readRepoFile(`content/insights/${LAUNCH_SLUG}.md`)

  const markerCount = (markdown.match(/\[\[ARCHITECTURE-DIAGRAM\]\]/g) ?? []).length
  check('markdown contains exactly one architecture-diagram marker', markerCount === 1, `found ${markerCount}`)

  const rendered = await renderLessonMarkdown(markdown)
  const { html, toc } = addDeepDiveHeadingAnchors(rendered)

  check('at least 10 top-level sections are present in the TOC', toc.filter((t) => t.level === 2).length >= 10, `got ${toc.filter((t) => t.level === 2).length}`)
  check('TOC ids are unique', new Set(toc.map((t) => t.id)).size === toc.length)
  check('rendered HTML still contains the diagram marker as its own paragraph', html.includes('<p>[[ARCHITECTURE-DIAGRAM]]</p>'))
  check('rendered HTML includes a References section heading', /References and further reading/.test(html))
  check('rendered HTML includes a deployment-readiness checklist (GFM task list)', html.includes('type="checkbox"'))
}

// ---------------------------------------------------------------------------
// Section 9: responsive-overflow safeguards (static checks)
// ---------------------------------------------------------------------------
section('9. Diagram and article markup avoid known horizontal-overflow patterns')

{
  const diagramSrc = readRepoFile('components/insights/architecture-diagram.tsx')
  check('diagram uses a single-column flex layout (flex-col), not a wide multi-column grid', diagramSrc.includes('flex-col'))
  check('diagram does not use a fixed pixel width that could force overflow on narrow screens', !/width:\s*\d+px/.test(diagramSrc))
  check('diagram is capped with a max-width utility rather than a fixed width', diagramSrc.includes('max-w-md'))
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
