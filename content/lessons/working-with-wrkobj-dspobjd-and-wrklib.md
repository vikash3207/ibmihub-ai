# Working with WRKOBJ, DSPOBJD, and WRKLIB

## Learning Objective

By the end of this lesson, you will be able to explain what the `WRKOBJ`,
`DSPOBJD`, and `WRKLIB` commands are each used for, and know which one to
reach for depending on what you are trying to find out.

## Simple Explanation

You have already learned, in the Understanding IBM i Command Structure
lesson, that many IBM i commands follow a verb-plus-object naming pattern.
Three commands built directly from that pattern are especially useful for
everyday exploration of libraries and objects: `WRKOBJ`, `DSPOBJD`, and
`WRKLIB`.

- **`WRKOBJ`** (Work with Object) shows you a list of objects matching the
  name and library you specify, and lets you select one to perform an
  action on it, such as displaying, deleting, or moving it. It is especially
  useful when you are not sure exactly which library an object is in, or
  want to see every object matching a name pattern.
- **`DSPOBJD`** (Display Object Description) shows detailed descriptive
  information about a specific object: its type, the library it lives in,
  when it was created, and other descriptive attributes. It is useful when
  you already know which object you want and need more detail about it,
  rather than a list to choose from.
- **`WRKLIB`** (Work with Libraries) shows you a list of libraries matching
  a name or pattern you specify, and lets you select one to work with
  further, such as looking at its contents. It is useful when you are
  exploring at the library level, before narrowing down to a specific
  object.

As with any IBM i command, you can press **F4** after typing any of these
commands, as covered in the Using F4 Prompt and Command Help lesson, to see
and fill in their parameters interactively rather than typing full syntax
from memory.

## Why It Matters

These three commands cover a very common, everyday need: figuring out what
exists on a system and where. Beginners sometimes try to guess at an
object's exact location, or open unfamiliar tools looking for something that
a well-chosen command could answer directly. Knowing when to reach for
`WRKOBJ` versus `DSPOBJD` versus `WRKLIB` makes exploring an unfamiliar
system, or double-checking your own work, noticeably faster and less
error-prone.

## Practical Example

Imagine a developer who has been told a program called `CUSTINQ` exists
somewhere on the system, but does not know which library. They run `WRKOBJ`
with the object name `CUSTINQ` and a library value that searches all
libraries, and see a list showing that `CUSTINQ` actually exists in both
`PRODLIB` and `TESTLIB`.

Wanting more detail about the production version specifically, they use
`DSPOBJD` with the qualified name `PRODLIB/CUSTINQ`, as covered in the
Object Naming and Qualified Names in Practice lesson, and see its exact
object type, creation date, and other descriptive details. Later, curious
about what else lives in `PRODLIB`, they run `WRKLIB` to look at the library
itself. This is a simplified, illustrative example rather than a specific
real investigation, but it reflects a common, realistic troubleshooting
pattern.

## Common Confusions

**"Do WRKOBJ and DSPOBJD do the same thing?"**
No. `WRKOBJ` is best when you are searching or unsure exactly where an
object is, showing you a list to choose from. `DSPOBJD` is best when you
already know exactly which object you want and need detailed descriptive
information about it specifically.

**"Does WRKLIB show me the objects inside a library?"**
`WRKLIB` itself works at the library level, showing you a list of libraries
you can select from. Looking at the objects inside a specific library is
typically the next step after using `WRKLIB` to find or confirm the library
you want, often using `WRKOBJ` scoped to that library.

**"Do I need to memorize every parameter for these commands?"**
No. As covered in the Using F4 Prompt and Command Help lesson, pressing F4
after typing any of these command names shows you their available
parameters interactively, so you do not need to memorize exact syntax.

## Quick Recap

- `WRKOBJ` (Work with Object) lists objects matching a name or pattern,
  useful when you are searching or unsure exactly where an object lives.
- `DSPOBJD` (Display Object Description) shows detailed descriptive
  information about one specific, already-identified object.
- `WRKLIB` (Work with Libraries) lists libraries matching a name or pattern,
  useful for exploring at the library level.
- Pressing F4 after any of these command names lets you fill in their
  parameters interactively, without needing to memorize exact syntax.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What kind of information does DSPOBJD show that WRKOBJ doesn't?"
- "How can I use WRKOBJ to search for an object across every library I have
  access to?"
