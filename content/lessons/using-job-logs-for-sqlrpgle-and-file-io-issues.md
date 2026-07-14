# Using Job Logs for SQLRPGLE and File I/O Issues

## Learning Objective

By the end of this lesson, you will be able to connect job log messages
to specific SQLRPGLE and native file I/O problems covered earlier in this
path.

## Simple Explanation

The Understanding Job Logs lesson covered reading a job log generally.
SQLRPGLE and native file I/O programs each tend to produce their own
characteristic kinds of job log messages worth recognizing.

For native file I/O, a job log message often reports a specific file
operation failing outright, such as attempting a `WRITE` with a duplicate
key value, covered in the Writing Records with WRITE lesson, or a locked
record conflict, covered in the Basic File Locking Concept in RPGLE
lesson. These typically appear as genuine error messages, distinct from
the ordinary "not found" conditions already handled by `%FOUND` and
`%EOF`.

For SQLRPGLE, a job log does not usually show every `SQLCODE` value, since
checking `SQLCODE` after each statement, covered in the SQLCODE and
SQLSTATE Basics in SQLRPGLE lesson, is how a program handles expected
outcomes like "no row found" on its own. A job log message from embedded
SQL more often signals something the program itself did not already
check for and handle, such as a genuine database-level problem.

```rpgle
dcl-s custNbr packed(6:0);
dcl-s custName char(30);
dcl-s custBal packed(9:2);

custNbr = 2001;
custName = 'Jordan Lee';
custBal = 0;

exec sql
  insert into CUSTMAST (CUSTNBR, CUSTNAME, CUSTBAL)
  values (:custNbr, :custName, :custBal);

if sqlcode <> 0;
  dsply 'Insert failed, check the job log for detail';
endif;
```

Here, checking `sqlcode <> 0` after the `INSERT` catches a failure inside
the program itself, such as attempting to insert a duplicate key value.
Without this check, the same failure would still be recorded in the job
log, but the program would have no way of reacting to it directly; the
job log becomes the only place that failure is visible at all.

## Why It Matters

Recognizing what kind of message to expect from native file I/O versus
embedded SQL helps a developer interpret a job log more precisely,
distinguishing "this is exactly the kind of thing SQLCODE or %FOUND
should have already caught in the program's own logic" from "this is a
genuinely unexpected problem worth investigating through the job log."

## Practical Example

Imagine a job log showing an error tied to `CUSTRPT`, reporting a locked
record conflict during an `UPDATE` operation. This connects directly to
the Basic File Locking Concept in RPGLE lesson: another job likely held a
lock on that same record at the same moment. If the same program instead
used embedded SQL and a job log message appeared without the program
already reporting a specific `SQLCODE`-based message itself, that
generally signals something beyond the ordinary "row not found" case the
program's own `SQLCODE` check was designed to handle.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects how recognizing these patterns speeds up
interpreting a job log for either kind of program.

## Common Confusions

**"Does every SELECT INTO with SQLCODE = 100 show up as a job log
message?"**
No. `SQLCODE = 100`, covered in the SELECT INTO for Reading One Row
lesson, is an expected, ordinary outcome the program checks for directly
in its own logic; it does not need to appear as a job log message the
way a genuine, unhandled problem would.

**"Are file locking conflicts always reported the same way, regardless
of whether native I/O or embedded SQL is used?"**
The underlying concept, another job holding a lock on the same record, is
the same either way, though the exact message and how a program responds
to it can differ between native operations and embedded SQL statements.

**"If a job log shows no messages at all for a report that produced
wrong output, does that mean the printer file or file I/O is fine?"**
Not necessarily. As covered in the Debugging Report Output Problems
lesson, wrong or missing output can come from the underlying data
retrieval quietly returning different results than expected, rather than
from an operation that actually failed and logged a message.

## Quick Recap

- Native file I/O job log messages often report a specific failed
  operation, such as a duplicate key on `WRITE` or a record lock conflict.
- SQLRPGLE job log messages typically signal something beyond the
  ordinary outcomes a program's own `SQLCODE` check already handles.
- Recognizing these different patterns helps interpret a job log more
  precisely for either kind of program.
- A quiet job log does not automatically mean everything behaved
  correctly; some problems show up as wrong data rather than a logged
  message.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would a record lock conflict message actually look like in a job
  log?"
- "Why wouldn't an ordinary SQLCODE = 100 result ever need to appear as a
  job log message?"
