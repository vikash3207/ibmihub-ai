# Source Physical Files and Source Members

## Learning Objective

By the end of this lesson, you will understand what a source physical file
is, what a source member is, and how source code for programs like RPGLE and
CLLE is typically organized and stored on IBM i.

## Simple Explanation

In the Physical Files and Logical Files lesson, you learned that IBM i
stores data in physical files, each made up of records with a defined
structure. A **source physical file** is a specialized kind of physical file
used to store source code rather than typical business data.

Where a regular physical file might hold customer records or order records,
a source physical file holds programming source code, such as RPGLE or CLLE
source. The key difference is that a source physical file does not hold just
one program's worth of source code. Instead, it is divided into separate
**source members**, where each member is its own named unit of source code,
similar in spirit to an individual file inside a folder, except that here
the "folder" is the source physical file itself and stored inside a library
like any other object.

For example, a source physical file named `QRPGLESRC` is a common, though not
required, convention for storing RPGLE source members, and a library might
contain dozens or hundreds of individual source members inside that one
source physical file, each representing a different program's source code.

## Why It Matters

Understanding source physical files and source members clarifies how IBM i
developers actually organize source code, which can look unfamiliar if you
are used to environments where each program's source code is simply its own
separate file on disk. On IBM i, many programs' source code commonly lives
together inside one source physical file, organized as separate members,
rather than as many separate files scattered across a folder structure. This
matters directly for practical, everyday tasks like finding, opening, or
editing a specific program's source code.

## Practical Example

Imagine a library called `MYAPPSRC` that contains a source physical file
named `QRPGLESRC`. Inside that one source physical file are several source
members, including one named `CUSTINQ` holding the source code for a
customer inquiry program, and another named `ORDENTRY` holding the source
code for an order entry program.

A developer who wants to edit the customer inquiry program's source code
opens the `CUSTINQ` member specifically, inside the `QRPGLESRC` source
physical file, inside the `MYAPPSRC` library, rather than looking for a
separate file named `CUSTINQ` somewhere on disk. This is a simplified,
illustrative example rather than a specific real system's exact contents,
but it reflects a very common, everyday IBM i organizational pattern.

## Common Confusions

**"Is a source physical file the same as a regular physical file?"**
They share the same underlying physical file object type, `*FILE`, that you
learned about in the Common IBM i Object Types lesson, but a source physical
file is specifically structured and used to hold source code organized into
members, rather than typical business data records.

**"Is a source member its own separate object, like a program or a file?"**
No. A source member exists inside a source physical file; it is not a
standalone object with its own object type. You always refer to a source
member in the context of the source physical file, and the library, that
contains it.

**"Does every IBM i shop use the exact same source physical file names, like
QRPGLESRC?"**
Names like `QRPGLESRC` are common conventions, not a strict, universal
requirement. Different organizations may use different source physical file
names for organizing their RPGLE, CLLE, or other source code, though
following common naming conventions makes source code easier for other
developers to find and understand.

## Quick Recap

- A source physical file is a specialized physical file used to store
  programming source code rather than typical business data.
- A source physical file is divided into separate source members, where each
  member holds one program's source code.
- Source members are not standalone objects; they exist inside a specific
  source physical file, inside a specific library.
- Common naming conventions, like `QRPGLESRC`, are widely used but not
  universally required across every organization.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "How is a source member different from the compiled program it produces?"
- "What are some other common source physical file naming conventions
  besides QRPGLESRC?"
