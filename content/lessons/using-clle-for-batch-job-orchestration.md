# Using CLLE for Batch Job Orchestration

## Learning Objective

By the end of this lesson, you will be able to read a CLLE program that
combines checking objects, calling programs, error handling, and
submitting batch work into one coordinated sequence.

## Simple Explanation

You have now learned each piece separately: submitting batch work with
`SBMJOB`, calling RPGLE programs with `CALL`, checking for required objects
with `CHKOBJ`, and catching problems with `MONMSG`. This lesson brings
those pieces together, showing how a single CLLE program can orchestrate a
small, realistic multi-step process, the same kind of nightly process
described conceptually all the way back in the Introduction to CLLE
lesson.

```clle
PGM

DCL VAR(&MSG) TYPE(*CHAR) LEN(80)

CHKOBJ OBJ(MYAPPLIB/CUSTMAST) OBJTYPE(*FILE)
MONMSG MSGID(CPF9801) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('CUSTMAST not found, stopping nightly process')
  SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)
  RETURN
ENDDO

CALL PGM(PROCESSORDER)
MONMSG MSGID(CPF0000) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('Order processing failed, stopping before report step')
  SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)
  RETURN
ENDDO

SBMJOB CMD(CALL PGM(BUILDREPORT)) JOB(NIGHTRPT)

ENDPGM
```

Reading this program step by step: it first confirms the `CUSTMAST` file
actually exists, stopping early with a clear message if it does not. It
then calls an RPGLE program, `PROCESSORDER`, to do the detailed order
processing, again stopping early with a clear message if that call fails.
Only if both of those steps succeed does it submit a separate batch job to
build a report, using `SBMJOB` so that reporting work runs independently
rather than holding up this program.

## Why It Matters

Real operational processes are rarely a single command; they are commonly
a sequence of dependent steps, where later steps should only happen if
earlier ones succeeded, and problems along the way need to be handled
clearly rather than causing a confusing, silent failure. This is exactly
the coordinating role described for CLLE from the very first lesson in
this lesson group, now shown as a complete, if simplified, working
example.

## Practical Example

Imagine an operations team relying on exactly this kind of nightly
process. If `CUSTMAST` is ever missing, perhaps due to an earlier step in
a larger process not completing, the team sees a clear message explaining
that specifically, rather than a confusing failure somewhere deeper in
order processing. If order processing itself fails, the process stops
before wasting time submitting a report job that would not have accurate
data anyway. When everything succeeds, the reporting step runs as its own
independent batch job, not tying up this program while the report is
built.

This is a simplified, illustrative example rather than a specific real
nightly process, but it reflects a genuinely common, practical way CLLE
programs are structured to orchestrate multi-step work.

## Common Confusions

**"Does this program itself do any of the detailed order processing or
report building?"**
No. Consistent with the When to Use CLLE vs RPGLE lesson, this CLLE program
only coordinates: checking, calling, and submitting. The detailed work
happens inside `PROCESSORDER` and `BUILDREPORT`, which are separate
programs this one simply calls or submits.

**"Why does RETURN appear after some MONMSG blocks but SBMJOB isn't
wrapped in one here?"**
`RETURN` stops this program early when an earlier step fails, since later
steps depend on it. This particular example does not add a `MONMSG` after
`SBMJOB` itself, since submitting a job to run independently, and that job
later succeeding or failing on its own, are different concerns; a more
complete real program might still choose to monitor the `SBMJOB` command
for submission-related problems.

**"Could this same orchestration be written as one giant RPGLE program
instead?"**
Technically, some of this could be approximated in RPGLE, but writing it
as CLLE keeps the coordination logic, checking, calling, and submitting,
clearly separated from the detailed business logic inside `PROCESSORDER`
and `BUILDREPORT`, which is exactly the complementary relationship
described throughout this lesson group.

## Quick Recap

- A single CLLE program can combine `CHKOBJ`, `CALL`, `MONMSG`, and
  `SBMJOB` to orchestrate a small, realistic multi-step process.
- Checking for required objects and handling failed calls early lets a
  process stop clearly rather than failing confusingly partway through.
- `SBMJOB` is commonly used for the parts of a process that can run
  independently, such as a reporting step.
- This orchestration role, coordinating without containing detailed
  business logic, is the same complementary relationship between CLLE and
  RPGLE introduced from the very first lesson in this lesson group.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why does this program check CUSTMAST before calling PROCESSORDER
  instead of just letting PROCESSORDER fail on its own?"
- "How could I monitor the SBMJOB command itself for submission
  problems?"
