import Link from 'next/link'
import type { Metadata } from 'next'
import { Lightbulb, PenTool, Rocket, TrendingUp, Wrench } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'IBM i Insights — Practical Ideas, Modern Techniques & Emerging Trends',
  description:
    'IBM i Insights: focused, practical articles on modernization ideas, useful platform capabilities, and emerging IBM i techniques for working developers, technical leads, and architects.',
  alternates: { canonical: '/insights' },
}

const POSITIONING_POINTS = [
  {
    icon: Wrench,
    title: 'Practical',
    body: 'Grounded in real production concerns -- not theory, not a certification checklist.',
  },
  {
    icon: Rocket,
    title: 'Modern techniques',
    body: 'How to connect IBM i to the tools and integration patterns modern applications expect.',
  },
  {
    icon: TrendingUp,
    title: 'Emerging trends',
    body: 'Where the platform is heading, and what is genuinely worth your attention today.',
  },
]

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
 */
export default function InsightsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-100 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50/60" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
              <Lightbulb className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">IBM i Insights</h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
              Practical ideas, modern techniques, and emerging trends.
            </p>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
              This section will hold focused, practical IBM&nbsp;i guidance -- modernization ideas, useful platform
              capabilities, emerging techniques, and expert walkthroughs. IBM&nbsp;i Insights are independent
              editorial articles, not curriculum lessons and not Deep Dive reference guides -- each one stands on
              its own.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
          <div className="grid gap-4 sm:grid-cols-3">
            {POSITIONING_POINTS.map((point) => (
              <Card key={point.title} className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <point.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-slate-900 mb-1.5">{point.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{point.body}</p>
              </Card>
            ))}
          </div>

          {/* Empty state -- deliberately no article cards, no sample/placeholder
              content, and no publication-date or cadence claims. Replace this
              block with the real listing (e.g. an InsightCard grid over
              getPublishedInsights(INSIGHTS)) the first time an Insight is
              approved and published. */}
          <div className="mx-auto max-w-xl rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/70 via-white to-white p-8 text-center shadow-sm sm:p-10">
            <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <PenTool className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Insights are being prepared</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Each IBM&nbsp;i Insight is researched, written, and technically reviewed on its own before it&apos;s
              published here, so this section stays genuinely useful rather than filled with filler. The first one
              will appear on this page once it&apos;s ready.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
              <Link href="/deep-dives" className="text-sky-700 hover:underline">
                Browse Deep Dives &rarr;
              </Link>
              <Link href="/learn" className="text-sky-700 hover:underline">
                Explore the Learning Center &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
