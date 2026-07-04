# Basic IBM i Development Workflow

## Learning Objective

By the end of this lesson, you will have a general mental model for how work
moves from source code to a tested, released program on IBM i, tying together
several ideas from earlier lessons.

## Simple Explanation

A developer usually starts with source code, such as RPGLE or CLLE (Lessons 7
and 8). That source is compiled, or built, into a program object (Lesson 4),
which lives in a library (Lesson 4) alongside other objects.

Running and testing that program often involves reading or writing files or
data (Lessons 6 and 9), may involve a 5250 screen or another interface
(Lesson 5), and happens within a job (Lessons 3 and 10). If something does not
work as expected, the developer can check the job log and review any spool
files produced to understand what happened (Lesson 10).

Once a change has been tested, it typically goes through a controlled release
process before it becomes part of the regular working environment, rather than
becoming available to everyone the moment it is compiled.

It is worth being clear that different teams use different tools and processes
for all of this. What is described here is a general mental model, not one
single, universal workflow that every IBM i team follows exactly.

## Why It Matters

This lesson ties together nearly everything covered so far in this path into
one coherent picture of a developer's day-to-day work. For a beginner, it helps
make "developing on IBM i" feel like a concrete, approachable process rather
than a collection of separate facts. For a working developer, having this
overall picture in mind is useful for explaining the flow of work to others.

## Practical Example

Recall the order-processing example introduced in earlier lessons. Imagine a
developer needs to fix a small issue in how those order records are handled.
They update the source code, compile it into an updated program object, and
then run and test it, checking that the resulting data looks correct.

They review the job log to confirm nothing unexpected happened during the test.
Once they are satisfied the change works as intended, it moves through the
team's release process before becoming part of the regular working system. This
is a simplified, illustrative example rather than a real system, but it
reflects a common overall pattern.

## Common Confusions

**"Is there one single, correct IBM i development workflow?"**
No. Different teams use different tools and processes. This lesson describes a
general mental model to help you understand the pieces involved, not one
universal workflow that applies exactly everywhere.

**"Does compiling a program automatically make the change available to
everyone?"**
No. There is typically a controlled release process between a change being
compiled and tested, and that change becoming part of the regular working
environment.

**"Do I need to know specific compile commands or deployment tools to
understand this lesson?"**
No. This lesson stays at a conceptual level. The specific tools and commands
teams use for compiling and releasing changes are beyond the scope of this
introductory lesson.

## Quick Recap

- Development on IBM i generally flows from source code, to a compiled program
  object stored in a library, to running and testing that program.
- Testing often involves files or data, an interface such as a 5250 screen, and
  running within a job.
- Job logs and spool files help a developer understand what happened when
  testing or troubleshooting.
- A controlled release process typically separates a tested change from it
  becoming part of the regular working environment.
- Different teams use different tools and processes; this lesson describes a
  general mental model, not one universal workflow.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions
about anything in this lesson. One thing you might ask:

- "What's the difference between compiling a program and deploying it?"
