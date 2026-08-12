import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

export interface SectionHeroTheme {
  /** 'dark' = bg-slate-950 hero (Insights/AI Tutor style); 'light' = gradient-wash hero (Deep Dives/Learn style). */
  variant: 'dark' | 'light'
  /** Full static class strings (Tailwind JIT-safety -- see lib/section-theme.ts). Dark variant only -- the light variant uses `lightWashClasses` instead. */
  glowClasses?: string[]
  gridPattern?: boolean
  badgeClasses: string
  iconChipClasses: string
  lightWashClasses?: string
}

interface SectionHeroProps {
  icon: ComponentType<IconProps>
  badgeLabel: string
  title: string
  tagline?: string
  description: string
  theme: SectionHeroTheme
  /** CTAs or other content below the description. */
  children?: ReactNode
  /** Set false to skip the one-time entrance animation (rarely needed). */
  animateIn?: boolean
}

/**
 * Reusable top-level section hero (Site-wide Navigation and Section Landing
 * Page Visual Upgrade). Generalizes the shell app/insights/page.tsx
 * introduced: dark bg-slate-950 background + blurred glow blobs + optional
 * faint grid + fade-to-white, OR a lighter gradient-wash variant (closer to
 * the original Deep Dives hero) -- with per-section copy and theme passed
 * in as props rather than hardcoded, so this stays a structural/decorative
 * shell, not a page-specific component. All decorative elements are
 * `aria-hidden` and CSS-only (no images, no animation library).
 *
 * Server component: nothing here needs interactivity, so it stays one.
 */
export function SectionHero({ icon: Icon, badgeLabel, title, tagline, description, theme, children, animateIn = true }: SectionHeroProps) {
  const isDark = theme.variant === 'dark'

  return (
    <section
      className={cn(
        'relative overflow-hidden pt-16 sm:pt-20',
        children ? 'pb-16 sm:pb-20' : 'pb-20 sm:pb-24',
        isDark ? 'bg-slate-950' : cn('border-b border-slate-100', theme.lightWashClasses)
      )}
    >
      {isDark && theme.gridPattern && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]"
          aria-hidden="true"
        />
      )}
      {isDark &&
        theme.glowClasses?.map((glowClass, index) => (
          <div key={index} className={cn('pointer-events-none absolute rounded-full blur-[110px]', glowClass)} aria-hidden="true" />
        ))}

      <div
        className={cn(
          'relative mx-auto max-w-3xl px-4 sm:px-6 text-center',
          animateIn && 'section-hero-enter'
        )}
      >
        <span className={cn('mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium', theme.badgeClasses)}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {badgeLabel}
        </span>
        <h1 className={cn('text-4xl sm:text-5xl font-bold tracking-tight mb-4', isDark ? 'text-white' : 'text-slate-900')}>
          {title}
        </h1>
        {tagline && (
          <p className={cn('text-lg font-semibold mb-5', isDark ? 'text-cyan-300' : 'text-blue-700')}>{tagline}</p>
        )}
        <p className={cn('text-base leading-relaxed max-w-xl mx-auto', isDark ? 'text-slate-300' : 'text-slate-600')}>
          {description}
        </p>
        {children && <div className="mt-7">{children}</div>}
      </div>

      {isDark && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 sm:h-56 bg-gradient-to-b from-transparent via-white/70 to-white"
          aria-hidden="true"
        />
      )}
    </section>
  )
}
