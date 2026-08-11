import { Globe, Lock, Route, Cpu, Database, ArrowLeftRight, ChevronDown } from 'lucide-react'

interface DiagramStage {
  icon: typeof Globe
  title: string
  description: string
}

const STAGES: DiagramStage[] = [
  {
    icon: Globe,
    title: 'REST client',
    description: 'A browser, mobile app, or another server sends an HTTPS request.',
  },
  {
    icon: Lock,
    title: 'HTTPS / IBM HTTP Server + IWS',
    description: 'TLS is terminated (via Digital Certificate Manager) and the request reaches the web services runtime.',
  },
  {
    icon: Route,
    title: 'Deployed service mapping',
    description: 'IWS matches the path and HTTP method to a configured service and marshals the request using its PCML.',
  },
  {
    icon: Cpu,
    title: 'RPG program or service-program procedure',
    description: 'The existing business logic runs in a job on the web services server, exactly as it always has.',
  },
  {
    icon: Database,
    title: 'Db2 for i / business logic',
    description: 'The program reads or writes data and returns its output parameters.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Response returned to the client',
    description: 'IWS marshals the output back into JSON (or XML), and the HTTP Server sends the response.',
  },
]

/**
 * Original, dependency-free architecture diagram for the IWS launch
 * Insight (PR #194). No diagram/visualization library exists anywhere in
 * this repo -- Deep Dive content instead draws simple diagrams as ASCII art
 * inside fenced ```text blocks. That convention doesn't hold up well on a
 * narrow viewport (long monospace lines either wrap unreadably or force
 * horizontal scroll) and doesn't carry the site's visual language, so this
 * is a small, single-column, real-HTML flow diagram instead: one stage per
 * row, connected by a chevron, using plain flexbox. Being single-column by
 * construction (never a multi-column layout that could overflow) is what
 * guarantees no horizontal scroll at any viewport width, not a breakpoint
 * hack layered on top of a wider layout.
 */
export function InsightArchitectureDiagram() {
  return (
    <figure className="not-prose my-8 rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/60 via-white to-white p-4 shadow-sm sm:p-6">
      <ol className="mx-auto flex max-w-md flex-col items-stretch gap-1">
        {STAGES.map((stage, index) => (
          <li key={stage.title}>
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <stage.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  <span className="mr-1.5 tabular-nums text-sky-600">{index + 1}.</span>
                  {stage.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{stage.description}</p>
              </div>
            </div>
            {index < STAGES.length - 1 && (
              <div className="flex justify-center py-0.5" aria-hidden="true">
                <ChevronDown className="h-4 w-4 text-sky-300" />
              </div>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 text-center text-xs text-slate-500">
        Request flow for a typical Integrated Web Services call: each stage hands off to the next, and the response
        returns back through the same path to the original caller.
      </figcaption>
    </figure>
  )
}
