import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ClipboardCheck, Database, FlaskConical, Terminal, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublishedLessons } from '@/lib/lessons'
import { PRACTICE_QUESTIONS, PRACTICE_TOPICS } from '@/content/practice/questions'
import { PracticeBrowser } from '@/components/practice-browser'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'
import { FeaturePreviewShell } from '@/components/feature-preview/feature-preview-shell'
import { PreviewAuthCta } from '@/components/feature-preview/preview-auth-cta'
import { PRACTICE_PREVIEW_THEME } from '@/lib/feature-preview-theme'

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

const PRACTICE_MODES = [
  {
    icon: ClipboardCheck,
    title: 'Practice Questions',
    body: 'Short, no-score questions across the IBM i Fundamentals path, with explanations and lessons to revisit.',
    iconClasses: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: Terminal,
    title: '5250-Style Practice Lab',
    body: 'Guided command practice -- WRKOBJ, DSPJOB, WRKACTJOB, and more -- in a 5250-style simulator.',
    iconClasses: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Database,
    title: 'ACS-Style SQL Console',
    body: 'Write and run SQL against safe, simulated sample data in an ACS-style console.',
    iconClasses: 'bg-blue-50 text-blue-700',
  },
]

/**
 * Signed-out public preview (Homepage Hierarchy and Signed-Out Feature
 * Discovery). Replaces the previous unconditional `redirect('/auth/login')`.
 * Visually distinguishes the three practice modes rather than only
 * describing Practice Questions -- the real, authenticated page only shows
 * the question browser directly, with the Practice Lab promo as a secondary
 * link, but a first-time visitor needs to see all three before choosing.
 */
function PracticePreview() {
  return (
    <FeaturePreviewShell
      icon={ClipboardCheck}
      badgeLabel="Practice"
      title="Practice IBM i hands-on"
      description="Check your understanding with no-score practice questions, then get hands-on in a simulated 5250-style command environment and an ACS-style SQL console -- all safe learning simulations, not connections to a real IBM&nbsp;i system."
      theme={PRACTICE_PREVIEW_THEME}
      cta={<PreviewAuthCta next="/practice" />}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {PRACTICE_MODES.map((mode) => (
          <div key={mode.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${mode.iconClasses}`}>
              <mode.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-slate-900">{mode.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{mode.body}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
        <p className="text-sm text-slate-700 leading-relaxed">
          Create a free account and your practice activity counts toward your progress and
          achievements on your dashboard.
        </p>
      </div>
    </FeaturePreviewShell>
  )
}

/**
 * Practice landing page (visually upgraded -- Premium Section Layout
 * Alignment). app/(authenticated)/layout.tsx no longer imposes a page-wide
 * max-width/padding (see that file's own comment), so this page renders a
 * full-bleed <SectionHero> as a direct child of <main> -- same structure as
 * app/deep-dives/page.tsx: hero, then the no-score notice + Practice Lab
 * promo overlapping the hero's bottom fade, then the topic/question browser
 * in a normally-padded section below. PRACTICE_HERO_THEME
 * (lib/section-theme.ts) is the same dark bg-slate-950 + glow + line-grid
 * recipe as Deep Dives, in emerald/teal. INTRO_NOTICE's wording and
 * PracticeBrowser's props/behavior are byte-for-byte unchanged; the auth
 * gate now renders <PracticePreview> for a signed-out visitor instead of
 * redirecting straight to login (Homepage Hierarchy and Signed-Out Feature
 * Discovery).
 */
export default async function PracticePage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <PracticePreview />
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
        title="Practice Questions"
        accentWord="Questions"
        description="Short, beginner-friendly questions across the IBM&nbsp;i Fundamentals path. Pick a topic, answer or reveal a question, and see a short explanation with lessons to revisit."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-3xl space-y-4 px-4 sm:px-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm text-slate-700 leading-relaxed shadow-sm">
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
