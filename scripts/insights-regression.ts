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
 * Owner review of the section's design on its own first) and PR #199
 * published the first one, "IBM i MCP Server: The New Bridge Between AI
 * Assistants and IBM i" (content/insights/ibm-i-mcp-server-ai-assistants.md).
 * Sections below that used to assert an empty catalog (no article, no
 * sitemap entry, no static route) have been updated to assert the opposite
 * for that real entry, while keeping the *generic* logic checks (synthetic
 * fixtures, structured-data builders, slug-resolution mechanics) unchanged
 * -- they were never coupled to the catalog being empty.
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
import { INSIGHT_FIGURE_REGISTRY } from '../components/insights/mcp-figures'

const LAUNCH_SLUG = 'ibm-i-mcp-server-ai-assistants'

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
  section('1. The real catalog publishes exactly the first Insight, well-formed')
  // ---------------------------------------------------------------------------

  check('content/insights/catalog.ts has exactly one entry', INSIGHTS.length === 1, `got ${INSIGHTS.length}`)
  check('getPublishedInsights() on the real catalog returns that one entry', getPublishedInsights(INSIGHTS).length === 1)
  check('the entry\'s slug is the expected launch slug', INSIGHTS[0]?.slug === LAUNCH_SLUG)
  check('getFeaturedInsight() on the real catalog returns the launch article (marked featured: true)', getFeaturedInsight(INSIGHTS)?.slug === LAUNCH_SLUG)
  check('the entry has a known InsightCategoryId', INSIGHT_CATEGORIES.some((c) => c.id === INSIGHTS[0]?.category))
  check('the entry has at least one tag', (INSIGHTS[0]?.tags.length ?? 0) > 0)
  check('the entry has a valid, non-future ISO publishedAt', (() => {
    const t = new Date(`${INSIGHTS[0]?.publishedAt}T00:00:00Z`).getTime()
    return !Number.isNaN(t) && t <= Date.now()
  })())
  check('the entry has a positive readingTimeMinutes', (INSIGHTS[0]?.readingTimeMinutes ?? 0) > 0)
  check(
    'every relatedDeepDiveSlugs entry actually exists in the Deep Dive catalog (no dangling reference)',
    (INSIGHTS[0]?.relatedDeepDiveSlugs ?? []).every((slug) => DEEP_DIVES.some((d) => d.slug === slug))
  )

  const insightsContentDir = resolve(__dirname, '..', 'content', 'insights')
  const markdownFiles = readdirSync(insightsContentDir).filter((f) => f.endsWith('.md'))
  check('content/insights/ has exactly one Markdown file, matching the catalog slug', markdownFiles.length === 1 && markdownFiles[0] === `${LAUNCH_SLUG}.md`, `found: ${markdownFiles.join(', ')}`)

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
      'the launch article is published, so sitemap.ts (which filters with isInsightAvailable) will include it',
      INSIGHTS.filter(isInsightAvailable).some((i) => i.slug === LAUNCH_SLUG)
    )
    check('exactly one Insight is eligible for the sitemap right now', INSIGHTS.filter(isInsightAvailable).length === 1)

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
    // homepage (out of scope -- "do not modify ... unrelated UI"), so these
    // checks stay as they were: no featured-Insight section on the homepage.
    check('homepage has no featured-Insight section', !homepageSrc.includes('Explore IBM i Insights'))
    check('homepage does not import InsightCard', !homepageSrc.includes('InsightCard'))
    check('homepage does not import the Insights catalog', !homepageSrc.includes("from '@/content/insights/catalog'"))
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

    // With a real Insight now published, this listing page should actually
    // render at build time, containing that real article's title.
    check(
      'the real published article renders on the listing page',
      (() => {
        const published = getPublishedInsights(INSIGHTS)
        return published.length > 0 && published[0].slug === LAUNCH_SLUG
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
      'generateStaticParams() now produces exactly one route, for the launch article',
      INSIGHTS.filter(isInsightAvailable).length === 1 && INSIGHTS.filter(isInsightAvailable)[0].slug === LAUNCH_SLUG
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

    const launchMarkdown = readFileSync(resolve(__dirname, '..', 'content', 'insights', `${LAUNCH_SLUG}.md`), 'utf-8')
    const markersInMarkdown = [...launchMarkdown.matchAll(/\[\[FIGURE:([a-z0-9-]+)\]\]/g)].map((m) => m[1])
    const registeredForLaunch = Object.keys(INSIGHT_FIGURE_REGISTRY[LAUNCH_SLUG] ?? {})

    check('the launch article has at least the 5 required figures plus the optional 6th', markersInMarkdown.length >= 6, `found ${markersInMarkdown.length}`)
    check('no duplicate figure marker names within the launch article', markersInMarkdown.length === new Set(markersInMarkdown).size)
    check(
      'every figure marker referenced in the launch article has a matching registry entry',
      markersInMarkdown.every((name) => registeredForLaunch.includes(name)),
      `missing: ${markersInMarkdown.filter((n) => !registeredForLaunch.includes(n)).join(', ')}`
    )
    check(
      'the registry has no orphan entries the article never references (stays in sync both ways)',
      registeredForLaunch.every((name) => markersInMarkdown.includes(name)),
      `orphaned: ${registeredForLaunch.filter((n) => !markersInMarkdown.includes(n)).join(', ')}`
    )

    check('the Markdown source contains no raw HTML tags (remark-rehype never enables allowDangerousHtml, so any would just render as escaped text)', !/<(div|svg|script|iframe)[\s>]/i.test(launchMarkdown))
    check('the Markdown source references no external image URL', !/!\[[^\]]*\]\(https?:\/\//.test(launchMarkdown))
    check('the Markdown source does not use an <img> tag', !/<img[\s>]/i.test(launchMarkdown))
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

    // Every diagram is now built from real HTML text nodes rather than
    // hand-positioned SVG <text>, so labels are selectable, translatable,
    // and readable by assistive tech without needing a parallel <title>/
    // <desc> transcript. No figure should need a horizontally-scrollable
    // viewport either -- if one does, its default view renders looking cut
    // off rather than complete (the reason the architecture figure was
    // rebuilt away from SVG).
    check('no figure is an inline <svg> requiring a separate text transcript', !/<svg[\s>]/i.test(figuresSrc))
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
  section('12. Documentation hygiene: no stale PR references, no leftover "Launch article" wording')
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
  section('13. Listing-page social metadata and keyboard-focus safeguards')
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
  section('14. Hero visual-polish pass: decorative-only, reduced-motion-safe, no external assets')
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
