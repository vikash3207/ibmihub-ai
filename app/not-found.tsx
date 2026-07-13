import Link from 'next/link'
import { Cpu, SearchX } from 'lucide-react'
import { SITE_NAME } from '@/lib/config'
import { Card } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center p-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Cpu className="h-4 w-4" aria-hidden="true" />
          </span>
          {SITE_NAME}
        </Link>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="text-xl font-semibold text-slate-900 mb-2">Page not found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className={buttonVariants({ variant: 'primary' })}>
            Home
          </Link>
          <Link href="/learn" className={buttonVariants({ variant: 'secondary' })}>
            Learning Center
          </Link>
        </div>
      </Card>
    </main>
  )
}
