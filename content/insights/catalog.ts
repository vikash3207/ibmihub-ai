/**
 * IBM i Insights catalog. A plain, repository-committed data file, the same
 * pattern content/deep-dives/catalog.ts already uses -- no database table,
 * no migration.
 *
 * The first published Insight (PR #199): "IBM i MCP Server: The New Bridge
 * Between AI Assistants and IBM i". Originally launched empty (see git
 * history) so the Product Owner could review the /insights section's design
 * on its own before any article was researched, reviewed, and approved --
 * app/insights/page.tsx and lib/insights.ts both still handle a fully empty
 * catalog correctly, that path just isn't exercised by the real data
 * anymore.
 *
 * Only `status: 'published'` entries are ever listed or linkable -- see
 * isInsightAvailable() in lib/insights.ts. This entry's Markdown body lives
 * at content/insights/ibm-i-mcp-server-ai-assistants.md; its original
 * diagrams are components/insights/mcp-figures.tsx, embedded via the
 * `[[FIGURE:name]]` marker convention in lib/insight-render.ts.
 */

import type { Insight } from '@/lib/insights'

export const INSIGHTS: Insight[] = [
  {
    slug: 'ibm-i-mcp-server-ai-assistants',
    title: 'IBM i MCP Server: The New Bridge Between AI Assistants and IBM i',
    description:
      'A practical look at how IBM i MCP Server lets AI assistants call predefined, reviewed tools against Db2 for i and QSYS2 services — what it actually does, how the security model works, and a realistic path to adopting it safely.',
    category: 'ai-emerging-tech',
    tags: ['MCP', 'AI assistants', 'Db2 for i', 'Mapepire', 'Security'],
    publishedAt: '2026-08-12',
    readingTimeMinutes: 12,
    status: 'published',
    featured: true,
    relatedDeepDiveSlugs: ['sql-on-ibm-i'],
  },
]
