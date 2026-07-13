import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type CardVariant = 'default' | 'ai' | 'muted' | 'dark'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

/**
 * Shared card shell. "ai" is a soft cyan-tinted variant reserved for AI
 * Tutor callouts; "dark" is for cards placed on the dark hero/CTA sections.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border p-6 shadow-sm',
        variant === 'default' && 'border-slate-100 bg-white',
        variant === 'ai' && 'border-cyan-100 bg-cyan-50/60',
        variant === 'muted' && 'border-slate-100 bg-slate-50',
        variant === 'dark' && 'border-white/10 bg-white/5',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'
