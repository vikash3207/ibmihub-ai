import { Skeleton } from '@/components/ui/skeleton'

export default function PracticeLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />

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
  )
}
