'use client'

import { Sparkles } from 'lucide-react'
import { useAiTutorPanel } from './ai-tutor-panel-provider'
import { buttonVariants, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AiTutorContext } from './types'

interface AskAiTutorButtonProps {
  context: AiTutorContext
  children?: React.ReactNode
  className?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  showIcon?: boolean
}

/**
 * Shared trigger for opening the embedded AI Tutor panel (Spec 001 v1.1
 * AI-TUTOR-FR-020/023) -- used by both the lesson page and the Practice
 * page, so there is exactly one implementation of "how do I open the AI
 * Tutor with this context" rather than two.
 */
export function AskAiTutorButton({ context, children, className, variant = 'ai', size, showIcon = true }: AskAiTutorButtonProps) {
  const { openPanel } = useAiTutorPanel()

  return (
    <button
      type="button"
      onClick={() => openPanel(context)}
      className={cn(buttonVariants({ variant, size }), 'inline-flex items-center gap-1.5', className)}
    >
      {showIcon && <Sparkles className="h-4 w-4" aria-hidden="true" />}
      {children ?? 'Ask the AI Tutor'}
    </button>
  )
}
