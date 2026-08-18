import type { ComponentType } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { ClipboardCheck, Sparkles, MessageCircleQuestion, Terminal, Database, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRACTICE_TOPICS } from '@/content/practice/questions'
import { SectionHero } from '@/components/section-hero'
import { PRACTICE_HERO_THEME } from '@/lib/section-theme'
import { PreviewAuthCta } from '@/components/feature-preview/preview-auth-cta'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Auth-gated page -- never statically cache; always compute fresh per
// request so a production visitor's real session decides what renders here.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Practice Hub',
  description:
    'Practice, assess, and prepare for IBM i work -- guided practice, quick quizzes, hands-on 5250/SQL simulators, and interview preparation coming soon.',
  alternates: { canonical: '/practice' },
  robots: { index: false, follow: false },
}

interface IconProps {
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

interface PracticeCardDef {
  href: string
  icon: ComponentType<IconProps>
  accent: string
  title: string
  body: string
  cta: string
}

const KNOWLEDGE_CARDS: PracticeCardDef[] = [
  {
    href: '/practice/guided',
    icon: ClipboardCheck,
    accent: 'from-emerald-500 to-teal-500',
    title: 'Guided Practice',
    body: 'Answer or reveal short, no-score questions with explanations and lessons to revisit.',
    cta: 'Start Guided Practice',
  },
  {
    href: '/practice/quiz/builder',
    icon: Sparkles,
    accent: 'from-teal-500 to-cyan-500',
    title: 'Quick Quiz',
    body: '5 or 10 question quizzes with instant scoring, review, and the option to retry what you missed.',
    cta: 'Build a Quiz',
  },
]

const HANDS_ON_CARDS: PracticeCardDef[] = [
  {
    href: '/practice-lab/5250',
    icon: Terminal,
    accent: 'from-amber-500 to-orange-500',
    title: '5250-Style Practice Lab',
    body: 'Guided command practice -- WRKOBJ, DSPJOB, WRKACTJOB, and more -- in a 5250-style simulator.',
    cta: 'Open 5250 Lab',
  },
  {
    href: '/practice-lab/sql',
    icon: Database,
    accent: 'from-blue-500 to-cyan-500',
    title: 'ACS-Style SQL Console',
    body: 'Write and run SQL against safe, simulated sample data in an ACS-style console.',
    cta: 'Open SQL Console',
  },
]

interface Props {
  searchParams: Promise<{ topic?: string }>
}

/**
 * Practice Hub landing page (IBM i Practice Hub). One shared dark, full-
 * bleed <SectionHero> (PRACTICE_HERO_THEME) for BOTH signed-out and
 * authenticated visitors -- a follow-up correction after review found the
 * signed-out branch's previous <FeaturePreviewShell> (a paler, card-based
 * shell shared with the AI Tutor/Practice Lab previews) read as visually
 * weaker than the authenticated page's dark hero, when the two were
 * actually just different, valid states rather than one being "wrong".
 * Deliberately does NOT touch FeaturePreviewShell/lib/feature-preview-theme.ts
 * itself -- AI Tutor and Practice Lab keep their existing, unmodified
 * signed-out previews; only Practice's own page now builds its signed-out
 * hero inline, reusing the same <SectionHero> + <PreviewAuthCta> primitives
 * every other authenticated section already uses, rather than changing a
 * shell three features share.
 *
 * The same KNOWLEDGE_CARDS/HANDS_ON_CARDS card grid renders in both states
 * for a consistent identity -- for a signed-out visitor each card's Link
 * routes to sign-up with a `next` scoped to that exact destination (e.g.
 * clicking "Quick Quiz" while signed out lands the visitor on
 * /practice/quiz/builder immediately after creating an account), reusing
 * the same safeInternalPath-validated `next` contract every other
 * protected-preview CTA in this app already relies on -- not a new pattern.
 * Interview Prep is always the same non-interactive ComingSoonCard in both
 * states, so a signed-out visitor is never told something is available
 * that isn't.
 *
 * Legacy `/practice?topic=<id>` links (this route's own URL before Guided
 * Practice was relocated to /practice/guided) still work: a valid topic id
 * redirects an authenticated visitor straight to the equivalent
 * /practice/guided?topic=... destination, and preserves that same
 * destination as the signed-out CTA's `next` so it survives login/sign-up.
 * An invalid/missing topic value just renders the normal hub -- never a
 * redirect loop (this always redirects to the *different* /practice/guided
 * route, never back to itself).
 */
export default async function PracticePage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { topic } = await searchParams
  const legacyTopicDestination = topic && PRACTICE_TOPICS.some((t) => t.id === topic) ? `/practice/guided?topic=${encodeURIComponent(topic)}` : null

