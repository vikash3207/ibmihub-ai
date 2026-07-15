# SQL Indexes and Views on Db2 for i

## Learning Objective

By the end of this lesson, you will be able to explain what an SQL
index and an SQL view are, and how each relates to a concept already
familiar from DDS: access paths and logical files.

## Simple Explanation

The Access Paths lesson earlier in this course explained that a keyed
access path lets the system find rows quickly without scanning a whole
table. An **SQL index** is the SQL way of creating that same kind of
access path:

```sql
CREATE INDEX MYLIB.CUSTNBR_IDX
  ON MYLIB.CUSTMAST (CUSTNBR);
```

A **view** is different: it does not store its own data or provide an
access path. Instead, it saves a `SELECT` statement under a name, so
that statement can be reused as if it were its own table:

```sql
CREATE VIEW MYLIB.ACTIVE_CUSTOMERS AS
  SELECT CUSTNBR, CUSTNAME
  FROM MYLIB.CUSTMAST
  WHERE ISACTIVE = 'Y';
```

Querying `MYLIB.ACTIVE_CUSTOMERS` runs the saved `SELECT` underneath,
without needing to repeat the `WHERE` condition every time.

## Why It Matters

This lesson connects two SQL concepts directly back to DDS concepts
already covered in this course: an SQL index plays the same role a
keyed access path already does, and a view plays a role similar to a
DDS logical file that selects and presents a subset of a physical
file's data. Recognizing this means an SQL index or view is not a
brand-new idea, just a different, SQL-native way of expressing
something already familiar.

## Practical Example

Recall the logical file concept covered earlier in this course: a DDS
logical file defines a view over a physical file, often with its own
key fields, without duplicating the underlying data. `CUSTNBR_IDX`
above provides fast lookup by customer number, the same role a keyed
logical file would play. `ACTIVE_CUSTOMERS` above provides a
ready-made, reusable query for active customers only, the same role a
select/omit logical file would play, expressed instead as an SQL view.

This is a simplified, illustrative example rather than a specific real
schema, but it reflects exactly how SQL indexes and views are used in
practice.

## Common Confusions

**"Does an SQL index store a separate copy of the table's data?"**
No. Like a keyed access path, an index stores just enough information
to find rows quickly; the actual data still lives in the table itself.

**"Does a view store its own data?"**
No. A view stores a `SELECT` statement, not data. Querying a view runs
that statement against the underlying table or tables each time.

**"Is an SQL index the same thing as a DDS logical file?"**
Not exactly the same object, but they play the same conceptual role: a
faster way to find rows by key, without duplicating data. An SQL view
is the closer match to a DDS logical file that also reshapes or filters
what a program sees.

## Quick Recap

- An SQL index is the SQL way of creating an access path for fast
  lookups, playing the same role a keyed logical file already does.
- An SQL view saves a `SELECT` statement under a name, playing a
  similar role to a DDS logical file that filters or reshapes data.
- Neither an index nor a view stores its own separate copy of the
  underlying table's data.
- These SQL concepts map directly onto access path and logical file
  ideas already covered earlier in this course.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you help me decide whether a specific query I have in mind
  would be better served by an index or a view?"
- "How is an SQL view similar to and different from a select/omit
  logical file?"
