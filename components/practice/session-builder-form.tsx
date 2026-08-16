'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PRACTICE_TOPIC_GROUPS } from '@/lib/practice-topic-groups'
import { ALL_TOPICS_KEY, QUIZ_LEVELS, type QuizAvailabilityMatrix, type SessionLength, type SessionLevel } from '@/lib/practice-session'
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

  const availabilityForTopic = matrix[topicGroupId] ?? ({} as QuizAvailabilityMatrix[string])
  const currentAvailability = availabilityForTopic[level as Exclude<SessionLevel, 'advanced'>]
  const canSubmit = currentAvailability?.supportsLength[length] ?? false

  function handleTopicChange(newTopicGroupId: string) {
    setTopicGroupId(newTopicGroupId)
    const availability = matrix[newTopicGroupId] ?? ({} as QuizAvailabilityMatrix[string])

    // If the currently selected level has no eligible questions at all for
    // the new topic, move to the first level from the caller's own list
    // that does -- never leave the form pointed at a guaranteed-empty level.
    const stillHasLevel = (availability[level as Exclude<SessionLevel, 'advanced'>]?.count ?? 0) > 0
    const nextLevel = stillHasLevel ? level : levels.find((l) => (availability[l.value as Exclude<SessionLevel, 'advanced'>]?.count ?? 0) > 0)?.value
    const resolvedLevel = nextLevel ?? level
    if (resolvedLevel !== level) setLevel(resolvedLevel)

    const resolvedAvailability = availability[resolvedLevel as Exclude<SessionLevel, 'advanced'>]
    if (!resolvedAvailability?.supportsLength[length]) {
      const nextLength = lengths.find((l) => resolvedAvailability?.supportsLength[l.value])
      if (nextLength) setLength(nextLength.value)
    }
  }

  function handleLevelChange(newLevel: SessionLevel) {
    setLevel(newLevel)
    const availability = availabilityForTopic[newLevel as Exclude<SessionLevel, 'advanced'>]
    if (!availability?.supportsLength[length]) {
      const nextLength = lengths.find((l) => availability?.supportsLength[l.value])
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
          />
          {PRACTICE_TOPIC_GROUPS.map((group) => {
            const hasAnyQuestions = QUIZ_LEVELS.some((lvl) => (matrix[group.id]?.[lvl]?.count ?? 0) > 0)
            return (
              <PillRadio
                key={group.id}
                name="topicGroup"
                value={group.id}
                label={group.label}
                checked={topicGroupId === group.id}
                onChange={() => handleTopicChange(group.id)}
                disabled={!hasAnyQuestions}
              />
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Level</legend>
        <div className="flex flex-wrap gap-2">
          {levels.map((lvl) => {
            const count = availabilityForTopic[lvl.value as Exclude<SessionLevel, 'advanced'>]?.count ?? 0
            return (
              <PillRadio
                key={lvl.value}
                name="level"
                value={lvl.value}
                label={`${lvl.label} (${count})`}
                checked={level === lvl.value}
                onChange={() => handleLevelChange(lvl.value)}
                disabled={count === 0}
              />
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Session length</legend>
        <div className="flex flex-wrap gap-2">
          {lengths.map((len) => {
            const supported = currentAvailability?.supportsLength[len.value] ?? false
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
