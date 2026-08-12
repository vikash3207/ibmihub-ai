/**
 * Per-section hero/card theme configuration (Site-wide Navigation and
 * Section Landing Page Visual Upgrade). Full, static Tailwind class
 * strings only -- never string-interpolated (e.g. `bg-${color}-600/20`) --
 * so Tailwind's JIT scanner can see them and generate the corresponding CSS
 * at build time. tailwind.config.ts's content array must include a glob
 * covering this file's directory (./lib) or these classes silently never
 * get generated -- see tailwind.config.ts and
 * scripts/tailwind-content-regression.ts. Same pattern as
 * lib/deep-dive-categories.ts's DEEP_DIVE_ACCENT_CLASSES and
 * app/insights/page.tsx's POSITIONING_POINTS.
 *
 * Each section gets its own glow/accent combination so pages stay
 * recognizably distinct from each other (and from IBM i Insights, which
 * owns its own inline theme and is intentionally not wired through this
 * file) rather than looking like reskins of one template.
 */

import type { SectionHeroTheme } from '@/components/section-hero'
import type { SectionFeatureCardTheme } from '@/components/section-feature-card'

/** Deep Dives: deep slate/indigo hero, violet accent -- professional reference-guide identity. */
export const DEEP_DIVES_HERO_THEME: SectionHeroTheme = {
  variant: 'dark',
  gridPattern: true,
  glowClasses: [
    '-top-24 left-1/4 h-[26rem] w-[26rem] -translate-x-1/2 bg-indigo-600/20',
    'top-0 right-0 h-[22rem] w-[22rem] bg-violet-600/15',
    'bottom-0 left-1/3 h-72 w-72 bg-blue-600/10',
  ],
  badgeClasses: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300',
  iconChipClasses: 'bg-gradient-to-br from-indigo-500 to-violet-500',
}

export const DEEP_DIVES_PILLAR_THEMES: SectionFeatureCardTheme[] = [
  {
    cardWash: 'from-indigo-50 via-white to-white',
    border: 'border-indigo-100',
    hoverBorder: 'hover:border-indigo-300',
    accent: 'from-indigo-500 to-blue-500',
  },
  {
    cardWash: 'from-violet-50 via-white to-white',
    border: 'border-violet-100',
    hoverBorder: 'hover:border-violet-300',
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    cardWash: 'from-blue-50 via-white to-indigo-50/40',
    border: 'border-blue-100',
    hoverBorder: 'hover:border-blue-300',
    accent: 'from-blue-500 to-indigo-500',
  },
]

/**
 * Learning Center and Practice heroes (app/learn/page.tsx,
 * app/(authenticated)/practice/page.tsx) can't use <SectionHero> directly --
 * both sit inside a shared padded layout (app/learn/layout.tsx,
 * app/(authenticated)/layout.tsx) that also wraps pages this PR must not
 * redesign (the lesson reader, Onboarding), so their hero is a contained
 * rounded card rather than SectionHero's edge-to-edge shell. This bundle is
 * that card's background/badge/glow recipe -- rich and dark like the other
 * sections' heroes, just contained instead of full-bleed. A dot-grid
 * texture (vs. Deep Dives/Practice Lab's line grid) keeps these two visually
 * distinct from the other dark heroes despite sharing the same formula.
 */
export interface ContainedHeroTheme {
  /** Gradient background + border for the outer card. */
  cardClasses: string
  /** Two blurred glow-blob color classes (position/size are shared, only color varies). */
  glowClasses: [string, string]
  badgeClasses: string
  headingTextClasses: string
  bodyTextClasses: string
}

/** Learning Center: rich blue-to-indigo gradient -- guided-learning identity, distinct from Deep Dives' neutral-dark reference-guide look. */
export const LEARN_HERO_THEME: ContainedHeroTheme = {
  cardClasses: 'border-blue-900/40 bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-950',
  glowClasses: ['bg-cyan-400/20', 'bg-indigo-400/25'],
  badgeClasses: 'border-white/20 bg-white/10 text-blue-50',
  headingTextClasses: 'text-white',
  bodyTextClasses: 'text-blue-100/90',
}

/** Practice: rich emerald-to-teal gradient -- interactive practice identity, distinct from Practice Lab's neutral-dark terminal look. */
export const PRACTICE_HERO_THEME: ContainedHeroTheme = {
  cardClasses: 'border-emerald-900/40 bg-gradient-to-br from-emerald-600 via-teal-700 to-teal-950',
  glowClasses: ['bg-cyan-300/20', 'bg-emerald-400/25'],
  badgeClasses: 'border-white/20 bg-white/10 text-emerald-50',
  headingTextClasses: 'text-white',
  bodyTextClasses: 'text-emerald-100/90',
}

/** Practice Lab: controlled dark terminal-inspired hero -- distinct from Practice's calmer light theme. */
export const PRACTICE_LAB_HERO_THEME: SectionHeroTheme = {
  variant: 'dark',
  gridPattern: true,
  glowClasses: [
    '-top-24 left-1/4 h-[26rem] w-[26rem] -translate-x-1/2 bg-emerald-600/15',
    'top-0 right-0 h-[22rem] w-[22rem] bg-teal-500/15',
    'bottom-0 left-1/3 h-72 w-72 bg-slate-500/10',
  ],
  badgeClasses: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  iconChipClasses: 'bg-gradient-to-br from-emerald-500 to-teal-500',
}

/** 5250 path card (Practice Lab) -- amber, distinct from the SQL path's blue/cyan. */
export const PRACTICE_LAB_5250_THEME: SectionFeatureCardTheme = {
  cardWash: 'from-amber-50 via-white to-white',
  border: 'border-amber-100',
  hoverBorder: 'hover:border-amber-300',
  accent: 'from-amber-500 to-orange-500',
}

/** SQL console path card (Practice Lab) -- blue/cyan, distinct from the 5250 path's amber. */
export const PRACTICE_LAB_SQL_THEME: SectionFeatureCardTheme = {
  cardWash: 'from-blue-50 via-white to-cyan-50/40',
  border: 'border-blue-100',
  hoverBorder: 'hover:border-blue-300',
  accent: 'from-blue-500 to-cyan-500',
}

/** Contact: slate/blue/cyan dark hero -- same <SectionHero> "dark" formula as Deep Dives/Practice Lab (Contact is standalone, so it can use the full-bleed shell directly), professional-support identity via its blue/cyan glow pairing over the shared slate-950 base. */
export const CONTACT_HERO_THEME: SectionHeroTheme = {
  variant: 'dark',
  gridPattern: true,
  glowClasses: [
    '-top-24 left-1/4 h-[26rem] w-[26rem] -translate-x-1/2 bg-blue-600/20',
    'top-0 right-0 h-[22rem] w-[22rem] bg-slate-500/15',
    'bottom-0 left-1/3 h-72 w-72 bg-cyan-500/10',
  ],
  badgeClasses: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
  iconChipClasses: 'bg-gradient-to-br from-slate-600 to-blue-600',
}
