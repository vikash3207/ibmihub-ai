import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Terminal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { PRACTICE_LAB_5250_EXERCISES } from '@/content/practice-lab/5250-exercises'
import { ExerciseWorkspace5250 } from '@/components/practice-lab/exercise-workspace-5250'

// Auth-gated page -- never statically cache; always compute fresh per request.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ exerciseSlug: string }>
}

function findExercise(slug: string) {
  return PRACTICE_LAB_5250_EXERCISES.find((e) => e.slug === slug && e.status === 'available') ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exerciseSlug } = await params
  const exercise = findExercise(exerciseSlug)
  return {
    title: exercise ? `${exercise.title} -- 5250 Command Practice` : '5250 Command Practice',
    description: exercise?.summary ?? 'A guided 5250-style command practice exercise.',
  }
}

export default async function PracticeLab5250ExercisePage({ params }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { exerciseSlug } = await params

  if (!user) {
    redirect(`/auth/login?next=%2Fpractice-lab%2F5250%2F${exerciseSlug}`)
  }

  const exercise = findExercise(exerciseSlug)

  // Not found, or a still-`planned` (not yet interactive) exercise slug --
  // there is nothing to render for either case yet (Spec 010 Section 10).
  if (!exercise) {
    notFound()
  }

  // Only Published lessons are ever linked to as a related lesson -- a
  // relatedLessonSlugs entry that isn't (or is no longer) Published is
  // simply omitted, mirroring app/(authenticated)/practice/page.tsx.
  const lessons = await getPublishedLessons()
  const lessonTitleBySlug = Object.fromEntries(lessons.map((l) => [l.slug, l.title]))
  const relatedLessons = exercise.relatedLessonSlugs
    .filter((slug) => lessonTitleBySlug[slug])
    .map((slug) => ({ slug, title: lessonTitleBySlug[slug] }))

  return (
    <div className="space-y-6">
      <div>
        <Link href="/practice-lab/5250" className="text-sm text-slate-500 transition-colors hover:text-slate-700 active:opacity-70">
          &larr; 5250 Command Practice
        </Link>
        <div className="mb-1 mt-2 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Terminal className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">{exercise.title}</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">{exercise.summary}</p>
      </div>

      <ExerciseWorkspace5250 exercise={exercise} relatedLessons={relatedLessons} />
    </div>
  )
}
