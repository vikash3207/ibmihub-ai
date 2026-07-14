# Mini Project: Report with CLLE Submit Job Flow

## What We Are Building

An extended version of the CLLE Wrapper to Run a Report mini project's
`RUNRPTC`, adding a genuine submit-job flow: after submitting `RPT001R`
as a batch job, actually confirming it completed successfully rather
than submitting it and immediately forgetting about it.

## Business Scenario

The CLLE Wrapper to Run a Report mini project's `RUNRPTC` submits the
report and ends immediately, which is fine for the batch job itself, but
leaves the accounting team with no easy way to confirm the report
actually finished. This project adds that confirmation step, using the
job-tracking commands covered in the Operations lesson groups.

## Concepts Used

- `SBMJOB`, reused from the CLLE Wrapper to Run a Report mini project.
- `WRKSBMJOB` and job status values, from the Submitted Jobs and
  WRKSBMJOB and Job Status Values Explained lessons.
- `MONMSG`, reused from the Using CLLE for Batch Job Orchestration
  lesson.

## Files and Programs Involved

- **`RPT001P`** and **`RPT001R`**, reused without changes from the
  Batch Report Program mini project.
- **`RUNRPTC`**, extended from the CLLE Wrapper to Run a Report mini
  project with an added status-check step.

## Step-by-Step Build Outline

1. Start from `RUNRPTC` exactly as built in the CLLE Wrapper to Run a
   Report mini project: `CHKOBJ`, `OVRPRTF`, then `SBMJOB`.
2. After `SBMJOB` succeeds, send a message reminding whoever ran the
   wrapper that the job has only been submitted, not confirmed
   complete.
3. Use `WRKSBMJOB` interactively afterward to check `RPT001`'s status,
   following it from `JOBQ`, to `ACTIVE`, to completed, exactly as
   covered in the Job Status Values Explained lesson.

## Example Code

```clle
PGM

DCL VAR(&MSG) TYPE(*CHAR) LEN(80)

CHKOBJ OBJ(MYAPPLIB/CUSTMAST) OBJTYPE(*FILE)
MONMSG MSGID(CPF9801) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('CUSTMAST not found, report not run')
  SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)
  RETURN
ENDDO

OVRPRTF FILE(RPT001P) OUTQ(RPTOUTQ)

SBMJOB CMD(CALL PGM(RPT001R)) JOB(RPT001)
MONMSG MSGID(CPF0000) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('Failed to submit RPT001R')
  SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)
  RETURN
ENDDO

CHGVAR VAR(&MSG) VALUE('RPT001 submitted -- check WRKSBMJOB for status')
SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)

ENDPGM
```

This is nearly identical to `RUNRPTC` from the CLLE Wrapper to Run a
Report mini project; the genuinely new piece is the final message,
explicitly reminding whoever ran this wrapper to actually check
`WRKSBMJOB` for `RPT001`'s status, rather than assuming submission alone
means success.

## How to Test It

Run `RUNRPTC`, then immediately run `WRKSBMJOB` and watch `RPT001`'s
status change from `JOBQ` to `ACTIVE` to completed, confirming the
report actually finished, separately from confirming it was merely
submitted successfully.

## Common Mistakes

- Treating a successful `SBMJOB` submission as proof the report actually
  finished, when it only confirms the job was accepted onto a job
  queue, covered in the Job Queues and Output Queues lesson.
- Checking `WRKSBMJOB` too soon and assuming a `JOBQ` status means
  something has gone wrong, rather than simply still waiting its turn.
- Forgetting that `RPT001` is `WRKSBMJOB`'s job name, not `RPT001R`'s
  program name, when searching for it in the list.

## Debugging Checklist

If `RPT001` never seems to leave `JOBQ` status, follow the Job Queues
and Output Queues lesson's guidance: check `WRKJOBQ` to see whether
other jobs are backed up ahead of it, rather than assuming `RUNRPTC`
itself failed.

## Possible Extensions

A natural extension is having `RUNRPTC` loop, checking `WRKSBMJOB`'s
status programmatically a few times with short delays in between,
rather than requiring a person to check manually, though a fully
automated wait-and-confirm loop is a meaningfully more advanced pattern
beyond this small project's scope.

## Quick Recap

- This project extends `RUNRPTC` with an explicit reminder to check
  `WRKSBMJOB` after submission, rather than assuming submission alone
  means success.
- `WRKSBMJOB` shows `RPT001`'s status moving through `JOBQ`, `ACTIVE`,
  and completion.
- A successful `SBMJOB` only confirms the job was accepted, not that it
  finished.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "What would it take to have RUNRPTC itself check WRKSBMJOB's status,
  rather than relying on a person to check manually?"
- "How would I tell from WRKSBMJOB whether RPT001 finished successfully
  or failed partway through?"
