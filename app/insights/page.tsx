import type { Metadata } from 'next'
import { Lightbulb, Rocket, TrendingUp, Wrench } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { InsightCard } from '@/components/insight-card'
import { Card } from '@/components/ui/card'
import { INSIGHTS } from '@/content/insights/catalog'
import { getPublishedInsights, getFeaturedInsight } from '@/lib/insights'

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
 * IBM i Insights listing page (PR #194 -- Launch IBM i Insights). A third,
 * separate public content type alongside the linear IBM i Fundamentals path
 * and the non-linear Deep Dive reference guides -- not a fourth "way to
 * learn" and not a Deep Dive subcategory (see lib/insights.ts and
 * content/insights/catalog.ts, both fully independent of the Deep Dive
 * catalog/types). Public, no login required, no search/filter yet (the
 * product decision is to add that once there are roughly 6-8 articles), and
 * no "coming soon" placeholder cards -- only real, published Insights ever
 * render here.
 */
export default function InsightsPage() {
  const publishedInsights = getPublishedInsights(INSIGHTS)
  const featuredInsight = getFeaturedInsight(INSIGHTS)
  const otherInsights = publishedInsights.filter((insight) => insight.slug !== featuredInsight?.slug)

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
              Insights are short-form, timely articles -- different from the guided IBM&nbsp;i Fundamentals lesson
              path and different from the comprehensive Deep Dive reference guides. Read one when you want a focused,
              outcome-oriented answer to &ldquo;how would I actually do this?&rdquo;
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

          {featuredInsight && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Latest Insight</p>
              <InsightCard insight={featuredInsight} featured />
            </div>
          )}

          {otherInsights.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">More Insights</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherInsights.map((insight) => (
                  <InsightCard key={insight.slug} insight={insight} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
