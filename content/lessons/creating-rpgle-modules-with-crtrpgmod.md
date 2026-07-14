# Creating RPGLE Modules with CRTRPGMOD

## Learning Objective

By the end of this lesson, you will be able to compile free-format
RPGLE source into a module using `CRTRPGMOD`, and explain exactly what
that command does and does not produce.

## Simple Explanation

`CRTRPGMOD` (Create RPG Module) compiles RPGLE source into a
`*MODULE` object. It behaves like any other RPGLE compile in terms of
checking your syntax and reporting compile errors, but the object it
produces is a module, not a program: the result cannot be called or
run on its own, exactly as covered in the previous lesson.

```rpgle
**free
ctl-opt nomain;

dcl-proc isValidCustNbr export;
  dcl-pi *n ind;
    custNbr packed(6:0) const;
  end-pi;

  return custNbr > 0;
end-proc;
```

This small module contains one procedure, `isValidCustNbr`, that
returns whether a customer number looks valid. Notice `ctl-opt nomain;`
at the top: it tells the compiler this module has no main procedure of
its own, since its only purpose is to offer `isValidCustNbr` to
whatever binds it in later. The `export` keyword is covered in depth in
the Internal Procedures vs Exported Procedures lesson later in this
batch.

To compile this into a module:

```clle
CRTRPGMOD MODULE(MYAPPLIB/CUSTVAL) SRCFILE(MYAPPLIB/QRPGLESRC)
```

## Why It Matters

Compiling to a module first, rather than straight to a program, is
what makes the module reusable across more than one program later.
Getting comfortable with `CRTRPGMOD` as its own distinct step is the
foundation for the binding lessons that follow.

## Practical Example

Imagine writing the `isValidCustNbr` logic once, compiling it with
`CRTRPGMOD` into `CUSTVAL`, and knowing that this single compiled
module can later be bound into a customer inquiry program, a customer
maintenance program, or a shared service program, without ever needing
to recompile the validation logic itself again for each one.

## Common Confusions

**"Can I call a module directly, like `CALL PGM(CUSTVAL)`?"**
No. A module is not a program, and there is no way to call it directly.
It has to be bound into a program or service program first, using
`CRTPGM` or `CRTSRVPGM`.

**"Does CRTRPGMOD report compile errors differently from a normal
RPGLE compile?"**
No. The compile listing and diagnostics work the same way you are
already used to; the only real difference is the type of object
produced at the end, `*MODULE` instead of `*PGM`.

**"What happens if I compile a module and never bind it into
anything?"**
Nothing runs it. It simply exists as an unused `*MODULE` object,
taking up space, until something actually binds it into a program or
service program.

## Quick Recap

- `CRTRPGMOD` compiles RPGLE source into a `*MODULE` object.
- A module cannot be called or run directly; it must be bound into a
  program or service program afterward.
- `ctl-opt nomain;` marks a module as having no main procedure of its
  own, appropriate for a module meant purely to be bound in and called
  by something else.
- Compile errors and diagnostics work the same as any other RPGLE
  compile.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I left out ctl-opt nomain on a module meant to
  be bound into a program?"
- "Can one QRPGLESRC source file contain the source for more than one
  module?"
