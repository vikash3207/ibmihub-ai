import type { MetadataRoute } from 'next'
import { SITE_NAME, SITE_SHORT_NAME, SITE_DEFAULT_DESCRIPTION } from '@/lib/config'

/**
 * Minimal PWA manifest -- enables a correct "Add to Home Screen" icon/name
 * on mobile. Not a commitment to full PWA/offline behavior; just the small,
 * standard metadata file browsers look for. Icon paths point at the
 * existing generated app/icon.tsx ("/icon") and app/apple-icon.tsx
 * ("/apple-icon") routes -- no separate image assets.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#2563eb',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
