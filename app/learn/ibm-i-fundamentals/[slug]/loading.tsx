import { Skeleton } from '@/components/ui/skeleton'

/**
 * Mirrors LessonReaderLayout's two-column shape (components/lesson-reader-
 * layout.tsx) and the lesson article's header + prose-section rhythm, so
 * the skeleton-to-real-content swap doesn't visibly jump.
 */
export default function LessonLoading() {
  return (
    <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <aside className="mb-8 space-y-3 lg:mb-0">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 flex-1 rounded-lg" />
        </div>
        <div className="hidden space-y-2 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      <div className="min-w-0 max-w-3xl space-y-8 rounded-2xl border-t-4 border-t-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-3 border-b border-slate-100 pb-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
