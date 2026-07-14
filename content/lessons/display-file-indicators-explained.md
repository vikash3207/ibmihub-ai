# Display File Indicators Explained

## Learning Objective

By the end of this lesson, you will understand the two directions a
display file indicator can flow, into the screen as a conditioning
indicator, or out of the screen as a response indicator, and why keeping
this distinction clear avoids one of the most common beginner confusions
with display files.

## Simple Explanation

In the Function Keys and Response Indicators lesson, you learned that
pressing a function key like F3 turns on an indicator such as `*IN03`,
which the RPGLE program checks after the screen is submitted. That is one
direction an indicator can flow: **out of** the screen, reporting
something back to the program. This lesson explains the other direction,
and why beginners often mix the two up.

- **Response indicators** flow **out of** the screen. The system turns
  one on, based on something like a function key press, and the RPGLE
  program checks it after `exfmt` or a read returns. This is the direction
  covered in the earlier lesson.
- **Conditioning indicators** flow **into** the screen. The RPGLE program
  sets one on or off itself, before showing the screen, and the display
  file's DDS uses that indicator to decide whether a specific field, line
  of text, or keyword actually takes effect. For example, a conditioning
  indicator might control whether an "Are you sure?" message even appears
  on a confirmation screen.

The confusion beginners run into is treating every indicator as if it
always works the same way, as something the system always sets and the
program always just reads. In reality, some indicators are set by the
program to control what appears, and others are set by the system to
report what happened, and telling these two directions apart is essential
to understanding what a given indicator on a display file is actually
doing.

Setting a conditioning indicator in free-format RPGLE uses the same
`*IN` naming style already familiar from checking response indicators,
just as an assignment instead of a condition:

```rpgle
if orderTotal > 1000;
  *in30 = *on;
else;
  *in30 = *off;
endif;

exfmt CONFIRMFMT;
```

Here, the program decides whether indicator 30 should be on or off based
on `orderTotal`, before `exfmt` shows the screen. The display file's DDS,
not shown here since this lesson group describes DDS in prose rather than
column-based source, would condition the "Manager Approval Required" line
on that same indicator 30, so it only appears when the program has turned
it on.

## Why It Matters

Getting this direction backwards is a common, genuine source of confusion:
a beginner might expect an indicator they set in their program to
automatically reflect a function key press, or expect a response indicator
to control what the screen looks like before it is shown. Neither is true.
Keeping conditioning indicators and response indicators clearly separate
in your mental model makes display file behavior predictable instead of
mysterious.

## Practical Example

Imagine a screen that only shows a "Manager Approval Required" message
when an order total is over a certain amount. The RPGLE program checks the
order total before calling `exfmt`, and sets a conditioning indicator on
or off accordingly; the DDS is written so that message line only appears
when that indicator is on. This is a conditioning indicator: set by the
program, read by the display file, before the screen appears.

Separately, on that same screen, pressing F12 to cancel turns on a
response indicator, such as `*IN12`, which the program checks after
`exfmt` returns to know the user chose to cancel. This is a response
indicator: set by the system, read by the program, after the screen is
submitted. This is a simplified, illustrative example rather than a
specific real screen, but it reflects a very common, practical use of both
indicator directions on the same screen.

## Common Confusions

**"Are conditioning indicators and response indicators actually different
DDS features?"**
They use the same underlying idea, a numbered indicator, but how they are
used is different: a conditioning indicator is referenced next to a field
or keyword to control whether it takes effect, while a response indicator
is associated with a function key using keywords like `CF03`, as covered
in the earlier lesson.

**"Can the same indicator number be used as both a conditioning indicator
and a response indicator on the same screen?"**
Technically an indicator is just a numbered on/off value, so reusing a
number for both purposes is possible, but it is generally poor practice,
since it makes a screen's behavior much harder to follow. Using distinct
indicator numbers for conditioning versus response purposes keeps a
screen's DDS easier to understand.

**"Does the RPGLE program need to reset a conditioning indicator before
every exfmt call?"**
Generally, yes, if its value should depend on current conditions. Since a
conditioning indicator's value is whatever the program last set it to, the
program needs to explicitly set it correctly before each screen where its
value matters, rather than assuming it will reset on its own.

## Quick Recap

- Response indicators flow out of the screen: the system sets one, and
  the program checks it afterward, as covered for function keys in the
  earlier lesson.
- Conditioning indicators flow into the screen: the program sets one
  before showing the screen, and the DDS uses it to control whether a
  field, line, or keyword takes effect.
- Mixing up these two directions is one of the most common sources of
  confusion for beginners working with display files.
- Using distinct indicator numbers for conditioning versus response
  purposes keeps a screen's behavior easier to follow.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does an RPGLE program actually turn a conditioning indicator on or
  off before exfmt?"
- "What are some other practical uses of conditioning indicators besides
  showing or hiding a message?"
