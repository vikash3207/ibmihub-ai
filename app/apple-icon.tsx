import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * Apple touch icon (iOS "Add to Home Screen") -- the exact same mark as
 * app/icon.tsx (rounded blue square, white "i", cyan accent dot), just
 * scaled up to Apple's standard 180x180 size. Kept as a second file rather
 * than sharing a function with app/icon.tsx because Next's icon file
 * convention requires each icon size to be its own default-exported route
 * file; the shapes are proportionally identical (5.625x app/icon.tsx's
 * 32x32), so if that file's design changes, mirror the change here too.
 */
export default function AppleIcon() {
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
          borderRadius: 39,
        }}
      >
        <div style={{ position: 'relative', width: 45, height: 124, display: 'flex' }}>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: 45,
              height: 79,
              background: 'white',
              borderRadius: 11,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              width: 45,
              height: 45,
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
