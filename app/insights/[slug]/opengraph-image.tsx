import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/config'
import { INSIGHTS } from '@/content/insights/catalog'
import { isInsightAvailable } from '@/lib/insights'
import { INSIGHT_CATEGORIES, getInsightAccent, type InsightAccent } from '@/lib/insight-categories'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'iRPGenie -- IBM i Insights'

/** Tailwind's -400 hex per InsightAccent -- brighter than the -700 shade the
 * article page itself uses for its category pill (lib/insight-categories.ts
 * INSIGHT_ACCENT_CLASSES.headerBadgeBg), because this pill sits on the same
 * dark navy background as the rest of the card rather than on white, so a
 * lighter, higher-contrast tint reads clearly instead of near-blending into
 * the background. Duplicated here (not imported) because ImageResponse/
 * Satori renders inline styles only -- it can't resolve Tailwind class
 * names. */
const ACCENT_HEX: Record<InsightAccent, string> = {
  sky: '#38bdf8',
  blue: '#60a5fa',
  cyan: '#22d3ee',
  orange: '#fb923c',
  rose: '#fb7185',
  emerald: '#34d399',
}

function findPublishedInsight(slug: string) {
  const insight = INSIGHTS.find((i) => i.slug === slug)
  return insight && isInsightAvailable(insight) ? insight : undefined
}

/** Keeps a title within the fixed 1200x630 canvas at the smallest font size
 * this file uses -- real titles in the catalog are well under this, so this
 * only guards a future outlier. */
function truncateTitle(title: string, maxLength = 140): string {
  return title.length > maxLength ? `${title.slice(0, maxLength - 1).trimEnd()}…` : title
}

/** The title is the dominant element (redesign brief), so it gets most of
 * the available font-size budget; length-based steps keep a short title
 * genuinely large while still fitting a long one on three lines. */
function titleFontSize(title: string): number {
  if (title.length <= 45) return 92
  if (title.length <= 65) return 76
  if (title.length <= 90) return 64
  return 54
}

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Per-article Open Graph / social-share image (LinkedIn/X preview). Reads
 * the same INSIGHTS catalog the page itself does, so a draft or unknown slug
 * (which 404s the page) never gets a misleading article-specific image --
 * it falls back to generic IBM i Insights branding instead of throwing.
 * Same rationale as the sibling ../opengraph-image.tsx for why this lives in
 * this segment rather than relying on an ancestor's file.
 *
 * Redesigned (LinkedIn OG Image legibility pass): same navy/blue gradient
 * background as ../opengraph-image.tsx for a consistent brand look across
 * both image types. The old version gave near-equal visual weight to a
 * three-part header ("iRPGenie" + "IBM i Insights" + the title) -- at
 * LinkedIn's scaled-down preview size the smallest of those pieces turned
 * unreadable. This version drops the redundant "IBM i Insights" label
 * (implied by the branding + category pill), shrinks the branding row to a
 * clearly secondary role, and makes the article title the dominant element
 * on the card, sized by titleFontSize() above.
 */
export default async function InsightOpengraphImage({ params }: Props) {
  const { slug } = await params
  const insight = findPublishedInsight(slug)
  const accentHex = insight ? ACCENT_HEX[getInsightAccent(insight.category)] : ACCENT_HEX.sky
  const categoryLabel = insight
    ? (INSIGHT_CATEGORIES.find((c) => c.id === insight.category)?.label ?? null)
    : null
  const title = insight ? truncateTitle(insight.title) : 'IBM i Insights'
  const fontSize = titleFontSize(title)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050a17 0%, #0b1a3a 40%, #163a8f 78%, #0369a1 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '72px',
          position: 'relative',
        }}
      >
        {/* Same decorative glow as ../opengraph-image.tsx, kept for a
            consistent brand look between the two card types. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '-160px',
            right: '-140px',
            width: '600px',
            height: '600px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'absolute', top: 56, left: 72 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 13,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: 13, height: 35, display: 'flex' }}>
              <div
                style={{ position: 'absolute', bottom: 0, width: 13, height: 23, background: 'white', borderRadius: 4 }}
              />
              <div
                style={{ position: 'absolute', top: 0, width: 13, height: 13, background: '#22d3ee', borderRadius: '50%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#dbeafe' }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', marginTop: 40 }}>
          {categoryLabel && (
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                fontWeight: 700,
                color: accentHex,
                marginBottom: 26,
                alignSelf: 'flex-start',
              }}
            >
              {categoryLabel.toUpperCase()}
            </div>
          )}
          <div style={{ display: 'flex', fontSize, fontWeight: 800, lineHeight: 1.15, maxWidth: 1040 }}>
            {title}
          </div>
        </div>

        {/* Thin category-accent bar along the bottom edge -- a quiet visual
            signal that ties this card's color to the article page's own
            category accent, without adding more text to read. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 14,
            background: accentHex,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
