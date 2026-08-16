import type { ComponentType } from 'react'
import { Globe, Database, Wrench, Waypoints, ArrowDown, ShieldCheck, KeyRound, UserCheck, Lock, ListChecks, Server } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightFigure } from './insight-figure'

/**
 * Original diagrams for the fourth published IBM i Insight ("Building REST
 * APIs from IBM i Applications"). The source article used two Mermaid
 * diagrams (a simple architecture flowchart and a detailed request
 * sequence diagram); this codebase's Markdown pipeline never renders
 * Mermaid (see components/insights/rpg-sql-apis-figures.tsx's header
 * comment for why), so the two are consolidated into one richer request-
 * lifecycle figure at the more natural location (right where the source's
 * sequence diagram sat, under "What Happens During a Request?"), plus two
 * original figures the source article's prose already argued for but never
 * diagrammed: a four-way approach comparison, and a security defense-in-
 * depth stack.
 *
 * All three are plain HTML/CSS, matching every other Insight figure in this
 * codebase -- no fixed-width SVG, no horizontally-scrollable viewport.
 */

// ---------------------------------------------------------------------------
// Figure 1 -- Four ways to build an API on IBM i
// ---------------------------------------------------------------------------

interface ApproachCard {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  cardBorder: string
  cardBg: string
  iconBg: string
  bestFit: string
  tradeOff: string
}

const APPROACH_CARDS: ApproachCard[] = [
  {
    icon: Server,
    title: 'IWS over an ILE service',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    bestFit: 'Existing RPG, COBOL, or C business logic',
    tradeOff: 'Fast enablement -- the callable interface still needs careful design.',
  },
  {
    icon: Database,
    title: 'IWS over SQL statements',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-cyan-50/50',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    bestFit: 'Focused, data-oriented CRUD operations',
    tradeOff: 'Very quick for suitable operations; complex rules do not belong in scattered SQL mappings.',
  },
  {
    icon: Wrench,
    title: 'Custom API application',
    cardBorder: 'border-indigo-100',
    cardBg: 'bg-indigo-50/50',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    bestFit: 'Full control using Java, Node.js, Python, or an RPG HTTP framework',
    tradeOff: 'Greater flexibility, with more code and operational ownership.',
  },
  {
    icon: Waypoints,
    title: 'External API / integration layer',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/50',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    bestFit: 'Enterprise gateway, orchestration, OAuth, throttling, or multi-system composition',
    tradeOff: 'Adds another platform, but can keep policy and orchestration outside the core system.',
  },
]

export function ApproachComparisonFigure() {
  return (
    <InsightFigure
      number={1}
      title="Four ways to build an API on IBM i"
      accent="blue"
      caption="None of these is universally correct. A hybrid is common: IWS exposes a narrow internal capability, while an API gateway supplies the external hostname, token validation, and consumer-facing lifecycle."
    >
      <div className="insight-figure-enter mx-auto max-w-3xl px-2 sm:px-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {APPROACH_CARDS.map((card) => (
            <div key={card.title} className={cn('rounded-xl border p-3.5', card.cardBorder, card.cardBg)}>
              <span className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm', card.iconBg)}>
                <card.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold text-slate-900">{card.title}</p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">Best fit</p>
              <p className="text-xs text-slate-600">{card.bestFit}</p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">Trade-off</p>
              <p className="text-xs text-slate-600">{card.tradeOff}</p>
            </div>
          ))}
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 2 -- What happens during a request
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

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    icon: Globe,
    accentDot: 'bg-blue-500',
    accentText: 'text-blue-700',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    title: 'Client',
    detail: 'Sends GET /api/v1/orders/10025 over HTTPS.',
  },
  {
    icon: Lock,
    accentDot: 'bg-cyan-500',
    accentText: 'text-cyan-700',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-cyan-50/50',
    title: 'TLS / auth layer',
    detail: 'Terminates TLS, checks credentials, and forwards an authorized request.',
  },
  {
    icon: Server,
    accentDot: 'bg-indigo-500',
    accentText: 'text-indigo-700',
    cardBorder: 'border-indigo-100',
    cardBg: 'bg-indigo-50/50',
    title: 'IWS',
    detail: 'Maps the URI and method to the deployed operation, then calls it with orderId.',
  },
  {
    icon: Wrench,
    accentDot: 'bg-violet-500',
    accentText: 'text-violet-700',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/50',
    title: 'RPG operation',
    detail: 'Runs a parameterized SELECT and returns output parameters -- never raw SQL to the caller.',
  },
  {
    icon: Database,
    accentDot: 'bg-emerald-500',
    accentText: 'text-emerald-700',
    cardBorder: 'border-emerald-100',
    cardBg: 'bg-emerald-50/50',
    title: 'Db2 for i',
    detail: 'Returns the order row to the RPG program under the runtime profile\'s own authority.',
  },
]

