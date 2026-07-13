import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      neutral: 'bg-slate-100 text-slate-600',
      success: 'bg-emerald-100 text-emerald-800',
      ai: 'bg-cyan-100 text-cyan-800',
      warning: 'bg-amber-100 text-amber-900',
      locked: 'bg-slate-100 text-slate-500',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
