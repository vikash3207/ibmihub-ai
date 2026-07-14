# Object Locks Basics

## Learning Objective

By the end of this lesson, you will be able to explain what an object
lock is, how it differs from a record lock, and use `WRKOBJLCK` to see
what is locking an object.

## Simple Explanation

The Basic File Locking Concept in RPGLE lesson covered a **record
lock**: one specific row within an open file, locked while a program
retrieves it for update. An **object lock** works at a different, broader
level: it can lock an entire object, such as a whole file, program, or
data area, sometimes preventing anyone else from using it at all while
the lock is held.

`WRKOBJLCK` (Work with Object Locks) shows what locks currently exist on
a specific object, and which job holds each one, letting a developer see
exactly what is preventing, or being prevented by, access to that
object.

## Why It Matters

Object locks explain a different category of everyday problem than
record locks do: not "this one row is temporarily locked by another
job," but "this entire object is unavailable right now because another
job has it locked," such as being unable to recompile a program while it
is still actively running in another job. Recognizing this as a distinct
kind of lock, and knowing `WRKOBJLCK` exists to investigate it, is a
practical, everyday troubleshooting skill.

## Practical Example

Imagine a developer trying to recompile the `CUSTRPT` program while it
happens to still be running in another user's job. The compile attempt
fails because that other job holds an object lock on `CUSTRPT` while
using it. Running `WRKOBJLCK` against `CUSTRPT` shows exactly which job
holds that lock, letting the developer confirm the cause and decide
whether to wait for that job to finish or investigate further.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a genuinely common, practical reason
object locks matter to developers, not just system administrators.

## Common Confusions

**"Is an object lock the same thing as a record lock?"**
No. A record lock, covered in the Basic File Locking Concept in RPGLE
lesson, locks one specific row within an open file. An object lock can
lock an entire object, such as a whole program or file, at a broader
level.

**"Does an object lock always prevent every kind of access to that
object?"**
Not necessarily every kind; different lock types can allow some kinds of
access while restricting others, such as allowing an object to still be
read while preventing it from being changed or deleted. This lesson
covers the basic concept rather than every specific lock type's exact
rules.

**"Why would recompiling a program fail because of an object lock?"**
Recompiling replaces the program object entirely, which generally
requires an exclusive lock on it; if another job already holds a lock on
that same object simply by having it active and in use, the compile
cannot proceed until that lock is released.

## Quick Recap

- A record lock locks one specific row within an open file; an object
  lock can lock an entire object, such as a whole program or file.
- `WRKOBJLCK` (Work with Object Locks) shows what locks currently exist
  on a specific object and which job holds each one.
- Object locks explain common situations like being unable to recompile a
  program that is currently active in another job.
- Not every object lock blocks every kind of access; some allow certain
  uses while restricting others.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would I do if WRKOBJLCK shows another job holding a lock I need
  released?"
- "Can a single object have locks held by more than one job at the same
  time?"
