# Printer File Overrides Basics

## Learning Objective

By the end of this lesson, you will understand what a printer file
override does at a basic level, and be able to read a simple `OVRPRTF`
example.

## Simple Explanation

Every printer file lesson so far has assumed a program's printer file
always behaves the same way. **`OVRPRTF`** (Override with Printer File)
lets a printer file's runtime behavior be changed temporarily, without
editing the program or the printer file object itself, such as which
output queue its output goes to, or whether the resulting spool file
should be held.

```clle
OVRPRTF FILE(CUSTRPTP) OUTQ(MYOUTQ) HOLD(*YES)
CALL PGM(CUSTRPT)
```

Here, `OVRPRTF FILE(CUSTRPTP) OUTQ(MYOUTQ) HOLD(*YES)` tells IBM i that,
for whatever program runs next, `CUSTRPTP`'s output should go to the
`MYOUTQ` output queue and its resulting spool file should be held rather
than released to print immediately, as covered in the Working with
Output Queues using WRKOUTQ lesson. `CALL PGM(CUSTRPT)` then runs the
report program exactly as before; `CUSTRPT` itself contains no code
aware that an override is even in effect.

## Why It Matters

Overrides let the same, unmodified report program produce output
differently depending on how it happens to be run, without needing
separate copies of the program or its printer file for every situation.
This is a common, practical way IBM i separates a program's own logic
from decisions about exactly where its output should go.

## Practical Example

Imagine the daily customer balance report needing to go to a specific
output queue only when run for month-end processing, held for a
supervisor's review before printing, while every other day it should
print normally. Rather than changing `CUSTRPT` itself, an `OVRPRTF`
command specific to month-end processing redirects and holds its output
just for that run, leaving the program and its printer file completely
unchanged for every other day.

This is a simplified, illustrative example rather than a specific real
process, but it reflects a genuinely common, practical reason overrides
exist.

## Common Confusions

**"Does OVRPRTF change the CUSTRPTP printer file object itself?"**
No. The override is temporary, applying only to the program run
immediately after it in the same job; `CUSTRPTP`'s own object definition
is completely unchanged.

**"Does the CUSTRPT program need any special code to work with an
override in effect?"**
No. This is exactly the point of an override: `CUSTRPT` runs the same
way it always does, with no awareness that its printer file's output
queue or hold status has been changed for this particular run.

**"Are OUTQ and HOLD the only things OVRPRTF can change?"**
No, though this lesson focuses on these two common, easy-to-understand
examples. `OVRPRTF` supports other override options as well, such as
number of copies, but the full range of options is a more detailed topic
beyond this introduction.

## Quick Recap

- `OVRPRTF FILE(name) OUTQ(queue) HOLD(*YES)` temporarily changes a
  printer file's runtime behavior for the program run immediately after
  it.
- An override does not change the printer file object itself, and does
  not require any special code in the program that uses it.
- Overrides let the same program produce differently routed or handled
  output depending on how it is run, without needing separate copies of
  the program.
- This lesson covers `OUTQ` and `HOLD` as basic, common examples;
  `OVRPRTF` supports other options, such as copies, beyond this
  introduction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I change this override to print three copies instead of
  holding the output?"
- "Does an override stay in effect for every program called afterward, or
  just the very next one?"
