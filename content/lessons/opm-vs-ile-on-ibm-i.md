# OPM vs ILE on IBM i

## Learning Objective

By the end of this lesson, you will be able to explain the difference
between OPM and ILE, and why ILE was introduced alongside the older
model rather than replacing it outright.

## Simple Explanation

Everything you have written so far in this course compiles down to a
single, runnable program in one step: you write RPGLE source, compile
it, and you have a `*PGM` object ready to call. This original approach
is called **OPM**, the Original Program Model. It is simple and direct:
one source member becomes one program object.

**ILE**, the Integrated Language Environment, introduces an additional
building block in between source and program. Instead of compiling
straight to a runnable program, ILE compiles source into a **module**
(`*MODULE`), an intermediate object that is not directly runnable by
itself. One or more modules are then **bound** together into a program
(`*PGM`) or into a **service program** (`*SRVPGM`), a reusable object
other programs can call into. This two-step shape, compile then bind,
is what the rest of this batch's lessons build on.

## Why It Matters

Splitting compilation into "compile to a module" and "bind modules
together" is what makes real code reuse practical. A piece of logic
written once as a module can be bound into many different programs,
or gathered into a service program that many programs call, instead of
being copied and recompiled into every program that needs it. Bound
calls between modules are also typically faster than a traditional
OPM-style dynamic call from one program to another, since much of the
work of resolving that call happens once, at bind time, rather than
every single time the call happens at runtime.

## Practical Example

Imagine a small routine that checks whether a customer number is
formatted correctly, used by several different programs: a customer
inquiry screen, a customer maintenance screen, and a nightly batch
report. Under OPM, that check would typically be copied into each of
those three programs' source, or called as three separate dynamic
program-to-program calls. Under ILE, that same check can be written
once as a module, then bound directly into each of the three programs,
or gathered into one shared service program all three call into,
avoiding both the duplication and the separate dynamic calls.

This is a simplified, illustrative example rather than a specific real
application, but it reflects exactly the kind of reuse problem ILE was
introduced to solve.

## Common Confusions

**"Is OPM deprecated, or can I no longer use it?"**
No. OPM still exists on IBM i today, and plenty of programs still run
as straightforward OPM-style single objects. ILE is additive: it gives
you another, more structured option, not a requirement to rebuild
everything that already works.

**"Do I have to convert all my existing code to ILE right away?"**
No. Adopting ILE is normally gradual. Many real IBM i shops have a mix
of long-standing OPM programs and newer ILE modules, programs, and
service programs running side by side.

**"Is free-format RPGLE the same thing as ILE?"**
No, and this is worth separating clearly. Free-format syntax (the
`**free` style used throughout this course) is about how you *write*
RPGLE. OPM versus ILE is about how that source is *compiled and
assembled* into runnable objects. In practice, a command like
`CRTBNDRPG` compiles a single module and binds it into a program in
one convenient step, which can feel very OPM-like even though ILE is
doing the work underneath. The full, separate `CRTRPGMOD` plus
`CRTPGM` process, covered in the next two lessons, becomes valuable
once you want to bind multiple modules together or reuse a module
across more than one program.

## Quick Recap

- OPM compiles source directly into a runnable program in one step.
- ILE splits this into two steps: compiling source into a module, then
  binding one or more modules into a program or service program.
- ILE's main benefit is genuine code reuse and, often, faster bound
  calls between modules compared to OPM-style dynamic calls.
- OPM and ILE coexist on IBM i today; adopting ILE does not require
  converting everything at once.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can an OPM program call an ILE program, or do the two models have to
  match?"
- "Why would a bound call between two ILE modules be faster than a
  traditional dynamic program call?"
