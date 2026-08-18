'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PRACTICE_TOPIC_GROUPS } from '@/lib/practice-topic-groups'
import {
  ALL_TOPICS_KEY,
  isConfigRunnable,
  isLevelRunnable,
  isTopicRunnable,
  type QuizAvailabilityMatrix,
  type SessionLength,
  type SessionLevel,
} from '@/lib/practice-session'
import { cn } from '@/lib/utils'

interface LevelOption {
  value: SessionLevel
  label: string
}

interface LengthOption {
  value: SessionLength
  label: string
}

interface SessionBuilderFormProps {
  /** GET target the form submits to, e.g. '/practice/quiz/session'. */
  action: string
  submitLabel: string
  levels: LevelOption[]
  lengths: LengthOption[]
  /** Real, server-computed availability straight from the live catalog (lib/practice-session.ts's buildQuizAvailabilityMatrix) -- never a hardcoded count. */
  matrix: QuizAvailabilityMatrix
}

/**
 * Inventory-aware session-builder form (IBM i Practice Hub). A real GET
 * <form> (works with zero client JS for the actual submission -- matches
 * app/search/page.tsx's own GET-form convention), made a client component
 * specifically so Topic/Level/Length selection can react to the real
 * availability matrix: choosing a narrower topic disables levels/lengths
 * that have too few eligible questions, and auto-moves the current
 * selection to a valid one instead of ever leaving the form pointed at a
 * combination that can only fail after submission. The matrix itself is
 * small and fully serializable (13 topic groups + "All Topics" x 3 levels x
 * a `{count, supportsLength}` each) -- deliberately NOT the underlying
 * question content, so no meaningful client payload is added.
 *
 * "Available" means *runnable*, not merely non-empty: a topic/level with
 * fewer eligible questions than the shortest offered session length (e.g.
 * SQLRPGLE's real inventory never reaches 5) is still a selectable dead end
 * if only `count > 0` gates it -- every combination would leave every
 * length, and Start, disabled. Topic/level/full-config availability is
 * always derived through lib/practice-session.ts's isTopicRunnable() /
 * isLevelRunnable() / isConfigRunnable() (never a local `count > 0`/
 * `count === 0` check re-derived here), so this form, its own
 * auto-correction below, and the regression suite can never quietly drift
 * apart on what "available" means.
 *
 * Every option is a real native `<input type="radio">` (visually hidden,
 * paired with a styled sibling <span> via the `peer` pattern) rather than a
 * hand-rolled ARIA widget -- grouping same-`name` radios gets correct
 * Tab/Arrow-key/roving-focus behavior from the browser itself, for free.
 *
 * Submitting always attaches a fresh, explicit `seed` (Date.now(), set on
 * the hidden field right before the native submission proceeds -- see
 * handleSubmit) so every trip through the builder produces a new session,
 * while the resulting URL (now containing that seed) stays stable across
 * refresh/Back/Forward. A no-JS submission leaves the hidden field empty;
 * lib/practice-session.ts's normalizeSessionParams() falls back to a
 * deterministic derived seed in that case, so the flow still works, just
 * without the "always fresh" property.
 */
