import { Button } from '@/components/ui/button'
import { PRACTICE_TOPIC_GROUPS } from '@/lib/practice-topic-groups'
import type { SessionLength, SessionLevel } from '@/lib/practice-session'

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
}

/**
 * Session-builder form (IBM i Practice Hub). Plain radio inputs styled as
 * pills (native `<input type="radio">`, visually hidden via `peer sr-only`,
 * a sibling `<span>` carries the pill styling via `peer-checked`/`peer-
 * focus-visible`) -- a real GET <form>, so choosing Topic/Level/Length and
 * submitting works with zero client JS, matches app/search/page.tsx's own
 * GET-form convention, and gives every option proper keyboard/radio
 * semantics (arrow-key navigation within a group, one visible focus ring)
 * for free instead of hand-rolling button-based "fake radios".
 *
 * Topic options come directly from lib/practice-topic-groups.ts's 13
 * consolidated groups plus "All Topics" (an empty value, meaning no topic
 * filter) -- Level/Length are passed in by the caller since they differ per
 * mode (e.g. Quick Quiz never offers a 1-question length or an Advanced
 * level, since the existing question bank has no advanced-difficulty
 * records -- see lib/practice-session.ts's isValidLevel()).
 */
export function SessionBuilderForm({ action, submitLabel, levels, lengths }: SessionBuilderFormProps) {
  return (
    <form action={action} method="get" className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Topic</legend>
        <div className="flex flex-wrap gap-2">
          <PillRadio name="topicGroup" value="" label="All Topics" defaultChecked />
          {PRACTICE_TOPIC_GROUPS.map((group) => (
            <PillRadio key={group.id} name="topicGroup" value={group.id} label={group.label} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Level</legend>
        <div className="flex flex-wrap gap-2">
          {levels.map((level, index) => (
            <PillRadio key={level.value} name="level" value={level.value} label={level.label} defaultChecked={index === 0} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-900">Session length</legend>
        <div className="flex flex-wrap gap-2">
          {lengths.map((length, index) => (
            <PillRadio key={length.value} name="length" value={String(length.value)} label={length.label} defaultChecked={index === 0} />
          ))}
        </div>
      </fieldset>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}

function PillRadio({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="inline-flex items-center rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-800 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-1">
        {label}
      </span>
    </label>
  )
}
