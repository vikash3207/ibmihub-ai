# Common RPGLE File I/O Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize the most common
beginner mistakes across native RPGLE file I/O, and apply a simple set of
best practices to avoid them.

## Simple Explanation

This lesson brings together the native RPGLE file I/O operations covered
across both this lesson group and the earlier RPGLE File I/O Batch 1
lessons, `READ`, `CHAIN`, `SETLL`, `READE`, `READP`, `WRITE`, `UPDATE`, and
`DELETE`, into one focused list of the mistakes beginners make most often,
and the simple habits that avoid them.

A few of the most common mistakes:

- **Forgetting to check %FOUND after CHAIN, or %EOF after READ/READE.** As
  covered throughout this lesson group, skipping this check means the
  program may use stale or unrelated field values as if a real record had
  been retrieved.
- **Forgetting `keyed` on `dcl-f`.** `CHAIN`, `SETLL`, `READE`, and `READP`
  all depend on the file being declared `keyed`, as covered in the RPGLE
  File Declarations with dcl-f lesson; leaving it off causes these
  operations to fail to compile or behave unexpectedly.
- **Using CHAIN where duplicate keys need READE instead.** As covered in
  the Processing Duplicate Keys in RPGLE lesson, `CHAIN` only ever
  retrieves the first matching record, silently missing any others sharing
  that key.
- **Calling UPDATE or DELETE without a preceding successful CHAIN.** As
  covered in the Updating Records with UPDATE and Deleting Records with
  DELETE lessons, both operations act on whichever record was most
  recently retrieved; without that step, there is no specific record for
  them to act on.
- **Not accounting for record locks.** As covered in the Basic File
  Locking Concept in RPGLE lesson, a record being briefly locked by another
  job is a normal, expected situation in a multi-user system, not a sign of
  a bug.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
chain custNbr ORDHIST;
if %found(ORDHIST);
  update ORDHIST;
endif;
```

This short example already reflects two of the best practices above:
`keyed` is declared on `dcl-f`, and `%found(ORDHIST)` is checked before
`UPDATE` is ever called.

## Why It Matters

Almost every native file I/O bug in beginner RPGLE code traces back to one
of a small number of familiar mistakes. Recognizing this short, repeatable
list turns file I/O debugging from an open-ended search into a quick
checklist, and helps new code avoid these mistakes in the first place.

## Practical Example

Imagine reviewing a new program that reads `ORDHIST` and occasionally
behaves unexpectedly for customers with more than one order. Checking
against this list quickly surfaces the likely cause: the program uses
`CHAIN` where a `SETLL`/`READE` loop was actually needed, exactly the
duplicate-key mistake described above, rather than a more obscure or
unrelated problem.

This is a simplified, illustrative example rather than a specific real
review, but it reflects how useful a short, known list of common mistakes
is when reading or debugging file I/O code.

## Common Confusions

**"Are these mistakes only made by beginners?"**
They are most common among beginners, but even experienced developers
occasionally slip up on one of these, especially forgetting a `%FOUND` or
`%EOF` check in a hurried change. The value of this list is in having a
quick, repeatable checklist to reach for, regardless of experience level.

**"Is this the complete list of every possible RPGLE file I/O mistake?"**
No. This lesson focuses on the most common mistakes connected to the
native operations covered across this lesson group and RPGLE File I/O
Batch 1. More advanced topics, such as commitment control or detailed file
status handling, have their own, separate set of considerations beyond
this introduction.

**"Which mistake on this list is most important to avoid?"**
All five matter, but forgetting to check `%FOUND` or `%EOF` is likely the
single most common source of subtle, hard-to-notice bugs, since the
program keeps running instead of failing outright, often producing quietly
wrong results.

## Quick Recap

- The most common native RPGLE file I/O mistakes are: skipping `%FOUND`/
  `%EOF` checks, forgetting `keyed` on `dcl-f`, using `CHAIN` where
  duplicate keys need `READE`, calling `UPDATE`/`DELETE` without a
  preceding successful retrieval, and not accounting for record locks.
- Checking this short list first turns file I/O debugging into a quick
  checklist rather than an open-ended search.
- This list focuses on native file I/O as covered across this lesson group
  and RPGLE File I/O Batch 1; more advanced topics have their own separate
  considerations.
- Even experienced developers occasionally make these same mistakes, which
  is exactly why the checklist stays useful over time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Which of these common mistakes is easiest to accidentally reintroduce
  when modifying existing code?"
- "How would I explain the CHAIN versus READE mistake to someone new to
  RPGLE?"
