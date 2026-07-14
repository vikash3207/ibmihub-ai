# Basic EXEC SQL Syntax in RPGLE

## Learning Objective

By the end of this lesson, you will be able to write the basic
`EXEC SQL` / `END-EXEC` structure that every embedded SQL statement in
RPGLE uses.

## Simple Explanation

Every embedded SQL statement in an RPGLE program is wrapped in an
**`EXEC SQL`** block, which marks where an ordinary SQL statement begins
inside otherwise normal RPGLE source.

```rpgle
exec sql
  select CUSTNAME into :custName
  from CUSTMAST
  where CUSTNBR = :custNbr;

exec sql
  update CUSTMAST
  set CUSTBAL = :custBal
  where CUSTNBR = :custNbr;
```

Each `exec sql` block contains one SQL statement, ending with a semicolon,
the same statement terminator used elsewhere in free-format RPGLE. Unlike
regular RPGLE operations, the text between `exec sql` and the ending
semicolon is standard SQL syntax, not RPGLE syntax, which is exactly why
it needs its own marked block. A source member containing embedded SQL is
typically given the member type **SQLRPGLE** rather than plain RPGLE, so
the compiler knows to run an SQL precompile step before the usual RPGLE
compile.

## Why It Matters

Recognizing the `EXEC SQL` block structure is the foundation for reading
or writing any embedded SQL statement covered in the rest of this lesson
group: `SELECT INTO`, cursors, `INSERT`, `UPDATE`, and `DELETE` are all
written this same way, just with different SQL statements inside the
block.

## Practical Example

Imagine a developer converting a native `CHAIN` lookup into embedded SQL.
Instead of `dcl-f CUSTMAST disk keyed;` and `chain custNbr CUSTMAST;`,
they write an `exec sql` block containing a `SELECT INTO` statement, ending
with a semicolon, placed directly where the lookup needs to happen in the
program's logic.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how embedded SQL statements are woven
into RPGLE source code.

## Common Confusions

**"Does every RPGLE statement inside an EXEC SQL block need its own
semicolon, like regular RPGLE operations do?"**
No. The semicolon at the very end of the SQL statement terminates the
whole statement, the same role a semicolon plays for a single RPGLE
operation, not one semicolon per line within the block.

**"Do I need to compile an SQLRPGLE source member differently from a
plain RPGLE one?"**
Yes, at a conceptual level. A member containing embedded SQL needs an SQL
precompile step before the normal RPGLE compile, which is why it is
typically given the SQLRPGLE member type rather than RPGLE, so the right
compile process is used.

**"Can I mix regular RPGLE operations and EXEC SQL blocks freely
throughout the same program?"**
Yes. `EXEC SQL` blocks can appear anywhere regular RPGLE operations would,
and regular RPGLE code can appear immediately before or after one, exactly
as shown in the Native RPGLE File I/O vs Embedded SQL lesson's comparison.

## Quick Recap

- Every embedded SQL statement is wrapped in an `exec sql` ... `;` block.
- The text inside the block is standard SQL syntax, ending with a single
  semicolon that terminates the whole statement.
- A source member containing embedded SQL is typically given the member
  type SQLRPGLE, so an SQL precompile step runs before the normal RPGLE
  compile.
- Regular RPGLE code and `EXEC SQL` blocks can be freely mixed throughout
  the same program.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I forgot the semicolon at the end of an EXEC SQL
  statement?"
- "What command is commonly used to compile an SQLRPGLE source member?"
