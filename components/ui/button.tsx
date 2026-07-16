import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Shared button styling. `buttonVariants` is exported separately so the same
 * classes can be applied to a Next.js <Link> (via `className={buttonVariants(...)}`)
 * without needing a polymorphic/asChild component.
 *
 * Color roles (see design plan): "primary" (blue) is the one dominant CTA
 * color across the app; "ai" (cyan) is reserved for AI Tutor-specific
 * actions only, so the accent stays meaningful rather than decorative.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        secondary: 'border border-slate-200 bg-white text-slate-900 hover:border-slate-400 active:bg-slate-50',
        ghost: 'text-slate-600 hover:text-slate-900 active:text-slate-950',
        ai: 'bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800',
        'outline-light': 'border border-white/25 text-white hover:bg-white/10 active:bg-white/20',
      },
      size: {
        default: 'px-5 py-2.5',
        sm: 'px-4 py-2 text-xs',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
)
Button.displayName = 'Button'
