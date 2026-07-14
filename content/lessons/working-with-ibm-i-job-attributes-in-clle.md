# Working with IBM i Job Attributes in CLLE

## Learning Objective

By the end of this lesson, you will be able to use `RTVJOBA` to retrieve
basic attributes of the job a CLLE program is running in, and explain why
a program might need to know this information.

## Simple Explanation

In the Job Logs and Spool Files Basics lesson, you learned that a job is a
unit of work running on IBM i. Every CLLE program runs inside some job,
whether interactive or submitted with `SBMJOB`, as covered in the SBMJOB
and Batch Job Basics lesson. That job has its own attributes, such as its
name, number, and the user profile running it, which a CLLE program can
retrieve using **`RTVJOBA`** (Retrieve Job Attributes):

```clle
DCL VAR(&JOBNAME) TYPE(*CHAR) LEN(10)
DCL VAR(&JOBUSER) TYPE(*CHAR) LEN(10)
DCL VAR(&JOBNBR) TYPE(*CHAR) LEN(6)
DCL VAR(&MSG) TYPE(*CHAR) LEN(80)

RTVJOBA JOB(&JOBNAME) USER(&JOBUSER) NBR(&JOBNBR)

CHGVAR VAR(&MSG) VALUE('Running as job ' *CAT &JOBNAME *CAT '/' *CAT +
  &JOBUSER *CAT '/' *CAT &JOBNBR)
SNDPGMMSG MSG(&MSG)
```

`RTVJOBA` fills in the variables named in its keyword parameters, `JOB`,
`USER`, and `NBR` here, with the current job's actual name, user, and job
number. `RTVJOBA` supports many other job attributes beyond these three,
but this lesson focuses on a few of the most commonly used ones.

## Why It Matters

Knowing the job it is running in lets a CLLE program build clearer
messages, log entries, or decisions that reference exactly which job did
the work, which is especially useful once several jobs, interactive and
batch, might be running around the same time. This connects directly to
the SBMJOB and Batch Job Basics lesson: a batch job's own name and number,
retrieved with `RTVJOBA`, can help confirm exactly which submitted job
produced a particular result or message.

## Practical Example

Imagine a batch job submitted with `SBMJOB`, as covered in the earlier
lesson, running an order-processing CLLE program. That program uses
`RTVJOBA` to retrieve its own job name and number, and includes them in a
message it sends when it finishes, making it immediately clear, to anyone
checking messages or job logs later, exactly which specific batch job
produced that message.

This is a simplified, illustrative example rather than a specific real
process, but it reflects a genuinely common, practical reason CLLE
developers retrieve job attributes.

## Common Confusions

**"Does RTVJOBA work differently for an interactive job versus a batch
job?"**
No. `RTVJOBA` retrieves the attributes of whatever job the CLLE program
happens to be running in, whether that job is interactive or a batch job
submitted with `SBMJOB`; the command itself works the same way either way.

**"Do I need to retrieve every job attribute RTVJOBA supports?"**
No. `RTVJOBA` accepts only the keyword parameters for the specific
attributes a program actually needs, such as `JOB`, `USER`, and `NBR` in
the example above, rather than requiring every possible attribute to be
retrieved every time.

**"Is a job's name the same as the name of the program running in it?"**
No. A job's name, retrieved with `RTVJOBA`'s `JOB` parameter, identifies the
job itself, which can run one or more programs during its lifetime. This is
a different thing from the name of any specific program, such as the CLLE
or RPGLE program currently running within that job.

## Quick Recap

- `RTVJOBA` retrieves attributes of the current job into CL variables,
  such as the job's name, user, and job number.
- Every CLLE program runs inside some job, whether interactive or a batch
  job submitted with `SBMJOB`.
- Retrieving job attributes helps build clearer messages or log entries
  that identify exactly which job did the work.
- `RTVJOBA` only retrieves the specific attributes named in its keyword
  parameters, not every possible attribute at once.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other job attributes RTVJOBA can retrieve besides job
  name, user, and job number?"
- "How is a job's name different from the name of the program currently
  running in it?"
