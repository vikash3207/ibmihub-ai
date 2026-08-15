import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Database, FlaskConical, Terminal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SimulatorNotice } from '@/components/practice-lab/simulator-notice'
import { PRACTICE_LAB_5250_THEME, PRACTICE_LAB_SQL_THEME } from '@/lib/section-theme'
import { cn } from '@/lib/utils'
import { FeaturePreviewShell } from '@/components/feature-preview/feature-preview-shell'
import { PreviewAuthCta } from '@/components/feature-preview/preview-auth-cta'
import { PRACTICE_LAB_PREVIEW_THEME } from '@/lib/feature-preview-theme'

// Auth-gated page -- never statically cache; always compute fresh per request.
// Mirrors app/(authenticated)/practice/page.tsx and dashboard/ai-tutor.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Practice Lab',
  description: 'A guided 5250-style command simulator and ACS-style SQL console for hands-on IBM i practice.',
  alternates: { canonical: '/practice-lab' },
  // Redirects any request without a session to /auth/login (see below) --
  // there is no content here for an anonymous crawler to index. See
  // app/robots.ts and app/sitemap.ts (PR #159 SEO audit).
  robots: { index: false, follow: false },
}

/**
 * Signed-out public preview (Homepage Hierarchy and Signed-Out Feature
 * Discovery). Replaces the previous unconditional `redirect('/auth/login')`.
 * Deliberately narrower than <PracticePreview> (app/(authenticated)/practice/page.tsx)
 * -- a focused look at just the two simulated environments this specific
 * route is about, not the broader practice-questions pitch. <SimulatorNotice>
 * is reused unchanged, same as the real page below.
 */
function PracticeLabPreview() {
  return (
    <FeaturePreviewShell
      icon={FlaskConical}
      badgeLabel="Practice Lab"
      title="Practice Lab"
      description="A guided 5250-style command simulator and an ACS-style SQL console -- both built for learning, both safe simulations with no connection to a real IBM&nbsp;i system."
      theme={PRACTICE_LAB_PREVIEW_THEME}
      cta={<PreviewAuthCta next="/practice-lab" />}
    >
      <SimulatorNotice />

      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border bg-gradient-to-b p-5 shadow-sm',
            PRACTICE_LAB_5250_THEME.border,
            PRACTICE_LAB_5250_THEME.cardWash
          )}
        >
          <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', PRACTICE_LAB_5250_THEME.accent)} aria-hidden="true" />
          <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm', PRACTICE_LAB_5250_THEME.accent)}>
            <Terminal className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="block font-semibold text-slate-900">5250 Command Practice</span>
          <span className="mt-1 block text-sm text-slate-600 leading-relaxed">
            Practice common IBM i commands -- WRKOBJ, DSPJOB, WRKACTJOB, and more -- in a guided
            5250-style simulator.
          </span>
        </div>

        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border bg-gradient-to-b p-5 shadow-sm',
            PRACTICE_LAB_SQL_THEME.border,
            PRACTICE_LAB_SQL_THEME.cardWash
          )}
        >
          <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', PRACTICE_LAB_SQL_THEME.accent)} aria-hidden="true" />
          <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm', PRACTICE_LAB_SQL_THEME.accent)}>
            <Database className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="block font-semibold text-slate-900">SQL Practice Console</span>
          <span className="mt-1 block text-sm text-slate-600 leading-relaxed">
            Write and run SQL -- SELECT, WHERE, JOIN, GROUP BY, and more -- against safe, simulated
            sample data.
          </span>
        </div>
      </div>
    </FeaturePreviewShell>
  )
}

export default async function PracticeLabPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <PracticeLabPreview />
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 px-6 py-10 sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:36px_36px]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -top-16 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-600/20 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-teal-500/15 blur-[90px]" aria-hidden="true" />
        <p
          className="pointer-events-none absolute right-6 top-6 hidden select-none font-mono text-xs tracking-wide text-emerald-200/20 sm:block"
          aria-hidden="true"
        >
          &gt; RUN QRY
        </p>

        <span className="relative mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <FlaskConical className="h-3 w-3" aria-hidden="true" />
          Guided, simulated practice environment
        </span>
        <h1 className="relative text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">Practice Lab</h1>
        <p className="relative text-slate-300 leading-relaxed max-w-xl">
          Practice IBM&nbsp;i skills hands-on with guided, simulated exercises — a 5250-style command
          practice environment and an ACS-style SQL console, both built for learning.
        </p>
      </div>

      <SimulatorNotice />

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/practice-lab/5250"
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          <div
            className={cn(
              'relative h-full overflow-hidden rounded-2xl border bg-gradient-to-b p-5 shadow-sm transition-all duration-300',
              'group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
              PRACTICE_LAB_5250_THEME.border,
              PRACTICE_LAB_5250_THEME.hoverBorder,
              PRACTICE_LAB_5250_THEME.cardWash
            )}
          >
            <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', PRACTICE_LAB_5250_THEME.accent)} aria-hidden="true" />
            <div
              className={cn(
                'mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                PRACTICE_LAB_5250_THEME.accent
              )}
            >
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">5250 Command Practice</span>
            <span className="block text-sm text-slate-600 mt-1 leading-relaxed">
              Practice common IBM i commands in a guided 5250-style simulator. No real system
              connection — a safe learning environment with predefined exercises.
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              Start practicing
              <ArrowRight
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>

        <Link
          href="/practice-lab/sql"
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <div
            className={cn(
              'relative h-full overflow-hidden rounded-2xl border bg-gradient-to-b p-5 shadow-sm transition-all duration-300',
              'group-hover:-translate-y-1 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
              PRACTICE_LAB_SQL_THEME.border,
              PRACTICE_LAB_SQL_THEME.hoverBorder,
              PRACTICE_LAB_SQL_THEME.cardWash
            )}
          >
            <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', PRACTICE_LAB_SQL_THEME.accent)} aria-hidden="true" />
            <div
              className={cn(
                'mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                PRACTICE_LAB_SQL_THEME.accent
              )}
            >
              <Database className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="block font-semibold text-slate-900">SQL Practice Console</span>
            <span className="block text-sm text-slate-600 mt-1 leading-relaxed">
              Practice SQL using an ACS-style learning console. Sample data only — safe,
              simulated exercises, not a connection to a real database.
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Start practicing
              <ArrowRight
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
