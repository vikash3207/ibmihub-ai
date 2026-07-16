import Link from 'next/link'
import type { Metadata } from 'next'
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Unlock,
  Route,
  Award,
  ShieldAlert,
  CheckCircle2,
  GraduationCap,
  Code2,
  Terminal,
  Database,
  LifeBuoy,
  MessageCircle,
  Layers,
} from 'lucide-react'
import { PRIMARY_CTA_LABEL, SITE_DEFAULT_DESCRIPTION, SUPPORT_EMAIL, CONTACT_EMAIL } from '@/lib/config'
import { getPublishedLessons, type Lesson } from '@/lib/lessons'
import { getTopicForLesson } from '@/lib/topics'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this page or its header could serve a stale/incorrect logged-in state.
export const dynamic = 'force-dynamic'

const HOME_TITLE = 'iRPGenie — AI-powered IBM i, RPGLE & SQL learning'

export const metadata: Metadata = {
  // Absolute override -- bypasses the root layout's `%s | iRPGenie` template
  // so the homepage's tab title doesn't end up with the brand name twice
  // (HOME_TITLE already reads as a complete, self-contained title).
  title: { absolute: HOME_TITLE },
  description: SITE_DEFAULT_DESCRIPTION,
  alternates: { canonical: '/' },
  // Next.js merges metadata shallowly per top-level key, so without this,
  // og:title/twitter:title would silently fall back to the root layout's
  // more generic default instead of this page's own, more specific title.
  openGraph: {
    title: HOME_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
    url: '/',
  },
  twitter: {
    // Next.js replaces the parent's whole `twitter` object rather than
    // merging individual fields, so `card` has to be repeated here too --
    // confirmed live in PR #145: without this, the root layout's intended
    // `summary_large_image` silently reverted to Next's `summary` default.
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Structured Curriculum',
    body: 'A structured, beginner-friendly learning path covering IBM i concepts, RPGLE, CLLE, Db2 for i, job logs, and more.',
  },
  {
    icon: Sparkles,
    title: 'AI Tutor',
    body: 'Ask IBM i questions in plain language and get clear, IBM i-specific explanations -- not a generic programming assistant.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    body: 'Mark lessons complete and pick up exactly where you left off, every time you come back.',
  },
  {
    icon: Award,
    title: 'Career-Ready IBM i Skills',
    body: 'Build practical foundations that support IBM i development, support, modernization, and long-term career growth.',
  },
  {
    icon: Terminal,
    title: '5250-Style Practice Lab',
    body: 'Practice real IBM i commands -- WRKOBJ, DSPJOB, WRKACTJOB, and more -- in a guided, 5250-style simulator with no real system connection.',
  },
  {
    icon: Database,
    title: 'ACS-Style SQL Practice Console',
    body: 'Write and run SQL -- SELECT, WHERE, JOIN, GROUP BY, and more -- in an ACS-style console against safe, simulated sample data.',
  },
]

// Built from the Published lesson count once fetched in the page component --
// learner-facing counts must reflect Published lessons only, never the raw
// content/lessons/metadata.ts count, which also includes Review Ready/Draft
// lessons that are not yet visible to learners.
function buildStats(publishedLessonCount: number) {
  return [
    {
      icon: BookOpen,
      value: String(publishedLessonCount),
      label: 'Structured lessons',
      accent: 'blue' as const,
    },
    { icon: Route, value: '1', label: 'Guided fundamentals path', accent: 'blue' as const },
    { icon: Unlock, value: 'Free', label: 'First lesson preview', accent: 'blue' as const },
    { icon: Sparkles, value: 'AI', label: 'Tutor for IBM i concepts', accent: 'cyan' as const },
  ]
}

/**
 * Compact, high-level curriculum groupings for the homepage (PR #150) --
 * replaces a previous section that listed every single published lesson
 * title in a long grid, which Product Owner feedback flagged as noisy.
 * Each bucket covers a fixed set of lib/topics.ts topic ids (the same
 * topic taxonomy the Learning Center's own filters use), so this stays a
 * display-only summary rather than a second, competing categorization
 * system. Every one of the 19 TOPIC_FILTERS entries belongs to exactly
 * one bucket below.
 */
