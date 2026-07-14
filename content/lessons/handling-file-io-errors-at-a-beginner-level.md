# Handling File I/O Errors at a Beginner Level

## Learning Objective

By the end of this lesson, you will be able to explain the beginner-level
approach to handling errors during file operations, building on `%FOUND`,
`%EOF`, and the general error-handling pattern already covered.

## Simple Explanation

The Basic Error Handling in RPGLE lesson introduced `monitor` / `on-error`
/ `endmon` for catching a runtime error anywhere in a program. File
operations have their own first line of defense, already covered across
this lesson group: checking `%FOUND` after `CHAIN`, and `%EOF` after
`READ`, `READE`, or `READP`. Most everyday "record not found" or "no more
records" situations are not actually errors at all; they are simply
conditions checked with these built-in functions.

```rpgle
dcl-f ORDHIST disk keyed;

dcl-s custNbr packed(6:0);

custNbr = 1042;
monitor;
  chain custNbr ORDHIST;
  if %found(ORDHIST);
    update ORDHIST;
  endif;
on-error;
  dsply 'Unexpected error accessing ORDHIST';
endmon;
```

Here, `%found(ORDHIST)` handles the ordinary case of a customer number that
simply does not exist, no error involved at all. The surrounding `monitor`
/ `on-error` block instead catches something genuinely unexpected, such as
the record being locked by another job, covered in the previous lesson,
and unavailable when `CHAIN` was attempted.

## Why It Matters

Beginners sometimes reach for `monitor` blocks to handle situations that
`%FOUND` and `%EOF` already handle perfectly well on their own, such as a
key value simply not existing. Understanding that ordinary "not found" and
"end of file" conditions are checked with `%FOUND` and `%EOF`, while
`monitor` blocks are reserved for genuinely unexpected problems, such as a
locked record, keeps file-handling code simpler and easier to follow.

## Practical Example

Imagine the order lookup program from earlier lessons in this group. A
customer number that does not exist in `ORDHIST` is an entirely normal,
expected outcome, handled cleanly with `%found(ORDHIST)`. A record that
happens to be locked by another job at that exact moment, covered in the
Basic File Locking Concept in RPGLE lesson, is a different, less common
situation, one better suited to a surrounding `monitor` block so the
program can respond sensibly rather than ending abruptly.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely useful, beginner-level way to think
about which file conditions need `%FOUND`/`%EOF` and which need `monitor`.

## Common Confusions

**"Should I wrap every CHAIN in a monitor block just in case?"**
Not necessarily, at this beginner level. `%FOUND`, checked immediately
after `CHAIN`, already handles the ordinary case of no matching record.
Reserve `monitor` blocks for less common, genuinely unexpected situations,
such as a locked record, rather than using them for conditions `%FOUND` and
`%EOF` already cover cleanly.

**"What counts as a 'genuinely unexpected' file error at this level?"**
This lesson keeps to simple, practical examples, such as a record being
locked by another job when a `CHAIN` intended for update is attempted.
Deeper, more complete file-status-based error detection is a more advanced
topic beyond this introduction.

**"Does checking %FOUND or %EOF count as error handling?"**
In a sense, yes, though it is better described as checking an expected
condition rather than handling an error. True error handling, using
`monitor` / `on-error` / `endmon`, is reserved for situations outside the
normal, expected range of outcomes for an operation.

## Quick Recap

- Ordinary "not found" and "end of file" conditions are checked with
  `%FOUND` and `%EOF`, not treated as errors.
- `monitor` / `on-error` / `endmon`, covered in the Basic Error Handling in
  RPGLE lesson, is reserved for genuinely unexpected file problems, such as
  a locked record.
- Wrapping every file operation in a `monitor` block is unnecessary when
  `%FOUND` or `%EOF` already handle the expected outcomes.
- This lesson stays at a beginner level; deeper file-status-based error
  detection is a more advanced topic.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is a concrete example of a file error that %FOUND or %EOF would
  not catch?"
- "Should the on-error block try the file operation again, or just report
  the problem?"
