# Native RPGLE File I/O vs Embedded SQL

## Learning Objective

By the end of this lesson, you will be able to compare native RPGLE file
I/O operations directly against their embedded SQL equivalents, and
explain when each approach tends to fit better.

## Simple Explanation

Every native operation covered earlier in this path has a rough embedded
SQL equivalent, though the two approaches think about data quite
differently:

- Reading one specific record: `CHAIN` natively, `SELECT INTO` with
  embedded SQL.
- Reading many records in a loop: `READ` in a loop natively, a cursor
  with `FETCH` in a loop for embedded SQL.
- Reading only matching duplicate keys: `SETLL` plus `READE` natively, a
  cursor with a `WHERE` clause for embedded SQL.
- Adding a new record: `WRITE` natively, `INSERT` for embedded SQL.
- Changing an existing record: `UPDATE` after a `CHAIN` natively,
  `UPDATE` with a `WHERE` clause for embedded SQL.
- Removing a record: `DELETE` after a `CHAIN` natively, `DELETE` with a
  `WHERE` clause for embedded SQL.

Native RPGLE operations work one record at a time, always relative to
whatever was most recently retrieved for that file, exactly as covered
throughout the RPGLE File I/O lessons. Embedded SQL statements instead
describe **what data is wanted**, using a `WHERE` clause to say which
rows, letting Db2 for i figure out how to retrieve or change exactly
those rows.

## Why It Matters

Neither approach is universally better; understanding both, and how they
correspond to each other, means a developer reading either kind of code
can recognize what it is actually doing. Native RPGLE file I/O remains
extremely common in existing IBM i programs, while embedded SQL is often
reached for when a task naturally fits SQL's strengths, such as filtering
or working with data in ways that go beyond a single key lookup.

## Practical Example

Imagine two developers each writing a program to find one customer by
customer number. One writes native RPGLE: `dcl-f CUSTMAST disk keyed;`
followed by `CHAIN custNbr CUSTMAST;` and a `%FOUND` check. The other
writes SQLRPGLE: an embedded `SELECT CUSTNAME INTO :custName FROM
CUSTMAST WHERE CUSTNBR = :custNbr;` statement. Both programs accomplish
the same basic lookup; the lessons that follow in this group cover the
embedded SQL side of this comparison in full detail.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuine, everyday choice IBM i developers make.

## Common Confusions

**"Is embedded SQL always slower or faster than native RPGLE file I/O?"**
Not as a blanket rule. Detailed performance comparisons depend on many
specific factors beyond the scope of this introductory lesson. This
lesson focuses on how the two approaches correspond conceptually, not on
performance tuning.

**"Does SETLL plus READE have a direct one-to-one SQL equivalent
statement?"**
Not a single statement; the equivalent idea is expressed as a cursor
whose query includes a `WHERE` clause matching the key value, covered in
the Using SQL Cursor to Read Multiple Rows lesson later in this group,
which then retrieves every matching row through a `FETCH` loop.

**"If a table already has an embedded SQL WHERE clause, do I still need
to check something like %FOUND or %EOF?"**
Yes, in spirit, though the specific mechanism differs. Embedded SQL
reports success or failure through `SQLCODE`, covered in the SELECT INTO
for Reading One Row lesson, playing a similar role to `%FOUND` and `%EOF`
for native operations.

## Quick Recap

- `CHAIN`, `READ`, `WRITE`, `UPDATE`, and `DELETE` each have a rough
  embedded SQL equivalent: `SELECT INTO`, a cursor with `FETCH`,
  `INSERT`, and SQL `UPDATE`/`DELETE` with a `WHERE` clause.
- Native RPGLE file I/O works one record at a time, relative to whatever
  was most recently retrieved; embedded SQL describes which rows are
  wanted using a `WHERE` clause.
- Neither approach is universally better; many real IBM i programs use
  native file I/O, embedded SQL, or both.
- The lessons that follow in this group cover each embedded SQL operation
  in full detail.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is a concrete situation where embedded SQL would clearly be
  easier to write than native RPGLE file I/O?"
- "Can a single RPGLE program use CHAIN on one file and embedded SQL on
  another file at the same time?"
