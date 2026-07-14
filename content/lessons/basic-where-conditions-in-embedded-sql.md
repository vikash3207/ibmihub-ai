# Basic WHERE Conditions in Embedded SQL

## Learning Objective

By the end of this lesson, you will be able to write `WHERE` conditions
using comparison operators and `AND`/`OR` to filter embedded SQL results
beyond simple equality.

## Simple Explanation

Every `WHERE` clause used so far in this lesson group has checked simple
equality, such as `WHERE CUSTNBR = :custNbr`. `WHERE` also supports
comparison operators, and combining more than one condition together.

```rpgle
dcl-s custBal packed(9:2);
dcl-s minBal packed(9:2);
dcl-s maxBal packed(9:2);

minBal = 500;
maxBal = 5000;

exec sql
  declare midCustCursor cursor for
    select CUSTBAL
    from CUSTMAST
    where CUSTBAL >= :minBal and CUSTBAL <= :maxBal;
```

Here, `>=` and `<=` filter to only customers whose balance falls within a
range, and `and` requires both conditions to be true for a row to be
included. `WHERE` also supports `or`, meaning at least one of the
conditions must be true, and other comparison operators such as `>`, `<`,
and `<>` (not equal).

## Why It Matters

Real embedded SQL queries rarely filter on simple equality alone; being
comfortable with comparison operators and combining conditions with `and`
and `or` is what makes `WHERE` genuinely useful for everyday filtering
tasks, such as the balance-range report shown above.

## Practical Example

Imagine a report that needs every customer with a balance between `500`
and `5000`, as shown above, versus a different report that needs every
customer with either a very low balance or a very high one. The first
uses `and`, requiring both the lower and upper bound conditions to hold;
the second would use `or`, such as `WHERE CUSTBAL < 100 or CUSTBAL >
10000`, matching rows meeting either condition on its own.

This is a simplified, illustrative example rather than a specific real
report, but it reflects how `and` and `or` change what a `WHERE` clause
actually matches.

## Common Confusions

**"Does AND require every condition in the WHERE clause to be true, or
just some of them?"**
`AND` requires every condition it connects to be true for a row to be
included. `OR` requires only one of the conditions it connects to be
true. Mixing up which one is used changes which rows a query actually
returns.

**"Can I use more than two conditions in the same WHERE clause?"**
Yes. Any number of conditions can be combined with `and` and `or`, though
combining both together in the same clause can require careful
parentheses to control which conditions group together, a detail beyond
this introductory lesson.

**"Is <> the same as NOT EQUAL?"**
Yes. `<>` is SQL's comparison operator for "not equal," used the same way
`=` is used for equality, just testing the opposite condition.

## Quick Recap

- `WHERE` supports comparison operators beyond simple equality: `>`, `<`,
  `>=`, `<=`, and `<>`.
- `AND` requires every connected condition to be true; `OR` requires at
  least one of them to be true.
- Host variables work the same way in comparison conditions as they do in
  simple equality conditions, each with its own colon prefix.
- Combining conditions with `and` and `or` is what makes `WHERE` flexible
  enough for real, everyday filtering needs.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I write a WHERE clause for customers with a balance under
  100 or over 10000, but not in between?"
- "Do I need parentheses if I mix AND and OR in the same WHERE clause?"
