import type { ComponentType } from 'react'
import {
  Bot,
  User,
  Server,
  Cpu,
  CornerUpLeft,
  FileCode2,
  Database,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ScrollText,
  Network,
  Filter,
  Terminal,
  FlaskConical,
  ClipboardList,
  Rocket,
  Compass,
  Gauge,
  GitBranch,
  Table2,
  HardDrive,
  KeyRound,
  LifeBuoy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightFigure } from './insight-figure'

/**
 * Original diagrams for the first published IBM i Insight (PR #199, "IBM i
 * MCP Server: The New Bridge Between AI Assistants and IBM i"). Every
 * diagram here is hand-built for this article -- no image is copied,
 * hotlinked, or AI-generated, and none of the source material's wording,
 * diagram structure, or captions are reproduced (see the article's own
 * Sources section for what was consulted for factual accuracy).
 *
 * Every diagram is semantic HTML/CSS rather than inline SVG. The
 * architecture figure started as SVG -- it seemed like the case that most
 * needed precise node-to-node arrows -- but at the article column's real
 * width no five-node horizontal chain fit, so it required its own
 * horizontally-scrollable viewport and its default view read as cut off.
 * HTML reflows instead: it fits from 320px up with no scrolling, keeps
 * every label at full size, and makes labels selectable and translatable
 * without a parallel <title>/<desc> transcript. Decorative-only elements
 * are `aria-hidden`; nothing meaningful is baked into an image.
 *
 * `number` on each <InsightFigure> is the reader-facing "Figure N" label
 * and is assigned in the order the figures appear in the article body
 * (see the [[FIGURE:...]] markers in the .md), NOT in the order the
 * components happen to be declared in this file. Renumber both together
 * if a figure ever moves.
 */

// ---------------------------------------------------------------------------
// Figure 2 -- End-to-end architecture (responsive HTML/CSS pipeline)
// ---------------------------------------------------------------------------

/**
 * Two renderings of the same architecture, chosen by breakpoint.
 *
 * The horizontal SVG is the primary one -- a left-to-right chain shows
 * "A talks to B talks to C" far more immediately than a vertical list, and
 * it has room for the request/response arrow pair and the LPAR boundary.
 * An earlier version of it needed its own horizontally-scrollable viewport
 * because its viewBox was far wider than the article column; this one is
 * sized to the column instead (~760 units against a ~700px column, so it
 * renders near 1:1 and never scrolls at md and up).
 *
 * Below md that same drawing would scale to roughly half size and its
 * labels would become unreadable, so small screens get a vertical stack of
 * real HTML cards carrying identical content. Neither is a fallback for
 * missing information -- both name every participant, both mark where SQL
 * is defined and where authority is enforced.
 */
interface ArchStage {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  name: string
  role: string
  detail: string
  chip: string
  ring: string
  note?: string
}

const ARCH_STAGES: ArchStage[] = [
  {
    icon: User,
    name: 'Developer or user',
    role: 'Asks in plain language',
    detail: 'No SQL, no service name, no column list required.',
    chip: 'from-slate-500 to-slate-600',
    ring: 'ring-slate-200',
  },
  {
    icon: Bot,
    name: 'MCP-compatible AI client',
    role: 'Chooses a tool',
    detail: 'Claude, VS Code Copilot, or a custom agent. Speaks only MCP — it has no database driver and no credentials.',
    chip: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-200',
  },
  {
    icon: Server,
    name: 'IBM i MCP Server',
    role: 'Validates and executes',
    detail: 'A Node.js process (@ibm/ibmi-mcp-server) that can run on a laptop, in a container, or as a small service.',
    chip: 'from-indigo-500 to-violet-600',
    ring: 'ring-indigo-200',
    note: 'SQL is defined here — in the YAML tool catalog, not by the model',
  },
  {
    icon: Network,
    name: 'Mapepire',
    role: 'Carries SQL to the database',
    detail: 'A WebSocket SQL gateway running on the partition itself, listening on port 8076 by default.',
    chip: 'from-cyan-500 to-teal-500',
    ring: 'ring-cyan-200',
    note: 'Connects as a real IBM i user profile',
  },
  {
    icon: Database,
    name: 'Db2 for i + QSYS2 services',
    role: 'Answers, under its own rules',
    detail: 'The same object and row-level authority that governs every other connection applies to this one.',
    chip: 'from-emerald-500 to-green-600',
    ring: 'ring-emerald-200',
    note: 'Authority is enforced here — not by the AI client',
  },
]

