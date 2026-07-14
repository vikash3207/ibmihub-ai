# Binding Directories Basics

## Learning Objective

By the end of this lesson, you will be able to explain what a binding
directory is, and use one to let `CRTPGM` find a service program
automatically instead of listing every dependency by hand.

## Simple Explanation

The Binding Modules into Programs with CRTPGM lesson showed listing
every module a program needs directly on the `CRTPGM` command. Once a
shop has several service programs shared across many different
programs, listing every single one of them by hand, on every `CRTPGM`,
becomes repetitive and easy to get wrong.

A **binding directory** (`*BNDDIR`) is a named object holding a list of
modules and service programs. Instead of listing every dependency
directly, `CRTPGM` (or `CRTBNDRPG`) can be told to search a binding
directory instead, letting the system resolve calls to whatever is
registered in it automatically.

```clle
CRTBNDDIR BNDDIR(MYAPPLIB/MYBNDDIR)
ADDBNDDIRE BNDDIR(MYAPPLIB/MYBNDDIR) OBJ((MYAPPLIB/CUSTUTIL *SRVPGM))

CRTPGM PGM(MYAPPLIB/CUSTINQR) MODULE(MYAPPLIB/CUSTMAIN) BNDDIR(MYAPPLIB/MYBNDDIR)
```

Here, `CRTBNDDIR` creates the binding directory, `ADDBNDDIRE` registers
the `CUSTUTIL` service program inside it, and `CRTPGM` references that
binding directory instead of listing `CUSTUTIL` directly.

## Why It Matters

Without a binding directory, every program that calls into a shared
service program needs that service program listed explicitly, every
time it is built or rebuilt. A binding directory centralizes that list
in one place: add a new shared service program to the binding
directory once, and every program that references that binding
directory can find it, without each one needing to be individually
updated to know about it.

## Practical Example

Imagine a shop with five different programs that all call into the
same `CUSTUTIL` service program. Without a binding directory, adding a
second shared service program later would mean updating the `CRTPGM`
command for all five programs to list it. With a binding directory,
adding that second service program means one `ADDBNDDIRE` command
against the binding directory, and every program already referencing
that binding directory can find it the next time it is rebuilt.

This is a simplified, illustrative example rather than a specific real
shop's setup, but it reflects exactly why binding directories exist.

## Common Confusions

**"Does a binding directory replace listing my own program's
modules?"**
No. You still list the modules that make up your own program's actual
code directly on `MODULE()`. A binding directory mainly helps resolve
calls out to shared service programs and modules, so you do not have
to list every one of them by hand each time.

**"Is a binding directory the same thing as a library list?"**
No. A library list affects how object names are resolved generally,
across many different operations, at the time a job runs. A binding
directory is specifically used during the bind step, to help `CRTPGM`
or `CRTBNDRPG` locate modules and service programs.

**"Do I need a binding directory for a small program built from just
its own module or two?"**
Not really. Binding directories become genuinely useful once several
different programs need to find the same shared service programs or
modules, not for a single, simple, self-contained program.

## Quick Recap

- A binding directory (`*BNDDIR`) is a named list of modules and
  service programs that `CRTPGM` or `CRTBNDRPG` can search
  automatically.
- `CRTBNDDIR` creates one, and `ADDBNDDIRE` adds entries to it.
- Binding directories centralize dependency lists, so adding a new
  shared service program does not require updating every program that
  might use it.
- A binding directory does not replace listing your own program's
  modules directly.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if CUSTUTIL were listed both in a binding
  directory and directly on BNDSRVPGM at the same time?"
- "How would I remove an entry from a binding directory once it is no
  longer needed?"
