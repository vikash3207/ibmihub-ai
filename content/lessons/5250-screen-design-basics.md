# 5250 Screen Design Basics

## Learning Objective

By the end of this lesson, you will understand the basic layout a 5250
screen is built on, rows and columns, and a few simple principles for
designing a screen that is easy for a user to read and use.

## Simple Explanation

In the 5250 Screen Basics lesson, you learned what a 5250 screen looks
like from the perspective of someone using it. This lesson looks at the
same screen from the perspective of someone designing it, using the
display file concept covered in the What is a Display File in IBM i
lesson.

A traditional 5250 screen is laid out as a fixed grid of **rows and
columns**, commonly 24 rows by 80 columns. Every piece of text, every
input field, and every output field on the screen is positioned at a
specific row and column within that grid, defined as part of the display
file's DDS.

A few simple principles guide good 5250 screen design:

- **Group related information together**, such as keeping a customer's
  name, address, and balance near each other rather than scattered across
  the screen.
- **Use clear, short labels** next to fields, so a user immediately
  understands what a field is for without needing extra explanation.
- **Leave the screen uncluttered**, avoiding cramming in more fields or
  text than a user can comfortably read at once.
- **Keep function key options visible**, commonly listed near the bottom
  of the screen, so a user always knows what actions are available.

## Why It Matters

A well-designed 5250 screen makes a real difference for the person using
it every day: someone processing hundreds of customer inquiries in a
shift benefits enormously from a screen that is easy to read at a glance,
compared to one that is cluttered or inconsistently laid out. Screen
design is a real, practical skill, not just a cosmetic afterthought, since
5250 screens are often the main way business users interact with IBM i
applications.

## Practical Example

Imagine designing the customer inquiry screen introduced in the previous
lesson. Placing the customer number input field near the top, with the
customer's name and balance output fields grouped together just below it,
and a short list of available function keys along the bottom, makes the
screen immediately understandable: a user can see where to type the
customer number, where the result will appear, and what to do next,
without needing to be told separately.

This is a simplified, illustrative example rather than a specific real
screen design, but it reflects genuinely common, practical principles
behind well-designed 5250 screens.

## Common Confusions

**"Do I have full freedom to place fields anywhere on the screen?"**
Technically, yes, DDS lets you position text and fields at nearly any row
and column, but that flexibility is exactly why deliberate, thoughtful
layout matters. Just because a field can go anywhere does not mean every
placement is equally easy for a user to work with.

**"Is 24 rows by 80 columns still relevant with modern emulator
software?"**
Yes, for traditional 5250 screens. Even though people usually view 5250
screens through emulator software on modern monitors today, the
underlying grid a traditional display file is designed around remains 24
rows by 80 columns.

**"Does good screen design require special tools beyond DDS?"**
No, not for the fundamentals. Good 5250 screen design mainly comes from
thoughtful placement and grouping within ordinary DDS, the same
specification syntax used to define any display file, rather than
requiring separate specialized design tools.

## Quick Recap

- A traditional 5250 screen is laid out as a fixed grid, commonly 24 rows
  by 80 columns, with every element positioned at a specific row and
  column.
- Good screen design groups related information together, uses clear
  labels, avoids clutter, and keeps function key options visible.
- Screen design is a practical skill that meaningfully affects how easy an
  application is to use every day.
- The 24-by-80 grid remains the underlying layout for traditional display
  files, even when viewed through modern emulator software.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "Are there IBM i screens that use a different grid size than 24 rows by
  80 columns?"
- "What are some common mistakes beginners make when designing their
  first 5250 screen?"
