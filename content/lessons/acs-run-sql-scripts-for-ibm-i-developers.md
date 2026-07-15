# ACS Run SQL Scripts for IBM i Developers

## Learning Objective

By the end of this lesson, you will be able to explain what ACS Run
SQL Scripts is and why it is a practical everyday tool for working
with Db2 for i.

## Simple Explanation

**ACS** (IBM i Access Client Solutions) was introduced earlier in this
course as a general connectivity tool. One of its most useful pieces
for a developer is **Run SQL Scripts**: a window where SQL statements
can be typed and run directly against Db2 for i, with results shown in
a grid, without needing to write or compile a program first.

```sql
SELECT CUSTNBR, CUSTNAME, CREDITLIMIT
FROM MYLIB.CUSTMAST
WHERE ISACTIVE = 'Y'
ORDER BY CUSTNAME;
```

Running a statement like this in Run SQL Scripts shows the matching
rows immediately in a results grid, and the same window can run
`CREATE TABLE`, `ALTER TABLE`, or any other DDL or DML statement
covered elsewhere in this batch.

## Why It Matters

Before trusting a query or a piece of DDL inside an RPGLE or SQLRPGLE
program, it helps enormously to first confirm it does what is expected
by itself. Run SQL Scripts is where that quick confirmation happens:
checking a `WHERE` condition returns the right rows, verifying a
`CREATE TABLE` statement's syntax, or looking at a table's current data
before writing the program logic that will use it.

## Practical Example

Imagine writing a new SQLRPGLE program that needs a query to find
active customers over a certain credit limit. Rather than guessing at
the `WHERE` condition inside the RPGLE source and only finding out it
is wrong after compiling and running the program, the same query can
be tried directly in Run SQL Scripts first, adjusted quickly, and only
copied into the RPGLE program's embedded SQL once it is confirmed to
return the right rows.

This is a simplified, illustrative example rather than a specific real
workflow, but it reflects exactly how Run SQL Scripts fits into
everyday development.

## Common Confusions

**"Is Run SQL Scripts only for administrators, not developers?"**
No. It is a genuinely everyday developer tool, useful for testing
queries, checking table structure, and running one-off DDL or DML,
alongside writing RPGLE and CLLE programs.

**"Does running a statement in Run SQL Scripts affect real data the
same way running it from a program would?"**
Yes. A `DELETE`, `UPDATE`, or `DROP TABLE` run in Run SQL Scripts has
the same real effect as running it from any other tool or program, so
it deserves the same care, especially against data that matters.

**"Is Run SQL Scripts the same thing as embedded SQL in an RPGLE
program?"**
No. Embedded SQL runs inside a compiled RPGLE program as part of its
logic. Run SQL Scripts is an interactive tool for typing and running
SQL directly, independent of any program, which is exactly what makes
it useful for quickly testing a statement before it goes into program
source.

## Quick Recap

- ACS Run SQL Scripts lets a developer type and run SQL statements
  directly against Db2 for i, with results shown in a grid.
- It is a practical everyday tool for confirming a query or DDL
  statement works before relying on it inside a program.
- Statements run in Run SQL Scripts have the same real effect on data
  as running them any other way.
- It is distinct from embedded SQL, which runs as part of a compiled
  program rather than interactively.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is a good habit for testing a query in Run SQL Scripts before
  copying it into an RPGLE program's embedded SQL?"
- "Why might a developer prefer testing DDL statements in Run SQL
  Scripts before adding them to a deployment script?"
