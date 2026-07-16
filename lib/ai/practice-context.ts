/**
 * Formats a practice-question context payload into a prompt section for the
 * AI Tutor (Spec 001 v1.1 AI-TUTOR-FR-021). Server-only.
 *
 * IMPORTANT: this module never reaches for a "real" correctAnswer/explanation
 * on its own -- it only ever formats whatever the caller's payload already
 * contains. The actual answer-reveal safety guarantee lives at the call
 * site (components/practice-browser.tsx only includes correctAnswer/
 * explanation in the request payload once the learner has revealed the
 * answer in the UI) and in the API route's validation (parsePracticeContext
 * in app/api/ai-tutor/route.ts only accepts these fields when `revealed` is
 * true). This formatter is the last, cheapest line of defense: even if it
 * were passed a revealed:false payload that somehow still carried an
 * answer, the instruction below tells the model not to state it -- but the
 * primary guarantee is that the field is never sent in the first place.
 */
import 'server-only'

export interface PracticeContextInput {
  questionTitle: string
  questionText: string
  options?: string[]
  selectedAnswer?: string
  revealed: boolean
  correctAnswer?: string
  explanation?: string
}

export function formatPracticeContextForPrompt(input: PracticeContextInput): string {
  const lines = [
    'The learner is currently working on this iRPGenie practice question:',
    `Title: ${input.questionTitle}`,
    `Question: ${input.questionText}`,
  ]

  if (input.options && input.options.length > 0) {
    lines.push(`Options: ${input.options.join(' | ')}`)
  }

  if (input.selectedAnswer) {
    lines.push(`Learner's selected answer so far: ${input.selectedAnswer}`)
  }

  if (input.revealed && input.correctAnswer) {
    lines.push(`Correct answer (already revealed to the learner in the UI): ${input.correctAnswer}`)
    if (input.explanation) {
      lines.push(`Explanation (already revealed to the learner in the UI): ${input.explanation}`)
    }
  } else {
    lines.push(
      'The learner has NOT revealed the correct answer in the UI yet. Do not state or reveal the ' +
        'correct answer yourself -- help them reason through the question, and if they want to check ' +
        'their answer, point them to the "Reveal answer" control on the page.'
    )
  }

  return lines.join('\n')
}
