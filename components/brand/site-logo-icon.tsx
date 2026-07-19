/**
 * Final iRPGenie logo mark (PR #167 -- Apply Final iRPGenie Logo).
 *
 * The Product Owner selected this direction after reviewing six concepts
 * (PR #165) and four refined variants of the winning one (PR #166): a
 * lowercase "i" monogram (for IBM i) with a cyan 4-point "spark" standing
 * in for the dot, reading as "IBM i learning with AI assistance." Both
 * exploration files (components/brand/logo-concepts.tsx and
 * app/internal/logo-concepts/page.tsx) are removed in this PR now that the
 * decision is final -- this file is where that winning design now lives
 * permanently, decoupled from the (now-deleted) exploration set.
 *
 * Brand colors only, matching the rest of the site: blue #2563eb,
 * cyan #22d3ee, white. Pure inline SVG -- no image asset, no new
 * dependency. Scales cleanly at any size via the `size` prop; used at
 * 28px in components/site-header.tsx.
 *
 * app/icon.tsx and app/apple-icon.tsx (the actual favicon/app-icon files)
 * are deliberately NOT changed to match this exactly -- they already
 * render the same "i" stem + cyan accent dot using a plain circle instead
 * of the 4-point spark, which is the same favicon-safe simplification
 * PR #166 designed on purpose (a spark's concave points are the kind of
 * fine detail that risks blurring at real 16px favicon raster size, while
 * a plain filled circle stays crisp). Both files are drawn with
 * next/og's ImageResponse (CSS-in-JS/Satori), not SVG, so they can't
 * directly reuse this component anyway -- see those files' own comments.
 */

const BLUE = '#2563eb'
const CYAN = '#22d3ee'
const WHITE = '#ffffff'

interface SiteLogoIconProps {
  size?: number
  className?: string
}

/** The primary iRPGenie mark: lowercase "i" monogram + cyan AI spark. Used in the header/nav; safe at any size down to favicon scale. */
export function SiteLogoIcon({ size = 32, className }: SiteLogoIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="7" fill={BLUE} />
      <rect x="13.75" y="14" width="4.5" height="11" rx="2.25" fill={WHITE} />
      <path
        d="M16 3.6 L17.76 6.06 L20.31 7.82 L17.76 9.58 L16 12.04 L14.24 9.58 L11.69 7.82 L14.24 6.06 Z"
        fill={CYAN}
      />
    </svg>
  )
}

/**
 * Secondary marketing badge ONLY -- the same monogram acting as the "i" in
 * a wider "iRPG" lockup. Per the Product Owner's decision, this must never
 * be used as the header/nav logo or the favicon/app icon; it exists purely
 * as an optional asset for a future social share image, landing page
 * badge, or footer badge, kept here (rather than deleted) in case it's
 * useful later. Nothing in the app currently renders this.
 */
export function SiteLogoBadge({ size = 32, className }: SiteLogoIconProps) {
  const height = size
  const width = size * 3
  return (
    <svg width={width} height={height} viewBox="0 0 96 32" role="img" aria-label="iRPG" className={className}>
      <rect width="96" height="32" rx="7" fill={BLUE} />
      <rect x="13.75" y="14" width="4.5" height="11" rx="2.25" fill={WHITE} />
      <path
        d="M16 3.6 L17.76 6.06 L20.31 7.82 L17.76 9.58 L16 12.04 L14.24 9.58 L11.69 7.82 L14.24 6.06 Z"
        fill={CYAN}
      />
      <text x="26" y="23" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="17" letterSpacing="0.5" fill={WHITE}>
        RPG
      </text>
    </svg>
  )
}