const CURRICULUM_BUCKETS = [
  {
    icon: GraduationCap,
    title: 'Foundations',
    body: 'What IBM i is, 5250 navigation, libraries, objects, and the IFS.',
    topicIds: ['foundations', 'commands', 'libraries-objects-ifs'],
  },
  {
    icon: Code2,
    title: 'RPGLE & CLLE',
    body: 'RPGLE fundamentals through file I/O, CLLE, and advanced ILE concepts.',
    topicIds: ['rpgle', 'file-io', 'clle', 'rpgle-ile'],
  },
  {
    icon: Database,
    title: 'SQL & Db2 for i',
    body: 'Db2 for i, DDS, and SQL embedded directly in RPGLE.',
    topicIds: ['db2-dds', 'sqlrpgle'],
  },
  {
    icon: Layers,
    title: 'Screens & Reports',
    body: 'Display files, subfiles, and printer file reports.',
    topicIds: ['display-files', 'subfiles', 'printer-files'],
  },
  {
    icon: Award,
    title: 'Operations & Career',
    body: 'Debugging, operations, security, journaling, and interview readiness.',
    topicIds: ['debugging', 'operations', 'security', 'journaling', 'integration', 'mini-projects', 'interview'],
  },
]

function buildCurriculumHighlights(lessons: Lesson[]) {
  const bucketByTopicId = new Map<string, (typeof CURRICULUM_BUCKETS)[number]>()
  for (const bucket of CURRICULUM_BUCKETS) {
    for (const topicId of bucket.topicIds) {
      bucketByTopicId.set(topicId, bucket)
    }
  }

  const counts = new Map<(typeof CURRICULUM_BUCKETS)[number], number>()
  for (const lesson of lessons) {
    const topic = getTopicForLesson(lesson)
    const bucket = topic ? bucketByTopicId.get(topic.id) : undefined
    if (bucket) {
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1)
    }
  }

  return CURRICULUM_BUCKETS.map((bucket) => ({ ...bucket, count: counts.get(bucket) ?? 0 }))
}

const AUDIENCE = [
  {
    icon: GraduationCap,
    title: 'IBM i Beginners',
    body: 'New to IBM i? Start with a structured learning path designed to build your understanding step by step, without assuming prior IBM i knowledge.',
  },
  {
    icon: Code2,
    title: 'Working IBM i Developers',
    body: 'Already working with IBM i? Use the AI Tutor to refresh concepts, clarify RPGLE or CLLE questions, and explore topics you want to understand better.',
  },
]

const AI_TUTOR_SAMPLE_PROMPTS = ['What is a job log in IBM i?', 'Show a simple RPGLE example.']

