# RPGLE Basic Interview Questions

## What This Lesson Prepares You For

This lesson works through common beginner-level RPGLE interview
questions: the kind that check whether you understand program structure,
variables, control flow, and built-in functions well enough to explain
them clearly, not just recognize them on a screen.

## Concepts to Revise First

- RPGLE program structure, from the RPGLE Program Structure lesson.
- Variables and data types, from the Variables and Data Types in RPGLE
  lesson.
- `IF`/`ELSE` and `SELECT`/`WHEN`/`OTHER`, from their respective lessons.
- `DO` loops and basic iteration, from the DO Loops and Basic Iteration in
  RPGLE lesson.
- Built-in functions, from the Built-in Functions in RPGLE lesson.

## Common Interview Questions

- "What does free-format RPGLE look like compared to older fixed-format
  RPG?"
- "What is the difference between `dcl-s` and a data structure field?"
- "When would you use `SELECT`/`WHEN` instead of a chain of `IF`/`ELSEIF`
  statements?"
- "What does `*INLR = *ON;` actually do?"
- "What is a built-in function, and can you name one you have used?"

## Good Beginner-Level Answers

For "what does `*INLR = *ON;` do?", a strong beginner answer is: "Setting
`*INLR` on tells the system this program is done and its resources, like
open files, should be closed when the program ends. Without it, the
program can leave things in a state that causes problems the next time it
is called." This shows you understand the purpose, not just that the line
exists.

For "when would you use `SELECT`/`WHEN` instead of `IF`/`ELSEIF`?", a good
answer is: "When I am checking the same variable against several possible
values, `SELECT`/`WHEN` reads more clearly than a long chain of
`ELSEIF`s checking the same thing over and over."

## Scenario-Based Questions

- "You have a `dcl-s` packed field meant to hold a dollar amount, but a
  calculation is producing a value that looks truncated. What would you
  check first?"
- "A `DOW` loop that is supposed to process records until end-of-file
  never stops. What is the most common reason for that?"
- "You are asked to replace a long `IF`/`ELSEIF` chain that all checks
  one status code field. What would you change it to, and why?"

## How to Explain Your Thinking

For the packed-field truncation scenario, a good structure for your
answer is: name the likely cause first, then explain why. For example:
"The most likely cause is the field's defined decimal precision, packed
(9:2) for example, being too small for the actual result, so I'd check
the field's declared length and decimal positions before assuming the
calculation logic itself is wrong." This shows you check the data
definition before assuming the logic is broken, a genuinely useful habit
in real RPGLE work.

## Common Weak Answers to Avoid

- Saying "I'd just look at the code" without naming what specifically you
  would look for first.
- Describing `SELECT`/`WHEN` and `IF`/`ELSEIF` as "basically the same
  thing" without explaining when one reads more clearly than the other.
- Forgetting that an infinite `DOW` loop is usually caused by the
  variable being checked never actually changing inside the loop, not by
  the loop syntax itself.

## Practical Examples

```rpgle
dcl-s custStatus char(1);

select;
  when custStatus = 'A';
    // active customer handling
  when custStatus = 'H';
    // on-hold customer handling
  when custStatus = 'C';
    // closed customer handling
  other;
    // unexpected status value
endsl;
```

This is exactly the kind of small snippet worth being able to explain out
loud: `SELECT`/`WHEN` here reads more clearly than three separate `IF`
statements all checking `custStatus`, and the `OTHER` branch handles any
status value that was not explicitly expected, rather than silently doing
nothing.

## Mini Practice Task

Write a short `DOW` loop, on paper or in a text editor, that reads
through a list of five hard-coded status codes stored in an array and
counts how many are `'A'`. Then explain out loud, as if to an
interviewer, why the loop eventually stops.

## Quick Recap

- Beginner RPGLE interview questions usually test whether you understand
  program structure and control flow, not just whether you recognize
  syntax.
- Explaining why a piece of code works, not just what it does, is what
  separates a strong answer from a memorized one.
- The most common weak answer is skipping the "why" and only restating
  the "what."

## Try Asking the AI Tutor

Use the AI Tutor to practice these questions out loud. For example, try
asking:

- "Can you ask me a few beginner RPGLE interview questions about
  SELECT/WHEN and DO loops, one at a time?"
- "How would I explain the difference between dcl-s and a data structure
  field in an interview?"
