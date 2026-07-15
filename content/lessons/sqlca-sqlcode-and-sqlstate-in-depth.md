# SQLCA, SQLCODE, and SQLSTATE in Depth

## Learning Objective

By the end of this lesson, you will be able to explain what the SQLCA
is, and read `SQLCODE` and `SQLSTATE` values beyond the single case of
"no row found."

## Simple Explanation

The SQLRPGLE basics lessons earlier in this course introduced
`SQLCODE` mainly for one case: `100`, meaning no row was found. Every
embedded SQL statement actually updates a whole structure called the
**SQLCA** (SQL Communication Area), not just a single value. The two
fields developers rely on most are:

- **`SQLCODE`**: a number describing what happened. `0` means success,
  a positive number (like `100`) usually means a non-error condition
  worth noticing, and a negative number means a genuine error.
- **`SQLSTATE`**: a five-character standardized code, consistent across
  different database products, that classifies the same kind of
  outcome in a more portable way than `SQLCODE`.

```rpgle
exec sql
  UPDATE MYLIB.CUSTMAST
  SET CREDITLIMIT = CREDITLIMIT + 500
  WHERE CUSTNBR = :custNbr;

if sqlcode = 0;
  // update succeeded
elseif sqlcode = 100;
  // no row matched that customer number
else;
  // a negative sqlcode means a genuine error occurred
endif;
```

## Why It Matters

Treating every non-zero `SQLCODE` the same way, exactly the kind of
mistake already covered for HTTP status codes in the Modern IBM i /
APIs / Integration lessons, hides real problems. A `100` after an
`UPDATE` simply means no row matched the `WHERE` condition, which may
be entirely expected. A negative `SQLCODE`, such as one triggered by a
constraint violation covered earlier in this batch, means something
genuinely went wrong and needs different handling.

## Practical Example

Recall the check constraint on `CREDITLIMIT` from the Constraints
lesson earlier in this batch. If an `UPDATE` statement tried to set
`CREDITLIMIT` below zero, the database would reject it, and the
embedded SQL statement above would return a negative `SQLCODE`
reflecting a constraint violation, completely different from the `100`
returned when a customer number simply does not exist. Distinguishing
these two outcomes, rather than treating any non-zero `SQLCODE` as
"something went wrong," is exactly what this lesson is building toward.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects a genuinely common distinction to get right.

## Common Confusions

**"Is SQLCODE 100 an error?"**
No. It means no row matched, which is frequently a normal, expected
outcome, not a failure. Genuine errors are represented by negative
`SQLCODE` values.

**"Why would I ever need SQLSTATE if I already check SQLCODE?"**
`SQLSTATE` is standardized across different database products, so code
or documentation written with portability in mind often refers to
`SQLSTATE` values instead of, or alongside, `SQLCODE`. For IBM i-only
code, `SQLCODE` alone is often sufficient, but recognizing `SQLSTATE`
matters when reading documentation or cross-platform code.

**"Is the SQLCA just SQLCODE renamed?"**
No. The SQLCA is a larger structure that `SQLCODE` and `SQLSTATE` are
both part of, along with other diagnostic fields. Most day-to-day
embedded SQL work only needs `SQLCODE`, and sometimes `SQLSTATE`, but
it helps to know they are both part of the same underlying structure.

## Quick Recap

- The SQLCA is the structure embedded SQL updates after every
  statement; `SQLCODE` and `SQLSTATE` are its two most commonly used
  fields.
- `SQLCODE` `0` means success, positive values like `100` mean a
  non-error condition worth noticing, and negative values mean a
  genuine error.
- `SQLSTATE` is a standardized, more portable way of classifying the
  same kind of outcome.
- Treating every non-zero `SQLCODE` the same way hides real problems,
  the same mistake already covered for HTTP status codes elsewhere in
  this course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me a few more examples of SQLCODE values and explain
  what each one generally means?"
- "Why might a shop choose to check SQLSTATE instead of SQLCODE in
  some situations?"
