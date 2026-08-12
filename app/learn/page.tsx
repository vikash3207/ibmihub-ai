import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, BookOpen, GraduationCap, Layers } from 'lucide-react'
import { getPublishedLessonCount } from '@/lib/lessons'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { buttonVariants } from '@/components/ui/button'
import { PublicBetaNotice } from '@/components/public-beta-notice'
import { RegisterAiTutorPageContext } from '@/components/ai-tutor/register-page-context'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Learning Center',
  description:
    'Start the IBM i Fundamentals learning path -- structured, original lessons for beginners and working IBM i developers.',
  alternates: { canonical: '/learn' },
}

/**
 * Learning Center landing page (visually upgraded -- Site-wide Navigation
 * and Section Landing Page Visual Upgrade). app/learn/layout.tsx already
 * wraps every /learn/* page (including the lesson reader, which this PR
 * must not touch) in a padded `max-w-6xl` <main>, so this page's hero is a
 * contained, rounded gradient card rather than the edge-to-edge
 * <SectionHero> other upgraded pages use -- reusing that full-bleed
 * component here would mean restructuring the shared layout's padding,
 * which risks the lesson reader pages this PR is explicitly not allowed to
 * redesign. Deliberately calmer than Deep Dives or AI Tutor per spec: a
 * light blue/indigo wash, not a dark hero.
 *
 * publishedCount and DEEP_DIVES.length are unchanged data flow -- only the
 * cards around them are richer than the previous plain `border-l-4` boxes.
 */
export default async function LearnPage() {
  const publishedCount = await getPublishedLessonCount()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Lets the header's AI Tutor button know the learner is browsing the
          iRPGenie curriculum, so a question like "what is a Deep Dive?"
          is answered about this platform's Deep Dives rather than the
          generic English phrase (PR #181). */}
      <RegisterAiTutorPageContext
        context={{ sourceType: 'learning-center', title: 'iRPGenie Learning Center' }}
      />

      <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 px-6 py-10 text-center sm:px-10 sm:py-12">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          <GraduationCap className="h-3 w-3" aria-hidden="true" />
          Guided, beginner-friendly learning
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">Learning Center</h1>
        <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
          A guided starting point for learning IBM&nbsp;i, one structured lesson at a time.
        </p>
      </div>

      <PublicBetaNotice compact>
        We are continuously upgrading the curriculum. Beginner-friendly lessons are available now,
        and deeper professional-grade expansions are being added over time.
      </PublicBetaNotice>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" aria-hidden="true" />
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{IBM_I_FUNDAMENTALS_PATH_NAME}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Foundational IBM i concepts, from what the platform is to basic development workflow --
            covering libraries and objects, the 5250 interface, RPGLE, CLLE, Db2 for i, and more.
          </p>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {publishedCount} lessons published
          </p>

          {publishedCount > 0 ? (
            <Link href="/learn/ibm-i-fundamentals" className={cn(buttonVariants({ variant: 'primary' }), 'group/link')}>
              Start Learning
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Lesson content is being finalized -- check back soon.
            </div>
          )}
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50 via-white to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" aria-hidden="true" />
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Layers className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Deep Dives</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Standalone, professional-grade topic guides for real-world development, debugging,
            integration, and interview readiness -- no fixed order required.
          </p>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
            {DEEP_DIVES.length} topics planned
          </p>

          <Link href="/deep-dives" className={cn(buttonVariants({ variant: 'secondary' }), 'group/link')}>
            Browse Deep Dives
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
