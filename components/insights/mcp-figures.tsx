import type { ComponentType } from 'react'
import {
  Bot,
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
 * Figure 1 (architecture) uses inline SVG because it genuinely needs
 * precise node-to-node connections. Figures 2-6 are semantic HTML/CSS --
 * simpler to keep accessible and to reflow cleanly on narrow screens than
 * hand-positioned SVG text would be, per the spec's own preference order.
 * Decorative-only elements are `aria-hidden`; every figure that carries
 * real meaning has real text content, never text-baked-into-an-image.
 */

// ---------------------------------------------------------------------------
// Figure 1 -- End-to-end architecture (SVG)
// ---------------------------------------------------------------------------

function SvgNode({
  x,
  y,
  w,
  h,
  lines,
  sub,
  strokeClass,
}: {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  sub?: string
  strokeClass: string
}) {
  const centerX = x + w / 2
  const centerY = y + h / 2
  const lineHeight = 17
  const totalLines = lines.length + (sub ? 1 : 0)
  const startY = centerY - ((totalLines - 1) * lineHeight) / 2 + 5

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} className={cn('fill-white', strokeClass)} strokeWidth={2} />
      {lines.map((line, i) => (
        <text key={i} x={centerX} y={startY + i * lineHeight} textAnchor="middle" className="fill-slate-900" style={{ fontSize: 13.5, fontWeight: 600 }}>
          {line}
        </text>
      ))}
      {sub && (
        <text x={centerX} y={startY + lines.length * lineHeight} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11 }}>
          {sub}
        </text>
      )}
    </g>
  )
}

