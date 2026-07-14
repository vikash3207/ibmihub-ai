# READ, WRITE, EXFMT, and Screen Flow

## Learning Objective

By the end of this lesson, you will understand that `exfmt` is really a
combination of separate `write` and `read` operations, and recognize a
situation where using them separately makes more sense than `exfmt` alone.

## Simple Explanation

In the RPGLE Program Calling a Display File lesson, you learned that
`exfmt` shows a record format and reads the user's response in one
combined step, and that this lesson group would return to what that
actually means underneath. As it turns out, `exfmt` is built from two
separate, more basic operations:

- **`write`** sends a record format to the screen, without waiting for the
  user to respond at all. Control returns to the program immediately after
  the screen is shown.
- **`read`** waits for the user to respond to a record format already on
  the screen, without sending anything new first.

`exfmt` is simply `write` followed immediately by `read`, combined into
one operation, which is why it is the most common, straightforward choice
for a simple screen where you want to show something and immediately wait
for the response.

Using `write` and `read` separately becomes useful when a program needs to
show something to the user, then do other work, before waiting for their
response:

```rpgle
write PROCESSINGFMT;

// Do some longer-running work here while
// PROCESSINGFMT stays visible on screen

read INQFMT;
```

Here, `write PROCESSINGFMT;` shows a "please wait" style message
immediately, without pausing the program. The program can then do other
work while that message stays visible, before separately using `read` to
wait for a response to a different format already expected on screen.

## Why It Matters

Understanding that `exfmt` is `write` plus `read` demystifies what
`exfmt` is actually doing, and gives you the flexibility to separate those
two steps when a program genuinely needs to show something and keep
working before waiting for a response, rather than always pausing
immediately the way `exfmt` does.

## Practical Example

Imagine a program that needs to show a "Processing your request..."
message while it performs a longer lookup or calculation, before finally
showing the result and waiting for the user. Using `write` to show the
processing message immediately, doing the actual work afterward, and then
using `exfmt` or `read` for the next screen keeps the user informed during
the wait, rather than leaving the screen frozen with no feedback until the
work finishes.

This is a simplified, illustrative example rather than a specific real
program, but it reflects a genuinely common, practical reason to use
`write` and `read` separately instead of relying only on `exfmt`.

## Common Confusions

**"Should I replace every exfmt in my programs with separate write and
read calls?"**
No. For the very common case of showing a screen and immediately waiting
for the user's response, `exfmt` remains the simplest, most direct choice,
exactly as used throughout earlier lessons in this group. Separate `write`
and `read` calls are most useful specifically when work needs to happen
between showing something and waiting for a response.

**"Does write wait for the user at all?"**
No. `write` sends a record format to the screen and returns control to the
program immediately, without waiting for any response. Waiting for a
response is specifically what `read` does.

**"Can I use read on a record format that hasn't been written to the
screen yet?"**
No, not meaningfully. `read` waits for a response to a record format
already visible on the screen, so it depends on that format having been
shown first, whether through an earlier `write` or `exfmt` call.

## Quick Recap

- `exfmt` combines `write` (show a format, do not wait) and `read` (wait
  for a response to a format already shown) into one operation.
- `write` alone is useful for showing something, such as a "please wait"
  message, while the program continues working before waiting for a
  response.
- `read` alone waits for a response to a record format that has already
  been written to the screen.
- `exfmt` remains the simplest, most common choice when a program wants to
  show a screen and immediately wait for the user.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other realistic reasons to use write and read
  separately instead of exfmt?"
- "Does write need to be paired with a matching read on the exact same
  record format?"
