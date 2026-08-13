import type { ComponentType } from 'react'
import { Server, Smartphone, Monitor, Users2, Database, Globe, ArrowDown, FileJson, SendHorizontal, ListChecks, CheckCircle2, Compass, Layers, Plug, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightFigure } from './insight-figure'

/**
 * Original diagrams for the second published IBM i Insight ("Modernizing
 * RPG Applications with SQL and APIs"). The source article this Insight is
 * based on used three Mermaid diagrams (a layered-architecture flowchart, a
 * request/response sequence diagram, and a 5-phase roadmap flowchart) --
 * this codebase's Markdown pipeline (lib/markdown.ts's renderLessonMarkdown)
 * never enables a Mermaid renderer or `allowDangerousHtml`, so a fenced
 * ```mermaid block would only ever show up as inert, unstyled source text.
 * Same pattern as components/insights/mcp-figures.tsx: each diagram is
 * rebuilt as a real, responsive, accessible HTML/CSS component and embedded
 * via a `[[FIGURE:name]]` marker (see lib/insight-render.ts), not as an
 * image and not as a raw Mermaid block.
 *
 * All three are plain HTML/CSS, not SVG -- there is no fixed-width drawing
 * here that would need its own horizontally-scrollable viewport at narrow
 * widths (a lesson already learned once in mcp-figures.tsx's architecture
 * figure).
 */

// ---------------------------------------------------------------------------
// Figure 1 -- Layered architecture (opens the article)
// ---------------------------------------------------------------------------

const CONSUMERS = [
  { icon: Monitor, label: '5250' },
  { icon: Globe, label: 'Web' },
  { icon: Smartphone, label: 'Mobile' },
  { icon: Users2, label: 'Partners' },
]

function ChainDown() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <ArrowDown className="h-4 w-4 text-blue-300" />
    </div>
  )
}

