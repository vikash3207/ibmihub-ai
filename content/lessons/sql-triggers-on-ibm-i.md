# SQL Triggers on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain what a SQL
trigger is and when it runs, using `CREATE TRIGGER`.

## Simple Explanation

A **trigger** is logic that runs automatically whenever a specific
change happens to a table, such as an insert, update, or delete,
without any calling program needing to explicitly invoke it. A SQL
trigger is defined with `CREATE TRIGGER`:

```sql
CREATE TRIGGER MYLIB.ORDERS_AFTER_INSERT
  AFTER INSERT ON MYLIB.ORDERS
  REFERENCING NEW ROW AS NEWROW
  FOR EACH ROW
  BEGIN
    INSERT INTO MYLIB.ORDER_LOG (ORDERNBR, LOGGEDAT)
      VALUES (NEWROW.ORDERNBR, CURRENT_TIMESTAMP);
  END;
```

This trigger fires automatically every time a row is inserted into
`ORDERS`, logging it to `ORDER_LOG`, regardless of which program or
tool performed the insert.

IBM i also supports **native physical file triggers**, added with
`ADDPFTRG`, which predate SQL triggers and work at the physical file
level rather than through SQL. Both achieve a similar goal, automatic
logic on file changes; SQL triggers are the SQL-native way to do it,
and are the focus of this lesson.

## Why It Matters

A trigger guarantees that its logic runs on every change to a table,
no matter which program or tool made that change, in the same spirit
as the constraint guarantee covered earlier in this batch. This
matters for things like logging, auditing, or keeping related data in
sync, where relying on every single calling program to remember to do
it separately would be fragile.

## Practical Example

Imagine several different programs and an ad hoc SQL script can all
insert rows into `ORDERS`. Without a trigger, keeping `ORDER_LOG` up to
date would mean adding the same logging code to every one of those
programs, and hoping none of them are missed. With the
`ORDERS_AFTER_INSERT` trigger in place, every insert into `ORDERS` is
logged automatically, regardless of which program performed it.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuinely common use for triggers.

## Common Confusions

**"Does a trigger need to be called explicitly by a program?"**
No. That is the entire point of a trigger: it runs automatically when
its defined event happens, without any calling program knowing it
exists.

**"Are SQL triggers and native physical file triggers (ADDPFTRG) the
same thing?"**
No, though they serve a similar purpose. `ADDPFTRG` predates SQL and
attaches trigger logic at the physical file level; `CREATE TRIGGER` is
the SQL-native equivalent. A shop may encounter either, but this lesson
focuses on SQL triggers specifically.

**"Can a trigger cause unexpected side effects if a developer does not
know it exists?"**
Yes, and this is a genuine risk worth being aware of: because a
trigger runs invisibly from the calling program's perspective, a
developer troubleshooting unexpected behavior on a table needs to
remember to check for triggers, not just the calling program's own
logic.

## Quick Recap

- A trigger is logic that runs automatically when a specific change,
  such as an insert, update, or delete, happens to a table.
- `CREATE TRIGGER` defines a SQL trigger; `ADDPFTRG` is the older,
  native physical file equivalent.
- Triggers guarantee their logic runs regardless of which program or
  tool made the change, similar in spirit to a constraint's guarantee.
- Because triggers run invisibly to the calling program, they are worth
  checking for specifically when troubleshooting unexpected table
  behavior.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic example of when a trigger would
  be a better fit than adding the same logic to every calling
  program?"
- "How would I find out whether a specific table has any triggers
  attached to it?"
