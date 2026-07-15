# SQL Stored Procedures on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain what a SQL
stored procedure is and write a simple one using SQL PL.

## Simple Explanation

A **stored procedure** is a named block of logic stored in the
database itself, callable by name, that can accept parameters and
return results. An **SQL stored procedure** is written in **SQL PL**
(SQL Procedural Language), a small procedural extension to SQL that
adds things like variables and `IF` logic to plain SQL statements:

```sql
CREATE PROCEDURE MYLIB.GET_CUSTOMER_NAME (
  IN  P_CUSTNBR DECIMAL(6, 0),
  OUT P_CUSTNAME VARCHAR(30)
)
LANGUAGE SQL
BEGIN
  SELECT CUSTNAME INTO P_CUSTNAME
  FROM MYLIB.CUSTMAST
  WHERE CUSTNBR = P_CUSTNBR;
END;
```

Once created, this procedure can be called from Run SQL Scripts, from
another program, or from embedded SQL, using `CALL`:

```sql
CALL MYLIB.GET_CUSTOMER_NAME(100234, ?);
```

## Why It Matters

A stored procedure lets logic live in one place in the database,
callable consistently from SQL, rather than being rewritten separately
in every program that needs it. This is conceptually similar to the
Service Programs idea already covered in this course: a shared,
callable place for logic, except here the logic is written in SQL PL
and lives inside the database rather than being an RPGLE-based service
program.

## Practical Example

Recall the customer number validation logic used as a running example
across earlier lessons in this course. A SQL stored procedure could
provide the same kind of answer, in a SQL-native form: given a customer
number, look it up and return whether it is valid, callable directly
from any SQL client or program without needing to know anything about
the underlying table structure, similar in spirit to how an exported
procedure in a service program hides its own implementation details
from callers.

This is a simplified, illustrative example rather than a specific real
procedure, but it reflects exactly how SQL stored procedures are used
in practice.

## Common Confusions

**"Is a SQL stored procedure the same thing as a service program
procedure?"**
Not the same mechanism, but a similar idea: both provide shared,
callable logic in one place rather than duplicated everywhere. A SQL
stored procedure is written in SQL PL and lives in the database,
callable via `CALL`; a service program procedure is written in RPGLE
or another ILE language and callable through binding, as covered
earlier in this course.

**"Do I need to be an expert in SQL PL to write a simple stored
procedure?"**
No. A simple stored procedure, like the example above, only needs a
single SQL statement inside `BEGIN`/`END`. More advanced SQL PL, with
loops, conditions, and error handling, is a deeper topic beyond this
introductory lesson.

**"Can a SQL stored procedure call RPGLE logic instead of writing
everything in SQL PL?"**
Yes, conceptually, though that is done through an **external** stored
procedure rather than an SQL one, which the next lesson in this batch
covers.

## Quick Recap

- A SQL stored procedure is a named, callable block of logic written
  in SQL PL and stored in the database itself.
- It is called using `CALL`, and can accept input and output
  parameters.
- This is conceptually similar to a service program's exported
  procedure: shared, callable logic in one place.
- A simple stored procedure only needs a single SQL statement; deeper
  SQL PL features are a more advanced topic beyond this lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through what happens step by step when CALL runs a
  simple SQL stored procedure like the example here?"
- "Why might a shop choose a SQL stored procedure over just writing
  the same query directly in each calling program?"
