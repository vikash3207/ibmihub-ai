import { ShieldAlert, Sparkles, BookOpenCheck, MessageCircleQuestion } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessonBySlugOrNull } from '@/lib/lessons'
import { AiTutorChat } from '@/components/ai-tutor-chat'
import { FeaturePreviewShell } from '@/components/feature-preview/feature-preview-shell'
import { PreviewAuthCta } from '@/components/feature-preview/preview-auth-cta'
import { AI_TUTOR_PREVIEW_THEME } from '@/lib/feature-preview-theme'

// Auth-gated page -- never statically cache; always compute fresh per request
// so a production visitor's real session (not a build-time snapshot) decides
// what renders here.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Tutor',
  description: 'Ask IBM i learning questions and get educational guidance.',
  alternates: { canonical: '/ai-tutor' },
  // Redirects any request without a session to /auth/login (see below) --
  // there is no content here for an anonymous crawler to index. See
  // app/robots.ts and app/sitemap.ts (PR #159 SEO audit).
  robots: { index: false, follow: false },
}

const STARTER_PROMPTS = [
  'What is IBM i?',
  'What is a library in IBM i?',
  'What is the difference between RPGLE and CLLE?',
  'What is a job log?',
]

const PRIVACY_NOTICE =
  'AI Tutor is for educational guidance only. Do not enter customer data, credentials, ' +
  'production code, job logs, or confidential information. The tutor cannot connect to a ' +
  'real IBM i system, execute code, or verify production behavior. For production or ' +
  'operational changes, validate with official documentation and an experienced IBM i ' +
  'professional.'

interface Props {
  searchParams: Promise<{ lesson?: string }>
}

/**
 * Signed-out public preview (Homepage Hierarchy and Signed-Out Feature
 * Discovery). Replaces the previous unconditional `redirect('/auth/login')`
 * -- a visitor who has never seen AI Tutor should understand what it does
 * before being asked to create an account, not bounce straight to a blank
 * login form. Renders no chat UI, no usage quota, and makes no AI Tutor
 * request of its own -- STARTER_PROMPTS and PRIVACY_NOTICE below are the
 * same static constants the real, authenticated page already renders.
 */
function AiTutorPreview() {
  return (
    <FeaturePreviewShell
      icon={Sparkles}
      badgeLabel="AI Tutor"
      title="Ask IBM i questions, get IBM i-specific answers"
      description="iRPGenie's AI Tutor gives plain-language explanations of RPGLE, CLLE, Db2 for i, and IBM i operations -- grounded in the same lessons, Deep Dives, and Insights you're reading, not a generic programming assistant."
      theme={AI_TUTOR_PREVIEW_THEME}
      cta={<PreviewAuthCta next="/ai-tutor" signupVariant="ai" />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BookOpenCheck className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            Contextual help
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ask about the lesson, Deep Dive, or Insight you're currently reading and the Tutor
            already knows what you're looking at -- no need to re-explain your context.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <MessageCircleQuestion className="h-4 w-4 text-cyan-700" aria-hidden="true" />
            Example questions
          </div>
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <span
                key={prompt}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
              >
                {prompt}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm text-amber-900 leading-relaxed">{PRIVACY_NOTICE}</p>
      </div>
    </FeaturePreviewShell>
  )
}

export default async function AiTutorPage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <AiTutorPreview />
  }

  const { lesson: lessonSlug } = await searchParams
  // A missing, unknown, or unpublished ?lesson= value is a normal case here --
  // AI Tutor simply falls back to its general, course-wide context.
  const lesson = lessonSlug ? await getPublishedLessonBySlugOrNull(lessonSlug) : null
  const initialLessonContext = lesson ? { slug: lesson.slug, title: lesson.title } : null

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/40 px-6 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full bg-cyan-300/25 blur-[90px]"
          aria-hidden="true"
        />
        <div className="relative mb-3 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">iRPGenie AI Tutor</h1>
        </div>
        <p className="relative text-slate-600 leading-relaxed max-w-2xl">
          Your AI-powered IBM i learning assistant — ask questions about IBM i concepts and get
          educational, plain-language guidance.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm text-amber-900 leading-relaxed">{PRIVACY_NOTICE}</p>
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-gradient-to-b from-cyan-50/30 via-white to-white p-2 shadow-sm sm:p-3">
        <AiTutorChat starterPrompts={STARTER_PROMPTS} initialLessonContext={initialLessonContext} />
      </div>
    </div>
  )
}
