# Subsystems Basics

## Learning Objective

By the end of this lesson, you will be able to explain what a subsystem
is, and how job queues connect to it.

## Simple Explanation

The IBM i Jobs Explained lesson mentioned that every job runs within a
**subsystem** without explaining it in detail. A subsystem is a
controlled operating environment IBM i uses to manage a group of jobs
together: how many can run at once, what resources they share, and where
their work actually comes from.

A common, typical IBM i system has several different subsystems set up
for different purposes, such as one handling interactive sessions and a
separate one handling batch work. A job queue, covered in the previous
lesson, is tied to a specific subsystem: batch jobs waiting on that job
queue are released into that particular subsystem to actually run once
it is their turn.

## Why It Matters

Understanding subsystems explains why interactive and batch work can
feel like they exist in somewhat separate worlds on IBM i: they commonly
run in different subsystems, each managed and resourced somewhat
independently. This also explains why a job queue and the subsystem it
feeds into are connected concepts, rather than a job queue being an
entirely standalone thing.

## Practical Example

Imagine an IBM i system with one subsystem dedicated to interactive
users signing on throughout the day, and a separate subsystem dedicated
to nightly batch processing. Batch jobs submitted with `SBMJOB` wait on a
job queue tied specifically to the batch subsystem, then run within that
subsystem once released, largely independent of whatever interactive
subsystem users happen to be signed on to at the same time.

This is a simplified, illustrative example rather than a specific real
system configuration, but it reflects a genuinely common, practical
reason IBM i systems are commonly organized this way.

## Common Confusions

**"Is a subsystem the same thing as a job queue?"**
No. A job queue holds jobs waiting to start, covered in the previous
lesson. A subsystem is the environment those jobs actually run within
once released from a job queue tied to it. The two are connected, but
are not the same thing.

**"Do interactive and batch jobs always run in different subsystems?"**
Commonly, yes, on a typical IBM i system set up with separate
subsystems for each purpose, though the exact configuration can vary. The
underlying idea worth understanding is that subsystems provide this kind
of separation, not that every system is configured identically.

**"Do I need to know how to configure a subsystem to understand this
lesson?"**
No. Detailed subsystem configuration is a more advanced administrative
topic beyond this introduction. This lesson focuses on understanding
what a subsystem is and why it exists, from a developer's perspective,
rather than how to set one up.

## Quick Recap

- A subsystem is a controlled operating environment IBM i uses to manage
  a group of jobs together.
- A typical IBM i system has several subsystems, commonly separating
  interactive work from batch work.
- A job queue is tied to a specific subsystem; jobs released from that
  queue run within that subsystem.
- Detailed subsystem configuration is an advanced administrative topic
  beyond this developer-focused introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if a job queue were not tied to any subsystem at
  all?"
- "Why might a company choose to run more subsystems rather than just
  one for everything?"
