import { cache } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, Sparkles } from 'lucide-react'
import { getPublishedLessonBySlug, getPublishedLessons, loadLessonMarkdown } from '@/lib/lessons'
import { renderLessonMarkdown } from '@/lib/markdown'
import { createClient } from '@/lib/supabase/server'
import { LessonContent } from '@/components/lesson-content'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { getCompletedLessonIdsForUser } from '@/lib/progress'
import { markLessonComplete } from '@/lib/actions/progress'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'

// Reads the auth session to decide protected-lesson access, Mark Complete,
// and completed state -- never statically cache; always compute fresh per
// request so production visitors see their real session, not a cached one.
export const dynamic = 'force-dynamic'

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

  const isCompleted = user
    ? (await getCompletedLessonIdsForUser(user.id)).has(lesson.id)
    : false

  return (
    <article className="space-y-8">
      <div>
        <Link
          href="/learn/ibm-i-fundamentals"
          prefetch={false}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          &larr; {IBM_I_FUNDAMENTALS_PATH_NAME}
        </Link>
        <p className="text-sm text-slate-500 mt-2">
          Lesson {lesson.lesson_order} of {lessons.length}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1 mb-2">{lesson.title}</h1>
        <p className="text-slate-600 leading-relaxed">{lesson.short_description}</p>
        <div className="mt-2 flex items-center gap-2">
          {lesson.estimated_reading_time !== null && (
            <span className="text-sm text-slate-400">~{lesson.estimated_reading_time} min read</span>
          )}
          {isCompleted && <Badge variant="success"><Check className="h-3 w-3" aria-hidden="true" />Completed</Badge>}
        </div>
      </div>

      {canRead ? (
        loadError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-800">
            This lesson could not be loaded right now. Please try again later, or{' '}
            <Link href="/learn/ibm-i-fundamentals" prefetch={false} className="underline">
              return to {IBM_I_FUNDAMENTALS_PATH_NAME}
            </Link>
            .
          </div>
        ) : (
          <LessonContent html={bodyHtml ?? ''} />
        )
      ) : (
        <Card className="text-center space-y-4 py-10">
          <h2 className="text-lg font-semibold text-slate-900">Log in to continue</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Create a free account to read this lesson and save your progress through the IBM i
            Fundamentals path.
          </p>
          <div className="flex justify-center gap-3">
            <Link href={loginHref} className={buttonVariants({ variant: 'primary' })}>
              Log in
            </Link>
            <Link
              href={`/auth/sign-up?next=${encodeURIComponent(`/learn/ibm-i-fundamentals/${lesson.slug}`)}`}
              className={buttonVariants({ variant: 'secondary' })}
            >
              Create account
            </Link>
          </div>
        </Card>
      )}

      {user && canRead && !loadError && (
        <Card className="border-l-4 border-l-emerald-500">
          {isCompleted ? (
            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" aria-hidden="true" /> Completed
            </p>
          ) : (
            <form>
              <input type="hidden" name="lessonId" value={lesson.id} />
              <Button type="submit" formAction={markLessonComplete} variant="primary">
                Mark Complete
              </Button>
            </form>
          )}
        </Card>
      )}

      {isPreview && !user && canRead && (
        <Card variant="muted" className="text-center space-y-3">
          <p className="text-sm text-slate-700 leading-relaxed">
            Like what you&apos;re reading? Create a free account to save your progress and unlock
            the rest of {IBM_I_FUNDAMENTALS_PATH_NAME}.
          </p>
          <Link
            href={`/auth/sign-up?next=${encodeURIComponent('/learn/ibm-i-fundamentals')}`}
            className={buttonVariants({ variant: 'primary' })}
          >
            Create a free account
          </Link>
        </Card>
      )}

      <Card variant="ai">
        <p className="flex items-center gap-1.5 text-sm font-medium text-cyan-900">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Have a question?
        </p>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          The AI Tutor is for educational guidance only. It cannot connect to a real IBM i
          system, execute code, or analyze production code. Opening it from here shares this
          lesson&apos;s title and content so it can answer questions about it directly.
        </p>
        {lesson.ai_tutor_starter_question && (
          <p className="text-sm text-slate-500 italic mt-2">
            Try asking: &ldquo;{lesson.ai_tutor_starter_question}&rdquo;
          </p>
        )}
        <Link
          href={`/ai-tutor?lesson=${encodeURIComponent(lesson.slug)}`}
          prefetch={false}
          className={buttonVariants({ variant: 'ai', className: 'mt-3' })}
        >
          Ask the AI Tutor
        </Link>
      </Card>

      <nav className="flex items-center justify-between border-t border-slate-100 pt-6">
        {previousLesson ? (
          <Link
            href={`/learn/ibm-i-fundamentals/${previousLesson.slug}`}
            prefetch={false}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            &larr; {previousLesson.title}
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            href={`/learn/ibm-i-fundamentals/${nextLesson.slug}`}
            prefetch={false}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            {nextLesson.title} &rarr;
          </Link>
        ) : (
          <Link
            href="/learn/ibm-i-fundamentals"
            prefetch={false}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            {IBM_I_FUNDAMENTALS_PATH_NAME} &rarr;
          </Link>
        )}
      </nav>
    </article>
  )
}