export function SessionBuilderForm({ action, submitLabel, levels, lengths, matrix }: SessionBuilderFormProps) {
  const [topicGroupId, setTopicGroupId] = useState<string>(ALL_TOPICS_KEY)
  const [level, setLevel] = useState<SessionLevel>(levels[0].value)
  const [length, setLength] = useState<SessionLength>(lengths[0].value)
  const seedInputRef = useRef<HTMLInputElement>(null)

  // The exact set of lengths this builder instance offers (e.g. Quick
  // Quiz's [5, 10]) -- "runnable" is always relative to this set, never a
  // bare `count > 0`, since a topic/level with fewer eligible questions
  // than the shortest offered length is still a dead end.
  const offeredLengths = lengths.map((l) => l.value)

  const availabilityForTopic = matrix[topicGroupId] ?? ({} as QuizAvailabilityMatrix[string])
  const currentAvailability = availabilityForTopic[level as Exclude<SessionLevel, 'advanced'>]
  const canSubmit = isConfigRunnable(currentAvailability, length)

  function handleTopicChange(newTopicGroupId: string) {
    setTopicGroupId(newTopicGroupId)
    const availability = matrix[newTopicGroupId] ?? ({} as QuizAvailabilityMatrix[string])

    // If the currently selected level can't run a session at all for the
    // new topic, move to the first level from the caller's own list that
    // can -- never leave the form pointed at a level that's guaranteed to
    // fail. If no level is runnable for this topic (e.g. SQLRPGLE, whose
    // topic pill is itself disabled and therefore unreachable via real
    // interaction), the selection is left as-is: canSubmit correctly goes
    // false and the "not enough questions" alert explains why, rather than
    // this silently picking some other dead-end configuration.
    const stillRunnable = isLevelRunnable(availability[level as Exclude<SessionLevel, 'advanced'>], offeredLengths)
    const nextLevel = stillRunnable ? level : levels.find((l) => isLevelRunnable(availability[l.value as Exclude<SessionLevel, 'advanced'>], offeredLengths))?.value
    const resolvedLevel = nextLevel ?? level
    if (resolvedLevel !== level) setLevel(resolvedLevel)

    const resolvedAvailability = availability[resolvedLevel as Exclude<SessionLevel, 'advanced'>]
    if (!isConfigRunnable(resolvedAvailability, length)) {
      const nextLength = lengths.find((l) => isConfigRunnable(resolvedAvailability, l.value))
      if (nextLength) setLength(nextLength.value)
    }
  }

  function handleLevelChange(newLevel: SessionLevel) {
    setLevel(newLevel)
    const availability = availabilityForTopic[newLevel as Exclude<SessionLevel, 'advanced'>]
    if (!isConfigRunnable(availability, length)) {
      const nextLength = lengths.find((l) => isConfigRunnable(availability, l.value))
      if (nextLength) setLength(nextLength.value)
    }
  }

  function handleSubmit() {
    // Deliberately not preventDefault()'d -- this mutates the hidden field's
    // value immediately before the browser's own native GET submission
    // proceeds, so the resulting URL always carries a fresh seed.
    if (seedInputRef.current) {
      seedInputRef.current.value = String(Date.now())
    }
  }

  return (
    <form action={action} method="get" onSubmit={handleSubmit} className="space-y-8">
      <input ref={seedInputRef} type="hidden" name="seed" defaultValue="" />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Topic</legend>
        <div className="flex flex-wrap gap-2">
          <PillRadio
            name="topicGroup"
            value={ALL_TOPICS_KEY}
            label="All Topics"
            checked={topicGroupId === ALL_TOPICS_KEY}
            onChange={() => handleTopicChange(ALL_TOPICS_KEY)}
            disabled={!isTopicRunnable(matrix[ALL_TOPICS_KEY], offeredLengths)}
          />
          {PRACTICE_TOPIC_GROUPS.map((group) => {
            const topicRunnable = isTopicRunnable(matrix[group.id], offeredLengths)
            return (
              <PillRadio
                key={group.id}
                name="topicGroup"
                value={group.id}
                label={topicRunnable ? group.label : `${group.label} (not enough questions)`}
                checked={topicGroupId === group.id}
                onChange={() => handleTopicChange(group.id)}
                disabled={!topicRunnable}
              />
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Level</legend>
        <div className="flex flex-wrap gap-2">
          {levels.map((lvl) => {
            const entry = availabilityForTopic[lvl.value as Exclude<SessionLevel, 'advanced'>]
            const count = entry?.count ?? 0
            const levelRunnable = isLevelRunnable(entry, offeredLengths)
            return (
              <PillRadio
                key={lvl.value}
                name="level"
                value={lvl.value}
                label={levelRunnable ? `${lvl.label} (${count})` : `${lvl.label} (${count} -- not enough for a quiz)`}
                checked={level === lvl.value}
                onChange={() => handleLevelChange(lvl.value)}
                disabled={!levelRunnable}
              />
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Session length</legend>
        <div className="flex flex-wrap gap-2">
          {lengths.map((len) => {
            const supported = isConfigRunnable(currentAvailability, len.value)
            return (
              <PillRadio
                key={len.value}
                name="length"
                value={String(len.value)}
                label={len.label}
                checked={length === len.value}
                onChange={() => setLength(len.value)}
                disabled={!supported}
              />
            )
          })}
        </div>
      </fieldset>

      {!canSubmit && (
        <p role="alert" className="text-sm text-amber-700">
          Not enough questions are available for this exact combination -- adjust a choice above before starting.
        </p>
      )}

      <Button type="submit" disabled={!canSubmit}>
        {submitLabel}
      </Button>
    </form>
  )
}

function PillRadio({
  name,
  value,
  label,
  checked,
  onChange,
  disabled,
}: {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <label className={cn('cursor-pointer', disabled && 'cursor-not-allowed')}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span
        className={cn(
          'inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
          disabled
            ? 'border-slate-100 text-slate-300'
            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
          'peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-800',
          'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-1'
        )}
      >
        {label}
      </span>
    </label>
  )
}
