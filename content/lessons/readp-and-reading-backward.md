# READP and Reading Backward

## Learning Objective

By the end of this lesson, you will understand what `READP` does at a
basic level, and how reading backward through a keyed file differs from
the forward reading covered so far.

## Simple Explanation

Every read operation covered so far, `READ` and `READE`, moves forward
through a file in key order. Sometimes a program needs to move the other
direction instead, such as looking at the record just before the current
one. This is what **`READP`** (Read Prior) is for.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
setll custNbr ORDHIST;
readp ORDHIST;
```

Here, `setll custNbr ORDHIST;` positions the file at customer 1042's first
order, and `readp ORDHIST;` then reads backward from that position,
retrieving the record immediately before it in key order rather than the
one after. Just like `READ`, `%EOF` is checked immediately afterward, since
reading backward past the beginning of the file sets `%EOF` to `*on`, the
same way reading forward past the end does.

## Why It Matters

At a basic level, knowing that `READP` exists, and that it moves backward
through key order rather than forward, rounds out the picture of how
records can be stepped through in an RPGLE program. This lesson keeps to
that basic level; combining `READP` with more advanced positioning
operations is a topic for later, more advanced lessons.

## Practical Example

Imagine a program working with `ORDHIST` that needs to find the last order
placed by whichever customer's key comes immediately before customer
1042's, perhaps while scanning backward through customer groups. After
`setll custNbr ORDHIST;` positions the file immediately before customer
1042's first order, `readp ORDHIST;` retrieves the record immediately
before that position: the last order belonging to whichever customer's key
sorts just before 1042, without needing to read forward through the entire
file from the beginning to find it.

This is a simplified, illustrative example rather than a specific real
program, but it reflects the basic, everyday shape of reading backward
through a keyed file.

## Common Confusions

**"Is READP just READ running in reverse?"**
At a basic level, yes: where `READ` moves forward through key order,
`READP` moves backward. Both are checked with `%EOF` immediately
afterward, since moving past either end of the file, forward or backward,
sets `%EOF` to `*on`.

**"Can READP be used together with READE the way SETLL is?"**
That kind of combined, more advanced positioning is beyond this
introductory lesson. At this level, it is enough to know that `READP`
exists and moves backward through key order; combining it with other
operations is a topic for later, more advanced coverage.

**"Does READP require a keyed file, like CHAIN and SETLL do?"**
Yes. `READP` depends on key order to determine what "backward" means, so
it requires the same `keyed` declaration on `dcl-f` as `CHAIN`, `SETLL`,
and `READE`.

## Quick Recap

- `READP fileName;` reads the record immediately before the current
  position, moving backward through key order.
- `%EOF` becomes `*on` if `READP` moves past the beginning of the file, the
  same way it does when `READ` moves past the end.
- `READP` requires a keyed file, since it depends on key order to know
  which direction is "backward."
- This lesson covers `READP` only at a basic level; combining it with other
  positioning operations is left for more advanced coverage later.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What would happen if I called READP as the very first operation on a
  file, before any SETLL or CHAIN?"
- "Is there a version of CHAIN that works backward the way READP does for
  READ?"
