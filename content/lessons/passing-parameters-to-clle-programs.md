# Passing Parameters to CLLE Programs

## Learning Objective

By the end of this lesson, you will be able to write a CLLE program that
receives its own parameters, using `PARM` on the `PGM` statement together
with matching `DCL` declarations.

## Simple Explanation

In the Calling RPGLE Programs from CLLE lesson, you learned how a CLLE
program calls another program and passes values to it using `CALL` and
`PARM`. This lesson looks at the other side of that same idea: how a CLLE
program itself receives parameters when something else calls it.

A CLLE program declares the parameters it expects to receive by adding
`PARM` directly to its own `PGM` statement, naming the variables that will
hold the incoming values. Each of those variables must also be declared
with `DCL`, matching the type and length the caller is expected to provide:

```clle
PGM PARM(&CUSTNAME &ORDERTOTAL)

DCL VAR(&CUSTNAME) TYPE(*CHAR) LEN(30)
DCL VAR(&ORDERTOTAL) TYPE(*DEC) LEN(9 2)

DCL VAR(&MSG) TYPE(*CHAR) LEN(50)
CHGVAR VAR(&MSG) VALUE('Processing order for ' *CAT &CUSTNAME)
SNDPGMMSG MSG(&MSG)

ENDPGM
```

Here, `PGM PARM(&CUSTNAME &ORDERTOTAL)` states that this program expects to
receive two values, in this order, which it will refer to as `&CUSTNAME`
and `&ORDERTOTAL` internally. Whatever calls this program, whether another
CLLE program's `CALL` command or some other caller, must supply exactly
that many values, in that same order, matching the declared types.

## Why It Matters

Understanding both directions of parameter passing, calling another program
with `CALL`/`PARM`, and a program receiving its own parameters through
`PGM`/`PARM`, completes the full picture of how CLLE programs pass values
back and forth. A CLLE program written to work this way can be called from
different places with different values each time, rather than only ever
working with values fixed or gathered inside itself.

## Practical Example

Imagine an `ORDERNOTIFY` CLLE program written specifically to receive a
customer name and order total as parameters, exactly like the example
above. Different parts of a larger process, or different calling programs,
can each call `ORDERNOTIFY`, passing whatever specific customer name and
order total is relevant at that moment, and `ORDERNOTIFY` handles each
call the same consistent way, regardless of where the values came from.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical reason CLLE programs
are written to accept parameters rather than only working with fixed,
internally gathered values.

## Common Confusions

**"Do the parameter names on PGM PARM have to match the variable names the
caller used?"**
No. The caller's variable names and the receiving program's parameter
names are completely independent; only the order and matching data types
of the values passed matter, not what either side happens to call them.

**"What happens if a caller passes the wrong number of parameters?"**
This generally results in an error when the call is attempted, since the
receiving program's `PGM PARM` declares exactly how many values, of what
types, it expects to receive.

**"Is every CLLE program required to have PARM on its PGM statement?"**
No. A CLLE program only needs `PARM` on `PGM` if it is meant to receive
values from whatever calls it. Simple programs that gather everything they
need internally, like several examples in earlier CLLE lessons, do not need
`PARM` at all.

## Quick Recap

- A CLLE program declares the parameters it expects using `PARM` on its own
  `PGM` statement.
- Each parameter named in `PGM PARM` must also be declared with a matching
  `DCL` statement.
- Callers must supply values in the same order and matching types the
  program's `PGM PARM` declares.
- Understanding both directions of parameter passing, calling out and
  receiving in, completes the picture of how CLLE programs exchange
  values.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can a CLLE program have optional parameters that a caller doesn't have
  to supply?"
- "What happens if the data type declared in PGM PARM doesn't match what
  the caller actually sends?"
