# Backup vs Journaling vs High Availability

## Learning Objective

By the end of this lesson, you will be able to explain how backup,
journaling, and high availability are three distinct, complementary
concepts.

## Simple Explanation

These three concepts are often mentioned together, but each answers a
genuinely different question:

- **Backup**: a point-in-time saved copy of objects, covered throughout
  this batch, answering "what did this look like at the moment it was
  saved?"
- **Journaling**: an ongoing record of changes to a journaled object,
  covered earlier in this course, answering "what changed, and when,
  since journaling started?"
- **High availability (HA)**: a strategy for keeping a system, or its
  data, continuously available, often by replicating changes to
  another system, answering "how do we keep running with little or no
  interruption if something fails?"

## Why It Matters

Confusing these three leads to real gaps: a backup alone cannot recover
changes made after the last save; journaling alone does not provide a
separate, replicated system to fail over to; and HA alone does not
replace having point-in-time saved copies for other purposes, such as
restoring a test library, covered earlier in this batch. Recognizing
that each serves a different purpose is what allows them to be used
together correctly, rather than assuming one makes the others
unnecessary.

## Practical Example

Imagine a system that only has nightly backups, no journaling, and no
HA. If it fails at 3pm, everything since the previous night's backup is
lost, since there is no ongoing change record to reapply and no
replicated system to switch to. Adding journaling means those changes
since the backup could potentially be reapplied during recovery.
Adding HA means a replicated system could take over with much less
interruption in the first place. Each addition answers a different part
of the overall reliability picture.

This is a simplified, illustrative example rather than a specific real
system, but it reflects exactly why these three concepts are typically
discussed together.

## Common Confusions

**"If a system has good backups, is journaling still necessary?"**
Depends on what is needed: backups alone only restore to the point of
the last save, losing anything since. Journaling, covered earlier in
this course, fills that gap for journaled objects by recording changes
continuously.

**"Does having HA mean regular backups are no longer needed?"**
No. HA is about continuity, minimizing interruption if a system fails.
It does not replace the need for point-in-time saved copies for other
purposes, such as the development and test scenarios covered throughout
this batch.

**"Is designing a complete backup, journaling, and HA strategy covered
in this lesson?"**
No. This lesson stays at the conceptual level: understanding that these
are three distinct, complementary concepts. Designing a complete
strategy combining all three for a real system is a deeper topic,
along with related technologies like BRMS and PowerHA, beyond this
introductory course.

## Quick Recap

- Backup is a point-in-time saved copy; journaling is an ongoing record
  of changes; high availability is a strategy for continuous
  availability, often through replication.
- Each answers a different question, and gaps appear when one is
  assumed to cover what only another actually provides.
- These three concepts are complementary, not substitutes for one
  another.
- Designing a complete strategy combining all three is a deeper topic
  beyond this introductory course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through a scenario where having only backups, but
  no journaling, would cause a real problem during recovery?"
- "Why are backup, journaling, and HA usually discussed together rather
  than as completely separate topics?"
