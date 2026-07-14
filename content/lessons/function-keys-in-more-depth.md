# Function Keys in More Depth

## Learning Objective

By the end of this lesson, you will recognize common, conventional
meanings for several function keys used across IBM i applications, and be
able to read a screen that supports more than one function key at once.

## Simple Explanation

In the Function Keys and Response Indicators lesson, you learned how a
single function key, F3, ties to a response indicator using a keyword like
`CF03`. Real 5250 screens commonly support several function keys at once,
each tied to its own indicator, and many IBM i applications follow shared
conventions for what specific function keys typically do:

- **F3 (Exit)** commonly leaves the current screen or program entirely,
  as used throughout earlier lessons in this group.
- **F5 (Refresh)** commonly redisplays the current screen with updated
  information, without leaving it, useful when the underlying data might
  have changed.
- **F12 (Cancel)** commonly backs out of the current action or screen,
  similar in spirit to F3 but often used specifically to cancel a step
  partway through, rather than exiting the whole program.
- **F1 (Help)** commonly displays additional information about the current
  screen or field.

These are conventions, not fixed rules enforced by IBM i itself, but they
are followed widely enough that users familiar with one IBM i application
often already have a reasonable guess at what F3, F5, F12, and F1 do in
another.

A screen supporting several function keys simply ties each one to its own
`CFxx` or `CAxx` keyword and its own indicator:

```text
CF03  ->  *IN03  (Exit)
CF05  ->  *IN05  (Refresh)
CF12  ->  *IN12  (Cancel)
```

After `exfmt` returns, the RPGLE program checks each relevant indicator to
find out which one, if any, was turned on, and responds accordingly.

## Why It Matters

Following established function key conventions makes an IBM i application
noticeably easier for a user to learn, since they can bring expectations
from other IBM i applications they already know. Understanding how a
screen manages several function keys at once, each with its own
indicator, is also essential to reading or writing any realistic
interactive screen, since very few real screens rely on only a single
function key.

## Practical Example

Imagine the customer inquiry screen from earlier lessons in this group,
extended to support F5 in addition to F3. Pressing F3 still exits the
program entirely, as before. Pressing F5 instead redisplays the current
customer's information, refreshed from the underlying data, without
leaving the inquiry screen. The RPGLE program checks `*in03` first; if it
is off, it checks `*in05` to see whether a refresh was requested instead.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical pattern for supporting
more than one function key on the same screen.

## Common Confusions

**"Does IBM i enforce that F3 always means Exit?"**
No. These are widely followed conventions, not rules enforced by the
platform itself. A display file's DDS can tie any function key to any
indicator meaning anything the developer chooses; following the common
conventions is simply good practice for a screen users will find familiar.

**"If a screen supports three function keys, does the program need three
separate if checks?"**
Commonly, yes, one check per relevant indicator, though the exact
structure can vary. Checking each indicator individually, generally in a
priority order that makes sense for that screen, is a very common,
straightforward way to handle several function keys.

**"What happens if two function keys are pressed at the same time?"**
This is not something a 5250 screen supports in practice; a user submits a
screen with exactly one function key or Enter at a time, so an RPGLE
program only ever needs to determine which single response indicator, if
any, was turned on for a given submission.

## Quick Recap

- F3 (Exit), F5 (Refresh), F12 (Cancel), and F1 (Help) are common,
  widely followed function key conventions across IBM i applications,
  though not rules enforced by the platform itself.
- A screen supporting several function keys ties each one to its own
  `CFxx` or `CAxx` keyword and its own response indicator.
- After `exfmt` returns, the RPGLE program checks each relevant indicator
  to determine which function key, if any, was pressed.
- Following common function key conventions makes an application easier
  for users already familiar with other IBM i applications.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Are there other common function key conventions besides F3, F5, F12,
  and F1?"
- "In what order should I check multiple response indicators after
  exfmt?"
