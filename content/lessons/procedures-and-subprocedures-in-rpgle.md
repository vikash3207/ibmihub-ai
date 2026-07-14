# Procedures and Subprocedures in RPGLE

## Learning Objective

By the end of this lesson, you will understand why RPGLE programs are
broken into subprocedures, and be able to write and call a simple
subprocedure using `dcl-proc` and `end-proc`.

## Simple Explanation

Every example in this lesson group so far has been one continuous block of
calculations, from the top of the program to `*inlr = *on;` at the end. As a
program grows, writing everything as one long block becomes harder to read
and harder to reuse. A **subprocedure** is a named, self-contained block of
logic that a program can call by name, as many times as needed.

A simple subprocedure is declared with **`dcl-proc`** and ends with
**`end-proc`**:

```rpgle
**free
ctl-opt dftactgrp(*no);

dcl-proc showGreeting;
  dsply 'Hello from a subprocedure!';
end-proc;

showGreeting();
showGreeting();

*inlr = *on;
```

This program declares one subprocedure, `showGreeting`, and then calls it
twice from the main line of the program, using its name followed by
parentheses. Each call runs the subprocedure's logic again from the
beginning.

This lesson focuses on the basic idea of naming and calling a self-contained
block of logic. The next lesson, Parameters and Prototypes, builds on this
by showing how a subprocedure can receive input values and return a result.

## Why It Matters

Breaking a program into subprocedures lets you name a piece of logic once
and reuse it wherever it is needed, rather than repeating the same
statements in multiple places throughout a program. It also makes a
program's overall structure easier to follow: a well-named subprocedure,
such as `showGreeting`, tells a reader what it does without needing to read
its internal logic first.

## Practical Example

Imagine a program that needs to display the same welcome message in
several different places as it runs. Without a subprocedure, the same
`dsply` statement, or a more complex block of logic, would need to be
copied and pasted everywhere it is needed. Declaring it once as a
`showGreeting` subprocedure and calling it wherever needed keeps the logic
in exactly one place, easier to read and easier to update later if the
message ever needs to change.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical reason RPGLE
developers organize logic into subprocedures.

## Common Confusions

**"Is a subprocedure the same thing as an entire separate program?"**
No. A subprocedure declared with `dcl-proc` lives inside the same program
source as the rest of its logic, in the examples covered in this lesson
group. It is a named, callable block within one program, not a separate
program or object.

**"Do I need parentheses when calling a subprocedure, even with no
parameters?"**
Yes. Calling a subprocedure, such as `showGreeting();`, uses parentheses
even when no values are being passed in, as covered in the next lesson.

**"Does a subprocedure have to appear before it is called in the source?"**
In the simple, single-program examples covered in this lesson group,
subprocedures are conventionally declared near the top of the source,
before the main line calls them, which keeps the program easy to read from
top to bottom.

## Quick Recap

- A subprocedure is a named, self-contained block of logic, declared with
  `dcl-proc` and ending with `end-proc`.
- A subprocedure is called by writing its name followed by parentheses,
  and can be called as many times as needed.
- Subprocedures let you reuse logic without repeating the same statements
  in multiple places, and make a program's structure easier to follow.
- This lesson covers simple, parameterless subprocedures; the next lesson
  covers passing values in and getting a result back out.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "Can a subprocedure call another subprocedure?"
- "What's the difference between a subprocedure and the older subroutine
  style from fixed-format RPG?"
