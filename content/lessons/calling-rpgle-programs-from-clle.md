# Calling RPGLE Programs from CLLE

## Learning Objective

By the end of this lesson, you will be able to write a `CALL` command to
run an RPGLE program from a CLLE program, passing values using `PARM`.

## Simple Explanation

You have now learned enough CLLE basics, variables, conditions, to look at
one of the most common things a CLLE program actually does: calling an
RPGLE program to carry out detailed business logic, exactly the kind of
orchestration described in the When to Use CLLE vs RPGLE lesson.

A program is called using the **`CALL`** command, naming the program to
run and, optionally, the values to pass to it using **`PARM`**:

```clle
DCL VAR(&CUSTNAME) TYPE(*CHAR) LEN(30)
DCL VAR(&ORDERTOTAL) TYPE(*DEC) LEN(9 2)

CHGVAR VAR(&CUSTNAME) VALUE('Jordan Lee')
CHGVAR VAR(&ORDERTOTAL) VALUE(150.00)

CALL PGM(PROCESSORDER) PARM(&CUSTNAME &ORDERTOTAL)
```

Here, `CALL` runs a program named `PROCESSORDER`, passing `&CUSTNAME` and
`&ORDERTOTAL` as parameters. This connects directly to the Parameters and
Prototypes in RPGLE lesson: the called RPGLE program would declare a
matching procedure interface, or main-program parameter list, expecting to
receive a customer name and an order total in that same order, so it can
use those values in its own business logic.

## Why It Matters

Calling other programs is central to how CLLE coordinates work: rather than
CLLE containing the detailed business logic itself, it calls RPGLE
programs that do that work, passing along whatever values those programs
need. Understanding `CALL` and `PARM` is essential to reading or writing
any CLLE program that orchestrates real business processing.

## Practical Example

Imagine the nightly process described in earlier CLLE lessons. A CLLE
program gathers a customer name and order total, then uses `CALL
PGM(PROCESSORDER) PARM(&CUSTNAME &ORDERTOTAL)` to run an RPGLE program that
applies the actual business rules for processing that order, such as
checking inventory or updating a balance.

The CLLE program itself never touches the detailed business logic; it
simply hands off the relevant values to the RPGLE program built to handle
them. This is a simplified, illustrative example rather than a specific
real process, but it reflects a genuinely common, everyday pattern in IBM i
applications.

## Common Confusions

**"Does the order of values in PARM matter?"**
Yes. The values passed in `PARM` are matched, in order, to the parameters
the called program expects, similar to how parameter order matters when
calling an RPGLE subprocedure, as covered in the Parameters and Prototypes
in RPGLE lesson.

**"Can CALL pass literal values instead of only variables?"**
`PARM` most commonly passes variables, since the called program typically
needs to both receive and, in some cases, change the value. Whether a
literal can be used directly depends on how the called program's
parameters are defined.

**"Does the calling CLLE program need to know how PROCESSORDER's internal
logic works?"**
No. The CLLE program only needs to know what values `PROCESSORDER`
expects to receive, in what order, not any detail about how it uses those
values internally. This separation is exactly the orchestration role CLLE
plays, as covered in the When to Use CLLE vs RPGLE lesson.

## Quick Recap

- `CALL PGM(programName)` runs another program; `PARM` passes values to
  it.
- Values passed in `PARM` are matched, in order, to the parameters the
  called program expects.
- CLLE commonly uses `CALL` to hand off detailed business logic to RPGLE
  programs, rather than containing that logic itself.
- The calling CLLE program only needs to know what values a called program
  expects, not how it uses them internally.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I pass the wrong number of parameters in a CALL
  command?"
- "Can a called RPGLE program change a variable's value back in the
  calling CLLE program?"
