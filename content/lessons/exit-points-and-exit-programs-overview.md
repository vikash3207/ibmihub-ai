# Exit Points and Exit Programs Overview

## Learning Objective

By the end of this lesson, you will be able to explain what an exit
point is and what an exit program is generally expected to do.

## Simple Explanation

Some system operations on IBM i, such as an FTP request or an ODBC
connection arriving from another system, offer a defined moment where
the system will call a program a shop has registered, before letting
that operation proceed. That defined moment is called an **exit
point**, and the program registered to run there is an **exit
program**.

```clle
WRKREGINF
```

A command like this lists the exit points currently registered on a
system, and which exit programs, if any, are attached to each one. An
exit program attached to an FTP-related exit point, for example, could
inspect an incoming request and decide whether to allow it, based on
logic the shop itself controls.

## Why It Matters

Without an exit point, a shop has no way to add its own validation or
security logic to certain system operations that originate outside
normal, authority-checked program calls, such as requests arriving
through FTP or ODBC. An exit program is the controlled place a shop can
insert exactly that kind of extra check, similar in spirit to the
adopted authority pattern covered in Batch 1: a specific, deliberately
written piece of logic given a controlled role in the system's overall
security posture.

## Practical Example

Imagine a shop wants to prevent FTP access to certain sensitive
libraries, even for users who otherwise have valid object authority to
them through normal program access. Registering an exit program at the
relevant FTP exit point lets that program inspect each incoming
request and reject ones that reference restricted libraries, adding a
layer of control that pure object authority alone does not provide for
this specific access path.

This is a simplified, illustrative example rather than a specific real
exit program, but it reflects a genuinely common reason exit points are
used.

## Common Confusions

**"Is an exit program the same thing as a trigger, covered in the
Advanced SQL lessons?"**
Not the same mechanism, but a similar underlying idea: both run
automatically at a defined moment, without the calling process
explicitly invoking them. A trigger runs on a database change; an exit
program runs at a system-level exit point, such as FTP or ODBC access.

**"Does every IBM i system need exit programs to be secure?"**
Not necessarily. Exit points exist for the specific system operations a
shop wants extra control over, often the ones that can be reached
without going through the shop's own authority-checked programs. A
system relying entirely on well-designed object authority may have no
genuine need for exit programs at all.

**"Is writing a full exit program something covered in this
lesson?"**
No. This lesson introduces the concept: what an exit point and an exit
program are, and generally what they are used for. Writing a complete
exit program is a deeper, more advanced topic beyond this introductory
lesson.

## Quick Recap

- An exit point is a defined moment where the system will call a
  registered program before letting a specific operation proceed.
- An exit program is the program registered to run at that moment, and
  can inspect or reject the operation based on the shop's own logic.
- Exit points matter most for operations, like FTP or ODBC access, that
  can bypass normal, authority-checked program calls.
- This lesson introduces the concept only; writing a full exit program
  is a deeper topic beyond this introductory lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can you give me another realistic example of a system operation that
  might benefit from an exit program?"
- "How is an exit program similar to and different from a database
  trigger, covered earlier in this course?"
