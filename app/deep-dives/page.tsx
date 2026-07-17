import type { Metadata } from 'next'
import { Layers, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DeepDiveBrowser } from '@/components/deep-dive-browser'
import { Card } from '@/components/ui/card'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'

export const metadata: Metadata = {
  title: 'Deep Dives — Professional IBM i, RPGLE & SQL Topic Guides',
  description:
    'Explore standalone professional-grade IBM i, RPGLE, SQL, CL, operations, debugging, and integration topic guides.',
  alternates: { canonical: '/deep-dives' },
}

/**
 * Deep Dives listing page (PR #154 -- Deep Dives Framework + Taxonomy).
 * The third learning pillar alongside the linear Beginner/Advanced lesson
 * path: standalone, non-linear, professional-grade topic guides. Every
 * catalog entry today is `status: 'planned'` (see content/deep-dives/
 * catalog.ts) -- this PR ships the framework/taxonomy/listing page, not
 * the content itself. Full Deep Dive write-ups and their detail pages
 * are deliberately deferred to a later PR (see planning/
 * DEEP_DIVES_STRATEGY.md), so nothing on this page links anywhere that
 * doesn't exist yet.
 */
export default function DeepDivesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-100 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50/60" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Layers className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">Deep Dives</h1>
            <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
              Deep Dives are focused, professional-grade guides for important IBM&nbsp;i, RPGLE, SQL,
              CL, and operations topics. Use them when you want detailed coverage of a specific
              concept, production scenario, or interview-heavy topic.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Explore standalone topic guides — no fixed order required.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
          <Card variant="muted" className="p-6">
            <p className="text-sm text-slate-700 leading-relaxed">
              Unlike the IBM&nbsp;i Fundamentals path, Deep Dives don&apos;t need to be read in
              order. Jump straight to the topic you need -- whether you&apos;re debugging a
              production issue, prepping for an interview, or want a deeper explanation than a
              regular lesson covers. New Deep Dives are added over time; topics marked
              &ldquo;Coming soon&rdquo; are planned but not published yet.
            </p>
          </Card>

          <DeepDiveBrowser deepDives={DEEP_DIVES} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
