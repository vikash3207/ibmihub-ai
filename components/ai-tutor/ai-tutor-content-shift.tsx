'use client'

import { usePathname } from 'next/navigation'
import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { cn } from '@/lib/utils'

/**
 * Reserves layout space for the embedded AI Tutor panel on wide desktop
 * viewports (PR #129, Issue 2), so the panel docks alongside the page
 * instead of covering it.
 *
 * Deliberately only shifts at the `xl` breakpoint and up -- below that
 * (narrow desktop/tablet landscape), the panel behaves as a right-side
 * overlay instead (see embedded-ai-tutor-panel.tsx), since reserving 400px
 * of a ~1024-1279px viewport would squeeze lesson/practice content
 * uncomfortably narrow. Below `lg`, the panel is a full-screen sheet and
 * there is no shared space to reserve at all.
 *
 * Mounted once in app/layout.tsx (alongside the provider/panel) so every
 * page gets this behavior for free -- lesson pages, /practice, and
 * anywhere else the panel might be left open -- rather than each route
 * needing its own copy of this logic.
 */
export function AiTutorContentShift({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isOpen } = useAiTutorPanel()
  const shifted = isOpen && pathname !== '/ai-tutor'

  return (
    <div className={cn('min-h-full xl:transition-[margin-right] xl:duration-200 xl:ease-in-out', shifted && 'xl:mr-[400px]')}>
      {children}
    </div>
  )
}
