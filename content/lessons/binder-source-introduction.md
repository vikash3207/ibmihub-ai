# Binder Source Introduction

## Learning Objective

By the end of this lesson, you will be able to describe what binder
source is and explain why `EXPORT(*SRCFILE)` offers more deliberate
control over a service program's exports than `EXPORT(*ALL)`.

## Simple Explanation

The Creating Service Programs with CRTSRVPGM lesson used
`EXPORT(*ALL)`, which exports every procedure already marked `export`
in the modules listed. **Binder source** is a small source member that
instead names exactly which procedures a service program should
export, giving you deliberate control rather than exporting everything
by default.

```text
STRPGMEXP PGMLVL(*CURRENT)
  EXPORT SYMBOL(ISVALIDCUSTNBR)
ENDPGMEXP
```

This binder source explicitly names `ISVALIDCUSTNBR` as an export,
under a signature level called `*CURRENT` (signature levels are
covered in the next lesson). Creating the service program from this
binder source instead looks like:

```clle
CRTSRVPGM SRVPGM(MYAPPLIB/CUSTUTIL) MODULE(MYAPPLIB/CUSTVAL) EXPORT(*SRCFILE) SRCFILE(MYAPPLIB/QSRVSRC) SRCMBR(CUSTUTIL)
```

## Why It Matters

With `EXPORT(*ALL)`, exporting a procedure is decided entirely by
whether it happens to be marked `export` in its module. With binder
source, exporting a procedure is a deliberate, separate decision,
written down in one place: a module can have several `export` marked
procedures, while binder source only actually exposes the ones
explicitly named. This matters once a service program's public
interface needs to be managed carefully over time, rather than simply
matching whatever happens to be marked `export` in the underlying
modules.

## Practical Example

Imagine `CUSTVAL` grows to contain both `isValidCustNbr`, genuinely
meant for other programs to call, and a newer, still-experimental
helper procedure, also marked `export` for convenience while it is
being developed. With `EXPORT(*ALL)`, that experimental procedure
would immediately become part of `CUSTUTIL`'s public interface, whether
or not that was intended. With binder source, only `isValidCustNbr`
would actually be exposed, since only it is named in the binder source
member, regardless of what else happens to be marked `export` in the
module.

## Common Confusions

**"Do I need binder source for every service program I create?"**
No. For a small, simple service program where `EXPORT(*ALL)` is a
reasonable fit, binder source adds a step without much benefit. It
becomes worthwhile once you want deliberate, explicit control over
exactly what a service program exposes, independent of what happens to
be marked `export` in its modules.

**"What does PGMLVL(*CURRENT) mean?"**
It marks this as the current, active signature level being defined for
the service program. Signature levels exist to help manage
compatibility as a service program's exports change over time, which
the next lesson covers in more depth.

**"Is binder source the same thing as the module's own RPGLE source?"**
No. A module's RPGLE source defines the actual procedures and marks
some of them `export`. Binder source is a separate, small member that
decides which of those already-exported procedures actually become
part of the finished service program's public interface.

## Quick Recap

- Binder source is a small source member naming exactly which
  procedures a service program should export.
- `EXPORT(*SRCFILE)` uses binder source instead of `EXPORT(*ALL)`,
  giving deliberate control over the service program's public
  interface.
- A procedure can be marked `export` in its module without actually
  being exposed, if binder source does not name it.
- Binder source is most valuable once a service program's exports need
  to be managed deliberately, rather than automatically.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why might a shop prefer EXPORT(*SRCFILE) over EXPORT(*ALL) even for
  a fairly small service program?"
- "What would happen if binder source named a procedure that was not
  actually marked export in any of the modules?"
