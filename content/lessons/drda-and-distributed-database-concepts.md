# DRDA and Distributed Database Concepts

## Learning Objective

By the end of this lesson, you will be able to explain what DRDA is and
why it matters for querying data across more than one Db2 for i
system.

## Simple Explanation

Every query covered so far in this course has run against a single Db2
for i system. **DRDA** (Distributed Relational Database Architecture)
is IBM's standard for letting a program on one system query or update a
Db2 for i database on a different system, using ordinary SQL, as if
that remote database were reachable directly.

```sql
SELECT CUSTNBR, CUSTNAME
FROM WAREHOUSE_SYS.MYLIB.CUSTMAST;
```

Here, `WAREHOUSE_SYS` represents a connection to a different remote
IBM i system, set up ahead of time, so the same familiar `SELECT`
syntax can reach a table that physically lives elsewhere.

## Why It Matters

This connects directly to the integration thinking already covered in
the Modern IBM i / APIs / Integration lessons: sometimes the "other
system" a program needs to reach is another Db2 for i database, not a
REST API. DRDA is the SQL-native way of reaching that other database,
distinct from the REST/JSON approach covered for reaching non-database
systems, or for systems that are not IBM i at all.

## Practical Example

Imagine a company with a central IBM i system holding customer data,
and a separate regional IBM i system that needs to check a customer
number against the central system before completing a local order.
Rather than building a REST API for this internal, database-to-database
need, as covered in the Integration lessons, DRDA lets the regional
system's SQL directly query the central system's `CUSTMAST` table,
using the same SQL already familiar from earlier in this course.

This is a simplified, illustrative example rather than a specific real
architecture, but it reflects a genuinely common reason DRDA is used.

## Common Confusions

**"Is DRDA the same thing as the REST API integration covered
earlier in this course?"**
No. Both let one system reach data or logic on another system, but
DRDA is specifically for database-to-database SQL access between Db2
systems, while the REST API lessons covered a more general,
system-agnostic way of exposing or calling logic over HTTP.

**"Does DRDA require rewriting queries in a special distributed SQL
dialect?"**
No. Once the connection to the remote system is set up, ordinary SQL,
like the `SELECT` above, works against the remote table largely the
same way it would against a local one.

**"Is DRDA only useful between two IBM i systems?"**
DRDA is IBM i's own established, cross-system distributed database
standard; while this lesson focuses on the IBM i-to-IBM i case as the
clearest example, the underlying idea, standardized SQL access to a
remote relational database, is the important conceptual takeaway.

## Quick Recap

- DRDA lets a program query or update a Db2 for i database on a
  different system using ordinary SQL.
- It is the SQL-native, database-to-database counterpart to the
  REST/JSON integration approach covered earlier in this course.
- Once a connection to the remote system exists, familiar SQL syntax
  works against the remote table largely as it would locally.
- DRDA is best suited to genuine database-to-database needs, distinct
  from reaching a non-database or non-IBM i system.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I decide between DRDA and a REST API approach for a
  specific integration need between two systems?"
- "What would a program need to have set up before it could query a
  remote system's table using DRDA?"
