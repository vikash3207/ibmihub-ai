/**
 * Logo/icon concept explorations (PR #165 -- iRPGenie Logo Concept
 * Exploration; PR #166 -- Refine Selected iRPGenie Logo Direction). Pure
 * inline SVG, no new dependency, no image assets -- every shape is drawn
 * with basic primitives (rect/path/circle/text) so it stays crisp at any
 * size, including favicon scale.
 *
 * Brand colors only, matching app/icon.tsx and components/site-header.tsx:
 *   BLUE  #2563eb (blue-600) -- primary badge background
 *   CYAN  #22d3ee (cyan-400) -- AI/spark accent
 *   WHITE #ffffff              -- glyph fill on the blue background
 *
 * These are review-only components for the temporary concept page at
 * app/internal/logo-concepts/ -- none of them replace the production
 * mark (app/icon.tsx, app/apple-icon.tsx, components/site-header.tsx)
 * unless/until the Product Owner picks one.
 *
 * PR #166 adds four LogoRefined* components: the Product Owner selected
 * Concept 2 (the "i" monogram) from the original six, and asked for it
 * refined into a primary icon, a version with a subtle technical cue, a
 * larger "iRPG" lockup for marketing/badge use, and an ultra-simplified
 * favicon-only version. These are additive -- LogoConceptMonogram (the
 * original Concept 2) is left in place, unmodified, for a clean before/
 * after comparison on the review page.
 */

const BLUE = '#2563eb'
const CYAN = '#22d3ee'
const WHITE = '#ffffff'

interface LogoIconProps {
  size?: number
  className?: string
}

