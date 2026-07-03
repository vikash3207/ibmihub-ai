import { cache } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPublishedLessonBySlug, getPublishedLessons, loadLessonMarkdown } from '@/lib/lessons'
import { renderLessonMarkdown } from '@/lib/markdown'
import { createClient } from '@/lib/supabase/server'
import { LessonContent } from '@/components/lesson-content'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'

interface Props {
  params: Promise<{ slug: string }>
}

// Deduped per request: generateMetadata and the page component both need the
// same lesson lookup. getPublishedLessonBySlug() already calls notFound()
// server-side for any non-Published or nonexistent slug.
const getLesson = cache(async (slug: string) => getPublishedLessonBySlug(slug))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lesson = await getLesson(slug)

  return {
    title: lesson.title,
    description: lesson.short_description,
  }
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params
  const lesson = await getLesson(slug)

  const [lessons, supabase] = await Promise.all([getPublishedLessons(), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPreview = lesson.lesson_order === 1
  const canRead = isPreview || Boolean(user)

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id)
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  const loginHref = `/auth/login?next=${encodeURIComponent(`/learn/ibm-i-fundamentals/${lesson.slug}`)}`

  let bodyHtml: string | null = null
  let loadError = false

  if (canRead) {
    try {
      const markdown = await loadLessonMarkdown(lesson)
      bodyHtml = await renderLessonMarkdown(markdown)
    } catch {
      loadError = true
    }
  }

  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/learn/ibm-i-fundamentals"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          &larr; {IBM_I_FUNDAMENTALS_PATH_NAME}
        </Link>
        <p className="text-sm text-slate-500 mt-2">
          Lesson {lesson.lesson_order} of {lessons.length}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1 mb-2">{lesson.title}</h1>
        <p className="text-slate-600">{lesson.short_description}</p>
        {lesson.estimated_reading_time !== null && (
          <p className="text-sm text-slate-400 mt-1">~{lesson.estimated_reading_time} min read</p>
        )}
      </div>

      {canRead ? (
        loadError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-800">
            This lesson could not be loaded right now. Please try again later, or{' '}
            <Link href="/learn/ibm-i-fundamentals" className="underline">
              return to {IBM_I_FUNDAMENTALS_PATH_NAME}
            </Link>
            .
          </div>
        ) : (
          <LessonContent html={bodyHtml ?? ''} />
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Log in to continue</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Create a free account to read this lesson and save your progress through the IBM i
            Fundamentals path.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              Log in
            </Link>
            <Link
              href={`/auth/sign-up?next=${encodeURIComponent(`/learn/ibm-i-fundamentals/${lesson.slug}`)}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-slate-400 transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      )}

      {isPreview && !user && canRead && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center space-y-3">
          <p className="text-sm text-slate-700">
            Like what you&apos;re reading? Create a free account to save your progress and unlock
            the rest of {IBM_I_FUNDAMENTALS_PATH_NAME}.
          </p>
          <Link
            href={`/auth/sign-up?next=${encodeURIComponent('/learn/ibm-i-fundamentals')}`}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Create a free account
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <p className="text-sm text-slate-700 mb-2">
          Have a question about this lesson?{' '}
          <Link href="/ai-tutor" className="font-medium text-slate-900 underline">
            Ask the AI Tutor
          </Link>
        </p>
        {lesson.ai_tutor_starter_question && (
          <p className="text-sm text-slate-500 italic">
            Try asking: &ldquo;{lesson.ai_tutor_starter_question}&rdquo;
          </p>
        )}
      </div>

      <nav className="flex items-center justify-between border-t border-slate-100 pt-6">
        {previousLesson ? (
          <Link
            href={`/learn/ibm-i-fundamentals/${previousLesson.slug}`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            &larr; {previousLesson.title}
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            href={`/learn/ibm-i-fundamentals/${nextLesson.slug}`}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {nextLesson.title} &rarr;
          </Link>
        ) : (
          <Link
            href="/learn/ibm-i-fundamentals"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {IBM_I_FUNDAMENTALS_PATH_NAME} &rarr;
          </Link>
        )}
      </nav>
    </article>
  )
}
