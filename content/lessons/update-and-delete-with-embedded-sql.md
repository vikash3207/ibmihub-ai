# UPDATE and DELETE with Embedded SQL

## Learning Objective

By the end of this lesson, you will be able to use embedded `UPDATE` and
`DELETE` statements with a `WHERE` clause, and explain how this differs
from native `UPDATE` and `DELETE`, which always act on the most recently
retrieved record.

## Simple Explanation

Native `UPDATE` and `DELETE`, covered earlier in this path, always act on
whichever record was most recently retrieved for a file, generally with
`CHAIN` after confirming `%FOUND`. Embedded SQL's `UPDATE` and `DELETE`
work differently: a `WHERE` clause directly identifies which row or rows
to change or remove, without needing a preceding retrieval step at all.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custBal packed(9:2);

custNbr = 1042;
custBal = 500.00;

exec sql
  update CUSTMAST
  set CUSTBAL = :custBal
  where CUSTNBR = :custNbr;

exec sql
  delete from CUSTMAST
  where CUSTNBR = :custNbr;
```

Here, the `UPDATE` statement sets `CUSTBAL` to `:custBal`'s value for
whichever row matches `CUSTNBR = :custNbr`, and the `DELETE` statement
removes whichever row matches that same condition, each acting directly
on the database rather than on a previously retrieved record. `SQLCODE`
is checked afterward to confirm a row was actually matched and affected.

## Why It Matters

This is one of the most important conceptual differences between native
file I/O and embedded SQL covered in this lesson group: native `UPDATE`
and `DELETE` require a prior successful `CHAIN` or `READ`, while embedded
SQL `UPDATE` and `DELETE` specify the target row directly through a
`WHERE` clause. Understanding this difference prevents a common
misconception that embedded SQL `UPDATE`/`DELETE` need a preceding
`SELECT INTO` first, the way native code needs a preceding `CHAIN`.

## Practical Example

Imagine the payment-processing task covered earlier with native `UPDATE`.
Using native RPGLE, the program used `CHAIN` to retrieve the customer
record, confirmed `%FOUND`, then called `UPDATE`. Using embedded SQL
instead, the program can update that customer's balance directly with a
single `UPDATE` statement and a `WHERE CUSTNBR = :custNbr` clause,
without a separate retrieval step first. The same difference applies to
removing a customer record with embedded `DELETE` compared to native
`DELETE`.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how embedded SQL `UPDATE` and `DELETE`
work directly against the database rather than against a previously
retrieved record.

## Common Confusions

**"Do I need to SELECT INTO a row before I can UPDATE or DELETE it with
embedded SQL?"**
No, and this is the key difference from native file I/O covered in this
lesson. Embedded SQL `UPDATE` and `DELETE` identify their target row
directly through a `WHERE` clause; no preceding retrieval step is needed.

**"What happens if the WHERE clause on an embedded UPDATE or DELETE
matches more than one row?"**
Every matching row is updated or deleted, not just one. This is different
from native `UPDATE`/`DELETE`, which always act on exactly the single
most recently retrieved record. Writing a `WHERE` clause precise enough
to match only the intended row or rows matters.

**"How do I know if an embedded UPDATE or DELETE actually matched and
changed a row?"**
Check `SQLCODE` afterward. A `SQLCODE` of `100` indicates no row matched
the `WHERE` clause, so nothing was changed, similar in spirit to a native
`CHAIN` that found nothing.

## Quick Recap

- Embedded `UPDATE ... SET col = :hostVar WHERE condition;` and
  `DELETE FROM table WHERE condition;` act directly on whichever row or
  rows match the `WHERE` clause.
- Unlike native `UPDATE`/`DELETE`, embedded SQL `UPDATE`/`DELETE` do not
  require a preceding `CHAIN`, `READ`, or `SELECT INTO`.
- A `WHERE` clause matching more than one row causes every matching row
  to be updated or deleted, not just one.
- Checking `SQLCODE` afterward confirms whether a row was actually
  matched and changed.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if my WHERE clause on an embedded DELETE
  accidentally matched every row in the table?"
- "Is there a way to see how many rows an embedded UPDATE or DELETE
  actually changed?"
