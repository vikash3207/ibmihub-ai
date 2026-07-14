# FETCH Loop for Reading Multiple Rows

## Learning Objective

By the end of this lesson, you will be able to write a complete cursor
`FETCH` loop that processes every fetched row, not just displays it.

## Simple Explanation

The Using SQL Cursor to Read Multiple Rows lesson introduced the basic
`DECLARE CURSOR` / `OPEN` / `FETCH` / `CLOSE` shape. This lesson focuses
on the `FETCH` loop itself: what happens to each row once it is fetched.

```rpgle
dcl-s custBal packed(9:2);
dcl-s custCount int(10) inz(0);
dcl-s balTotal packed(11:2) inz(0);

exec sql
  declare bigCustCursor cursor for
    select CUSTBAL
    from CUSTMAST
    where CUSTBAL > 1000;

exec sql open bigCustCursor;

exec sql fetch bigCustCursor into :custBal;
dow sqlcode = 0;
  custCount += 1;
  balTotal += custBal;

  exec sql fetch bigCustCursor into :custBal;
enddo;

exec sql close bigCustCursor;

dsply custCount;
dsply balTotal;
```

Here, the cursor's query filters to only customers with a balance over
`1000`. Each pass through the loop does not just receive `custBal`; it
also adds `1` to `custCount` and adds `custBal` to `balTotal`, building up
a running count and total across every fetched row. Once `SQLCODE`
reaches `100`, the loop ends, and `custCount` and `balTotal` reflect
totals across every row the cursor returned.

## Why It Matters

A `FETCH` loop is rarely just for display; it is how embedded SQL
programs commonly count, total, or otherwise process a whole result set,
directly corresponding to the same kind of accumulation a native `READ`
loop performs, as covered earlier in this path. Recognizing that ordinary
RPGLE logic, variable assignments, accumulation, conditions, belongs
naturally inside a `FETCH` loop's body is essential for writing genuinely
useful embedded SQL code.

## Practical Example

Imagine a report program that needs to know how many customers have a
balance over `1000`, and what those balances add up to. Rather than
writing this as a native `READ` loop with an `if custBal > 1000` check
inside it, the cursor's own `WHERE` clause already filters to only the
relevant rows, so the `FETCH` loop's body can focus purely on counting
and totaling, exactly as shown above.

This is a simplified, illustrative example rather than a specific real
report, but it reflects a genuinely common, everyday embedded SQL pattern.

## Common Confusions

**"Could this same filtering and totaling be done with a native READ
loop instead?"**
Yes, using an `if custBal > 1000` check inside a native `READ` loop over
every record. The embedded SQL version instead pushes the filtering into
the cursor's `WHERE` clause, letting Db2 for i decide which rows to
return, so the `FETCH` loop's body only needs to handle the totaling
logic.

**"Does the loop body run before or after checking SQLCODE?"**
After. Exactly like a native `READ` loop, each `FETCH` is followed
immediately by a `SQLCODE` check; the loop body only runs when `SQLCODE`
confirms a real row was actually fetched.

**"Can more than one running total be built up inside the same FETCH
loop?"**
Yes. Any number of variables can be updated inside the loop body, exactly
as ordinary RPGLE logic would allow anywhere else in a program; `custCount`
and `balTotal` are both updated together in the example above.

## Quick Recap

- A `FETCH` loop's body is ordinary RPGLE code, free to accumulate
  totals, counts, or apply other logic to each fetched row.
- Filtering with the cursor's own `WHERE` clause lets the loop body focus
  on processing, rather than also checking conditions itself.
- `SQLCODE` is checked immediately after each `FETCH`, exactly like
  `%EOF` after each native `READ`.
- Multiple variables can be updated together inside the same loop body,
  such as both a count and a running total.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen to custCount and balTotal if the cursor's query
  matched zero rows?"
- "Would it be better to filter with WHERE in the cursor, or with an if
  check inside the loop?"
