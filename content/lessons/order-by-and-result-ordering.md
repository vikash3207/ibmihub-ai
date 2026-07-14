# ORDER BY and Result Ordering

## Learning Objective

By the end of this lesson, you will be able to use `ORDER BY` to control
the order rows are returned in, and explain why this is separate from a
physical file's own key or access path.

## Simple Explanation

Every query covered so far in this lesson group has left row order
unspecified. **`ORDER BY`** controls the order a query's results are
returned in, entirely separate from `CUSTMAST`'s own key or access path,
covered in the Keyed Physical Files and Access Paths and Why They Matter
lessons.

```rpgle
exec sql
  declare custByBalCursor cursor for
    select CUSTNBR, CUSTNAME, CUSTBAL
    from CUSTMAST
    order by CUSTBAL desc;
```

Here, `order by CUSTBAL desc` returns rows sorted by balance, highest
first, regardless of `CUSTMAST`'s own key, which is `CUSTNBR`. Without an
`ORDER BY` clause, a query's row order is not guaranteed to follow any
particular sequence, physical storage order, key order, or otherwise.

## Why It Matters

A common beginner misconception is assuming a query's results come back
in the underlying file's key order, or its physical storage order, unless
told otherwise. `ORDER BY` is what actually controls result order; it has
nothing to do with `CUSTMAST`'s own access path, and using it does not
change anything about how `CUSTMAST` itself is stored or keyed.

## Practical Example

Imagine two different reports over `CUSTMAST`. One needs customers listed
by customer number, matching `CUSTMAST`'s own key order, achieved with
`order by CUSTNBR`. The other needs customers listed by balance,
highest first, achieved with `order by CUSTBAL desc`, shown above,
completely independent of `CUSTMAST`'s own key.

This is a simplified, illustrative example rather than a specific real
report, but it reflects exactly how `ORDER BY` lets a single query
result be sorted however a specific task actually needs, regardless of
how the underlying file itself is keyed.

## Common Confusions

**"If CUSTMAST is keyed by CUSTNBR, do query results automatically come
back in CUSTNBR order?"**
Not reliably, without an explicit `ORDER BY CUSTNBR` clause. A query's
result order is not guaranteed to match the underlying file's key order
unless `ORDER BY` says so explicitly.

**"Does ORDER BY change CUSTMAST's own key or access path?"**
No. `ORDER BY` only affects the order of one specific query's results;
`CUSTMAST`'s own key and access path, covered in earlier lessons, are
completely unaffected by any query run against it.

**"What does DESC mean, and what happens if I leave it out?"**
`DESC` means descending order, highest to lowest. Leaving it out defaults
to ascending order, lowest to highest, which can also be written
explicitly as `ASC`.

## Quick Recap

- `ORDER BY column` controls a query's result order; adding `DESC` sorts
  descending instead of the default ascending order.
- A query's result order is not guaranteed to match the underlying file's
  key order unless `ORDER BY` explicitly says so.
- `ORDER BY` never changes the underlying file's own key or access path;
  it only affects that one query's results.
- Different queries over the same file can use completely different
  `ORDER BY` clauses depending on what each specific task needs.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can I use ORDER BY on more than one column at once, such as balance
  then name?"
- "Does adding ORDER BY to a cursor's query change how FETCH behaves?"
