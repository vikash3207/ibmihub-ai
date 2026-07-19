/**
 * "iRPG" badge logo exploration (PR #168 -- iRPGenie iRPG Badge Logo
 * Exploration). Pure inline SVG, no new dependency, no image assets.
 *
 * The Product Owner referenced a competitor's circular icon-with-text
 * badge purely as an example of the general idea "short text can work
 * inside a small icon" -- NOT as a style to copy. None of these designs
 * reuse that (or any other brand's) color, shape, font treatment, or
 * layout: every variant here uses iRPGenie's own existing brand colors
 * (blue #2563eb, cyan #22d3ee, white), never red, and a generic bold
 * sans-serif rather than any specific logotype. Variant 2 (circular) is
 * the one shape in this set that's superficially similar in silhouette to
 * the reference image -- it's included because the Product Owner asked
 * specifically to "test whether it remains readable" as a circle, not
 * because the circle itself is the differentiator; the color, the AI
 * spark accent, and the absence of any borrowed logotype are what keep it
 * an original iRPGenie mark rather than a copy.
 *
 * These are review-only components for the temporary concept page at
 * app/internal/logo-concepts/ -- none of them replace the production mark
 * (components/brand/site-logo-icon.tsx, app/icon.tsx, app/apple-icon.tsx)
 * unless/until the Product Owner picks one.
 */

const BLUE = '#2563eb'
const CYAN = '#22d3ee'
const WHITE = '#ffffff'

interface BadgeIconProps {
  size?: number
  className?: string
}

/** The same 4-point sparkle used by the finalized production icon (components/brand/site-logo-icon.tsx), reused here so every "AI accent" reads consistently across old and new explorations. */
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

/** 1. Blue rounded-square iRPG badge (primary candidate). */
export function IrpgBadgeSquare({ size = 40, className }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="iRPG text badge, rounded square" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <text x="16" y="20.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="10.5" letterSpacing="-0.3" fill={WHITE}>
        iRPG
      </text>
      <Spark cx={25.5} cy={7} r={2.3} fill={CYAN} />
    </svg>
  )
}

/** 2. Blue circular iRPG badge. */
export function IrpgBadgeCircle({ size = 40, className }: BadgeIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="iRPG text badge, circular" className={className}>
      <circle cx="16" cy="16" r="16" fill={BLUE} />
      <text x="16" y="20.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="10" letterSpacing="-0.3" fill={WHITE}>
        iRPG
      </text>
      <Spark cx={23.5} cy={8.5} r={2.1} fill={CYAN} />
    </svg>
  )
}

/** 3. Compact pill iRPG badge -- wider format, more room for the text. */
export function IrpgBadgePill({ size = 40, className }: BadgeIconProps) {
  const height = size
  const width = size * 2.2
  return (
    <svg width={width} height={height} viewBox="0 0 70 32" role="img" aria-label="iRPG text badge, pill shape" className={className}>
      <rect width="70" height="32" rx="16" fill={BLUE} />
      <text x="10" y="21.5" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="15" letterSpacing="-0.2" fill={WHITE}>
        iRPG
      </text>
      <Spark cx={58} cy={16} r={4} fill={CYAN} />
    </svg>
  )
}

/** 4. Hybrid -- the finalized "i" monogram + spark, plus "RPG" text alongside it in the same badge. A bridge between the currently-shipped mark and the new iRPG-text idea. */
export function IrpgBadgeHybrid({ size = 40, className }: BadgeIconProps) {
  const height = size
  const width = size * 2
  return (
    <svg width={width} height={height} viewBox="0 0 64 32" role="img" aria-label="Hybrid i monogram and RPG text badge" className={className}>
      <rect width="64" height="32" rx="7" fill={BLUE} />
      <rect x="13.75" y="14" width="4.5" height="11" rx="2.25" fill={WHITE} />
      <path
        d="M16 3.6 L17.76 6.06 L20.31 7.82 L17.76 9.58 L16 12.04 L14.24 9.58 L11.69 7.82 L14.24 6.06 Z"
        fill={CYAN}
      />
      <text x="26" y="21" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="13" letterSpacing="-0.2" fill={WHITE}>
        RPG
      </text>
    </svg>
  )
}
