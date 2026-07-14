# Using SQL Cursor to Read Multiple Rows

## Learning Objective

By the end of this lesson, you will be able to declare, open, fetch from,
and close an SQL cursor to read every matching row from a query, one at a
time.

## Simple Explanation

`SELECT INTO`, covered in the previous lesson, retrieves exactly one row.
Reading many rows, the embedded SQL equivalent of a `READ` loop, requires
a **cursor**: a named position SQL maintains over the results of a query,
moved forward one row at a time with `FETCH`.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);

exec sql
  declare custCursor cursor for
    select CUSTNAME, CUSTBAL
    from CUSTMAST
    order by CUSTNBR;

exec sql open custCursor;

exec sql fetch custCursor into :custName, :custBal;
dow sqlcode = 0;
  dsply custName;

  exec sql fetch custCursor into :custName, :custBal;
enddo;

exec sql close custCursor;
```

Here, `declare custCursor cursor for` defines `custCursor` over a query
selecting every customer's name and balance. `open custCursor;` starts
the cursor without retrieving any row yet. Each `fetch custCursor into
:custName, :custBal;` retrieves the next row's columns into the host
variables, exactly like each `READ` retrieves the next record in a native
read loop. Once every row has been fetched, `SQLCODE` becomes `100`,
ending the loop, the same role `%EOF` plays for a native `READ` loop.
`close custCursor;` releases the cursor once finished.

## Why It Matters

A cursor is how embedded SQL processes an entire result set, one row at a
time, corresponding directly to the native `READ`-in-a-loop pattern
covered earlier in this path. Recognizing `DECLARE CURSOR`, `OPEN`,
`FETCH`, and `CLOSE` as four distinct, always-paired steps is essential
for reading or writing any embedded SQL loop.

## Practical Example

Imagine a report program that needs to list every customer's name and
balance in customer number order. Using native RPGLE, this would be
written as a `READ` loop over `CUSTMAST`. Using SQLRPGLE instead, the
program declares a cursor over a `SELECT` with an `ORDER BY` clause,
opens it, fetches each row in a loop exactly as shown above, and closes it
once `SQLCODE` reaches `100`.

This is a simplified, illustrative example rather than a specific real
report, but it reflects exactly how a cursor replaces a native read loop
with its embedded SQL equivalent.

## Common Confusions

**"Do I need to check SQLCODE after every single FETCH, the same way I
check %EOF after every READ?"**
Yes. Each `FETCH` needs to be followed by a `SQLCODE` check, exactly
mirroring how each `READ` needs a `%EOF` check immediately afterward, for
exactly the same reason: to know whether a real row was actually
retrieved.

**"What happens if I forget to CLOSE a cursor?"**
An open cursor continues holding resources tied to that query. Always
closing a cursor once finished with it, as shown in the example above, is
the correct, expected pattern, similar in spirit to properly finishing up
after any resource a program opens.

**"Can a cursor's query include a WHERE clause, like the duplicate-key
example covered for SETLL and READE?"**
Yes. A cursor's query can include any valid `WHERE` clause, including one
matching a specific key value with potential duplicates, making a cursor
the embedded SQL equivalent of the `SETLL` plus `READE` pattern covered
in the Processing Duplicate Keys in RPGLE lesson.

## Quick Recap

- A cursor is a named position over a query's results, moved forward one
  row at a time with `FETCH`.
- The four cursor steps are always paired: `DECLARE CURSOR`, `OPEN`,
  `FETCH` in a loop, and `CLOSE`.
- `SQLCODE` becomes `100` once every row has been fetched, ending the
  loop, the same role `%EOF` plays for a native `READ` loop.
- A cursor is the embedded SQL equivalent of a native `READ` loop, and can
  also express the same idea as `SETLL` plus `READE` using a `WHERE`
  clause.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I called FETCH after SQLCODE had already reached
  100?"
- "Can more than one cursor be open at the same time in the same
  program?"
