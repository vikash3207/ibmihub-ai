# Common CLLE Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize several common
beginner mistakes in CLLE programs, and explain a simple best practice
that helps avoid each one.

## Simple Explanation

Having covered CLLE's core building blocks across this lesson group,
variables, control flow, calling programs, checking objects, error
handling, and batch jobs, this lesson steps back to look at a handful of
common mistakes beginners make, and the simple habits that help avoid
them.

- **Forgetting MONMSG after a command that can fail.** As covered in the
  MONMSG and Basic Error Handling in CLLE lesson, a command like `CALL` or
  `CHKOBJ` can fail. Without `MONMSG` immediately after it, a failure stops
  the whole program abruptly with no controlled response. A good habit is
  to ask, for every command that can realistically fail, whether the
  program should react to that failure, and add `MONMSG` if so.
- **Using unqualified object names when ambiguity is possible.** As covered
  in the Object Naming and Qualified Names in Practice lesson, relying on
  the library list for every object reference can behave differently
  depending on whose library list is active. Qualifying important object
  references, such as `MYAPPLIB/CUSTMAST` rather than just `CUSTMAST`,
  avoids this ambiguity in programs meant to behave consistently.
- **Using unclear variable names.** A variable named `&X` or `&TEMP1`
  tells a reader almost nothing, similar to the numbered indicators covered
  in the Indicators in Modern RPGLE lesson. Clear names, such as
  `&CUSTNAME` or `&ORDERTOTAL`, make a CLLE program significantly easier to
  read later.
- **Hardcoding values that are likely to change.** Repeating the same
  literal value, such as a specific library name or a threshold, in
  several places throughout a program makes future changes error-prone.
  Declaring it once, in a variable or constant near the top of the
  program, keeps a future change to one place.

## Why It Matters

These are not obscure, advanced concerns; they are exactly the kind of
small, practical habits that separate a CLLE program that fails
confusingly from one that fails clearly, and a program that is easy to
maintain later from one that is not. Building these habits early makes
every other CLLE concept covered in this lesson group noticeably more
effective in practice.

## Practical Example

Imagine two versions of the same nightly process. One calls `PROCESSORDER`
with no `MONMSG` afterward, uses a bare `CUSTMAST` reference relying on
whatever library list happens to be active, and names its variables `&X`
and `&Y`. If something goes wrong, it fails with an unclear error, and
whoever investigates has to guess what `&X` and `&Y` were even for.

The other version, covered throughout this lesson group, checks for
`CUSTMAST` with a fully qualified name, monitors `CALL` for failure with a
clear message, and uses names like `&CUSTNAME` and `&ORDERTOTAL`
throughout. When something does go wrong, it is immediately clear what
failed and why. This is a simplified, illustrative comparison rather than
a specific real program, but it reflects a very common, practical
difference between a fragile CLLE program and a maintainable one.

## Common Confusions

**"Are these mistakes only a problem for large, complex programs?"**
No. Even a simple CLLE program benefits from these habits, since problems
like an unqualified object name or a missing `MONMSG` can cause confusing
failures regardless of how small or simple a program otherwise is.

**"Is it acceptable to skip MONMSG on commands that almost never fail?"**
Whether to add `MONMSG` is a judgment call based on how much a failure at
that specific point would matter, not a rule that applies identically to
every single command. Commands whose failure would meaningfully affect the
rest of the program are the most important candidates for it.

**"Do these best practices apply only to CLLE, or to RPGLE as well?"**
Several of these ideas, clear naming, qualifying object references, and
avoiding hardcoded repeated values, apply just as much to RPGLE, as covered
in earlier RPGLE lessons in this path. Good habits like these tend to
transfer across the languages you use on IBM i.

## Quick Recap

- Forgetting `MONMSG` after a command that can fail leads to abrupt,
  unclear failures; add it wherever a failure should be handled.
- Unqualified object names can behave inconsistently depending on the
  active library list; qualify object references that matter.
- Unclear variable names, like `&X`, make a program harder to read later;
  clear names like `&CUSTNAME` are worth the extra typing.
- Hardcoded, repeated values make future changes error-prone; declare
  them once instead.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other common CLLE mistakes beyond the ones in this
  lesson?"
- "How do I decide which commands in my program really need a MONMSG?"
