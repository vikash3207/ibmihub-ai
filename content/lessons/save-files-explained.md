# Save Files Explained

## Learning Objective

By the end of this lesson, you will be able to explain what a save
file is and create one with `CRTSAVF`.

## Simple Explanation

Every `SAVOBJ`, `RSTOBJ`, `SAVLIB`, and `RSTLIB` example covered
earlier in this batch used `DEV(*SAVF)` along with a `SAVF` parameter,
pointing at a **save file**: a regular IBM i object that holds saved
data, in place of physical media like tape.

```clle
CRTSAVF FILE(MYLIB/CUSTBKUP)

DSPSAVF FILE(MYLIB/CUSTBKUP)
```

`CRTSAVF` creates an empty save file, ready to receive saved data from
a subsequent `SAVOBJ` or `SAVLIB` command. `DSPSAVF` displays
information about what a save file currently contains.

## Why It Matters

A save file is just another IBM i object, subject to the same library,
authority, and storage considerations already covered throughout this
course, which makes it a practical, everyday target for saves, without
needing physical tape or other removable media. Understanding that
save files need to be created first, and can be inspected afterward
with `DSPSAVF`, is the missing piece behind every save/restore command
shown earlier in this batch.

## Practical Example

Recall the `CUSTBKUP` save file used in the `SAVOBJ`/`RSTOBJ` example
earlier in this batch. Before that `SAVOBJ` command could succeed,
`CRTSAVF` needed to create `CUSTBKUP` as an empty save file first.
Afterward, running `DSPSAVF` against it would show that it now
contains the saved `CUSTINQR` program, confirming the save actually
captured what was intended before relying on it for a later restore.

This is a simplified, illustrative example rather than a specific real
workflow, but it reflects exactly how save files fit into everyday
save and restore work.

## Common Confusions

**"Does SAVOBJ create the save file automatically if it doesn't
exist?"**
No. The save file needs to already exist, created with `CRTSAVF`,
before a `SAVOBJ` or `SAVLIB` command can write saved data into it.

**"Is a save file the same thing as a database file covered earlier in
this course?"**
No, though both are files in the general IBM i sense. A save file has
a specific purpose: holding saved object or library data for later
restore, rather than holding application business data the way a
physical file or table does.

**"Does DSPSAVF let me see the actual data inside the saved objects?"**
No, not at that level of detail. `DSPSAVF` shows information about what
a save file contains, such as which objects were saved, rather than
letting a user browse the actual data inside those saved objects
directly.

## Quick Recap

- A save file is a regular IBM i object that holds saved data, used as
  a target for `SAVOBJ`, `RSTOBJ`, `SAVLIB`, and `RSTLIB` instead of
  physical media.
- `CRTSAVF` creates an empty save file before it can receive saved
  data.
- `DSPSAVF` displays information about what a save file currently
  contains.
- A save file needs to already exist before a save command can target
  it; it is not created automatically.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would DSPSAVF show me if I ran it against a save file that had
  never actually been used in a SAVOBJ or SAVLIB command yet?"
- "Why might a shop prefer saving to a save file over saving directly
  to tape?"
