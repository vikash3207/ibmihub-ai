# Basic Display File DDS Keywords

## Learning Objective

By the end of this lesson, you will be able to recognize a few common DDS
keywords used to describe how a field looks and behaves on a 5250 screen,
beyond the field usage and function key concepts already covered.

## Simple Explanation

You have already learned several important DDS ideas for display files:
record formats, field usage, and function key indicators. Display file
DDS also supports additional keywords that describe smaller, specific
details about how a field looks or behaves on screen. A few especially
common ones include:

- **`TEXT`**, a description attached to a field or record format purely
  for documentation, helping someone reading the DDS later understand its
  purpose, similar in spirit to a comment.
- **`DSPATR`** (Display Attribute), which changes how a field visually
  appears, such as showing it in a different color, underlined, or
  highlighted, useful for drawing attention to important information or
  clearly marking a field as protected from input.
- **`COLOR`**, which sets a specific display color for a field, closely
  related to `DSPATR` and often used alongside it.

Every field and record format also has a **position**, stated as a
specific row and column on the 24-by-80 grid covered in the 5250 Screen
Design Basics lesson, determining exactly where that element appears on
the screen.

## Why It Matters

These keywords let a display file's DDS control not just what fields exist
and how they behave, input, output, or both, but also how they actually
look and where they sit on the screen. This level of control is part of
what makes thoughtful 5250 screen design possible, connecting directly to
the layout principles covered earlier in this lesson group.

## Practical Example

Imagine the customer inquiry screen from earlier lessons in this group.
The screen's title text might use `DSPATR` to appear highlighted, making
it stand out at the top of the screen. The customer balance output field
might use `COLOR` to display in a specific color if the balance is
important to notice quickly. Meanwhile, `TEXT` on the customer number
input field might simply document, for anyone reading the DDS later, that
this field expects a numeric customer identifier.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects common, practical ways these keywords are used
together in real display files.

## Common Confusions

**"Does TEXT affect what the user actually sees on the screen?"**
No. `TEXT` is documentation for whoever reads the DDS source later; it
does not change what appears on the 5250 screen itself.

**"Do I need to memorize every possible DSPATR or COLOR option to design a
basic screen?"**
No. Recognizing that these keywords exist, and roughly what they are for,
visual emphasis and color, is enough to read and understand basic display
file DDS. The full range of specific options is a more detailed, advanced
topic beyond this introductory lesson group.

**"Is a field's position the same thing as its usage?"**
No. Usage, covered in the Input Fields, Output Fields, and Both Fields
lesson, determines how a field behaves for input and output. Position
determines only where that field visually appears on the screen's row and
column grid. A field has both a usage and a position, independently of
each other.

## Quick Recap

- `TEXT` documents a field or record format for anyone reading the DDS
  later, without affecting what the user sees.
- `DSPATR` and `COLOR` control a field's visual appearance, such as
  highlighting or color.
- Every field and record format has a position, a specific row and
  column, on the 24-by-80 screen grid.
- These keywords add visual control on top of the field usage and
  function key concepts already covered in this lesson group.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some common DSPATR options besides highlighting and
  underlining?"
- "Can TEXT be used on a whole record format, not just a single field?"
