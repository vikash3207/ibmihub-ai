/**
 * Per-feature theme for the shared signed-out preview shell (Homepage
 * Hierarchy and Signed-Out Feature Discovery).
 *
 * Full, static Tailwind class strings only -- never string-interpolated --
 * so Tailwind's JIT scanner can see them and generate the corresponding CSS
 * at build time. Same convention as lib/section-theme.ts.
 *
 * Colors reuse the hue each feature already owns elsewhere in the app: AI
 * Tutor is cyan/blue (its real header, app/(authenticated)/ai-tutor/page.tsx),
 * Practice is emerald/teal (PRACTICE_HERO_THEME), and Practice Lab is amber
 * (its 5250 path card, PRACTICE_LAB_5250_THEME) so a signed-out preview reads
 * as "the same feature, not yet unlocked" rather than an unrelated page.
 */

import type { FeaturePreviewTheme } from '@/components/feature-preview/feature-preview-shell'

export const AI_TUTOR_PREVIEW_THEME: FeaturePreviewTheme = {
  border: 'border-cyan-100',
  gradient: 'bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/40',
  glow: 'bg-cyan-300/25',
  badgeClasses: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  iconChipClasses: 'bg-gradient-to-br from-cyan-500 to-blue-500',
}

export const PRACTICE_PREVIEW_THEME: FeaturePreviewTheme = {
  border: 'border-emerald-100',
  gradient: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40',
  glow: 'bg-emerald-300/25',
  badgeClasses: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  iconChipClasses: 'bg-gradient-to-br from-emerald-500 to-teal-500',
}

export const PRACTICE_LAB_PREVIEW_THEME: FeaturePreviewTheme = {
  border: 'border-amber-100',
  gradient: 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40',
  glow: 'bg-amber-300/25',
  badgeClasses: 'border-amber-200 bg-amber-50 text-amber-700',
  iconChipClasses: 'bg-gradient-to-br from-amber-500 to-orange-500',
}
