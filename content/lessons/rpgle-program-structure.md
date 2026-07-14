# RPGLE Program Structure

## Learning Objective

By the end of this lesson, you will be able to identify the main parts of a
simple, modern free-format RPGLE program: control options, declarations, the
main calculation logic, and how the program ends.

## Simple Explanation

In the Introduction to RPGLE lesson, you learned what RPGLE is used for and
that modern RPGLE is commonly written in a free-format style. This lesson
looks at the actual shape of a simple free-format RPGLE program, before
going deeper into any one part of it in the lessons that follow.

A simple free-format RPGLE program is generally organized into a few
recognizable sections, in this order:

- **Control options**, using the `ctl-opt` keyword, which set overall
  behavior for the program as a whole. Many simple programs use only a
  small number of control options, or none at all.
- **Declarations**, which introduce the variables the program will use,
  covered in depth in the Variables and Data Types in RPGLE lesson.
- **Calculations**, the executable statements that actually do the
  program's work: assigning values, making decisions, and repeating steps.
- An **end-of-program indicator**, traditionally set using `*inlr = *on;`,
  which tells IBM i that this program's Last Record indicator is on,
  signaling that the program is finished and should not be left active
  waiting for more input.

Here is a small, complete example that puts these pieces together:

```rpgle
**free
ctl-opt dftactgrp(*no);

dcl-s custName char(30);

custName = 'Jordan Lee';
dsply custName;

*inlr = *on;
```

This program declares one variable, assigns it a value, displays that value
using the `dsply` operation, and then ends. Every part of this small example
is expanded on in the lessons that follow.

## Why It Matters

Recognizing this overall shape, control options, declarations, calculations,
end-of-program, gives you a mental map for reading any simple RPGLE program,
even one you have never seen before. Rather than feeling like an
unstructured block of code, an RPGLE program becomes a small number of
recognizable, ordered sections, each with its own clear purpose.

## Practical Example

Imagine a new developer opening an RPGLE program for the first time, one
they did not write. Even without understanding every line, they can scan the
top of the source for `ctl-opt` to see overall settings, look further down
for `dcl-s` lines to see what variables exist, and then read the remaining
calculations to follow what the program actually does step by step, knowing
the program will end wherever `*inlr = *on;` appears.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely useful, practical way to approach
reading unfamiliar RPGLE source.

## Common Confusions

**"Do I need to use ctl-opt in every RPGLE program?"**
No. Many simple programs use few or no control options at all. `ctl-opt` is
available when a program needs to set specific behavior, but is not
required just to have a working program.

**"What does `*inlr = *on;` actually do?"**
It sets a special built-in indicator, Last Record (`*INLR`), to on,
signaling to IBM i that the program has finished its work. For the simple,
standalone programs covered in this lesson group, this is the traditional,
straightforward way to end a program cleanly.

**"Does `dsply` write to a file or a screen?"**
Neither, in the way covered in earlier Db2 for i lessons. `dsply` is a
simple operation that shows a value directly, commonly used for basic
output and debugging in small programs, without needing a file or a
designed screen.

## Quick Recap

- A simple free-format RPGLE program generally has control options,
  declarations, calculations, and an end-of-program indicator, in that
  order.
- `ctl-opt` sets overall program behavior and is optional for simple
  programs.
- Declarations introduce variables; calculations are the executable
  statements that do the program's actual work.
- `*inlr = *on;` is the traditional way to signal that a simple program has
  finished.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I forget to set *INLR = *ON at the end of my program?"
- "What are some common ctl-opt settings besides DFTACTGRP?"
