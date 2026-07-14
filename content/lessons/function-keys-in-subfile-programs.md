# Function Keys in Subfile Programs

## Learning Objective

By the end of this lesson, you will understand which function keys a
load-all subfile handles automatically, and how custom function keys on a
subfile screen still work the same way covered in earlier lessons.

## Simple Explanation

In the Function Keys in More Depth lesson, you learned that a display
file's DDS ties a function key to a response indicator using keywords like
`CF03`, which the RPGLE program checks afterward. Subfile screens use this
exact same mechanism for their own custom function keys, with one
important addition: Page Up and Page Down.

For a load-all subfile, once every record has been loaded and the subfile
is displayed, **Page Up and Page Down are handled automatically** by IBM
i. The user can page through the already-loaded list without the RPGLE
program needing to detect anything or respond to an indicator at all;
this is part of what "load-all" being simple to program actually means in
practice.

Custom function keys on a subfile screen, such as F3 to exit or F6 to add
a new record, work exactly the same way covered for regular display files:
tied to a response indicator using `CF03` or a similar keyword on the
control record format, checked by the RPGLE program after `exfmt` returns.

## Why It Matters

Recognizing that Page Up and Page Down are already handled for you in a
load-all subfile means you do not need to write any special logic for
basic scrolling, letting you focus your program's function key logic on
whatever custom actions your screen actually needs, such as exiting or
adding a record, using the same familiar pattern from earlier lessons.

## Practical Example

Imagine the order list subfile screen from earlier lessons in this group,
supporting F3 to exit in addition to normal scrolling. The user can freely
page up and down through the loaded list of orders without triggering any
indicator the program needs to check. If the user instead presses F3, the
response indicator tied to it, such as `*in03`, turns on, and the RPGLE
program checks it after `exfmt` returns, exactly the same way covered for
non-subfile screens, to know the user wants to exit.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical pattern for handling
function keys on a load-all subfile screen.

## Common Confusions

**"Do I need to write logic to detect Page Up and Page Down for a
load-all subfile?"**
No. For a load-all subfile, once the complete list is loaded and
displayed, IBM i handles paging through it automatically, without
involving the RPGLE program at all.

**"Does this mean Page Up and Page Down never involve the program in any
subfile strategy?"**
Not necessarily. This automatic handling applies specifically to a
load-all subfile, where everything is already loaded. Page-at-a-time
subfiles, covered conceptually in an earlier lesson, do involve the
program detecting page requests, since more records may need to be loaded
on demand; the detailed logic for that goes beyond this introductory
lesson group.

**"Are custom function keys defined differently on a subfile's control
record format compared to a regular record format?"**
No. The same `CFxx` and `CAxx` keywords, and the same response indicator
pattern, covered in earlier lessons apply directly to a subfile's control
record format, with no special subfile-specific syntax needed for custom
function keys.

## Quick Recap

- For a load-all subfile, Page Up and Page Down are handled automatically
  by IBM i once the subfile is loaded and displayed.
- Custom function keys on a subfile screen, such as F3 or F6, use the same
  `CFxx`/`CAxx` and response indicator pattern covered for regular display
  files.
- Automatic Page Up/Page Down handling is specific to load-all; page-at-
  a-time subfiles involve the program in detecting page requests.
- Recognizing what is handled automatically lets you focus custom function
  key logic on actions your screen actually needs.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would Page Up and Page Down behave differently in a page-at-a-time
  subfile?"
- "Can a subfile screen support both automatic paging and a custom F6 to
  add a record at the same time?"
