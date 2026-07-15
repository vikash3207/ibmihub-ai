# SAVLIB and RSTLIB Basics

## Learning Objective

By the end of this lesson, you will be able to use `SAVLIB` and
`RSTLIB` to save and restore an entire library.

## Simple Explanation

The previous lesson covered `SAVOBJ` and `RSTOBJ`, working at the level
of specific objects. `SAVLIB` and `RSTLIB` work at the level of an
entire library instead, saving or restoring every object it contains
in one operation:

```clle
SAVLIB LIB(MYTESTLIB) DEV(*SAVF) SAVF(MYLIB/TESTBKUP)

RSTLIB SAVLIB(MYTESTLIB) DEV(*SAVF) SAVF(MYLIB/TESTBKUP)
```

This saves every object in `MYTESTLIB` into a save file, and later
restores the entire library, with all its objects, from that save
file.

## Why It Matters

This matches a genuinely common developer need: refreshing an entire
test library back to a known-good state, rather than restoring objects
one at a time. `SAVLIB` and `RSTLIB` are the right tool when the goal is
"give me this whole library back the way it was," not just one specific
object within it.

## Practical Example

Imagine a test library, `MYTESTLIB`, used for trying out changes before
they reach a real library list, covered earlier in this course. After a
round of testing leaves several objects in `MYTESTLIB` changed or
messy, restoring the entire library from a `SAVLIB` taken earlier gives
testers a clean, predictable starting point again, without needing to
individually restore every object that changed.

This is a simplified, illustrative example rather than a specific real
testing process, but it reflects exactly how `SAVLIB` and `RSTLIB` are
used in practice.

## Common Confusions

**"Is SAVLIB just SAVOBJ repeated for every object in a library?"**
Conceptually similar in effect, saving everything the library
contains, but `SAVLIB` is its own command working at the library level
directly, rather than a loop calling `SAVOBJ` for each object
individually.

**"Does RSTLIB require the target library to already exist?"**
Generally, `RSTLIB` can create the library if it does not already
exist, restoring it fresh from the saved copy. Confirming exactly what
happens to an existing library with the same name before running
`RSTLIB` matters, covered in more depth later in this batch.

**"Should SAVLIB be used for a library other developers are actively
working in?"**
Not without care. Saving or restoring a library while other users or
jobs are actively using objects in it can run into object locks,
covered earlier in this course, and deserves the same coordination
covered later in this batch for restoring safely.

## Quick Recap

- `SAVLIB` saves every object in a library at once; `RSTLIB` restores
  an entire library from a save.
- This is the right tool for "give me this whole library back the way
  it was," rather than restoring individual objects one at a time.
- `RSTLIB` can create the target library if needed, but what happens
  to an existing library with the same name deserves careful
  confirmation.
- Saving or restoring a library other users are actively working in
  can run into object locks and needs coordination.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Why might a shop prefer SAVLIB over saving objects individually for
  a test library refresh?"
- "What could go wrong if I ran RSTLIB against a library other people
  were actively using at the same time?"
