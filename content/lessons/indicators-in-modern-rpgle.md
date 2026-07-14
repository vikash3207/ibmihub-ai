# Indicators in Modern RPGLE

## Learning Objective

By the end of this lesson, you will understand what an RPGLE indicator is,
why numbered indicators were historically common, and why modern free-format
RPGLE generally favors named indicator variables and readable conditions
instead.

## Simple Explanation

In the Variables and Data Types in RPGLE lesson, you saw the `ind` data
type, holding a simple on/off value, `*on` or `*off`. This lesson looks more
closely at indicators specifically, and at how their role has changed as
RPGLE has evolved.

Older, fixed-format RPG relied heavily on **numbered indicators**, referred
to as `*IN01` through `*IN99`, or collectively as the `*IN` array. These
numbered indicators were commonly set by earlier operation codes and later
checked to control what happened next, and were especially tied to
controlling 5250 screen behavior in older display file programs.

The trouble with numbered indicators is that a name like `*IN42` tells you
nothing on its own about what it actually represents. A reader has to trace
back through the program, or the screen design, to understand what turning
indicator 42 on or off actually means.

Modern free-format RPGLE generally favors declaring your own, clearly named
indicator variables instead, using the `ind` data type you already know:

```rpgle
dcl-s custIsActive ind;

custIsActive = *on;

if custIsActive;
  dsply 'Customer is active';
endif;
```

Here, `custIsActive` immediately tells a reader what the value represents,
compared to an unnamed numbered indicator that requires extra context to
understand.

## Why It Matters

You will still encounter numbered indicators regularly when reading older
RPG programs, or programs that work with older display file screens, so
recognizing them and understanding their historical role matters. At the
same time, favoring clearly named indicator variables in new code you write
yourself makes that code significantly easier for you, and anyone else, to
read and maintain later.

## Practical Example

Imagine coming across an older program with a line like `if *in42;`. Without
additional context, this tells you almost nothing about what condition is
actually being checked. Now imagine a modern equivalent written as
`if custIsActive;` instead: the condition's meaning is clear directly from
the code itself, without needing to trace back through older documentation
or screen designs to understand it.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuine, common contrast between older and
modern RPGLE style.

## Common Confusions

**"Are numbered indicators like *IN42 no longer used at all?"**
They still appear, especially in older programs and in some interactions
with older display file screens, which have not yet been covered in this
lesson group. You will likely need to recognize them when reading existing
code, even while favoring named indicator variables in new code you write.

**"Is *INLR, used to end a program, the same kind of thing as *IN42?"**
Both are indicators in the broad sense, on/off values IBM i tracks, but
`*INLR` (Last Record) has a specific, built-in meaning recognized by every
RPGLE program, unlike a general-purpose numbered indicator such as `*IN42`,
whose meaning depends entirely on how a specific program happens to use it.

**"Is using named indicator variables just a style preference?"**
It is a strong, widely recommended practice rather than only a matter of
taste, specifically because named indicators make conditions self-explanatory
without needing outside context, which meaningfully affects how easy code is
to read and maintain over time.

## Quick Recap

- Older, fixed-format RPG relied heavily on numbered indicators (`*IN01`
  through `*IN99`), especially for controlling display file screen
  behavior.
- Numbered indicators don't explain their own meaning; understanding one
  requires outside context.
- Modern free-format RPGLE generally favors declaring your own, clearly
  named indicator variables using the `ind` data type instead.
- You will still need to recognize numbered indicators when reading older
  RPG code, even while preferring named indicators in new code.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "Why were numbered indicators so commonly used in older RPG display file
  programs specifically?"
- "Is *INLR the only special built-in indicator besides numbered ones?"
