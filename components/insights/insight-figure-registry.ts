import type { ComponentType } from 'react'
import { INSIGHT_FIGURE_REGISTRY as MCP_FIGURE_REGISTRY } from './mcp-figures'
import { RPG_SQL_APIS_FIGURE_REGISTRY } from './rpg-sql-apis-figures'
import { DB2_QSYS2_FIGURE_REGISTRY } from './db2-qsys2-figures'

/**
 * The single figure registry app/insights/[slug]/page.tsx actually imports,
 * merging each per-article registry (mcp-figures.tsx, rpg-sql-apis-
 * figures.tsx, db2-qsys2-figures.tsx, and any future article's own figure
 * file) into one map keyed by Insight slug. Each per-article file stays
 * scoped to its own article and never has to import or know about another
 * article's figures -- adding a fourth Insight with diagrams means adding
 * one more spread here, not editing an existing article's figure file.
 */
export const INSIGHT_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  ...MCP_FIGURE_REGISTRY,
  ...RPG_SQL_APIS_FIGURE_REGISTRY,
  ...DB2_QSYS2_FIGURE_REGISTRY,
}
