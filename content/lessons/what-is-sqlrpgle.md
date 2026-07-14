# What is SQLRPGLE?

## Learning Objective

By the end of this lesson, you will be able to explain what SQLRPGLE is,
and recognize embedded SQL written inside an RPGLE program.

## Simple Explanation

Every RPGLE lesson so far has worked with database files using native
operations: `dcl-f`, `READ`, `CHAIN`, `WRITE`, and so on. **SQLRPGLE** is
not a separate language; it is simply free-format RPGLE with **embedded
SQL** statements written directly inside the program, alongside regular
RPGLE code.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);

custNbr = 1042;

exec sql
  select CUSTNAME into :custName
  from CUSTMAST
  where CUSTNBR = :custNbr;

dsply custName;
```

Here, ordinary RPGLE variable declarations and a `dsply` statement sit
right alongside an **`EXEC SQL`** block, a standard SQL `SELECT`
statement embedded directly in the program. This lesson introduces that
this mixing is possible and what it is called; the exact rules for
writing an `EXEC SQL` block are covered in the Basic EXEC SQL Syntax in
RPGLE lesson later in this group, and this particular `SELECT INTO`
pattern is covered in full in the SELECT INTO for Reading One Row lesson.

## Why It Matters

SQLRPGLE lets a developer bring SQL's expressive querying power, filtering,
sorting, and working with data across multiple tables, directly into an
RPGLE program, without needing a separate program just to run a query.
Recognizing an `EXEC SQL` block on sight, and understanding that it is
still fundamentally an RPGLE program underneath, is the essential first
step before learning any specific embedded SQL operation.

## Practical Example

Imagine a program that needs to look up a customer's name by customer
number. Using native RPGLE, this would be written with `dcl-f` and
`CHAIN`, as covered earlier in this path. Using SQLRPGLE instead, the
same lookup can be written as an embedded `SELECT INTO` statement, shown
above, retrieving the customer's name directly into a host variable.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how SQLRPGLE looks in practice: regular
RPGLE code with SQL statements embedded directly inside it.

## Common Confusions

**"Is SQLRPGLE a completely different programming language from RPGLE?"**
No. SQLRPGLE is free-format RPGLE with embedded SQL statements added
directly into the program. Every native RPGLE concept covered earlier in
this path, variables, `dcl-f`, loops, and native file I/O, still applies;
embedded SQL is an addition, not a replacement.

**"Do I have to choose between native RPGLE file I/O and embedded SQL for
an entire program?"**
No, not necessarily. A single RPGLE program can use native operations for
some files and embedded SQL for others, or even both approaches on the
same file in different parts of the same program, though comparing when
each approach fits best is covered in the next lesson.

**"Does every RPGLE program need to use embedded SQL?"**
No. Every native RPGLE file I/O lesson covered earlier in this path
remains fully valid on its own. Embedded SQL is an additional set of
tools available to an RPGLE program, not a requirement.

## Quick Recap

- SQLRPGLE is free-format RPGLE with embedded SQL statements, written
  inside an `EXEC SQL` block, added directly into the program.
- SQLRPGLE is not a separate language; every native RPGLE concept covered
  earlier in this path still applies.
- A program can mix native file I/O and embedded SQL, even within the
  same program.
- This lesson introduces what SQLRPGLE is; exact `EXEC SQL` syntax rules
  and specific embedded SQL operations are covered in the lessons that
  follow.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why would a developer choose embedded SQL over native RPGLE file I/O
  for a particular task?"
- "Does a program need any special setup to use embedded SQL, or does it
  just work automatically?"
