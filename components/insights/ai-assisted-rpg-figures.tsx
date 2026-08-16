import type { ComponentType } from 'react'
import {
  Lightbulb,
  FileCode2,
  Sparkles,
  Eye,
  Hammer,
  ServerCog,
  CheckCircle2,
  XCircle,
  Target,
  MapPin,
  Boxes,
  Database,
  ClipboardCheck,
  MessageSquareText,
  Wrench,
  ShieldAlert,
  Ban,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { InsightFigure } from './insight-figure'

/**
 * Original diagrams for the fifth published IBM i Insight ("Practical
 * AI-Assisted Development for RPG Programmers"). The source document
 * contains three Mermaid diagrams; this codebase's Markdown pipeline never
 * renders Mermaid (see rest-apis-figures.tsx's header comment for why).
 * The first two are rebuilt here as richer original figures (a lifecycle
 * step-chain with its accept/reject branch, and the "context stack" as
 * progressively-inset layers -- a strong thematic fit since the source
 * section is literally titled "The Context Stack"). The source's third
 * diagram (the seven-step team workflow) is deliberately *not* rebuilt: the
 * article already restates the same seven steps as a numbered prose list
 * immediately below it, so a fourth figure would be redundant. In its place,
 * this file adds one original figure the source never diagrammed but argues
 * for at length in prose: the four-tier "Match Autonomy to Risk" ladder.
 *
 * All three are plain HTML/CSS, matching every other Insight figure in this
 * codebase -- no fixed-width SVG, no horizontally-scrollable viewport.
 */

// ---------------------------------------------------------------------------
// Figure 1 -- The AI-assisted development lifecycle
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
    icon: Lightbulb,
    accentDot: 'bg-cyan-500',
    accentText: 'text-cyan-700',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-cyan-50/50',
    title: 'Developer intent',
    detail: 'A bounded goal and acceptance criteria -- not "improve this program."',
  },
  {
    icon: FileCode2,
    accentDot: 'bg-sky-500',
    accentText: 'text-sky-700',
    cardBorder: 'border-sky-100',
    cardBg: 'bg-sky-50/50',
    title: 'Selected code and context',
    detail: 'The relevant procedure, interfaces, data rules, and constraints -- the smallest complete unit that preserves meaning.',
  },
  {
    icon: Sparkles,
    accentDot: 'bg-blue-500',
    accentText: 'text-blue-700',
    cardBorder: 'border-blue-100',
    cardBg: 'bg-blue-50/50',
    title: 'AI suggestion',
    detail: 'A draft -- an input to engineering, not evidence that it compiles or behaves correctly.',
  },
  {
    icon: Eye,
    accentDot: 'bg-indigo-500',
    accentText: 'text-indigo-700',
    cardBorder: 'border-indigo-100',
    cardBg: 'bg-indigo-50/50',
    title: 'Human review',
    detail: 'The IBM i checklist: language, runtime behavior, database, operations, and security.',
  },
  {
    icon: Hammer,
    accentDot: 'bg-violet-500',
    accentText: 'text-violet-700',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/50',
    title: 'Compile and bind',
    detail: 'The real toolchain -- the only thing that proves the source is syntactically valid.',
  },
  {
    icon: ServerCog,
    accentDot: 'bg-fuchsia-500',
    accentText: 'text-fuchsia-700',
    cardBorder: 'border-fuchsia-100',
    cardBg: 'bg-fuchsia-50/50',
    title: 'Test on IBM i',
    detail: 'Positive, negative, boundary, and regression cases run against real behavior.',
  },
]

export function DevelopmentLifecycleFigure() {
  return (
    <InsightFigure
      number={1}
      title="The AI-assisted development lifecycle"
      accent="cyan"
      caption="The loop is the point: a suggestion that fails review, compilation, or testing goes back to context -- not back to the model with a vaguer prompt. Only evidence that meets the acceptance criteria reaches normal approval and release."
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
            <div className={cn('min-w-0 flex-1 rounded-xl border p-3.5', step.cardBorder, step.cardBg, i < LIFECYCLE_STEPS.length - 1 ? 'mb-3' : 'mb-3')}>
              <p className={cn('text-xs font-semibold uppercase tracking-wide', step.accentText)}>{`Step ${i + 1}`}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.detail}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence meets acceptance criteria?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2 py-2">
              <XCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
              <span className="text-xs font-semibold text-rose-800">No -- back to Step 2, with a sharper context</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span className="text-xs font-semibold text-emerald-800">Yes -- normal approval and release</span>
            </div>
          </div>
        </div>
      </div>
    </InsightFigure>
  )
}

// ---------------------------------------------------------------------------
// Figure 2 -- The context stack
// ---------------------------------------------------------------------------

interface ContextLayer {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  title: string
  detail: string
  cardBorder: string
  cardBg: string
  iconBg: string
  /** Increasing inset per layer, from the broadest (business goal) to the most specific (validation method). */
  insetClass: string
}

