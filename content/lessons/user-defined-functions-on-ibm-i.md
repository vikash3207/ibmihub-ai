# User-Defined Functions on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain what a
user-defined function (UDF) is and use one inside a `SELECT`
statement.

## Simple Explanation

A **UDF** (user-defined function) is a reusable, named calculation
callable directly inside SQL statements, the same way a built-in
function like `UPPER()` or `SUBSTR()` already is. A simple SQL UDF
looks like:

```sql
CREATE FUNCTION MYLIB.CREDIT_TIER (P_CREDITLIMIT DECIMAL(9, 2))
  RETURNS VARCHAR(10)
  LANGUAGE SQL
  RETURN
    CASE
      WHEN P_CREDITLIMIT >= 10000 THEN 'GOLD'
      WHEN P_CREDITLIMIT >= 5000  THEN 'SILVER'
      ELSE 'STANDARD'
    END;
```

Once created, it can be used directly in a query, exactly like a
built-in function:

```sql
SELECT CUSTNBR, CUSTNAME, MYLIB.CREDIT_TIER(CREDITLIMIT) AS TIER
FROM MYLIB.CUSTMAST;
```

## Why It Matters

Without a UDF, a calculation like this would need to be repeated in
every query that needs it, or computed separately in every program
that reads the data. A UDF defines it once and makes it reusable
everywhere SQL is used, the same reuse benefit already familiar from
service program procedures and stored procedures, but callable
directly inside a `SELECT` statement rather than through a separate
`CALL`.

## Practical Example

Imagine several different reports and screens all need to show a
customer's credit tier, calculated the same way. Without a UDF, that
`CASE` logic would need to be copied into every query that needs it,
risking the same kind of drift already covered in the Common IBM i
Integration Mistakes lesson if one copy is updated and another is
forgotten. With `CREDIT_TIER` defined as a UDF, every query simply
calls it, and updating the tier thresholds in one place updates every
query that uses it.

This is a simplified, illustrative example rather than a specific real
system, but it reflects exactly how UDFs are used in practice.

## Common Confusions

**"Is a UDF the same thing as a stored procedure?"**
No. A stored procedure is called on its own with `CALL` and can return
multiple values or perform multiple actions. A UDF is called inside an
expression, like inside a `SELECT` list or a `WHERE` clause, and
returns a single value that can be used directly in that expression.

**"Can a UDF be used anywhere a built-in function like UPPER() can
be?"**
In most common cases, yes, that is exactly the point: once created, a
UDF is called the same way a built-in function is, inside `SELECT`,
`WHERE`, or other SQL expressions.

**"Does every calculation used in a query need to become a UDF?"**
No. A UDF is most valuable when the same calculation is genuinely
reused across multiple queries or programs. A one-off calculation used
in a single place does not necessarily need to become a UDF.

## Quick Recap

- A UDF is a reusable, named calculation callable directly inside SQL
  expressions, the same way a built-in function is.
- It is defined once and reused everywhere it is called, avoiding the
  need to repeat the same calculation in every query.
- A UDF differs from a stored procedure: a UDF is used inside an
  expression and returns a single value, while a stored procedure is
  called on its own with `CALL`.
- UDFs are most valuable for calculations genuinely reused across
  multiple queries or programs.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another example of a calculation that would make a
  good candidate for a UDF?"
- "Why does it matter that a UDF returns a single value while a stored
  procedure does not have to?"