/** A small 4-point sparkle -- the shared "AI accent" motif reused (at different sizes) across several concepts below, so the AI-assistance cue reads consistently no matter which base concept it's paired with. */
function Spark({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const big = r
  const small = r * 0.42
  return (
    <path
      d={`M${cx} ${cy - big} L${cx + small} ${cy - small} L${cx + big} ${cy} L${cx + small} ${cy + small} L${cx} ${cy + big} L${cx - small} ${cy + small} L${cx - big} ${cy} L${cx - small} ${cy - small} Z`}
      fill={fill}
    />
  )
}

/** 1. Terminal / 5250 screen + AI spark (the recommended direction). */
export function LogoConceptTerminal({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Terminal and AI spark logo concept" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <path d="M9 11 L15 16 L9 21" stroke={WHITE} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="16" y1="21" x2="21.5" y2="21" stroke={WHITE} strokeWidth="2.75" strokeLinecap="round" />
      <Spark cx={24.5} cy={8.5} r={3.4} fill={CYAN} />
    </svg>
  )
}

/** 2. Lowercase "i" monogram + AI spark. */
export function LogoConceptMonogram({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="i monogram and AI spark logo concept" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <rect x="14" y="14" width="4" height="11" rx="2" fill={WHITE} />
      <Spark cx={16} cy={8} r={4} fill={CYAN} />
    </svg>
  )
}

/** 3. Command prompt + chat bubble. */
export function LogoConceptChatPrompt({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Command prompt and chat bubble logo concept" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <path d="M7 12 L12.5 16 L7 20" stroke={WHITE} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="17" y="8" width="11" height="8.5" rx="3" fill={CYAN} />
      <path d="M19.5 16.5 L18 20 L22.5 16.5 Z" fill={CYAN} />
    </svg>
  )
}

/** 4. Code brackets + subtle spark. */
export function LogoConceptCodeBrackets({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Code brackets and spark logo concept" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <path d="M13.5 9 L8.5 16 L13.5 23" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M18.5 9 L23.5 16 L18.5 23" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Spark cx={25.5} cy={7.5} r={2.6} fill={CYAN} />
    </svg>
  )
}

/** 5. Chip/card + terminal line. */
export function LogoConceptChip({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Chip card and terminal line logo concept" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <rect x="7" y="9" width="18" height="14" rx="2.5" fill={WHITE} />
      <rect x="4" y="13" width="3" height="2.4" fill={WHITE} />
      <rect x="4" y="17" width="3" height="2.4" fill={WHITE} />
      <rect x="25" y="13" width="3" height="2.4" fill={WHITE} />
      <rect x="25" y="17" width="3" height="2.4" fill={WHITE} />
      <line x1="10" y1="16" x2="18" y2="16" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="20.5" cy="16" r="1.7" fill={CYAN} />
    </svg>
  )
}

/** 6. Two-tone learning badge (blue + cyan split). */
export function LogoConceptTwoTone({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Two-tone learning badge logo concept" className={className}>
      <defs>
        <clipPath id="two-tone-badge-clip">
          <rect width="32" height="32" rx="7" />
        </clipPath>
      </defs>
      <g clipPath="url(#two-tone-badge-clip)">
        <rect x="0" y="0" width="16" height="32" fill={BLUE} />
        <rect x="16" y="0" width="16" height="32" fill={CYAN} />
      </g>
      <path d="M5 12 L10 16 L5 20" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Spark cx={22.5} cy={16} r={4.2} fill={WHITE} />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// PR #166 -- refined variants of the selected direction (Concept 2: the "i"
// monogram). See the doc comment at the top of this file for context.
// ---------------------------------------------------------------------------

/** Refined A. Primary recommended icon -- the likely final nav/favicon mark. */
export function LogoRefinedPrimary({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Refined i monogram with AI spark, primary icon" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <rect x="13.75" y="14" width="4.5" height="11" rx="2.25" fill={WHITE} />
      <Spark cx={16} cy={7.8} r={4.2} fill={CYAN} />
    </svg>
  )
}

/**
 * Refined B. Stronger IBM i variant -- the same monogram plus a small,
 * deliberately subdued terminal-cursor underscore at the base of the stem.
 * Kept at reduced opacity so it reads as a secondary technical cue, not a
 * second competing shape next to the spark.
 */
export function LogoRefinedTechnical({ size = 40, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Refined i monogram with AI spark and terminal cursor accent" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <rect x="13.75" y="14" width="4.5" height="11" rx="2.25" fill={WHITE} />
      <Spark cx={16} cy={7.8} r={4.2} fill={CYAN} />
      <line x1="12" y1="27" x2="20" y2="27" stroke={WHITE} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

/**
 * Refined C. Large-size "iRPG" badge/lockup -- the monogram acting as the
 * "i", followed by "RPG" in a matching bold weight. Explicitly a
 * larger-size/secondary asset (social image, landing badge, footer badge,
 * marketing graphic) -- the wide aspect ratio and text detail are not
 * intended to survive a 16px favicon crop, and this component is never
 * used for app/icon.tsx or the nav mark.
 */
export function LogoRefinedBadge({ size = 40, className }: LogoIconProps) {
  const height = size
  const width = size * 3
  return (
    <svg width={width} height={height} viewBox="0 0 96 32" role="img" aria-label="iRPG badge lockup, large-size marketing variant" className={className}>
      <rect width="96" height="32" rx="7" fill={BLUE} />
      <rect x="13.75" y="14" width="4.5" height="11" rx="2.25" fill={WHITE} />
      <Spark cx={16} cy={7.8} r={4.2} fill={CYAN} />
      <text x="26" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="17" letterSpacing="0.5" fill={WHITE}>
        RPG
      </text>
    </svg>
  )
}

/**
 * Refined D. Favicon-safe simplified variant -- the same concept reduced to
 * the fewest possible shapes (a thicker stem, a plain filled dot instead of
 * a 4-point spark) specifically for 16px/32px rendering, where the spark's
 * points in the other variants can soften into a blur.
 */
export function LogoRefinedFavicon({ size = 32, className }: LogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Simplified i monogram favicon variant" className={className}>
      <rect width="32" height="32" rx="6" fill={BLUE} />
      <rect x="13.5" y="14.5" width="5" height="10.5" rx="2.5" fill={WHITE} />
      <circle cx="16" cy="8" r="4" fill={CYAN} />
    </svg>
  )
}
