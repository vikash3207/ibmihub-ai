# Why Backup and Restore Matter on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain why understanding
save and restore basics matters for a developer, not only for a system
administrator.

## Simple Explanation

**Save** and **restore** are IBM i's basic mechanism for copying
objects, such as files, programs, and libraries, out to a saved form,
and later bringing them back. A developer runs into this far more often
than it might first seem:

- **Before a risky change**, saving an object first means a way back if
  the change goes wrong.
- **Before refreshing test data**, restoring a known-good copy of a
  library gives a clean, predictable starting point.
- **Before replacing an object**, such as a program being recompiled,
  having a saved copy of the previous version provides a safety net.
- **When investigating a missing or unexpectedly restored object**,
  understanding save and restore explains how it might have gotten that
  way.
- **When coordinating deployment or support work**, knowing what was
  saved, and when, is often part of understanding what actually
  changed.

## Why It Matters

A developer who only thinks of save and restore as "something the
admin team handles" misses a genuinely useful, everyday tool: a
deliberate way to protect their own work before a risky change, and a
common source of clues when investigating why an object looks different
than expected. Understanding the basics is not about becoming a backup
administrator; it is about using a tool that is already part of the
platform responsibly.

## Practical Example

Imagine a developer about to make a significant change to a program
that several other applications depend on. Saving the current version
of that program first, before making the change, means that if the
change causes an unexpected problem, the previous, working version can
be restored quickly, rather than trying to reconstruct it from memory
or source control alone.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects exactly why save and restore matter in
everyday development work.

## Common Confusions

**"Isn't backup and restore only relevant for full system disaster
recovery?"**
No. Full system backup and recovery planning is a real, important
topic, but this batch focuses on the everyday, object-level and
library-level save and restore operations a developer might use
directly, such as before a risky change or a test data refresh.

**"Does understanding save/restore mean I need to manage a shop's
overall backup strategy?"**
No. This batch stays at the level of understanding the basic commands
and concepts well enough to use them responsibly and to reason about
what happened when something was saved or restored, not designing a
complete backup strategy for a system.

**"Is journaling, covered earlier in this course, the same thing as a
backup?"**
No, and this distinction is covered in more depth later in this batch.
Journaling records an ongoing history of changes; a backup is a
saved, point-in-time copy. Both matter, but for different reasons.

## Quick Recap

- Save and restore let objects be copied out to a saved form and later
  brought back, and are genuinely useful for developers, not only
  system administrators.
- Common developer use cases include protecting work before a risky
  change, refreshing test data, and investigating unexpected object
  changes.
- This batch focuses on everyday, object-level and library-level save
  and restore, not full system disaster recovery planning.
- Journaling and backup are related but distinct concepts, covered in
  more depth later in this batch.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic example of when a developer,
  rather than an administrator, would want to save an object
  themselves?"
- "Why might a developer want to save an object even if the shop
  already has a regular backup schedule?"
