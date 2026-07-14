# Logical Files Explained in Depth

## Learning Objective

By the end of this lesson, you will understand the main things a logical
file can do beyond simply reordering data, and how a logical file relates to
the keyed physical files covered in the previous lesson.

## Simple Explanation

In the Physical Files and Logical Files lesson, you learned that a logical
file is commonly used as an alternate view, or access path, over data that
already lives in a physical file, without storing a separate duplicate copy
of that data. This lesson goes deeper into what a logical file can actually
do.

A logical file is defined, using its own DDS source, based on one or more
existing physical files. Common things a logical file can do include:

- **Keyed ordering**: presenting the same underlying records in a different
  key order than the physical file itself uses, building directly on the
  keyed physical files concept from the previous lesson. For example, a
  physical file keyed by customer number could have a logical file over it
  keyed by order date instead.
- **Field selection**: presenting only a subset of the physical file's
  fields, rather than every field the physical file actually has, useful
  when a program only needs to see certain information.
- **Select/omit**: presenting only records that meet a certain condition,
  filtering out records a particular view does not need to see, rather than
  showing every record in the underlying physical file.

A logical file can also be built over more than one physical file at once,
joining related data together into a single view, though the details of
that kind of join logical file go beyond the scope of this introductory
lesson.

## Why It Matters

Understanding what logical files can actually do explains why they are such
a flexible, widely used tool on IBM i: rather than writing separate copies
of similar data for different purposes, or writing extra program logic to
filter and reorder every time, a well-designed logical file lets a program
simply read the specific view of the data it needs, already keyed, selected,
and shaped the way that program expects.

## Practical Example

Imagine the `CUSTMAST` physical file, keyed by customer number, used
throughout earlier lessons. A logical file built over it could present the
same customer records keyed by customer name instead, useful for a
directory-style lookup screen. A separate logical file could present only
customers located in a specific region, using select/omit, useful for a
regional reporting program that has no need to see every customer.

Both logical files work with the same underlying `CUSTMAST` data; they
simply shape, order, and filter it differently for different purposes. This
is a simplified, illustrative example rather than a specific real system,
but it reflects a very common, practical use of logical files.

## Common Confusions

**"Does a logical file need to show every field from its physical file?"**
No. A logical file can select just a subset of fields relevant to a
particular view, even though the underlying physical file may have many more
fields than that specific logical file exposes.

**"Does select/omit delete records from the physical file?"**
No. Select/omit only affects which records a particular logical file view
shows; the underlying physical file's actual records are completely
unaffected and remain exactly as they are.

**"Can a logical file be keyed differently from its underlying physical
file?"**
Yes. This is one of the most common reasons to create a logical file in the
first place: presenting the same data in a different, more useful key order
for a particular program or purpose, without changing the physical file's
own key.

## Quick Recap

- A logical file is defined over one or more existing physical files and
  does not store a separate duplicate copy of the underlying data.
- Logical files can reorder data using a different key, select only certain
  fields, and select/omit certain records from view.
- Select/omit and field selection only affect what a particular logical
  file view shows; the underlying physical file's actual records are
  unaffected.
- Logical files built over more than one physical file, joining related data
  together, exist but go beyond this introductory lesson.

## Try Asking the AI Tutor

Use the AI Tutor to ask follow-up questions about this lesson. For example,
try asking:

- "How does a logical file's key relate to the key of its underlying
  physical file?"
- "What is a join logical file, at a high level?"
