# Finding Program Failures from Error Messages

## Learning Objective

By the end of this lesson, you will be able to move from an error message
in a job log to the specific program and statement that actually failed.

## Simple Explanation

The Understanding Job Logs and Reading IBM i Message IDs lessons covered
finding and recognizing messages. This lesson covers the next practical
step: using a message to actually locate where a failure happened.

Each message in a job log, viewed with `DSPJOBLOG` or through `DSPJOB`'s
job log option, is tied to a specific program, and often a specific
statement within it, that was running when the message was sent.
Displaying a message's full detail, rather than just its short summary
text, generally reveals exactly which program sent it, and additional
detail about the specific condition that caused it.

## Why It Matters

A short message summary alone, such as "record not found," is rarely
enough to fix anything; knowing exactly which program, and ideally which
specific operation within it, actually produced that message is what
turns a vague symptom into an actionable starting point for further
investigation, including setting a breakpoint with `STRDBG`, covered
earlier in this lesson group.

## Practical Example

Imagine a job log showing an error message reporting a file-related
problem, with only a short summary visible at first glance. Displaying
that message's full detail reveals it was sent by the `CUSTRPT` program
specifically, while attempting an operation against `CUSTMAST`. This
immediately tells the developer exactly where to start: opening
`CUSTRPT` with `STRDBG` and setting a breakpoint around its file
operations, rather than guessing broadly across the whole program.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, practical path from
"something failed" to "here is exactly where to look."

## Common Confusions

**"Is a message's short summary text always enough to know what went
wrong?"**
Often not entirely. A short summary gives a general idea, but displaying
the message's full detail, including which program sent it, generally
provides much more specific, actionable information.

**"If a message names a program, does that mean the bug is definitely in
that program?"**
Not always definitively, but it is a strong, practical starting point. A
program can also fail because of bad or unexpected data it received,
rather than a mistake in its own logic, though knowing which program was
running when the failure happened is still the right place to begin
looking.

**"Do I need to check every message in a job log, or just the one that
looks like an error?"**
Generally, focus first on messages that clearly indicate a problem, but
checking a few messages around it can help build context, such as
confirming what the program was doing right before the failure occurred.

## Quick Recap

- Each message in a job log is tied to a specific program that was
  running when it was sent.
- Displaying a message's full detail, not just its short summary,
  reveals exactly which program sent it and additional specific detail.
- Knowing exactly which program failed turns a vague symptom into an
  actionable starting point for further debugging, such as setting a
  breakpoint with `STRDBG`.
- A named program is a strong starting point for investigation, though
  not an automatic guarantee the bug lives entirely within that program's
  own logic.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What additional detail does a message's full display typically show
  beyond its short summary text?"
- "How would I decide whether a failure is caused by the program's own
  logic or by unexpected data it received?"
