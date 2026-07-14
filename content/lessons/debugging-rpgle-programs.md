# Debugging RPGLE Programs

## Learning Objective

By the end of this lesson, you will understand a few beginner-friendly ways
to investigate what an RPGLE program is actually doing, including simple
`dsply` tracing, the ILE source debugger, and job logs.

## Simple Explanation

Even correctly structured RPGLE code does not always behave the way you
expect on the first try. **Debugging** is the general process of
investigating what a program is actually doing, so you can find and fix the
gap between what you expected and what actually happened. This lesson
introduces a few beginner-friendly starting points, without going into
advanced, production-level debugging techniques.

A few approachable ways to investigate a program include:

- **Simple `dsply` tracing.** Since the RPGLE Program Structure lesson, you
  have used `dsply` to show a value directly. Temporarily adding extra
  `dsply` statements at key points in a program, showing a variable's
  current value, is a quick, low-effort way to check what a program is
  actually doing at that point, even though it is not a formal debugging
  tool.
- **The ILE source debugger.** IBM i includes a proper interactive
  debugger, commonly started with the `STRDBG` (Start Debug) command, which
  lets you step through a program's logic one statement at a time and
  inspect variable values as it runs. This lesson introduces its existence
  and purpose rather than walking through its full, detailed usage.
- **Job logs.** As covered in the Job Logs and Spool Files Basics lesson,
  a job log records messages about what happened during a job, including
  errors. Checking the job log after a program fails is often one of the
  first, most practical steps toward understanding what went wrong.

## Why It Matters

Every developer, no matter how experienced, spends real time debugging.
Knowing a few approachable starting points, quick `dsply` tracing for a fast
check, the ILE source debugger for a more thorough look, and job logs for
understanding what already happened, gives you a practical toolkit for
investigating problems, rather than only being able to guess at what might
be wrong.

## Practical Example

Imagine a program that is supposed to calculate a discounted price, but the
result displayed looks wrong. As a first, quick check, a developer adds a
temporary `dsply` statement right after the discount calculation to see the
exact value being produced at that point. If that quick check is not
enough to understand the issue, they might instead use `STRDBG` to step
through the program's logic in more detail, or check the job log if the
program failed with an error rather than simply producing a wrong result.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a common, realistic starting approach to
debugging a beginner-level RPGLE program.

## Common Confusions

**"Is adding temporary dsply statements a real debugging technique, or just
a shortcut?"**
It is a genuinely common, practical shortcut, especially for quick checks
on simple programs, even though it is less thorough than using a proper
interactive debugger like the one started with `STRDBG`. Many developers
use both, depending on how much detail a particular problem needs.

**"Do I need to learn every feature of the ILE source debugger right
away?"**
No. This lesson introduces that the ILE source debugger exists and what it
is generally used for. Learning its full, detailed usage is a valuable
next step beyond this introductory lesson group, not something expected of
you yet.

**"Should I check the job log even if my program didn't show an obvious
error?"**
It can still be worth checking, since a job log can include informational
or warning messages even when a program does not fail outright, though it
is most essential specifically when a program has failed or behaved
unexpectedly.

## Quick Recap

- Debugging is the process of investigating what a program actually does,
  to find and fix the gap between expected and actual behavior.
- Temporary `dsply` statements are a quick, approachable way to check a
  program's behavior at a specific point.
- The ILE source debugger, commonly started with `STRDBG`, is IBM i's
  proper interactive tool for stepping through a program's logic.
- Job logs, covered earlier in this path, are often one of the first,
  most practical places to look after a program fails.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What is the difference between using dsply for debugging and using the
  ILE source debugger?"
- "What command starts the ILE source debugger on IBM i?"
