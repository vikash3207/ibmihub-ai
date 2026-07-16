import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared loading-placeholder block. Used to compose route-level loading.tsx
 * skeletons (lesson page, Learning Center, Practice, Practice Lab,
 * Dashboard) so they all share one pulse animation and one gray tone
 * instead of each route inventing its own.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/70', className)}
      aria-hidden="true"
      {...props}
    />
  )
}
