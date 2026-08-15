import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

export interface FeaturePreviewTheme {
  border: string
  /** Full header background gradient -- see lib/feature-preview-theme.ts. */
  gradient: string
  /** Decorative blur-blob color, CSS-only (no images). */
  glow: string
  badgeClasses: string
  iconChipClasses: string
}

interface FeaturePreviewShellProps {
  icon: ComponentType<IconProps>
  badgeLabel: string
  title: string
  description: string
  theme: FeaturePreviewTheme
  /** Feature-specific bullets, mockups, or comparison cards. */
  children: ReactNode
  /** Bottom CTA row -- typically <PreviewAuthCta>. */
  cta: ReactNode
}

/**
 * Shared shell for every signed-out "protected feature" preview (AI Tutor,
 * Practice, Practice Lab -- Homepage Hierarchy and Signed-Out Feature
 * Discovery). Modeled on the light-gradient header card
 * app/(authenticated)/ai-tutor/page.tsx already used for its own (real,
 * authenticated) header, generalized with a `theme` prop the same way
 * components/section-hero.tsx generalizes its per-section dark hero --
 * see lib/feature-preview-theme.ts for the three theme instances.
 *
 * Deliberately NOT the full-bleed <SectionHero> shell: two of this shell's
 * three callers (AI Tutor, Practice Lab) render inside
 * app/(authenticated)/layout.tsx's self-wrapped `mx-auto max-w-3xl` content
 * area, not the full-bleed one Practice's own authenticated page uses -- see
 * that layout's header comment. Keeping every preview to that same
 * self-contained width avoids a layout-mode change for two pages just to
 * chase pixel parity with a third page's real (authenticated) hero.
 *
 * Renders no protected data and needs no client-side interactivity, so this
 * stays a plain server component -- no auth check happens here, callers
 * decide when to render it.
 */
export function FeaturePreviewShell({
  icon: Icon,
  badgeLabel,
  title,
  description,
  theme,
  children,
  cta,
}: FeaturePreviewShellProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div className={cn('relative overflow-hidden rounded-3xl border px-6 py-8 sm:px-8 sm:py-10', theme.border, theme.gradient)}>
        <div
          className={cn('pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full blur-[90px]', theme.glow)}
          aria-hidden="true"
        />
        <span
          className={cn(
            'relative mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
            theme.badgeClasses
          )}
        >
          <Icon className="h-3 w-3" aria-hidden="true" />
          Preview
        </span>
        <div className="relative mb-3 flex items-center gap-3">
          <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm', theme.iconChipClasses)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="text-xs font-medium text-slate-500">{badgeLabel}</p>
          </div>
        </div>
        <p className="relative text-slate-600 leading-relaxed max-w-2xl">{description}</p>
      </div>

      {children}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="mb-4 text-sm font-semibold text-slate-900">Ready to get started?</p>
        {cta}
      </div>
    </div>
  )
}
