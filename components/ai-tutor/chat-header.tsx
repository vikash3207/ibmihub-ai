import type { ReactNode } from 'react'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiTutorHeaderProps {
  /** Set when a lesson/practice context is active (e.g. "Using lesson context: What is IBM i?"). */
  contextLabel?: string | null
  /** Embedded-panel-only controls (new chat, close) -- the standalone page renders none. */
  actions?: ReactNode
  /** Tighter padding for the embedded panel's narrower header strip. */
  compact?: boolean
  className?: string
}

/**
 * Shared AI Tutor chat header (PR #153) -- used identically by the
 * standalone /ai-tutor chat window (components/ai-tutor/chat-thread.tsx's
 * ChatThread) and the embedded panel (embedded-ai-tutor-panel.tsx), so the
 * branding/avatar/status treatment can never drift between the two
 * surfaces. Only the trailing `actions` slot differs (the embedded panel
 * passes new-chat/close buttons; the standalone page passes none).
 */
export function AiTutorHeader({ contextLabel, actions, compact, className }: AiTutorHeaderProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-white',
        compact ? 'px-4 py-3' : 'px-5 py-4',
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-sm">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">iRPGenie AI Tutor</p>
          <p className="flex items-center gap-1.5 text-xs text-emerald-700">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
            Online — Ready to help
          </p>
          {contextLabel && <p className="mt-1 truncate text-xs text-slate-500">{contextLabel}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </div>
  )
}
