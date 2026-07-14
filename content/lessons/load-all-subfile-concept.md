# Load-All Subfile Concept

## Learning Objective

By the end of this lesson, you will understand the load-all subfile
strategy: loading every available record into a subfile before displaying
it once, and how `SFLPAG` and `SFLSIZ` relate to this approach.

## Simple Explanation

Once a subfile is set up, as covered in the previous lesson, a program
needs a strategy for actually getting records into it. **Load-all** is the
simplest such strategy: the program loads every record it wants to show,
from beginning to end, into the subfile before displaying it to the user
even once. After that, the user can page or scroll through the already-
loaded list freely, without the program needing to do anything further.

Two keywords on the control record format matter here:

- **`SFLPAG`** (Subfile Page) specifies how many subfile rows are visible
  on the screen at once, the page size the user actually sees.
- **`SFLSIZ`** (Subfile Size) specifies how many records the subfile can
  currently hold in total.

For a load-all subfile, it is common to set `SFLSIZ` equal to `SFLPAG`
to start, since IBM i can automatically grow the subfile's actual capacity
as more records are loaded beyond that starting size. The key idea for
load-all is simply that every record is loaded up front, in a loop, before
the subfile control record format is shown to the user for the first time.

## Why It Matters

Load-all is the most straightforward subfile strategy to understand and
program, since the entire list exists before the user ever sees it,
letting IBM i handle all the scrolling and paging automatically once
displayed. This makes it a natural starting point for building your first
working subfile, even though, as the next lesson covers, it is not always
the most efficient choice for very large record sets.

## Practical Example

Imagine building the order list screen described in earlier lessons in
this group, using load-all. The RPGLE program would loop through every
order for the relevant customer, writing each one into the subfile one at
a time, before ever showing the control record format to the user. Once
every order has been loaded this way, the program shows the control
record format once, and the user can freely scroll through the complete
list of orders that was already loaded.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the essential shape of a load-all subfile: load
everything first, then display once.

## Common Confusions

**"Does load-all mean the subfile can only ever hold exactly SFLSIZ
records?"**
No. `SFLSIZ` is a starting capacity, not necessarily a hard limit; IBM i
can grow a subfile's actual capacity automatically as more records are
loaded into it beyond that starting size.

**"Does the user need to do anything special to scroll through a
load-all subfile?"**
No. Once every record has been loaded and the subfile is displayed, IBM i
handles paging and scrolling through the already-loaded list
automatically, without the RPGLE program needing to load anything further
in response.

**"Is load-all always the right choice?"**
Not necessarily, especially for a very large number of records, since
loading everything up front before showing anything to the user can take
noticeable time. The next lesson, Page-at-a-Time Subfile Concept, covers
an alternative strategy better suited to larger record sets.

## Quick Recap

- Load-all means loading every record into a subfile before displaying it
  to the user even once.
- `SFLPAG` specifies how many rows are visible on screen at once; `SFLSIZ`
  specifies the subfile's starting capacity, commonly set equal to
  `SFLPAG` for load-all and able to grow automatically as needed.
- Once a load-all subfile is displayed, IBM i handles scrolling through
  the already-loaded list automatically.
- Load-all is simple to program but not always the most efficient choice
  for very large record sets.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What happens if I try to load more records than SFLSIZ allows?"
- "At what point does a record set become too large for load-all to make
  sense?"
