import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Layers } from 'lucide-react'
import { getPublishedLessonCount } from '@/lib/lessons'
import { IBM_I_FUNDAMENTALS_PATH_NAME } from '@/lib/config'
import { DEEP_DIVES } from '@/content/deep-dives/catalog'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { PublicBetaNotice } from '@/components/public-beta-notice'

export const metadata: Metadata = {
  title: 'Learning Center',
  description:
    'Start the IBM i Fundamentals learning path -- structured, original lessons for beginners and working IBM i developers.',
  alternates: { canonical: '/learn' },
}

export default async function LearnPage() {
  const publishedCount = await getPublishedLessonCount()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Center</h1>
        <p className="text-slate-600 leading-relaxed">
          A guided starting point for learning IBM i, one structured lesson at a time.
        </p>
      </div>

      <PublicBetaNotice compact>
        We are continuously upgrading the curriculum. Beginner-friendly lessons are available now,
        and deeper professional-grade expansions are being added over time.
      </PublicBetaNotice>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-l-4 border-l-blue-600">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">{IBM_I_FUNDAMENTALS_PATH_NAME}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Foundational IBM i concepts, from what the platform is to basic development workflow --
            covering libraries and objects, the 5250 interface, RPGLE, CLLE, Db2 for i, and more.
          </p>
          <p className="text-sm text-slate-500 mb-4">
            {publishedCount} lessons published
          </p>

          {publishedCount > 0 ? (
            <Link href="/learn/ibm-i-fundamentals" className={buttonVariants({ variant: 'primary' })}>
              Start Learning
            </Link>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Lesson content is being finalized -- check back soon.
            </div>
          )}
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Deep Dives</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Standalone, professional-grade topic guides for real-world development, debugging,
            integration, and interview readiness -- no fixed order required.
          </p>
          <p className="text-sm text-slate-500 mb-4">{DEEP_DIVES.length} topics planned</p>

          <Link href="/deep-dives" className={buttonVariants({ variant: 'secondary' })}>
            Browse Deep Dives
          </Link>
        </Card>
      </div>
    </div>
  )
}
