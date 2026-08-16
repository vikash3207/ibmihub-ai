import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Lightbulb, PenTool } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { InsightCard } from '@/components/insight-card'
import { ExploreInsightsNav } from '@/components/insights/explore-insights-nav'
import { INSIGHTS } from '@/content/insights/catalog'
import { getPublishedInsights } from '@/lib/insights'
import { INSIGHT_CATEGORIES, type InsightCategoryId } from '@/lib/insight-categories'
import { cn } from '@/lib/utils'

const INSIGHTS_TITLE = 'IBM i Insights — Practical Ideas, Modern Techniques & Emerging Trends'
const INSIGHTS_DESCRIPTION =
  'IBM i Insights: focused, practical articles on modernization ideas, useful platform capabilities, and emerging IBM i techniques for working developers, technical leads, and architects.'

export const metadata: Metadata = {
  title: INSIGHTS_TITLE,
  description: INSIGHTS_DESCRIPTION,
  alternates: { canonical: '/insights' },
  // Next.js merges metadata shallowly per top-level key (see app/page.tsx's
  // identical note), so without explicit openGraph/twitter blocks here,
  // both would silently fall back to the root layout's generic defaults
  // instead of this page's own, more specific title/description.
  openGraph: {
    title: INSIGHTS_TITLE,
    description: INSIGHTS_DESCRIPTION,
    url: '/insights',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: INSIGHTS_TITLE,
    description: INSIGHTS_DESCRIPTION,
  },
}

/**
 * IBM i Insights listing page. A third, separate public content type
 * alongside the linear IBM i Fundamentals path and the non-linear Deep Dive
 * reference guides -- not a fourth "way to learn" and not a Deep Dive
 * subcategory (see lib/insights.ts and content/insights/catalog.ts, both
 * fully independent of the Deep Dive catalog/types). Public, no login
 * required.
 *
 * Originally launched with zero published articles (see git history) so the
 * Product Owner could review this section's design on its own first. Now
 * renders a real InsightCard grid over getPublishedInsights(INSIGHTS) (PR
 * #199, the first published Insight) -- but the catalog-empty path below is
 * deliberately still there and still correct: if every Insight were ever
 * unpublished again, this page would fall back to the same polished empty
 * state rather than rendering a broken or half-built-looking page. No
 * search/filter UI yet -- still deferred until there's enough content for
 * it to do anything.
 *
 * Visual design note: the hero deliberately reuses app/page.tsx's dark
 * hero language (bg-slate-950 + blurred glow blobs + the same Badge/button
 * primitives) rather than inventing a new visual system, so this section
 * reads as unmistakably iRPGenie while still feeling distinct via its
 * cyan/indigo/violet accent mix (vs. the homepage's blue/cyan). All
 * decorative elements (glow blobs, grid pattern, code glyphs) are
 * `aria-hidden` and CSS-only -- no images, no animation library.
 *
 * Explore Insights navigation (Insights listing UI/UX refinement): an
 * optional `?category=<id>` query param, read server-side below, narrows
 * the results to one category -- real navigation via
 * components/insights/explore-insights-nav.tsx's plain <Link>s, not client
 * filtering, so a filtered URL is server-rendered HTML on the first
 * response and browser Back/Forward work through ordinary history entries.
 * The featured-card treatment stays tied to the catalog-wide first
 * published article (array position 0 of `publishedInsights`) and is never
 * recalculated per category -- filtering shows a plain grid instead, so a
 * category filter can never invent a new "featured" article.
 *
 * The three-card "Practical / Modern techniques / Emerging trends"
 * positioning row that used to sit between the hero and ExploreInsightsNav
 * is gone (Deep Dives, IBM i Insights and Reader-Experience Polish) -- it
 * restated the hero's own tagline ("Practical ideas, modern techniques, and
 * emerging trends") almost word for word. Removing it brings the featured
 * article higher on the page without touching the hero itself, the
 * featured-card treatment, or ExploreInsightsNav.
 */
