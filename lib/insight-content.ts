import 'server-only'
import { readFile } from 'fs/promises'
import { basename, resolve, sep, join } from 'path'
import type { Insight } from './insights'

const INSIGHT_CONTENT_DIR = join(process.cwd(), 'content', 'insights')

/**
 * Loads an Insight's Markdown body from disk. Mirrors
 * lib/deep-dive-content.ts's loadDeepDiveMarkdown exactly, including the
 * same path-traversal guard: the file name is always derived from the
 * catalog's own `slug` (never from unchecked request input), basename()'d,
 * resolved, and checked to still live inside INSIGHT_CONTENT_DIR before
 * being read.
 */
export async function loadInsightMarkdown(insight: Insight): Promise<string> {
  const fileName = basename(`${insight.slug}.md`)
  const absolutePath = /* turbopackIgnore: true */ resolve(INSIGHT_CONTENT_DIR, fileName)
  if (!absolutePath.startsWith(INSIGHT_CONTENT_DIR + sep)) {
    throw new Error(`Insight content not available for: ${insight.slug}`)
  }
  try {
    return await readFile(absolutePath, 'utf-8')
  } catch {
    throw new Error(`Insight content not available for: ${insight.slug}`)
  }
}
