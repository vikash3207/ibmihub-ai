# Starting Journaling with STRJRNPF

## Learning Objective

By the end of this lesson, you will be able to explain the basic steps
involved in starting journaling for a physical file.

## Simple Explanation

Turning on journaling for a table involves a few pieces already
introduced earlier in this batch, brought together: a journal receiver
to hold entries, a journal to point at that receiver, and finally
`STRJRNPF` to actually start journaling the table itself.

```clle
CRTJRNRCV JRNRCV(MYLIB/CUSTJRN0001)
CRTJRN JRN(MYLIB/CUSTJRN) JRNRCV(MYLIB/CUSTJRN0001)
STRJRNPF FILE(MYLIB/CUSTMAST) JRN(MYLIB/CUSTJRN)
```

Once this runs successfully, every insert, update, and delete against
`CUSTMAST` also produces a journal entry in `CUSTJRN0001`, exactly as
described in the What is Journaling lesson earlier in this batch.

## Why It Matters

Seeing the actual sequence, create a receiver, create a journal
pointing at it, then start journaling the table, makes the relationship
between these objects concrete rather than abstract. This is also the
point at which a table transitions from having no change history at
all to having every subsequent change recorded, which is a meaningful
step that should be taken deliberately, not accidentally.

## Practical Example

Imagine `CUSTMAST` has been in use for some time without journaling.
Running the three commands above starts recording every change from
that point forward, but it does not retroactively create entries for
changes that already happened before journaling started. Understanding
this distinction, journaling only covers changes made after it starts,
not a table's entire history, matters for setting expectations
correctly.

This is a simplified, illustrative example rather than a specific real
migration, but it reflects exactly how journaling gets started in
practice.

## Common Confusions

**"Does STRJRNPF also create the journal and receiver automatically?"**
No. The journal and its receiver need to already exist, created with
`CRTJRNRCV` and `CRTJRN` as shown above, before `STRJRNPF` can point a
table at that journal.

**"Does starting journaling capture changes that happened before
STRJRNPF ran?"**
No. Journaling only records changes made after it starts. Changes made
to the table before that point are not retroactively captured.

**"Can more than one table be journaled to the same journal?"**
Yes. A single journal, and its receivers, can hold entries from
multiple journaled tables at once; a shop is not limited to one
journal per table.

## Quick Recap

- Starting journaling for a table involves creating a receiver,
  creating a journal pointing at that receiver, and then running
  `STRJRNPF` to journal the table itself.
- Journaling only records changes made after it starts, not a table's
  history before that point.
- A single journal and its receivers can hold entries from multiple
  journaled tables.
- This sequence brings together the journal, receiver, and journaled
  table concepts already introduced earlier in this batch.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why does it matter that journaling only captures changes going
  forward, not a table's past history?"
- "What would happen if I ran STRJRNPF against a table but pointed it
  at a journal that did not actually exist yet?"
