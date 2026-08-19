import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'IBM i Insights | iRPGenie -- practical ideas, modern techniques, and emerging trends'

/**
 * Open Graph / social-share image for the /insights listing page. Placed in
 * this segment (not relying on the root app/opengraph-image.tsx) because
 * app/insights/page.tsx sets its own `openGraph` metadata object -- Next
 * resolves file-convention images per segment, and a segment's own explicit
 * `openGraph` config doesn't reach up to an ancestor segment's image file,
 * only its own (confirmed by comparing rendered <meta property="og:image">
 * output for "/", which has no page-level openGraph override and inherits
 * the root image, against "/insights" and "/insights/[slug]", which each
 * set their own openGraph object and rendered no og:image at all before this
 * file existed). Same next/og approach as the root image -- no new
 * dependency, no image asset.
 */
export default function InsightsOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '80px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: 11, height: 30, display: 'flex' }}>
              <div
                style={{ position: 'absolute', bottom: 0, width: 11, height: 19, background: 'white', borderRadius: 3 }}
              />
              <div
                style={{ position: 'absolute', top: 0, width: 11, height: 11, background: '#22d3ee', borderRadius: '50%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: '#93c5fd' }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 700 }}>
          IBM i{' '}
          <span style={{ display: 'flex', marginLeft: 20, color: '#67e8f9' }}>Insights</span>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#cbd5e1', marginTop: 30, maxWidth: 820 }}>
          Practical ideas, modern techniques, and emerging trends for IBM i.
        </div>
      </div>
    ),
    { ...size }
  )
}
