import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'iRPGenie -- IBM i Insights: practical ideas for modern IBM i professionals'

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
 *
 * Redesigned (LinkedIn OG Image legibility pass): the original version used
 * a flat #0f172a background with modestly-sized text, which read as
 * low-contrast and turned soft/blurry once LinkedIn's feed/inspector scales
 * a 1200x630 PNG down to a few hundred px wide. This version leans into a
 * navy-to-blue gradient (still dark enough for white text at full contrast,
 * but visibly "brand blue" rather than flat slate) and roughly doubles the
 * branding/headline font sizes so the two things that matter most --
 * "iRPGenie" and "IBM i Insights" -- stay legible at thumbnail size. The
 * long descriptive sentence the old version had is gone; a short topic tag
 * line plus one short supporting line replace it, per the redesign brief.
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
          background: 'linear-gradient(135deg, #050a17 0%, #0b1a3a 40%, #163a8f 78%, #0369a1 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '64px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Soft brand-color glow in the upper-right, purely decorative --
            gives the background visible depth instead of reading flat,
            without touching the contrast behind any text. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '-140px',
            right: '-120px',
            width: '620px',
            height: '620px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(34,211,238,0.30) 0%, rgba(34,211,238,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, position: 'relative' }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 22,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(147,197,253,0.25)',
            }}
          >
            <div style={{ position: 'relative', width: 23, height: 62, display: 'flex' }}>
              <div
                style={{ position: 'absolute', bottom: 0, width: 23, height: 40, background: 'white', borderRadius: 6 }}
              />
              <div
                style={{ position: 'absolute', top: 0, width: 23, height: 23, background: '#22d3ee', borderRadius: '50%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, color: '#dbeafe' }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: 'flex', fontSize: 118, fontWeight: 800, lineHeight: 1.05, position: 'relative' }}>
          IBM i{' '}
          <span style={{ display: 'flex', marginLeft: 24, color: '#5eead4' }}>Insights</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 36,
            fontWeight: 600,
            color: '#e0f2fe',
            marginTop: 34,
            letterSpacing: 0.5,
            position: 'relative',
          }}
        >
          RPGLE • Db2 for i • APIs • AI • Modernization
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 500,
            color: '#93c5fd',
            marginTop: 22,
            position: 'relative',
          }}
        >
          Practical ideas for modern IBM i professionals
        </div>
      </div>
    ),
    { ...size }
  )
}