/** One rounded node in the horizontal SVG. */
function SvgNode({
  x,
  y,
  w,
  h,
  title,
  sub,
  stroke,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string
  stroke: string
}) {
  const cx = x + w / 2
  const cy = y + h / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={13} className={cn('fill-white', stroke)} strokeWidth={2} />
      <text x={cx} y={sub ? cy - 2 : cy + 4} textAnchor="middle" className="fill-slate-900" style={{ fontSize: 16.5, fontWeight: 700 }}>
        {title}
      </text>
      {sub && (
        <text x={cx} y={cy + 17} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 12.5 }}>
          {sub}
        </text>
      )}
    </g>
  )
}

export function McpArchitectureFigure() {
  return (
    <InsightFigure
      number={2}
      title="End-to-end IBM i MCP architecture"
      accent="indigo"
      // Deliberately describes the chain rather than the drawing: this
      // figure renders as a horizontal flow on wider screens and a vertical
      // stack on narrow ones, so a caption that said "follow the solid
      // arrows out and the dashed arrows back" was only true on desktop.
      caption="Each stage can only talk to the one beside it. The AI client never reaches Db2 for i itself — it only ever speaks MCP to the server, which is the only component that knows how to reach Mapepire. SQL lives in the YAML tool catalog, and the last two stages sit inside the partition, which is why the connected profile's authority — not the assistant's confidence — decides what actually comes back. Results return along the same chain in reverse."
    >
      {/* ---- Horizontal flow (md and up) ---- */}
      <div className="insight-figure-enter hidden md:block">
        <svg viewBox="0 0 760 345" role="img" aria-labelledby="arch-title arch-desc" className="w-full">
          <title id="arch-title">End-to-end IBM i MCP architecture</title>
          <desc id="arch-desc">
            A developer or user talks to an MCP-compatible AI client. That client speaks only MCP to the IBM i MCP Server,
            whose allowed SQL is defined by an approved YAML tool catalog. The MCP Server reaches Mapepire, a WebSocket SQL
            gateway on port 8076, which runs inside the IBM i partition alongside Db2 for i and the QSYS2 services. The
            connected user profile&apos;s authority is enforced inside that partition. Structured results return along the same
            chain in reverse.
          </desc>

          <defs>
            <marker id="arch-req" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="fill-indigo-500" />
            </marker>
            <marker id="arch-res" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="fill-slate-400" />
            </marker>
          </defs>

          {/* IBM i partition boundary, drawn first so nodes paint above it */}
          <rect x={492} y={96} width={262} height={205} rx={14} className="fill-indigo-50/60 stroke-indigo-300" strokeWidth={2} strokeDasharray="7 6" />
          <text x={506} y={117} className="fill-indigo-700" style={{ fontSize: 14, fontWeight: 700 }}>
            IBM i (LPAR)
          </text>

          {/* Approved YAML tool catalog, feeding the MCP server */}
          <SvgNode x={310} y={14} w={170} h={58} title="Approved YAML" sub="tool catalog" stroke="stroke-violet-400" />
          <path d="M395,72 L395,150" className="stroke-violet-400" strokeWidth={2} markerEnd="url(#arch-req)" fill="none" />
          {/* Right-aligned to the left of its arrow: left-aligned at x=403
              this ran into the "IBM i (LPAR)" label on the boundary box. */}
          <text x={386} y={112} textAnchor="end" className="fill-violet-600" style={{ fontSize: 13 }}>
            defines allowed SQL
          </text>

          {/* The chain */}
          <SvgNode x={10} y={150} w={110} h={95} title="Developer" sub="or user" stroke="stroke-slate-300" />
          <SvgNode x={145} y={150} w={150} h={95} title="AI client" sub="Claude · VS Code · agent" stroke="stroke-blue-400" />
          <SvgNode x={320} y={150} w={150} h={95} title="IBM i MCP Server" sub="@ibm/ibmi-mcp-server" stroke="stroke-indigo-500" />
          <SvgNode x={510} y={150} w={120} h={95} title="Mapepire" sub="WebSocket · 8076" stroke="stroke-cyan-500" />
          <SvgNode x={650} y={150} w={100} h={95} title="Db2 for i" sub="+ QSYS2" stroke="stroke-emerald-500" />

          {/* Request (solid, outbound) */}
          <path d="M120,180 L145,180" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#arch-req)" fill="none" />
          <path d="M295,180 L320,180" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#arch-req)" fill="none" />
          <path d="M470,180 L510,180" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#arch-req)" fill="none" />
          <path d="M630,180 L650,180" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#arch-req)" fill="none" />

          {/* Response (dashed, inbound) */}
          <path d="M650,222 L630,222" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#arch-res)" fill="none" />
          <path d="M510,222 L470,222" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#arch-res)" fill="none" />
          <path d="M320,222 L295,222" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#arch-res)" fill="none" />
          <path d="M145,222 L120,222" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#arch-res)" fill="none" />

          {/* Authority annotation, pointing into the partition */}
          <text x={506} y={272} className="fill-cyan-700" style={{ fontSize: 13, fontWeight: 600 }}>
            Connected profile&apos;s authority
          </text>
          <text x={506} y={290} className="fill-cyan-700" style={{ fontSize: 13, fontWeight: 600 }}>
            is enforced in here
          </text>

          {/* Legend */}
          <line x1={12} y1={330} x2={44} y2={330} className="stroke-indigo-500" strokeWidth={2.5} />
          <text x={52} y={335} className="fill-slate-600" style={{ fontSize: 13.5 }}>
            request
          </text>
          <line x1={128} y1={330} x2={160} y2={330} className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" />
          <text x={166} y={335} className="fill-slate-600" style={{ fontSize: 13.5 }}>
            response (structured rows)
          </text>
        </svg>
      </div>

      {/* ---- Vertical stack (below md, where the drawing above would be too small to read) ---- */}
      <div className="insight-figure-enter px-1 md:hidden">
        {ARCH_STAGES.map((stage, i) => {
          const insideIbmI = i >= 3
          const isFirstInsideIbmI = i === 3
          const isLastInsideIbmI = i === ARCH_STAGES.length - 1

          return (
            <div key={stage.name}>
              {isFirstInsideIbmI && (
                <div className="mt-1 flex items-center gap-2 rounded-t-xl border border-b-0 border-dashed border-indigo-300 bg-indigo-50/50 px-3 pt-2.5 pb-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                    <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                    Inside the IBM i partition
                  </span>
                </div>
              )}

              <div
                className={cn(
                  insideIbmI && 'border-x border-dashed border-indigo-300 bg-indigo-50/50 px-3',
                  isLastInsideIbmI && 'rounded-b-xl border-b pb-3'
                )}
              >
                <div className={cn('flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm ring-1', stage.ring)}>
                  <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm', stage.chip)}>
                    <stage.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight text-slate-900">{stage.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{stage.role}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{stage.detail}</p>
                    {stage.note && (
                      <p className="mt-1.5 inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
                        {stage.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {i < ARCH_STAGES.length - 1 && (
                <div
                  className={cn('flex justify-center', insideIbmI && 'border-x border-dashed border-indigo-300 bg-indigo-50/50')}
                  aria-hidden="true"
                >
                  <span className="my-0.5 text-lg leading-none text-slate-300">&darr;</span>
                </div>
              )}
            </div>
          )
        })}

        <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 ring-1 ring-slate-200">
          <CornerUpLeft className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            Structured rows return along this same chain in reverse. The assistant summarizes them at the top — that summary
            is the one part of the round trip a language model actually wrote.
          </span>
        </p>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 3 -- One request, step by step (HTML stepper)
// ---------------------------------------------------------------------------

interface LifecycleStep {
  step: number
  title: string
  detail: string
}

interface LifecyclePhase {
  label: string
  accentDot: string
  accentBorder: string
  accentText: string
  steps: LifecycleStep[]
}

const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    label: 'Natural-language interpretation',
    accentDot: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-700',
    steps: [{ step: 1, title: 'User asks a question', detail: '"Which active jobs are currently consuming the most CPU?"' }],
  },
  {
    label: 'Tool selection',
    accentDot: 'bg-indigo-500',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-700',
    steps: [
      { step: 2, title: 'Client inspects available tools', detail: 'The AI client asks the MCP server what tools it exposes.' },
      { step: 3, title: 'Client picks an approved tool', detail: 'It matches the question to a performance-monitoring tool already in the catalog — it cannot invent one.' },
      { step: 4, title: 'Only declared parameters are supplied', detail: 'e.g. a row limit — never a free-form SQL string.' },
    ],
  },
  {
    label: 'Controlled SQL execution',
    accentDot: 'bg-cyan-500',
    accentBorder: 'border-cyan-200',
    accentText: 'text-cyan-700',
    steps: [
      { step: 5, title: 'MCP server runs the predefined SQL', detail: 'The statement was written by a human in advance and sent to Db2 for i through Mapepire.' },
      { step: 6, title: 'IBM i evaluates the connected profile’s authority', detail: 'The same object- and row-level security that governs any other connection applies here too.' },
      { step: 7, title: 'Structured rows come back', detail: 'A typed result set, not free text.' },
    ],
  },
  {
    label: 'Natural-language explanation',
    accentDot: 'bg-violet-500',
    accentBorder: 'border-violet-200',
    accentText: 'text-violet-700',
    steps: [{ step: 8, title: 'The assistant summarizes the result', detail: 'It turns the rows into a readable answer — the summary, not the query, is where the language model’s judgment applies.' }],
  },
]

export function McpRequestLifecycleFigure() {
  return (
    <InsightFigure
      number={3}
      title="One request, step by step"
      accent="cyan"
      caption="Follow one realistic question — 'Which active jobs are currently consuming the most CPU?' — through all eight stages. Interpretation and explanation are the only two places a language model's judgment is involved; everything in between is a fixed lookup, a parameter check, and a predefined SQL statement."
    >
      <ol className="insight-figure-enter space-y-0">
        {LIFECYCLE_PHASES.map((phase, phaseIndex) => (
          <li key={phase.label} className={cn('border-l-2 pl-5 pb-6 pt-1 sm:pl-6', phase.accentBorder, phaseIndex === LIFECYCLE_PHASES.length - 1 && 'pb-1')}>
            <p className={cn('mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide', phase.accentText)}>
              <span className={cn('h-2 w-2 rounded-full', phase.accentDot)} aria-hidden="true" />
              {phase.label}
            </p>
            <ul className="space-y-3">
              {phase.steps.map((s) => (
                <li key={s.step} className="flex gap-3">
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                      phase.accentDot
                    )}
                    aria-hidden="true"
                  >
                    {s.step}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{s.title}</span>
                    <span className="block text-sm leading-relaxed text-slate-600">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 5 -- Why predefined tools are safer (two-path comparison)
// ---------------------------------------------------------------------------

const CONTROLLED_PATH = ['User request', 'Approved MCP tool', 'Constrained parameters', 'Predefined SQL', 'Least-privilege IBM i profile', 'Permitted result']
const RISKIER_PATH = ['User request', 'Unrestricted arbitrary SQL', 'Broad authority', 'Unpredictable query scope']

const SECURITY_LAYERS = [
  { icon: ScrollText, label: 'Approved tool catalog' },
  { icon: Filter, label: 'Parameter constraints' },
  { icon: ShieldCheck, label: 'IBM i user authority' },
  { icon: Lock, label: 'TLS / network protection' },
  { icon: ClipboardList, label: 'Logging and audit' },
  { icon: Network, label: 'Environment separation' },
  { icon: Database, label: 'Data minimization' },
]

export function McpSecurityBoundaryFigure() {
  return (
    <InsightFigure
      number={5}
      title="Why predefined tools are safer"
      accent="emerald"
      caption="Predefined tools are not automatically secure by themselves — tool design, credentials, network configuration, and the IBM i authorities behind the connection still matter. What they remove is the open-ended risk on the right: a model deciding, at runtime, exactly what SQL to run and how broad its reach should be."
    >
      <div className="insight-figure-enter grid gap-5 px-2 sm:grid-cols-2 sm:px-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Controlled default path
          </p>
          <ol className="space-y-2">
            {CONTROLLED_PATH.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span className="text-sm text-slate-700">{label}</span>
                {i < CONTROLLED_PATH.length - 1 && (
                  <span className="ml-auto text-emerald-400" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Higher-risk path (requires explicit governance)
          </p>
          <ol className="space-y-2">
            {RISKIER_PATH.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span className="text-sm text-slate-700">{label}</span>
                {i < RISKIER_PATH.length - 1 && (
                  <span className="ml-auto text-amber-400" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs leading-relaxed text-amber-700">
            Not a recommended starting configuration — shown here as the thing least-privilege, predefined tools are protecting against.
          </p>
        </div>
      </div>

      <div className="mt-5 px-2 sm:px-2">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Security layers behind the controlled path</p>
        <ul className="flex flex-wrap gap-2">
          {SECURITY_LAYERS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
              <Icon className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 4 -- Anatomy of a YAML-defined tool (annotated code)
// ---------------------------------------------------------------------------

/**
 * Original iRPGenie example, composed for this article. Deliberately NOT
 * modelled on the sample in the official repository's README: different
 * source label, different environment-variable names (the `${...}` syntax
 * expands whatever names you define, so these are ours), a different tool
 * doing a different job, and parameters bound in genuinely bindable
 * positions. The *field names* (sources/host/user/port/tools/statement/
 * toolsets) are the schema the software requires -- those are the only
 * part that necessarily matches, the same way any API's parameter names
 * do. Verify the current shape against the official repository before
 * using this as a template.
 */
// Lines are kept under ~40 characters on purpose: the annotated layout
// puts this block in a roughly 340px column on desktop, and anything
// longer made the code block itself scroll sideways. The explanations
// that would normally be trailing `#` comments live in the numbered
// annotation cards beside it instead, so nothing is lost.
const YAML_EXAMPLE = `# Illustrative only -- every value is
# a placeholder, not a real system.

sources:
  lab-partition:
    host: \${IBMI_LAB_HOST}
    user: \${IBMI_RO_USER}
    password: \${IBMI_RO_PASS}
    port: 8076

tools:
  busiest_jobs:
    source: lab-partition
    description: >
      Active jobs in one subsystem
      above a CPU threshold.
    parameters:
      - name: subsystem
        type: string
        description: "e.g. 'QINTER'"
        required: true
        maxLength: 10
      - name: min_cpu_ms
        type: integer
        description: "Minimum CPU time"
        required: false
        default: 0
    statement: |
      SELECT JOB_NAME, JOB_STATUS,
             CPU_TIME
      FROM TABLE(QSYS2.ACTIVE_JOB_INFO(
        SUBSYSTEM_LIST_FILTER =>
          :subsystem))
      WHERE CPU_TIME > :min_cpu_ms
      ORDER BY CPU_TIME DESC

toolsets:
  read-only-ops:
    tools:
      - busiest_jobs`

interface YamlAnnotation {
  match: string
  label: string
  note: string
}

// Order matters: annotateYaml() walks the source with a moving cursor, so
// these must be listed in the order their `match` text first appears.
const YAML_ANNOTATIONS: YamlAnnotation[] = [
  { match: 'sources:', label: 'Connection reference', note: 'Where and how to reach one IBM i system. A file can define several, so one tool catalog can span a dev box and a test box.' },
  { match: '${IBMI_LAB_HOST}', label: 'Environment-variable reference', note: 'The real host, profile, and password live outside this file — in the deployment environment, not in version control. The names here are yours to choose.' },
  { match: 'busiest_jobs:', label: 'Tool name', note: 'The identifier an AI client sees and calls. Read it like a function name: specific enough that picking the wrong one is obvious.' },
  { match: 'description: >', label: 'Human-readable description', note: 'Sent straight to the language model, and the main signal it uses to decide when this tool fits the question. Vague wording here is what causes the wrong tool to be chosen.' },
  { match: 'parameters:', label: 'Accepted parameters', note: 'Every input is named, typed, and constrained. Note what is absent: there is no parameter a caller could use to supply SQL of their own.' },
  { match: 'statement: |', label: 'Predefined SQL statement', note: 'Written once by a human, reviewed like any other code. The :named parameters are bound by the engine, never pasted together as text — so a hostile value stays a value.' },
  { match: 'toolsets:', label: 'Toolset grouping', note: 'Related tools load together, so a team can expose one curated group to one audience instead of everything to everyone.' },
]

/**
 * Splits the YAML source around each annotation's `match` substring, in the
 * order the annotations are listed (assumed to also be each match's first
 * appearance in the source -- true for this hand-written example). Lets the
 * code block and the annotation cards share one numbered reference instead
 * of being two disconnected lists next to each other.
 */
function annotateYaml(code: string, annotations: YamlAnnotation[]) {
  const segments: { text: string; index?: number }[] = []
  let cursor = 0

  annotations.forEach((a, i) => {
    const idx = code.indexOf(a.match, cursor)
    if (idx === -1) return
    if (idx > cursor) segments.push({ text: code.slice(cursor, idx) })
    segments.push({ text: code.slice(idx, idx + a.match.length), index: i })
    cursor = idx + a.match.length
  })
  segments.push({ text: code.slice(cursor) })

  return segments
}

export function McpYamlToolFigure() {
  const segments = annotateYaml(YAML_EXAMPLE, YAML_ANNOTATIONS)

  return (
    <InsightFigure
      number={4}
      title="Anatomy of a YAML-defined tool"
      accent="violet"
      caption="An original, harmless, read-only example — not copied from any external source. Every value shown is a placeholder; verify the exact YAML shape against the current official IBM i MCP Server repository before using it, since field names and options do evolve."
    >
      {/* px-0 on mobile and a slightly tighter code font give the block the
          ~30px it needed to stop scrolling at 375px. It still scrolls at
          320px -- YAML's meaningful indentation can't fit that width at a
          readable size, and a horizontally-scrollable code block is the
          existing site-wide convention (see .prose pre in globals.css). */}
      {/* Side-by-side only from xl, not lg. Between 1024 and 1279 the TOC
          sidebar takes 240px off the article column, leaving the code side
          of a two-column split ~307px -- 4px too narrow for this block, so
          it scrolled. Stacking until xl gives the code the full column
          there and keeps the split for widths that can actually hold it. */}
      <div className="insight-figure-enter grid gap-5 px-0 sm:px-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <pre className="insight-figure-scroll overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100 sm:p-4 sm:text-[13px]">
          <code>
            {segments.map((seg, i) =>
              seg.index !== undefined ? (
                <mark key={i} className="rounded bg-violet-500/30 px-0.5 text-violet-50 ring-1 ring-violet-400/40">
                  {seg.text}
                  <sup className="ml-0.5 text-[9px] font-bold text-violet-300">{seg.index + 1}</sup>
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </code>
        </pre>

        <ul className="space-y-3">
          {YAML_ANNOTATIONS.map((a, i) => (
            <li key={a.label} className="flex gap-2.5 rounded-lg border border-violet-100 bg-violet-50/50 p-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-violet-800">
                  <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {a.label}
                </p>
                <p className="text-xs leading-relaxed text-slate-600">{a.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Use-case grid (not one of the numbered required/optional diagrams --
// PR #199's separate "present practical examples as polished use-case
// cards" requirement). Deliberately not wrapped in <InsightFigure>/its
// "Figure N" numbering, since it's a content grid rather than a diagram.
// ---------------------------------------------------------------------------

interface UseCase {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  question: string
  source: string
  benefit: string
  consideration: string
  accent: string
}

const USE_CASES: UseCase[] = [
  {
    icon: Gauge,
    question: 'Which active jobs are consuming the most CPU right now?',
    source: 'QSYS2 performance/job services',
    benefit: 'Skips the "which service, which columns" recall step during a live investigation.',
    consideration: 'Read-only and low-sensitivity — a reasonable first tool to enable.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: GitBranch,
    question: 'What depends on this service program before I change it?',
    source: 'QSYS2 object/dependency services',
    benefit: 'Faster impact analysis before a risky change.',
    consideration: 'Object metadata only — still worth scoping to libraries a developer should see.',
    accent: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Table2,
    question: 'What tables and columns exist in this schema?',
    source: 'Db2 for i catalog views',
    benefit: 'Faster onboarding for anyone unfamiliar with an existing schema.',
    consideration: 'Schema structure, not row data — a good early, low-risk tool.',
    accent: 'from-cyan-500 to-emerald-500',
  },
  {
    icon: HardDrive,
    question: 'Which libraries or IFS directories are using the most storage?',
    source: 'QSYS2 storage/IFS services',
    benefit: 'Faster capacity conversations without a manual DSPFD sweep.',
    consideration: 'Can reveal directory/library naming that hints at sensitive projects — scope accordingly.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: KeyRound,
    question: 'Which user profiles have this special authority?',
    source: 'QSYS2 security/audit services',
    benefit: 'Faster periodic access reviews.',
    consideration: 'Genuinely sensitive — keep in a separate, tightly scoped, logged toolset.',
    accent: 'from-rose-500 to-orange-500',
  },
  {
    icon: LifeBuoy,
    question: 'Give me a quick health summary for the support queue.',
    source: 'A combination of the tools above',
    benefit: 'A support team gets a first-pass answer before escalating.',
    consideration: 'A summary is a starting point for a human, not an incident report on its own.',
    accent: 'from-violet-500 to-indigo-500',
  },
]

export function McpUseCaseGrid() {
  return (
    <div className="insight-figure-enter my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {USE_CASES.map((useCase) => (
        <div key={useCase.question} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <span className={cn('mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white', useCase.accent)}>
            <useCase.icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <p className="mb-2 text-sm font-semibold leading-snug text-slate-900">&ldquo;{useCase.question}&rdquo;</p>
          <dl className="mt-auto space-y-1.5 text-xs leading-relaxed text-slate-600">
            <div>
              <dt className="inline font-semibold text-slate-500">Source: </dt>
              <dd className="inline">{useCase.source}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-slate-500">Benefit: </dt>
              <dd className="inline">{useCase.benefit}</dd>
            </div>
            <div>
              <dt className="inline font-semibold text-slate-500">Consider: </dt>
              <dd className="inline">{useCase.consideration}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Figure 6 -- Practical adoption path (4 stages)
// ---------------------------------------------------------------------------

interface AdoptionStage {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  points: string[]
}

const ADOPTION_STAGES: AdoptionStage[] = [
  {
    icon: FlaskConical,
    title: 'Explore safely',
    points: ['Development or test environment', 'Read-only profile', 'System-information tools only'],
  },
  {
    icon: ClipboardList,
    title: 'Curate',
    points: ['Team-approved tools', 'Parameter restrictions', 'Known-result validation', 'Logging turned on'],
  },
  {
    icon: Rocket,
    title: 'Operationalize',
    points: ['Documented tool ownership', 'TLS and credential management', 'Monitoring in place', 'Toolsets separated by role'],
  },
  {
    icon: Compass,
    title: 'Expand carefully',
    points: ['Selected support workflows', 'Controlled automation', 'Periodic authority and tool review'],
  },
]

export function McpAdoptionPathFigure() {
  return (
    <InsightFigure
      number={6}
      title="A practical adoption path"
      accent="blue"
      caption="Production write operations are not the starting point. Each stage builds on the trust and logging established in the one before it — a team can stay comfortably at Stage 1 or 2 indefinitely if that is all a given system needs."
    >
      <div className="insight-figure-enter grid gap-4 px-2 sm:grid-cols-2 sm:px-2 lg:grid-cols-4">
        {ADOPTION_STAGES.map((stage, i) => (
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
                <li key={point} className="text-xs leading-relaxed text-slate-600">
                  {point}
                </li>
              ))}
            </ul>
            {/* The connector sits just inside the card's right edge rather
                than hanging off it (-right-3): an absolutely-positioned
                element outside the bounds made the grid horizontally
                scrollable at desktop widths. The "Stage N" labels already
                carry the sequence, so this is pure reinforcement. */}
            {i < ADOPTION_STAGES.length - 1 && (
              <span className="pointer-events-none absolute right-1 top-1/2 hidden -translate-y-1/2 text-blue-300 lg:block" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 1 -- Traditional vs. MCP-assisted workflow (opens the article)
// ---------------------------------------------------------------------------

const TRADITIONAL_STEPS = ['Open ACS or a 5250 session', 'Remember the right QSYS2 service', 'Compose the SQL by hand', 'Inspect the returned rows', 'Interpret the result']
const MCP_STEPS = ['Ask a focused question', 'An approved tool is selected', 'Predefined SQL executes', 'The result is summarized', 'A technical user validates before acting']

export function McpWorkflowComparisonFigure() {
  return (
    <InsightFigure
      number={1}
      title="Traditional workflow vs. MCP-assisted workflow"
      accent="amber"
      caption="MCP shortens the distance between a question and an answer — it does not remove the last step. A technical user still validates the result before it drives any real decision, the same way they would double-check a query they wrote by hand."
    >
      <div className="insight-figure-enter grid gap-5 px-2 sm:grid-cols-2 sm:px-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Terminal className="h-4 w-4" aria-hidden="true" />
            Traditional
          </p>
          <ol className="space-y-2 text-sm text-slate-700">
            {TRADITIONAL_STEPS.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="font-semibold text-slate-500">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4 sm:p-5">
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800">
            <Bot className="h-4 w-4" aria-hidden="true" />
            MCP-assisted
          </p>
          <ol className="space-y-2 text-sm text-slate-700">
            {MCP_STEPS.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="font-semibold text-cyan-500">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Registry -- keyed by Insight slug, then figure marker name (see
// lib/insight-render.ts and app/insights/[slug]/page.tsx). Nested by slug so
// a future Insight's figure names can never collide with this one's.
// ---------------------------------------------------------------------------

export const INSIGHT_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  'ibm-i-mcp-server-ai-assistants': {
    architecture: McpArchitectureFigure,
    'request-lifecycle': McpRequestLifecycleFigure,
    'yaml-tool': McpYamlToolFigure,
    'use-cases': McpUseCaseGrid,
    'security-boundary': McpSecurityBoundaryFigure,
    'adoption-path': McpAdoptionPathFigure,
    'workflow-comparison': McpWorkflowComparisonFigure,
  },
}