  if (user && legacyTopicDestination) {
    redirect(legacyTopicDestination)
  }

  if (!user) {
    return <PracticePreview signedOutNext={legacyTopicDestination ?? '/practice'} />
  }

  return (
    <>
      <SectionHero
        icon={ClipboardCheck}
        badgeLabel="Learn, practice, assess, and prepare"
        title="Practice Hub"
        accentWord="Hub"
        description="Reinforce concepts without pressure, test your knowledge with quick quizzes, and get hands-on with commands and SQL in safe simulators -- with interview prep coming soon."
        theme={PRACTICE_HERO_THEME}
      />

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-5xl space-y-12 px-4 pb-16 sm:px-6 sm:pb-20">
        <section aria-labelledby="test-your-knowledge-heading">
          <h2 id="test-your-knowledge-heading" className="mb-5 text-lg font-bold text-slate-900">
            Test Your Knowledge
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {KNOWLEDGE_CARDS.map((card) => (
              <PracticeModeCard key={card.href} {...card} />
            ))}
            <ComingSoonCard
              icon={MessageCircleQuestion}
              title="Interview Prep"
              body="Mock interview sessions across Beginner, Intermediate, Advanced, and Mixed levels."
            />
          </div>
        </section>

        <section aria-labelledby="hands-on-practice-heading">
          <h2 id="hands-on-practice-heading" className="mb-5 text-lg font-bold text-slate-900">
            Hands-On Practice
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {HANDS_ON_CARDS.map((card) => (
              <PracticeModeCard key={card.href} {...card} />
            ))}
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

function PracticePreview({ signedOutNext }: { signedOutNext: string }) {
  return (
    <>
      <SectionHero
        icon={ClipboardCheck}
        badgeLabel="Learn, practice, assess, and prepare"
        title="Practice Hub"
        accentWord="Hub"
        description="Reinforce concepts without pressure, test your knowledge with quick quizzes, and get hands-on with commands and SQL in safe simulators -- with interview prep coming soon."
        theme={PRACTICE_HERO_THEME}
      >
        <PreviewAuthCta next={signedOutNext} className="justify-center" />
      </SectionHero>

      <div className="relative z-10 -mt-12 sm:-mt-16 mx-auto max-w-5xl space-y-12 px-4 pb-16 sm:px-6 sm:pb-20">
        <section aria-labelledby="test-your-knowledge-heading">
          <h2 id="test-your-knowledge-heading" className="mb-5 text-lg font-bold text-slate-900">
            Test Your Knowledge
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {KNOWLEDGE_CARDS.map((card) => (
              <PracticeModeCard key={card.href} {...card} signedOut />
            ))}
            <ComingSoonCard
              icon={MessageCircleQuestion}
              title="Interview Prep"
              body="Mock interview sessions across Beginner, Intermediate, Advanced, and Mixed levels."
            />
          </div>
        </section>

        <section aria-labelledby="hands-on-practice-heading">
          <h2 id="hands-on-practice-heading" className="mb-5 text-lg font-bold text-slate-900">
            Hands-On Practice
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {HANDS_ON_CARDS.map((card) => (
              <PracticeModeCard key={card.href} {...card} signedOut />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function PracticeModeCard({
  href,
  icon: Icon,
  accent,
  title,
  body,
  cta,
  signedOut,
}: PracticeCardDef & { signedOut?: boolean }) {
  const finalHref = signedOut ? `/auth/sign-up?next=${encodeURIComponent(href)}` : href

  return (
    <Link
      href={finalHref}
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
        {cta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </p>
    </Link>
  )
}

/**
 * Interview Prep's card -- deliberately not a <Link> and deliberately not
 * styled like the real, clickable cards next to it (muted slate background/
 * text, no hover elevation, no descriptive-action affordance), matching
 * this codebase's existing "Planned topics" treatment for not-yet-available
 * content (components/deep-dive-browser.tsx). Rendered identically in both
 * the signed-out and authenticated branches -- there is no content to start
 * yet in either case. content/practice/interview-questions.ts's
 * INTERVIEW_QUESTIONS is intentionally empty pending separately reviewed,
 * technically validated content; this card is unconditional and does NOT
 * read from that catalog -- it is explicitly, deliberately "Coming soon"
 * for the duration of this PR, not something that flips on its own once a
 * record exists. Wiring it to real availability is a deferred follow-up,
 * once an actual Interview Prep session/route exists to link to.
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
