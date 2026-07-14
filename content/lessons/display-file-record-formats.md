# Display File Record Formats

## Learning Objective

By the end of this lesson, you will understand what a record format means
in the context of a display file, and how it differs from the single
record format a physical file has.

## Simple Explanation

In the Physical Files Explained in Depth lesson, you learned that a
physical file has exactly one record format, describing every field in its
records. A display file also uses **record formats**, but the idea works a
little differently here: a display file commonly has **more than one**
record format, and each one typically represents a distinct screen, or a
distinct section of a screen, rather than a single, consistent shape every
stored record follows.

For example, a single display file built for a customer inquiry
application might have:

- One record format for the initial screen where a user enters a customer
  number.
- A separate record format for the results screen showing that customer's
  name and balance.
- Possibly another record format for an error screen shown if the
  customer number was not found.

Each of these record formats is defined separately within the same display
file's DDS, and an RPGLE program chooses which record format to show at a
given moment, depending on what the program needs the user to see next.

## Why It Matters

Understanding that a display file can hold multiple record formats
explains how a single display file object can support an entire, multi-
screen interaction, an inquiry screen, a results screen, an error screen,
rather than needing a completely separate display file for every distinct
screen a user might see. This is a meaningful difference from physical
files, where "exactly one record format" was a firm rule.

## Practical Example

Imagine the customer inquiry screen flow described in earlier lessons in
this group. One display file could define an `INQFMT` record format for
the initial customer-number entry screen and a separate `RESULTFMT` record
format for the results screen showing that customer's details. The RPGLE
program driving this interaction shows `INQFMT` first, and, once it has
looked up the customer, shows `RESULTFMT` instead, both coming from the
same display file object.

This is a simplified, illustrative example rather than a specific real
application, but it reflects a very common, practical way display files
are organized to support a multi-screen interaction.

## Common Confusions

**"Does every display file need more than one record format?"**
No. A very simple display file might only need one record format, if it
only ever shows a single, unchanging screen. Multiple record formats
become useful once an interaction involves more than one distinct screen
or screen state.

**"Is this the same 'record format' idea covered for physical files?"**
It is the same general term, a named structure describing a set of
fields, but the details differ meaningfully: a physical file's single
record format describes stored data records, while a display file's
record formats each typically describe a distinct screen or screen
section, and a display file is not limited to only one.

**"Does having more than one record format mean the display file stores
more than one kind of data?"**
No. A display file does not store business data the way a physical file
does at all; its record formats describe screen layout and the fields
shown or entered on that screen, not stored records.

## Quick Recap

- A display file commonly has more than one record format, each typically
  representing a distinct screen or screen section.
- This differs from a physical file, which has exactly one record format
  describing its stored data records.
- An RPGLE program chooses which of a display file's record formats to
  show at a given moment.
- Multiple record formats let one display file object support a full,
  multi-screen interaction.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For
example, try asking:

- "How does an RPGLE program actually choose which record format to
  show?"
- "Can two different record formats in the same display file share some
  of the same fields?"
