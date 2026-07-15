import type { PracticeLabTerminalScreen } from '@/lib/practice-lab/types'

interface Props {
  screen: PracticeLabTerminalScreen
}

/**
 * Renders one simulated 5250 screen's title + plain-text lines. Always
 * fabricated training data (Spec 010 Safety Rules) -- never real system
 * output. Meant to be placed inside <TerminalScreen>.
 */
export function SimulatedScreen({ screen }: Props) {
  return (
    <div>
      <p className="mb-2 border-b border-emerald-900/60 pb-1 text-emerald-300">{screen.title}</p>
      {screen.lines.map((line, i) => (
        <p key={i} className="whitespace-pre">
          {line.length > 0 ? line : ' '}
        </p>
      ))}
    </div>
  )
}
