import { Skeleton } from '@/components/ui/skeleton'

export default function PracticeLabSqlLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
