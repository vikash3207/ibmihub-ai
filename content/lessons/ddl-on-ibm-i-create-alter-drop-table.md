# DDL on IBM i: CREATE TABLE, ALTER TABLE, and DROP TABLE

## Learning Objective

By the end of this lesson, you will be able to create, change, and
remove a Db2 for i table using SQL DDL, and explain how an SQL table
relates to a traditional DDS-created physical file.

## Simple Explanation

Earlier lessons in this course covered DDS, defining a physical file's
record format and fields in a source member compiled with `CRTPF`.
**DDL** (Data Definition Language) is SQL's own way of defining
database objects, using statements like `CREATE TABLE`, `ALTER TABLE`,
and `DROP TABLE` instead of DDS source and compile commands.

```sql
CREATE TABLE MYLIB.CUSTMAST (
  CUSTNBR   DECIMAL(6, 0) NOT NULL,
  CUSTNAME  VARCHAR(30) NOT NULL,
  ISACTIVE  CHAR(1) DEFAULT 'Y'
);
```

This creates a table that is, underneath, the same kind of Db2 for i
object a DDS-defined physical file already is. `ALTER TABLE` changes
an existing table without dropping and recreating it:

```sql
ALTER TABLE MYLIB.CUSTMAST
  ADD COLUMN CREDITLIMIT DECIMAL(9, 2);
```

`DROP TABLE` removes the table entirely, including its data:

```sql
DROP TABLE MYLIB.CUSTMAST;
```

## Why It Matters

Many IBM i developers learn DDS first, so it is easy to assume SQL
tables are a completely different, unrelated thing. They are not: an
SQL-created table and a DDS-created physical file are both Db2 for i
tables underneath, readable by native RPGLE `CHAIN`/`READ` operations
and by SQL alike. Knowing DDL means being able to define and evolve
database structure directly in SQL, which matters increasingly as
more shops manage their schema this way, especially for new
development.

## Practical Example

Recall the physical files covered earlier in this course, defined with
DDS and compiled with `CRTPF`. Creating the equivalent structure with
DDL instead looks like the `CREATE TABLE` example above: same columns,
same underlying kind of database object, different way of defining it.
Adding a new column later with `ALTER TABLE` is the DDL equivalent of
changing a DDS source member and recompiling the physical file, without
needing to manage DDS keywords or a separate compile step.

This is a simplified, illustrative example rather than a specific real
table, but it reflects exactly how DDL is used to manage Db2 for i
tables in practice.

## Common Confusions

**"Is a table created with CREATE TABLE a completely different kind of
object than a DDS-defined physical file?"**
No. Both are Db2 for i tables at the object level. `CREATE TABLE` and
DDS plus `CRTPF` are two different ways of arriving at the same kind of
underlying database object, similar to the distinction covered earlier
in this course between DDS and SQL as two ways to define Db2 for i
data.

**"Does creating or altering a table require special authority?"**
Yes, in the same way creating or changing other IBM i objects does.
The caller needs sufficient authority over the library and, for
`ALTER TABLE`, over the existing table itself, following the same
object-authority concepts covered earlier in this course.

**"Does DROP TABLE ask for confirmation before deleting data?"**
No. `DROP TABLE` removes the table and its data immediately once it
runs successfully, with no built-in confirmation step, so it should be
used deliberately, especially against a table with real data in it.

## Quick Recap

- DDL (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`) is SQL's way of
  defining and changing Db2 for i tables, alongside the DDS approach
  already covered in this course.
- An SQL-created table and a DDS-created physical file are the same
  kind of underlying Db2 for i object.
- `ALTER TABLE` changes an existing table's structure without needing
  to drop and recreate it.
- `DROP TABLE` removes a table and its data immediately, with no
  confirmation step.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you show me the DDS equivalent of a CREATE TABLE statement I
  come up with, so I can compare them side by side?"
- "What authority would I actually need to run ALTER TABLE against an
  existing table?"
