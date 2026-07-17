/**
 * Deep Dive Markdown loading (PR #156 -- first published Deep Dive).
 *
 * Deliberately a separate file from lib/deep-dives.ts: that module is
 * explicitly documented as safe to import from client components (e.g.
 * components/deep-dive-browser.tsx), so it must never gain a `server-only`
 * or filesystem dependency. This file is the server-only counterpart, used
 * only by app/deep-dives/[slug]/page.tsx.
 *
 * Mirrors lib/lessons.ts's loadLessonMarkdown() pattern: the file name is
 * derived from the Deep Dive's own `slug` (which, unlike a lesson's
 * content_source_path, always comes from the repository-committed
 * DEEP_DIVES catalog -- there is no database row to distrust here), reduced
 * to a basename, and the resolved path is re-validated to stay inside
 * DEEP_DIVE_CONTENT_DIR before reading. Kept as defense in depth and for
 * consistency with the established lesson-content-loading convention,
 * even though the trust boundary is simpler for Deep Dives.
 */

import 'server-only'

import { readFile } from 'fs/promises'
import { basename, resolve, sep, join } from 'path'
import type { DeepDive } from './deep-dives'

const DEEP_DIVE_CONTENT_DIR = join(process.cwd(), 'content', 'deep-dives')

export async function loadDeepDiveMarkdown(deepDive: DeepDive): Promise<string> {
  const fileName = basename(`${deepDive.slug}.md`)

  // turbopackIgnore: built from a fixed base directory plus a sanitized
  // basename, not inferred from an arbitrary runtime string -- see
  // next.config.mjs outputFileTracingIncludes for the matching bundler hint.
  const absolutePath = /* turbopackIgnore: true */ resolve(DEEP_DIVE_CONTENT_DIR, fileName)

  if (!absolutePath.startsWith(DEEP_DIVE_CONTENT_DIR + sep)) {
    console.error(`Rejected Deep Dive content path outside content/deep-dives: ${deepDive.slug}`)
    throw new Error(`Deep Dive content not available for: ${deepDive.slug}`)
  }

  try {
    return await readFile(absolutePath, 'utf-8')
  } catch (err) {
    console.error(`Failed to read Deep Dive file: ${absolutePath}`, err)
    throw new Error(`Deep Dive content not available for: ${deepDive.slug}`)
  }
}
