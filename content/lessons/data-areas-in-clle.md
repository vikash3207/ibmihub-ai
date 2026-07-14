# Data Areas in CLLE

## Learning Objective

By the end of this lesson, you will understand what a data area is, and be
able to use `RTVDTAARA` and `CHGDTAARA` to read and update one from a CLLE
program.

## Simple Explanation

In the Common IBM i Object Types lesson, you learned about object types
such as `*LIB`, `*FILE`, and `*PGM`. A **data area**, object type
`*DTAARA`, is another kind of IBM i object: a small, simple piece of
storage that holds a single value, persisting on the system independently
of any one job or program run.

Unlike a CL variable, declared with `DCL` and existing only while a
specific program runs, a data area continues to exist and hold its value
between separate runs of a program, and can even be shared across
different jobs. A CLLE program reads a data area's current value using
**`RTVDTAARA`** (Retrieve Data Area), and updates it using **`CHGDTAARA`**
(Change Data Area):

```clle
DCL VAR(&LASTORDERNBR) TYPE(*DEC) LEN(9 0)

RTVDTAARA DTAARA(MYAPPLIB/LASTORDNBR) RTNVAR(&LASTORDERNBR)

CHGVAR VAR(&LASTORDERNBR) VALUE(&LASTORDERNBR + 1)

CHGDTAARA DTAARA(MYAPPLIB/LASTORDNBR) VALUE(&LASTORDERNBR)
```

Here, `RTVDTAARA` reads the current value stored in the `LASTORDNBR` data
area into the CL variable `&LASTORDERNBR`. After incrementing that value,
`CHGDTAARA` writes the new value back into the same data area, so the next
time any program reads it, whether later today or after the system has
been restarted, it sees the updated value.

## Why It Matters

Data areas give a CLLE program a simple way to remember a value across
separate runs, something a regular CL variable cannot do on its own, since
variables only exist while their program is actually running. This makes
data areas a common, lightweight choice for things like the next available
order number in the example above, a simple status flag, or a small
setting a process needs to remember between runs.

## Practical Example

Imagine a nightly batch job that needs to know the last order number it
assigned, so the next run continues numbering from where the previous run
left off. Storing that number in a data area, rather than only in a CL
variable, means the value survives between separate runs of the job,
correctly continuing the sequence each time, rather than starting over or
losing track after each run finishes.

This is a simplified, illustrative example rather than a specific real
numbering scheme, but it reflects a genuinely common, practical reason
CLLE developers use data areas.

## Common Confusions

**"Is a data area the same thing as a physical file?"**
No. A physical file, covered in earlier Db2 for i lessons, stores many
structured records made up of fields. A data area is much simpler: a
single object holding one value, without the record-and-field structure a
physical file has.

**"Does a CL variable declared with DCL persist the same way a data area
does?"**
No. A `DCL`-declared variable exists only while its specific program run is
active, and is gone once that run ends. A data area is a separate object
that continues to exist and hold its value independently of any one
program run.

**"Do I need to create a data area from within the CLLE program that uses
it?"**
Not necessarily. A data area is commonly created once, ahead of time,
using a command such as `CRTDTAARA`, and then read and updated by CLLE
programs afterward using `RTVDTAARA` and `CHGDTAARA`, rather than being
created fresh every time a program runs.

## Quick Recap

- A data area (`*DTAARA`) is a simple IBM i object holding a single value
  that persists independently of any one job or program run.
- `RTVDTAARA` reads a data area's current value into a CL variable;
  `CHGDTAARA` writes a new value back into the data area.
- Unlike a `DCL`-declared CL variable, a data area's value survives between
  separate runs of a program.
- Data areas are a common, lightweight choice for small values a process
  needs to remember over time, such as a next-number counter or a status
  flag.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What command is used to create a new data area?"
- "What happens if two jobs try to update the same data area at almost
  the same time?"
