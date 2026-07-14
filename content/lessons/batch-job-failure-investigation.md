# Mini Project: Batch Job Failure Investigation

## What We Are Building

Not new code, but a second guided troubleshooting exercise: a batch job
that fails silently overnight, with nobody watching it run, investigated
using `WRKSBMJOB` and the batch job's own job log.

## Business Scenario

Imagine the Printer File Report with Totals mini project's `RPT002R`
submitted as a nightly batch job, using a CLLE wrapper adapted from the
CLLE Wrapper to Run a Report mini project's `RUNRPTC`. One morning, the
report never shows up. Nobody was watching it fail; it simply did not
produce output.

## Concepts Used

- `WRKSBMJOB`, from the Submitted Jobs and WRKSBMJOB and Report with
  CLLE Submit Job Flow lessons.
- Retrieving a batch job's log, from the Job Logs in Batch Jobs lesson.
- The Basic Troubleshooting Flow for IBM i Developers lesson's ordered
  flow.

## Files and Programs Involved

- **`CUSTMAST`** and **`ORDHIST`**, both read by `RPT002R`.
- **`RPT002R`**, reused without changes from the Printer File Report
  with Totals mini project.
- A CLLE wrapper adapted from `RUNRPTC`, checking `CUSTMAST` with
  `CHKOBJ` before submitting `RPT002R`.

## Step-by-Step Build Outline

1. Notice the symptom: the expected report spool file is missing the
   next morning.
2. Follow the Basic Troubleshooting Flow for IBM i Developers lesson:
   check the job log first, starting with the wrapper's own job log to
   confirm it actually submitted the batch job successfully.
3. Use `WRKSBMJOB` to find the submitted `RPT002` job and check its
   final status; it shows as ended, not still waiting or running.
4. Since the job ended but produced no report, check that specific
   batch job's own job log, covered in the Job Logs in Batch Jobs
   lesson, not the wrapper's.
5. Find the actual error: `ORDHIST` was temporarily renamed during an
   unrelated maintenance task, and `RPT002R` failed trying to open it.
6. Recognize the deeper cause: the wrapper's `CHKOBJ` only ever checked
   `CUSTMAST`, never `ORDHIST`, so the check passed even though a file
   `RPT002R` actually depends on was unavailable.

## Example Code

```clle
CHKOBJ OBJ(MYAPPLIB/CUSTMAST) OBJTYPE(*FILE)
MONMSG MSGID(CPF9801) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('CUSTMAST not found, report not run')
  SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)
  RETURN
ENDDO
```

This is the exact `CHKOBJ` step from `RUNRPTC`, covered in the CLLE
Wrapper to Run a Report mini project. Looking at it closely during this
investigation reveals the actual gap: it checks `CUSTMAST` only, even
though `RPT002R` also depends on `ORDHIST`, which this wrapper never
checks at all.

## How to Test It

Rename `ORDHIST` temporarily, submit the report through the wrapper,
and confirm the wrapper itself reports success even though `RPT002R`
subsequently fails once it actually runs, exactly reproducing the
original symptom for practice.

## Common Mistakes

- Assuming a missing report always means the wrapper itself failed,
  rather than checking whether the wrapper succeeded but the report
  program it called failed separately.
- Checking only the wrapper's own job log and stopping there, missing
  that the actual failure is recorded in the submitted batch job's
  separate job log instead.
- Writing a `CHKOBJ` check for only one of several files a report
  program actually depends on, creating exactly this kind of false
  sense of safety.

## Debugging Checklist

- Check the wrapper's own job log first: did it submit the batch job
  successfully at all?
- Use `WRKSBMJOB` to find the batch job and confirm its final status.
- If it ended without producing expected output, check that specific
  job's own job log next, not the wrapper's.
- Read the message detail to identify exactly which object the failure
  involved.

## Possible Extensions

A natural extension is adding a second `CHKOBJ` check for `ORDHIST`
alongside the existing one for `CUSTMAST`, closing exactly the gap this
investigation uncovered, so a missing `ORDHIST` is caught before
submission rather than discovered only after a failed overnight run.

## Quick Recap

- A batch job that "just doesn't show up" needs its own separate
  investigation from the wrapper that submitted it.
- `WRKSBMJOB` confirms whether the batch job itself ran and ended;
  its own job log explains why it failed.
- A `CHKOBJ` check is only as complete as the files it actually checks;
  missing one dependency creates a false sense of safety.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a second CHKOBJ check for ORDHIST to this wrapper?"
- "Why did the wrapper itself report success even though the report
  never actually ran successfully?"
