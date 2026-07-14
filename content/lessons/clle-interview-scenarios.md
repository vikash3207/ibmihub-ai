# CLLE Interview Scenarios

## What This Lesson Prepares You For

CLLE questions in interviews usually focus on orchestration: when to use
CLLE instead of RPGLE, how error handling with `MONMSG` works, and how a
batch job is checked and submitted safely. This lesson works through the
scenarios most likely to come up.

## Concepts to Revise First

- When to Use CLLE vs RPGLE.
- `MONMSG` and basic error handling in CLLE.
- Using CLLE for Batch Job Orchestration.
- `SBMJOB` and Batch Job Basics.
- The CLLE Wrapper to Run a Report and Report with CLLE Submit Job Flow
  mini projects.

## Common Interview Questions

- "When would you write a CLLE program instead of an RPGLE program?"
- "What does `MONMSG` actually do?"
- "What is the difference between calling a program directly and
  submitting it with `SBMJOB`?"
- "Why would you use `CHKOBJ` before calling a program that reads a
  file?"

## Good Beginner-Level Answers

For "when would you write a CLLE program instead of an RPGLE program?", a
good answer is: "CLLE is best for orchestration: checking that things are
in place, setting up overrides, calling other programs, and submitting
batch jobs. It's not meant for heavy business logic, that's what RPGLE or
SQLRPGLE are for. A typical pattern is a small CLLE wrapper checking a
file exists, then submitting an RPGLE report program as a batch job."

## Scenario-Based Questions

- "A CLLE wrapper checks that a file exists with `CHKOBJ`, then submits a
  report program with `SBMJOB`. The wrapper reports success every night,
  but the report is sometimes still missing. What would you check?"
- "You are asked to explain why `OVRPRTF` has to come before `SBMJOB` in
  a wrapper, not after. How would you explain that?"
- "A `MONMSG` around a `CALL` step catches an error, but the program
  still doesn't behave the way you'd expect afterward. What would you
  check?"

## How to Explain Your Thinking

For the "report is sometimes still missing" scenario, a strong answer
reasons about what the check actually covers versus what the program
actually needs: "A `CHKOBJ` check only proves the specific object it
names exists. If the report program reads two files but the wrapper only
checks one of them, the wrapper can report success even though the
report program itself later fails on the file it never checked." This is
exactly the gap investigated in the Batch Job Failure Investigation mini
project.

## Common Weak Answers to Avoid

- Saying "CLLE and RPGLE can do the same things" without explaining that
  CLLE is meant for orchestration, not heavy data processing.
- Describing `MONMSG` as making an error "go away," rather than
  explaining that it catches a specific message ID and lets you decide
  what to do next.
- Not mentioning that `SBMJOB` runs independently, so the calling program
  does not wait for the submitted job to finish.

## Practical Examples

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

ENDPGM
```

A good interview answer walks through this in order: `CHKOBJ` and its
`MONMSG` stop the program early with a clear message if `CUSTMAST` is
missing; `OVRPRTF` must come before `SBMJOB` so the submitted job
actually picks up the override; `SBMJOB` then runs the report
independently, without this wrapper waiting for it to finish.

## Mini Practice Task

Add a second `CHKOBJ` check to the example above for a file named
`ORDHIST`, with its own `MONMSG`, and explain out loud why checking only
one of two files a report depends on can create a false sense of safety.

## Quick Recap

- CLLE is for orchestration: checking, overriding, calling, and
  submitting; not for heavy business logic.
- `MONMSG` catches a specific message ID; it does not fix the underlying
  problem by itself.
- `OVRPRTF` must come before `SBMJOB` to affect the submitted job's
  printer file.
- A `CHKOBJ` check is only as complete as the files it actually checks.

## Try Asking the AI Tutor

Use the AI Tutor to practice these scenarios. For example, try asking:

- "Can you walk me through why a CLLE wrapper might report success even
  though the program it submitted failed?"
- "How would I explain the difference between CALL and SBMJOB in an
  interview?"