interface InsightsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const publishedInsights = getPublishedInsights(INSIGHTS)

  const { category: requestedCategory } = await searchParams
  const activeCategory: InsightCategoryId | null =
    requestedCategory && INSIGHT_CATEGORIES.some((c) => c.id === requestedCategory)
      ? (requestedCategory as InsightCategoryId)
      : null

  const visibleInsights = activeCategory
    ? publishedInsights.filter((insight) => insight.category === activeCategory)
    : publishedInsights

  const featuredInsight = activeCategory === null ? visibleInsights[0] : undefined
  const restInsights = activeCategory === null ? visibleInsights.slice(1) : visibleInsights

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-slate-950 pt-16 sm:pt-20 pb-24 sm:pb-28">
          {/* Faint technical grid -- pure CSS, no images */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]"
            aria-hidden="true"
          />
          {/* Soft gradient glows -- blue/cyan (shared iRPGenie signature) plus a restrained indigo/violet accent that's this section's own */}
          <div
            className="pointer-events-none absolute -top-24 left-1/4 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 right-0 h-[22rem] w-[22rem] rounded-full bg-cyan-500/20 blur-[100px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/15 blur-[110px]"
            aria-hidden="true"
          />
          {/* Same-hue radial scrim behind the copy -- content-length-agnostic
              contrast safety net, matching components/section-hero.tsx's
              contrast fix (see that file's doc comment for the full
              rationale). Not a hard rectangle: a soft ellipse falloff. */}
          <div
            className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_65%_at_50%_38%,rgba(2,6,23,0.55)_0%,rgba(2,6,23,0.22)_55%,transparent_78%)]"
            aria-hidden="true"
          />
          {/* Small abstract IBM i-inspired glyphs -- decorative only, hidden below sm to avoid any crowding/overflow risk on narrow screens */}
          <p
            className="pointer-events-none absolute left-6 top-28 hidden select-none font-mono text-xs tracking-wide text-cyan-200/15 sm:block lg:left-16"
            aria-hidden="true"
          >
            SELECT * FROM INSIGHTS;
          </p>
          <p
            className="pointer-events-none absolute bottom-24 right-8 hidden select-none font-mono text-5xl text-indigo-300/10 sm:block lg:right-16"
            aria-hidden="true"
          >
            {'{ }'}
          </p>

          {/* z-10: this must always paint above the fade-to-white overlay below it
              (and everything else in this section) -- the two are siblings with
              no z-index otherwise, so without this the overlay (later in the DOM)
              would win paint order and wash out the text underneath it. */}
          <div className="insights-hero-enter relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <Badge variant="ai" className="mb-5 border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Lightbulb className="h-3 w-3" aria-hidden="true" />
              Editorial perspectives for modern IBM i
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              IBM i{' '}
              <span className="hero-title-accent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="text-lg font-semibold text-cyan-300 mb-5">
              Practical ideas, modern techniques, and emerging trends.
            </p>
            <p className="text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Explore focused perspectives on IBM&nbsp;i modernization, platform capabilities, real-world
              engineering, and the technologies shaping its future.
            </p>
            <p className="mt-4 text-sm text-slate-400 max-w-lg mx-auto">
              Independent editorial content&mdash;separate from curriculum lessons and Deep Dive reference guides.
            </p>
          </div>

          {/* Fade-to-white: shorter than before, and transparent for its own
              first half, so lightening is confined close to the literal
              bottom edge instead of reaching up toward the copy -- same fix
              as components/section-hero.tsx. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 [background:linear-gradient(to_bottom,transparent_0%,transparent_45%,white_100%)]"
            aria-hidden="true"
          />
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-14 sm:pt-16 sm:pb-20">
          {publishedInsights.length === 0 ? (
            // Empty state -- deliberately no article cards, no sample/placeholder
            // content, and no publication-date or cadence claims. Kept as the
            // fallback for a fully-unpublished catalog (see this page's own
            // header comment), not the normal path anymore now that PR #199
            // published the first Insight.
            <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/80 via-white to-white p-8 text-center shadow-sm sm:p-10">
              <div
                className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-200/30 blur-[90px]"
                aria-hidden="true"
              />
              <span className="relative mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-md">
                <PenTool className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="relative text-xl font-bold text-slate-900 mb-2">Insights are being prepared</h2>
              <p className="relative text-sm text-slate-600 leading-relaxed">
                Each IBM&nbsp;i Insight is researched, written, and reviewed before publication, so every article that
                appears here is clear, accurate, and genuinely useful.
              </p>
              <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/deep-dives" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'group/link')}>
                  Browse Deep Dives
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
                <Link href="/learn" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'group/link')}>
                  Explore the Learning Center
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-8">
              <ExploreInsightsNav insights={publishedInsights} activeCategory={activeCategory} />

              <div className="min-w-0">
                {visibleInsights.length === 0 ? (
                  // Reachable only via a hand-edited URL for a real, valid
                  // category with zero published articles right now --
                  // ExploreInsightsNav never links to a category with a
                  // zero count. Plain text, no heading (matches
                  // components/lesson-browser.tsx's "No lessons match..."
                  // empty-filter state), so this never adds another heading
                  // below the page's existing hero title and section titles.
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-600">
                    No Insights are published in this category yet.{' '}
                    <Link
                      href="/insights"
                      className="font-medium text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
                    >
                      View all Insights
                    </Link>{' '}
                    to see everything published so far.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {featuredInsight && <InsightCard insight={featuredInsight} featured />}
                    {restInsights.length > 0 && (
                      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {restInsights.map((insight) => (
                          <InsightCard key={insight.slug} insight={insight} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
