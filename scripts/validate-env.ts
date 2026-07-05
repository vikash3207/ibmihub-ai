/**
 * Validates that required environment variables are present.
 * Does NOT print secret values.
 *
 * Usage:
 *   npm run validate:env
 *
 * Source: .env.local (loaded via dotenv)
 */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'ANTHROPIC_API_KEY',
] as const

console.log('Checking required environment variables...')

let allPresent = true

for (const key of REQUIRED_VARS) {
  const value = process.env[key]
  if (!value || value.trim() === '') {
    console.error(`  MISSING  ${key}`)
    allPresent = false
  } else {
    console.log(`  OK  ${key}`)
  }
}

if (!allPresent) {
  console.error('\nOne or more required environment variables are missing.')
  console.error('Copy .env.local.example to .env.local and fill in the values.')
  process.exit(1)
}

console.log('\nAll required environment variables are set.')
