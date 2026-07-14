# Handling No Row Found in SQLRPGLE

## Learning Objective

By the end of this lesson, you will be able to write a clean, reliable
pattern for handling the "no row found" case after `SELECT INTO` or
`FETCH`, distinguishing it from a genuine error.

## Simple Explanation

`SQLCODE = 100` was introduced in earlier lessons in this group as
meaning no matching row was found. It is worth being precise about this:
`SQLCODE = 100` is not a genuine error, the same way `CHAIN` not finding a
record is not an error, as covered in the Understanding %FOUND after
CHAIN lesson. A genuine problem is instead reported as some other nonzero
value.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);

custNbr = 1042;

exec sql
  select CUSTNAME into :custName
  from CUSTMAST
  where CUSTNBR = :custNbr;

if sqlcode = 0;
  dsply custName;
elseif sqlcode = 100;
  dsply 'Customer not found';
else;
  dsply 'Unexpected SQL error';
endif;
```

Here, the three-way check distinguishes success (`sqlcode = 0`), the
ordinary "not found" case (`sqlcode = 100`), and anything else, treated
as a genuine, unexpected problem. This mirrors the distinction covered in
the Handling File I/O Errors at a Beginner Level lesson between an
expected "not found" condition and a genuinely unexpected error.

## Why It Matters

Treating `SQLCODE = 100` the same way as a real error leads to confusing,
misleading messages, such as reporting a system error when a customer
simply does not exist. Distinguishing the ordinary "not found" case from
a genuine problem, using a clear three-way check, keeps embedded SQL code
easy to follow and its messages accurate.

## Practical Example

Imagine the customer inquiry program covered earlier in this group. A
customer number that does not exist is an entirely normal, expected
outcome, handled cleanly with `sqlcode = 100`. A different problem, such
as the database being temporarily unavailable, would come back as some
other nonzero `SQLCODE`, correctly falling into the final `else` branch
instead of being mistaken for a simple "not found" result.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely useful, everyday pattern for
embedded SQL code.

## Common Confusions

**"Is checking sqlcode <> 0 enough, without also checking specifically
for 100?"**
It depends on what the program needs to tell the user. Checking only
`sqlcode <> 0` cannot distinguish "not found" from a genuine error, which
matters when the program should show a different message for each case,
as shown in the example above.

**"Does SQLCODE = 100 ever mean something other than 'no row found'?"**
Within the scope of this lesson group, `SQLCODE = 100` specifically means
no row matched a `SELECT INTO` or that a `FETCH` reached the end of a
cursor's results, covered in the Using SQL Cursor to Read Multiple Rows
lesson. Both are the same underlying "no more data" outcome.

**"Should every embedded SQL statement in a program use this exact
three-way check?"**
Not necessarily every single one; an `INSERT`, `UPDATE`, or `DELETE`
generally only needs a simple `sqlcode <> 0` check, as covered in earlier
lessons in this group, since there is no separate "not found" case
distinct from a genuine problem for those operations in the same way
there is for `SELECT INTO` or `FETCH`.

## Quick Recap

- `SQLCODE = 100` means no row was found; it is an expected outcome, not a
  genuine error.
- A three-way check, success, not found, and anything else, keeps
  embedded SQL code clear about which situation actually occurred.
- This mirrors the same expected-condition-versus-error distinction
  covered for native file I/O in the Handling File I/O Errors at a
  Beginner Level lesson.
- `INSERT`, `UPDATE`, and `DELETE` generally only need a simpler
  `sqlcode <> 0` check, without a separate "not found" branch.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What message would be misleading to show a user if SQLCODE = 100 were
  treated as a genuine error?"
- "Is there a cleaner way to write this three-way check using SELECT
  WHEN instead of if/elseif?"