export function RequestLifecycleFigure() {
  return (
    <InsightFigure
      number={2}
      title="What happens during a request"
      accent="cyan"
      caption="HTTP and JSON belong to the API boundary. Business validation belongs in the service layer. Data access belongs in a controlled program or SQL layer. Authentication, transport security, and traffic policy belong at IWS and/or an API gateway."
    >
      <div className="insight-figure-enter mx-auto max-w-xl px-1 sm:px-2">
        {LIFECYCLE_STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-sm', step.accentDot)} aria-hidden="true">
                <step.icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {i < LIFECYCLE_STEPS.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-slate-200" aria-hidden="true" />}
            </div>
            <div className={cn('min-w-0 flex-1 rounded-xl border p-3.5', step.cardBorder, step.cardBg, i < LIFECYCLE_STEPS.length - 1 ? 'mb-3' : 'mb-0')}>
              <p className={cn('text-xs font-semibold uppercase tracking-wide', step.accentText)}>{`Step ${i + 1}`}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border-2 border-blue-300 bg-blue-50/70 p-3 text-center shadow-sm">
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900">
            <ArrowDown className="h-4 w-4 rotate-180" aria-hidden="true" />
            The response retraces the same path back to the client
          </p>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 3 -- Security is layered, not a single switch
// ---------------------------------------------------------------------------

interface SecurityLayer {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  detail: string
  cardBorder: string
  cardBg: string
  iconBg: string
  /** Increasing inset per layer -- outermost (network) is full width, innermost (business validation) is the most indented, visually suggesting concentric protection around the core capability. */
  insetClass: string
}

const SECURITY_LAYERS: SecurityLayer[] = [
  {
    icon: ShieldCheck,
    title: 'TLS / HTTPS',
    detail: 'Every credential and business value travels encrypted. No production API over plain HTTP.',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    insetClass: 'ml-0',
  },
  {
    icon: KeyRound,
    title: 'Authentication',
    detail: 'Establishes who the caller is -- an approved credential or token policy, never a bare, unauthenticated endpoint.',
    cardBorder: 'border-orange-100',
    cardBg: 'bg-orange-50/60',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    insetClass: 'ml-3 sm:ml-6',
  },
  {
    icon: UserCheck,
    title: 'Authorization',
    detail: 'Determines what an authenticated caller may do -- read an order, but not change financial status fields.',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-rose-50/60',
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    insetClass: 'ml-6 sm:ml-12',
  },
  {
    icon: Lock,
    title: 'Least privilege',
    detail: 'The runtime profile holds only the object and data authorities the service actually needs.',
    cardBorder: 'border-fuchsia-100',
    cardBg: 'bg-fuchsia-50/60',
    iconBg: 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-600',
    insetClass: 'ml-9 sm:ml-[4.5rem]',
  },
  {
    icon: ListChecks,
    title: 'Boundary validation',
    detail: 'Identifiers, lengths, ranges, and cross-field rules are checked before business logic ever runs. Parameterized SQL protects the statement -- it does not replace this.',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/60',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    insetClass: 'ml-12 sm:ml-24',
  },
]

export function SecurityLayersFigure() {
  return (
    <InsightFigure
      number={3}
      title="Security is layered, not a single switch"
      accent="amber"
      caption="Each layer assumes the one before it can fail or be bypassed. CORS is a browser policy, not a member of this stack -- it never substitutes for authentication."
    >
      <div className="insight-figure-enter mx-auto max-w-2xl space-y-2.5 px-2 sm:px-4">
        {SECURITY_LAYERS.map((layer) => (
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

export const REST_APIS_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  'building-rest-apis-from-ibm-i-applications': {
    'approach-comparison': ApproachComparisonFigure,
    'request-lifecycle': RequestLifecycleFigure,
    'security-layers': SecurityLayersFigure,
  },
}
