import type { ComponentType } from 'react'
import { Activity, Boxes, ScrollText, FolderTree, ArrowDown, AlertTriangle, Eye, ShieldCheck, ShieldAlert, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightFigure } from './insight-figure'

/**
 * Original diagrams for the third published IBM i Insight ("Db2 for i and
 * QSYS2 Services Every Developer Should Know"). The source article used two
 * Mermaid diagrams (a purpose-grouping flowchart and a symptom-to-cause
 * workflow); this codebase's Markdown pipeline never renders Mermaid (see
 * components/insights/rpg-sql-apis-figures.tsx's header comment for why),
 * so both are rebuilt as real HTML/CSS components, plus one original third
 * figure (a read-only-vs-action safety matrix) that the source article's
 * prose already argued for but never diagrammed.
 *
 * All three are plain HTML/CSS, matching every other Insight figure in this
 * codebase -- no fixed-width SVG, no horizontally-scrollable viewport.
 */

// ---------------------------------------------------------------------------
// Figure 1 -- Where to look: services grouped by purpose
// ---------------------------------------------------------------------------

interface ServiceGroup {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  cardBorder: string
  cardBg: string
  iconBg: string
  traditional: string
  services: string[]
}

const SERVICE_GROUPS: ServiceGroup[] = [
  {
    icon: Activity,
    title: 'Work & messages',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    traditional: 'WRKACTJOB · DSPJOBLOG · DSPMSG',
    services: ['ACTIVE_JOB_INFO', 'JOBLOG_INFO', 'HISTORY_LOG_INFO', 'MESSAGE_QUEUE_INFO'],
  },
  {
    icon: Boxes,
    title: 'Objects & programs',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-cyan-50/50',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    traditional: 'DSPOBJD · DSPPGM',
    services: ['OBJECT_STATISTICS', 'PROGRAM_INFO', 'BOUND_MODULE_INFO'],
  },
  {
    icon: ScrollText,
    title: 'Data & journals',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/50',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    traditional: 'DSPJRN',
    services: ['DISPLAY_JOURNAL', 'GENERATE_SQL', 'SYSINDEXSTAT'],
  },
  {
    icon: FolderTree,
    title: 'IFS & commands',
    cardBorder: 'border-emerald-100',
    cardBg: 'bg-emerald-50/50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    traditional: 'WRKLNK',
    services: ['IFS_OBJECT_STATISTICS', 'QCMDEXC'],
  },
]

