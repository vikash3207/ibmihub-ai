import Link from 'next/link'
import type { Metadata } from 'next'
import {
  BookOpen,
  Sparkles,
  Unlock,
  Route,
  Award,
  ShieldAlert,
  CheckCircle2,
  GraduationCap,
  Code2,
  Terminal,
  Database,
  MessageCircle,
  Layers,
  Lightbulb,
  FlaskConical,
  ArrowRight,
} from 'lucide-react'
import { PRIMARY_CTA_LABEL, SITE_DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/config'
import { getPublishedLessons, type Lesson } from '@/lib/lessons'
import { getTopicForLesson } from '@/lib/topics'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PublicBetaNotice } from '@/components/public-beta-notice'
import { StructuredData } from '@/components/structured-data'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this page or its header could serve a stale/incorrect logged-in state.
export const dynamic = 'force-dynamic'

const HOME_TITLE = 'iRPGenie — AI-powered IBM i, RPGLE & SQL learning'

/**
 * Homepage structured data (PR #159 -- SEO crawling/indexing audit). A
 * WebSite + Organization pair is the standard baseline for a site's own
 * homepage -- helps Google associate the domain with the iRPGenie brand
 * name specifically (see planning/SEO_CRAWLING_INDEXING_AUDIT.md's brand
 * disambiguation section). Deliberately no `sameAs` social profile links
 * (none are established yet) and no affiliation with IBM -- this product
 * is an independent, unofficial learning resource.
 */
const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      description: 'AI-powered IBM i, RPGLE & SQL learning platform.',
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DEFAULT_DESCRIPTION,
    },
  ],
}

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
    { icon: Unlock, value: 'Free', label: 'Every lesson, no login', accent: 'blue' as const },
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

const AI_TUTOR_SAMPLE_PROMPTS = ['What is a job log in IBM i?', 'Show a simple RPGLE example.']

