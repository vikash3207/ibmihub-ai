import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

export interface SectionFeatureCardTheme {
  /** Full static class strings (Tailwind JIT-safety -- see lib/section-theme.ts). */
  cardWash: string
  border: string
  hoverBorder: string
  /** Gradient direction classes for both the top accent bar and the icon chip, e.g. 'from-blue-500 to-cyan-500'. */
  accent: string
}

interface SectionFeatureCardProps {
  icon: ComponentType<IconProps>
  title: string
  body: string
  theme: SectionFeatureCardTheme
}

/**
 * Reusable pillar/feature card (Site-wide Navigation and Section Landing
 * Page Visual Upgrade). Generalizes the "positioning card" pattern
 * app/insights/page.tsx introduced (POSITIONING_POINTS): a gradient-washed
 * card with a top accent bar, a gradient icon chip, and hover elevation --
 * with copy and theme passed in as props, so this stays a structural
 * primitive rather than a page-specific component. IBM i Insights itself
 * keeps its own inline card markup (untouched by this PR); every other
 * upgraded page's pillar cards render through this component instead.
 */
export function SectionFeatureCard({ icon: Icon, title, body, theme }: SectionFeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-gradient-to-b p-6 shadow-sm transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        theme.border,
        theme.hoverBorder,
        theme.cardWash
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', theme.accent)} aria-hidden="true" />
      <div
        className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          theme.accent
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
    </div>
  )
}
