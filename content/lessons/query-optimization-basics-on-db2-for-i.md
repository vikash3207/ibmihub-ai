# Query Optimization Basics on Db2 for i

## Learning Objective

By the end of this lesson, you will be able to explain, at a
conceptual level, what a query optimizer does and how indexes
influence its choices.

## Simple Explanation

When a `SELECT` statement runs, Db2 for i does not simply scan the
whole table blindly. An internal component called the **optimizer**
looks at the query and decides how to actually retrieve the matching
rows, called a query's **access plan**. The optimizer's decisions are
influenced heavily by what indexes and access paths already exist on
the table, covered earlier in this course and in this batch.

```sql
SELECT CUSTNAME, CREDITLIMIT
FROM MYLIB.CUSTMAST
WHERE CUSTNBR = 100234;
```

If an index or access path exists on `CUSTNBR`, the optimizer can use
it to jump almost directly to the matching row. Without one, the
optimizer may need to examine far more of the table to find the same
row.

## Why It Matters

The same `SELECT` statement can run dramatically faster or slower
depending entirely on what indexes exist, without a single line of the
query itself changing. Understanding that the optimizer's choices
depend on available indexes explains why adding the right index can
improve a slow query, and why query performance is not solely
determined by how the SQL statement is written.

## Practical Example

Recall the `CUSTNBR_IDX` index created in the SQL Indexes and Views
lesson earlier in this batch. A query filtering by `CUSTNBR`, like the
one above, can use that index to find the matching row quickly. Before
that index existed, the optimizer would have had no fast path to that
row and would likely have needed to examine a much larger portion of
`CUSTMAST` to find it, exactly the situation an index like `CUSTNBR_IDX`
is meant to prevent.

This is a simplified, illustrative example rather than a specific real
performance investigation, but it reflects exactly how indexes
influence optimizer behavior.

## Common Confusions

**"Does adding more indexes always make queries faster?"**
Not automatically, and this lesson stays at a conceptual level rather
than a full tuning strategy. Indexes help the optimizer, but every
index also has its own cost, such as being maintained whenever the
underlying table changes. Deciding exactly which indexes are worth
adding is a deeper topic than this introductory lesson covers.

**"Does the optimizer's decision ever change for the exact same
query?"**
Yes, it can. Since the optimizer's decision depends on the current
indexes, access paths, and the data itself, its chosen access plan for
the same query can change over time as the table and its indexes
change.

**"Do I need to understand the optimizer deeply to write good SQL?"**
Not at this level. Understanding that an optimizer exists, and that its
choices depend heavily on available indexes, is enough to reason about
why a query might be slow and what kind of change, like adding an
index, might help. Deeper optimizer internals are beyond this
introductory lesson.

## Quick Recap

- The optimizer decides how a query actually retrieves its matching
  rows, called its access plan.
- The optimizer's choices depend heavily on what indexes and access
  paths already exist on the table.
- The same query can run at very different speeds depending entirely
  on available indexes, without the SQL itself changing.
- This lesson stays conceptual; deciding exactly which indexes to add
  for a specific workload is a deeper topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through, conceptually, why a missing index might
  make a query slower without the query itself being wrong?"
- "Why does every index also have a cost, rather than being purely
  beneficial to add?"
