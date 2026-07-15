# Static SQL vs Dynamic SQL on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain the difference
between static and dynamic SQL, and when dynamic SQL is genuinely
needed.

## Simple Explanation

Every embedded SQL example so far in this course has been **static
SQL**: the exact statement text is known and written directly into the
RPGLE source, so the compiler can check and prepare it ahead of time.

**Dynamic SQL** is different: the statement text is not known until the
program is running, often because it is built up based on user input
or a condition. Dynamic SQL uses `PREPARE` and `EXECUTE`:

```rpgle
dcl-s sqlStmt varchar(200);

sqlStmt = 'SELECT CUSTNAME FROM MYLIB.CUSTMAST WHERE CUSTNBR = ?';

exec sql PREPARE stmt1 FROM :sqlStmt;
exec sql EXECUTE stmt1 USING :custNbr INTO :custName;
```

The statement text itself, held in `sqlStmt`, could have been built up
differently depending on what the program needed at that moment,
something static SQL cannot do since its statement text is fixed at
compile time.

## Why It Matters

Static SQL is simpler, and the compiler can catch mistakes in it
before the program ever runs, which is why it is the right default for
most embedded SQL work, including everything covered earlier in this
course. Dynamic SQL exists for the genuine cases where the exact
statement is not known until runtime, such as a search screen where the
user chooses which columns to filter on. Knowing the difference means
choosing dynamic SQL deliberately, for a real reason, rather than by
default.

## Practical Example

Recall a typical customer lookup, covered earlier in this course,
which always filters by `CUSTNBR` using a fixed, known `WHERE`
condition. That is a perfect fit for static SQL. Now imagine a search
screen where a user can optionally filter by customer number, customer
name, or both, and the program needs to build a different `WHERE`
condition depending on which fields the user actually filled in. That
genuinely varying condition is a reasonable case for dynamic SQL, since
the exact statement text cannot be known until the program sees what
the user provided.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the everyday shape of this decision.

## Common Confusions

**"Is dynamic SQL just a more advanced, better version of static
SQL?"**
No. Static SQL is not an inferior option; it is simpler, checked earlier
by the compiler, and the right default for most embedded SQL. Dynamic
SQL is a different tool for a specific situation: when the statement
text genuinely cannot be known until runtime.

**"Does every search screen with optional filters need dynamic SQL?"**
Not always, but it is a common, legitimate reason to reach for it. A
search screen with a small, fixed set of filter combinations can
sometimes still be handled with static SQL and conditional logic
instead.

**"Is PREPARE/EXECUTE the same thing as calling a stored procedure,
covered earlier in this batch?"**
No. A stored procedure is a separate, named, pre-created database
object called with `CALL`. `PREPARE`/`EXECUTE` builds and runs a SQL
statement's text directly, without needing that statement to already
exist as a separate database object.

## Quick Recap

- Static SQL has its exact statement text known and checked at compile
  time; every embedded SQL example earlier in this course is static
  SQL.
- Dynamic SQL builds statement text at runtime and runs it with
  `PREPARE` and `EXECUTE`, used when the exact statement cannot be
  known ahead of time.
- Static SQL is the right default; dynamic SQL is for genuine
  runtime-varying cases, not a general upgrade.
- Dynamic SQL is distinct from calling a stored procedure, which runs a
  separately created, named database object.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic scenario where dynamic SQL would
  genuinely be needed instead of static SQL?"
- "What are some risks to be aware of when building a dynamic SQL
  statement's text from user input?"
