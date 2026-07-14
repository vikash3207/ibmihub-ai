# INSERT with Embedded SQL

## Learning Objective

By the end of this lesson, you will be able to use an embedded `INSERT`
statement to add a new row to a table using host variables.

## Simple Explanation

`WRITE`, covered in the Writing Records with WRITE lesson, adds a new
record to a physical file using whatever values are currently assigned to
its fields. Embedded SQL's equivalent is **`INSERT`**, which explicitly
lists the column values being added.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);

custNbr = 2001;
custName = 'Jordan Lee';
custBal = 0;

exec sql
  insert into CUSTMAST (CUSTNBR, CUSTNAME, CUSTBAL)
  values (:custNbr, :custName, :custBal);

if sqlcode <> 0;
  dsply 'Insert failed';
endif;
```

Here, the program assigns values to host variables first, exactly as it
would before a native `WRITE`, then the `insert into CUSTMAST (...)
values (...)` statement adds a new row using those host variables'
current values. `SQLCODE` is checked afterward to confirm the insert
succeeded; a nonzero value indicates a problem, such as attempting to
insert a duplicate key value into a column with a uniqueness constraint.

## Why It Matters

`INSERT` is how new rows are added to a table using embedded SQL, directly
corresponding to `WRITE` for native file I/O. Understanding that `INSERT`
explicitly lists which columns receive which host variable values, in a
matching order, makes it clear and predictable exactly what data ends up
in the new row.

## Practical Example

Imagine the new customer registration task covered earlier with `WRITE`,
now written using embedded SQL instead. The program assigns the new
customer's number, name, and starting balance to host variables, then
calls the `INSERT` statement shown above to add that customer as a new
row in `CUSTMAST`. From that point on, that customer can be found using
either `CHAIN` or `SELECT INTO`, exactly like any other existing customer
row.

This is a simplified, illustrative example rather than a specific real
program, but it reflects exactly how new rows get added using embedded
SQL.

## Common Confusions

**"Do the column names and host variables need to be listed in the same
order?"**
Yes. `INSERT`'s column list and its `VALUES` list are matched up
position by position: the first column listed receives the first value
listed, and so on. Listing them out of order would insert values into the
wrong columns.

**"Does INSERT require every column to be listed and given a value?"**
Not necessarily; columns left out of the column list generally take on a
default value, similar to how a field not explicitly assigned before a
native `WRITE` takes on a default value, as covered in the Writing Records
with WRITE lesson. Explicitly listing every meaningful column is still
good practice for predictable results.

**"What happens if I try to INSERT a row with a duplicate key value,
where the column has a uniqueness constraint?"**
`SQLCODE` comes back nonzero, indicating the insert failed, corresponding
directly to how a native `WRITE` results in an error when attempting to
add a duplicate key value to a keyed file with unique keys, as covered in
the Writing Records with WRITE lesson.

## Quick Recap

- `INSERT INTO table (col1, col2) VALUES (:var1, :var2);` adds a new row
  using host variable values, matched to columns by position.
- `INSERT` is embedded SQL's equivalent of `WRITE` for native file I/O.
- Checking `SQLCODE` after `INSERT` confirms whether the row was actually
  added successfully.
- Attempting to insert a duplicate value into a column with a uniqueness
  constraint results in a nonzero `SQLCODE`, corresponding to the same
  error a native `WRITE` produces for a duplicate key.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I listed the columns and values in a different
  order by mistake?"
- "Can INSERT add more than one row at a time with a single statement?"