export default async function LandingPage() {
  const supabase = await createClient()
  const [
    {
      data: { user },
    },
    publishedLessons,
  ] = await Promise.all([supabase.auth.getUser(), getPublishedLessons()])

  const STATS = buildStats(publishedLessons.length)
  const CURRICULUM_HIGHLIGHTS = buildCurriculumHighlights(publishedLessons)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      {/* -- Hero --------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Subtle blue/cyan glow -- pure CSS, no images */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-500/20 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-20 sm:pt-24 pb-20 sm:pb-24">
          <div className="text-center">
            <Badge variant="ai" className="mb-4 border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI-powered IBM i learning &middot; Public Beta
            </Badge>
            <p className="mb-3 text-base sm:text-lg font-semibold text-cyan-300">
              Master IBM&nbsp;i from Zero to Expert.
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
              The AI-powered learning platform for IBM&nbsp;i professionals.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn IBM&nbsp;i fundamentals, understand RPGLE, CLLE, DB2&nbsp;for&nbsp;i, DDS, and job
              logs, and get guided help from an AI tutor built for the IBM&nbsp;i ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                {PRIMARY_CTA_LABEL}
              </Link>
              <Link
                href="/learn/ibm-i-fundamentals/what-is-ibm-i"
                className={buttonVariants({ variant: 'outline-light', size: 'lg' })}
              >
                Preview the first lesson &rarr;
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              No credit card required &middot; Free first lesson &middot; Built for IBM&nbsp;i professionals
            </p>
          </div>

          {/* -- CSS-only product preview panel ---------------------------
              A tasteful, product-inspired mock -- not a real screenshot and
              not fake user data. Represents genuine iRPGenie concepts
              (a lesson, progress, Mark Complete, the AI Tutor) using the
              same visual language as the real app. */}
          <div className="relative mt-12 sm:mt-14 mx-auto max-w-3xl">
            <Card className="border-slate-200/10 shadow-2xl shadow-blue-950/50">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-2 text-xs text-slate-400">IBM i Fundamentals &middot; Lesson 1</span>
                <span className="ml-auto text-[11px] font-medium text-slate-300">Product preview</span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">What is IBM i?</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    A beginner-friendly introduction to the platform that runs on IBM Power Systems.
                  </p>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                    <span>Path progress</span>
                    <span>4 of {publishedLessons.length} completed</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 w-1/3 rounded-full bg-blue-600" />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Mark Complete
                  </span>
                </div>

                <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-cyan-800">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    AI Tutor
                  </p>
                  <p className="text-sm text-slate-700 italic">
                    &ldquo;What&apos;s the difference between IBM i and IBM Power Systems?&rdquo;
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Smooth fade from the dark hero into the light content below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-slate-50" />
      </section>

      <main className="flex-1">
        {/* -- Trust / credibility strip (honest MVP facts only) --------- */}
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-16">
            <div className="text-center mb-8">
              <Badge variant="neutral">Built for practical IBM i learning</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {STATS.map((stat) => (
                <Card
                  key={stat.label}
                  className={cn(
                    'p-6 text-center border-t-4 transition-shadow hover:shadow-md',
                    stat.accent === 'cyan' ? 'border-t-cyan-500' : 'border-t-blue-600'
                  )}
                >
                  <div
                    className={cn(
                      'mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
                      stat.accent === 'cyan' ? 'bg-cyan-100 text-cyan-700' : 'bg-blue-50 text-blue-600'
                    )}
                  >
                    <stat.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-500">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* -- Platform features ------------------------------------------ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Badge variant="neutral" className="mb-4">
              Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Everything you need to learn IBM&nbsp;i
            </h2>
            <p className="text-slate-600 leading-relaxed">
              A focused platform built around one thing: helping you actually understand IBM&nbsp;i.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-8 transition-shadow hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-600 mb-3">
              Want to practice hands-on? Try the 5250-style Practice Lab and ACS-style SQL Console.
            </p>
            {user ? (
              <Link href="/practice-lab" className={buttonVariants({ variant: 'secondary' })}>
                Try the Practice Lab
              </Link>
            ) : (
              <Link href="/auth/sign-up" className={buttonVariants({ variant: 'secondary' })}>
                Sign up to try the Practice Lab
              </Link>
            )}
          </div>
        </section>

        {/* -- IBM i Fundamentals highlight -------------------------------- */}
        <section className="border-t border-slate-100 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <Badge variant="neutral" className="mb-4">
                Learning path
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">IBM i Fundamentals</h2>
              <p className="text-slate-600 leading-relaxed">
                A complete, {publishedLessons.length}-lesson path from what the platform is to a
                basic development workflow. Lesson&nbsp;1 is free to preview without an account.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CURRICULUM_HIGHLIGHTS.map((bucket) => (
                <Card key={bucket.title} className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <bucket.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{bucket.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{bucket.body}</p>
                  <p className="text-xs font-medium text-slate-400">
                    {bucket.count} lesson{bucket.count === 1 ? '' : 's'}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/learn" className={buttonVariants({ variant: 'secondary' })}>
                Explore the Learning Center
              </Link>
            </div>
          </div>
        </section>

        {/* -- AI Tutor showcase ------------------------------------------ */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 sm:items-center">
            <Card className="order-2 sm:order-1 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AI Tutor</p>
                  <p className="text-xs text-slate-500">Educational guidance for IBM&nbsp;i concepts</p>
                </div>
                <span className="ml-auto text-[11px] font-medium text-slate-400">Product preview</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-2.5 text-sm text-white">
                    Explain the difference between a physical file and a logical file.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-2.5 text-sm text-slate-700">
                    A physical file stores the actual data. A logical file doesn&apos;t store data
                    itself -- it defines a view, like a subset of columns or an alternate access path,
                    over one or more physical files.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {AI_TUTOR_SAMPLE_PROMPTS.map((prompt) => (
                  <span
                    key={prompt}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500"
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </Card>
            <div className="order-1 sm:order-2">
              <Badge variant="ai" className="mb-4">
                AI Tutor
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Ask IBM&nbsp;i questions, get IBM&nbsp;i-specific answers
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Get clear, plain-language explanations of RPGLE, CLLE, and Db2 for i concepts, tuned for
                the IBM&nbsp;i ecosystem specifically -- not a generic programming assistant.
              </p>
              {user ? (
                <Link href="/ai-tutor" className={buttonVariants({ variant: 'ai' })}>
                  Open AI Tutor
                </Link>
              ) : (
                <Link href="/auth/sign-up" className={buttonVariants({ variant: 'ai' })}>
                  Sign up to try AI Tutor
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* -- Audience ("Why iRPGenie") ---------------------------------- */}
        <section className="bg-slate-50 border-t border-slate-100 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
              Why iRPGenie?
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {AUDIENCE.map((a) => (
                <Card key={a.title} variant="muted" className="p-8">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <a.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{a.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* -- Trust / privacy ------------------------------------------- */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
          <Card className="flex items-start gap-3 border-amber-100 bg-amber-50">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>A note on AI guidance:</strong> AI Tutor responses may be incorrect and should be
              validated before production use. Do not paste private source code, sensitive job logs,
              credentials, or customer data. iRPGenie does not connect to real IBM&nbsp;i systems
              at this time. Read the full{' '}
              <Link href="/disclaimer" className="underline hover:text-amber-950">
                Beta &amp; AI Disclaimer
              </Link>{' '}
              for more detail.
            </p>
          </Card>
        </section>

        {/* -- Contact ------------------------------------------------------
            Homepage teaser for the dedicated /contact page (PR #150) --
            Product Owner feedback was that Contact felt too buried/subtle,
            so it gets its own highlighted section here, not just a footer
            link. Kept intentionally short (two email cards + a link to the
            full page) rather than duplicating /contact's founder note,
            safety note, and mailto form -- that would clutter the homepage. */}
        <section className="border-t border-slate-100 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <Badge variant="neutral" className="mb-4">
                Get in touch
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Contact iRPGenie</h2>
              <p className="text-slate-600 leading-relaxed">
                Have feedback, a bug to report, or a question about the platform? We&apos;d love to
                hear from you.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {SUPPORT_EMAIL && (
                <Card className="p-6 border-t-4 border-t-blue-600">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <LifeBuoy className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Support</h3>
                  <p className="text-sm text-slate-500 mb-3">Login help, bugs, and technical issues.</p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline break-all"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </Card>
              )}

              {CONTACT_EMAIL && (
                <Card variant="ai" className="p-6 border-t-4 border-t-cyan-500">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">General Contact</h3>
                  <p className="text-sm text-slate-500 mb-3">Feedback, suggestions, and collaboration.</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm font-semibold text-cyan-800 hover:text-cyan-950 hover:underline break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </Card>
              )}
            </div>

            <div className="mt-8 text-center">
              <Link href="/contact" className={buttonVariants({ variant: 'secondary' })}>
                Visit the Contact page
              </Link>
            </div>
          </div>
        </section>

        {/* -- Final CTA --------------------------------------------------- */}
        <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start learning IBM&nbsp;i today.
            </h2>
            <p className="text-slate-300 mb-8">
              Free to preview. Create an account to save your progress and unlock the AI Tutor.
            </p>
            <Link href="/auth/sign-up" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              {PRIMARY_CTA_LABEL}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
