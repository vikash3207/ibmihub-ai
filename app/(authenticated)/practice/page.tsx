import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowRight, ClipboardCheck, FlaskConical } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { PRACTICE_QUESTIONS, PRACTICE_TOPICS } from '@/content/practice/questions'
import { PracticeBrowser } from '@/components/practice-browser'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'

// Auth-gated page -- never statically cache; always compute fresh per request
// so a production visitor's real session (not a build-time snapshot) decides
// what renders here. Mirrors app/(authenticated)/dashboard/page.tsx and
// app/(authenticated)/ai-tutor/page.tsx.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Practice Questions',
  description: 'Check your understanding of beginner IBM i topics with short practice questions.',
  alternates: { canonical: '/practice' },
  // Redirects any request without a session to /auth/login (see below) --
  // there is no content here for an anonymous crawler to index. See
  // app/robots.ts and app/sitemap.ts (PR #159 SEO audit).
  robots: { index: false, follow: false },
}

const INTRO_NOTICE =
  'These practice questions are here to help you check your own understanding -- there is no ' +
  'score, ranking, or certificate attached to them. Answering a question wrong just tells you ' +
  'which lesson is worth another look.'

interface Props {
  searchParams: Promise<{ topic?: string }>
}

/**
 * Practice landing page (visually upgraded -- Site-wide Navigation and
 * Section Landing Page Visual Upgrade). app/(authenticated)/layout.tsx
 * wraps every authenticated page (including Onboarding, which this PR must
 * not touch) in a padded `max-w-3xl` <main>, so this hero uses
 * <SectionHero>'s `contained` prop -- same constraint and reasoning as
 * app/learn/page.tsx. PRACTICE_HERO_THEME (lib/section-theme.ts) is the
 * same dark bg-slate-950 + glow + line-grid recipe as Deep Dives, in
 * emerald/teal.
 * INTRO_NOTICE's wording, PracticeBrowser's props/behavior, and the auth
 * redirect are all byte-for-byte unchanged.
 */
export default async function PracticePage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=%2Fpractice')
  }

  const { topic: initialTopicId } = await searchParams

  // Only Published lessons are ever linked to from a practice question --
  // a relatedLessonSlugs entry that isn't (or is no longer) Published is
  // simply omitted from the rendered "Related lessons" list rather than
  // producing a broken or unpublished link.
  const lessons = await getPublishedLessons()
  const lessonTitleBySlug = Object.fromEntries(lessons.map((l) => [l.slug, l.title]))

  return (
    <div className="space-y-8">
      <SectionHero
        contained
        icon={ClipboardCheck}
        badgeLabel="Low-pressure, no-score practice"
        title="Practice Questions"
        description="Short, beginner-friendly questions across the IBM&nbsp;i Fundamentals path. Pick a topic, answer or reveal a question, and see a short explanation with lessons to revisit."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-slate-700 leading-relaxed">
        {INTRO_NOTICE}
      </div>

      <Link
        href="/practice-lab"
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <div
            className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-[60px]"
            aria-hidden="true"
          />
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <FlaskConical className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="relative flex-1">
            <span className="block font-semibold">Try the Practice Lab</span>
            <span className="mt-0.5 block text-sm text-slate-300">
              Hands-on 5250-style command practice and an ACS-style SQL console.
            </span>
          </div>
          <ArrowRight
            className="relative h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </div>
      </Link>

      <PracticeBrowser
        topics={PRACTICE_TOPICS}
        questions={PRACTICE_QUESTIONS}
        lessonTitleBySlug={lessonTitleBySlug}
        initialTopicId={initialTopicId ?? null}
      />
    </div>
  )
}
