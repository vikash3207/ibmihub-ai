# Common IBM i Object Types

## Learning Objective

By the end of this lesson, you will be able to name several common IBM i
object types, explain what each one is generally used for, and recognize why
IBM i treats nearly everything on the system, including programs and files,
as an object of some specific type.

## Simple Explanation

In the Libraries and Objects lesson, you learned that IBM i organizes
programs, files, and other resources as objects stored inside libraries. What
that earlier lesson did not cover in depth is that every object on IBM i has
a specific **object type**, which tells IBM i, and tells you, what kind of
thing that object actually is and how it can be used.

Some of the most common object types you will encounter include:

- **`*LIB`** (Library): a container object that holds other objects, as you
  learned in the Libraries and Objects lesson.
- **`*FILE`**: a broad category that covers several kinds of files, including
  physical files and logical files, which you learned about in the Physical
  Files and Logical Files lesson, as well as other file types you will
  encounter later.
- **`*PGM`** (Program): a compiled, runnable program, such as one written in
  RPGLE or CLLE.
- **`*USRPRF`** (User Profile): represents a user of the system, as you
  learned about in the Signing On, User Profiles, and Current Library lesson.
- **`*OUTQ`** (Output Queue): holds spooled output, such as reports waiting
  to be printed or viewed, related to what you learned in the Job Logs and
  Spool Files Basics lesson.

Every object's type is a fixed, built-in property of that object. IBM i uses
it to know what operations make sense for that object; you cannot, for
example, "run" a `*USRPRF` the way you would run a `*PGM`, because their
types define fundamentally different kinds of things.

## Why It Matters

Recognizing object types helps you make sense of command output, error
messages, and documentation that reference an object type directly, often
written with a leading asterisk like `*PGM` or `*FILE`. Without this
context, an unfamiliar type code can look like a cryptic error rather than
useful, specific information about exactly what kind of object you are
looking at.

## Practical Example

Imagine a developer runs the `WRKOBJ` command to look at objects in a
library and sees a list showing several entries: one with type `*PGM`,
several with type `*FILE`, and one with type `*OUTQ`. Because they recognize
these type codes, they immediately understand that the library contains at
least one runnable program, some kind of data or device files, and an output
queue for spooled reports, without needing to open or investigate each object
individually just to understand what it broadly is.

This is a simplified, illustrative example rather than a specific real
library's exact contents, but it reflects a very common, everyday task for
IBM i developers.

## Common Confusions

**"Is `*FILE` only used for physical and logical files?"**
No. `*FILE` is a broad object type that covers several kinds of files
beyond physical and logical database files, including files used for other
purposes you will encounter in later lessons. Physical and logical files are
common, important examples of the `*FILE` type, not the only ones.

**"Can an object's type change after it is created?"**
No. An object's type is fixed when it is created and reflects what
fundamental kind of thing it is. To get a genuinely different kind of
object, you create a new object of that type rather than converting an
existing object from one type to another.

**"Why do object type names start with an asterisk?"**
The leading asterisk is simply IBM i's naming convention for referring to a
type category itself, such as `*PGM` or `*FILE`, as distinct from the name
of one specific object of that type, such as a program actually named
`PAYROLL`.

## Quick Recap

- Every IBM i object has a specific, fixed object type that tells you and
  IBM i what kind of thing that object is.
- Common object types include `*LIB` (Library), `*FILE`, `*PGM` (Program),
  `*USRPRF` (User Profile), and `*OUTQ` (Output Queue).
- Object type determines what operations make sense for an object; you
  cannot use an object as if it were a different type.
- Recognizing common object type codes makes command output, error messages,
  and documentation significantly easier to understand.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What are some other IBM i object types besides *LIB, *FILE, *PGM,
  *USRPRF, and *OUTQ?"
- "How can I find out the object type of something I'm looking at on IBM i?"
