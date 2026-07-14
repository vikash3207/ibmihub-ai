# Common Display File Mistakes and Best Practices

## Learning Objective

By the end of this lesson, you will be able to recognize several common
beginner mistakes when working with display files, and explain a simple
best practice that helps avoid each one.

## Simple Explanation

Having covered display files' core building blocks across this lesson
group, record formats, fields, indicators, function keys, validation, and
error messages, this lesson steps back to look at a handful of common
mistakes beginners make, and the simple habits that help avoid them.

- **Forgetting to reset a conditioning indicator between screens.** As
  covered in the Display File Indicators Explained lesson, a conditioning
  indicator keeps whatever value the program last set it to. Forgetting to
  explicitly set it correctly before every relevant `exfmt` call can cause
  a message or field to unexpectedly stay visible, or hidden, from a
  previous screen.
- **Reusing the same indicator number for unrelated purposes.** Using one
  indicator both as a response indicator for a function key and as a
  conditioning indicator for something unrelated makes a screen's behavior
  much harder to follow, as touched on in the Display File Indicators
  Explained lesson.
- **Checking function keys after business logic instead of before.** As
  covered in the Basic Inquiry Screen Pattern lesson, checking whether the
  user pressed an exit or cancel key first avoids wasting effort validating
  or processing an entry the user never intended to submit.
- **Relying only on basic DDS validation for business rules.** Keywords
  like `CHECK(MF)` catch simple, self-contained mistakes, but do not
  replace the RPGLE program's own logic for validating something against
  actual business data, such as confirming a customer number exists.

## Why It Matters

These are not obscure, advanced concerns; they are exactly the kind of
small, practical habits that separate a display file program that behaves
predictably from one that produces confusing, inconsistent screens.
Building these habits early makes every other display file concept
covered in this lesson group noticeably more reliable in practice.

## Practical Example

Imagine two versions of the same inquiry screen. One reuses indicator 30
for both a function key response and an unrelated conditioning purpose,
never explicitly resets that conditioning indicator between screens, and
checks a customer's existence before checking whether the user pressed
F3. Its behavior becomes inconsistent and hard to predict as the program
grows.

The other version, following the practices covered throughout this lesson
group, uses distinct indicator numbers for each purpose, explicitly sets
conditioning indicators before every relevant `exfmt` call, and checks
function keys first. Its behavior stays clear and predictable, even as
more screens and conditions are added. This is a simplified, illustrative
comparison rather than a specific real program, but it reflects a very
common, practical difference between a fragile display file program and a
reliable one.

## Common Confusions

**"Are these mistakes only a problem for large, complex screens?"**
No. Even a simple screen with just one or two indicators benefits from
these habits, since problems like an unreset conditioning indicator can
cause confusing behavior regardless of how small the screen otherwise is.

**"Is reusing indicator numbers ever acceptable?"**
Technically indicators can be reused, since they are simply numbered
on/off values, but doing so for genuinely unrelated purposes on the same
screen is generally poor practice, since it makes the screen's behavior
much harder to follow later.

**"Do these best practices apply only to display files, or to RPGLE and
CLLE as well?"**
Several of these ideas, clear separation of purpose, checking simple
conditions before deeper logic, and not over-relying on one validation
layer, echo similar best practices already covered for RPGLE and CLLE
earlier in this path. Good habits like these tend to transfer across the
languages and file types you work with on IBM i.

## Quick Recap

- Forgetting to reset a conditioning indicator between screens can cause
  unexpected, inconsistent behavior; explicitly set it before every
  relevant `exfmt` call.
- Reusing the same indicator number for unrelated purposes makes a
  screen's behavior harder to follow; use distinct indicator numbers
  instead.
- Check function keys before business logic to avoid wasted effort on
  entries the user never intended to submit.
- Basic DDS validation catches simple mistakes but does not replace the
  RPGLE program's own logic for validating against real business data.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other common display file mistakes beyond the ones in
  this lesson?"
- "How can I keep track of which indicator numbers are already used for
  what purpose on a larger screen?"
