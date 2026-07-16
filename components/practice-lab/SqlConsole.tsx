'use client'

import { useState } from 'react'
import type { PracticeLabExercise, PracticeLabSqlResultTable } from '@/lib/practice-lab/types'
import { evaluateSql } from '@/lib/practice-lab/sql-simulator'
import {
  CUSTOMER_TABLE_NAME,
  CUSTOMER_COLUMNS,
  ORDHDR_TABLE_NAME,
  ORDHDR_COLUMNS,
} from '@/content/practice-lab/sql-sample-schema'
import { SqlEditor } from '@/components/practice-lab/SqlEditor'
import { SqlResultGrid } from '@/components/practice-lab/SqlResultGrid'
import { SqlMessages } from '@/components/practice-lab/SqlMessages'
import { ExerciseInstructions } from '@/components/practice-lab/ExerciseInstructions'
import { ExerciseProgress } from '@/components/practice-lab/ExerciseProgress'
import { SimulatorNotice } from '@/components/practice-lab/simulator-notice'

interface Props {
  exercise: PracticeLabExercise
  relatedLessons: { slug: string; title: string }[]
}

/**
 * Client-side interaction for a single SQL exercise workspace (Spec 010
 * LAB-FR-008/009/012, PR #139). All state is local/session-only -- no SQL
 * is ever executed, and nothing here can reach a real database;
 * evaluateSql() only compares normalized text against the exercise's
 * finite accepted-forms list (lib/practice-lab/sql-simulator.ts), each
 * with its own predefined result table.
 */
export function SqlConsole({ exercise, relatedLessons }: Props) {
  const [sql, setSql] = useState(exercise.starterSql ?? '')
  const [status, setStatus] = useState<'idle' | 'trying' | 'success'>('idle')
  const [resultTable, setResultTable] = useState<PracticeLabSqlResultTable | null>(null)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [messageTone, setMessageTone] = useState<'info' | 'success' | 'error'>('info')
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const hints = exercise.hints ?? []

  function handleRun() {
    if (!exercise.sqlCheck) return
    const result = evaluateSql(sql, exercise.sqlCheck)

    if (result.outcome === 'success') {
      setStatus('success')
      setResultTable(result.resultTable ?? null)
      const rowCount = result.resultTable?.rows.length ?? 0

      if (rowCount === 0) {
        // A successful query that matches nothing is SQLCODE 100, not a
        // failure -- shown with the same 'info' tone as a neutral status
        // line, not 'error', so it never reads as something having gone wrong.
        setMessage(
          'SQLCODE 100: No rows matched the query in this simulated dataset. This is not always an error -- ' +
            'it often just means no matching data was found.'
        )
        setMessageTone('info')
      } else {
        const rowWord = rowCount === 1 ? 'row' : 'rows'
        setMessage(`Query completed in the simulator. ${rowCount} ${rowWord} returned.`)
        setMessageTone('success')
      }
    } else {
      setStatus('trying')
      setResultTable(null)
      setMessage(result.message)
      setMessageTone('error')
    }
  }

  function handleReset() {
    setSql(exercise.starterSql ?? '')
    setStatus('idle')
    setResultTable(null)
    setMessage(undefined)
    setMessageTone('info')
    setHintsRevealed(0)
  }

  return (
    <div className="space-y-6">
      <SimulatorNotice extraNote="This is a guided SQL simulator using sample training data. It does not connect to a real IBM i or Db2 system." />

      <ExerciseInstructions
        instructions={exercise.instructions ?? exercise.summary}
        learningObjectives={exercise.learningObjectives}
        revealedHints={hints.slice(0, hintsRevealed)}
        hasMoreHints={hintsRevealed < hints.length}
        onShowHint={() => setHintsRevealed((n) => Math.min(n + 1, hints.length))}
        relatedLessons={relatedLessons}
      />

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Sample table: {CUSTOMER_TABLE_NAME}
          </p>
          <p className="font-mono text-xs text-slate-600">{CUSTOMER_COLUMNS.join(', ')}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Sample table: {ORDHDR_TABLE_NAME}
          </p>
          <p className="font-mono text-xs text-slate-600">{ORDHDR_COLUMNS.join(', ')}</p>
        </div>
      </div>

      <div className="space-y-3">
        <SqlEditor value={sql} onChange={setSql} onRun={handleRun} disabled={status === 'success'} />

        <SqlMessages message={message} tone={messageTone} />

        <SqlResultGrid resultTable={resultTable} />

        <ExerciseProgress status={status} onReset={handleReset} />
      </div>
    </div>
  )
}
