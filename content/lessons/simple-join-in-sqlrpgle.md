# Simple JOIN in SQLRPGLE

## Learning Objective

By the end of this lesson, you will be able to write a simple two-table
`JOIN` in an embedded SQL cursor, combining related rows from two
different files.

## Simple Explanation

Every query covered so far in this lesson group has read from `CUSTMAST`
alone. A **`JOIN`** combines rows from two different tables or physical
files based on a matching column, such as `CUSTNBR` appearing in both
`CUSTMAST` and `ORDHIST`, the order history file covered in the RPGLE
File I/O lessons.

```rpgle
dcl-s custName char(30);
dcl-s ordNbr packed(6:0);
dcl-s ordAmt packed(9:2);

exec sql
  declare custOrderCursor cursor for
    select CUSTMAST.CUSTNAME, ORDHIST.ORDNBR, ORDHIST.ORDAMT
    from CUSTMAST
    join ORDHIST
      on CUSTMAST.CUSTNBR = ORDHIST.CUSTNBR;

exec sql open custOrderCursor;

exec sql fetch custOrderCursor into :custName, :ordNbr, :ordAmt;
dow sqlcode = 0;
  dsply custName;
  dsply ordAmt;

  exec sql fetch custOrderCursor into :custName, :ordNbr, :ordAmt;
enddo;

exec sql close custOrderCursor;
```

Here, `join ORDHIST on CUSTMAST.CUSTNBR = ORDHIST.CUSTNBR` combines each
`CUSTMAST` row with every `ORDHIST` row sharing the same customer number,
producing one combined row per matching order. `ORDHIST` legitimately has
duplicate `CUSTNBR` values, one per order, as covered in the Processing
Duplicate Keys in RPGLE lesson, so a customer with three orders produces
three combined rows, one per order, each still showing that same
customer's name.

## Why It Matters

A `JOIN` is how embedded SQL naturally expresses a task that would
otherwise require a native program to read one file and, for each row,
separately look up related data in another file. Recognizing the basic
`JOIN ... ON` shape is essential for working with related IBM i data
spread across more than one file or table, exactly the kind of
relationship `CUSTMAST` and `ORDHIST` have through their shared
`CUSTNBR`.

## Practical Example

Imagine a report listing every order together with the name of the
customer who placed it. Using native RPGLE, this would require reading
`ORDHIST` and, for each order, a separate `CHAIN` into `CUSTMAST` to look
up that customer's name. Using embedded SQL instead, a single cursor with
a `JOIN` retrieves the customer name and order details together in one
combined result, exactly as shown above.

This is a simplified, illustrative example rather than a specific real
report, but it reflects a genuinely common, everyday use of `JOIN` on IBM
i.

## Common Confusions

**"Why does the ON clause use CUSTMAST.CUSTNBR = ORDHIST.CUSTNBR instead
of just CUSTNBR = CUSTNBR?"**
Since both `CUSTMAST` and `ORDHIST` have a column named `CUSTNBR`,
qualifying each one with its table name makes clear which `CUSTNBR` is
meant on each side of the comparison, avoiding ambiguity.

**"What happens to a customer in CUSTMAST who has no orders in
ORDHIST?"**
With the basic `JOIN` shown here, that customer does not appear in the
results at all, since there is no matching `ORDHIST` row to combine with.
Including customers with no orders requires a different kind of join,
beyond this introductory lesson.

**"Does JOIN work with the cursor pattern the same way a single-table
query does?"**
Yes. A `JOIN`ed query is declared, opened, fetched from, and closed
exactly like the single-table cursors covered in earlier lessons in this
group; only the query itself, and the combined columns coming back,
differ.

## Quick Recap

- `JOIN table2 ON table1.column = table2.column` combines rows from two
  tables based on a matching column.
- Qualifying a column with its table name, such as `CUSTMAST.CUSTNBR`,
  avoids ambiguity when both tables share a column name.
- A customer with multiple matching `ORDHIST` rows produces one combined
  result row per match, reflecting `ORDHIST`'s legitimate duplicate keys.
- A basic `JOIN` only returns rows that have a match in both tables;
  showing unmatched rows as well requires a different kind of join.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What kind of join would show every customer even if they have no
  orders at all?"
- "Can a JOIN combine more than two tables at once?"