export function LayeredArchitectureFigure() {
  return (
    <InsightFigure
      number={1}
      title="Separating the application into layers"
      accent="blue"
      caption="The 5250 application and a REST API both become consumers of the same RPG business services -- the interface at the top changes; the trusted rules in the middle do not have to be rewritten."
    >
      <div className="insight-figure-enter mx-auto max-w-2xl px-2 sm:px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Consumers</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CONSUMERS.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                <c.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <ChainDown />

        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-center shadow-sm">
          <p className="text-sm font-semibold text-blue-800">API or application interface</p>
        </div>

        <ChainDown />

        <div className="rounded-xl border-2 border-indigo-300 bg-indigo-50/70 p-3 text-center shadow-sm">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-900">
            <Server className="h-4 w-4" aria-hidden="true" />
            RPG business services
          </p>
          <p className="mt-0.5 text-xs text-indigo-700">The trusted rules -- pricing, validation, calculations</p>
        </div>

        <ChainDown />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-3 text-center shadow-sm">
              <p className="text-xs font-semibold text-cyan-800">SQL data-access layer</p>
            </div>
            <ChainDown />
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-center shadow-sm">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                Db2 for i
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3 text-center shadow-sm">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-800">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                External APIs
              </p>
              <p className="mt-0.5 text-[11px] text-violet-600">Payment, shipping, CRM, tax, and other services</p>
            </div>
          </div>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 2 -- One integration request, step by step
// ---------------------------------------------------------------------------

interface SequencePhase {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  accentDot: string
  accentBorder: string
  accentText: string
  title: string
  detail: string
}

const SEQUENCE_PHASES: SequencePhase[] = [
  {
    icon: FileJson,
    accentDot: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-700',
    title: 'RPG builds the request',
    detail: 'Db2 for i’s JSON_OBJECT assembles the outbound document from RPG host variables -- no manual string concatenation.',
  },
  {
    icon: SendHorizontal,
    accentDot: 'bg-cyan-500',
    accentBorder: 'border-cyan-200',
    accentText: 'text-cyan-700',
    title: 'RPG calls the external API',
    detail: 'QSYS2.HTTP_POST_VERBOSE sends the HTTPS request and waits for a response.',
  },
  {
    icon: ListChecks,
    accentDot: 'bg-indigo-500',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-700',
    title: 'The external API responds',
    detail: 'Status, headers, and a JSON body come back together -- the verbose form captures all three, not just the payload.',
  },
  {
    icon: CheckCircle2,
    accentDot: 'bg-emerald-500',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
    title: 'RPG parses and validates the outcome',
    detail: 'JSON_TABLE extracts the fields the business logic needs, then the application checks the result -- a 200 status is not the same thing as business success.',
  },
]

/**
 * The icon and the text used to be positioned with `-translate-x` on the
 * icon plus a compensating negative margin on the text, both hand-tuned to
 * land the icon centered on the LI's own `border-l-2` line. That dual-offset
 * arithmetic broke down for a taller card (Step 4's longer detail text) and
 * let the icon visually cover the STEP label. Fixed by making the icon and
 * text plain flex siblings instead: the icon is `shrink-0` (fixed size,
 * never compressed), the text column is `min-w-0 flex-1` (takes the rest of
 * the row and wraps normally), and the connecting colored line now belongs
 * to the text column's own left border rather than the row's -- there is no
 * offset math left to get wrong at any content length or viewport width.
 */
export function IntegrationSequenceFigure() {
  return (
    <InsightFigure
      number={2}
      title="One integration request, step by step"
      accent="cyan"
      caption="A remote call is not a single event -- it is a request that Db2 for i's SQL helps build, an HTTPS call that can fail or time out, and a response the application still has to validate before trusting it."
    >
      <ol className="insight-figure-enter space-y-6 px-1">
        {SEQUENCE_PHASES.map((phase, i) => (
          <li key={phase.title} className="flex gap-3">
            <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm', phase.accentDot)} aria-hidden="true">
              <phase.icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className={cn('min-w-0 flex-1 border-l-2 pl-4 sm:pl-5', phase.accentBorder)}>
              <span className={cn('block text-xs font-semibold uppercase tracking-wide', phase.accentText)}>Step {i + 1}</span>
              <span className="block text-sm font-semibold text-slate-900">{phase.title}</span>
              <span className="block break-words text-sm leading-relaxed text-slate-600">{phase.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 3 -- A safe incremental roadmap (5 stages)
// ---------------------------------------------------------------------------

interface RoadmapStage {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  points: string[]
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    icon: Compass,
    title: 'Discover',
    points: ['Pick a capability with clear value', 'Trace programs, files, and authority', 'Capture current behavior as test cases', 'Measure the baseline'],
  },
  {
    icon: Layers,
    title: 'Separate',
    points: ['Extract rules from display/job-control logic', 'Small procedures, explicit inputs/outputs', 'Place reusable logic in service programs', 'Redirect the existing interface to it'],
  },
  {
    icon: Database,
    title: 'Simplify with SQL',
    points: ['Replace loops with set-based SQL', 'Create views for a stable data model', 'Use parameter markers, not concatenation', 'Review access plans and indexes'],
  },
  {
    icon: Plug,
    title: 'Add the API boundary',
    points: ['Define the contract before deployment', 'Map JSON to typed business parameters', 'Add auth, validation, timeouts, logging', 'Use correlation IDs across layers'],
  },
  {
    icon: Rocket,
    title: 'Operate and expand',
    points: ['Run old and new paths in parallel', 'Compare results before moving traffic', 'Monitor performance, failures, usage', 'Apply the pattern to the next capability'],
  },
]

export function ModernizationRoadmapFigure() {
  return (
    <InsightFigure
      number={3}
      title="A safe incremental roadmap"
      accent="blue"
      caption="Production write operations are deliberately not the starting point. Each stage builds on the trust and logging established in the one before it -- a team can stay comfortably at an early stage indefinitely if that is all a given system needs."
    >
      <div className="insight-figure-enter grid gap-4 px-2 sm:grid-cols-2 sm:px-2 xl:grid-cols-5">
        {ROADMAP_STAGES.map((stage, i) => (
          <div key={stage.title} className="relative rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <stage.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Stage {i + 1}</span>
            </div>
            <h4 className="mb-2 text-sm font-bold text-slate-900">{stage.title}</h4>
            <ul className="space-y-1">
              {stage.points.map((point) => (
                <li key={point} className="break-words text-xs leading-relaxed text-slate-600">
                  {point}
                </li>
              ))}
            </ul>
            {i < ROADMAP_STAGES.length - 1 && (
              <span className="pointer-events-none absolute right-1 top-1/2 hidden -translate-y-1/2 text-blue-300 xl:block" aria-hidden="true">
                &rarr;
              </span>
            )}
          </div>
        ))}
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Registry -- keyed by Insight slug, then figure marker name, same shape as
// mcp-figures.tsx's INSIGHT_FIGURE_REGISTRY. Deliberately named differently
// (not also `INSIGHT_FIGURE_REGISTRY`) and kept in its own module scoped to
// this one article -- components/insights/insight-figure-registry.ts merges
// this with mcp-figures.tsx's registry into the single map
// app/insights/[slug]/page.tsx actually imports, so neither per-article file
// needs to know the other exists.
// ---------------------------------------------------------------------------

export const RPG_SQL_APIS_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  'modernizing-rpg-applications-with-sql-and-apis': {
    'layered-architecture': LayeredArchitectureFigure,
    'integration-sequence': IntegrationSequenceFigure,
    'modernization-roadmap': ModernizationRoadmapFigure,
  },
}
