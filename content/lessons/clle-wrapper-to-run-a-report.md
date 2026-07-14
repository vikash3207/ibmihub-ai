# Mini Project: CLLE Wrapper to Run a Report

## What We Are Building

A CLLE program, `RUNRPTC`, that checks the required file exists,
overrides the report's printer file to a specific output queue, calls the
`RPT001R` report program from the Batch Report Program mini project, and
submits the whole thing as a batch job.

## Business Scenario

Continuing the accounting team's nightly report need, this project
builds the piece that actually runs `RPT001R` safely, checking that
`CUSTMAST` exists before even attempting to call it, and making sure the
report lands on the right output queue automatically, without an operator
doing anything manually each night.

## Concepts Used

- `CHKOBJ` and `MONMSG`, from the Using CLLE for Batch Job Orchestration
  lesson.
- `OVRPRTF`, from the Printer File Overrides Basics lesson.
- `SBMJOB` and job queues, from the SBMJOB and Batch Job Basics and Job
  Queues and Output Queues lessons.

## Files and Programs Involved

- **`CUSTMAST`** and **`RPT001P`**, checked and overridden but not
  changed by this project.
- **`RPT001R`**, the report program from the Batch Report Program mini
  project, called but not modified here.
- **`RUNRPTC`**, the new CLLE wrapper program.

## Step-by-Step Build Outline

1. Use `CHKOBJ` to confirm `CUSTMAST` exists, with a `MONMSG` handling
   the case where it does not, exactly as covered in the Using CLLE for
   Batch Job Orchestration lesson.
2. If the check passes, use `OVRPRTF` to direct `RPT001P`'s output to a
   specific output queue and set its hold status.
3. Use `SBMJOB` to submit a command calling `RPT001R`, giving the
   submitted job a clear, recognizable name.
4. Wrap the `CALL` step in its own `MONMSG`, sending a clear message if
   the report program itself fails.

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
ENDDO

ENDPGM
```

Reading this step by step: `CHKOBJ` and its `MONMSG` stop the program
early with a clear message if `CUSTMAST` is missing, exactly the
orchestration pattern covered in the Using CLLE for Batch Job
Orchestration lesson. `OVRPRTF` then directs `RPT001P`'s output to
`RPTOUTQ` for this run, without changing `RPT001P` itself, as covered in
the Printer File Overrides Basics lesson. `SBMJOB` submits the actual
report call as its own named batch job, `RPT001`, freeing this program to
finish immediately rather than waiting for the report to complete.

## How to Test It

Test with `CUSTMAST` present, confirming the batch job submits
successfully and its resulting spool file lands on `RPTOUTQ`; then
temporarily rename or remove access to `CUSTMAST` to confirm the
`CHKOBJ` check stops the program cleanly with its message, rather than
submitting a job that would fail anyway.

## Common Mistakes

- Placing `OVRPRTF` after `SBMJOB` instead of before it, which would not
  affect the submitted job's printer file at all.
- Forgetting that `SBMJOB` runs independently, and mistakenly expecting
  `RUNRPTC` itself to wait for `RPT001R` to finish before ending.
- Reusing an override without considering the Library List in Real Job
  Execution lesson's point that a submitted job's settings, including
  overrides, are not automatically inherited unless deliberately carried
  over.

## Debugging Checklist

If the report does not land on `RPTOUTQ` as expected, follow the
Debugging Report Output Problems lesson's checklist: use `WRKSBMJOB` to
confirm the job actually ran, then `WRKOUTQ` against `RPTOUTQ`
specifically to see whether the spool file is there but perhaps held.

## Possible Extensions

A natural extension is adding a second `MONMSG` around the `OVRPRTF`
command itself, in case the specified output queue does not exist,
giving the whole wrapper a clear failure message at every step rather
than only around the file check and the call.

## Quick Recap

- `RUNRPTC` checks `CUSTMAST` exists, overrides `RPT001P`'s output
  queue, then submits `RPT001R` as a named batch job.
- `OVRPRTF` must come before `SBMJOB` to actually affect the submitted
  job's printer file.
- Testing should include both a normal run and a deliberately missing
  `CUSTMAST` to confirm the check works.

## Try Asking the AI Tutor

Use the AI Tutor to practice extending or troubleshooting this project.
For example, try asking:

- "How would I add a MONMSG specifically around the OVRPRTF command in
  this wrapper?"
- "What would happen if OVRPRTF were accidentally placed after SBMJOB
  instead of before it?"
