# IFS Security Basics

## Learning Objective

By the end of this lesson, you will be able to explain how IFS
authority differs from the native object authority already covered in
this batch.

## Simple Explanation

The IFS Basics lesson earlier in this course introduced the Integrated
File System as a directory-based way to store stream files, separate
from traditional libraries and objects. Authority in the IFS follows a
directory-and-permission model, closer to what many developers already
recognize from other operating systems, rather than the library and
object-authority model covered throughout this batch for native
objects.

```clle
WRKLNK OBJLNK('/home/integrations/orders') OUTPUT(*PRINT)
```

Checking and changing IFS authority uses IFS-specific commands and
concepts, distinct from `GRTOBJAUT` and the object-authority commands
used for native objects covered earlier in this batch.

## Why It Matters

A developer comfortable with native object authority, library, file,
program, and command authority, can still be surprised by the IFS,
since its authority model is genuinely different, not just the same
concepts under different command names. This matters specifically for
integration work, covered in the Modern IBM i / APIs / Integration
lessons, where payload and log files often live in the IFS: securing a
native database file carefully does not automatically secure an IFS
directory holding related integration artifacts.

## Practical Example

Recall the integration payload and log files covered in the IFS and
API Payload Files lesson earlier in this course, stored under
directories like `/home/integrations/orders/`. Even if the underlying
`CUSTMAST` file has carefully designed public and private authority, as
covered earlier in this batch, that says nothing about who can read or
write files in `/home/integrations/orders/` itself. The IFS directory
needs its own, separately considered authority, using IFS-specific
concepts rather than assuming the native file's authority design
somehow covers it too.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuinely common point of confusion.

## Common Confusions

**"If I secure a native database file carefully, is any related IFS
data automatically covered too?"**
No. Native object authority and IFS authority are separate systems.
Securing one says nothing about the other; each needs its own
deliberate consideration.

**"Is IFS authority checked using the same GRTOBJAUT-style commands as
native objects?"**
No. The IFS uses its own directory-and-permission model and its own
commands, distinct from the native object-authority commands covered
elsewhere in this batch.

**"Is IFS security less important than native object security?"**
No. Given how much integration work, covered in the Modern IBM i / APIs
/ Integration lessons, relies on the IFS for payloads and logs,
overlooking IFS security specifically because it feels less familiar
than native object authority is a real, common risk.

## Quick Recap

- IFS authority follows a directory-and-permission model, distinct from
  the library and object-authority model used for native objects.
- Securing a native database file does not automatically secure
  related IFS directories or files.
- IFS-specific commands and concepts, not native `GRTOBJAUT`-style
  authority, govern IFS access.
- This matters especially for integration work, where payloads and
  logs commonly live in the IFS.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why might a shop that is careful about native object authority still
  overlook IFS directory permissions?"
- "How would I check who currently has access to a specific IFS
  directory used for integration payloads?"
