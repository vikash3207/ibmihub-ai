/**
 * 5250 Command Practice -- deterministic command validation engine
 * (Spec 010 LAB-FR-001/002, PR #136).
 *
 * This is intentionally NOT a command parser or interpreter: it never
 * executes anything. It normalizes a learner's typed input (case,
 * whitespace) and compares it against a small, exercise-defined, finite
 * set of accepted forms (PracticeLabCommandCheck). Anything else is
 * classified into one of a handful of friendly, deterministic outcomes so
 * the workspace UI can show a specific, helpful message instead of a raw
 * parse error -- never a silent no-op, crash, or blank screen (Spec 010
 * LAB-FR-001).
 */

import type { PracticeLabCommandCheck } from './types'

export type PracticeLabCommandOutcome =
  | 'success'
  | 'empty-input'
  | 'unsupported-command'
  | 'missing-parameter'
  | 'wrong-parameter-value'
  | 'near-miss'

export interface PracticeLabCommandResult {
  outcome: PracticeLabCommandOutcome
  message: string
}

/** Uppercase, trim, collapse whitespace, and remove incidental spaces around `(`, `)`, and `/` so `wrkobj obj( custpf )` and `WRKOBJ OBJ(CUSTPF)` compare equal. */
export function normalizeCommand(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*\/\s*/g, '/')
}

const FALLBACK_MESSAGE = 'This command is not available in this practice exercise yet.'

/**
 * Classify a learner's typed input against one exercise's expected
 * command. Never throws, never executes the input -- pure string
 * comparison against `check`'s finite accepted-forms list.
 */
export function evaluateCommand(rawInput: string, check: PracticeLabCommandCheck): PracticeLabCommandResult {
  const normalized = normalizeCommand(rawInput)

  if (normalized.length === 0) {
    return { outcome: 'empty-input', message: 'Type a command before pressing Enter.' }
  }

  const acceptedNormalized = check.acceptedCommands.map(normalizeCommand)
  if (acceptedNormalized.includes(normalized)) {
    return { outcome: 'success', message: '' }
  }

  const commandNameNormalized = check.commandName.toUpperCase()
  const isThisCommand = normalized === commandNameNormalized || normalized.startsWith(`${commandNameNormalized} `)

  if (!isThisCommand) {
    return { outcome: 'unsupported-command', message: FALLBACK_MESSAGE }
  }

  if (check.requiredParamName) {
    const paramPrefix = `${check.requiredParamName.toUpperCase()}(`

    if (!normalized.includes(paramPrefix)) {
      const example = check.acceptedParamValues?.[0] ?? '...'
      return {
        outcome: 'missing-parameter',
        message: `${check.commandName} requires the ${check.requiredParamName} parameter, for example ${check.requiredParamName}(${example}).`,
      }
    }

    if (check.acceptedParamValues && check.acceptedParamValues.length > 0) {
      const acceptedValues = new Set(check.acceptedParamValues.map((v) => v.toUpperCase()))
      // Plain substring extraction rather than a dynamically-built RegExp --
      // paramPrefix always ends in a literal "(", which is a regex
      // metacharacter and would otherwise need escaping.
      const afterPrefix = normalized.slice(normalized.indexOf(paramPrefix) + paramPrefix.length)
      const typedValue = afterPrefix.slice(0, afterPrefix.indexOf(')'))
      const matchesKnownValue = acceptedValues.has(typedValue)

      if (!matchesKnownValue) {
        return {
          outcome: 'wrong-parameter-value',
          message: `There's no object named ${typedValue || '(blank)'} in this lab yet -- try ${check.acceptedParamValues[0]}.`,
        }
      }
    }
  }

  return {
    outcome: 'near-miss',
    message: "Close, but that's not quite the expected form for this exercise. Try the hint if you're stuck.",
  }
}
