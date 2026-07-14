# Debugging ILE Programs

## Learning Objective

By the end of this lesson, you will be able to use `STRDBG` against a
program built from multiple bound modules, and explain what the call
stack looks like when procedures across modules call one another.

## Simple Explanation

The STRDBG Basics for RPGLE, Setting and Using Breakpoints, and
Understanding Call Stack Basics lessons covered debugging a single
program. Debugging an ILE program built from several bound modules
works the same way, with one important addition: each module involved
needs to have been compiled with debugging view information for
source-level stepping into it to work, not just the module you started
debugging from.

```clle
STRDBG PGM(MYAPPLIB/CUSTINQR)
```

Once inside the debug session, setting a breakpoint works the same way
covered earlier in this course, whether that breakpoint lands in the
entry module, `CUSTMAIN`, or inside an exported procedure belonging to
a different module, such as `isValidCustNbr` in `CUSTVAL`, as long as
`CUSTVAL` was also compiled with debugging information.

## Why It Matters

The call stack in an ILE debug session reflects the real, detailed
call chain across modules and procedures, not just a single flat
program. Being able to read that chain, and step between a caller in
one module and a called procedure in another, is essential once real
applications are built from several bound modules and service
programs rather than one self-contained program.

## Practical Example

Imagine setting a breakpoint on the line in `CUSTMAIN` that calls
`isValidCustNbr`, then stepping into that call. The debug session
moves from `CUSTMAIN`'s code into `CUSTVAL`'s `isValidCustNbr`
procedure, and the call stack at that point shows both: `CUSTMAIN`,
still active and waiting for `isValidCustNbr` to return, and
`isValidCustNbr` itself, currently running. This is exactly the kind
of chain the Understanding Call Stack Basics lesson introduced,
applied here across a module boundary rather than within a single
program.

This is a simplified, illustrative example rather than a specific real
debugging session, but it reflects exactly how ILE debugging extends
what you already know about breakpoints and the call stack.

## Common Confusions

**"Can I set a breakpoint inside a service program's exported
procedure the same way?"**
Yes, conceptually. The same requirement applies: the module underlying
that exported procedure needs to have been compiled with debugging
information for source-level stepping into it to work.

**"Why does the call stack show procedure names instead of just
program names?"**
Because ILE debugging reflects the real call chain at the procedure
level, across whatever modules are actually involved, which is more
detailed than a single flat OPM-style program would show.

**"If I forget to compile a module with debugging information, does
debugging fail entirely?"**
Not entirely; you can generally still debug the parts that do have
debugging information. You simply cannot step through, or see
meaningful source-level detail for, the specific module that was
compiled without it.

## Quick Recap

- Debugging an ILE program built from several modules works the same
  way as debugging a single program, using `STRDBG` and breakpoints.
- Every module you want to step through source-level needs to have
  been compiled with debugging view information, not just the module
  you start from.
- The call stack in an ILE debug session reflects the real call chain
  across modules and procedures.
- The same breakpoint and call-stack concepts from earlier debugging
  lessons apply directly here, just across module boundaries.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would the call stack look like if CUSTMAIN called a service
  program procedure that itself called another internal procedure?"
- "What option would I need to compile with to make sure a module's
  debugging information is actually available?"
