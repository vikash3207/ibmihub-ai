'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from './button'

interface SubmitButtonProps extends Omit<ButtonProps, 'type'> {
  /** Shown instead of `children` while the enclosing form's action is pending. */
  pendingLabel?: string
}

/**
 * Form-action submit button with a built-in pending state (PR #147 --
 * Navigation Responsiveness + Loading Feedback). Must be rendered as a
 * child of the <form> whose pending state it reports -- useFormStatus()
 * only sees the nearest enclosing <form>, never one rendered by this same
 * component. Disabling the button while pending prevents the double-click/
 * double-submit confusion the PR calls out, without changing what the
 * underlying server action does.
 */
export function SubmitButton({ children, pendingLabel, disabled, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? (pendingLabel ?? children) : children}
    </Button>
  )
}
