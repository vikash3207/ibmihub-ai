# Introduction to CLLE

## Learning Objective

By the end of this lesson, you will understand what CLLE is, how it differs from
RPGLE, and how it fits into the broader IBM i picture covered in earlier lessons.

## Simple Explanation

CLLE stands for Control Language with ILE support. It is commonly used to control
jobs, run commands, call programs, automate steps, and coordinate IBM i processes.

It helps to draw a clear line between CLLE and RPGLE, covered in Lesson 7. RPGLE
usually contains business logic and data processing, such as reading and writing
files and applying business rules. CLLE, on the other hand, is often used for
orchestration and control flow around programs and commands, coordinating the
order in which things happen rather than carrying out the detailed data work
itself.

## Why It Matters

CLLE ties together much of what earlier lessons have covered. It runs on the IBM i
platform (Lesson 3), works with libraries and objects (Lesson 4), can be involved
in processes tied to 5250 screens (Lesson 5), and often coordinates work that
reads and writes physical and logical files (Lesson 6) by calling RPGLE programs
(Lesson 7) that do that detailed work. Understanding CLLE's coordinating role
helps complete the picture of how a full IBM i business process is assembled from
multiple pieces working together.

## Practical Example

Imagine a company that needs to run a nightly process. A CLLE program could
coordinate that process: it might call an RPGLE program to process the day's
orders, then check whether that step completed successfully, and only continue on
to the next step, such as producing a report, if it did.

The CLLE program itself is not doing the detailed order processing; it is
coordinating when each piece of work happens and confirming that each step
finished before moving on to the next. This is a simplified, illustrative example
rather than a real system, but it reflects the kind of repeatable operational task
CLLE is commonly used for.

## Common Confusions

**"Is CLLE the same as RPGLE?"**
No. RPGLE usually contains business logic and data processing, while CLLE is often
used for orchestration and control flow around programs and commands. They serve
different, complementary roles.

**"Is CLLE only used for small, one-off tasks?"**
No. CLLE is commonly used for meaningful operational tasks, such as coordinating a
nightly process or automating a repeatable sequence of steps, not just quick
one-time actions.

**"Do I need to learn detailed CL syntax right now?"**
No. This lesson stays at a conceptual level. Detailed CL syntax and job-control
concepts are beyond the scope of this introductory lesson.

## Quick Recap

- CLLE stands for Control Language with ILE support.
- CLLE is commonly used to control jobs, run commands, call programs, automate
  steps, and coordinate IBM i processes.
- RPGLE usually contains business logic and data processing; CLLE is often used
  for orchestration and control flow around programs and commands.
- CLLE connects together the platform, libraries and objects, 5250 screens,
  physical and logical files, and RPGLE programs covered in earlier lessons.
- CLLE is commonly used for meaningful operational tasks, such as coordinating a
  nightly process or a repeatable sequence of steps.

## Try Asking the AI Tutor

Once the AI Tutor is available, you will be able to ask follow-up questions about
anything in this lesson. One thing you might ask:

- "What's the difference between CLLE and RPGLE?"
