# DO Loops and Basic Iteration in RPGLE

## Learning Objective

By the end of this lesson, you will be able to read and write simple
`for`, `dow`, and `dou` loops in free-format RPGLE, and explain when each
one is a natural fit.

## Simple Explanation

Everything covered so far in this lesson group runs through a program's
logic once, from top to bottom. A **loop** lets a program repeat a block of
statements multiple times. Free-format RPGLE offers a few common ways to
loop:

- **`for`**, used when you know how many times you want to repeat
  something, or want to count through a range of values:

```rpgle
dcl-s i int(10);

for i = 1 to 5;
  dsply i;
endfor;
```

- **`dow`** (Do While), which repeats a block of statements as long as a
  condition remains true, checked before each repetition:

```rpgle
dcl-s remaining packed(5:0);

remaining = 3;
dow remaining > 0;
  dsply remaining;
  remaining = remaining - 1;
enddo;
```

- **`dou`** (Do Until), which repeats a block of statements until a
  condition becomes true, checked after each repetition, meaning the block
  always runs at least once:

```rpgle
dcl-s attempts packed(3:0);

attempts = 0;
dou attempts >= 3;
  attempts = attempts + 1;
  dsply attempts;
enddo;
```

`for` loops end with `endfor`; `dow` and `dou` loops both end with `enddo`.

## Why It Matters

Loops are how a program repeats work without writing out the same
statements over and over by hand. Practically any task involving "do this
for each of several items" or "keep doing this until some condition is
met" relies on a loop of some kind. Recognizing `for`, `dow`, and `dou`, and
knowing roughly when each one fits naturally, is a foundational skill for
writing or reading almost any real RPGLE program.

## Practical Example

Imagine a simple program that needs to display a countdown from 3 down to
1. Using `dow`, as shown above, the condition `remaining > 0` is checked
before each repetition, so the loop naturally stops once `remaining`
reaches 0, having displayed 3, 2, and then 1.

A `for` loop counting from 1 to 5, also shown above, instead runs a known,
fixed number of times, useful when you already know exactly how many
repetitions you want rather than depending on a changing condition. This is
a simplified, illustrative example rather than a specific real program, but
it reflects common, everyday uses of each loop style.

## Common Confusions

**"What is the real difference between dow and dou?"**
`dow` checks its condition before each repetition, so the loop's block may
never run at all if the condition starts out false. `dou` checks its
condition after each repetition, so the loop's block always runs at least
once, even if the condition would have been true from the very start.

**"When should I use for instead of dow or dou?"**
`for` is a natural fit when you already know how many times you want to
repeat something, or want to count through a range of values, as in the
countdown-style example. `dow` and `dou` are a better fit when the number
of repetitions depends on a condition that can change while the loop runs.

**"What happens if a dow loop's condition is never checked again inside the
loop?"**
If nothing inside the loop ever changes the condition being checked, a
`dow` or `dou` loop will keep repeating indefinitely. Making sure the
condition can actually become false, such as decreasing `remaining` inside
the loop in the example above, is an important, practical habit.

## Quick Recap

- `for` loops repeat a known number of times or count through a range,
  ending with `endfor`.
- `dow` (Do While) checks its condition before each repetition; `dou` (Do
  Until) checks its condition after each repetition, so its block always
  runs at least once. Both end with `enddo`.
- Loops let a program repeat work without writing out the same statements
  multiple times.
- Something inside a `dow` or `dou` loop must be able to change the
  condition, or the loop will repeat indefinitely.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "What happens if I write a dow loop whose condition never becomes
  false?"
- "Can I use for to count backwards instead of counting up?"
