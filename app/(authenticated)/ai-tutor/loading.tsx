import { Skeleton } from '@/components/ui/skeleton'

export default function AiTutorLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}
