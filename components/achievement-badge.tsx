import {
  Footprints,
  TrendingUp,
  Target,
  Award,
  Medal,
  Trophy,
  Compass,
  Layers,
  Library,
  GraduationCap,
  Lock,
  Check,
  type LucideIcon,
} from 'lucide-react'
import type { AchievementDefinition } from '@/lib/achievements'
import { cn } from '@/lib/utils'

/**
 * Badge visuals (PR #179). Uses lucide-react, already a dependency -- no new
 * icon, animation, or gamification library is introduced.
 *
 * Earned and locked are distinguished by an explicit text label and a
 * lock/check icon, never by color alone: the palette difference (blue/cyan
 * accent vs. muted slate) is reinforcement, not the signal itself.
 */
const ICONS: Record<AchievementDefinition['icon'], LucideIcon> = {
  footprints: Footprints,
  'trending-up': TrendingUp,
  target: Target,
  award: Award,
  medal: Medal,
  trophy: Trophy,
  compass: Compass,
  layers: Layers,
  library: Library,
  'graduation-cap': GraduationCap,
}

/** Category-based accent, so related badges read as a family rather than a rainbow. */
const ACCENT: Record<AchievementDefinition['category'], { ring: string; bg: string; text: string }> = {
  'lesson-milestone': { ring: 'ring-blue-200', bg: 'bg-blue-50', text: 'text-blue-700' },
  topic: { ring: 'ring-cyan-200', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  curriculum: { ring: 'ring-emerald-200', bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

interface AchievementMedallionProps {
  definition: AchievementDefinition
  earned: boolean
  size?: 'sm' | 'md'
}

/**
 * The circular badge mark itself. Decorative: every caller renders the badge
 * name and earned/locked state as real text next to it, so this is hidden
 * from assistive technology rather than duplicating that information.
 */
export function AchievementMedallion({ definition, earned, size = 'md' }: AchievementMedallionProps) {
  const Icon = ICONS[definition.icon]
  const accent = ACCENT[definition.category]
  const dimension = size === 'sm' ? 'h-9 w-9' : 'h-12 w-12'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full ring-1',
        dimension,
        earned ? cn(accent.bg, accent.text, accent.ring) : 'bg-slate-100 text-slate-400 ring-slate-200'
      )}
    >
      <Icon className={iconSize} />
    </span>
  )
}

/**
 * Earned/locked status pill. Text-first by design -- this is what carries
 * the state for screen readers and for anyone who cannot rely on the color
 * difference in the medallion above.
 */
export function AchievementStatus({ earned, className }: { earned: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
        earned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600',
        className
      )}
    >
      {earned ? (
        <Check className="h-3 w-3" aria-hidden="true" />
      ) : (
        <Lock className="h-3 w-3" aria-hidden="true" />
      )}
      {earned ? 'Earned' : 'Locked'}
    </span>
  )
}
