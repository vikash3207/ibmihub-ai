# Window Records and Simple Popup Screens

## Learning Objective

By the end of this lesson, you will understand what a window record is,
and how it lets a display file show a small popup-style screen over the
current one, rather than replacing it entirely.

## Simple Explanation

In the Display File Record Formats lesson, you learned that a display
file commonly has more than one record format, each typically representing
a distinct screen. Every record format covered so far in this lesson group
has filled the whole screen. A **window record**, defined using the
**`WINDOW`** DDS keyword, is a record format that instead displays as a
smaller box, overlaid on top of whatever is already on the screen, rather
than replacing it.

A window record still works like any other record format from the RPGLE
program's perspective: it can be shown with `exfmt`, have its own input,
output, or both fields, and its own function keys tied to indicators. The
difference is purely visual: instead of taking over the entire 24-by-80
screen, it appears as a smaller area, with whatever was already on screen
still visible around it.

## Why It Matters

Windows are a common, lightweight way to ask a short, focused question
without disrupting everything else already on the screen, such as a simple
"Are you sure you want to delete this record?" confirmation. Using a
window instead of a full replacement screen keeps the user's context, what
they were already looking at, visible while they respond to the prompt.

## Practical Example

Imagine a screen listing several customer records, where selecting one for
deletion should ask for confirmation before actually removing it. Rather
than replacing the whole list screen with a separate confirmation screen,
a window record can pop up a small "Confirm Delete?" box over part of the
existing list, letting the user see both the confirmation prompt and the
customer they are about to delete at the same time. Answering the prompt,
commonly using function keys such as F3 to cancel or Enter to confirm,
closes the window and returns to the underlying screen.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical use of window records.

## Common Confusions

**"Does a window record replace the screen underneath it, the way a
regular record format does?"**
No. That is exactly the distinguishing feature of a window record: it
displays as a smaller, overlaid area, while the rest of the screen behind
it remains visible, rather than being replaced the way switching between
two full-screen record formats would work.

**"Does an RPGLE program interact with a window record differently than a
regular record format?"**
Not fundamentally. A window record is still shown and read using the same
`exfmt` operation, and its fields and function key indicators work the
same way covered in earlier lessons in this group. The main difference is
how it visually appears, not how the RPGLE program works with it in code.

**"Are windows only used for confirmation prompts?"**
No. Confirmation prompts are a very common, simple use, but windows can be
used for any short interaction that benefits from staying visually
layered over existing screen content, rather than replacing it entirely.

## Quick Recap

- A window record, defined using the `WINDOW` DDS keyword, is a record
  format that displays as a smaller, overlaid box rather than replacing
  the whole screen.
- The screen content behind a window remains visible while the window is
  displayed.
- An RPGLE program works with a window record the same way as any other
  record format, using `exfmt` and the same field and indicator concepts.
- Windows are commonly used for short, focused interactions, such as
  confirmation prompts, without disrupting the user's existing context.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does IBM i decide exactly where on the screen a window record
  appears?"
- "Can a window record have its own function keys separate from the
  screen behind it?"
