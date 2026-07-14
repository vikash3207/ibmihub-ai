# Library List in Real Job Execution

## Learning Objective

By the end of this lesson, you will be able to explain how a library list
can change during a job's execution, and where a batch job's starting
library list actually comes from.

## Simple Explanation

The Library List Explained in Depth lesson covered a library list's
structure and search order as a snapshot: system portion, product
portion, current library, and user portion. A library list is not
actually frozen for a job's entire lifetime; it can change while the job
runs, and a batch job's starting library list is itself a deliberate
choice, not something automatic.

Within a running job, the **`ADDLIBLE`** (Add Library List Entry) command
adds a library to the user portion of that job's library list, and
**`RMVLIBLE`** (Remove Library List Entry) removes one, both taking
effect immediately for the rest of that job, without needing to sign off
and back on.

```clle
ADDLIBLE LIB(TESTLIB) POSITION(*FIRST)

SBMJOB CMD(CALL PGM(MONTHENDRPT)) JOB(MONTHEND) INLLIBL(*CURRENT)
```

Here, `ADDLIBLE LIB(TESTLIB) POSITION(*FIRST)` adds `TESTLIB` to the
front of the current job's library list, exactly the testing scenario
covered in the Library List Explained in Depth lesson. The `SBMJOB`
command that follows explicitly names `INLLIBL(*CURRENT)`, telling IBM i
to start the new batch job with a copy of the submitting job's library
list at that moment, including the `TESTLIB` entry just added. When a
batch job is submitted with `SBMJOB` more generally, covered in the
SBMJOB and Batch Job Basics lesson, it does not automatically reuse the
submitting job's exact library list unless a setting like `INLLIBL` says
so; `SBMJOB` has its own settings controlling what library list the new
batch job actually starts with.

## Why It Matters

Beginners sometimes assume a library list is fixed for a job's entire
run, or that a submitted batch job automatically inherits everything
about the job that submitted it. Understanding that a library list can
change mid-job with `ADDLIBLE` and `RMVLIBLE`, and that a batch job's
starting library list is its own deliberate setting, explains real,
practical situations where a batch job unexpectedly cannot find an
object its submitting job could see just fine.

## Practical Example

Imagine a developer working interactively who temporarily adds `TESTLIB`
to their library list with `ADDLIBLE`, exactly as covered in the Library
List Explained in Depth lesson's testing example, then submits a batch
job with `SBMJOB` expecting it to also see `TESTLIB`. If `SBMJOB`'s
library list settings do not carry that temporary addition into the new
batch job, the batch job could fail to find an object that the
submitting job could see perfectly well moments earlier, a common,
genuinely confusing situation without understanding this distinction.

This is a simplified, illustrative example rather than a specific real
investigation, but it reflects a realistic, practical reason to
understand where a batch job's library list actually comes from.

## Common Confusions

**"Does ADDLIBLE change my library list permanently, for future
jobs?"**
No, exactly as covered in the Library List Explained in Depth lesson:
`ADDLIBLE` and `RMVLIBLE` apply only to the current job, for the
remainder of its run, not to future jobs.

**"Does a batch job submitted with SBMJOB always start with the exact
same library list as the job that submitted it?"**
Not automatically. `SBMJOB` has its own settings controlling the new
batch job's starting library list, which is exactly why a batch job can
sometimes behave differently than expected regarding which objects it can
find, compared to the job that submitted it.

**"If a batch job can't find an object, is the object always missing
entirely?"**
Not necessarily. As covered here, the object may exist perfectly well,
just not in a library that happens to be part of that specific batch
job's library list, which is a different problem from the object not
existing at all.

## Quick Recap

- `ADDLIBLE` and `RMVLIBLE` change a job's library list while it is
  running, taking effect immediately for the rest of that job.
- These changes apply only to the current job, not permanently to future
  jobs.
- A batch job submitted with `SBMJOB` does not automatically inherit the
  exact library list of the job that submitted it.
- A batch job unexpectedly failing to find an object often traces back to
  its own specific library list, not the object being missing entirely.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What SBMJOB setting would let me control exactly what library list a
  submitted batch job starts with?"
- "How would I check a batch job's actual library list after it has
  already started running?"
