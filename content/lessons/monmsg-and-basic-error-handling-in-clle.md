# MONMSG and Basic Error Handling in CLLE

## Learning Objective

By the end of this lesson, you will understand why error handling matters
in CLLE, and be able to use a simple `MONMSG` command to catch an error
from a command or program call.

## Simple Explanation

In the Calling RPGLE Programs from CLLE lesson, `CALL` always assumed the
called program would run successfully. In practice, a command or a called
program can fail, similar to the runtime errors covered in the Basic Error
Handling in RPGLE lesson. CLLE catches this kind of problem using
**`MONMSG`** (Monitor Message).

`MONMSG` is placed directly after the command it is meant to watch, and
names the message identifier, or class of messages, to watch for:

```clle
DCL VAR(&MSG) TYPE(*CHAR) LEN(50)

CALL PGM(PROCESSORDER) PARM(&CUSTNAME &ORDERTOTAL)
MONMSG MSGID(CPF0000) EXEC(DO)
  CHGVAR VAR(&MSG) VALUE('Order processing failed')
  SNDPGMMSG MSG(&MSG)
ENDDO
```

Here, `MSGID(CPF0000)` watches broadly for escape messages, the general
category IBM i uses to signal that a command or program call did not
complete successfully. If `CALL` fails with a matching message, IBM i runs
the `EXEC` section's `DO` group instead of letting the program stop
abruptly, in this case building and sending a message explaining what
happened.

## Why It Matters

Without `MONMSG`, a failed command or program call would typically stop
the entire CLLE program at that point. In many real operational processes,
that is far worse than handling the problem in a controlled way, such as
logging what happened, sending a message, or deciding whether to continue
with remaining steps. `MONMSG` is what lets a CLLE program stay in control
when something unexpected happens, echoing the same goal `monitor` serves
in RPGLE.

## Practical Example

Imagine the nightly process described in earlier CLLE lessons, where a
CLLE program calls an RPGLE program to process orders. If that RPGLE
program fails partway through, `MONMSG MSGID(CPF0000)` placed after the
`CALL` lets the CLLE program catch that failure, send a message describing
what happened, and decide what to do next, rather than the entire nightly
process stopping unexpectedly with no clear record of what went wrong.

This is a simplified, illustrative example rather than a specific real
process, but it reflects a genuinely common, practical reason CLLE
developers use `MONMSG` around calls that can fail.

## Common Confusions

**"Does MONMSG prevent every possible problem in my program?"**
No. `MONMSG` catches messages matching what it is watching for,
immediately after the command it follows. It does not prevent every kind
of mistake in a program, only lets the program respond in a controlled way
when a matching message actually occurs.

**"Do I need a DO group after EXEC every time?"**
No. Like `THEN` in the IF, DO, and Basic Control Flow in CLLE lesson,
`EXEC` can name a single command directly, or a `DO` group when more than
one command needs to run in response to the message.

**"Is CPF0000 the only message ID I can monitor for?"**
No. `CPF0000` is a common, broad choice covering general escape messages,
but `MONMSG` can also watch for a specific message identifier when a
program needs to respond differently to one particular kind of problem.

**"Does a MONMSG watch every command in my program, or just one?"**
This is one of the most common points of confusion with `MONMSG`, so it is
worth being precise about. A `MONMSG` written directly after one specific
command, as in the example above, watches only that one command. If a
different, later command in the program also needs the same protection, it
generally needs its own `MONMSG` placed directly after it. Beginners often
assume one `MONMSG`, once written, automatically protects every command
that follows it, which is not the case for a `MONMSG` attached this way to
a single command.

## Quick Recap

- `MONMSG` is placed directly after a command to watch for a specific
  message, or broad class of messages, such as `CPF0000`.
- If a matching message occurs, IBM i runs the `EXEC` section instead of
  letting the program stop abruptly.
- `EXEC` can name a single command or a `DO` group, the same pattern used
  by `THEN` in `IF` commands.
- `MONMSG` lets a CLLE program handle failures in a controlled way, the
  same goal `monitor` serves in RPGLE.
- A `MONMSG` attached to one specific command only watches that command;
  it does not automatically protect other commands later in the program.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between monitoring for CPF0000 and a specific
  message ID?"
- "Can I use MONMSG more than once in the same CLLE program?"
