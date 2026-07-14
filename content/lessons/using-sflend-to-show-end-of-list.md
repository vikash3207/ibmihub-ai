# Using SFLEND to Show End of List

## Learning Objective

By the end of this lesson, you will understand what `SFLEND` does, and how
it gives the user a clear, automatic signal about whether more records
remain beyond what is currently visible.

## Simple Explanation

Once a user is looking at a subfile, a very natural question is whether
there is more to see below the current page. The DDS keyword **`SFLEND`**
(Subfile End), placed on the control record format, answers this
automatically: IBM i displays a small indicator, commonly the word
"More..." near the bottom of the subfile area, whenever more records
exist beyond what is currently visible, and switches to showing "Bottom"
once the user has actually scrolled to the last available record.

This happens automatically once `SFLEND` is specified; the RPGLE program
does not need to track or calculate this itself. As the user pages through
a subfile, whether load-all or page-at-a-time, IBM i updates this
indicator based on whether more records genuinely remain.

## Why It Matters

Without something like `SFLEND`, a user looking at a subfile has no clear
way of knowing whether they have seen everything or whether more records
are waiting further down the list. This small, automatic signal makes a
subfile screen noticeably easier to use, since the user does not have to
guess or scroll further just to check.

## Practical Example

Imagine the order list subfile from earlier lessons in this group, using
`SFLEND` on its control record format. While the user is looking at the
first page of orders and more exist further down, "More..." appears near
the bottom of the list. Once the user has scrolled or paged down to the
very last order, that same area instead shows "Bottom," clearly confirming
there is nothing further to see.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects exactly how `SFLEND` is commonly used to keep
users clearly informed as they move through a list.

## Common Confusions

**"Does the RPGLE program need to check whether more records exist and
update SFLEND itself?"**
No. Once `SFLEND` is specified on the control record format, IBM i
manages this indicator automatically based on the subfile's actual
contents and the user's current position within it.

**"Does SFLEND behave differently for load-all versus page-at-a-time
subfiles?"**
The visible behavior, showing "More..." or "Bottom," works the same way
from the user's perspective either way. The underlying difference is that
a page-at-a-time subfile may need the program to load additional records
as the user approaches what "More..." currently refers to, while a
load-all subfile already has everything loaded from the start.

**"Is SFLEND required for every subfile?"**
No. `SFLEND` is a helpful, common addition, but a subfile can function
without it; without it, the user simply would not see this "More..." or
"Bottom" indicator at all.

## Quick Recap

- `SFLEND`, placed on the control record format, automatically shows
  "More..." when additional records remain and "Bottom" once the user has
  reached the last one.
- This indicator is managed entirely by IBM i; the RPGLE program does not
  need to calculate or update it.
- `SFLEND` works the same way visually for both load-all and page-at-a-
  time subfiles, though page-at-a-time may still need to load more records
  as the user approaches the current end.
- `SFLEND` is optional but a common, user-friendly addition to a subfile
  screen.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Can the 'More...' and 'Bottom' text shown by SFLEND be customized?"
- "How does SFLEND interact with a page-at-a-time subfile that still has
  more data to load?"
