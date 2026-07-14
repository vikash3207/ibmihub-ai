# Calling RPGLE Programs with Parameters from CLLE

## Learning Objective

By the end of this lesson, you will understand how a value can flow both
ways between a CLLE program and an RPGLE program it calls, and why
matching data types carefully between the two languages matters.

## Simple Explanation

In the Calling RPGLE Programs from CLLE lesson, you saw `CALL` pass values
into an RPGLE program using `PARM`. What that lesson did not go into is
that parameters passed this way can also carry a value back out: if the
called RPGLE program changes one of its parameters, the calling CLLE
program sees that updated value once the call returns.

```clle
DCL VAR(&ORDERTOTAL) TYPE(*DEC) LEN(9 2)
DCL VAR(&DISCOUNTEDTOTAL) TYPE(*DEC) LEN(9 2)

CHGVAR VAR(&ORDERTOTAL) VALUE(150.00)

CALL PGM(APPLYDISCOUNT) PARM(&ORDERTOTAL &DISCOUNTEDTOTAL)

* &DISCOUNTEDTOTAL now holds whatever value APPLYDISCOUNT calculated
```

Here, `&DISCOUNTEDTOTAL` starts out empty. The RPGLE program
`APPLYDISCOUNT`, expecting a matching parameter in its own procedure
interface, calculates a discounted total and assigns it to that same
parameter internally. Once `CALL` returns, the CLLE program can use
`&DISCOUNTEDTOTAL` as if it had been filled in directly, because the
RPGLE program changed it during the call.

Getting this to work correctly depends on the CL variable's declared type
and length lining up with what the RPGLE program's parameter expects, as
covered in the Variables and Data Types in RPGLE lesson: a CL `*DEC`
variable with a matching length corresponds to an RPGLE `packed` parameter,
a CL `*CHAR` variable corresponds to an RPGLE `char` parameter, and so on.
Mismatched types or lengths between the two sides can cause the call to
fail or produce incorrect results.

## Why It Matters

Understanding that parameters can carry values back out, not just in,
explains how a CLLE program can get a calculated result, a status, or other
information back from an RPGLE program it calls, without needing files or
data areas just to pass a single value between them. Careful attention to
matching data types between CL and RPGLE is what makes this reliable.

## Practical Example

Imagine the nightly process from earlier CLLE lessons, where a CLLE
program needs a discounted order total calculated by an RPGLE program.
Rather than the RPGLE program writing that result somewhere else for the
CLLE program to look up separately, it simply assigns the result to a
parameter, and the CLLE program reads that same parameter once the call
returns, already updated.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical way CLLE and RPGLE
exchange a calculated result through a single `CALL`.

## Common Confusions

**"Does every parameter automatically come back changed?"**
No. A parameter only reflects a new value if the called RPGLE program
actually assigns something to it internally. A parameter the RPGLE program
only reads, similar to a `const` parameter covered in the Parameters and
Prototypes in RPGLE lesson, will not change from the caller's perspective.

**"What happens if the CL variable's length doesn't match the RPGLE
parameter's length?"**
This is a common source of problems: a mismatch between a CL variable's
declared type and length and what the RPGLE program's parameter expects
can cause the call to fail or produce unexpected, incorrect values, rather
than being automatically adjusted.

**"Is this the same mechanism as return in an RPGLE subprocedure?"**
Not quite. `return`, covered in the Parameters and Prototypes in RPGLE
lesson, sends back exactly one value from a subprocedure call. Passing a
value back through a `CALL` parameter, as covered in this lesson, can
return more than one changed value at once, since more than one parameter
can be affected.

## Quick Recap

- A parameter passed through `CALL` and `PARM` can carry a value both into
  and back out of the called program.
- If the called RPGLE program assigns a new value to a parameter, the
  calling CLLE program sees that updated value once the call returns.
- CL and RPGLE data types and lengths must match carefully for parameters
  to pass correctly between the two languages.
- This lets a CLLE program get a calculated result back from an RPGLE
  program through a single `CALL`, without needing a file or data area.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I pass a CL *CHAR variable to an RPGLE parameter
  declared as packed?"
- "Can more than one parameter come back changed from the same CALL?"
