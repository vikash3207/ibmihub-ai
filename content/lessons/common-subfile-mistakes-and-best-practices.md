# Common Subfile Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize several common
beginner mistakes when working with subfiles, and explain a simple best
practice that helps avoid each one.

## Simple Explanation

Having covered subfiles' core building blocks across this lesson group,
the subfile and control record format pair, `SFLDSP`/`SFLDSPCTL`/`SFLCLR`,
load-all loading, and function keys, this lesson steps back to look at a
handful of common mistakes beginners make, and the simple habits that help
avoid them.

- **Confusing which record format a field or keyword belongs on.** As
  covered in the Subfile Record Format vs Subfile Control Record Format
  lesson, fields that repeat per record belong on the subfile record
  format; headings, titles, and function keys belong on the control record
  format. Mixing these up is one of the most common early subfile
  mistakes.
- **Forgetting to clear the subfile before reloading it.** Without turning
  on `SFLCLR` before loading a fresh set of records, old records from a
  previous use can remain mixed in with the new ones, producing a
  confusing, incorrect list.
- **Displaying the subfile before it is fully loaded.** Turning on
  `SFLDSP` too early, before the loading loop has finished, can show an
  incomplete list. The clear/load/display order covered in the Simple
  Inquiry Subfile Pattern lesson matters.
- **Assuming load-all is always the right choice.** As covered in the
  Page-at-a-Time Subfile Concept lesson, load-all is simple but can become
  inefficient for very large record sets; it is worth recognizing when a
  screen's expected record count might call for a different strategy
  later.

## Why It Matters

These are not obscure, advanced concerns; they are exactly the kind of
small, practical habits that separate a subfile program that behaves
predictably from one that produces confusing, incomplete, or stale-looking
lists. Building these habits early makes every other subfile concept
covered in this lesson group noticeably more reliable in practice.

## Practical Example

Imagine two versions of the same order list subfile program. One puts
column headings on the subfile record format instead of the control record
format, never clears the subfile before reloading it, and turns on
`SFLDSP` before the loading loop finishes. Its screen shows misplaced
headings, a mix of old and new orders, and an incomplete list the first
time it displays.

The other version, following the practices covered throughout this lesson
group, keeps headings on the control record format, clears the subfile
before every fresh load, and only turns on `SFLDSP` once loading is
complete. Its list is accurate and complete every time. This is a
simplified, illustrative comparison rather than a specific real program,
but it reflects a very common, practical difference between a fragile
subfile program and a reliable one.

## Common Confusions

**"Are these mistakes only a problem for subfiles showing many
records?"**
No. Even a subfile showing just a few records benefits from these habits,
since problems like an unfinished clear or misplaced field can cause
confusing behavior regardless of how small the list otherwise is.

**"Is it ever acceptable to skip clearing a subfile before reloading
it?"**
In some specific cases, such as a subfile a program never reloads more
than once per run, skipping an explicit clear might not cause visible
problems, but explicitly clearing before every fresh load remains the
safer, more predictable default habit.

**"Do these best practices apply only to subfiles, or to regular display
files as well?"**
Several of these ideas, keeping related things on the correct record
format, careful ordering of steps, and not assuming one approach fits
every situation, echo similar best practices already covered for regular
display files earlier in this lesson group. Good habits like these tend to
transfer directly from regular display files to subfiles.

## Quick Recap

- Keep fields that repeat per record on the subfile record format, and
  headings, titles, and function keys on the control record format.
- Always clear a subfile with `SFLCLR` before loading a fresh set of
  records, to avoid mixing old and new data.
- Only turn on `SFLDSP` once loading is complete, to avoid displaying an
  incomplete list.
- Load-all is simple but not always the best fit for very large record
  sets; recognize when a different strategy might be worth considering
  later.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other common subfile mistakes beyond the ones in this
  lesson?"
- "How would I notice that a subfile screen is showing stale or leftover
  records from a previous use?"
