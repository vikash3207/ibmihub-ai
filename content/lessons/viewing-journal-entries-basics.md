# Viewing Journal Entries Basics

## Learning Objective

By the end of this lesson, you will be able to explain what a journal
entry contains and how to view journal entries for a table at a basic
level.

## Simple Explanation

Each change to a journaled table produces a **journal entry**: a
record of what kind of change happened (insert, update, or delete),
when it happened, which job made it, and the data involved. `DSPJRN`
displays these entries:

```clle
DSPJRN JRN(MYLIB/CUSTJRN) FILE((MYLIB/CUSTMAST)) OUTPUT(*PRINT)
```

A command like this displays journal entries recorded for `CUSTMAST`
specifically, even though `CUSTJRN` might hold entries for other
journaled tables too.

## Why It Matters

The Investigating Authority Failures and Auditing lessons elsewhere in
this course covered checking the job log and `QAUDJRN` for evidence
about what happened. Journal entries for a table provide a similar
kind of evidence, but specifically about data changes: what a row's
value used to be before an update, or that a specific row was deleted
and by which job, which neither the job log nor `QAUDJRN` records in
that level of detail for ordinary table changes.

## Practical Example

Recall the accidental credit-limit update from the What is Journaling
lesson earlier in this batch. Reviewing `CUSTJRN`'s entries for
`CUSTMAST` around the time of that update would show the actual prior
credit limit values recorded in the journal entries, along with which
job performed the update, information that would not be available from
the table's current data alone, which by then only shows the mistaken
values.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects exactly how journal entries are used in
practice.

## Common Confusions

**"Is DSPJRN the same command used for QAUDJRN, covered earlier in this
course?"**
Yes, the same command works for both, since `QAUDJRN` is itself a
journal. The difference is which journal, and which kind of entries,
are being displayed: `QAUDJRN` for system-wide security events, or a
table's own journal for that table's data changes.

**"Does reviewing journal entries require deep forensic analysis
skills?"**
Not at this introductory level. Understanding that journal entries
exist, what they generally contain, and how to display them for a
specific table is the useful conceptual takeaway here. Deep, systematic
journal-entry analysis for complex investigations is a more advanced
topic beyond this lesson.

**"Are journal entries only useful after something has already gone
wrong?"**
Not only. They are also useful for auditing and tracking changes over
time generally, covered in the Journaling for Recovery and Auditing
lesson later in this batch, not solely for reacting to a mistake after
the fact.

## Quick Recap

- A journal entry records what kind of change happened, when, by which
  job, and the data involved, for a journaled table.
- `DSPJRN` displays journal entries, and can be scoped to a specific
  table even when a journal holds entries for several journaled tables.
- Journal entries provide detailed evidence about data changes that
  neither the job log nor `QAUDJRN` capture at that level of detail.
- This lesson stays at a basic level; deep, systematic journal-entry
  analysis is a more advanced topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through what a journal entry for a single UPDATE
  might conceptually contain?"
- "Why might reviewing journal entries be more useful than just
  checking the job log after an unexpected data change?"
