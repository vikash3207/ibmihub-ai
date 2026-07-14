# STRDBG Basics for RPGLE

## Learning Objective

By the end of this lesson, you will be able to explain what `STRDBG`
does, what a program needs before it can be debugged this way, and what
happens once the debugger starts.

## Simple Explanation

The Debugging RPGLE Programs lesson mentioned `STRDBG` only by name. This
lesson covers what actually happens when you use it.

```clle
STRDBG PGM(CUSTRPT)
```

Here, `STRDBG PGM(CUSTRPT)` (Start Debug) starts the ILE source debugger
for the `CUSTRPT` program, opening an interactive debug display that
shows the program's actual RPGLE source code. Before this works, the
program needs to have been compiled **with debugging data**, information
the compiler includes specifically so the debugger can show source lines
and variable names rather than just raw machine instructions. Once
`STRDBG` starts, the program has not actually run yet; the debugger is
simply ready, waiting for the program to be called so it can pause and
show what happens as it executes.

## Why It Matters

`STRDBG` is the entry point for every other debugging technique covered
in this lesson group: breakpoints, stepping, and watching variables all
depend on first starting a debug session against a program compiled with
debugging data. Understanding this as the necessary first step avoids the
confusing experience of trying to set a breakpoint on a program that
either was not compiled correctly or was never actually put into debug
mode.

## Practical Example

Imagine investigating the `CUSTRPT` report program from earlier lessons
in this path, which is producing an unexpected balance total. Before
looking at anything else, a developer runs `STRDBG PGM(CUSTRPT)`, opening
the debug display showing `CUSTRPT`'s actual source. From there, as
covered in the next two lessons, they can set a breakpoint at the
balance calculation and step through it to see exactly what happens.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects the standard first step behind almost
every RPGLE debugging session on IBM i.

## Common Confusions

**"Does STRDBG run the program immediately?"**
No. `STRDBG` only starts the debug session and opens the source display;
the program itself still needs to be called separately, at which point
the debugger becomes active and can pause execution.

**"What happens if I try to debug a program that wasn't compiled with
debugging data?"**
The debugger typically cannot show meaningful source lines or variable
names for that program, since the information it needs was never
included at compile time. This is why compiling with debugging data is a
prerequisite covered in this lesson, not an optional detail.

**"Do I need to use STRDBG every single time I run a program while
developing it?"**
No. `STRDBG` is specifically for when you need to actually step through
or inspect a program's behavior in detail. Many ordinary test runs do not
need a debug session at all.

## Quick Recap

- `STRDBG PGM(name)` starts the ILE source debugger for a specific
  program, opening its source in an interactive debug display.
- A program must be compiled with debugging data before `STRDBG` can show
  its source lines and variable names meaningfully.
- Starting a debug session does not run the program by itself; the
  program still needs to be called separately.
- `STRDBG` is the necessary first step before setting breakpoints or
  watching variables, covered in the next lessons.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How do I know whether a program was compiled with debugging data?"
- "Can I start a debug session against a program that is already
  running?"
