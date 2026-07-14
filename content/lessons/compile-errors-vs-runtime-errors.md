# Compile Errors vs Runtime Errors

## Learning Objective

By the end of this lesson, you will be able to distinguish a compile
error, caught before a program ever runs, from a runtime error, which
only surfaces while the program is actually executing.

## Simple Explanation

Not every problem in a program shows up the same way. A **compile
error** is caught by the compiler itself, before the program ever runs at
all, typically because of a syntax mistake, such as a missing semicolon
or a misspelled keyword.

```rpgle
dcl-s custBal packed(9:2)
```

This line is missing its ending semicolon, exactly the kind of mistake
that produces a compile error: the compiler stops and reports the
problem, and no executable program is even produced until it is fixed.

A **runtime error**, by contrast, only appears while a correctly compiled
program is actually running, such as attempting to use a field's value
after a `CHAIN` without checking `%FOUND` first, covered in the
Understanding %FOUND after CHAIN lesson. The program compiles
successfully, since nothing about that mistake is a syntax problem, but
its behavior goes wrong only once it actually executes with real data.

## Why It Matters

Recognizing which kind of error you are looking at immediately narrows
down where to look: a compile error points directly at a specific line
in the source code, found before anything even runs, while a runtime
error requires actually running, and often debugging, the program to
observe what goes wrong and why. Confusing the two can send a developer
looking in the wrong place entirely.

## Practical Example

Imagine two different problems reported to a developer. One is a compile
error: the compiler refuses to produce a program at all, pointing
directly at a missing semicolon on a specific line. The other is a
runtime error: the program compiles and runs, but produces a wrong
customer balance under certain conditions, requiring the job log and
debugging techniques covered earlier in this lesson group to actually
investigate.

This is a simplified, illustrative example rather than a specific real
scenario, but it reflects the two fundamentally different kinds of
problems every RPGLE developer encounters.

## Common Confusions

**"Does a program with a compile error still produce something that can
be run?"**
No. A compile error prevents a usable program object from being created
at all; the syntax problem must be fixed and the source recompiled
before the program can run.

**"Can a runtime error be caught before the program actually runs, the
way a compile error can?"**
Not in the same way. A runtime error depends on the program actually
executing, often with specific data or conditions, which is exactly why
runtime errors require running and observing the program, rather than
being caught purely by reading the source code.

**"Is checking %FOUND after CHAIN a way to prevent a compile error?"**
No. Checking `%FOUND`, covered in the Understanding %FOUND after CHAIN
lesson, prevents a specific kind of runtime problem, using stale or
unrelated field values as if a real record had been found. It has
nothing to do with whether the program compiles.

## Quick Recap

- A compile error is caught by the compiler before a program ever runs,
  typically from a syntax mistake, and prevents a usable program from
  being produced at all.
- A runtime error only surfaces while a correctly compiled program is
  actually executing, often depending on specific data or conditions.
- Compile errors point directly at a specific line in the source; runtime
  errors require actually running, and often debugging, the program to
  investigate.
- Confusing the two can send a developer looking in the wrong place for a
  given problem.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other common examples of runtime errors besides an
  unchecked CHAIN result?"
- "Can a single mistake in a program ever cause both a compile error and
  a runtime error?"
