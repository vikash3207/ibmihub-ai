# Basic Inquiry Screen Pattern

## Learning Objective

By the end of this lesson, you will be able to describe the general,
reusable pattern behind most simple IBM i inquiry screens, now including
validation, error messages, and more than one function key, building on
the specific example covered earlier in this lesson group.

## Simple Explanation

The Simple Inquiry Screen Flow lesson walked through one specific,
simplified example: an entry screen, a results screen, and a loop
controlled by F3. Now that this lesson group has also covered field
validation, error messages, conditioning indicators, and multiple function
keys, it is worth stepping back and describing the **general pattern**
most basic inquiry screens actually follow, beyond that one specific
example.

A typical basic inquiry screen pattern looks roughly like this:

1. **Show an entry screen** with an input field, commonly using
   `CHECK(MF)` so it cannot be submitted blank, paired with an `ERRMSG` or
   `ERRMSGID` explaining what is required if it is.
2. **Check function keys first**, such as F3 to exit, before doing
   anything else, since the user may not have entered anything meaningful
   at all.
3. **Validate the entered value against business rules** the display file
   cannot check on its own, such as confirming a customer number actually
   exists, using a conditioning indicator to trigger an error message if it
   does not.
4. **Show a results screen** once a valid value has been processed
   successfully, commonly supporting F5 to refresh the results and F12 to
   return to the entry screen without exiting entirely.
5. **Loop back** to the entry screen, or exit entirely, based on whichever
   function key the user pressed from the results screen.

## Why It Matters

Recognizing this general pattern, rather than only the one specific
example walked through earlier, helps you see the same underlying shape
in many different real inquiry screens: a customer inquiry, an order
inquiry, an inventory inquiry, and so on, all commonly follow some version
of this same sequence, even though the specific fields and business rules
differ.

## Practical Example

Imagine applying this general pattern to an order inquiry screen instead
of a customer inquiry screen. The entry screen asks for an order number,
using `CHECK(MF)` and an `ERRMSG` if left blank. F3 exits before anything
else is checked. If an order number is entered but does not exist, a
conditioning indicator triggers an error message rather than showing a
results screen. If it does exist, the results screen appears, supporting
F5 to refresh and F12 to return to the entry screen.

This is a simplified, illustrative example rather than a specific real
application, but it reflects how the same general inquiry pattern applies
naturally to different kinds of data, not just the customer example used
earlier in this lesson group.

## Common Confusions

**"Is this a stricter set of rules I have to follow exactly?"**
No. This is a common, generally useful pattern, not a strict requirement.
Real screens can reasonably adapt or reorder these steps depending on
their specific needs; the value of recognizing the pattern is in
understanding the typical shape, not treating it as a fixed template.

**"Does every inquiry screen need window records or validation
keywords?"**
No. This pattern describes commonly useful pieces, but a very simple
inquiry screen might reasonably skip some of them, such as a window
record, if the screen does not need that kind of interaction.

**"How is this different from the Simple Inquiry Screen Flow lesson
earlier in this group?"**
That lesson walked through one specific, simplified working example.
This lesson steps back to describe the general, reusable pattern behind
screens like that one, now including validation, error messages, and
multiple function keys that the earlier, simpler example did not cover.

## Quick Recap

- A basic inquiry screen pattern commonly includes: an entry screen with
  basic validation and error messages, function keys checked before
  business logic, business-rule validation using conditioning indicators,
  a results screen, and looping based on function keys.
- This same general pattern applies to many different kinds of inquiry
  screens, not just one specific example.
- Real screens can reasonably adapt this pattern rather than following it
  as a strict, fixed template.
- Recognizing this pattern helps you see the shared shape behind many
  different real IBM i inquiry screens.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would this pattern change for a screen that lets a user update
  data instead of just looking it up?"
- "What is a realistic reason to check business-rule validation before
  function keys, instead of after?"
