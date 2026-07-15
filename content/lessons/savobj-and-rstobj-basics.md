# SAVOBJ and RSTOBJ Basics

## Learning Objective

By the end of this lesson, you will be able to use `SAVOBJ` and
`RSTOBJ` to save and restore a specific object.

## Simple Explanation

`SAVOBJ` saves one or more specific objects from a library; `RSTOBJ`
restores them back:

```clle
SAVOBJ OBJ(CUSTINQR) LIB(MYLIB) OBJTYPE(*PGM) DEV(*SAVF) SAVF(MYLIB/CUSTBKUP)

RSTOBJ OBJ(CUSTINQR) SAVLIB(MYLIB) OBJTYPE(*PGM) DEV(*SAVF) SAVF(MYLIB/CUSTBKUP)
```

This saves the `CUSTINQR` program from `MYLIB` into a save file called
`CUSTBKUP`, and later restores that same program from the save file
back into a library.

## Why It Matters

`SAVOBJ` and `RSTOBJ` work at the level of individual objects, which
matches the everyday developer scenarios covered in the previous
lesson: saving one specific program before changing it, or restoring
one specific object that was accidentally deleted or overwritten,
without needing to save or restore an entire library.

## Practical Example

Recall the scenario from the previous lesson: a developer about to make
a significant change to `CUSTINQR`. Running `SAVOBJ` for just that
program beforehand, as shown above, creates a saved copy without
touching anything else in `MYLIB`. If the change goes wrong, `RSTOBJ`
restores that exact saved version of `CUSTINQR`, undoing the change at
the object level.

This is a simplified, illustrative example rather than a specific real
deployment, but it reflects exactly how `SAVOBJ` and `RSTOBJ` are used
in everyday development work.

## Common Confusions

**"Does RSTOBJ restore an object to the same library it was saved
from, automatically?"**
Not necessarily; `RSTOBJ` restores to whatever library is specified in
its own parameters, which can be the original library or a different
one, such as a test library. Confirming the target library
deliberately, covered in more depth later in this batch, matters here.

**"Does SAVOBJ remove the object from its current library?"**
No. `SAVOBJ` creates a saved copy; the original object stays exactly
where it was, unaffected by the save.

**"Do I need special authority to run SAVOBJ or RSTOBJ?"**
Yes, in the same way other object operations require authority,
covered earlier in this course. Sufficient authority to the object
being saved, and to the target library for a restore, is needed.

## Quick Recap

- `SAVOBJ` saves one or more specific objects from a library into a
  save file or other save media.
- `RSTOBJ` restores those objects back, to a library specified in its
  own parameters.
- Saving an object does not remove or change the original; it creates
  a separate, saved copy.
- `SAVOBJ` and `RSTOBJ` work at the individual object level, distinct
  from saving or restoring an entire library, covered in the next
  lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I ran RSTOBJ and specified a different library
  than the object was originally saved from?"
- "Why might a developer choose SAVOBJ for one program rather than
  saving the whole library it lives in?"
