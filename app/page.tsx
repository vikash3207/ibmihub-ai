import Link from 'next/link'
import { WAITLIST_CTA_LABEL, SITE_NAME } from '@/lib/config'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* -- Header ------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-14 items-center justify-between">
          <span className="font-semibold text-slate-900">{SITE_NAME}</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/learn/ibm-i-fundamentals"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Learning Center
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-900 hover:underline"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      {/* -- Hero --------------------------------------------------------- */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Learn IBM&nbsp;i with structured lessons and AI&nbsp;guidance.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            IBMiHub AI helps beginners and working IBM&nbsp;i developers build confidence with IBM&nbsp;i
            Fundamentals, guided explanations, and an AI&nbsp;Tutor designed for IBM&nbsp;i concepts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary CTA -- label from config constant */}
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
            >
              {WAITLIST_CTA_LABEL}
            </Link>

            {/* Secondary CTA -- first lesson preview */}
            <Link
              href="/learn/ibm-i-fundamentals/what-is-ibm-i"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
            >
              Preview the first lesson &rarr;
            </Link>
          </div>
        </section>

        {/* -- Feature overview ------------------------------------------ */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'IBM i Fundamentals',
                body: 'A structured, beginner-friendly learning path covering IBM i concepts, RPGLE, CLLE, DB2 for i, job logs, and more.',
              },
              {
                title: 'AI Tutor',
                body: 'Ask IBM i questions in plain language and get clear, IBM i-specific explanations. Available to registered users.',
              },
              {
                title: 'Progress Tracking',
                body: 'Mark lessons complete and pick up exactly where you left off, every session.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <h2 className="font-semibold text-slate-900 mb-2">{f.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- Audience -------------------------------------------------- */}
        <section className="bg-white border-t border-slate-100 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Who is IBMiHub AI for?</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'IBM i Beginners',
                  body: 'New to IBM i? Start with a structured learning path designed to build your understanding step by step, without assuming prior IBM i knowledge.',
                },
                {
                  title: 'Working IBM i Developers',
                  body: 'Already working with IBM i? Use the AI Tutor to refresh concepts, clarify RPGLE or CLLE questions, and explore topics you want to understand better.',
                },
              ].map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">{a.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -- Trust / privacy ------------------------------------------- */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>A note on AI guidance:</strong> AI Tutor responses may be incorrect and should be
              validated before production use. Do not paste private source code, sensitive job logs,
              credentials, or customer data. IBMiHub AI does not connect to real IBM&nbsp;i systems in
              the MVP.
            </p>
          </div>
        </section>
      </main>

      {/* -- Footer ------------------------------------------------------- */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <span>{SITE_NAME}</span>
          <nav className="flex gap-6">
            <Link href="/learn/ibm-i-fundamentals" className="hover:text-slate-600 transition-colors">
              Learning Center
            </Link>
            <Link href="/auth/login" className="hover:text-slate-600 transition-colors">
              Log in
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
