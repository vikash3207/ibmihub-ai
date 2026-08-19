import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/config'
import { INSIGHTS } from '@/content/insights/catalog'
import { isInsightAvailable } from '@/lib/insights'
import { INSIGHT_CATEGORIES, getInsightAccent, type InsightAccent } from '@/lib/insight-categories'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'IBM i Insights | iRPGenie'

/** Tailwind's -700 hex per InsightAccent, matching INSIGHT_ACCENT_CLASSES.headerBadgeBg's shade (lib/insight-categories.ts) so the generated image echoes the same category color the article page itself uses. Duplicated here (not imported) because ImageResponse/Satori renders inline styles only -- it can't resolve Tailwind class names. */
const ACCENT_HEX: Record<InsightAccent, string> = {
  sky: '#0369a1',
  blue: '#1d4ed8',
  cyan: '#0e7490',
  orange: '#c2410c',
  rose: '#be123c',
  emerald: '#047857',
}

function findPublishedInsight(slug: string) {
  const insight = INSIGHTS.find((i) => i.slug === slug)
  return insight && isInsightAvailable(insight) ? insight : undefined
}

/** Keeps a long title within the fixed 1200x630 canvas -- same safety margin
 * approach as other fixed-size card generators; real titles in the catalog
 * are well under this, so this only guards a future outlier. */
function truncateTitle(title: string, maxLength = 90): string {
  return title.length > maxLength ? `${title.slice(0, maxLength - 1).trimEnd()}…` : title
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
 */
export default async function InsightOpengraphImage({ params }: Props) {
  const { slug } = await params
  const insight = findPublishedInsight(slug)
  const accentHex = insight ? ACCENT_HEX[getInsightAccent(insight.category)] : ACCENT_HEX.sky
  const categoryLabel = insight
    ? (INSIGHT_CATEGORIES.find((c) => c.id === insight.category)?.label ?? null)
    : null
  const title = insight ? truncateTitle(insight.title) : 'IBM i Insights'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0f172a',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '76px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: 10, height: 26, display: 'flex' }}>
              <div
                style={{ position: 'absolute', bottom: 0, width: 10, height: 16, background: 'white', borderRadius: 3 }}
              />
              <div
                style={{ position: 'absolute', top: 0, width: 10, height: 10, background: '#22d3ee', borderRadius: '50%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, color: '#93c5fd' }}>{SITE_NAME}</div>
          <div style={{ display: 'flex', fontSize: 22, color: '#64748b' }}>IBM i Insights</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categoryLabel && (
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                fontWeight: 600,
                color: 'white',
                background: accentHex,
                padding: '8px 22px',
                borderRadius: 999,
                marginBottom: 28,
                alignSelf: 'flex-start',
              }}
            >
              {categoryLabel}
            </div>
          )}
          <div style={{ display: 'flex', fontSize: 58, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
