import { cache } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, Sparkles, ClipboardCheck, Clock } from 'lucide-react'
import { getPublishedLessonBySlug, getPublishedLessons, loadLessonMarkdown } from '@/lib/lessons'
import { renderLessonMarkdown } from '@/lib/markdown'
import { createClient } from '@/lib/supabase/server'
import { LessonContent } from '@/components/lesson-content'
import { LessonReaderLayout } from '@/components/lesson-reader-layout'
import { LessonSidebar, type LessonSidebarItem } from '@/components/lesson-sidebar'
import { getTopicById, getTopicForLesson } from '@/lib/topics'
import { getMasterCategoryLabel } from '@/lib/master-categories'
import { getLessonAccent, LESSON_ACCENT_CLASSES } from '@/components/lesson-category-accent'
import { AskAiTutorButton } from '@/components/ai-tutor/ask-ai-tutor-button'
import { SyncActiveLessonContext } from '@/components/ai-tutor/sync-active-lesson-context'
import type { AiTutorContext } from '@/components/ai-tutor/types'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { getCompletedLessonIdsForUser } from '@/lib/progress'
import { markLessonComplete } from '@/lib/actions/progress'
import { getPracticeTopicIdForLesson } from '@/content/practice/questions'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'

// Reads the auth session to decide protected-lesson access, Mark Complete,
// and completed state -- never statically cache; always compute fresh per
// request so production visitors see their real session, not a cached one.
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ topic?: string }>
}

// Deduped per request: generateMetadata and the page component both need the
// same lesson lookup. getPublishedLessonBySlug() already calls notFound()
// server-side for any non-Published or nonexistent slug.
const getLesson = cache(async (slug: string) => getPublishedLessonBySlug(slug))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lesson = await getLesson(slug)

  // getLesson() only ever resolves a Published lesson (getPublishedLessonBySlug
  // calls notFound() otherwise), so this canonical/OG metadata can never be
  // generated for a Review Ready or Draft lesson.
  return {
    title: lesson.title,
    description: lesson.short_description,
    alternates: { canonical: `/learn/ibm-i-fundamentals/${lesson.slug}` },
    openGraph: {
      title: lesson.title,
      description: lesson.short_description,
      url: `/learn/ibm-i-fundamentals/${lesson.slug}`,
    },
  }
}

