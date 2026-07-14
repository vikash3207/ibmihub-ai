# RPGLE Source Layout and Free Format Basics

## Learning Objective

By the end of this lesson, you will understand the basic layout rules of
free-format RPGLE source: the `**free` marker, semicolons, comments, and
how free-format differs in spirit from older fixed-format RPG.

## Simple Explanation

In the Introduction to RPGLE lesson, you learned that RPG has both an
older, column-based fixed-format style and a newer free-format style, and
that this lesson group focuses on free-format RPGLE. This lesson looks at
the basic layout rules that make free-format source what it is.

A few simple rules define free-format RPGLE source:

- Source written in free-format traditionally begins with a `**free` line
  at the very top of the source member, marking everything below it as
  free-format.
- Every statement ends with a **semicolon** (`;`), rather than relying on
  fixed column positions to know where one instruction ends and the next
  begins.
- **Comments** start with two forward slashes (`//`) and run to the end of
  the line, used to explain what a piece of code does for anyone reading it
  later.
- Indentation and spacing are flexible and used for readability, not
  required by the compiler the way older fixed-format column positions
  were.

By contrast, older fixed-format RPG required specific pieces of information
to start in specific, fixed column positions on the line, which made it far
less forgiving to read and write. Free-format RPGLE was introduced to make
RPG read more like other modern programming languages, while still running
on the same IBM i platform and working with the same underlying data.

```rpgle
**free
ctl-opt dftactgrp(*no);

// Declare a variable to hold a customer's name
dcl-s custName char(30);

custName = 'Jordan Lee'; // Assign a simple value
dsply custName;

*inlr = *on;
```

## Why It Matters

Understanding these basic layout rules matters immediately and practically:
without knowing that statements must end in a semicolon, or that `**free`
marks free-format source, simple typos can turn into confusing compiler
errors for a beginner. Recognizing this basic structure also helps you tell,
at a glance, whether a piece of RPG source you are looking at is
free-format or older fixed-format.

## Practical Example

Imagine a beginner copies an example from a free-format lesson but forgets
to end a line with a semicolon. When they try to compile it, the compiler
reports an error pointing at that line. Recognizing that free-format RPGLE
requires a semicolon at the end of every statement lets them quickly spot
and fix the missing punctuation, rather than assuming something more
complicated is wrong with their code.

This is a simplified, illustrative example rather than a specific real
error message, but it reflects a very common, easily fixed mistake
beginners make when they are first getting comfortable with free-format
RPGLE's layout rules.

## Common Confusions

**"Do I always need to type `**free` at the top of every RPGLE source
member?"**
Traditionally, yes, to clearly mark a source member as free-format. This
lesson keeps to this traditional, safe convention; some newer compiler
versions handle certain cases without it, but including `**free` remains a
clear, widely understood way to start a free-format program.

**"Can I mix fixed-format and free-format in the same program?"**
Older RPG code bases sometimes do mix styles, since RPG has evolved so much
over time, but this lesson group focuses entirely on writing clean,
consistent free-format RPGLE, which is the recommended style for new code
today.

**"Does indentation matter to the compiler?"**
No. Indentation and spacing in free-format RPGLE are for human readability;
the compiler relies on semicolons to know where statements end, not on how
the code is visually indented.

## Quick Recap

- Free-format RPGLE source traditionally begins with a `**free` line at the
  top of the source member.
- Every statement ends with a semicolon, rather than relying on fixed
  column positions.
- Comments start with `//` and run to the end of the line.
- Indentation is flexible and used for readability, not required by the
  compiler.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What kinds of errors happen if I forget a semicolon in free-format
  RPGLE?"
- "Why did IBM introduce free-format RPGLE if fixed-format already
  existed?"
