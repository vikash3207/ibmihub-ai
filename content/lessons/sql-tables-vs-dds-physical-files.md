# SQL Tables vs DDS Physical Files

## Learning Objective

By the end of this lesson, you will be able to compare an SQL-defined table
directly against a DDS-defined physical file, and explain both their key
similarities and their most important practical differences.

## Simple Explanation

In the DDS and SQL: Two Ways to Define Db2 for i Data lesson, you learned
that Db2 for i data can be defined using either DDS or SQL. Now that you
have gone deep into DDS-defined physical files, their fields, their keys,
and their access paths, this lesson compares that approach directly against
defining the same kind of data using SQL.

An SQL **table**, created with a statement such as `CREATE TABLE`, and a
DDS-defined physical file are both, underneath, ways of describing and
storing Db2 for i data. Many of the same underlying concepts apply to both,
just using different terminology and syntax:

- A DDS **record format**'s fields correspond to an SQL table's **columns**.
- A DDS **key** corresponds to an SQL table's **primary key** or other
  defined key constraint.
- Both ultimately store rows of data that programs and queries can read and
  update.

Practical differences that matter for a beginner to know include:

- **Definition syntax.** DDS uses its own specification syntax written in a
  source member; SQL uses `CREATE TABLE` and related statements, similar to
  SQL syntax used on many other database platforms.
- **Naming flexibility.** SQL tables and columns can often support longer,
  more descriptive names than the traditional DDS naming rules covered in
  the Object Naming and Qualified Names in Practice lesson allow for native
  objects.
- **Ecosystem expectations.** Developers coming from outside the IBM i
  world are often already familiar with SQL `CREATE TABLE` syntax, which can
  make SQL-defined tables feel more approachable to newcomers, even though
  DDS-defined physical files remain fully capable and widely used.

## Why It Matters

Understanding this comparison helps you avoid a common beginner
misconception: that SQL tables and DDS physical files are fundamentally
different kinds of things, rather than two different ways of describing
largely the same kind of underlying Db2 for i data. This matters practically
because you may need to work with both approaches, sometimes within the
very same application, depending on when a particular piece of data was
originally defined.

## Practical Example

Imagine two developers on the same team. One maintains the long-established
`CUSTMAST` physical file, defined with DDS years ago, with fields for
customer number, name, and address. The other is starting a brand new
`ORDERS` table, defined with an SQL `CREATE TABLE` statement, with columns
for order number, customer number, and order date.

Despite being defined completely differently, both `CUSTMAST` and `ORDERS`
are genuine Db2 for i data, and, depending on how a query or program is
written, both can potentially be queried using SQL. This is a simplified,
illustrative example rather than a specific real system, but it reflects a
common, realistic mix found on real IBM i systems today.

## Common Confusions

**"Is an SQL table faster or better than a DDS physical file?"**
Not inherently. Both are genuine ways of storing Db2 for i data, and
detailed performance comparisons depend on many specific factors beyond the
scope of this introductory lesson. The right choice often depends on team
preference, existing conventions, and the specific application, rather than
one approach being universally superior.

**"If I create a table with SQL, does it use DDS behind the scenes?"**
This lesson intentionally does not go into that level of underlying
technical detail. What matters at this introductory level is that both
approaches are genuine, supported ways of defining Db2 for i data, each with
their own definition syntax and conventions.

**"Do keys work the same way in SQL tables as in DDS physical files?"**
The underlying concept, a field or column, or combination of them, used to
uniquely identify or order rows, is similar in spirit between a DDS key and
an SQL primary key or key constraint. The exact syntax and terminology
differ between the two approaches.

## Quick Recap

- An SQL table and a DDS-defined physical file are both genuine ways of
  defining and storing Db2 for i data, using different syntax and
  terminology.
- DDS record format fields correspond to SQL table columns; DDS keys
  correspond to SQL primary keys or key constraints.
- SQL tables are defined using `CREATE TABLE` and related SQL statements;
  DDS physical files are defined using DDS source and compiled with
  commands such as CRTPF.
- Neither approach is universally better; many real IBM i systems use a mix
  of both, depending on when and how each piece of data was originally
  defined.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What is the SQL equivalent of a DDS key field?"
- "Can I query a DDS-defined physical file using the same SQL syntax I
  would use for an SQL-defined table?"
