# Common SQLRPGLE Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize the most common
beginner mistakes across embedded SQL in RPGLE, and apply a simple set of
best practices to avoid them.

## Simple Explanation

This lesson brings together the embedded SQL operations covered across
both SQLRPGLE Basics lesson groups, `SELECT INTO`, cursors, `INSERT`,
`UPDATE`, `DELETE`, `WHERE`, `ORDER BY`, `JOIN`, and `NULL` handling, into
one focused list of the mistakes beginners make most often.

A few of the most common mistakes:

- **Forgetting the colon on a host variable.** As covered in the Host
  Variables in SQLRPGLE lesson, a host variable needs its leading colon
  inside an `EXEC SQL` block; without it, SQL looks for a matching column
  name instead.
- **Forgetting to check SQLCODE after SELECT INTO or FETCH.** As covered
  in the Handling No Row Found in SQLRPGLE lesson, skipping this check
  means a program cannot tell whether a host variable holds a real
  retrieved value.
- **Forgetting to CLOSE a cursor.** As covered in the Using SQL Cursor to
  Read Multiple Rows lesson, an opened cursor should always be closed
  once finished with it.
- **Assuming ORDER BY matches a file's own key order automatically.** As
  covered in the ORDER BY and Result Ordering lesson, a query's result
  order is not guaranteed unless `ORDER BY` says so explicitly.
- **Treating NULL the same as blank or zero.** As covered in the NULL
  Handling Basics in SQLRPGLE lesson, `NULL` means no value at all, a
  genuinely different thing from a blank string or a zero number.
- **Writing an embedded UPDATE or DELETE with an imprecise WHERE
  clause.** As covered in the UPDATE and DELETE with Embedded SQL lesson,
  every row matching the `WHERE` clause is affected, not just one.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);

custNbr = 1042;

exec sql
  select CUSTNAME into :custName
  from CUSTMAST
  where CUSTNBR = :custNbr;

if sqlcode = 0;
  dsply custName;
endif;
```

This short example already reflects several best practices: the colon is
present on both host variables, and `SQLCODE` is checked before the
retrieved value is used.

## Why It Matters

Almost every embedded SQL bug in beginner SQLRPGLE code traces back to one
of a small number of familiar mistakes. Recognizing this short, repeatable
list turns embedded SQL debugging into a quick checklist, and helps new
code avoid these mistakes from the start.

## Practical Example

Imagine reviewing a new SQLRPGLE program that occasionally displays a
stale customer name. Checking against this list quickly surfaces the
likely cause: the program is missing a `SQLCODE` check after `SELECT
INTO`, exactly the mistake described above, rather than a more obscure or
unrelated problem.

This is a simplified, illustrative example rather than a specific real
review, but it reflects how useful a short, known list of common
mistakes is when reading or debugging embedded SQL code.

## Common Confusions

**"Are these mistakes only made by beginners?"**
They are most common among beginners, but even experienced developers
occasionally slip up on one of these, especially forgetting a `SQLCODE`
check in a hurried change. The value of this list is in having a quick,
repeatable checklist to reach for, regardless of experience level.

**"Is this the complete list of every possible embedded SQL mistake?"**
No. This lesson focuses on the most common mistakes connected to the
beginner-level operations covered across both SQLRPGLE Basics lesson
groups. More advanced topics, such as dynamic SQL or SQL procedures, have
their own separate considerations beyond this introduction.

**"Which mistake on this list is most important to avoid?"**
All six matter, but forgetting to check `SQLCODE` is likely the single
most common source of subtle, hard-to-notice bugs, since the program
keeps running instead of failing outright, often producing quietly wrong
results, exactly the same risk covered for native file I/O in the Common
RPGLE File I/O Mistakes and Best Practices lesson.

## Quick Recap

- The most common embedded SQL mistakes are: forgetting a host variable's
  colon, skipping `SQLCODE` checks, leaving a cursor open, assuming
  `ORDER BY` behavior without stating it explicitly, confusing `NULL`
  with blank or zero, and writing an imprecise `WHERE` clause on
  `UPDATE`/`DELETE`.
- Checking this short list first turns embedded SQL debugging into a
  quick checklist rather than an open-ended search.
- This list focuses on the beginner-level embedded SQL covered across
  both SQLRPGLE Basics lesson groups; more advanced topics have their own
  separate considerations.
- Even experienced developers occasionally make these same mistakes,
  which is exactly why the checklist stays useful over time.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Which of these common mistakes is easiest to accidentally reintroduce
  when modifying existing code?"
- "How would I explain the NULL versus zero mistake to someone new to
  SQLRPGLE?"
