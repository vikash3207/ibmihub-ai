# What is a Display File in IBM i?

## Learning Objective

By the end of this lesson, you will understand what a display file is,
how it relates to the 5250 screens you already know about, and how it fits
alongside the physical and logical files you learned about earlier.

## Simple Explanation

In the 5250 Screen Basics lesson, you learned what a 5250 screen looks
like from the person using it: a command line, menu options, function
keys, input fields, and output fields. This lesson looks at where that
screen actually comes from: a **display file**.

A display file is an IBM i object, object type `*FILE`, the same broad
object type covered in the Common IBM i Object Types lesson, alongside
physical and logical files. Where a physical file describes and stores
business data, a display file describes the **layout and behavior of a
5250 screen**: what appears on the screen, where fields are positioned,
and how a user's input on that screen is handled.

Like physical and logical files, a display file is defined using **DDS**,
the same Data Description Specifications syntax you learned about in the
DDS and SQL: Two Ways to Define Db2 for i Data lesson, though a display
file's DDS describes screen layout and fields rather than stored business
data. Display files belong to a broader category IBM i calls
**workstation files**, device files meant to interact directly with a
person at a screen, as opposed to files that simply store or describe
business data.

An RPGLE program does not draw a 5250 screen directly. Instead, it works
with a display file, which handles showing the screen and collecting
whatever the user types, and hands that information back to the program to
act on.

## Why It Matters

Understanding that a 5250 screen comes from a display file object,
separate from the RPGLE program that uses it, explains an important
division of responsibility on IBM i: the display file defines what a
screen looks like and how it behaves, while the RPGLE program that calls
it focuses on business logic, deciding what to do with whatever the user
entered. This mirrors the same kind of separation you already saw between
CLLE and RPGLE, applied here to screens and programs instead.

## Practical Example

Imagine a customer inquiry screen, the kind described conceptually in the
5250 Screen Basics lesson. A display file object defines that screen: an
input field for a customer number, output fields for the customer's name
and balance, and function keys like F3 to exit. An RPGLE program uses that
display file to show the screen, reads whatever customer number the user
typed in, looks up the matching customer data, and passes it back to the
display file to show as output.

The display file itself does not know how to look up a customer; the
RPGLE program does not know how to draw a screen. Each relies on the other
to do its own part. This is a simplified, illustrative example rather than
a specific real screen, but it reflects the basic division of
responsibility between a display file and the program that uses it.

## Common Confusions

**"Is a display file the same thing as a physical file?"**
No. Both share the `*FILE` object type, but a physical file stores actual
business data in records and fields, as covered in earlier Db2 for i
lessons, while a display file describes a 5250 screen's layout and
behavior. Neither one stores the other's kind of information.

**"Does the RPGLE program draw the screen itself?"**
No. The display file object defines what the screen looks like and how it
behaves. The RPGLE program works with the display file, rather than
drawing screen elements directly itself.

**"Is 'workstation file' just another name for 'display file'?"**
Not exactly. Workstation file is the broader category of device files
meant for direct interaction with a person at a screen; display files are
the most common example of a workstation file covered in this lesson
group.

## Quick Recap

- A display file is an IBM i object, type `*FILE`, that defines a 5250
  screen's layout and behavior, defined using DDS.
- Display files belong to the broader category of workstation files,
  device files meant for direct interaction with a person at a screen.
- An RPGLE program works with a display file rather than drawing a screen
  directly itself.
- This division, display file for screen layout and behavior, RPGLE
  program for business logic, mirrors the same kind of separation you saw
  between CLLE and RPGLE.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "What are some other examples of workstation files besides display
  files?"
- "Can the same display file be used by more than one RPGLE program?"
