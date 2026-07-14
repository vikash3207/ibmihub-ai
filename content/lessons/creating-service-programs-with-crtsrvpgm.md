# Creating Service Programs with CRTSRVPGM

## Learning Objective

By the end of this lesson, you will be able to create a service
program with `CRTSRVPGM`, bind a program to it using `BNDSRVPGM`, and
explain how this differs from binding a module directly with
`CRTPGM`.

## Simple Explanation

The Introduction to Service Programs lesson introduced what a service
program is and why it is useful. This lesson looks at the actual
commands involved: creating one with `CRTSRVPGM`, and having another
program call into it.

```clle
CRTSRVPGM SRVPGM(MYAPPLIB/CUSTUTIL) MODULE(MYAPPLIB/CUSTVAL) EXPORT(*ALL)

CRTPGM PGM(MYAPPLIB/CUSTINQR) MODULE(MYAPPLIB/CUSTMAIN) BNDSRVPGM(MYAPPLIB/CUSTUTIL)
```

`CRTSRVPGM` builds `CUSTUTIL` from the `CUSTVAL` module, with
`EXPORT(*ALL)` telling it to export every procedure in that module
already marked `export`. `CRTPGM` then builds `CUSTINQR` from its own
`CUSTMAIN` module, and `BNDSRVPGM` tells it to also bind in the
`CUSTUTIL` service program, so calls from `CUSTMAIN` into
`isValidCustNbr` resolve correctly.

## Why It Matters

Notice the difference between `MODULE()` and `BNDSRVPGM()` on
`CRTPGM`. `MODULE()` lists modules whose actual code becomes part of
this program directly. `BNDSRVPGM()` lists service programs this
program calls into, without copying their code in. Understanding this
distinction is what makes service programs genuinely reusable: many
different programs can each bind to the same `CUSTUTIL` service
program, sharing one copy of its logic, rather than each one
containing its own copy.

## Practical Example

Imagine three programs, a customer inquiry screen, a customer
maintenance screen, and a nightly report, all needing
`isValidCustNbr`. Each one is built with its own `MODULE()` containing
its own specific logic, but all three list `BNDSRVPGM(MYAPPLIB/CUSTUTIL)`
to share the exact same validation logic from one service program,
rather than each binding the `CUSTVAL` module directly into itself
separately.

This is a simplified, illustrative example rather than a specific real
application, but it reflects exactly how service programs are shared
across several programs in practice.

## Common Confusions

**"What is the real difference between MODULE() and BNDSRVPGM() on
CRTPGM?"**
`MODULE()` lists modules bound directly into this program, becoming
part of the program object itself. `BNDSRVPGM()` lists service
programs this program calls into, without their code becoming part of
this program object.

**"Does EXPORT(*ALL) export procedures I didn't mean to make public?"**
It can. `EXPORT(*ALL)` exports every procedure already marked `export`
in the modules listed, which is convenient for a first, simple service
program but offers no finer control over exactly what gets exposed.
The Binder Source Introduction lesson later in this batch covers a
more deliberate alternative.

**"Can a service program call into another service program?"**
Yes. A service program can itself use `BNDSRVPGM()` to call into
another service program, the same way a regular program does.

## Quick Recap

- `CRTSRVPGM` builds a service program from one or more modules.
- `EXPORT(*ALL)` is the simplest option: it exports every procedure
  already marked `export` in the modules listed.
- `BNDSRVPGM()` on `CRTPGM` binds a program to a service program,
  distinct from `MODULE()`, which binds a module's code directly in.
- Many different programs can share the same service program, rather
  than each containing its own copy of the shared logic.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why would binding to a shared service program be preferable to
  binding the same module directly into three separate programs?"
- "What would happen if I forgot BNDSRVPGM on CRTPGM but CUSTMAIN still
  called isValidCustNbr?"
