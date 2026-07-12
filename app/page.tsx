import Link from 'next/link'
import { BookOpen, Sparkles, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { PRIMARY_CTA_LABEL, SITE_NAME } from '@/lib/config'
import { SiteHeader } from '@/components/site-header'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Renders SiteHeader, which reads the auth session -- never statically cache
// this page or its header could serve a stale/incorrect logged-in state.
export const dynamic = 'force-dynamic'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'IBM i Fundamentals',
    body: 'A structured, beginner-friendly learning path covering IBM i concepts, RPGLE, CLLE, Db2 for i, job logs, and more.',
  },
  {
    icon: Sparkles,
    title: 'AI Tutor',
    body: 'Ask IBM i questions in plain language and get clear, IBM i-specific explanations. Available to registered users.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    body: 'Mark lessons complete and pick up exactly where you left off, every session.',
  },
]

const AUDIENCE = [
  {
    title: 'IBM i Beginners',
    body: 'New to IBM i? Start with a structured learning path designed to build your understanding step by step, without assuming prior IBM i knowledge.',
  },
  {
    title: 'Working IBM i Developers',
    body: 'Already working with IBM i? Use the AI Tutor to refresh concepts, clarify RPGLE or CLLE questions, and explore topics you want to understand better.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      {/* -- Hero --------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Subtle blue/cyan glow -- pure CSS, no images */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-500/20 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center">
            <Badge variant="ai" className="mb-6 border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI-powered IBM i learning
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
              The AI-powered learning platform for IBM&nbsp;i professionals.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn IBM&nbsp;i fundamentals, understand RPGLE and Db2&nbsp;for&nbsp;i concepts, and get
              guided support from an AI tutor built around the IBM&nbsp;i ecosystem.
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
          </div>

          {/* -- CSS-only product preview panel ---------------------------
              A tasteful, product-inspired mock -- not a real screenshot and
              not fake user data. Represents genuine IBMiHub AI concepts
              (a lesson, progress, Mark Complete, the AI Tutor) using the
              same visual language as the real app. */}
          <div className="relative mt-16 mx-auto max-w-3xl">
            <Card className="border-slate-200/10 shadow-2xl shadow-blue-950/50">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-2 text-xs text-slate-400">IBM i Fundamentals &middot; Lesson 1</span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">What is IBM i?</h3>
                  <p className="text-sm text-slate-500 mb-3">
                    A beginner-friendly introduction to the platform that runs on IBM Power Systems.
                  </p>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                    <span>Path progress</span>
                    <span>4 of 12 completed</span>
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
      </section>

      <main className="flex-1">
        {/* -- Feature overview ------------------------------------------ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20">
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold text-slate-900 mb-2">{f.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* -- IBM i Fundamentals highlight -------------------------------- */}
        <section className="border-t border-slate-100 bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 sm:items-center">
            <div>
              <Badge variant="neutral" className="mb-4">
                Learning path
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">IBM i Fundamentals</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                A complete, 12-lesson path from what the platform is to a basic development workflow --
                covering libraries and objects, the 5250 interface, RPGLE, CLLE, Db2 for i, and job logs.
                Lesson&nbsp;1 is free to preview without an account.
              </p>
              <Link href="/learn" className={buttonVariants({ variant: 'secondary' })}>
                Explore the Learning Center
              </Link>
            </div>
            <Card variant="muted">
              <ul className="space-y-3 text-sm text-slate-700">
                {[
                  'What is IBM i?',
                  'Libraries and Objects',
                  'Introduction to RPGLE',
                  'Introduction to Db2 for i',
                ].map((title, i) => (
                  <li key={title} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 shadow-sm">
                      {i + 1}
                    </span>
                    {title}
                  </li>
                ))}
                <li className="pl-9 text-slate-400">+ 8 more lessons</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* -- AI Tutor highlight ------------------------------------------ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 sm:items-center">
            <Card variant="ai" className="order-2 sm:order-1">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-cyan-800">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Try asking
              </p>
              <p className="text-sm text-slate-700 italic mb-4">
                &ldquo;What&apos;s the difference between a physical file and a logical file on IBM i?&rdquo;
              </p>
              <p className="text-xs text-slate-500">
                Educational guidance only -- the AI Tutor cannot connect to a real IBM i system or execute
                code.
              </p>
            </Card>
            <div className="order-1 sm:order-2">
              <Badge variant="ai" className="mb-4">
                AI Tutor
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Ask IBM i questions, get IBM i-specific answers
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Get clear, plain-language explanations of RPGLE, CLLE, and Db2 for i concepts, tuned for
                the IBM i ecosystem specifically -- not a generic programming assistant.
              </p>
              <Link href="/auth/sign-up" className={buttonVariants({ variant: 'ai' })}>
                Create a free account
              </Link>
            </div>
          </div>
        </section>

        {/* -- Audience ("Why IBMiHub AI") ---------------------------------- */}
        <section className="bg-slate-50 border-t border-slate-100 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
              Why IBMiHub AI?
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {AUDIENCE.map((a) => (
                <Card key={a.title} variant="muted">
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
        <section className="relative overflow-hidden bg-slate-950 py-20">
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