export function ServiceGroupMapFigure() {
  return (
    <InsightFigure
      number={1}
      title="Where to look: services grouped by purpose"
      accent="blue"
      caption="Every group answers a different kind of question, but all of them return the same thing: ordinary rows a SELECT can filter, join, and reuse -- the same shape a developer already knows from application tables."
    >
      <div className="insight-figure-enter mx-auto max-w-3xl px-2 sm:px-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.title} className={cn('rounded-xl border p-3.5', group.cardBorder, group.cardBg)}>
              <span className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm', group.iconBg)}>
                <group.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold text-slate-900">{group.title}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">Traditionally</p>
              <p className="text-xs text-slate-600">{group.traditional}</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">SQL services</p>
              <ul className="mt-0.5 space-y-0.5">
                {group.services.map((s) => (
                  <li key={s} className="truncate font-mono text-[11px] text-slate-700">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-1" aria-hidden="true">
          <ArrowDown className="h-5 w-5 text-blue-300" />
        </div>

        <div className="rounded-xl border-2 border-blue-300 bg-blue-50/70 p-3 text-center shadow-sm">
          <p className="text-sm font-bold text-blue-900">One queryable result set</p>
          <p className="mt-0.5 text-xs text-blue-700">Filter it, join it, save it, embed it in RPG, or hand it to an automated tool.</p>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 2 -- From symptom to confirmed cause
// ---------------------------------------------------------------------------

interface InvestigationStep {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  accentDot: string
  accentText: string
  cardBorder: string
  cardBg: string
  title: string
  detail: string
}

const INVESTIGATION_STEPS: InvestigationStep[] = [
  {
    icon: AlertTriangle,
    accentDot: 'bg-blue-500',
    accentText: 'text-blue-700',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    title: 'Symptom reported',
    detail: 'A user reports that an order job appears to be stuck.',
  },
  {
    icon: Activity,
    accentDot: 'bg-cyan-500',
    accentText: 'text-cyan-700',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-cyan-50/50',
    title: 'ACTIVE_JOB_INFO',
    detail: 'Find the qualified job name and confirm whether it is in MSGW, LCKW, or another wait state.',
  },
  {
    icon: ScrollText,
    accentDot: 'bg-violet-500',
    accentText: 'text-violet-700',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/50',
    title: 'JOBLOG_INFO',
    detail: 'Pass that qualified name in and locate the most recent diagnostic and escape messages.',
  },
  {
    icon: Boxes,
    accentDot: 'bg-emerald-500',
    accentText: 'text-emerald-700',
    cardBorder: 'border-emerald-100',
    cardBg: 'bg-emerald-50/50',
    title: 'PROGRAM_INFO & BOUND_MODULE_INFO',
    detail: 'Confirm the deployed object, its build attributes, and which modules were bound in.',
  },
  {
    icon: Eye,
    accentDot: 'bg-amber-500',
    accentText: 'text-amber-700',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/50',
    title: 'DISPLAY_JOURNAL or SYSINDEXSTAT',
    detail: 'If data was changed, gather journal evidence. If SQL performance is involved, check index validity and usage.',
  },
]

export function SymptomToCauseFigure() {
  return (
    <InsightFigure
      number={2}
      title="From symptom to confirmed cause"
      accent="cyan"
      caption="The same pattern -- call a service, alias it, filter, limit -- repeats at every step. The investigation becomes evidence-driven and repeatable instead of depending on screenshots or recollection."
    >
      <div className="insight-figure-enter mx-auto max-w-xl px-1 sm:px-2">
        {INVESTIGATION_STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm', step.accentDot)} aria-hidden="true">
                <step.icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {i < INVESTIGATION_STEPS.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-slate-200" aria-hidden="true" />}
            </div>
            <div className={cn('min-w-0 flex-1 rounded-xl border p-3.5', step.cardBorder, step.cardBg, i < INVESTIGATION_STEPS.length - 1 ? 'mb-3' : 'mb-0')}>
              <p className={cn('text-xs font-semibold uppercase tracking-wide', step.accentText)}>{i === 0 ? 'Start' : `Step ${i}`}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/70 p-3 text-center shadow-sm">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-900">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Confirmed cause
          </p>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 3 -- Read-only vs. action: know before you run it
// ---------------------------------------------------------------------------

interface SafetyTier {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  label: string
  labelText: string
  cardBorder: string
  cardBg: string
  items: { name: string; note: string }[]
}

const SAFETY_TIERS: SafetyTier[] = [
  {
    icon: ShieldCheck,
    label: 'Safe to explore',
    labelText: 'text-emerald-800',
    cardBorder: 'border-emerald-200',
    cardBg: 'bg-emerald-50/60',
    items: [
      { name: 'ACTIVE_JOB_INFO (general columns)', note: 'Little or no special authority needed.' },
      { name: 'OBJECT_STATISTICS, PROGRAM_INFO, BOUND_MODULE_INFO', note: 'Read-only object/program metadata.' },
      { name: 'MESSAGE_QUEUE_INFO', note: 'Reads messages without removing or changing them.' },
      { name: 'SYSINDEXSTAT', note: 'A catalog view -- ordinary SELECT authority.' },
    ],
  },
  {
    icon: ShieldAlert,
    label: 'Use with care',
    labelText: 'text-amber-800',
    cardBorder: 'border-amber-200',
    cardBg: 'bg-amber-50/60',
    items: [
      { name: "ACTIVE_JOB_INFO (DETAILED_INFO => 'ALL')", note: 'Detailed columns may require *JOBCTL or monitoring function-usage.' },
      { name: 'IFS_OBJECT_STATISTICS (recursive)', note: 'A broad recursive scan can be slow -- start low, restrict object types.' },
      { name: "HISTORY_LOG_INFO (EOF_DELAY > 0)", note: 'Continuous-polling mode never ends on its own; only for a designed monitor.' },
      { name: 'DISPLAY_JOURNAL', note: 'Needs authority to the journal and receivers; avoid sub-second polling of a busy journal.' },
      { name: 'GENERATE_SQL', note: 'Review generated DDL before executing -- schema names, grants, and constraints may need changes.' },
    ],
  },
  {
    icon: Terminal,
    label: 'Changes system state',
    labelText: 'text-rose-800',
    cardBorder: 'border-rose-200',
    cardBg: 'bg-rose-50/60',
    items: [
      { name: 'QCMDEXC (procedure or scalar function)', note: 'Runs a real CL command -- exactly as if typed on a command line. Never build it from untrusted input.' },
    ],
  },
]

export function SafetyMatrixFigure() {
  return (
    <InsightFigure
      number={3}
      title="Read-only vs. action: know before you run it"
      accent="amber"
      caption="Most of these services only read information. A smaller set can be expensive, broad, or authority-sensitive -- and exactly one, QCMDEXC, can change the system just like running a command interactively."
    >
      <div className="insight-figure-enter mx-auto max-w-2xl space-y-3 px-2 sm:px-4">
        {SAFETY_TIERS.map((tier) => (
          <div key={tier.label} className={cn('rounded-xl border p-3.5 sm:p-4', tier.cardBorder, tier.cardBg)}>
            <p className={cn('mb-2 inline-flex items-center gap-1.5 text-sm font-bold', tier.labelText)}>
              <tier.icon className="h-4 w-4" aria-hidden="true" />
              {tier.label}
            </p>
            <ul className="space-y-1.5">
              {tier.items.map((item) => (
                <li key={item.name} className="text-xs leading-relaxed text-slate-700 sm:text-[13px]">
                  <span className="font-mono font-semibold text-slate-900">{item.name}</span>
                  <span className="text-slate-500"> — {item.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Registry -- merged into the shared INSIGHT_FIGURE_REGISTRY via
// components/insights/insight-figure-registry.ts, same as every other
// article's own figure file.
// ---------------------------------------------------------------------------

export const DB2_QSYS2_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  'db2-for-i-qsys2-services-developers-should-know': {
    'service-group-map': ServiceGroupMapFigure,
    'symptom-to-cause': SymptomToCauseFigure,
    'safety-matrix': SafetyMatrixFigure,
  },
}
