# Binding Modules into Programs with CRTPGM

## Learning Objective

By the end of this lesson, you will be able to use `CRTPGM` to bind one
or more modules into a runnable program, and explain what "binding"
actually means at a conceptual level.

## Simple Explanation

`CRTPGM` (Create Program) takes one or more existing `*MODULE` objects
and **binds** them together into a single, runnable `*PGM` object.
Binding is the step where calls between modules, such as a main module
calling the `isValidCustNbr` procedure from the `CUSTVAL` module built
in the previous lesson, get resolved into one working program.

```clle
CRTPGM PGM(MYAPPLIB/CUSTINQR) MODULE(MYAPPLIB/CUSTMAIN MYAPPLIB/CUSTVAL)
```

Here, `CUSTINQR` is the resulting program, built by binding two
modules together: `CUSTMAIN`, which contains the program's actual entry
point (the code that runs first when `CUSTINQR` is called), and
`CUSTVAL`, the validation module from the previous lesson. `CUSTMAIN`
is this program's **entry module**: the specific module whose code
runs when the program is called.

## Why It Matters

Binding is a genuinely separate step from compiling, and understanding
that separation matters. Compiling with `CRTRPGMOD` only checks and
converts source into a module; it does not know or care what else that
module will eventually be bound with. `CRTPGM` is where the actual
runnable program comes together, resolving every call between the
modules you list into one working object.

## Practical Example

Imagine `CUSTMAIN` contains the screen-handling logic for a customer
inquiry program, and calls `isValidCustNbr` from `CUSTVAL` before doing
a lookup. Compiling `CUSTMAIN` with `CRTRPGMOD` alone does not produce
anything runnable; it just produces a module whose call to
`isValidCustNbr` is not yet resolved to anything. Only after running
`CRTPGM` with both `CUSTMAIN` and `CUSTVAL` listed does that call
actually get connected, producing a working `CUSTINQR` program.

This is a simplified, illustrative example rather than a specific real
application, but it reflects exactly how binding connects modules
together into one program.

## Common Confusions

**"If I only change one module, do I need to list every module again
in CRTPGM?"**
Yes, for a straightforward `CRTPGM` rebuild: you recompile the module
that changed, then rerun `CRTPGM` listing the full, current set of
modules for that program, the same as before. There is a related
command, `UPDPGM`, for updating a program with a changed module without
needing to fully relist everything, but that is a more advanced detail
beyond this introductory lesson.

**"Is binding the same thing as compiling?"**
No. Compiling (`CRTRPGMOD`) turns RPGLE source into a module. Binding
(`CRTPGM`) turns one or more already-compiled modules into a runnable
program. They are two distinct steps, and understanding that
distinction is the whole point of this lesson.

**"Does the order of modules in the MODULE list matter?"**
The entry module, the one containing the program's actual starting
point, needs to be identifiable as such, but beyond that, listing every
module the program actually depends on is what matters most at this
introductory level; finer ordering details are beyond this lesson's
scope.

## Quick Recap

- `CRTPGM` binds one or more modules together into a runnable `*PGM`
  object.
- Binding resolves calls between modules into one working program.
- The entry module is the specific module containing the program's
  actual starting point.
- Compiling and binding are two separate steps: `CRTRPGMOD` compiles
  source into a module, `CRTPGM` binds modules into a program.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What error would I likely see if I ran CRTPGM without listing a
  module that CUSTMAIN actually calls?"
- "What is the difference between CRTPGM and CRTBNDRPG?"
