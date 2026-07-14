# Displaying Error Messages on 5250 Screens

## Learning Objective

By the end of this lesson, you will understand how a display file shows an
error message tied to a specific field, connecting basic field validation
to what the user actually sees on screen.

## Simple Explanation

In the Screen Field Validation Basics lesson, you learned that a keyword
like `CHECK(MF)` can reject an invalid entry before the RPGLE program
regains control. This lesson looks at how the user actually finds out
something went wrong: through an **error message** displayed directly on
the screen.

DDS keywords such as **`ERRMSG`** and **`ERRMSGID`** attach an error
message to a field, shown when that field's entry is rejected, whether by
a basic validation keyword or by a conditioning indicator, covered in the
Display File Indicators Explained lesson, that the RPGLE program itself
turns on to signal a problem:

- **`ERRMSG`** displays a specific, literal message text written directly
  in the DDS.
- **`ERRMSGID`** displays a message retrieved from a message file by its
  message identifier, similar in spirit to the message concepts covered in
  the Sending and Receiving Messages in CLLE lesson, but shown directly on
  the screen next to the field rather than sent to a message queue.

When an error message is triggered, IBM i typically highlights the
problem field, shows the message near it or on the screen's message line,
and returns the user's cursor to that field so they can correct it,
without the RPGLE program needing to build any of this display behavior
itself.

## Why It Matters

Clear, immediate error messages are what make basic field validation
actually usable: rejecting an invalid entry without telling the user why
would be confusing and frustrating. Understanding how `ERRMSG` and
`ERRMSGID` connect validation failures to a message the user can actually
see and act on completes the practical picture of basic screen validation.

## Practical Example

Imagine the customer inquiry screen's customer number field, using
`CHECK(MF)` as covered in the previous lesson, paired with an `ERRMSG`
reading something like "Customer number is required." If a user presses
Enter with that field blank, the screen rejects the entry, highlights the
field, and shows that message, making it immediately clear what needs to
be fixed, without the RPGLE program writing any special logic to display
it.

This is a simplified, illustrative example rather than a specific real
screen, but it reflects a very common, practical way basic validation and
error messages work together on 5250 screens.

## Common Confusions

**"Does the RPGLE program need to write code to show the error
message?"**
No, not for messages tied directly to a basic validation keyword like
`CHECK(MF)`. The display file itself shows the associated `ERRMSG` or
`ERRMSGID` automatically when that specific validation fails.

**"Can an RPGLE program trigger an error message itself, not just basic
DDS validation?"**
Yes. An error message can also be conditioned by an indicator the RPGLE
program sets itself, as covered in the Display File Indicators Explained
lesson, letting the program signal a business-rule problem, such as a
customer number that does not actually exist, using the same error message
mechanism as basic field validation.

**"Is ERRMSGID the same message queue concept covered for CLLE?"**
Not exactly. `ERRMSGID` retrieves a message from a message file by ID, a
similar general idea to the message concepts covered for CLLE, but it
displays that message directly on the 5250 screen next to a field, rather
than sending it to a job's message queue.

## Quick Recap

- `ERRMSG` shows a literal error message; `ERRMSGID` shows a message
  retrieved from a message file by ID, both tied to a specific field.
- Error messages can be triggered by basic DDS validation failures or by
  an indicator the RPGLE program sets itself.
- When triggered, IBM i highlights the problem field, shows the message,
  and returns the cursor to that field automatically.
- This mechanism connects basic field validation to something the user
  can actually see and act on.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How would I show an error message for a business rule the RPGLE
  program checks, rather than basic DDS validation?"
- "What is the difference between a message shown near a field and one
  shown on the screen's message line?"
