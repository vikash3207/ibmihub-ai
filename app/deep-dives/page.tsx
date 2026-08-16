import type { Metadata } from 'next'
import { Layers, ShieldCheck, Sparkles, Wrench } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DeepDiveBrowser } from '@/components/deep-dive-browser'
import { SectionHero } from '@/components/section-hero'
import { SectionFeatureCard } from '@/components/section-feature-card'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { DEEP_DIVES_HERO_THEME, DEEP_DIVES_PILLAR_THEMES } from '@/lib/section-theme'

export const metadata: Metadata = {
  title: 'Deep Dives — Professional IBM i, RPGLE & SQL Topic Guides',
  description:
    'Explore standalone professional-grade IBM i, RPGLE, SQL, CL, operations, debugging, and integration topic guides.',
  alternates: { canonical: '/deep-dives' },
}

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Reference-grade',
    body: 'Written to the depth of a professional reference, not a beginner walkthrough.',
  },
  {
    icon: Layers,
    title: 'Non-linear',
    body: 'No fixed order — jump straight to the topic a production issue or interview needs.',
  },
  {
    icon: Wrench,
    title: 'Production-tested',
    body: 'Real examples, debugging notes, and the considerations that matter once code ships.',
  },
]

/**
 * Deep Dives listing page. The third learning pillar alongside the linear
 * Beginner/Advanced lesson path: standalone, non-linear, professional-grade
 * topic guides.
 *
 * Deliberately dark + indigo/violet (via DEEP_DIVES_HERO_THEME) rather than
 * IBM i Insights' violet/cyan, so the two "third pillar" pages stay visually
 * distinct: Deep Dives reads as a structured professional reference,
 * Insights as editorial perspective -- see each page's own hero copy.
 *
 * The explanatory "Deep Dives don't need to be read in order..." card that
 * used to sit between the pillar row and <DeepDiveBrowser> is gone (Deep
 * Dives, IBM i Insights and Reader-Experience Polish) -- it repeated what
 * the pillars above already say, and its one non-redundant point ("Coming
 * soon" = planned, not published) now lives in DeepDiveBrowser's own
 * "Planned topics" disclosure instead. This also brings the real,
 * published cards higher on the page.
 */
export default function DeepDivesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <SectionHero
          icon={Sparkles}
          badgeLabel="Professional IBM i reference guides"
          title="Deep Dives"
          accentWord="Dives"
          tagline="Standalone topic guides — no fixed order required."
          description="Focused, professional-grade guides for important IBM&nbsp;i, RPGLE, SQL, CL, and operations topics — detailed coverage of a specific concept, production scenario, or interview-heavy topic."
          theme={DEEP_DIVES_HERO_THEME}
        />

        <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <SectionFeatureCard key={pillar.title} icon={pillar.icon} title={pillar.title} body={pillar.body} theme={DEEP_DIVES_PILLAR_THEMES[index]} />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          <DeepDiveBrowser deepDives={DEEP_DIVES} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
