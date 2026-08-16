import type { ComponentType } from 'react'
import {
  Search,
  Fingerprint,
  ShieldCheck,
  FlaskConical,
  Eye,
  Wrench,
  FileText,
  XCircle,
  Activity,
  ScrollText,
  Lock,
  Radio,
  Database,
  Target,
  Gauge,
  Waypoints,
  MessageSquare,
  Server,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightFigure } from './insight-figure'

/**
 * Original diagrams for the sixth published IBM i Insight ("IBM i
 * Application Monitoring and Production Troubleshooting"). The source
 * document contains three Mermaid diagrams (a monitoring-layers flowchart,
 * an evidence-first-workflow flowchart, and a correlation sequence
 * diagram); this codebase's Markdown pipeline never renders Mermaid (see
 * rest-apis-figures.tsx's header comment for why). The layers flowchart and
 * the workflow flowchart are rebuilt here as original figures; the
 * correlation sequence diagram is deliberately not rebuilt as a fourth
 * figure -- the article states the same client-to-event-destination flow in
 * one prose sentence immediately where the diagram sat, and the JSON event
 * contract right after it already carries the concrete detail. The third
 * figure slot instead goes to an original traditional-command-vs-SQL-service
 * comparison the source only expressed as a Markdown table, matching the
 * user's explicit request for that diagram topic.
 *
 * All three are plain HTML/CSS, matching every other Insight figure in this
 * codebase -- no fixed-width SVG, no horizontally-scrollable viewport.
 */

// ---------------------------------------------------------------------------
// Figure 2 -- The evidence-first incident workflow
// ---------------------------------------------------------------------------

interface LifecycleStep {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  accentDot: string
  accentText: string
  cardBorder: string
  cardBg: string
  title: string
  detail: string
}

const BEFORE_BRANCH_STEPS: LifecycleStep[] = [
  {
    icon: Search,
    accentDot: 'bg-amber-500',
    accentText: 'text-amber-700',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/50',
    title: 'Confirm symptom and impact',
    detail: 'One sentence of observable impact -- what failed, for whom, since when.',
  },
  {
    icon: Fingerprint,
    accentDot: 'bg-orange-500',
    accentText: 'text-orange-700',
    cardBorder: 'border-orange-100',
    cardBg: 'bg-orange-50/50',
    title: 'Record time and identifiers',
    detail: 'Timestamp, qualified job name, correlation ID, message ID -- before anything rolls away.',
  },
  {
    icon: ShieldCheck,
    accentDot: 'bg-rose-500',
    accentText: 'text-rose-700',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-rose-50/50',
    title: 'Preserve volatile evidence',
    detail: 'Capture the job log, locks, and SQL state before holding, ending, or replying to anything.',
  },
  {
    icon: FlaskConical,
    accentDot: 'bg-fuchsia-500',
    accentText: 'text-fuchsia-700',
    cardBorder: 'border-fuchsia-100',
    cardBg: 'bg-fuchsia-50/50',
    title: 'Form and test one hypothesis',
    detail: '"Waiting on a lock held by another job" is testable. "IBM i is slow" is not.',
  },
]

const AFTER_BRANCH_STEPS: LifecycleStep[] = [
  {
    icon: Eye,
    accentDot: 'bg-blue-500',
    accentText: 'text-blue-700',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    title: 'Verify business recovery',
    detail: 'Confirm with both technical and business signals -- a green job is not proof of a fixed outcome.',
  },
  {
    icon: FileText,
    accentDot: 'bg-emerald-500',
    accentText: 'text-emerald-700',
    cardBorder: 'border-emerald-100',
    cardBg: 'bg-emerald-50/50',
    title: 'Root cause and prevention',
    detail: 'Explain why it failed, and turn the finding into a better alert, runbook, or fix.',
  },
]

