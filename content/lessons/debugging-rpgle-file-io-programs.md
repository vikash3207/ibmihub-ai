# Debugging RPGLE File I/O Programs

## Learning Objective

By the end of this lesson, you will be able to apply the general debugging
approaches from the Debugging RPGLE Programs lesson specifically to
problems in file I/O code.

## Simple Explanation

The Debugging RPGLE Programs lesson introduced `dsply` tracing, the ILE
source debugger started with `STRDBG`, and job logs as general,
beginner-friendly debugging tools. File I/O problems, code using `CHAIN`,
`SETLL`, `READE`, `UPDATE`, and similar operations covered in this lesson
group, tend to go wrong in a small number of familiar ways, and each of
these general tools applies directly to tracking them down.

A few practical, file-I/O-specific starting points:

- **Check the key value going in.** A surprising number of "record not
  found" problems trace back to the key field simply holding the wrong
  value at the moment of `CHAIN`, `SETLL`, or `READE`. A quick `dsply
  custNbr;` right before the operation confirms exactly what value is
  actually being used.
- **Check %FOUND and %EOF immediately.** As covered throughout this lesson
  group, these must be checked right after the operation they apply to.
  Adding a `dsply` right after checking them, such as `dsply %found(ORDHIST);`,
  confirms whether the program's own understanding of the result matches
  what actually happened.
- **Watch key fields in the ILE source debugger.** `STRDBG`, introduced in
  the Debugging RPGLE Programs lesson, supports setting a watch on a
  variable, letting you see exactly when and how a key field's value
  changes as the program runs, rather than guessing.
- **Check the job log for lock-related messages.** As covered in the Basic
  File Locking Concept in RPGLE lesson, a record lock conflict often shows
  up as a message in the job log, making it one of the first places worth
  checking when a file operation behaves unexpectedly.

## Why It Matters

File I/O bugs are extremely common in everyday RPGLE work, and they tend
to repeat a small number of familiar root causes: a wrong key value, a
missed `%FOUND` or `%EOF` check, or an unexpected lock. Knowing to check
these specific things first, using the same general tools already covered,
makes file I/O debugging far faster than searching blindly.

## Practical Example

Imagine a program using `SETLL` and `READE` over `ORDHIST` that
unexpectedly returns no orders for a customer known to have several. A
practical first step is a `dsply custNbr;` right before the `SETLL` to
confirm the key value actually matches what is expected, since a subtle
data type or value mismatch there is a common, easy-to-miss cause. If the
key value looks correct, checking the job log next for any lock-related
messages, or setting a watch on `custNbr` in the ILE source debugger, are
natural next steps.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a realistic, practical approach to a common
class of file I/O bug.

## Common Confusions

**"Is debugging file I/O code really different from debugging any other
RPGLE code?"**
Not fundamentally; the same tools from the Debugging RPGLE Programs lesson
apply directly. What differs is which specific things are worth checking
first, since file I/O bugs tend to cluster around a small number of
familiar causes: key values, `%FOUND`/`%EOF`, and locks.

**"Should I check the key value or the %FOUND/%EOF result first?"**
Generally the key value first, since an unexpected key value going into
`CHAIN`, `SETLL`, or `READE` is a very common root cause, and confirming it
is correct narrows down where else to look next.

**"Do lock-related problems always show up clearly in the job log?"**
Often, yes, which is exactly why the job log, covered in the Job Logs and
Spool Files Basics lesson, is worth checking early when a file operation
behaves unexpectedly, rather than assuming the problem must be in the
program's own logic.

## Quick Recap

- File I/O debugging uses the same general tools, `dsply` tracing, `STRDBG`,
  and job logs, covered in the Debugging RPGLE Programs lesson.
- A wrong key value going into `CHAIN`, `SETLL`, or `READE` is one of the
  most common causes of unexpected file I/O behavior.
- Checking `%FOUND` and `%EOF` immediately, and confirming what they
  actually returned, catches mismatches between expected and actual
  results.
- The job log is a practical first place to check for lock-related
  problems.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would a lock-related message in the job log typically look like?"
- "How do I set a watch on a key field using STRDBG?"
