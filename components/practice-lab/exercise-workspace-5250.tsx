'use client'

import { useState } from 'react'
import type { PracticeLabExercise, PracticeLabTerminalScreen } from '@/lib/practice-lab/types'
import { evaluateCommand } from '@/lib/practice-lab/5250-simulator'
import { TerminalScreen } from '@/components/practice-lab/TerminalScreen'
import { SimulatedScreen } from '@/components/practice-lab/SimulatedScreen'
import { CommandInput } from '@/components/practice-lab/CommandInput'
import { ExerciseInstructions } from '@/components/practice-lab/ExerciseInstructions'
import { ExerciseProgress } from '@/components/practice-lab/ExerciseProgress'
import { SimulatorNotice } from '@/components/practice-lab/simulator-notice'

interface Props {
  exercise: PracticeLabExercise
  relatedLessons: { slug: string; title: string }[]
}

/**
 * Client-side interaction for a single 5250 exercise workspace (Spec 010
 * LAB-FR-001/002/004, PR #136). All state is local/session-only -- no
 * command is ever executed, and nothing here can reach a real system;
 * evaluateCommand() only compares normalized strings against the
 * exercise's finite accepted-forms list (lib/practice-lab/5250-simulator.ts).
 */
const DEFAULT_SCREEN: PracticeLabTerminalScreen = {
  title: 'Command Entry',
  lines: ['Type a command below and press Enter to run it.'],
}

export function ExerciseWorkspace5250({ exercise, relatedLessons }: Props) {
  const initialScreen = exercise.initialScreen ?? DEFAULT_SCREEN

  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'trying' | 'success'>('idle')
  const [screen, setScreen] = useState(initialScreen)
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined)
  const [statusTone, setStatusTone] = useState<'info' | 'success' | 'error'>('info')
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const hints = exercise.hints ?? []

  function handleSubmit() {
    if (!exercise.commandCheck) return
    const result = evaluateCommand(input, exercise.commandCheck)

    if (result.outcome === 'success') {
      setStatus('success')
      setScreen(exercise.successScreen ?? initialScreen)
      setStatusMessage(exercise.successMessage ?? 'Success.')
      setStatusTone('success')
    } else {
      setStatus('trying')
      setStatusMessage(result.message)
      setStatusTone('error')
    }
  }

  function handleReset() {
    setInput('')
    setStatus('idle')
    setScreen(initialScreen)
    setStatusMessage(undefined)
    setStatusTone('info')
    setHintsRevealed(0)
  }

  return (
    <div className="space-y-6">
      <SimulatorNotice />

      <ExerciseInstructions
        instructions={exercise.instructions ?? exercise.summary}
        learningObjectives={exercise.learningObjectives}
        revealedHints={hints.slice(0, hintsRevealed)}
        hasMoreHints={hintsRevealed < hints.length}
        onShowHint={() => setHintsRevealed((n) => Math.min(n + 1, hints.length))}
        relatedLessons={relatedLessons}
      />

      <div className="space-y-3">
        <TerminalScreen statusMessage={statusMessage} statusTone={statusTone}>
          <SimulatedScreen screen={screen} />
        </TerminalScreen>

        <CommandInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={status === 'success'} />

        <ExerciseProgress status={status} onReset={handleReset} />
      </div>
    </div>
  )
}
