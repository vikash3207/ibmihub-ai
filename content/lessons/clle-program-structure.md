# CLLE Program Structure

## Learning Objective

By the end of this lesson, you will be able to identify the main parts of a
simple CLLE program: the `PGM` and `ENDPGM` boundaries, variable
declarations, and the commands that make up its logic.

## Simple Explanation

In the When to Use CLLE vs RPGLE lesson, you learned that CLLE is commonly
used for orchestration and command-driven tasks. This lesson looks at the
actual shape of a simple CLLE program.

A CLLE program is written using IBM i's command syntax: each line is a
command, made up of a command name followed by keyword parameters in
parentheses, such as `CHGVAR VAR(&MSG) VALUE('Hello')`. This is the same
general command style you already know from the Understanding IBM i
Command Structure lesson; CLLE programs are largely built out of commands
like these, arranged with some added structure and logic.

A simple CLLE program is generally organized like this:

```clle
PGM

DCL VAR(&CUSTNAME) TYPE(*CHAR) LEN(30)
DCL VAR(&MSG) TYPE(*CHAR) LEN(50)

CHGVAR VAR(&CUSTNAME) VALUE('Jordan Lee')
CHGVAR VAR(&MSG) VALUE('Processing customer: ' *CAT &CUSTNAME)
SNDPGMMSG MSG(&MSG)

ENDPGM
```

- **`PGM`** marks the start of the program, and **`ENDPGM`** marks its end,
  similar in spirit to how `*inlr = *on;` signals the end of a simple RPGLE
  program.
- **`DCL`** declares a variable, stating its name, starting with an
  ampersand (`&`), its type, and its length, similar in purpose to `dcl-s`
  in RPGLE, though with CL's own keyword-based syntax.
- The remaining lines are commands that do the program's actual work, such
  as `CHGVAR` (Change Variable) to assign a value, and `SNDPGMMSG` (Send
  Program Message) to send a message.

## Why It Matters

Recognizing this overall shape, `PGM` and `ENDPGM` as boundaries,
declarations near the top, and commands doing the actual work, gives you a
mental map for reading any simple CLLE program, in the same way recognizing
RPGLE's structure helped you read unfamiliar RPGLE source.

## Practical Example

Imagine a new developer opening a CLLE program for the first time. Even
without understanding every command, they can recognize `PGM` at the top
and `ENDPGM` at the bottom as the program's boundaries, scan the `DCL`
lines to see what variables the program uses, and then read the remaining
commands in order to understand what the program actually does.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely useful, practical way to approach
reading unfamiliar CLLE source.

## Common Confusions

**"Is DCL in CLLE the same keyword as dcl-s in RPGLE?"**
They serve the same basic purpose, declaring a variable, but they are
different keywords with different syntax, since CL and RPGLE are separate
languages with their own command and declaration styles.

**"Do CLLE variable names have to start with an ampersand?"**
Yes. CL variable names conventionally start with `&`, such as `&CUSTNAME`,
which is how CL distinguishes a variable name from a literal value or a
keyword.

**"Does every CLLE program need DCL statements?"**
A CLLE program only needs `DCL` statements if it actually uses variables.
Very simple programs that only run a fixed sequence of commands with no
changing values might not declare any variables at all.

## Quick Recap

- A CLLE program starts with `PGM` and ends with `ENDPGM`.
- `DCL` declares a variable, whose name conventionally starts with `&`,
  along with its type and length.
- The commands between declarations and `ENDPGM` are what actually carry
  out the program's logic.
- CLLE programs are built from the same general command style covered in
  the Understanding IBM i Command Structure lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What does *CAT mean in the CHGVAR example in this lesson?"
- "Can a CLLE program have more than one PGM statement?"
