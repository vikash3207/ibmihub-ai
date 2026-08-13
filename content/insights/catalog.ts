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
 * anymore. The second (this PR): "Modernizing RPG Applications with SQL
 * and APIs" -- entries are appended in publication order, and the listing
 * page's "featured" treatment is positional (array index 0 after filtering
 * to published), not driven by the `featured` flag, so this entry is
 * deliberately left without one.
 *
 * Only `status: 'published'` entries are ever listed or linkable -- see
 * isInsightAvailable() in lib/insights.ts. Each entry's Markdown body lives
 * at content/insights/<slug>.md; original diagrams for the MCP entry are in
 * components/insights/mcp-figures.tsx and for the RPG/SQL/APIs entry in
 * components/insights/rpg-sql-apis-figures.tsx, both embedded via the
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
  {
    slug: 'modernizing-rpg-applications-with-sql-and-apis',
    title: 'Modernizing RPG Applications with SQL and APIs',
    description:
      'A practical, incremental path to modernizing RPG applications — embedded SQL for cleaner data access, reusable business-logic services, JSON generation and parsing, and REST APIs to expose or consume — without a risky, all-at-once rewrite.',
    category: 'modernization',
    tags: ['RPGLE', 'SQLRPGLE', 'Db2 for i', 'REST APIs', 'Application Modernization'],
    publishedAt: '2026-08-13',
    readingTimeMinutes: 17,
    status: 'published',
    relatedDeepDiveSlugs: ['sql-on-ibm-i', 'embedded-sql-in-rpgle', 'apis-and-external-integration-on-ibm-i'],
    relatedLessonSlugs: ['what-is-sqlrpgle', 'basic-exec-sql-syntax-in-rpgle', 'common-sqlrpgle-mistakes-and-best-practices'],
  },
]
