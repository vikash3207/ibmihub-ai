# External Stored Procedures with RPGLE

## Learning Objective

By the end of this lesson, you will be able to explain how an external
stored procedure lets existing RPGLE logic be called through plain SQL.

## Simple Explanation

The previous lesson covered SQL stored procedures written entirely in
SQL PL. An **external stored procedure** instead wraps an existing
RPGLE program or procedure, so it becomes callable through SQL's
`CALL`, without rewriting its logic in SQL PL:

```sql
CREATE PROCEDURE MYLIB.VALIDATE_CUST_NBR (
  IN  P_CUSTNBR DECIMAL(6, 0),
  OUT P_ISVALID CHAR(1)
)
LANGUAGE RPGLE
EXTERNAL NAME MYLIB.CUSTVALPRC
PARAMETER STYLE GENERAL;
```

This tells Db2 for i that calling `MYLIB.VALIDATE_CUST_NBR` should
actually run the `CUSTVALPRC` RPGLE program, passing the same
parameters through. The RPGLE program itself does not need to know
anything about SQL; it just receives parameters and returns a result
exactly as it always has.

## Why It Matters

This is the same pattern already familiar from the Modern IBM i / APIs
/ Integration lessons on exposing IBM i logic as an API: existing,
trusted RPGLE logic stays unchanged, and a thin layer, here an external
stored procedure definition, makes it callable from a new context,
plain SQL, rather than duplicating that logic in SQL PL.

## Practical Example

Recall the `isValidCustNbr` procedure used as a running example across
earlier ILE lessons in this course. An external stored procedure could
expose that exact same validation logic to SQL callers: any SQL client
or program can now run
`CALL MYLIB.VALIDATE_CUST_NBR(100234, ?)` and get back the same
trusted answer the RPGLE procedure has always provided, without that
procedure's own logic changing at all.

This is a simplified, illustrative example rather than a specific real
implementation, but it reflects exactly how external stored procedures
are used to reuse existing RPGLE logic from SQL.

## Common Confusions

**"Does the RPGLE program need to be rewritten to work as an external
stored procedure?"**
Generally, no. The existing RPGLE program or procedure keeps working
exactly as it always has; `CREATE PROCEDURE ... LANGUAGE RPGLE` is a
separate definition that tells Db2 for i how to call it, not a change
to the RPGLE source itself.

**"Is this the same idea as exposing IBM i logic as a REST API, covered
earlier in this course?"**
It is the same underlying pattern, reusing existing trusted logic
through a thin new layer, applied to a different calling context: SQL
`CALL` instead of an HTTP request.

**"Why choose an external stored procedure instead of just rewriting
the logic in SQL PL?"**
When the logic already exists, is already tested, and works correctly
in RPGLE, rewriting it in SQL PL duplicates that logic in a second
place, risking the two versions drifting apart over time, similar to
the duplication risk already covered in the Common IBM i Integration
Mistakes lesson.

## Quick Recap

- An external stored procedure wraps an existing RPGLE program or
  procedure so it becomes callable through SQL's `CALL`.
- The underlying RPGLE logic does not need to change; the procedure
  definition is a separate layer that connects SQL to it.
- This is the same "expose existing logic, don't rewrite it" pattern
  already covered for REST APIs, applied to SQL callers instead.
- Choosing this over an SQL PL rewrite avoids duplicating trusted logic
  in two places.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some signs that existing RPGLE logic would be a good
  candidate to expose as an external stored procedure?"
- "How would I debug a problem if an external stored procedure's call
  into RPGLE was not behaving as expected?"
