# Basic SELECT on IBM i

## Learning Objective

By the end of this lesson, you will understand what a basic SQL `SELECT`
statement does, be able to read a simple example, and know a common way to
run one against Db2 for i data.

## Simple Explanation

You have now learned that Db2 for i data can be defined using either DDS or
SQL, and that both approaches ultimately describe the same kind of
underlying data. Regardless of which approach originally defined a piece of
data, SQL can commonly be used to query it, which is what this lesson
introduces.

A `SELECT` statement is how SQL asks for data back from a table. A very
basic `SELECT` statement has three main parts:

- **`SELECT`**, followed by which columns you want to see, or `*` to mean
  every column.
- **`FROM`**, followed by which table the data should come from.
- An optional **`WHERE`** clause, which limits the result to only the rows
  that match a specific condition.

For example, a simple statement like:

```sql
SELECT CUSTNAME, CUSTBAL
FROM CUSTMAST
WHERE CUSTNBR = 1001
```

asks Db2 for i for the customer name and balance columns, from the
`CUSTMAST` data introduced in earlier lessons, but only for the one row
where the customer number equals 1001.

On IBM i, a common way to run a statement like this is through the SQL
tool inside IBM i Access Client Solutions, which you learned about in the
ACS overview lesson, letting you type a `SELECT` statement and see its
results directly, without needing to write a full program first.

## Why It Matters

Being able to write and run a basic `SELECT` statement is one of the most
immediately useful, practical skills for working with IBM i data, letting
you look at real data directly to understand it, check assumptions, or
investigate an issue, rather than relying only on existing programs or
reports. This is often one of the first hands-on things a new IBM i
developer or support person learns to do.

## Practical Example

Imagine a support developer investigating a customer complaint about an
incorrect balance. Rather than asking someone else to check, they open the
SQL tool in ACS and run a `SELECT` statement against `CUSTMAST`, filtering
by the specific customer number from the complaint, to see that customer's
actual current balance directly.

This lets them confirm, within moments, exactly what value is stored for
that customer, without waiting for a report or asking another team member
to look it up. This is a simplified, illustrative example rather than a
specific real investigation, but it reflects a genuinely common, everyday
use of basic SQL queries on IBM i.

## Common Confusions

**"Does running a SELECT statement change the data in any way?"**
No. A `SELECT` statement only retrieves and displays data; it does not
modify, add, or delete anything in the underlying table or physical file.

**"Do I need to know whether CUSTMAST is a DDS physical file or an SQL
table to query it with SELECT?"**
Generally, no, for a basic `SELECT` like the one in this lesson. As covered
in the SQL Tables vs DDS Physical Files lesson, SQL can typically query
Db2 for i data regardless of which approach originally defined it.

**"Is WHERE required in every SELECT statement?"**
No. Leaving out `WHERE` simply returns every row from the table instead of
filtering to specific ones. `WHERE` is optional, used whenever you want to
narrow the results down to rows matching a specific condition.

## Quick Recap

- A basic SQL `SELECT` statement retrieves data using `SELECT` (which
  columns), `FROM` (which table), and an optional `WHERE` (which rows).
- `SELECT` statements only retrieve data; they do not modify the underlying
  table or physical file in any way.
- The SQL tool inside IBM i Access Client Solutions is a common way to run
  `SELECT` statements directly and see their results.
- Basic SELECT queries generally work regardless of whether the underlying
  data was originally defined using DDS or SQL.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "How do I select specific columns instead of using * in a SELECT
  statement?"
- "What is the difference between the WHERE clause and just looking at
  every row myself?"
