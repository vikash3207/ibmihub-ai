# Object Authority in Depth

## Learning Objective

By the end of this lesson, you will be able to explain how authority
applies differently to a library, a file, a program, and a command,
building on the authority basics already covered in this course.

## Simple Explanation

The Authorities and Object Access Basics lesson earlier in this course
introduced the idea that an authority failure happens when a user
lacks sufficient authority to an object. Authority actually applies
somewhat differently depending on the kind of object involved:

- **Library authority**: controls whether a user can even see or add
  objects within a library at all, independent of authority to any
  specific object inside it.
- **File authority**: controls whether a user can read, add, change, or
  delete data in a specific file, checked separately from library
  authority.
- **Program authority**: controls whether a user can run a specific
  program at all.
- **Command authority**: controls whether a user can use a specific CL
  command, such as a powerful command an organization wants to restrict
  to certain users.

```clle
GRTOBJAUT OBJ(MYLIB/CUSTMAST) OBJTYPE(*FILE) USER(ORDERGRP) AUT(*CHANGE)
GRTOBJAUT OBJ(MYLIB/CUSTINQR) OBJTYPE(*PGM) USER(ORDERGRP) AUT(*USE)
```

## Why It Matters

A common point of confusion is assuming that authority to a library
automatically means authority to everything inside it, or that
authority to run a program automatically means authority to the data
that program touches. In reality, IBM i checks authority at multiple
levels, and a user can have authority to a library but not a specific
file inside it, or authority to run a program but insufficient
authority to the file that program tries to access, which the program
then encounters as its own authority failure.

## Practical Example

Imagine `ORDERGRP`, the group profile from the earlier lesson in this
batch, is granted `*USE` authority to the `CUSTINQR` program, letting
its members run it, and `*CHANGE` authority to the `CUSTMAST` file,
letting the program actually read and update customer records on their
behalf. If `ORDERGRP` only had authority to run `CUSTINQR` but not to
`CUSTMAST` itself, members could still start the program, but it would
fail with an authority error the moment it tried to read `CUSTMAST`,
exactly the kind of layered authority check this lesson is describing.

This is a simplified, illustrative example rather than a specific real
system, but it reflects exactly how authority is checked in practice.

## Common Confusions

**"If I have authority to a library, do I automatically have authority
to every object inside it?"**
No. Library authority and the authority to a specific object inside
that library are checked separately. Having one does not guarantee the
other.

**"If a user can run a program, does that mean they have authority to
whatever data the program touches?"**
Not automatically. The program's own authority to the data it accesses
is what matters when it runs, which is either the user's own authority,
or, as covered in the Adopted Authority lesson later in this batch,
sometimes the program's authority instead.

**"Are command authority restrictions common for everyday
commands?"**
Not usually. Command authority restrictions are typically reserved for
genuinely powerful or sensitive commands, not the everyday commands a
developer uses constantly, which would make restricting them
impractical.

## Quick Recap

- Authority is checked at multiple levels: library, file, program, and
  command, each independently of the others.
- Having authority to a library does not automatically grant authority
  to every object inside it.
- A user can have authority to run a program while lacking authority to
  the data that program itself needs to access, causing the program to
  fail with its own authority error.
- Command authority restrictions are typically reserved for genuinely
  powerful or sensitive commands.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you walk me through a scenario where a user can run a program
  but the program itself still fails with an authority error?"
- "Why does it make sense for IBM i to check library authority and
  object authority separately, rather than treating them as one
  check?"
