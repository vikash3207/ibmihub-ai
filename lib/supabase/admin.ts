/**
 * Supabase admin (service-role) client.
 *
 * SECURITY: This module is marked server-only. It must never be imported
 * by client components, browser code, or any file that runs in the browser.
 * The service-role key bypasses Row-Level Security.
 *
 * Use only in:
 *   - Server Actions
 *   - API Route handlers
 *   - Standalone scripts (seed-lessons.ts imports @supabase/supabase-js directly)
 */
import 'server-only'

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
        'The admin client must only be used in server-side contexts.'
    )
  }

  return createClient(url, key, {
    auth: {
      // Disable auto-refresh and persistence -- this client is short-lived per request
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
