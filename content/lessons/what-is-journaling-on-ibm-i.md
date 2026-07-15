# What is Journaling on IBM i?

## Learning Objective

By the end of this lesson, you will be able to explain what journaling
is and what kind of record it keeps of changes to a table.

## Simple Explanation

Every physical file or table covered earlier in this course simply
holds its current data: whatever the last `WRITE`, `UPDATE`, or
`DELETE` left behind, with no memory of what came before. **Journaling**
adds a separate, ongoing record of every change made to a journaled
object, capturing what changed, when, and by which job, independent of
the table's own current contents.

```clle
STRJRNPF FILE(MYLIB/CUSTMAST) JRN(MYLIB/CUSTJRN)
```

Once a table like `CUSTMAST` is journaled this way, every insert,
update, and delete against it is also recorded as a separate journal
entry, in addition to the change itself being applied to the table as
usual.

## Why It Matters

Without journaling, once a change happens, such as a customer's credit
limit being updated, the previous value is simply gone from the table
itself. Journaling keeps a running history of changes alongside the
table's current data, which is what makes recovery, auditing, and
commitment control, all covered later in this batch, possible in the
first place.

## Practical Example

Recall `CUSTMAST` from earlier in this course. Without journaling, an
accidental `UPDATE` that changed every customer's credit limit to zero
would leave no record of what the correct values used to be, beyond
whatever backup happens to exist. With `CUSTMAST` journaled, the
journal entries recorded before that mistaken update contain the actual
prior values, which is exactly the kind of information journaling
exists to preserve.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects exactly why journaling matters.

## Common Confusions

**"Is journaling the same thing as making a backup?"**
No. A backup is a snapshot taken at one point in time. Journaling
records every individual change continuously as it happens, which is a
different, complementary kind of protection.

**"Does journaling change what a normal READ or CHAIN operation
returns?"**
No. Reading a journaled table still returns its current data exactly
as before; journaling adds a separate record of changes alongside the
table, without changing how normal file operations behave.

**"Does every table need to be journaled?"**
Not necessarily. Journaling is most valuable for tables where the
history of changes genuinely matters, for recovery, auditing, or
commitment control, covered later in this batch, rather than being a
requirement for every table on the system.

## Quick Recap

- Journaling keeps an ongoing record of every change made to a
  journaled table, independent of the table's own current contents.
- `STRJRNPF` is the command that starts journaling a physical file
  against a journal.
- Journaling does not change how normal read or write operations work;
  it adds a separate record alongside them.
- Journaling is the foundation that makes recovery, auditing, and
  commitment control, all covered later in this batch, possible.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic example of why having a record of
  past changes, not just current data, would matter?"
- "Why might a shop choose to journal some tables but not others?"
