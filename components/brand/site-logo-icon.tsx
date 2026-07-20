/**
 * Final iRPGenie logo mark (PR #167 first applied the "i" monogram + spark
 * direction; PR #169 -- Apply Final iRPGenie Logo -- replaces it with the
 * Product Owner's next selection after the follow-up "iRPG" badge
 * exploration in PR #168).
 *
 * Selected: a blue rounded-square badge with white "iRPG" text and a
 * small cyan AI spark. "iRPG" signals RPGLE/IBM i developer learning more
 * directly than the previous single-glyph monogram did, the spark still
 * carries the "AI Tutor / smart guidance" cue, and the rounded-square
 * badge keeps the same silhouette the site has used throughout.
 *
 * Brand colors only: blue #2563eb, cyan #22d3ee, white. Pure inline SVG --
 * no image asset, no new dependency. Used at 28px in
 * components/site-header.tsx, components/auth-card.tsx, and
 * app/not-found.tsx -- all three needed no changes beyond this file, since
 * they already import/render `SiteLogoIcon` by name from PR #167.
 *
 * Favicon/app icon: app/icon.tsx and app/apple-icon.tsx are deliberately
 * NOT changed to match this. PR #168's own review found "iRPG" text
 * degrades into an illegible smudge at real 16px favicon size (four
 * characters don't fit legibly in that footprint at any reasonable
 * weight) -- exactly the case the Product Owner's own decision anticipated
 * ("if 16px readability is poor, use the simplified lowercase i + spark
 * favicon fallback"). app/icon.tsx already renders that simplified "i" +
 * dot fallback independently (via next/og's ImageResponse/Satori, not
 * SVG, so it can't directly reuse this component regardless) and continues
 * to serve as the favicon/app icon unchanged.
 */

const BLUE = '#2563eb'
const CYAN = '#22d3ee'
const WHITE = '#ffffff'

interface SiteLogoIconProps {
  size?: number
  className?: string
}

/** A small 4-point sparkle -- the shared "AI accent" motif, unchanged from the previous monogram mark so the AI-assistance cue reads consistently across both directions. */
function Spark({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const big = r
  const small = r * 0.42
  return (
    <path
      d={`M${cx} ${cy - big} L${cx + small} ${cy - small} L${cx + big} ${cy} L${cx + small} ${cy + small} L${cx} ${cy + big} L${cx - small} ${cy + small} L${cx - big} ${cy} L${cx - small} ${cy - small} Z`}
      fill={CYAN}
    />
  )
}

/** The primary iRPGenie mark: a blue rounded-square badge with white "iRPG" text and a cyan AI spark. Used in the header/nav and everywhere else the old monogram mark appeared. */
export function SiteLogoIcon({ size = 32, className }: SiteLogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        letterSpacing="-0.3"
        fill={WHITE}
      >
        iRPG
      </text>
      <Spark cx={25.5} cy={7} r={2.3} />
    </svg>
  )
}

/**
 * Secondary marketing badge ONLY -- a wider horizontal pill giving "iRPG"
 * more room to read clearly than the compact square above. Per the
 * Product Owner's decision, this must never be used as the header/nav
 * logo or the favicon/app icon; it exists purely as an optional asset for
 * a future social share image, landing page badge, or footer badge.
 * Nothing in the app currently renders this.
 */
export function SiteLogoPill({ size = 32, className }: SiteLogoIconProps) {
  const height = size
  const width = size * 2.2
  return (
    <svg width={width} height={height} viewBox="0 0 70 32" role="img" aria-label="iRPG" className={className}>
      <rect width="70" height="32" rx="16" fill={BLUE} />
      <text x="10" y="21.5" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="15" letterSpacing="-0.2" fill={WHITE}>
        iRPG
      </text>
      <Spark cx={58} cy={16} r={4} />
    </svg>
  )
}
