# Sending and Receiving Messages in CLLE

## Learning Objective

By the end of this lesson, you will understand what a message queue is at
a basic level, and be able to use `SNDPGMMSG` to send a message and
`RCVMSG` to deliberately receive one.

## Simple Explanation

You have already used `SNDPGMMSG` in earlier CLLE lessons to send a simple
message. This lesson looks at messages more fully: where a sent message
actually goes, and how a program can deliberately read a message back,
rather than only reacting automatically the way `MONMSG` does.

Every job has a **message queue**, a place IBM i holds messages sent to or
from that job, connecting directly to the Job Logs and Spool Files Basics
lesson: many of the messages that end up in a job log arrive there by
being sent to that job's message queue. `SNDPGMMSG` sends a message to a
message queue, commonly the job's own:

```clle
DCL VAR(&MSG) TYPE(*CHAR) LEN(50)

CHGVAR VAR(&MSG) VALUE('Order processing started')
SNDPGMMSG MSG(&MSG) TOPGMQ(*EXT)
```

`TOPGMQ(*EXT)` sends the message to the external message queue of the job
that called this program, a common choice for status messages meant to be
visible outside the current program itself.

Where `MONMSG` automatically catches specific messages as they occur, a
program can also deliberately read a message using **`RCVMSG`**:

```clle
DCL VAR(&RECEIVEDMSG) TYPE(*CHAR) LEN(80)

RCVMSG MSGTYPE(*ANY) MSG(&RECEIVEDMSG)
```

`RCVMSG` pulls the next available message from a message queue into a
variable, letting a program inspect or respond to it directly, rather than
relying only on `MONMSG`'s automatic pattern.

## Why It Matters

Understanding messages and message queues at this basic level explains
where the messages you have already been sending with `SNDPGMMSG`
throughout this lesson group actually go, and gives you a second way,
`RCVMSG`, to work with messages deliberately rather than only reacting to
them automatically through `MONMSG`. This becomes especially useful when a
program needs to inspect a message's exact content, not just detect that
some matching message occurred.

## Practical Example

Imagine a CLLE program that sends a status message when it starts
processing, using `SNDPGMMSG` with `TOPGMQ(*EXT)`, so that whatever called
it can see that status update. Separately, imagine a monitoring program
that uses `RCVMSG` to deliberately read messages from a job's message
queue, checking their content to decide what to do next, rather than only
reacting to specific error messages the way `MONMSG` does.

This is a simplified, illustrative example rather than a specific real
system, but it reflects a genuinely common, basic pattern for sending and
deliberately reading messages in CLLE.

## Common Confusions

**"Is RCVMSG the same thing as MONMSG?"**
No. `MONMSG` automatically catches a specific message, or class of
messages, immediately after a command, as covered in the MONMSG and Basic
Error Handling in CLLE lesson. `RCVMSG` deliberately reads a message from a
message queue at the point in the program where it is used, rather than
reacting automatically to a specific command.

**"Does every message end up in the job log?"**
Many messages sent to a job's message queue do become part of that job's
job log, as covered in the Job Logs and Spool Files Basics lesson, though
the exact details of what is logged can depend on the specific message and
job settings.

**"Do I need to use RCVMSG in most simple CLLE programs?"**
No. Many simple CLLE programs only need `SNDPGMMSG` to send status or error
messages, and `MONMSG` to react automatically to specific problems.
`RCVMSG` is most useful when a program specifically needs to inspect a
message's content directly.

## Quick Recap

- Every job has a message queue, where messages sent to or from that job
  are held; many job log entries originate this way.
- `SNDPGMMSG` sends a message; `TOPGMQ(*EXT)` is a common choice for status
  messages meant to be visible to whatever called the current program.
- `RCVMSG` deliberately reads the next available message from a message
  queue into a variable, unlike `MONMSG`'s automatic reaction pattern.
- Most simple CLLE programs rely mainly on `SNDPGMMSG` and `MONMSG`;
  `RCVMSG` is most useful when a program needs to inspect a message's exact
  content.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What is the difference between a job's message queue and a user's
  message queue?"
- "What does TOPGMQ(*EXT) mean compared to other TOPGMQ options?"
