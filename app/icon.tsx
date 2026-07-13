import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

/**
 * Generated favicon -- rounded blue square echoing the SiteHeader/AuthCard
 * brand mark, with a white "i" (IBM i) and a cyan dot for the AI accent.
 * Uses next/og's ImageResponse (bundled with Next.js) so no image asset or
 * new dependency is needed.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2563eb',
          borderRadius: 7,
        }}
      >
        <div style={{ position: 'relative', width: 8, height: 22, display: 'flex' }}>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: 8,
              height: 14,
              background: 'white',
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              width: 8,
              height: 8,
              background: '#22d3ee',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
