# Activation Groups Basics

## Learning Objective

By the end of this lesson, you will be able to describe, at a
conceptual level, what an activation group is and why it matters for
how programs and service programs behave at runtime.

## Simple Explanation

When a program or service program actually runs inside a job, it needs
somewhere to keep things like its open files and static storage, and
some defined scope for how its error handling applies. That runtime
space is called an **activation group**. Every program and service
program is associated with an activation group each time it runs.

Two especially common options control this: `*NEW` gives a program its
own fresh activation group every time it is called, cleanly separated
from anything else; `*CALLER` has a program share the activation group
of whatever called it, rather than getting its own.

## Why It Matters

Which activation group a program runs in affects real, observable
behavior: whether resources like open files persist between separate
calls to a program, how much overhead is involved in setting up that
runtime space, and how error handling is scoped between one program and
whatever called it. Recognizing that this concept exists, and roughly
what it controls, is genuinely useful even before you need to make any
deliberate activation group decisions yourself.

## Practical Example

Imagine a program that opens a file the first time it runs, expecting
that file to stay open on later calls within the same job for
performance reasons. Whether that actually happens depends partly on
the activation group it runs in: a program getting a brand new
activation group on every single call behaves differently, in this
respect, from one that shares an activation group across repeated
calls within the same job.

This is a simplified, illustrative example rather than a specific real
tuning decision, but it reflects the kind of practical difference
activation groups actually cause.

## Common Confusions

**"Do I need to worry about activation groups for a simple, single
program?"**
Not usually, at this introductory level. Default behavior already
handles many common, simple cases reasonably well. Activation groups
become a more deliberate design consideration in larger applications
made up of many interacting programs and service programs.

**"Is *NEW always the better, safer choice?"**
Not automatically. A fresh activation group on every call gives clean
isolation, but also has real overhead each time one is created. Whether
that tradeoff is worth it depends on the specific application, which is
a deeper design decision beyond this introductory lesson.

**"Is an activation group the same thing as a job?"**
No. A job can contain more than one activation group at once, since
different programs running within that same job may each be associated
with their own activation group, or may share one, depending on how
they were built.

## Quick Recap

- An activation group is the runtime space a program or service
  program uses for things like open files, static storage, and error
  handling scope.
- `*NEW` gives a program its own fresh activation group on every call;
  `*CALLER` shares the activation group of whatever called it.
- Activation group choice affects real behavior, such as whether
  resources persist between calls, and involves genuine tradeoffs.
- A job can contain more than one activation group at a time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would be a realistic reason to want a program to keep its own
  activation group separate from its caller's?"
- "Does choosing *CALLER change anything about how I write a program's
  own RPGLE source?"
