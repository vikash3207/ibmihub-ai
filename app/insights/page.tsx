import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Lightbulb, PenTool, Rocket, TrendingUp, Wrench } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
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
 * Each pillar's accent is a full, static Tailwind class string per key --
 * not string-interpolated (e.g. `from-${color}-500`) -- so Tailwind's JIT
 * scanner (which only greps ./app, ./components, ./pages -- see
 * tailwind.config.ts) can see them and generate the corresponding CSS at
 * build time. Same pattern as lib/deep-dive-categories.ts's
 * DEEP_DIVE_ACCENT_CLASSES.
 */
const POSITIONING_POINTS = [
  {
    icon: Wrench,
    title: 'Practical',
    body: 'Grounded in real production concerns — not theory, not a certification checklist.',
    cardWash: 'from-blue-50 via-white to-cyan-50/50',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: 'Modern techniques',
    body: 'How to connect IBM i to the tools and integration patterns modern applications expect.',
    cardWash: 'from-indigo-50 via-white to-violet-50/50',
    border: 'border-indigo-100',
    hoverBorder: 'hover:border-indigo-300',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    icon: TrendingUp,
    title: 'Emerging trends',
    body: 'Where the platform is heading, and what is genuinely worth your attention today.',
    cardWash: 'from-cyan-50 via-white to-emerald-50/50',
    border: 'border-cyan-100',
    hoverBorder: 'hover:border-emerald-300',
    accent: 'from-cyan-500 to-emerald-500',
  },
] as const

/**
 * IBM i Insights listing page. A third, separate public content type
 * alongside the linear IBM i Fundamentals path and the non-linear Deep Dive
 * reference guides -- not a fourth "way to learn" and not a Deep Dive
 * subcategory (see lib/insights.ts and content/insights/catalog.ts, both
 * fully independent of the Deep Dive catalog/types). Public, no login
 * required.
 *
 * Deliberately publishes zero articles right now (see content/insights/
 * catalog.ts) -- the Product Owner wants to review this section's design on
 * its own before any individual Insight is researched, reviewed, and
 * approved. This page has to look intentional and complete with an empty
 * catalog, not like a broken or half-built feature, so the copy below
 * explains what the section is for without claiming any article exists yet,
 * and without promising when one will. No search/filter UI either -- that's
 * deferred until there's enough real content for it to do anything.
 *
 * Deliberately does not import INSIGHTS/getPublishedInsights() at all: with
 * nothing published, there is nothing here that could leak an unpublished
 * entry, structurally, not by convention. The first published Insight
 * should replace the empty-state block below with a real listing (e.g. an
 * InsightCard grid over getPublishedInsights(INSIGHTS)) -- see that block's
 * own comment.
 *
 * Visual design note: the hero deliberately reuses app/page.tsx's dark
 * hero language (bg-slate-950 + blurred glow blobs + the same Badge/button
 * primitives) rather than inventing a new visual system, so this section
 * reads as unmistakably iRPGenie while still feeling distinct via its
 * cyan/indigo/violet accent mix (vs. the homepage's blue/cyan). All
 * decorative elements (glow blobs, grid pattern, code glyphs) are
 * `aria-hidden` and CSS-only -- no images, no animation library.
 */
export default function InsightsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-slate-950 pt-16 sm:pt-20 pb-28 sm:pb-32">
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
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">IBM i Insights</h1>
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

          {/* Smooth fade from the dark hero into the light content below, same idiom as the homepage hero */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" aria-hidden="true" />
        </section>

        {/* Positioning cards overlap the hero's fade zone (relative z-10 + negative
            margin) so the page reads as one continuous composition rather than a
            hard seam between a dark hero and a plain white body. */}
        <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-3">
            {POSITIONING_POINTS.map((point) => (
              <div
                key={point.title}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border bg-gradient-to-b p-6 shadow-md transition-all duration-300',
                  'hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                  point.border,
                  point.hoverBorder,
                  point.cardWash
                )}
              >
                <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', point.accent)} aria-hidden="true" />
                <div
                  className={cn(
                    'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                    point.accent
                  )}
                >
                  <point.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1.5">{point.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
          {/* Empty state -- deliberately no article cards, no sample/placeholder
              content, and no publication-date or cadence claims. Replace this
              block with the real listing (e.g. an InsightCard grid over
              getPublishedInsights(INSIGHTS)) the first time an Insight is
              approved and published. */}
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
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
