import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, BookOpen, GraduationCap, Layers } from 'lucide-react'
import { getPublishedLessonCount } from '@/lib/lessons'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { buttonVariants } from '@/components/ui/button'
import { PublicBetaNotice } from '@/components/public-beta-notice'
import { RegisterAiTutorPageContext } from '@/components/ai-tutor/register-page-context'
import { SectionHero } from '@/components/section-hero'
import { LEARN_HERO_THEME } from '@/lib/section-theme'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Learning Center',
  description:
    'Start the IBM i Fundamentals learning path — structured, original lessons for beginners and working IBM i developers.',
  alternates: { canonical: '/learn' },
}

/**
 * Learning Center landing page (visually upgraded -- Premium Section
 * Layout Alignment). app/learn/layout.tsx no longer imposes a page-wide
 * max-width/padding (see that file's own comment), so this page renders a
 * full-bleed <SectionHero> as a direct child of <main> -- identical
 * structure to app/deep-dives/page.tsx: hero, then the path cards
 * overlapping the hero's bottom fade via a negative top margin, then a
 * normally-padded section below. LEARN_HERO_THEME (lib/section-theme.ts) is
 * the same dark bg-slate-950 + glow + line-grid recipe as Deep Dives, in
 * blue/indigo.
 *
 * publishedCount and DEEP_DIVES.length are unchanged data flow -- only the
 * cards around them are richer than the previous plain `border-l-4` boxes.
 */
export default async function LearnPage() {
  const publishedCount = await getPublishedLessonCount()

  return (
    <>
      {/* Lets the header's AI Tutor button know the learner is browsing the
          iRPGenie curriculum, so a question like "what is a Deep Dive?"
          is answered about this platform's Deep Dives rather than the
          generic English phrase (PR #181). */}
      <RegisterAiTutorPageContext
        context={{ sourceType: 'learning-center', title: 'iRPGenie Learning Center' }}
      />

      <SectionHero
        icon={GraduationCap}
        badgeLabel="Guided, beginner-friendly learning"
        title="Learning Center"
        accentWord="Center"
        description="A guided starting point for learning IBM&nbsp;i, one structured lesson at a time."
        theme={LEARN_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 sm:items-stretch">
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" aria-hidden="true" />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{IBM_I_FUNDAMENTALS_PATH_NAME}</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Foundational IBM i concepts, from what the platform is to basic development workflow —
              covering libraries and objects, the 5250 interface, RPGLE, CLLE, Db2 for i, and more.
            </p>

            <div className="mt-auto space-y-4">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {publishedCount} {publishedCount === 1 ? 'lesson' : 'lessons'} published
              </p>

              {publishedCount > 0 ? (
                <Link href="/learn/ibm-i-fundamentals" className={cn(buttonVariants({ variant: 'primary' }), 'group/link w-full sm:w-auto')}>
                  Start Learning
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Lesson content is being finalized — check back soon.
                </div>
              )}
            </div>
          </div>

          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 via-white to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" aria-hidden="true" />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Layers className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Deep Dives</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Standalone, professional-grade topic guides for real-world development, debugging,
              integration, and interview readiness — no fixed order required.
            </p>

            <div className="mt-auto space-y-4">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {DEEP_DIVES.length} {DEEP_DIVES.length === 1 ? 'topic' : 'topics'} planned
              </p>

              <Link
                href="/deep-dives"
                className={cn(
                  buttonVariants({ variant: 'primary' }),
                  'group/link w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus-visible:ring-indigo-600 sm:w-auto'
                )}
              >
                Browse Deep Dives
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PublicBetaNotice compact>
          We are continuously upgrading the curriculum. Beginner-friendly lessons are available now,
          and deeper professional-grade expansions are being added over time.
        </PublicBetaNotice>
      </div>
    </>
  )
}
