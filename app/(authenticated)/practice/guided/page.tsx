import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ClipboardCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { PRACTICE_QUESTIONS, PRACTICE_TOPICS } from '@/content/practice/questions'
import { PracticeBrowser } from '@/components/practice-browser'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'

// Auth-gated page -- never statically cache; always compute fresh per
// request. Mirrors app/(authenticated)/dashboard/page.tsx and the parent
// /practice hub page.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guided Practice',
  description: 'Check your understanding of beginner IBM i topics with short, no-score practice questions.',
  alternates: { canonical: '/practice/guided' },
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
 * Guided Practice (IBM i Practice Hub -- UI foundation). A relocation, not a
 * rewrite: this is byte-for-byte the same hero copy, INTRO_NOTICE wording,
 * and <PracticeBrowser> usage the old app/(authenticated)/practice/page.tsx
 * rendered directly before the Practice Hub reframe -- preserving the
 * existing no-score practice experience and its questions/behavior exactly,
 * per the explicit instruction not to rewrite or expand it. Only the route
 * moved (the parent /practice page is now the hub landing page with three
 * "Test Your Knowledge" cards), and the standalone Practice Lab promo card
 * that used to sit here was dropped -- the hub landing page now covers that
 * discovery role directly via its own "Practise Hands-On" section, so
 * repeating the same link on this page would just be redundant.
 *
 * Signed-out visitors are redirected to /practice itself (which renders the
 * existing PracticePreview) rather than duplicating a second preview UI on
 * this sub-route.
 */
export default async function GuidedPracticePage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/practice')
  }

  const { topic: initialTopicId } = await searchParams

  // Only Published lessons are ever linked to from a practice question --
  // a relatedLessonSlugs entry that isn't (or is no longer) Published is
  // simply omitted from the rendered "Related lessons" list rather than
  // producing a broken or unpublished link.
  const lessons = await getPublishedLessons()
  const lessonTitleBySlug = Object.fromEntries(lessons.map((l) => [l.slug, l.title]))

  return (
    <>
      <SectionHero
        icon={ClipboardCheck}
        badgeLabel="Low-pressure, no-score practice"
        title="Guided Practice"
        accentWord="Practice"
        description="Short, beginner-friendly questions across the IBM&nbsp;i Fundamentals path. Pick a topic, answer or reveal a question, and see a short explanation with lessons to revisit."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-700 leading-relaxed shadow-sm">
          {INTRO_NOTICE}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <PracticeBrowser
          topics={PRACTICE_TOPICS}
          questions={PRACTICE_QUESTIONS}
          lessonTitleBySlug={lessonTitleBySlug}
          initialTopicId={initialTopicId ?? null}
        />
      </div>
    </>
  )
}