export function McpArchitectureFigure() {
  return (
    <InsightFigure
      number={1}
      title="End-to-end IBM i MCP architecture"
      accent="indigo"
      scrollable
      caption="The AI client never talks to Db2 for i directly. It only ever talks to the MCP server over the MCP protocol; the MCP server is the one component that knows how to reach Mapepire, and Mapepire is the one component that knows how to reach Db2 for i and QSYS2 services. SQL lives entirely in the YAML tool catalog; the connected IBM i user profile's authority is what Mapepire and Db2 for i enforce on every call, no matter which tool asked."
    >
      <svg viewBox="0 0 1000 430" role="img" aria-labelledby="fig1-title fig1-desc" className="insight-figure-enter min-w-[820px]">
        <title id="fig1-title">End-to-end IBM i MCP architecture diagram</title>
        <desc id="fig1-desc">
          A user talks to an MCP-compatible AI client, which talks to the IBM i MCP Server over the MCP protocol. The MCP
          server checks an approved YAML tool catalog, then sends predefined SQL to Mapepire, which runs inside the IBM i
          LPAR alongside Db2 for i and QSYS2 services. Db2 for i returns structured results back through the same path to
          the AI client, which explains the result to the user. No component skips a step in this chain.
        </desc>
        <defs>
          <marker id="fig1-arrow-req" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-indigo-500" />
          </marker>
          <marker id="fig1-arrow-res" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-slate-400" />
          </marker>
        </defs>

        {/* IBM i LPAR boundary */}
        <rect x={645} y={35} width={335} height={355} rx={16} className="fill-indigo-50/40 stroke-indigo-300" strokeWidth={2} strokeDasharray="7 6" />
        <text x={665} y={62} className="fill-indigo-700" style={{ fontSize: 12.5, fontWeight: 700 }}>
          IBM i (LPAR)
        </text>

        {/* Nodes */}
        <SvgNode x={15} y={175} w={130} h={90} lines={['Developer', 'or user']} strokeClass="stroke-slate-300" />
        <SvgNode x={185} y={155} w={190} h={130} lines={['MCP-compatible', 'AI client']} sub="Claude · VS Code · custom agent" strokeClass="stroke-blue-400" />
        <SvgNode x={415} y={155} w={195} h={130} lines={['IBM i MCP Server']} sub="@ibm/ibmi-mcp-server" strokeClass="stroke-indigo-500" />
        <SvgNode x={430} y={20} w={165} h={78} lines={['Approved YAML', 'tool catalog']} strokeClass="stroke-violet-400" />
        <SvgNode x={670} y={175} w={150} h={110} lines={['Mapepire']} sub="WebSocket · port 8076" strokeClass="stroke-cyan-500" />
        <SvgNode x={840} y={175} w={125} h={110} lines={['Db2 for i']} sub="+ QSYS2 services" strokeClass="stroke-emerald-500" />

        {/* YAML catalog -> MCP server (defines SQL) */}
        <path d="M512,98 L512,155" className="stroke-violet-400" strokeWidth={2} markerEnd="url(#fig1-arrow-req)" fill="none" />
        <text x={522} y={130} className="fill-violet-600" style={{ fontSize: 11 }}>
          defines allowed SQL
        </text>

        {/* Request row (solid, pointing right) */}
        <path d="M145,195 L185,195" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#fig1-arrow-req)" fill="none" />
        <path d="M375,195 L415,195" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#fig1-arrow-req)" fill="none" />
        <path d="M610,195 L670,195" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#fig1-arrow-req)" fill="none" />
        <path d="M820,195 L840,195" className="stroke-indigo-500" strokeWidth={2.5} markerEnd="url(#fig1-arrow-req)" fill="none" />

        {/* Response row (dashed, pointing left) */}
        <path d="M840,245 L820,245" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#fig1-arrow-res)" fill="none" />
        <path d="M670,245 L610,245" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#fig1-arrow-res)" fill="none" />
        <path d="M415,245 L375,245" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#fig1-arrow-res)" fill="none" />
        <path d="M185,245 L145,245" className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#fig1-arrow-res)" fill="none" />

        {/* Authority-enforced annotation */}
        <path d="M700,150 L700,175" className="stroke-cyan-600" strokeWidth={1.5} markerEnd="url(#fig1-arrow-req)" fill="none" />
        <text x={655} y={130} className="fill-cyan-700" style={{ fontSize: 11.5, fontWeight: 600 }}>
          Connected profile&apos;s
        </text>
        <text x={655} y={144} className="fill-cyan-700" style={{ fontSize: 11.5, fontWeight: 600 }}>
          authority enforced here →
        </text>

        {/* Legend */}
        <line x1={20} y1={400} x2={55} y2={400} className="stroke-indigo-500" strokeWidth={2.5} />
        <text x={62} y={404} className="fill-slate-600" style={{ fontSize: 11.5 }}>
          request
        </text>
        <line x1={140} y1={400} x2={175} y2={400} className="stroke-slate-400" strokeWidth={2} strokeDasharray="5 4" />
        <text x={182} y={404} className="fill-slate-600" style={{ fontSize: 11.5 }}>
          response
        </text>
      </svg>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 2 -- One request, step by step (HTML stepper)
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
      number={2}
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
// Figure 3 -- Why predefined tools are safer (two-path comparison)
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
      number={3}
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

const YAML_EXAMPLE = `sources:
  ibmi-dev:
    host: \${DB2i_HOST}
    user: \${DB2i_USER}
    password: \${DB2i_PASS}
    port: 8076
    ignore-unauthorized: true

tools:
  library_objects:
    source: ibmi-dev
    description: >
      Lists objects in one library, with type and
      size. Use when asked what a library contains.
    parameters:
      - name: library_name
        type: string
        description: "Library name, e.g. 'QGPL'"
        required: true
        maxLength: 10
      - name: max_rows
        type: integer
        description: "Max rows to return"
        required: false
        default: 25
    statement: |
      SELECT *
      FROM TABLE(
        QSYS2.OBJECT_STATISTICS(:library_name, '*ALL')
      ) X
      FETCH FIRST :max_rows ROWS ONLY

toolsets:
  developer:
    tools:
      - library_objects`

interface YamlAnnotation {
  match: string
  label: string
  note: string
}

const YAML_ANNOTATIONS: YamlAnnotation[] = [
  { match: 'sources:', label: 'Connection reference', note: 'Where and how to reach one IBM i system. Credentials come from environment variables, never hardcoded.' },
  { match: 'library_objects:', label: 'Tool name', note: "The identifier an AI client sees and calls — it should read like a function name, not a query." },
  { match: 'description: >', label: 'Human-readable description', note: 'Sent directly to the language model. A clear description is what helps the client pick this tool for the right question — vague descriptions lead to the wrong tool being chosen.' },
  { match: 'parameters:', label: 'Accepted parameters', note: 'Every input is named, typed, and constrained. There is no way for a caller to supply arbitrary SQL here.' },
  { match: 'statement: |', label: 'Predefined SQL statement', note: 'Written once by a human reviewer. Parameters are bound in, never concatenated as text.' },
  { match: 'toolsets:', label: 'Toolset grouping', note: 'Related tools load together (e.g. all "developer" tools), so a team can expose a curated subset rather than everything at once.' },
  { match: '${DB2i_HOST}', label: 'Environment-variable reference', note: 'Placeholder syntax — the real host/user/password live outside this file, in the deployment environment.' },
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
      <div className="insight-figure-enter grid gap-5 px-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:px-2">
        <pre className="insight-figure-scroll overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs leading-relaxed text-slate-100 sm:text-[13px]">
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
// Figure 5 -- Practical adoption path (4 stages)
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
      number={5}
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
            {i < ADOPTION_STAGES.length - 1 && (
              <span className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 text-blue-300 lg:block" aria-hidden="true">
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
// Figure 6 (optional) -- Traditional vs. MCP-assisted workflow
// ---------------------------------------------------------------------------

const TRADITIONAL_STEPS = ['Open ACS or a 5250 session', 'Remember the right QSYS2 service', 'Compose the SQL by hand', 'Inspect the returned rows', 'Interpret the result']
const MCP_STEPS = ['Ask a focused question', 'An approved tool is selected', 'Predefined SQL executes', 'The result is summarized', 'A technical user validates before acting']

export function McpWorkflowComparisonFigure() {
  return (
    <InsightFigure
      number={6}
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
                <span className="font-semibold text-slate-400">{i + 1}.</span>
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
