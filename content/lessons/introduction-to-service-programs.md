# Introduction to Service Programs

## Learning Objective

By the end of this lesson, you will be able to describe what a service
program is, why it is useful, and create a simple one with `CRTSRVPGM`.

## Simple Explanation

The earlier lessons in this batch built up the pieces this lesson
finally connects. A module can contain exported procedures. Those
exported procedures can be bound directly into a program with
`CRTPGM`. A **service program** offers a third option: bind one or more
modules together into a `*SRVPGM` object whose whole purpose is
offering its exported procedures to *other* programs and service
programs, without ever being called or run directly itself.

```clle
CRTSRVPGM SRVPGM(MYAPPLIB/CUSTUTIL) MODULE(MYAPPLIB/CUSTVAL)
```

This creates `CUSTUTIL`, a service program built from the `CUSTVAL`
module, offering its exported `isValidCustNbr` procedure to any program
that binds `CUSTUTIL` in.

## Why It Matters

Once more than a couple of programs need the same shared logic, binding
a module directly into every single one of them starts to feel
repetitive. A service program gives many different programs one shared
place to call into, so a fix or improvement to that shared logic only
needs to happen once, in the service program, rather than being
re-bound into every program that uses it.

## Practical Example

Imagine three programs, a customer inquiry screen, a customer
maintenance screen, and a nightly batch report, all needing the same
customer-number validation. Instead of binding the `CUSTVAL` module
directly into all three separately, as covered in the Binding Modules
into Programs lesson, this lesson's approach builds one service
program, `CUSTUTIL`, from that module, and each of the three programs
instead binds to `CUSTUTIL` and calls `isValidCustNbr` from there.

This is a simplified, illustrative example rather than a specific real
application, but it reflects a genuinely common reason IBM i shops
adopt service programs.

## Common Confusions

**"Is a service program the same thing as a program?"**
No. A service program can never be called or run directly by a user or
a job, the way a `*PGM` can. It only comes into play when some other
program or service program, which has bound it in, calls one of its
exported procedures.

**"Do I need binder source to create a simple, first service
program?"**
Not strictly, for a small, introductory example like this one. A basic
`CRTSRVPGM` can work directly from a module's exports. Binder source,
binding directories, and formally managing a service program's
signature as it changes over time are genuinely important once a
service program is shared broadly and evolves, but those are more
advanced topics beyond this introductory lesson.

**"Can a program call a service program's procedure the same way it
calls another program's exported procedure from a module?"**
Yes, from the calling program's point of view, calling an exported
procedure works the same way whether that procedure ultimately lives in
a directly bound module or in a service program; the calling code uses
the same prototype-and-call pattern either way.

## Quick Recap

- A service program (`*SRVPGM`) is built from one or more modules and
  offers exported procedures to other programs and service programs.
- A service program is never called or run directly itself.
- Service programs become especially useful once several different
  programs need the same shared logic.
- Binder source and formal signature management are important, more
  advanced topics left for later.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How is calling a procedure in a service program different, from the
  calling program's point of view, than calling one in a directly
  bound module?"
- "Why might a shop introduce a service program only after several
  programs already need the same shared logic, rather than from the
  very start?"
