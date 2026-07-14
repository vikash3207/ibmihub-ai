# Basic Error Handling in RPGLE

## Learning Objective

By the end of this lesson, you will understand why error handling matters
in RPGLE, and be able to use a simple `monitor` / `on-error` / `endmon`
block to catch and respond to a runtime error.

## Simple Explanation

Some operations that seem straightforward can fail while a program is
running. For example, the `%DEC` built-in function you learned about in the
Built-in Functions in RPGLE lesson converts character data into a packed
decimal number, but if that character data does not actually represent a
valid number, the conversion fails as the program runs.

RPGLE lets you catch this kind of runtime error using a **`monitor`**
block, ending with **`endmon`**, with one or more **`on-error`** sections
that run only if an error actually occurs:

```rpgle
dcl-s rawAmount char(10);
dcl-s amount packed(9:2);

rawAmount = 'N/A';

monitor;
  amount = %dec(rawAmount : 9 : 2);
on-error;
  dsply 'Could not convert amount, defaulting to 0';
  amount = 0;
endmon;
```

IBM i runs the statements inside `monitor` normally. If one of them fails
with a runtime error, IBM i immediately jumps to the matching `on-error`
section instead of stopping the whole program, runs the recovery logic
there, such as setting a sensible default value, and then continues after
`endmon`.

## Why It Matters

Without any error handling, a runtime error in an operation like a failed
conversion would normally stop the entire program abruptly. In many real
business situations, that is far worse than handling the problem
gracefully, such as substituting a sensible default value, showing a clear
message, or logging what happened. Basic error handling is what lets a
program stay in control when something unexpected happens, rather than
failing unpredictably.

## Practical Example

Imagine a program processing a batch of records where one field is
supposed to contain a numeric amount, but one particular record has bad or
missing data in that field. Without a `monitor` block, converting that bad
data with `%DEC` would stop the entire batch job. With a `monitor` block, as
shown above, the program can instead catch that specific failure, default
the amount to 0, and continue processing the remaining records.

This is a simplified, illustrative example rather than a specific real
batch job, but it reflects a genuinely common, practical reason RPGLE
developers use basic error handling around operations that can fail.

## Common Confusions

**"Does monitor prevent every possible problem in my program?"**
No. `monitor` catches runtime errors in the specific operations placed
inside it, such as a failed conversion. It does not prevent logic mistakes
elsewhere in a program, or guarantee that recovering from an error always
produces the correct business outcome, only that the program does not stop
abruptly.

**"Can I have more than one on-error section?"**
Yes, in more advanced use, a `monitor` block can check for specific
different kinds of errors using separate `on-error` sections, each handling
a different situation. This lesson focuses on the simpler, single
`on-error` pattern shown above, which is enough for many everyday cases.

**"Should I wrap every single line of my program in a monitor block?"**
No. `monitor` is most valuable around specific operations that can
realistically fail, such as conversions or calculations working with
uncertain input, not as a blanket wrapper around an entire program's
logic.

## Quick Recap

- Some RPGLE operations, such as `%DEC` converting invalid character data,
  can fail with a runtime error while a program runs.
- A `monitor` block, ending with `endmon`, lets you catch a runtime error
  using an `on-error` section instead of the program stopping abruptly.
- Basic error handling lets a program recover gracefully, such as using a
  default value, rather than failing unpredictably.
- `monitor` is best used around specific operations that can realistically
  fail, not as a blanket wrapper around everything.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What kinds of RPGLE operations commonly need a monitor block around
  them?"
- "What happens if an error occurs outside of any monitor block in my
  program?"
