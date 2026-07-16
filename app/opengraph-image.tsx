import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_BETA_TAGLINE } from '@/lib/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'IBMiHub AI -- AI-powered IBM i learning platform'

/**
 * Default Open Graph / social-share image, applied site-wide via Next's
 * file convention (any page without its own opengraph-image.tsx inherits
 * this one). Generated with next/og's ImageResponse, like app/icon.tsx --
 * no image asset, no new dependency. Mirrors the same brand mark (rounded
 * blue square, white "i", cyan accent dot) at a larger size, plus the
 * product's actual positioning copy -- no IBM logo/trademark, no
 * "official IBM" claim.
 */
export default function OpengraphImage() {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 18,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: 21, height: 58, display: 'flex' }}>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: 21,
                  height: 37,
                  background: 'white',
                  borderRadius: 5,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 21,
                  height: 21,
                  background: '#22d3ee',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 38, color: '#cbd5e1', marginBottom: 28 }}>
          AI-powered IBM i learning
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#94a3b8', marginBottom: 40 }}>
          Lessons • Practice • AI Tutor • Practice Lab
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#0f172a',
            background: '#22d3ee',
            padding: '8px 24px',
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {SITE_BETA_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  )
}
