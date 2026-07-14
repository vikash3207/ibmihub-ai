import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ClipboardCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { PRACTICE_QUESTIONS, PRACTICE_TOPICS } from '@/content/practice/questions'
import { PracticeBrowser } from '@/components/practice-browser'

// Auth-gated page -- never statically cache; always compute fresh per request
// so a production visitor's real session (not a build-time snapshot) decides
// what renders here. Mirrors app/(authenticated)/dashboard/page.tsx and
// app/(authenticated)/ai-tutor/page.tsx.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Practice Questions',
  description: 'Check your understanding of beginner IBM i topics with short practice questions.',
}

const INTRO_NOTICE =
  'These practice questions are here to help you check your own understanding -- there is no ' +
  'score, ranking, or certificate attached to them. Answering a question wrong just tells you ' +
  'which lesson is worth another look.'

interface Props {
  searchParams: Promise<{ topic?: string }>
}

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
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-bold text-slate-900">Practice Questions</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Short, beginner-friendly questions across the IBM i Fundamentals path. Pick a topic, answer or
          reveal a question, and see a short explanation with lessons to revisit.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 leading-relaxed">
        {INTRO_NOTICE}
      </div>

      <PracticeBrowser
        topics={PRACTICE_TOPICS}
        questions={PRACTICE_QUESTIONS}
        lessonTitleBySlug={lessonTitleBySlug}
        initialTopicId={initialTopicId ?? null}
      />
    </div>
  )
}
