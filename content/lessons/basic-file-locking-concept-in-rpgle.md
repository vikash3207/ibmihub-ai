# Basic File Locking Concept in RPGLE

## Learning Objective

By the end of this lesson, you will understand what a record lock is at a
beginner level, why IBM i uses them, and how they relate to `UPDATE` and
`DELETE`.

## Simple Explanation

In the Updating Records with UPDATE and Deleting Records with DELETE
lessons, a record was always retrieved with `CHAIN` before being changed or
removed. When a record is retrieved specifically in preparation for
`UPDATE` or `DELETE`, IBM i places a **record lock** on it, preventing
other jobs from changing that same record at the same time.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
chain custNbr ORDHIST;
if %found(ORDHIST);
  // ORDHIST's record for custNbr is now locked, ready for UPDATE or DELETE
  update ORDHIST;
endif;
```

Here, once `chain custNbr ORDHIST;` successfully finds the record, IBM i
locks that specific record until the program either changes it with
`UPDATE`, removes it with `DELETE`, or otherwise releases the lock. This
protects against two different jobs both trying to change the same record
at the same moment, which could otherwise leave the data in an inconsistent
state.

## Why It Matters

Record locking is a basic but essential part of how IBM i keeps data
consistent when multiple jobs might work with the same file at once. Even
at a beginner level, knowing that retrieving a record for update
temporarily locks it, and that another job trying to lock the same record
at the same time will have to wait or receive an error, is important for
understanding why some file operations can occasionally seem to pause
briefly.

## Practical Example

Imagine two different users both viewing the update/delete subfile pattern
for `ORDHIST` at nearly the same moment, and both trying to update the same
order record. Whichever program's `CHAIN` locks the record first proceeds
normally; the second program's attempt to lock that same record will
either wait briefly for the lock to be released, or, depending on how the
program is written, receive an indication that the record is currently
locked.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuine, everyday situation in multi-user IBM i
applications.

## Common Confusions

**"Does every CHAIN lock a record?"**
Generally, a record is locked when it is retrieved in a way intended for
update, such as in preparation for `UPDATE` or `DELETE`. A record read only
for display, with no intention of changing it, does not need to hold that
same kind of lock. This lesson covers the basic concept rather than every
detailed rule governing exactly when locking occurs.

**"What happens if a program tries to lock a record that is already
locked by another job?"**
At a beginner level, the program either waits briefly for the lock to
become available, or receives an indication that the record could not be
locked, depending on how the program is written. The detailed mechanics of
handling that situation belong to more advanced coverage beyond this
introduction.

**"How does a lock get released?"**
Successfully completing `UPDATE` or `DELETE` on the locked record releases
its lock. A program can also release a lock without changing the record.
This lesson stays at this basic conceptual level; the full set of ways a
lock can be released is beyond this introduction.

## Quick Recap

- A record lock prevents more than one job from changing the same record
  at the same time.
- Retrieving a record in preparation for `UPDATE` or `DELETE` typically
  locks that specific record.
- Another job trying to lock the same record at the same time will wait
  briefly or receive an indication the record is locked.
- Successfully completing `UPDATE` or `DELETE` releases the lock on that
  record.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would a user actually see on their screen if they tried to update
  a record someone else already has locked?"
- "Is there a way to retrieve a record for update without locking it?"
