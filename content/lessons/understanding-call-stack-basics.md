# Understanding Call Stack Basics

## Learning Objective

By the end of this lesson, you will be able to explain what a call stack
is, and use it to see which programs and procedures are currently active
in a job.

## Simple Explanation

The DSPJOB and Job Information Basics lesson mentioned a call stack
without explaining it in detail. A **call stack** is the ordered list of
every program, and procedure within a program, that is currently active
in a job, from the very first one that started running down to whatever
is running at this exact moment.

When program `A` calls program `B`, which in turn calls program `C`, all
three sit on the call stack at once while `C` is running: `A` and `B` are
paused, waiting for whatever they called to finish, while `C` is
currently active. Viewing the call stack, through `DSPJOB`'s call stack
option, shows this entire chain at once, not just whatever program is
running right now.

## Why It Matters

When a failure happens deep inside a chain of calls, knowing only "the
program that sent this message" can still leave out useful context: what
called it, and why. The call stack shows the full path that led to
wherever a job currently is, which matters for understanding not just
where a problem occurred, but the sequence of calls that led there.

## Practical Example

Imagine a nightly batch process where a CLLE program calls `PROCESSORDER`,
which in turn calls a smaller RPGLE procedure to look up a customer's
balance. If that lookup fails, the call stack at that moment would show
all three: the original CLLE program, `PROCESSORDER`, and the specific
procedure currently running, showing exactly how execution reached that
point rather than only which piece failed.

This is a simplified, illustrative example rather than a specific real
process, but it reflects a genuinely common, everyday reason the call
stack matters during an investigation.

## Common Confusions

**"Is the call stack the same thing as the job log?"**
No. The job log, covered in the Understanding Job Logs lesson, is a
record of messages over time. The call stack is a snapshot, at one
specific moment, of exactly which programs and procedures are currently
active and how they called each other.

**"Does the call stack only matter for CLLE programs calling RPGLE
programs?"**
No. Any program calling another, including one RPGLE program calling a
procedure, or one program calling another program of any kind, adds to
the call stack while that call is in progress. It is not specific to any
one language combination.

**"Once a called program finishes, does it disappear from the call
stack?"**
Yes. Once a called program or procedure finishes and returns control back
to whatever called it, it is no longer active and no longer appears on
the current call stack; the call stack always reflects what is active
right now, not everything that has ever run during the job.

## Quick Recap

- A call stack is the ordered list of every program and procedure
  currently active in a job, from the first one that started down to
  whatever is running right now.
- `DSPJOB`'s call stack option shows this entire chain at once.
- The call stack shows the full path leading to a job's current point,
  useful context beyond just knowing which single program is running.
- A program or procedure leaves the call stack once it finishes and
  returns control to whatever called it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does the call stack help when a failure happens several calls deep
  into a process?"
- "What is the difference between a program and a procedure showing up on
  the call stack?"