const CONTEXT_LAYERS: ContextLayer[] = [
  {
    icon: Target,
    title: 'Business goal and acceptance criteria',
    detail: 'Observable behavior the change must produce -- not just the implementation you have in mind.',
    cardBorder: 'border-indigo-100',
    cardBg: 'bg-indigo-50/60',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    insetClass: 'ml-0',
  },
  {
    icon: MapPin,
    title: 'IBM i environment and constraints',
    detail: 'Release, PTF expectations, source type, compile command, commitment control, and naming conventions.',
    cardBorder: 'border-violet-100',
    cardBg: 'bg-violet-50/60',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    insetClass: 'ml-3 sm:ml-6',
  },
  {
    icon: Boxes,
    title: 'Relevant source and interfaces',
    detail: 'The smallest complete unit that preserves meaning -- the procedure, its prototype, and what it depends on.',
    cardBorder: 'border-fuchsia-100',
    cardBg: 'bg-fuchsia-50/60',
    iconBg: 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-600',
    insetClass: 'ml-6 sm:ml-12',
  },
  {
    icon: Database,
    title: 'Tables, fields, and data rules',
    detail: 'Exact types, lengths, nullability, keys, status values, and decimal rules -- never inferred from field names.',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-rose-50/60',
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    insetClass: 'ml-9 sm:ml-[4.5rem]',
  },
  {
    icon: ClipboardCheck,
    title: 'Validation commands and tests',
    detail: 'How the proposal will actually be checked -- compile command, scope boundary, and the test cases that must pass.',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    insetClass: 'ml-12 sm:ml-24',
  },
]

export function ContextStackFigure() {
  return (
    <InsightFigure
      number={2}
      title="The context stack: what the assistant needs"
      accent="indigo"
      caption="A good prompt is not a longer prompt -- it is the minimum reliable context for the decision. Each layer narrows from the business goal down to exactly how success will be verified."
    >
      <div className="insight-figure-enter mx-auto max-w-2xl space-y-2.5 px-2 sm:px-4">
        {CONTEXT_LAYERS.map((layer) => (
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
// Figure 3 -- Match autonomy to risk
// ---------------------------------------------------------------------------

interface AutonomyTier {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  tier: string
  title: string
  examples: string
  oversight: string
  cardBorder: string
  cardBg: string
  iconBg: string
  badgeBg: string
  badgeText: string
}

const AUTONOMY_TIERS: AutonomyTier[] = [
  {
    icon: MessageSquareText,
    tier: 'Low',
    title: 'AI drafts freely',
    examples: 'Explaining code, drafting documentation, generating test ideas, answering "what does this do."',
    oversight: 'Spot-check for accuracy. Nothing is compiled or deployed from this step alone.',
    cardBorder: 'border-emerald-100',
    cardBg: 'bg-emerald-50/60',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  {
    icon: Wrench,
    tier: 'Medium',
    title: 'Draft, then a developer edits',
    examples: 'Refactoring internal procedures, renaming, modernizing fixed-form syntax, adding named constants.',
    oversight: 'Full diff review against the IBM i checklist; compile and run existing tests before merge.',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-amber-50/60',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  {
    icon: ShieldAlert,
    tier: 'High',
    title: 'Human-in-the-loop, staged rollout',
    examples: 'Changing business calculations, embedded SQL against production tables, service-program interface changes.',
    oversight: 'Full checklist, dedicated test data, controlled release, and a rollback plan before it ships.',
    cardBorder: 'border-orange-100',
    cardBg: 'bg-orange-50/60',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-800',
  },
  {
    icon: Ban,
    tier: 'Critical',
    title: 'No unsupervised AI changes',
    examples: 'Authentication and authorization, financial posting, payroll, security configuration, production data correction.',
    oversight: 'A senior developer owns the change throughout. AI may explain or suggest, but never apply directly.',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-rose-50/60',
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
  },
]

export function AutonomyRiskFigure() {
  return (
    <InsightFigure
      number={3}
      title="Match autonomy to risk"
      accent="violet"
      caption="Capability is not authorization. An agent that can edit files or run commands should receive only the permissions and environment access its bounded task actually needs -- regardless of which tier the task falls into."
    >
      <div className="insight-figure-enter mx-auto max-w-2xl space-y-2.5 px-2 sm:px-4">
        {AUTONOMY_TIERS.map((tier) => (
          <div key={tier.tier} className={cn('rounded-xl border p-3.5', tier.cardBorder, tier.cardBg)}>
            <div className="flex items-start gap-3">
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm', tier.iconBg)}>
                <tier.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide', tier.badgeBg, tier.badgeText)}>
                    {tier.tier} risk
                  </span>
                  <p className="text-sm font-bold text-slate-900">{tier.title}</p>
                </div>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">Examples</p>
                <p className="text-xs text-slate-600">{tier.examples}</p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">Required oversight</p>
                <p className="text-xs text-slate-600">{tier.oversight}</p>
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

export const AI_ASSISTED_RPG_FIGURE_REGISTRY: Record<string, Record<string, ComponentType>> = {
  'practical-ai-assisted-development-for-rpg-programmers': {
    'development-lifecycle': DevelopmentLifecycleFigure,
    'context-stack': ContextStackFigure,
    'autonomy-risk': AutonomyRiskFigure,
  },
}
