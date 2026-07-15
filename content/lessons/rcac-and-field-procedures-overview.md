# Row and Column Access Control and Field Procedures Overview

## Learning Objective

By the end of this lesson, you will be able to explain, at a high
level, what Row and Column Access Control (RCAC) and Field Procedures
(FIELDPROC) each do differently from the table-level constraints
already covered in the Advanced SQL lessons.

## Simple Explanation

The Constraints lesson in the Advanced SQL batch covered rules like
primary key, foreign key, and check, which apply the same way to every
row and every user. Two more advanced Db2 for i security mechanisms go
further, by making access depend on who is asking:

- **RCAC** (Row and Column Access Control): lets Db2 for i restrict
  which rows a user can see, or mask which columns they can see, based
  on who that user is, enforced by the database itself rather than by
  application logic.
- **FIELDPROC** (Field Procedures): lets a column's actual stored value
  be automatically transformed, such as being encrypted, every time it
  is written or read, again enforced at the database level rather than
  by application logic remembering to do it.

```sql
CREATE PERMISSION MYLIB.CUSTMAST_ROW_ACCESS
  ON MYLIB.CUSTMAST
  FOR ROWS WHERE VERIFY_GROUP_FOR_USER(SESSION_USER, 'ORDERGRP') = 1
  ENFORCED FOR ALL ACCESS
  ENABLE;
```

A permission like this, once enabled, means only users who verify as
belonging to `ORDERGRP` can see rows in `CUSTMAST` at all, checked by
the database itself for every access.

## Why It Matters

A constraint, covered in the Advanced SQL batch, enforces the same rule
for everyone. RCAC and FIELDPROC go further: they let "the same rule
for everyone" become "different visibility depending on who is
asking," still enforced by the database rather than trusted to
application code. This matters because it closes a gap application-only
logic cannot: even a program, or an ad hoc query, that never
considered a specific user's restrictions still gets the database's
own enforcement applied.

## Practical Example

Imagine `CUSTMAST` contains customer records for multiple regional
sales teams, and each team should only see their own region's
customers, regardless of which program or ad hoc query accesses the
table. Without RCAC, this restriction would need to be built into every
program and query that touches `CUSTMAST`, exactly the kind of
duplicated-logic risk already covered in the Common IBM i Integration
Mistakes lesson. With RCAC enforcing row visibility by region at the
database level, this restriction applies automatically and consistently,
no matter which program or tool accesses the table.

This is a simplified, illustrative example rather than a specific real
implementation, but it reflects exactly why RCAC exists.

## Common Confusions

**"Is RCAC the same thing as a check constraint, covered in the
Advanced SQL batch?"**
No. A check constraint enforces the same rule for every row and every
user. RCAC enforces different visibility depending on who is asking,
which a plain constraint cannot express.

**"Does FIELDPROC replace normal column encryption handled by an
application?"**
It offers an alternative: instead of every program remembering to
encrypt and decrypt a sensitive column itself, FIELDPROC handles that
transformation at the database level automatically, for every access.

**"Do I need to design a full RCAC or FIELDPROC policy to understand
this lesson?"**
No. This lesson stays at a high level: what these two mechanisms do
differently from a plain constraint, and why that matters. Designing a
complete RCAC or FIELDPROC policy for a real system is a deeper,
more advanced topic beyond this introductory lesson.

## Quick Recap

- RCAC lets Db2 for i restrict which rows or columns a user can see,
  based on who they are, enforced by the database itself.
- FIELDPROC lets a column's value be automatically transformed, such as
  encrypted, on every read or write, also enforced at the database
  level.
- Both go further than a plain constraint, which enforces the same
  rule for every row and every user regardless of who is asking.
- This lesson stays at a high level; designing a complete RCAC or
  FIELDPROC policy is a deeper topic beyond this introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic scenario where RCAC would be a
  better fit than a plain check constraint?"
- "Why does enforcing column masking at the database level with
  FIELDPROC matter more than trusting every program to do it
  consistently?"