export default async function LandingPage() {
  const publishedLessons = await getPublishedLessons()

  const STATS = buildStats(publishedLessons.length)
  const CURRICULUM_HIGHLIGHTS = buildCurriculumHighlights(publishedLessons)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StructuredData data={HOME_STRUCTURED_DATA} />
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
              <Link href="/learn" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                {PRIMARY_CTA_LABEL}
              </Link>
              <Link
                href="/learn/ibm-i-fundamentals/what-is-ibm-i"
                className={buttonVariants({ variant: 'outline-light', size: 'lg' })}
              >
                Start reading Lesson 1 &rarr;
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              No credit card required &middot; Every lesson free to read &middot; Built for IBM&nbsp;i professionals
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

      <main id="main-content" className="flex-1">
        {/* -- Public beta notice ------------------------------------------
            The homepage's one, unobtrusive beta message (Homepage Hierarchy
            and Signed-Out Feature Discovery) -- the previous large, detailed
            roadmap section (an itemized "coming next" grid) is gone; this
            compact banner is now the only beta/roadmap messaging on the
            page. */}
        <section className="bg-slate-50 pt-10 sm:pt-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <PublicBetaNotice />
          </div>
        </section>

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

        {/* -- Choose your learning journey (Homepage Hierarchy and
            Signed-Out Feature Discovery) -- replaces the previous three-card
            section that sent both of its first two cards to the exact same
            /learn destination, while omitting Insights and hands-on
            Practice entirely. These three cards are goal-based, not
            content-type-based, and absorb the audience framing the
            now-removed standalone audience section used to carry, so that
            section is gone rather than duplicated here. */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Badge variant="neutral" className="mb-4">
              Where to start
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Choose your learning journey
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Whatever brought you here, there&apos;s a clear next step.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Journey 1: New to IBM i */}
            <Card className="flex flex-col p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">New to IBM&nbsp;i</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                {/* A single expression, not JSX text wrapped around {publishedLessons.length} --
                    avoids relying on the compiler's line-wrap whitespace collapsing, which
                    silently drops the space on one side of an expression split across lines. */}
                {`Start with a structured, beginner-friendly path that assumes no prior IBM i knowledge -- ${publishedLessons.length} lessons from what IBM i is to a basic development workflow.`}
              </p>
              <div className="space-y-2">
                <Link
                  href="/learn/ibm-i-fundamentals/what-is-ibm-i"
                  className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'w-full')}
                >
                  Start Lesson 1
                </Link>
                <Link
                  href="/learn"
                  className="block text-center text-sm font-medium text-blue-700 hover:underline"
                >
                  Browse the Learning Center &rarr;
                </Link>
              </div>
            </Card>

            {/* Journey 2: Already working with IBM i */}
            <Card className="flex flex-col p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Code2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Already working with IBM&nbsp;i</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Skip the beginner path -- go straight to focused, professional-level topics.
              </p>
              <div className="mt-auto space-y-3">
                <Link
                  href="/deep-dives"
                  className="group flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:border-violet-200 hover:bg-violet-50/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <Layers className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      Deep Dives
                      <ArrowRight className="ml-1 inline h-3 w-3 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </span>
                    <span className="block text-xs text-slate-500 leading-relaxed">
                      Reference-grade, non-linear topic guides -- jump straight to what a production
                      issue or interview needs.
                    </span>
                  </span>
                </Link>
                <Link
                  href="/insights"
                  className="group flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                    <Lightbulb className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      IBM i Insights
                      <ArrowRight className="ml-1 inline h-3 w-3 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </span>
                    <span className="block text-xs text-slate-500 leading-relaxed">
                      Practical articles on modernization ideas and emerging IBM&nbsp;i techniques.
                    </span>
                  </span>
                </Link>
              </div>
            </Card>

            {/* Journey 3: Want hands-on practice */}
            <Card className="flex flex-col p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FlaskConical className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Want hands-on practice?</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                Reinforce concepts with guided practice, test yourself with quick quizzes, and get
                hands-on in a simulated 5250-style command environment and an ACS-style SQL console --{' '}
                <strong className="font-semibold text-slate-800">
                  safe learning simulations, not a connection to a real IBM&nbsp;i system.
                </strong>{' '}
                Interview prep is coming soon.
              </p>
              <div className="mb-5 flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                  5250-style Lab
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  SQL Console
                </span>
              </div>
              <Link href="/practice" className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-full')}>
                Explore Practice
              </Link>
            </Card>
          </div>

          {/* AI Tutor: a cross-journey capability, not a fourth content
              library -- deliberately a slim connecting strip here, with the
              full showcase below. */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/50 px-5 py-4 text-center sm:flex-row sm:text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm text-slate-700">
              <strong className="font-semibold text-slate-900">AI Tutor works alongside every path above</strong>{' '}
              -- ask questions from any lesson, Deep Dive, Insight, or practice exercise.
            </p>
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
                basic development workflow -- every lesson is free to read, no account required.
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
                  <p className="text-xs font-medium text-slate-500">
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
                <span className="ml-auto text-[11px] font-medium text-slate-500">Product preview</span>
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
                the IBM&nbsp;i ecosystem specifically -- not a generic programming assistant. Works from
                any lesson, Deep Dive, Insight, or practice question -- not a separate content library.
              </p>
              <Link href="/ai-tutor" className={buttonVariants({ variant: 'ai' })}>
                Open AI Tutor
              </Link>
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

        {/* -- Contact (compact) --------------------------------------------
            Replaces the previous large, two-email-card Contact section
            (Homepage Hierarchy and Signed-Out Feature Discovery) -- the
            dedicated /contact page already covers Support vs. General
            Contact in full; this is now a single small CTA pointing there
            instead of duplicating that content on the homepage. */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <Card className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Have feedback or a question?</p>
              <p className="text-sm text-slate-500">We&apos;d love to hear from you.</p>
            </div>
            <Link href="/contact" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
              Contact us
            </Link>
          </Card>
        </section>

        {/* -- Final CTA --------------------------------------------------- */}
        <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start learning IBM&nbsp;i today.
            </h2>
            <p className="text-slate-300 mb-8">
              Every lesson is free to read, no account required. Create one anytime to save your
              progress and unlock the AI Tutor and Practice Lab.
            </p>
            <Link href="/learn" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              {PRIMARY_CTA_LABEL}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
