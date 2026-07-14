# What are Modules, Programs, and Service Programs?

## Learning Objective

By the end of this lesson, you will be able to describe what a module,
a program, and a service program each are under ILE, and how the three
relate to one another.

## Simple Explanation

The OPM vs ILE lesson introduced the idea that ILE compiles source into
a module first, then binds modules together afterward. This lesson
looks at the three object types involved in that process:

- A **module** (`*MODULE`) is compiled RPGLE source. It is an
  intermediate building block: you cannot call or run a module
  directly. It only becomes useful once it is bound into something
  else.
- A **program** (`*PGM`) is one or more modules bound together into a
  runnable object, the same kind of object OPM produces directly. A
  program can be called, submitted as a batch job, and so on, exactly
  like the programs you have already built in this course.
- A **service program** (`*SRVPGM`) is also one or more modules bound
  together, but instead of being run directly, it **exports**
  procedures that other programs and service programs can call into.
  A service program is never called or submitted as a job itself.

A rough analogy: a module is like a chapter, a program is a finished
book made from one or more chapters, and a service program is a shared
reference chapter that several different books can cite from, without
each book needing its own copy of that chapter's text.

## Why It Matters

Understanding this hierarchy before touching the actual commands
(`CRTRPGMOD`, `CRTPGM`, and `CRTSRVPGM`, covered in the next few
lessons) makes those commands much easier to reason about. Each command
maps directly onto one of these three object types: `CRTRPGMOD` creates
a module, `CRTPGM` creates a program from one or more modules, and
`CRTSRVPGM` creates a service program from one or more modules.

## Practical Example

Imagine a small module, `CUSTVAL`, containing just a routine that
checks whether a customer number is valid. That same compiled module
could be bound directly into a `CUSTINQR` program and, separately, into
a `CUSTMNT` program, so both programs share the identical validation
logic without either one containing its own copy. Alternatively, that
module could be bound into a service program, `CUSTUTIL`, and both
`CUSTINQR` and `CUSTMNT` could instead call the shared service program,
which is often the more scalable choice once several programs need the
same shared logic.

This is a simplified, illustrative example rather than a specific real
application, but it reflects a genuinely common IBM i design pattern.

## Common Confusions

**"Is a module the same as a program?"**
No. A module cannot be called or run on its own. It has to be bound
into a program or service program first.

**"Does a service program run like a job, the way a program does?"**
No. A service program is never submitted, called directly by a user,
or run as its own job. It only comes into play when a program (or
another service program) that has bound it in calls one of its
exported procedures.

**"Can the same compiled module be used in more than one program?"**
Yes. Exactly the same module object can be bound into multiple
different programs, or into a service program, without recompiling it
each time.

## Quick Recap

- A module is compiled source, not directly runnable on its own.
- A program is one or more modules bound into a runnable object.
- A service program is one or more modules bound into a reusable
  object that exports procedures for other programs to call, but is
  never run directly itself.
- The same module can be reused across more than one program or
  service program.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "If I change one module, do I need to rebuild every program that
  uses it?"
- "What's the practical difference between binding a module directly
  into two programs versus putting it in a shared service program?"
