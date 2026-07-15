# Constraints on IBM i: Primary Key, Foreign Key, Unique, and Check

## Learning Objective

By the end of this lesson, you will be able to explain what a database
constraint is, and why it is a stronger guarantee than validating the
same rule only in application code.

## Simple Explanation

A **constraint** is a rule the database itself enforces on a table,
rejecting any change that would break it, regardless of which program
made the change. The most common constraints are:

- **Primary key**: says a column, or set of columns, must be unique
  and never `NULL`, and identifies each row.
- **Foreign key**: says a column's value must match an existing row in
  another table, preventing "orphan" rows that reference something
  that does not exist.
- **Unique**: says a column's values must never repeat, without
  necessarily being the primary key.
- **Check**: says a column's value must satisfy a condition, such as
  being within a valid range.

```sql
ALTER TABLE MYLIB.CUSTMAST
  ADD CONSTRAINT CUSTMAST_PK PRIMARY KEY (CUSTNBR);

ALTER TABLE MYLIB.ORDERS
  ADD CONSTRAINT ORDERS_CUST_FK
  FOREIGN KEY (CUSTNBR) REFERENCES MYLIB.CUSTMAST (CUSTNBR);

ALTER TABLE MYLIB.CUSTMAST
  ADD CONSTRAINT CUSTMAST_CREDIT_CHK
  CHECK (CREDITLIMIT >= 0);
```

## Why It Matters

Validating a rule only in RPGLE or SQLRPGLE application code means
that rule only holds if every single program that touches the table
remembers to check it. A constraint moves that guarantee into the
database itself, so it holds no matter which program, tool, or person
inserts or updates a row, including ad hoc changes made outside the
usual application programs. This is a meaningfully stronger guarantee
than application-only validation.

## Practical Example

Imagine an `ORDERS` table with a `CUSTNBR` column that is supposed to
always reference a real customer in `CUSTMAST`. Without a foreign key
constraint, a bug in one program, or a one-off SQL script run directly
against the table, could insert an order referencing a customer number
that does not exist. With the `ORDERS_CUST_FK` foreign key constraint
in place, the database itself rejects that insert, regardless of which
program or tool attempted it.

This is a simplified, illustrative example rather than a specific real
incident, but it reflects exactly what constraints are meant to
prevent.

## Common Confusions

**"If my RPGLE program already validates the customer number before
inserting an order, do I still need a foreign key constraint?"**
Yes, if the guarantee matters. Application validation only holds for
that one program. A constraint holds for every program, script, or
tool that touches the table, which is a meaningfully different level
of protection.

**"Does adding a constraint to an existing table check the data that
is already there?"**
Typically, yes: adding a constraint to a table that already has rows
will fail if existing data already violates it, which is worth
planning for before adding a constraint to a table already in use.

**"Is a unique constraint the same thing as a primary key?"**
No. A table can only have one primary key, and it cannot be `NULL`. A
unique constraint enforces no-duplicates on a column but does not
have to be the primary key, and a table can have more than one unique
constraint.

## Quick Recap

- A constraint is a rule the database itself enforces, rejecting any
  change that would break it, no matter which program made it.
- Primary key, foreign key, unique, and check are the most common
  constraint types, each enforcing a different kind of rule.
- Constraints are a stronger guarantee than validating the same rule
  only in application code, since they apply to every caller.
- Adding a constraint to a table that already has data can fail if
  existing rows already violate it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me an example of a check constraint that would make
  sense for a table with an order quantity column?"
- "What would happen if I tried to add a foreign key constraint to a
  table that already has some orphaned rows?"
