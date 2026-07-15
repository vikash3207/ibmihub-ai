# Common Advanced SQL Mistakes on IBM i

## Learning Objective

By the end of this lesson, you will be able to recognize the most
common mistakes developers make when first working with advanced Db2
for i SQL features, drawn from across both Advanced SQL batches.

## Simple Explanation

A handful of mistakes come up repeatedly once developers move beyond
basic embedded SQL into the topics covered across this batch and the
previous one:

- **Treating any non-zero SQLCODE as an error.** As covered earlier in
  this batch, a `100` simply means no row matched, which is often
  expected, not a failure.
- **Reaching for dynamic SQL by default.** Static SQL is simpler and
  checked earlier by the compiler; dynamic SQL should be a deliberate
  choice for genuinely runtime-varying statements, not a habit.
- **Adding a constraint to a table without checking existing data
  first.** As covered in Batch 1, a constraint added to a table that
  already violates it will fail, sometimes unexpectedly.
- **Forgetting that a trigger is running invisibly.** A developer
  troubleshooting unexpected behavior on a table can waste time if they
  forget to check for triggers, covered in Batch 1, in addition to the
  calling program's own logic.
- **Assuming more indexes always help.** As covered earlier in this
  batch, every index has its own cost, and the right index type,
  including whether an EVI genuinely fits, depends on the kind of query
  being optimized.

## Why It Matters

Every one of these mistakes shares the same thread already familiar
from the Common IBM i Integration Mistakes lesson: something can look
like it is working, a statement runs, a table changes, while a real
problem or missed opportunity is quietly present underneath.
Recognizing these patterns early is what separates advanced SQL work
that stays reliable and reasonably fast over time from advanced SQL
work that becomes a source of confusing, hard-to-diagnose problems.

## Practical Example

Imagine a developer investigating why an `UPDATE` statement against
`CUSTMAST` keeps returning `SQLCODE` `100` in production, and assumes
the update logic itself must be broken. Checking further, using the
job log and SQLCA diagnostics covered earlier in this batch, reveals
the customer number being passed in simply does not exist in this
environment's test data, exactly the kind of "no row found" outcome a
`100` is meant to represent, not a bug in the update logic at all.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common advanced SQL mistake.

## Common Confusions

**"If a statement runs without a negative SQLCODE, is it definitely
correct?"**
Not necessarily. A statement can run cleanly and still not do what was
intended, such as an `UPDATE` matching zero rows because of a
condition mistake, which is why understanding the full range of
`SQLCODE` values, not just success versus failure, matters.

**"Are these mistakes only a concern for large, complex database
schemas?"**
No. Even a small schema with a couple of tables, a constraint, and a
trigger can run into any of these, particularly misreading `SQLCODE`
or forgetting a trigger exists.

**"Is there one single habit that prevents most of these mistakes?"**
Not one single fix, but the common thread is treating advanced SQL
features as deliberately chosen tools with real tradeoffs, static
versus dynamic SQL, constraints, triggers, and index types, rather than
assuming any of them work identically to the simpler patterns covered
earlier in this course.

## Quick Recap

- Treating any non-zero SQLCODE as an error, defaulting to dynamic SQL,
  adding constraints without checking existing data, forgetting
  triggers run invisibly, and assuming more indexes always help are the
  most common advanced SQL mistakes covered across both batches.
- Many of these mistakes let a statement appear to run successfully
  while a real problem or missed opportunity is quietly present
  underneath.
- The underlying habit that prevents most of them is treating each
  advanced SQL feature as a deliberate choice with real tradeoffs,
  rather than assuming it behaves like the simpler patterns already
  familiar from earlier in this course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a short SQL scenario with one of these mistakes and
  ask me to spot it?"
- "Which of these mistakes would be hardest to notice during code
  review, and why?"
