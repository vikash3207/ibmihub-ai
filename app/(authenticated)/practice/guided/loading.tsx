import { Skeleton } from '@/components/ui/skeleton'

/**
 * Guided Practice's loading skeleton (IBM i Practice Hub -- follow-up
 * correction). The real page is a dark, full-bleed <SectionHero> followed
 * by white content cards -- the previous skeleton was entirely light/white,
 * producing a jarring light-to-dark flash the moment the real hero painted.
 * This mirrors that same dark-hero-then-light-content shape so the
 * transition stays visually continuous.
 */
export default function GuidedPracticeLoading() {
  return (
    <div>
      <div className="bg-slate-950 pt-16 pb-24 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-3xl space-y-4 px-4 text-center sm:px-6">
          <Skeleton className="mx-auto h-6 w-64 rounded-full bg-slate-800" />
          <Skeleton className="mx-auto h-10 w-72 rounded-lg bg-slate-800" />
          <Skeleton className="mx-auto h-4 w-full max-w-xl rounded bg-slate-800" />
          <Skeleton className="mx-auto h-4 w-2/3 max-w-md rounded bg-slate-800" />
        </div>
      </div>

      <div className="relative z-10 -mt-12 mx-auto max-w-3xl space-y-8 px-4 sm:-mt-16 sm:px-6">
        <Skeleton className="h-16 w-full rounded-2xl" />

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