export function IncidentLifecycleFigure() {
  return (
    <InsightFigure
      number={2}
      title="The evidence-first incident workflow"
      accent="amber"
      caption="Containment is a branch, not a shortcut: some incidents need an approved recovery action, others just need continued observation -- but both paths converge on the same verification and root-cause steps."
    >
      <div className="insight-figure-enter mx-auto max-w-xl px-1 sm:px-2">
        {BEFORE_BRANCH_STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm', step.accentDot)} aria-hidden="true">
                <step.icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="mt-1 w-0.5 flex-1 bg-slate-200" aria-hidden="true" />
            </div>
            <div className={cn('mb-3 min-w-0 flex-1 rounded-xl border p-3.5', step.cardBorder, step.cardBg)}>
              <p className={cn('text-xs font-semibold uppercase tracking-wide', step.accentText)}>{`Step ${i + 1}`}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </div>
        ))}

        <div className="mb-3 rounded-xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Containment required?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
              <XCircle className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-slate-700">No -- continue observation</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2">
              <Wrench className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
              <span className="text-xs font-semibold text-amber-800">Yes -- apply approved recovery</span>
            </div>
          </div>
        </div>

        {AFTER_BRANCH_STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm', step.accentDot)} aria-hidden="true">
                <step.icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {i < AFTER_BRANCH_STEPS.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-slate-200" aria-hidden="true" />}
            </div>
            <div className={cn('min-w-0 flex-1 rounded-xl border p-3.5', step.cardBorder, step.cardBg, i < AFTER_BRANCH_STEPS.length - 1 ? 'mb-3' : 'mb-0')}>
              <p className={cn('text-xs font-semibold uppercase tracking-wide', step.accentText)}>{`Step ${i + BEFORE_BRANCH_STEPS.length + 1}`}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 3 -- Conventional commands vs. SQL-based investigation
// ---------------------------------------------------------------------------

interface InvestigationGroup {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  cardBorder: string
  cardBg: string
  iconBg: string
  traditional: string
  services: string[]
}

const INVESTIGATION_GROUPS: InvestigationGroup[] = [
  {
    icon: Gauge,
    title: 'Partition snapshot',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    traditional: 'WRKSYSSTS',
    services: ['SYSTEM_STATUS_INFO_BASIC'],
  },
  {
    icon: Activity,
    title: 'Active jobs',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-cyan-50/50',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    traditional: 'WRKACTJOB · WRKUSRJOB · WRKSBSJOB',
    services: ['ACTIVE_JOB_INFO'],
  },
  {
    icon: ScrollText,
    title: 'Job log & history',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/50',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    traditional: 'WRKJOB opt.10 · DSPJOBLOG · DSPLOG',
    services: ['JOBLOG_INFO', 'HISTORY_LOG_INFO'],
  },
  {
    icon: Lock,
    title: 'Record & object locks',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-rose-50/50',
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    traditional: 'DSPRCDLCK · WRKOBJLCK',
    services: ['RECORD_LOCK_INFO', 'OBJECT_LOCK_INFO'],
  },
  {
    icon: Radio,
    title: 'Messages & queues',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/50',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    traditional: 'DSPMSG · WRKJOBQ',
    services: ['MESSAGE_QUEUE_INFO', 'JOB_QUEUE_INFO'],
  },
  {
    icon: Database,
    title: 'Active SQL work',
    cardBorder: 'border-emerald-100',
    cardBg: 'bg-emerald-50/50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    traditional: 'No direct interactive display',
    services: ['ACTIVE_QUERY_INFO', 'SQL_ERROR_LOG'],
  },
]

export function TraditionalVsSqlFigure() {
  return (
    <InsightFigure
      number={3}
      title="Conventional commands vs. SQL-based investigation"
      accent="blue"
      caption="Neither column replaces the other. Commands win for one job, right now, interactively. SQL wins for filtering, correlation, export, and repeatable monitoring."
    >
      <div className="insight-figure-enter mx-auto max-w-3xl px-2 sm:px-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INVESTIGATION_GROUPS.map((group) => (
            <div key={group.title} className={cn('rounded-xl border p-3.5', group.cardBorder, group.cardBg)}>
              <span className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm', group.iconBg)}>
                <group.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold text-slate-900">{group.title}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">Traditionally</p>
              <p className="text-xs text-slate-600">{group.traditional}</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">SQL services</p>
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

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-cyan-300 bg-cyan-50/70 p-3 text-center shadow-sm">
            <p className="text-sm font-bold text-cyan-900">Commands win for</p>
            <p className="mt-0.5 text-xs text-cyan-700">One job, right now, interactively -- reading a message, checking a status.</p>
          </div>
          <div className="rounded-xl border-2 border-blue-300 bg-blue-50/70 p-3 text-center shadow-sm">
            <p className="text-sm font-bold text-blue-900">SQL wins for</p>
            <p className="mt-0.5 text-xs text-blue-700">Filtering, correlation, export, history, and automated repeated checks.</p>
          </div>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 1 -- Symptom to root cause, across every layer
// ---------------------------------------------------------------------------

interface MonitoringLayer {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  detail: string
  cardBorder: string
  cardBg: string
  iconBg: string
  /** Increasing inset per layer -- outermost (business) is full width, innermost (partition) is the most indented. */
  insetClass: string
}

const MONITORING_LAYERS: MonitoringLayer[] = [
  {
    icon: Target,
    title: 'Business',
    detail: 'Completed orders, posted invoices, processed files, backlog age -- did the process deliver the outcome?',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/60',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    insetClass: 'ml-0',
  },
  {
    icon: Gauge,
    title: 'Application',
    detail: 'Response time, error count, rejected requests, correlation ID -- which operation failed, and for whom?',
    cardBorder: 'border-purple-100',
    cardBg: 'bg-purple-50/60',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    insetClass: 'ml-3 sm:ml-6',
  },
  {
    icon: Waypoints,
    title: 'Integration',
    detail: 'Data queues, IFS files, API status, certificates, dependent services -- did input arrive and respond?',
    cardBorder: 'border-fuchsia-100',
    cardBg: 'bg-fuchsia-50/60',
    iconBg: 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-600',
    insetClass: 'ml-6 sm:ml-12',
  },
  {
    icon: MessageSquare,
    title: 'Jobs and messages',
    detail: 'Job status, program, job log, inquiry messages -- which IBM i job actually handled the work?',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-rose-50/60',
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    insetClass: 'ml-9 sm:ml-[4.5rem]',
  },
  {
    icon: Database,
    title: 'Database',
    detail: 'SQL errors, long queries, record and object locks, transaction state -- is Db2 waiting, failing, or busy?',
    cardBorder: 'border-orange-100',
    cardBg: 'bg-orange-50/60',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    insetClass: 'ml-12 sm:ml-24',
  },
  {
    icon: Server,
    title: 'Partition',
    detail: 'CPU, ASP usage, temporary storage, active jobs -- is a wider system condition contributing?',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    insetClass: 'ml-[3.75rem] sm:ml-[7.5rem]',
  },
]

export function LayerCorrelationFigure() {
  return (
    <InsightFigure
      number={1}
      title="Symptom to root cause, across every layer"
      accent="violet"
      caption="A high-CPU alert does not tell you whether invoices are correct, and a correct invoice count does not rule out a stressed partition. Real incidents are correlated top to bottom, not diagnosed from one layer alone."
    >
      <div className="insight-figure-enter mx-auto max-w-2xl space-y-2.5 px-2 sm:px-4">
        {MONITORING_LAYERS.map((layer) => (
          <div key={layer.title} className={layer.insetClass}>
            <div className={cn('flex items-start gap-3 rounded-xl border p-3 sm:p-3.5', layer.cardBorder, layer.cardBg)}>
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm', layer.iconBg)}>
                <layer.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{layer.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-[13px]">{layer.detail}</p>
              </div>
            </div>
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

export const APP_MONITORING_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  'ibm-i-application-monitoring-and-production-troubleshooting': {
    'incident-lifecycle': IncidentLifecycleFigure,
    'traditional-vs-sql': TraditionalVsSqlFigure,
    'layer-correlation': LayerCorrelationFigure,
  },
}
