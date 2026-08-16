import type { ComponentType } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ClipboardCheck, Sparkles, MessageCircleQuestion, Terminal, Database, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'
import { FeaturePreviewShell } from '@/components/feature-preview/feature-preview-shell'
import { PreviewAuthCta } from '@/components/feature-preview/preview-auth-cta'
import { PRACTICE_PREVIEW_THEME } from '@/lib/feature-preview-theme'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Auth-gated page -- never statically cache; always compute fresh per
// request so a production visitor's real session decides what renders here.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Practice',
  description:
    'Practice, assess, and prepare for IBM i work -- guided practice, quick quizzes, interview preparation, and hands-on 5250/SQL simulators.',
  alternates: { canonical: '/practice' },
  robots: { index: false, follow: false },
}

interface IconProps {
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

const PREVIEW_KNOWLEDGE_MODES = [
  {
    icon: ClipboardCheck,
    title: 'Guided Practice',
    body: 'Short, no-score questions across the IBM i Fundamentals path, with explanations and lessons to revisit.',
    iconClasses: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: Sparkles,
    title: 'Quick Quiz',
    body: '5 or 10 question quizzes with instant scoring, review, and the option to retry what you missed.',
    iconClasses: 'bg-teal-50 text-teal-700',
  },
  {
    icon: MessageCircleQuestion,
    title: 'Interview Prep',
    body: 'Mock interview sessions across Beginner, Intermediate, Advanced, and Mixed levels -- coming soon.',
    iconClasses: 'bg-slate-100 text-slate-500',
  },
]

const PREVIEW_HANDS_ON_MODES = [
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
 * Signed-out public preview (IBM i Practice Hub, building on Homepage
 * Hierarchy and Signed-Out Feature Discovery's original 3-mode preview).
 * Grown to explain all 5 modes -- Guided Practice, Quick Quiz, Interview
 * Prep (labeled coming soon, matching the authenticated hub's own Interview
 * Prep card exactly, so a signed-out visitor is never told something is
 * available that isn't yet), 5250 Practice Lab, and SQL Console -- in the
 * same two-group layout the authenticated page uses.
 *
 * The previous "your practice activity counts toward your progress and
 * achievements" callout has been removed rather than carried forward --
 * confirmed during planning that no Practice data (guided, quiz, or
 * otherwise) feeds lib/dashboard-metrics.ts or lib/achievements.ts today,
 * so that claim was never actually true and this PR doesn't change that.
 */
function PracticePreview() {
  return (
    <FeaturePreviewShell
      icon={ClipboardCheck}
      badgeLabel="Practice"
      title="Practice, assess, and prepare"
      description="Reinforce concepts without pressure, test your knowledge with quick quizzes, prepare for IBM&nbsp;i technical interviews, and get hands-on with commands and SQL in safe simulators."
      theme={PRACTICE_PREVIEW_THEME}
      cta={<PreviewAuthCta next="/practice" />}
    >
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Test your knowledge</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PREVIEW_KNOWLEDGE_MODES.map((mode) => (
            <PreviewModeCard key={mode.title} {...mode} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Practise hands-on</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PREVIEW_HANDS_ON_MODES.map((mode) => (
            <PreviewModeCard key={mode.title} {...mode} />
          ))}
        </div>
      </div>
    </FeaturePreviewShell>
  )
}

function PreviewModeCard({
  icon: Icon,
  title,
  body,
  iconClasses,
}: {
  icon: ComponentType<IconProps>
  title: string
  body: string
  iconClasses: string
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg', iconClasses)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  )
}

function PracticeModeCard({
  href,
  icon: Icon,
  accent,
  title,
  body,
}: {
  href: string
  icon: ComponentType<IconProps>
  accent: string
  title: string
  body: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
      )}
    >
      <div className={cn('mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm', accent)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{body}</p>
      <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
        Start
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </p>
    </Link>
  )
}

/**
 * Interview Prep's authenticated card -- deliberately not a <Link> and
 * deliberately not styled like the two real, clickable cards next to it
 * (muted slate background/text, no hover elevation, no "Start" affordance),
 * matching this codebase's existing "Planned topics" treatment for
 * not-yet-available content (components/deep-dive-browser.tsx). There is
 * no content to start yet -- content/practice/interview-questions.ts's
 * INTERVIEW_QUESTIONS is intentionally empty pending separately reviewed,
 * technically validated content.
 */
function ComingSoonCard({ icon: Icon, title, body }: { icon: ComponentType<IconProps>; title: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold text-slate-700">{title}</h3>
        <Badge variant="neutral">Coming soon</Badge>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-slate-500">{body}</p>
    </div>
  )
}

export default async function PracticePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <PracticePreview />
  }

  return (
    <>
      <SectionHero
        icon={ClipboardCheck}
        badgeLabel="Learn, practise, assess, and prepare"
        title="Practice"
        accentWord="Practice"
        description="Reinforce concepts without pressure, test your knowledge with quick quizzes, prepare for IBM&nbsp;i technical interviews, and get hands-on with commands and SQL in safe simulators."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-5xl space-y-12 px-4 pb-16 sm:px-6 sm:pb-20">
        <section aria-labelledby="test-your-knowledge-heading">
          <h2 id="test-your-knowledge-heading" className="mb-5 text-lg font-bold text-slate-900">
            Test Your Knowledge
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <PracticeModeCard
              href="/practice/guided"
              icon={ClipboardCheck}
              accent="from-emerald-500 to-teal-500"
              title="Guided Practice"
              body="Answer or reveal short, no-score questions with explanations and lessons to revisit."
            />
            <PracticeModeCard
              href="/practice/quiz/builder"
              icon={Sparkles}
              accent="from-teal-500 to-cyan-500"
              title="Quick Quiz"
              body="5 or 10 question quizzes with instant scoring, review, and the option to retry what you missed."
            />
            <ComingSoonCard
              icon={MessageCircleQuestion}
              title="Interview Prep"
              body="Mock interview sessions across Beginner, Intermediate, Advanced, and Mixed levels."
            />
          </div>
        </section>

        <section aria-labelledby="practise-hands-on-heading">
          <h2 id="practise-hands-on-heading" className="mb-5 text-lg font-bold text-slate-900">
            Practise Hands-On
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <PracticeModeCard
              href="/practice-lab/5250"
              icon={Terminal}
              accent="from-amber-500 to-orange-500"
              title="5250-Style Practice Lab"
              body="Guided command practice -- WRKOBJ, DSPJOB, WRKACTJOB, and more -- in a 5250-style simulator."
            />
            <PracticeModeCard
              href="/practice-lab/sql"
              icon={Database}
              accent="from-blue-500 to-cyan-500"
              title="ACS-Style SQL Console"
              body="Write and run SQL against safe, simulated sample data in an ACS-style console."
            />
          </div>
          <p className="mt-4 text-center">
            <Link href="/practice-lab" className="text-sm font-medium text-slate-500 hover:text-slate-700">
              Or browse the full Practice Lab &rarr;
            </Link>
          </p>
        </section>
      </div>
    </>
  )
}