export default async function LessonPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { topic: topicParam } = await searchParams
  const lesson = await getLesson(slug)

  const [lessons, supabase] = await Promise.all([getPublishedLessons(), createClient()])
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isPreview = lesson.lesson_order === 1
  const canRead = isPreview || Boolean(user)
  const practiceTopicId = getPracticeTopicIdForLesson(lesson.slug)

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id)
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  // Sidebar context: prefer the ?topic= the learner arrived with (e.g. from
  // a filtered Learning Center list or another sidebar link); fall back to
  // inferring a topic from the lesson's own trackId so the sidebar always
  // shows a useful group, even when opened directly with no filter context.
  const sidebarTopic = getTopicById(topicParam) ?? getTopicForLesson(lesson)
  const sidebarLessons = sidebarTopic ? lessons.filter(sidebarTopic.match) : lessons.slice(Math.max(0, currentIndex - 5), currentIndex + 6)
  const sidebarItems: LessonSidebarItem[] = sidebarLessons.map((l) => ({
    slug: l.slug,
    title: l.title,
    lessonOrder: l.lesson_order,
  }))
  const learningCenterHref = sidebarTopic
    ? `/learn/ibm-i-fundamentals?topic=${sidebarTopic.id}`
    : '/learn/ibm-i-fundamentals'
  const categoryLabel = getMasterCategoryLabel(lesson.master_category_id)
  const accent = getLessonAccent(lesson.master_category_id)
  const accentClasses = LESSON_ACCENT_CLASSES[accent]
  const aiTutorContext: Extract<AiTutorContext, { sourceType: 'lesson' }> = {
    sourceType: 'lesson',
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    lessonPath: `/learn/ibm-i-fundamentals/${lesson.slug}`,
    topicId: sidebarTopic?.id,
    masterCategoryId: lesson.master_category_id ?? undefined,
    suggestedQuestion: lesson.ai_tutor_starter_question ?? undefined,
  }

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
    <LessonReaderLayout
      sidebar={
        <LessonSidebar
          items={sidebarItems}
          currentSlug={lesson.slug}
          topicLabel={sidebarTopic?.label ?? 'Nearby Lessons'}
          topicId={sidebarTopic?.id}
          learningCenterHref={learningCenterHref}
          categoryLabel={categoryLabel}
          categorySubLabel={lesson.master_subcategory ?? undefined}
        />
      }
    >
    <article className={`space-y-8 rounded-2xl border-t-4 bg-white p-6 shadow-sm sm:p-8 ${accentClasses.topBorder}`}>
      <div
        className={`-mx-6 -mt-6 rounded-t-2xl border-b border-slate-100 px-6 pb-6 pt-6 sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8 ${accentClasses.headerWash}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-xs font-semibold uppercase tracking-wide ${accentClasses.eyebrowText}`}>
            Lesson {lesson.lesson_order} of {lessons.length}
          </p>
          {categoryLabel && (
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${accentClasses.badgeBg} ${accentClasses.badgeText} ${accentClasses.badgeBorder}`}
            >
              {categoryLabel}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{lesson.title}</h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">{lesson.short_description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {lesson.estimated_reading_time !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              ~{lesson.estimated_reading_time} min read
            </span>
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

      <SyncActiveLessonContext context={aiTutorContext} />

      <Card variant="ai">
        <p className="flex items-center gap-1.5 text-sm font-medium text-cyan-900">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Have a question?
        </p>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          The AI Tutor is for educational guidance only. It cannot connect to a real IBM i
          system, execute code, or analyze production code. Opening it from here shares this
          lesson&apos;s title and content so it can answer questions about it directly, without
          leaving this page.
        </p>
        {lesson.ai_tutor_starter_question && (
          <p className="text-sm text-slate-500 italic mt-2">
            Try asking: &ldquo;{lesson.ai_tutor_starter_question}&rdquo;
          </p>
        )}
        <AskAiTutorButton context={aiTutorContext} className="mt-3">
          Ask the AI Tutor
        </AskAiTutorButton>
      </Card>

      {practiceTopicId && (
        <Link
          href={`/practice?topic=${encodeURIComponent(practiceTopicId)}`}
          prefetch={false}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-800"
        >
          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          Practice this topic
        </Link>
      )}

      <nav className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
        {previousLesson ? (
          <Link
            href={
              // This nav walks the full course order, which can cross a
              // topic boundary (e.g. the last lesson of one batch to the
              // first lesson of the next). Only carry the topic context
              // forward when the adjacent lesson actually belongs to it --
              // otherwise the next page's sidebar would show the wrong
              // topic's lesson list.
              sidebarTopic && sidebarTopic.match(previousLesson)
                ? `/learn/ibm-i-fundamentals/${previousLesson.slug}?topic=${sidebarTopic.id}`
                : `/learn/ibm-i-fundamentals/${previousLesson.slug}`
            }
            prefetch={false}
            className="flex min-w-0 max-w-[48%] items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
          >
            <span aria-hidden="true">&larr;</span>
            <span className="truncate">{previousLesson.title}</span>
          </Link>
        ) : (
          <span />
        )}

        {nextLesson ? (
          <Link
            href={
              sidebarTopic && sidebarTopic.match(nextLesson)
                ? `/learn/ibm-i-fundamentals/${nextLesson.slug}?topic=${sidebarTopic.id}`
                : `/learn/ibm-i-fundamentals/${nextLesson.slug}`
            }
            prefetch={false}
            className="flex min-w-0 max-w-[48%] items-center justify-end gap-2 rounded-xl border border-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
          >
            <span className="truncate">{nextLesson.title}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : (
          <Link
            href="/learn/ibm-i-fundamentals"
            prefetch={false}
            className="flex min-w-0 max-w-[48%] items-center justify-end gap-2 rounded-xl border border-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
          >
            <span className="truncate">{IBM_I_FUNDAMENTALS_PATH_NAME}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </nav>
    </article>
    </LessonReaderLayout>
  )
}
