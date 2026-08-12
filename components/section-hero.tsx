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
  /**
   * If this exact substring appears in `title`, it renders as a restrained
   * blue/cyan/indigo gradient accent instead of plain white -- see
   * .hero-title-accent in app/globals.css. Optional and deliberately used
   * sparingly (one word or short phrase per heading, never the paragraph).
   */
  accentWord?: string
  /** CTAs or other content below the description. */
  children?: ReactNode
  /** Set false to skip the one-time entrance animation (rarely needed). */
  animateIn?: boolean
}

/**
 * Reusable top-level section hero (Site-wide Navigation and Section Landing
 * Page Visual Upgrade; Premium Section Layout Alignment; Hero Contrast Fix).
 * Generalizes the shell app/insights/page.tsx introduced: dark bg-slate-950
 * background + blurred glow blobs + optional faint grid + fade-to-white, OR
 * a lighter gradient-wash variant -- with per-section copy and theme passed
 * in as props rather than hardcoded, so this stays a structural/decorative
 * shell, not a page-specific component. Always renders edge-to-edge
 * (full-bleed); every page using this component sits inside a layout that no
 * longer imposes its own max-width/padding, so the hero itself defines the
 * page's outer width -- see app/learn/layout.tsx and
 * app/(authenticated)/layout.tsx. All decorative elements are `aria-hidden`
 * and CSS-only (no images, no animation library).
 *
 * Contrast fix: the dark variant's bottom fade-to-white used to be a fixed
 * `h-48 sm:h-56` band anchored to the section's bottom edge, while the
 * section's own bottom padding was only `pb-20 sm:pb-24`. On pages with
 * short hero copy (Learning Center, Dashboard, Contact -- one-line
 * descriptions), the section was barely taller than
 * pt + content + pb, so the fade's lighter portion crept upward into the
 * still-white/slate-300 description text, killing contrast right where
 * visitors are reading. Three independent fixes, so no single content
 * length or zoom level can reintroduce the defect:
 *  1. `min-h-*` on the dark variant guarantees the section is always tall
 *     enough that short copy can't sit near the bottom edge.
 *  2. The fade itself is shorter and its lightening is deferred to the last
 *     half of that shorter band (`transparent` until the midpoint, not from
 *     the top), so less of it is visually white at all.
 *  3. A soft, same-hue (slate-950) radial glow sits behind the copy
 *     specifically -- not a hard-edged rectangle, just extra density in the
 *     area text actually occupies -- as a content-length-agnostic safety
 *     net (covers arbitrarily long wrapped text at narrow widths/200% zoom
 *     that the fixed min-height alone might not anticipate).
 *
 * Server component: nothing here needs interactivity, so it stays one.
 */
export function SectionHero({
  icon: Icon,
  badgeLabel,
  title,
  tagline,
  description,
  theme,
  accentWord,
  children,
  animateIn = true,
}: SectionHeroProps) {
  const isDark = theme.variant === 'dark'

  const accentIndex = accentWord ? title.indexOf(accentWord) : -1
  const titleNode =
    accentWord && accentIndex !== -1 ? (
      <>
        {title.slice(0, accentIndex)}
        <span className="hero-title-accent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          {accentWord}
        </span>
        {title.slice(accentIndex + accentWord.length)}
      </>
    ) : (
      title
    )

  return (
    <section
      className={cn(
        'relative overflow-hidden pt-16 sm:pt-20',
        children ? 'pb-16 sm:pb-20' : 'pb-20 sm:pb-24',
        isDark && 'min-h-[26rem] sm:min-h-[30rem]',
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

      {/* Soft, same-hue scrim behind the copy -- see the contrast-fix note
          above. An ellipse with a smooth falloff, not a hard rectangle, and
          the same slate-950 hue as the base background so it reads as
          "denser dark" rather than a distinct shape. */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_70%_65%_at_50%_38%,rgba(2,6,23,0.55)_0%,rgba(2,6,23,0.22)_55%,transparent_78%)]"
          aria-hidden="true"
        />
      )}

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
          {titleNode}
        </h1>
        {tagline && (
          <p className={cn('text-lg font-semibold mb-5', isDark ? 'text-cyan-300' : 'text-blue-700')}>{tagline}</p>
        )}
        <p className={cn('text-base leading-relaxed max-w-xl mx-auto', isDark ? 'text-slate-300' : 'text-slate-600')}>
          {description}
        </p>
        {children && <div className="mt-7">{children}</div>}
      </div>

      {/* Fade-to-white: shorter than before, and transparent for its own
          first half, so lightening is confined close to the literal bottom
          edge instead of reaching up toward the copy. */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 [background:linear-gradient(to_bottom,transparent_0%,transparent_45%,white_100%)]"
          aria-hidden="true"
        />
      )}
    </section>
  )
}
