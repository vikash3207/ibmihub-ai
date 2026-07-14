# When to Use CLLE vs RPGLE

## Learning Objective

By the end of this lesson, you will be able to recognize practical
situations where writing a CLLE program is a natural fit, compared to
situations where RPGLE is the better tool.

## Simple Explanation

In the Introduction to CLLE lesson, you learned that RPGLE usually
contains business logic and data processing, while CLLE is often used for
orchestration and control flow around programs and commands. This lesson
builds on that distinction with concrete, practical scenarios for choosing
one over the other.

CLLE is commonly a natural fit when a task mainly involves:

- **Running commands.** Actions like creating, copying, or checking
  objects, which are done using IBM i commands rather than detailed
  business logic.
- **Calling other programs in a specific order.** Coordinating which
  program runs first, second, and so on, especially when later steps
  should only happen if earlier steps succeeded.
- **Submitting batch jobs.** Kicking off work that should run in the
  background rather than tying up an interactive session.
- **Simple decision-making between commands and program calls**, rather
  than detailed calculations or data record processing.

RPGLE is generally the better tool when a task mainly involves:

- **Detailed business logic**, such as calculations, validations, or
  business rules.
- **Working closely with structured data**, records, fields, and the kind
  of data processing covered in the Db2 for i lessons.
- **Reusable calculations**, such as the subprocedures covered in the
  RPGLE lessons.

In real IBM i applications, CLLE and RPGLE are commonly used together,
each playing to its strengths, rather than one replacing the other.

## Why It Matters

Beginners sometimes wonder whether they should write everything in RPGLE,
since it can technically run commands and call programs too, or whether
CLLE can replace RPGLE for simple logic. Recognizing which tool naturally
fits a given task, orchestration and commands versus detailed business
logic, helps you make sound, practical decisions rather than forcing every
task into a single language out of habit.

## Practical Example

Imagine a nightly process, similar to the one described in the
Introduction to CLLE lesson: an RPGLE program processes the day's orders,
applying business rules and updating records, while a CLLE program calls
that RPGLE program, checks whether it completed successfully, and then
calls a second RPGLE program to produce a report only if the first step
succeeded.

The detailed order-processing logic belongs in RPGLE, since it involves
business rules and structured data. The coordination, deciding what runs
next and confirming success along the way, belongs in CLLE. This is a
simplified, illustrative example rather than a specific real process, but
it reflects a very common, practical division of responsibility between
the two languages.

## Common Confusions

**"Since CLLE is often written with keyword-style commands, is it the
'fixed-format' counterpart to free-format RPGLE?"**
Not quite. Free-format versus fixed-format is specifically a distinction
within RPG's own history, covered in earlier RPGLE lessons. CL command
syntax, using keywords and parameters such as `CHGVAR VAR(&MSG)
VALUE('Hello')`, has generally worked this way all along; "CLLE" itself
refers to CL compiled using ILE, not a newer, different CL syntax the way
free-format RPGLE is a newer style of RPG.

**"Can RPGLE do everything CLLE can do?"**
RPGLE can technically run some commands and call other programs, but using
CLLE for orchestration and command-driven tasks generally keeps that kind
of logic clearer and more idiomatic, while keeping RPGLE focused on
business logic and data processing.

**"Do I need to pick one language for an entire application?"**
No. Real IBM i applications commonly use both languages together, each
handling the part of the work it naturally fits, rather than committing to
only one language throughout.

## Quick Recap

- CLLE is a natural fit for running commands, calling programs in a
  specific order, submitting batch jobs, and simple decision-making around
  those actions.
- RPGLE is a natural fit for detailed business logic, calculations, and
  working closely with structured data.
- CLLE and RPGLE are commonly used together in real applications, each
  playing to its own strengths.
- CL's keyword-style command syntax is not a "fixed-format" counterpart to
  free-format RPGLE; CLLE specifically refers to CL compiled using ILE.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "Can you give another example of a task that fits CLLE better than
  RPGLE?"
- "What does ILE actually mean in the context of CLLE?"
