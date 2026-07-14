# CL Commands and Parameters

## Learning Objective

By the end of this lesson, you will be able to read a CL command's keyword
parameters inside a CLLE program, and understand how a command's
parameters can be filled in using literal values or variables.

## Simple Explanation

In the Understanding IBM i Command Structure lesson, you learned that most
IBM i commands follow a verb-plus-object naming pattern and accept
parameters. In the CLLE Program Structure lesson, you saw commands like
`CHGVAR` and `SNDPGMMSG` used inside a program. This lesson looks more
closely at how a command's parameters work when used inside CLLE.

A CL command's parameters are written as **keyword-value pairs**, with the
keyword followed by a value in parentheses, such as `VAR(&CUSTNAME)` or
`VALUE('Jordan Lee')`. A single command line can combine several
parameters together:

```clle
DCL VAR(&ORDERTOTAL) TYPE(*DEC) LEN(9 2)
DCL VAR(&MSG) TYPE(*CHAR) LEN(50)

CHGVAR VAR(&ORDERTOTAL) VALUE(100.00)
CHGVAR VAR(&MSG) VALUE('Order total is ' *CAT &ORDERTOTAL)
```

Here, `DCL` uses three keyword parameters together: `VAR`, `TYPE`, and
`LEN`. A parameter's value can be a literal, such as `100.00` or
`'Jordan Lee'`, or a variable, such as `&ORDERTOTAL`, allowing a command to
work with whatever value a variable currently holds rather than only a
fixed value typed directly into the command.

As covered in the Using F4 Prompt and Command Help lesson, pressing F4
after typing a command name at a command line shows its available
parameters interactively. That same prompting is available while editing
CLLE source in many editors, which is especially useful for commands with
many optional parameters.

## Why It Matters

Understanding that CL commands are built from keyword parameters, and that
those parameters can hold either literals or variables, is foundational to
reading or writing any CLLE program. Nearly every line inside a CLLE
program is a command using this same keyword-parameter pattern, so
recognizing it clearly is essential to following what a program actually
does.

## Practical Example

Imagine reading a CLLE program with the line
`CHGVAR VAR(&ORDERTOTAL) VALUE(100.00)`. Recognizing the keyword-parameter
pattern, you can tell this command is `CHGVAR`, changing the variable named
in the `VAR` parameter, `&ORDERTOTAL`, to the literal value given in the
`VALUE` parameter, `100.00`.

Now imagine the same command written instead as
`CHGVAR VAR(&ORDERTOTAL) VALUE(&NEWTOTAL)`. The pattern is identical, but
the `VALUE` parameter now holds a variable instead of a literal, meaning
`&ORDERTOTAL` is set to whatever `&NEWTOTAL` currently contains, rather
than a fixed number typed directly into the command. This is a simplified,
illustrative example rather than a specific real program, but it reflects
a very common, everyday pattern in CLLE source.

## Common Confusions

**"Do I always have to write out every possible parameter for a
command?"**
No. Most commands have optional parameters with sensible defaults, similar
to what you learned in the Using F4 Prompt and Command Help lesson. You
generally only need to specify the parameters relevant to what you are
trying to do.

**"Can a command's parameter value be another command's result
directly?"**
Not directly within one command. A common pattern is to run one command,
store its result in a variable using an appropriate keyword parameter, and
then use that variable as a parameter value in a later command.

**"Does parameter order matter in a CL command?"**
Since CL parameters are identified by keyword rather than position alone,
order is generally more flexible than in a language where position is the
only thing that matters, though following a consistent order still makes
code easier to read.

## Quick Recap

- CL command parameters are written as keyword-value pairs, such as
  `VAR(&CUSTNAME)` or `VALUE('Jordan Lee')`.
- A parameter's value can be a literal, or a variable such as
  `&ORDERTOTAL`, letting a command work with a changing value.
- Multiple keyword parameters can be combined on a single command line.
- F4 prompting, covered earlier for command entry, is also commonly
  available while editing CLLE source.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I leave out a required keyword parameter on a CL
  command?"
- "Can a single CL command have both literal and variable parameter values
  at the same time?"
