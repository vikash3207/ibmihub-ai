# Host Variables in SQLRPGLE

## Learning Objective

By the end of this lesson, you will be able to explain what a host
variable is, and correctly use the colon prefix to reference one inside
an embedded SQL statement.

## Simple Explanation

The `EXEC SQL` examples in the previous lessons already used names like
`:custName` and `:custNbr`, without a detailed explanation. A **host
variable** is simply an ordinary RPGLE variable, declared the normal way
with `dcl-s`, that is referenced from inside an embedded SQL statement.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);

custNbr = 1042;

exec sql
  select CUSTNAME into :custName
  from CUSTMAST
  where CUSTNBR = :custNbr;
```

Here, `custNbr` and `custName` are declared exactly like any other RPGLE
variable, covered in the Variables and Data Types in RPGLE lesson.
Inside the `EXEC SQL` block, each one is written with a leading **colon**,
`:custNbr` and `:custName`, which tells SQL that this name refers to an
RPGLE host variable rather than a column in `CUSTMAST`. Without the
colon, SQL would instead look for a column with that exact name.

## Why It Matters

The colon prefix is what lets an embedded SQL statement move data back
and forth between the RPGLE program and Db2 for i: values already in
RPGLE variables can be used inside a `WHERE` clause, and values retrieved
by SQL can be placed directly into RPGLE variables. Beginners often forget
the colon or add it somewhere it does not belong, so being precise about
exactly where it goes matters.

## Practical Example

Imagine the customer lookup shown above. `custNbr` already holds the
value `1042`, set by ordinary RPGLE code before the `EXEC SQL` block.
Inside the block, `:custNbr` tells SQL to use that RPGLE variable's
current value in the `WHERE` clause, and `:custName` tells SQL where to
place the retrieved `CUSTNAME` column's value once the statement runs.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how host variables connect RPGLE
variables to embedded SQL statements.

## Common Confusions

**"Does CUSTNAME in this example need a colon too?"**
No. `CUSTNAME` here refers to an actual column in `CUSTMAST`, not an
RPGLE variable, so it is written without a colon. Only RPGLE host
variables, like `:custName` and `:custNbr`, get the colon prefix.

**"Can a host variable have the exact same name as a column, like
CUSTNBR the column and custNbr the variable?"**
Yes, this is actually common, and the colon is exactly what tells SQL
which one you mean in each spot: `CUSTNBR` without a colon refers to the
column, while `:custNbr` with a colon refers to the RPGLE variable. Using
different letter casing, as in this lesson's examples, can also make the
two easier to tell apart while reading.

**"Do host variables need to be declared any differently from regular
RPGLE variables?"**
No. A host variable is declared exactly like any other RPGLE variable,
using `dcl-s` as covered in the Variables and Data Types in RPGLE lesson.
Nothing about its declaration changes; only its use inside an `EXEC SQL`
block, with a leading colon, is different.

## Quick Recap

- A host variable is an ordinary RPGLE variable, declared normally with
  `dcl-s`, that is referenced inside an embedded SQL statement.
- Inside an `EXEC SQL` block, a host variable is written with a leading
  colon, such as `:custNbr`, to distinguish it from a table column name.
- A column name inside an `EXEC SQL` block is written without a colon.
- A host variable and a column can share a similar name; the colon is
  what tells SQL which one is meant in each specific spot.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I forgot the colon before a host variable inside
  an EXEC SQL statement?"
- "Can a host variable be used more than once inside the same EXEC SQL
  statement?"
