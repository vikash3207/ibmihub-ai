# Journal Receivers Explained

## Learning Objective

By the end of this lesson, you will be able to explain what a journal
receiver is and why it must be managed over time.

## Simple Explanation

The previous lesson introduced the journal as the object a journaled
table's changes are recorded against. The journal itself does not
actually store the journal entries directly; it writes them into a
**journal receiver**, a separate object that holds the actual entries.

```clle
CRTJRNRCV JRNRCV(MYLIB/CUSTJRN0001)
CRTJRN JRN(MYLIB/CUSTJRN) JRNRCV(MYLIB/CUSTJRN0001)
```

As entries accumulate, a journal receiver grows. Eventually, a shop
attaches a new receiver to the journal, so new entries go into the new
receiver while the old, now-full one can be saved and, eventually,
removed.

## Why It Matters

A journal receiver is a real object that takes up storage and keeps
growing as long as journaling is active. Without deliberately managing
receivers, changing to a new one periodically and dealing with old
ones, a shop would eventually run into a single, enormous receiver
consuming significant storage indefinitely. Understanding that
receivers are separate, managed objects, not an invisible, infinite log,
is essential to using journaling responsibly.

## Practical Example

Recall `CUSTJRN` and `CUSTJRN0001` from above. As `CUSTMAST` changes
accumulate in `CUSTJRN0001` over weeks of normal business activity, a
shop periodically changes to a fresh receiver, `CUSTJRN0002`, so
`CUSTJRN0001` stops growing and can be saved to tape or another medium
for safekeeping, then eventually deleted once it is no longer needed.
Without this periodic change, `CUSTJRN0001` alone would keep growing
indefinitely, with all of a system's journal history concentrated in
one ever-larger object.

This is a simplified, illustrative example rather than a specific real
management schedule, but it reflects exactly why receivers need
attention over time.

## Common Confusions

**"Is a journal receiver the same thing as the journal itself?"**
No. The journal is the object a table is journaled against; the
receiver is where that journal's entries are actually stored. A
journal always has a current receiver attached, and receivers can be
changed over time without changing the journal itself.

**"Does changing to a new journal receiver lose the entries in the old
one?"**
No. The old receiver still holds its entries; it simply stops
receiving new ones once a new receiver is attached. The old receiver
can still be saved, or its entries reviewed, later.

**"Is deciding exactly how often to change receivers something covered
in this lesson?"**
No. This lesson introduces why receivers exist and why they need
periodic attention; deciding a specific receiver-change schedule or
retention strategy for a real system is a deeper topic beyond this
introductory lesson.

## Quick Recap

- A journal receiver is the object that actually stores a journal's
  entries; the journal itself points to whichever receiver is
  currently active.
- Receivers grow as changes accumulate, and shops periodically attach
  a new receiver so the old one can be saved and eventually removed.
- Without managing receivers, a single receiver would grow
  indefinitely, consuming storage without bound.
- This lesson introduces the concept only; a full receiver management
  strategy is a deeper topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why does it matter that old journal receivers can still be saved
  even after a new one is attached?"
- "What questions would I need to answer before deciding how often a
  shop should change journal receivers?"
