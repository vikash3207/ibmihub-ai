# SQLCODE and SQLSTATE Basics in SQLRPGLE

## Learning Objective

By the end of this lesson, you will be able to explain what `SQLCODE` and
`SQLSTATE` each report, and how they relate to each other after an
embedded SQL statement runs.

## Simple Explanation

The SELECT INTO for Reading One Row lesson already used `SQLCODE` to check
whether a row was found. Every embedded SQL statement actually sets two
related values once it finishes: **`SQLCODE`**, a number specific to Db2
for i, and **`SQLSTATE`**, a five-character standardized code used across
many different database products.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);

custNbr = 1042;

exec sql
  select CUSTNAME into :custName
  from CUSTMAST
  where CUSTNBR = :custNbr;

dsply sqlcode;
dsply sqlstate;
```

Here, after the `SELECT INTO` statement runs, `SQLCODE` and `SQLSTATE`
both reflect its outcome. A successful statement that found a row sets
`SQLCODE` to `0` and `SQLSTATE` to `'00000'`. A `SELECT INTO` that finds
no matching row sets `SQLCODE` to `100` and `SQLSTATE` to `'02000'`, a
standardized code meaning "no data." Both values always describe the same
underlying result; `SQLCODE` is simply Db2 for i's own number for it, and
`SQLSTATE` is the equivalent standardized code.

## Why It Matters

Most beginner-level embedded SQL code, including everything covered
earlier in this lesson group, only needs to check `SQLCODE`, since it is
simpler to compare against specific numbers like `0` and `100`. Knowing
that `SQLSTATE` exists alongside it, and roughly what it is for, matters
for reading code written by someone else, or for working with tools that
report `SQLSTATE` instead of `SQLCODE`.

## Practical Example

Imagine two different embedded SQL programs, one written entirely for Db2
for i and checking `SQLCODE` directly, as covered throughout this lesson
group, and another written to be more portable across different database
products, checking `SQLSTATE` instead, since `SQLSTATE` values like
`'00000'` and `'02000'` mean the same thing across many different database
systems, not just Db2 for i.

This is a simplified, illustrative example rather than a specific real
comparison, but it reflects a genuine, practical reason both values exist
side by side.

## Common Confusions

**"Do I need to check both SQLCODE and SQLSTATE after every embedded SQL
statement?"**
No, not typically at a beginner level. Checking `SQLCODE` alone, as done
throughout this lesson group, is enough for the everyday patterns covered
here. `SQLSTATE` is useful to know about, but this lesson does not expect
you to check both routinely.

**"Is SQLCODE = 100 always exactly the same as SQLSTATE = '02000'?"**
For the "no row found" case covered in this lesson group, yes, they
represent the same outcome. In general, `SQLSTATE` groups related outcomes
under standardized codes, while `SQLCODE` gives Db2 for i's own specific
number for each one.

**"Which one should I use in new code I write?"**
For beginner-level embedded SQL focused specifically on Db2 for i, as
covered throughout this lesson group, `SQLCODE` is the simpler, more
common choice. `SQLSTATE` becomes more relevant for code intended to work
across different database platforms, which is beyond this introduction.

## Quick Recap

- Every embedded SQL statement sets both `SQLCODE`, a Db2 for i specific
  number, and `SQLSTATE`, a standardized five-character code, describing
  the same outcome.
- `SQLCODE = 0` and `SQLSTATE = '00000'` both mean success.
- `SQLCODE = 100` and `SQLSTATE = '02000'` both mean no row was found.
- Beginner-level embedded SQL, as covered throughout this lesson group,
  typically only needs to check `SQLCODE`.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Are there SQLSTATE values that don't have a simple matching SQLCODE
  number?"
- "Why would a real IBM i shop prefer checking SQLSTATE over SQLCODE in
  some programs?"
