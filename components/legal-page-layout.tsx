import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

interface Props {
  title: string
  lastUpdated: string
  children: ReactNode
}

/**
 * Shared shell for the Privacy/Terms/Disclaimer pages (PR #144). Mirrors
 * the visual pattern already established for the lesson reading pane (PR
 * #140): a white card with a subtle border/shadow inside the standard
 * page background, using the same `prose` typography classes so this
 * hand-written content gets the same heading/paragraph/list polish as
 * lesson content, without needing the markdown pipeline.
 */
export function LegalPageLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>
          <div className="prose prose-slate max-w-none mt-8">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
