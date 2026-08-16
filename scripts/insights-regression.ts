/**
 * IBM i Insights regression pass.
 *
 * Standalone via `tsx`, no test framework dependency -- matches the
 * existing scripts/deep-dive-toc-regression.ts style (check/section
 * helpers, pass/fail counter, process.exit(1) on any failure). Runs
 * entirely against real production modules under lib/ and content/insights/
 * plus source-text assertions against the route/nav/footer/homepage files
 * for things that aren't otherwise unit-testable without a rendering/test-
 * framework dependency this repo doesn't have (see scripts/rag-regression.ts's
 * header comment for the same constraint on a different feature).
 *
 * Scope note: this section launched with ZERO Insight articles (Product
 * Owner review of the section's design on its own first); PR #199 published
 * the first one, "IBM i MCP Server: The New Bridge Between AI Assistants and
 * IBM i" (content/insights/ibm-i-mcp-server-ai-assistants.md); PR #202
 * published the second, "Modernizing RPG Applications with SQL and APIs"
 * (content/insights/modernizing-rpg-applications-with-sql-and-apis.md); PR
 * #203 published the third, "Db2 for i and QSYS2 Services Every Developer
 * Should Know" (content/insights/db2-for-i-qsys2-services-developers-
 * should-know.md); PR #206 published the fourth, "Building REST APIs
 * from IBM i Applications" (content/insights/building-rest-apis-from-ibm-i-
 * applications.md); PR #207 published the fifth, "Practical AI-Assisted
 * Development for RPG Programmers" (content/insights/practical-ai-assisted-
 * development-for-rpg-programmers.md); and this PR published the sixth,
 * "IBM i Application Monitoring and Production Troubleshooting"
 * (content/insights/ibm-i-application-monitoring-and-production-
 * troubleshooting.md). Sections below that once asserted "exactly one
 * Insight"/"exactly one Markdown file"/etc. now assert six, and the
 * figure-embedding checks (section 10) loop generically over every
 * published Insight with a Markdown file rather than hardcoding a single
 * slug -- a seventh Insight only needs its own entries in these arrays, not
 * a rewrite of the loop logic. Article-specific fact/content checks
 * (sections 11, 11b, 11c, 11d, 11e, 11f, and 12) stay scoped to the article
 * they verify, with a matching subsection added per article rather than
 * generalized, since their assertions are inherently about that one
 * article's specific claims.
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
import { DEEP_DIVES } from '../content/deep-dives/catalog'
import { splitInsightHtmlOnFigureMarkers } from '../lib/insight-render'
import { INSIGHT_FIGURE_REGISTRY } from '../components/insights/insight-figure-registry'

const LAUNCH_SLUG = 'ibm-i-mcp-server-ai-assistants'
const RPG_SQL_APIS_SLUG = 'modernizing-rpg-applications-with-sql-and-apis'
const DB2_QSYS2_SLUG = 'db2-for-i-qsys2-services-developers-should-know'
const REST_APIS_SLUG = 'building-rest-apis-from-ibm-i-applications'
const AI_ASSISTED_RPG_SLUG = 'practical-ai-assisted-development-for-rpg-programmers'
const APP_MONITORING_SLUG = 'ibm-i-application-monitoring-and-production-troubleshooting'
const PUBLISHED_SLUGS = [LAUNCH_SLUG, RPG_SQL_APIS_SLUG, DB2_QSYS2_SLUG, REST_APIS_SLUG, AI_ASSISTED_RPG_SLUG, APP_MONITORING_SLUG]

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
  section('1. The real catalog publishes all six Insights, each well-formed')
  // ---------------------------------------------------------------------------

  check('content/insights/catalog.ts has exactly six entries', INSIGHTS.length === 6, `got ${INSIGHTS.length}`)
  check('getPublishedInsights() on the real catalog returns all six entries', getPublishedInsights(INSIGHTS).length === 6)
  check('all six expected slugs are present in the catalog', PUBLISHED_SLUGS.every((slug) => INSIGHTS.some((i) => i.slug === slug)))
  check(
    'getFeaturedInsight() on the real catalog returns the launch article (the only one marked featured: true)',
    getFeaturedInsight(INSIGHTS)?.slug === LAUNCH_SLUG
  )
  check(
    'the launch article is still listing-page position 0 (its "featured" card treatment is positional, not the featured flag)',
    INSIGHTS[0]?.slug === LAUNCH_SLUG
  )

  for (const insight of INSIGHTS) {
    check(`${insight.slug} has a known InsightCategoryId`, INSIGHT_CATEGORIES.some((c) => c.id === insight.category))
    check(`${insight.slug} has at least one tag`, insight.tags.length > 0)
    check(
      `${insight.slug} has a valid, non-future ISO publishedAt`,
      (() => {
        const t = new Date(`${insight.publishedAt}T00:00:00Z`).getTime()
        return !Number.isNaN(t) && t <= Date.now()
      })()
    )
    check(`${insight.slug} has a positive readingTimeMinutes`, insight.readingTimeMinutes > 0)
    check(
      `${insight.slug}'s relatedDeepDiveSlugs entries all exist in the Deep Dive catalog (no dangling reference)`,
      (insight.relatedDeepDiveSlugs ?? []).every((slug) => DEEP_DIVES.some((d) => d.slug === slug))
    )
  }

  const insightsContentDir = resolve(__dirname, '..', 'content', 'insights')
  const markdownFiles = readdirSync(insightsContentDir).filter((f) => f.endsWith('.md'))
  check(
    'content/insights/ has exactly six Markdown files, matching all catalog slugs',
    markdownFiles.length === 6 && PUBLISHED_SLUGS.every((slug) => markdownFiles.includes(`${slug}.md`)),
    `found: ${markdownFiles.join(', ')}`
  )

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
  section('4. Detail-route slug resolution')
  // ---------------------------------------------------------------------------

  {
    const launchSlug = findPublishedInsight(INSIGHTS, LAUNCH_SLUG)
    check('the real launch slug resolves against the real catalog', launchSlug?.slug === LAUNCH_SLUG)

    const unknownReal = findPublishedInsight(INSIGHTS, 'this-slug-does-not-exist-anywhere')
    check('an unknown slug resolves to undefined against the real catalog too (drives notFound())', unknownReal === undefined)

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
  section('6. Sitemap references /insights, and the launch article is eligible to enter it')

  {
    const sitemapSrc = readRepoFile('app/sitemap.ts')
    check('sitemap.ts imports the Insights catalog', sitemapSrc.includes("from '@/content/insights/catalog'"))
    check('sitemap.ts filters with isInsightAvailable before listing routes', sitemapSrc.includes('isInsightAvailable'))
    check('sitemap.ts includes a static /insights listing route', sitemapSrc.includes('${SITE_URL}/insights`'))
    check('sitemap.ts includes an insightRoutes block in the returned array', sitemapSrc.includes('insightRoutes'))
    check(
      'all six published articles are eligible, so sitemap.ts (which filters with isInsightAvailable) will include them',
      PUBLISHED_SLUGS.every((slug) => INSIGHTS.filter(isInsightAvailable).some((i) => i.slug === slug))
    )
    check('exactly six Insights are eligible for the sitemap right now', INSIGHTS.filter(isInsightAvailable).length === 6)

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
    // PR #199 published the first Insight but deliberately did not touch the
    // homepage (out of scope -- "do not modify ... unrelated UI"), so this
    // first check stays as it was: no featured-Insight section on the
    // homepage. The old "Three ways to learn" section was later replaced by
    // "Choose your learning journey" (Homepage Hierarchy and Signed-Out
    // Feature Discovery) -- deeper coverage of that section now lives in
    // scripts/homepage-journeys-regression.ts (test:homepage); the card-count
    // check below is only updated to point at its replacement, so it keeps
    // verifying what it always verified: that section still renders exactly
    // 3 top-level cards, unaffected by the Insights listing work this file
    // otherwise covers.
    check('homepage has no featured-Insight section', !homepageSrc.includes('Explore IBM i Insights'))
    check('homepage does not import InsightCard', !homepageSrc.includes('InsightCard'))
    check('homepage does not import the Insights catalog', !homepageSrc.includes("from '@/content/insights/catalog'"))
    check(
      'homepage still has exactly 3 Cards in "Choose your learning journey" (unaffected by removing the Insights section)',
      (() => {
        const start = homepageSrc.indexOf('Choose your learning journey')
        const end = homepageSrc.indexOf('IBM i Fundamentals highlight')
        const between = start >= 0 && end > start ? homepageSrc.slice(start, end) : ''
        return (between.match(/<Card className="flex flex-col p-6">/g) ?? []).length === 3
      })()
    )
  }

  // ---------------------------------------------------------------------------
  section('8. /insights is a polished landing page that now lists the real article')
  // ---------------------------------------------------------------------------

  {
    const listingSrc = readRepoFile('app/insights/page.tsx')

    // The h1's "Insights" is wrapped in its own <span> for the gradient
    // accent treatment (Hero Contrast Fix), so this can no longer be a
    // literal "IBM i Insights</h1>" substring match -- strip tags and JSX
    // whitespace expressions from the h1's inner source to verify the
    // rendered text is still exactly "IBM i Insights".
    const h1Match = listingSrc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
    const h1Text = h1Match
      ? h1Match[1]
          .replace(/<[^>]+>/g, ' ')
          .replace(/\{'\s*'\}/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      : ''
    check('the page has an "IBM i Insights" heading', h1Text === 'IBM i Insights')
    check('the page states the approved tagline', listingSrc.includes('Practical ideas, modern techniques, and emerging trends.'))
    check(
      'the page explains Insights are independent editorial content, separate from lessons and Deep Dives',
      /separate from curriculum lessons and Deep Dive reference guides/.test(listingSrc)
    )
    check('the hero has a premium badge distinct from an article claim', listingSrc.includes('Editorial perspectives for modern IBM i'))
    check('the hero does not add an article CTA (no "Read Insight"/"Read Article" link in the hero)', !/Read (Insight|Article)/.test(listingSrc))

    check('the page now imports InsightCard', /import \{ InsightCard/.test(listingSrc))
    check('the page now imports the Insights catalog', listingSrc.includes("from '@/content/insights/catalog'"))
    check('the page now imports getPublishedInsights', listingSrc.includes('getPublishedInsights'))
    check('the page renders published Insights via a featured card + grid, not a hardcoded article', /featuredInsight/.test(listingSrc) && /restInsights/.test(listingSrc))

    check(
      'the empty state is retained as a fallback (still present in source) for a fully-unpublished catalog',
      listingSrc.includes('Insights are being prepared')
    )
    check(
      'the empty state only renders when there are zero published Insights (conditional, not the default path)',
      /publishedInsights\.length === 0/.test(listingSrc)
    )

    check('the word "Chapter" never appears anywhere on the page', !/\bChapter\b/i.test(listingSrc))
    check('the page never calls Insights "lessons"', !/\binsight lessons\b/i.test(listingSrc))
    check(
      'there is no publishing-frequency or specific-date promise (e.g. "every week", "monthly", "this month")',
      !/\b(every week|weekly|monthly|this month|next month|launching soon)\b/i.test(listingSrc)
    )

    // With real Insights now published, this listing page should actually
    // render at build time: the launch article as the featured card
    // (array position 0), the second through sixth articles in the grid
    // alongside it.
    check(
      'all six published articles render on the listing page (featured card + grid)',
      (() => {
        const published = getPublishedInsights(INSIGHTS)
        return (
          published.length === 6 &&
          published[0].slug === LAUNCH_SLUG &&
          published[1].slug === RPG_SQL_APIS_SLUG &&
          published[2].slug === DB2_QSYS2_SLUG &&
          published[3].slug === REST_APIS_SLUG &&
          published[4].slug === AI_ASSISTED_RPG_SLUG &&
          published[5].slug === APP_MONITORING_SLUG
        )
      })()
    )
  }

  // ---------------------------------------------------------------------------
  section('9. Insight detail route infrastructure, and the new figure-embedding mechanism')
  // ---------------------------------------------------------------------------

  {
    const detailSrc = readRepoFile('app/insights/[slug]/page.tsx')
    check('generateStaticParams() only ever includes available Insights', /INSIGHTS\.filter\(isInsightAvailable\)/.test(detailSrc))
    check('an unresolved slug calls notFound()', /if \(!insight\) \{[\s\S]{0,40}notFound\(\)/.test(detailSrc))
    check(
      'generateStaticParams() now produces exactly six routes, one per published article',
      INSIGHTS.filter(isInsightAvailable).length === 6 &&
        PUBLISHED_SLUGS.every((slug) => INSIGHTS.filter(isInsightAvailable).some((i) => i.slug === slug))
    )
    check('the removed (older, unrelated) article-specific diagram component is not reintroduced', !detailSrc.includes('architecture-diagram'))
    check('the detail route still reuses the generic Deep Dive TOC/markdown primitives (retained, reusable infrastructure)', detailSrc.includes('DeepDiveToc'))
    check('the detail route splits rendered HTML on figure markers before rendering', detailSrc.includes('splitInsightHtmlOnFigureMarkers'))
    check('the detail route looks figures up in the per-slug registry, not a flat/global one', detailSrc.includes('INSIGHT_FIGURE_REGISTRY[insight.slug]'))
    check('an unrecognized figure name is skipped rather than crashing the page', /Figure \? <Figure key=\{i\} \/> : null/.test(detailSrc))
  }

  // ---------------------------------------------------------------------------
  section('10. Figure-embedding mechanism (lib/insight-render.ts) is correct and content stays in sync')
  // ---------------------------------------------------------------------------

  {
    check(
      'a figure marker on its own paragraph splits into a figure segment',
      (() => {
        const segments = splitInsightHtmlOnFigureMarkers('<p>before</p><p>[[FIGURE:example]]</p><p>after</p>')
        return (
          segments.length === 3 &&
          segments[0].type === 'html' &&
          segments[1].type === 'figure' &&
          (segments[1] as { type: 'figure'; name: string }).name === 'example' &&
          segments[2].type === 'html'
        )
      })()
    )
    check('HTML with no figure marker splits into a single html segment (no-op case)', splitInsightHtmlOnFigureMarkers('<p>just prose</p>').length === 1)
    check('consecutive figure markers with no prose between them both survive the split', splitInsightHtmlOnFigureMarkers('<p>[[FIGURE:a]]</p><p>[[FIGURE:b]]</p>').filter((s) => s.type === 'figure').length === 2)

    // Loops generically over every published Insight with a Markdown file --
    // a third article only needs its own entry in PUBLISHED_SLUGS and the
    // merged registry, not a rewrite of this loop.
    for (const slug of PUBLISHED_SLUGS) {
      const markdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${slug}.md`), 'utf-8')
      const markersInMarkdown = [...markdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
      const registered = Object.keys(INSIGHT_FIGURE_REGISTRY[slug] ?? {})

      check(`${slug} has at least one figure marker`, markersInMarkdown.length >= 1, `found ${markersInMarkdown.length}`)
      check(`no duplicate figure marker names within ${slug}`, markersInMarkdown.length === new Set(markersInMarkdown).size)
      check(
        `every figure marker referenced in ${slug} has a matching registry entry`,
        markersInMarkdown.every((name) => registered.includes(name)),
        `missing: ${markersInMarkdown.filter((n) => !registered.includes(n)).join(', ')}`
      )
      check(
        `the registry for ${slug} has no orphan entries the article never references (stays in sync both ways)`,
        registered.every((name) => markersInMarkdown.includes(name)),
        `orphaned: ${registered.filter((n) => !markersInMarkdown.includes(n)).join(', ')}`
      )

      check(`${slug}'s Markdown source contains no raw HTML tags (remark-rehype never enables allowDangerousHtml, so any would just render as escaped text)`, !/<(div|svg|script|iframe)[\s>]/i.test(markdown))
      check(`${slug}'s Markdown source references no external image URL`, !/!\[[^\]]*\]\(https?:\/\//.test(markdown))
      check(`${slug}'s Markdown source does not use an <img> tag`, !/<img[\s>]/i.test(markdown))
    }

    // The launch article specifically still needs its full complement --
    // kept as its own assertion since "at least 6" was a launch-specific
    // editorial requirement, not a rule every future Insight must follow.
    const launchMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${LAUNCH_SLUG}.md`), 'utf-8')
    const launchMarkers = [...launchMarkdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
    check('the launch article has at least the 5 required figures plus the optional 6th', launchMarkers.length >= 6, `found ${launchMarkers.length}`)
  }

  // ---------------------------------------------------------------------------
  section('11. Diagram components: accessibility and content-integrity spot checks')
  // ---------------------------------------------------------------------------

  {
    const figuresSrc = readRepoFile('components/insights/mcp-figures.tsx')
    const figureWrapperSrc = readRepoFile('components/insights/insight-figure.tsx')

    check('every InsightFigure call passes a non-empty caption', !/caption=""/.test(figuresSrc))
    check('the architecture diagram never implies the AI client reaches Db2 for i directly', figuresSrc.includes('The AI client never reaches Db2 for i itself'))
    check('no figure uses an <img> tag or an external image URL', !/<img[\s>]/i.test(figuresSrc) && !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/i.test(figuresSrc))

    // The architecture figure is an inline SVG on purpose: a left-to-right
    // chain shows "A talks to B talks to C" more immediately than a stacked
    // list. SVG <text> is not exposed to assistive tech the way HTML text
    // is, so it owes a real title/desc transcript -- and because the
    // drawing would scale below readable size on a phone, it must also ship
    // an HTML equivalent for narrow widths.
    check('the architecture SVG has an accessible title and description', /<title id="arch-title">/.test(figuresSrc) && /<desc id="arch-desc">/.test(figuresSrc))
    check('the architecture SVG wires role="img" to its title/desc via aria-labelledby', /role="img" aria-labelledby="arch-title arch-desc"/.test(figuresSrc))
    check('the architecture SVG scales to its container instead of forcing a fixed width', /className="w-full"/.test(figuresSrc) && !/min-w-\[/.test(figuresSrc))
    check(
      'the architecture figure ships both a wide (md+) and a narrow (below md) rendering of the same content',
      /hidden md:block/.test(figuresSrc) && /md:hidden/.test(figuresSrc)
    )
    // No figure should need a horizontally-scrollable viewport -- a diagram
    // whose default view is clipped reads as broken rather than scrollable.
    // Matches the JSX prop being passed (a bare `scrollable` attribute on
    // its own line, or `scrollable={...}`) rather than the word appearing
    // anywhere -- the prose in this file's own comments says "scrollable".
    check('no figure opts into the horizontally-scrollable viewport', !/^\s*scrollable(\s*=|\s*$)/m.test(figuresSrc))
    check(
      'the architecture figure names all five participants in the request chain',
      ['Developer or user', 'MCP-compatible AI client', 'IBM i MCP Server', 'Mapepire', 'Db2 for i'].every((n) => figuresSrc.includes(n))
    )
    check('the architecture figure marks where SQL is defined and where authority is enforced', figuresSrc.includes('SQL is defined here') && figuresSrc.includes('Authority is enforced here'))

    // Reader-facing "Figure N" labels must ascend in the order the reader
    // actually meets them, which is the order of the [[FIGURE:...]] markers
    // in the Markdown -- NOT the order the components are declared in
    // mcp-figures.tsx. These drifted apart once already (a reader scrolled
    // past Figure 6, then 1, 2, 4, 3, 5), so this pins them together.
    {
      const markdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${LAUNCH_SLUG}.md`), 'utf-8')
      const markerOrder = [...markdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])

      // component function name -> the `number={N}` it passes. Scoped to
      // each component's own body by splitting on `export function` first:
      // a single regex spanning the file would let a component that passes
      // no `number` (McpUseCaseGrid, an unnumbered grid) swallow the next
      // component's declaration along with its number.
      const numberByComponent = new Map<string, number>()
      for (const chunk of figuresSrc.split(/(?=export function )/)) {
        const name = chunk.match(/^export function (\w+)\(/)?.[1]
        const num = chunk.match(/number=\{(\d+)\}/)?.[1]
        if (name && num) numberByComponent.set(name, Number(num))
      }
      // figure marker name -> component name, read from the registry block
      const registryBlock = figuresSrc.slice(figuresSrc.indexOf('INSIGHT_FIGURE_REGISTRY'))
      const componentByMarker = new Map<string, string>()
      for (const m of registryBlock.matchAll(/'?([a-z0-9-]+)'?\s*:\s*(Mcp\w+)/g)) {
        componentByMarker.set(m[1], m[2])
      }

      const numbersInReadingOrder = markerOrder
        .map((marker) => numberByComponent.get(componentByMarker.get(marker) ?? ''))
        .filter((n): n is number => typeof n === 'number')

      check(
        'every numbered figure resolves to a "Figure N" label',
        numbersInReadingOrder.length === markerOrder.filter((m) => m !== 'use-cases').length,
        `resolved ${numbersInReadingOrder.length} of ${markerOrder.length} markers`
      )
      check(
        'figure numbers ascend in the order a reader scrolls past them',
        numbersInReadingOrder.every((n, i) => i === 0 || n > numbersInReadingOrder[i - 1]),
        `reading order gives: ${numbersInReadingOrder.join(', ')}`
      )
      check(
        'figure numbers start at 1 and have no gaps',
        numbersInReadingOrder.every((n, i) => n === i + 1),
        `got: ${numbersInReadingOrder.join(', ')}`
      )
    }
    check('the shared figure wrapper renders a real <figure>/<figcaption> pair (semantic, not div soup)', figureWrapperSrc.includes('<figure') && figureWrapperSrc.includes('<figcaption'))
    check('the one-time diagram entrance uses the shared reduced-motion-safe class', figuresSrc.includes('insight-figure-enter'))

    const globalsCss = readRepoFile('app/globals.css')
    check(
      'the diagram entrance keyframes exist and are disabled under prefers-reduced-motion',
      (() => {
        const hasKeyframes = /@keyframes insight-figure-in/.test(globalsCss)
        const match = globalsCss.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/g) ?? []
        const disabled = match.some((block) => block.includes('.insight-figure-enter') && /animation:\s*none/.test(block))
        return hasKeyframes && disabled
      })()
    )
    check('the horizontally-scrollable figure viewport has a visible (not only-on-hover) scrollbar treatment', globalsCss.includes('.insight-figure-scroll'))

    // Content-accuracy guardrails specific to this article's explicit "do not
    // overclaim" requirements.
    const launchMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${LAUNCH_SLUG}.md`), 'utf-8')
    check(
      'the article never claims iRPGenie itself provides a live IBM i MCP connection',
      !/iRPGenie (provides|offers|includes) .*(live|real).*(MCP|IBM i) connection/i.test(launchMarkdown)
    )
    check('the article cites the real IBM/ibmi-mcp-server GitHub repository as a source', launchMarkdown.includes('github.com/IBM/ibmi-mcp-server'))
    check('the article includes a Sources and further reading section', /## Sources and further reading/.test(launchMarkdown))
    check('the article\'s balanced conclusion states MCP does not replace IBM i expertise', /MCP does not replace IBM i expertise/.test(launchMarkdown))
  }

  // ---------------------------------------------------------------------------
  section('11b. Second Insight ("Modernizing RPG Applications with SQL and APIs"): diagram components and content checks')
  // ---------------------------------------------------------------------------

  {
    const rpgFiguresSrc = readRepoFile('components/insights/rpg-sql-apis-figures.tsx')
    const figureWrapperSrc = readRepoFile('components/insights/insight-figure.tsx')
    const rpgMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${RPG_SQL_APIS_SLUG}.md`), 'utf-8')

    check('every InsightFigure call in the new figure file passes a non-empty caption', !/caption=""/.test(rpgFiguresSrc))
    check('no figure uses an <img> tag or an external image URL', !/<img[\s>]/i.test(rpgFiguresSrc) && !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/i.test(rpgFiguresSrc))
    check('none of the three figures opt into the horizontally-scrollable viewport (plain HTML/CSS, not a fixed-width drawing)', !/^\s*scrollable(\s*=|\s*$)/m.test(rpgFiguresSrc))
    check('the one-time diagram entrance uses the shared reduced-motion-safe class', rpgFiguresSrc.includes('insight-figure-enter'))
    check('the shared figure wrapper renders a real <figure>/<figcaption> pair (semantic, not div soup)', figureWrapperSrc.includes('<figure') && figureWrapperSrc.includes('<figcaption'))
    check('the registry export is nested by slug, matching the shared INSIGHT_FIGURE_REGISTRY shape', /RPG_SQL_APIS_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>>/.test(rpgFiguresSrc))

    // Figure numbers must ascend in the order the [[FIGURE:...]] markers
    // appear in the Markdown, same discipline as the launch article's
    // section 11 check above (that ordering drifted apart once already for
    // the MCP article).
    {
      const markerOrder = [...rpgMarkdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
      const numberByComponent = new Map<string, number>()
      for (const chunk of rpgFiguresSrc.split(/(?=export function )/)) {
        const name = chunk.match(/^export function (\w+)\(/)?.[1]
        const num = chunk.match(/number=\{(\d+)\}/)?.[1]
        if (name && num) numberByComponent.set(name, Number(num))
      }
      const registryBlock = rpgFiguresSrc.slice(rpgFiguresSrc.indexOf('RPG_SQL_APIS_FIGURE_REGISTRY'))
      const componentByMarker = new Map<string, string>()
      for (const m of registryBlock.matchAll(/'?([a-z0-9-]+)'?\s*:\s*(\w+Figure)\b/g)) {
        componentByMarker.set(m[1], m[2])
      }
      const numbersInReadingOrder = markerOrder
        .map((marker) => numberByComponent.get(componentByMarker.get(marker) ?? ''))
        .filter((n): n is number => typeof n === 'number')

      check(
        'every figure marker resolves to a "Figure N" label',
        numbersInReadingOrder.length === markerOrder.length,
        `resolved ${numbersInReadingOrder.length} of ${markerOrder.length} markers`
      )
      check(
        'figure numbers ascend in the order a reader scrolls past them',
        numbersInReadingOrder.every((n, i) => i === 0 || n > numbersInReadingOrder[i - 1]),
        `reading order gives: ${numbersInReadingOrder.join(', ')}`
      )
      check(
        'figure numbers start at 1 and have no gaps',
        numbersInReadingOrder.every((n, i) => n === i + 1),
        `got: ${numbersInReadingOrder.join(', ')}`
      )
    }

    // Content-accuracy guardrails: this article was written from a prepared
    // source document and validated against IBM's own Db2 for i / QSYS2 HTTP
    // function documentation before publishing -- these checks pin the
    // resulting claims so a future edit can't silently drop them.
    check('the article cites Db2 for i JSON generation documentation as a source', rpgMarkdown.includes('topic=data-generating-json'))
    check('the article cites the QSYS2 HTTP functions documentation as a source', rpgMarkdown.includes('topic=programming-http-functions-overview'))
    check('the article cites Integrated Web Services documentation as a source', rpgMarkdown.includes('topic=tasks-integrated-web-services-i'))
    check('the article includes a Sources and further reading section', /### Sources and further reading/.test(rpgMarkdown))
    check(
      'the article explains the repeated "header" key in httpOptions rather than leaving it looking like a mistake',
      /documented convention/.test(rpgMarkdown) && /repeated/.test(rpgMarkdown)
    )
    check('the article states the correct IBM i licensed program prerequisite (5770SS1 options 3 and 34)', /5770SS1, option 3/.test(rpgMarkdown) && /option 34/.test(rpgMarkdown))
    check('the article never claims a live IBM i connection or real customer data', !/real (customer|production) data/i.test(rpgMarkdown))
    check('every rpgle/sql/json/text fenced code block has a recognized language tag Insights code styling already covers', ['```rpgle', '```sql', '```json', '```text'].every((tag) => rpgMarkdown.includes(tag)))
  }

  // ---------------------------------------------------------------------------
  section('11c. Third Insight ("Db2 for i and QSYS2 Services Every Developer Should Know"): diagram components and content checks')
  // ---------------------------------------------------------------------------

  {
    const db2FiguresSrc = readRepoFile('components/insights/db2-qsys2-figures.tsx')
    const figureWrapperSrc = readRepoFile('components/insights/insight-figure.tsx')
    const db2Markdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${DB2_QSYS2_SLUG}.md`), 'utf-8')

    check('every InsightFigure call in the new figure file passes a non-empty caption', !/caption=""/.test(db2FiguresSrc))
    check('no figure uses an <img> tag or an external image URL', !/<img[\s>]/i.test(db2FiguresSrc) && !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/i.test(db2FiguresSrc))
    check('none of the three figures opt into the horizontally-scrollable viewport (plain HTML/CSS, not a fixed-width drawing)', !/^\s*scrollable(\s*=|\s*$)/m.test(db2FiguresSrc))
    check('the one-time diagram entrance uses the shared reduced-motion-safe class', db2FiguresSrc.includes('insight-figure-enter'))
    check('the shared figure wrapper renders a real <figure>/<figcaption> pair (semantic, not div soup)', figureWrapperSrc.includes('<figure') && figureWrapperSrc.includes('<figcaption'))
    check('the registry export is nested by slug, matching the shared INSIGHT_FIGURE_REGISTRY shape', /DB2_QSYS2_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>>/.test(db2FiguresSrc))

    // The step-list layout in Figure 2 reuses the icon-column + connector-line
    // + card pattern proven safe by the second article's Figure 2 bugfix
    // (rpg-sql-apis-figures.tsx) -- explicitly NOT the -translate-x/negative-
    // margin approach that caused the original overlap. Pinning the pattern
    // here catches a regression back to that hack.
    check(
      'the symptom-to-cause figure uses the proven-safe icon-column/connector-line/card layout, not a negative-margin hack',
      /flex flex-col items-center/.test(db2FiguresSrc) &&
        /min-w-0 flex-1 rounded-xl border/.test(db2FiguresSrc) &&
        !/-translate-x/.test(db2FiguresSrc)
    )

    // Figure numbers must ascend in the order the [[FIGURE:...]] markers
    // appear in the Markdown, same discipline as sections 11 and 11b above.
    {
      const markerOrder = [...db2Markdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
      const numberByComponent = new Map<string, number>()
      for (const chunk of db2FiguresSrc.split(/(?=export function )/)) {
        const name = chunk.match(/^export function (\w+)\(/)?.[1]
        const num = chunk.match(/number=\{(\d+)\}/)?.[1]
        if (name && num) numberByComponent.set(name, Number(num))
      }
      const registryBlock = db2FiguresSrc.slice(db2FiguresSrc.indexOf('DB2_QSYS2_FIGURE_REGISTRY'))
      const componentByMarker = new Map<string, string>()
      for (const m of registryBlock.matchAll(/'?([a-z0-9-]+)'?\s*:\s*(\w+Figure)\b/g)) {
        componentByMarker.set(m[1], m[2])
      }
      const numbersInReadingOrder = markerOrder
        .map((marker) => numberByComponent.get(componentByMarker.get(marker) ?? ''))
        .filter((n): n is number => typeof n === 'number')

      check(
        'every figure marker resolves to a "Figure N" label',
        numbersInReadingOrder.length === markerOrder.length,
        `resolved ${numbersInReadingOrder.length} of ${markerOrder.length} markers`
      )
      check(
        'figure numbers ascend in the order a reader scrolls past them',
        numbersInReadingOrder.every((n, i) => i === 0 || n > numbersInReadingOrder[i - 1]),
        `reading order gives: ${numbersInReadingOrder.join(', ')}`
      )
      check(
        'figure numbers start at 1 and have no gaps',
        numbersInReadingOrder.every((n, i) => n === i + 1),
        `got: ${numbersInReadingOrder.join(', ')}`
      )
    }

    // Content-accuracy guardrails: this article was written from a prepared
    // source document and fact-checked against IBM's official QSYS2/Db2 for i
    // Services documentation before publishing, which surfaced several real
    // inaccuracies in the source (wrong parameter names, an unconfirmed
    // column, an overclaimed automatic feature). These checks pin the
    // corrected claims so a future edit can't silently reintroduce the
    // originals.
    check(
      "OBJECT_STATISTICS uses the real OBJTYPELIST parameter name, not the source document's invented OBJECT_TYPE_LIST",
      db2Markdown.includes('OBJTYPELIST') && !/OBJECT_TYPE_LIST\s*=>\s*'\*PGM/.test(db2Markdown)
    )
    check(
      'MESSAGE_QUEUE_INFO uses the real QUEUE_LIBRARY/QUEUE_NAME parameter names in its example, not the column names mistaken for them',
      db2Markdown.includes('QUEUE_LIBRARY') &&
        db2Markdown.includes('QUEUE_NAME') &&
        !/MESSAGE_QUEUE_LIBRARY\s*=>|MESSAGE_QUEUE_NAME\s*=>/.test(db2Markdown)
    )
    check(
      'SYSINDEXSTAT selects the real last_invalidation_timestamp column, not the unconfirmed index_valid',
      db2Markdown.includes('last_invalidation_timestamp') && !/\bindex_valid\b/i.test(db2Markdown)
    )
    check(
      'DISPLAY_JOURNAL never selects the unconfirmed commit_cycle output column, and no prose claims it as retrievable',
      !/commit_cycle/i.test(db2Markdown) && !/commit cycle/i.test(db2Markdown)
    )
    check('JOBLOG_INFO states the release/PTF gating for MESSAGE_ORDER, MESSAGE_TIMESTAMP, and MESSAGE_LIMIT', /MESSAGE_ORDER.*MESSAGE_TIMESTAMP.*MESSAGE_LIMIT/.test(db2Markdown))
    check('QCMDEXC states the scalar function form\'s TR gating (IBM i 7.4 TR4 and 7.3 TR10)', /7\.4 TR4/.test(db2Markdown) && /7\.3 TR10/.test(db2Markdown))
    check(
      'ACTIVE_JOB_INFO states the precise function-usage/authority requirement for detailed columns',
      /QIBM_DB_SQLADM/.test(db2Markdown) && /QIBM_DB_SYSMON/.test(db2Markdown)
    )
    check('the article cites the official IBM i Services documentation index as a source', db2Markdown.includes('topic=optimization-i-services'))
    check('the article includes a Sources and further reading section', /### Sources and further reading/.test(db2Markdown))
    check('every sql fenced code block uses a recognized language tag Insights code styling already covers', db2Markdown.includes('```sql'))
    check('the article never claims a live IBM i connection or real customer/production data', !/real (customer|production) data/i.test(db2Markdown))
  }

  // ---------------------------------------------------------------------------
  section('11d. Fourth Insight ("Building REST APIs from IBM i Applications"): diagram components and content checks')
  // ---------------------------------------------------------------------------

  {
    const restFiguresSrc = readRepoFile('components/insights/rest-apis-figures.tsx')
    const figureWrapperSrc = readRepoFile('components/insights/insight-figure.tsx')
    const restMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${REST_APIS_SLUG}.md`), 'utf-8')

    check('every InsightFigure call in the new figure file passes a non-empty caption', !/caption=""/.test(restFiguresSrc))
    check('no figure uses an <img> tag or an external image URL', !/<img[\s>]/i.test(restFiguresSrc) && !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/i.test(restFiguresSrc))
    check('none of the three figures opt into the horizontally-scrollable viewport (plain HTML/CSS, not a fixed-width drawing)', !/^\s*scrollable(\s*=|\s*$)/m.test(restFiguresSrc))
    check('the one-time diagram entrance uses the shared reduced-motion-safe class', restFiguresSrc.includes('insight-figure-enter'))
    check('the shared figure wrapper renders a real <figure>/<figcaption> pair (semantic, not div soup)', figureWrapperSrc.includes('<figure') && figureWrapperSrc.includes('<figcaption'))
    check('the registry export is nested by slug, matching the shared INSIGHT_FIGURE_REGISTRY shape', /REST_APIS_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>>/.test(restFiguresSrc))

    // The request-lifecycle figure reuses the icon-column + connector-line +
    // card layout proven safe by the second article's Figure 2 bugfix, same
    // discipline as the third article's symptom-to-cause figure -- explicitly
    // NOT the -translate-x/negative-margin approach that caused the original
    // overlap.
    check(
      'the request-lifecycle figure uses the proven-safe icon-column/connector-line/card layout, not a negative-margin hack',
      /flex flex-col items-center/.test(restFiguresSrc) &&
        /min-w-0 flex-1 rounded-xl border/.test(restFiguresSrc) &&
        !/-translate-x/.test(restFiguresSrc)
    )

    // Figure numbers must ascend in the order the [[FIGURE:...]] markers
    // appear in the Markdown, same discipline as sections 11/11b/11c above.
    {
      const markerOrder = [...restMarkdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
      const numberByComponent = new Map<string, number>()
      for (const chunk of restFiguresSrc.split(/(?=export function )/)) {
        const name = chunk.match(/^export function (\w+)\(/)?.[1]
        const num = chunk.match(/number=\{(\d+)\}/)?.[1]
        if (name && num) numberByComponent.set(name, Number(num))
      }
      const registryBlock = restFiguresSrc.slice(restFiguresSrc.indexOf('REST_APIS_FIGURE_REGISTRY'))
      const componentByMarker = new Map<string, string>()
      for (const m of registryBlock.matchAll(/'?([a-z0-9-]+)'?\s*:\s*(\w+Figure)\b/g)) {
        componentByMarker.set(m[1], m[2])
      }
      const numbersInReadingOrder = markerOrder
        .map((marker) => numberByComponent.get(componentByMarker.get(marker) ?? ''))
        .filter((n): n is number => typeof n === 'number')

      check(
        'every figure marker resolves to a "Figure N" label',
        numbersInReadingOrder.length === markerOrder.length,
        `resolved ${numbersInReadingOrder.length} of ${markerOrder.length} markers`
      )
      check(
        'figure numbers ascend in the order a reader scrolls past them',
        numbersInReadingOrder.every((n, i) => i === 0 || n > numbersInReadingOrder[i - 1]),
        `reading order gives: ${numbersInReadingOrder.join(', ')}`
      )
      check(
        'figure numbers start at 1 and have no gaps',
        numbersInReadingOrder.every((n, i) => n === i + 1),
        `got: ${numbersInReadingOrder.join(', ')}`
      )
    }

    // Content-accuracy guardrails: this article was written from a prepared
    // source document and fact-checked (IWS/RSE product facts, RPG/CL/PCML
    // syntax, and Db2 for i SQL syntax, via three separate research passes)
    // against IBM's official documentation before publishing. These checks
    // pin the resulting corrections so a future edit can't silently
    // reintroduce the originals.
    check(
      'the RPG example uses the plain, unqualified PGMINFO(*PCML : *MODULE) -- no *V7 (or any other version) pinned for this simple, no-array/no-subfield interface',
      (() => {
        // Scoped to the ```rpg fenced code block specifically: the
        // explanatory prose right after it legitimately *mentions*
        // PGMINFO(*PCML : *MODULE : *V7) as a hypothetical future choice,
        // which a whole-document check would wrongly flag as "still pinned".
        const rpgBlock = restMarkdown.match(/```rpg\n([\s\S]*?)```/)?.[1] ?? ''
        return /pgminfo\(\*pcml\s*:\s*\*module\)/.test(rpgBlock) && !/pgminfo\(\*pcml\s*:\s*\*module\s*:\s*\*v\d\)/i.test(rpgBlock)
      })()
    )
    check(
      'the article explains the compiler selects a PCML version by default based on the target release, rather than claiming a specific version is required',
      /the compiler selects a PCML version based on the module's target release/.test(restMarkdown)
    )
    check(
      'the article accurately scopes what a later PCML version like *V7 actually changes (varying-length representation, plus removing a restriction on arrays/subfields) and frames pinning one as an intentional trade-off, not an overclaimed universal requirement for VARCHAR parameters',
      /removes an older restriction on varying-length fields nested inside arrays or data structures/.test(restMarkdown) &&
        /giving up whatever newer PCML features a later version adds/.test(restMarkdown)
    )
    check('the article cites the direct IBM PGMINFO keyword documentation as a source', restMarkdown.includes('topic=keywords-pgminfopcml-no-dclcase-module-vx'))
    check(
      'the diagnostic-message host variable uses the real documented 32740 limit, not an arbitrary smaller size',
      /sqlMessage\s+varchar\(32740\)/.test(restMarkdown)
    )
    check(
      'the row-change-timestamp column declares its TIMESTAMP data type explicitly (the source omitted it)',
      /UPDATED_AT\s+TIMESTAMP\s+GENERATED ALWAYS/.test(restMarkdown)
    )
    check(
      'the IWS 2.6/3.0 section states the verified Java 17 and Jakarta EE requirements for IWS 3.0',
      /Java 17/.test(restMarkdown) && /Jakarta EE/.test(restMarkdown)
    )
    check(
      'the IWS 3.0 PTF gating cites the verified HTTP Group PTF levels for 7.4/7.5/7.6',
      /SF99662/.test(restMarkdown) && /SF99952/.test(restMarkdown) && /SF99962/.test(restMarkdown)
    )
    check(
      'the observability section states the full verified IWS logging/CORS/HSTS capability list, not a trimmed subset',
      /JSON logging/.test(restMarkdown) && /HSTS/.test(restMarkdown)
    )
    check(
      'the RSE API is disambiguated as the IBM i variant (a same-named RSE API exists for z/OS)',
      /IBM i Remote System Explorer \(RSE\) API/.test(restMarkdown) && /distinct from the similarly-named RSE API on z\/OS/.test(restMarkdown)
    )
    check(
      'the SQL-based IWS section no longer overclaims that column aliases map 1:1 to JSON keys (unverified against IBM docs)',
      /depends on the IWS generation and deployment mapping/.test(restMarkdown) && /JSON_OBJECT/.test(restMarkdown)
    )
    check(
      'the article never cites the mismatched row-change-timestamp URL (stringent-level-commitment-control is an ODBC driver topic, not row-change-timestamp docs)',
      !/stringent-level-commitment-control/.test(restMarkdown)
    )
    check('the article cites the correct row-change-timestamp documentation as a source', restMarkdown.includes('rbafysqlprcts.htm'))
    check(
      'the article never cites the mismatched Db2-for-i JSON/HTTP-functions references (irrelevant to an article that never demonstrates JSON_OBJECT or QSYS2 HTTP functions in its body)',
      !/topic=data-generating-json/.test(restMarkdown) && !/topic=programming-http-functions-overview/.test(restMarkdown)
    )
    check('the article includes a Sources and further reading section', /### Sources and further reading/.test(restMarkdown))
    check(
      'the article clearly distinguishes exposing IBM i logic from consuming external APIs, linking to the second Insight for the consuming side',
      /This article is about \*exposing\*/.test(restMarkdown) && restMarkdown.includes('/insights/modernizing-rpg-applications-with-sql-and-apis')
    )
    check('every rpg/cl/sql/json/http/text/bash fenced code block has a recognized language tag Insights code styling already covers', ['```rpg', '```cl', '```sql', '```json', '```http', '```text', '```bash'].every((tag) => restMarkdown.includes(tag)))
    check('the article never claims a live IBM i connection or real customer/production data', !/real (customer|production) data/i.test(restMarkdown))
  }

  // ---------------------------------------------------------------------------
  section('11e. Fifth Insight ("Practical AI-Assisted Development for RPG Programmers"): diagram components and content checks')
  // ---------------------------------------------------------------------------

  {
    const aiFiguresSrc = readRepoFile('components/insights/ai-assisted-rpg-figures.tsx')
    const figureWrapperSrc = readRepoFile('components/insights/insight-figure.tsx')
    const aiMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${AI_ASSISTED_RPG_SLUG}.md`), 'utf-8')

    check('every InsightFigure call in the new figure file passes a non-empty caption', !/caption=""/.test(aiFiguresSrc))
    check('no figure uses an <img> tag or an external image URL', !/<img[\s>]/i.test(aiFiguresSrc) && !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/i.test(aiFiguresSrc))
    check('none of the three figures opt into the horizontally-scrollable viewport (plain HTML/CSS, not a fixed-width drawing)', !/^\s*scrollable(\s*=|\s*$)/m.test(aiFiguresSrc))
    check('the one-time diagram entrance uses the shared reduced-motion-safe class', aiFiguresSrc.includes('insight-figure-enter'))
    check('the shared figure wrapper renders a real <figure>/<figcaption> pair (semantic, not div soup)', figureWrapperSrc.includes('<figure') && figureWrapperSrc.includes('<figcaption'))
    check('the registry export is nested by slug, matching the shared INSIGHT_FIGURE_REGISTRY shape', /AI_ASSISTED_RPG_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>>/.test(aiFiguresSrc))

    // The lifecycle and context-stack figures reuse the icon-column +
    // connector-line + card layout (lifecycle) and the progressively-inset
    // layers layout (context stack) proven safe by prior articles --
    // explicitly NOT the -translate-x/negative-margin approach that caused
    // the original overlap bug.
    check(
      'the lifecycle figure uses the proven-safe icon-column/connector-line/card layout, not a negative-margin hack',
      /flex flex-col items-center/.test(aiFiguresSrc) &&
        /min-w-0 flex-1 rounded-xl border/.test(aiFiguresSrc) &&
        !/-translate-x/.test(aiFiguresSrc)
    )

    // Figure numbers must ascend in the order the [[FIGURE:...]] markers
    // appear in the Markdown, same discipline as sections 11/11b/11c/11d above.
    {
      const markerOrder = [...aiMarkdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
      const numberByComponent = new Map<string, number>()
      for (const chunk of aiFiguresSrc.split(/(?=export function )/)) {
        const name = chunk.match(/^export function (\w+)\(/)?.[1]
        const num = chunk.match(/number=\{(\d+)\}/)?.[1]
        if (name && num) numberByComponent.set(name, Number(num))
      }
      const registryBlock = aiFiguresSrc.slice(aiFiguresSrc.indexOf('AI_ASSISTED_RPG_FIGURE_REGISTRY'))
      const componentByMarker = new Map<string, string>()
      for (const m of registryBlock.matchAll(/'?([a-z0-9-]+)'?\s*:\s*(\w+Figure)\b/g)) {
        componentByMarker.set(m[1], m[2])
      }
      const numbersInReadingOrder = markerOrder
        .map((marker) => numberByComponent.get(componentByMarker.get(marker) ?? ''))
        .filter((n): n is number => typeof n === 'number')

      check(
        'every figure marker resolves to a "Figure N" label',
        numbersInReadingOrder.length === markerOrder.length,
        `resolved ${numbersInReadingOrder.length} of ${markerOrder.length} markers`
      )
      check(
        'figure numbers ascend in the order a reader scrolls past them',
        numbersInReadingOrder.every((n, i) => i === 0 || n > numbersInReadingOrder[i - 1]),
        `reading order gives: ${numbersInReadingOrder.join(', ')}`
      )
      check(
        'figure numbers start at 1 and have no gaps',
        numbersInReadingOrder.every((n, i) => n === i + 1),
        `got: ${numbersInReadingOrder.join(', ')}`
      )
    }

    // Content-accuracy guardrails: this article was written from a prepared
    // source document and fact-checked (RPG/CL syntax and semantics,
    // embedded SQL/SQLCOD/SQLCODE/COMMIT semantics, and every cited IBM doc
    // URL) against IBM's official documentation before publishing, via two
    // separate research passes. These checks pin the resulting claims and
    // the one corrected URL so a future edit can't silently reintroduce an
    // inaccuracy.
    check(
      '%DECH is correctly described as rounding (half-adjust), in contrast with %DEC which truncates',
      /%DECH/.test(aiMarkdown) && /half-adjust/.test(aiMarkdown) && /%DEC.*truncates/.test(aiMarkdown)
    )
    check(
      'the service-program signature claim is scoped correctly: it reflects the exported-symbol list and order, not individual parameter interfaces',
      /does\s*\*\*not\*\*\s*validate an individual procedure's parameter interface/.test(aiMarkdown)
    )
    check(
      'the embedded SQL fragment uses the real SQLCA field name SQLCOD, not the unrelated standalone SQLCODE form',
      /when sqlcod = 0/.test(aiMarkdown)
    )
    check('the article correctly states SQLCODE +100 means no row satisfied the query', /\+100.*no row satisfied the query/.test(aiMarkdown))
    check('the article correctly states SQLCODE -811 for a SELECT INTO matching more than one row', /-811/.test(aiMarkdown) && /more than one row/.test(aiMarkdown))
    check(
        'the article correctly warns that COMMIT finalizes the whole pending unit of work, not just the statement in view',
        /finalizes every pending change in the current unit of work/.test(aiMarkdown)
    )
    check('the corrected CRTSRVPGM documentation URL is cited (not the unverifiable slug from the first-pass draft)', aiMarkdown.includes('topic=program-creating-service-using-crtsrvpgm') && !aiMarkdown.includes('topic=c-create-service-program'))
    check('the article includes strong confidentiality guidance covering source code, credentials, and customer/production data', /never submit proprietary source, credentials, customer data, or production logs/i.test(aiMarkdown))
    check('the article includes a Sources and further reading section', /### Sources and further reading/.test(aiMarkdown))
    check('every rpg/cl fenced code block has a recognized language tag Insights code styling already covers', ['```rpg', '```cl'].every((tag) => aiMarkdown.includes(tag)))
    check('the article never claims a live IBM i connection or real customer/production data', !/real (customer|production) data/i.test(aiMarkdown))
    check('the article never presents AI output as compiled or production-ready without review', /Never present uncompiled AI output as production-ready|must still compile the module, and run the boundary cases|is not evidence of correctness/i.test(aiMarkdown))
  }

  // ---------------------------------------------------------------------------
  section('11f. Sixth Insight ("IBM i Application Monitoring and Production Troubleshooting"): diagram components and content checks')
  // ---------------------------------------------------------------------------

  {
    const monitoringFiguresSrc = readRepoFile('components/insights/app-monitoring-figures.tsx')
    const figureWrapperSrc = readRepoFile('components/insights/insight-figure.tsx')
    const monitoringMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${APP_MONITORING_SLUG}.md`), 'utf-8')

    check('every InsightFigure call in the new figure file passes a non-empty caption', !/caption=""/.test(monitoringFiguresSrc))
    check('no figure uses an <img> tag or an external image URL', !/<img[\s>]/i.test(monitoringFiguresSrc) && !/https?:\/\/\S+\.(png|jpe?g|svg|webp|gif)/i.test(monitoringFiguresSrc))
    check('none of the three figures opt into the horizontally-scrollable viewport (plain HTML/CSS, not a fixed-width drawing)', !/^\s*scrollable(\s*=|\s*$)/m.test(monitoringFiguresSrc))
    check('the one-time diagram entrance uses the shared reduced-motion-safe class', monitoringFiguresSrc.includes('insight-figure-enter'))
    check('the shared figure wrapper renders a real <figure>/<figcaption> pair (semantic, not div soup)', figureWrapperSrc.includes('<figure') && figureWrapperSrc.includes('<figcaption'))
    check('the registry export is nested by slug, matching the shared INSIGHT_FIGURE_REGISTRY shape', /APP_MONITORING_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>>/.test(monitoringFiguresSrc))

    // The incident-lifecycle and layer-correlation figures reuse the
    // icon-column/connector-line/card layout and the progressively-inset
    // layers layout proven safe by prior articles -- explicitly NOT the
    // -translate-x/negative-margin approach that caused the original overlap.
    check(
      'the incident-lifecycle figure uses the proven-safe icon-column/connector-line/card layout, not a negative-margin hack',
      /flex flex-col items-center/.test(monitoringFiguresSrc) &&
        /min-w-0 flex-1 rounded-xl border/.test(monitoringFiguresSrc) &&
        !/-translate-x/.test(monitoringFiguresSrc)
    )

    // Figure numbers must ascend in the order the [[FIGURE:...]] markers
    // appear in the Markdown, same discipline as sections 11/11b/11c/11d/11e above.
    {
      const markerOrder = [...monitoringMarkdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
      const numberByComponent = new Map<string, number>()
      for (const chunk of monitoringFiguresSrc.split(/(?=export function )/)) {
        const name = chunk.match(/^export function (\w+)\(/)?.[1]
        const num = chunk.match(/number=\{(\d+)\}/)?.[1]
        if (name && num) numberByComponent.set(name, Number(num))
      }
      const registryBlock = monitoringFiguresSrc.slice(monitoringFiguresSrc.indexOf('APP_MONITORING_FIGURE_REGISTRY'))
      const componentByMarker = new Map<string, string>()
      for (const m of registryBlock.matchAll(/'?([a-z0-9-]+)'?\s*:\s*(\w+Figure)\b/g)) {
        componentByMarker.set(m[1], m[2])
      }
      const numbersInReadingOrder = markerOrder
        .map((marker) => numberByComponent.get(componentByMarker.get(marker) ?? ''))
        .filter((n): n is number => typeof n === 'number')

      check(
        'every figure marker resolves to a "Figure N" label',
        numbersInReadingOrder.length === markerOrder.length,
        `resolved ${numbersInReadingOrder.length} of ${markerOrder.length} markers`
      )
      check(
        'figure numbers ascend in the order a reader scrolls past them',
        numbersInReadingOrder.every((n, i) => i === 0 || n > numbersInReadingOrder[i - 1]),
        `reading order gives: ${numbersInReadingOrder.join(', ')}`
      )
      check(
        'figure numbers start at 1 and have no gaps',
        numbersInReadingOrder.every((n, i) => n === i + 1),
        `got: ${numbersInReadingOrder.join(', ')}`
      )
    }

    // Content-accuracy guardrails: this article was written from a prepared
    // source document and fact-checked (every QSYS2/Db2-for-i SQL service's
    // columns and parameters, WRKOBJLCK/WRKUSRJOB behavior, SELF's authority
    // requirement, and GET DIAGNOSTICS syntax) against IBM's official
    // documentation and reputable secondary sources before publishing. These
    // checks pin the resulting claims and the two commands added beyond the
    // source document so a future edit can't silently drop them.
    check('the article explicitly covers WRKUSRJOB as a way to find jobs by user profile', /WRKUSRJOB/.test(monitoringMarkdown))
    check(
      'the article explicitly distinguishes WRKOBJLCK (object-level locks) from DSPRCDLCK (record-level locks)',
      /WRKOBJLCK/.test(monitoringMarkdown) && /OBJECT_LOCK_INFO/.test(monitoringMarkdown) && /object-level locks/i.test(monitoringMarkdown)
    )
    check(
      'the OBJECT_LOCK_INFO example selects and filters on the system object name columns (SYSTEM_OBJECT_SCHEMA/SYSTEM_OBJECT_NAME), not a long-SQL-name equivalent that can differ from the IBM i system name',
      (() => {
        const sqlBlock = monitoringMarkdown.match(/```sql\nSELECT SYSTEM_OBJECT_SCHEMA,[\s\S]*?```/)?.[0] ?? ''
        return (
          sqlBlock.length > 0 &&
          /SELECT SYSTEM_OBJECT_SCHEMA,[\s\S]*?SYSTEM_OBJECT_NAME,/.test(sqlBlock) &&
          /WHERE SYSTEM_OBJECT_SCHEMA = 'MYLIB'/.test(sqlBlock) &&
          /AND SYSTEM_OBJECT_NAME = 'ORDERSVC'/.test(sqlBlock)
        )
      })()
    )
    check(
      'the article explicitly distinguishes monitoring, troubleshooting, recovery, and root-cause analysis',
      /\*\*Monitoring\*\*/.test(monitoringMarkdown) &&
        /\*\*Troubleshooting\*\*/.test(monitoringMarkdown) &&
        /\*\*Recovery\*\*/.test(monitoringMarkdown) &&
        /\*\*Root-cause analysis\*\*/.test(monitoringMarkdown)
    )
    check(
      "the article states SELF's precise authority model: *ALLOBJ or QIBM_DB_SQLADM for every job's rows, but a caller can still see their own rows by USER_NAME/ADOPTED_USER_NAME/INITIAL_ADOPTED_USER_NAME without either",
      /QIBM_DB_SQLADM/.test(monitoringMarkdown) &&
        /ADOPTED_USER_NAME/.test(monitoringMarkdown) &&
        /INITIAL_ADOPTED_USER_NAME/.test(monitoringMarkdown)
    )
    check(
      'the article states SYSIBMADM.SELFCODES is session-scoped and defaults to NULL/off unless a different default has been configured (not an unconditional "off by default for every job")',
      /scoped to the current SQL session/.test(monitoringMarkdown) && /unless a different default has been configured/.test(monitoringMarkdown)
    )
    check(
      'the article includes a standalone "evidence to capture before any disruptive action" checklist',
      /## Evidence to Capture Before Any Disruptive Action/.test(monitoringMarkdown)
    )
    check(
      'the article never recommends ending a job, releasing a lock, or changing a production resource without authorization and impact analysis',
      /Never end a job, release a lock, or change a production resource/.test(monitoringMarkdown)
    )
    check('the article cites the WRKOBJLCK command documentation as a source', monitoringMarkdown.includes('considerations-work-object-lock-wrkobjlck-command'))
    check('the article cites the OBJECT_LOCK_INFO view documentation as a source', monitoringMarkdown.includes('topic=services-object-lock-info-view'))
    check('the article includes a Sources and further reading section', /### Sources and further reading/.test(monitoringMarkdown))
    check('every cl/sql/rpg/text/json fenced code block has a recognized language tag Insights code styling already covers', ['```cl', '```sql', '```rpg', '```text', '```json'].every((tag) => monitoringMarkdown.includes(tag)))
    check('the article never claims a live IBM i connection or real customer/production data', !/real (customer|production) data/i.test(monitoringMarkdown))
    check('the article never displays a publication date in its body', !/\bpublished on\b/i.test(monitoringMarkdown) && !/\d{4}-\d{2}-\d{2}/.test(monitoringMarkdown))
  }

  // ---------------------------------------------------------------------------
  section('12. Sources attribution (IBM i Insights Attribution Cleanup and Date Display Removal)')
  // ---------------------------------------------------------------------------

  {
    const launchMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${LAUNCH_SLUG}.md`), 'utf-8')

    // The IWS/wrapper-program article is about a different subject
    // (Integrated Web Services, RPG-to-REST wrapper programs) and was
    // mistakenly bundled into this MCP Insight's Sources alongside an
    // unnamed "related Hashnode piece" -- neither the title, the author,
    // nor the unrelated-subject phrase should appear here anymore.
    check('the unrelated IWS/wrapper-program article is not cited as a source', !/Integrated Web Services|REST-Ready|Gaurav Singh/i.test(launchMarkdown))
    check('no vague, unnamed "related Hashnode piece" reference remains', !/related Hashnode piece/i.test(launchMarkdown))

    // The correct secondary source: named, linked, and on-subject.
    check('the Hashnode MCP article is linked with its real URL', launchMarkdown.includes('https://sbm-tech.hashnode.dev/ibm-i-mcp-server'))
    check('the Hashnode MCP article\'s title is quoted correctly', launchMarkdown.includes('IBM i MCP Server: Talk to IBM i in Plain English'))
    check('the Hashnode article\'s author, Sangamesh SBM, is credited', launchMarkdown.includes('Sangamesh SBM'))
    check(
      'the Hashnode source is identified as a secondary community reference, not a primary one',
      /Sangamesh SBM[^\n]*secondary community/.test(launchMarkdown)
    )

    // All three primary sources from the original pass are still present --
    // this is a correction to one entry, not a rewrite of the section.
    check('IBM/ibmi-mcp-server remains a listed source', launchMarkdown.includes('github.com/IBM/ibmi-mcp-server'))
    check('Mapepire documentation remains a listed source', launchMarkdown.includes('mapepire-ibmi.github.io'))
    check('the Model Context Protocol specification remains a listed source', launchMarkdown.includes('modelcontextprotocol.io'))

    // No language implying iRPGenie copied/reproduced the community piece,
    // and no reader-facing "originality audit" framing -- that kind of
    // defensive language doesn't belong in the published article itself.
    check('no language implies iRPGenie copied or reproduced the community article', !/\b(copied|reproduc\w+|duplicat\w+|plagiar\w+)\b/i.test(launchMarkdown))
    check('no "originality audit" or similar defensive framing is shown to readers', !/originality (audit|review|check)/i.test(launchMarkdown))
  }

  // ---------------------------------------------------------------------------
  section('13. No publication date is ever rendered as visible page content')
  // ---------------------------------------------------------------------------

  {
    const detailSrc = readRepoFile('app/insights/[slug]/page.tsx')
    const cardSrc = readRepoFile('components/insight-card.tsx')
    const listingSrc = readRepoFile('app/insights/page.tsx')

    // The detail page's visible metadata row (reading time + tags) is a
    // small, specific block -- isolate it so these checks can't accidentally
    // pass by looking at generateMetadata()'s non-visible openGraph fields
    // a few lines above, which legitimately still reference publishedAt.
    const heroBlock = detailSrc.slice(detailSrc.indexOf('<h1'), detailSrc.indexOf('{loadError'))
    check('the detail hero has no <time> element', !/<time[\s>]/.test(heroBlock))
    check('the detail hero renders no Calendar icon', !/Calendar/.test(heroBlock))
    check('the detail hero calls no date-formatting function', !/formatDate\(/.test(heroBlock))
    check('the detail hero renders no relative-date substitute label', !/\b(Recently published|New|Updated)\b/.test(heroBlock))
    check('the detail hero still renders reading time', /min read/.test(heroBlock))
    check('the detail hero still renders tags', /insight\.tags\.map/.test(heroBlock))

    check('InsightCard has no <time> element', !/<time[\s>]/.test(cardSrc))
    check('InsightCard imports no Calendar icon', !/\bCalendar\b/.test(cardSrc))
    check('InsightCard has no date-formatting function', !/formatPublishedDate|formatDate/.test(cardSrc))
    check('InsightCard renders no relative-date substitute label', !/\b(Recently published|New|Updated)\b/.test(cardSrc))
    check('InsightCard still renders reading time', /min read/.test(cardSrc))
    check('InsightCard still renders tags', /insight\.tags\.slice/.test(cardSrc))

    check('the listing page renders no visible date (it only ever renders Insights through InsightCard)', !/<time[\s>]/.test(listingSrc) && !/formatPublishedDate|formatDate/.test(listingSrc))

    // publishedAt must still exist and still be valid -- this PR removes
    // visible rendering, not the underlying field.
    check('Insight.publishedAt is still part of the type (internal use: validation, sorting, non-visible metadata)', readRepoFile('lib/insights.ts').includes('publishedAt: string'))
    check('generateMetadata() still sets non-visible openGraph.publishedTime from publishedAt', /publishedTime:\s*insight\.publishedAt/.test(detailSrc))
    check('buildInsightStructuredData() still sets non-visible JSON-LD datePublished from publishedAt', readRepoFile('lib/insight-structured-data.ts').includes('datePublished: insight.publishedAt'))
    check(
      'lib/insight-structured-data.ts documents that datePublished/dateModified are metadata only, never rendered visibly',
      /metadata only/.test(readRepoFile('lib/insight-structured-data.ts'))
    )
  }

  // ---------------------------------------------------------------------------
  section('14. Documentation hygiene: no stale PR references, no leftover "Launch article" wording')
  // ---------------------------------------------------------------------------

  {
    const insightFiles: Record<string, string> = {
      'lib/insights.ts': readRepoFile('lib/insights.ts'),
      'lib/insight-categories.ts': readRepoFile('lib/insight-categories.ts'),
      'lib/insight-content.ts': readRepoFile('lib/insight-content.ts'),
      'lib/insight-structured-data.ts': readRepoFile('lib/insight-structured-data.ts'),
      'lib/insight-render.ts': readRepoFile('lib/insight-render.ts'),
      'content/insights/catalog.ts': readRepoFile('content/insights/catalog.ts'),
      'components/insight-card.tsx': readRepoFile('components/insight-card.tsx'),
      'components/insights/insight-figure.tsx': readRepoFile('components/insights/insight-figure.tsx'),
      'components/insights/mcp-figures.tsx': readRepoFile('components/insights/mcp-figures.tsx'),
      'components/insights/rpg-sql-apis-figures.tsx': readRepoFile('components/insights/rpg-sql-apis-figures.tsx'),
      'components/insights/db2-qsys2-figures.tsx': readRepoFile('components/insights/db2-qsys2-figures.tsx'),
      'components/insights/rest-apis-figures.tsx': readRepoFile('components/insights/rest-apis-figures.tsx'),
      'components/insights/ai-assisted-rpg-figures.tsx': readRepoFile('components/insights/ai-assisted-rpg-figures.tsx'),
      'components/insights/app-monitoring-figures.tsx': readRepoFile('components/insights/app-monitoring-figures.tsx'),
      'components/insights/insight-figure-registry.ts': readRepoFile('components/insights/insight-figure-registry.ts'),
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
  section('15. Listing-page social metadata and keyboard-focus safeguards')
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
    // The breadcrumb markup itself moved into the shared
    // components/reader-breadcrumb.tsx (Deep Dives, IBM i Insights and
    // Reader-Experience Polish -- both readers now render the same
    // component instead of the Insight page hand-rolling its own nav), so
    // the focus-visible styling now lives there, not inline in this page.
    const breadcrumbComponentSrc = readRepoFile('components/reader-breadcrumb.tsx')
    check(
      'the detail page renders the shared ReaderBreadcrumb component',
      detailSrc.includes('<ReaderBreadcrumb')
    )
    check(
      "ReaderBreadcrumb's own links carry focus-visible styling",
      /Breadcrumb"[\s\S]{0,300}focus-visible:ring-2/.test(breadcrumbComponentSrc)
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
  section('16. Hero visual-polish pass: decorative-only, reduced-motion-safe, no external assets')
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
    // The "Practical / Modern techniques / Emerging trends" POSITIONING_POINTS
    // row (previously checked here for 3 distinct accents) is gone (Deep
    // Dives, IBM i Insights and Reader-Experience Polish) -- it restated the
    // hero's own tagline almost word for word; removing it brings the
    // featured article higher on the page. Deeper coverage of that removal
    // lives in scripts/reader-experience-regression.ts (test:reader-experience).
    check('the redundant POSITIONING_POINTS row is gone from the listing page', !listingSrc.includes('POSITIONING_POINTS'))
    check('the h1 "IBM i Insights" appears exactly once (single top-level heading)', (listingSrc.match(/<h1[^>]*>/g) ?? []).length === 1)
    // Exactly 1 literal <h2> occurrence in source now: only the empty-state's
    // own heading remains (the positioning cards' h2 is gone) -- still one
    // level below h1, no skipped heading level.
    check('the empty-state heading is h2, one level below h1 (no skipped heading level)', (listingSrc.match(/<h2[^>]*>/g) ?? []).length === 1)
  }

  // ---------------------------------------------------------------------------
  section('17. Explore Insights navigation and featured-card compactness (Insights listing UI/UX refinement)')
  // ---------------------------------------------------------------------------

  {
    const listingSrc = readRepoFile('app/insights/page.tsx')
    const navSrc = readRepoFile('components/insights/explore-insights-nav.tsx')
    const cardSrc = readRepoFile('components/insight-card.tsx')

    check('the listing page imports ExploreInsightsNav', /import \{ ExploreInsightsNav \} from '@\/components\/insights\/explore-insights-nav'/.test(listingSrc))
    check('the listing page renders <ExploreInsightsNav', listingSrc.includes('<ExploreInsightsNav'))
    check('the listing page reads a `category` search param, not a hardcoded filter', /searchParams:\s*Promise<\{\s*category\?:\s*string\s*\}>/.test(listingSrc))
    check(
      'the requested category is validated against the real INSIGHT_CATEGORIES taxonomy before use (an unknown/invalid value falls back to no filter, never a crash or an unfiltered bypass)',
      /INSIGHT_CATEGORIES\.some\(\(c\) => c\.id === requestedCategory\)/.test(listingSrc)
    )
    check(
      'the featured-card treatment is only ever computed for the unfiltered view -- a category filter can never invent a new "featured" article',
      /featuredInsight = activeCategory === null \? visibleInsights\[0\] : undefined/.test(listingSrc)
    )
    check('a category with zero results gets its own message distinct from the whole-catalog empty state', listingSrc.includes('No Insights are published in this category yet.'))

    // ExploreInsightsNav must be a Server Component (no 'use client') that
    // filters via real navigation (plain <Link>s to ?category=<id>), not
    // client-side state -- this is what keeps every category's articles
    // present in the server-rendered HTML of their own URL (nothing hidden
    // from a crawler that never executes JS) and makes browser Back/Forward
    // work through ordinary history entries rather than bespoke JS state.
    check("ExploreInsightsNav is a Server Component (no 'use client' directive)", !navSrc.includes("'use client'"))
    check('ExploreInsightsNav filters via real <Link> navigation to a ?category= URL, not client-side JS state', /href=\{`\/insights\?category=\$\{category\.id\}`\}/.test(navSrc))
    check('ExploreInsightsNav provides an "All Insights" link back to the unfiltered listing', /href="\/insights"/.test(navSrc) && navSrc.includes('All Insights'))
    check('ExploreInsightsNav links article titles straight to their detail page', /href=\{`\/insights\/\$\{insight\.slug\}`\}/.test(navSrc))
    check('ExploreInsightsNav marks the active selection for assistive tech via aria-current', /aria-current=\{[^}]*\? 'true'/.test(navSrc))
    check('ExploreInsightsNav is a labeled landmark distinct from other page navs', navSrc.includes('aria-label="Explore Insights"'))
    check('every interactive link in ExploreInsightsNav carries focus-visible styling', (navSrc.match(/focus-visible:ring-2/g) ?? []).length >= 3)

    check(
      'ExploreInsightsNav generates categories and counts from the `insights` prop it receives, not a second import of the catalog',
      !/from '@\/content\/insights\/catalog'/.test(navSrc)
    )
    for (const insight of INSIGHTS) {
      check(`ExploreInsightsNav has no hardcoded reference to "${insight.title}"`, !navSrc.includes(insight.title))
    }

    check('the mobile "Browse Insights" panel is a native, zero-JS <details>/<summary> disclosure', /<details[^>]*lg:hidden[^>]*>[\s\S]{0,300}<summary/.test(navSrc))
    check('the mobile panel is labeled "Browse Insights"', /<summary[^>]*>[\s\S]{0,200}Browse Insights/.test(navSrc))
    check('the desktop sidebar is sticky, positioned below the sticky site header', /lg:sticky lg:top-20/.test(navSrc))

    // Featured-card compactness: the old oversized treatment (a bigger step
    // up in padding and title size, same stacked layout as a standard card)
    // must be gone, replaced by a modest title bump and a two-column layout
    // from `sm:` up.
    check('the featured card no longer uses the old oversized padding step (p-6 sm:p-8)', !cardSrc.includes("'border-slate-100 p-6 sm:p-8'"))
    check('the featured card no longer uses the old oversized title size (text-2xl sm:text-3xl)', !cardSrc.includes('text-2xl sm:text-3xl'))
    check('the featured card title is only modestly larger than a standard card\'s text-lg', cardSrc.includes('text-xl font-bold text-slate-900 sm:text-2xl'))
    check('the featured card uses a balanced two-column layout from sm: up (content left, reading time + CTA right)', /sm:flex sm:items-start sm:justify-between sm:gap-6/.test(cardSrc))
    // Preserved content, just restructured: category badge, "Featured Insight"
    // badge, summary, tags, reading time, and the Read Insight action all
    // still render for the featured variant (asserted elsewhere in this file
    // too -- section 13's "InsightCard still renders reading time/tags" and
    // section 14's "Featured Insight" badge checks -- these two are specific
    // to the featured branch's own JSX).
    // Isolate the featured branch's own JSX (between the ternary's opening
    // and its " : (" that starts the non-featured branch) so these checks
    // can't accidentally pass by matching content from the other branch.
    const featuredBranchStart = cardSrc.indexOf('featured ? (')
    const featuredBranchEnd = cardSrc.indexOf(') : (', featuredBranchStart)
    const featuredBranchSrc = cardSrc.slice(featuredBranchStart, featuredBranchEnd)

    check('the featured branch still renders the article description', featuredBranchSrc.includes('insight.description'))
    check('the featured branch still renders the Read Insight action', featuredBranchSrc.includes('readInsightCta'))
    check('long titles wrap naturally rather than being truncated or clamped', !/line-clamp|truncate/.test(featuredBranchSrc))
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
