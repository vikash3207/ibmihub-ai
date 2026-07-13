import Link from 'next/link'
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
} from 'lucide-react'
import { PRIMARY_CTA_LABEL, SITE_NAME } from '@/lib/config'
import { IBM_I_FUNDAMENTALS_LESSONS } from '@/content/lessons/metadata'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this page or its header could serve a stale/incorrect logged-in state.
export const dynamic = 'force-dynamic'

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
]

const STATS = [
  {
    icon: BookOpen,
    value: String(IBM_I_FUNDAMENTALS_LESSONS.length),
    label: 'Structured lessons',
    accent: 'blue' as const,
  },
  { icon: Route, value: '1', label: 'Guided fundamentals path', accent: 'blue' as const },
  { icon: Unlock, value: 'Free', label: 'First lesson preview', accent: 'blue' as const },
  { icon: Sparkles, value: 'AI', label: 'Tutor for IBM i concepts', accent: 'cyan' as const },
]

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
              AI-powered IBM i learning
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
              not fake user data. Represents genuine IBMiHub AI concepts
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
                    <span>4 of {IBM_I_FUNDAMENTALS_LESSONS.length} completed</span>
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
        </section>

        {/* -- IBM i Fundamentals highlight -------------------------------- */}
        <section className="border-t border-slate-100 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <Badge variant="neutral" className="mb-4">
                Learning path
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">IBM i Fundamentals</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                A complete, {IBM_I_FUNDAMENTALS_LESSONS.length}-lesson path from what the platform is to
                a basic development workflow -- covering libraries and objects, the 5250 interface,
                RPGLE, CLLE, Db2 for i, and job logs. Lesson&nbsp;1 is free to preview without an account.
              </p>
              <Link href="/learn" className={buttonVariants({ variant: 'secondary' })}>
                Explore the Learning Center
              </Link>
            </div>
            <Card variant="muted" className="p-6">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-700">
                {IBM_I_FUNDAMENTALS_LESSONS.map((lesson) => (
                  <li key={lesson.slug} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 shadow-sm">
                      {lesson.lessonOrder}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                  </li>
                ))}
              </ol>
            </Card>
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
                <Link href="/ai-tutor" prefetch={false} className={buttonVariants({ variant: 'ai' })}>
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

        {/* -- Audience ("Why IBMiHub AI") ---------------------------------- */}
        <section className="bg-slate-50 border-t border-slate-100 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
              Why IBMiHub AI?
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
              credentials, or customer data. IBMiHub AI does not connect to real IBM&nbsp;i systems
              at this time.
            </p>
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
              Free to preview. Create an account to save your progress and unlock the AI Tutor.
            </p>
            <Link href="/auth/sign-up" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              {PRIMARY_CTA_LABEL}
            </Link>
          </div>
        </section>
      </main>

      {/* -- Footer ------------------------------------------------------- */}
      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div>
            <span className="font-semibold text-slate-600">{SITE_NAME}</span>
            <span className="ml-2">AI-guided IBM i learning.</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/learn" className="hover:text-slate-600 transition-colors">
              Learning Center
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
