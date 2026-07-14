# Basic Update/Delete Subfile Pattern

## Learning Objective

By the end of this lesson, you will be able to describe, at a conceptual
level, how a subfile screen commonly handles a user choosing to update or
delete specific records from a list.

## Simple Explanation

You now know each piece needed to understand this pattern: option fields
let a user mark rows with an action, `READC` finds those marked rows, and
RRN identifies exactly which record each row corresponds to. A basic
update/delete subfile pattern combines these pieces into a general flow:

1. The user browses the subfile and types an option value, such as `2`
   for Change or `4` for Delete, next to one or more rows, then submits the
   screen.
2. The RPGLE program runs a `READC` loop, finding each changed row one at a
   time.
3. For each changed row, the program checks its option value, commonly
   using `select` / `when`, as covered in the SELECT / WHEN / OTHER in
   RPGLE lesson, and takes the matching action: for Change, this might
   mean showing a separate screen to edit that specific record; for
   Delete, this might mean removing that record from the underlying data
   after confirming, using an approach similar to the window record
   confirmation pattern covered earlier in this lesson group.
4. Once all changed rows have been processed, the subfile is commonly
   cleared and reloaded, as covered in the Clearing and Reloading a
   Subfile lesson, so the list reflects whatever changes were just made.

## Why It Matters

This pattern, select rows with options, process them with `READC`, act on
each one, then refresh the list, is one of the most common, practical
shapes behind real IBM i maintenance screens, letting a user manage many
records through a single list-based screen rather than navigating to a
separate screen for every single record one at a time.

## Practical Example

Imagine the order list subfile from earlier lessons in this group,
supporting Change and Delete options. A user types `4` next to an order
they no longer need and submits the screen. The program's `READC` loop
finds that row, sees the Delete option, removes the corresponding order
from the underlying data, and then clears and reloads the subfile so the
deleted order no longer appears in the refreshed list.

This is a simplified, illustrative example rather than a specific real
maintenance screen, but it reflects the general, practical shape many real
IBM i update/delete subfile screens follow.

## Common Confusions

**"Does deleting a record from a subfile also delete the underlying
stored data?"**
Not automatically. Removing a row from the subfile display and deleting
the actual underlying record, such as a row in a physical file, are
separate actions; the RPGLE program needs to explicitly perform the
underlying delete as part of handling that option, not just remove the
row from the subfile.

**"Does the subfile need to be cleared and reloaded after every single
change?"**
Not necessarily after each individual row inside the `READC` loop, but
commonly once, after the entire loop has finished processing every changed
row, so the user sees an accurate, refreshed list reflecting all the
changes at once.

**"Is this pattern the same for every kind of update or delete
scenario?"**
No. This lesson describes a common, general shape at a conceptual level.
Real screens can reasonably add more detail, such as confirmation prompts
before deleting, or dedicated edit screens for changes, building on this
same general pattern rather than replacing it.

## Quick Recap

- A basic update/delete subfile pattern: the user marks rows with option
  values, the program processes each marked row with a `READC` loop,
  takes the matching action per row, then refreshes the subfile.
- Deleting a subfile row does not automatically delete the underlying
  stored data; the program must explicitly perform that action.
- The subfile is commonly cleared and reloaded once, after all changed
  rows have been processed, rather than after each individual row.
- This pattern is a general, conceptual shape; real screens can reasonably
  add more detail, such as confirmations, on top of it.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How might a confirmation step fit into this pattern before actually
  deleting a record?"
- "What would need to change in this pattern to support adding a brand
  new record, not just changing or deleting existing ones?"
